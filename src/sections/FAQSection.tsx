import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FAQSection = () => {
  const { language, faqs } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;
  const visibleFaqs = faqs.filter(f => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="faq" className="py-24 lg:py-40 bg-white/[0.01] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
             <HelpCircle className="w-3 h-3" />
             {t('Support Center', 'সাপোর্ট সেন্টার')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter"
          >
            {t('Frequently Asked ', 'সাধারণ ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('Questions', 'জিজ্ঞাসা')}</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-text-secondary text-lg font-medium"
          >
             {t('Find answers to common questions about our VIP platform and resources.', 'আমাদের ভিআইপি প্ল্যাটফর্ম এবং রিসোর্স সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজে নিন।')}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {visibleFaqs.map((faq, idx) => (
            <motion.div 
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[32px] overflow-hidden border-white/[0.05] hover:border-white/10 transition-all duration-300"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all group"
              >
                <span className="text-lg lg:text-xl font-bold text-text-primary pr-8 leading-tight group-hover:text-primary transition-colors">
                  {t(faq.q, faq.qBn)}
                </span>
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${openId === faq.id ? 'bg-primary text-white rotate-180 shadow-lg shadow-primary/20' : 'bg-white/5 text-text-muted group-hover:bg-white/10'}`}>
                  {openId === faq.id ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="px-8 pb-8 text-text-secondary text-lg font-medium leading-relaxed border-t border-white/5 pt-6">
                      {t(faq.a, faq.aBn)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
