import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star, Users, Globe, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const { language, hero } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-20 lg:pt-32 pb-20 overflow-hidden mesh-gradient">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-primary/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-secondary/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full radial-glow opacity-50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8 group hover:bg-white/[0.05] transition-all duration-500">
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] font-black uppercase tracking-[3px] text-text-primary">
                {t(hero.badge, hero.badgeBn)}
              </span>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <div className="flex items-center gap-1.5 text-secondary">
                 <Trophy className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{t('2026 EDITION', '২০২৬ সংস্করণ')}</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] lg:leading-[0.85]">
              {t(hero.title, hero.titleBn)}{' '}
              <span className="premium-gradient-text block mt-4 lg:mt-6">
                {t(hero.titleAccent, hero.titleAccentBn)}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg lg:text-2xl text-text-secondary max-w-2xl mb-12 font-medium leading-relaxed">
              {t(hero.description, hero.descriptionBn)}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link to="/#pricing" className="group relative bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-[24px] font-black text-sm lg:text-base transition-all glow-btn shadow-2xl shadow-primary/30 flex items-center justify-center gap-3">
                {t(hero.cta1, hero.cta1Bn)}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link to="/#products" className="group px-10 py-5 rounded-[24px] bg-white/[0.02] border border-white/10 text-text-primary font-black text-sm lg:text-base hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-center gap-3 backdrop-blur-xl">
                {t(hero.cta2, hero.cta2Bn)}
                <Zap className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" />
              </Link>
            </motion.div>

            {/* Live Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 border-t border-white/5 pt-12">
               {hero.stats?.map((stat, i) => (
                 <div key={i} className="flex flex-col gap-2 group cursor-default">
                    <span className="text-3xl lg:text-4xl font-black text-text-primary tracking-tighter group-hover:text-primary transition-colors duration-500">{t(stat.value, stat.valueBn)}</span>
                    <span className="text-[10px] lg:text-[11px] font-black text-text-muted uppercase tracking-[2px]">{t(stat.label, stat.labelBn)}</span>
                 </div>
               ))}
            </motion.div>
          </motion.div>

          {/* Right Visuals - Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Main Card */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 glass-card rounded-[48px] p-8 lg:p-12 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <div className="h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest">
                       LIVE VAULT
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-4 w-2/3 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         animate={{ x: '100%' }}
                         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                         className="h-full w-1/3 bg-primary"
                       />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-white/5 rounded-full" />
                      <div className="h-3 w-4/5 bg-white/5 rounded-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center">
                        <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                        <span className="block text-xl font-black">12K+</span>
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">MEMBERS</span>
                     </div>
                     <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-center">
                        <Globe className="w-5 h-5 text-secondary mx-auto mb-2" />
                        <span className="block text-xl font-black">40+</span>
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">COUNTRIES</span>
                     </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Small Cards */}
              <motion.div 
                animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-10 -right-10 glass-card p-5 rounded-2xl border-primary/20 shadow-xl backdrop-blur-3xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <span className="block text-xs font-black">Verified</span>
                    <span className="block text-[8px] text-text-muted font-bold uppercase">SECURE NETWORK</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-10 -left-10 glass-card p-5 rounded-2xl border-secondary/20 shadow-xl backdrop-blur-3xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                  </div>
                  <div>
                    <span className="block text-xs font-black">Top Rated</span>
                    <span className="block text-[8px] text-text-muted font-bold uppercase">COMMUNITY CHOICE</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
