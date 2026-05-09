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
  const { isAdmin } = useStore();
  if (!isAdmin) return <Navigate to="/" replace />;
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

