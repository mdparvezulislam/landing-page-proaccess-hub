"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Send, ShoppingCart, ArrowUp, Zap } from 'lucide-react';

export const FloatingElements = ({ data }: { data: any }) => {
  const { language } = useStore();
  const settings = data?.site || {};
  const [showSticky, setShowSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 800);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <>
      {/* Floating Telegram Support */}
      <div className="fixed bottom-26 left-6 lg:left-8 z-[150]">
        <motion.a
          href={settings.telegramLink}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-[24px] bg-[#0088cc] text-white flex items-center justify-center shadow-2xl border border-white/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Send className="w-8 h-8 relative z-10" />
          <div className="absolute left-full ml-4 px-5 py-2.5 bg-white text-bg-dark text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl uppercase tracking-[2px] border border-white/20 backdrop-blur-xl">
            {t('Join VIP Chat', 'ভিআইপি চ্যাট')}
          </div>
        </motion.a>
      </div>

      {/* Floating Buy Button (Mobile Only) */}
      {/* <div className="fixed bottom-32 right-6 lg:hidden">
        <motion.a
          href="#pricing"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-[24px] bg-primary text-white flex items-center justify-center shadow-2xl border border-white/20 glow-btn"
        >
          <Zap className="w-8 h-8 fill-white" />
        </motion.a>
      </div> */}

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-28 right-8 z-[150] w-12 h-12 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-all hidden lg:flex shadow-2xl hover:bg-white/10 group"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sticky Bottom CTA (Mobile-First) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[140] p-4 lg:hidden"
          >
            <div className="glass-card rounded-[32px] p-5 flex items-center justify-between border-primary/30 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="relative z-10">
                <p className="text-[9px] font-black text-primary-light uppercase tracking-[2px] mb-1">Elite Opportunity</p>
                <p className="text-sm font-black text-text-primary tracking-tight">
                  {t('Join VIP Masterclass', 'ভিআইপি মেম্বারশিপ নিন')}
                </p>
              </div>
              <a
                href="#pricing"
                className="bg-primary text-white px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 glow-btn relative z-10"
              >
                {t('Access Now', 'এক্সেস নিন')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
