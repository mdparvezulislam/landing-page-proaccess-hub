import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Menu, X, Globe, ArrowRight, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { language, setLanguage, settings, navbar } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;
  const navItems = [...navbar.items].sort((a, b) => a.order - b.order);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      scrolled 
        ? "bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl" 
        : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3.5 group relative">
          <div className="w-11 h-11 rounded-[14px] bg-primary flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/25 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500">
            {settings.logo[0] || 'V'}
            <div className="absolute inset-0 bg-white/20 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter text-text-primary leading-none">
              {t(settings.siteName, settings.siteNameBn)}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[2px] text-primary mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
              {t('Elite Hub', 'এলিট হাব')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Centered & Glassy */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
          {navItems.map(item => (
            <a 
              key={item.url}
              href={item.url}
              className="px-5 py-2 text-[13px] font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-xl transition-all relative group"
            >
              {t(item.label, item.labelBn)}
              <div className="absolute bottom-1.5 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-5">
          {/* Language Switcher */}
          <div className="hidden sm:flex bg-white/[0.03] p-1 rounded-xl border border-white/5 relative overflow-hidden group shadow-lg">
             <button 
               onClick={() => setLanguage('bn')}
               className={`relative z-10 px-3.5 py-1.5 text-[9px] font-black transition-all duration-500 ${language === 'bn' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
             >
               বাংলা
             </button>
             <button 
               onClick={() => setLanguage('en')}
               className={`relative z-10 px-3.5 py-1.5 text-[9px] font-black transition-all duration-500 ${language === 'en' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
             >
               ENGLISH
             </button>
             <motion.div 
               animate={{ x: language === 'bn' ? 0 : '100%' }}
               transition={{ type: 'spring', stiffness: 350, damping: 30 }}
               className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
             />
          </div>

          <Link 
            to="/#pricing"
            className="hidden md:flex items-center gap-2.5 bg-primary hover:bg-primary-light text-white px-7 py-3 rounded-2xl font-black text-xs transition-all glow-btn shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95"
          >
            {t(settings.floatingCTA, settings.floatingCTABn)}
            <Zap className="w-4 h-4 fill-white" />
          </Link>

          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2.5 text-text-primary hover:bg-white/5 rounded-2xl transition-all border border-white/5"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu Drawer */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#05091D] border-l border-white/10 z-[120] lg:hidden shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black">
                      {settings.logo[0]}
                   </div>
                   <span className="font-black tracking-tighter text-lg">{t(settings.siteName, settings.siteNameBn)}</span>
                 </div>
                 <button onClick={() => setMobileMenu(false)} className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-3 mb-auto">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1 mb-5">{t('Navigation', 'নেভিগেশন')}</p>
                {navItems.map((item, i) => (
                  <motion.a 
                    key={item.url}
                    href={item.url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center justify-between px-6 py-5 rounded-2xl bg-white/[0.02] border border-white/5 text-lg font-black text-text-primary hover:bg-primary/10 hover:border-primary/20 transition-all group"
                  >
                    {t(item.label, item.labelBn)}
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 space-y-6 pt-8 border-t border-white/5">
                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 relative overflow-hidden">
                   <button onClick={() => setLanguage('bn')} className={`relative z-10 flex-1 py-3 text-[10px] font-black transition-all ${language === 'bn' ? 'text-black' : 'text-text-muted'}`}>বাংলা</button>
                   <button onClick={() => setLanguage('en')} className={`relative z-10 flex-1 py-3 text-[10px] font-black transition-all ${language === 'en' ? 'text-black' : 'text-text-muted'}`}>ENGLISH</button>
                   <motion.div animate={{ x: language === 'bn' ? 0 : '100%' }} className="absolute top-1.5 left-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-lg" />
                </div>
                
                <Link 
                  to="/#pricing"
                  onClick={() => setMobileMenu(false)}
                  className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-center shadow-xl shadow-primary/25 flex items-center justify-center gap-3"
                >
                  {t(settings.floatingCTA, settings.floatingCTABn)}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center justify-center gap-2.5 text-text-muted">
                   <ShieldCheck className="w-4 h-4 text-success" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{t('Verified Membership Platform', 'ভেরিফাইড মেম্বারশিপ প্ল্যাটফর্ম')}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
