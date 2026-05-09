import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import {
  CheckCircle2,
  Copy,
  Send,
  ArrowLeft,
  QrCode,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackInitiateCheckout, trackPurchase } from '../utils/facebookPixel';

export const CheckoutPage = () => {
  const { language, selectedOrderContext, paymentSettings, addOrder, settings } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    telegram: '',
    transactionId: '',
    screenshot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  // Handle hydration to prevent flash of "no product"
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !selectedOrderContext) {
      // Small delay before redirect to allow for storage sync
      const timer = setTimeout(() => {
        if (!selectedOrderContext) navigate('/');
      }, 500);
      return () => clearTimeout(timer);
    }

    if (selectedOrderContext) {
      trackInitiateCheckout({
        content_name: selectedOrderContext.product.title,
        value: selectedOrderContext.plan.priceTk,
        currency: 'BDT'
      });
    }
  }, [selectedOrderContext, navigate, isHydrated]);

  if (!isHydrated) return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!selectedOrderContext) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-bg-dark flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-text-muted" />
        </div>
        <h1 className="text-3xl font-black mb-4 tracking-tight">{t('No Product Selected', 'কোন পণ্য নির্বাচন করা হয়নি')}</h1>
        <p className="text-text-secondary mb-8 max-w-md font-medium">
          {t('It seems you haven\'t selected a VIP package yet. Please go back to the homepage and choose one.', 'মনে হচ্ছে আপনি এখনো কোন ভিআইপি প্যাকেজ নির্বাচন করেননি। অনুগ্রহ করে হোমপেজে ফিরে যান এবং একটি বেছে নিন।')}
        </p>
        <Link to="/" className="px-10 py-5 bg-primary text-white font-black rounded-2xl glow-btn shadow-2xl shadow-primary/20">
          {t('Go to Packages', 'প্যাকেজ দেখুন')}
        </Link>
      </div>
    );
  }

  const { product, plan } = selectedOrderContext;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.telegram || !formData.transactionId) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        productName: product.title,
        plan: plan.name,
        amount: plan.priceTk,
        customerName: formData.name,
        telegramUsername: formData.telegram.replace('@', ''),
        paymentNumber: paymentSettings.number,
        transactionId: formData.transactionId,
        screenshotUrl: formData.screenshot || '',
        status: 'Pending' as const,
        createdAt: new Date().toISOString()
      };

      addOrder(newOrder);
      trackPurchase({
        content_name: product.title,
        value: plan.priceTk,
        currency: 'BDT'
      });

      setIsSubmitting(false);
      setOrderComplete(true);
      toast.success('Order submitted successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#020617] selection:bg-primary selection:text-white">
      <div className="container mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary mb-10 transition-all group font-black uppercase text-xs tracking-widest">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          {t('Back to Home', 'হোমে ফিরে যান')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-start">
          {/* Left Column: Instructions & Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-[48px] p-8 md:p-12 border-primary/20 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

              <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-4 tracking-tighter">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                {t('Order Summary', 'অর্ডার সারাংশ')}
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-start py-6 border-b border-white/5">
                  <span className="text-text-secondary font-bold">{t('Package Selected', 'নির্বাচিত প্যাকেজ')}</span>
                  <div className="text-right">
                    <span className="font-black text-xl text-text-primary block tracking-tight">{t(product.title, product.titleBn)}</span>
                    <span className="text-[10px] text-primary-light font-black uppercase tracking-[2px]">{t(plan.name, plan.nameBn)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-6">
                  <span className="text-text-secondary font-black uppercase tracking-widest text-sm">{t('Total Amount', 'মোট পরিমাণ')}</span>
                  <span className="font-black text-primary text-4xl tracking-tighter">{plan.priceTk} <span className="text-base font-bold opacity-60">TK</span></span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[48px] p-8 md:p-12 border-white/10 relative overflow-hidden shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-black mb-10 flex items-center gap-4 tracking-tighter">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <QrCode className="w-6 h-6" />
                </div>
                {t('Payment Gateway', 'পেমেন্ট গেটওয়ে')}
              </h2>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
                {paymentSettings.qrCode && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-52 h-52 bg-white p-4 rounded-3xl flex-shrink-0 shadow-2xl relative group border-4 border-white/10"
                  >
                    <img src={paymentSettings.qrCode} alt="Payment QR" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                      <p className="text-white text-xs font-black uppercase tracking-widest text-center px-4">Scan using {paymentSettings.methodName}</p>
                    </div>
                  </motion.div>
                )}
                <div className="flex-1 space-y-6 w-full">
                  <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                    <p className="text-[10px] font-black text-primary-light uppercase tracking-[3px] mb-3">
                      {paymentSettings.methodName} ({paymentSettings.accountType})
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter">{paymentSettings.number}</p>
                      <button
                        onClick={() => handleCopy(paymentSettings.number)}
                        className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-primary hover:text-white text-text-muted transition-all active:scale-90 flex items-center justify-center shadow-lg"
                      >
                        <Copy className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-2xl p-5 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-warning font-bold leading-relaxed">{t(paymentSettings.warningText, paymentSettings.warningTextBn)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <h3 className="font-black text-text-primary mb-6 flex items-center gap-3 uppercase text-xs tracking-widest">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  {t(paymentSettings.instructionTitle, paymentSettings.instructionTitleBn)}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(language === 'en' ? paymentSettings.instructions : paymentSettings.instructionsBn).map((inst, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm text-text-secondary leading-relaxed group p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:border-white/10 transition-all">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary-light flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-medium">{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Transaction Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-32"
          >
            <div className="glass-card rounded-[48px] p-10 lg:p-14 border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.01]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] -z-10 pointer-events-none">
                <ShieldCheck className="w-64 h-64" />
              </div>

              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter">{t('Confirm Payment', 'পেমেন্ট নিশ্চিত করুন')}</h2>
                  <p className="text-text-secondary text-lg font-medium leading-relaxed">
                    {t('Please complete the payment first, then enter your transaction details below for verification.', 'প্রথমে পেমেন্ট সম্পন্ন করুন, তারপর যাচাইকরণের জন্য নিচে আপনার লেনদেনের তথ্য দিন।')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">
                      {t('Full Name', 'পুরো নাম')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t("e.g. Rahat Ahmed", "উদাঃ রাহাত আহমেদ")}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.06] transition-all font-bold text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">
                      {t('Telegram Username', 'টেলিগ্রাম ইউজারনেম')}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-xl group-focus-within:scale-110 transition-transform">@</span>
                      <input
                        type="text"
                        required
                        value={formData.telegram}
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        placeholder="username"
                        className="w-full bg-white/[0.04] border border-white/10 rounded-3xl pl-16 pr-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.06] transition-all font-bold text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">
                      {t('Transaction ID (TrxID)', 'ট্রানজেকশন আইডি')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="e.g. 9K2L4M6N8P"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-8 py-5 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.06] transition-all font-black tracking-[4px] text-xl placeholder:font-sans placeholder:tracking-normal placeholder:text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">
                      {t('Payment Screenshot URL', 'পেমেন্ট স্ক্রিনশট লিংক')}
                    </label>
                    <input
                      type="url"
                      value={formData.screenshot}
                      onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
                      placeholder="https://imgur.com/..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.06] transition-all text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-light text-white font-black py-6 rounded-[32px] flex items-center justify-center gap-4 transition-all glow-btn disabled:opacity-50 disabled:cursor-not-allowed group text-xl shadow-2xl shadow-primary/30"
                  >
                    {isSubmitting ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {t('Complete Order', 'অর্ডার সম্পন্ন করুন')}
                        <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 opacity-50">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-[3px]">
                      {t('Secure SSL Verification Active', 'নিরাপদ এসএসএল ভেরিফিকেশন সক্রিয়')}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-bg-dark/90">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl glass-card rounded-[60px] p-12 lg:p-20 text-center shadow-2xl border-primary/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

              <div className="w-32 h-32 rounded-[40px] bg-success/10 flex items-center justify-center mx-auto mb-10 border-2 border-success/30 rotate-6 shadow-2xl shadow-success/20">
                <CheckCircle2 className="w-16 h-16 text-success" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tighter leading-tight">
                {t('Order Received!', 'অর্ডার সফল!')}
              </h2>
              <p className="text-xl text-text-secondary mb-14 max-w-md mx-auto font-medium leading-relaxed">
                {t("We have received your payment details. Please contact us on Telegram for instant VIP access.", "আমরা আপনার পেমেন্ট তথ্য পেয়েছি। দ্রুত ভিআইপি অ্যাক্সেসের জন্য টেলিগ্রামে মেসেজ করুন।")}
              </p>

              <div className="flex flex-col gap-6">
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0088cc] hover:bg-[#0099ee] text-white font-black py-7 rounded-[28px] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-sky-500/30 hover:scale-[1.02] active:scale-95 text-xl"
                >
                  <Send className="w-8 h-8" />
                  {t('Contact via Telegram', 'টেলিগ্রামে যোগাযোগ করুন')}
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-6 rounded-[28px] text-text-muted font-black uppercase text-xs tracking-[4px] hover:text-text-primary transition-all hover:bg-white/5"
                >
                  {t('Back to Dashboard', 'ড্যাশবোর্ডে ফিরে যান')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};



