import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingCore from '../three/FloatingCore';
import { useAuth } from '../store/AuthContext';
import { fetchApi } from '../api/client';

export default function Landing() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const response = await fetchApi<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (isLogin) {
        login(response.token, response.user);
        navigate('/app');
      } else {
        // After register, show success message and switch to login
        setIsLogin(true);
        setError('');
        alert('Registration successful! Please check your email to verify your account before logging in.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary mb-4 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>AI-OS Version 1.0</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Your Life. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Organized by Intelligence.
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-textMuted max-w-xl mx-auto lg:mx-0">
            AI-OS turns your goals, tasks, ideas and priorities into one intelligent personal command center.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => setShowAuth(true)}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)]"
            >
              Enter Your OS
            </button>
            <button 
              onClick={() => {}}
              className="px-8 py-4 rounded-xl bg-surface border border-white/10 hover:bg-white/5 text-white font-semibold transition-all"
            >
              Explore Features
            </button>
          </div>
        </motion.div>

        {/* 3D Visual */}
        <div className="flex items-center justify-center lg:justify-end">
          <FloatingCore />
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel p-8 w-full max-w-md relative"
            >
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-textMuted hover:text-white"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">
                {isLogin ? 'Welcome Back' : 'Initialize OS'}
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-textMuted">
                {isLogin ? "Don't have an account? " : "Already initialized? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
