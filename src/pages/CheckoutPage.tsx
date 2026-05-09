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
        content_name: selectedOrderContext.product.nameEn,
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
        <h1 className="text-3xl font-bold mb-4">{language === 'en' ? 'No Product Selected' : 'কোন পণ্য নির্বাচন করা হয়নি'}</h1>
        <p className="text-text-secondary mb-8 max-w-md">
          {language === 'en' 
            ? 'It seems you haven\'t selected a VIP package yet. Please go back to the homepage and choose one.' 
            : 'মনে হচ্ছে আপনি এখনো কোন ভিআইপি প্যাকেজ নির্বাচন করেননি। অনুগ্রহ করে হোমপেজে ফিরে যান এবং একটি বেছে নিন।'}
        </p>
        <Link to="/" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl glow-btn">
          {language === 'en' ? 'Go to Packages' : 'প্যাকেজ দেখুন'}
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
        productName: product.nameEn,
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
        content_name: product.nameEn,
        value: plan.priceTk,
        currency: 'BDT'
      });
      
      setIsSubmitting(false);
      setOrderComplete(true);
      toast.success('Order submitted successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-dark selection:bg-primary selection:text-white">
      <div className="container mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors group font-semibold">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
          {/* Left Column: Instructions & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-[32px] p-6 md:p-8 border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-500" />
              
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                {language === 'en' ? 'Order Summary' : 'অর্ডার সারাংশ'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start py-4 border-b border-white/5">
                  <span className="text-text-secondary">{language === 'en' ? 'Product' : 'পণ্য'}</span>
                  <div className="text-right">
                    <span className="font-bold text-text-primary block">{language === 'en' ? product.nameEn : product.nameBn}</span>
                    <span className="text-xs text-primary-light font-bold uppercase tracking-widest">{plan.name}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 text-xl">
                  <span className="text-text-secondary font-bold">{language === 'en' ? 'Total Amount' : 'মোট পরিমাণ'}</span>
                  <span className="font-black text-primary text-2xl tracking-tighter">{plan.priceTk} <span className="text-sm font-bold opacity-70">TK</span></span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-6 md:p-8 border-white/10 relative overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
                <QrCode className="w-6 h-6 text-secondary" />
                {language === 'en' ? 'Payment Method' : 'পেমেন্ট পদ্ধতি'}
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                {paymentSettings.qrCode && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-44 h-44 bg-white p-3 rounded-2xl flex-shrink-0 shadow-2xl relative group"
                  >
                    <img src={paymentSettings.qrCode} alt="Payment QR" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                      <p className="text-white text-xs font-bold uppercase tracking-widest">Scan to Pay</p>
                    </div>
                  </motion.div>
                )}
                <div className="flex-1 space-y-4 w-full">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <p className="text-[10px] font-bold text-primary-light uppercase tracking-[2px] mb-2">
                      {paymentSettings.methodName} ({paymentSettings.accountType})
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl md:text-3xl font-black text-text-primary tracking-wider">{paymentSettings.number}</p>
                      <button 
                        onClick={() => handleCopy(paymentSettings.number)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-primary transition-all active:scale-90"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-warning font-medium leading-relaxed">{paymentSettings.warningText}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  {paymentSettings.instructionTitle}
                </h3>
                <ul className="space-y-4">
                  {paymentSettings.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm text-text-secondary leading-relaxed group">
                      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black text-primary-light flex-shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                        {i + 1}
                      </div>
                      <span className="pt-0.5">{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
               <div className="h-8 px-4 flex items-center justify-center rounded-lg border border-white/10 font-bold text-xs uppercase tracking-widest text-text-muted">bKash</div>
               <div className="h-8 px-4 flex items-center justify-center rounded-lg border border-white/10 font-bold text-xs uppercase tracking-widest text-text-muted">Nagad</div>
               <div className="h-8 px-4 flex items-center justify-center rounded-lg border border-white/10 font-bold text-xs uppercase tracking-widest text-text-muted">Rocket</div>
            </div>
          </motion.div>

          {/* Right Column: Transaction Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sticky top-24"
          >
            <div className="glass-card rounded-[32px] p-8 lg:p-10 border-white/10 premium-shadow relative overflow-hidden bg-white/[0.01]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] -z-10 pointer-events-none">
                <ShieldCheck className="w-48 h-48" />
              </div>

              <div className="relative z-10">
                <div className="mb-10">
                  <h2 className="text-2xl md:text-3xl font-black mb-3">{language === 'en' ? 'Confirm Payment' : 'পেমেন্ট নিশ্চিত করুন'}</h2>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                    {language === 'en' 
                      ? 'Please complete the payment first, then enter your transaction details below.' 
                      : 'প্রথমে পেমেন্ট সম্পন্ন করুন, তারপর নিচে আপনার লেনদেনের তথ্য দিন।'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[2px] ml-1">
                      {language === 'en' ? 'Full Name' : 'পুরো নাম'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={language === 'en' ? "e.g. Rahat Ahmed" : "উদাঃ রাহাত আহমেদ"}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[2px] ml-1">
                      {language === 'en' ? 'Telegram Username' : 'টেলিগ্রাম ইউজারনেম'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold">@</span>
                      <input
                        type="text"
                        required
                        value={formData.telegram}
                        onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                        placeholder="username"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[2px] ml-1">
                      {language === 'en' ? 'Transaction ID (TrxID)' : 'ট্রানজেকশন আইডি'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.transactionId}
                      onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                      placeholder="e.g. 9K2L4M6N8P"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold tracking-widest placeholder:font-sans placeholder:tracking-normal"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[2px] ml-1">
                      {language === 'en' ? 'Payment Screenshot URL (Optional)' : 'পেমেন্ট স্ক্রিনশট লিংক (ঐচ্ছিক)'}
                    </label>
                    <input
                      type="url"
                      value={formData.screenshot}
                      onChange={(e) => setFormData({...formData, screenshot: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-light text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all glow-btn disabled:opacity-50 disabled:cursor-not-allowed group text-lg"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {language === 'en' ? 'Submit Order' : 'অর্ডার সাবমিট করুন'}
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-text-muted uppercase font-bold tracking-[2px]">
                    {language === 'en' ? 'Secure 256-bit SSL Encrypted' : 'নিরাপদ ২৫৬-বিট এসএসএল এনক্রিপ্টেড'}
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-bg-dark/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl glass-card rounded-[40px] p-8 lg:p-16 text-center premium-shadow border-primary/30 relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
               
              <div className="w-24 h-24 rounded-3xl bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20 rotate-3">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-4 leading-tight">
                {language === 'en' ? 'Order Successful!' : 'অর্ডার সফল হয়েছে!'}
              </h2>
              <p className="text-lg text-text-secondary mb-10 max-w-sm mx-auto leading-relaxed">
                {language === 'en' 
                  ? "We have received your payment details. Please message us on Telegram for immediate activation."
                  : "আমরা আপনার পেমেন্ট তথ্য পেয়েছি। দ্রুত অ্যাক্টিভেশনের জন্য অনুগ্রহ করে টেলিগ্রামে মেসেজ করুন।"}
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0088cc] hover:bg-[#0099ee] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-6 h-6" />
                  {language === 'en' ? 'Chat with Admin' : 'অ্যাডমিনের সাথে চ্যাট করুন'}
                </a>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-5 rounded-2xl text-text-secondary font-bold hover:text-text-primary transition-all hover:bg-white/5"
                >
                  {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

