"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Zap, Sparkles, Gift, ArrowRight, Users, AlertTriangle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useStore } from "@/store/useStore";

interface FlashOfferData {
  _id?: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
  redirectLink: string;
  badgeTextEn: string;
  badgeTextBn: string;
  endDate: string | Date;
  expired: boolean;
  slotSystemEnabled: boolean;
  totalSlots: number;
  remainingSlots: number;
  countdownEnabled: boolean;
}

interface FlashOfferBannerProps {
  offer: FlashOfferData;
  variant?: "default" | "compact" | "hero" | "floating";
  className?: string;
}

export default function FlashOfferBanner({ offer, variant = "default", className }: FlashOfferBannerProps) {
  const { language } = useStore();

  const t = (en: string, bn: string) => language === "en" ? en : bn;

  if (offer.expired) return null;

  const slotsLeft = offer.slotSystemEnabled ? Math.max(0, offer.remainingSlots) : 0;
  const showSlots = offer.slotSystemEnabled && offer.totalSlots > 0;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 p-4 ${className || ""}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">
              {t(offer.badgeTextEn, offer.badgeTextBn)}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white text-center sm:text-left">
            {t(offer.titleEn, offer.titleBn)}
          </span>
          {offer.countdownEnabled && (
            <CountdownTimer endDate={offer.endDate} compact size="sm" />
          )}
          {showSlots && slotsLeft <= 3 && (
            <div className="flex items-center gap-1.5 text-xs font-black text-red-400 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              {t(`Only ${slotsLeft} Left`, `মাত্র ${slotsLeft} বাকি`)}
            </div>
          )}
          {offer.redirectLink && (
            <a
              href={offer.redirectLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shrink-0"
            >
              {t(offer.buttonTextEn, offer.buttonTextBn)}
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </motion.div>
    );
  }

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-[32px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 p-6 sm:p-8 ${className || ""}`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[8px] font-black uppercase tracking-widest text-amber-400">
                {t(offer.badgeTextEn, offer.badgeTextBn)}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-white mb-2">
              {t(offer.titleEn, offer.titleBn)}
            </h3>
            {offer.subtitleEn && (
              <p className="text-sm sm:text-base text-text-muted font-medium">
                {t(offer.subtitleEn, offer.subtitleBn)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            {offer.countdownEnabled && (
              <CountdownTimer endDate={offer.endDate} size="md" />
            )}
            <div className="flex items-center gap-3">
              {offer.redirectLink && (
                <a
                  href={offer.redirectLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-black uppercase tracking-widest hover:from-amber-600 hover:to-yellow-700 transition-all shadow-xl shadow-amber-500/20"
                >
                  {t(offer.buttonTextEn, offer.buttonTextBn)}
                  <Zap className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[28px] sm:rounded-[40px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 shadow-2xl shadow-amber-500/5 p-6 sm:p-8 lg:p-10 ${className || ""}`}
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 shadow-lg">
              <Gift className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                {t(offer.badgeTextEn, offer.badgeTextBn)}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-white mb-2">
              {t(offer.titleEn, offer.titleBn)}
            </h3>
            {offer.subtitleEn && (
              <p className="text-sm text-text-muted font-medium max-w-xl">
                {t(offer.subtitleEn, offer.subtitleBn)}
              </p>
            )}
            {offer.descriptionEn && (
              <p className="text-xs text-text-muted/70 mt-1 max-w-xl">
                {t(offer.descriptionEn, offer.descriptionBn)}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {offer.countdownEnabled && (
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5 justify-center">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  {t("Offer Ends In", "অফার শেষ হবে")}
                </p>
                <CountdownTimer endDate={offer.endDate} size="md" />
              </div>
            )}

            {showSlots && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <Users className="w-4 h-4 text-red-400" />
                <span className="text-xs font-black text-red-400">
                  {t(
                    slotsLeft <= 1
                      ? `Only ${slotsLeft} Slot Left!`
                      : `Only ${slotsLeft} Slots Left!`,
                    slotsLeft <= 1
                      ? `মাত্র ${slotsLeft}টি স্লট বাকি!`
                      : `মাত্র ${slotsLeft}টি স্লট বাকি!`
                  )}
                </span>
              </div>
            )}

            {offer.redirectLink && (
              <a
                href={offer.redirectLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-black uppercase tracking-widest hover:from-amber-600 hover:to-yellow-700 transition-all shadow-xl shadow-amber-500/20 group"
              >
                {t(offer.buttonTextEn, offer.buttonTextBn)}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
