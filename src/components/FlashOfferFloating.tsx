"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Zap, ArrowRight } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useStore } from "@/store/useStore";

interface FloatingOffer {
  _id: string;
  titleEn: string;
  titleBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
  redirectLink: string;
  badgeTextEn: string;
  badgeTextBn: string;
  endDate: string | Date;
  expired: boolean;
  stickyEnabled: boolean;
  countdownEnabled: boolean;
}

interface FlashOfferFloatingProps {
  offers: FloatingOffer[];
}

export default function FlashOfferFloating({ offers }: FlashOfferFloatingProps) {
  const { language } = useStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const stickyOffers = (offers || []).filter(
    (o) => o.stickyEnabled && !o.expired && !dismissed.has(o._id)
  );

  if (!mounted || stickyOffers.length === 0) return null;

  const t = (en: string, bn: string) => language === "en" ? en : bn;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] pointer-events-none">
      <AnimatePresence>
        {stickyOffers.map((offer) => (
          <motion.div
            key={offer._id}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="pointer-events-auto mx-auto max-w-4xl px-4 pb-4"
          >
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">
                      {t(offer.badgeTextEn, offer.badgeTextBn)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[200px]">
                    {t(offer.titleEn, offer.titleBn)}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {offer.countdownEnabled && (
                    <CountdownTimer endDate={offer.endDate} compact size="sm" />
                  )}
                  {offer.redirectLink && (
                    <a
                      href={offer.redirectLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-[9px] font-black uppercase tracking-widest hover:from-amber-600 hover:to-yellow-700 transition-all shrink-0"
                    >
                      <span className="hidden sm:inline">{t(offer.buttonTextEn, offer.buttonTextBn)}</span>
                      <Zap className="w-3 h-3 sm:ml-1" />
                    </a>
                  )}
                  <button
                    onClick={() => setDismissed((prev) => new Set(prev).add(offer._id))}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
