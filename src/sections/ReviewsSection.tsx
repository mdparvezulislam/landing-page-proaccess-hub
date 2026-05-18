"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  _id: string;
  visible: boolean;
  order: number;
  rating: number;
  reviewEn: string;
  reviewBn: string;
  image: string;
  name: string;
  roleEn: string;
  roleBn: string;
}

export const ReviewsSection = ({ data }: { data: ReviewItem[] }) => {
  const { language } = useStore();
  const reviews = data || [];
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleReviews = [...reviews].filter((r) => r.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="reviews" className="py-16 lg:py-24 relative bg-bg-dark overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black tracking-[2px] uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('COMMUNITY FEEDBACK', 'কমিউনিটি ফিডব্যাক')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-7xl font-black mb-4 lg:mb-8 tracking-tighter leading-tight"
          >
            {t('What Our Elite', 'আমাদের এলিট')}
            <span className="grad-text block mt-2 lg:mt-4">{t('Members Say', 'মেম্বারদের অভিজ্ঞতা')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-sm lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('Join thousands of satisfied users who have transformed their digital journey with Pro Access.', 'হাজার হাজার সফল মেম্বারদের সাথে যোগ দিন যারা প্রো অ্যাক্সেসের মাধ্যমে তাদের লক্ষ্য পূরণ করেছে।')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {visibleReviews.map((review, idx) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="glass-card rounded-[32px] lg:rounded-[40px] p-6 lg:p-12 relative group hover:bg-white/[0.04] transition-all duration-700 flex flex-col shadow-2xl"
            >
              <Quote className="absolute top-8 lg:top-12 right-8 lg:right-12 w-10 lg:w-16 h-10 lg:h-16 text-primary/5 group-hover:text-primary/10 transition-colors duration-700" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${i < review.rating ? 'text-warning fill-warning' : 'text-white/10'}`} 
                  />
                ))}
              </div>

              <p className="text-text-primary text-sm lg:text-2xl font-medium leading-relaxed italic mb-10 flex-1 relative z-10">
                &ldquo;{t(review.reviewEn, review.reviewBn)}&rdquo;
              </p>

              <div className="flex items-center gap-4 lg:gap-6 pt-8 border-t border-white/5">
                <div className="w-12 lg:w-16 h-12 lg:h-16 rounded-2xl lg:rounded-[20px] bg-white/5 p-1 border border-white/10 shadow-xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
                   <img src={review.image} className="w-full h-full object-cover rounded-xl" alt={review.name} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base lg:text-xl font-black text-text-primary tracking-tight">{review.name}</span>
                    <CheckCircle2 className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-secondary" />
                  </div>
                  <span className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] lg:tracking-[4px]">
                    {t(review.roleEn, review.roleBn)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
