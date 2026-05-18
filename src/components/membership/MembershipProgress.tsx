"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Sparkles, CreditCard } from 'lucide-react';

interface MembershipProgressProps {
  totalPaid: number;
  totalAmount: number;
  nextDueDate?: string;
  status: string;
  monthlyAmount: number;
  currency?: string;
}

export default function MembershipProgress({
  totalPaid,
  totalAmount,
  nextDueDate,
  status,
  monthlyAmount,
  currency = 'BDT',
}: MembershipProgressProps) {
  const progress = totalAmount > 0 ? Math.min(100, Math.round((totalPaid / totalAmount) * 100)) : 0;
  const remaining = Math.max(0, totalAmount - totalPaid);

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: 'text-success', bg: 'bg-success/10 border-success/20' },
    pending: { label: 'Pending', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
    overdue: { label: 'Overdue', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
    completed: { label: 'Completed', color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    banned: { label: 'Banned', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  };

  const cfg = statusConfig[status] || statusConfig.pending;

  return (
    <div className="w-full">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} text-[10px] font-black uppercase tracking-wider mb-4`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {cfg.label}
      </div>

      {/* Progress Circle */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="34" fill="none"
              stroke={progress >= 100 ? '#22C55E' : '#7C3AED'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black">{progress}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-text-muted">Total Paid</span>
            <span className="font-black text-success">{totalPaid?.toLocaleString()} {currency}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-bold text-text-muted">Remaining</span>
            <span className="font-black text-red-500">{remaining?.toLocaleString()} {currency}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-bold text-text-muted">Monthly Due</span>
            <span className="font-black text-primary">{monthlyAmount?.toLocaleString()} {currency}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: progress >= 100
              ? 'linear-gradient(90deg, #22C55E, #16A34A)'
              : 'linear-gradient(90deg, #7C3AED, #A78BFA)',
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-bold text-text-muted">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      {/* Next Due Info */}
      {status !== 'completed' && nextDueDate && (
        <div className="mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Next Payment Due</p>
            <p className="font-black text-sm">
              {new Date(nextDueDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-black text-primary">{monthlyAmount?.toLocaleString()} {currency}</p>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[25, 50, 75, 100].map((milestone) => {
          const isReached = progress >= milestone;
          return (
            <div
              key={milestone}
              className={`p-3 rounded-xl border text-center transition-all ${isReached
                ? 'bg-success/10 border-success/20'
                : 'bg-white/[0.02] border-white/5'
                }`}
            >
              {isReached ? (
                <CheckCircle2 className="w-4 h-4 text-success mx-auto mb-1" />
              ) : (
                <Sparkles className="w-4 h-4 text-text-muted mx-auto mb-1" />
              )}
              <p className={`text-[9px] font-black uppercase tracking-wider ${isReached ? 'text-success' : 'text-text-muted'}`}>
                {milestone}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
