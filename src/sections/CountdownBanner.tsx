"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Clock, Zap, Sparkles } from 'lucide-react';

export const CountdownBanner = ({ data }: { data: any }) => {
  const { language } = useStore();
  const countdown = data || { enabled: false };
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  useEffect(() => {
    if (!countdown.enabled) return;

    const timer = setInterval(() => {
      const target = new Date(countdown.targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  if (!countdown.enabled) return null;

  return (
    <section className="py-20 lg:py-40 relative overflow-hidden bg-bg-dark">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-card rounded-[40px] lg:rounded-[64px] p-8 lg:p-24 border-white/5 shadow-2xl overflow-hidden text-center"
        >
          {/* Animated Background Atmosphere */}
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
             <motion.div 
               animate={{ opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full"
             />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] lg:text-[11px] font-black tracking-[4px] uppercase mb-10 shadow-lg"
            >
              <Clock className="w-4 h-4 animate-pulse" />
              {t('LIMITED TIME OFFER', 'সীমিত সময়ের অফার')}
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-8xl font-black mb-8 lg:mb-12 tracking-tighter leading-none"
            >
              {t(countdown.titleEn, countdown.titleBn)}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg lg:text-3xl text-text-secondary font-black mb-16 uppercase tracking-[4px] leading-relaxed max-w-2xl mx-auto"
            >
              {t(countdown.subtitleEn, countdown.subtitleBn)}
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 mb-20">
              {[
                { label: t('Days', 'দিন'), value: timeLeft.days },
                { label: t('Hours', 'ঘণ্টা'), value: timeLeft.hours },
                { label: t('Minutes', 'মিনিট'), value: timeLeft.mins },
                { label: t('Seconds', 'সেকেন্ড'), value: timeLeft.secs }
              ].map((unit, i) => (
                <motion.div 
                  key={unit.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="bg-white/5 border border-white/10 rounded-3xl lg:rounded-[40px] p-6 lg:p-10 flex flex-col items-center justify-center relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                  <span className="text-4xl lg:text-7xl font-black text-text-primary tracking-tighter relative z-10 leading-none">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] lg:text-[11px] font-black text-text-muted uppercase tracking-[3px] mt-3 lg:mt-5 relative z-10">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
               <a 
                 href="#pricing"
                 className="group relative bg-white text-black px-12 lg:px-16 py-5 lg:py-6 rounded-2xl lg:rounded-[32px] font-black text-sm lg:text-base uppercase tracking-[4px] hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto w-fit"
               >
                 <Zap className="w-5 lg:w-6 h-5 lg:h-6 fill-current" />
                 {t('CLAIM DISCOUNT NOW', 'এখনই ডিসকাউন্ট নিন')}
                 <Sparkles className="w-5 lg:w-6 h-5 lg:h-6" />
               </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
