import { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Goal, Task } from '../types';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
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
    
    fetchTasks();
  }, []);

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
        <button className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors">
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
