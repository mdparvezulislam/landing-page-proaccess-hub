'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAffiliateReferrals } from '@/hooks/useAffiliate';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { Users, Search, Filter, ExternalLink, Globe } from 'lucide-react';

export default function AffiliateReferralsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAffiliateReferrals(page);
  const { currentCurrency, toggleCurrency, convertPrice } = useCurrencyStore();
  const fmtBDT = (bdt: number) => { const p = convertPrice(bdt); return `${p.currency === 'BDT' ? '৳' : '$'}${p.amount.toFixed(2)}`; };

  const referrals = data?.referrals || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  const statusColor: Record<string, string> = {
    pending: 'text-warning bg-warning/10 border-warning/20',
    completed: 'text-success bg-success/10 border-success/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
    refunded: 'text-text-muted bg-white/5 border-white/10',
  };

  const commissionColor: Record<string, string> = {
    pending: 'text-warning',
    approved: 'text-success',
    paid: 'text-primary',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">Referrals</h1>
          <p className="text-text-muted text-sm font-medium">Track all your referred customers and commissions</p>
        </div>
        <button onClick={toggleCurrency}
          className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2">
          <Globe className="w-4 h-4" /> {currentCurrency === 'BDT' ? '৳ BDT' : '$ USDT'}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input placeholder="Search referrals..."
            className="admin-input-sm w-full pl-10 text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="admin-input-sm text-white bg-white/[0.02] border-white/10">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {referrals.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
          <Users className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
          <p className="text-white/40 font-bold text-lg mb-2">No referrals yet</p>
          <p className="text-text-muted text-sm">Share your referral link to start getting referrals!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {referrals.map((ref: any, idx: number) => (
            <motion.div
              key={ref.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="p-4 lg:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{ref.buyerName || 'Anonymous'}</p>
                    <p className="text-[10px] text-text-muted font-medium">
                      {ref.productName} {ref.planName ? `• ${ref.planName}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold">{fmtBDT(ref.orderAmount || 0)}</p>
                    <p className="text-[9px] text-text-muted">Amount</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{fmtBDT(ref.commissionAmount || 0)}</p>
                    <p className="text-[9px] text-text-muted">Commission</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusColor[ref.orderStatus] || 'text-text-muted bg-white/5 border-white/10'}`}>
                      {ref.orderStatus}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${commissionColor[ref.commissionStatus] || 'text-text-muted'}`}>
                      {ref.commissionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${p === page ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
