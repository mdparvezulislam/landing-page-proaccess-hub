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
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trackInitiateCheckout, trackPurchase } from '../utils/facebookPixel';

export const CheckoutPage = () => {
  const { language, selectedOrderContext, paymentSettings, paymentMethods, addOrder, settings } = useStore();
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
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!selectedOrderContext) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#020617] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10 rotate-12">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">{t('No Package Selected', 'কোন প্যাকেজ নির্বাচন করা হয়নি')}</h1>
        <p className="text-text-secondary mb-10 max-w-md font-medium text-lg leading-relaxed">
          {t('Please choose a premium package from the dashboard before proceeding to checkout.', 'চেকআউট করার আগে দয়া করে ড্যাশবোর্ড থেকে একটি প্রিমিয়াম প্যাকেজ বেছে নিন।')}
        </p>
        <Link to="/" className="px-10 py-5 bg-primary text-white font-black rounded-2xl glow-btn shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95">
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
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#020617] selection:bg-primary selection:text-white relative overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-3 text-text-secondary hover:text-text-primary mb-12 transition-all group font-black uppercase text-[10px] tracking-[3px]">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg border border-white/5">
            <ArrowLeft className="w-5 h-5" />
          </div>
          {t('Back to Storefront', 'হোমে ফিরে যান')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-start">
          {/* Left Column: Order Summary & Payment Methods (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[40px] md:rounded-[50px] p-8 md:p-14 border-white/10 relative overflow-hidden shadow-2xl bg-white/[0.01]"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] -z-10">
                 <ShoppingBag className="w-48 h-48" />
              </div>

              <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/5">
                 <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">{t('Order Summary', 'অর্ডার সারাংশ')}</h2>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">{t('Review your selection', 'আপনার প্যাকেজ')} </p>
                 </div>
                 <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
                    {t('Pending Payment', 'পেমেন্ট বাকি')}
                 </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-2">
                        <img src={product.image} className="w-full h-full object-cover rounded-2xl" alt={product.title} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-text-primary mb-1 tracking-tight">{t(product.title, product.titleBn)}</h3>
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                              {t(plan.name, plan.nameBn)}
                           </span>
                           <span className="text-xs text-text-muted font-bold">{t('Lifetime Validity', 'লাইফটাইম মেয়াদ')}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light tracking-tighter">
                        {plan.priceTk} <span className="text-lg font-bold text-text-primary opacity-60 ml-1">TK</span>
                     </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dynamic Payment Methods Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[40px] md:rounded-[50px] p-8 md:p-14 border-white/10 shadow-2xl bg-white/[0.01]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                 <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">{t('Select Payment Method', 'পেমেন্ট মেথড নির্বাচন করুন')}</h2>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">{t('Choose your preferred way to pay', 'আপনার পছন্দের মাধ্যম বেছে নিন')}</p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-success text-[10px] font-black tracking-widest uppercase">
                    <ShieldCheck className="w-4 h-4" /> {t('Encrypted', 'নিরাপদ')}
                 </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                 {enabledMethods.map((method: PaymentMethod) => (
                   <button
                     key={method.id}
                     onClick={() => setSelectedMethodId(method.id)}
                     className={`relative group p-6 rounded-[32px] border-2 transition-all duration-500 flex flex-col items-center gap-4 ${
                       selectedMethodId === method.id
                         ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(124,58,237,0.2)]'
                         : 'bg-white/5 border-white/10 hover:border-white/20'
                     }`}
                   >
                     {selectedMethodId === method.id && (
                       <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[4]" />
                       </div>
                     )}
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                       selectedMethodId === method.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white/10 text-text-muted group-hover:bg-white/20'
                     }`}>
                        <Wallet className="w-7 h-7" />
                     </div>
                     <div className="text-center">
                        <span className="block font-black text-lg tracking-tight">{method.name}</span>
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{method.type}</span>
                     </div>
                   </button>
                 ))}
              </div>

              {/* Selected Method Details */}
              <AnimatePresence mode="wait">
                {selectedMethod && (
                  <motion.div
                    key={selectedMethod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="bg-white/[0.03] border border-white/10 rounded-[35px] p-10 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                       <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                          <div className="flex-1 w-full text-center md:text-left">
                             <p className="text-[10px] font-black text-primary-light uppercase tracking-[4px] mb-4">{selectedMethod.name} ({selectedMethod.type}) {t('Number', 'নম্বর')}</p>
                             <div className="flex items-center justify-center md:justify-start gap-6">
                                <span className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter leading-none">{selectedMethod.number}</span>
                                <button
                                  onClick={() => handleCopy(selectedMethod.number)}
                                  className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-primary hover:text-white text-text-muted transition-all active:scale-90 flex items-center justify-center shadow-2xl border border-white/10"
                                >
                                  <Copy className="w-6 h-6" />
                                </button>
                             </div>
                             {selectedMethod.accountName && (
                               <p className="mt-4 text-xs font-bold text-text-muted uppercase tracking-widest">{t('Account Name', 'অ্যাকাউন্টের নাম')}: <span className="text-text-primary">{selectedMethod.accountName}</span></p>
                             )}
                          </div>
                          {selectedMethod.qrCode && (
                            <div className="w-44 h-44 bg-white p-4 rounded-3xl flex-shrink-0 shadow-2xl border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
                               <img src={selectedMethod.qrCode} alt="Payment QR" className="w-full h-full object-contain" />
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <h4 className="flex items-center gap-3 text-xs font-black text-text-primary uppercase tracking-widest">
                             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                             {t('Payment Instructions', 'পেমেন্ট নির্দেশাবলী')}
                          </h4>
                          <div className="space-y-4">
                             {selectedMethod.instructions.split('\n').filter(l => l.trim()).map((inst, i) => (
                               <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary flex-shrink-0">{i+1}</div>
                                  <p className="text-sm font-bold text-text-secondary leading-relaxed">{inst}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-6">
                          <h4 className="flex items-center gap-3 text-xs font-black text-text-primary uppercase tracking-widest">
                             <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                             {t('Important Notice', 'জরুরি নোটিশ')}
                          </h4>
                          <div className="p-6 rounded-[32px] bg-warning/10 border border-warning/20 space-y-4">
                             <div className="flex items-center gap-3 text-warning">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-black text-[10px] tracking-widest uppercase">{t('Required Action', 'অবশ্যই পালনীয়')}</span>
                             </div>
                             <p className="text-sm text-warning font-bold leading-relaxed">
                                {t(paymentSettings.warningText, paymentSettings.warningTextBn)}
                             </p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Submission Form (5 Cols) */}
          <div className="lg:col-span-5 sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[40px] md:rounded-[50px] p-10 lg:p-14 border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.01]"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-4 tracking-tighter leading-none">{t('Complete Verification', 'যাচাইকরণ সম্পন্ন করুন')}</h2>
                <p className="text-text-secondary font-medium leading-relaxed">
                  {t('Send money first, then enter the details below to unlock your premium access instantly.', 'প্রথমে টাকা পাঠান, তারপর আপনার প্রিমিয়াম অ্যাক্সেস তাৎক্ষণিক আনলক করতে নিচের তথ্যগুলো দিন।')}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">{t('Your Full Name', 'আপনার পুরো নাম')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("e.g. Rahat Ahmed", "উদাঃ রাহাত আহমেদ")}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-[24px] px-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.08] transition-all font-bold text-lg placeholder:font-normal placeholder:opacity-30"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">{t('Telegram Username', 'টেলিগ্রাম ইউজারনেম')}</label>
                  <div className="relative group">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-xl group-focus-within:scale-110 transition-transform">@</span>
                    <input
                      type="text"
                      required
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="username"
                      className="w-full bg-white/[0.04] border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.08] transition-all font-bold text-lg placeholder:font-normal placeholder:opacity-30"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">{t('Transaction ID (TrxID)', 'ট্রানজেকশন আইডি')}</label>
                  <div className="relative group">
                    <Zap className="absolute left-8 top-1/2 -translate-y-1/2 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
                    <input
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      placeholder="8K9L2M5N..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-[24px] pl-16 pr-8 py-5 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.08] transition-all font-black tracking-[4px] text-xl placeholder:font-sans placeholder:tracking-normal placeholder:text-base placeholder:opacity-30"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-2">{t('Screenshot URL (Optional)', 'স্ক্রিনশট লিংক (ঐচ্ছিক)')}</label>
                  <input
                    type="url"
                    value={formData.screenshot}
                    onChange={(e) => setFormData({ ...formData, screenshot: e.target.value })}
                    placeholder="https://imgur.com/..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-[24px] px-8 py-5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.08] transition-all text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden bg-primary hover:bg-primary-light text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-4 transition-all glow-btn disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-2xl shadow-primary/30 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  {isSubmitting ? (
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('Confirm Order', 'অর্ডার কনফার্ম করুন')}
                      <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-[2.5px]">
                    {t('256-bit Secure Verification', '২৫৬-বিট সিকিউর ভেরিফিকেশন')}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modern Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-bg-dark/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl glass-card rounded-[60px] p-12 lg:p-24 text-center shadow-2xl border-primary/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />

              <div className="w-36 h-36 rounded-[45px] bg-success/10 flex items-center justify-center mx-auto mb-10 border-2 border-success/30 rotate-12 shadow-2xl shadow-success/20">
                <CheckCircle2 className="w-20 h-20 text-success" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-text-primary mb-8 tracking-tighter leading-none">
                {t('Victory!', 'অর্ডার সফল!')}
              </h2>
              <p className="text-xl text-text-secondary mb-16 max-w-md mx-auto font-medium leading-relaxed">
                {t("Payment received. Our agents are verifying it right now. Contact us on Telegram to skip the queue!", "পেমেন্ট পাওয়া গেছে। আমাদের এজেন্টরা তা যাচাই করছেন। দ্রুত অ্যাক্সেসের জন্য টেলিগ্রামে মেসেজ করুন।")}
              </p>

              <div className="flex flex-col gap-6">
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0088cc] hover:bg-[#0099ee] text-white font-black py-8 rounded-[32px] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-sky-500/40 hover:scale-[1.02] active:scale-95 text-2xl group"
                >
                  <Send className="w-10 h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {t('Message on Telegram', 'টেলিগ্রামে যোগাযোগ করুন')}
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-6 rounded-[32px] text-text-muted font-black uppercase text-xs tracking-[5px] hover:text-text-primary transition-all hover:bg-white/5 active:scale-95"
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
