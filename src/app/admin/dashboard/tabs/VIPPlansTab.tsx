"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Plus, X, Pencil, Trash2, Check, DollarSign, Star,
  Gem, Shield, Sparkles, Type, Bell, HelpCircle, Image, Link as LinkIcon,
  ChevronRight, Percent, Clock, Settings, Zap, Tag, Rocket, GripVertical,
} from 'lucide-react';
import { useVIPPlans, useUpdateVIPPlan, useDeleteVIPPlan } from '@/hooks/useVIP';
import { toast } from 'sonner';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function VIPPlansTab() {
  const { data: plans, isLoading } = useVIPPlans();
  const updatePlan = useUpdateVIPPlan();
  const deletePlan = useDeleteVIPPlan();

  const [showEditor, setShowEditor] = useState(false);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2 flex items-center gap-4">
            <Crown className="w-10 h-10 text-amber-500" /> VIP Flagship
          </h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">Manage the flagship VIP plan — Official + Starter pricing tracks</p>
        </div>
      </div>

      <div className="space-y-6">
        {(plans || []).length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
            <Crown className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
            <p className="text-white/40 font-bold text-lg mb-4">No VIP plan yet</p>
            <button
              onClick={() => { setEditPlan({ featured: true, visible: true, order: 0, enableDiscount: false, discountPercent: 30, bulletPoints: [], keyHighlights: [], featureList: [], notices: [], faqs: [] }); setActiveTab('content'); setShowEditor(true); }}
              className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all inline-flex items-center gap-2"
            ><Plus className="w-4 h-4" /> Create VIP Plan</button>
          </div>
        )}

        {(plans || []).map((plan: any, idx: number) => {
          const hasDiscount = plan.enableDiscount && plan.discountPercent > 0;
          const calcDiscountBDT = hasDiscount ? Math.round(plan.officialPriceBDT * (1 - plan.discountPercent / 100)) : 0;
          const calcDiscountUSDT = hasDiscount ? Math.round(plan.officialPriceUSDT * (1 - plan.discountPercent / 100)) : 0;

          return (
            <motion.div key={plan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group"
            >
              {plan.featured && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3 h-3" /> Flagship Product
                </div>
              )}
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                <div className="w-28 h-28 rounded-3xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                  {plan.image && <img src={plan.image} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1 text-center lg:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">{plan.badgeEn}</span>
                    {!plan.visible && <span className="text-red-400 text-[9px] font-black uppercase">Hidden</span>}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{plan.titleEn}</h3>
                  <p className="text-text-muted text-sm max-w-2xl">{plan.shortDescriptionEn}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="font-bold text-sm px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">Official: {plan.officialPriceBDT?.toLocaleString()} BDT</span>
                    <span className="font-bold text-sm px-3 py-1 rounded-lg bg-white/5 text-white border border-white/10">Starter: {plan.starterPriceBDT?.toLocaleString()} BDT</span>
                    {hasDiscount && <span className="px-3 py-1 rounded-full bg-success/10 text-success text-[9px] font-black uppercase">{plan.discountPercent}% OFF</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setEditPlan({ ...plan }); setActiveTab('content'); setShowEditor(true); }}
                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(plan._id)}
                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Two pricing track cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
                {/* Official Track */}
                <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Official Track</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Price</p>
                      <p className="text-sm font-bold text-amber-500">{plan.officialPriceBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.officialPriceUSDT} USDT</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Start</p>
                      <p className="text-sm font-bold text-white">{plan.officialStarterBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.officialStarterUSDT} USDT</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Monthly</p>
                      <p className="text-sm font-bold text-white">{plan.officialMonthlyBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.officialMonthlyUSDT} USDT</p>
                    </div>
                    {hasDiscount && (
                      <div className="col-span-3 p-3 rounded-xl bg-success/10 border border-success/20 text-center">
                        <p className="text-[8px] font-black uppercase tracking-widest text-success">{plan.discountPercent}% OFF Discount</p>
                        <p className="text-sm font-bold text-success">{calcDiscountBDT?.toLocaleString()} BDT / {calcDiscountUSDT} USDT</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Starter Track */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Rocket className="w-4 h-4 text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Starter Track</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Official</p>
                      <p className="text-sm font-bold text-white">{plan.starterOfficialBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.starterOfficialUSDT} USDT</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Price</p>
                      <p className="text-sm font-bold text-white">{plan.starterPriceBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.starterPriceUSDT} USDT</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Monthly</p>
                      <p className="text-sm font-bold text-white">{plan.starterMonthlyBDT?.toLocaleString()} BDT</p>
                      <p className="text-[9px] text-text-muted">{plan.starterMonthlyUSDT} USDT</p>
                    </div>
                    <div className={`p-3 rounded-xl text-center ${plan.starterEnableDiscount && plan.starterDiscountPercent ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/[0.02] border border-white/5'}`}>
                      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Discount</p>
                      {plan.starterEnableDiscount && plan.starterDiscountPercent ? (
                        <>
                          <p className="text-sm font-bold text-amber-500">{plan.starterDiscountPercent}% OFF</p>
                          <p className="text-[9px] text-amber-500/60">{Math.round(plan.starterOfficialBDT * (1 - plan.starterDiscountPercent / 100))?.toLocaleString()} BDT</p>
                        </>
                      ) : (
                        <p className="text-sm text-white/20 font-bold">—</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && editPlan && (
          <PlanEditorModal
            plan={editPlan}
            setPlan={setEditPlan}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onClose={() => setShowEditor(false)}
            onSave={async () => {
              if (!editPlan.titleEn) { toast.error('Title is required'); return; }
              try {
                await updatePlan.mutateAsync(editPlan);
                setShowEditor(false);
              } catch { toast.error('Failed to save plan'); }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirm
            onConfirm={() => { deletePlan.mutate(showDeleteConfirm); setShowDeleteConfirm(null); }}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', multiline = false, suffix, hint }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1 flex items-center justify-between">
        <span>{label}</span>
        {hint && <span className="text-white/20 text-[8px]">{hint}</span>}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
            className="admin-input min-h-[80px] w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
        ) : (
          <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
            className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
        )}
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">{suffix}</span>}
      </div>
    </div>
  );
}

function Toggle({ value, onChange, label, desc }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
      <div>
        <span className="text-sm font-bold">{label}</span>
        {desc && <p className="text-[10px] text-text-muted font-medium">{desc}</p>}
      </div>
      <button onClick={onChange}
        className={`w-14 h-8 rounded-full transition-all relative ${value ? 'bg-amber-500' : 'bg-white/10'}`}>
        <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow-lg ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

function PlanEditorModal({ plan, setPlan, activeTab, setActiveTab, onClose, onSave }: any) {
  const tabs = [
    { id: 'content', label: 'Content', icon: Crown },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'installment', label: 'Installment', icon: Percent },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'bullets', label: 'Bullets', icon: Type },
    { id: 'highlights', label: 'Highlights', icon: Sparkles },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  const update = (field: string, val: any) => setPlan({ ...plan, [field]: val });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-7xl h-[90vh] bg-[#020617] rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">{plan._id ? 'Edit VIP Plan' : 'New VIP Plan'}</h3>
              <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{plan.titleEn || 'Draft'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-text-muted hover:text-white font-bold text-sm tracking-widest uppercase px-6">Cancel</button>
            <button onClick={onSave} className="bg-amber-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2">
              <Check className="w-4 h-4" /> Save Plan
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 border-r border-white/5 p-6 bg-white/[0.01] flex flex-col gap-2 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'group-hover:text-amber-500'}`} />
                  <span className="font-bold text-sm">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'content' && <ContentEditor plan={plan} update={update} />}
                {activeTab === 'pricing' && <PricingEditor plan={plan} update={update} />}
                {activeTab === 'installment' && <InstallmentEditor plan={plan} update={update} />}
                {activeTab === 'settings' && <SettingsEditor plan={plan} update={update} />}
                {activeTab === 'bullets' && <BulkModeEditor label="Bullet Points" items={plan.bulletPoints || []} onChange={(v: any) => update('bulletPoints', v)} enLabel="Point (EN)" bnLabel="পয়েন্ট (BN)" hasHighlight />}
                {activeTab === 'highlights' && <BulkModeEditor label="Key Highlights" items={plan.keyHighlights || []} onChange={(v: any) => update('keyHighlights', v)} enLabel="Highlight (EN)" bnLabel="হাইলাইট (BN)" />}
                {activeTab === 'features' && <FeatureListEditor plan={plan} update={update} />}
                {activeTab === 'notices' && <NoticesEditor plan={plan} update={update} />}
                {activeTab === 'faqs' && <FAQEditor plan={plan} update={update} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContentEditor({ plan, update }: any) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <h4 className="text-amber-500 font-black text-xs uppercase tracking-[3px] border-l-4 border-amber-500 pl-4">English Core</h4>
          <InputField label="Title" value={plan.titleEn} onChange={(v: any) => update('titleEn', v)} />
          <InputField label="Subtitle" value={plan.subtitleEn} onChange={(v: any) => update('subtitleEn', v)} />
          <InputField label="Badge" value={plan.badgeEn} onChange={(v: any) => update('badgeEn', v)} />
          <InputField label="Short Description" value={plan.shortDescriptionEn} onChange={(v: any) => update('shortDescriptionEn', v)} multiline />
          <InputField label="Button Text" value={plan.buttonTextEn} onChange={(v: any) => update('buttonTextEn', v)} />
        </div>
        <div className="space-y-8">
          <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Bangla Core</h4>
          <InputField label="টাইটেল" value={plan.titleBn} onChange={(v: any) => update('titleBn', v)} />
          <InputField label="সাবটাইটেল" value={plan.subtitleBn} onChange={(v: any) => update('subtitleBn', v)} />
          <InputField label="ব্যাজ" value={plan.badgeBn} onChange={(v: any) => update('badgeBn', v)} />
          <InputField label="সংক্ষিপ্ত বর্ণনা" value={plan.shortDescriptionBn} onChange={(v: any) => update('shortDescriptionBn', v)} multiline />
          <InputField label="বাটন টেক্সট" value={plan.buttonTextBn} onChange={(v: any) => update('buttonTextBn', v)} />
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 space-y-8">
        <h4 className="text-info font-black text-xs uppercase tracking-[3px] border-l-4 border-info pl-4">Links & Media</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InputField label="Image URL" value={plan.image} onChange={(v: any) => update('image', v)} />
          <InputField label="Telegram Link" value={plan.telegramLink} onChange={(v: any) => update('telegramLink', v)} />
          <InputField label="Telegram Post Link" value={plan.tgPostLink} onChange={(v: any) => update('tgPostLink', v)} />
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex items-center gap-8">
        <Toggle value={plan.featured} onChange={() => update('featured', !plan.featured)} label="Featured" />
        <Toggle value={plan.visible} onChange={() => update('visible', !plan.visible)} label="Visible" />
        <InputField label="Order" type="number" value={plan.order} onChange={(v: any) => update('order', Number(v))} />
      </div>
    </div>
  );
}

function PricingEditor({ plan, update }: any) {
  const hasDiscount = plan.enableDiscount;
  const calcDiscountBDT = hasDiscount && plan.officialPriceBDT
    ? Math.round(plan.officialPriceBDT * (1 - (plan.discountPercent || 0) / 100))
    : 0;
  const calcDiscountUSDT = hasDiscount && plan.officialPriceUSDT
    ? Math.round(plan.officialPriceUSDT * (1 - (plan.discountPercent || 0) / 100))
    : 0;
  const savingBDT = calcDiscountBDT ? plan.officialPriceBDT - calcDiscountBDT : 0;
  const savingPercent = hasDiscount ? plan.discountPercent : 0;

  return (
    <div className="space-y-16">
      {/* ═══ Official Track ═══ */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-amber-500">Official Track</h3>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Premium pricing with optional discount</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[3px] border-l-4 border-amber-500/40 pl-4">BDT</h4>
            <InputField label="Official Price BDT" type="number" value={plan.officialPriceBDT} onChange={(v: any) => update('officialPriceBDT', Number(v))} />
            <InputField label="Starter Price BDT" type="number" value={plan.officialStarterBDT} onChange={(v: any) => update('officialStarterBDT', Number(v))} />
            <InputField label="Monthly Payment BDT" type="number" value={plan.officialMonthlyBDT} onChange={(v: any) => update('officialMonthlyBDT', Number(v))} />
          </div>
          <div className="space-y-6">
            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[3px] border-l-4 border-info/40 pl-4">USDT</h4>
            <InputField label="Official Price USDT" type="number" value={plan.officialPriceUSDT} onChange={(v: any) => update('officialPriceUSDT', Number(v))} />
            <InputField label="Starter Price USDT" type="number" value={plan.officialStarterUSDT} onChange={(v: any) => update('officialStarterUSDT', Number(v))} />
            <InputField label="Monthly Payment USDT" type="number" value={plan.officialMonthlyUSDT} onChange={(v: any) => update('officialMonthlyUSDT', Number(v))} />
          </div>
        </div>

        {/* Discount for Official */}
        <div className="mt-8 p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10">
          <h4 className="text-amber-500 font-black text-xs uppercase tracking-[3px] flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" /> Optional Discount
          </h4>
          <Toggle
            value={plan.enableDiscount}
            onChange={() => update('enableDiscount', !plan.enableDiscount)}
            label="Enable Discount"
            desc="Show discounted price on the Official track"
          />
          {hasDiscount && (
            <div className="mt-4">
              <InputField label="Discount Percent" type="number" value={plan.discountPercent} onChange={(v: any) => update('discountPercent', Number(v))} suffix="%" />
            </div>
          )}
          {hasDiscount && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Discounted (BDT)</p>
                <p className="text-2xl font-black text-amber-500">{calcDiscountBDT?.toLocaleString()} BDT</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Discounted (USDT)</p>
                <p className="text-2xl font-black text-amber-500">{calcDiscountUSDT?.toLocaleString()} USDT</p>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-success mb-1">You Save</p>
                <p className="text-xl font-black text-success">{savingBDT?.toLocaleString()} BDT <span className="block text-xs">({savingPercent}% OFF)</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Starter Track ═══ */}
      <div className="pt-10 border-t border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <Rocket className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Starter Track</h3>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Budget-friendly entry pricing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[3px] border-l-4 border-white/20 pl-4">BDT</h4>
            <InputField label="Official Price BDT" type="number" value={plan.starterOfficialBDT} onChange={(v: any) => update('starterOfficialBDT', Number(v))} hint="Total amount for this plan" />
            <InputField label="Starter Price BDT" type="number" value={plan.starterPriceBDT} onChange={(v: any) => update('starterPriceBDT', Number(v))} />
            <InputField label="Monthly Payment BDT" type="number" value={plan.starterMonthlyBDT} onChange={(v: any) => update('starterMonthlyBDT', Number(v))} />
          </div>
          <div className="space-y-6">
            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[3px] border-l-4 border-info/40 pl-4">USDT</h4>
            <InputField label="Official Price USDT" type="number" value={plan.starterOfficialUSDT} onChange={(v: any) => update('starterOfficialUSDT', Number(v))} hint="Total amount for this plan" />
            <InputField label="Starter Price USDT" type="number" value={plan.starterPriceUSDT} onChange={(v: any) => update('starterPriceUSDT', Number(v))} />
            <InputField label="Monthly Payment USDT" type="number" value={plan.starterMonthlyUSDT} onChange={(v: any) => update('starterMonthlyUSDT', Number(v))} />
          </div>
        </div>

        {/* Optional Discount for Starter */}
        <div className="mt-8 p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10">
          <h4 className="text-amber-500 font-black text-xs uppercase tracking-[3px] flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" /> Optional Discount (Starter)
          </h4>
          <Toggle
            value={plan.starterEnableDiscount}
            onChange={() => update('starterEnableDiscount', !plan.starterEnableDiscount)}
            label="Enable Discount"
            desc="Show discounted price on the Starter track"
          />
          {plan.starterEnableDiscount && (
            <div className="mt-4">
              <InputField label="Discount Percent" type="number" value={plan.starterDiscountPercent} onChange={(v: any) => update('starterDiscountPercent', Number(v))} suffix="%" />
            </div>
          )}
          {plan.starterEnableDiscount && plan.starterOfficialBDT && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Discounted (BDT)</p>
                <p className="text-2xl font-black text-amber-500">{Math.round(plan.starterOfficialBDT * (1 - (plan.starterDiscountPercent || 0) / 100))?.toLocaleString()} BDT</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Discounted (USDT)</p>
                <p className="text-2xl font-black text-amber-500">{Math.round(plan.starterOfficialUSDT * (1 - (plan.starterDiscountPercent || 0) / 100))?.toLocaleString()} USDT</p>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-success mb-1">You Save</p>
                <p className="text-xl font-black text-success">
                  {(plan.starterOfficialBDT - Math.round(plan.starterOfficialBDT * (1 - (plan.starterDiscountPercent || 0) / 100)))?.toLocaleString()} BDT
                  <span className="block text-xs">({plan.starterDiscountPercent || 0}% OFF)</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InstallmentEditor({ plan, update }: any) {
  return (
    <div className="space-y-12">
      <Toggle
        value={plan.enableInstallments}
        onChange={() => update('enableInstallments', !plan.enableInstallments)}
        label="Enable Installments"
        desc="Allow users to pay in installments"
      />
      {plan.enableInstallments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <InputField label="Due Every (Days)" type="number" value={plan.dueEveryDays} onChange={(v: any) => update('dueEveryDays', Number(v))} />
          <InputField label="Reminder Before (Days)" type="number" value={plan.reminderBeforeDays} onChange={(v: any) => update('reminderBeforeDays', Number(v))} />
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-muted">Auto Reminders</span>
            <button onClick={() => update('autoReminderEnabled', !plan.autoReminderEnabled)}
              className={`w-12 h-7 rounded-full transition-all relative ${plan.autoReminderEnabled ? 'bg-primary' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${plan.autoReminderEnabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsEditor({ plan, update }: any) {
  const flags = [
    { key: 'enableMembershipTracking', label: 'Membership Tracking', desc: 'Track member payments & progress' },
    { key: 'enableBanSystem', label: 'Ban System', desc: 'Allow banning/unbanning members' },
    { key: 'enableReminderSystem', label: 'Reminder System', desc: 'Send payment reminders' },
    { key: 'enableNotifications', label: 'Notifications', desc: 'Send membership notifications' },
    { key: 'autoReminderEnabled', label: 'Auto Reminders', desc: 'Automatically remind before due date' },
  ];

  return (
    <div className="space-y-6">
      <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">Feature Flags</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((flag) => (
          <div key={flag.key} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-sm font-bold">{flag.label}</span>
              <p className="text-[10px] text-text-muted font-medium">{flag.desc}</p>
            </div>
            <button onClick={() => update(flag.key, !plan[flag.key])}
              className={`w-12 h-7 rounded-full transition-all relative ${plan[flag.key] ? 'bg-primary' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${plan[flag.key] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BulkModeEditor({ label, items, onChange, enLabel, bnLabel, hasHighlight }: any) {
  const [mode, setMode] = useState<"textarea" | "list">("list");
  const [bulkEn, setBulkEn] = useState("");
  const [bulkBn, setBulkBn] = useState("");

  useEffect(() => {
    if (mode === "textarea") {
      setBulkEn(items.map((i: any) => i.textEn).join("\n"));
      setBulkBn(items.map((i: any) => i.textBn).join("\n"));
    }
  }, [mode, items]);

  const handleBulkParse = () => {
    const parse = (text: string) =>
      text
        .split(/[,\n]/)
        .map((s) => s.trim().replace(/^[\u2713\u2714\u2022\-\*]\s*/, ""))
        .filter(Boolean);

    const itemsEn = parse(bulkEn);
    const itemsBn = parse(bulkBn);
    const maxLength = Math.max(itemsEn.length, itemsBn.length);
    const newItems = [];

    for (let i = 0; i < maxLength; i++) {
      const textEn = itemsEn[i] || "";
      const textBn = itemsBn[i] || textEn;
      const existing = items[i];
      newItems.push({
        id: existing?.id || Date.now().toString() + Math.random().toString(36).substring(7),
        textEn,
        textBn,
        visible: existing?.visible ?? true,
        order: i,
        highlighted: hasHighlight ? (existing?.highlighted ?? false) : undefined,
      });
    }

    onChange(newItems);
    toast.success(`Parsed ${newItems.length} ${label.toLowerCase()}!`);
    setMode("list");
  };

  const addItem = () => {
    const base: any = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      textEn: '',
      textBn: '',
      visible: true,
      order: items.length,
    };
    if (hasHighlight) base.highlighted = false;
    onChange([...items, base]);
  };

  const updateItem = (id: string, field: string, val: any) => {
    onChange(items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((i: any) => i.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i.id === active.id);
      const newIndex = items.findIndex((i: any) => i.id === over.id);
      onChange(arrayMove(items, oldIndex, newIndex).map((item: any, index: number) => ({ ...item, order: index })));
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">{label}</h4>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 p-1 rounded-xl flex">
            <button onClick={() => setMode("list")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "list" ? "bg-primary text-white" : "text-white/50 hover:text-white"}`}>List View</button>
            <button onClick={() => setMode("textarea")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "textarea" ? "bg-primary text-white" : "text-white/50 hover:text-white"}`}>Bulk Mode</button>
          </div>
          {mode === "list" && (
            <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all">
              <Plus className="w-4 h-4" /> Add One
            </button>
          )}
        </div>
      </div>

      {mode === "textarea" ? (
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <p className="text-primary text-sm font-medium">
              <span className="font-bold">Smart Bulk Import:</span> Paste
              {label.toLowerCase()} separated by commas or new lines. Special symbols will be automatically cleaned!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{enLabel}s</label>
              <textarea value={bulkEn} onChange={(e) => setBulkEn(e.target.value)}
                placeholder={`${enLabel} One&#10;${enLabel} Two...`}
                className="admin-input min-h-[300px] w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{bnLabel}s</label>
              <textarea value={bulkBn} onChange={(e) => setBulkBn(e.target.value)}
                placeholder={`${bnLabel} One&#10;${bnLabel} Two...`}
                className="admin-input min-h-[300px] w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
            </div>
          </div>
          <button onClick={handleBulkParse}
            className="w-full bg-primary hover:bg-primary/80 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">
            Auto Parse & Create {label}
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {items.map((item: any) => (
                <SortableItem key={item.id} item={item} updateItem={updateItem} removeItem={removeItem} enLabel={enLabel} bnLabel={bnLabel} hasHighlight={hasHighlight} />
              ))}
              {items.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-[32px]">
                  <p className="text-white/40">No {label.toLowerCase()} yet. Switch to Bulk Mode or click Add One.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableItem({ item, updateItem, removeItem, enLabel, bnLabel, hasHighlight }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`p-6 rounded-2xl border relative group transition-all ${isDragging ? 'opacity-50 border-primary bg-primary/5' : 'bg-white/[0.02] border-white/5'}`}>
      <div className="flex items-start gap-4">
        <button {...attributes} {...listeners} className="mt-2 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors flex-shrink-0">
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label={enLabel} value={item.textEn} onChange={(v: any) => updateItem(item.id, 'textEn', v)} />
          <InputField label={bnLabel} value={item.textBn} onChange={(v: any) => updateItem(item.id, 'textBn', v)} />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 ml-9">
        <button onClick={() => updateItem(item.id, 'visible', !item.visible)}
          className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.visible ? 'Visible' : 'Hidden'}</button>
        {hasHighlight && (
          <button onClick={() => updateItem(item.id, 'highlighted', !item.highlighted)}
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.highlighted ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.highlighted ? '★ Highlight' : 'Regular'}</button>
        )}
        <button onClick={() => removeItem(item.id)} className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

function FeatureListEditor({ plan, update }: any) {
  const items = plan.featureList || [];
  const addItem = () => {
    update('featureList', [...items, { id: Date.now().toString(), textEn: '', textBn: '', visible: true, highlighted: false, order: items.length }]);
  };
  const updateItem = (id: string, field: string, val: any) => {
    update('featureList', items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  };
  const removeItem = (id: string) => update('featureList', items.filter((i: any) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">Features</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all"><Plus className="w-4 h-4" /> Add Feature</button>
      </div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Feature (EN)" value={item.textEn} onChange={(v: any) => updateItem(item.id, 'textEn', v)} />
              <InputField label="ফিচার (BN)" value={item.textBn} onChange={(v: any) => updateItem(item.id, 'textBn', v)} />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => updateItem(item.id, 'visible', !item.visible)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.visible ? 'Visible' : 'Hidden'}</button>
              <button onClick={() => updateItem(item.id, 'highlighted', !item.highlighted)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.highlighted ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.highlighted ? '★ Highlight' : 'Regular'}</button>
              <button onClick={() => removeItem(item.id)} className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoticesEditor({ plan, update }: any) {
  const items = plan.notices || [];
  const addItem = () => {
    update('notices', [...items, { id: Date.now().toString(), textEn: '', textBn: '', visible: true, type: 'info' }]);
  };
  const updateItem = (id: string, field: string, val: any) => {
    update('notices', items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  };
  const removeItem = (id: string) => update('notices', items.filter((i: any) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">Notices</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all"><Plus className="w-4 h-4" /> Add Notice</button>
      </div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Notice (EN)" value={item.textEn} onChange={(v: any) => updateItem(item.id, 'textEn', v)} multiline />
              <InputField label="নোটিশ (BN)" value={item.textBn} onChange={(v: any) => updateItem(item.id, 'textBn', v)} multiline />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <select value={item.type} onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white">
                <option value="offer">Offer</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
              </select>
              <button onClick={() => updateItem(item.id, 'visible', !item.visible)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.visible ? 'Visible' : 'Hidden'}</button>
              <button onClick={() => removeItem(item.id)} className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQEditor({ plan, update }: any) {
  const items = plan.faqs || [];
  const addItem = () => {
    update('faqs', [...items, { id: Date.now().toString(), qEn: '', qBn: '', aEn: '', aBn: '', visible: true, order: items.length }]);
  };
  const updateItem = (id: string, field: string, val: any) => {
    update('faqs', items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  };
  const removeItem = (id: string) => update('faqs', items.filter((i: any) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">FAQs</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Question (EN)" value={item.qEn} onChange={(v: any) => updateItem(item.id, 'qEn', v)} />
              <InputField label="প্রশ্ন (BN)" value={item.qBn} onChange={(v: any) => updateItem(item.id, 'qBn', v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <InputField label="Answer (EN)" value={item.aEn} onChange={(v: any) => updateItem(item.id, 'aEn', v)} multiline />
              <InputField label="উত্তর (BN)" value={item.aBn} onChange={(v: any) => updateItem(item.id, 'aBn', v)} multiline />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => updateItem(item.id, 'visible', !item.visible)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.visible ? 'Visible' : 'Hidden'}</button>
              <button onClick={() => removeItem(item.id)} className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="bg-[#020617] border border-red-500/20 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-black tracking-tighter mb-2 text-red-500">Delete VIP Plan?</h3>
        <p className="text-text-muted mb-8">This action cannot be undone.</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
