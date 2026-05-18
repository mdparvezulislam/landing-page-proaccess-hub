'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserMembership, useUserPayments, useSubmitPayment } from '@/hooks/useVIPDashboard';
import { useSettings } from '@/hooks/useCMS';
import { CreditCard, DollarSign, Upload, ArrowRight, CheckCircle2, X, AlertTriangle, Globe, Loader2, Send, Copy, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const { data: membership } = useUserMembership();
  const { data: payments } = useUserPayments();
  const { data: siteData } = useSettings();
  const submitPayment = useSubmitPayment();

  const [amountBDT, setAmountBDT] = useState(membership?.nextDueAmountBDT || 0);
  const [amountUSDT, setAmountUSDT] = useState(membership?.nextDueAmountUSDT || 0);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const paymentMethods = (siteData?.paymentSettings?.methods || [])
    .filter((m: any) => m.enabled)
    .sort((a: any, b: any) => a.order - b.order);

  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountBDT || !transactionId) {
      toast.error('Amount and transaction ID are required');
      return;
    }
    submitPayment.mutate({
      amountBDT,
      amountUSDT: amountUSDT || Math.round(amountBDT / 125),
      paymentMethod,
      transactionId,
      note,
    });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const stats = {
    nextDue: membership?.nextDueAmountBDT || 0,
    nextDueUSDT: membership?.nextDueAmountUSDT || 0,
    remaining: membership?.remainingAmountBDT || 0,
    progress: membership?.paymentProgress || 0,
  };

  const nextDueDate = membership?.nextDueDate ? new Date(membership.nextDueDate) : null;
  const daysUntilDue = nextDueDate ? Math.ceil((nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-amber-500" /> Payments
        </h2>
        <p className="text-text-muted text-sm mt-1">Submit your payment and track approval</p>
      </div>

      {/* Due Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-[24px] bg-amber-500/5 border border-amber-500/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Next Due Amount</p>
          <p className="text-3xl font-black text-amber-500">{stats.nextDue?.toLocaleString()} BDT</p>
          <p className="text-sm text-text-muted">{stats.nextDueUSDT} USDT</p>
        </div>
        <div className="p-5 rounded-[24px] bg-info/5 border border-info/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-info mb-1">Next Due Date</p>
          <p className="text-2xl font-black text-white">{nextDueDate?.toLocaleDateString() || 'N/A'}</p>
          <p className={`text-sm font-bold mt-1 ${daysUntilDue <= 3 ? 'text-red-500' : daysUntilDue <= 7 ? 'text-amber-500' : 'text-success'}`}>
            {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'OVERDUE'}
          </p>
        </div>
        <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Remaining Total</p>
          <p className="text-3xl font-black text-white">{stats.remaining?.toLocaleString()} BDT</p>
        </div>
        <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Progress</p>
          <p className="text-3xl font-black text-success">{stats.progress}%</p>
        </div>
      </motion.div>

      {/* Payment Methods Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Send className="w-4 h-4 text-amber-500" /> Send Payment To
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {paymentMethods.map((method: any) => (
            <div key={method.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">{method.name}</p>
              {method.accountHolder && (
                <p className="text-[10px] text-text-muted mb-1">A/C: {method.accountHolder}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-white">{method.number}</span>
                <button onClick={() => copyToClipboard(method.id, method.number)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  {copiedId === method.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Submit Payment Form */}
      <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-500" /> Submit Payment Proof
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Amount (BDT) *</label>
            <input type="number" value={amountBDT || ''} onChange={(e) => {
              const val = Number(e.target.value);
              setAmountBDT(val);
              setAmountUSDT(Math.round(val / 125));
            }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Amount (USDT)</label>
            <input type="number" value={amountUSDT || ''} onChange={(e) => setAmountUSDT(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Transaction ID *</label>
          <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Enter your transaction/TrxID"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Payment Method</label>
          <div className="flex gap-3">
            {paymentMethods.map((method: any) => (
              <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${paymentMethod === method.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}>
                {method.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Note (Optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any additional information..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
        </div>

        <div className="p-4 rounded-2xl bg-info/10 border border-info/20 flex items-start gap-3">
          <Globe className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <p className="text-info text-xs font-medium">After submitting, admin will verify your payment. You will receive a notification once approved.</p>
        </div>

        <button type="submit" disabled={submitPayment.isPending || !amountBDT || !transactionId}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase text-xs tracking-widest hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-3">
          {submitPayment.isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
          ) : (
            <><ArrowRight className="w-4 h-4" /> Submit Payment</>
          )}
        </button>
      </motion.form>

      {/* Recent Payments */}
      {payments && payments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-black tracking-tight mb-6">Your Payments</h3>
          <div className="space-y-3">
            {payments.map((p: any, idx: number) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.status === 'approved' ? 'bg-success/10' : p.status === 'rejected' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                  {p.status === 'approved' ? <CheckCircle2 className="w-6 h-6 text-success" /> :
                   p.status === 'rejected' ? <X className="w-6 h-6 text-red-500" /> :
                   <Clock className="w-6 h-6 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-white">{p.amountBDT?.toLocaleString()} BDT</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      p.status === 'approved' ? 'bg-success/10 text-success' :
                      p.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>{p.status || 'pending'}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{p.transactionId} • {new Date(p.paymentDate).toLocaleDateString()} • {p.paymentMethod}</p>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <p className="text-xs text-red-400 mt-1">Reason: {p.rejectionReason}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
