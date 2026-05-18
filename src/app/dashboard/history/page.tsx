'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUserPayments, useUserMembership } from '@/hooks/useVIPDashboard';
import { History, CheckCircle2, X, Clock, DollarSign, Calendar, AlertTriangle, Crown } from 'lucide-react';

export default function PaymentHistoryPage() {
  const { data: payments } = useUserPayments();
  const { data: membership } = useUserMembership();

  const allPayments = payments || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success" /></div>;
      case 'rejected': return <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><X className="w-5 h-5 text-red-500" /></div>;
      default: return <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'border-success/30';
      case 'rejected': return 'border-red-500/30';
      default: return 'border-amber-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <History className="w-8 h-8 text-amber-500" /> Payment History
        </h2>
        <p className="text-text-muted text-sm mt-1">Complete timeline of your payments</p>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-[24px] bg-success/5 border border-success/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-success">Approved</p>
          <p className="text-3xl font-black text-success">{allPayments.filter((p: any) => p.status === 'approved').length}</p>
        </div>
        <div className="p-5 rounded-[24px] bg-amber-500/5 border border-amber-500/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Pending</p>
          <p className="text-3xl font-black text-amber-500">{allPayments.filter((p: any) => p.status === 'pending' || !p.verified).length}</p>
        </div>
        <div className="p-5 rounded-[24px] bg-red-500/5 border border-red-500/10">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Rejected</p>
          <p className="text-3xl font-black text-red-500">{allPayments.filter((p: any) => p.status === 'rejected').length}</p>
        </div>
        <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Paid</p>
          <p className="text-3xl font-black text-white">{allPayments.filter((p: any) => p.status === 'approved').reduce((a: number, p: any) => a + p.amountBDT, 0).toLocaleString()} BDT</p>
        </div>
      </motion.div>

      {/* Timeline */}
      {allPayments.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-[48px]">
          <History className="w-20 h-20 text-white/10 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white/40 mb-2">No payments yet</h3>
          <p className="text-text-muted">Your payment history will appear here after your first payment.</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {allPayments.map((payment: any, idx: number) => {
            const isLast = idx === allPayments.length - 1;
            const isApproved = payment.status === 'approved';
            const isRejected = payment.status === 'rejected';
            const isPending = !payment.verified && payment.status !== 'rejected';

            return (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex gap-6 pb-8"
              >
                {/* Timeline Line */}
                {!isLast && (
                  <div className={`absolute left-[19px] top-14 bottom-0 w-0.5 ${isApproved ? 'bg-success/20' : isRejected ? 'bg-red-500/20' : 'bg-amber-500/20'}`} />
                )}

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(isApproved ? 'approved' : isRejected ? 'rejected' : 'pending')}
                </div>

                {/* Content */}
                <div className={`flex-1 p-5 rounded-2xl border ${getStatusColor(isApproved ? 'approved' : isRejected ? 'rejected' : 'pending')} ${isApproved ? 'bg-success/[0.02]' : isRejected ? 'bg-red-500/[0.02]' : 'bg-white/[0.02]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-white">{payment.amountBDT?.toLocaleString()} BDT</span>
                      {payment.amountUSDT > 0 && <span className="text-sm text-text-muted">/ {payment.amountUSDT} USDT</span>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isApproved ? 'bg-success/10 text-success' :
                      isRejected ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>{payment.status || 'pending'}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">TRX ID</p>
                      <p className="font-mono text-white text-xs">{payment.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Method</p>
                      <p className="text-white text-xs capitalize">{payment.paymentMethod || 'Manual'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Date</p>
                      <p className="text-white text-xs">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Verified By</p>
                      <p className="text-white text-xs">{payment.verifiedBy || '-'}</p>
                    </div>
                  </div>

                  {isRejected && payment.rejectionReason && (
                    <div className="mt-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-400">{payment.rejectionReason}</p>
                    </div>
                  )}

                  {payment.note && (
                    <p className="text-xs text-text-muted mt-3 italic">{payment.note}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
