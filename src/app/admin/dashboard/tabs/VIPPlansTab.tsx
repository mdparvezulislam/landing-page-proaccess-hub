"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Plus, X, Pencil, Trash2, Check, DollarSign, Star,
  Gem, Shield, Sparkles, Type, HelpCircle, Bell, Image, Link as LinkIcon,
  ChevronRight, Percent, Clock, Calendar, ToggleLeft, ToggleRight,
  BadgeDollarSign, AlertTriangle, Settings, Zap
} from 'lucide-react';
import { useVIPPlans, useUpdateVIPPlan, useDeleteVIPPlan } from '@/hooks/useVIP';
import { toast } from 'sonner';

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
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">Manage the single flagship VIP plan — pricing, content & settings</p>
        </div>
      </div>

      <div className="space-y-6">
        {(plans || []).length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-[32px]">
            <Crown className="w-16 h-16 text-amber-500/30 mx-auto mb-4" />
            <p className="text-white/40 font-bold text-lg mb-4">No VIP plan yet</p>
            <button
              onClick={() => { setEditPlan({ featured: true, visible: true, order: 0, bulletPoints: [], keyHighlights: [], featureList: [], notices: [], faqs: [] }); setActiveTab('content'); setShowEditor(true); }}
              className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-600 transition-all inline-flex items-center gap-2"
            ><Plus className="w-4 h-4" /> Create VIP Plan</button>
          </div>
        )}

        {(plans || []).map((plan: any, idx: number) => (
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
                <div className="flex flex-wrap items-center gap-6 mt-3">
                  <span className="font-bold text-lg">{plan.discountPriceBDT?.toLocaleString()} BDT</span>
                  <span className="line-through text-text-muted">{plan.regularPriceBDT?.toLocaleString()} BDT</span>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success text-[9px] font-black uppercase">Save {plan.discountPercent}%</span>
                  <span className="text-text-muted text-sm">Due every {plan.dueEveryDays}d</span>
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

            {/* Pricing Quick View */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-8 pt-8 border-t border-white/5">
              {[
                { label: 'Regular', bdt: plan.regularPriceBDT, usdt: plan.regularPriceUSDT },
                { label: 'Official', bdt: plan.officialPriceBDT, usdt: plan.officialPriceUSDT },
                { label: 'Discount', bdt: plan.discountPriceBDT, usdt: plan.discountPriceUSDT },
                { label: 'Starter', bdt: plan.starterPaymentBDT, usdt: plan.starterPaymentUSDT },
                { label: 'Starter/mo', bdt: plan.starterMonthlyBDT, usdt: plan.starterMonthlyUSDT },
                { label: 'Premium Start', bdt: plan.premiumStartBDT, usdt: plan.premiumStartUSDT },
                { label: 'Premium/mo', bdt: plan.premiumMonthlyBDT, usdt: plan.premiumMonthlyUSDT },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">{item.label}</p>
                  <p className="text-sm font-bold">{item.bdt?.toLocaleString()} BDT</p>
                  <p className="text-[10px] text-text-muted">{item.usdt} USDT</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
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

      {/* Delete Confirm */}
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

function InputField({ label, value, onChange, placeholder, type = 'text', multiline = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{label}</label>
      {multiline ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="admin-input min-h-[80px] w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
      ) : (
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="admin-input w-full text-white placeholder:text-white/10 bg-white/[0.02] border-white/10" />
      )}
    </div>
  );
}

function PlanEditorModal({ plan, setPlan, activeTab, setActiveTab, onClose, onSave }: any) {
  const tabs = [
    { id: 'content', label: 'Content', icon: Crown },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'installment', label: 'Installment', icon: Percent },
    { id: 'offer', label: 'Limited Offer', icon: Zap },
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
                {activeTab === 'offer' && <OfferEditor plan={plan} update={update} />}
                {activeTab === 'settings' && <SettingsEditor plan={plan} update={update} />}
                {activeTab === 'bullets' && <ArrayEditor label="Bullet Points" items={plan.bulletPoints || []} onChange={(v: any) => update('bulletPoints', v)} enLabel="Point (EN)" bnLabel="পয়েন্ট (BN)" />}
                {activeTab === 'highlights' && <ArrayEditor label="Key Highlights" items={plan.keyHighlights || []} onChange={(v: any) => update('keyHighlights', v)} enLabel="Highlight (EN)" bnLabel="হাইলাইট (BN)" />}
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
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-muted">Featured</span>
          <button onClick={() => update('featured', !plan.featured)}
            className={`w-12 h-7 rounded-full transition-all relative ${plan.featured ? 'bg-amber-500' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${plan.featured ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-text-muted">Visible</span>
          <button onClick={() => update('visible', !plan.visible)}
            className={`w-12 h-7 rounded-full transition-all relative ${plan.visible ? 'bg-success' : 'bg-white/10'}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${plan.visible ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <InputField label="Order" type="number" value={plan.order} onChange={(v: any) => update('order', Number(v))} />
      </div>
    </div>
  );
}

function PricingEditor({ plan, update }: any) {
  return (
    <div className="space-y-12">
      <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">BDT Pricing</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InputField label="Regular Price BDT" type="number" value={plan.regularPriceBDT} onChange={(v: any) => update('regularPriceBDT', Number(v))} />
        <InputField label="Official Price BDT" type="number" value={plan.officialPriceBDT} onChange={(v: any) => update('officialPriceBDT', Number(v))} />
        <InputField label="Discount Price BDT" type="number" value={plan.discountPriceBDT} onChange={(v: any) => update('discountPriceBDT', Number(v))} />
        <InputField label="Total Payment BDT" type="number" value={plan.totalPaymentBDT} onChange={(v: any) => update('totalPaymentBDT', Number(v))} />
        <InputField label="Starter Payment BDT" type="number" value={plan.starterPaymentBDT} onChange={(v: any) => update('starterPaymentBDT', Number(v))} />
        <InputField label="Starter Monthly BDT" type="number" value={plan.starterMonthlyBDT} onChange={(v: any) => update('starterMonthlyBDT', Number(v))} />
        <InputField label="Premium Start BDT" type="number" value={plan.premiumStartBDT} onChange={(v: any) => update('premiumStartBDT', Number(v))} />
        <InputField label="Premium Monthly BDT" type="number" value={plan.premiumMonthlyBDT} onChange={(v: any) => update('premiumMonthlyBDT', Number(v))} />
      </div>

      <div className="pt-10 border-t border-white/5">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-6">USDT Pricing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InputField label="Regular Price USDT" type="number" value={plan.regularPriceUSDT} onChange={(v: any) => update('regularPriceUSDT', Number(v))} />
          <InputField label="Official Price USDT" type="number" value={plan.officialPriceUSDT} onChange={(v: any) => update('officialPriceUSDT', Number(v))} />
          <InputField label="Discount Price USDT" type="number" value={plan.discountPriceUSDT} onChange={(v: any) => update('discountPriceUSDT', Number(v))} />
          <InputField label="Total Payment USDT" type="number" value={plan.totalPaymentUSDT} onChange={(v: any) => update('totalPaymentUSDT', Number(v))} />
          <InputField label="Starter Payment USDT" type="number" value={plan.starterPaymentUSDT} onChange={(v: any) => update('starterPaymentUSDT', Number(v))} />
          <InputField label="Starter Monthly USDT" type="number" value={plan.starterMonthlyUSDT} onChange={(v: any) => update('starterMonthlyUSDT', Number(v))} />
          <InputField label="Premium Start USDT" type="number" value={plan.premiumStartUSDT} onChange={(v: any) => update('premiumStartUSDT', Number(v))} />
          <InputField label="Premium Monthly USDT" type="number" value={plan.premiumMonthlyUSDT} onChange={(v: any) => update('premiumMonthlyUSDT', Number(v))} />
        </div>
      </div>

      <div className="pt-10 border-t border-white/5">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4 mb-6">Discount</h4>
        <InputField label="Discount Percent" type="number" value={plan.discountPercent} onChange={(v: any) => update('discountPercent', Number(v))} />
      </div>
    </div>
  );
}

function InstallmentEditor({ plan, update }: any) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <div>
          <h4 className="font-black text-sm">Enable Installments</h4>
          <p className="text-xs text-text-muted">Allow users to pay in installments</p>
        </div>
        <button onClick={() => update('enableInstallments', !plan.enableInstallments)}
          className={`w-14 h-8 rounded-full transition-all relative ${plan.enableInstallments ? 'bg-primary' : 'bg-white/10'}`}>
          <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow-lg ${plan.enableInstallments ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

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

function OfferEditor({ plan, update }: any) {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <div>
          <h4 className="font-black text-sm flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Limited Offer</h4>
          <p className="text-xs text-text-muted">Enable a time-limited discounted price</p>
        </div>
        <button onClick={() => update('limitedOfferEnabled', !plan.limitedOfferEnabled)}
          className={`w-14 h-8 rounded-full transition-all relative ${plan.limitedOfferEnabled ? 'bg-amber-500' : 'bg-white/10'}`}>
          <div className={`w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow-lg ${plan.limitedOfferEnabled ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      {plan.limitedOfferEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <InputField label="Offer Price BDT" type="number" value={plan.limitedOfferPriceBDT} onChange={(v: any) => update('limitedOfferPriceBDT', Number(v))} />
          <InputField label="Offer Price USDT" type="number" value={plan.limitedOfferPriceUSDT} onChange={(v: any) => update('limitedOfferPriceUSDT', Number(v))} />
          <InputField label="Limited Slots" type="number" value={plan.limitedOfferSlots} onChange={(v: any) => update('limitedOfferSlots', Number(v))} />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Offer Expire Date</label>
            <input type="datetime-local"
              value={plan.limitedOfferExpireDate ? new Date(plan.limitedOfferExpireDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => update('limitedOfferExpireDate', new Date(e.target.value).toISOString())}
              className="admin-input w-full text-white bg-[#020617] border-white/10" />
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

function ArrayEditor({ label, items, onChange, enLabel, bnLabel }: any) {
  const addItem = () => {
    onChange([...items, { id: Date.now().toString(), textEn: '', textBn: '', visible: true, order: items.length, highlighted: false }]);
  };
  const updateItem = (id: string, field: string, val: any) => {
    onChange(items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  };
  const removeItem = (id: string) => onChange(items.filter((i: any) => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">{label}</h4>
        <button onClick={addItem} className="bg-white/5 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 relative group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label={enLabel} value={item.textEn} onChange={(v: any) => updateItem(item.id, 'textEn', v)} />
              <InputField label={bnLabel} value={item.textBn} onChange={(v: any) => updateItem(item.id, 'textBn', v)} />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => updateItem(item.id, 'visible', !item.visible)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.visible ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.visible ? 'Visible' : 'Hidden'}</button>
              {'highlighted' in item && (
                <button onClick={() => updateItem(item.id, 'highlighted', !item.highlighted)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${item.highlighted ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-white/20 border-white/10'}`}>{item.highlighted ? '★ Highlight' : 'Regular'}</button>
              )}
              <button onClick={() => removeItem(item.id)} className="ml-auto w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl"><p className="text-white/40 text-sm">No items yet</p></div>}
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
