import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

export const Stats = () => {
  const { language, hero } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? (en || '') : (bn || '');

  return (
    <section className="py-12 lg:py-20 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-24">
          {(hero?.stats || []).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-3xl lg:text-7xl font-black mb-2 lg:mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-text-muted/50 group-hover:from-primary group-hover:to-primary-light transition-all duration-500 leading-none">
                {t(stat.valueEn, stat.valueBn)}
              </div>
              <div className="text-[9px] lg:text-sm font-black text-text-muted uppercase tracking-[2px] lg:tracking-[4px]">
                {t(stat.labelEn, stat.labelBn)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};
