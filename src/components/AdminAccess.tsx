"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import { Lock, X } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAccess = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState('');
  const navigate = useRouter();
  const { setAdminStatus } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'pro_access_23') {
      setAdminStatus(true);
      setIsOpen(false);
      setKey('');
      navigate.push('/admin/dashboard');
      toast.success('Access Granted');
    } else {
      toast.error('Invalid Access Key');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-card rounded-3xl p-8 premium-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Admin Access</h2>
              <p className="text-text-secondary mt-2">Enter secret access key to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter Access Key"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl transition-all glow-btn"
              >
                Access Dashboard
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
