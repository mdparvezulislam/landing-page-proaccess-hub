"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Home, Package, LayoutDashboard, Menu, Zap, Shield } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "VIP", href: "/#vip", icon: Crown },
  { label: "Products", href: "/#products", icon: Package },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "VIP Access", href: "/#vip", icon: Shield, highlight: true },
];

export default function BottomBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/affiliate")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[140] lg:hidden">
      <div className="bg-[#020617]/95 backdrop-blur-2xl border-t border-white/5 shadow-2xl shadow-black/50">
        <nav className="flex items-center justify-around px-2 py-1.5 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.replace("/#", "/"));

            if (item.highlight) {
              return (
                <Link key={item.label} href={item.href}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 -mt-4 border border-amber-400/30">
                  <Icon className="w-5 h-5" />
                  <span className="text-[6px] font-black uppercase tracking-widest">Access</span>
                </Link>
              );
            }

            return (
              <Link key={item.label} href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all relative ${isActive ? "text-primary" : "text-text-muted hover:text-text-primary"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
