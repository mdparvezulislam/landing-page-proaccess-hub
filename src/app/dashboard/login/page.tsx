'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, LogIn, Key, Shield, ArrowRight, AlertTriangle, User, Fingerprint, Hash } from 'lucide-react';
import { useVIPAuth } from '@/hooks/useVIPAuth';

export default function VIPLoginPage() {
  const { login, session } = useVIPAuth();
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (session) {
      window.location.href = '/dashboard';
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential.trim()) return;
    setLoading(true);
    setError('');
    const result = await login(credential.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-3 lg:p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-amber-500/10 blur-[150px] rounded-full animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-orange-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 lg:mb-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-[20px] lg:rounded-[24px] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-2xl shadow-amber-500/30">
            <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl lg:text-4xl font-black tracking-tighter text-white mb-1 lg:mb-2">VIP Dashboard</h1>
          <p className="text-text-muted text-sm lg:text-base font-medium">Sign in to manage your membership</p>
        </div>

        <motion.form onSubmit={handleLogin} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-[24px] lg:rounded-[32px] p-4 lg:p-8 border-white/10 space-y-4 lg:space-y-6 shadow-2xl">

          <div className="space-y-2 lg:space-y-3">
            <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center gap-1.5 lg:gap-2">
              <User className="w-3 h-3 lg:w-3.5 lg:h-3.5" /> Login Credential
            </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Telegram username / Membership ID / Access Code"
              className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3.5 lg:p-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder:text-text-muted/50"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {[
              { icon: User, label: '@username', desc: 'Telegram' },
              { icon: Hash, label: 'VIP-XXX', desc: 'Membership ID' },
              { icon: Key, label: 'XXXXXXXX', desc: 'Access Code' },
            ].map((item, i) => (
              <div key={i} className="p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-500 mx-auto mb-0.5 lg:mb-1" />
                <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-wider text-text-muted">{item.label}</p>
                <p className="text-[7px] lg:text-[8px] text-text-muted/60">{item.desc}</p>
              </div>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 lg:gap-3">
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs lg:text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <button type="submit" disabled={loading || !credential.trim()}
            className="w-full py-3.5 lg:py-5 rounded-xl lg:rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black uppercase text-[10px] lg:text-xs tracking-widest hover:from-amber-600 hover:to-orange-700 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 lg:gap-3 group">
            {loading ? (
              <span className="flex items-center gap-1.5 lg:gap-2"><LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4 animate-spin" /> Signing in...</span>
            ) : (
              <span className="flex items-center gap-1.5 lg:gap-2"><LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Sign In to Dashboard <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>

          <div className="text-center pt-1 lg:pt-2">
            <p className="text-[9px] lg:text-[10px] text-text-muted font-medium flex items-center justify-center gap-1.5 lg:gap-2">
              <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-amber-500" />
              Don&apos;t have an account? Join VIP on the homepage
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
