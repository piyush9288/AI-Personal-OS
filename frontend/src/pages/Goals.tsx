import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Goal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trash2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = () => {
    setLoading(true);
    fetchApi<Goal[]>('/goals')
      .then((data) => setGoals(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this goal? All its tasks will also be deleted.")) return;
    
    try {
      await fetchApi(`/goals/${id}`, { method: 'DELETE' });
      fetchGoals();
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      await fetchApi('/goals', {
        method: 'POST',
        body: JSON.stringify({ title: newTitle, description: newDesc })
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchGoals();
    } catch (err) {
      console.error("Failed to create goal", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && goals.length === 0) {
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
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/app/ai')}
            className="px-6 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Ask AI
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Create Manually
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-panel p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Create New Goal</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                    placeholder="e.g., Learn Java"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white h-24 resize-none"
                    placeholder="Optional description"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newTitle.trim()}
                  className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Save Goal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel p-6 flex flex-col relative overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-primary/20 rounded-xl text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)] group-hover:shadow-[0_0_25px_rgba(var(--color-primary),0.6)] transition-shadow duration-300">
                  <Target size={24} />
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    goal.status === 'IN_PROGRESS' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{goal.title}</h3>
              <p className="text-textMuted text-sm mb-6 flex-grow">{goal.description}</p>
              
              <div className="space-y-2 mt-auto relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-textMuted">Progress</span>
                  <span className="text-white font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 relative ${
                      goal.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_10px_rgba(74,222,128,0.8)]' :
                      'bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(var(--color-primary),0.8)]'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripes_1s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
