import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Send, ShoppingCart, ArrowUp } from 'lucide-react';

export const FloatingElements = () => {
  const { language, settings } = useStore();
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

  return (
    <>
      {/* Floating Telegram Support */}
      <div className="fixed bottom-8 left-8 z-[60]">
        <motion.a
          href={settings.telegramLink}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-2xl border border-white/20 group relative"
        >
          <Send className="w-8 h-8" />
          <div className="absolute left-full ml-4 px-4 py-2 bg-white text-bg-dark text-xs font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl uppercase tracking-widest">
            {language === 'en' ? 'Need Help?' : 'সাহায্য প্রয়োজন?'}
          </div>
        </motion.a>
      </div>

      {/* Floating Buy Button (Mobile Only) */}
      <div className="fixed bottom-8 right-8 z-[60] lg:hidden">
        <motion.a
          href="#pricing"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl border border-white/20 glow-btn"
        >
          <ShoppingCart className="w-8 h-8" />
        </motion.a>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-28 right-8 z-[60] w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-all hidden lg:flex"
          >
            <ArrowUp className="w-5 h-5" />
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
            className="fixed bottom-0 left-0 right-0 z-[50] p-4 lg:hidden"
          >
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-primary/30 premium-shadow backdrop-blur-2xl">
              <div>
                <p className="text-[10px] font-black text-primary-light uppercase tracking-widest">Limited Offer</p>
                <p className="text-sm font-bold text-text-primary">
                  {language === 'en' ? 'Get VIP Access' : 'ভিআইপি অ্যাক্সেস নিন'}
                </p>
              </div>
              <a
                href="#pricing"
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm glow-btn"
              >
                {language === 'en' ? 'Join Now' : 'এখনই যোগ দিন'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
