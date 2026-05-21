"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, DollarSign, TrendingUp, ShoppingCart, Percent, Check, X,
  Search, Filter, Ban, UserCheck, Eye, Wallet, TicketPercent,
  CreditCard, RefreshCw, Crown, Shield, Clock, ArrowUpRight,
  MoreHorizontal, Download, Globe, ChevronRight, Settings2, Save,
  Tag, Sliders,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrencyStore } from '@/store/useCurrencyStore';

function fetchJson(url: string, options?: RequestInit) {
  return fetch(url, options).then(r => {
    if (!r.ok) throw new Error('Request failed');
    return r.json();
  });
}

function AdminAffiliatesTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const { currentCurrency, toggleCurrency, convertPrice } = useCurrencyStore();
  const queryClient = useQueryClient();
  const fmt = (val: number) => {
    const { amount, currency } = convertPrice(val);
    return { amount: amount.toLocaleString(), currency, symbol: currency === 'BDT' ? '৳' : '$' };
  };

  const { data: affiliates, isLoading: loadingAffiliates } = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: () => fetchJson('/api/admin/affiliates'),
    refetchInterval: 15000,
  });

  const { data: analytics } = useQuery({
    queryKey: ['admin-affiliate-analytics'],
    queryFn: () => fetchJson('/api/admin/affiliates/analytics'),
    refetchInterval: 30000,
  });

  const { data: withdrawals } = useQuery({
    queryKey: ['admin-affiliate-withdrawals'],
    queryFn: () => fetchJson('/api/admin/affiliates/withdrawals'),
    refetchInterval: 15000,
  });

  const { data: globalSettings, refetch: refetchSettings } = useQuery({
    queryKey: ['admin-affiliate-settings'],
    queryFn: () => fetchJson('/api/admin/affiliates/settings'),
    refetchInterval: 30000,
  });

  const updateAffiliate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetchJson(`/api/admin/affiliates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-analytics'] });
      toast.success('Affiliate updated');
    },
    onError: () => toast.error('Failed to update'),
  });

  const processWithdrawal = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetchJson(`/api/admin/affiliates/withdrawals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliate-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
      toast.success('Withdrawal updated');
    },
    onError: () => toast.error('Failed to update withdrawal'),
  });

  const updateSettings = useMutation({
    mutationFn: (data: any) =>
      fetchJson('/api/admin/affiliates/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      refetchSettings();
      toast.success('Global settings updated');
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const updateCoupon = useMutation({
    mutationFn: ({ affiliateId, data }: { affiliateId: string; data: any }) =>
      fetchJson(`/api/admin/affiliates/coupons/${affiliateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
      toast.success('Coupon updated');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update coupon'),
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'affiliates', label: 'Affiliates', icon: Users },
    { id: 'withdrawals', label: 'Withdrawals', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
      <div className="space-y-10 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2 flex items-center gap-4">
              <Users className="w-10 h-10 text-primary" /> Affiliates
            </h2>
            <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">Manage affiliate partners, commissions, and payouts</p>
          </div>
          <button onClick={toggleCurrency}
            className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white hover:bg-white/[0.05] transition-all flex items-center gap-2">
            <Globe className="w-4 h-4" /> {currentCurrency === 'BDT' ? '৳ BDT' : '$ USDT'}
          </button>
        </div>

      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-primary text-white' : 'text-text-muted hover:text-white hover:bg-white/5'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeSubTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeSubTab === 'overview' && <OverviewTab analytics={analytics} affiliates={affiliates} fmt={fmt} />}
          {activeSubTab === 'affiliates' && (
            <AffiliatesListTab affiliates={affiliates} loading={loadingAffiliates} fmt={fmt} onUpdate={(id: string, data: any) => updateAffiliate.mutate({ id, data })} onUpdateCoupon={(affiliateId: string, data: any) => updateCoupon.mutate({ affiliateId, data })} />
          )}
          {activeSubTab === 'withdrawals' && (
            <WithdrawalsTab withdrawals={withdrawals} onProcess={(id: string, data: any) => processWithdrawal.mutate({ id, data })} />
          )}
          {activeSubTab === 'analytics' && <AnalyticsTab analytics={analytics} affiliates={affiliates} fmt={fmt} />}
          {activeSubTab === 'settings' && (
            <SettingsTab settings={globalSettings} onSave={(data: any) => updateSettings.mutate(data)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ analytics, affiliates, fmt }: any) {
  const a = analytics || {};
  const affs = affiliates || [];
  const pendingCount = affs.filter((a: any) => a.status === 'pending').length;
  const tc = fmt(a.totalCommission ?? 0);
  const pp = fmt(a.pendingPayouts ?? 0);

  const stats = [
    { label: 'Total Affiliates', value: a.totalAffiliates ?? affs.length, icon: Users, color: 'text-primary' },
    { label: 'Active', value: a.activeAffiliates ?? affs.filter((a: any) => a.status === 'active').length, icon: UserCheck, color: 'text-success' },
    { label: 'Pending Approval', value: pendingCount, icon: Shield, color: 'text-warning', pulse: pendingCount > 0 },
    { label: 'Total Referrals', value: a.totalReferrals ?? 0, icon: ShoppingCart, color: 'text-amber-500' },
    { label: 'Total Sales', value: a.totalSales ?? 0, icon: TrendingUp, color: 'text-secondary' },
    { label: 'Total Commission', value: `${tc.symbol}${tc.amount}`, icon: DollarSign, color: 'text-success' },
    { label: 'Pending Payouts', value: `${pp.symbol}${pp.amount}`, icon: Clock, color: 'text-warning' },
    { label: 'Conversion Rate', value: `${(a.conversionRate ?? 0).toFixed(1)}%`, icon: Percent, color: 'text-info' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className={`p-5 lg:p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all ${stat.pulse ? 'ring-1 ring-warning/30' : ''}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color}/5 blur-[80px] rounded-full -mr-16 -mt-16`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.color}/10 flex items-center justify-center border border-white/5`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.pulse && <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />}
                </div>
                <p className="text-2xl lg:text-3xl font-black tracking-tight mb-1">{stat.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {pendingCount > 0 && (
        <div className="p-6 rounded-2xl bg-warning/5 border border-warning/20">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-warning animate-pulse" />
            <p className="text-sm font-bold text-warning">{pendingCount} affiliate(s) pending approval</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AffiliatesListTab({ affiliates, loading, fmt, onUpdate, onUpdateCoupon }: any) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewAffiliate, setViewAffiliate] = useState<any>(null);
  const [actionModal, setActionModal] = useState<{ aff: any; action: string } | null>(null);
  const [editCoupon, setEditCoupon] = useState<any>(null);

  const list = (affiliates || []).filter((a: any) => {
    if (search && !a.fullName?.toLowerCase().includes(search.toLowerCase()) && !a.email?.toLowerCase().includes(search.toLowerCase()) && !a.affiliateCode?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const statusColor: Record<string, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    active: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    banned: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, code..."
            className="admin-input-sm w-full pl-10 text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-input-sm text-white bg-white/[0.02] border-white/10">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
          <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 font-bold text-lg">No affiliates found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((aff: any, idx: number) => (
            <motion.div key={aff._id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-lg font-black text-primary">{aff.fullName?.charAt(0) || '?'}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-base font-bold">{aff.fullName}</p>
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusColor[aff.status] || 'bg-white/5 text-text-muted border-white/10'}`}>
                        {aff.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{aff.email} {aff.telegramUsername ? `• ${aff.telegramUsername}` : ''}</p>
                    <p className="text-[9px] text-primary font-bold">Code: {aff.affiliateCode}</p>
                    {aff.coupon && (
                      <p className="text-[8px] text-amber-400 font-bold">Coupon: {aff.coupon.couponCode} ({aff.coupon.discountPercent}%/{aff.coupon.commissionPercent}%)</p>
                    )}
                    {aff.promotionMethod && (
                      <p className="text-[8px] text-text-muted mt-0.5">Promo: {aff.promotionMethod.substring(0, 40)}{aff.promotionMethod.length > 40 ? '...' : ''}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 lg:gap-6 text-center flex-wrap">
                  <div>
                    <p className="text-sm font-bold">{(() => { const f = fmt(aff.totalCommission || 0); return f.symbol + f.amount; })()}</p>
                    <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Earned</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{aff.totalReferrals || 0}</p>
                    <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest">Referred</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      setEditCoupon({ affiliateId: aff._id, coupon: aff.coupon || { couponCode: '', discountPercent: 5, commissionPercent: 20, usageLimit: 0, active: true }, affiliateName: aff.fullName });
                    }}
                      className="w-9 h-9 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 flex items-center justify-center transition-all border border-amber-500/20"
                      title="Edit Coupon">
                      <Tag className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewAffiliate(aff)}
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all border border-white/10"
                      title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>

                    {aff.status === 'pending' && (
                      <>
                        <button onClick={() => setActionModal({ aff, action: 'approve' })}
                          className="w-9 h-9 rounded-xl bg-success/10 hover:bg-success text-success flex items-center justify-center transition-all border border-success/20" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setActionModal({ aff, action: 'reject' })}
                          className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 flex items-center justify-center transition-all border border-red-500/20" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {aff.status === 'active' && (
                      <button onClick={() => setActionModal({ aff, action: 'suspend' })}
                        className="w-9 h-9 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 flex items-center justify-center transition-all border border-orange-500/20" title="Suspend">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}

                    {aff.status === 'banned' && (
                      <button onClick={() => setActionModal({ aff, action: 'unban' })}
                        className="w-9 h-9 rounded-xl bg-success/10 hover:bg-success text-success flex items-center justify-center transition-all border border-success/20" title="Unban">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}

                    {(aff.status === 'rejected' || aff.status === 'suspended') && (
                      <button onClick={() => setActionModal({ aff, action: 'approve' })}
                        className="w-9 h-9 rounded-xl bg-success/10 hover:bg-success text-success flex items-center justify-center transition-all border border-success/20" title="Reinstate">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {viewAffiliate && (
          <AffiliateDetailModal affiliate={viewAffiliate} onClose={() => setViewAffiliate(null)} onUpdate={onUpdate} onUpdateCoupon={onUpdateCoupon} />
        )}
        {actionModal && (
          <ActionModal affiliate={actionModal.aff} action={actionModal.action} onClose={() => setActionModal(null)}
            onConfirm={(note: string) => {
              const aff = actionModal.aff;
              if (actionModal.action === 'approve') onUpdate(aff._id, { status: 'active', verified: true, note });
              else if (actionModal.action === 'reject') onUpdate(aff._id, { status: 'rejected', note });
              else if (actionModal.action === 'suspend') onUpdate(aff._id, { status: 'suspended', reason: note || 'Violation of terms' });
              else if (actionModal.action === 'unban') onUpdate(aff._id, { status: 'active', note: 'Account unbanned' });
              setActionModal(null);
            }}
          />
        )}
        {editCoupon && (
          <EditCouponModal
            affiliateId={editCoupon.affiliateId}
            coupon={editCoupon.coupon}
            affiliateName={editCoupon.affiliateName}
            onClose={() => setEditCoupon(null)}
            onSave={(data: any) => {
              onUpdateCoupon(editCoupon.affiliateId, data);
              setEditCoupon(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditCouponModal({ affiliateId, coupon, affiliateName, onClose, onSave }: any) {
  const [form, setForm] = useState({
    couponCode: coupon?.couponCode || '',
    discountPercent: coupon?.discountPercent || 5,
    commissionPercent: coupon?.commissionPercent || 20,
    usageLimit: coupon?.usageLimit || 0,
    active: coupon?.active !== false,
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="w-full max-w-lg bg-[#020617] rounded-[32px] border border-white/10 p-8 space-y-6 max-h-[90vh] overflow-y-auto premium-scrollbar"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Tag className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-black">Edit Coupon</h3>
            <p className="text-xs text-text-muted">{affiliateName} • Coupon configuration</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Coupon Code</label>
            <input value={form.couponCode} onChange={(e) => setForm(p => ({ ...p, couponCode: e.target.value.toUpperCase() }))}
              placeholder="e.g. PARVEZ5"
              className="admin-input w-full text-white placeholder:text-white/20 bg-white/[0.02] border-white/10 font-mono font-bold tracking-wider" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Discount %</label>
              <div className="relative">
                <input type="number" value={form.discountPercent} onChange={(e) => setForm(p => ({ ...p, discountPercent: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                  className="admin-input w-full text-white bg-white/[0.02] border-white/10 pr-8" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Commission %</label>
              <div className="relative">
                <input type="number" value={form.commissionPercent} onChange={(e) => setForm(p => ({ ...p, commissionPercent: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                  className="admin-input w-full text-white bg-white/[0.02] border-white/10 pr-8" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Usage Limit (0 = unlimited)</label>
            <input type="number" value={form.usageLimit} onChange={(e) => setForm(p => ({ ...p, usageLimit: Math.max(0, Number(e.target.value)) }))}
              className="admin-input w-full text-white bg-white/[0.02] border-white/10" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-sm font-bold">Active</p>
              <p className="text-[9px] text-text-muted">Toggle coupon on/off</p>
            </div>
            <button onClick={() => setForm(p => ({ ...p, active: !p.active }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${form.active ? 'bg-success' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.active ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Preview</p>
            <p className="text-sm">
              Coupon <span className="font-mono font-bold text-amber-400">{form.couponCode || 'COUPON'}</span> gives{' '}
              <span className="text-success font-bold">{form.discountPercent}% discount</span> to buyers and{' '}
              <span className="text-primary font-bold">{form.commissionPercent}% commission</span> to affiliate.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-text-muted font-black uppercase text-xs tracking-widest hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-4 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary/80 transition-all flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Coupon
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ActionModal({ affiliate, action, onClose, onConfirm }: any) {
  const [note, setNote] = useState('');

  const config: Record<string, { title: string; placeholder: string; button: string; color: string }> = {
    approve: { title: 'Approve Affiliate', placeholder: 'Approval note (optional)', button: 'Approve', color: 'bg-success' },
    reject: { title: 'Reject Affiliate', placeholder: 'Rejection reason (optional)', button: 'Reject', color: 'bg-red-500' },
    suspend: { title: 'Suspend Affiliate', placeholder: 'Suspension reason', button: 'Suspend', color: 'bg-orange-500' },
    unban: { title: 'Unban Affiliate', placeholder: 'Unban note', button: 'Confirm Unban', color: 'bg-success' },
  };

  const c = config[action] || config.approve;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="w-full max-w-md bg-[#020617] rounded-[32px] border border-white/10 p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-xl font-black text-primary">{affiliate.fullName?.charAt(0) || '?'}</span>
          </div>
          <div>
            <h3 className="text-xl font-black">{c.title}</h3>
            <p className="text-xs text-text-muted">{affiliate.fullName} • @{affiliate.affiliateCode}</p>
          </div>
        </div>

        {affiliate.promotionMethod && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Promotion Method</p>
            <p className="text-sm">{affiliate.promotionMethod}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Add Note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={c.placeholder}
              className="admin-input w-full min-h-[100px] text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 text-text-muted font-black uppercase text-xs tracking-widest hover:text-white transition-all">
              Cancel
            </button>
            <button onClick={() => onConfirm(note)}
              className={`flex-1 py-4 rounded-2xl ${c.color} text-white font-black uppercase text-xs tracking-widest hover:opacity-80 transition-all`}>
              {c.button}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AffiliateDetailModal({ affiliate, onClose, onUpdate, onUpdateCoupon }: any) {
  const [actionModal, setActionModal] = useState<{ action: string } | null>(null);
  const { convertPrice } = useCurrencyStore();
  const dfmt = (val: number) => { const { amount, currency } = convertPrice(val); return { amount: amount.toLocaleString(), currency, symbol: currency === 'BDT' ? '৳' : '$' }; };

  const statusColor: Record<string, string> = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    active: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    banned: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
          className="w-full max-w-lg bg-[#020617] rounded-[32px] border border-white/10 p-8 space-y-6 max-h-[90vh] overflow-y-auto premium-scrollbar"
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <span className="text-2xl font-black text-primary">{affiliate.fullName?.charAt(0) || '?'}</span>
              </div>
              <div>
                <h3 className="text-xl font-black">{affiliate.fullName}</h3>
                <p className="text-xs text-text-muted">@{affiliate.affiliateCode}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Email</p>
              <p className="font-bold break-all">{affiliate.email}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Telegram</p>
              <p className="font-bold">{affiliate.telegramUsername || '—'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Joined</p>
              <p className="font-bold">{new Date(affiliate.joinedAt).toLocaleDateString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted">Status</p>
              <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusColor[affiliate.status] || 'bg-white/5 text-text-muted border-white/10'}`}>
                {affiliate.status}
              </span>
            </div>
          </div>

          {affiliate.promotionMethod && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Promotion Method</p>
              <p className="text-sm font-bold">{affiliate.promotionMethod}</p>
            </div>
          )}

          {affiliate.coupon && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Coupon</p>
                <button onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document.querySelector('[data-edit-coupon]')?.dispatchEvent(new Event('click', { bubbles: true }));
                  }, 100);
                }}
                  className="text-[8px] text-amber-400 hover:text-amber-300 font-black uppercase tracking-widest flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-mono font-bold text-amber-400">{affiliate.coupon.couponCode}</span>
                <span className="text-success">{affiliate.coupon.discountPercent}% off</span>
                <span className="text-primary">{affiliate.coupon.commissionPercent}% comm</span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${affiliate.coupon.active ? 'text-success' : 'text-red-400'}`}>
                  {affiliate.coupon.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}

          {affiliate.rejectionNote && (
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Rejection Note</p>
              <p className="text-sm text-red-300">{affiliate.rejectionNote}</p>
            </div>
          )}

          {affiliate.approvalNote && (
            <div className="p-4 rounded-2xl bg-success/5 border border-success/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-success mb-1">Approval Note</p>
              <p className="text-sm text-success/80">{affiliate.approvalNote}</p>
            </div>
          )}

          {affiliate.banReason && (
            <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Ban Reason</p>
              <p className="text-sm text-red-300">{affiliate.banReason}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-success/5 border border-success/10 text-center">
              <p className="text-lg font-black text-success">{(() => { const { symbol, amount } = dfmt(affiliate.totalCommission || 0); return symbol + amount; })()}</p>
              <p className="text-[8px] text-text-muted font-black uppercase tracking-widest">Earned</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
              <p className="text-lg font-black text-amber-500">{affiliate.totalReferrals || 0}</p>
              <p className="text-[8px] text-text-muted font-black uppercase tracking-widest">Referred</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-lg font-black text-primary">{affiliate.totalSales || 0}</p>
              <p className="text-[8px] text-text-muted font-black uppercase tracking-widest">Sales</p>
            </div>
          </div>

          <p className="text-[10px] text-text-muted text-center mt-2">
            Referral Link: <span className="text-primary font-bold break-all">{affiliate.referralLink}</span>
          </p>

          {affiliate.status === 'pending' && (
            <div className="flex gap-3">
              <button onClick={() => setActionModal({ action: 'approve' })}
                className="flex-1 py-4 rounded-2xl bg-success text-white font-black uppercase text-xs tracking-widest hover:bg-success/80 transition-all flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Approve
              </button>
              <button onClick={() => setActionModal({ action: 'reject' })}
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {actionModal && (
          <ActionModal affiliate={affiliate} action={actionModal.action} onClose={() => setActionModal(null)}
            onConfirm={(note: string) => {
              if (actionModal.action === 'approve') onUpdate(affiliate._id, { status: 'active', verified: true, note });
              if (actionModal.action === 'reject') onUpdate(affiliate._id, { status: 'rejected', note });
              setActionModal(null);
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function SettingsTab({ settings, onSave }: any) {
  const [form, setForm] = useState({ ...settings });
  const { usdtRate, convertPrice } = useCurrencyStore();
  const fmt = (val: number) => {
    const { amount, currency } = convertPrice(val);
    return { amount: amount.toLocaleString(), currency, symbol: currency === 'BDT' ? '৳' : '$' };
  };

  React.useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const bdtMin = Math.ceil((form.minWithdrawal || 5) * usdtRate);
  const bdtMax = form.maxWithdrawal > 0 ? Math.ceil(form.maxWithdrawal * usdtRate) : null;

  const handleSave = () => {
    const upd: any = {};
    if (form.defaultDiscountPercent !== settings?.defaultDiscountPercent) upd.defaultDiscountPercent = form.defaultDiscountPercent;
    if (form.defaultCommissionPercent !== settings?.defaultCommissionPercent) upd.defaultCommissionPercent = form.defaultCommissionPercent;
    if (form.referralSignupReward !== settings?.referralSignupReward) upd.referralSignupReward = form.referralSignupReward;
    if (form.minWithdrawal !== settings?.minWithdrawal) upd.minWithdrawal = form.minWithdrawal;
    if (form.maxWithdrawal !== settings?.maxWithdrawal) upd.maxWithdrawal = form.maxWithdrawal;
    if (form.referralCookieDays !== settings?.referralCookieDays) upd.referralCookieDays = form.referralCookieDays;
    if (form.defaultCurrency !== settings?.defaultCurrency) upd.defaultCurrency = form.defaultCurrency;
    if (Object.keys(upd).length === 0) {
      toast.error('No changes to save');
      return;
    }
    onSave(upd);
  };

  if (!settings) {
    return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Settings2 className="w-7 h-7 text-primary" /> Global Affiliate Settings
          </h3>
          <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Default rates and limits for new affiliates</p>
        </div>
        <button onClick={handleSave}
          className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
          <h4 className="text-lg font-black flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" /> Commission & Discount
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Default Discount % (Buyer gets)</label>
              <div className="relative">
                <input type="number" value={form.defaultDiscountPercent} onChange={(e) => setForm((p: any) => ({ ...p, defaultDiscountPercent: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                  className="admin-input w-full text-white bg-white/[0.02] border-white/10 pr-8" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Default Commission % (Affiliate earns)</label>
              <div className="relative">
                <input type="number" value={form.defaultCommissionPercent} onChange={(e) => setForm((p: any) => ({ ...p, defaultCommissionPercent: Math.max(0, Math.min(100, Number(e.target.value))) }))}
                  className="admin-input w-full text-white bg-white/[0.02] border-white/10 pr-8" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Referral Signup Reward (Affiliate gets per referred signup)</label>
              <div className="relative">
                <input type="number" value={form.referralSignupReward} onChange={(e) => setForm((p: any) => ({ ...p, referralSignupReward: Math.max(0, Number(e.target.value)) }))}
                  className="admin-input w-full text-white bg-white/[0.02] border-white/10" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">BDT</span>
              </div>
              <p className="text-[8px] text-text-muted mt-1">Fixed reward (in BDT) credited to affiliate wallet when their referred user completes first purchase</p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
          <h4 className="text-lg font-black flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-500" /> Withdrawal Limits
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Minimum Withdrawal</label>
              <input type="number" value={form.minWithdrawal} onChange={(e) => setForm((p: any) => ({ ...p, minWithdrawal: Math.max(0, Number(e.target.value)) }))}
                className="admin-input w-full text-white bg-white/[0.02] border-white/10" />
              <p className="text-[9px] text-text-muted">${form.minWithdrawal || 5} USD = {fmt(bdtMin).symbol}{fmt(bdtMin).amount} {fmt(bdtMin).currency} (at {usdtRate} rate)</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Maximum Withdrawal — 0 = unlimited</label>
              <input type="number" value={form.maxWithdrawal} onChange={(e) => setForm((p: any) => ({ ...p, maxWithdrawal: Math.max(0, Number(e.target.value)) }))}
                className="admin-input w-full text-white bg-white/[0.02] border-white/10" />
              {bdtMax !== null && (
                <p className="text-[9px] text-text-muted">${form.maxWithdrawal} USD = {fmt(bdtMax).symbol}{fmt(bdtMax).amount} {fmt(bdtMax).currency} (at {usdtRate} rate)</p>
              )}
              {form.maxWithdrawal === 0 && (
                <p className="text-[9px] text-text-muted">No upper limit (0 = unlimited)</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 lg:col-span-2">
          <h4 className="text-lg font-black flex items-center gap-2">
            <Clock className="w-5 h-5 text-info" /> Referral Cookie Duration
          </h4>
          <div className="space-y-2 max-w-xs">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Cookie expiry (days)</label>
            <input type="number" value={form.referralCookieDays} onChange={(e) => setForm((p: any) => ({ ...p, referralCookieDays: Math.max(1, Number(e.target.value)) }))}
              className="admin-input w-full text-white bg-white/[0.02] border-white/10" />
            <p className="text-[8px] text-text-muted mt-1">Referral links will track for this many days after click</p>
          </div>
        </div>

        <div className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 lg:col-span-2">
          <h4 className="text-lg font-black flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Default Currency
          </h4>
          <div className="space-y-2 max-w-xs">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Payout currency for new withdrawals</label>
            <div className="grid grid-cols-2 gap-2">
              {(['BDT', 'USDT'] as const).map((c) => (
                <button key={c} type="button" onClick={() => setForm((p: any) => ({ ...p, defaultCurrency: c }))}
                  className={`p-4 rounded-xl border text-center text-sm font-bold uppercase tracking-widest transition-all ${form.defaultCurrency === c ? 'bg-primary/10 border-primary text-primary' : 'bg-white/[0.02] border-white/10 text-text-muted hover:text-white'}`}>
                  {c === 'BDT' ? '৳ BDT' : '$ USDT'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WithdrawalsTab({ withdrawals, onProcess }: any) {
  const [action, setAction] = useState<{ id: string; status: string; note: string } | null>(null);
  const { convertPrice } = useCurrencyStore();
  const fmt = (val: number) => {
    const { amount, currency } = convertPrice(val);
    return { amount: amount.toLocaleString(), currency, symbol: currency === 'BDT' ? '৳' : '$' };
  };

  const list = withdrawals || [];

  const statusColor: Record<string, string> = {
    pending: 'text-warning bg-warning/10 border-warning/20',
    approved: 'text-primary bg-primary/10 border-primary/20',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
    paid: 'text-success bg-success/10 border-success/20',
  };

  return (
    <div className="space-y-6">
      {list.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
          <CreditCard className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-white/40 font-bold text-lg">No withdrawal requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((wd: any, idx: number) => (
            <motion.div key={wd._id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Wallet className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-base font-bold">{wd.currency === 'BDT' ? `${fmt(wd.amount).symbol}${fmt(wd.amount).amount}` : `$${wd.amount?.toFixed(2)}`} via {wd.paymentMethod}</p>
                    <p className="text-xs text-text-muted">{wd.accountInfo?.accountNumber} {wd.accountInfo?.accountHolder ? `• ${wd.accountInfo.accountHolder}` : ''}</p>
                    {wd.affiliateName && <p className="text-[9px] text-primary font-bold">Affiliate: {wd.affiliateName}</p>}
                    <p className="text-[9px] text-text-muted">{new Date(wd.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusColor[wd.status] || 'text-text-muted bg-white/5 border-white/10'}`}>
                    {wd.status}
                  </span>
                  {wd.status === 'pending' && (
                    <>
                      <button onClick={() => onProcess(wd._id, { status: 'approved' })}
                        className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                        Approve
                      </button>
                      <button onClick={() => setAction({ id: wd._id, status: 'rejected', note: '' })}
                        className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                        Reject
                      </button>
                    </>
                  )}
                  {wd.status === 'approved' && (
                    <button onClick={() => onProcess(wd._id, { status: 'paid' })}
                      className="px-4 py-2 rounded-xl bg-success/10 text-success border border-success/20 text-[9px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all">
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
              {wd.adminNote && <p className="mt-3 text-xs text-text-muted italic">Note: {wd.adminNote}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {action && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setAction(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="w-full max-w-md bg-[#020617] rounded-[32px] border border-white/10 p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-black">Reject Withdrawal</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Reason (optional)</label>
                  <textarea value={action.note} onChange={(e) => setAction({ ...action, note: e.target.value })}
                    placeholder="Why is this being rejected?"
                    className="admin-input w-full min-h-[100px] text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setAction(null)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-text-muted font-black uppercase text-xs tracking-widest hover:text-white transition-all">
                    Cancel
                  </button>
                  <button onClick={() => { onProcess(action.id, { status: 'rejected', adminNote: action.note }); setAction(null); }}
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all">
                    Confirm Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsTab({ analytics, affiliates, fmt }: any) {
  const affs = affiliates || [];
  const a = analytics || {};

  const topAffiliates = a.topAffiliates || [...affs].sort((x: any, y: any) => (y.totalCommission || 0) - (x.totalCommission || 0)).slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-500" /> Top Affiliates</h3>
          <div className="space-y-3">
            {topAffiliates.slice(0, 5).map((aff: any, idx: number) => (
              <div key={aff._id || idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[9px] font-black text-primary">#{idx + 1}</span>
                  <div>
                    <p className="text-sm font-bold">{aff.fullName}</p>
                    <p className="text-[8px] text-text-muted">{aff.totalSales || 0} sales</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-success">{(() => { const f = fmt(aff.totalCommission || 0); return f.symbol + f.amount; })()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Performance Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg. Commission per Sale', value: (() => { const f = fmt(a.avgCommissionPerSale ?? 0); return f.symbol + f.amount; })(), color: 'text-success' },
              { label: 'Avg. Referrals per Affiliate', value: (a.avgReferralsPerAffiliate ?? 0).toFixed(1), color: 'text-primary' },
              { label: 'Total Discounts Given', value: (() => { const f = fmt(a.totalDiscounts ?? 0); return f.symbol + f.amount; })(), color: 'text-amber-500' },
              { label: 'Total Paid Out', value: (() => { const f = fmt(a.totalPaidOut ?? 0); return f.symbol + f.amount; })(), color: 'text-secondary' },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-xs font-bold text-text-muted">{metric.label}</span>
                <span className={`text-lg font-black ${metric.color}`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAffiliatesTab;
