import React from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan } from '../store/useStore';
import { Check, X, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Pricing = () => {
  const { language, products, pricingFeatures, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const handleJoin = (product: Product, plan: ProductPlan) => {
    setSelectedOrderContext({ product, plan });
    navigate('/checkout');
  };

  const visibleProducts = products.filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="pricing" className="py-24 lg:py-40 relative overflow-hidden bg-white/[0.01]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
             <Shield className="w-3 h-3" />
             {t('Transparent Pricing', 'স্বচ্ছ প্রাইসিং')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-7xl font-black mb-8 tracking-tighter"
          >
            {t('Invest in your ', 'আপনার ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('Success', 'সফলতায়')}</span>{' '}
            {t('Growth', 'ইনভেস্ট করুন')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary text-lg font-medium"
          >
            {t('Choose the plan that fits your business goals. No hidden fees, ever.', 'আপনার ব্যবসার লক্ষ্য অনুযায়ী প্ল্যানটি বেছে নিন। কোনো গোপন ফি নেই।')}
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto overflow-hidden rounded-[48px] glass-card border-white/5 relative group">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-10 text-left text-text-muted font-black uppercase text-xs tracking-widest border-b border-white/5">Features</th>
                  {visibleProducts.map(p => (
                    <th key={p.id} className="p-10 text-center border-b border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                         <img src={p.image} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <p className="text-2xl font-black text-text-primary mb-1">
                        {t(p.title, p.titleBn)}
                      </p>
                      <p className="text-[10px] font-black text-primary-light uppercase tracking-widest">{t('Premium Access', 'প্রিমিয়াম অ্যাক্সেস')}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingFeatures.map((f, i) => (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors group/row">
                    <td className="p-8 text-text-secondary font-bold border-b border-white/[0.03] pl-10">
                      {t(f.text, f.textBn)}
                    </td>
                    {visibleProducts.map(p => (
                      <td key={p.id} className="p-8 text-center border-b border-white/[0.03]">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mx-auto group-hover/row:scale-110 transition-transform">
                           <Check className="w-5 h-5 text-success" />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-10 border-t border-white/5"></td>
                  {visibleProducts.map(p => (
                    <td key={p.id} className="p-10 text-center border-t border-white/5">
                      <div className="flex flex-col gap-4">
                        {p.plans.map((plan, idx) => (
                          <button
                            key={plan.id}
                            onClick={() => handleJoin(p, plan)}
                            className={`w-full py-5 px-6 rounded-2xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                              idx === 0 
                                ? 'bg-primary hover:bg-primary-light text-white shadow-xl shadow-primary/20' 
                                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary'
                            }`}
                          >
                            {plan.priceTk} TK • {t(plan.name, plan.nameBn)}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Accent decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
