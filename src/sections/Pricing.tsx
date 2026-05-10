"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Check, Zap, Shield, Crown, Sparkles, ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackAddToCart } from '../utils/facebookPixel';
import { useCurrencyStore } from '../store/useCurrencyStore';

export const Pricing = ({ data }: { data: any }) => {
  const { language, setSelectedOrderContext } = useStore();
  const { convertPrice, currentCurrency } = useCurrencyStore();
  const [mounted, setMounted] = React.useState(false);
  const products = data || [];
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const handleJoin = (product: any, plan: any) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({
      content_name: product.titleEn,
      value: plan.priceTk,
      currency: 'BDT'
    });
    router.push('/checkout');
  };

  const visibleProducts = products.filter((p: any) => p.visible).sort((a: any, b: any) => a.order - b.order);

  if (visibleProducts.length === 0) return null;

  return (
    <section id="pricing" className="py-12 lg:py-24 relative bg-bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black tracking-[3px] uppercase mb-6"
          >
            <Shield className="w-4 h-4" />
            {t('Fair & Transparent Pricing', 'সঠিক ও স্বচ্ছ প্রাইসিং')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight"
          >
            {t('Unbeatable Value,', 'সেরা ভ্যালু,')}
            <span className="grad-text block mt-2">{t('Absolute Elite Access', 'এলিট মেম্বারশিপ')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-base lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Choose a plan that fits your ambition. From essential tools to legendary lifetime mastery.', 'আপনার উচ্চাকাঙ্ক্ষা অনুযায়ী একটি প্ল্যান বেছে নিন।')}
          </motion.p>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {visibleProducts.map((product: any, pIdx: number) => (
            <div key={product.id} className="relative">
              {visibleProducts.length > 1 && (
                <div className="mb-10 text-center">
                  <h3 className="text-2xl lg:text-4xl font-black tracking-tight grad-text uppercase italic">
                    {t(product.titleEn, product.titleBn)}
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto mt-2 rounded-full" />
                </div>
              )}

              <div className={`grid grid-cols-1 gap-6 lg:gap-8 max-w-7xl mx-auto ${product.plans.length === 1 ? 'md:grid-cols-1 max-w-lg' :
                  product.plans.length === 2 ? 'md:grid-cols-2 max-w-4xl' :
                    'md:grid-cols-3'
                }`}>
                {product.plans.map((plan: any, i: number) => {
                  const isPopular = plan.isPopular || (product.plans.length === 3 && i === 1) || (product.plans.length === 1);
                  const { amount, currency } = mounted ? convertPrice(plan.priceTk) : { amount: plan.priceTk, currency: 'BDT' };

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`relative glass-card rounded-[32px] lg:rounded-[40px] p-8 lg:p-10 border-2 transition-all duration-500 group flex flex-col ${isPopular
                          ? 'border-primary bg-primary/[0.03] scale-100 z-10 shadow-2xl shadow-primary/20'
                          : 'border-white/5 hover:border-white/20'
                        }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-[9px] font-black text-white uppercase tracking-[2px] shadow-xl whitespace-nowrap">
                          {t('Recommended', 'সুপারিশকৃত')}
                        </div>
                      )}

                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[3px] ${isPopular ? 'text-primary' : 'text-text-muted'}`}>
                            {t(plan.duration, plan.duration)}
                          </span>
                          {isPopular ? <Crown className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-text-muted" />}
                        </div>
                        <h3 className="text-2xl lg:text-4xl font-black tracking-tighter mb-2">
                          {t(plan.nameEn, plan.nameBn)}
                        </h3>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{amount}</span>
                            <span className="text-sm lg:text-lg font-black text-text-muted">{currency}</span>
                          </div>
                          {mounted && currentCurrency === 'USDT' && (
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter mt-1">≈ {plan.priceTk} BDT</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 mb-10 flex-1">
                        {(product.features || []).filter((f: any) => f.visible).map((feature: any) => {
                          const isIncluded = !feature.includedInPlanIds || feature.includedInPlanIds.length === 0 || feature.includedInPlanIds.includes(plan.id);
                          return (
                            <div key={feature.id} className="flex items-start gap-3 group/item">
                              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isIncluded
                                ? (isPopular ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-success/10 border-success/20 text-success')
                                : 'bg-red-500/10 border-red-500/20 text-red-500 opacity-40'
                                }`}>
                                {isIncluded ? <Check className="w-3 h-3 stroke-[4]" /> : <X className="w-3 h-3 stroke-[4]" />}
                              </div>
                              <span className={`text-sm lg:text-base font-bold tracking-tight ${isIncluded ? (feature.highlighted ? 'text-text-primary' : 'text-text-secondary') : 'text-text-muted line-through opacity-50'
                                }`}>
                                {t(feature.textEn, feature.textBn)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handleJoin(product, plan)}
                        className={`w-full py-4 lg:py-5 rounded-2xl lg:rounded-[28px] font-black text-xs uppercase tracking-[2px] lg:tracking-[4px] transition-all flex items-center justify-center gap-3 group/btn ${isPopular
                          ? 'bg-primary text-white hover:bg-primary-light shadow-xl shadow-primary/30 glow-btn'
                          : 'bg-white/5 text-text-primary border border-white/10 hover:bg-white/10'
                          }`}
                      >
                        {t('Choose Plan', 'নির্বাচন করুন')}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 lg:mt-32 text-center p-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          <div className="flex items-center gap-3 text-[9px] font-black text-text-muted uppercase tracking-[2px]">
            <Shield className="w-4 h-4 text-success" />
            {t('Secure Payment', 'নিরাপদ পেমেন্ট')}
          </div>
          <div className="flex items-center gap-3 text-[9px] font-black text-text-muted uppercase tracking-[2px]">
            <Crown className="w-4 h-4 text-secondary" />
            {t('Elite Access', 'এলিট অ্যাক্সেস')}
          </div>
          <div className="flex items-center gap-3 text-[9px] font-black text-text-muted uppercase tracking-[2px]">
            <Sparkles className="w-4 h-4 text-primary" />
            {t('Instant Delivery', 'তাৎক্ষণিক ডেলিভারি')}
          </div>
        </div>
      </div>
    </section>
  );
};
