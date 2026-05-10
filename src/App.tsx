import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Stats } from './sections/Stats';
import { ProductShowcase } from './sections/ProductShowcase';
import { Features } from './sections/Features';
import { TrustBadges } from './sections/TrustBadges';
import { Pricing } from './sections/Pricing';
import { ReviewsSection } from './sections/ReviewsSection';
import { FAQSection } from './sections/FAQSection';
import { CountdownBanner } from './sections/CountdownBanner';
import { TelegramCTA } from './sections/TelegramCTA';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';
import { Loader } from './components/Loader';
import { AnimatePresence, motion } from 'motion/react';
import { FloatingElements } from './components/FloatingElements';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const LandingPage = () => {
  const { countdown } = useStore();
  return (
    <>
      {countdown.enabled && <CountdownBanner />}
      <Hero />
      <Stats />
      <ProductShowcase />
      <Features />
      <TrustBadges />
      <Pricing />
      <ReviewsSection />
      <FAQSection />
      <TelegramCTA />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-text-primary selection:bg-primary/30 premium-scrollbar">
        <Toaster position="top-right" theme="dark" richColors />
        <ScrollToTop />
        <FloatingElements />

        <AnimatePresence>
          {loading && <Loader />}
        </AnimatePresence>

        <Header />

        <PageTransition>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </PageTransition>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
