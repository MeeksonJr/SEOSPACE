import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteNavigatorDrawer } from "@/components/ui/SiteNavigatorDrawer";

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
  metadataBase: new URL("https://seospace-kappa.vercel.app"),
  title: "Seospace AI — Your Always-On AI SEO, CRO & Compliance Growth Engine",
  description:
    "Automate your entire technical SEO, CRO copywriting, AI Search (GEO), live Cloudflare 1.1.1.1 DNS security, and WCAG 2.2 compliance workflow with instant client-ready White-Label PDF reports.",
  keywords: [
    "AI SEO Audit",
    "CRO Audit SaaS",
    "Website Grader",
    "White-Label SEO Report",
    "GEO AI Search Optimization",
    "llms.txt Generator",
    "Seospace AI",
    "Seospace Neural Engine v4.2",
  ],
  alternates: {
    canonical: "https://seospace-kappa.vercel.app",
  },
  openGraph: {
    title: "Seospace AI — Autonomous SEO, CRO, GEO & DNS Growth Engine",
    description:
      "35-point Technical SEO, CRO, AI Search (GEO), WCAG 2.2 & live DNS auditing + 0–100 Mathematical AI Article Studio and Agency White-Label PDF reports.",
    url: "https://seospace-kappa.vercel.app",
    siteName: "Seospace AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seospace AI — Your Always-On AI SEO & CRO Growth Engine",
    description:
      "Run real-time RapidAPI metadata + Cloudflare DoH DNS + DOM website audits and generate 95+/100 SEO articles in 1 click.",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Seospace AI",
      url: "https://seospace-kappa.vercel.app",
      description:
        "Autonomous AI SEO, CRO, Generative Engine Optimization (GEO), and White-Label Agency Reporting Platform powered by Seospace Neural Engine v4.2.",
      sameAs: ["https://github.com/MeeksonJr/SEOSPACE"],
    },
    {
      "@type": "SoftwareApplication",
      name: "Seospace AI",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://seospace-kappa.vercel.app",
      softwareVersion: "4.2",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0.00",
        highPrice: "49.00",
        priceCurrency: "USD",
        offerCount: 3,
      },
      featureList: [
        "35-Point Technical SEO, CRO, GEO & WCAG 2.2 Website Scanner",
        "RapidAPI Live Metadata & OpenGraph Extraction",
        "Cloudflare 1.1.1.1 DNS-over-HTTPS SPF, DMARC & MX Security Inspector",
        "Autonomous AI SEO Article Studio with Real-Time 0-100 Mathematical Grader",
        "Agency White-Label PDF Export & Embeddable Lead Capture Widget",
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        {children}
        <SiteNavigatorDrawer />
      </body>
    </html>
  );
}
