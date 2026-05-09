import React from 'react';
import { motion } from 'motion/react';
import { useStore, Product, ProductPlan, Feature } from '../store/useStore';
import { Check, X, ArrowRight, Shield, Zap, Info } from 'lucide-react';
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
  const visibleFeatures = pricingFeatures.filter(f => f.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="pricing" className="py-24 lg:py-48 relative overflow-hidden bg-[#020617]">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-[3px] uppercase mb-8 shadow-lg shadow-primary/10"
          >
             <Zap className="w-4 h-4 fill-primary" />
             {t('UNBEATABLE VALUE', 'সেরা প্রাইসিং প্ল্যান')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            {t('Premium Tools, ', 'প্রিমিয়াম টুলস, ')}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary drop-shadow-2xl">
              {t('Simplified Access', 'সহজ অ্যাক্সেস')}
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Join 10,000+ smart Bangladeshis. Choose your package and unlock a world of digital possibilities instantly.', '১০,০০০+ স্মার্ট বাংলাদেশীদের সাথে যোগ দিন। আপনার প্যাকেজটি বেছে নিন এবং তাৎক্ষণিকভাবে ডিজিটাল সম্ভাবনার দুয়ার খুলে ফেলুন।')}
          </motion.p>
        </div>

        {/* Feature Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative glass-card rounded-[40px] md:rounded-[60px] border-white/10 shadow-2xl overflow-hidden bg-white/[0.02]">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="sticky left-0 z-20 bg-[#0F172A]/95 backdrop-blur-xl p-10 md:p-14 text-left w-1/3 min-w-[280px]">
                      <h3 className="text-2xl font-black text-text-primary tracking-tight">
                        {t('Features', 'ফিচার সমূহ')}
                      </h3>
                      <p className="text-[10px] text-text-muted font-black uppercase tracking-[2px] mt-2">
                        {t('Compare and Choose', 'তুলনা করুন এবং বেছে নিন')}
                      </p>
                    </th>
                    {visibleProducts.map(p => (
                      <th key={p.id} className="p-10 md:p-14 text-center min-w-[240px]">
                        <div className="relative inline-block mb-6">
                           <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-500">
                              <img src={p.image} className="w-full h-full object-cover rounded-xl" alt={p.title} />
                           </div>
                           {p.badge && (
                             <div className="absolute -top-3 -right-3 bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/30 tracking-widest uppercase">
                                {t(p.badge, p.badgeBn)}
                             </div>
                           )}
                        </div>
                        <h4 className="text-2xl font-black text-text-primary tracking-tight mb-1">
                          {t(p.title, p.titleBn)}
                        </h4>
                        <p className="text-[10px] font-black text-primary-light uppercase tracking-[2.5px]">
                          {t(p.subtitle, p.subtitleBn)}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {visibleFeatures.map((f: Feature) => (
                    <tr key={f.id} className="group/row hover:bg-white/[0.03] transition-colors">
                      <td className={`sticky left-0 z-20 bg-[#0F172A]/90 backdrop-blur-xl p-8 md:px-14 md:py-10 border-r border-white/5 ${f.highlighted ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-2 h-2 rounded-full transition-all duration-500 ${f.highlighted ? 'bg-primary scale-150 shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-white/10 group-hover/row:bg-primary/40'}`} />
                           <span className={`text-lg font-bold tracking-tight transition-all ${f.highlighted ? 'text-text-primary scale-105 origin-left' : 'text-text-secondary group-hover/row:text-text-primary'}`}>
                             {t(f.text, f.textBn)}
                           </span>
                        </div>
                      </td>
                      {visibleProducts.map(p => {
                        return (
                          <td key={p.id} className={`p-8 md:p-10 text-center ${f.highlighted ? 'bg-primary/[0.02]' : ''}`}>
                            <div className="flex justify-center">
                               {f.available ? (
                                 <motion.div 
                                   whileHover={{ scale: 1.2, rotate: 360 }}
                                   className="w-12 h-12 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success shadow-lg shadow-success/10"
                                 >
                                   <Check className="w-6 h-6 stroke-[3]" />
                                 </motion.div>
                               ) : (
                                 <div className="w-12 h-12 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/40">
                                   <X className="w-6 h-6 stroke-[3]" />
                                 </div>
                               )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  
                  {/* Action Buttons Row */}
                  <tr className="bg-white/[0.01]">
                    <td className="sticky left-0 z-20 bg-[#0F172A]/95 backdrop-blur-xl p-10 md:p-14 border-t border-white/10">
                       <div className="flex items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10">
                          <Info className="w-5 h-5 text-primary-light" />
                          <p className="text-xs font-bold text-text-muted leading-relaxed">
                             {t('All payments are one-time. No subscriptions required for basic tools.', 'সব পেমেন্ট এককালীন। কোনো সাবস্ক্রিপশন ফি নেই।')}
                          </p>
                       </div>
                    </td>
                    {visibleProducts.map(p => (
                      <td key={p.id} className="p-10 md:p-14 text-center align-top border-t border-white/10">
                        <div className="space-y-6">
                           {p.plans.map((plan, idx) => (
                             <motion.button
                               key={plan.id}
                               onClick={() => handleJoin(p, plan)}
                               whileHover={{ scale: 1.02, y: -4 }}
                               whileTap={{ scale: 0.98 }}
                               className={`w-full group/btn relative overflow-hidden py-6 px-8 rounded-[24px] text-xs font-black tracking-[2.5px] uppercase transition-all flex flex-col items-center justify-center gap-2 ${
                                 idx === 0 
                                   ? 'bg-primary text-white shadow-2xl shadow-primary/40' 
                                   : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary'
                               }`}
                             >
                               <span className="relative z-10 opacity-70 group-hover/btn:opacity-100 transition-opacity">
                                  {t(plan.name, plan.nameBn)}
                               </span>
                               <span className="relative z-10 text-2xl tracking-tighter">
                                  {plan.priceTk} <span className="text-sm font-bold opacity-60">TK</span>
                               </span>
                               
                               {idx === 0 && (
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                               )}
                               
                               <div className="mt-2 flex items-center gap-2 opacity-0 group-hover/btn:opacity-100 transition-all translate-y-2 group-hover/btn:translate-y-0">
                                  {t('Secure Checkout', 'সিকিউর চেকআউট')}
                                  <ArrowRight className="w-4 h-4" />
                               </div>
                             </motion.button>
                           ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Visual enhancements */}
            <div className="absolute top-0 right-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 opacity-60">
             <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                <Shield className="w-4 h-4 text-success" />
                {t('Secure Payments', 'নিরাপদ পেমেন্ট')}
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                <Zap className="w-4 h-4 text-primary" />
                {t('Instant Delivery', 'তাৎক্ষণিক ডেলিভারি')}
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                <Check className="w-4 h-4 text-secondary" />
                {t('Verified Methods', 'ভেরিফাইড মেথড')}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
