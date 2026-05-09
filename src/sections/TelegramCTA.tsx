import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Send, MessageCircle, Sparkles } from 'lucide-react';

export const TelegramCTA = () => {
  const { language, settings } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <section className="py-24 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[60px] overflow-hidden p-12 lg:p-28 text-center shadow-2xl shadow-primary/30"
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
            <div className="w-24 h-24 rounded-[32px] bg-white/20 backdrop-blur-xl flex items-center justify-center mb-10 shadow-2xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
              <Send className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
              {t('Need Direct ', 'সরাসরি ')}
              <span className="text-white/70">{t('Support', 'সাপোর্ট')}</span>
              {t('?', ' প্রয়োজন?')}
            </h2>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-14 max-w-2xl font-medium leading-relaxed">
              {t('Join our Telegram channel for exclusive resources or message us directly for personalized assistance.', 'বিশেষ রিসোর্সের জন্য আমাদের টেলিগ্রাম চ্যানেলে যোগ দিন অথবা ব্যক্তিগত সহায়তার জন্য সরাসরি মেসেজ করুন।')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-12 py-6 bg-white text-primary font-black rounded-3xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl text-lg"
              >
                <MessageCircle className="w-6 h-6" />
                {t('Message on Telegram', 'টেলিগ্রামে মেসেজ করুন')}
              </a>
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-12 py-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-black rounded-3xl flex items-center justify-center gap-3 transition-all hover:bg-white/30 text-lg"
              >
                <Sparkles className="w-6 h-6" />
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
