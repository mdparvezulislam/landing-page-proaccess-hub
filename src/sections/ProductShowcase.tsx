import React from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan } from '../store/useStore';
import { Check, ArrowRight, Zap, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackAddToCart } from '../utils/facebookPixel';

export const ProductShowcase = () => {
  const { language, products, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const handleJoin = (product: Product, plan: ProductPlan) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({ content_name: product.title, value: plan.priceTk, currency: 'BDT' });
    navigate('/checkout');
  };

  const visibleProducts = [...products].filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="py-24 lg:py-40 relative overflow-hidden bg-[#020617]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24 lg:mb-36">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-black tracking-[3px] uppercase mb-8"
          >
             <Star className="w-4 h-4 fill-secondary" />
             {t('Elite Access Vault', 'এলিট অ্যাক্সেস ভল্ট')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-8xl font-black mb-10 tracking-tighter leading-[0.9]"
          >
            {t('Explore the', 'আপনার')}
            <span className="premium-gradient-text block mt-4">{t('Premium Inventory', 'প্রিমিয়াম ভল্ট')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Select the ultimate package that fits your ambition and unlock instant access to our private world-class resources.', 'আপনার লক্ষ্য অনুযায়ী প্যাকেজটি বেছে নিন এবং আমাদের ওয়ার্ল্ড-ক্লাস রিসোর্সে তাৎক্ষণিক অ্যাক্সেস পান।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-7xl mx-auto">
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-[60px] p-10 lg:p-16 relative group hover:bg-white/[0.04] transition-all duration-700 border-white/[0.05] flex flex-col shadow-2xl"
            >
              {/* Card Badge */}
              <div className="absolute top-10 right-10">
                <div className="px-6 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary-light text-[11px] font-black tracking-[4px] flex items-center gap-2.5 uppercase shadow-lg">
                  <Zap className="w-4 h-4 fill-primary" />
                  {t(product.badge, product.badgeBn)}
                </div>
              </div>

              <div className="mb-12">
                <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                    <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                </div>
                <h3 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter leading-tight">
                  {t(product.title, product.titleBn)}
                </h3>
                <p className="text-text-secondary text-lg lg:text-xl font-medium leading-relaxed max-w-md">
                  {t(product.shortDescription, product.shortDescriptionBn)}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-6 mb-16 flex-1">
                {product.bulletPoints.filter(bp => bp.visible).sort((a, b) => a.order - b.order).map((bp, i) => (
                  <div key={bp.id} className="flex items-start gap-5 group/item">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center border border-success/20 group-hover/item:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-text-primary text-base lg:text-lg font-black tracking-tight">
                      {t(bp.text, bp.textBn)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Plan Buttons */}
              <div className="flex flex-col gap-6 mt-auto">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[4px] ml-2 mb-2 flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-secondary" />
                   {t('SELECT YOUR ACCESS TIER', 'অ্যাক্সেস টিয়ার বেছে নিন')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {product.plans.map((plan, i) => (
                    <button
                      key={plan.id}
                      onClick={() => handleJoin(product, plan)}
                      className={`relative p-8 rounded-[32px] flex flex-col items-center gap-3 transition-all group/btn overflow-hidden border-2 ${
                        i === 2 
                          ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30' 
                          : 'bg-white/[0.02] hover:bg-white/[0.08] border-white/10 text-text-primary'
                      }`}
                    >
                      <span className={`text-[10px] font-black uppercase tracking-[3px] ${i === 2 ? 'text-white/80' : 'text-text-muted'}`}>{t(plan.name.split(' ')[0], plan.nameBn.split(' ')[0])}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl lg:text-3xl font-black tracking-tighter">{plan.priceTk}</span>
                        <span className="text-[10px] font-black opacity-60">TK</span>
                      </div>
                      
                      {i === 2 && (
                         <div className="absolute top-0 right-0 p-2 bg-white/20 rounded-bl-xl">
                            <Star className="w-3 h-3 fill-white" />
                         </div>
                      )}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handleJoin(product, product.plans[2])}
                  className="w-full bg-white text-black py-6 rounded-[32px] font-black text-sm uppercase tracking-[4px] hover:bg-primary hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group/main"
                >
                  {t('Get Legendary Access', 'লেজেন্ডারি অ্যাক্সেস নিন')}
                  <ArrowRight className="w-5 h-5 group-hover/main:translate-x-2 transition-transform" />
                </button>

                {product.telegramLink && (
                   <a 
                     href={product.telegramLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-center text-[10px] font-black text-text-muted hover:text-primary transition-all mt-4 tracking-[4px] uppercase"
                   >
                     {t('CONSULT ON TELEGRAM', 'টেলিগ্রামে পরামর্শ নিন')}
                   </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
