"use client";

import React, { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CommandPalette } from "@/components/CommandPalette";
import { FloatingElements } from "@/components/FloatingElements";
import ReferralTrackerWrapper from "@/components/ReferralTrackerWrapper";
import BottomBar from "@/components/BottomBar";
import FlashOfferPopup from "@/components/FlashOfferPopup";

export default function RootProviders({
  children,
  settings,
}: {
  children: ReactNode;
  settings?: any;
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <CommandPalette />
        {children}
        <FloatingElements data={settings} />
        <ReferralTrackerWrapper />
        <BottomBar />
        <FlashOfferPopup />
        <Toaster position="top-center" richColors />
      </QueryProvider>
    </AuthProvider>
  );
}
