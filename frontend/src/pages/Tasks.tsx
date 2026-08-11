import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Goal, Task, TaskStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Clock, Trash2, PlayCircle, CheckCircle2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedGoals = await fetchApi<Goal[]>('/goals');
      if (!fetchedGoals || fetchedGoals.length === 0) {
        setGoals([]);
        setTasks([]);
        return;
      }
      setGoals(fetchedGoals);
      
      let allTasks: Task[] = [];
      for (const goal of fetchedGoals) {
        const goalTasks = await fetchApi<Task[]>(`/goals/${goal.id}/tasks`);
        if (goalTasks) {
          allTasks = [...allTasks, ...goalTasks];
        }
      }
      setTasks(allTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetchApi(`/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      const newStatus: TaskStatus = task.status === 'COMPLETED' ? 'NOT_STARTED' : 
                                    task.status === 'NOT_STARTED' ? 'IN_PROGRESS' : 'COMPLETED';
      
      await fetchApi(`/tasks/${task.id}`, { 
        method: 'PUT',
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          status: newStatus
        })
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || selectedGoalId === '') return;
    setSubmitting(true);
    try {
      await fetchApi(`/goals/${selectedGoalId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title: newTitle, description: newDesc, priority: 'MEDIUM' })
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      setSelectedGoalId('');
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/app/ai')}
            className="px-6 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Ask AI
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
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
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              {goals.length === 0 ? (
                <div className="text-center py-6 text-gray-300">
                  <p className="mb-4">You need to create a goal first before creating tasks.</p>
                  <button 
                    onClick={() => navigate('/app/goals')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Go to Goals
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Select Goal</label>
                    <select
                      value={selectedGoalId}
                      onChange={e => setSelectedGoalId(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white [&>option]:bg-gray-800"
                      required
                    >
                      <option value="" disabled>-- Select a Goal --</option>
                      {goals.map(g => (
                        <option key={g.id} value={g.id}>{g.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white"
                      placeholder="e.g., Read chapter 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-accent text-white h-24 resize-none"
                      placeholder="Optional details"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !newTitle.trim() || selectedGoalId === ''}
                    className="w-full py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Save Task'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {tasks.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Your task list is clear.</h2>
          <p className="text-textMuted mb-6 max-w-sm">Break down your goals into actionable tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent/20 rounded-xl text-accent">
                  <CheckSquare size={24} />
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                    task.priority === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    task.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    task.status === 'IN_PROGRESS' ? 'bg-accent/20 text-accent' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  
                  <button 
                    onClick={() => toggleStatus(task)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    title="Change Status"
                  >
                    {task.status === 'COMPLETED' ? <Clock size={16} /> : 
                     task.status === 'IN_PROGRESS' ? <CheckCircle2 size={16} className="text-green-400" /> : 
                     <PlayCircle size={16} className="text-accent" />}
                  </button>

                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-textMuted text-sm mb-4 flex-grow">{task.description}</p>
              )}
              
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-textMuted">
                <Clock size={16} className="text-primary" />
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
