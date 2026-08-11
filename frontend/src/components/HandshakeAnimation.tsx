import { motion } from 'framer-motion';

export default function HandshakeAnimation() {
  return (
    <div className="relative w-full max-w-md h-64 mx-auto flex items-center justify-center overflow-visible">
      {/* Center Glow */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.5, 1], opacity: [0, 0.8, 0] }}
        transition={{ delay: 0.8, duration: 1.5 }}
        className="absolute w-48 h-48 bg-primary/50 rounded-full blur-[60px]"
      />

      {/* Shaking Container */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -15, 15, -10, 0] }}
        transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        
        {/* Human Arm (Left) */}
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 15, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="absolute right-1/2 flex items-center justify-end z-20"
        >
          {/* Sleeve */}
          <div className="w-32 h-14 bg-gray-800 rounded-l-2xl border-y border-l border-white/10 relative shadow-lg">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-16 bg-gray-200 rounded-lg shadow-md z-10" />
          </div>
          {/* Hand */}
          <div className="w-16 h-10 bg-[#eebb99] rounded-r-3xl relative -ml-2 z-0 shadow-inner">
             {/* Thumb */}
             <div className="absolute -top-3 right-4 w-10 h-5 bg-[#eebb99] rounded-full rotate-12 shadow-sm" />
          </div>
        </motion.div>

        {/* Robot Arm (Right) */}
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: -15, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="absolute left-1/2 flex items-center justify-start z-10"
        >
          {/* Hand */}
          <div className="w-16 h-10 bg-gray-300 rounded-l-3xl relative -mr-2 z-0 border border-white/40 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-400 rounded-l-3xl" />
             {/* Thumb */}
             <div className="absolute -top-3 left-4 w-10 h-5 bg-gray-400 rounded-full -rotate-12 border border-gray-500 shadow-sm z-20" />
          </div>
          {/* Sleeve */}
          <div className="w-32 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-r-2xl border-y border-r border-white/20 relative flex items-center justify-center shadow-lg">
             {/* Glowing lines */}
             <div className="w-full h-[2px] bg-primary/60 absolute top-2 shadow-[0_0_8px_rgba(var(--color-primary),1)]" />
             <div className="w-full h-[2px] bg-accent/60 absolute bottom-2 shadow-[0_0_8px_rgba(var(--color-accent),1)]" />
             {/* Cuff */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-14 bg-primary rounded-lg shadow-[0_0_15px_rgba(var(--color-primary),0.8)] z-10" />
          </div>
        </motion.div>
        
        {/* Connection Spark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute z-30 w-12 h-12 bg-white rounded-full blur-md"
        />
      </motion.div>
    </div>
  );
}
