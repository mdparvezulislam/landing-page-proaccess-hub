import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Shield, Zap, Globe, Target, Cpu, Database } from 'lucide-react';

export const Features = () => {
  const { language } = useStore();

  const features = [
    {
      icon: Database,
      title: language === 'en' ? 'Private Database' : 'প্রাইভেট ডাটাবেস',
      desc: language === 'en' ? 'Access to 250,000+ premium resources exclusively for VIPs.' : '২৫০,০০০+ প্রিমিয়াম রিসোর্সে ভিআইপিদের জন্য বিশেষ অ্যাক্সেস।'
    },
    {
      icon: Cpu,
      title: language === 'en' ? 'AI Agent Mastery' : 'এআই এজেন্ট মাস্টারি',
      desc: language === 'en' ? 'Latest 2026 AI methods to automate your business.' : 'আপনার ব্যবসাকে অটোমেট করতে ২০২৬-এর লেটেস্ট এআই মেথড।'
    },
    {
      icon: Target,
      title: language === 'en' ? 'Secret Methods' : 'সিক্রেট মেথড',
      desc: language === 'en' ? 'Highly effective methods that actually generate results.' : 'কার্যকরী মেথড যা আসলে ফলাফল এনে দেয়।'
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Verified Quality' : 'ভেরিফাইড কোয়ালিটি',
      desc: language === 'en' ? 'Every resource is tested and verified by our experts.' : 'প্রতিটি রিসোর্স আমাদের বিশেষজ্ঞদের দ্বারা পরীক্ষিত ও ভেরিফাইড।'
    },
    {
      icon: Globe,
      title: language === 'en' ? 'International Standards' : 'ইন্টারন্যাশনাল স্ট্যান্ডার্ড',
      desc: language === 'en' ? 'Learn world-class skills that are in demand globally.' : 'বিশ্বমানের স্কিল শিখুন যা বিশ্বজুড়ে ডিমান্ডে আছে।'
    },
    {
      icon: Zap,
      title: language === 'en' ? 'Instant Delivery' : 'তাত্ক্ষণিক ডেলিভারি',
      desc: language === 'en' ? 'Get access immediately after your payment confirmation.' : 'পেমেন্ট কনফার্মেশনের সাথে সাথেই অ্যাক্সেস পান।'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            {language === 'en' ? 'Why Choose ' : 'কেন '}
            <span className="grad-text">Pro Access VIP</span>?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] glass-card hover:bg-white/[0.05] group transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
