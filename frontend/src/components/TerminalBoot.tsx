import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const bootLines = [
  "AI-OS KERNEL v2.0.4 INITIALIZING...",
  "MOUNTING SECURE NEURAL PATHWAYS... [OK]",
  "LOADING COGNITIVE MODULES... [OK]",
  "ESTABLISHING ENCRYPTED CONNECTION... [OK]",
  "SYNCING GLOBAL VARIABLES... [OK]",
  "ALL SYSTEMS FULLY OPERATIONAL.",
  "WAKING OS..."
];

export default function TerminalBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (currentLineIdx >= bootLines.length) {
      const timer = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(timer);
    }

    const currentLine = bootLines[currentLineIdx];
    
    if (charIdx < currentLine.length) {
      const timer = setTimeout(() => {
        setCharIdx(prev => prev + 1);
      }, Math.random() * 20 + 5); // very fast typing speed
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, currentLine]);
        setCurrentLineIdx(prev => prev + 1);
        setCharIdx(0);
      }, Math.random() * 150 + 50); // delay between lines
      return () => clearTimeout(timer);
    }
  }, [currentLineIdx, charIdx, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black font-mono p-6 sm:p-12 flex flex-col text-xs sm:text-sm md:text-base overflow-hidden">
      {/* CRT Scanline overlay for aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-10"
        style={{
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }} 
      />
      
      {/* Soft Green Glow */}
      <div className="absolute inset-0 bg-green-900/10 z-0 pointer-events-none" />

      <div className="relative z-20 flex flex-col space-y-1.5 text-green-500 max-w-3xl mx-auto w-full pt-10">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-3 opacity-60">root@ai-os:~#</span>
            <span className="text-green-400 text-shadow-glow">{line}</span>
          </div>
        ))}
        
        {currentLineIdx < bootLines.length && (
          <div className="flex">
            <span className="mr-3 opacity-60">root@ai-os:~#</span>
            <span className="text-green-400 text-shadow-glow">
              {bootLines[currentLineIdx].substring(0, charIdx)}
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2.5 h-4 bg-green-500 align-middle ml-1 shadow-[0_0_8px_rgba(0,255,0,0.8)]"
              />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
