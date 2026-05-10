import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingElements } from "@/components/FloatingElements";
import GoogleAnalytics from "@/components/GoogleAnalytics";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pro Access VIP Hub | Bangladesh's #1 Premium Resource Platform",
  description: "Join thousands of smart Bangladeshis accessing premium tools, methods, and courses at unbeatable prices. The ultimate vault for digital success.",
  keywords: ["VIP Access", "Bangladesh Premium Tools", "Method Hub", "Digital Resources", "Pro Access Hub"],
  authors: [{ name: "Pro Access Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lifetimevipunlimited.com"),
  openGraph: {
    title: "Pro Access VIP Hub - Unlock Your Digital Potential",
    description: "Bangladesh's most trusted platform for premium digital resources and methods.",
    url: "https://proaccessvip.com",
    siteName: "Pro Access VIP Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pro Access VIP Hub Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Access VIP Hub",
    description: "Unlock premium access to tools and methods.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { seedDatabase } from "@/lib/seedDatabase";

async function getGlobalSettings() {
  await connectDB();

  // Auto-seed if empty
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await seedDatabase();
  }

  const settings = await Settings.findOne().lean();
  return JSON.parse(JSON.stringify(settings));
}

import { CommandPalette } from "@/components/CommandPalette";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-bg-dark text-text-primary antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GA_ID || ""} />
            <CommandPalette />
            <Header data={settings} />
            <main>{children}</main>
            <Footer data={settings} />
            <FloatingElements data={settings} />
            <Toaster position="top-center" richColors />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
