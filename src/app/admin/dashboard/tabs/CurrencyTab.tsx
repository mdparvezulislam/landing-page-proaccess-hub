"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Save, RefreshCw, AlertCircle, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export default function CurrencyTab() {
  const { usdtRate, setUsdtRate } = useCurrencyStore();
  const [rate, setRate] = useState(usdtRate);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, we would also save this to MongoDB
      // For now, we update the global Zustand store which persists to localStorage
      setUsdtRate(Number(rate));
      setLastUpdated(new Date().toLocaleTimeString());
      toast.success("Currency settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-4 lg:space-y-12 pb-8 lg:pb-20">
      <div>
        <h2 className="text-2xl lg:text-5xl font-black tracking-tighter mb-1 lg:mb-2">Currency Engine</h2>
        <p className="text-text-muted font-black uppercase text-[8px] lg:text-[10px] tracking-[2px] lg:tracking-[4px]">
          Global exchange rates and pricing logic
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        {/* Rate Setting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[24px] lg:rounded-[40px] p-4 lg:p-12 border-white/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 lg:mb-8 border border-primary/20">
              <Coins className="w-5 h-5 lg:w-8 lg:h-8" />
            </div>
            
            <h3 className="text-lg lg:text-2xl font-black tracking-tight text-white mb-1 lg:mb-2">USDT Conversion Rate</h3>
            <p className="text-text-muted text-[11px] lg:text-sm font-medium mb-4 lg:mb-8">Set the value of 1 USDT in Bangladeshi Taka (BDT). This affects all prices globally.</p>
            
            <div className="space-y-4 lg:space-y-6">
              <div className="space-y-1.5 lg:space-y-2">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-[1px] lg:tracking-[2px] text-text-muted ml-1">1 USDT Equals</label>
                <div className="relative">
                  <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
                    className="admin-input w-full text-xl lg:text-3xl font-black tracking-tighter py-4 lg:py-6 pl-5 lg:pl-8 pr-16 lg:pr-20 text-white" />
                  <span className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 text-sm lg:text-lg font-black text-white/20">BDT</span>
                </div>
              </div>

              <button onClick={handleSave} disabled={isSaving}
                className="w-full bg-primary hover:bg-primary-light text-white py-4 lg:py-6 rounded-xl lg:rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 lg:gap-3">
                {isSaving ? <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" /> : <Save className="w-4 h-4 lg:w-5 lg:h-5" />}
                Save Changes
              </button>
              
              {lastUpdated && (
                <p className="text-center text-[9px] lg:text-[10px] font-black text-success uppercase tracking-widest">
                  Last Updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Global Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[24px] lg:rounded-[40px] p-4 lg:p-12 border-white/5 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 lg:mb-8 border border-secondary/20">
              <AlertCircle className="w-5 h-5 lg:w-8 lg:h-8" />
            </div>
            
            <h3 className="text-lg lg:text-2xl font-black tracking-tight text-white mb-1 lg:mb-2">System Defaults</h3>
            <p className="text-text-muted text-[11px] lg:text-sm font-medium mb-4 lg:mb-8">Configure how currency switching behaves for end users.</p>
            
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between p-3 lg:p-6 rounded-xl lg:rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="min-w-0 mr-2">
                  <span className="block font-black text-[11px] lg:text-sm text-white">Enable Multi-Currency</span>
                  <span className="text-[8px] lg:text-[10px] font-bold text-text-muted uppercase">Allow users to toggle BDT/USDT</span>
                </div>
                <ToggleRight className="w-8 h-8 lg:w-10 lg:h-10 text-primary cursor-pointer flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between p-3 lg:p-6 rounded-xl lg:rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="min-w-0 mr-2">
                  <span className="block font-black text-[11px] lg:text-sm text-white">Default Currency</span>
                  <span className="text-[8px] lg:text-[10px] font-bold text-text-muted uppercase">Base currency for new sessions</span>
                </div>
                <span className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl bg-white/5 text-[9px] lg:text-[10px] font-black text-white flex-shrink-0">BDT</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Section */}
      <div className="pt-6 lg:pt-12 border-t border-white/5">
        <h4 className="text-white/20 font-black text-[10px] lg:text-xs uppercase tracking-[2px] lg:tracking-[4px] mb-4 lg:mb-8">Live Conversion Preview</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-6">
          {[500, 1000, 1500, 2500, 5000, 10000].map((bdt) => (
            <div key={bdt} className="p-3 lg:p-6 rounded-xl lg:rounded-2xl bg-white/[0.01] border border-white/5 text-center">
              <span className="block text-[9px] lg:text-[10px] font-black text-text-muted uppercase mb-1 lg:mb-2">{bdt} BDT</span>
              <span className="text-base lg:text-2xl font-black tracking-tighter text-white">
                {Math.ceil(bdt / rate)} <span className="text-[8px] lg:text-[10px] text-primary">USDT</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
