import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import * as LucideIcons from 'lucide-react';

export const TrustBadges = () => {
  const { language, trustBadges } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleBadges = trustBadges.filter(b => b.visible).sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {visibleBadges.map((badge, i) => {
            const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.ShieldCheck;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 p-8 rounded-[32px] glass-card border-white/5 hover:bg-white/[0.05] transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="text-xl font-black text-text-primary tracking-tight">
                     {t(badge.text, badge.textBn)}
                   </h4>
                   <p className="text-xs font-black text-text-muted uppercase tracking-[2px] mt-1 opacity-70">
                     {t('Verified System', 'ভেরিফাইড সিস্টেম')}
                   </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -z-10" />
    </section>
  );
};
