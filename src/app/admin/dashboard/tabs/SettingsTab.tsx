'use client';

import React, { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useCMS';
import { 
  Monitor, 
  Wallet, 
  Globe, 
  Layout, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Headset,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsTab() {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Site Configuration</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">Global settings and section content</p>
        </div>

        <button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <Save className="w-5 h-5" />
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Navigation Sidebar (Local) */}
        <div className="xl:col-span-3 space-y-4 sticky top-32">
           <div className="glass-card rounded-[32px] p-4 border-white/5 bg-white/[0.01]">
              {['Hero', 'Site Info', 'Payments', 'Countdown', 'Footer'].map((section) => (
                <button 
                  key={section}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-[2px] text-text-muted group-hover:text-text-primary transition-all">{section}</span>
                  <ChevronRight className="w-4 h-4 text-white/5 group-hover:text-primary transition-all" />
                </button>
              ))}
           </div>
           
           <div className="p-8 rounded-[32px] bg-warning/5 border border-warning/10 border-dashed">
              <div className="flex items-center gap-3 mb-4 text-warning">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[2px]">Warning</span>
              </div>
              <p className="text-xs font-bold text-warning/70 leading-relaxed">Changes made here are applied globally across the entire platform immediately after saving.</p>
           </div>
        </div>

        {/* Form Sections */}
        <div className="xl:col-span-9 space-y-12">
          
          {/* Hero Section */}
          <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Hero Content</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Hero Title (EN)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  value={localSettings.hero?.titleEn}
                  onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, titleEn: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Accent Title (EN)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-primary"
                  value={localSettings.hero?.titleAccentEn}
                  onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, titleAccentEn: e.target.value}})}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Description (EN)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px]"
                  value={localSettings.hero?.descriptionEn}
                  onChange={(e) => setLocalSettings({...localSettings, hero: {...localSettings.hero, descriptionEn: e.target.value}})}
                />
              </div>
            </div>
          </section>

          {/* Payment Methods */}
          <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5 relative overflow-hidden">
             <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success border border-success/20">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter">Payment Methods</h3>
              </div>
              <button 
                onClick={() => {
                   const methods = [...(localSettings.paymentMethods || [])];
                   methods.push({ id: Date.now().toString(), name: 'New Method', number: '', enabled: true, color: '#ffffff', order: methods.length + 1 });
                   setLocalSettings({...localSettings, paymentMethods: methods});
                }}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              {(localSettings.paymentMethods || []).map((method: any, idx: number) => (
                <div key={method.id || idx} className="space-y-6 bg-white/[0.02] p-8 lg:p-10 rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Basic Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Name (e.g. bKash)</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={method.name}
                          onChange={(e) => {
                            const methods = [...localSettings.paymentMethods];
                            methods[idx].name = e.target.value;
                            setLocalSettings({...localSettings, paymentMethods: methods});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Receiver Number</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={method.number}
                          onChange={(e) => {
                            const methods = [...localSettings.paymentMethods];
                            methods[idx].number = e.target.value;
                            setLocalSettings({...localSettings, paymentMethods: methods});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Account Holder</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={method.accountHolder}
                          onChange={(e) => {
                            const methods = [...localSettings.paymentMethods];
                            methods[idx].accountHolder = e.target.value;
                            setLocalSettings({...localSettings, paymentMethods: methods});
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Account Type (EN)</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                          value={method.accountTypeEn}
                          onChange={(e) => {
                            const methods = [...localSettings.paymentMethods];
                            methods[idx].accountTypeEn = e.target.value;
                            setLocalSettings({...localSettings, paymentMethods: methods});
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Theme</label>
                        <input 
                          type="color"
                          className="w-12 h-12 bg-transparent cursor-pointer rounded-xl"
                          value={method.color}
                          onChange={(e) => {
                            const methods = [...localSettings.paymentMethods];
                            methods[idx].color = e.target.value;
                            setLocalSettings({...localSettings, paymentMethods: methods});
                          }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const methods = localSettings.paymentMethods.filter((_: any, i: number) => i !== idx);
                          setLocalSettings({...localSettings, paymentMethods: methods});
                        }}
                        className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 mt-6"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Advanced Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Payment Instructions (EN) - Use new lines</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px]"
                        value={method.instructionsEn}
                        onChange={(e) => {
                          const methods = [...localSettings.paymentMethods];
                          methods[idx].instructionsEn = e.target.value;
                          setLocalSettings({...localSettings, paymentMethods: methods});
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-text-muted uppercase tracking-[2px]">Warning Message (EN)</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[100px] text-warning"
                        value={method.warningTextEn}
                        onChange={(e) => {
                          const methods = [...localSettings.paymentMethods];
                          methods[idx].warningTextEn = e.target.value;
                          setLocalSettings({...localSettings, paymentMethods: methods});
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Site Info */}
          <section className="glass-card rounded-[48px] p-8 lg:p-12 border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
              <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center text-info border border-info/20">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Global Site Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Telegram Official Link</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  value={localSettings.site?.telegramLink}
                  onChange={(e) => setLocalSettings({...localSettings, site: {...localSettings.site, telegramLink: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Telegram Handle</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  value={localSettings.site?.telegramHandle}
                  onChange={(e) => setLocalSettings({...localSettings, site: {...localSettings.site, telegramHandle: e.target.value}})}
                />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
