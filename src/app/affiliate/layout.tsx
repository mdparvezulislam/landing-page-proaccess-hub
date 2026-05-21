'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAffiliateMe } from '@/hooks/useAffiliate';
import {
  LayoutDashboard, Wallet, Users, CreditCard, TicketPercent,
  Bell, Settings, LogOut, Menu, X, ChevronRight,
  DollarSign, TrendingUp, Gift, ArrowRight, Globe,
} from 'lucide-react';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { translations, Lang } from '@/lib/affiliateLang';

const navItems = [
  { id: '/affiliate/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { id: '/affiliate/wallet', labelKey: 'wallet', icon: Wallet },
  { id: '/affiliate/referrals', labelKey: 'referrals', icon: Users },
  { id: '/affiliate/withdrawals', labelKey: 'withdrawals', icon: CreditCard },
  { id: '/affiliate/coupons', labelKey: 'coupons', icon: TicketPercent },
  { id: '/affiliate/settings', labelKey: 'settings', icon: Settings },
];

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useAffiliateMe();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && window.innerWidth >= 1024) setSidebarOpen(true);
  }, [mounted]);

  const t = translations[lang];

  const isPublicPage = pathname === '/affiliate' || pathname === '/affiliate/login' || pathname === '/affiliate/register';

  if (isPublicPage) {
    return (
      <>
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' },
        }} />
        {children}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
      </div>
    );
  }

  if (!data?.user) {
    if (typeof window !== 'undefined') {
      router.push('/affiliate/login');
    }
    return null;
  }

  const user = data.user;
  const isRestricted = user.status === 'pending' || user.status === 'rejected' || user.status === 'banned';

  if (isRestricted) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' },
        }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative text-center">
          <div className="p-10 lg:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-[24px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20">
              <TrendingUp className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {user.status === 'pending' && (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-warning/10 text-warning border-warning/20">
                      {t.pendingStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">{t.waitingTitle}</h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-8">{t.waitingMessage}</p>
                </>
              )}
              {user.status === 'rejected' && (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-red-500/10 text-red-400 border-red-500/20">
                      {t.rejectedStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">
                    {lang === 'en' ? 'Application Rejected' : 'আবেদন প্রত্যাখ্যান করা হয়েছে'}
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    {user.rejectionNote
                      ? (lang === 'en' ? `Reason: ${user.rejectionNote}` : `কারণ: ${user.rejectionNote}`)
                      : (lang === 'en' ? 'Your affiliate application has been rejected. Contact admin for more information.' : 'আপনার অ্যাফিলিয়েট আবেদন প্রত্যাখ্যান করা হয়েছে। আরও তথ্যের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।')}
                  </p>
                </>
              )}
              {user.status === 'banned' && (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-red-500/10 text-red-400 border-red-500/20">
                      {t.bannedStatus}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">
                    {lang === 'en' ? 'Account Banned' : 'একাউন্ট নিষিদ্ধ করা হয়েছে'}
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-6">
                    {user.banReason || (lang === 'en' ? 'Your account has been banned. Contact admin for details.' : 'আপনার একাউন্ট নিষিদ্ধ করা হয়েছে। বিস্তারিত জানতে অ্যাডমিনের সাথে যোগাযোগ করুন।')}
                  </p>
                </>
              )}
              <div className="flex items-center justify-center gap-2 mb-4">
                <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 text-text-muted hover:text-white transition-all flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {lang === 'en' ? 'বাংলা' : 'English'}
                </button>
              </div>
              <a href="https://t.me/Agent_47VIP" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-[#0088cc] text-white font-black uppercase text-xs tracking-widest hover:bg-[#0088cc]/80 transition-all shadow-xl shadow-[#0088cc]/20 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t.contactAdmin}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link href="/" className="text-text-muted hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">{t.backToHome}</Link>
                <button onClick={async () => {
                  await fetch('/api/affiliate/auth/logout', { method: 'POST' });
                  router.push('/affiliate/login');
                }} className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-widest transition-colors">{t.logout}</button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/affiliate/auth/logout', { method: 'POST' });
    router.push('/affiliate/login');
  };

  return (
    <div className="min-h-screen bg-bg-dark flex text-text-primary">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' },
      }} />

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-dark/95 backdrop-blur-2xl border-t border-white/5 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <button key={item.id} onClick={() => router.push(item.id)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all relative ${isActive ? 'text-white' : 'text-white/30 hover:text-white/60'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary/15' : ''}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : ''}`}>
                  {translations[lang][item.labelKey as keyof typeof translations.en]}
                </span>
                {isActive && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
              </button>
            );
          })}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-white/30 hover:text-white/60 transition-all">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${sidebarOpen ? 'bg-primary/15' : ''}`}>
              <Menu className={`w-4 h-4 ${sidebarOpen ? 'text-primary' : ''}`} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${sidebarOpen ? 'text-primary' : ''}`}>More</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer / Desktop sidebar */}
      <aside className={`${sidebarOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-0 lg:translate-y-0'} fixed inset-x-0 bottom-0 z-50 lg:inset-y-0 lg:inset-auto lg:left-0 lg:relative rounded-t-[32px] lg:rounded-t-none lg:w-72 flex flex-col bg-white/[0.02] border-t lg:border-t-0 lg:border-r border-white/5 min-h-0 lg:min-h-screen flex-shrink-0 transition-transform duration-300 max-h-[85vh] lg:max-h-none overflow-y-auto`}>
        <div className="sticky top-0 bg-white/[0.02] backdrop-blur-2xl p-4 lg:p-6 flex items-center gap-3 lg:gap-4 border-b border-white/5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-xs lg:text-sm font-black tracking-tight leading-tight">Affiliate Hub</p>
                <p className="text-[7px] lg:text-[8px] text-primary font-black uppercase tracking-widest">Partner Program</p>
              </motion.div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <button key={item.id} onClick={() => { router.push(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-3.5 rounded-xl lg:rounded-2xl transition-all group ${isActive ? 'bg-primary/10 text-white border border-primary/20 shadow-lg' : 'text-text-muted hover:bg-white/[0.02] hover:text-text-primary'}`}>
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-white'}`}>
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </div>
                <span className="font-black text-[10px] lg:text-xs uppercase tracking-widest flex-1 text-left">{translations[lang][item.labelKey as keyof typeof translations.en]}</span>
                {isActive && <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="p-2 lg:p-4 space-y-1 lg:space-y-2 border-t border-white/5">
          <div className="p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-xs font-black truncate">{user.fullName}</p>
                <p className="text-[7px] lg:text-[8px] text-text-muted font-bold uppercase tracking-widest truncate">@{user.affiliateCode}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2">
            <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/5 text-text-muted hover:text-white transition-all">
              <Globe className="w-3 h-3" /> {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-3.5 rounded-xl lg:rounded-2xl text-red-500 hover:bg-red-500/5 transition-all font-black text-[10px] lg:text-xs uppercase tracking-widest">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </div>
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pb-[68px] lg:pb-0">
        <main className="flex-1 overflow-y-auto p-3 lg:p-10 bg-[#020617]">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
