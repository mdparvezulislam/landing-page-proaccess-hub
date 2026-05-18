"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import * as LucideIcons from 'lucide-react';

interface TrustBadgeItem {
  id: string;
  visible: boolean;
  order: number;
  icon: string;
  textEn: string;
  textBn: string;
}

export const TrustBadges = ({ data }: { data: TrustBadgeItem[] }) => {
  const { language } = useStore();
  const trustBadges = data || [];
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleBadges = trustBadges.filter((b) => b.visible).sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 lg:py-20 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {visibleBadges.map((badge, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.ShieldCheck;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 lg:gap-6 p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] glass-card border-white/5 hover:bg-white/[0.05] transition-all duration-500 group shadow-xl"
              >
                <div className="w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <IconComponent className="w-6 lg:w-8 h-6 lg:h-8" />
                </div>
                <div>
                   <h4 className="text-lg lg:text-xl font-black text-text-primary tracking-tight">
                     {t(badge.textEn, badge.textBn)}
                   </h4>
                   <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] mt-1 opacity-70">
                     {t('Verified System', 'ভেরিফাইড সিস্টেম')}
                   </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
