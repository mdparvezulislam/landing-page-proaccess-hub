import React from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan, Feature } from '../store/useStore';
import { Check, X, Zap, Shield, Crown, Sparkles, ArrowRight, Info, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackAddToCart } from '../utils/facebookPixel';

export const Pricing = () => {
  const { language, products, pricingFeatures, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const mainProduct = products.filter(p => p.visible).sort((a, b) => a.order - b.order)[0];
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const handleJoin = (plan: ProductPlan) => {
    if (!mainProduct) return;
    setSelectedOrderContext({ product: mainProduct, plan });
    trackAddToCart({ 
      content_name: mainProduct.title, 
      value: plan.priceTk, 
      currency: 'BDT' 
    });
    navigate('/checkout');
  };

  if (!mainProduct) return null;

  const plans = mainProduct.plans;
  const sortedFeatures = [...pricingFeatures].filter(f => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="pricing" className="py-24 lg:py-40 relative bg-[#020617]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[11px] font-black tracking-[3px] uppercase mb-8"
          >
            <Shield className="w-4 h-4" />
            {t('Fair & Transparent Pricing', 'সঠিক ও স্বচ্ছ প্রাইসিং')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-8xl font-black mb-10 tracking-tighter leading-tight"
          >
            {t('Unbeatable Value,', 'সেরা ভ্যালু,')}
            <span className="premium-gradient-text block">{t('Absolute Elite Access', 'এলিট মেম্বারশিপ')}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-xl lg:text-2xl font-medium max-w-2xl mx-auto"
          >
            {t('Choose a plan that fits your ambition. From essential tools to legendary lifetime mastery.', 'আপনার উচ্চাকাঙ্ক্ষা অনুযায়ী একটি প্ল্যান বেছে নিন।')}
          </motion.p>
        </div>

        {/* Pricing Comparison Table Container */}
        <div className="relative glass-card rounded-[48px] overflow-hidden border-white/5 shadow-2xl">
          <div className="overflow-x-auto premium-scrollbar pb-2">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-10 lg:p-14 sticky left-0 z-20 bg-[#05091D] w-1/4">
                    <div className="flex flex-col gap-2">
                      <span className="text-2xl font-black tracking-tight">{t('Core Benefits', 'মূল সুবিধা')}</span>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">{t('Feature Comparison', 'ফিচার তুলনা')}</span>
                    </div>
                  </th>
                  {plans.map((plan, i) => (
                    <th key={plan.id} className={`p-10 lg:p-14 text-center align-top relative ${i === 2 ? 'bg-primary/[0.03]' : ''}`}>
                      <div className="flex flex-col items-center gap-6">
                        <div className="flex flex-col items-center">
                           <span className="text-[10px] font-black text-primary uppercase tracking-[4px] mb-3">{t(plan.duration, plan.duration)}</span>
                           <h3 className="text-2xl lg:text-3xl font-black tracking-tighter">{t(plan.name, plan.nameBn)}</h3>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl lg:text-6xl font-black tracking-tighter">{plan.priceTk}</span>
                          <span className="text-lg font-black text-text-muted">TK</span>
                        </div>
                        <button
                          onClick={() => handleJoin(plan)}
                          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all glow-btn ${
                            i === 2 
                              ? 'bg-primary text-white shadow-xl shadow-primary/25' 
                              : 'bg-white/5 text-text-primary border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {t('Choose Plan', 'নির্বাচন করুন')}
                        </button>
                      </div>
                      {i === 2 && (
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-secondary to-primary rounded-full text-[10px] font-black text-white uppercase tracking-[2px] shadow-lg">
                            {t('Best Value', 'সেরা অফার')}
                         </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedFeatures.map((feature, idx) => (
                  <motion.tr 
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-b border-white/5 group hover:bg-white/[0.01] transition-all`}
                  >
                    <td className="p-8 lg:p-10 sticky left-0 z-10 bg-[#05091D] border-r border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                          {idx % 2 === 0 ? <Zap className="w-5 h-5 text-primary" /> : <Crown className="w-5 h-5 text-secondary" />}
                        </div>
                        <span className="text-lg font-black text-text-primary tracking-tight">
                          {t(feature.title, feature.titleBn)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Monthly Check */}
                    <td className="p-8 lg:p-10 text-center">
                      <div className="flex justify-center">
                        {feature.plans.monthly ? (
                          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <Check className="w-5 h-5 stroke-[4]" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted/30 border border-white/5">
                            <X className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Yearly Check */}
                    <td className="p-8 lg:p-10 text-center">
                      <div className="flex justify-center">
                        {feature.plans.yearly ? (
                          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                            <Check className="w-5 h-5 stroke-[4]" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted/30 border border-white/5">
                            <X className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Lifetime Check */}
                    <td className={`p-8 lg:p-10 text-center ${idx % 1 === 0 ? 'bg-primary/[0.01]' : ''}`}>
                      <div className="flex justify-center">
                        {feature.plans.lifetime ? (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_20px_rgba(124,58,237,0.2)] animate-pulse-glow">
                            <Crown className="w-6 h-6 fill-primary" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted/30 border border-white/5">
                            <X className="w-5 h-5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Security Badges */}
          <div className="bg-white/[0.03] border-t border-white/5 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5 text-[9px] font-black text-text-muted uppercase tracking-[3px]">
                   <Shield className="w-4 h-4 text-success" />
                   {t('SSL SECURED', 'এসএসএল সিকিউর')}
                </div>
                <div className="flex items-center gap-2.5 text-[9px] font-black text-text-muted uppercase tracking-[3px]">
                   <Crown className="w-4 h-4 text-secondary" />
                   {t('VERIFIED VIP ACCESS', 'ভেরিফাইড ভিআইপি')}
                </div>
                <div className="flex items-center gap-2.5 text-[9px] font-black text-text-muted uppercase tracking-[3px]">
                   <Zap className="w-4 h-4 text-primary" />
                   {t('INSTANT DELIVERY', 'তাৎক্ষণিক ডেলিভারি')}
                </div>
             </div>
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[2px]">{t('Need Custom Solution?', 'কাস্টম সলিউশন প্রয়োজন?')}</span>
                <a href={mainProduct.telegramLink} className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">{t('Contact Support', 'সাপোর্ট যোগাযোগ')}</a>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
