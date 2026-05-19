"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import {
  Check,
  ArrowRight,
  Zap,
  Star,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { trackAddToCart } from "../utils/facebookPixel";

import { useCurrencyStore } from "../store/useCurrencyStore";
import { Send, ScrollText, ExternalLink } from "lucide-react";

interface ProductPlan {
  id: string;
  priceTk: number;
  originalPriceTk?: number;
  nameEn?: string;
  nameBn?: string;
}

interface ProductItem {
  id: string;
  visible: boolean;
  order: number;
  image: string;
  titleEn: string;
  titleBn: string;
  badgeEn?: string;
  badgeBn?: string;
  shortDescriptionEn?: string;
  shortDescriptionBn?: string;
  tgPostLink?: string;
  telegramLink?: string;
  plans: ProductPlan[];
  bulletPoints?: Array<{
    id: string;
    visible: boolean;
    order: number;
    textEn: string;
    textBn: string;
    highlighted?: boolean;
  }>;
  features?: Array<{
    id: string;
    visible: boolean;
    textEn: string;
    textBn: string;
    includedInPlanIds?: string[];
  }>;
  buttonTextEn?: string;
  buttonTextBn?: string;
}

interface ProductCardProps {
  product: ProductItem;
  idx: number;
  language: string;
  handleJoin: (product: ProductItem, plan: ProductPlan) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  idx,
  language,
  handleJoin,
}) => {
  const [activePlanId, setActivePlanId] = useState(
    product.plans[product.plans.length - 1]?.id,
  );
  const { convertPrice, currentCurrency } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const t = (en: string | undefined, bn: string | undefined) =>
    language === "en" ? en || "" : bn || "";

  const activePlan =
    product.plans.find((p) => p.id === activePlanId) || product.plans[0];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-[22px] lg:rounded-[40px] p-1 lg:p-6 relative group hover:bg-white/[0.04] transition-all duration-700 border-white/[0.05] flex flex-col shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 lg:w-96 h-48 lg:h-96 bg-primary/10 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-48 lg:w-96 h-48 lg:h-96 bg-secondary/10 blur-[80px] lg:blur-[120px] rounded-full pointer-events-none group-hover:bg-secondary/20 transition-colors duration-700" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 lg:gap-6 text-center sm:text-left">
          <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
            <img
              src={product.image}
              className="w-full h-full object-cover"
              alt={t(product.titleEn, product.titleBn)}
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[8px] lg:text-[9px] font-black tracking-[2px] uppercase mb-1.5 shadow-lg mx-auto sm:mx-0">
              <Zap className="w-3 h-3 fill-primary" />
              {t(product.badgeEn, product.badgeBn)}
            </div>
            <h3 className="text-lg lg:text-3xl font-black tracking-tighter leading-none grad-text">
              {t(product.titleEn, product.titleBn)}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center lg:items-end">
          <div className="lg:text-right max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-text-secondary text-[11px] lg:text-sm font-medium leading-relaxed opacity-80">
              {t(product.shortDescriptionEn, product.shortDescriptionBn)}
            </p>
          </div>

          {product.tgPostLink && (
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={product.tgPostLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/tg relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#24A1DE]/10 border border-[#24A1DE]/20 text-[#24A1DE] text-[10px] lg:text-[11px] font-black uppercase tracking-wider hover:bg-[#24A1DE] hover:text-white transition-all shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/tg:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#24A1DE]/20 text-[#24A1DE] group-hover/tg:bg-white group-hover/tg:text-[#24A1DE] transition-colors">
                <ShieldCheck className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[7px] opacity-60 mb-0.5 tracking-[1px]">
                  {t("VERIFIED PROOF", "যাচাইকৃত প্রমাণ")}
                </span>
                <span className="flex items-center gap-1.5">
                  {t("Official Telegram Post", "অফিসিয়াল টেলিগ্রাম পোস্ট")}
                  <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                </span>
              </div>
            </motion.a>
          )}
        </div>
      </div>

      {/* Advanced Bullet Points Display */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-2 mb-4 px-2">
          <ScrollText className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[2px]">
            {t("Product Highlights", "প্রোডাক্ট হাইলাইটস")}
          </span>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[14px] p-2 lg:p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 max-h-[400px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {(product.bulletPoints || [])
              .filter((b) => b.visible)
              .sort((a, b) => a.order - b.order)
              .map((bullet) => (
                <motion.div
                  key={bullet.id}
                  variants={itemVariants}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all border group/bullet ${
                    bullet.highlighted
                      ? "bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
                      : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover/bullet:scale-110 ${
                      bullet.highlighted
                        ? "bg-primary text-white"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span
                    className={`text-[12px] lg:text-[13px] font-bold leading-tight tracking-tight ${
                      bullet.highlighted ? "text-white" : "text-white/80"
                    }`}
                  >
                    {t(bullet.textEn, bullet.textBn)}
                  </span>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="relative z-10 mt-auto pt-5 lg:pt-8 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          <div
            className={`flex-1 grid gap-3 lg:gap-4 w-full ${
              product.plans.length === 1
                ? "grid-cols-1 max-w-[240px]"
                : product.plans.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {product.plans.map((plan) => {
              const isLifetime = plan.nameEn
                ?.toLowerCase()
                .includes("lifetime");
              const isYearly = plan.nameEn?.toLowerCase().includes("yearly");
              const { amount, currency } = mounted
                ? convertPrice(plan.priceTk)
                : { amount: plan.priceTk, currency: "BDT" };

              const planColor = isLifetime
                ? "from-amber-400 to-orange-600"
                : isYearly
                  ? "from-purple-500 to-indigo-600"
                  : "from-blue-500 to-cyan-600";
              const planBorder = isLifetime
                ? "hover:border-amber-500/50 shadow-amber-500/5"
                : isYearly
                  ? "hover:border-purple-500/50 shadow-purple-500/5"
                  : "hover:border-blue-500/50 shadow-blue-500/5";

              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlanId(plan.id)}
                  className={`relative p-3 lg:p-6 rounded-2xl lg:rounded-[24px] flex flex-col items-center gap-1.5 lg:gap-2 transition-all group/btn overflow-hidden border-2 bg-white/[0.02] hover:bg-white/[0.06] ${
                    activePlanId === plan.id
                      ? `border-primary bg-primary/5`
                      : `border-white/10 ${planBorder}`
                  } group-hover:scale-[1.02] shadow-2xl transition-all duration-300`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover/btn:opacity-10 bg-gradient-to-br ${planColor} transition-opacity duration-500`}
                  />

                  {/* Discount Badge */}
                  {plan.originalPriceTk &&
                    plan.originalPriceTk > plan.priceTk && (
                      <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-red-500 text-[7px] lg:text-[8px] font-black text-white uppercase tracking-tighter animate-pulse shadow-lg">
                        {Math.round(
                          ((plan.originalPriceTk - plan.priceTk) /
                            plan.originalPriceTk) *
                            100,
                        )}
                        % OFF
                      </div>
                    )}

                  <span
                    className={`text-[7px] lg:text-[9px] font-black uppercase tracking-[2px] transition-colors duration-300 ${
                      isLifetime
                        ? "text-amber-400"
                        : isYearly
                          ? "text-purple-400"
                          : "text-blue-400"
                    }`}
                  >
                    {t(plan.nameEn, plan.nameBn)}
                  </span>
                  <div className="flex flex-col items-center">
                    {plan.originalPriceTk && (
                      <div className="flex items-center gap-1 opacity-40 line-through mb-0.5">
                        <span className="text-[10px] lg:text-[12px] font-bold">
                          {mounted
                            ? convertPrice(plan.originalPriceTk).amount
                            : plan.originalPriceTk}
                        </span>
                        <span className="text-[7px] lg:text-[8px] font-black">
                          {currency}
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg lg:text-2xl font-black tracking-tighter group-hover/btn:scale-105 transition-transform duration-500 text-white">
                        {amount}
                      </span>
                      <span className="text-[8px] lg:text-[9px] font-black opacity-40 uppercase tracking-widest ml-1 text-white">
                        {currency}
                      </span>
                    </div>
                    {mounted && currentCurrency === "USDT" && (
                      <span className="text-[7px] font-bold text-white/20 uppercase tracking-tighter">
                        ≈ {plan.priceTk} BDT
                      </span>
                    )}
                  </div>
                  {isLifetime && (
                    <Star className="absolute top-2 right-2 w-2.5 h-2.5 fill-amber-500 text-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:w-[320px] flex flex-col gap-3 lg:gap-4">
            <button
              onClick={() => handleJoin(product, activePlan)}
              className="w-full bg-white text-black py-3.5 lg:py-5 rounded-2xl lg:rounded-[24px] font-black text-[10px] lg:text-sm uppercase tracking-[3px] hover:bg-primary hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group/main overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover/main:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">
                {t(
                  product.buttonTextEn || "Secure Access",
                  product.buttonTextBn || "অ্যাক্সেস নিশ্চিত করুন",
                )}
              </span>
              <ArrowRight className="w-4 h-4 group-hover/main:translate-x-2 transition-transform relative z-10" />
            </button>

            <div className="flex items-center justify-center gap-4">
              {product.telegramLink && (
                <a
                  href={product.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8px] lg:text-[9px] font-black text-white/60 hover:text-primary transition-all tracking-[2px] uppercase flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  {t("CONSULT", "পরামর্শ নিন")}
                </a>
              )}

              <button
                onClick={() => handleJoin(product, activePlan)}
                className="text-[8px] lg:text-[9px] font-black text-white/60 hover:text-secondary transition-all tracking-[2px] uppercase flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                {t("UPGRADE NOW", "এখনই আপগ্রেড")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductShowcase = ({ data }: { data: ProductItem[] }) => {
  const { language, setSelectedOrderContext } = useStore();
  const products = data || [];
  const router = useRouter();

  const handleJoin = (product: ProductItem, plan: ProductPlan) => {
    setSelectedOrderContext({ product, plan });
    trackAddToCart({
      content_name: product.titleEn,
      value: plan.priceTk,
      currency: "BDT",
    });
    router.push("/checkout");
  };

  const visibleProducts = [...products]
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <section
      id="products"
      className="py-12 lg:py-20 relative overflow-hidden bg-bg-dark"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-5xl mx-auto mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] lg:text-[10px] font-black tracking-[3px] uppercase mb-6 shadow-xl"
          >
            <Sparkles className="w-4 h-4 fill-primary" />
            {language === "en"
              ? "Absolute Elite Access"
              : "অ্যাবসলিউট এলিট অ্যাক্সেস"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight"
          >
            {language === "en"
              ? "Choose a plan that fits your"
              : "বেছে নিন আপনার"}
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-info bg-clip-text text-transparent">
              {language === "en" ? "Ambition." : "লক্ষ্যপূরণের প্ল্যান।"}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-xs lg:text-lg font-medium max-w-3xl mx-auto leading-relaxed"
          >
            {language === "en"
              ? "From essential tools to legendary lifetime mastery. Explore the elite vault of premium inventory."
              : "অত্যাবশ্যকীয় টুলস থেকে শুরু করে লেজেন্ডারি লাইফটাইম মাস্টারি—প্রিমিয়াম ইনভেন্টরির এলিট ভল্ট ঘুরে দেখুন।"}
          </motion.p>
        </div>

        <div className="flex flex-col gap-4 lg:gap-12">
          {visibleProducts.map((product, idx) => (
            <div key={product.id} className="w-full">
              <ProductCard
                product={product}
                idx={idx}
                language={language}
                handleJoin={handleJoin}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
