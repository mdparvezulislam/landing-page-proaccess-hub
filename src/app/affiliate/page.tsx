'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, DollarSign, Users, Gift, CheckCircle2, ArrowRight,
  Copy, Star, Shield, Zap, BarChart3, Wallet, TicketPercent,
  Crown, ChevronRight, Percent, MousePointerClick, Award, Globe,
  LucideIcon,
} from 'lucide-react';
import { translations, Lang } from '@/lib/affiliateLang';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function AffiliateLandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 lg:pt-40 pb-20 lg:pb-32 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                  <Award className="w-4 h-4" /> Affiliate Program
                </motion.div>
                <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-all flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {lang === 'en' ? 'বাংলা' : 'English'}
                </button>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6">
                Earn{' '}
                <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                  20% Commission
                </span>
                <br />
                on Every Sale
              </h1>
              <p className="text-lg lg:text-xl text-text-muted mb-8 max-w-lg leading-relaxed">
                Join the Pro Access VIP affiliate program and earn generous commissions by sharing your unique referral link with your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/affiliate/register"
                  className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 group">
                  Become an Affiliate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/affiliate/login"
                  className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/10">
                  Sign In <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative">
              <div className="p-8 lg:p-10 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
                <div className="text-center mb-8">
                  <p className="text-5xl lg:text-7xl font-black text-success">20%</p>
                  <p className="text-lg text-text-muted font-bold uppercase tracking-widest mt-2">Commission Rate</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-sm text-text-muted">VIP Plan Price</span>
                    <span className="text-lg font-black">$100</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-success/5 border border-success/10">
                    <span className="text-sm text-text-muted">Buyer Pays (5% off)</span>
                    <span className="text-lg font-black text-success">$95</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <span className="text-sm text-text-muted">You Earn</span>
                    <span className="text-lg font-black text-primary">$20</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Per referral — unlimited earnings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Commission Rate', value: '20%', icon: Percent },
              { label: 'Buyer Discount', value: '5%', icon: Gift },
              { label: 'Payout Methods', value: '3', icon: Wallet },
              { label: 'Min. Withdrawal', value: '$5', icon: DollarSign },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 lg:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">How It Works</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">Three simple steps to start earning commissions</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your affiliate account in seconds. No approval needed — get started immediately.', icon: Users },
              { step: '02', title: 'Share Your Link', desc: 'Get a unique referral link and coupon code. Share them on social media, YouTube, Telegram, or your blog.', icon: ShareIcon },
              { step: '03', title: 'Earn Commissions', desc: 'When someone buys using your link or coupon, you earn 20% commission. Track everything in real-time.', icon: DollarSign },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
                  className="p-8 lg:p-10 rounded-[32px] bg-white/[0.02] border border-white/5 relative group hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                  <div className="text-6xl lg:text-8xl font-black text-white/[0.03] absolute top-4 right-6 leading-none select-none">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 relative z-10">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 relative z-10">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed relative z-10">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 lg:py-32 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">Why Become an Affiliate?</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">Everything you need to succeed as a partner</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '20% Commission', desc: 'Earn 20% on every sale you refer. No caps, no limits.', icon: TrendingUp, color: 'text-success' },
              { title: 'Real-Time Dashboard', desc: 'Track clicks, conversions, and earnings in real-time.', icon: BarChart3, color: 'text-primary' },
              { title: 'Unique Coupon Code', desc: 'Get a personalized coupon to share with your audience.', icon: TicketPercent, color: 'text-secondary' },
              { title: 'Instant Payouts', desc: 'Withdraw your earnings via Binance, bKash, or Nagad.', icon: Wallet, color: 'text-amber-500' },
              { title: 'Referral Link', desc: 'Your own unique trackable link for unlimited sharing.', icon: LinkIcon, color: 'text-info' },
              { title: 'Dedicated Support', desc: 'Get help from our team whenever you need it.', icon: Shield, color: 'text-primary' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                  className="p-6 lg:p-8 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                  <div className={`w-12 h-12 rounded-2xl ${feature.color}/10 flex items-center justify-center mb-4 border border-white/5`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-black mb-2">{feature.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COMMISSION TABLE ═══ */}
      <section className="py-24 lg:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">Commission Structure</h2>
            <p className="text-text-muted text-lg">Simple and transparent pricing for everyone</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              <div className="p-6 lg:p-8 bg-primary/5 border-b border-r border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Product</p>
              </div>
              <div className="p-6 lg:p-8 bg-primary/5 border-b border-r border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">You Earn</p>
              </div>
              <div className="p-6 lg:p-8 bg-primary/5 border-b border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Buyer Pays</p>
              </div>
              {[
                { product: 'VIP Plan ($100)', earn: '$20', buyer: '$95' },
                { product: 'VIP Plan ($200)', earn: '$40', buyer: '$190' },
                { product: 'Products (varies)', earn: '20%', buyer: '5% off' },
              ].map((row, idx) => (
                <React.Fragment key={idx}>
                  <div className={`p-6 lg:p-8 ${idx < 2 ? 'border-b' : ''} border-r border-white/5`}>
                    <p className="font-bold">{row.product}</p>
                  </div>
                  <div className={`p-6 lg:p-8 ${idx < 2 ? 'border-b' : ''} border-r border-white/5 text-center`}>
                    <p className="font-bold text-success">{row.earn}</p>
                  </div>
                  <div className={`p-6 lg:p-8 ${idx < 2 ? 'border-b' : ''} text-center`}>
                    <p className="font-bold text-primary">{row.buyer}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 lg:py-32 px-4 bg-white/[0.01] border-y border-white/5">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">Frequently Asked Questions</h2>
            <p className="text-text-muted text-lg">Everything you need to know about the affiliate program</p>
          </motion.div>

          <div className="space-y-3">
            {[
              { q: 'How do I become an affiliate?', a: 'Simply register through our sign-up page. Once approved, you\'ll get your unique referral link and coupon code to start promoting immediately.' },
              { q: 'How much commission do I earn?', a: 'You earn 20% commission on every sale made through your referral link or coupon code. Your buyers also get a 5% discount.' },
              { q: 'When do I get paid?', a: 'Commissions are credited as pending when the sale is completed. Once an admin approves the commission, it becomes available for withdrawal in your wallet.' },
              { q: 'What are the payout methods?', a: 'We support Binance, bKash, and Nagad. You can add your account details in your affiliate settings.' },
              { q: 'Is there a minimum withdrawal?', a: 'Yes, the minimum withdrawal amount is $5. There is no maximum limit.' },
              { q: 'Can I share my referral link anywhere?', a: 'Yes! Share it on social media, YouTube, Telegram groups, blogs, or anywhere your audience is. Just follow ethical marketing practices.' },
            ].map((faq, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === `aff-${idx}` ? null : `aff-${idx}`)}
                  className="w-full p-5 lg:p-6 flex items-center justify-between text-left">
                  <span className="text-sm lg:text-base font-bold pr-4">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${expandedFaq === `aff-${idx}` ? 'rotate-90' : ''}`} />
                </button>
                {expandedFaq === `aff-${idx}` && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                    <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-sm text-text-muted leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 lg:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="p-10 lg:p-16 rounded-[40px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
            <div className="relative z-10">
              <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">Ready to Start Earning?</h2>
              <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">Join hundreds of affiliates earning 20% commission on every sale. Sign up in minutes.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/affiliate/register"
                  className="inline-flex items-center gap-3 px-10 py-6 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/20 group text-base">
                  Get Started Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/affiliate/login"
                  className="inline-flex items-center gap-3 px-10 py-6 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all border border-white/10 text-base">
                  Existing Affiliate? Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-muted">© {new Date().getFullYear()} Pro Access VIP. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-[10px] text-text-muted hover:text-white font-bold uppercase tracking-widest transition-colors">Terms</Link>
              <Link href="/privacy" className="text-[10px] text-text-muted hover:text-white font-bold uppercase tracking-widest transition-colors">Privacy</Link>
              <Link href="/" className="text-[10px] text-text-muted hover:text-white font-bold uppercase tracking-widest transition-colors">Home</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
