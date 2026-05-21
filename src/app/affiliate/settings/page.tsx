'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAffiliateMe, useUpdateAffiliateSettings } from '@/hooks/useAffiliate';
import { Settings, User, Lock, Wallet, Save, Eye, EyeOff, Tag, Percent, Gift } from 'lucide-react';
import { toast } from 'sonner';

export default function AffiliateSettingsPage() {
  const { data } = useAffiliateMe();
  const updateSettings = useUpdateAffiliateSettings();
  const user = data?.user;

  const [form, setForm] = useState({ fullName: '', telegramUsername: '' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ binance: '', bkash: '', nagad: '' });

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.fullName || '', telegramUsername: user.telegramUsername || '' });
      setPaymentInfo(user.paymentInfo || { binance: '', bkash: '', nagad: '' });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      await updateSettings.mutateAsync({ fullName: form.fullName, telegramUsername: form.telegramUsername });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await updateSettings.mutateAsync({ password: passwordForm.newPassword });
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      toast.success('Password updated');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await updateSettings.mutateAsync({ paymentInfo });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2">Settings</h1>
        <p className="text-text-muted text-sm font-medium">Manage your account and payment information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black">Profile</h3>
            <p className="text-[10px] text-text-muted font-medium">Update your personal information</p>
          </div>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
              className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Telegram Username</label>
            <input value={form.telegramUsername} onChange={(e) => setForm(prev => ({ ...prev, telegramUsername: e.target.value }))}
              placeholder="@username" className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Email</label>
            <input value={user?.email || ''} disabled
              className="admin-input w-full text-white/50 bg-white/[0.02] border-white/10 cursor-not-allowed" />
            <p className="text-[8px] text-text-muted">Email cannot be changed</p>
          </div>
          <button onClick={handleProfileUpdate} disabled={updateSettings.isPending}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-primary/80 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </motion.div>

      {user?.coupon && (
        <motion.div initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.03 }} className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-black">Your Coupon & Rates</h3>
              <p className="text-[10px] text-text-muted font-medium">Current discount and commission rates</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">Coupon Code</p>
              <p className="text-lg font-black font-mono text-amber-400 tracking-wider">{user.coupon.couponCode}</p>
            </div>
            <div className="p-4 rounded-2xl bg-success/5 border border-success/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-success mb-1">Discount</p>
              <p className="text-lg font-black text-success">{user.coupon.discountPercent}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Commission</p>
              <p className="text-lg font-black text-primary">{user.coupon.commissionPercent}%</p>
            </div>
          </div>
          {user.coupon.usageLimit > 0 && (
            <p className="text-[10px] text-text-muted mt-3">
              Used {user.coupon.totalUsed}/{user.coupon.usageLimit} times
            </p>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.05 }} className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-black">Change Password</h3>
            <p className="text-[10px] text-text-muted font-medium">Update your login password</p>
          </div>
        </div>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Min 6 characters" className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10 pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Confirm Password</label>
            <input type="password" value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Repeat password" className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
          </div>
          <button onClick={handlePasswordUpdate} disabled={updateSettings.isPending}
            className="bg-warning text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-warning/80 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Update Password
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} transition={{ delay: 0.1 }} className="p-6 lg:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-black">Payment Information</h3>
            <p className="text-[10px] text-text-muted font-medium">Where you&apos;ll receive payouts</p>
          </div>
        </div>
        <div className="space-y-4 max-w-md">
          {['binance', 'bkash', 'nagad'].map((method) => (
            <div key={method} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1 capitalize">{method} {method === 'binance' ? 'Wallet ID' : 'Number'}</label>
              <input value={(paymentInfo as any)[method]} onChange={(e) => setPaymentInfo(prev => ({ ...prev, [method]: e.target.value }))}
                placeholder={`Your ${method} account`} className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>
          ))}
          <button onClick={handlePaymentUpdate} disabled={updateSettings.isPending}
            className="bg-success text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:bg-success/80 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Payment Info
          </button>
        </div>
      </motion.div>
    </div>
  );
}
