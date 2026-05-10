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
  const [timeLeft, setTimeLeft] = useState<{ d: string, h: string, m: string, s: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!data?.enabled) return;

    // For demo purposes, if target date is in the past, set it to 3 days from now
    let targetTime = new Date(data.targetDate).getTime();
    if (isNaN(targetTime) || targetTime < new Date().getTime()) {
      targetTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
    }

    setIsVisible(true);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
        clearInterval(timer);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((difference % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft({ d, h, m, s });
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
        className="fixed bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 z-[150] w-[98%] max-w-4xl"
      >
        <div className="relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-info rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          
          <div className="relative bg-[#020617]/90 backdrop-blur-2xl border border-white/10 rounded-full p-1.5 lg:p-2 pl-4 lg:pl-10 flex items-center justify-between shadow-2xl overflow-hidden">
            
            <div className="flex items-center gap-3 lg:gap-8 relative z-10">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
                <Zap className="w-5 h-5 lg:w-8 lg:h-8 fill-white text-white" />
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] lg:text-sm font-black text-white uppercase tracking-[2px] lg:tracking-[4px] whitespace-nowrap">
                    {t('Flash Sale Ends:', 'অফার শেষ হবে:')}
                  </span>
                  <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-amber-400 animate-pulse hidden xs:block" />
                </div>
                
                <div className="flex items-center gap-1.5 lg:gap-4">
                  <TimeUnit value={timeLeft.d} label="D" />
                  <span className="text-white/20 font-black text-xs lg:text-xl">:</span>
                  <TimeUnit value={timeLeft.h} label="H" />
                  <span className="text-white/20 font-black text-xs lg:text-xl">:</span>
                  <TimeUnit value={timeLeft.m} label="M" />
                  <span className="text-white/20 font-black text-xs lg:text-xl">:</span>
                  <TimeUnit value={timeLeft.s} label="S" />
                </div>
              </div>
            </div>

            <a 
              href="#pricing"
              className="bg-white text-black px-5 lg:px-14 py-3 lg:py-5 rounded-full font-black text-[10px] lg:text-[14px] uppercase tracking-[2px] transition-all hover:bg-primary hover:text-white shadow-xl flex items-center gap-2 lg:gap-4 group/btn relative z-10"
            >
              <span className="hidden xs:inline">{t('Claim Discount', 'ডিসকাউন্ট নিন')}</span>
              <span className="xs:hidden">{t('Claim', 'নিন')}</span>
              <ArrowRight className="w-3.5 h-3.5 lg:w-5 lg:h-5 group-hover/btn:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const TimeUnit = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col items-center justify-center min-w-[28px] lg:min-w-[45px]">
    <span className="text-sm lg:text-3xl font-black text-white tracking-tighter tabular-nums leading-none grad-text">{value}</span>
    <span className="text-[6px] lg:text-[9px] font-black text-text-muted uppercase tracking-tighter mt-0.5">{label}</span>
  </div>
);
