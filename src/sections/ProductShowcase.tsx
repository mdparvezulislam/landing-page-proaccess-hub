import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackAddToCart } from '../utils/facebookPixel';

export const ProductShowcase = () => {
  const { language, products, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const handleJoin = (product: any, plan: any) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({ content_name: product.nameEn, value: plan.priceTk, currency: 'BDT' });
    navigate('/checkout');
  };

  return (
    <section id="products" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            {language === 'en' ? 'Choose Your ' : 'আপনার '}
            <span className="grad-text">{language === 'en' ? 'Elite' : 'এলিট'}</span>{' '}
            {language === 'en' ? 'Package' : 'প্যাকেজ বেছে নিন'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            {language === 'en' 
              ? 'Select the plan that fits your goals and get instant access to the vault.' 
              : 'আপনার লক্ষ্য অনুযায়ী প্ল্যানটি বেছে নিন এবং ভল্টে তাৎক্ষণিক অ্যাক্সেস পান।'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass-card rounded-[32px] p-8 lg:p-10 premium-shadow relative group hover:bg-white/[0.04] transition-all"
            >
              <div className="absolute top-6 right-8">
                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-bold flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-primary" />
                  {language === 'en' ? 'PREMIUM' : 'প্রিমিয়াম'}
                </div>
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-text-primary">
                {language === 'en' ? product.nameEn : product.nameBn}
              </h3>
              <p className="text-text-secondary mb-8">
                {language === 'en' ? product.descriptionEn : product.descriptionBn}
              </p>

              <div className="space-y-4 mb-10">
                {(language === 'en' ? product.featuresEn : product.featuresBn).slice(0, 6).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span className="text-text-secondary text-sm lg:text-base leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
                {(language === 'en' ? product.featuresEn : product.featuresBn).length > 6 && (
                  <p className="text-primary-light text-sm font-medium pl-8">
                    + {(language === 'en' ? product.featuresEn : product.featuresBn).length - 6} {language === 'en' ? 'more secrets...' : 'আরও সিক্রেট...'}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-auto">
                {product.plans.map((plan, i) => (
                  <button
                    key={i}
                    onClick={() => handleJoin(product, plan)}
                    className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all group/btn ${
                      i === 0 
                        ? 'bg-primary hover:bg-primary-light text-white glow-btn' 
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{plan.name}</p>
                      <p className="text-2xl font-bold">
                        {plan.priceTk} <span className="text-sm font-normal">TK</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      {language === 'en' ? 'Join Now' : 'যোগ দিন'}
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
