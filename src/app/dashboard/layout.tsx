'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVIPAuth } from '@/hooks/useVIPAuth';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, CreditCard, History, Bell, LogOut, Crown,
  Menu, X, User, ChevronRight, Shield
} from 'lucide-react';
import { Toaster } from 'sonner';

const navItems = [
  { id: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: '/dashboard/payments', label: 'Payments', icon: CreditCard },
  { id: '/dashboard/history', label: 'History', icon: History },
  { id: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, logout } = useVIPAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && window.innerWidth >= 1024) setSidebarOpen(true);
  }, [mounted]);

  useEffect(() => {
    if (!loading && !session && mounted && pathname !== '/dashboard/login') {
      window.location.href = '/dashboard/login';
    }
  }, [loading, session, mounted, pathname]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center animate-pulse">
          <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/dashboard/login';
  };

  return (
    <div className="min-h-screen bg-bg-dark flex text-text-primary">
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }
      }} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto w-72 lg:w-72 lg:transition-all lg:duration-500 flex flex-col bg-white/[0.02] border-r border-white/5 min-h-screen flex-shrink-0`}>
        <div className="p-3 lg:p-6 flex items-center gap-3 lg:gap-4 border-b border-white/5">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
            <Crown className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs lg:text-sm font-black tracking-tight leading-tight">VIP Portal</p>
            <p className="text-[7px] lg:text-[8px] text-amber-500 font-black uppercase tracking-widest">Member Dashboard</p>
          </motion.div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { router.push(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-3.5 rounded-xl lg:rounded-2xl transition-all group ${isActive ? 'bg-amber-500/10 text-white border border-amber-500/20 shadow-lg' : 'text-text-muted hover:bg-white/[0.02] hover:text-text-primary'}`}
              >
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-amber-500 text-white' : 'bg-white/5 text-text-muted group-hover:text-white'}`}>
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </div>
                <span className="font-black text-[10px] lg:text-xs uppercase tracking-widest flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-amber-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-2 lg:p-4 space-y-1 lg:space-y-2 border-t border-white/5">
          <div className="p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] lg:text-xs font-black truncate">{session.userName}</p>
                <p className="text-[7px] lg:text-[8px] text-text-muted font-bold uppercase tracking-widest truncate">{session.membershipId}</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-3.5 rounded-xl lg:rounded-2xl text-red-500 hover:bg-red-500/5 transition-all font-black text-[10px] lg:text-xs uppercase tracking-widest">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 lg:h-20 bg-white/[0.01] border-b border-white/5 px-3 lg:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
            {sidebarOpen ? <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> : <Menu className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
          </button>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Shield className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-amber-500" />
              <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-amber-500 capitalize">{session.status}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 lg:p-10 bg-[#020617]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
