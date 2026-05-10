'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useSettings } from '@/hooks/useCMS';
import {
  CheckCircle2,
  Copy,
  Send,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Check,
  Wallet,
  Zap,
  ChevronRight,
  Info,
  Smartphone,
  Lock,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { useCurrencyStore } from '@/store/useCurrencyStore';

export default function CheckoutPage() {
  const { language, selectedOrderContext } = useStore();
  const { convertPrice, currentCurrency } = useCurrencyStore();
  const { data: siteData, isLoading: settingsLoading } = useSettings();
  const router = useRouter();

  const paymentSettings = siteData?.paymentSettings || {
    instructionTitleEn: "Payment Instructions",
    instructionTitleBn: "পেমেন্ট নির্দেশাবলী",
    instructionsEn: [],
    instructionsBn: [],
    warningTextEn: "",
    warningTextBn: "",
  };
  
  const enabledMethods = (paymentSettings.methods || []).filter((m: any) => m.enabled).sort((a: any, b: any) => a.order - b.order);
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  
  useEffect(() => {
    if (enabledMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(enabledMethods[0].id);
    }
  }, [enabledMethods, selectedMethodId]);

  const selectedMethod = enabledMethods.find((m: any) => m.id === selectedMethodId) || enabledMethods[0];

  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    transactionId: '',
    screenshot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const t = (en: string, bn: string) => language === 'en' ? (en || '') : (bn || '');

  useEffect(() => {
    setIsHydrated(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isHydrated && !selectedOrderContext) {
      const timer = setTimeout(() => {
        if (!selectedOrderContext) router.push('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedOrderContext, router, isHydrated]);

  if (!isHydrated || settingsLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
    </div>
  );

  if (!selectedOrderContext) {
    return (
      <div className="min-h-screen pt-20 pb-20 bg-[#020617] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-10 border border-white/10 rotate-12 shadow-2xl">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">{t('No Package Selected', 'প্যাকেজ পাওয়া যায়নি')}</h1>
        <Link href="/" className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all glow-btn">
          {t('View VIP Packages', 'ভিআইপি প্যাকেজ দেখুন')}
        </Link>
      </div>
    );
  }

  const { product, plan } = selectedOrderContext;
  const { amount, currency } = isHydrated ? convertPrice(plan.priceTk) : { amount: plan.priceTk, currency: 'BDT' };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.telegram || !formData.transactionId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.titleEn,
          plan: plan.nameEn,
          amount: plan.priceTk,
          customerName: formData.name,
          telegramUsername: formData.telegram.replace('@', ''),
          paymentNumber: selectedMethod?.number || '',
          transactionId: formData.transactionId,
          screenshotUrl: formData.screenshot || '',
          status: 'Pending',
        }),
      });

      if (res.ok) {
        setOrderComplete(true);
        toast.success('Payment details submitted successfully!');
      } else {
        toast.error('Failed to submit order');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 lg:pt-32 pb-10 bg-[#020617] selection:bg-primary/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-1 lg:px-6 max-w-7xl">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 transition-all group font-black uppercase text-[10px] tracking-[2px] ml-2">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('Back', 'পিছনে')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-12 items-start">

          {/* Left: Summary & Payment */}
          <div className="lg:col-span-7 space-y-2 lg:space-y-8">
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl lg:rounded-[40px] p-3 lg:p-10 border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-10 pb-4 lg:pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-lg lg:text-3xl font-black tracking-tighter">{t('Secure Checkout', 'নিরাপদ চেকআউট')}</h2>
                  <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] mt-1">{t('Elite Membership', 'এলিট মেম্বারশিপ')}</p>
                </div>
                <div className="flex items-center gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-xl bg-success/10 border border-success/20 text-success text-[8px] lg:text-[10px] font-black uppercase tracking-[2px]">
                  <Lock className="w-3 lg:w-3.5 h-3 lg:h-3.5" /> {t('Verified', 'ভেরিফাইড')}
                </div>
              </div>

              <div className="flex flex-row justify-between items-center gap-4 bg-white/[0.02] p-3 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 lg:gap-6">
                  <div className="w-12 lg:w-20 h-12 lg:h-20 rounded-xl lg:rounded-[28px] bg-white/5 border border-white/10 p-0.5 flex-shrink-0">
                    <img src={product.image} className="w-full h-full object-cover rounded-lg lg:rounded-[20px]" alt={t(product.titleEn, product.titleBn)} />
                  </div>
                  <div>
                    <h3 className="text-sm lg:text-2xl font-black text-text-primary tracking-tighter mb-0.5">{t(product.titleEn, product.titleBn)}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-primary/20 text-primary-light text-[8px] font-black uppercase tracking-widest border border-primary/20">
                        {t(plan.nameEn, plan.nameBn)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-xl lg:text-5xl font-black text-text-primary tracking-tighter flex items-baseline gap-0.5">
                    {amount} <span className="text-[10px] lg:text-lg opacity-40 uppercase">{currency}</span>
                  </span>
                  {currentCurrency === 'USDT' && (
                    <span className="text-[8px] lg:text-sm font-black text-white/20 uppercase tracking-tighter">
                      ({plan.priceTk} BDT)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Methods Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl lg:rounded-[40px] p-3 lg:p-10 border-white/5 shadow-2xl"
            >
              <div className="mb-4 lg:mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg lg:text-3xl font-black tracking-tighter mb-0.5">{t('Payment Method', 'পেমেন্ট মেথড')}</h2>
                  <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px]">{t('Select channel', 'মাধ্যম বেছে নিন')}</p>
                </div>
                <CreditCard className="w-6 lg:w-10 h-6 lg:h-10 text-white/5" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:gap-5 mb-4 lg:mb-12">
                {enabledMethods.map((method: any) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`relative p-3 lg:p-6 rounded-xl lg:rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-2 lg:gap-4 ${selectedMethodId === method.id
                      ? 'border-primary bg-primary/[0.05]'
                      : 'border-white/5 bg-white/[0.02]'
                      }`}
                  >
                    <div className={`w-8 lg:w-14 h-8 lg:h-14 rounded-xl flex items-center justify-center transition-all ${selectedMethodId === method.id ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}>
                      <Wallet className="w-4 lg:w-7 h-4 lg:h-7" />
                    </div>
                    <div className="text-center">
                      <span className="block font-black text-[10px] lg:text-base uppercase tracking-tighter">{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedMethod && (
                  <motion.div
                    key={selectedMethod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 lg:space-y-8"
                  >
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl lg:rounded-[40px] p-4 lg:p-10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 lg:w-2 h-full" style={{ backgroundColor: selectedMethod.color }} />
                      <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-10">
                        <div className="flex-1 w-full text-center md:text-left">
                          <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[3px] mb-2">{selectedMethod.name} {t('RECEIVER NUMBER', 'রিসিভার নম্বর')}</p>
                          <div className="flex items-center justify-center md:justify-start gap-4 lg:gap-6">
                            <span className="text-2xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none">{selectedMethod.number}</span>
                            <button
                              onClick={() => handleCopy(selectedMethod.number)}
                              className="w-10 lg:w-14 h-10 lg:h-14 rounded-xl bg-white/5 hover:bg-primary hover:text-white text-text-muted transition-all flex items-center justify-center border border-white/10"
                            >
                              <Copy className="w-4 lg:w-5 h-4 lg:h-5" />
                            </button>
                          </div>
                          <div className="mt-4 lg:mt-6 flex items-center justify-center md:justify-start gap-2 text-[10px] lg:text-sm font-black text-text-muted">
                            <Smartphone className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
                            <span className="uppercase tracking-[2px]">{t('TYPE', 'টাইপ')}:</span>
                            <span className="text-text-primary">{t(selectedMethod.accountTypeEn, selectedMethod.accountTypeBn)}</span>
                          </div>
                        </div>
                        {selectedMethod.qrCode && (
                          <div className="w-28 lg:w-40 h-28 lg:h-40 bg-white p-2 lg:p-4 rounded-2xl lg:rounded-[32px] flex-shrink-0 shadow-2xl border-2 lg:border-4 border-primary/20">
                            <img src={selectedMethod.qrCode} alt="QR" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8">
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-[9px] lg:text-[11px] font-black text-text-primary uppercase tracking-[2px]">
                          <Info className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
                          {t(paymentSettings.instructionTitleEn || 'How to Pay?', paymentSettings.instructionTitleBn || 'কিভাবে পেমেন্ট করবেন?')}
                        </h4>
                        <div className="space-y-1 lg:space-y-4">
                          {(selectedMethod.instructionsEn || (paymentSettings.instructionsEn?.[0]) || '').split('\n').map((inst: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 p-3 lg:p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <span className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[9px] lg:text-[10px] font-black text-primary flex-shrink-0">{i + 1}</span>
                              <p className="text-[11px] lg:text-base font-bold text-text-secondary">
                                {t(inst, (selectedMethod.instructionsBn || '').split('\n')[i] || (paymentSettings.instructionsBn?.[0] || '').split('\n')[i])}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-[9px] lg:text-[11px] font-black text-text-primary uppercase tracking-[2px]">
                          <AlertCircle className="w-4 lg:w-5 h-4 lg:h-5 text-warning" />
                          {t('Warning', 'সতর্কবার্তা')}
                        </h4>
                        <div className="p-4 lg:p-8 rounded-2xl lg:rounded-[32px] bg-warning/5 border border-warning/10 border-dashed">
                          <p className="text-[11px] lg:text-sm text-warning/80 font-bold leading-relaxed">
                            {t(selectedMethod.warningTextEn || paymentSettings.warningTextEn, selectedMethod.warningTextBn || paymentSettings.warningTextBn)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Verification Form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl lg:rounded-[40px] p-4 lg:p-10 border-white/5 shadow-2xl bg-white/[0.01] sticky top-24 lg:top-32"
            >
              <div className="mb-4 lg:mb-10">
                <h2 className="text-lg lg:text-3xl font-black tracking-tighter mb-1">{t('Verify Order', 'অর্ডার যাচাই')}</h2>
                <p className="text-[9px] lg:text-[10px] text-text-muted font-bold uppercase tracking-[2px]">
                  {t('Fill details for access', 'অ্যাক্টিভেট করতে ফর্মটি পূরণ করুন')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-8">
                <div className="space-y-1.5">
                  <label className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{t('Name', 'নাম')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black text-sm lg:text-base"
                    placeholder="Ahmed Shuvo"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{t('Telegram', 'টেলিগ্রাম')}</label>
                  <div className="relative">
                    <span className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 text-primary font-black">@</span>
                    <input
                      type="text"
                      required
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl pl-10 lg:pl-12 pr-4 lg:pr-6 py-3 lg:py-5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black text-sm lg:text-base"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{t('Transaction ID', 'ট্রানজেকশন আইডি')}</label>
                  <input
                    type="text"
                    required
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-5 text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black uppercase text-sm lg:text-base tracking-[1px]"
                    placeholder="TRX12345"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-primary text-white font-black py-4 lg:py-6 rounded-xl lg:rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('Activate VIP', 'মেম্বারশিপ নিশ্চিত')}
                      <ChevronRight className="w-5 lg:w-6 h-5 lg:h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 py-3 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <p className="text-[8px] lg:text-[9px] text-text-muted uppercase font-black tracking-[2px]">
                    {t('SECURE PAYMENT', 'নিরাপদ পেমেন্ট')}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 lg:p-4 bg-bg-dark/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg glass-card rounded-[32px] lg:rounded-[60px] p-6 lg:p-16 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-16 lg:w-28 h-16 lg:h-28 rounded-2xl lg:rounded-3xl bg-success/10 flex items-center justify-center mx-auto mb-6 lg:mb-10 border border-success/20">
                <CheckCircle2 className="w-8 lg:w-16 h-8 lg:h-16 text-success" />
              </div>
              <h2 className="text-2xl lg:text-5xl font-black text-text-primary mb-2 lg:mb-6 tracking-tighter">
                {t('Verified!', 'সাফল্য!')}
              </h2>
              <p className="text-xs lg:text-lg text-text-secondary mb-8 lg:mb-12 font-black uppercase tracking-widest leading-relaxed">
                {t("Activation usually takes 5-15 minutes.", "অ্যাক্টিভেশন ৫-১৫ মিনিট সময় নিতে পারে।")}
              </p>
              <div className="space-y-3 lg:space-y-4">
                <a
                  href={siteData?.site?.telegramLink}
                  target="_blank"
                  className="w-full bg-[#0088cc] text-white font-black py-4 lg:py-6 rounded-xl lg:rounded-3xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform"
                >
                  <Send className="w-5 lg:w-6 h-5 lg:h-6" />
                  {t('Message Admin', 'টেলিগ্রামে মেসেজ দিন')}
                </a>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-2 text-text-muted font-black uppercase text-[10px] tracking-[3px] hover:text-text-primary transition-all"
                >
                  {t('Return Home', 'হোমে ফিরে যান')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
