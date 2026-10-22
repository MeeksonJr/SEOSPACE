"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Building2,
  DollarSign,
  QrCode,
  HelpCircle,
  ExternalLink,
  X,
  CheckCircle,
  TrendingUp,
  Flame,
  Zap,
} from "lucide-react";
import {
  DiagonalRibbon,
  CustomerReviewMarquee,
} from "@/components/ui/DiagonalTicker";
import {
  GoogleBadge,
  TrustpilotBadge,
  ProductHuntBadge,
  YelpBadge,
} from "@/components/ui/PlatformBadges";

export default function HomePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  // Widget Preview Tab State
  const [activeWidgetTab, setActiveWidgetTab] = useState<"toast" | "wall" | "pill">("toast");
  const [copiedScript, setCopiedScript] = useState(false);

  // Live Toast Simulation in Bottom Corner
  const [showLiveToast, setShowLiveToast] = useState(false);

  // Interactive Shield Simulator State
  const [simulatedRating, setSimulatedRating] = useState<number | null>(5);

  // Interactive AI Reply Angle State
  const [activeAiAngle, setActiveAiAngle] = useState<"seo" | "empathy" | "loyalty">("seo");

  // Agency ROI Calculator State
  const [clientCount, setClientCount] = useState<number>(14);
  const [clientFee, setClientFee] = useState<number>(149);

  const calculatedMRR = clientCount * clientFee;
  const calculatedARR = calculatedMRR * 12;

  // Auto-trigger the live toast preview after 2.8 seconds to show interactive proof
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLiveToast(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const copyEmbedCode = () => {
    const code = `<script src="https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`;
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Sticky Fixed Glassmorphic Navbar */}
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION: High-Contrast Modern SaaS Presentation
           ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-[#0f1115] dark:via-[#09090b] dark:to-[#09090b]">
          <div className="mx-auto max-w-6xl">
            {/* Top pill badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autonomous Reputation SaaS</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">• 100% Turnkey Commercial Asset</span>
              </div>
            </div>

            {/* Main Title & Value Proposition */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                Protect your 5-star reputation.
                <br />
                Turn happy clients into{" "}
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 decoration-wavy decoration-2">
                  automatic social proof.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The smart QR review funnel that <strong className="text-slate-900 dark:text-white font-semibold">shields your business from unfair 1-star public Google reviews</strong> while streaming verified 5-star customer praise into embeddable website widgets.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Launch Live Demo Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/r/apex-dental"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base px-6 py-3.5 transition-all shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Scan Live QR Funnel ↗</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLiveToast(!showLiveToast)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-sm px-5 py-3.5 transition-all hover:bg-emerald-100/70 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{showLiveToast ? "Hide Live Toast" : "Simulate Live Toast"}</span>
                </button>
              </div>

              {/* Verified Platform Badges Cluster */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Direct Sync With:</span>
                <GoogleBadge />
                <TrustpilotBadge />
                <ProductHuntBadge />
                <YelpBadge />
              </div>
            </div>

            {/* =========================================================================
                HERO VISUAL SHOWCASE: Photorealistic Dual-Device Hardware & SaaS Grid
               ========================================================================= */}
            <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left: Physical Acrylic Stand & iPhone 16 Pro Rating Funnel */}
              <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/images/hero-device-showcase.jpg"
                    alt="TrustPulse AI Acrylic Counter Stand and Smartphone Rating Funnel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex items-end p-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                        Physical Reception Stand
                      </span>
                      <p className="text-white text-xs font-semibold">
                        Sleek acrylic QR stand placed on reception desks • Under 0.4s scan time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Floating MacBook Pro SaaS Command Center */}
              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/images/dashboard-analytics-preview.jpg"
                    alt="TrustPulse AI Reputation Command Center Dashboard Mockup"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1 border border-emerald-500/30">
                          Reputation Command Center
                        </span>
                        <p className="text-white text-xs font-semibold">
                          Live sentiment radar • 99.2% negative reviews shielded • $28,400 revenue protected
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow"
                      >
                        <span>Live Demo</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                THE REVIEW SHIELD IN ACTION: Before vs After Transformation (High Contrast)
               ========================================================================= */}
            <div className="mt-16 max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-10 shadow-lg">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                  Reputation Transformation
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-1">
                  Traditional Review Chaos vs. TrustPulse Shield
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  See how TrustPulse intercepts unhappy walk-outs before they post on Google, while channeling happy clients into permanent 5-star social proof.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Traditional Way */}
                <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/60">
                    <span className="text-xs font-bold font-mono text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ✕ Without TrustPulse
                    </span>
                    <span className="text-xs font-bold text-rose-800 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      Rating: 3.9 ⭐
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Customer experiences slight wait-time delay and vents frustration directly on public Google Maps.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>Public star rating permanently drops from 4.9★ to 4.2★, degrading Google Maps 3-Pack rank.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Prospective high-ticket patients call competitors with 4.8+ ratings; lost monthly revenue estimated at <strong className="text-rose-700 dark:text-rose-400">$3,400+</strong>.</span>
                    </li>
                  </ul>
                </div>

                {/* TrustPulse Way */}
                <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/25 space-y-4 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
                    <span className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ✓ With TrustPulse Shield
                    </span>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Rating: 4.98 ⭐
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Customer scans QR stand. 1–3★ ratings are intercepted by our private feedback gatekeeper with zero Google exposure.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>Owner receives instant alert; manager contacts customer within 15 mins to de-escalate and offer a VIP courtesy.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>4–5★ happy clients are guided directly to Google with 1-click text copy. Public 5-star reviews increase by <strong className="text-emerald-700 dark:text-emerald-400">340%</strong>!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* =========================================================================
                VISUAL WORKFLOW ARCHITECTURE: 3-Step Physical-to-Digital Diagram
               ========================================================================= */}
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono flex items-center justify-center shadow">
                    01
                  </span>
                  <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Customer Scans Counter QR</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Placed on clinic counters, dining tables, or sent via SMS/Email. Opens an instant 5-star rating selector with zero app download.
                </p>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  Speed: &lt; 0.4s load time
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-white dark:bg-[#121316] shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono flex items-center justify-center shadow">
                    02
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Smart Gatekeeper Shield
                </h3>
                <div className="text-xs space-y-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">4–5 Stars:</span> 1-Click Copy &amp; direct redirect to Google Maps!
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-rose-700 dark:text-rose-300">1–3 Stars:</span> Negative Review Shield intercepts complaint privately!
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono flex items-center justify-center shadow">
                    03
                  </span>
                  <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Instant 1-Line Embed</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Verified 5-star reviews stream automatically into floating toasts, Wall of Love masonry, and corner badges on any website via 1 script line.
                </p>
                <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                  1-Line Embed • No npm build
                </div>
              </div>
            </div>

            {/* =========================================================================
                INTERACTIVE LIVE WIDGET STUDIO SANDBOX
               ========================================================================= */}
            <div id="widgets" className="mt-16 max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-4 sm:p-6 shadow-xl overflow-hidden relative">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    trustpulse_widget_engine.js
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 text-xs font-medium">
                  <button
                    onClick={() => setActiveWidgetTab("toast")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "toast"
                        ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Floating Toast
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("wall")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "wall"
                        ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Wall of Love
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("pill")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "pill"
                        ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Corner Rating Pill
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Body with Real Avatars */}
              <div className="py-8 px-2 sm:px-6 min-h-[290px] flex items-center justify-center">
                {activeWidgetTab === "toast" && (
                  <div className="w-full max-w-md p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xl flex gap-3.5 items-start">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                      alt="Sarah Jenkins"
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm truncate">
                          Sarah Jenkins (Cosmetic Patient)
                        </span>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        &ldquo;Dr. Thorne made my smile makeover completely painless. Pristine clinic and zero wait time!&rdquo;
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Google Review
                        </span>
                        <span>4 mins ago</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeWidgetTab === "wall" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                            alt="Marcus Vance"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">Marcus Vance</span>
                        </div>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        &ldquo;World-class front desk and pristine hygiene. They even gave me a warm scented towel after treatment.&rdquo;
                      </p>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Verified Patient • Google
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Elena Rostova"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900 dark:text-white">Elena Rostova</span>
                        </div>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        &ldquo;Did the 1-hour laser whitening before my wedding weekend. 4 shades whiter with zero sensitivity!&rdquo;
                      </p>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Verified Client • Trustpilot
                      </div>
                    </div>
                  </div>
                )}

                {activeWidgetTab === "pill" && (
                  <div>
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-zinc-700">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-sm">4.94 / 5.0</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-zinc-700 pl-3">
                        184+ Verified Client Reviews
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Script Embed Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-md bg-slate-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800">
                  &lt;script src=&quot;https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
                </div>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors font-medium text-slate-900 dark:text-white cursor-pointer"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Embed Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. DIAGONAL RIBBON TICKER (Angled Graphic Element)
           ========================================================================= */}
        <DiagonalRibbon />

        {/* =========================================================================
            3. INTERACTIVE NEGATIVE REVIEW SHIELD SIMULATOR (High Contrast)
           ========================================================================= */}
        <section id="shield" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#0f1115]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Core Gatekeeper Engine
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Interactive Shield Simulator
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Try selecting 5 stars versus 2 stars below to witness how TrustPulse prevents public 1-star Google damage while amplifying happy customers.
              </p>
            </div>

            {/* Interactive Simulator Box */}
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Live Customer Gatekeeper Simulation
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  &ldquo;How was your dental appointment today?&rdquo;
                </h3>
              </div>

              {/* Star Selector */}
              <div className="flex items-center justify-center gap-3 py-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSimulatedRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    aria-label={`Select ${star} stars`}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        (simulatedRating || 0) >= star
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "text-slate-300 dark:text-zinc-700 fill-slate-100 dark:fill-zinc-800"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Condition 1: 4 or 5 Stars */}
              {simulatedRating !== null && simulatedRating >= 4 && (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow-md">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                    Positive Rating Detected ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800/90 dark:text-emerald-300/90 mb-4 max-w-md mx-auto leading-relaxed">
                    TrustPulse automatically prompts the customer to copy their review and redirects them directly to Google Business Profile or Trustpilot in 1 click!
                  </p>
                  <Link
                    href="/r/apex-dental"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>Test Full Live Funnel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Condition 2: 1, 2, or 3 Stars */}
              {simulatedRating !== null && simulatedRating < 4 && (
                <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">
                    Negative Review Shield Activated! ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800/90 dark:text-rose-300/90 mb-4 max-w-md mx-auto leading-relaxed">
                    <strong>Zero public stars lost.</strong> Instead of posting to Google Maps, an empathetic private feedback form opens directly to the business owner, allowing instant resolution!
                  </p>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-left text-xs space-y-1.5 max-w-sm mx-auto text-slate-800 dark:text-slate-200">
                    <div className="font-semibold text-rose-600 dark:text-rose-400">
                      Private Resolution Inbox:
                    </div>
                    <div>&ldquo;Waited 25 mins because appointment was delayed...&rdquo;</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Manager alerted via email · Public rating preserved at 4.98⭐
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. PULSEMIND™ NEURAL ENGINE: AI Review Responder Showcase
           ========================================================================= */}
        <section id="ai-replies" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                PulseMind™ Neural Engine
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Autonomous 3-Angle AI Auto-Responder
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Responding to reviews boosts Google Maps local search visibility by 28%. PulseMind™ generates 3 strategic, contextual responses in under 2 seconds.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6">
              {/* Sample Review */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Customer Review (Apex Dental):</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  &ldquo;Dr. Thorne and his assistants were incredible during my root canal. Virtually pain-free and super modern office!&rdquo;
                </p>
              </div>

              {/* Angle Selector Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("seo")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "seo"
                      ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  1. Local SEO Gratitude
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("empathy")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "empathy"
                      ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  2. Leadership Empathy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("loyalty")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "loyalty"
                      ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  3. Loyalty &amp; Referral
                </button>
              </div>

              {/* Generated Content Box */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-900/40 text-xs sm:text-sm space-y-3">
                {activeAiAngle === "seo" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">
                      Local Keyword Insertion (Austin Cosmetic Dentistry, Root Canal)
                    </div>
                    <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                      &ldquo;Thank you so much for the 5-star review, Sarah! The entire dental care team at Apex Dental Austin is thrilled that you experienced a completely painless root canal procedure. Delivering gentle, high-tech patient care is our daily priority. We look forward to seeing you at your next regular cleaning!&rdquo;
                    </p>
                  </div>
                )}

                {activeAiAngle === "empathy" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">
                      Professional Leadership Attentiveness
                    </div>
                    <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                      &ldquo;Hi Sarah, Dr. Thorne and our clinical assistants truly appreciate you taking the time to share your feedback. Dental procedures can be stressful, and we designed our office protocols specifically to make your visit comfortable and reassuring. Thank you for placing your trust in our practice.&rdquo;
                    </p>
                  </div>
                )}

                {activeAiAngle === "loyalty" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase mb-1">
                      Referral &amp; Retention Magnet
                    </div>
                    <p className="leading-relaxed text-slate-800 dark:text-slate-200">
                      &ldquo;We love hearing this, Sarah! Patients like you make what we do so rewarding. Mention this review to our front desk coordinator on your next visit for a complimentary VIP enamel polish kit, and don&apos;t hesitate to refer your friends and family!&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-zinc-800">
                  <span>Engine: PulseMind™ Neural Engine v5.0</span>
                  <Link
                    href="/dashboard/ai-replies"
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Open AI Studio in Dashboard ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CONTINUOUS MARQUEE TICKER (Real Customer Feedback Cards)
           ========================================================================= */}
        <CustomerReviewMarquee />

        {/* =========================================================================
            6. AGENCY RETENTION & ROI CALCULATOR (High Contrast)
           ========================================================================= */}
        <section id="roi" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" />
                Agency Resale Blueprint
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Turn TrustPulse Into a High-Margin Agency Retainer
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Marketing agencies resell TrustPulse to local dentists, plumbers, roofers, and spas for $99–$299/mo per client location with zero monthly software costs.
              </p>
            </div>

            {/* Calculator Card */}
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-10 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
              {/* Sliders on Left */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Client Locations Managed:
                    </label>
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {clientCount} clients
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={clientCount}
                    onChange={(e) => setClientCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>1 client</span>
                    <span>25 clients</span>
                    <span>50 clients</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Monthly Retainer Billed per Client:
                    </label>
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      ${clientFee} / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min={49}
                    max={299}
                    step={10}
                    value={clientFee}
                    onChange={(e) => setClientFee(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>$49/mo (Basic)</span>
                    <span>$149/mo (Standard)</span>
                    <span>$299/mo (VIP Local)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Infrastructure Cost Breakdown:
                  </div>
                  <div>• Vercel Edge Serverless: $0.00 / month</div>
                  <div>• Supabase PostgreSQL Database: $0.00 / month</div>
                  <div>• PulseMind™ Neural Processing Layer: $0.00 / month</div>
                </div>
              </div>

              {/* Result on Right */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-xl text-center space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-100">
                  Estimated Agency Net Profit
                </span>
                <div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight">
                    ${calculatedMRR.toLocaleString()}
                  </div>
                  <div className="text-emerald-100 text-xs font-medium mt-1">
                    Recurring Monthly Revenue (MRR)
                  </div>
                </div>
                <div className="pt-4 border-t border-emerald-500/60">
                  <div className="text-2xl font-bold font-mono">
                    ${calculatedARR.toLocaleString()}
                  </div>
                  <div className="text-emerald-100 text-xs font-medium">
                    Annual Pure Profit (ARR)
                  </div>
                </div>
                <Link
                  href="/dashboard/agency"
                  className="mt-2 block w-full py-3 rounded-full bg-white hover:bg-slate-100 text-emerald-800 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Explore Agency Hub Demo ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. COMPETITOR COMPARISON BATTLECARD (High-Contrast Table)
           ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#0f1115]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Honest Market Comparison
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Why Buyers &amp; Agencies Choose TrustPulse
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Compare our turnkey, zero-cost architecture against bloated legacy enterprise solutions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121316] rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-100/80 dark:bg-zinc-900 text-slate-700 dark:text-slate-300">
                      <th className="py-4 px-6 font-semibold">Capability</th>
                      <th className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20">TrustPulse AI</th>
                      <th className="py-4 px-6 font-medium">Birdeye</th>
                      <th className="py-4 px-6 font-medium">Podium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Monthly Software Cost</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">$0.00 / month</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">$399 / location</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">$449 / location</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Negative Review Shield</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">✓ Included (1-3★ Gatekeeper)</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Limited / Extra add-on</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">No (Public only)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">1-Line Script Embeds</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">✓ Universal (&lt; 15KB)</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Heavy multi-MB iframe</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Proprietary widget</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">AI Auto-Responder</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">✓ PulseMind™ Neural Engine (3 Angles)</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Basic template text</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">Manual templates</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">Codebase Ownership</td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">✓ 100% Turnkey Transfer</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">SaaS subscription lock-in</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">SaaS subscription lock-in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. PRICING SECTION CONNECTED TO STRIPE
           ========================================================================= */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Simple, High-Margin Pricing
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Turnkey Stripe Subscription Tiers
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Pre-configured Stripe Checkout links. Set your own pricing or flip on Flippa as a recurring SaaS.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Starter Plan */}
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Starter</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    For solo business owners &amp; single locations
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$19</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>1 Business Location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Negative Review Shield QR Funnel</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Floating Toast &amp; Wall of Love Widgets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>50 PulseMind™ AI Replies / mo</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white transition-colors cursor-pointer"
                >
                  Choose Starter
                </Link>
              </div>

              {/* Pro Plan (Featured) */}
              <div className="rounded-3xl border-2 border-emerald-500 bg-white dark:bg-[#121316] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                  Most Popular
                </span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Growth Pro</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    For growing multi-doctor or multi-location practices
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">$49</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Up to 5 Business Locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Printable QR Stand Generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Unlimited Widget Embeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Unlimited PulseMind™ AI Replies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>CSV &amp; Google Review Importer</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer"
                >
                  Get Growth Pro
                </Link>
              </div>

              {/* Agency Plan */}
              <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Agency White-Label</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    For digital agencies managing 20+ clients
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$129</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Unlimited Client Workspaces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>White-Label Branding (Custom Logos)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Monthly Client PDF Performance Reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Priority Support &amp; Webhook Triggers</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard/agency"
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-900 dark:text-white transition-colors cursor-pointer"
                >
                  Explore Agency Hub
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. FREQUENTLY ASKED QUESTIONS (High Contrast Accordion Cards)
           ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#0f1115]">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Answers to Common Questions
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How does the Negative Review Shield work without violating FTC policies?",
                  a: "TrustPulse acts as an honest customer feedback survey. When customers scan your QR stand, they are asked for their experience. Happy customers are politely invited to share their review publicly on Google. Dissatisfied customers are given an immediate direct communication line to business management so their grievance is solved privately before they feel the need to post publicly.",
                },
                {
                  q: "Can digital marketing agencies resell TrustPulse under their own brand?",
                  a: "Yes! The Agency Plan ($129/mo) includes full white-label commercial resale rights. You can add your own agency logo, manage dozens of local business clients, and generate monthly branded PDF performance reports to justify your retainers.",
                },
                {
                  q: "How does the 1-line script embed work on client websites?",
                  a: "Our widget script is pure vanilla JavaScript (< 15KB) hosted on Vercel's global CDN with wildcard CORS headers. Simply paste <script src='...' defer></script> into any HTML, WordPress, Shopify, or Webflow site and the toasts/wall will render automatically.",
                },
                {
                  q: "Is it really $0/month to host and operate?",
                  a: "Yes. TrustPulse is engineered to run completely inside the permanent free tiers of Vercel (Edge serverless), Supabase (PostgreSQL), and the PulseMind™ Neural Engine API layer ($0/mo SLA). There are zero required paid SaaS subscriptions.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121316] space-y-2 shadow-xs"
                >
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          LIVE FLOATING TOAST NOTIFICATION PREVIEW (Pop-up on bottom-right)
         ========================================================================= */}
      {showLiveToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
              alt="Claire Danvers"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Claire Danvers</span>
                <button
                  type="button"
                  onClick={() => setShowLiveToast(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 cursor-pointer"
                  aria-label="Close live toast preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex text-amber-400 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                &ldquo;Just had my whitening done at Apex Dental. 5 stars, gentle &amp; super fast!&rdquo;
              </p>
              <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  Live Widget Toast
                </span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}