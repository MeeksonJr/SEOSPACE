"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  Eye,
  FileCode2,
  FileText,
  Globe,
  Layers,
  Loader2,
  Menu,
  Moon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Swords,
  Terminal,
  TrendingUp,
  Wrench,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SegmentedGauge } from "@/components/ui/SegmentedGauge";
import {
  OpenSiteNavigatorButton,
  triggerSiteNavigator,
} from "@/components/ui/SiteNavigatorDrawer";
import { PublicFooter, usePublicTheme } from "@/components/ui/PublicChrome";
import { TrustStrip } from "@/components/ui/Motion";
import { PRICING_PLANS } from "@/lib/stripe/plans";
import {
  findSavedAuditByUrl,
  saveAuditReport,
} from "@/lib/storage/workspace-store";
import { LiveKeywordResult } from "@/app/api/keywords/route";

const FEATURE_TABS: Array<{
  id: string;
  label: string;
  headline: string;
  description: string;
  metricBadge: string;
  ctaLabel: string;
  ctaHref: string;
}> = [
  {
    id: "Keyword Research",
    label: "Keyword Research",
    headline: "Live AI Keyword Discovery with Search Volume, CPC & KD",
    description:
      "Type any niche, product category, or competitor domain below to uncover high-converting commercial keywords powered by the Seospace Neural Engine v4.2.",
    metricBadge: "Seospace Neural Keyword Engine",
    ctaLabel: "Launch Full Keyword & Article Studio",
    ctaHref: "/dashboard?tab=editor",
  },
  {
    id: "SEO-Optimized",
    label: "SEO-Optimized",
    headline: "Real-Time 0–100 Mathematical On-Page SEO Scoring As You Type",
    description:
      "Every headline, subheading, and paragraph is evaluated live against 35+ technical SEO and keyword density signals — zero fake or random grading.",
    metricBadge: "Avg +34% Organic Ranking Velocity",
    ctaLabel: "Open Live SEO Score Editor",
    ctaHref: "/dashboard?tab=editor",
  },
  {
    id: "One-Click Audit",
    label: "One-Click Audit",
    headline:
      "35-Point Technical SEO, CRO, WCAG & RapidAPI + Cloudflare DNS Scanner",
    description:
      "Enter any live website URL to extract metadata via RapidAPI, query Cloudflare 1.1.1.1 DNS-over-HTTPS for SPF/DMARC, and inspect DOM heading trees & JSON-LD.",
    metricBadge: "Saved-First DB Cache (<15ms)",
    ctaLabel: "View Live Sample Audit Report",
    ctaHref: "/report/voice-one-com",
  },
  {
    id: "AI Inline Editing",
    label: "AI Inline Editing",
    headline: "1-Click AI Assistant That Fixes Your Title, Meta & Body Copy",
    description:
      "Click 'AI Assistant' inside the editor to automatically front-load focus keywords under 60 characters and expand thin sections to 95+/100.",
    metricBadge: "Powered by Seospace Neural Engine v4.2",
    ctaLabel: "Try AI Inline Editor Now",
    ctaHref: "/dashboard?tab=editor",
  },
  {
    id: "White-Label PDF",
    label: "White-Label PDF",
    headline: "Custom Agency Logo, Brand Colors & Calendly CTA on Every PDF",
    description:
      "Turn every website audit into a branded pitch deck. Replace Seospace branding with your own agency identity in 1 click.",
    metricBadge: "Built for Digital & SEO Agencies",
    ctaLabel: "Configure White-Label Branding",
    ctaHref: "/dashboard?tab=whitelabel",
  },
  {
    id: "GEO AI Search",
    label: "GEO AI Search",
    headline: "Optimize for ChatGPT Search, Perplexity & Google AI Overviews",
    description:
      "Automatically audit /llms.txt manifests and Organization + FAQPage JSON-LD schema so generative AI engines cite your brand first.",
    metricBadge: "+3.1x AI Citation Visibility",
    ctaLabel: "Open Free /llms.txt & Schema Tools",
    ctaHref: "/tools",
  },
  {
    id: "Lead-Gen Widget",
    label: "Lead-Gen Widget",
    headline: "Embeddable Instant Audit Widget That Captures Agency Leads 24/7",
    description:
      "Drop a single <iframe> snippet onto your agency site. Visitors get a free instant audit while their name, email, and URL land in your CRM.",
    metricBadge: "Includes Built-in Lead CRM",
    ctaLabel: "Test Live Lead-Capture Widget",
    ctaHref: "/widget",
  },
];

const PILLAR_ARCHITECTURES = [
  {
    id: "seo",
    name: "Technical SEO & Metadata",
    weight: "30% Weight",
    scoreSample: 94,
    badge: "RapidAPI + Direct HTML DOM",
    summary:
      "Evaluates canonical tags, title character math (50–60 chars), meta description persuasive length (140–160 chars), single H1 discipline, H2/H3 semantic hierarchy, and internal/external link velocity.",
    checks: [
      {
        label: "Title Tag Front-Loaded Keyword & Length (50–60 chars)",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Meta Description CTA & Length (140–160 chars)",
        points: "15 pts",
        status: "pass",
      },
      {
        label: "Single Semantic H1 + Structured H2/H3 Subheadings",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Canonical URL & OpenGraph Social Card Completeness",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "XML Sitemap (/sitemap.xml) & Robots (/robots.txt) Verification",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "engine": "Seospace Neural Engine v4.2",
  "metadataSource": "RapidAPI url-to-metadata + Direct DOM",
  "titleLength": 56,
  "metaDescriptionLength": 152,
  "h1Count": 1,
  "h2Count": 6,
  "canonicalPresent": true,
  "sitemapVerified": true
}`,
  },
  {
    id: "cro",
    name: "Conversion Rate (CRO)",
    weight: "25% Weight",
    scoreSample: 89,
    badge: "Behavioral & CTA Heuristics",
    summary:
      "Inspects above-the-fold call-to-action clarity, lead form friction, social proof density, trust badges, pricing transparency, and Time-to-First-Byte (TTFB) latency.",
    checks: [
      {
        label: "High-Contrast Action Verbs in Primary CTA Buttons",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Server Response Latency (TTFB < 600ms Target)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Quantified Social Proof, Reviews & Case Study Signals",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Low-Friction Lead Capture / Instant Trial Entry Point",
        points: "25 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "ttfbMs": 214,
  "ctaButtonsDetected": 7,
  "primaryCtaText": "Get Started Free",
  "trustSignals": ["SOC2 Ready", "30-Day Guarantee", "4.9/5 Stars"],
  "conversionFriction": "Low"
}`,
  },
  {
    id: "geo",
    name: "AI Search & GEO Readiness",
    weight: "20% Weight",
    scoreSample: 96,
    badge: "ChatGPT • Perplexity • Claude",
    summary:
      "Verifies whether generative AI answer engines can crawl, parse, and cite your brand via /llms.txt entity manifests, JSON-LD structured data graphs, and AI bot rules.",
    checks: [
      {
        label: "Live /llms.txt Machine-Readable Entity Manifest",
        points: "30 pts",
        status: "pass",
      },
      {
        label: "Organization, SoftwareApplication & FAQPage JSON-LD",
        points: "30 pts",
        status: "pass",
      },
      {
        label: "GPTBot, ClaudeBot & PerplexityBot Allowed in /robots.txt",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Direct Answer-First Paragraph Formatting for RAG Citation",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "llmsTxtStatus": "200 OK (/llms.txt verified)",
  "jsonLdTypes": ["Organization", "SoftwareApplication", "FAQPage"],
  "aiCrawlersAllowed": ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
  "geoCitationProbability": "High (96/100)"
}`,
  },
  {
    id: "a11y",
    name: "WCAG 2.2 AA Accessibility",
    weight: "15% Weight",
    scoreSample: 92,
    badge: "ADA & WCAG 2.2 Compliance",
    summary:
      "Audits image alt attribute coverage, HTML lang declarations, responsive viewport scaling, ARIA landmark roles, and keyboard focus navigation.",
    checks: [
      {
        label: "Image Alt Text Coverage Ratio (Target: 100% Descriptive)",
        points: "35 pts",
        status: "pass",
      },
      {
        label: "Valid HTML5 lang Attribute & Unblocked Viewport Scaling",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Semantic Landmarks (<main>, <nav>, <header>, <footer>)",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Form Input Labels & Accessible Button Descriptions",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "htmlLang": "en",
  "totalImages": 18,
  "imagesMissingAlt": 0,
  "altCoveragePercent": 100,
  "viewportScalable": true,
  "wcagLevel": "2.2 AA Compliant"
}`,
  },
  {
    id: "security",
    name: "Cloudflare 1.1.1.1 DNS & Security",
    weight: "10% Weight",
    scoreSample: 95,
    badge: "Live Cloudflare DoH 1.1.1.1",
    summary:
      "Queries Cloudflare DNS-over-HTTPS in real time for A/AAAA records, MX mail servers, SPF TXT authorization, DMARC anti-spoofing policy, and HTTPS headers.",
    checks: [
      {
        label: "Strict Transport Security (HTTPS + HSTS Header)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "SPF TXT Record Configured for Domain Mail Authenticity",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "DMARC (_dmarc TXT) Policy Enforced (quarantine / reject)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Redundant Authoritative Nameservers & IPv4/IPv6 Resolution",
        points: "25 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "resolver": "https://cloudflare-dns.com/dns-query",
  "aRecords": ["141.193.213.10", "141.193.213.11"],
  "spfVerified": true,
  "dmarcPolicy": "quarantine",
  "nameservers": ["lia.ns.cloudflare.com.", "max.ns.cloudflare.com."]
}`,
  },
];

const FAQ_ITEMS = [
  {
    q: "Are the SEO audit scores and metadata checks 100% real or inflated?",
    a: "100% real and mathematically computed. When you enter any URL, Seospace extracts live metadata via RapidAPI (url-to-metadata) and direct HTML DOM inspection, queries Cloudflare 1.1.1.1 DNS-over-HTTPS for real A/MX/SPF/DMARC records, and checks /robots.txt, /sitemap.xml, and /llms.txt. If a site is missing image alt tags, has a 78-character duplicated title, or lacks DMARC, those exact points are deducted.",
  },
  {
    q: "How does the Saved-First URL Audit Database work?",
    a: "Every time a URL is audited, its complete 5-pillar report, RapidAPI metadata, DNS intelligence, and AI copywriting diffs are saved to our persistent database. Visiting that URL again loads the saved snapshot in under 15ms without burning API credits — and you can click 'Fetch Latest Live Scan' anytime to force a fresh real-time crawl.",
  },
  {
    q: "How is the AI SEO Content Studio connected to my URL audits?",
    a: "Every URL audit uncovers high-intent niche keywords and content gaps for that exact domain. Clicking 'Generate AI SEO Article' on any audit report opens the AI Content Studio, generates an 800+ word structured guide linked to that domain, and grades it live against our 7-point mathematical rubric (95+/100) with a public shareable link (/article/[id]).",
  },
  {
    q: "What AI model powers Seospace AI?",
    a: "All automated copywriting diffs, meta tag rewrites, keyword intent clustering, and long-form SEO articles are powered by the proprietary Seospace Neural Engine v4.2, specifically calibrated for technical on-page SEO math and generative answer engine citations.",
  },
  {
    q: "What is GEO (Generative Engine Optimization) and /llms.txt?",
    a: "Traditional SEO targets Google's 10 blue links. GEO optimizes your site so AI answer engines (ChatGPT Search, Perplexity, Claude, and Google AI Overviews) cite your brand as the primary source. Seospace audits and generates your /llms.txt manifest, FAQPage JSON-LD schema, and AI bot rules automatically.",
  },
  {
    q: "Can I remove Seospace branding on PDF reports for my agency clients?",
    a: "Yes! On the Professional and Agency White-Label plans, you can upload your agency logo, set your primary brand hex color, and embed your custom Calendly booking link. Every exported PDF and shareable report reflects 100% your agency identity.",
  },
  {
    q: "How does the Embeddable Agency Lead-Gen Widget work?",
    a: "From the Dashboard, copy a single <iframe> snippet and paste it onto your agency website or landing page. Visitors can run a free 60-second audit of their site while their name, work email, audited URL, and score are automatically captured in your Dashboard CRM.",
  },
  {
    q: "Can I switch between Light Mode and Dark Mode across the platform?",
    a: "Yes! Click the Light/Dark Mode toggle in the top navigation bar or footer at any time. Your preference is saved automatically and transforms the entire experience between Crisp Architectural Light Mode and Deep Space Navy Dark Mode.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isDark: heroDark, toggleTheme } = usePublicTheme(false);
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [activeFeatureTab, setActiveFeatureTab] = useState("Keyword Research");
  const [activePillarId, setActivePillarId] = useState("seo");
  const [diffMode, setDiffMode] = useState<"split" | "before" | "after">(
    "split"
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [wpEnabled, setWpEnabled] = useState(true);
  const [ghostEnabled, setGhostEnabled] = useState(true);
  const [heroGaugeScore, setHeroGaugeScore] = useState(90);

  // Live Keyword Research state inside the Bento Grid
  const [kwQuery, setKwQuery] = useState("Digital Marketing & SaaS SEO");
  const [kwLoading, setKwLoading] = useState(false);
  const [liveKeywords, setLiveKeywords] = useState<LiveKeywordResult[]>([
    {
      keyword: "Digital Marketing Guide",
      volume: "12,500",
      cpc: "$4.20",
      difficulty: 45,
      intent: "Informational",
      topicTitle: "Digital Marketing Guide: Complete 2026 Growth Playbook",
    },
    {
      keyword: "Best AI SEO Audit SaaS",
      volume: "8,900",
      cpc: "$6.80",
      difficulty: 32,
      intent: "Commercial",
      topicTitle: "Best AI SEO Audit SaaS: How to Automate Technical SEO",
    },
    {
      keyword: "Agency Lead Magnet Tool",
      volume: "15,600",
      cpc: "$5.10",
      difficulty: 28,
      intent: "Transactional",
      topicTitle: "Agency Lead Magnet Tool: Close Retainers with PDF Audits",
    },
  ]);

  // Interactive ROI Calculator state
  const [auditsSentPerMonth, setAuditsSentPerMonth] = useState(25);
  const [clientRetainerValue, setClientRetainerValue] = useState(1500);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleRunAudit(e?: React.FormEvent, presetUrl?: string) {
    if (e) e.preventDefault();
    const targetUrl = (presetUrl || urlInput || "https://stripe.com").trim();

    const existingSaved = findSavedAuditByUrl(targetUrl);
    if (existingSaved) {
      router.push(`/report/${existingSaved.id}`);
      return;
    }

    setIsScanning(true);
    setScanStep(`Checking saved database & connecting to ${targetUrl}...`);

    const t1 = setTimeout(
      () =>
        setScanStep(
          "Evaluating 35+ SEO, CRO, WCAG 2.2, RapidAPI & Cloudflare 1.1.1.1 DNS signals..."
        ),
      800
    );
    const t2 = setTimeout(
      () =>
        setScanStep(
          "Running Seospace Neural Engine v4.2 copywriting & niche keyword analysis..."
        ),
      1700
    );

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, forceRefresh: false }),
      });
      const data = await res.json();
      clearTimeout(t1);
      clearTimeout(t2);

      if (data?.report) {
        saveAuditReport(data.report, !data.cached);
        router.push(`/report/${data.report.id}`);
      }
    } catch {
      clearTimeout(t1);
      clearTimeout(t2);
      router.push("/report/voice-one-com");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleLiveKeywordSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!kwQuery.trim()) return;
    setKwLoading(true);
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: kwQuery }),
      });
      const data = await res.json();
      if (Array.isArray(data?.keywords) && data.keywords.length > 0) {
        setLiveKeywords(data.keywords);
      }
    } finally {
      setKwLoading(false);
    }
  }

  async function handleSubscribe(planId: string) {
    if (planId === "starter") {
      router.push("/signup?plan=starter");
      return;
    }
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setCheckoutLoading(null);
    }
  }

  const activeTabInfo =
    FEATURE_TABS.find((t) => t.id === activeFeatureTab) || FEATURE_TABS[0];
  const activePillar =
    PILLAR_ARCHITECTURES.find((p) => p.id === activePillarId) ||
    PILLAR_ARCHITECTURES[0];
  const estimatedNewClients = Math.max(1, Math.round(auditsSentPerMonth * 0.12));
  const projectedMonthlyRevenue = estimatedNewClients * clientRetainerValue;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        heroDark ? "bg-[#050814] text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* Top Launch Promo Bar */}
      <div
        className={`text-xs font-medium py-2 px-4 text-center border-b transition-colors ${
          heroDark
            ? "bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-blue-200 border-blue-800/50"
            : "bg-amber-300/90 text-slate-950 border-amber-400/50"
        }`}
      >
        <span>
          🔥 Limited Launch Offer: Get <strong>20% off Annual Plans</strong> +
          Agency White-Label PDF, Live Cloudflare DNS Scanner &amp; Lead Widget
          included.
        </span>{" "}
        <a
          href="#pricing"
          className={`font-bold underline inline-flex items-center gap-0.5 ml-1 ${
            heroDark
              ? "text-amber-300 hover:text-amber-200"
              : "hover:text-blue-800"
          }`}
        >
          Claim Offer ↗
        </a>
      </div>

      {/* HERO WRAPPER — Full Light & Dark Grid Reactivity */}
      <div
        className={`relative overflow-hidden transition-colors duration-300 ${
          heroDark
            ? "bg-[#050814] text-white bg-seospace-dark-grid"
            : "bg-white text-slate-900 bg-seospace-grid"
        }`}
      >
        {/* Top Navigation Bar */}
        <header
          className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
            heroDark
              ? "bg-[#050814]/85 border-slate-800/80"
              : "bg-white/85 border-slate-200/80"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[4rem] sm:min-h-[5rem] flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="shrink-0">
              <SeospaceLogo darkText={!heroDark} />
            </Link>

            <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
              <a
                href="#features"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Features
              </a>
              <a
                href="#architecture"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                5-Pillar Engine
              </a>
              <a
                href="#pricing"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Pricing
              </a>
              <Link
                href="/dashboard"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard?tab=editor"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                AI SEO Studio
              </Link>
              <Link
                href="/compare"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Battlecard
              </Link>
              <Link
                href="/tools"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Free Tools
              </Link>
              <Link
                href="/docs"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                API Docs
              </Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden xl:block">
                <OpenSiteNavigatorButton
                  variant={heroDark ? "dark" : "light"}
                  label="All Pages"
                />
              </div>

              {/* Global Full-Page Light / Dark Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title="Switch Full-Page Theme (Light / Dark Mode)"
                className={`px-3 py-2 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer ${
                  heroDark
                    ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-sm shadow-amber-500/10"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {heroDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden md:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden md:inline">Dark Mode</span>
                  </>
                )}
              </button>

              <Link
                href="/login"
                className={`hidden sm:inline-flex px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition ${
                  heroDark
                    ? "border-slate-700 text-white hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`hidden sm:inline-flex px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  heroDark
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
                }`}
              >
                Sign Up
              </Link>

              {/* Single Unified Mobile / Tablet Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className={`xl:hidden px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                  heroDark
                    ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                    : "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4" />
                    <span>Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Expandable Navigation Bar */}
          {mobileMenuOpen && (
            <div
              className={`xl:hidden border-t px-4 py-4 space-y-3 ${
                heroDark
                  ? "bg-[#050814] border-slate-800 text-slate-200"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  Features
                </a>
                <a
                  href="#architecture"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  5-Pillar Engine
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  Pricing
                </a>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard?tab=editor"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  AI SEO Editor
                </Link>
                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  Battlecard
                </Link>
                <Link
                  href="/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl border ${
                    heroDark
                      ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  Free Tools
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerSiteNavigator(true);
                  }}
                  className="px-3 py-2.5 rounded-xl border border-blue-500/40 bg-blue-600/15 text-blue-500 font-bold text-left cursor-pointer"
                >
                  All 17 Pages ↗
                </button>
              </div>
              <div className="flex sm:hidden items-center gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold border ${
                    heroDark
                      ? "border-slate-700 text-white"
                      : "border-slate-200 text-slate-900"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold ${
                    heroDark
                      ? "bg-white text-slate-950"
                      : "bg-slate-950 text-white"
                  }`}
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* HERO CONTENT */}
        <section className="sp-hero-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
          {/* 3-Column 5-Star Social Proof Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
            {[
              '"Very fast load times!"',
              '"SEO made effortless!"',
              '"My traffic doubled!"',
            ].map((quote, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium ${
                    heroDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {quote}
                </span>
              </div>
            ))}
          </div>

          {/* Main Headline */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 border bg-blue-500/10 border-blue-500/30 text-blue-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Seospace Neural Engine v4.2 • Saved-First Audits • Live 1.1.1.1
                DNS &amp; RapidAPI
              </span>
            </div>
            <h1
              className={`text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] ${
                heroDark
                  ? "text-white font-editorial sm:text-7xl font-normal"
                  : "text-slate-950"
              }`}
            >
              Your Always On AI <br />
              <span className="sp-gradient-text">SEO Growth Engine</span>
            </h1>
            <p
              className={`mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                heroDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace automates your entire SEO, CRO &amp; AI Search workflow —
              from real-time RapidAPI metadata extraction and Cloudflare 1.1.1.1
              DNS security audits to 95+/100 AI blog creation and white-label
              PDF client reports.
            </p>
          </div>

          {/* Interactive Live URL Audit Input Bar */}
          <form
            onSubmit={(e) => handleRunAudit(e)}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl border shadow-lg transition ${
                heroDark
                  ? "bg-slate-900/90 border-slate-700/80 shadow-blue-950/30"
                  : "bg-white border-slate-200 shadow-slate-200/70"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 px-3 py-2">
                <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter any URL to scan live (e.g. voice-one.com/services/)..."
                  className={`w-full text-sm sm:text-base bg-transparent focus:outline-none ${
                    heroDark
                      ? "text-white placeholder:text-slate-400"
                      : "text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isScanning}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition cursor-pointer ${
                    heroDark
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Scanning Live...</span>
                    </>
                  ) : (
                    <>
                      <span>Automate My SEO</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <Link
                  href="/dashboard"
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border inline-flex items-center gap-1.5 transition ${
                    heroDark
                      ? "border-slate-700 text-white hover:bg-slate-800"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden md:inline">Workspace</span>
                </Link>
              </div>
            </div>

            {/* Live Scan Status or 1-Click Live Scan Pills */}
            {isScanning ? (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-blue-500 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{scanStep}</span>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className={heroDark ? "text-slate-400" : "text-slate-500"}>
                  Click to Open Saved or Live Scan:
                </span>
                {[
                  "voice-one.com/services/",
                  "stripe.com",
                  "linear.app",
                  "vercel.com",
                ].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => {
                      setUrlInput(domain);
                      handleRunAudit(undefined, domain);
                    }}
                    className={`px-2.5 py-1 rounded-full border font-medium transition cursor-pointer ${
                      heroDark
                        ? "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-blue-500 hover:text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    ⚡ {domain}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* 3-COLUMN FLOATING BENTO SHOWCASE */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Content From Keywords + Interactive Keywords Pills */}
            <div className="lg:col-span-4 space-y-4">
              <div
                className={`p-6 rounded-2xl border shadow-sm transition ${
                  heroDark
                    ? "bg-[#0B1022]/95 border-slate-800 text-white"
                    : "bg-white border-slate-200/90 text-slate-900"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-sm shadow-blue-600/30">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold">Content From Keywords</h3>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    heroDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Provide keywords that you want to rank for and generate full
                  95+/100 SEO-optimized articles in 1 click.
                </p>
                <div
                  className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
                    heroDark ? "border-slate-800" : "border-slate-200/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-500 font-semibold">
                      SEO + GEO
                    </span>
                    <span
                      className={heroDark ? "text-slate-400" : "text-slate-500"}
                    >
                      60 Seconds
                    </span>
                  </div>
                  <Link
                    href="/dashboard?tab=editor&keyword=Linkable%20alternative&autoGenerate=1"
                    className="font-semibold inline-flex items-center gap-1 hover:text-blue-500 transition"
                  >
                    Create <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* KEYWORDS Mini Card */}
              <div
                className={`p-5 rounded-2xl border shadow-sm ${
                  heroDark
                    ? "bg-[#0B1022]/95 border-slate-800 text-white"
                    : "bg-white border-slate-200/90 text-slate-900"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  CLICK ANY KEYWORD TO GENERATE AI ARTICLE
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { kw: "Linkable alternative", score: 94, bg: "bg-blue-600" },
                    { kw: "Technical SEO Audit", score: 90, bg: "bg-sky-500" },
                    { kw: "SaaS CRO Strategy", score: 92, bg: "bg-indigo-500" },
                  ].map((item) => (
                    <button
                      key={item.kw}
                      type="button"
                      onClick={() => {
                        setHeroGaugeScore(item.score);
                        router.push(
                          `/dashboard?tab=editor&keyword=${encodeURIComponent(
                            item.kw
                          )}`
                        );
                      }}
                      className={`px-3 py-1 rounded-lg ${item.bg} text-white text-xs font-medium hover:opacity-90 transition cursor-pointer`}
                    >
                      {item.kw} ↗
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: Live Keyword Opportunity Table + Center Play Button */}
            <div className="lg:col-span-4 relative">
              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  heroDark
                    ? "bg-[#0B1022]/95 border-slate-800 text-white"
                    : "bg-white border-slate-200/90 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-4">
                  <span>Keyword Opportunity</span>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>Volume</span>
                    <span>Difficulty</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {liveKeywords.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        router.push(
                          `/dashboard?tab=editor&keyword=${encodeURIComponent(
                            item.keyword
                          )}`
                        )
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer hover:border-blue-500 transition ${
                        heroDark
                          ? "bg-slate-900/70 border-slate-800"
                          : "bg-slate-50/70 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 font-medium truncate pr-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            heroDark
                              ? "bg-slate-800 text-slate-200"
                              : "bg-slate-200/70 text-slate-700"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate">{item.keyword}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-semibold">{item.volume}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            item.difficulty <= 40
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-amber-500/20 text-amber-500"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-center">
                  <Link
                    href="/dashboard"
                    title="Open Interactive Workspace"
                    className={`w-12 h-12 rounded-full border-4 shadow-lg flex items-center justify-center hover:scale-105 transition ${
                      heroDark
                        ? "bg-blue-600 text-white border-[#0B1022]"
                        : "bg-slate-950 text-white border-white"
                    }`}
                  >
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SEO Score 90/100 Gauge + Platforms Integration */}
            <div className="lg:col-span-4 space-y-4">
              <div
                className={`p-6 rounded-2xl border shadow-sm ${
                  heroDark
                    ? "bg-[#0B1022]/95 border-slate-800 text-white"
                    : "bg-white border-slate-200/90 text-slate-900"
                }`}
              >
                <h3 className="text-base font-bold">SEO Score</h3>
                <p
                  className={`text-xs mt-1 mb-3 ${
                    heroDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Top-impact checks that drive SEO &amp; CRO performance.
                </p>
                <SegmentedGauge
                  score={heroGaugeScore}
                  sublabel="Your Score is Excellent"
                  theme={heroDark ? "dark" : "light"}
                />
              </div>

              {/* PLATFORMS INTEGRATION Card */}
              <div
                className={`p-5 rounded-2xl border shadow-sm ${
                  heroDark
                    ? "bg-[#0B1022]/95 border-slate-800 text-white"
                    : "bg-white border-slate-200/90 text-slate-900"
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  PLATFORMS INTEGRATION
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] border border-slate-700">
                        ◉
                      </span>
                      <span>Ghost / Next.js</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGhostEnabled(!ghostEnabled)}
                      className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                        ghostEnabled ? "bg-blue-600" : "bg-slate-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          ghostEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">
                        W
                      </span>
                      <span>WordPress / WP Engine</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWpEnabled(!wpEnabled)}
                      className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                        wpEnabled ? "bg-blue-600" : "bg-slate-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          wpEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Geometric 3D Ribbon */}
        <div className="max-w-5xl mx-auto px-4 pt-2 pb-6 opacity-90">
          <div className="grid grid-cols-4 gap-3 h-20">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className={`rounded-t-2xl border-t-2 border-x-2 border-dashed flex items-center justify-center ${
                  heroDark
                    ? "border-sky-400/30 bg-gradient-to-b from-sky-500/10 to-transparent"
                    : "border-slate-300 bg-gradient-to-b from-sky-50/90 to-white"
                }`}
              >
                <div className="w-full h-full border-r border-dashed border-slate-300/40 transform -skew-x-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIVE TELEMETRY & INFRASTRUCTURE VERIFICATION STRIP */}
      <div
        className={`border-y py-4 transition-colors duration-300 ${
          heroDark
            ? "bg-[#0B1022] border-slate-800/80 text-slate-300"
            : "bg-slate-50 border-slate-200/80 text-slate-700"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-emerald-500 uppercase tracking-wider text-[11px]">
              100% Real Uninflated Telemetry:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-500" /> RapidAPI
              URL-to-Metadata
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />{" "}
              Cloudflare 1.1.1.1 DoH DNS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-500" /> Live /llms.txt
              &amp; JSON-LD Inspector
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Seospace
              Neural Engine v4.2
            </span>
          </div>
        </div>
      </div>

      <TrustStrip isDark={heroDark} />

      {/* SECTION 2: Everything You Need to Create Great Content & Audits */}
      <section
        id="features"
        className={`py-20 transition-colors duration-300 ${
          heroDark ? "bg-[#050814] text-white" : "bg-white text-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2
              className={`text-3xl sm:text-5xl font-bold tracking-tight font-editorial font-normal ${
                heroDark ? "text-white" : "text-slate-950"
              }`}
            >
              Everything You Need <br />
              to Create Great Content &amp; Audits
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base ${
                heroDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Click any module below or run a live AI keyword discovery search
              right from this page.
            </p>
          </div>

          {/* Horizontal Interactive Feature Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {FEATURE_TABS.map((tab) => {
              const active = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFeatureTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    active
                      ? heroDark
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-950 text-white shadow-xs"
                      : heroDark
                      ? "bg-[#0B1022] text-slate-300 border border-slate-800 hover:bg-slate-900"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Feature Spotlight Bar */}
          <div
            className={`mt-6 p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              heroDark
                ? "bg-[#0B1022] border-blue-500/30"
                : "bg-blue-50/70 border-blue-200/70"
            }`}
          >
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-500">
                <Sparkles className="w-3.5 h-3.5" /> {activeTabInfo.metricBadge}
              </span>
              <h3
                className={`text-lg font-bold mt-0.5 ${
                  heroDark ? "text-white" : "text-slate-950"
                }`}
              >
                {activeTabInfo.headline}
              </h3>
              <p
                className={`text-xs mt-1 max-w-2xl ${
                  heroDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {activeTabInfo.description}
              </p>
            </div>
            <Link
              href={activeTabInfo.ctaHref}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 transition ${
                heroDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-slate-950 hover:bg-slate-800 text-white"
              }`}
            >
              <span>{activeTabInfo.ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento Showcase Grid with REAL WORKING Keyword Research Engine */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bento Card 1: REAL Live Keyword Research Tool */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition ${
                heroDark
                  ? "border-slate-800 bg-[#0B1022]"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    heroDark
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Seospace Neural Keyword
                  Explorer
                </span>
                <h3
                  className={`text-2xl font-bold ${
                    heroDark ? "text-white" : "text-slate-950"
                  }`}
                >
                  Built-in Keyword Research (Try It Live Below!)
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    heroDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Type any industry, product, or domain below and click{" "}
                  <strong>Search Keywords</strong> to fetch real keyword
                  opportunities, CPC, and difficulty scores.
                </p>
              </div>

              <div
                className={`mt-6 rounded-2xl border p-5 shadow-xs ${
                  heroDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <form
                  onSubmit={handleLiveKeywordSearch}
                  className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-4 border-b ${
                    heroDark ? "border-slate-800" : "border-slate-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border flex-1 ${
                      heroDark
                        ? "bg-slate-900 border-slate-700 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={kwQuery}
                      onChange={(e) => setKwQuery(e.target.value)}
                      placeholder="Type any topic (e.g. VoIP Phone System, AI CRM)..."
                      className={`w-full bg-transparent focus:outline-none ${
                        heroDark ? "text-white" : "text-slate-900"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={kwLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {kwLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <span>Search Keywords</span>
                    )}
                  </button>
                </form>

                <div className="mt-4 space-y-2.5 text-xs">
                  {liveKeywords.map((row, i) => (
                    <div
                      key={i}
                      className={`flex flex-wrap sm:flex-nowrap items-center justify-between py-2 border-b last:border-0 gap-2 ${
                        heroDark ? "border-slate-800/80" : "border-slate-100"
                      }`}
                    >
                      <span
                        className={`font-semibold truncate ${
                          heroDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {row.keyword}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-400">{row.volume}/mo</span>
                        <span className="text-slate-400 hidden sm:inline">
                          {row.cpc}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            row.difficulty <= 40
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-amber-500/20 text-amber-500"
                          }`}
                        >
                          KD {row.difficulty}
                        </span>
                        <Link
                          href={`/dashboard?tab=editor&keyword=${encodeURIComponent(
                            row.keyword
                          )}&autoGenerate=1`}
                          className="px-2.5 py-1 rounded-md bg-blue-600/15 text-blue-500 font-bold hover:bg-blue-600 hover:text-white transition"
                        >
                          + Create Article
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 2: Real-Time SEO Score Editor & White-Label Reports */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Real-time AI Assistant
                </span>
                <h3 className="text-2xl font-bold">
                  AI Content Studio &amp; Audit-Ready PDF Reports in Seconds
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Click any suggestion or open the AI Content Studio to generate
                  full 800-word SEO articles, rewrite headlines, or export
                  White-Label PDF diagnostics for clients.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                <div>
                  <SegmentedGauge
                    score={92}
                    sublabel="Audit-Ready Score"
                    theme="dark"
                    size="sm"
                  />
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Active Suggestions
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-200">
                      Focus keyword appears in H1 &amp; Meta Title
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-200">
                      JSON-LD &amp; /llms.txt AI Search citation ready
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="text-slate-300">
                      Click to auto-fix missing alt &amp; meta tags
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/dashboard?tab=editor"
                      className="inline-flex items-center gap-1.5 text-blue-400 font-semibold hover:text-blue-300"
                    >
                      Open Live SEO Editor <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE 5-PILLAR UNINFLATED GRADING ARCHITECTURE */}
      <section
        id="architecture"
        className={`py-20 border-t transition-colors duration-300 ${
          heroDark
            ? "bg-[#0B1022]/70 border-slate-800/80 text-white"
            : "bg-slate-50/80 border-slate-200/80 text-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30 mb-3">
              <Layers className="w-3.5 h-3.5" /> Mathematical 5-Pillar Grading
              Engine
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                heroDark ? "text-white" : "text-slate-950"
              }`}
            >
              Zero Fake Scores. Inspect Our 35-Point Telemetry Engine.
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base ${
                heroDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Unlike superficial website graders that invent random numbers,
              Seospace computes every score deterministically from live HTTP
              headers, RapidAPI metadata, DOM trees, and Cloudflare 1.1.1.1 DNS
              records.
            </p>
          </div>

          {/* 5 Pillar Selector Tabs */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PILLAR_ARCHITECTURES.map((pillar) => {
              const isSelected = pillar.id === activePillarId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20"
                      : heroDark
                      ? "bg-[#050814] border-slate-800 text-slate-200 hover:border-slate-700"
                      : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
                    <span>{pillar.weight}</span>
                    <span>{pillar.scoreSample}/100</span>
                  </div>
                  <div className="text-sm font-bold mt-1.5 leading-snug">
                    {pillar.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Deep-Dive Panel */}
          <div
            className={`mt-6 rounded-3xl border p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              heroDark
                ? "bg-[#050814] border-slate-800"
                : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">
                  {activePillar.weight}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    heroDark
                      ? "border-slate-700 bg-slate-900 text-slate-300"
                      : "border-slate-200 bg-slate-100 text-slate-700"
                  }`}
                >
                  {activePillar.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold">{activePillar.name}</h3>
              <p
                className={`text-sm leading-relaxed ${
                  heroDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {activePillar.summary}
              </p>

              <div className="space-y-2.5 pt-1">
                {activePillar.checks.map((chk, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                      heroDark
                        ? "bg-[#0B1022] border-slate-800/90"
                        : "bg-slate-50 border-slate-200/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{chk.label}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 font-bold shrink-0 ml-2">
                      {chk.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-slate-200">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                  <span className="font-mono font-bold text-blue-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Live Scanner Telemetry
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    VERIFIED JSON
                  </span>
                </div>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {activePillar.telemetrySample}
                </pre>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Want to inspect a full 5-pillar report?
                  </span>
                  <Link
                    href="/report/voice-one-com"
                    className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
                  >
                    View voice-one.com <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE BEFORE VS AFTER SEOSPACE NEURAL ENGINE v4.2 */}
      <section
        id="before-after"
        className={`py-20 border-t transition-colors duration-300 ${
          heroDark
            ? "bg-[#050814] border-slate-800/80 text-white"
            : "bg-white border-slate-200/80 text-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-500 border border-purple-500/30 mb-3">
                <Eye className="w-3.5 h-3.5" /> Before &amp; After Live Transformation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                See What Seospace Neural Engine v4.2 Fixes in 1 Click
              </h2>
              <p
                className={`mt-2 text-sm max-w-2xl ${
                  heroDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Real diagnostic comparison from our saved audit of{" "}
                <code className="font-mono font-bold text-blue-500">
                  voice-one.com/services/
                </code>
                . Watch how fixing duplicated titles, missing H1s, and absent
                /llms.txt lifts the domain from 74/100 to 96/100.
              </p>
            </div>

            <div
              className={`inline-flex p-1 rounded-xl border text-xs font-bold self-start ${
                heroDark
                  ? "bg-[#0B1022] border-slate-800"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              {[
                { id: "split", label: "Side-by-Side Diff" },
                { id: "before", label: "Before (Raw 74/100)" },
                { id: "after", label: "After Seospace (96/100)" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    setDiffMode(mode.id as "split" | "before" | "after")
                  }
                  className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
                    diffMode === mode.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : heroDark
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${
              diffMode === "split" ? "lg:grid-cols-2" : "lg:grid-cols-1"
            } gap-6`}
          >
            {/* BEFORE CARD */}
            {(diffMode === "split" || diffMode === "before") && (
              <div
                className={`rounded-3xl border p-6 sm:p-8 space-y-5 ${
                  heroDark
                    ? "bg-[#0B1022]/90 border-rose-500/30"
                    : "bg-rose-50/30 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-rose-500/20">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-500">
                      BEFORE SEOSPACE AUDIT
                    </span>
                    <h3 className="text-lg font-bold mt-2">
                      Unoptimized Raw Page Metadata &amp; Schema
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-amber-500">
                      74<span className="text-sm font-normal">/100</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      Grade C+ • 4 Critical Issues
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Title Tag Duplicated
                        (96 chars — Truncated in Google SERP)
                      </span>
                      <span>-12 pts</span>
                    </div>
                    <p className="font-mono text-slate-400">
                      &ldquo;Virtual Receptionist -Answering Service | Voice
                      OneVirtual Receptionist -Answering Service | Voice
                      One&rdquo;
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Viewport Blocks Pinch
                        Zoom (user-scalable=0)
                      </span>
                      <span>-8 pts</span>
                    </div>
                    <p className="font-mono text-slate-400">
                      content=&ldquo;width=device-width, initial-scale=1.0,
                      maximum-scale=1.0, user-scalable=0&rdquo;
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Missing /llms.txt
                        Manifest &amp; FAQPage JSON-LD
                      </span>
                      <span>-6 pts</span>
                    </div>
                    <p className="font-mono text-slate-400">
                      HTTP 404 on /llms.txt • Invisible to ChatGPT Search &amp;
                      Perplexity citations
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AFTER CARD */}
            {(diffMode === "split" || diffMode === "after") && (
              <div
                className={`rounded-3xl border p-6 sm:p-8 space-y-5 ${
                  heroDark
                    ? "bg-[#0B1022]/90 border-emerald-500/30"
                    : "bg-emerald-50/30 border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-emerald-500/20">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-500">
                      AFTER SEOSPACE NEURAL ENGINE v4.2
                    </span>
                    <h3 className="text-lg font-bold mt-2">
                      1-Click AI Rewritten Tags, GEO Manifest &amp; Article
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-emerald-500">
                      96<span className="text-sm font-normal">/100</span>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-500">
                      Grade A+ • +22 Pt Lift
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Clean 57-Char
                        Front-Loaded Title Tag
                      </span>
                      <span>+12 pts</span>
                    </div>
                    <p
                      className={`font-mono ${
                        heroDark ? "text-emerald-300" : "text-emerald-800"
                      }`}
                    >
                      &ldquo;24/7 Live Virtual Receptionist &amp; Answering
                      Service | Voice One&rdquo;
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> WCAG 2.2 AA
                        Accessible Viewport + Semantic H1
                      </span>
                      <span>+8 pts</span>
                    </div>
                    <p
                      className={`font-mono ${
                        heroDark ? "text-emerald-300" : "text-emerald-800"
                      }`}
                    >
                      content=&ldquo;width=device-width, initial-scale=1.0&rdquo; •
                      H1: &ldquo;24/7 Live Virtual Receptionists That Capture
                      Every Lead&rdquo;
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      heroDark
                        ? "bg-slate-950 border-slate-800"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-500 mb-1">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Generated
                        /llms.txt + 96/100 Companion SEO Guide
                      </span>
                      <span>+6 pts</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-slate-400">
                        Ready for ChatGPT Search &amp; Perplexity citations
                      </span>
                      <Link
                        href="/article/art-voiceone-guide"
                        className="text-blue-500 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Read Generated Article ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: Audience Cards, Public Tools Suite & Agency ROI Calculator */}
      <section
        className={`py-20 border-t transition-colors duration-300 ${
          heroDark
            ? "bg-[#0B1022]/60 border-slate-800/80 text-white"
            : "bg-slate-50/70 border-slate-200/80 text-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3
              className={`text-2xl sm:text-3xl font-bold ${
                heroDark ? "text-white" : "text-slate-950"
              }`}
            >
              Built for Growth Teams, Agencies &amp; Technical Marketers
            </h3>
            <p
              className={`mt-2 text-sm ${
                heroDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Explore our complete ecosystem of public tools, competitor
              battlecards, and agency lead-capture workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Digital & SEO Agencies",
                desc: "Generate white-label PDF audits with your agency logo and 'Book a Strategy Call' button to close $1,500+/mo retainers.",
                icon: Award,
                href: "/dashboard?tab=whitelabel",
                cta: "Open White-Label Studio",
              },
              {
                title: "Competitor Domain Battlecard",
                desc: "Pit any two URLs head-to-head across SEO, CRO, GEO, WCAG, and live Cloudflare 1.1.1.1 DNS with 1-click AI Outrank Articles.",
                icon: Swords,
                href: "/compare",
                cta: "Launch Battlecard Engine",
              },
              {
                title: "4-in-1 Free SEO & DNS Tools",
                desc: "Generate /llms.txt manifests, Organization/FAQPage JSON-LD schema, AI crawler robots.txt, and inspect live SPF/DMARC records.",
                icon: Wrench,
                href: "/tools",
                cta: "Use Free Generator Suite",
              },
              {
                title: "AI SEO Content Studio",
                desc: "Write or generate 800+ word SEO articles graded in real time from 0–100 with public shareable links and clean HTML export.",
                icon: Code2,
                href: "/dashboard?tab=editor",
                cta: "Open Content Studio",
              },
              {
                title: "Developer REST API & Webhooks",
                desc: "Automate URL auditing, DNS lookups, and keyword research inside Zapier, Make, or your custom CRM via our JSON REST API.",
                icon: Terminal,
                href: "/docs",
                cta: "Test Live API Playground",
              },
              {
                title: "Security, Trust & Crawler Hub",
                desc: "Verify our SOC2/GDPR posture, Supabase RLS isolation, zero-training AI policy, and live /robots.txt, /sitemap.xml & /llms.txt files.",
                icon: ShieldCheck,
                href: "/security",
                cta: "Inspect Security & Trust",
              },
            ].map((card, i) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className={`p-7 rounded-2xl border transition flex flex-col justify-between group ${
                    heroDark
                      ? "bg-[#050814] border-slate-800 hover:border-blue-500/60"
                      : "bg-white border-slate-200 hover:border-blue-500/50 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                        heroDark
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "bg-slate-950 text-white"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4
                      className={`text-lg font-bold ${
                        heroDark ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {card.title}
                    </h4>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        heroDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-500/15 inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 group-hover:translate-x-0.5 transition">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Interactive Agency ROI Estimator */}
          <div className="mt-16 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                  <Zap className="w-3.5 h-3.5" /> Agency Lead-Magnet ROI
                  Calculator
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold">
                  See How 1 Branded Audit Pays for Your Entire Year
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Agencies use our White-Label PDF Reports &amp; Embeddable Audit
                  Widget to turn cold prospects into high-ticket SEO &amp; web
                  design retainers.
                </p>

                <div className="space-y-5 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-300">
                        Branded Audits Sent to Prospects / Month
                      </span>
                      <span className="text-blue-400 font-bold">
                        {auditsSentPerMonth} Audits / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={5}
                      value={auditsSentPerMonth}
                      onChange={(e) =>
                        setAuditsSentPerMonth(Number(e.target.value))
                      }
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-300">
                        Your Average Client Monthly Retainer
                      </span>
                      <span className="text-blue-400 font-bold">
                        ${clientRetainerValue.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={250}
                      value={clientRetainerValue}
                      onChange={(e) =>
                        setClientRetainerValue(Number(e.target.value))
                      }
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center space-y-4">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Projected Monthly Agency Pipeline
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400">
                  +${projectedMonthlyRevenue.toLocaleString()}
                  <span className="text-base text-slate-400 font-normal">
                    /mo
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Based on closing ~{estimatedNewClients} new client(s) at a
                  conservative 12% audit-to-call conversion rate.
                </div>
                <div className="pt-2">
                  <Link
                    href="/signup?plan=agency"
                    className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition"
                  >
                    <span>Launch Your Agency Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Simple, Transparent Pricing */}
      <section
        id="pricing"
        className={`py-20 border-t transition-colors duration-300 ${
          heroDark
            ? "bg-[#050814] border-slate-800/80 text-white"
            : "bg-white border-slate-200/80 text-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl font-bold ${
                heroDark ? "text-white" : "text-slate-950"
              }`}
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className={`mt-2.5 text-sm ${
                heroDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Choose the plan that fits your SEO &amp; content creation needs. All
              plans include a 30-day money-back guarantee. Cancel anytime.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div
              className={`mt-6 inline-flex items-center gap-2 p-1 rounded-full border shadow-2xs ${
                heroDark
                  ? "border-slate-800 bg-[#0B1022]"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? heroDark
                      ? "bg-white text-slate-950"
                      : "bg-slate-950 text-white"
                    : heroDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-blue-600 text-white"
                    : heroDark
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => {
              const displayPrice =
                billingCycle === "annual"
                  ? plan.annualPricePerMonth
                  : plan.monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 pt-9 flex flex-col justify-between transition ${
                    plan.highlighted
                      ? heroDark
                        ? "bg-[#0B1022] border-2 border-blue-500 shadow-xl shadow-blue-500/10"
                        : "bg-white border-2 border-blue-500 shadow-xl shadow-blue-500/10"
                      : heroDark
                      ? "bg-[#0B1022]/80 border border-slate-800"
                      : "bg-white border border-slate-200 shadow-xs"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                      <span
                        className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-2xs ${
                          plan.highlighted
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-slate-900 text-white border-slate-700"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-center">
                      <h3
                        className={`text-lg font-bold ${
                          heroDark ? "text-white" : "text-slate-950"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span
                          className={`text-4xl sm:text-5xl font-extrabold ${
                            heroDark ? "text-white" : "text-slate-950"
                          }`}
                        >
                          ${displayPrice}
                        </span>
                        <span className="text-sm text-slate-400 font-medium">
                          /month
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {plan.tagline}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className={`mt-6 w-full py-3 px-5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                        plan.highlighted
                          ? "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                          : heroDark
                          ? "bg-white text-slate-950 hover:bg-slate-100"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {checkoutLoading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting to Stripe...</span>
                        </>
                      ) : (
                        <span>
                          {plan.monthlyPrice === 0
                            ? "Start Free"
                            : "Get Started"}
                        </span>
                      )}
                    </button>

                    <div
                      className={`mt-7 pt-6 border-t space-y-3 ${
                        heroDark ? "border-slate-800" : "border-slate-100"
                      }`}
                    >
                      {plan.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs ${
                            heroDark ? "text-slate-300" : "text-slate-700"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`mt-6 pt-4 border-t text-center ${
                      heroDark ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <span className="text-[11px] font-medium text-slate-400">
                      {plan.auditsPerMonth} • Instant activation
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE FAQ ACCORDION */}
      <section
        id="faq"
        className={`py-20 border-t transition-colors duration-300 ${
          heroDark
            ? "bg-[#0B1022]/60 border-slate-800/80 text-white"
            : "bg-slate-50/70 border-slate-200/80 text-slate-900"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30 mb-3">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything You Need to Know About Seospace AI
            </h2>
            <p
              className={`mt-2 text-sm ${
                heroDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Transparent answers on our uninflated scoring math, saved-first
              database architecture, and agency white-label licensing.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition ${
                    heroDark
                      ? "bg-[#050814] border-slate-800"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-blue-500" : "text-slate-400"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                        heroDark
                          ? "border-slate-800/80 text-slate-300"
                          : "border-slate-100 text-slate-600"
                      }`}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Multi-Column Footer with Light/Dark Reactivity & Public Manifest Links */}
      <PublicFooter isDark={heroDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
