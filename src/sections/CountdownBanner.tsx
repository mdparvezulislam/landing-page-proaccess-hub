import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Timer } from 'lucide-react';

export const CountdownBanner = () => {
  const { language, countdown } = useStore();
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
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
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.targetDate]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 -z-10" />
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-[40px] p-10 lg:p-16 relative overflow-hidden border-primary/20 premium-shadow">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Timer className="w-32 h-32" />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-text-primary">
                {language === 'en' ? countdown.title : countdown.titleBn}
              </h2>
              <p className="text-xl text-text-secondary">
                {language === 'en' ? countdown.subtitle : countdown.subtitleBn}
              </p>
            </div>

            <div className="flex gap-4 md:gap-8">
              {[
                { label: language === 'en' ? 'Days' : 'দিন', value: timeLeft.days },
                { label: language === 'en' ? 'Hours' : 'ঘণ্টা', value: timeLeft.hours },
                { label: language === 'en' ? 'Mins' : 'মিনিট', value: timeLeft.minutes },
                { label: language === 'en' ? 'Secs' : 'সেকেন্ড', value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-4xl font-black text-primary mb-2 shadow-inner">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-text-muted">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
