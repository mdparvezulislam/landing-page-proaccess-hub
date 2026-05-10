'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid credentials');
      } else {
        toast.success('Login successful');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="glass-card p-10 rounded-[40px] border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">Admin Access</h1>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">Secure Portal Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@proaccess.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-2xl font-black text-sm transition-all glow-btn shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] font-black text-text-muted uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}
