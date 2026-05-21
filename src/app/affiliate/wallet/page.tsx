'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAffiliateWallet } from '@/hooks/useAffiliate';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import {
  Wallet, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, RefreshCw, Globe,
} from 'lucide-react';

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  referral_commission: { label: 'Commission', color: 'text-success', icon: TrendingUp },
  withdrawal: { label: 'Withdrawal', color: 'text-red-400', icon: ArrowUpRight },
  adjustment: { label: 'Adjustment', color: 'text-warning', icon: RefreshCw },
  bonus: { label: 'Bonus', color: 'text-primary', icon: DollarSign },
  refund_reversal: { label: 'Refund Reversal', color: 'text-red-400', icon: ArrowDownRight },
};

export default function AffiliateWalletPage() {
  const { data, isLoading } = useAffiliateWallet();
  const { currentCurrency, convertPrice, toggleCurrency } = useCurrencyStore();

  const fmt = (usdAmount: number) => {
    const { amount, currency } = convertPrice(usdAmount);
    return { amount: amount.toLocaleString(), currency, symbol: currency === 'BDT' ? '৳' : '$' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const wallet = data?.wallet || { availableBalance: 0, pendingBalance: 0, withdrawnBalance: 0, lifetimeEarnings: 0 };
  const transactions = data?.transactions || [];
  const bal = fmt(wallet.availableBalance);
  const pend = fmt(wallet.pendingBalance);
  const withdr = fmt(wallet.withdrawnBalance);
  const life = fmt(wallet.lifetimeEarnings);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">Wallet</h1>
          <p className="text-text-muted text-sm font-medium">Track your earnings, balance, and transaction history</p>
        </div>
        <button onClick={toggleCurrency}
          className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2">
          <Globe className="w-4 h-4" /> {currentCurrency === 'BDT' ? '৳ BDT' : '$ USDT'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-success/10 to-transparent border border-success/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl lg:text-5xl font-black tracking-tight mb-1">{bal.symbol}{bal.amount}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-success">Available Balance</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 lg:p-8 rounded-3xl bg-warning/5 border border-warning/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-warning/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <p className="text-3xl lg:text-5xl font-black tracking-tight mb-1">{pend.symbol}{pend.amount}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-warning">Pending Balance</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl lg:text-5xl font-black tracking-tight mb-1">{withdr.symbol}{withdr.amount}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Withdrawn</p>
            <p className="text-[10px] text-text-muted/60 mt-2">Lifetime: {life.symbol}{life.amount}</p>
          </div>
        </motion.div>
      </div>

      <div>
        <h2 className="text-xl lg:text-2xl font-black tracking-tight mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-[32px]">
            <Wallet className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
            <p className="text-white/40 font-bold">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: any, idx: number) => {
              const config = typeConfig[tx.type] || { label: tx.type, color: 'text-white', icon: DollarSign };
              const Icon = config.icon;
              const isCredit = tx.type === 'referral_commission' || tx.type === 'bonus' || tx.type === 'adjustment';
              return (
                <motion.div
                  key={tx.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${isCredit ? 'bg-success/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${isCredit ? 'text-success' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{config.label}</p>
                      <p className="text-[9px] text-text-muted font-medium">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isCredit ? 'text-success' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{bal.symbol}{Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-warning' : 'text-red-400'}`}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
