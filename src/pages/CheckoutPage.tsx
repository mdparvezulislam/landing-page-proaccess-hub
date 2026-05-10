import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, PaymentMethod } from '../store/useStore';
import {
  CheckCircle2,
  Copy,
  Send,
  ArrowLeft,
  QrCode,
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
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackInitiateCheckout, trackPurchase } from '../utils/facebookPixel';

export const CheckoutPage = () => {
  const { language, selectedOrderContext, paymentMethods, addOrder, settings, paymentSettings } = useStore();
  const navigate = useNavigate();

  const enabledMethods = paymentMethods.filter(m => m.enabled).sort((a, b) => a.order - b.order);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(enabledMethods[0]?.id || '');

  const selectedMethod = enabledMethods.find(m => m.id === selectedMethodId) || enabledMethods[0];

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

  useEffect(() => {
    setIsHydrated(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isHydrated && !selectedOrderContext) {
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl"
      />
    </div>
  );

  if (!selectedOrderContext) {
    return (
      <div className="min-h-screen pt-20 pb-20 bg-[#020617] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-10 border border-white/10 rotate-12 shadow-2xl">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter">{t('No Package Selected', 'প্যাকেজ পাওয়া যায়নি')}</h1>
        <p className="text-text-secondary mb-10 max-w-sm font-medium leading-relaxed">
          {t('Please choose a premium package from the dashboard before proceeding to checkout.', 'চেকআউট করার আগে দয়া করে ড্যাশবোর্ড থেকে একটি প্রিমিয়াম প্যাকেজ বেছে নিন।')}
        </p>
        <Link to="/" className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all glow-btn">
          {t('View VIP Packages', 'ভিআইপি প্যাকেজ দেখুন')}
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
      toast.error('Please fill in all required fields');
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
        paymentNumber: selectedMethod?.number || '',
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
      toast.success('Payment details submitted successfully!');
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-[#020617] selection:bg-primary/30 relative overflow-hidden">
      {/* Mesh Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 mesh-gradient opacity-40" />

      <div className="container mx-auto px-2 max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-3 text-text-muted hover:text-text-primary mb-10 transition-all group font-black uppercase text-[10px] tracking-[3px]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          {t('Back to Vault', 'ভল্টে ফিরে যান')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Summary & Payment */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] p-2 border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter">{t('Secure Checkout', 'নিরাপদ চেকআউট')}</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] mt-1.5">{t('Premium VIP Membership', 'প্রিমিয়াম ভিআইপি মেম্বারশিপ')}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-[3px] shadow-lg">
                  <Lock className="w-3.5 h-3.5" /> {t('Encrypted', 'এনক্রিপ্টেড')}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-8 bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 p-2.5 flex-shrink-0 shadow-inner group overflow-hidden">
                    <img src={product.image} className="w-full h-full object-cover rounded-[20px] group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tighter mb-2">{t(product.title, product.titleBn)}</h3>
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary-light text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {t(plan.name, plan.nameBn)}
                      </span>
                      <span className="text-[9px] text-text-muted font-black uppercase tracking-[3px] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-secondary" />
                        {t('Instant Access', 'তাৎক্ষণিক অ্যাক্সেস')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-4xl lg:text-5xl font-black text-text-primary tracking-tighter flex items-baseline gap-1.5">
                    {plan.priceTk} <span className="text-lg opacity-40">TK</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[40px] p-10 border-white/5 shadow-2xl"
            >
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-1.5">{t('Payment Method', 'পেমেন্ট মেথড')}</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">{t('Select your preferred channel', 'পছন্দের মাধ্যম বেছে নিন')}</p>
                </div>
                <CreditCard className="w-10 h-10 text-white/5" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-12">
                {enabledMethods.map((method: PaymentMethod) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethodId(method.id)}
                    className={`relative p-6 rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-4 overflow-hidden group ${selectedMethodId === method.id
                      ? 'border-primary bg-primary/[0.05]'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    style={{
                      boxShadow: selectedMethodId === method.id ? `0 0 30px ${method.color}25` : 'none'
                    }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${selectedMethodId === method.id ? 'bg-primary text-white' : 'bg-white/5 text-text-muted group-hover:text-primary'
                      }`}>
                      <Wallet className="w-7 h-7" />
                    </div>
                    <div className="text-center">
                      <span className="block font-black text-base tracking-tight">{method.name}</span>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-[3px] mt-1">{method.type}</span>
                    </div>
                    {selectedMethodId === method.id && (
                      <motion.div layoutId="payment-active" className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[5]" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {selectedMethod && (
                  <motion.div
                    key={selectedMethod.id}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: selectedMethod.color }} />
                      <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 w-full text-center md:text-left">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-[4px] mb-4">{selectedMethod.name} {t('RECEIVER NUMBER', 'রিসিভার নম্বর')}</p>
                          <div className="flex items-center justify-center md:justify-start gap-6">
                            <span className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter leading-none">{selectedMethod.number}</span>
                            <button
                              onClick={() => handleCopy(selectedMethod.number)}
                              className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-primary hover:text-white text-text-muted transition-all active:scale-90 flex items-center justify-center border border-white/10 shadow-lg"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                          </div>
                          {selectedMethod.accountName && (
                            <div className="mt-6 flex items-center justify-center md:justify-start gap-3 text-sm font-black text-text-muted">
                              <Smartphone className="w-5 h-5 text-primary" />
                              <span className="uppercase tracking-[3px] text-[10px]">{t('ACCOUNT HOLDER', 'অ্যাকাউন্ট হোল্ডার')}:</span>
                              <span className="text-text-primary">{selectedMethod.accountName}</span>
                            </div>
                          )}
                        </div>
                        {selectedMethod.qrCode && (
                          <div className="w-40 h-40 bg-white p-4 rounded-[32px] flex-shrink-0 shadow-2xl border-4 border-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src={selectedMethod.qrCode} alt="QR" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-text-primary uppercase tracking-[4px]">
                          <Info className="w-5 h-5 text-primary" />
                          {t('Payment Steps', 'পেমেন্ট গাইড')}
                        </h4>
                        <div className="space-y-4">
                          {selectedMethod.instructions.split('\n').filter(l => l.trim()).map((inst, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                              <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary flex-shrink-0">{i + 1}</span>
                              <p className="text-sm font-bold text-text-secondary leading-relaxed">{inst}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-text-primary uppercase tracking-[4px]">
                          <AlertCircle className="w-5 h-5 text-warning" />
                          {t('Notice Board', 'জরুরি নোটিশ')}
                        </h4>
                        <div className="p-8 rounded-[32px] bg-warning/5 border border-warning/10 border-dashed relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AlertCircle className="w-16 h-16 text-warning" />
                          </div>
                          <p className="text-sm text-warning/80 font-bold leading-relaxed italic relative z-10">
                            {t(paymentSettings.warningText, paymentSettings.warningTextBn)}
                          </p>
                          <div className="mt-8 pt-6 border-t border-warning/10 flex items-center gap-4 relative z-10">
                            <a href={settings.telegramLink} target="_blank" className="text-[11px] font-black text-warning uppercase tracking-[3px] hover:underline flex items-center gap-2">
                              <Send className="w-4 h-4" /> {t('Contact Admin', 'সাপোর্টে কথা বলুন')}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Verification Form */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[40px] p-2 lg:p-14 border-white/5 shadow-2xl bg-white/[0.01] sticky top-32"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-black tracking-tighter mb-3">{t('Verify Order', 'অর্ডার যাচাই')}</h2>
                <p className="text-xs text-text-muted font-bold leading-relaxed uppercase tracking-widest">
                  {t('Submit payment proof to activate', 'পেমেন্ট সাবমিট করে মেম্বারশিপ নিন')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">{t('Customer Name', 'আপনার নাম')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black text-base"
                    placeholder="E.g. Ahmed Shuvo"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">{t('Telegram Username', 'টেলিগ্রাম আইডি')}</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-base">@</span>
                    <input
                      type="text"
                      required
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black text-base"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">{t('Transaction ID', 'ট্রানজেকশন আইডি')}</label>
                  <div className="relative">
                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-black uppercase text-base tracking-[3px]"
                      placeholder="8K9L2M5N..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-primary text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('Activate VIP Access', 'মেম্বারশিপ নিশ্চিত করুন')}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </button>

                <div className="flex items-center justify-center gap-3 py-6 border-t border-white/5">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <p className="text-[9px] text-text-muted uppercase font-black tracking-[4px]">
                    {t('256-BIT BANK-GRADE ENCRYPTION', 'ব্যাংক-গ্রেড এনক্রিপশন')}
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 bg-bg-dark/95 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl glass-card rounded-[60px] p-12 lg:p-20 text-center shadow-2xl border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />

              <div className="w-32 h-32 rounded-[40px] bg-success/10 flex items-center justify-center mx-auto mb-10 border-2 border-success/20 rotate-[15deg] shadow-2xl">
                <CheckCircle2 className="w-16 h-16 text-success" />
              </div>

              <h2 className="text-5xl lg:text-6xl font-black text-text-primary mb-6 tracking-tighter">
                {t('Verified!', 'সাফল্য!')}
              </h2>

              <p className="text-lg text-text-secondary mb-12 max-w-md mx-auto font-black uppercase tracking-widest leading-relaxed">
                {t("Your elite membership is being processed. Activation usually takes 5-15 minutes.", "আপনার এলিট মেম্বারশিপ প্রসেস করা হচ্ছে। ৫-১৫ মিনিটের মধ্যে একটিভ হবে।")}
              </p>

              <div className="space-y-5">
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  className="w-full bg-[#0088cc] text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-sky-500/30 hover:scale-[1.03] active:scale-95"
                >
                  <Send className="w-6 h-6" />
                  {t('Message Admin on Telegram', 'টেলিগ্রাম মেসেজ দিন')}
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-5 text-text-muted font-black uppercase text-[11px] tracking-[4px] hover:text-text-primary transition-all"
                >
                  {t('Return to Dashboard', 'ড্যাশবোর্ডে ফিরে যান')}
                </button>
              </div>

              {/* Sparkles Decoration */}
              <div className="absolute top-10 left-10 opacity-20"><Sparkles className="w-8 h-8 text-primary animate-pulse" /></div>
              <div className="absolute bottom-20 right-10 opacity-20"><Sparkles className="w-8 h-8 text-secondary animate-pulse" /></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
