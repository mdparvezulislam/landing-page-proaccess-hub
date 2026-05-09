import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Menu, X, Globe, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { language, setLanguage, settings } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: language === 'en' ? 'Products' : 'পণ্য', href: '#products' },
    { label: language === 'en' ? 'Pricing' : 'প্রাইসিং', href: '#pricing' },
    { label: language === 'en' ? 'FAQ' : 'প্রশ্নোত্তর', href: '#faq' },
    { label: language === 'en' ? 'Reviews' : 'রিভিউ', href: '#reviews' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-bg-dark/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-all">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-text-primary">
            {language === 'en' ? settings.siteName : settings.siteNameBn}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {isHome && navLinks.map(link => (
            <a 
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          {!isHome && (
            <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              {language === 'en' ? 'Home' : 'হোম'}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Lang Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-text-secondary hover:text-text-primary transition-all"
          >
            <Globe className="w-4 h-4 text-primary" />
            {language === 'en' ? 'BN' : 'EN'}
          </button>

          <Link 
            to="/#pricing"
            className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all glow-btn"
          >
            {language === 'en' ? 'Join VIP' : 'ভিআইপি যোগ দিন'}
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button 
            onClick={() => setMobileMenu(!mobileMenu)}
            className="lg:hidden p-2 text-text-primary"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-bg-dark border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {isHome && navLinks.map(link => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-lg font-bold text-text-primary"
                >
                  {link.label}
                </a>
              ))}
              <Link 
                to="/#pricing"
                onClick={() => setMobileMenu(false)}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-center"
              >
                {language === 'en' ? 'Join VIP Now' : 'এখনই যোগ দিন'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
