import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Send, MessageCircle } from 'lucide-react';

export const TelegramCTA = () => {
  const { language, settings } = useStore();

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[48px] overflow-hidden p-12 lg:p-24 text-center group"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl border border-white/30">
              <Send className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
              {language === 'en' ? 'Need Any ' : ''}
              <span className="underline decoration-white/30 underline-offset-8">
                {language === 'en' ? 'Support' : 'সরাসরি সাপোর্ট'}
              </span>
              {language === 'en' ? '?' : ' প্রয়োজন?'}
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-2xl font-medium">
              {language === 'en' 
                ? 'Join our Telegram channel for free resources or message us directly for any queries.' 
                : 'ফ্রি রিসোর্সের জন্য আমাদের টেলিগ্রাম চ্যানেলে যোগ দিন অথবা যেকোনো জিজ্ঞাসার জন্য সরাসরি আমাদের মেসেজ করুন।'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-10 py-5 bg-white text-primary font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                <MessageCircle className="w-6 h-6" />
                {language === 'en' ? 'Message on Telegram' : 'টেলিগ্রামে মেসেজ করুন'}
              </a>
              <a
                href={settings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="px-10 py-5 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-white/30"
              >
                {language === 'en' ? 'Join Community' : 'কমিউনিটিতে যোগ দিন'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
