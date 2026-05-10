"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { ChevronRight, Shield, ScrollText, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface LegalHeroProps {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  icon: React.ReactNode;
}

export const LegalHero: React.FC<LegalHeroProps> = ({ titleEn, titleBn, subtitleEn, subtitleBn, icon }) => {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-bg-dark border-b border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 lg:w-24 lg:h-24 rounded-[28px] lg:rounded-[40px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20"
          >
            {icon}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-[4px] text-primary mb-6"
          >
            <Link href="/" className="hover:text-text-primary transition-colors">HOME</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-muted">LEGAL</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-black tracking-tighter leading-[1] mb-6 lg:mb-8"
          >
            {t(titleEn, titleBn)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-base lg:text-xl font-medium max-w-2xl leading-relaxed"
          >
            {t(subtitleEn, subtitleBn)}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export const LegalSection: React.FC<{
  id: string;
  titleEn: string;
  titleBn: string;
  children: React.ReactNode;
}> = ({ id, titleEn, titleBn, children }) => {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <section id={id} className="py-8 lg:py-12 border-b border-white/5 last:border-0">
      <h3 className="text-xl lg:text-2xl font-black tracking-tight mb-6 text-text-primary flex items-center gap-4">
        <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-primary">
          {id.split('-')[0].toUpperCase()}
        </span>
        {t(titleEn, titleBn)}
      </h3>
      <div className="prose prose-invert prose-sm lg:prose-base max-w-none prose-p:text-text-secondary prose-p:leading-relaxed prose-li:text-text-secondary prose-strong:text-text-primary prose-strong:font-black">
        {children}
      </div>
    </section>
  );
};

export const LegalTableOfContents: React.FC<{
  items: { id: string; labelEn: string; labelBn: string; }[]
}> = ({ items }) => {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <div className="sticky top-32 hidden lg:block">
      <h4 className="text-[10px] font-black uppercase tracking-[3px] text-text-muted mb-6">ON THIS PAGE</h4>
      <nav className="space-y-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-sm font-bold text-text-secondary hover:text-primary transition-all hover:translate-x-1"
          >
            {t(item.labelEn, item.labelBn)}
          </a>
        ))}
      </nav>
    </div>
  );
};

export const LegalPageLayout: React.FC<{
  children: React.ReactNode;
  tocItems: { id: string; labelEn: string; labelBn: string; }[];
}> = ({ children, tocItems }) => {
  return (
    <div className="bg-bg-dark min-h-screen">
      {children}
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-3">
            <LegalTableOfContents items={tocItems} />
          </div>
          <div className="lg:col-span-9 max-w-3xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
