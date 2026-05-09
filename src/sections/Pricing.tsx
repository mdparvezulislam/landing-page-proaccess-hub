import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Pricing = () => {
  const { language, products, setSelectedOrderContext } = useStore();
  const navigate = useNavigate();

  const comparisonFeatures = [
    { en: 'Premium Methods Access', bn: 'প্রিমিয়াম মেথড এক্সেস' },
    { en: 'Private Resource Database', bn: 'প্রাইভেট রিসোর্স ডাটাবেস' },
    { en: '2D Animation Courses', bn: '২ডি অ্যানিমেশন কোর্স' },
    { en: 'Client Hunting Secrets', bn: 'ক্লায়েন্ট হান্টিং সিক্রেট' },
    { en: 'Priority Telegram Support', bn: 'প্রায়োরিটি টেলিগ্রাম সাপোর্ট' },
    { en: 'Lifetime Free Updates', bn: 'লাইফটাইম ফ্রি আপডেট' },
    { en: 'AI Agent Masterclass', bn: 'এআই এজেন্ট মাস্টারক্লাস' },
    { en: 'Searcher Bot Access', bn: 'সার্চার বট এক্সেস' },
  ];

  const handleJoin = (product: any, plan: any) => {
    setSelectedOrderContext({ product, plan });
    navigate('/checkout');
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white/[0.01]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {language === 'en' ? 'Transparent ' : 'স্বচ্ছ '}
            <span className="grad-text">{language === 'en' ? 'Pricing' : 'প্রাইসিং'}</span>
          </h2>
          <p className="text-text-secondary text-lg">
            {language === 'en' 
              ? 'Invest in yourself today. No hidden fees, just pure value.' 
              : 'আজই নিজের জন্য ইনভেস্ট করুন। কোনো গোপন ফি নেই, শুধু পিওর ভ্যালু।'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="p-6 text-left text-text-secondary font-medium border-b border-white/10">Features</th>
                {products.map(p => (
                  <th key={p.id} className="p-6 text-center border-b border-white/10">
                    <p className="text-xl font-bold text-text-primary mb-1">
                      {language === 'en' ? p.nameEn : p.nameBn}
                    </p>
                    <p className="text-sm text-primary-light font-bold">Recommended</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((f, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-text-secondary border-b border-white/5">
                    {language === 'en' ? f.en : f.bn}
                  </td>
                  {products.map(p => (
                    <td key={p.id} className="p-6 text-center border-b border-white/5">
                      <Check className="w-5 h-5 text-success mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-6 border-b border-white/5"></td>
                {products.map(p => (
                  <td key={p.id} className="p-6 text-center border-b border-white/5">
                    <div className="flex flex-col gap-2">
                      {p.plans.map((plan, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleJoin(p, plan)}
                          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-light text-white text-sm font-bold transition-all"
                        >
                          {plan.priceTk} TK - {plan.name}
                        </button>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
