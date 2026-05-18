'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CheckCircle2, ChevronRight, Sparkles, Zap, ArrowRight, Gem, BadgeCheck, Globe, X, Star } from 'lucide-react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useVIPPlans, useVIPStats } from '@/hooks/useVIP';

export default function VIPSection() {
  const { data: plans } = useVIPPlans() as any;
  const { data: stats } = useVIPStats();
  const { currentCurrency } = useCurrencyStore();

  const plan = ((plans as any[])?.find((p: any) => p.featured && p.visible)) as any;

  const [showCheckout, setShowCheckout] = useState(false);
  const [pricingMode, setPricingMode] = useState<'starter' | 'premium'>('premium');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  if (!plan) return null;

  const priceBDT = pricingMode === 'starter' ? plan.starterPaymentBDT : plan.discountPriceBDT;
  const priceUSDT = pricingMode === 'starter' ? plan.starterPaymentUSDT : plan.discountPriceUSDT;
  const monthlyBDT = pricingMode === 'starter' ? plan.starterMonthlyBDT : plan.premiumMonthlyBDT;
  const monthlyUSDT = pricingMode === 'starter' ? plan.starterMonthlyUSDT : plan.premiumMonthlyUSDT;
  const startBDT = pricingMode === 'starter' ? plan.starterPaymentBDT : plan.premiumStartBDT;
  const startUSDT = pricingMode === 'starter' ? plan.starterPaymentUSDT : plan.premiumStartUSDT;
  const originalPriceBDT = pricingMode === 'starter' ? plan.officialPriceBDT : plan.regularPriceBDT;
  const originalPriceUSDT = pricingMode === 'starter' ? plan.officialPriceUSDT : plan.regularPriceUSDT;
  const isLimitedOffer = plan.limitedOfferEnabled && plan.limitedOfferSlots > 0 && plan.limitedOfferExpireDate && new Date(plan.limitedOfferExpireDate) > new Date();

  const displayPrice = currentCurrency === 'BDT' ? priceBDT : priceUSDT;
  const displayMonthly = currentCurrency === 'BDT' ? monthlyBDT : monthlyUSDT;
  const displayStart = currentCurrency === 'BDT' ? startBDT : startUSDT;
  const displayOriginal = currentCurrency === 'BDT' ? originalPriceBDT : originalPriceUSDT;
  const displayLimitedPrice = currentCurrency === 'BDT' ? plan.limitedOfferPriceBDT : plan.limitedOfferPriceUSDT;
  const symbol = currentCurrency === 'BDT' ? 'BDT' : 'USDT';
  

  const visibleBullets = ((plan.bulletPoints || []) as any[]).filter((b: any) => b.visible).sort((a: any, b: any) => a.order - b.order);
  const visibleHighlights = ((plan.keyHighlights || []) as any[]).filter((h: any) => h.visible).sort((a: any, b: any) => a.order - b.order);
  const visibleFeatures = ((plan.featureList || []) as any[]).filter((f: any) => f.visible).sort((a: any, b: any) => a.order - b.order);
  const visibleNotices = ((plan.notices || []) as any[]).filter((n: any) => n.visible);
  const visibleFAQs = ((plan.faqs || []) as any[]).filter((f: any) => f.visible).sort((a: any, b: any) => a.order - b.order);

  return (
    <>
      {/* ===== PREMIUM VIP HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-amber-500/10 blur-[250px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* VIP Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 shadow-lg shadow-amber-500/10">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-black uppercase text-[10px] tracking-[3px]">{plan.badgeEn || 'VIP MEMBERSHIP'}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-4">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-3">{plan.titleEn}</h2>
            {plan.subtitleEn && <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto font-medium">{plan.subtitleEn}</p>}
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex justify-center gap-8 mb-8">
              <div className="text-center"><p className="text-3xl font-black text-amber-500">{stats.activeMembers}+</p><p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Active Members</p></div>
              <div className="w-px bg-white/10" />
              <div className="text-center"><p className="text-3xl font-black text-amber-500">{stats.totalRevenueBDT ? `${(stats.totalRevenueBDT / 1000).toFixed(1)}K` : '0'}</p><p className="text-[10px] font-black uppercase tracking-widest text-text-muted">BDT Revenue</p></div>
              <div className="w-px bg-white/10" />
              <div className="text-center"><p className="text-3xl font-black text-amber-500">{stats.totalPayments}</p><p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Payments</p></div>
            </motion.div>
          )}

          {/* Pricing Mode Toggle */}
          {plan.enableInstallments && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex justify-center mb-8">
              <div className="inline-flex p-1 bg-white/5 rounded-2xl border border-white/10">
                <button onClick={() => setPricingMode('starter')}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${pricingMode === 'starter' ? 'bg-amber-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}>Starter Plan</button>
                <button onClick={() => setPricingMode('premium')}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${pricingMode === 'premium' ? 'bg-amber-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}>Premium Discount Plan</button>
              </div>
            </motion.div>
          )}

          {/* Main Pricing Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto mb-12">
            <div className={`p-8 rounded-[40px] border-2 transition-all duration-500 relative ${pricingMode === 'premium' ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/40 shadow-2xl shadow-amber-500/10' : 'bg-white/[0.03] border-white/10'}`}>
              {isLimitedOffer && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Limited Offer
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-white mb-1">{pricingMode === 'starter' ? '🔥 Starter Plan' : '🔥 Premium Discount Plan'}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  {isLimitedOffer ? (
                    <>
                      <span className="text-5xl md:text-6xl font-black text-white">{displayLimitedPrice?.toLocaleString()}</span>
                      <span className="text-text-muted font-bold text-sm">{symbol}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl md:text-6xl font-black text-white">{displayPrice?.toLocaleString()}</span>
                      <span className="text-text-muted font-bold text-sm">{symbol}</span>
                    </>
                  )}
                </div>
                {displayOriginal > 0 && (
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-lg text-text-muted line-through">{displayOriginal?.toLocaleString()} {symbol}</span>
                    <span className="px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-wider">Save {plan.discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Installment Breakdown */}
              {plan.enableInstallments && (
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Flexible Installment</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-white/[0.02]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Start From</p>
                      <p className="text-xl font-black text-white">{displayStart?.toLocaleString()} {symbol}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Then Monthly</p>
                      <p className="text-xl font-black text-white">{displayMonthly?.toLocaleString()} {symbol}</p>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-text-muted mt-3">Due every {plan.dueEveryDays} days • {pricingMode === 'starter' ? '12 months' : '24 months'}</p>
                </div>
              )}

              <button onClick={() => setShowCheckout(true)}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase text-xs tracking-widest hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 group">
                {plan.buttonTextEn || 'Get VIP Access'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Notices */}
          {visibleNotices.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {visibleNotices.map((notice: any, i) => {
                const colors: Record<string, string> = { offer: 'bg-amber-500/10 border-amber-500/20 text-amber-500', info: 'bg-info/10 border-info/20 text-info', warning: 'bg-red-500/10 border-red-500/20 text-red-500' };
                const c = colors[notice.type] || colors.info;
                return (
                  <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                    className={`px-5 py-3 rounded-2xl border ${c} text-xs font-bold tracking-wide flex items-center gap-2`}>
                    {notice.type === 'offer' && <Sparkles className="w-4 h-4" />}
                    {notice.type === 'warning' && <Zap className="w-4 h-4" />}
                    {notice.type === 'info' && <InfoIcon />}
                    {notice.textEn}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== VIP DETAILS SECTION ===== */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">

          {/* Highlights */}
          {visibleHighlights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4">
              {visibleHighlights.map((h: any) => (
                <div key={h.id} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  <BadgeCheck className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-white">{h.textEn}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Bullet Points */}
          {visibleBullets.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl font-black tracking-tighter text-center text-white mb-8">Everything You Get</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-5xl mx-auto">
                {visibleBullets.map((bullet: any) => (
                  <div key={bullet.id} className={`p-5 rounded-2xl flex items-start gap-4 ${bullet.highlighted ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-white/[0.02] border border-white/5'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${bullet.highlighted ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white/40'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${bullet.highlighted ? 'text-amber-500' : 'text-white'}`}>{bullet.textEn}</p>
                      {bullet.textBn && <p className="text-xs text-text-muted mt-0.5">{bullet.textBn}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {visibleFeatures.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl font-black tracking-tighter text-center text-white mb-8">What&apos;s Included</h3>
              <div className="max-w-4xl mx-auto space-y-3">
                {visibleFeatures.map((feature: any) => (
                  <div key={feature.id} className={`p-5 rounded-2xl flex items-center gap-4 ${feature.highlighted ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-white/[0.02] border border-white/5'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.highlighted ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white/40'}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-base font-bold ${feature.highlighted ? 'text-amber-500' : 'text-white'}`}>{feature.textEn}</p>
                      {feature.textBn && <p className="text-xs text-text-muted">{feature.textBn}</p>}
                    </div>
                    {feature.highlighted && <Star className="w-5 h-5 text-amber-500" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAQs */}
          {visibleFAQs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-black tracking-tighter text-center text-white mb-8">FAQ</h3>
              <div className="space-y-3">
                {visibleFAQs.map((faq: any) => (
                  <div key={faq.id} className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <button onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full p-5 flex items-center justify-between text-left">
                      <span className="text-sm font-bold text-white pr-4">{faq.qEn}</span>
                      <ChevronRight className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${expandedFAQ === faq.id ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">{faq.aEn}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Telegram CTA */}
          {plan.telegramLink && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center">
              <a href={plan.telegramLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] font-black uppercase text-xs tracking-widest hover:bg-[#0088cc] hover:text-white transition-all">
                <SendIcon /> Join Our Telegram
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <VIPCheckoutModal plan={plan} pricingMode={pricingMode} onClose={() => setShowCheckout(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function InfoIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
}

function SendIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>;
}

function VIPCheckoutModal({ plan, pricingMode, onClose }: { plan: any; pricingMode: string; onClose: () => void }) {
  const { currentCurrency } = useCurrencyStore();
  const [step, setStep] = useState<'form' | 'instructions'>('form');
  const [form, setForm] = useState({ userName: '', phoneNumber: '', telegramUsername: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const startPrice = currentCurrency === 'BDT'
    ? (pricingMode === 'starter' ? plan.starterPaymentBDT : plan.premiumStartBDT)
    : (pricingMode === 'starter' ? plan.starterPaymentUSDT : plan.premiumStartUSDT);
  const symbol = currentCurrency === 'BDT' ? 'BDT' : 'USDT';

  const handleSubmit = async () => {
    if (!form.userName || !form.phoneNumber) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/vip/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pricingMode,
          transactionId: `MANUAL-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');

      localStorage.setItem('vip-auth-session', JSON.stringify({
        memberId: data.memberId,
        accessCode: data.accessCode,
        membershipId: data.membershipId,
        userName: data.userName,
        status: data.status,
      }));

      setResult(data);
      setStep('instructions');

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.location.href = '/dashboard';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#020617] rounded-[48px] border border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="text-2xl font-black tracking-tight">VIP Access</h3>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{pricingMode === 'starter' ? 'Starter Plan' : 'Premium Discount Plan'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {step === 'form' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-500 font-bold text-center text-2xl">{startPrice?.toLocaleString()} {symbol}</p>
              {plan.enableInstallments && (
                <p className="text-center text-xs text-text-muted mt-1">
                  Start from {startPrice?.toLocaleString()} {symbol} + monthly installments
                </p>
              )}
            </div>

            <input type="text" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} placeholder="Your Name *" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm" />
            <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Phone Number *" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm" />
            <input type="text" value={form.telegramUsername} onChange={(e) => setForm({ ...form, telegramUsername: e.target.value })} placeholder="Telegram Username" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm" />

            <div className="p-4 rounded-2xl bg-info/10 border border-info/20">
              <p className="text-info text-xs font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                After submitting, you will get dashboard access to track your membership.
              </p>
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase text-xs tracking-widest hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50">
              {submitting ? 'Processing...' : `Get VIP Access — ${startPrice?.toLocaleString()} ${symbol}`}
            </button>
          </div>
        )}

        {step === 'instructions' && result && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              <h4 className="text-xl font-black text-success mb-1">Membership Created!</h4>
              <p className="text-sm text-text-muted">Your membership ID: <span className="text-amber-500 font-black">{result.membershipId}</span></p>
              <p className="text-xs text-text-muted mt-1">Save your Access Code: <span className="text-amber-500 font-black">{result.accessCode}</span></p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Payment Required</p>
              <p className="text-sm text-white font-bold mb-3">
                Send {startPrice?.toLocaleString()} {symbol} to activate
              </p>
              {plan.telegramLink && (
                <a href={plan.telegramLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] text-xs font-bold hover:bg-[#0088cc] hover:text-white transition-all">
                  <SendIcon /> Contact Admin on Telegram
                </a>
              )}
            </div>
            <a href="/dashboard"
              className="block w-full py-4 rounded-2xl bg-white text-bg-dark font-black uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-white transition-all text-center">
              Go to Dashboard ({redirectCountdown}s)
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
