import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { DashboardResponse } from '../types';
import { useAuth } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { Target, CheckSquare, BrainCircuit, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<DashboardResponse>('/dashboard')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-white tracking-tight"
        >
          Good evening, {user?.name || 'User'}.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-textMuted mt-2 text-lg"
        >
          Let's turn today's priorities into progress.
        </motion.p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-6 flex flex-col relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-primary/20 rounded-xl text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)] group-hover:shadow-[0_0_25px_rgba(var(--color-primary),0.6)] transition-shadow duration-300">
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium relative z-10">Total Goals</h3>
          <p className="text-4xl font-bold text-white mt-2 relative z-10">{data?.totalGoals || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-6 flex flex-col relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-accent/20 rounded-xl text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.3)] group-hover:shadow-[0_0_25px_rgba(var(--color-accent),0.6)] transition-shadow duration-300">
              <CheckSquare size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium relative z-10">Completed Tasks</h3>
          <p className="text-4xl font-bold text-white mt-2 relative z-10">{data?.completedTasks || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-6 flex flex-col relative overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] group-hover:shadow-[0_0_25px_rgba(var(--color-secondary),0.6)] transition-shadow duration-300">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium relative z-10">Pending Tasks</h3>
          <p className="text-4xl font-bold text-white mt-2 relative z-10">{data?.pendingTasks || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }} className="glass-panel p-6 flex flex-col relative overflow-hidden group cursor-pointer border border-orange-500/20 hover:border-orange-500/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-shadow duration-300">
              <BrainCircuit size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium relative z-10">Overall Progress</h3>
          <p className="text-4xl font-bold text-white mt-2 relative z-10">{data?.overallProgress || 0}%</p>
          <div 
            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
            style={{ width: `${data?.overallProgress || 0}%` }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -2 }}
          className="lg:col-span-2 glass-panel p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 group-hover:bg-primary/20 transition-colors duration-700" />
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <span className="bg-primary/20 p-2 rounded-lg text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
              <BrainCircuit size={24} />
            </span>
            <span>AI OS Insights</span>
          </h2>
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row gap-6 relative backdrop-blur-md hover:border-primary/30 transition-colors duration-300">
            <div className="absolute -left-px top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-primary to-transparent" />
            <div className="flex-1 space-y-4">
              <p className="text-lg text-white leading-relaxed font-light">
                "You've made strong progress on your current goals! With <span className="font-semibold text-primary">{data?.completedTasks || 0} tasks completed</span>, your highest-impact action today is tackling those <span className="font-semibold text-secondary">{data?.pendingTasks || 0} pending tasks</span>. Keep up the amazing momentum!"
              </p>
              <div className="pt-2">
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors border border-white/10 flex items-center space-x-2">
                  <Activity size={16} className="text-primary" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -2 }}
          className="glass-panel p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-[60px] -z-10" />
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          {data?.totalGoals === 0 && data?.totalTasks === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-8 text-center opacity-70">
              <Target size={40} className="text-textMuted mb-3 opacity-50" />
              <p className="text-textMuted text-sm">No activity yet. Start by creating a goal!</p>
            </div>
          ) : (
            <div className="space-y-5">
               {/* Mockup for activity */}
               <div className="flex items-start space-x-4">
                 <div className="mt-1 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(var(--color-accent),0.8)]" />
                 <div className="flex-1">
                   <p className="text-white text-sm font-medium">Progress updated</p>
                   <p className="text-textMuted text-xs mt-1">Just now</p>
                 </div>
               </div>
               <div className="flex items-start space-x-4 opacity-70">
                 <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary" />
                 <div className="flex-1">
                   <p className="text-white text-sm font-medium">Task Completed</p>
                   <p className="text-textMuted text-xs mt-1">2 hours ago</p>
                 </div>
               </div>
               <div className="flex items-start space-x-4 opacity-50">
                 <div className="mt-1 w-2.5 h-2.5 rounded-full bg-secondary" />
                 <div className="flex-1">
                   <p className="text-white text-sm font-medium">Goal Created</p>
                   <p className="text-textMuted text-xs mt-1">Yesterday</p>
                 </div>
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
