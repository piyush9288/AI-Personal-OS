import { BrainCircuit, Send } from 'lucide-react';


export default function AICommandCenter() {
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <header className="mb-6 flex items-center space-x-3">
        <div className="p-2 bg-primary/20 text-primary rounded-lg">
          <BrainCircuit size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Command Center</h1>
          <p className="text-sm text-textMuted">Your intelligent assistant is ready.</p>
        </div>
      </header>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-start">
            <div className="bg-surface border border-white/5 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg">
              <p className="text-textMain text-sm">Hello! I am your AI-OS assistant. Ask me to plan your day, summarize your goals, or manage your tasks.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-surface/50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask AI-OS to plan your day..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
