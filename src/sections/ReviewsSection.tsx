import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

export const ReviewsSection = () => {
  const { language, reviews } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const visibleReviews = reviews.filter(r => r.visible).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % visibleReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [visibleReviews.length]);

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + visibleReviews.length) % visibleReviews.length);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % visibleReviews.length);

  return (
    <section id="reviews" className="py-24 lg:py-40 relative bg-[#020617] overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-20 lg:mb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-black tracking-[3px] uppercase mb-8"
            >
              <MessageSquare className="w-4 h-4" />
              {t('Community Voice', 'কমিউনিটি ভয়েস')}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9]"
            >
              {t('Trusted by the', 'সেরা উদ্যোক্তাদের')}
              <span className="premium-gradient-text block mt-4">{t('Next Generation', 'পছন্দ')}</span>
            </motion.h2>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={handlePrev}
               className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
             >
               <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
             </button>
             <button 
               onClick={handleNext}
               className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
             >
               <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>

        <div className="relative h-[450px] lg:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
            >
              {/* Profile Image & Badge */}
              <div className="w-full lg:w-1/3 flex justify-center">
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
                   <div className="relative w-48 h-48 lg:w-72 lg:h-72 rounded-[48px] overflow-hidden border-4 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                      <img 
                        src={visibleReviews[activeIndex].image} 
                        className="w-full h-full object-cover" 
                        alt={visibleReviews[activeIndex].name} 
                      />
                   </div>
                   <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-3xl shadow-2xl border border-white/20 animate-float">
                      <CheckCircle2 className="w-8 h-8" />
                   </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="w-full lg:w-2/3 flex flex-col justify-center text-center lg:text-left">
                 <div className="flex justify-center lg:justify-start gap-1.5 mb-8">
                   {[...Array(visibleReviews[activeIndex].rating)].map((_, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                     >
                        <Star className="w-6 h-6 lg:w-8 lg:h-8 fill-warning text-warning" />
                     </motion.div>
                   ))}
                 </div>
                 
                 <div className="relative mb-10">
                    <Quote className="absolute -top-8 -left-10 w-20 h-20 text-white/5 -z-10" />
                    <p className="text-2xl lg:text-4xl font-bold text-text-primary leading-tight lg:leading-tight italic tracking-tight">
                       "{t(visibleReviews[activeIndex].review, visibleReviews[activeIndex].reviewBn)}"
                    </p>
                 </div>

                 <div>
                    <h4 className="text-2xl lg:text-3xl font-black text-text-primary tracking-tighter mb-1">
                       {visibleReviews[activeIndex].name}
                    </h4>
                    <p className="text-sm lg:text-lg font-black text-primary uppercase tracking-[4px]">
                       {t(visibleReviews[activeIndex].role, visibleReviews[activeIndex].roleBn)}
                    </p>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-20 lg:mt-32 flex justify-center gap-3">
          {visibleReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-16 bg-primary' : 'w-4 bg-white/10 hover:bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
