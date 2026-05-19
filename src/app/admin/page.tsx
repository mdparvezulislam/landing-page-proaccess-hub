"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        if (res.ok) {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Auth check failed");
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Invalid credentials");
      } else {
        toast.success("Login successful");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-float" />
        <div
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-4 lg:p-8 relative z-10"
      >
        <div className="glass-card p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] border-white/10 shadow-2xl">
          <div className="text-center mb-6 lg:mb-10">
            <div className="w-14 h-14 lg:w-20 lg:h-20 bg-primary/20 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 border border-primary/30">
              <ShieldCheck className="w-7 h-7 lg:w-10 lg:h-10 text-primary" />
            </div>
            <h1 className="text-xl lg:text-3xl font-black tracking-tighter mb-1 lg:mb-2">
              Admin Access
            </h1>
            <p className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[2px] lg:tracking-[3px]">
              Secure Portal Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[1px] lg:tracking-[2px] ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@proaccess.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl pl-11 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-4 text-[11px] lg:text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold transition-all" required />
              </div>
            </div>

            <div className="space-y-1.5 lg:space-y-2">
              <label className="text-[9px] lg:text-[10px] font-black text-text-muted uppercase tracking-[1px] lg:tracking-[2px] ml-1">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-text-muted" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl pl-11 lg:pl-14 pr-4 lg:pr-6 py-3 lg:py-4 text-[11px] lg:text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold transition-all" required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-[11px] lg:text-sm transition-all glow-btn shadow-xl shadow-primary/20 flex items-center justify-center gap-2 lg:gap-3 mt-3 lg:mt-4">
              {loading ? "Verifying..." : "Access Dashboard"}
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[9px] lg:mt-8 lg:text-[10px] font-black text-text-muted uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
}
