"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Check, Zap, Shield, Crown, Sparkles, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackAddToCart } from '../utils/facebookPixel';

export const Pricing = ({ data }: { data: any }) => {
  const { language, setSelectedOrderContext } = useStore();
  const products = data || [];
  const router = useRouter();

  const mainProduct = products.find((p: any) => p.visible && p.plans.length === 3) || products.find((p: any) => p.visible);
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const handleJoin = (plan: any) => {
    if (!mainProduct) return;
    setSelectedOrderContext({ product: mainProduct, plan });
    trackAddToCart({
      content_name: mainProduct.titleEn,
      value: plan.priceTk,
      currency: 'BDT'
    });
    router.push('/checkout');
  };

  if (!mainProduct) return null;

  return (
    <section id="pricing" className="py-20 lg:py-40 relative bg-bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-2 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black tracking-[2px] lg:tracking-[3px] uppercase mb-6 lg:mb-8"
          >
            <Shield className="w-4 h-4" />
            {t('Fair & Transparent Pricing', 'সঠিক ও স্বচ্ছ প্রাইসিং')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-7xl font-black mb-2 lg:mb-4 tracking-tighter leading-tight"
          >
            {t('Unbeatable Value,', 'সেরা ভ্যালু,')}
            <span className="grad-text block mt-2 lg:mt-4">{t('Absolute Elite Access', 'এলিট মেম্বারশিপ')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-base lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Choose a plan that fits your ambition. From essential tools to legendary lifetime mastery.', 'আপনার উচ্চাকাঙ্ক্ষা অনুযায়ী একটি প্ল্যান বেছে নিন।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 max-w-7xl mx-auto">
          {mainProduct.plans.map((plan: any, i: number) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card rounded-[32px] lg:rounded-[48px] p-8 lg:p-12 border-2 transition-all duration-500 group flex flex-col ${i === 2
                ? 'border-primary bg-primary/[0.03] scale-100 lg:scale-110 z-10 shadow-2xl shadow-primary/20'
                : 'border-white/5 hover:border-white/20'
                }`}
            >
              {i === 2 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-[10px] font-black text-white uppercase tracking-[2px] shadow-xl">
                  {t('Most Popular', 'সবচেয়ে জনপ্রিয়')}
                </div>
              )}

              <div className="mb-10 lg:mb-12">
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[3px] lg:tracking-[4px] ${i === 2 ? 'text-primary' : 'text-text-muted'}`}>
                    {t(plan.duration, plan.duration)}
                  </span>
                  {i === 2 ? <Crown className="w-6 h-6 text-primary" /> : <Zap className="w-6 h-6 text-text-muted" />}
                </div>
                <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4">
                  {t(plan.nameEn, plan.nameBn)}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">{plan.priceTk}</span>
                  <span className="text-base lg:text-xl font-black text-text-muted">TK</span>
                </div>
              </div>

              <div className="space-y-4 lg:space-y-6 mb-12 flex-1">
                {(mainProduct.features || []).filter((f: any) => f.visible).map((feature: any) => {
                  const isIncluded = !feature.includedInPlanIds || feature.includedInPlanIds.length === 0 || feature.includedInPlanIds.includes(plan.id);
                  return (
                    <div key={feature.id} className="flex items-start gap-4 group/item">
                      <div className={`mt-1 flex-shrink-0 w-5 lg:w-6 h-5 lg:h-6 rounded-full flex items-center justify-center border transition-all ${isIncluded
                        ? (i === 2 ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-success/10 border-success/20 text-success')
                        : 'bg-red-500/10 border-red-500/20 text-red-500 opacity-40'
                        }`}>
                        {isIncluded ? <Check className="w-3 lg:w-4 h-3 lg:h-4 stroke-[4]" /> : <X className="w-3 lg:w-4 h-3 lg:h-4 stroke-[4]" />}
                      </div>
                      <span className={`text-sm lg:text-lg font-black tracking-tight ${isIncluded ? (feature.highlighted ? 'text-text-primary' : 'text-text-secondary') : 'text-text-muted line-through opacity-50'
                        }`}>
                        {t(feature.textEn, feature.textBn)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleJoin(plan)}
                className={`w-full py-5 lg:py-6 rounded-2xl lg:rounded-[32px] font-black text-sm uppercase tracking-[2px] lg:tracking-[4px] transition-all flex items-center justify-center gap-3 group/btn ${i === 2
                  ? 'bg-primary text-white hover:bg-primary-light shadow-xl shadow-primary/30 glow-btn'
                  : 'bg-white/5 text-text-primary border border-white/10 hover:bg-white/10'
                  }`}
              >
                {t('Choose Plan', 'নির্বাচন করুন')}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 lg:mt-32 text-center p-8 lg:p-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
            <Shield className="w-5 h-5 text-success" />
            {t('Secure Payment', 'নিরাপদ পেমেন্ট')}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
            <Crown className="w-5 h-5 text-secondary" />
            {t('Elite Access', 'এলিট অ্যাক্সেস')}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
            <Sparkles className="w-5 h-5 text-primary" />
            {t('Instant Delivery', 'তাৎক্ষণিক ডেলিভারি')}
          </div>
        </div>
      </div>
    </section>
  );
};
