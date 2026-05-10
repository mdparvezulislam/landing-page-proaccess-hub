"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Check, ArrowRight, Zap, Star, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackAddToCart } from '../utils/facebookPixel';

interface ProductCardProps {
  product: any;
  idx: number;
  language: any;
  handleJoin: (product: any, plan: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, idx, language, handleJoin }) => {
  const [activePlanId, setActivePlanId] = useState(product.plans[product.plans.length - 1]?.id);
  const t = (en: string, bn: string) => language === 'en' ? (en || '') : (bn || '');

  const activePlan = product.plans.find((p: any) => p.id === activePlanId) || product.plans[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-[32px] lg:rounded-[48px] p-5 lg:p-12 relative group hover:bg-white/[0.04] transition-all duration-700 border-white/[0.05] flex flex-col shadow-2xl overflow-hidden"
    >
      {/* Background Atmosphere - More Colorful */}
      <div className="absolute top-0 right-0 w-48 lg:w-96 h-48 lg:h-96 bg-primary/10 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-48 lg:w-96 h-48 lg:h-96 bg-secondary/10 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none group-hover:bg-secondary/20 transition-colors duration-700" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 mb-8 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 lg:gap-8 text-center sm:text-left">
          <div className="w-16 lg:w-24 h-16 lg:h-24 rounded-2xl lg:rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
            <img src={product.image} className="w-full h-full object-cover" alt={t(product.titleEn, product.titleBn)} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[8px] lg:text-[9px] font-black tracking-[2px] lg:tracking-[3px] uppercase mb-2 lg:mb-3 shadow-lg mx-auto sm:mx-0">
              <Zap className="w-3 lg:w-3.5 h-3 lg:h-3.5 fill-primary" />
              {t(product.badgeEn, product.badgeBn)}
            </div>
            <h3 className="text-2xl lg:text-4xl font-black tracking-tighter leading-none grad-text">
              {t(product.titleEn, product.titleBn)}
            </h3>
          </div>
        </div>

        <div className="lg:text-right max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
          <p className="text-text-secondary text-xs lg:text-sm font-medium leading-relaxed opacity-80">
            {t(product.shortDescriptionEn, product.shortDescriptionBn)}
          </p>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="relative z-10 mb-8 lg:mb-12 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-2 lg:mx-0 px-2 lg:px-0">
        <div className="min-w-[500px] lg:min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 lg:gap-4 border-b border-white/10 pb-4 mb-4">
            <div className="col-span-6">
              <span className="text-[8px] lg:text-[9px] font-black text-white/40 uppercase tracking-[2px] lg:tracking-[3px]">Plan Comparison</span>
            </div>
            <div className="col-span-6 grid grid-cols-3 gap-1 lg:gap-2 text-center">
              {product.plans.map((plan: any) => (
                <div key={plan.id} className="flex flex-col items-center">
                  <span className="text-[7px] lg:text-[10px] font-black text-white/80 uppercase tracking-[1px] lg:tracking-[2px] truncate w-full">{t(plan.nameEn, plan.nameBn)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-1.5 lg:space-y-2">
            {(product.features || []).filter((f: any) => f.visible).sort((a: any, b: any) => a.order - b.order).map((f: any) => (
              <div key={f.id} className={`grid grid-cols-12 gap-2 lg:gap-4 p-2.5 lg:p-4 rounded-xl lg:rounded-2xl transition-all ${f.highlighted ? 'bg-primary/5 border border-primary/20 shadow-inner' : 'hover:bg-white/[0.02]'}`}>
                <div className="col-span-6 flex items-center gap-3 lg:gap-4">
                  <div className={`w-6 lg:w-8 h-6 lg:h-8 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 ${f.highlighted ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40'}`}>
                    {f.highlighted ? <Sparkles className="w-3 h-3 lg:w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5 lg:w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] lg:text-sm font-bold tracking-tight leading-tight ${f.highlighted ? 'text-white' : 'text-white/80'}`}>
                    {t(f.textEn, f.textBn)}
                  </span>
                </div>
                <div className="col-span-6 grid grid-cols-3 gap-1 lg:gap-2">
                  {product.plans.map((plan: any) => {
                    const isIncluded = !f.includedInPlanIds || f.includedInPlanIds.length === 0 || f.includedInPlanIds.includes(plan.id);
                    return (
                      <div key={plan.id} className="flex items-center justify-center">
                        {isIncluded ? (
                          <div className="w-5 lg:w-7 h-5 lg:h-7 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                            <Check className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 lg:w-7 h-5 lg:h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-500/20 border border-red-500/10">
                            <X className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Selection & CTA */}
      <div className="relative z-10 mt-auto pt-6 lg:pt-10 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 w-full">
            {product.plans.map((plan: any, i: number) => {
              const isLifetime = plan.nameEn?.toLowerCase().includes('lifetime');
              const isYearly = plan.nameEn?.toLowerCase().includes('yearly');

              const planColor = isLifetime
                ? 'from-amber-400 to-orange-600'
                : isYearly
                  ? 'from-purple-500 to-indigo-600'
                  : 'from-blue-500 to-cyan-600';

              const planBorder = isLifetime
                ? 'hover:border-amber-500/50 shadow-amber-500/5'
                : isYearly
                  ? 'hover:border-purple-500/50 shadow-purple-500/5'
                  : 'hover:border-blue-500/50 shadow-blue-500/5';

              return (
                <button
                  key={plan.id}
                  onClick={() => {
                    setActivePlanId(plan.id);
                    handleJoin(product, plan);
                  }}
                  className={`relative p-5 lg:p-6 rounded-2xl lg:rounded-[28px] flex flex-col items-center gap-2 lg:gap-3 transition-all group/btn overflow-hidden border-2 bg-white/[0.02] hover:bg-white/[0.06] border-white/10 ${planBorder} group-hover:scale-[1.02] shadow-2xl transition-all duration-300`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-10 bg-gradient-to-br ${planColor} transition-opacity duration-500`} />

                  <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-[2px] lg:tracking-[3px] transition-colors duration-300 ${
                    isLifetime ? 'text-amber-400' : isYearly ? 'text-purple-400' : 'text-blue-400'
                  }`}>
                    {t(plan.nameEn, plan.nameBn)}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl lg:text-3xl font-black tracking-tighter group-hover/btn:scale-105 transition-transform duration-500 text-white">{plan.priceTk}</span>
                    <span className="text-[8px] lg:text-[10px] font-black opacity-40 uppercase tracking-widest ml-1 text-white">TK</span>
                  </div>
                  {isLifetime && <Star className="absolute top-3 right-3 w-3 h-3 fill-amber-500 text-amber-500 animate-pulse" />}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[350px] flex flex-col gap-4 lg:gap-5">
            <button
              onClick={() => handleJoin(product, activePlan)}
              className="w-full bg-white text-black py-5 lg:py-6 rounded-2xl lg:rounded-[32px] font-black text-xs lg:text-base uppercase tracking-[3px] lg:tracking-[4px] hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 lg:gap-4 group/main overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover/main:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">{t(product.buttonTextEn || 'Secure Access', product.buttonTextBn || 'অ্যাক্সেস নিশ্চিত করুন')}</span>
              <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 group-hover/main:translate-x-2 transition-transform relative z-10" />
            </button>

            {product.telegramLink && (
              <a
                href={product.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-[8px] lg:text-[10px] font-black text-white/60 hover:text-primary transition-all tracking-[2px] lg:tracking-[3px] uppercase"
              >
                {t('CONSULT ON TELEGRAM', 'টেলিগ্রামে পরামর্শ নিন')}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductShowcase = ({ data }: { data: any }) => {
  const { language, setSelectedOrderContext } = useStore();
  const products = data || [];
  const router = useRouter();

  const handleJoin = (product: any, plan: any) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({ content_name: product.titleEn, value: plan.priceTk, currency: 'BDT' });
    router.push('/checkout');
  };

  const visibleProducts = [...products].filter((p: any) => p.visible).sort((a: any, b: any) => a.order - b.order);

  return (
    <section id="products" className="py-6 lg:py-12 relative overflow-hidden bg-bg-dark">
      <div className="container mx-auto px-1 lg:px-2">
        <div className="text-center max-w-5xl mx-auto mb-4 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black tracking-[4px] uppercase mb-8 shadow-xl"
          >
            <Sparkles className="w-4 h-4 fill-primary" />
            {language === 'en' ? 'Absolute Elite Access' : 'অ্যাবসলিউট এলিট অ্যাক্সেস'}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-7xl font-black mb-10 lg:mb-12 tracking-tighter leading-[1] lg:leading-[0.85]"
          >
            {language === 'en' ? 'Choose a plan that fits your' : 'বেছে নিন আপনার'}
            <span className="block mt-4 lg:mt-6 bg-gradient-to-r from-primary via-secondary to-info bg-clip-text text-transparent">{language === 'en' ? 'Ambition.' : 'লক্ষ্যপূরণের প্ল্যান।'}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg lg:text-xl font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {language === 'en' ? 'From essential tools to legendary lifetime mastery. Explore the elite vault of premium inventory.' : 'অত্যাবশ্যকীয় টুলস থেকে শুরু করে লেজেন্ডারি লাইফটাইম মাস্টারি—প্রিমিয়াম ইনভেন্টরির এলিট ভল্ট ঘুরে দেখুন।'}
          </motion.p>
        </div>

        <div className="flex lg:flex-col gap-6 lg:gap-32 overflow-x-auto lg:overflow-visible pb-10 lg:pb-0 snap-x snap-mandatory lg:snap-none scrollbar-hide -mx-4 lg:mx-0 px-4 lg:px-0">
          {visibleProducts.map((product, idx) => (
            <div key={product.id} className="min-w-[85vw] sm:min-w-[400px] lg:min-w-full snap-center lg:snap-align-none">
              <ProductCard
                product={product}
                idx={idx}
                language={language}
                handleJoin={handleJoin}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
