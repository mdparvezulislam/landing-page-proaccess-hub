"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Search, Ban, UserCheck, UserX, Clock,
  DollarSign, Calendar, TrendingUp, Eye, X, Check,
  BadgeCheck, Hourglass, Lock, Unlock, Plus, Activity,
  CreditCard, AlertTriangle, Bell, Trash2, Crown, RefreshCw
} from 'lucide-react';
import { useVIPMembers, useUpdateVIPMember, useDeleteVIPMember, useVIPPayments, useVerifyVIPPayment, useVIPStats, useVIPPlans, useVIPReminders, useCreateVIPReminder, useVIPNotifications, useCreateVIPNotification } from '@/hooks/useVIP';
import { toast } from 'sonner';
import { useCurrencyStore } from '@/store/useCurrencyStore';

type FilterTab = 'all' | 'active' | 'pending' | 'overdue' | 'banned' | 'completed';

export default function VIPMembersTab() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showBanModal, setShowBanModal] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [showPaymentDetail, setShowPaymentDetail] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'payments' | 'activity'>('members');
  const [customAmountBDT, setCustomAmountBDT] = useState(0);
  const [customAmountUSDT, setCustomAmountUSDT] = useState(0);

  const { data: members, isLoading } = useVIPMembers();
  const { data: plans } = useVIPPlans();
  const { data: payments } = useVIPPayments();
  const { data: stats } = useVIPStats();
  const { data: reminders } = useVIPReminders();
  const { data: notifications } = useVIPNotifications();
  const updateMember = useUpdateVIPMember();
  const deleteMember = useDeleteVIPMember();
  const verifyPayment = useVerifyVIPPayment();
  const createReminder = useCreateVIPReminder();
  const createNotification = useCreateVIPNotification();
  const { currentCurrency, convertPrice } = useCurrencyStore();

  const allMembers = members || [];
  const allPlans = plans || [];
  const allPayments = payments || [];
  const allReminders = reminders || [];
  const allNotifications = notifications || [];

  const filtered = allMembers.filter((m: any) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return m.userName?.toLowerCase().includes(q) || m.telegramUsername?.toLowerCase().includes(q);
  });

  const getPlanName = (plan: any) => {
    if (!plan) return 'N/A';
    if (typeof plan === 'string') return allPlans.find((p: any) => p._id === plan)?.titleEn || plan;
    return plan.titleEn || plan._id || 'VIP Plan';
  };

  const getMemberPayments = (userId: string) => allPayments.filter((p: any) => p.membershipUserId?._id === userId || p.membershipUserId === userId);

  const handleBan = async (id: string) => {
    try {
      await updateMember.mutateAsync({ id, data: { banned: true, status: 'banned', banReason } });
      await createNotification.mutateAsync({ userId: id, type: 'membership_banned', titleEn: 'Membership Banned', titleBn: 'মেম্বারশিপ বন্ধ', messageEn: banReason || 'Your membership has been banned.', messageBn: banReason || 'আপনার মেম্বারশিপ বন্ধ করা হয়েছে।' });
      setShowBanModal(null);
      setBanReason('');
    } catch { toast.error('Failed to ban member'); }
  };

  const handleUnban = async (id: string) => {
    try {
      await updateMember.mutateAsync({ id, data: { banned: false, status: 'active', banReason: '' } });
      await createNotification.mutateAsync({ userId: id, type: 'membership_activated', titleEn: 'Membership Restored', titleBn: 'মেম্বারশিপ পুনরুদ্ধার', messageEn: 'Your membership has been restored.', messageBn: 'আপনার মেম্বারশিপ পুনরুদ্ধার করা হয়েছে।' });
    } catch { toast.error('Failed to unban member'); }
  };

  const handleDeleteMember = async () => {
    if (!showDeleteModal) return;
    const member = allMembers.find((m: any) => m._id === showDeleteModal);
    if (!member) return;
    try {
      await deleteMember.mutateAsync(showDeleteModal);
      if (selectedMember?._id === showDeleteModal) { setShowDetail(false); setSelectedMember(null); }
      toast.success(`${member.userName} permanently removed`);
      setShowDeleteModal(null);
    } catch { toast.error('Failed to remove member'); }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      await verifyPayment.mutateAsync({ id: paymentId, data: { status: 'approved' } });
      const payment = allPayments.find((p: any) => p._id === paymentId);
      if (payment?.membershipUserId?._id) {
        await createNotification.mutateAsync({
          userId: payment.membershipUserId._id,
          type: 'payment_approved',
          titleEn: 'Payment Approved',
          titleBn: 'পেমেন্ট অনুমোদিত',
          messageEn: `Your payment of ${payment.amountBDT} BDT has been approved.`,
          messageBn: `আপনার ${payment.amountBDT} বিডিটি পেমেন্ট অনুমোদিত হয়েছে।`,
        });
      }
      toast.success('Payment approved');
    } catch { toast.error('Failed to approve payment'); }
  };

  const handleRejectPayment = async () => {
    if (!rejectPaymentId || !rejectReason) return;
    try {
      await verifyPayment.mutateAsync({ id: rejectPaymentId, data: { status: 'rejected', rejectionReason: rejectReason } });
      const payment = allPayments.find((p: any) => p._id === rejectPaymentId);
      if (payment?.membershipUserId?._id) {
        await createNotification.mutateAsync({
          userId: payment.membershipUserId._id,
          type: 'payment_rejected',
          titleEn: 'Payment Rejected',
          titleBn: 'পেমেন্ট প্রত্যাখ্যান',
          messageEn: `Your payment of ${payment.amountBDT} BDT was rejected. Reason: ${rejectReason}`,
          messageBn: `আপনার ${payment.amountBDT} বিডিটি পেমেন্ট প্রত্যাখ্যান করা হয়েছে। কারণ: ${rejectReason}`,
        });
      }
      toast.success('Payment rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setRejectPaymentId(null);
    } catch { toast.error('Failed to reject payment'); }
  };

  const handleExtendDueDate = async (id: string, days: number) => {
    const member = allMembers.find((m: any) => m._id === id);
    if (!member) return;
    const newDate = new Date(member.nextDueDate);
    newDate.setDate(newDate.getDate() + days);
    try {
      await updateMember.mutateAsync({ id, data: { nextDueDate: newDate } });
      toast.success(`Due date extended by ${days} days`);
    } catch { toast.error('Failed to extend date'); }
  };

  const handleSaveNote = async (note: string) => {
    if (!selectedMember) return;
    try {
      await updateMember.mutateAsync({ id: selectedMember._id, data: { adminNote: note } });
      setSelectedMember((prev: any) => prev ? { ...prev, adminNote: note } : null);
      toast.success('Note saved');
    } catch { toast.error('Failed to save note'); }
  };

  const handleManualMarkPayment = async (memberId: string) => {
    const member = allMembers.find((m: any) => m._id === memberId);
    if (!member || !customAmountBDT) return;
    try {
      const res = await fetch('/api/vip/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipUserId: memberId,
          amountBDT: customAmountBDT,
          amountUSDT: customAmountUSDT || Math.round(customAmountBDT / 125),
          paymentMethod: 'manual',
          transactionId: `ADMIN-${Date.now()}`,
          status: 'approved',
          verified: true,
          verifiedBy: 'Admin',
        }),
      });
      const payment = await res.json();
      if (!res.ok) throw new Error(payment.error);
      await verifyPayment.mutateAsync({ id: payment._id, data: { status: 'approved', verified: true } });
      toast.success('Payment recorded & verified');
      setCustomAmountBDT(0);
      setCustomAmountUSDT(0);
    } catch { toast.error('Failed to record payment'); }
  };

  const statusColors: Record<string, string> = {
    active: 'bg-success/10 text-success border-success/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    banned: 'bg-red-500/10 text-red-500 border-red-500/20',
    completed: 'bg-info/10 text-info border-info/20',
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2 flex items-center gap-4">
            <Shield className="w-10 h-10 text-amber-500" /> VIP Members
          </h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">Manage VIP members, payments, due tracking & bans</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: 'Total', value: stats.totalMembers, icon: Users, color: 'text-white' },
            { label: 'Active', value: stats.activeMembers, icon: BadgeCheck, color: 'text-success' },
            { label: 'Pending', value: stats.pendingMembers, icon: Hourglass, color: 'text-amber-500' },
            { label: 'Banned', value: stats.bannedMembers, icon: Ban, color: 'text-red-500' },
            { label: 'Payments', value: stats.totalPayments, icon: CreditCard, color: 'text-primary' },
            { label: 'USDT Revenue', value: `${stats.totalRevenueUSDT?.toLocaleString()}`, icon: TrendingUp, color: 'text-secondary' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{s.label}</span>
              </div>
              <p className={`text-xl font-black tracking-tight ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab Toggle */}
      <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl w-fit border border-white/5">
        {[
          { id: 'members', label: 'Members', icon: Users },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'activity', label: 'Activity Log', icon: Activity },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSubTab === tab.id ? 'bg-amber-500 text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
          ><tab.icon className="w-4 h-4" /> {tab.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'members' && (
          <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/5">
                {(['all', 'active', 'pending', 'overdue', 'banned', 'completed'] as FilterTab[]).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-amber-500 text-white' : 'text-text-muted hover:text-white'}`}>{f}</button>
                ))}
              </div>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              {filtered.map((member: any, idx: number) => (
                <motion.div key={member._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 relative group hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => { setSelectedMember(member); setShowDetail(true); }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-black text-amber-500">{member.userName?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black tracking-tight">{member.userName}</h3>
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${statusColors[member.status] || statusColors.pending}`}>{member.status}</span>
                        {member.banned && <Ban className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                        {member.telegramUsername && <span>@{member.telegramUsername}</span>}
                        <span className="text-amber-500 font-bold">{getPlanName(member.selectedVIPPlanId)}</span>
                        <span>Progress: {member.paymentProgress || 0}%</span>
                        <span>Due: {new Date(member.nextDueDate).toLocaleDateString()}</span>
                        {member.status === 'overdue' && <span className="text-red-400 font-bold">OVERDUE</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setSelectedMember(member); setShowDetail(true); }} className="w-10 h-10 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center border border-success/20" title="Mark Paid">
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleExtendDueDate(member._id, 30)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-info hover:text-white transition-all flex items-center justify-center border border-white/10" title="Extend 30 days">
                        <Calendar className="w-4 h-4" />
                      </button>
                      {!member.banned ? (
                        <button onClick={() => { setShowBanModal(member._id); setBanReason(''); }} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10" title="Ban">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleUnban(member._id)} className="w-10 h-10 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center border border-success/20" title="Unban">
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setShowDeleteModal(member._id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20" title="Remove User">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
                  <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40 font-bold text-lg">No members found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'payments' && (
          <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <h3 className="text-xl font-black tracking-tighter">Payment History</h3>
            <div className="space-y-4">
              {allPayments.map((p: any, idx: number) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{p.amountBDT?.toLocaleString()} BDT</span>
                        {p.amountUSDT > 0 && <span className="text-text-muted text-sm">/ {p.amountUSDT} USDT</span>}
                        <span className="text-text-muted text-sm">{p.paymentMethod}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${p.status === 'approved' ? 'bg-success/10 text-success' : p.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {p.membershipUserId?.userName || 'Unknown'} — {new Date(p.paymentDate).toLocaleDateString()} — {p.transactionId}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprovePayment(p._id)}
                            className="px-4 py-2 rounded-xl bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all">Approve</button>
                          <button onClick={() => { setRejectPaymentId(p._id); setShowRejectModal(true); setRejectReason(''); }}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                        </>
                      )}
                      <button onClick={() => setShowPaymentDetail(showPaymentDetail === p._id ? null : p._id)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {showPaymentDetail === p._id && (
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-text-muted text-[10px] font-black uppercase tracking-wider block">TRX ID</span>{p.transactionId}</div>
                      <div><span className="text-text-muted text-[10px] font-black uppercase tracking-wider block">Method</span>{p.paymentMethod || 'N/A'}</div>
                      <div><span className="text-text-muted text-[10px] font-black uppercase tracking-wider block">Verified By</span>{p.verifiedBy || 'N/A'}</div>
                      <div><span className="text-text-muted text-[10px] font-black uppercase tracking-wider block">Date</span>{new Date(p.paymentDate).toLocaleString()}</div>
                      {p.status === 'rejected' && p.rejectionReason && (
                        <div className="col-span-full text-red-400 text-sm"><span className="font-black">Rejection Reason:</span> {p.rejectionReason}</div>
                      )}
                      {p.screenshot && <div className="col-span-full"><img src={p.screenshot} className="max-h-32 rounded-xl" alt="" /></div>}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'activity' && (
          <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            {/* Notifications */}
            <div>
              <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-4">Notifications ({allNotifications.length})</h4>
              <div className="space-y-2">
                {allNotifications.slice(0, 20).map((n: any) => (
                  <div key={n._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.read ? 'bg-white/5 text-text-muted' : 'bg-amber-500/10 text-amber-500'}`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{n.titleEn}</p>
                      <p className="text-xs text-text-muted truncate">{n.userId?.userName || n.userId}</p>
                    </div>
                    <span className="text-[10px] text-text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div>
              <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-4">Sent Reminders ({allReminders.length})</h4>
              <div className="space-y-2">
                {allReminders.slice(0, 20).map((r: any) => (
                  <div key={r._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate capitalize">{r.type.replace('_', ' ')}</p>
                      <p className="text-xs text-text-muted truncate">{r.userId?.userName || r.userId}</p>
                    </div>
                    <span className="text-[10px] text-text-muted">{new Date(r.sentAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${r.acknowledged ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-500'}`}>
                      {r.acknowledged ? 'Read' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedMember && (
          <MemberDetailModal
            member={selectedMember}
            payments={getMemberPayments(selectedMember._id)}
            planName={getPlanName(selectedMember.selectedVIPPlanId)}
            onClose={() => setShowDetail(false)}
            onStatusChange={(status: string) => updateMember.mutate({ id: selectedMember._id, data: { status } })}
            onExtendDue={(days: number) => handleExtendDueDate(selectedMember._id, days)}
            onMarkPaid={() => handleManualMarkPayment(selectedMember._id)}
            onSaveNote={handleSaveNote}
            onDelete={() => { setShowDetail(false); setShowDeleteModal(selectedMember._id); }}
            onApprovePayment={(paymentId: string) => handleApprovePayment(paymentId)}
            onOpenRejectModal={(paymentId: string) => { setRejectPaymentId(paymentId); setShowRejectModal(true); setRejectReason(''); }}
            customAmountBDT={customAmountBDT}
            customAmountUSDT={customAmountUSDT}
            setCustomAmountBDT={setCustomAmountBDT}
            setCustomAmountUSDT={setCustomAmountUSDT}
          />
        )}
      </AnimatePresence>

      {/* Reject Payment Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-[#020617] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-black tracking-tighter mb-2 text-red-500 flex items-center gap-3"><Ban className="w-6 h-6" /> Reject Payment</h3>
              <p className="text-text-muted mb-6">Provide a reason for rejecting this payment.</p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[100px] mb-6" />
              <div className="flex gap-4">
                <button onClick={() => { setShowRejectModal(false); setRejectPaymentId(null); setRejectReason(''); }} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handleRejectPayment} disabled={!rejectReason}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all disabled:opacity-50">Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete User Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-[#020617] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-black tracking-tighter mb-2 text-red-500 flex items-center gap-3"><Trash2 className="w-6 h-6" /> Remove User</h3>
              <p className="text-text-muted mb-2">This will permanently delete this member and their data from the database.</p>
              <p className="text-red-400 font-bold text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={handleDeleteMember} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ban Modal */}
      <AnimatePresence>
        {showBanModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-[#020617] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-black tracking-tighter mb-2 text-red-500 flex items-center gap-3"><Ban className="w-6 h-6" /> Ban Member</h3>
              <p className="text-text-muted mb-6">Provide a reason for banning.</p>
              <textarea value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Ban reason..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[100px] mb-6" />
              <div className="flex gap-4">
                <button onClick={() => setShowBanModal(null)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={() => handleBan(showBanModal)} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all">Ban</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemberDetailModal({ member, payments, planName, onClose, onStatusChange, onExtendDue, onMarkPaid, onSaveNote, onDelete, onApprovePayment, onOpenRejectModal, customAmountBDT, customAmountUSDT, setCustomAmountBDT, setCustomAmountUSDT }: any) {
  const [noteDraft, setNoteDraft] = useState(member.adminNote || '');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#020617] rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl max-h-[90vh]"
      >
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center">
              <span className="text-2xl font-black text-amber-500">{member.userName?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">{member.userName}</h3>
              <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{member.telegramUsername && `@${member.telegramUsername}`}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white font-bold text-sm tracking-widest uppercase px-6">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {/* Status & Plan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${member.status === 'active' ? 'bg-success/10 text-success border-success/20' : member.status === 'banned' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>{member.status}</span>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Plan</p>
              <p className="text-lg font-black">{planName}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Activated</p>
              <p className="text-lg font-black">{new Date(member.joinedAt).toLocaleDateString()}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Progress</p>
              <p className="text-lg font-black">{member.paymentProgress || 0}%</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-success/5 border border-success/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-success mb-1">Paid (BDT)</p>
              <p className="text-2xl font-black text-success">{member.totalPaidBDT?.toLocaleString()} BDT</p>
              <p className="text-sm text-success/60">{member.totalPaidUSDT} USDT</p>
            </div>
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Remaining (BDT)</p>
              <p className="text-2xl font-black text-amber-500">{member.remainingAmountBDT?.toLocaleString()} BDT</p>
              <p className="text-sm text-amber-500/60">{member.remainingAmountUSDT} USDT</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Next Renewal</p>
              <p className="text-2xl font-black">{new Date(member.nextDueDate).toLocaleDateString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-text-muted">{member.nextDueAmountBDT?.toLocaleString()} BDT / {member.nextDueAmountUSDT} USDT</p>
              </div>
              {(() => {
                const days = Math.ceil((new Date(member.nextDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <p className={`text-xs font-bold mt-1 ${days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-text-muted'}`}>
                    {days > 0 ? `${days} days remaining` : 'OVERDUE'}
                  </p>
                );
              })()}
            </div>
          </div>

          {/* Ban Reason */}
          {member.banReason && (
            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Ban Reason</p>
              <p className="text-sm font-bold text-red-400">{member.banReason}</p>
            </div>
          )}

          {/* Admin Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Admin Note</label>
            <div className="flex gap-3">
              <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm min-h-[80px]" placeholder="Add admin note..." />
              <button onClick={() => onSaveNote(noteDraft)} disabled={noteDraft === (member.adminNote || '')}
                className="self-end px-6 py-3 rounded-2xl bg-info/10 text-info border border-info/20 text-xs font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all disabled:opacity-30 flex items-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              {member.status !== 'active' && member.status !== 'banned' && (
                <button onClick={() => onStatusChange('active')} className="px-6 py-3 rounded-2xl bg-success/10 text-success border border-success/20 text-xs font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" /> Activate
                </button>
              )}
              {member.status === 'active' && (
                <button onClick={() => onStatusChange('overdue')} className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Mark Overdue
                </button>
              )}
              <button onClick={() => onExtendDue(30)} className="px-6 py-3 rounded-2xl bg-info/10 text-info border border-info/20 text-xs font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Extend 30d
              </button>
              <button onClick={() => onExtendDue(7)} className="px-6 py-3 rounded-2xl bg-info/10 text-info border border-info/20 text-xs font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Extend 7d
              </button>
              {member.status === 'completed' ? (
                <button onClick={() => onStatusChange('active')} className="px-6 py-3 rounded-2xl bg-info/10 text-info border border-info/20 text-xs font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Reactivate
                </button>
              ) : (
                <button onClick={() => onStatusChange('completed')} className="px-6 py-3 rounded-2xl bg-info/10 text-info border border-info/20 text-xs font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" /> Mark Completed
                </button>
              )}
              <button onClick={onDelete} className="px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Remove User
              </button>
            </div>
          </div>

          {/* Custom Payment */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-4">Manual Payment</h4>
            <div className="flex items-center gap-4">
              <input type="number" value={customAmountBDT || ''} onChange={(e) => setCustomAmountBDT(Number(e.target.value))} placeholder="Amount BDT"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-40" />
              <input type="number" value={customAmountUSDT || ''} onChange={(e) => setCustomAmountUSDT(Number(e.target.value))} placeholder="Amount USDT"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-40" />
              <button onClick={onMarkPaid} disabled={!customAmountBDT}
                className="px-8 py-3 rounded-2xl bg-success text-white font-black uppercase text-xs tracking-widest hover:bg-success/80 transition-all disabled:opacity-50 flex items-center gap-2">
                <Check className="w-4 h-4" /> Record & Verify
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-4">Payments ({payments.length})</h4>
            <div className="space-y-2">
              {payments.map((p: any) => (
                <div key={p._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{p.amountBDT?.toLocaleString()} BDT</span>
                        <span className="text-text-muted text-sm">{p.transactionId}</span>
                      </div>
                      <p className="text-xs text-text-muted">{new Date(p.paymentDate).toLocaleString()} • {p.paymentMethod}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${p.status === 'approved' ? 'bg-success/10 text-success border-success/20' : p.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {p.status === 'approved' ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                    {p.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => onApprovePayment(p._id)}
                          className="px-3 py-1.5 rounded-xl bg-success/10 text-success border border-success/20 text-[9px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all">Approve</button>
                        <button onClick={() => onOpenRejectModal(p._id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                      </div>
                    )}
                  </div>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <p className="text-xs text-red-400 mt-2">Reason: {p.rejectionReason}</p>
                  )}
                </div>
              ))}
              {payments.length === 0 && <p className="text-text-muted text-sm">No payments yet</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
