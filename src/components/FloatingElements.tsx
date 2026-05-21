"use client";
import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { Send } from "lucide-react";

export const FloatingElements = ({ data }: { data: any }) => {
  const { language } = useStore();
  const settings = data?.site || {};

  const t = (en: string, bn: string) => (language === "en" ? en : bn);

  return (
    <div className="hidden lg:block">
      {/* Floating Telegram Support */}
      <div className="fixed bottom-28 left-6 lg:left-8 z-[150]">
        <motion.a
          href={settings.telegramLink}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-[20px] bg-[#0088cc] text-white flex items-center justify-center shadow-2xl border border-white/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Send className="w-7 h-7 relative z-10" />
          <div className="absolute left-full ml-4 px-4 py-2 bg-white text-bg-dark text-[9px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none shadow-2xl uppercase tracking-[2px] border border-white/20">
            {t("Join VIP Chat", "ভিআইপি চ্যাট")}
          </div>
        </motion.a>
      </div>
    </div>
  );
};
