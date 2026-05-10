import React from 'react';
import { motion } from 'motion/react';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#020617] flex items-center justify-center">
      <div className="relative">
        {/* Glowing Rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 -m-8 border-2 border-primary/20 rounded-[40px] blur-sm"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 -m-12 border border-secondary/10 rounded-[50px] blur-md"
        />

        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.5)] overflow-hidden"
        >
          <motion.span 
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-4xl font-black text-white"
          >
            V
          </motion.span>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
          
          {/* Shimmer Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-white/20 skew-x-[30deg]"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-black text-primary uppercase tracking-[5px] animate-pulse">Initializing Elite Vault</p>
        </motion.div>
      </div>
    </div>
  );
};

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 rounded-2xl overflow-hidden relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
  </div>
);
