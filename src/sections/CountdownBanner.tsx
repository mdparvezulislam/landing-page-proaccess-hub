import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Timer, Zap } from 'lucide-react';

export const CountdownBanner = () => {
  const { language, countdown } = useStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  useEffect(() => {
    if (!countdown.enabled) return;

    const timer = setInterval(() => {
      const target = new Date(countdown.targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.targetDate, countdown.enabled]);

  if (!countdown.enabled) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-[48px] p-10 lg:p-20 relative overflow-hidden border-primary/20 bg-primary/5"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full -z-10" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-8">
                 <Zap className="w-3 h-3 fill-primary" />
                 {t('Limited Time Offer', 'সীমিত সময়ের অফার')}
              </div>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 text-text-primary tracking-tighter leading-tight">
                {t(countdown.title, countdown.titleBn)}
              </h2>
              <p className="text-xl lg:text-2xl text-text-secondary font-medium max-w-xl">
                {t(countdown.subtitle, countdown.subtitleBn)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
              {[
                { label: t('Days', 'দিন'), value: timeLeft.days },
                { label: t('Hours', 'ঘণ্টা'), value: timeLeft.hours },
                { label: t('Mins', 'মিনিট'), value: timeLeft.minutes },
                { label: t('Secs', 'সেকেন্ড'), value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-3xl md:text-5xl font-black text-primary mb-4 shadow-2xl backdrop-blur-md relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-[32px] scale-0 group-hover:scale-100 transition-transform duration-500" />
                    <span className="relative">{String(item.value).padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[3px] text-text-muted">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
