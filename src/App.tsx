/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';
import { initPixel, trackPageView } from './utils/facebookPixel';

// Pages & Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AdminAccess } from './components/AdminAccess';
import { FloatingElements } from './components/FloatingElements';
import { AdminDashboard } from './pages/AdminDashboard';
import { LandingPage } from './pages/LandingPage';
import { CheckoutPage } from './pages/CheckoutPage';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, setAdminStatus } = useStore();
  const [inputKey, setInputKey] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === 'pro_access_23') {
      setAdminStatus(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />

        <div className="w-full max-w-md relative z-10">
          <div className="glass-card rounded-[32px] p-8 md:p-10 border-white/10 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-black text-xl">A</div>
            </div>

            <h1 className="text-3xl font-black text-text-primary mb-3">Admin Access</h1>
            <p className="text-text-secondary text-sm mb-8 px-4">
              Enter the secret access key to unlock the command center and manage your platform.
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative group">
                <input
                  type="password"
                  placeholder="Secret Access Key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-center text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal`}
                />
                {error && <p className="absolute -bottom-6 left-0 w-full text-xs text-red-500 font-bold animate-shake">Incorrect Secret Key</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white font-black py-4 rounded-2xl transition-all glow-btn shadow-xl active:scale-95"
              >
                Authorize System
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default function App() {
  const { pixelSettings } = useStore();

  useEffect(() => {
    if (pixelSettings.enabled && pixelSettings.pixelId) {
      initPixel(pixelSettings.pixelId);
    }
  }, [pixelSettings.enabled, pixelSettings.pixelId]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" theme="dark" richColors />
      <AdminAccess />
      <FloatingElements />

      <div className="min-h-screen bg-bg-dark text-text-primary selection:bg-primary selection:text-white font-sans relative overflow-x-hidden">

        <Header />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />

        {/* Background Atmosphere */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full" />
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-primary-light/5 blur-[120px] rounded-full" />
        </div>
      </div>
    </Router>
  );
}

