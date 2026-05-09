import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import * as LucideIcons from 'lucide-react';

export const Features = () => {
  const { language, globalFeatures } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleFeatures = globalFeatures.filter(f => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="features" className="py-24 lg:py-40 bg-white/[0.01] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter"
          >
            {t('Why Choose ', 'কেন ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Pro Access Hub</span>?
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-text-secondary text-lg font-medium"
          >
             {t('We provide the highest quality resources and secret methods to help you succeed in the digital world.', 'আমরা আপনাকে ডিজিটাল বিশ্বে সফল হতে সাহায্য করার জন্য সর্বোচ্চ মানের রিসোর্স এবং সিক্রেট মেথড প্রদান করি।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleFeatures.map((feature, i) => {
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Zap;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[40px] glass-card hover:bg-white/[0.05] group transition-all duration-500 border-white/[0.05]"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tight">
                  {t(feature.title, feature.titleBn)}
                </h3>
                <p className="text-text-secondary leading-relaxed font-medium">
                  {t(feature.description, feature.descriptionBn)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -z-10" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-secondary/5 blur-[120px] rounded-full translate-x-1/2 -z-10" />
    </section>
  );
};
