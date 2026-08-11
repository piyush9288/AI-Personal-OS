import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, CheckSquare, BrainCircuit, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Goals', path: '/app/goals', icon: Target },
    { name: 'Tasks', path: '/app/tasks', icon: CheckSquare },
    { name: 'AI Command', path: '/app/ai', icon: BrainCircuit },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-surface rounded-full border border-white/10 text-white">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 h-full bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col p-6 absolute md:relative z-40 shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(var(--color-primary),0.5)]">
                AI
              </div>
              <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">AI-OS</h1>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'text-white shadow-[0_0_15px_rgba(var(--color-primary),0.2)]' 
                        : 'text-textMuted hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl -z-10"
                        />
                      )}
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.4)]' : 'bg-white/5 group-hover:bg-white/10'}`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-medium tracking-wide">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <NavLink 
                to="/app/profile"
                className={({ isActive }) => 
                  `flex items-center space-x-4 mb-4 p-3 rounded-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    isActive ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20' : 'bg-black/20 hover:bg-white/5 border border-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent -z-10" />
                    )}
                    {user?.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt="Profile" className={`w-11 h-11 rounded-full object-cover border-2 transition-all ${isActive ? 'border-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]' : 'border-white/10 group-hover:border-primary/50'}`} />
                    ) : (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold uppercase shrink-0 transition-all border-2 ${isActive ? 'bg-primary/20 text-primary border-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]' : 'bg-white/5 text-textMuted border-white/10 group-hover:border-primary/50 group-hover:text-primary'}`}>
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden flex-1">
                      <p className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{user?.name}</p>
                      <p className="text-[11px] text-textMuted truncate font-medium">
                        {user?.id === 1 ? 'OS Admin' : 'OS Operator'}
                      </p>
                    </div>
                  </>
                )}
              </NavLink>
              
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-black/20 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 font-bold tracking-wide group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Disconnect</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto p-6 pt-20 md:p-10 relative bg-background">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="relative z-10 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
