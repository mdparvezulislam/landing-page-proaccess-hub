import React from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan } from '../store/useStore';
import { Check, ArrowRight, Zap, Star } from 'lucide-react';
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

  const visibleProducts = products.filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="products" className="py-24 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
             <Star className="w-3 h-3 fill-secondary" />
             {t('Elite Access', 'এলিট অ্যাক্সেস')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter"
          >
            {t('Choose Your ', 'আপনার ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('Premium', 'প্রিমিয়াম')}</span>{' '}
            {t('Vault', 'ভল্ট')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg lg:text-xl font-medium"
          >
            {t('Select the plan that fits your goals and get instant access to our private resources.', 'আপনার লক্ষ্য অনুযায়ী প্ল্যানটি বেছে নিন এবং আমাদের প্রাইভেট রিসোর্সে তাৎক্ষণিক অ্যাক্সেস পান।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="glass-card rounded-[48px] p-8 lg:p-14 relative group hover:bg-white/[0.05] transition-all duration-500 border-white/[0.05] flex flex-col"
            >
              <div className="absolute top-10 right-10">
                <div className="px-5 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
                  <Zap className="w-3 h-3 fill-primary" />
                  {t(product.badge, product.badgeBn)}
                </div>
              </div>

              <div className="mb-10">
                <div className="w-20 h-20 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                   <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                </div>
                <h3 className="text-3xl lg:text-5xl font-black mb-4 tracking-tight">
                  {t(product.title, product.titleBn)}
                </h3>
                <p className="text-text-secondary text-lg font-medium leading-relaxed">
                  {t(product.shortDescription, product.shortDescriptionBn)}
                </p>
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {product.bulletPoints.filter(bp => bp.visible).sort((a, b) => a.order - b.order).map((bp, i) => (
                  <div key={bp.id} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-text-secondary text-sm lg:text-base font-bold">
                      {t(bp.text, bp.textBn)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-5 mt-auto">
                {product.plans.map((plan, i) => (
                  <button
                    key={plan.id}
                    onClick={() => handleJoin(product, plan)}
                    className={`w-full p-8 rounded-[28px] flex items-center justify-between transition-all group/btn relative overflow-hidden ${
                      i === 0 
                        ? 'bg-primary hover:bg-primary-light text-white glow-btn shadow-2xl shadow-primary/20' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary'
                    }`}
                  >
                    <div className="text-left relative z-10">
                      <p className={`text-[10px] font-black uppercase tracking-[2px] mb-2 ${i === 0 ? 'text-white/70' : 'text-text-muted'}`}>{t(plan.name, plan.nameBn)}</p>
                      <p className="text-3xl font-black">
                        {plan.priceTk} <span className="text-sm font-bold opacity-60">TK</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest relative z-10">
                      {t(product.buttonText, product.buttonTextBn)}
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </div>
                    {i === 0 && (
                       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    )}
                  </button>
                ))}
                
                {product.telegramLink && (
                   <a 
                     href={product.telegramLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-center text-xs font-black text-text-muted hover:text-primary transition-colors mt-2 tracking-widest uppercase"
                   >
                     {t('Contact via Telegram', 'টেলিগ্রামের মাধ্যমে যোগাযোগ করুন')}
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
