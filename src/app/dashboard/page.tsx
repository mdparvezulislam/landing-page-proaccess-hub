'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUserMembership } from '@/hooks/useVIPDashboard';
import { Crown, CheckCircle2, Clock, DollarSign, Calendar, TrendingUp, AlertTriangle, Ban, Gem, BadgeCheck, Shield, Zap, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const { data: membership, isLoading, error } = useUserMembership();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center animate-pulse">
          <Crown className="w-6 h-6 text-amber-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-white mb-2">Session Expired</h3>
        <p className="text-text-muted mb-6">Please log in again.</p>
        <button onClick={() => { localStorage.removeItem('vip-auth-session'); window.location.href = '/dashboard/login'; }}
          className="px-8 py-4 rounded-2xl bg-amber-500 text-white font-black uppercase text-xs tracking-widest">Login</button>
      </div>
    );
  }

  if (!membership) return null;

  const m = membership;
  const plan = m.selectedVIPPlanId || {};
  const progress = m.paymentProgress || 0;
  const isOverdue = m.status === 'overdue';
  const isBanned = m.banned || m.status === 'banned';

  if (isBanned) {
    return (
      <div className="max-w-3xl mx-auto py-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }}
          className="p-12 rounded-[48px] bg-red-500/5 border border-red-500/20 text-center">
          <Ban className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-red-500 mb-4">Membership Banned</h2>
          <p className="text-text-muted text-lg mb-4">{m.banReason || 'Your membership has been banned. Contact admin for details.'}</p>
          <a href="/" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Back to Homepage</a>
        </motion.div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    completed: 'bg-info/10 text-info border-info/20',
  };

  const nextDue = new Date(m.nextDueDate);
  const daysUntilDue = Math.ceil((nextDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter flex items-center gap-4">
            <Crown className="w-8 h-8 text-amber-500" /> Welcome back, {m.userName}
          </h2>
          <p className="text-text-muted text-sm mt-1">Membership ID: <span className="text-amber-500 font-black">{m.membershipId}</span></p>
        </div>
        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[m.status] || statusColors.pending}`}>
          {m.status}
        </span>
      </div>

      {/* Progress Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[32px] bg-gradient-to-br from-amber-500/10 to-orange-600/5 border border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Payment Progress
            </h3>
            <span className="text-3xl font-black text-amber-500">{progress}%</span>
          </div>
          <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Total Paid</p>
              <p className="text-xl font-black text-success">{m.totalPaidBDT?.toLocaleString()} BDT</p>
              <p className="text-xs text-text-muted">{m.totalPaidUSDT} USDT</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Remaining</p>
              <p className="text-xl font-black text-amber-500">{m.remainingAmountBDT?.toLocaleString()} BDT</p>
              <p className="text-xs text-text-muted">{m.remainingAmountUSDT} USDT</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Payments</p>
              <p className="text-xl font-black text-white">{m.completedPaymentsCount || 0}/{m.totalPaymentsCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Next Due</p>
              <p className="text-xl font-black text-white">{daysUntilDue > 0 ? `${daysUntilDue}d` : 'Overdue'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Next Due Amount</p>
              <p className="text-2xl font-black text-white">{m.nextDueAmountBDT?.toLocaleString()} BDT</p>
            </div>
          </div>
          <div className="text-sm text-text-muted">≈ {m.nextDueAmountUSDT} USDT</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Next Due Date</p>
              <p className="text-2xl font-black text-white">{nextDue.toLocaleDateString()}</p>
            </div>
          </div>
          <div className={`text-sm font-bold ${daysUntilDue <= 3 ? 'text-red-500' : daysUntilDue <= 7 ? 'text-amber-500' : 'text-success'}`}>
            {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'OVERDUE'}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Gem className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Plan</p>
              <p className="text-2xl font-black text-white">{plan.titleEn || 'VIP Plan'}</p>
            </div>
          </div>
          <div className="text-sm text-text-muted capitalize">{m.membershipType || 'Premium'} Plan</div>
          <div className="text-xs text-text-muted mt-1">
            Activated: {new Date(m.joinedAt).toLocaleDateString()}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => router.push('/dashboard/payments')}
            className="px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Submit Payment
          </button>
          <button onClick={() => router.push('/dashboard/history')}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <Clock className="w-4 h-4" /> View History
          </button>
          <button onClick={() => router.push('/dashboard/notifications')}
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </button>
        </div>
      </motion.div>

      {/* Overdue Warning */}
      {isOverdue && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[24px] bg-red-500/5 border border-red-500/20 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-black text-red-500 mb-1">Payment Overdue</h4>
            <p className="text-text-muted text-sm">Your payment is overdue. Please submit your payment immediately to avoid membership suspension.</p>
          </div>
        </motion.div>
      )}

      {/* Plan Details */}
      {plan.bulletPoints && plan.bulletPoints.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-amber-500" /> Your VIP Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(plan.bulletPoints || []).filter((b: any) => b.visible).map((bullet: any) => (
              <div key={bullet.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${bullet.highlighted ? 'text-amber-500' : 'text-text-muted'}`} />
                <span className={`text-sm font-medium ${bullet.highlighted ? 'text-amber-500' : 'text-white'}`}>{bullet.textEn}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
