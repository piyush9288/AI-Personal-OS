import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Goal, Task, TaskStatus } from '../types';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, Trash2, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const goals = await fetchApi<Goal[]>('/goals');
      if (!goals || goals.length === 0) {
        setTasks([]);
        return;
      }
      
      let allTasks: Task[] = [];
      for (const goal of goals) {
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

  if (loading) {
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
        <button 
          onClick={() => navigate('/app/ai')}
          className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Create Task
        </button>
      </div>

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
