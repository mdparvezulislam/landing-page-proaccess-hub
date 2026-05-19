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
    <div className="max-w-4xl mx-auto space-y-3 lg:space-y-8 pb-8 lg:pb-20">
      <div>
        <h2 className="text-xl lg:text-4xl font-black tracking-tighter flex items-center gap-2 lg:gap-4">
          <History className="w-5 h-5 lg:w-8 lg:h-8 text-amber-500" /> Payment History
        </h2>
        <p className="text-text-muted text-[11px] lg:text-sm mt-0.5 lg:mt-1">Complete timeline of your payments</p>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
        <div className="p-3 lg:p-5 rounded-[16px] lg:rounded-[24px] bg-success/5 border border-success/10">
          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-success mb-0.5 lg:mb-1">Approved</p>
          <p className="text-lg lg:text-3xl font-black text-success">{allPayments.filter((p: any) => p.status === 'approved').length}</p>
        </div>
        <div className="p-3 lg:p-5 rounded-[16px] lg:rounded-[24px] bg-amber-500/5 border border-amber-500/10">
          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5 lg:mb-1">Pending</p>
          <p className="text-lg lg:text-3xl font-black text-amber-500">{allPayments.filter((p: any) => p.status === 'pending' || !p.verified).length}</p>
        </div>
        <div className="p-3 lg:p-5 rounded-[16px] lg:rounded-[24px] bg-red-500/5 border border-red-500/10">
          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-red-500 mb-0.5 lg:mb-1">Rejected</p>
          <p className="text-lg lg:text-3xl font-black text-red-500">{allPayments.filter((p: any) => p.status === 'rejected').length}</p>
        </div>
        <div className="p-3 lg:p-5 rounded-[16px] lg:rounded-[24px] bg-white/[0.02] border border-white/5">
          <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5 lg:mb-1">Total Paid</p>
          <p className="text-sm lg:text-3xl font-black text-white">{allPayments.filter((p: any) => p.status === 'approved').reduce((a: number, p: any) => a + p.amountBDT, 0).toLocaleString()} BDT</p>
        </div>
      </motion.div>

      {/* Timeline */}
      {allPayments.length === 0 ? (
        <div className="text-center py-16 lg:py-24 border-2 border-dashed border-white/10 rounded-[24px] lg:rounded-[48px]">
          <History className="w-14 h-14 lg:w-20 lg:h-20 text-white/10 mx-auto mb-4 lg:mb-6" />
          <h3 className="text-lg lg:text-2xl font-black text-white/40 mb-1.5 lg:mb-2">No payments yet</h3>
          <p className="text-text-muted text-sm">Your payment history will appear here after your first payment.</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {allPayments.map((payment: any, idx: number) => {
            const isLast = idx === allPayments.length - 1;
            const isApproved = payment.status === 'approved';
            const isRejected = payment.status === 'rejected';

            return (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex gap-3 lg:gap-6 pb-4 lg:pb-8"
              >
                {/* Timeline Line */}
                {!isLast && (
                  <div className={`absolute left-[15px] lg:left-[19px] top-12 lg:top-14 bottom-0 w-0.5 ${isApproved ? 'bg-success/20' : isRejected ? 'bg-red-500/20' : 'bg-amber-500/20'}`} />
                )}

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {getStatusIcon(isApproved ? 'approved' : isRejected ? 'rejected' : 'pending')}
                </div>

                {/* Content */}
                <div className={`flex-1 p-3 lg:p-5 rounded-xl lg:rounded-2xl border ${getStatusColor(isApproved ? 'approved' : isRejected ? 'rejected' : 'pending')} ${isApproved ? 'bg-success/[0.02]' : isRejected ? 'bg-red-500/[0.02]' : 'bg-white/[0.02]'}`}>
                  <div className="flex items-center justify-between mb-1.5 lg:mb-2 gap-2">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="text-sm lg:text-xl font-black text-white">{payment.amountBDT?.toLocaleString()} BDT</span>
                      {payment.amountUSDT > 0 && <span className="text-[10px] lg:text-sm text-text-muted">/ {payment.amountUSDT} USDT</span>}
                    </div>
                    <span className={`px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
                      isApproved ? 'bg-success/10 text-success' :
                      isRejected ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>{payment.status || 'pending'}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4 text-[10px] lg:text-sm mt-2 lg:mt-3">
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-text-muted">TRX ID</p>
                      <p className="font-mono text-white text-[10px] lg:text-xs truncate">{payment.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-text-muted">Method</p>
                      <p className="text-white text-[10px] lg:text-xs capitalize truncate">{payment.paymentMethod || 'Manual'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-text-muted">Date</p>
                      <p className="text-white text-[10px] lg:text-xs">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-text-muted">Verified By</p>
                      <p className="text-white text-[10px] lg:text-xs truncate">{payment.verifiedBy || '-'}</p>
                    </div>
                  </div>

                  {isRejected && payment.rejectionReason && (
                    <div className="mt-2 lg:mt-3 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-1.5 lg:gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] lg:text-xs text-red-400">{payment.rejectionReason}</p>
                    </div>
                  )}

                  {payment.note && (
                    <p className="text-[10px] lg:text-xs text-text-muted mt-2 lg:mt-3 italic">{payment.note}</p>
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
