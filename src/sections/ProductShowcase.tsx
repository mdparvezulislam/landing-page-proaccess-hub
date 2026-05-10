import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan, Language } from '../store/useStore';
import { Check, ArrowRight, Zap, Star, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackAddToCart } from '../utils/facebookPixel';

interface ProductCardProps {
  product: Product;
  idx: number;
  language: Language;
  handleJoin: (product: Product, plan: ProductPlan) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, idx, language, handleJoin }) => {
  const [activePlanId, setActivePlanId] = useState(product.plans[product.plans.length - 1]?.id);
  const t = (en: string, bn: string) => language === 'en' ? (en || '') : (bn || '');

  const activePlan = product.plans.find(p => p.id === activePlanId) || product.plans[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-[32px] lg:rounded-[64px] p-5 lg:p-20 relative group hover:bg-white/[0.04] transition-all duration-700 border-white/[0.05] flex flex-col shadow-2xl overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-primary/5 blur-[80px] lg:blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 lg:w-64 h-48 lg:h-64 bg-secondary/5 blur-[80px] lg:blur-[100px] rounded-full pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 mb-10 lg:mb-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 lg:gap-10 text-center sm:text-left">
          <div className="w-16 lg:w-32 h-16 lg:h-32 rounded-2xl lg:rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
            <img src={product.image} className="w-full h-full object-cover" alt={t(product.titleEn, product.titleBn)} />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[8px] lg:text-[10px] font-black tracking-[2px] lg:tracking-[4px] uppercase mb-3 lg:mb-4 shadow-lg mx-auto sm:mx-0">
              <Zap className="w-3 lg:w-3.5 h-3 lg:h-3.5 fill-primary" />
              {t(product.badgeEn, product.badgeBn)}
            </div>
            <h3 className="text-2xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
              {t(product.titleEn, product.titleBn)}
            </h3>
          </div>
        </div>

        <div className="lg:text-right max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
          <p className="text-text-secondary text-xs lg:text-lg font-medium leading-relaxed opacity-80">
            {t(product.shortDescriptionEn, product.shortDescriptionBn)}
          </p>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="relative z-10 mb-10 lg:mb-20 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-2 lg:mx-0 px-2 lg:px-0">
        <div className="min-w-[500px] lg:min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 lg:gap-4 border-b border-white/10 pb-4 lg:pb-6 mb-4 lg:mb-6">
            <div className="col-span-6">
              <span className="text-[8px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] lg:tracking-[4px]">Plan Comparison</span>
            </div>
            <div className="col-span-6 grid grid-cols-3 gap-1 lg:gap-2 text-center">
              {product.plans.map(plan => (
                <div key={plan.id} className="flex flex-col items-center">
                  <span className="text-[7px] lg:text-[9px] font-black text-text-primary uppercase tracking-[1px] lg:tracking-[2px] truncate w-full">{t(plan.nameEn, plan.nameBn)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2 lg:space-y-3">
            {(product.features || []).filter(f => f.visible).sort((a, b) => a.order - b.order).map((f) => (
              <div key={f.id} className={`grid grid-cols-12 gap-2 lg:gap-4 p-3 lg:p-6 rounded-xl lg:rounded-3xl transition-all ${f.highlighted ? 'bg-primary/5 border border-primary/20 shadow-inner' : 'hover:bg-white/[0.02]'}`}>
                <div className="col-span-6 flex items-center gap-3 lg:gap-4">
                  <div className={`w-6 lg:w-10 h-6 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 ${f.highlighted ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}>
                    {f.highlighted ? <Sparkles className="w-3 h-3 lg:w-4 h-4" /> : <ShieldCheck className="w-3.5 h-3.5 lg:w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] lg:text-lg font-black tracking-tight leading-tight ${f.highlighted ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {t(f.textEn, f.textBn)}
                  </span>
                </div>
                <div className="col-span-6 grid grid-cols-3 gap-1 lg:gap-2">
                  {product.plans.map(plan => {
                    const isIncluded = !f.includedInPlanIds || f.includedInPlanIds.length === 0 || f.includedInPlanIds.includes(plan.id);
                    return (
                      <div key={plan.id} className="flex items-center justify-center">
                        {isIncluded ? (
                          <div className="w-5 lg:w-8 h-5 lg:h-8 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                            <Check className="w-2.5 lg:w-4 h-2.5 lg:h-4 stroke-[3] lg:stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 lg:w-8 h-5 lg:h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500/30 border border-red-500/10">
                            <X className="w-2.5 lg:w-4 h-2.5 lg:h-4 stroke-[3] lg:stroke-[3]" />
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
      <div className="relative z-10 mt-auto pt-8 lg:pt-16 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 w-full">
            {product.plans.map((plan, i) => (
              <button
                key={plan.id}
                onClick={() => setActivePlanId(plan.id)}
                className={`relative p-5 lg:p-8 rounded-2xl lg:rounded-[32px] flex flex-col items-center gap-2 lg:gap-3 transition-all group/btn overflow-hidden border-2 ${activePlanId === plan.id
                  ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 sm:scale-105'
                  : 'bg-white/[0.02] hover:bg-white/[0.08] border-white/10 text-text-primary'
                  }`}
              >
                <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-[2px] lg:tracking-[3px] ${activePlanId === plan.id ? 'text-white/80' : 'text-text-muted'}`}>
                  {t(plan.nameEn, plan.nameBn)}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl lg:text-5xl font-black tracking-tighter">{plan.priceTk}</span>
                  <span className="text-[8px] lg:text-[10px] font-black opacity-60 uppercase tracking-widest ml-1">TK</span>
                </div>
                {activePlanId === plan.id && <Star className="absolute top-3 right-3 w-3 h-3 fill-white animate-pulse" />}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-[400px] flex flex-col gap-4 lg:gap-6">
            <button
              onClick={() => handleJoin(product, activePlan)}
              className="w-full bg-white text-black py-5 lg:py-8 rounded-2xl lg:rounded-[32px] font-black text-xs lg:text-xl uppercase tracking-[3px] lg:tracking-[4px] hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 lg:gap-4 group/main"
            >
              {t(product.buttonTextEn || 'Secure Access', product.buttonTextBn || 'অ্যাক্সেস নিশ্চিত করুন')}
              <ArrowRight className="w-4 lg:w-6 h-4 lg:h-6 group-hover/main:translate-x-2 transition-transform" />
            </button>

            {product.telegramLink && (
              <a
                href={product.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-[8px] lg:text-[11px] font-black text-text-muted hover:text-primary transition-all tracking-[2px] lg:tracking-[4px] uppercase"
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

export const ProductShowcase = () => {
  const { language, products, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const handleJoin = (product: Product, plan: ProductPlan) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({ content_name: product.titleEn, value: plan.priceTk, currency: 'BDT' });
    navigate('/checkout');
  };

  const visibleProducts = [...products].filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="py-20 lg:py-48 relative overflow-hidden bg-bg-dark">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-5xl mx-auto mb-24 lg:mb-40">
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
            className="text-5xl lg:text-9xl font-black mb-10 lg:mb-12 tracking-tighter leading-[1] lg:leading-[0.85]"
          >
            {language === 'en' ? 'Choose a plan that fits your' : 'বেছে নিন আপনার'}
            <span className="grad-text block mt-4 lg:mt-6">{language === 'en' ? 'Ambition.' : 'লক্ষ্যপূরণের প্ল্যান।'}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg lg:text-3xl font-medium max-w-3xl mx-auto leading-relaxed"
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
