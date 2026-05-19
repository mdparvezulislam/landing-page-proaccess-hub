"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  endDate: string | Date;
  onExpire?: () => void;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endDate: string | Date): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function CountdownTimer({ endDate, onExpire, compact, size = "md", className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  const tick = useCallback(() => {
    const tl = calcTimeLeft(endDate);
    setTimeLeft(tl);
    if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
      onExpire?.();
    }
  }, [endDate, onExpire]);

  useEffect(() => {
    setMounted(true);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  if (!mounted) return null;

  const expired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (expired) {
    return (
      <div className={`text-center ${className || ""}`}>
        <span className="text-red-400 font-black text-sm uppercase tracking-widest animate-pulse">Offer Expired</span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  const sizeClasses = {
    sm: { card: "w-12 h-14 sm:w-14 sm:h-16", text: "text-lg sm:text-xl", label: "text-[6px]", gap: "gap-1.5 sm:gap-2" },
    md: { card: "w-16 h-18 sm:w-20 sm:h-22", text: "text-2xl sm:text-3xl", label: "text-[7px] sm:text-[8px]", gap: "gap-2 sm:gap-3" },
    lg: { card: "w-20 h-22 sm:w-24 sm:h-26", text: "text-3xl sm:text-4xl", label: "text-[8px] sm:text-[9px]", gap: "gap-3 sm:gap-4" },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${s.gap} ${className || ""}`}>
      {units.map((unit, i) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`${s.card} rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm`}
        >
          <motion.span
            key={`${unit.label}-${unit.value}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${s.text} font-black text-white tabular-nums leading-none`}
          >
            {unit.value.toString().padStart(2, "0")}
          </motion.span>
          <span className={`${s.label} font-black uppercase tracking-wider text-text-muted mt-0.5`}>
            {compact ? unit.label[0] : unit.label}
          </span>
          {!compact && i < units.length - 1 && (
            <span className="absolute -right-[5px] sm:-right-[6px] top-1/2 -translate-y-1/2 text-text-muted/30 text-xs font-black">
              :
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
