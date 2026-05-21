"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles, Gift, AlertTriangle, Zap, ArrowRight, Users } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useActiveFlashOffers } from "@/hooks/useFlashOffers";
import { useStore } from "@/store/useStore";

const POPUP_SEEN_KEY = "flash-popup-dismissed-v2";

export default function FlashOfferPopup() {
  const { data: activeOffers } = useActiveFlashOffers();
  const [dismissed, setDismissed] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { language } = useStore();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const seen = localStorage.getItem(POPUP_SEEN_KEY);
    if (seen) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
  }, [mounted]);

  const popupOffer = (activeOffers || []).find((o: any) =>
    !o.expired && o.visible && o.stickyEnabled
  ) || (activeOffers && activeOffers.length > 0 ? activeOffers[0] : null);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(POPUP_SEEN_KEY, "true");
    setTimeout(() => setShowPopup(false), 200);
  }, []);

  useEffect(() => {
    if (!dismissed && popupOffer && mounted) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowPopup(false);
    }
  }, [dismissed, popupOffer, mounted]);

  if (!mounted || !popupOffer || showPopup === false) return null;

  const t = (en: string, bn: string) => language === "en" ? en : bn;

  const showSlots = popupOffer.slotSystemEnabled && popupOffer.totalSlots > 0;
  const slotsLeft = showSlots ? Math.max(0, popupOffer.remainingSlots) : 0;

  return (
    <AnimatePresence>
      {showPopup && !dismissed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-[#0A0F2C] via-[#020617] to-[#0A0F2C] rounded-[40px] border border-amber-500/20 shadow-2xl shadow-amber-500/10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

            <button onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 p-8 lg:p-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">
                  {t(
                    popupOffer.badgeTextEn || "Limited Time Offer",
                    popupOffer.badgeTextBn || "সীমিত সময়ের অফার"
                  )}
                </span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-amber-400" />
              </div>

              <h3 className="text-2xl lg:text-3xl font-black tracking-tighter text-white mb-2">
                {t(popupOffer.titleEn, popupOffer.titleBn)}
              </h3>

              {popupOffer.subtitleEn && (
                <p className="text-sm text-text-muted font-medium mb-1">
                  {t(popupOffer.subtitleEn, popupOffer.subtitleBn)}
                </p>
              )}
              {popupOffer.descriptionEn && (
                <p className="text-xs text-text-muted/70 max-w-sm mx-auto mb-6">
                  {t(popupOffer.descriptionEn, popupOffer.descriptionBn)}
                </p>
              )}

              {popupOffer.countdownEnabled && (
                <div className="mb-6">
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5 justify-center">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    {t("Offer Ends In", "অফার শেষ হবে")}
                  </p>
                  <div className="flex justify-center">
                    <CountdownTimer endDate={popupOffer.endDate} size="md" />
                  </div>
                </div>
              )}

              {showSlots && slotsLeft <= 5 && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 mb-6 mx-auto max-w-[200px]">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-xs font-black text-red-400">
                    {t(
                      slotsLeft <= 1 ? `Only ${slotsLeft} Slot Left!` : `Only ${slotsLeft} Slots Left!`,
                      slotsLeft <= 1 ? `মাত্র ${slotsLeft}টি স্লট বাকি!` : `মাত্র ${slotsLeft}টি স্লট বাকি!`
                    )}
                  </span>
                </div>
              )}

              {popupOffer.redirectLink && (
                <a href={popupOffer.redirectLink}
                  onClick={handleDismiss}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-black uppercase tracking-widest hover:from-amber-600 hover:to-yellow-700 transition-all shadow-xl shadow-amber-500/20 group">
                  {t(popupOffer.buttonTextEn || "Claim Offer", popupOffer.buttonTextBn || "অফার নিন")}
                  <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}

              <p className="mt-6 text-[8px] text-text-muted/40 font-bold uppercase tracking-widest">
                {t("This offer won't show again", "এই অফার আবার দেখানো হবে না")}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
