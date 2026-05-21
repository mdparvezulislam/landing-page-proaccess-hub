'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAffiliateDashboard } from '@/hooks/useAffiliate';
import {
  DollarSign, Users, TrendingUp, ShoppingCart, MousePointerClick,
  Percent, Wallet, Gift, Copy, ExternalLink, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

function StatCard({ icon: Icon, label, value, sub, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 blur-[80px] rounded-full -mr-16 -mt-16`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl ${color}/10 flex items-center justify-center border border-white/5`}>
            <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${color}`} />
          </div>
        </div>
        <p className="text-2xl lg:text-4xl font-black tracking-tight mb-1">{value}</p>
        <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-text-muted">{label}</p>
        {sub && <p className="text-[9px] lg:text-[10px] text-text-muted/60 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AffiliateDashboardPage() {
  const { data, isLoading } = useAffiliateDashboard();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const wallet = data?.wallet || { availableBalance: 0, pendingBalance: 0, withdrawnBalance: 0, lifetimeEarnings: 0 };
  const stats = data?.stats || { totalReferrals: 0, totalSales: 0, totalCommission: 0, conversionRate: 0 };
  const recent = data?.recentReferrals || [];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">Affiliate Dashboard</h1>
        <p className="text-text-muted text-sm font-medium">Track your performance, referrals, and earnings</p>
      </div>

      <div className="p-5 lg:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 flex-shrink-0">
            <Gift className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Your Referral Link</p>
            <p className="text-sm lg:text-lg font-bold text-white/80 break-all">{data?.referralLink || 'Loading...'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => copyToClipboard(data?.referralLink || '')}
              className="px-5 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard icon={DollarSign} label="Available Balance" value={`$${wallet.availableBalance.toFixed(2)}`} sub={`$${wallet.lifetimeEarnings.toFixed(2)} lifetime`} color="text-success" delay={0} />
        <StatCard icon={Wallet} label="Pending Balance" value={`$${wallet.pendingBalance.toFixed(2)}`} sub="Awaiting approval" color="text-warning" delay={0.05} />
        <StatCard icon={TrendingUp} label="Total Commission" value={`$${stats.totalCommission.toFixed(2)}`} sub="All time earnings" color="text-primary" delay={0.1} />
        <StatCard icon={Users} label="Total Referrals" value={stats.totalReferrals} sub={`${stats.totalSales} conversions`} color="text-secondary" delay={0.15} />
        <StatCard icon={ShoppingCart} label="Total Sales" value={stats.totalSales} sub={`${stats.totalCommission.toFixed(2)} earned`} color="text-amber-500" delay={0.2} />
        <StatCard icon={Percent} label="Conversion Rate" value={`${stats.conversionRate}%`} sub="Referral to sale" color="text-info" delay={0.25} />
        <StatCard icon={MousePointerClick} label="Withdrawn" value={`$${wallet.withdrawnBalance.toFixed(2)}`} sub="Total paid out" color="text-white" delay={0.3} />
      </div>

      {recent.length > 0 && (
        <div>
          <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-4">Recent Referrals</h2>
          <div className="space-y-2 lg:space-y-3">
            {recent.map((ref: any, idx: number) => (
              <motion.div
                key={ref._id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 lg:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold">{ref.buyerName || 'Anonymous'}</p>
                  <p className="text-[10px] text-text-muted font-medium">
                    {ref.productName} {ref.planName ? `- ${ref.planName}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-success">+${ref.commissionAmount?.toFixed(2)}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${ref.orderStatus === 'completed' ? 'text-success' : ref.orderStatus === 'pending' ? 'text-warning' : 'text-red-400'}`}>
                    {ref.orderStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
          <Users className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
          <p className="text-white/40 font-bold text-lg mb-2">No referrals yet</p>
          <p className="text-text-muted text-sm">Share your referral link and start earning!</p>
        </div>
      )}
    </div>
  );
}
