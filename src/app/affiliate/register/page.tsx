'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAffiliateRegister } from '@/hooks/useAffiliate';
import { Eye, EyeOff, ArrowRight, TrendingUp, Check, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { translations, Lang } from '@/lib/affiliateLang';

export default function AffiliateRegisterPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState({
    fullName: '', email: '', telegramUsername: '', password: '',
    confirmPassword: '', promotionMethod: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const register = useAffiliateRegister();
  const router = useRouter();
  const t = translations[lang];

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
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative text-center"
        >
          <div className="p-10 lg:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 rounded-[24px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20"
            >
              <TrendingUp className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">{t.waitingTitle}</h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">{t.waitingMessage}</p>
              <a
                href="https://t.me/Agent_47VIP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-[#0088cc] text-white font-black uppercase text-xs tracking-widest hover:bg-[#0088cc]/80 transition-all shadow-xl shadow-[#0088cc]/20 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                {t.contactAdmin}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="mt-8">
                <Link href="/" className="text-text-muted hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">{t.backToHome}</Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20"
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">{t.becomeAffiliate}</h1>
          <p className="text-text-muted text-sm font-medium">{t.earnCommission}</p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:text-white'}`}>
              EN
            </button>
            <button onClick={() => setLang('bn')}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === 'bn' ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:text-white'}`}>
              বাংলা
            </button>
          </div>
        </div>

        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.fullName}</label>
              <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder={t.fullName}
                className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.email}</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com"
                className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.telegram}</label>
              <input value={form.telegramUsername} onChange={(e) => update('telegramUsername', e.target.value)} placeholder="@username"
                className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.promotionMethod}</label>
              <textarea value={form.promotionMethod} onChange={(e) => update('promotionMethod', e.target.value)}
                placeholder={t.promotionPlaceholder}
                className="admin-input w-full min-h-[80px] text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.password}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder={t.minChars}
                  className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.confirmPassword}</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder={t.repeatPassword}
                className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{t.whatYouGet}</p>
              <ul className="space-y-1.5">
                {[t.feature1, t.feature2, t.feature3, t.feature4].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-text-muted">
                    <Check className="w-3 h-3 text-success" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <button type="submit" disabled={register.isPending}
              className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
              {register.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{t.register} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs font-medium">
              {t.alreadyAccount}{' '}
              <Link href="/affiliate/login" className="text-primary hover:text-primary-light font-bold transition-colors">{t.signInHere}</Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-text-muted hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">{t.backToHomeBtn}</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
