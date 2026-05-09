import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { language, setLanguage, settings, navbar } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const navItems = [...navbar.items].sort((a, b) => a.order - b.order);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {settings.logo[0] || 'P'}
          </div>
          <span className="font-black text-xl tracking-tighter text-text-primary">
            {t(settings.siteName, settings.siteNameBn)}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
          {navItems.map(item => (
            <a 
              key={item.url}
              href={item.url}
              className="text-sm font-bold text-text-secondary hover:text-primary transition-colors"
            >
              {t(item.label, item.labelBn)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Animated Lang Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 relative overflow-hidden group">
             <button 
               onClick={() => setLanguage('bn')}
               className={`relative z-10 px-3 py-1.5 text-[10px] font-black transition-all duration-300 ${language === 'bn' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
             >
               বাংলা
             </button>
             <button 
               onClick={() => setLanguage('en')}
               className={`relative z-10 px-3 py-1.5 text-[10px] font-black transition-all duration-300 ${language === 'en' ? 'text-black' : 'text-text-muted hover:text-text-primary'}`}
             >
               ENGLISH
             </button>
             <motion.div 
               animate={{ x: language === 'bn' ? 0 : '100%' }}
               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
               className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
             />
          </div>

          <Link 
            to="/#pricing"
            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all glow-btn shadow-lg shadow-primary/20"
          >
            {t(settings.floatingCTA, settings.floatingCTABn)}
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2 text-text-primary hover:bg-white/5 rounded-xl transition-colors"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#020617] border-b border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
              {navItems.map(item => (
                <a 
                  key={item.url}
                  href={item.url}
                  onClick={() => setMobileMenu(false)}
                  className="text-lg font-black text-text-primary py-3 border-b border-white/5 flex items-center justify-between group"
                >
                  {t(item.label, item.labelBn)}
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </a>
              ))}
              <Link 
                to="/#pricing"
                onClick={() => setMobileMenu(false)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-center mt-4 shadow-xl shadow-primary/20"
              >
                {t(settings.floatingCTA, settings.floatingCTABn)}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
