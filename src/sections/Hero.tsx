import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const { language, hero } = useStore();
  const content = hero[language];

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-semibold mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {content.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold text-text-primary leading-tight mb-6"
          >
            {content.title}{' '}
            <span className="grad-text">{content.titleAccent}</span>{' '}
            {content.subtitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-text-secondary mb-10 max-w-2xl"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a
              href="#pricing"
              className="px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all glow-btn group"
            >
              {content.cta1}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#products"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary font-bold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              {content.cta2}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full"
          >
            {[
              { icon: Zap, label: 'Instant Access', labelBn: 'তাত্ক্ষণিক অ্যাক্সেস' },
              { icon: Shield, label: 'Secure Payment', labelBn: 'নিরাপদ পেমেন্ট' },
              { icon: Users, label: '10K+ Members', labelBn: '১০ হাজার+ সদস্য' },
              { icon: Shield, label: '24/7 Support', labelBn: '২৪/৭ সাপোর্ট' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-text-muted">
                  {language === 'en' ? item.label : item.labelBn}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hero Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
};
