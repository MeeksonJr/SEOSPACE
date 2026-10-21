import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seospace AI — Your Always-On AI SEO, CRO & Compliance Growth Engine",
  description:
    "Automate your entire technical SEO, CRO copywriting, AI Search (GEO), and WCAG compliance workflow with instant client-ready White-Label PDF reports.",
  keywords: [
    "AI SEO Audit",
    "CRO Audit SaaS",
    "Website Grader",
    "White-Label SEO Report",
    "GEO AI Search Optimization",
    "Seospace AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
