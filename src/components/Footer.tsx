"use client";
import React from "react";
import { useStore } from "../store/useStore";
import { Send, Mail, Globe, ChevronRight, ExternalLink, Shield, Zap } from "lucide-react";
import Link from "next/link";

export const Footer = ({ data }: { data: any }) => {
  const { language } = useStore();
  const settings = data?.site || {};
  const footer = data?.footer || {
    links: [
      { labelEn: "Privacy Policy", labelBn: "গোপনীয়তা নীতি", url: "/privacy" },
      { labelEn: "Terms & Conditions", labelBn: "শর্তাবলী", url: "/terms" },
      { labelEn: "Refund Policy", labelBn: "রিফান্ড নীতি", url: "/refund" },
    ],
    copyrightEn: "© 2024 Pro Access VIP Hub",
    copyrightBn: "© ২০২৪ প্রো অ্যাক্সেস ভিআইপি হাব",
  };
  const t = (en: string, bn: string) => (language === "en" ? en : bn);

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 lg:pt-28 pb-6 lg:pb-10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/3 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/3 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 lg:mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 lg:gap-4 mb-5 lg:mb-7 group">
              <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl lg:text-2xl shadow-xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500">
                {settings?.siteNameEn?.[0] || "P"}
              </div>
              <div>
                <span className="font-black text-xl lg:text-2xl tracking-tighter text-white leading-none">
                  {t(settings.siteNameEn, settings.siteNameBn)}
                </span>
                <p className="text-[8px] lg:text-[9px] text-primary font-black uppercase tracking-[3px] mt-1">
                  {t("Elite Hub", "এলিট হাব")}
                </p>
              </div>
            </Link>
            <p className="text-white/40 text-sm lg:text-base font-medium leading-relaxed mb-6 lg:mb-8 max-w-sm">
              {t(
                "The ultimate VIP platform for digital growth and automation in Bangladesh.",
                "বাংলাদেশে ডিজিটাল গ্রোথ এবং অটোমেশনের জন্য সেরা ভিআইপি প্ল্যাটফর্ম।",
              )}
            </p>
            <div className="flex gap-3">
              <a href={settings.telegramLink} target="_blank" rel="noreferrer"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-[#0088cc] hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30 transition-all duration-300 group shadow-lg">
                <Send className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
              </a>
              <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group shadow-lg">
                <Globe className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* Quick Links - flex row on mobile */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] lg:tracking-[3px] text-[9px] lg:text-[10px] mb-5 lg:mb-8 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary" />
              {t("Quick Links", "দ্রুত লিঙ্ক")}
            </h4>
            <div className="flex flex-row flex-wrap lg:flex-col gap-2 lg:gap-3">
              {[
                { href: "#products", en: "Products", bn: "পণ্য" },
                { href: "#pricing", en: "Pricing", bn: "প্রাইসিং" },
                { href: "#faq", en: "FAQ", bn: "প্রশ্নোত্তর" },
                { href: "#reviews", en: "Reviews", bn: "রিভিউ" },
              ].map((link) => (
                <a key={link.href} href={link.href}
                  className="text-white/40 hover:text-primary text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 group px-3 lg:px-0 py-1.5 lg:py-0 rounded-lg lg:rounded-none bg-white/[0.02] lg:bg-transparent border border-white/5 lg:border-none">
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform hidden lg:block" />
                  {t(link.en, link.bn)}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links - flex row on mobile */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] lg:tracking-[3px] text-[9px] lg:text-[10px] mb-5 lg:mb-8 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-secondary" />
              {t("Legal", "আইনি")}
            </h4>
            <div className="flex flex-row flex-wrap lg:flex-col gap-2 lg:gap-3">
              {footer.links.map((link: any) => (
                <Link key={link.url || link.labelEn} href={link.url}
                  className="text-white/40 hover:text-primary text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 group px-3 lg:px-0 py-1.5 lg:py-0 rounded-lg lg:rounded-none bg-white/[0.02] lg:bg-transparent border border-white/5 lg:border-none">
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all hidden lg:block" />
                  {t(link.labelEn, link.labelBn)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-black uppercase tracking-[2px] lg:tracking-[3px] text-[9px] lg:text-[10px] mb-5 lg:mb-8 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-primary" />
              {t("Direct Contact", "যোগাযোগ")}
            </h4>
            <div className="space-y-3 lg:space-y-4">
              <a href={settings.telegramLink} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 lg:gap-4 group p-3 lg:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-[#0088cc]/5 hover:border-[#0088cc]/20 transition-all">
                <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] group-hover:scale-110 transition-transform">
                  <Send className="w-4 lg:w-5 h-4 lg:h-5" />
                </div>
                <div>
                  <p className="text-[8px] lg:text-[9px] text-white/30 font-black uppercase tracking-widest">{t("Telegram", "টেলিগ্রাম")}</p>
                  <span className="text-white font-bold text-xs lg:text-sm">{settings.telegramHandle || "@Agent_47VIP"}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="flex items-center gap-3 lg:gap-4 group p-3 lg:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all">
                <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Mail className="w-4 lg:w-5 h-4 lg:h-5" />
                </div>
                <div>
                  <p className="text-[8px] lg:text-[9px] text-white/30 font-black uppercase tracking-widest">Email</p>
                  <span className="text-white font-bold text-xs lg:text-sm">support@proaccess.vip</span>
                </div>
                <Shield className="w-4 h-4 text-success/50 ml-auto" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 lg:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">
          <p className="text-white/25 font-bold text-[10px] lg:text-xs tracking-tight text-center md:text-left order-2 md:order-1">
            {t(footer.copyrightEn, footer.copyrightBn)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 order-1 md:order-2">
            <Link href="/admin"
              className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/25 hover:text-white hover:bg-white/5 transition-all">
              Admin
            </Link>
            <div className="px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[8px] font-black uppercase tracking-widest text-white/20 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-primary/50" /> v3.1.0
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-success/5 border border-success/10 text-[8px] font-black uppercase tracking-widest text-success/80 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Stable
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
