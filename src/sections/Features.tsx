"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import * as LucideIcons from 'lucide-react';

interface FeatureItem {
  id: string;
  visible: boolean;
  order: number;
  icon: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

interface FeaturesSection {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export const Features = ({ data, section }: { data: FeatureItem[]; section: FeaturesSection }) => {
  const { language } = useStore();
  const globalFeatures = data || [];
  const featuresSection = section || { titleEn: 'Features', titleBn: 'ফিচারসমূহ' };
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleFeatures = globalFeatures.filter((f) => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="features" className="py-16 lg:py-24 bg-white/[0.01] relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-7xl font-black mb-4 lg:mb-10 tracking-tighter leading-tight"
          >
            {t(featuresSection.titleEn, featuresSection.titleBn)}
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-text-secondary text-sm lg:text-2xl font-medium leading-relaxed"
          >
             {t(featuresSection.descriptionEn, featuresSection.descriptionBn)}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {visibleFeatures.map((feature, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Zap;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 lg:p-12 rounded-[32px] lg:rounded-[40px] glass-card hover:bg-white/[0.05] group transition-all duration-500 border-white/[0.05] flex flex-col shadow-xl"
              >
                <div className="w-14 lg:w-16 h-14 lg:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 lg:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <IconComponent className="w-7 lg:w-8 h-7 lg:h-8" />
                </div>
                <h3 className="text-xl lg:text-3xl font-black mb-3 text-text-primary tracking-tight">
                  {t(feature.titleEn, feature.titleBn)}
                </h3>
                <p className="text-text-secondary text-sm lg:text-lg leading-relaxed font-medium">
                  {t(feature.descriptionEn, feature.descriptionBn)}
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
