"use client";

import { ReactNode } from "react";

// SessionProvider removed. Admin auth is now handled with a secure cookie and middleware.
export default function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
