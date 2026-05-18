"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Menu, X, Globe, ArrowRight, Zap, ChevronRight, ShieldCheck, Crown } from 'lucide-react';
import NextLink from 'next/link';
import Link from 'next/link';

import { CurrencyToggle } from './CurrencyToggle';

export const Header = ({ data }: { data: any }) => {
  const { language, setLanguage } = useStore();
  const settings = data?.site || {};
  const navbar = data?.navbar || { items: [] };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const t = (en: string, bn: string) => language === 'en' ? (en || '') : (bn || '');
  const navItems = [...(navbar.items || [])].sort((a: any, b: any) => a.order - b.order);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled
      ? "bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 py-3 lg:py-4 shadow-2xl"
      : "bg-transparent py-6 lg:py-8"
      }`}>
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 lg:gap-3 group relative">
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-[14px] bg-primary flex items-center justify-center text-white font-black text-lg lg:text-xl shadow-xl shadow-primary/25 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500">
            {(settings?.siteNameEn || 'V')[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg lg:text-xl tracking-tighter text-text-primary leading-none">
              {t(settings?.siteNameEn, settings?.siteNameBn)}
            </span>
            <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-[2px] text-primary mt-1 opacity-80">
              {t('Elite Hub', 'এলিট হাব')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {navItems.map((item: any) => (
            <a
              key={item.id}
              href={item.url}
              className="px-5 py-2 text-[13px] font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl transition-all relative group"
            >
              {t(item.labelEn, item.labelBn)}
              <div className="absolute bottom-1.5 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
          <Link
            href="/dashboard"
            className="px-5 py-2 text-[13px] font-black text-amber-500 hover:text-white hover:bg-amber-500/20 rounded-xl transition-all relative group flex items-center gap-2"
          >
            <Crown className="w-4 h-4" /> Dashboard
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:gap-5">
          {/* Currency Toggle */}
          <div className="flex">
            <CurrencyToggle />
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:flex bg-white/[0.03] p-1 rounded-xl border border-white/5 relative overflow-hidden group shadow-lg">
            <button
              onClick={() => setLanguage('bn')}
              className={`relative z-10 px-3 py-1 text-[9px] font-black transition-all duration-500 ${language === 'bn' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-3 py-1 text-[9px] font-black transition-all duration-500 ${language === 'en' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
            >
              EN
            </button>
            <motion.div
              animate={{ x: language === 'bn' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
            />
          </div>

          <Link
            href="/#pricing"
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-black text-xs transition-all glow-btn"
          >
            {t(settings?.floatingCTAEn, settings?.floatingCTABn)}
            <Zap className="w-4 h-4 fill-white" />
          </Link>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2 text-text-primary hover:bg-white/5 rounded-xl transition-all border border-white/5"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-bg-dark/80 backdrop-blur-md z-[110] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-[#05091D] border-l border-white/10 z-[120] lg:hidden shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black">
                    {(settings?.siteNameEn || 'V')[0]}
                  </div>
                  <span className="font-black tracking-tighter text-lg">{t(settings?.siteNameEn, settings?.siteNameBn)}</span>
                </div>
                <button onClick={() => setMobileMenu(false)} className="p-2 bg-white/5 rounded-xl border border-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-auto">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between px-6 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-base font-black text-amber-500 hover:bg-amber-500/20 transition-all"
                >
                  <span className="flex items-center gap-3"><Crown className="w-5 h-5" /> Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <div className="h-px bg-white/5 my-2" />
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={item.url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center justify-between px-6 py-4 rounded-xl bg-white/[0.02] border border-white/5 text-base font-black text-text-primary hover:bg-primary/10 transition-all"
                  >
                    {t(item.labelEn, item.labelBn)}
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between gap-4">
                  <CurrencyToggle />
                </div>

                <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 relative overflow-hidden">
                  <button onClick={() => setLanguage('bn')} className={`relative z-10 flex-1 py-3 text-[10px] font-black transition-all ${language === 'bn' ? 'text-black' : 'text-text-muted'}`}>বাংলা</button>
                  <button onClick={() => setLanguage('en')} className={`relative z-10 flex-1 py-3 text-[10px] font-black transition-all ${language === 'en' ? 'text-black' : 'text-text-muted'}`}>ENGLISH</button>
                  <motion.div animate={{ x: language === 'bn' ? 0 : '100%' }} className="absolute top-1 left-1 bottom-1 w-[calc(50%-2px)] bg-white rounded-lg shadow-lg" />
                </div>

                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenu(false)}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black text-center shadow-xl flex items-center justify-center gap-3"
                >
                  {t(settings?.floatingCTAEn, settings?.floatingCTABn)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
