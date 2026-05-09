import React from 'react';
import { useStore } from '../store/useStore';
import { Send, Mail, MapPin, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { language, settings } = useStore();

  return (
    <footer className="bg-bg-dark border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">P</div>
              <span className="font-bold text-xl tracking-tight text-text-primary">
                {language === 'en' ? settings.siteName : settings.siteNameBn}
              </span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-8">
              {language === 'en' 
                ? 'The ultimate VIP platform for digital growth and automation in Bangladesh.' 
                : 'বাংলাদেশে ডিজিটাল গ্রোথ এবং অটোমেশনের জন্য সেরা ভিআইপি প্ল্যাটফর্ম।'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings.telegramLink} className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-text-primary font-bold mb-6">{language === 'en' ? 'Quick Links' : 'দ্রুত লিঙ্ক'}</h4>
            <ul className="space-y-4">
              <li><a href="#products" className="text-text-secondary hover:text-primary transition-colors">{language === 'en' ? 'Products' : 'পণ্য'}</a></li>
              <li><a href="#pricing" className="text-text-secondary hover:text-primary transition-colors">{language === 'en' ? 'Pricing' : 'প্রাইসিং'}</a></li>
              <li><a href="#faq" className="text-text-secondary hover:text-primary transition-colors">{language === 'en' ? 'FAQ' : 'প্রশ্নোত্তর'}</a></li>
              <li><a href="#reviews" className="text-text-secondary hover:text-primary transition-colors">{language === 'en' ? 'Reviews' : 'রিভিউ'}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold mb-6">{language === 'en' ? 'Support' : 'সাপোর্ট'}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-text-secondary">
                <Send className="w-5 h-5 text-primary" />
                <span>{settings.telegramHandle}</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-5 h-5 text-primary" />
                <span>support@proaccess.vip</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-bold mb-6">{language === 'en' ? 'Newsletter' : 'নিউজলেটার'}</h4>
            <p className="text-text-secondary text-sm mb-4">
              {language === 'en' ? 'Get updates on new methods and secrets.' : 'নতুন মেথড এবং সিক্রেট আপডেট পান।'}
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-light transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-text-muted text-sm text-center md:text-left">
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-text-muted text-sm hover:text-text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-muted text-sm hover:text-text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
