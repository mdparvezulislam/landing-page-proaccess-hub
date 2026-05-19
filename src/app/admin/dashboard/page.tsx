"use client";

import React, { useState, useEffect } from "react";
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
import { Toaster } from "sonner";
import { Coins, Crown, Shield, Clock } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && window.innerWidth >= 1024) setIsSidebarOpen(true);
  }, [mounted]);

  const tabs = [
    { id: "orders", label: "Orders", icon: ShoppingBag, color: "text-primary" },
    { id: "vip-plans", label: "VIP Plans", icon: Crown, color: "text-amber-500" },
    { id: "vip-members", label: "VIP Members", icon: Shield, color: "text-amber-500" },
    { id: "products", label: "Products", icon: Package, color: "text-secondary" },
    { id: "flash-offers", label: "Flash Offers", icon: Clock, color: "text-amber-400" },
    { id: "currency", label: "Currency", icon: Coins, color: "text-amber-500" },
    { id: "reviews", label: "Reviews", icon: MessageSquare, color: "text-success" },
    { id: "faq", label: "FAQ", icon: HelpCircle, color: "text-warning" },
    { id: "settings", label: "Settings", icon: SettingsIcon, color: "text-info" },
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
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto w-80 lg:w-80 flex flex-col bg-white/[0.02] border-r border-white/5 min-h-screen flex-shrink-0 transition-transform duration-300 lg:transition-none`}>
        <div className="p-3 lg:p-8 flex items-center gap-3 lg:gap-4 border-b border-white/5">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base lg:text-xl font-black tracking-tighter">
            PRO<span className="text-primary">ADMIN</span>
          </motion.h1>
        </div>

        <nav className="flex-1 p-2 lg:p-6 space-y-1 lg:space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-4 rounded-xl lg:rounded-2xl transition-all group ${isActive ? "bg-white/5 text-white shadow-xl border border-white/10" : "text-text-muted hover:bg-white/[0.02] hover:text-text-primary"}`}
              >
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-primary text-white" : "bg-white/5 text-text-muted group-hover:text-text-primary"}`}>
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <span className="font-black text-[10px] lg:text-sm uppercase tracking-widest flex-1 text-left">{tab.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="p-2 lg:p-6 mt-auto">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 lg:gap-4 p-2.5 lg:p-4 rounded-xl lg:rounded-2xl text-red-500 hover:bg-red-500/5 transition-all font-black uppercase text-[10px] lg:text-xs tracking-widest">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/10 rounded-lg lg:rounded-xl flex items-center justify-center">
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-14 lg:h-24 bg-white/[0.01] border-b border-white/5 px-3 lg:px-10 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-9 h-9 lg:w-12 lg:h-12 bg-white/5 rounded-lg lg:rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
            {isSidebarOpen ? <X className="w-3.5 h-3.5 lg:w-5 lg:h-5" /> : <Menu className="w-3.5 h-3.5 lg:w-5 lg:h-5" />}
          </button>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="text" placeholder="Global Search..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all" />
            </div>

            <div className="hidden lg:block h-10 w-px bg-white/5 mx-2" />

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[11px] lg:text-sm font-black tracking-tighter">Admin User</p>
                <p className="text-[8px] lg:text-[10px] text-primary font-black uppercase tracking-widest">Master Control</p>
              </div>
              <div className="w-9 h-9 lg:w-12 lg:h-12 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden p-0.5 lg:p-1">
                <div className="w-full h-full bg-primary/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 lg:p-10 bg-[#020617]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-[1600px] mx-auto"
            >
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "vip-plans" && <VIPPlansTab />}
              {activeTab === "vip-members" && <VIPMembersTab />}
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "flash-offers" && <FlashOffersTab />}
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
