"use client";

import React, { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/useCMS";
import {
  Monitor,
  Wallet,
  Globe,
  Layout,
  Save,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  Clock,
  List,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'sonner';

export default function SettingsTab() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (settings) {
      const cleanSettings = JSON.parse(JSON.stringify(settings));
      
      // Ensure nested objects exist to prevent crashes
      if (!cleanSettings.hero) cleanSettings.hero = {};
      if (!cleanSettings.site) cleanSettings.site = {};
      if (!cleanSettings.navbar) cleanSettings.navbar = { items: [] };
      if (!cleanSettings.paymentSettings) cleanSettings.paymentSettings = { methods: [] };
      if (!cleanSettings.countdown) cleanSettings.countdown = {};
      if (!cleanSettings.trustBadges) cleanSettings.trustBadges = [];
      if (!cleanSettings.globalFeatures) cleanSettings.globalFeatures = [];
      if (!cleanSettings.footer) cleanSettings.footer = { links: [] };
      
      setLocalSettings(cleanSettings);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings, {
      onSuccess: () => toast.success("Settings published successfully!"),
      onError: () => toast.error("Failed to update settings"),
    });
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const navItems = [
    { id: "hero", label: "Hero Section", icon: Monitor },
    { id: "site", label: "Site & Brand", icon: Globe },
    { id: "navbar", label: "Navigation", icon: List },
    { id: "payments", label: "Payment Methods", icon: Wallet },
    { id: "countdown", label: "Urgency Timer", icon: Clock },
    { id: "trust", label: "Trust Badges", icon: ShieldCheck },
    { id: "features", label: "Global Features", icon: Zap },
    { id: "footer", label: "Footer & Links", icon: Layout },
  ];

  const updateNested = (path: string, value: any) => {
    const newSettings = { ...localSettings };
    const parts = path.split(".");
    let current = newSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setLocalSettings(newSettings);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Global CMS</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">
            Real-time platform configuration
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3 group"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Sidebar */}
        <div className="xl:col-span-3 space-y-4 sticky top-32">
          <div className="glass-card rounded-[32px] p-3 border-white/5 bg-white/[0.01]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/10"
                    : "text-text-muted hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-primary"}`} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="xl:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeSection === "hero" && <HeroSection data={localSettings.hero || {}} onChange={updateNested} />}
              {activeSection === "site" && <SiteSection data={localSettings.site || {}} onChange={updateNested} />}
              {activeSection === "navbar" && <NavbarSection data={localSettings.navbar || { items: [] }} onChange={updateNested} />}
              {activeSection === "payments" && (
                <PaymentSection data={localSettings.paymentSettings || { methods: [] }} onChange={updateNested} />
              )}
              {activeSection === "countdown" && (
                <CountdownSection data={localSettings.countdown || {}} onChange={updateNested} />
              )}
              {activeSection === "trust" && (
                <TrustSection data={localSettings.trustBadges || []} onChange={(val: any) => setLocalSettings({ ...localSettings, trustBadges: val })} />
              )}
              {activeSection === "features" && (
                <FeaturesSection data={localSettings.globalFeatures || []} onChange={(val: any) => setLocalSettings({ ...localSettings, globalFeatures: val })} />
              )}
              {activeSection === "footer" && <FooterSection data={localSettings.footer || { links: [] }} onChange={updateNested} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function SectionHeader({ title, subtitle, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-2xl font-black tracking-tight text-white">{title}</h3>
        <p className="text-text-muted text-sm font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", multiline = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="admin-input min-h-[100px] w-full text-white placeholder:text-white/20"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input w-full text-white placeholder:text-white/20"
        />
      )}
    </div>
  );
}

function HeroSection({ data, onChange }: any) {
  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <SectionHeader title="Hero Experience" subtitle="First impression content management" icon={Monitor} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-primary font-black text-xs uppercase tracking-widest border-l-2 border-primary pl-3">English Content</h4>
          <InputField label="Badge text" value={data.badgeEn} onChange={(v: any) => onChange("hero.badgeEn", v)} />
          <InputField label="Main Title" value={data.titleEn} onChange={(v: any) => onChange("hero.titleEn", v)} />
          <InputField label="Title Accent" value={data.titleAccentEn} onChange={(v: any) => onChange("hero.titleAccentEn", v)} />
          <InputField label="Subtitle" value={data.subtitleEn} onChange={(v: any) => onChange("hero.subtitleEn", v)} multiline />
          <InputField label="Primary CTA" value={data.cta1En} onChange={(v: any) => onChange("hero.cta1En", v)} />
          <InputField label="Secondary CTA" value={data.cta2En} onChange={(v: any) => onChange("hero.cta2En", v)} />
        </div>
        <div className="space-y-6">
          <h4 className="text-accent font-black text-xs uppercase tracking-widest border-l-2 border-accent pl-3">Bangla Content</h4>
          <InputField label="Badge text (BN)" value={data.badgeBn} onChange={(v: any) => onChange("hero.badgeBn", v)} />
          <InputField label="Main Title (BN)" value={data.titleBn} onChange={(v: any) => onChange("hero.titleBn", v)} />
          <InputField label="Title Accent (BN)" value={data.titleAccentBn} onChange={(v: any) => onChange("hero.titleAccentBn", v)} />
          <InputField label="Subtitle (BN)" value={data.subtitleBn} onChange={(v: any) => onChange("hero.subtitleBn", v)} multiline />
          <InputField label="Primary CTA (BN)" value={data.cta1Bn} onChange={(v: any) => onChange("hero.cta1Bn", v)} />
          <InputField label="Secondary CTA (BN)" value={data.cta2Bn} onChange={(v: any) => onChange("hero.cta2Bn", v)} />
        </div>
      </div>
    </div>
  );
}

function SiteSection({ data, onChange }: any) {
  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <SectionHeader title="Brand & Identity" subtitle="Global site metadata and announcements" icon={Globe} />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Site Name (EN)" value={data.siteNameEn} onChange={(v: any) => onChange("site.siteNameEn", v)} />
          <InputField label="Site Name (BN)" value={data.siteNameBn} onChange={(v: any) => onChange("site.siteNameBn", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Telegram Link" value={data.telegramLink} onChange={(v: any) => onChange("site.telegramLink", v)} placeholder="https://t.me/..." />
          <InputField label="Telegram Handle" value={data.telegramHandle} onChange={(v: any) => onChange("site.telegramHandle", v)} placeholder="@username" />
        </div>
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-white font-bold">Global Announcement</h4>
              <p className="text-text-muted text-xs">Sticky banner at the top of the page</p>
            </div>
            <button
              onClick={() => onChange("site.showAnnouncement", !data.showAnnouncement)}
              className={`w-12 h-6 rounded-full transition-colors relative ${data.showAnnouncement ? "bg-primary" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.showAnnouncement ? "left-7" : "left-1"}`} />
            </button>
          </div>
          {data.showAnnouncement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Announcement (EN)" value={data.announcementEn} onChange={(v: any) => onChange("site.announcementEn", v)} />
              <InputField label="Announcement (BN)" value={data.announcementBn} onChange={(v: any) => onChange("site.announcementBn", v)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavbarSection({ data, onChange }: any) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), labelEn: "New Link", labelBn: "নতুন লিঙ্ক", url: "/", order: data.items.length };
    onChange("navbar.items", [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange("navbar.items", data.items.filter((i: any) => i.id !== id));
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange("navbar.items", data.items.map((i: any) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader title="Navigation" subtitle="Header links and branding" icon={List} />
        <button onClick={addItem} className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>
      <div className="space-y-4">
        {(data.items || []).sort((a: any, b: any) => a.order - b.order).map((item: any, idx: number) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField label="Label (EN)" value={item.labelEn} onChange={(v: any) => updateItem(item.id, "labelEn", v)} />
              <InputField label="Label (BN)" value={item.labelBn} onChange={(v: any) => updateItem(item.id, "labelBn", v)} />
              <InputField label="URL" value={item.url} onChange={(v: any) => updateItem(item.id, "url", v)} />
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountdownSection({ data, onChange }: any) {
  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader title="Urgency Timer" subtitle="Sales countdown configuration" icon={Clock} />
        <button
          onClick={() => onChange("countdown.enabled", !data.enabled)}
          className={`w-12 h-6 rounded-full transition-colors relative ${data.enabled ? "bg-primary" : "bg-white/10"}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.enabled ? "left-7" : "left-1"}`} />
        </button>
      </div>
      <div className="space-y-8">
        <InputField label="Target Date (ISO format)" value={data.targetDate} onChange={(v: any) => onChange("countdown.targetDate", v)} placeholder="2024-12-31T23:59:59Z" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputField label="Title (EN)" value={data.titleEn} onChange={(v: any) => onChange("countdown.titleEn", v)} />
            <InputField label="Subtitle (EN)" value={data.subtitleEn} onChange={(v: any) => onChange("countdown.subtitleEn", v)} />
          </div>
          <div className="space-y-6">
            <InputField label="Title (BN)" value={data.titleBn} onChange={(v: any) => onChange("countdown.titleBn", v)} />
            <InputField label="Subtitle (BN)" value={data.subtitleBn} onChange={(v: any) => onChange("countdown.subtitleBn", v)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustSection({ data, onChange }: any) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), textEn: "Safe & Secure", textBn: "নিরাপদ ও সুরক্ষিত", icon: "Shield", visible: true, order: data.length };
    onChange([...data, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(data.filter((i: any) => i.id !== id));
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange(data.map((i: any) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader title="Trust Badges" subtitle="Safety signals for customers" icon={ShieldCheck} />
        <button onClick={addItem} className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
          <Plus className="w-4 h-4" /> Add Badge
        </button>
      </div>
      <div className="space-y-4">
        {data.sort((a: any, b: any) => a.order - b.order).map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <InputField label="Text (EN)" value={item.textEn} onChange={(v: any) => updateItem(item.id, "textEn", v)} />
              <InputField label="Text (BN)" value={item.textBn} onChange={(v: any) => updateItem(item.id, "textBn", v)} />
              <div className="flex items-center gap-4">
                <InputField label="Icon Name" value={item.icon} onChange={(v: any) => updateItem(item.id, "icon", v)} placeholder="Shield, Zap, etc" />
                <button
                  onClick={() => updateItem(item.id, "visible", !item.visible)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${item.visible ? "bg-primary text-white" : "bg-white/5 text-text-muted"}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ data, onChange }: any) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), titleEn: "Feature Title", titleBn: "ফিচার টাইটেল", descriptionEn: "Desc", descriptionBn: "বর্ণনা", icon: "Zap", visible: true, order: data.length };
    onChange([...data, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(data.filter((i: any) => i.id !== id));
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange(data.map((i: any) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <div className="flex items-center justify-between mb-8">
        <SectionHeader title="Global Features" subtitle="Platform wide benefit highlights" icon={Zap} />
        <button onClick={addItem} className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>
      <div className="space-y-4">
        {data.sort((a: any, b: any) => a.order - b.order).map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField label="Title (EN)" value={item.titleEn} onChange={(v: any) => updateItem(item.id, "titleEn", v)} />
              <InputField label="Title (BN)" value={item.titleBn} onChange={(v: any) => updateItem(item.id, "titleBn", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InputField label="Desc (EN)" value={item.descriptionEn} onChange={(v: any) => updateItem(item.id, "descriptionEn", v)} multiline />
              <InputField label="Desc (BN)" value={item.descriptionBn} onChange={(v: any) => updateItem(item.id, "descriptionBn", v)} multiline />
            </div>
            <div className="flex items-center gap-4">
              <InputField label="Icon Name" value={item.icon} onChange={(v: any) => updateItem(item.id, "icon", v)} />
              <button
                onClick={() => updateItem(item.id, "visible", !item.visible)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${item.visible ? "bg-primary text-white" : "bg-white/5 text-text-muted"}`}
              >
                <Monitor className="w-4 h-4" /> {item.visible ? "Visible" : "Hidden"}
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentSection({ data, onChange }: any) {
  const addMethod = () => {
    const newMethod = {
      id: Date.now().toString(),
      name: "New Method",
      number: "",
      accountTypeEn: "Personal",
      accountTypeBn: "পার্সোনাল",
      accountHolder: "",
      instructionsEn: "",
      instructionsBn: "",
      color: "#000000",
      enabled: true,
      order: data.methods.length
    };
    onChange("paymentSettings.methods", [...data.methods, newMethod]);
  };

  const removeMethod = (id: string) => {
    onChange("paymentSettings.methods", data.methods.filter((m: any) => m.id !== id));
  };

  const updateMethod = (id: string, field: string, val: any) => {
    onChange("paymentSettings.methods", data.methods.map((m: any) => (m.id === id ? { ...m, [field]: val } : m)));
  };

  return (
    <div className="space-y-8">
      {/* Global Payment Config */}
      <div className="glass-card rounded-[32px] p-8 border-white/5">
        <SectionHeader title="Payment Settings" subtitle="Checkout instructions and warning text" icon={Wallet} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Instruction Title (EN)" value={data.instructionTitleEn} onChange={(v: any) => onChange("paymentSettings.instructionTitleEn", v)} />
          <InputField label="Instruction Title (BN)" value={data.instructionTitleBn} onChange={(v: any) => onChange("paymentSettings.instructionTitleBn", v)} />
          <InputField label="Warning (EN)" value={data.warningTextEn} onChange={(v: any) => onChange("paymentSettings.warningTextEn", v)} multiline />
          <InputField label="Warning (BN)" value={data.warningTextBn} onChange={(v: any) => onChange("paymentSettings.warningTextBn", v)} multiline />
        </div>
      </div>

      {/* Methods */}
      <div className="glass-card rounded-[32px] p-8 border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-xl font-bold text-white">Payment Methods</h4>
            <p className="text-text-muted text-xs">Manage active gateways</p>
          </div>
          <button onClick={addMethod} className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/20 transition-all">
            <Plus className="w-4 h-4" /> Add Method
          </button>
        </div>

        <div className="space-y-6">
          {(data.methods || []).sort((a: any, b: any) => a.order - b.order).map((method: any) => (
            <div key={method.id} className="p-8 rounded-[24px] bg-white/[0.02] border border-white/5 relative group">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <InputField label="Gateway Name" value={method.name} onChange={(v: any) => updateMethod(method.id, "name", v)} />
                <InputField label="Account Number" value={method.number} onChange={(v: any) => updateMethod(method.id, "number", v)} />
                <InputField label="Account Holder" value={method.accountHolder} onChange={(v: any) => updateMethod(method.id, "accountHolder", v)} />
                <InputField label="QR Code URL" value={method.qrCode} onChange={(v: any) => updateMethod(method.id, "qrCode", v)} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Theme Color</label>
                  <input
                    type="color"
                    value={method.color || "#000000"}
                    onChange={(e) => updateMethod(method.id, "color", e.target.value)}
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Warning (EN)" value={method.warningTextEn} onChange={(v: any) => updateMethod(method.id, "warningTextEn", v)} />
                    <InputField label="Warning (BN)" value={method.warningTextBn} onChange={(v: any) => updateMethod(method.id, "warningTextBn", v)} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-6">
                  <InputField label="Account Type (EN)" value={method.accountTypeEn} onChange={(v: any) => updateMethod(method.id, "accountTypeEn", v)} />
                  <InputField label="Instructions (EN)" value={method.instructionsEn} onChange={(v: any) => updateMethod(method.id, "instructionsEn", v)} multiline />
                </div>
                <div className="space-y-6">
                  <InputField label="Account Type (BN)" value={method.accountTypeBn} onChange={(v: any) => updateMethod(method.id, "accountTypeBn", v)} />
                  <InputField label="Instructions (BN)" value={method.instructionsBn} onChange={(v: any) => updateMethod(method.id, "instructionsBn", v)} multiline />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateMethod(method.id, "enabled", !method.enabled)}
                  className={`px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${method.enabled ? "bg-green-500/10 text-green-500" : "bg-white/5 text-text-muted"}`}
                >
                  {method.enabled ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {method.enabled ? "ACTIVE" : "DISABLED"}
                </button>
              </div>
              <button
                onClick={() => removeMethod(method.id)}
                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterSection({ data, onChange }: any) {
  const addLink = () => {
    const newLink = { labelEn: "Link", labelBn: "লিঙ্ক", url: "/" };
    onChange("footer.links", [...data.links, newLink]);
  };

  const removeLink = (idx: number) => {
    onChange("footer.links", data.links.filter((_: any, i: number) => i !== idx));
  };

  const updateLink = (idx: number, field: string, val: any) => {
    const newLinks = [...data.links];
    newLinks[idx] = { ...newLinks[idx], [field]: val };
    onChange("footer.links", newLinks);
  };

  return (
    <div className="glass-card rounded-[32px] p-8 border-white/5">
      <SectionHeader title="Footer & Links" subtitle="Copyright and legal page navigation" icon={Layout} />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Copyright Text (EN)" value={data.copyrightEn} onChange={(v: any) => onChange("footer.copyrightEn", v)} />
          <InputField label="Copyright Text (BN)" value={data.copyrightBn} onChange={(v: any) => onChange("footer.copyrightBn", v)} />
        </div>
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-white font-bold">Quick Links</h4>
            <button onClick={addLink} className="text-primary font-bold text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          <div className="space-y-4">
            {(data.links || []).map((link: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 rounded-xl bg-white/[0.01] border border-white/5 relative group">
                <InputField label="Label (EN)" value={link.labelEn} onChange={(v: any) => updateLink(idx, "labelEn", v)} />
                <InputField label="Label (BN)" value={link.labelBn} onChange={(v: any) => updateLink(idx, "labelBn", v)} />
                <InputField label="URL" value={link.url} onChange={(v: any) => updateLink(idx, "url", v)} />
                <button
                  onClick={() => removeLink(idx)}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
