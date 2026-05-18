"use client";

import { motion } from 'framer-motion';
import { Check, Crown, Zap, Sparkles, Shield, ArrowRight, ChevronRight, Info } from 'lucide-react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PlanDetails {
  _id: string;
  titleEn: string;
  titleBn: string;
  joiningAmountBDT: number;
  joiningAmountUSDT: number;
  monthlyAmountBDT: number;
  monthlyAmountUSDT: number;
  totalAmountBDT: number;
  totalAmountUSDT: number;
  discountPercent: number;
  enableDiscount: boolean;
  dueEveryDays: number;
}

interface InstallmentPricingCardProps {
  plan: PlanDetails;
  productId: string;
  productName: string;
  index: number;
  limitedOffer?: boolean;
}

export default function InstallmentPricingCard({ plan, productId, productName, index, limitedOffer }: InstallmentPricingCardProps) {
  const { convertPrice, currentCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const discountAmount = plan.enableDiscount
    ? Math.round(plan.totalAmountBDT * (plan.discountPercent / 100))
    : 0;
  const discountedTotal = plan.totalAmountBDT - discountAmount;
  const savings = plan.totalAmountBDT - discountedTotal;

  const priceInfo = mounted ? convertPrice(discountedTotal) : { amount: discountedTotal, currency: 'BDT' as const };
  const totalDisplay = priceInfo.amount;
  const curr = priceInfo.currency;
  const joiningDisplay = mounted ? convertPrice(plan.joiningAmountBDT).amount : plan.joiningAmountBDT;
  const monthlyDisplay = mounted ? convertPrice(plan.monthlyAmountBDT).amount : plan.monthlyAmountBDT;

  const numInstalments = plan.monthlyAmountBDT > 0
    ? Math.ceil(discountedTotal / plan.monthlyAmountBDT)
    : 1;

  const handleSelect = () => {
    router.push(`/membership/checkout/${plan._id}?productId=${productId}&productName=${encodeURIComponent(productName)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative glass-card rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 border-2 transition-all duration-500 group flex flex-col ${index === 0 ? 'border-primary bg-primary/[0.03] scale-[1.02] z-10 shadow-2xl shadow-primary/20' : 'border-white/5 hover:border-white/20'
        }`}
    >
      {index === 0 && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-[9px] font-black text-white uppercase tracking-[2px] shadow-xl whitespace-nowrap flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5" /> Recommended
        </div>
      )}

      {limitedOffer && (
        <div className="absolute -top-4 -right-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-pulse shadow-lg shadow-amber-500/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7px] font-black text-white uppercase leading-tight text-center">
                LIMITED<br />OFFER
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plan Badge */}
      <div className="flex items-center justify-between mb-6">
        <span className={`text-[9px] lg:text-[10px] font-black uppercase tracking-[3px] ${index === 0 ? 'text-primary' : 'text-text-muted'}`}>
          {plan.dueEveryDays}-Day Cycle
        </span>
        {index === 0 ? <Crown className="w-5 h-5 text-primary" /> : <Zap className="w-5 h-5 text-text-muted" />}
      </div>

      {/* Title */}
      <h3 className="text-2xl lg:text-3xl font-black tracking-tighter mb-4">
        {plan.titleEn}
      </h3>

      {/* Pricing */}
      <div className="space-y-3 mb-6">
        {/* Regular Price */}
        <div className="flex items-center gap-2 opacity-40 line-through">
          <span className="text-base lg:text-lg font-bold">
            {mounted ? convertPrice(plan.totalAmountBDT).amount : plan.totalAmountBDT}
          </span>
          <span className="text-[10px] font-black uppercase">{curr}</span>
          <span className="text-[9px] font-black">Regular</span>
        </div>

        {/* Discounted Total */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl lg:text-5xl font-black tracking-tighter leading-none">{totalDisplay}</span>
          <span className="text-sm lg:text-lg font-black text-text-muted">{curr}</span>
          {plan.enableDiscount && plan.discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-wider">
              {plan.discountPercent}% OFF
            </span>
          )}
        </div>

        {mounted && currentCurrency === 'USDT' && (
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-tight">≈ {discountedTotal} BDT</span>
        )}
      </div>

      {/* Savings */}
      {plan.enableDiscount && savings > 0 && (
        <div className="p-4 rounded-2xl bg-success/5 border border-success/10 mb-6">
          <div className="flex items-center gap-2 text-success">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">You Save</span>
            <span className="font-black text-sm ml-auto">
              {mounted ? convertPrice(savings).amount : savings} {curr}
            </span>
          </div>
        </div>
      )}

      {/* Installment Breakdown */}
      <div className="space-y-3 p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-text-muted">Starter Fee</span>
          <span className="font-black text-sm">{joiningDisplay} {curr}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-text-muted">Monthly Payment</span>
          <span className="font-black text-sm">{monthlyDisplay} {curr}</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex items-center justify-between">
          <span className="text-[11px] font-bold text-text-muted">Total Installments</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black">{numInstalments} Installments</span>
            <span className="font-black text-sm">@ {monthlyDisplay} {curr}</span>
          </div>
        </div>
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1.5 text-[10px] font-black text-text-muted hover:text-text-primary transition-all mb-6"
      >
        <Info className="w-3 h-3" />
        {showDetails ? 'Hide' : 'Show'} Payment Schedule
        <ChevronRight className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
      </button>

      {/* Payment Schedule */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="space-y-1.5 mb-6 overflow-hidden"
        >
          {Array.from({ length: Math.min(numInstalments, 12) }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px]">
              <span className="font-bold text-text-muted">Installment #{i + 1}</span>
              <span className="font-black">
                {i === 0
                  ? `${joiningDisplay} ${curr} (Starter)`
                  : `${monthlyDisplay} ${curr}`}
              </span>
            </div>
          ))}
          {numInstalments > 12 && (
            <p className="text-[10px] text-text-muted text-center pt-2">...and {numInstalments - 12} more installments</p>
          )}
        </motion.div>
      )}

      {/* Features */}
      <div className="space-y-3 mb-8 flex-1">
        {[
          `Starter: ${joiningDisplay} ${curr}`,
              `${numInstalments}x Monthly Payments`,
          `Due Every ${plan.dueEveryDays} Days`,
          `Total: ${totalDisplay} ${curr}`,
          'Manual Payment Tracking',
          'Admin Verified System',
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 stroke-[4] text-success" />
            </div>
            <span className="text-xs lg:text-sm font-bold text-text-secondary">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleSelect}
        className={`w-full py-4 lg:py-5 rounded-2xl lg:rounded-[28px] font-black text-xs uppercase tracking-[2px] lg:tracking-[4px] transition-all flex items-center justify-center gap-3 group/btn ${index === 0
          ? 'bg-primary text-white hover:bg-primary-light shadow-xl shadow-primary/30 glow-btn'
          : 'bg-white/5 text-text-primary border border-white/10 hover:bg-white/10'
          }`}
      >
        Select This Plan
        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
      </button>
    </motion.div>
  );
}
