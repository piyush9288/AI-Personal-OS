import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import FloatingCore from '../three/FloatingCore';
import { useAuth } from '../store/AuthContext';
import { fetchApi } from '../api/client';
import { Brain, Target, CheckSquare, Zap, ChevronRight, Sparkles, Shield, Rocket } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
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
        setIsLogin(true);
        setError('Registration successful! You can now log in.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="text-primary w-8 h-8" />,
      title: "Smart AI Brain",
      desc: "Talk to your OS naturally in English or Hindi. It understands your intent and executes tasks automatically."
    },
    {
      icon: <Target className="text-accent w-8 h-8" />,
      title: "Goal Orchestration",
      desc: "Define a goal and let AI auto-generate a comprehensive step-by-step task list to help you achieve it."
    },
    {
      icon: <CheckSquare className="text-green-400 w-8 h-8" />,
      title: "Smart Task Management",
      desc: "Say 'Mark my first 3 tasks as done' and watch the AI intelligently update your progress in real-time."
    },
    {
      icon: <Sparkles className="text-yellow-400 w-8 h-8" />,
      title: "Interactive Tutor",
      desc: "Stuck on a task? Ask the AI for help. It acts as a personal tutor to guide you through complex problems."
    }
  ];

  const steps = [
    { num: "01", title: "Initialize", desc: "Create your secure account and enter the AI-OS command center." },
    { num: "02", title: "Command", desc: "Tell the AI what you want to achieve using natural language." },
    { num: "03", title: "Execute", desc: "Watch as the AI generates tasks, tracks progress, and helps you succeed." }
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 overflow-x-hidden" ref={targetRef}>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">AI-OS</span>
          </div>
          <button 
            onClick={() => setShowAuth(true)}
            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-all"
          >
            Access Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section style={{ opacity, y }} className="relative min-h-screen flex items-center pt-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary mb-2 text-sm font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>AI-OS Version 2.0 • Smart Intent Engine</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              The First <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient">
                Agentic Personal OS.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-textMuted max-w-xl mx-auto lg:mx-0">
              Not just a task manager. A highly intelligent system that understands your voice, generates roadmaps, and helps you execute them perfectly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button 
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-[0_0_20px_rgba(var(--color-primary),0.4)] hover:shadow-[0_0_35px_rgba(var(--color-primary),0.6)] flex items-center gap-2 group"
              >
                Initialize System
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end h-[500px]"
          >
            <FloatingCore />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 relative z-10 bg-black/40 border-y border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">What makes it different?</h2>
            <p className="text-textMuted max-w-2xl mx-auto text-lg">AI-OS replaces manual data entry with conversational intelligence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-8 group border border-white/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-textMuted leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">How it works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative text-center"
              >
                <div className="text-7xl font-black text-white/5 mb-6">{step.num}</div>
                <h3 className="text-2xl font-bold mb-4 text-accent">{step.title}</h3>
                <p className="text-textMuted">{step.desc}</p>
                {idx !== steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-2/3 w-full h-[2px] bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <Rocket className="w-16 h-16 text-primary mx-auto mb-8 animate-bounce" />
          <h2 className="text-5xl font-bold text-white">Ready to upgrade your life?</h2>
          <p className="text-xl text-textMuted">Join the future of personal productivity today.</p>
          <button 
            onClick={() => setShowAuth(true)}
            className="px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Launch Command Center
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-background/50 text-center text-textMuted text-sm">
        <p>© 2026 AI Personal OS. Built with Intelligence.</p>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel p-8 w-full max-w-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
              
              <button 
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-textMuted hover:text-white bg-white/5 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
              
              <div className="mb-8 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Shield className="text-primary w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {isLogin ? 'Secure Access' : 'System Initialization'}
                </h2>
                <p className="text-textMuted text-sm mt-2">
                  {isLogin ? 'Authenticate to enter your OS' : 'Create your secure AI-OS identity'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Call Sign (Name)</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Commander"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Neural Link (Email)</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="user@network.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-1 ml-1">Encryption Key (Password)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold text-lg transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)]"
                >
                  {loading ? 'Authenticating...' : (isLogin ? 'Login to OS' : 'Initialize')}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-textMuted">
                {isLogin ? "No access key yet? " : "Already registered? "}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-primary hover:text-primary/80 font-bold tracking-wide"
                >
                  {isLogin ? 'Initialize Here' : 'Login Here'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
