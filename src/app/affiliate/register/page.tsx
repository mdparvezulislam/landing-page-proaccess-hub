'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAffiliateRegister } from '@/hooks/useAffiliate';
import { Eye, EyeOff, ArrowRight, TrendingUp, Check, Globe, Loader2, DollarSign, Users, Gift, Percent, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { translations, Lang } from '@/lib/affiliateLang';

export default function AffiliateRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

const benefits = [
  { icon: Percent, text: 'Earn 10–50% commission on every sale' },
  { icon: Gift, text: 'Your buyers get 5–15% discount coupon' },
  { icon: DollarSign, text: 'Withdraw as low as $2.50 via Binance, bKash, Nagad' },
  { icon: Users, text: 'Unlimited referrals — no caps, no limits' },
  { icon: Shield, text: 'Real-time dashboard & analytics' },
  { icon: Star, text: 'Dedicated support via Telegram' },
];

function RegisterForm() {
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState({
    fullName: '', email: '', telegramUsername: '', password: '',
    confirmPassword: '', promotionMethod: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [referredBy, setReferredBy] = useState('');
  const register = useAffiliateRegister();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = translations[lang];

  useEffect(() => {
    const ref = searchParams.get('ref');
    const coupon = searchParams.get('coupon');
    if (ref) {
      setReferredBy(ref);
      document.cookie = `affiliate_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      localStorage.setItem('affiliate_ref', ref);
    } else {
      const stored = typeof window !== 'undefined'
        ? document.cookie.replace(/(?:(?:^|.*;\s*)affiliate_ref\s*\=\s*([^;]*).*$)|^.*$/, "$1") || localStorage.getItem('affiliate_ref') || ''
        : '';
      if (stored) setReferredBy(stored);
    }
    if (coupon) {
      document.cookie = `affiliate_coupon=${coupon}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      localStorage.setItem('affiliate_coupon', coupon);
    }
  }, [searchParams]);

  const update = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error(lang === 'en' ? 'Full name, email, and password are required' : 'পূর্ণ নাম, ইমেইল এবং পাসওয়ার্ড প্রয়োজন');
      return;
    }
    if (form.password.length < 6) {
      toast.error(lang === 'en' ? 'Password must be at least 6 characters' : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error(lang === 'en' ? 'Passwords do not match' : 'পাসওয়ার্ড মিলছে না');
      return;
    }
    try {
      const result = await register.mutateAsync({
        fullName: form.fullName,
        email: form.email,
        telegramUsername: form.telegramUsername,
        password: form.password,
        promotionMethod: form.promotionMethod,
        referredBy,
      });
      if (result.success) {
        setRegistered(true);
        toast.success(lang === 'en' ? 'Registration successful! Your account is pending approval.' : 'রেজিস্ট্রেশন সফল! আপনার একাউন্ট অনুমোদনের অপেক্ষায় রয়েছে।');
      }
    } catch (err: any) {
      toast.error(err.message || (lang === 'en' ? 'Registration failed' : 'রেজিস্ট্রেশন ব্যর্থ'));
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 lg:p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl relative text-center">
          <div className="p-12 lg:p-20 rounded-[48px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/20">
              <TrendingUp className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4 text-white">{t.waitingTitle}</h2>
              <p className="text-white/60 text-base lg:text-lg leading-relaxed mb-10 max-w-lg mx-auto">{t.waitingMessage}</p>
              <a href="https://t.me/Agent_47VIP" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-6 rounded-2xl bg-[#0088cc] text-white font-black uppercase text-sm tracking-widest hover:bg-[#0088cc]/80 transition-all shadow-2xl shadow-[#0088cc]/20 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t.contactAdmin}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="mt-10">
                <Link href="/" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">{t.backToHome}</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 min-h-screen w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full rounded-[32px] lg:rounded-[48px] bg-white/[0.015] border border-white/5 backdrop-blur-2xl overflow-hidden">

          {/* ─── MOBILE HEADER (above both columns) ─── */}
          <div className="lg:hidden p-6 sm:p-8 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                  EN
                </button>
                <button onClick={() => setLang('bn')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'bn' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                  বাংলা
                </button>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white mb-1">{t.becomeAffiliate}</h1>
            <p className="text-white/50 text-sm font-medium">{t.earnCommission}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh] lg:min-h-0">

            {/* ─── LEFT: FORM ─── */}
            <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
              <div className="w-full max-w-xl mx-auto lg:mx-0">
                {/* Header — visible on lg+ only */}
                <div className="hidden lg:flex items-center justify-between mb-12">
                  <div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20 mb-5">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </motion.div>
                    <h1 className="text-5xl xl:text-6xl font-black tracking-tighter text-white mb-2">{t.becomeAffiliate}</h1>
                    <p className="text-white/50 text-base font-medium">{t.earnCommission}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setLang('en')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                      EN
                    </button>
                    <button onClick={() => setLang('bn')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'bn' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}>
                      বাংলা
                    </button>
                  </div>
                </div>

                {/* Referral badge */}
                {referredBy && (
                  <div className="mb-6 lg:mb-8 p-4 lg:p-5 rounded-2xl bg-success/5 border border-success/10 flex items-center gap-3">
                    <Users className="w-5 h-5 text-success shrink-0" />
                    <p className="text-white text-sm lg:text-base font-semibold">
                      Referred by affiliate code: <span className="text-success font-black uppercase tracking-wider">{referredBy}</span>
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.fullName}</label>
                      <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder={t.fullName}
                        className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.email}</label>
                      <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com"
                        className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.telegram}</label>
                      <input value={form.telegramUsername} onChange={(e) => update('telegramUsername', e.target.value)} placeholder="@username"
                        className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.password}</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder={t.minChars}
                          className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all pr-14" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.confirmPassword}</label>
                      <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder={t.repeatPassword}
                        className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/50 text-[10px] font-black uppercase tracking-[2px] ml-1">{t.promotionMethod}</label>
                      <input value={form.promotionMethod} onChange={(e) => update('promotionMethod', e.target.value)}
                        placeholder={t.promotionPlaceholder}
                        className="w-full px-5 py-4 lg:px-6 lg:py-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm lg:text-base placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                  </div>

                  <div className="p-5 lg:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-[2px] mb-3">{t.whatYouGet}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[t.feature1, t.feature2, t.feature3, t.feature4].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                          <Check className="w-4 h-4 text-success shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button type="submit" disabled={register.isPending}
                    className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white py-5 lg:py-6 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 group">
                    {register.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>{t.register} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>

                <div className="mt-6 lg:mt-8 flex items-center justify-center gap-6">
                  <p className="text-white/40 text-sm font-medium">
                    {t.alreadyAccount}{' '}
                    <Link href="/affiliate/login" className="text-primary hover:text-primary-light font-bold transition-colors">{t.signInHere}</Link>
                  </p>
                  <span className="text-white/10 hidden sm:inline">|</span>
                  <Link href="/" className="text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">{t.backToHomeBtn}</Link>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: BENEFITS PANEL ─── */}
            <div className="relative order-1 lg:order-2 min-h-[300px] lg:min-h-full bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.03] border-b lg:border-b-0 lg:border-l border-white/5 p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/[0.03] to-transparent pointer-events-none" />
              <div className="relative z-10 w-full max-w-xl mx-auto lg:mx-0">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
                    <Star className="w-4 h-4" /> Why Join?
                  </div>
                  <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white mb-3">
                    Start Earning <br />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Today</span>
                  </h2>
                  <p className="text-white/40 text-base lg:text-lg mb-10 max-w-md">
                    Join hundreds of affiliates earning up to 50% commission on every sale. Zero fees, instant payouts.
                  </p>

                  <div className="space-y-4 lg:space-y-5">
                    {benefits.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.08 }}
                          className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all group">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                          </div>
                          <p className="text-white text-sm lg:text-base font-semibold leading-relaxed pt-1.5">{item.text}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
