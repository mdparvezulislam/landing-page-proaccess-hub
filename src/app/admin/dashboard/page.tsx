"use client";

import React, { useState } from "react";
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
  Bell,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Import Tabs
import OrdersTab from "./tabs/OrdersTab";
import ProductsTab from "./tabs/ProductsTab";
import SettingsTab from "./tabs/SettingsTab";
import ReviewsTab from "./tabs/ReviewsTab";
import FAQTab from "./tabs/FAQTab";
import { Toaster } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Admin session is validated by middleware and cookie; client-side hooks removed.
  const router = useRouter();

  const tabs = [
    { id: "orders", label: "Orders", icon: ShoppingBag, color: "text-primary" },
    {
      id: "products",
      label: "Products",
      icon: Package,
      color: "text-secondary",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      color: "text-success",
    },
    { id: "faq", label: "FAQ", icon: HelpCircle, color: "text-warning" },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      color: "text-info",
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex text-text-primary">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-80" : "w-24"} bg-white/[0.02] border-r border-white/5 transition-all duration-500 flex flex-col relative z-50`}
      >
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-tighter"
            >
              PRO<span className="text-primary">ADMIN</span>
            </motion.h1>
          )}
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${isActive
                    ? "bg-white/5 text-white shadow-xl border border-white/10"
                    : "text-text-muted hover:bg-white/[0.02] hover:text-text-primary"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive
                      ? "bg-primary text-white"
                      : "bg-white/5 text-text-muted group-hover:text-text-primary"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSidebarOpen && (
                  <span className="font-black text-sm uppercase tracking-widest flex-1 text-left">
                    {tab.label}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 text-primary" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/5 transition-all font-black uppercase text-xs tracking-widest"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white/[0.01] border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Global Search..."
                className="bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all"
              />
            </div>

            <div className="h-10 w-px bg-white/5 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black tracking-tighter">
                  Admin User
                </p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                  Master Control
                </p>
              </div>
              <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden p-1">
                <div className="w-full h-full bg-primary/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#020617]">
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
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "faq" && <FAQTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }} />
    </div>
  );
}
