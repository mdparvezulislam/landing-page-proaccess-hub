import React from 'react';
import { useStore } from '../store/useStore';
import { Send, Mail, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { language, settings, footer } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                {settings.logo[0] || 'P'}
              </div>
              <span className="font-black text-2xl tracking-tighter text-text-primary">
                {t(settings.siteName, settings.siteNameBn)}
              </span>
            </Link>
            <p className="text-text-secondary text-lg font-medium leading-relaxed mb-10 max-w-xs">
              {t('The ultimate VIP platform for digital growth and automation in Bangladesh.', 'বাংলাদেশে ডিজিটাল গ্রোথ এবং অটোমেশনের জন্য সেরা ভিআইপি প্ল্যাটফর্ম।')}
            </p>
            <div className="flex gap-4">
               <a href={settings.telegramLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 group">
                  <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </a>
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-secondary hover:bg-secondary/10 hover:border-secondary/20 transition-all duration-300 group">
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </div>
            </div>
          </div>

          <div>
            <h4 className="text-text-primary font-black uppercase tracking-[3px] text-xs mb-10">{t('Quick Links', 'দ্রুত লিঙ্ক')}</h4>
            <ul className="space-y-5">
              <li><a href="#products" className="text-text-secondary font-bold hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> {t('Products', 'পণ্য')}</a></li>
              <li><a href="#pricing" className="text-text-secondary font-bold hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> {t('Pricing', 'প্রাইসিং')}</a></li>
              <li><a href="#faq" className="text-text-secondary font-bold hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> {t('FAQ', 'প্রশ্নোত্তর')}</a></li>
              <li><a href="#reviews" className="text-text-secondary font-bold hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /> {t('Reviews', 'রিভিউ')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-black uppercase tracking-[3px] text-xs mb-10">{t('Direct Contact', 'যোগাযোগ')}</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-text-secondary group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="font-bold">{settings.telegramHandle}</span>
              </li>
              <li className="flex items-center gap-4 text-text-secondary group">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-bold">support@proaccess.vip</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-black uppercase tracking-[3px] text-xs mb-10">{t('Legal', 'আইনি')}</h4>
            <ul className="space-y-5">
               {footer.links.map((link, i) => (
                  <li key={i}>
                     <a href={link.url} className="text-text-secondary font-bold hover:text-primary transition-colors flex items-center gap-2 group">
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        {t(link.label, link.labelBn)}
                     </a>
                  </li>
               ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-text-muted font-bold text-sm tracking-tight order-2 md:order-1">
            {t(footer.copyright, footer.copyrightBn)}
          </p>
          <div className="flex items-center gap-3 order-1 md:order-2">
             <Link to="/admin-dashboard" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/10 transition-all">
                Admin Access
             </Link>
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-text-muted">
                System Version 3.0.2
             </div>
             <div className="px-4 py-2 rounded-xl bg-success/10 border border-success/20 text-[10px] font-black uppercase tracking-widest text-success">
                Server Stable
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
