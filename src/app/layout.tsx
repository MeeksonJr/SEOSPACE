import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { SiteNavigatorDrawer } from "@/components/ui/SiteNavigatorDrawer";
import { Analytics } from "@vercel/analytics/next";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--f-display",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--f-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
});

const themeBootScript = `try{var t=localStorage.getItem('trustpulse_theme_mode');document.documentElement.dataset.spTheme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.spTheme='light'}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://trustpulse-ai.vercel.app"),
  title: "TrustPulse AI — Autonomous Social Proof, Review Aggregator & Negative Review Shield SaaS",
  description:
    "Protect local businesses from unfair 1-star public reviews with our smart QR funnel shield, while streaming verified 5-star customer praise into high-converting website widgets. Zero operating overhead.",
  keywords: [
    "Social Proof SaaS",
    "Review Aggregator",
    "Negative Review Shield",
    "Google Review Booster",
    "Wall of Love Widget",
    "Toast Notification Widget",
    "AI Review Responder",
    "Gemini Review Reply",
    "Agency Reputation SaaS",
    "TrustPulse AI",
  ],
  alternates: {
    canonical: "https://trustpulse-ai.vercel.app",
  },
  openGraph: {
    title: "TrustPulse AI — Autonomous Social Proof & Negative Review Shield",
    description:
      "Protect local businesses from unfair 1-star public reviews with our smart QR funnel shield, while streaming verified 5-star customer praise into high-converting website widgets.",
    url: "https://trustpulse-ai.vercel.app",
    siteName: "TrustPulse AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustPulse AI — Autonomous Social Proof & Negative Review Shield",
    description:
      "Protect local businesses from unfair 1-star public reviews with our smart QR funnel shield, while streaming verified 5-star customer praise into high-converting website widgets.",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "TrustPulse AI",
      url: "https://trustpulse-ai.vercel.app",
      description:
        "Autonomous Social Proof, Multi-Source Review Aggregator & Negative Review Shield SaaS for Digital Agencies and Local Businesses.",
    },
    {
      "@type": "SoftwareApplication",
      name: "TrustPulse AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://trustpulse-ai.vercel.app",
      softwareVersion: "1.0",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0.00",
        highPrice: "129.00",
        priceCurrency: "USD",
        offerCount: 3,
      },
      featureList: [
        "Smart Negative Review Shield QR Funnel with Star Gatekeeping",
        "1-Line Embeddable Social Proof Toasts & Wall of Love Masonry Widgets",
        "Google Gemini AI Review Auto-Responder (SEO, De-escalation & Loyalty)",
        "Multi-Platform Review Aggregator (Google Places, Trustpilot, CSV)",
        "Agency White-Label Multi-Workspace Management with PDF Client Reports",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {children}
        <Analytics />
        <SiteNavigatorDrawer />
      </body>
    </html>
  );
}
