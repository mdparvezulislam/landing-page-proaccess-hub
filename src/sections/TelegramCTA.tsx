"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Send, MessageCircle, Sparkles } from 'lucide-react';

interface TelegramSettings {
  telegramLink?: string;
}

export const TelegramCTA = ({ data }: { data: TelegramSettings }) => {
  const { language } = useStore();
  const settings = data || {};
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <section className="py-20 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] lg:rounded-[80px] overflow-hidden p-8 lg:p-28 text-center shadow-2xl shadow-primary/30"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary opacity-100" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div 
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 10, 0]
             }}
             transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
             className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 blur-[120px] rounded-full"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 lg:w-24 h-16 lg:h-24 rounded-2xl lg:rounded-[32px] bg-white/20 backdrop-blur-xl flex items-center justify-center mb-6 lg:mb-10 shadow-2xl border border-white/30 transition-transform duration-500">
              <Send className="w-8 lg:w-12 h-8 lg:h-12 text-white" />
            </div>
            
            <h2 className="text-3xl lg:text-7xl font-black text-white mb-6 lg:mb-8 tracking-tighter leading-tight">
              {t('Need Direct ', 'সরাসরি ')}
              <span className="text-white/70">{t('Support', 'সাপোর্ট')}</span>
              {t('?', ' প্রয়োজন?')}
            </h2>
            
            <p className="text-base lg:text-2xl text-white/90 mb-10 lg:mb-14 max-w-2xl font-medium leading-relaxed">
              {t('Join our Telegram channel for exclusive resources or message us directly for personalized assistance.', 'বিশেষ রিসোর্সের জন্য আমাদের টেলিগ্রাম চ্যানেলে যোগ দিন অথবা ব্যক্তিগত সহায়তার জন্য সরাসরি মেসেজ করুন।')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full sm:w-auto">
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-8 lg:px-12 py-4 lg:py-6 bg-white text-primary font-black rounded-2xl lg:rounded-3xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl text-sm lg:text-lg"
              >
                <MessageCircle className="w-5 lg:w-6 h-5 lg:h-6" />
                {t('Message on Telegram', 'টেলিগ্রামে মেসেজ করুন')}
              </a>
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-8 lg:px-12 py-4 lg:py-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-black rounded-2xl lg:rounded-3xl flex items-center justify-center gap-3 transition-all hover:bg-white/30 text-sm lg:text-lg"
              >
                <Sparkles className="w-5 lg:w-6 h-5 lg:h-6" />
                {t('Join Community', 'কমিউনিটিতে যোগ দিন')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-x-1/2 -z-10" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full translate-x-1/2 -z-10" />
    </section>
  );
};
