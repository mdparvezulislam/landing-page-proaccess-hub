"use client";

import React, { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CommandPalette } from "@/components/CommandPalette";
import { FloatingElements } from "@/components/FloatingElements";

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
        <Toaster position="top-center" richColors />
      </QueryProvider>
    </AuthProvider>
  );
}
