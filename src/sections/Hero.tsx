import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

export const Hero = () => {
  const { language, hero } = useStore();
  
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={hero.backgroundImage} 
          className="w-full h-full object-cover opacity-20"
          alt="Hero Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-black tracking-[2px] uppercase mb-10"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t(hero.badge, hero.badgeBn)}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black text-text-primary leading-[1.1] mb-8 tracking-tighter"
          >
            {t(hero.title, hero.titleBn)}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary">
              {t(hero.titleAccent, hero.titleAccentBn)}
            </span>{' '}
            {t(hero.subtitle, hero.subtitleBn)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-text-secondary mb-12 max-w-2xl font-medium leading-relaxed"
          >
            {t(hero.description, hero.descriptionBn)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <a
              href="#products"
              className="px-10 py-5 bg-primary hover:bg-primary-light text-white font-black rounded-[20px] flex items-center justify-center gap-3 transition-all glow-btn group shadow-xl shadow-primary/20"
            >
              {t(hero.cta1, hero.cta1Bn)}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#reviews"
              className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary font-black rounded-[20px] flex items-center justify-center gap-3 transition-all backdrop-blur-md"
            >
              {t(hero.cta2, hero.cta2Bn)}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating Atmosphere Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/5 blur-[120px] rounded-full -z-10 animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};
