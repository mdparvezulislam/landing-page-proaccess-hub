'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAffiliateWithdrawals, useRequestWithdrawal } from '@/hooks/useAffiliate';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import {
  CreditCard, Plus, X, DollarSign, Wallet, CheckCircle, Clock, XCircle,
  TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle,
  Send, Banknote, Smartphone, Globe, Info,
} from 'lucide-react';
import { toast } from 'sonner';

const methodConfig: Record<string, { label: string; icon: any; color: string; placeholder: string }> = {
  bkash: { label: 'bKash', icon: Smartphone, color: 'text-[#E2136E] bg-[#E2136E]/10 border-[#E2136E]/20', placeholder: '01XXXXXXXXX' },
  nagad: { label: 'Nagad', icon: Smartphone, color: 'text-[#E94E1B] bg-[#E94E1B]/10 border-[#E94E1B]/20', placeholder: '01XXXXXXXXX' },
  binance: { label: 'Binance', icon: Globe, color: 'text-[#F0B90B] bg-[#F0B90B]/10 border-[#F0B90B]/20', placeholder: 'Binance Wallet ID / Email' },
};

const statusConfig: Record<string, { color: string; icon: any }> = {
  pending: { color: 'text-warning bg-warning/10 border-warning/20', icon: Clock },
  approved: { color: 'text-primary bg-primary/10 border-primary/20', icon: CheckCircle },
  rejected: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
  paid: { color: 'text-success bg-success/10 border-success/20', icon: DollarSign },
};

const txTypeConfig: Record<string, { label: string; color: string; icon: any }> = {
  referral_commission: { label: 'Commission', color: 'text-success', icon: TrendingUp },
  withdrawal: { label: 'Withdrawal', color: 'text-red-400', icon: ArrowUpRight },
  adjustment: { label: 'Adjustment', color: 'text-warning', icon: RefreshCw },
  bonus: { label: 'Bonus', color: 'text-primary', icon: Banknote },
  refund_reversal: { label: 'Reversal', color: 'text-orange-400', icon: AlertCircle },
};

export default function AffiliateWithdrawalsPage() {
  const { data, isLoading } = useAffiliateWithdrawals();
  const requestWithdrawal = useRequestWithdrawal();
  const [showForm, setShowForm] = useState(false);
  const [currency, setCurrency] = useState<'BDT' | 'USDT'>('BDT');
  const [form, setForm] = useState({ amount: '', paymentMethod: 'bkash', accountNumber: '', accountHolder: '' });
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'history'>('withdrawals');

  const { currentCurrency, usdtRate } = useCurrencyStore();

  const withdrawals = data?.withdrawals || [];
  const transactions = data?.transactions || [];
  const limits = data?.settings || { minWithdrawal: 5, maxWithdrawal: 0 };

  const wallet = data?.wallet || null;
  const availableBalance = wallet?.availableBalance || 0;

  const formatInCurrency = (usdAmount: number) => {
    if (currentCurrency === 'BDT') {
      const bdt = Math.ceil(usdAmount * usdtRate);
      return { amount: bdt.toLocaleString(), currency: 'BDT', symbol: '৳' };
    }
    return { amount: usdAmount.toFixed(2), currency: 'USDT', symbol: '$' };
  };

  const minInCurrency = formatInCurrency(limits.minWithdrawal);
  const maxInCurrency = limits.maxWithdrawal > 0 ? formatInCurrency(limits.maxWithdrawal) : null;
  const balanceInCurrency = formatInCurrency(availableBalance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    if (amount < limits.minWithdrawal) {
      toast.error(`Minimum withdrawal is $${limits.minWithdrawal}`);
      return;
    }
    if (limits.maxWithdrawal > 0 && amount > limits.maxWithdrawal) {
      toast.error(`Maximum withdrawal is $${limits.maxWithdrawal}`);
      return;
    }
    if (amount > availableBalance) { toast.error('Insufficient balance'); return; }
    if (!form.accountNumber) { toast.error('Account number is required'); return; }
    try {
      await requestWithdrawal.mutateAsync({
        amount,
        paymentMethod: form.paymentMethod,
        accountNumber: form.accountNumber,
        accountHolder: form.accountHolder,
        currency,
      });
      setShowForm(false);
      setForm({ amount: '', paymentMethod: 'bkash', accountNumber: '', accountHolder: '' });
    } catch (err: any) {
      toast.error(err.message);
    }
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
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">Withdrawals</h1>
        <p className="text-text-muted text-sm font-medium">Request payouts and track transaction history</p>
      </div>

      <div className="p-5 lg:p-6 rounded-2xl bg-gradient-to-br from-success/5 to-transparent border border-success/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-success/5 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center border border-success/20">
              <Wallet className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Available for Withdrawal</p>
              <p className="text-3xl lg:text-4xl font-black tracking-tight">
                {balanceInCurrency.symbol}{balanceInCurrency.amount}
                <span className="text-sm text-text-muted ml-2 font-bold">{balanceInCurrency.currency}</span>
              </p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary/80 transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4" /> New Withdrawal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1">
            <Info className="w-3 h-3" /> Minimum Withdrawal
          </p>
          <p className="text-lg font-black">{minInCurrency.symbol}{minInCurrency.amount} <span className="text-xs text-text-muted font-bold">{minInCurrency.currency}</span></p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1">
            <Info className="w-3 h-3" /> Maximum Withdrawal
          </p>
          <p className="text-lg font-black">
            {maxInCurrency
              ? <>{maxInCurrency.symbol}{maxInCurrency.amount} <span className="text-xs text-text-muted font-bold">{maxInCurrency.currency}</span></>
              : <span className="text-text-muted">No Limit</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button onClick={() => setActiveTab('withdrawals')}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'withdrawals' ? 'bg-primary text-white' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
          Withdrawal History
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-primary text-white' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
          Transaction History
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/10 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-black mb-6">Request Withdrawal</h3>
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Currency</label>
              <div className="grid grid-cols-2 gap-2">
                {(['BDT', 'USDT'] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setCurrency(c)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold uppercase tracking-widest transition-all ${currency === c ? 'bg-primary/10 border-primary text-primary' : 'bg-white/[0.02] border-white/10 text-text-muted hover:text-white'}`}>
                    {c === 'BDT' ? '৳ BDT' : '$ USDT'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Amount ({currency === 'BDT' ? 'BDT' : 'USD'})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">{currency === 'BDT' ? '৳' : '$'}</span>
                <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00" className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 pl-10" />
              </div>
              <p className="text-[8px] text-text-muted mt-1">
                Min: {minInCurrency.symbol}{minInCurrency.amount} {minInCurrency.currency}
                {maxInCurrency ? ` | Max: ${maxInCurrency.symbol}${maxInCurrency.amount} ${maxInCurrency.currency}` : ' | No max limit'}
                {currency === 'USDT' && form.amount && availableBalance > 0 && ` | Balance: $${availableBalance.toFixed(2)}`}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(methodConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = form.paymentMethod === key;
                  return (
                    <button key={key} type="button" onClick={() => setForm(prev => ({ ...prev, paymentMethod: key }))}
                      className={`p-3 rounded-xl border text-center transition-all ${isActive ? config.color + ' border-current' : 'bg-white/[0.02] border-white/10 text-text-muted hover:text-white'}`}>
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">{key === 'bkash' ? 'bKash' : key === 'nagad' ? 'Nagad' : 'Binance'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {form.paymentMethod && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">
                  {methodConfig[form.paymentMethod]?.label} {form.paymentMethod === 'binance' ? 'Wallet ID' : 'Number'}
                </label>
                <input value={form.accountNumber} onChange={(e) => setForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder={methodConfig[form.paymentMethod]?.placeholder || 'Account number'}
                  className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Account Holder (optional)</label>
              <input value={form.accountHolder} onChange={(e) => setForm(prev => ({ ...prev, accountHolder: e.target.value }))}
                placeholder="Full name on account" className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>
            <button type="submit" disabled={requestWithdrawal.isPending}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center gap-2">
              {requestWithdrawal.isPending ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send className="w-4 h-4" /> Submit Request</>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'withdrawals' && (
        <div>
          {withdrawals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-[32px]">
              <CreditCard className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-white/40 font-bold">No withdrawals yet</p>
              <p className="text-text-muted text-xs mt-2">Submit your first withdrawal request above</p>
            </div>
          ) : (
            <div className="space-y-2">
              {withdrawals.map((wd: any, idx: number) => {
                const config = statusConfig[wd.status] || statusConfig.pending;
                const Icon = config.icon;
                const mConfig = methodConfig[wd.paymentMethod] || methodConfig.bkash;
                const MIcon = mConfig.icon;
                return (
                  <motion.div key={wd.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    className="p-4 lg:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${mConfig.color} flex items-center justify-center`}>
                          <MIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold">
                              {wd.currency === 'BDT' ? '৳' : '$'}{wd.amount?.toFixed(2)}
                            </p>
                            <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">via {mConfig.label}</span>
                          </div>
                          <p className="text-[10px] text-text-muted">
                            {wd.accountInfo?.accountNumber}
                            {wd.accountInfo?.accountHolder ? ` • ${wd.accountInfo.accountHolder}` : ''}
                            <span className="ml-2 text-[8px] font-bold">{wd.currency || 'BDT'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${config.color}`}>
                          {wd.status}
                        </span>
                        <p className="text-[9px] text-text-muted whitespace-nowrap">
                          {new Date(wd.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {wd.adminNote && (
                      <p className="mt-2 text-[10px] text-text-muted italic ml-[52px]">Note: {wd.adminNote}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {transactions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-[32px]">
              <RefreshCw className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
              <p className="text-white/40 font-bold">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx: any, idx: number) => {
                const cfg = txTypeConfig[tx.type] || txTypeConfig.adjustment;
                const TIcon = cfg.icon;
                return (
                  <motion.div key={tx.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center`}>
                          <TIcon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{tx.description || cfg.label}</p>
                          <p className="text-[9px] text-text-muted">{new Date(tx.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-success' : 'text-red-400'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(2)}
                        </p>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-warning' : 'text-red-400'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
