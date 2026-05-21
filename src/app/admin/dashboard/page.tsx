"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings as SettingsIcon,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  User,
  Search,
  Bell,
  Sun,
  Moon,
  Coins,
  Crown,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import Tabs
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import SettingsTab from "./tabs/SettingsTab";
import ReviewsTab from "./tabs/ReviewsTab";
import FAQTab from "./tabs/FAQTab";
import CurrencyTab from "./tabs/CurrencyTab";
import VIPPlansTab from "./tabs/VIPPlansTab";
import VIPMembersTab from "./tabs/VIPMembersTab";
import FlashOffersTab from "./tabs/FlashOffersTab";
import AffiliatesTab from "./tabs/AffiliatesTab";
import { Toaster } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  const tabs = [
    { id: "orders", label: "Orders", icon: ShoppingBag, color: "text-primary", gradient: "from-primary/20 to-transparent" },
    { id: "vip-plans", label: "VIP Plans", icon: Crown, color: "text-amber-500", gradient: "from-amber-500/20 to-transparent" },
    { id: "vip-members", label: "VIP Members", icon: Shield, color: "text-amber-500", gradient: "from-amber-500/20 to-transparent" },
    { id: "products", label: "Products", icon: Package, color: "text-secondary", gradient: "from-secondary/20 to-transparent" },
    { id: "flash-offers", label: "Flash Offers", icon: Clock, color: "text-amber-400", gradient: "from-amber-400/20 to-transparent" },
    { id: "affiliates", label: "Affiliates", icon: Users, color: "text-primary", gradient: "from-primary/20 to-transparent" },
    { id: "currency", label: "Currency", icon: Coins, color: "text-amber-500", gradient: "from-amber-500/20 to-transparent" },
    { id: "reviews", label: "Reviews", icon: MessageSquare, color: "text-success", gradient: "from-success/20 to-transparent" },
    { id: "faq", label: "FAQ", icon: HelpCircle, color: "text-warning", gradient: "from-warning/20 to-transparent" },
    { id: "settings", label: "Settings", icon: SettingsIcon, color: "text-info", gradient: "from-info/20 to-transparent" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex text-text-primary">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto w-72 lg:w-72 flex flex-col bg-gradient-to-b from-[#05091D] via-[#020617] to-[#05091D] border-r border-white/5 min-h-screen flex-shrink-0 transition-all duration-300 ease-out lg:transition-none shadow-2xl shadow-black/50`}>
        <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="w-9 h-9 lg:w-11 lg:h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl lg:rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/30 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <LayoutDashboard className="w-5 h-5 lg:w-6 lg:h-6 text-white relative z-10" />
          </div>
          <div>
            <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-lg lg:text-xl font-black tracking-tighter">
              PRO<span className="text-primary">ADMIN</span>
            </motion.h1>
            <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-[3px] text-text-muted">Control Panel v2.0</p>
          </div>
        </div>

        <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => { setActiveTab(tab.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 lg:p-3.5 rounded-xl lg:rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive ? "bg-white/5 text-white shadow-lg border border-white/10" : "text-text-muted hover:bg-white/[0.02] hover:text-text-primary border border-transparent hover:border-white/5"}`}
              >
                {isActive && (
                  <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl" />
                )}
                <div className={`relative z-10 w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? "bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20 scale-110" : "bg-white/5 text-text-muted group-hover:scale-105"}`}>
                  <Icon className={`w-4 h-4 lg:w-[18px] lg:h-[18px] transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                </div>
                <div className="relative z-10 flex-1 text-left">
                  <span className={`font-black text-[10px] lg:text-xs uppercase tracking-widest block ${isActive ? "text-white" : ""}`}>{tab.label}</span>
                  {isActive && (
                    <span className="text-[6px] text-primary font-black uppercase tracking-[3px]">Active</span>
                  )}
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-2 lg:p-4 mt-auto border-t border-white/5 bg-gradient-to-t from-red-500/5 to-transparent">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 lg:p-3.5 rounded-xl lg:rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] lg:text-xs tracking-widest group border border-transparent hover:border-red-500/20">
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
              <LogOut className="w-4 h-4 lg:w-[18px] lg:h-[18px] group-hover:scale-110 transition-transform" />
            </div>
            <span className="group-hover:text-red-300 transition-colors">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#020617]">
        <header className="h-14 lg:h-20 bg-[#020617]/80 border-b border-white/5 px-3 lg:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-9 h-9 lg:w-10 lg:h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 hover:border-primary/30">
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex -space-x-1.5">
                {tabs.slice(0, 5).map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center transition-all border ${activeTab === tab.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110 z-10" : "bg-white/5 text-text-muted border-white/5 hover:border-white/10"}`}>
                      <TabIcon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="bg-white/[0.02] border border-white/5 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 w-56 xl:w-72 transition-all placeholder:text-text-muted/30" />
            </div>

            <button className="hidden lg:flex w-9 h-9 rounded-xl bg-white/5 items-center justify-center hover:bg-white/10 transition-all border border-white/5">
              <Bell className="w-4 h-4 text-text-muted" />
            </button>

            <div className="hidden lg:block h-8 w-px bg-white/5" />

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs lg:text-sm font-black tracking-tighter">Admin</p>
                <p className="text-[7px] lg:text-[8px] text-primary font-black uppercase tracking-[3px]">Super Admin</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/10 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/10">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 lg:p-8 bg-gradient-to-b from-[#020617] via-[#030B1A] to-[#020617]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-[1600px] mx-auto"
            >
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "vip-plans" && <VIPPlansTab />}
              {activeTab === "vip-members" && <VIPMembersTab />}
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "flash-offers" && <FlashOffersTab />}
              {activeTab === "affiliates" && <AffiliatesTab />}
              {activeTab === "currency" && <CurrencyTab />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "faq" && <FAQTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }
      }} />
    </div>
  );
}
