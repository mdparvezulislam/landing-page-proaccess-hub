'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAffiliateLogin, useAffiliateMe } from '@/hooks/useAffiliate';
import { Eye, EyeOff, ArrowRight, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { translations, Lang } from '@/lib/affiliateLang';

export default function AffiliateLoginPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAffiliateLogin();
  const { data: meData } = useAffiliateMe();
  const router = useRouter();
  const t = translations[lang];

  useEffect(() => {
    if (meData?.user) {
      const status = meData.user.status;
      if (status === 'pending' || status === 'rejected') {
        router.push('/affiliate');
      } else if (status === 'active') {
        router.push('/affiliate/dashboard');
      }
    }
  }, [meData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(lang === 'en' ? 'Please fill in all fields' : 'অনুগ্রহ করে সকল ফিল্ড পূরণ করুন');
      return;
    }
    try {
      const result = await login.mutateAsync({ email, password });
      if (result.success) {
        const status = result.user.status;
        if (status === 'pending') {
          toast.success(lang === 'en' ? 'Account pending approval' : 'একাউন্ট অনুমোদনের অপেক্ষায়');
          router.push('/affiliate');
        } else if (status === 'rejected') {
          toast.error(lang === 'en' ? 'Your application was rejected' : 'আপনার আবেদন প্রত্যাখ্যান করা হয়েছে');
          router.push('/affiliate');
        } else {
          toast.success(t.welcomeBack);
          router.push('/affiliate/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || (lang === 'en' ? 'Login failed' : 'লগইন ব্যর্থ'));
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
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
          <p className="text-text-muted text-sm font-medium">{t.signIn}</p>

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{t.password}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.minChars}
                  className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={login.isPending}
              className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50">
              {login.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>{t.signIn} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs font-medium">
              {t.noAccount}{' '}
              <Link href="/affiliate/register" className="text-primary hover:text-primary-light font-bold transition-colors">{t.registerHere}</Link>
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
