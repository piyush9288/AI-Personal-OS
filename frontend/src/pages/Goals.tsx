import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Goal } from '../types';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi<Goal[]>('/goals')
      .then((data) => setGoals(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Goals</h1>
        <button 
          onClick={() => navigate('/app/ai')}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No goals yet.</h2>
          <p className="text-textMuted mb-6 max-w-sm">Set your first objective and let AI-OS help you track and achieve it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/20 rounded-xl text-primary">
                  <Target size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  goal.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                  goal.status === 'IN_PROGRESS' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {goal.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{goal.title}</h3>
              <p className="text-textMuted text-sm mb-6 flex-grow">{goal.description}</p>
              
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Progress</span>
                  <span className="text-white font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
