import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, User, Paperclip, X } from 'lucide-react';
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
  const [selectedFiles, setSelectedFiles] = useState<{file: File, base64: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      const processedFiles = await Promise.all(newFiles.map(async (file) => {
        return new Promise<{file: File, base64: string}>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({ file, base64: base64String });
          };
          reader.readAsDataURL(file);
        });
      }));

      setSelectedFiles(prev => [...prev, ...processedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    const userMessage = input.trim() || 'Analyze these files';
    
    // Create a local copy to immediately show in UI and clear state
    const currentFiles = [...selectedFiles];
    
    let displayContent = userMessage;
    if (currentFiles.length > 0) {
      displayContent += `\n[Attached ${currentFiles.length} file(s)]`;
    }

    setInput('');
    setSelectedFiles([]);
    setMessages(prev => [...prev, { role: 'user', content: displayContent }]);
    setIsLoading(true);

    try {
      const payload: any = { prompt: userMessage };
      if (currentFiles.length > 0) {
        payload.files = currentFiles.map(f => ({
          mimeType: f.file.type,
          base64Data: f.base64
        }));
      }

      const response = await fetchApi<string>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(payload)
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

        <div className="p-4 border-t border-white/10 bg-surface/50 flex flex-col space-y-2">
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs text-white">
                  <span className="truncate max-w-[150px]">{f.file.name}</span>
                  <button onClick={() => removeFile(i)} className="hover:text-red-400"><X size={12}/></button>
                </div>
              ))}
            </div>
          )}
          <div className="relative flex items-center">
            <input 
              type="file" 
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-textMuted hover:text-white transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask AI-OS to plan your day or analyze a file..."
              disabled={isLoading}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
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
