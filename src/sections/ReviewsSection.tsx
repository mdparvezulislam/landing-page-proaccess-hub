import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Star, Quote } from 'lucide-react';

export const ReviewsSection = () => {
  const { language, reviews } = useStore();

  return (
    <section id="reviews" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {language === 'en' ? 'What Our ' : 'আমাদের '}
            <span className="grad-text">{language === 'en' ? 'VIP Members' : 'ভিআইপি মেম্বাররা'}</span>{' '}
            {language === 'en' ? 'Say' : 'যা বলছেন'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] glass-card relative group hover:bg-white/[0.05] transition-all flex flex-col h-full"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/[0.03] group-hover:text-primary/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-warning fill-warning' : 'text-white/10'}`} 
                  />
                ))}
              </div>

              <p className="text-text-secondary leading-relaxed mb-8 flex-grow">
                "{review.review}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={review.image} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-text-primary">{review.name}</h4>
                  <p className="text-sm text-text-muted">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
