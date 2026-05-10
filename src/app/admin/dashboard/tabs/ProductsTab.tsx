"use client";

import React, { useState, useEffect } from "react";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useCMS";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Zap,
  Check,
  X,
  Type,
  Info,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronRight,
  GripVertical,
  Monitor,
  Layout,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeEditorTab, setActiveEditorTab] = useState("general");

  const handleToggleVisibility = (product: any) => {
    updateProduct({ ...product, visible: !product.visible }, {
      onSuccess: () => toast.success("Visibility updated"),
      onError: () => toast.error("Update failed")
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProduct(id, {
        onSuccess: () => toast.success("Product deleted"),
        onError: () => toast.error("Delete failed")
      });
    }
  };

  const handleSave = () => {
    updateProduct(editingProduct, {
      onSuccess: () => {
        toast.success("Product saved successfully!");
        setEditingProduct(null);
      },
      onError: (err: any) => {
        console.error("Save error:", err);
        toast.error("Failed to save product. Check all fields.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const sortedProducts = [...(products || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2">Product Vault</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">
            Manage premium packages and feature plans
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct({
              titleEn: "",
              titleBn: "",
              subtitleEn: "",
              subtitleBn: "",
              badgeEn: "Premium",
              badgeBn: "প্রিমিয়াম",
              shortDescriptionEn: "",
              shortDescriptionBn: "",
              buttonTextEn: "Buy Now",
              buttonTextBn: "এখনই কিনুন",
              telegramLink: "",
              image: "",
              slug: "",
              plans: [],
              features: [],
              bulletPoints: [],
              visible: true,
              order: (products?.length || 0) + 1,
            });
            setActiveEditorTab("general");
          }}
          className="bg-primary hover:bg-primary-light text-white px-10 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Create New Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-6">
        {sortedProducts.map((product, idx) => (
          <ProductCard
            key={product._id}
            product={product}
            idx={idx}
            onEdit={() => setEditingProduct(JSON.parse(JSON.stringify(product)))}
            onToggleVisibility={() => handleToggleVisibility(product)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingProduct && (
          <ProductEditor
            product={editingProduct}
            activeTab={activeEditorTab}
            setActiveTab={setActiveEditorTab}
            setProduct={setEditingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Subcomponents ---

function ProductCard({ product, idx, onEdit, onToggleVisibility, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`glass-card rounded-[40px] p-6 lg:p-8 border-white/5 relative overflow-hidden group ${!product.visible ? "opacity-60" : ""}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-primary/10" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Product Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
          <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.titleEn} />
        </div>

        {/* Product Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
              {product.badgeEn}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest">
              {product.slug}
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">{product.titleEn}</h3>
          <p className="text-text-muted text-sm font-medium line-clamp-2 max-w-2xl">{product.shortDescriptionEn}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleVisibility}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${product.visible ? "bg-success/10 text-success border-success/20" : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
          >
            {product.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button
            onClick={onEdit}
            className="w-12 h-12 rounded-2xl bg-white/5 text-text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="w-12 h-12 rounded-2xl bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductEditor({ product, activeTab, setActiveTab, setProduct, onClose, onSave }: any) {
  const tabs = [
    { id: "general", label: "General", icon: Info },
    { id: "plans", label: "Plans", icon: Layers },
    { id: "bullets", label: "Highlights", icon: Type },
    { id: "features", label: "Features", icon: Sparkles },
  ];

  const updateProduct = (field: string, val: any) => {
    setProduct({ ...product, [field]: val });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-7xl h-[90vh] bg-[#020617] rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">{product._id ? "Edit Product" : "New Product"}</h3>
              <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{product.titleEn || "Draft"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-text-muted hover:text-white font-bold text-sm tracking-widest uppercase px-6"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Product
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-72 border-r border-white/5 p-6 bg-white/[0.01] flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${isActive ? "bg-primary text-white" : "text-text-muted hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-primary"}`} />
                  <span className="font-bold text-sm">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#020617]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && <GeneralEditor product={product} onChange={updateProduct} />}
                {activeTab === "plans" && <PlansEditor product={product} onChange={updateProduct} />}
                {activeTab === "bullets" && <BulletsEditor product={product} onChange={updateProduct} />}
                {activeTab === "features" && <FeaturesEditor product={product} onChange={updateProduct} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Editor Tabs Components ---

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
          className="admin-input min-h-[120px] w-full text-white placeholder:text-white/10"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input w-full text-white placeholder:text-white/10"
        />
      )}
    </div>
  );
}

function GeneralEditor({ product, onChange }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">English Core</h4>
          <InputField label="Product Title" value={product.titleEn} onChange={(v: any) => onChange("titleEn", v)} />
          <InputField label="Hero Badge" value={product.badgeEn} onChange={(v: any) => onChange("badgeEn", v)} />
          <InputField label="Short Description" value={product.shortDescriptionEn} onChange={(v: any) => onChange("shortDescriptionEn", v)} multiline />
          <InputField label="Button Text" value={product.buttonTextEn} onChange={(v: any) => onChange("buttonTextEn", v)} />
        </div>
        <div className="space-y-8">
          <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Bangla Core</h4>
          <InputField label="পণ্য টাইটেল" value={product.titleBn} onChange={(v: any) => onChange("titleBn", v)} />
          <InputField label="হিরো ব্যাজ" value={product.badgeBn} onChange={(v: any) => onChange("badgeBn", v)} />
          <InputField label="সংক্ষিপ্ত বর্ণনা" value={product.shortDescriptionBn} onChange={(v: any) => onChange("shortDescriptionBn", v)} multiline />
          <InputField label="বাটন টেক্সট" value={product.buttonTextBn} onChange={(v: any) => onChange("buttonTextBn", v)} />
        </div>
      </div>

      <div className="pt-10 border-t border-white/5 space-y-8">
        <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Links & Media</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InputField label="Unique Slug" value={product.slug} onChange={(v: any) => onChange("slug", v)} placeholder="e.g. canva-pro" />
          <InputField label="Image URL" value={product.image} onChange={(v: any) => onChange("image", v)} />
          <InputField label="Telegram Link" value={product.telegramLink} onChange={(v: any) => onChange("telegramLink", v)} />
        </div>
      </div>
    </div>
  );
}

function PlansEditor({ product, onChange }: any) {
  const addPlan = () => {
    const newPlan = { id: Date.now().toString(), nameEn: "New Plan", nameBn: "নতুন প্ল্যান", priceTk: "0", originalPriceTk: "0", durationEn: "Monthly", durationBn: "মাসিক", isPopular: false };
    onChange("plans", [...product.plans, newPlan]);
  };

  const updatePlan = (id: string, field: string, val: any) => {
    onChange("plans", product.plans.map((p: any) => p.id === id ? { ...p, [field]: val } : p));
  };

  const removePlan = (id: string) => {
    onChange("plans", product.plans.filter((p: any) => p.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">Pricing Strategies</h4>
        <button onClick={addPlan} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all">
          <Plus className="w-4 h-4" /> Add Pricing Plan
        </button>
      </div>

      <div className="space-y-8">
        {product.plans.map((plan: any, idx: number) => (
          <div key={plan.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 relative group">
            <div className="absolute top-4 right-4 flex items-center gap-3">
              <button
                onClick={() => updatePlan(plan.id, "isPopular", !plan.isPopular)}
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${plan.isPopular ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-white/5 text-white/20 border-white/10"
                  }`}
              >
                {plan.isPopular ? "Popular Choice" : "Mark Popular"}
              </button>
              <button onClick={() => removePlan(plan.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <InputField label="Plan Name (EN)" value={plan.nameEn} onChange={(v: any) => updatePlan(plan.id, "nameEn", v)} />
                <InputField label="Duration (EN)" value={plan.durationEn} onChange={(v: any) => updatePlan(plan.id, "durationEn", v)} />
              </div>
              <div className="space-y-6">
                <InputField label="প্ল্যান নাম (BN)" value={plan.nameBn} onChange={(v: any) => updatePlan(plan.id, "nameBn", v)} />
                <InputField label="মেয়াদ (BN)" value={plan.durationBn} onChange={(v: any) => updatePlan(plan.id, "durationBn", v)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Sale Price (TK)" value={plan.priceTk} onChange={(v: any) => updatePlan(plan.id, "priceTk", v)} />
              <InputField label="Regular Price (TK)" value={plan.originalPriceTk} onChange={(v: any) => updatePlan(plan.id, "originalPriceTk", v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BulletsEditor({ product, onChange }: any) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), textEn: "Feature Point", textBn: "ফিচার পয়েন্ট", icon: "Check", order: product.bulletPoints.length };
    onChange("bulletPoints", [...product.bulletPoints, newItem]);
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange("bulletPoints", product.bulletPoints.map((b: any) => b.id === id ? { ...b, [field]: val } : b));
  };

  const removeItem = (id: string) => {
    onChange("bulletPoints", product.bulletPoints.filter((b: any) => b.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Key Highlights</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-secondary transition-all">
          <Plus className="w-4 h-4" /> Add Highlight
        </button>
      </div>

      <div className="space-y-4">
        {product.bulletPoints.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-6 relative group">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Point (EN)" value={item.textEn} onChange={(v: any) => updateItem(item.id, "textEn", v)} />
              <InputField label="পয়েন্ট (BN)" value={item.textBn} onChange={(v: any) => updateItem(item.id, "textBn", v)} />
            </div>
            <div className="w-full md:w-48">
              <InputField label="Icon Name" value={item.icon} onChange={(v: any) => updateItem(item.id, "icon", v)} />
            </div>
            <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-500/20 hover:bg-red-500 hover:text-white">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesEditor({ product, onChange }: any) {
  const addItem = () => {
    const newItem = { id: Date.now().toString(), textEn: "Main Feature", textBn: "মূল ফিচার", visible: true, highlighted: false, order: product.features.length, includedInPlanIds: [] };
    onChange("features", [...product.features, newItem]);
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange("features", product.features.map((f: any) => f.id === id ? { ...f, [field]: val } : f));
  };

  const removeItem = (id: string) => {
    onChange("features", product.features.filter((f: any) => f.id !== id));
  };

  const togglePlanInFeature = (featureId: string, planId: string) => {
    const feature = product.features.find((f: any) => f.id === featureId);
    const included = feature.includedInPlanIds || [];
    const newIncluded = included.includes(planId)
      ? included.filter((id: string) => id !== planId)
      : [...included, planId];
    updateItem(featureId, "includedInPlanIds", newIncluded);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Comparison Matrix</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-info transition-all">
          <Plus className="w-4 h-4" /> Add Feature Line
        </button>
      </div>

      <div className="space-y-6">
        {product.features.map((item: any) => (
          <div key={item.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 relative group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <InputField label="Feature Title (EN)" value={item.textEn} onChange={(v: any) => updateItem(item.id, "textEn", v)} />
              <InputField label="ফিচার টাইটেল (BN)" value={item.textBn} onChange={(v: any) => updateItem(item.id, "textBn", v)} />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mr-2">Status:</span>
                <button
                  onClick={() => updateItem(item.id, "visible", !item.visible)}
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? "bg-success/10 text-success border-success/20" : "bg-white/5 text-white/20 border-white/10"
                    }`}
                >
                  {item.visible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => updateItem(item.id, "highlighted", !item.highlighted)}
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.highlighted ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-white/5 text-white/20 border-white/10"
                    }`}
                >
                  {item.highlighted ? "★ Highlighted" : "Regular"}
                </button>
              </div>

              <div className="h-4 w-px bg-white/5 mx-2" />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase text-text-muted tracking-widest mr-2">Included in:</span>
                {product.plans.map((plan: any) => {
                  const isIncluded = (item.includedInPlanIds || []).includes(plan.id);
                  return (
                    <button
                      key={plan.id}
                      onClick={() => togglePlanInFeature(item.id, plan.id)}
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-bold transition-all border ${isIncluded ? "bg-primary text-white border-primary" : "bg-white/5 text-text-muted border-white/10"
                        }`}
                    >
                      {plan.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
