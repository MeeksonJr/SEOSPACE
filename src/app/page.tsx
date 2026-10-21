"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Check,
  Code2,
  FileText,
  Globe,
  Loader2,
  Moon,
  Play,
  Search,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SegmentedGauge } from "@/components/ui/SegmentedGauge";
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
      "Type any niche, product category, or competitor domain below to uncover high-converting commercial keywords powered by the Seospace Neural Engine.",
    metricBadge: "Seospace Neural Keyword Engine",
    ctaLabel: "Launch Full Keyword & Article Studio",
    ctaHref: "/dashboard?tab=editor",
  },
  {
    id: "SEO-Optimized",
    label: "SEO-Optimized",
    headline: "Real-Time 0–100 Mathematical On-Page SEO Scoring As You Type",
    description:
      "Every headline, subheading, and paragraph is evaluated live against 35+ technical SEO and keyword density signals.",
    metricBadge: "Avg +34% Organic Ranking Velocity",
    ctaLabel: "Open Live SEO Score Editor",
    ctaHref: "/dashboard?tab=editor",
  },
  {
    id: "One-Click Audit",
    label: "One-Click Audit",
    headline: "35-Point Technical SEO, CRO, WCAG & RapidAPI Metadata Scanner",
    description:
      "Enter any live website URL to extract metadata via RapidAPI, inspect HTTP headers, DOM heading trees, missing image alt tags, JSON-LD schema, and TTFB speed.",
    metricBadge: "Sub-10s Deep URL Inspection",
    ctaLabel: "View Live Sample Audit Report",
    ctaHref: "/report/voice-one-com",
  },
  {
    id: "AI Inline Editing",
    label: "AI Inline Editing",
    headline: "1-Click AI Assistant That Fixes Your Title, Meta & Body Copy",
    description:
      "Click 'AI Assistant' inside the editor to automatically front-load focus keywords under 60 characters and expand thin sections.",
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
    ctaLabel: "Run a GEO Readiness Scan",
    ctaHref: "/dashboard",
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

export default function LandingPage() {
  const router = useRouter();
  const [heroDark, setHeroDark] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [activeFeatureTab, setActiveFeatureTab] = useState("Keyword Research");
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

  async function handleRunAudit(e?: React.FormEvent, presetUrl?: string) {
    if (e) e.preventDefault();
    const targetUrl = (presetUrl || urlInput || "https://stripe.com").trim();

    // 1. Check if this URL has already been audited & saved — if so, open instantaneously!
    const existingSaved = findSavedAuditByUrl(targetUrl);
    if (existingSaved) {
      router.push(`/report/${existingSaved.id}`);
      return;
    }

    setIsScanning(true);
    setScanStep(`Checking saved database & connecting to ${targetUrl}...`);

    const t1 = setTimeout(
      () => setScanStep("Evaluating 35+ SEO, CRO, WCAG 2.2 & GEO signals..."),
      800
    );
    const t2 = setTimeout(
      () =>
        setScanStep(
          "Running Seospace Neural Engine copywriting & niche keyword analysis..."
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
  const estimatedNewClients = Math.max(1, Math.round(auditsSentPerMonth * 0.12));
  const projectedMonthlyRevenue = estimatedNewClients * clientRetainerValue;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Top Zentra-style Promo Bar (Image 5) */}
      <div className="bg-amber-300/90 text-slate-950 text-xs font-medium py-2 px-4 text-center border-b border-amber-400/50">
        <span>
          🔥 Limited Launch Offer: Get <strong>20% off Annual Plans</strong> +
          Agency White-Label PDF & Lead Widget included.
        </span>{" "}
        <a
          href="#pricing"
          className="font-bold underline inline-flex items-center gap-0.5 ml-1 hover:text-blue-800"
        >
          Claim Offer ↗
        </a>
      </div>

      {/* HERO WRAPPER — Supports both Seospace Light Grid (Image 2) and Seospace Deep Navy (Image 3) */}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/">
              <SeospaceLogo darkText={!heroDark} />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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
                AI SEO Editor
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
              <Link
                href="/widget"
                className={
                  heroDark
                    ? "text-slate-300 hover:text-white transition"
                    : "text-slate-600 hover:text-slate-950 transition"
                }
              >
                Agency Widget
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              {/* Toggle between Image 2 (Light Hero) and Image 3 (Dark Hero) */}
              <button
                onClick={() => setHeroDark(!heroDark)}
                title="Switch Hero Theme (Light / Dark Mode)"
                className={`p-2 rounded-full border text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer ${
                  heroDark
                    ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {heroDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Light Hero</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dark Hero</span>
                  </>
                )}
              </button>

              <Link
                href="/login"
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  heroDark
                    ? "border-slate-700 text-white hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  heroDark
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
                }`}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        {/* HERO CONTENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
          {/* 3-Column 5-Star Social Proof Row (Exact match to Image 2 & 3) */}
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
            <h1
              className={`text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] ${
                heroDark
                  ? "text-white font-editorial sm:text-7xl font-normal"
                  : "text-slate-950"
              }`}
            >
              Your Always On AI <br />
              SEO Growth Engine
            </h1>
            <p
              className={`mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                heroDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace automates your entire SEO &amp; CRO workflow — from
              real-time RapidAPI metadata extraction and URL audits to AI blog
              creation and white-label PDF client reports — powered by the
              Seospace Neural Engine.
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
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
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
                  <span className="hidden md:inline">See a Demo</span>
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
                  Click to Run a Real Live Scan:
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
                    ⚡ Scan {domain}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* 3-COLUMN FLOATING BENTO SHOWCASE (Exact Match to Image 2 & Image 3) */}
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
                  SEO-optimized articles in 1 click.
                </p>
                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-semibold">
                      SEO
                    </span>
                    <span
                      className={heroDark ? "text-slate-400" : "text-slate-500"}
                    >
                      10 Minutes
                    </span>
                  </div>
                  <Link
                    href="/dashboard?tab=editor&keyword=Linkable%20alternative&autoGenerate=1"
                    className="font-semibold inline-flex items-center gap-1 hover:text-blue-600 transition"
                  >
                    Create <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* KEYWORDS Mini Card — Clicking any pill launches AI Writer for that keyword */}
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
                        <span className="w-5 h-5 rounded-full bg-slate-200/70 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{item.keyword}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-semibold">{item.volume}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            item.difficulty <= 40
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Center Action Play Button (Image 2 signature detail) */}
                <div className="mt-5 flex justify-center">
                  <Link
                    href="/dashboard"
                    title="Open Interactive Workspace"
                    className="w-12 h-12 rounded-full bg-slate-950 text-white border-4 border-white shadow-lg flex items-center justify-center hover:scale-105 transition"
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
                  Top-impact checks that drive SEO & CRO performance.
                </p>
                <SegmentedGauge
                  score={heroGaugeScore}
                  sublabel="Your Score is Excellent"
                  theme={heroDark ? "dark" : "light"}
                />
              </div>

              {/* PLATFORMS INTEGRATION Card (Exact match to Image 2) */}
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
                      <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px]">
                        ◉
                      </span>
                      <span>Ghost / Next.js</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGhostEnabled(!ghostEnabled)}
                      className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer ${
                        ghostEnabled ? "bg-blue-600" : "bg-slate-300"
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
                        wpEnabled ? "bg-blue-600" : "bg-slate-300"
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

        {/* Decorative Geometric 3D Ribbon (Signature Visual from Image 2 & 3) */}
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

      {/* SECTION 2: Everything You Need to Create Great Content & Audits (Images 2 & 3) */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 font-editorial sm:text-5xl font-normal">
              Everything You Need <br />
              to Create Great Content & Audits
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Click any module below or run a live AI keyword discovery search right
              from this page.
            </p>
          </div>

          {/* Horizontal Interactive Feature Filter Pills (Image 2) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {FEATURE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeFeatureTab === tab.id
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Feature Spotlight Bar */}
          <div className="mt-6 p-6 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                <Sparkles className="w-3.5 h-3.5" /> {activeTabInfo.metricBadge}
              </span>
              <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                {activeTabInfo.headline}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {activeTabInfo.description}
              </p>
            </div>
            <Link
              href={activeTabInfo.ctaHref}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 transition"
            >
              <span>{activeTabInfo.ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento Showcase Grid with REAL WORKING Keyword Research Engine */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bento Card 1: REAL Live Keyword Research Tool */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">
                  <Search className="w-3.5 h-3.5" /> Seospace Neural Keyword
                  Explorer
                </span>
                <h3 className="text-2xl font-bold text-slate-950">
                  Built-in Keyword Research (Try It Live Below!)
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Type any industry, product, or domain below and click{" "}
                  <strong>Search Keywords</strong> to fetch real keyword
                  opportunities, CPC, and difficulty scores.
                </p>
              </div>

              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <form
                  onSubmit={handleLiveKeywordSearch}
                  className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={kwQuery}
                      onChange={(e) => setKwQuery(e.target.value)}
                      placeholder="Type any topic (e.g. VoIP Phone System, AI CRM)..."
                      className="w-full bg-transparent focus:outline-none text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={kwLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition inline-flex items-center gap-1.5 cursor-pointer shrink-0"
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
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-2"
                    >
                      <span className="font-semibold text-slate-800 truncate">
                        {row.keyword}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-500">{row.volume}/mo</span>
                        <span className="text-slate-500 hidden sm:inline">
                          {row.cpc}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            row.difficulty <= 40
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          KD {row.difficulty}
                        </span>
                        <Link
                          href={`/dashboard?tab=editor&keyword=${encodeURIComponent(
                            row.keyword
                          )}&autoGenerate=1`}
                          className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition"
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
            <div className="rounded-3xl border border-slate-200 bg-slate-950 text-white p-8 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Real-time AI Assistant
                </span>
                <h3 className="text-2xl font-bold">
                  AI Content Studio & Audit-Ready PDF Reports in Seconds
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
                      Focus keyword appears in H1 & Meta Title
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-slate-200">
                      JSON-LD & LLMs.txt AI Search citation ready
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span className="text-slate-300">
                      Click to auto-fix missing alt & meta tags
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

          {/* 3-Column Audience & Agency Use-Cases */}
          <div className="mt-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
                Perfect for Every Growth Team & Agency
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Whether you&apos;re a solo founder, an SEO consultant, or a
                25-person agency, Seospace adapts to your workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Digital & SEO Agencies",
                  desc: "Generate white-label PDF audits with your agency logo and 'Book a Strategy Call' button to close $1,500+/mo retainers.",
                  icon: Award,
                  href: "/dashboard?tab=whitelabel",
                },
                {
                  title: "SaaS Founders & Marketers",
                  desc: "Benchmark your landing page CRO, technical SEO, and AI Search (GEO) visibility against top competitors.",
                  icon: TrendingUp,
                  href: "/dashboard",
                },
                {
                  title: "Bloggers & Content Teams",
                  desc: "Use the built-in AI Content Studio with real-time 0–100 SEO scoring to publish articles that rank on day one.",
                  icon: Code2,
                  href: "/dashboard?tab=editor",
                },
              ].map((card, i) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={i}
                    href={card.href}
                    className="p-7 rounded-2xl border border-slate-200 bg-white hover:border-blue-500/50 hover:shadow-md transition block"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center mb-5">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-950">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Interactive Agency ROI Estimator */}
          <div className="mt-20 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12">
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
                  Agencies use our White-Label PDF Reports & Embeddable Audit
                  Widget to turn cold prospects into high-ticket SEO & web design
                  retainers.
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

      {/* SECTION 3: Simple, Transparent Pricing */}
      <section
        id="pricing"
        className="py-20 bg-slate-50/70 border-t border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-2.5 text-sm text-slate-500">
              Choose the plan that fits your SEO & content creation needs. All
              plans include a 30-day money-back guarantee. Cancel anytime.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="mt-6 inline-flex items-center gap-2 p-1 rounded-full border border-slate-200 bg-white shadow-2xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-blue-600 text-white"
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
                  className={`relative rounded-2xl bg-white p-8 flex flex-col justify-between transition ${
                    plan.highlighted
                      ? "border-2 border-blue-500 shadow-xl shadow-blue-500/10"
                      : "border border-slate-200 shadow-xs"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${
                          plan.highlighted
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-slate-900 text-white border-slate-800"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-950">
                        {plan.name}
                      </h3>
                      <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-slate-950">
                          ${displayPrice}
                        </span>
                        <span className="text-sm text-slate-500 font-medium">
                          /month
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {plan.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className={`mt-6 w-full py-3 px-5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                        plan.highlighted
                          ? "bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
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

                    <div className="mt-7 pt-6 border-t border-slate-100 space-y-3">
                      {plan.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-700"
                        >
                          <div className="w-4 h-4 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <SeospaceLogo size="sm" />
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} Seospace AI Inc. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-950">
              Dashboard
            </Link>
            <Link href="/report/stripe-com" className="hover:text-slate-950">
              Sample Audit
            </Link>
            <Link href="/widget" className="hover:text-slate-950">
              Embed Widget
            </Link>
            <Link href="/admin" className="hover:text-slate-950">
              Admin Portal
            </Link>
            <Link href="/legal/privacy" className="hover:text-slate-950">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-950">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
