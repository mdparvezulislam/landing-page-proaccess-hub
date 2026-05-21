'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAffiliateCoupons } from '@/hooks/useAffiliate';
import { TicketPercent, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AffiliateCouponsPage() {
  const { data, isLoading } = useAffiliateCoupons();
  const coupons = data?.coupons || [];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">My Coupons</h1>
        <p className="text-text-muted text-sm font-medium">Your unique discount coupons for buyers</p>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
          <TicketPercent className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
          <p className="text-white/40 font-bold text-lg mb-2">No coupons yet</p>
          <p className="text-text-muted text-sm">Coupons are automatically generated when your account is approved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {coupons.map((coupon: any, idx: number) => (
            <motion.div
              key={coupon.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TicketPercent className="w-5 h-5 text-primary" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${coupon.active ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {coupon.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {coupon.active ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <code className="text-2xl lg:text-3xl font-black tracking-tighter text-primary">{coupon.couponCode}</code>
                  <button onClick={() => copyCode(coupon.couponCode)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all border border-white/10">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-black text-success">{coupon.discountPercent}%</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Discount</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-black text-primary">{coupon.commissionPercent}%</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Commission</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-black text-white">{coupon.totalUsed}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ''}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Used</p>
                  </div>
                </div>

                {coupon.expireDate && (
                  <div className="mt-3 flex items-center gap-2 text-warning text-[10px] font-bold">
                    <Clock className="w-3 h-3" />
                    Expires {new Date(coupon.expireDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
