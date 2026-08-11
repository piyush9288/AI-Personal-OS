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
            className="w-64 h-full glass-panel flex flex-col p-6 m-4 absolute md:relative z-40"
          >
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(109,40,217,0.5)]">
                AI
              </div>
              <h1 className="text-xl font-semibold tracking-wide text-white">AI-OS</h1>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                      isActive 
                        ? 'text-white bg-white/10 border border-white/10' 
                        : 'text-textMuted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <NavLink 
                to="/app/profile"
                className={({ isActive }) => 
                  `flex items-center space-x-3 mb-4 p-2 -mx-2 rounded-xl transition-all cursor-pointer ${
                    isActive ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                  }`
                }
              >
                {user?.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-secondary" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary font-bold uppercase shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-textMuted truncate">{user?.email}</p>
                </div>
              </NavLink>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto p-6 pt-20 md:p-10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <Outlet />
      </div>
    </div>
  );
}
