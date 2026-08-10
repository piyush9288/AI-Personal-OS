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
        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <Target size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Total Goals</h3>
          <p className="text-3xl font-bold text-white mt-1">{data?.totalGoals || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-accent/20 rounded-xl text-accent">
              <CheckSquare size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Completed Tasks</h3>
          <p className="text-3xl font-bold text-white mt-1">{data?.completedTasks || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
              <Activity size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium">Pending Tasks</h3>
          <p className="text-3xl font-bold text-white mt-1">{data?.pendingTasks || 0}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
              <BrainCircuit size={24} />
            </div>
          </div>
          <h3 className="text-textMuted text-sm font-medium relative z-10">Overall Progress</h3>
          <p className="text-3xl font-bold text-white mt-1 relative z-10">{data?.overallProgress || 0}%</p>
          <div 
            className="absolute bottom-0 left-0 h-1 bg-orange-400 transition-all duration-1000 ease-out" 
            style={{ width: `${data?.overallProgress || 0}%` }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">AI Insights</h2>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex space-x-4">
            <BrainCircuit className="text-primary flex-shrink-0" />
            <p className="text-textMain leading-relaxed">
              "You've made strong progress on your current goals. Your highest-impact action today is completing your pending tasks. Keep up the momentum!"
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
          {data?.totalGoals === 0 && data?.totalTasks === 0 ? (
            <div className="text-center py-8 text-textMuted text-sm">
              No activity yet. Start by creating a goal!
            </div>
          ) : (
            <div className="space-y-4">
               {/* Mockup for activity */}
               <div className="flex items-center space-x-3 text-sm">
                 <div className="w-2 h-2 rounded-full bg-accent" />
                 <span className="text-white flex-1">Progress updated</span>
                 <span className="text-textMuted">Just now</span>
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
