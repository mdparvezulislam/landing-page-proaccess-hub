"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface FlashSaleBarProps {
  data: any;
}

export const FlashSaleBar: React.FC<FlashSaleBarProps> = ({ data }) => {
  const { language } = useStore();
  const [timeLeft, setTimeLeft] = useState<{ h: string, m: string, s: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!data?.enabled) return;

    // For demo purposes, if target date is in the past, set it to 24 hours from now
    let targetTime = new Date(data.targetDate).getTime();
    if (isNaN(targetTime) || targetTime < new Date().getTime()) {
      targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    }

    setIsVisible(true);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ h: "00", m: "00", s: "00" });
        clearInterval(timer);
        return;
      }

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');
      const h = totalHours.toString().padStart(2, '0');

      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (!isVisible || !timeLeft) return null;

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-3xl"
      >
        <div className="relative group overflow-hidden">
          {/* Main Container */}
          <div className="bg-[#0f172a]/95 backdrop-blur-3xl border border-primary/40 rounded-full p-2 lg:p-2.5 pl-5 lg:pl-10 flex items-center justify-between shadow-[0_20px_60px_rgba(var(--primary-rgb),0.4)] relative z-10">

            {/* Animated Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-40 group-hover:opacity-100 transition-opacity duration-1000 rounded-full" />

            <div className="flex items-center gap-4 lg:gap-8 relative z-10">
              <div className="flex items-center justify-center w-9 h-9 lg:w-12 lg:h-12 rounded-full bg-primary shadow-[0_0_25px_rgba(var(--primary-rgb),0.6)] animate-pulse">
                <Zap className="w-5 h-5 lg:w-7 lg:h-7 fill-white text-white" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] lg:text-sm font-black text-white uppercase tracking-[3px] whitespace-nowrap drop-shadow-sm">
                    {t('Flash Sale Ends:', 'অফার শেষ হবে:')}
                  </span>
                  <Sparkles className="w-3 h-3 text-secondary animate-bounce hidden sm:block" />
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <TimeUnit value={timeLeft.h} label="H" />
                  <span className="text-primary font-black animate-pulse lg:text-xl">:</span>
                  <TimeUnit value={timeLeft.m} label="M" />
                  <span className="text-primary font-black animate-pulse lg:text-xl">:</span>
                  <TimeUnit value={timeLeft.s} label="S" />
                </div>
              </div>
            </div>

            <a
              href="#pricing"
              className="bg-primary hover:bg-primary-light text-white px-6 lg:px-12 py-3 lg:py-4.5 rounded-full font-black text-[10px] lg:text-[13px] uppercase tracking-[3px] transition-all shadow-xl flex items-center gap-2 lg:gap-3 group/btn relative z-10 glow-btn"
            >
              <span className="hidden sm:inline">{t('Claim Your Discount', 'ডিসকাউন্ট নিন')}</span>
              <span className="sm:hidden">{t('Claim', 'নিন')}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const TimeUnit = ({ value, label }: { value: string, label: string }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-lg lg:text-3xl font-black text-white tracking-tighter tabular-nums leading-none drop-shadow-md">{value}</span>
    <span className="text-[8px] lg:text-[10px] font-black text-primary uppercase tracking-tighter opacity-90">{label}</span>
  </div>
);
