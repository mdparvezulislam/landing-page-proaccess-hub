"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';

export const FAQSection = ({ data, settings: rawSettings }: { data: any, settings: any }) => {
  const { language } = useStore();
  const settings = rawSettings || {};
  const faqs = data || [];
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleFaqs = [...faqs].filter((f: any) => f.visible).sort((a: any, b: any) => a.order - b.order);

  return (
    <section id="faq" className="py-12 lg:py-24 relative bg-bg-dark overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {t('HAVE QUESTIONS?', 'আপনার কি কোনো প্রশ্ন আছে?')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-7xl font-black mb-6 lg:mb-8 tracking-tighter leading-tight"
          >
            {t('Curious About', 'আমাদের সম্পর্কে')}
            <span className="grad-text block mt-2 lg:mt-4">{t('VIP Access?', 'জানার ইচ্ছা?')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-base lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Everything you need to know about the VIP experience, payment, and instant delivery.', 'ভিআইপি মেম্বারশিপ, পেমেন্ট এবং ডেলিভারি সম্পর্কে বিস্তারিত জানুন।')}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {visibleFaqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === faq._id ? null : faq._id)}
                className={`w-full text-left p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-2 transition-all duration-500 flex items-center justify-between gap-6 ${
                  activeIndex === faq._id
                    ? 'bg-white/[0.04] border-primary/40 shadow-2xl shadow-primary/10'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className={`w-10 lg:w-14 h-10 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    activeIndex === faq._id ? 'bg-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-primary'
                  }`}>
                    <MessageSquare className="w-5 lg:w-7 h-5 lg:h-7" />
                  </div>
                  <span className="text-lg lg:text-2xl font-black tracking-tight text-text-primary leading-tight">
                    {t(faq.qEn, faq.qBn)}
                  </span>
                </div>
                <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${
                  activeIndex === faq._id ? 'rotate-180 bg-primary/20 border-primary/40 text-primary-light' : 'text-text-muted group-hover:text-text-primary'
                }`}>
                  <ChevronDown className="w-5 lg:w-6 h-5 lg:h-6" />
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === faq._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 lg:p-12 text-text-secondary text-base lg:text-xl font-medium leading-relaxed border-x-2 border-b-2 border-primary/20 rounded-b-[40px] bg-primary/[0.02] mt-[-20px] pt-[40px]">
                      {t(faq.aEn, faq.aBn)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 lg:mt-32 text-center p-10 lg:p-20 rounded-[48px] bg-white/[0.02] border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-8 animate-float" />
          <h3 className="text-3xl lg:text-5xl font-black mb-6 tracking-tighter">{t('Still Have Questions?', 'আরও কিছু জানার আছে?')}</h3>
          <p className="text-text-secondary text-lg lg:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            {t('Our expert agents are online 24/7 on Telegram to help you with anything.', 'আমাদের সাপোর্ট টিম টেলিগ্রামে ২৪/৭ সক্রিয় আছে।')}
          </p>
          <a
            href={settings.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all glow-btn"
          >
            <HelpCircle className="w-5 h-5" />
            {t('Message on Telegram', 'টেলিগ্রামে যোগাযোগ করুন')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};
