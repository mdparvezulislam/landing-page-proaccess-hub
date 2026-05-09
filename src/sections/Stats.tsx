import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

export const Stats = () => {
  const { language } = useStore();

  const stats = [
    { label: 'Active Users', labelBn: 'সক্রিয় ব্যবহারকারী', value: '12,500+', accent: 'text-primary' },
    { label: 'Total Methods', labelBn: 'মোট মেথড', value: '500+', accent: 'text-secondary' },
    { label: 'Trust Score', labelBn: 'ট্রাস্ট স্কোর', value: '99.9%', accent: 'text-success' },
    { label: 'Support Speed', labelBn: 'সাপোর্ট স্পিড', value: '< 5 Min', accent: 'text-warning' },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span className={`text-3xl lg:text-4xl font-bold mb-1 ${stat.accent}`}>
                {stat.value}
              </span>
              <span className="text-sm font-medium text-text-muted">
                {language === 'en' ? stat.label : stat.labelBn}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
