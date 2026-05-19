"use client";

import React, { useState } from "react";
import {
  useFlashOffers,
  useUpdateFlashOffer,
  useDeleteFlashOffer,
} from "@/hooks/useFlashOffers";
import {
  Clock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Gift,
  Copy,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SECTIONS = [
  { value: "#homepage", label: "Homepage" },
  { value: "#hero", label: "Hero Section" },
  { value: "#vip", label: "VIP Section" },
  { value: "#pricing", label: "Pricing Section" },
  { value: "#products", label: "Products Section" },
  { value: "#checkout", label: "Checkout" },
  { value: "#limitedoffer", label: "Limited Offer" },
];

const BG_STYLES = ["premium", "glass", "gradient-amber", "gradient-purple", "minimal"];
const GLOW_STYLES = ["amber", "purple", "blue", "green", "red"];

export default function FlashOffersTab() {
  const { data: offers, isLoading } = useFlashOffers();
  const { mutate: updateOffer } = useUpdateFlashOffer();
  const { mutate: deleteOffer } = useDeleteFlashOffer();
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [activeEditorTab, setActiveEditorTab] = useState("general");

  const handleSave = (data: any) => {
    updateOffer(data, {
      onSuccess: () => setEditingOffer(null),
    });
  };

  const handleToggleVisibility = (offer: any) => {
    updateOffer({ ...offer, visible: !offer.visible, _id: offer._id });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this flash offer?")) {
      deleteOffer(id);
    }
  };

  const sortedOffers = [...(offers || [])].sort((a: any, b: any) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </span>
            Flash Offers
          </h2>
          <p className="text-text-muted text-sm font-medium mt-2">Manage limited-time countdown offers and flash sales</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditingOffer({
                titleEn: "",
                titleBn: "",
                subtitleEn: "",
                subtitleBn: "",
                descriptionEn: "",
                descriptionBn: "",
                buttonTextEn: "Claim Offer",
                buttonTextBn: "অফার নিন",
                redirectLink: "",
                badgeTextEn: "Limited Time Offer",
                badgeTextBn: "সীমিত সময়ের অফার",
                backgroundStyle: "premium",
                glowStyle: "amber",
                visible: true,
                featured: false,
                showOnHomepage: true,
                showOnVIPSection: false,
                showOnPricingSection: false,
                showOnHeroSection: false,
                selectedSection: "#homepage",
                productId: "",
                vipPlanId: "",
                countdownEnabled: true,
                order: (offers?.length || 0) + 1,
                startDate: new Date().toISOString().slice(0, 16),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                expired: false,
                totalSlots: 0,
                remainingSlots: 0,
                slotSystemEnabled: false,
                stickyEnabled: false,
              });
              setActiveEditorTab("general");
            }}
            className="bg-primary hover:bg-primary-light text-white px-10 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3 group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Create Flash Offer
          </button>
        </div>
      </div>

      {/* Offer List */}
      <div className="grid grid-cols-1 gap-6">
        {sortedOffers.map((offer: any, idx: number) => {
          const now = Date.now();
          const end = new Date(offer.endDate).getTime();
          const isExpired = offer.expired || end <= now;
          const isActive = offer.visible && !isExpired;

          return (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-card rounded-[40px] p-6 lg:p-8 border-white/5 relative overflow-hidden group ${!offer.visible ? "opacity-50" : ""} ${isExpired ? "border-red-500/10" : "border-amber-500/10"}`}
            >
              <div className={`absolute top-0 right-0 w-96 h-96 rounded-full -mr-48 -mt-48 transition-all ${isExpired ? "bg-red-500/5" : "bg-amber-500/10 group-hover:bg-amber-500/20"}`} />

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border ${isExpired ? "bg-red-500/10 border-red-500/20" : "bg-amber-500/10 border-amber-500/20"}`}>
                  <Gift className={`w-7 h-7 ${isExpired ? "text-red-400" : "text-amber-400"}`} />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isExpired ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                      {isExpired ? "Expired" : offer.badgeTextEn || "Offer"}
                    </span>
                    {offer.featured && (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest">
                        Featured
                      </span>
                    )}
                    {offer.stickyEnabled && (
                      <span className="px-3 py-1 rounded-full bg-info/10 text-info border border-info/20 text-[9px] font-black uppercase tracking-widest">
                        Sticky
                      </span>
                    )}
                    {offer.slotSystemEnabled && (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest">
                        {offer.remainingSlots}/{offer.totalSlots} Slots
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                      {offer.selectedSection}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-white">
                    {offer.titleEn || "Untitled Offer"}
                  </h3>
                  <p className="text-text-muted text-sm font-medium line-clamp-1 max-w-2xl">
                    {offer.subtitleEn || offer.descriptionEn}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted">
                    <span>Start: {new Date(offer.startDate).toLocaleString()}</span>
                    <span>End: {new Date(offer.endDate).toLocaleString()}</span>
                    {offer.countdownEnabled && <Clock className="w-3 h-3 text-amber-400" />}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {offer.redirectLink && (
                    <a href={offer.redirectLink} target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 rounded-2xl bg-white/5 text-info hover:bg-info hover:text-white transition-all flex items-center justify-center border border-white/10">
                      <Copy className="w-5 h-5" />
                    </a>
                  )}
                  <button onClick={() => handleToggleVisibility(offer)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${isActive ? "bg-success/10 text-success border-success/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                    {isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button onClick={() => { setEditingOffer(JSON.parse(JSON.stringify(offer))); setActiveEditorTab("general"); }}
                    className="w-12 h-12 rounded-2xl bg-white/5 text-text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(offer._id)}
                    className="w-12 h-12 rounded-2xl bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {!isLoading && sortedOffers.length === 0 && (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted font-bold text-lg">No flash offers yet</p>
            <p className="text-text-muted/50 text-sm">Create your first limited-time offer</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingOffer && (
          <FlashOfferEditor
            offer={editingOffer}
            activeTab={activeEditorTab}
            setActiveTab={setActiveEditorTab}
            setOffer={setEditingOffer}
            onClose={() => setEditingOffer(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", multiline = false, suffix, hint }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="admin-input min-h-[120px] w-full text-white placeholder:text-white/10" />
      ) : (
        <div className="relative">
          <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className="admin-input w-full text-white placeholder:text-white/10 pr-12" />
          {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-muted uppercase">{suffix}</span>}
        </div>
      )}
      {hint && <p className="text-[9px] text-text-muted/50 ml-1">{hint}</p>}
    </div>
  );
}

function Toggle({ value, onChange, label, desc }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        {desc && <p className="text-[10px] text-text-muted">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-14 h-8 rounded-full transition-all relative ${value ? "bg-primary" : "bg-white/10"}`}>
        <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow-lg ${value ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

function FlashOfferEditor({ offer, activeTab, setActiveTab, setOffer, onClose, onSave }: any) {
  const tabs = [
    { id: "general", label: "General", icon: Gift },
    { id: "content", label: "Content", icon: Sparkles },
    { id: "timing", label: "Timing & Slots", icon: Clock },
    { id: "placement", label: "Placement", icon: ChevronRight },
  ];

  const update = (field: string, val: any) => setOffer({ ...offer, [field]: val });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-7xl h-[90vh] bg-[#020617] rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">{offer._id ? "Edit Flash Offer" : "New Flash Offer"}</h3>
              <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{offer.titleEn || "Draft"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-text-muted hover:text-white font-bold text-sm tracking-widest uppercase px-6">Cancel</button>
            <button onClick={() => onSave(offer)} className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
              <Check className="w-4 h-4" /> Save Offer
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 border-r border-white/5 p-6 bg-white/[0.01] flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${isActive ? "bg-primary text-white" : "text-text-muted hover:bg-white/5 hover:text-white"}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-primary"}`} />
                  <span className="font-bold text-sm">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#020617]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === "general" && (
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">English</h4>
                        <InputField label="Offer Title" value={offer.titleEn} onChange={(v: any) => update("titleEn", v)} placeholder="e.g. Flash Sale: 50% OFF" />
                        <InputField label="Subtitle" value={offer.subtitleEn} onChange={(v: any) => update("subtitleEn", v)} />
                        <InputField label="Description" value={offer.descriptionEn} onChange={(v: any) => update("descriptionEn", v)} multiline />
                        <InputField label="Badge Text" value={offer.badgeTextEn} onChange={(v: any) => update("badgeTextEn", v)} />
                        <InputField label="Button Text" value={offer.buttonTextEn} onChange={(v: any) => update("buttonTextEn", v)} />
                      </div>
                      <div className="space-y-8">
                        <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Bangla</h4>
                        <InputField label="অফার টাইটেল" value={offer.titleBn} onChange={(v: any) => update("titleBn", v)} />
                        <InputField label="সাবটাইটেল" value={offer.subtitleBn} onChange={(v: any) => update("subtitleBn", v)} />
                        <InputField label="বিবরণ" value={offer.descriptionBn} onChange={(v: any) => update("descriptionBn", v)} multiline />
                        <InputField label="ব্যাজ টেক্সট" value={offer.badgeTextBn} onChange={(v: any) => update("badgeTextBn", v)} />
                        <InputField label="বাটন টেক্সট" value={offer.buttonTextBn} onChange={(v: any) => update("buttonTextBn", v)} />
                      </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 space-y-8">
                      <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Links</h4>
                      <InputField label="Redirect Link" value={offer.redirectLink} onChange={(v: any) => update("redirectLink", v)} placeholder="https://" hint="Where the CTA button points to" />
                    </div>
                  </div>
                )}
                {activeTab === "content" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Background Style</label>
                        <select value={offer.backgroundStyle} onChange={(e) => update("backgroundStyle", e.target.value)} className="admin-input w-full text-white bg-[#020617] border-white/10">
                          {BG_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Glow Style</label>
                        <select value={offer.glowStyle} onChange={(e) => update("glowStyle", e.target.value)} className="admin-input w-full text-white bg-[#020617] border-white/10">
                          {GLOW_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <InputField label="Order / Priority" type="number" value={offer.order} onChange={(v: any) => update("order", parseInt(v) || 0)} />
                    <Toggle value={offer.featured} onChange={(v: boolean) => update("featured", v)} label="Featured Offer" desc="Show as primary offer" />
                    <Toggle value={offer.countdownEnabled} onChange={(v: boolean) => update("countdownEnabled", v)} label="Enable Countdown Timer" desc="Show live countdown to end date" />
                    <Toggle value={offer.stickyEnabled} onChange={(v: boolean) => update("stickyEnabled", v)} label="Sticky Floating Banner" desc="Pin a floating timer at the bottom of the page" />
                  </div>
                )}
                {activeTab === "timing" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField label="Start Date" type="datetime-local" value={offer.startDate} onChange={(v: any) => update("startDate", v)} />
                      <InputField label="End Date" type="datetime-local" value={offer.endDate} onChange={(v: any) => update("endDate", v)} />
                    </div>
                    <div className="pt-8 border-t border-white/5 space-y-8">
                      <h4 className="text-red-400 font-black text-xs uppercase tracking-[3px] border-l-4 border-red-400 pl-4">Limited Slot System</h4>
                      <Toggle value={offer.slotSystemEnabled} onChange={(v: boolean) => update("slotSystemEnabled", v)} label="Enable Slot System" desc="Limit available spots for this offer" />
                      {offer.slotSystemEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <InputField label="Total Slots" type="number" value={offer.totalSlots} onChange={(v: any) => update("totalSlots", parseInt(v) || 0)} />
                          <InputField label="Remaining Slots" type="number" value={offer.remainingSlots} onChange={(v: any) => update("remainingSlots", parseInt(v) || 0)} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "placement" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Target Section</label>
                      <select value={offer.selectedSection} onChange={(e) => update("selectedSection", e.target.value)} className="admin-input w-full text-white bg-[#020617] border-white/10">
                        {SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <p className="text-[9px] text-text-muted/50 ml-1">Select where this offer banner should appear</p>
                    </div>
                    <div className="space-y-4 pt-4">
                      <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Manual Section Overrides</h4>
                      <Toggle value={offer.showOnHomepage} onChange={(v: boolean) => update("showOnHomepage", v)} label="Show on Homepage" />
                      <Toggle value={offer.showOnVIPSection} onChange={(v: boolean) => update("showOnVIPSection", v)} label="Show on VIP Section" />
                      <Toggle value={offer.showOnPricingSection} onChange={(v: boolean) => update("showOnPricingSection", v)} label="Show on Pricing Section" />
                      <Toggle value={offer.showOnHeroSection} onChange={(v: boolean) => update("showOnHeroSection", v)} label="Show on Hero Section" />
                    </div>
                    <div className="pt-4 space-y-4">
                      <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Linked Items</h4>
                      <InputField label="Product ID (optional)" value={offer.productId} onChange={(v: any) => update("productId", v)} hint="Link to a specific product" />
                      <InputField label="VIP Plan ID (optional)" value={offer.vipPlanId} onChange={(v: any) => update("vipPlanId", v)} hint="Link to a VIP plan" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
