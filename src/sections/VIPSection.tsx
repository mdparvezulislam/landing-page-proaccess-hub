"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  BadgeCheck,
  Globe,
  X,
  Tag,
  Gem,
  Star,
  Percent,
  Rocket,
} from "lucide-react";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useVIPPlans, useVIPStats } from "@/hooks/useVIP";

export default function VIPSection() {
  const { data: plans } = useVIPPlans() as any;
  const { data: stats } = useVIPStats();
  const { currentCurrency } = useCurrencyStore();

  const plan = (plans as any[])?.find(
    (p: any) => p.featured && p.visible,
  ) as any;

  const [showCheckout, setShowCheckout] = useState(false);
  const [pricingTrack, setPricingTrack] = useState<"official" | "starter">(
    "official",
  );
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  if (!plan) return null;

  const symbol = currentCurrency === "BDT" ? "BDT" : "USDT";
  const hasDiscount = plan.enableDiscount && plan.discountPercent > 0;
  const starterHasDiscount =
    plan.starterEnableDiscount && (plan.starterDiscountPercent ?? 0) > 0;

  const prices = {
    official: {
      price:
        currentCurrency === "BDT"
          ? plan.officialPriceBDT
          : plan.officialPriceUSDT,
      starter:
        currentCurrency === "BDT"
          ? plan.officialStarterBDT
          : plan.officialStarterUSDT,
      monthly:
        currentCurrency === "BDT"
          ? plan.officialMonthlyBDT
          : plan.officialMonthlyUSDT,
      discount:
        currentCurrency === "BDT"
          ? plan.discountPriceBDT
          : plan.discountPriceUSDT,
    },
    starter: {
      official:
        currentCurrency === "BDT"
          ? (plan.starterOfficialBDT ?? plan.officialPriceBDT)
          : (plan.starterOfficialUSDT ?? plan.officialPriceUSDT),
      price:
        currentCurrency === "BDT"
          ? (plan.starterPriceBDT ?? plan.starterMonthlyBDT)
          : (plan.starterPriceUSDT ?? plan.starterMonthlyUSDT),
      monthly:
        currentCurrency === "BDT"
          ? (plan.starterMonthlyBDT ?? 399)
          : (plan.starterMonthlyUSDT ?? 3),
      discount:
        currentCurrency === "BDT"
          ? (plan.starterDiscountPriceBDT ?? plan.discountPriceBDT)
          : (plan.starterDiscountPriceUSDT ?? plan.discountPriceUSDT),
    },
  };

  const isOfficial = pricingTrack === "official";

  const visibleBullets = ((plan.bulletPoints || []) as any[])
    .filter((b: any) => b.visible)
    .sort((a: any, b: any) => a.order - b.order);
  const visibleHighlights = ((plan.keyHighlights || []) as any[])
    .filter((h: any) => h.visible)
    .sort((a: any, b: any) => a.order - b.order);
  const visibleNotices = ((plan.notices || []) as any[]).filter(
    (n: any) => n.visible,
  );
  const visibleFAQs = ((plan.faqs || []) as any[])
    .filter((f: any) => f.visible)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <>
      <section id="vip" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-500/10 blur-[250px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <Crown className="w-5 h-5 text-blue-400" />
              <span className="text-white font-black uppercase text-[10px] tracking-[3px]">
                {plan.badgeEn || "VIP MEMBERSHIP"}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-3">
              {plan.titleEn}
            </h2>
            {plan.subtitleEn && (
              <p className="text-lg md:text-xl text-text-muted max-w-3xl mx-auto font-medium">
                {plan.subtitleEn}
              </p>
            )}
          </motion.div>

          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-8 mb-8"
            >
              <div className="text-center">
                <p className="text-3xl font-black text-blue-500">
                  {stats.activeMembers}+
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Active Members
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-blue-500">
                  {stats.totalPayments}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Payments
                </p>
              </div>
            </motion.div>
          )}

          {/* Track Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex p-1 bg-white/5 rounded-2xl border border-white/10">
              <button
                onClick={() => setPricingTrack("official")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${pricingTrack === "official" ? "bg-blue-500 text-white shadow-lg" : "text-text-muted hover:text-white"}`}
              >
                <Crown className="w-4 h-4" /> Official Plan
              </button>
              <button
                onClick={() => setPricingTrack("starter")}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${pricingTrack === "starter" ? "bg-blue-500 text-white shadow-lg" : "text-text-muted hover:text-white"}`}
              >
                <Rocket className="w-4 h-4" /> Starter Plan
              </button>
            </div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto mb-12"
          >
            <div
              className={`p-8 rounded-[40px] border-2 transition-all duration-500 relative ${isOfficial ? "bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/40 shadow-2xl shadow-blue-500/10" : "bg-white/[0.03] border-white/10"}`}
            >
              {isOfficial && hasDiscount && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" /> {plan.discountPercent}%
                  OFF
                </div>
              )}

              <div className="text-center mb-6">
                {/* Official Section */}
                {isOfficial && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-3">
                      <span className="text-sm font-bold text-blue-500 flex items-center gap-2">
                        <Crown className="w-4 h-4" /> Official Price
                      </span>
                      <span className="text-3xl font-black text-white">
                        {prices.official.price?.toLocaleString()}{" "}
                        <span className="text-base text-blue-500">
                          {symbol}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-3">
                      <span className="text-sm font-bold text-text-muted flex items-center gap-2">
                        <Star className="w-4 h-4 text-blue-500" /> Start With
                      </span>
                      <span className="text-xl font-black text-white">
                        {prices.official.starter?.toLocaleString()} {symbol}
                      </span>
                    </div>

                    {plan.enableInstallments && (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-3">
                        <span className="text-sm font-bold text-text-muted flex items-center gap-2">
                          <Gem className="w-4 h-4 text-blue-500" /> Then
                          Monthly
                        </span>
                        <span className="text-xl font-black text-white">
                          {prices.official.monthly?.toLocaleString()} {symbol}
                        </span>
                      </div>
                    )}

                    {hasDiscount && (
                      <>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-500/30 mb-3">
                          <span className="text-sm font-bold text-blue-500 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Current{" "}
                            {plan.discountPercent}% OFF
                          </span>
                          <span className="text-2xl font-black text-blue-500">
                            {prices.official.discount?.toLocaleString()}{" "}
                            {symbol}
                          </span>
                        </div>

                        {prices.official.discount && (
                          <div className="p-3 rounded-2xl bg-success/10 border border-success/20">
                            <p className="text-success text-xs font-bold flex items-center justify-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              You Save{" "}
                              {(
                                prices.official.price - prices.official.discount
                              )?.toLocaleString()}{" "}
                              {symbol}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* Starter Section */}
                {!isOfficial && (
                  <>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-3">
                      <span className="text-sm font-bold text-white/60 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-white/40" /> Official
                        Price
                      </span>
                      <span className="text-2xl font-black text-white">
                        {prices.starter.official?.toLocaleString()}{" "}
                        <span className="text-sm text-white/40">{symbol}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-3">
                      <span className="text-sm font-bold text-text-muted flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-500" /> Starter
                        Price
                      </span>
                      <span className="text-3xl font-black text-white">
                        {prices.starter.price?.toLocaleString()}{" "}
                        <span className="text-base text-white/40">
                          {symbol}
                        </span>
                      </span>
                    </div>

                    {plan.enableInstallments && (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-3">
                        <span className="text-sm font-bold text-text-muted flex items-center gap-2">
                          <Gem className="w-4 h-4 text-blue-500" /> Then
                          Monthly
                        </span>
                        <span className="text-xl font-black text-white">
                          {prices.starter.monthly?.toLocaleString()} {symbol}
                        </span>
                      </div>
                    )}

                    {starterHasDiscount && (
                      <>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-500/30 mb-3">
                          <span className="text-sm font-bold text-blue-500 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Current{" "}
                            {plan.starterDiscountPercent}% OFF
                          </span>
                          <span className="text-2xl font-black text-blue-500">
                            {prices.starter.discount?.toLocaleString()} {symbol}
                          </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-success/10 border border-success/20">
                          <p className="text-success text-xs font-bold flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            You Save{" "}
                            {(
                              prices.starter.official - prices.starter.discount
                            )?.toLocaleString()}{" "}
                            {symbol}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group"
              >
                {plan.buttonTextEn || "Get VIP Access"}{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#vip-features"
                className="mt-3 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Get Full Details
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Notices */}
          {visibleNotices.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {visibleNotices.map((notice: any, i) => {
                const colors: Record<string, string> = {
                  offer: "bg-blue-500/10 border-blue-500/20 text-blue-500",
                  info: "bg-info/10 border-info/20 text-info",
                  warning: "bg-red-500/10 border-red-500/20 text-red-500",
                };
                const c = colors[notice.type] || colors.info;
                return (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`px-5 py-3 rounded-2xl border ${c} text-xs font-bold tracking-wide flex items-center gap-2`}
                  >
                    {notice.type === "offer" && (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {notice.type === "warning" && <Zap className="w-4 h-4" />}
                    {notice.type === "info" && <InfoIcon />}
                    {notice.textEn}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* VIP Details */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4 pb-20 space-y-12">
          {visibleHighlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              {visibleHighlights.map((h: any) => (
                <div
                  key={h.id}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5"
                >
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-white">
                    {h.textEn}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {visibleBullets.length > 0 && (
            <motion.div
              id="vip-features"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center max-w-4xl mx-auto mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-black tracking-[3px] uppercase mb-6 shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  VIP Membership
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight px-4"
                >
                  Everything You&apos;ll Ever Need
                  <span className="block mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    All in One Place.
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-text-muted text-sm lg:text-lg max-w-3xl mx-auto leading-relaxed px-4"
                >
                  From essential tools to legendary lifetime mastery. Explore
                  the elite vault of premium inventory.
                </motion.p>
              </div>

              <div className="max-w-5xl mx-auto px-1 sm:px-3">
                <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 shadow-2xl shadow-blue-500/5">
                  <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#020617] to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#020617] to-transparent z-10 pointer-events-none" />
                  <div className="h-[420px] sm:h-[520px] lg:h-[620px] overflow-y-auto premium-scrollbar p-5 sm:p-7 lg:p-9 space-y-3 sm:space-y-4">
                    {visibleBullets.map((bullet: any, idx: number) => (
                      <motion.div
                        key={bullet.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-1 sm:p-3 rounded-2xl sm:rounded-[20px] flex items-start gap-4 transition-all duration-300 ${bullet.highlighted ? "bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 shadow-lg shadow-blue-500/5" : "bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-lg hover:shadow-white/5"}`}
                      >
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${bullet.highlighted ? "bg-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/10" : "bg-white/5 text-white/40"}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm sm:text-base lg:text-lg font-bold leading-snug ${bullet.highlighted ? "text-blue-500" : "text-white"}`}
                          >
                            {bullet.textEn}
                          </p>
                          {bullet.textBn && (
                            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                              {bullet.textBn}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {visibleFAQs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h3 className="text-3xl font-black tracking-tighter text-center text-white mb-8">
                FAQ
              </h3>
              <div className="space-y-3">
                {visibleFAQs.map((faq: any) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                      className="w-full p-5 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-bold text-white pr-4">
                        {faq.qEn}
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${expandedFAQ === faq.id ? "rotate-90" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                            {faq.aEn}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {plan.telegramLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <a
                href={plan.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] font-black uppercase text-xs tracking-widest hover:bg-[#0088cc] hover:text-white transition-all"
              >
                <SendIcon /> Join Our Telegram
              </a>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showCheckout && (
          <VIPCheckoutModal
            plan={plan}
            pricingTrack={pricingTrack}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function InfoIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function VIPCheckoutModal({
  plan,
  pricingTrack,
  onClose,
}: {
  plan: any;
  pricingTrack: string;
  onClose: () => void;
}) {
  const { currentCurrency } = useCurrencyStore();
  const [step, setStep] = useState<"form" | "instructions">("form");
  const [form, setForm] = useState({
    userName: "",
    phoneNumber: "",
    telegramUsername: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const isOfficial = pricingTrack === "official";
  const startPrice =
    currentCurrency === "BDT"
      ? isOfficial
        ? plan.officialStarterBDT
        : plan.starterPriceBDT
      : isOfficial
        ? plan.officialStarterUSDT
        : plan.starterPriceUSDT;
  const hasDisc = isOfficial
    ? plan.enableDiscount && (plan.discountPercent ?? 0) > 0
    : plan.starterEnableDiscount && (plan.starterDiscountPercent ?? 0) > 0;
  const totalPrice =
    currentCurrency === "BDT"
      ? hasDisc
        ? isOfficial
          ? (plan.discountPriceBDT ?? plan.officialPriceBDT)
          : (plan.starterDiscountPriceBDT ?? plan.starterOfficialBDT)
        : isOfficial
          ? (plan.officialPriceBDT ?? 0)
          : (plan.starterOfficialBDT ?? plan.officialPriceBDT ?? 0)
      : hasDisc
        ? isOfficial
          ? (plan.discountPriceUSDT ?? plan.officialPriceUSDT)
          : (plan.starterDiscountPriceUSDT ?? plan.starterOfficialUSDT)
        : isOfficial
          ? (plan.officialPriceUSDT ?? 0)
          : (plan.starterOfficialUSDT ?? plan.officialPriceUSDT ?? 0);
  const symbol = currentCurrency === "BDT" ? "BDT" : "USDT";

  const handleSubmit = async () => {
    if (!form.userName || !form.phoneNumber) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/vip/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricingTrack,
          transactionId: `MANUAL-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      localStorage.setItem(
        "vip-auth-session",
        JSON.stringify({
          memberId: data.memberId,
          accessCode: data.accessCode,
          membershipId: data.membershipId,
          userName: data.userName,
          status: data.status,
        }),
      );

      setResult(data);
      setStep("instructions");

      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.location.href = "/dashboard";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#020617] rounded-[48px] border border-white/10 p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-2xl font-black tracking-tight">VIP Access</h3>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest">
                {isOfficial ? "Official Plan" : "Starter Plan"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "form" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-500 font-bold text-center text-2xl">
                {startPrice?.toLocaleString()} {symbol}
              </p>
              {plan.enableInstallments && (
                <p className="text-center text-xs text-text-muted mt-1">
                  Start from {startPrice?.toLocaleString()} {symbol} + monthly
                  installments
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-blue-500/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Total Plan Price
                </p>
                <p className="text-lg font-black text-white">
                  {totalPrice?.toLocaleString()} {symbol}
                </p>
              </div>
            </div>

            <input
              type="text"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              placeholder="Your Name *"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm"
            />
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              placeholder="Phone Number *"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm"
            />
            <input
              type="text"
              value={form.telegramUsername}
              onChange={(e) =>
                setForm({ ...form, telegramUsername: e.target.value })
              }
              placeholder="Telegram Username"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm"
            />

            <div className="p-4 rounded-2xl bg-info/10 border border-info/20">
              <p className="text-info text-xs font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                After submitting, you will get dashboard access to track your
                membership.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting
                ? "Processing..."
                : `Get VIP Access — ${startPrice?.toLocaleString()} ${symbol}`}
            </button>
          </div>
        )}

        {step === "instructions" && result && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-success/10 border border-success/20 text-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
              <h4 className="text-xl font-black text-success mb-1">
                Membership Created!
              </h4>
              <p className="text-sm text-text-muted">
                Your membership ID:{" "}
                <span className="text-blue-500 font-black">
                  {result.membershipId}
                </span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                Save your Access Code:{" "}
                <span className="text-blue-500 font-black">
                  {result.accessCode}
                </span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">
                Payment Required
              </p>
              <p className="text-sm text-white font-bold mb-3">
                Send {startPrice?.toLocaleString()} {symbol} to activate
              </p>
              {plan.telegramLink && (
                <a
                  href={plan.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] text-xs font-bold hover:bg-[#0088cc] hover:text-white transition-all"
                >
                  <SendIcon /> Contact Admin on Telegram
                </a>
              )}
            </div>
            <a
              href="/dashboard"
              className="block w-full py-4 rounded-2xl bg-white text-bg-dark font-black uppercase text-xs tracking-widest hover:bg-blue-500 hover:text-white transition-all text-center"
            >
              Go to Dashboard ({redirectCountdown}s)
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
