"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Users, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LimitedOfferCardProps {
  endDate?: string;
  limitedSlots?: number;
  planId: string;
  productId: string;
}

export default function LimitedOfferCard({ endDate, limitedSlots = 0, planId, productId }: LimitedOfferCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!endDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-amber-500/30 p-6 lg:p-8 shadow-2xl shadow-amber-500/10"
    >
      {/* Animated background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 blur-[80px] rounded-full animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 blur-[80px] rounded-full animate-pulse" />

      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[9px] font-black uppercase tracking-[3px] mb-4">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
          Limited Time Offer
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl lg:text-2xl font-black tracking-tighter">
              🔥 Exclusive Early Bird Access
            </h3>
            <p className="text-text-muted text-sm font-bold">
              Lock in the best rate before the offer expires
            </p>
          </div>

          {endDate && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-wider">Offer Ends In</p>
                <p className="font-black text-lg text-amber-500 tabular-nums">{timeLeft}</p>
              </div>
            </div>
          )}

          {limitedSlots > 0 && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <Users className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-[8px] font-black text-red-500 uppercase tracking-wider">Limited Slots</p>
                <p className="font-black text-lg text-red-500">{limitedSlots} Left</p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(`/membership/checkout/${planId}?productId=${productId}`)}
          className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs uppercase tracking-[3px] flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform shadow-xl shadow-amber-500/30 glow-btn"
        >
          <Zap className="w-5 h-5" />
          Claim Offer Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
