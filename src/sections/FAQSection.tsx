import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Plus, Minus } from 'lucide-react';

export const FAQSection = () => {
  const { language, faqs } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {language === 'en' ? 'Frequently Asked ' : 'সাধারণ '}
            <span className="grad-text">{language === 'en' ? 'Questions' : 'জিজ্ঞাসা'}</span>
          </h2>
          <p className="text-text-secondary text-lg">
            {language === 'en' 
              ? 'Got questions? We have answers.' 
              : 'প্রশ্ন আছে? আমাদের কাছে উত্তর আছে।'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-lg font-semibold text-text-primary">
                  {language === 'en' ? faq.q : faq.qBn}
                </span>
                <div className={`p-2 rounded-lg bg-white/5 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}>
                  {openId === faq.id ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-text-muted" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 border-t border-white/5 text-text-secondary leading-relaxed">
                      {language === 'en' ? faq.a : faq.aBn}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
