import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, User } from 'lucide-react';
import { fetchApi } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'ai' | 'user';
  content: string;
}

export default function AICommandCenter() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am your AI-OS assistant. Ask me to plan your day, summarize your goals, or manage your tasks.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchApi<any[]>('/ai/chat');
        if (history && history.length > 0) {
          const formattedHistory = history.map(chat => ({
            role: chat.role.toLowerCase() as 'ai' | 'user',
            content: chat.message
          }));
          setMessages(formattedHistory);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // The backend /ai/chat endpoint returns a string response
      const response = await fetchApi<string>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: userMessage })
      });
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error: Could not reach the AI. ' + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative border border-white/5">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  flex items-start max-w-[80%] space-x-3 
                  ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}
                `}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <BrainCircuit size={18} />}
                  </div>
                  <div className={`
                    p-4 rounded-2xl text-sm leading-relaxed shadow-lg
                    ${msg.role === 'user' ? 'bg-secondary text-white rounded-tr-sm' : 'bg-surface border border-white/5 text-textMain rounded-tl-sm'}
                  `}>
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>{line}<br/></span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex items-start max-w-[80%] space-x-3 flex-row">
                  <div className="p-2 rounded-lg flex-shrink-0 bg-primary/20 text-primary">
                    <BrainCircuit size={18} className="animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-surface border border-white/5 text-textMuted rounded-tl-sm text-sm">
                    <span className="flex space-x-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                    </span>
                  </div>
                </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 bg-surface/50">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask AI-OS to plan your day..."
              disabled={isLoading}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
