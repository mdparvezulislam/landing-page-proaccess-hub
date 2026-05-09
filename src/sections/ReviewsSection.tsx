import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Star, Quote, Heart } from 'lucide-react';

export const ReviewsSection = () => {
  const { language, reviews } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleReviews = reviews.filter(r => r.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="reviews" className="py-24 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
             <Heart className="w-3 h-3 fill-red-400" />
             {t('User Love', 'ইউজার ভালোবাসা')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter"
          >
            {t('What Our ', 'আমাদের ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('VIP Members', 'ভিআইপি মেম্বাররা')}</span>{' '}
            {t('Say', 'যা বলছেন')}
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-text-secondary text-lg font-medium"
          >
             {t('Join thousands of satisfied members who have transformed their digital journey with our resources.', 'হাজার হাজার সন্তুষ্ট সদস্যদের সাথে যোগ দিন যারা আমাদের রিসোর্স দিয়ে তাদের ডিজিটাল যাত্রা পরিবর্তন করেছেন।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {visibleReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-10 rounded-[48px] glass-card relative group hover:bg-white/[0.05] transition-all duration-500 flex flex-col h-full border-white/[0.05]"
            >
              <Quote className="absolute top-10 right-10 w-16 h-16 text-white/[0.02] group-hover:text-primary/5 transition-all duration-700" />
              
              <div className="flex gap-1.5 mb-8">
                {[...Array(5)].map((_, idx) => (
                  <Star 
                    key={idx} 
                    className={`w-5 h-5 ${idx < review.rating ? 'text-warning fill-warning' : 'text-white/10'}`} 
                  />
                ))}
              </div>

              <p className="text-text-secondary text-lg font-medium leading-relaxed mb-10 flex-grow">
                "{t(review.review, review.reviewBn)}"
              </p>

              <div className="flex items-center gap-5 pt-8 border-t border-white/5">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary blur-lg opacity-20" />
                   <img 
                     src={review.image} 
                     alt={review.name}
                     className="relative w-14 h-14 rounded-2xl object-cover border-2 border-white/10"
                   />
                </div>
                <div>
                  <h4 className="font-black text-text-primary tracking-tight">{review.name}</h4>
                  <p className="text-xs font-black text-primary-light uppercase tracking-widest mt-1">
                    {t(review.role, review.roleBn)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
