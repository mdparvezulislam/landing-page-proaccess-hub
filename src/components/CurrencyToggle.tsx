"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { Coins } from 'lucide-react';

export const CurrencyToggle = () => {
  const { currentCurrency, toggleCurrency } = useCurrencyStore();

  return (
    <div className="flex items-center gap-1.5 lg:gap-3">
      <div 
        onClick={toggleCurrency}
        className="relative w-[80px] lg:w-[100px] h-[34px] lg:h-[38px] bg-white/5 border border-white/10 rounded-full cursor-pointer p-0.5 lg:p-1 flex items-center justify-between group overflow-hidden"
      >
        {/* Animated background pill */}
        <motion.div
          animate={{ x: currentCurrency === 'BDT' ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? 38 : 46) }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute w-[38px] lg:w-[46px] h-[28px] lg:h-[30px] bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"
        />
        
        <span className={`relative z-10 w-1/2 text-center text-[8px] lg:text-[10px] font-black tracking-wider transition-colors duration-300 ${currentCurrency === 'BDT' ? 'text-black' : 'text-white/40'}`}>
          BDT
        </span>
        <span className={`relative z-10 w-1/2 text-center text-[8px] lg:text-[10px] font-black tracking-wider transition-colors duration-300 ${currentCurrency === 'USDT' ? 'text-black' : 'text-white/40'}`}>
          USDT
        </span>
      </div>
      
      <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
        <Coins className="w-3 h-3 text-primary" />
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">
          1 USDT = 125 BDT
        </span>
      </div>
    </div>
  );
};
