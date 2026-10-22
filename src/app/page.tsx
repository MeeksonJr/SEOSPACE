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
  Zap,
  Globe,
  ExternalLink,
  ChevronRight,
  X,
  TrendingUp,
  Sliders,
  CheckCircle,
  Clock,
  Layers,
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

  // Auto-trigger the live toast preview after 3 seconds to show visitor interactive proof
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
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)] transition-colors duration-200">
      {/* Sticky Fixed Glassmorphic Navbar */}
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION: Elevated SaaS Presentation with Dual-Device Showcase
           ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            {/* Top pill badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--sp-line)] bg-[var(--sp-card)] text-xs font-mono font-medium shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--sp-mute)]">Autonomous Reputation SaaS</span>
                <span className="text-emerald-600 font-semibold">• 100% Turnkey Commercial Asset</span>
              </div>
            </div>

            {/* Main Title & Value Proposition */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="sp-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Protect your 5-star reputation.
                <br />
                Turn happy clients into{" "}
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30">
                  automatic social proof.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-[var(--sp-mute)] max-w-2xl mx-auto leading-relaxed">
                The smart QR review funnel that <strong className="text-[var(--sp-ink)] font-semibold">shields your business from unfair 1-star public Google reviews</strong> while streaming verified 5-star customer praise into high-converting website widgets.
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
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--sp-line)] bg-[var(--sp-card)] hover:bg-[var(--sp-stage)] text-[var(--sp-ink)] font-semibold text-sm sm:text-base px-6 py-3.5 transition-all"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Scan Live QR Funnel ↗</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowLiveToast(!showLiveToast)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-semibold text-sm px-5 py-3.5 transition-all hover:bg-emerald-100/60 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{showLiveToast ? "Hide Live Toast" : "Simulate Live Toast"}</span>
                </button>
              </div>

              {/* Verified Platform Badges Cluster */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
                <span className="text-[var(--sp-mute)] font-medium mr-1">Direct Sync With:</span>
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
              <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-2xl relative group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/images/hero-device-showcase.jpg"
                    alt="TrustPulse AI Acrylic Counter Stand and Smartphone Rating Funnel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                        Physical Reception Touchpoint
                      </span>
                      <p className="text-white text-xs font-semibold">
                        Sleek acrylic QR stand placed on reception desks • Under 0.4s scan time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Floating MacBook Pro SaaS Command Center */}
              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-2xl relative group">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src="/images/dashboard-analytics-preview.jpg"
                    alt="TrustPulse AI Reputation Command Center Dashboard Mockup"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-5">
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
                VISUAL WORKFLOW ARCHITECTURE: 3-Step Diagram
               ========================================================================= */}
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3 relative group hover:border-emerald-500 transition-colors">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold font-mono flex items-center justify-center shadow">
                  01
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base">Customer Scans QR</h3>
                  <QrCode className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Placed on clinic counters, dining tables, or sent via SMS/Email. Opens an instant 5-star rating selector with zero app download.
                </p>
                <div className="text-[11px] font-mono text-emerald-600 font-semibold pt-1">
                  Speed: &lt; 0.4s load time
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl border-2 border-emerald-500/80 bg-[var(--sp-card)] shadow-lg space-y-3 relative group">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono flex items-center justify-center shadow">
                  02
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-emerald-800 dark:text-emerald-300">
                    Smart Gatekeeper
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-xs space-y-2">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px]">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">4–5 Stars:</span> 1-Click Copy &amp; redirect to Google Maps!
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px]">
                    <span className="font-bold text-rose-700 dark:text-rose-300">1–3 Stars:</span> Negative Review Shield intercepts complaint privately!
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3 relative group hover:border-emerald-500 transition-colors">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold font-mono flex items-center justify-center shadow">
                  03
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base">Instant Social Proof</h3>
                  <Code2 className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Verified 5-star reviews stream automatically into floating toasts, Wall of Love masonry, and corner badges on any website via 1 script line.
                </p>
                <div className="text-[11px] font-mono text-indigo-600 font-semibold pt-1">
                  1-Line Embed • No npm build
                </div>
              </div>
            </div>

            {/* =========================================================================
                THE REVIEW SHIELD IN ACTION: Before vs After Transformation
               ========================================================================= */}
            <div className="mt-16 max-w-5xl mx-auto rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-10 shadow-lg">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                  Reputation Transformation
                </span>
                <h2 className="sp-display text-2xl sm:text-4xl font-bold mt-1">
                  Traditional Review Chaos vs. TrustPulse Shield
                </h2>
                <p className="text-xs sm:text-sm text-[var(--sp-mute)] mt-1">
                  See how TrustPulse turns angry walk-outs into private resolutions and converts happy clients into public Google stars.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {/* Traditional Way */}
                <div className="p-6 rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/60">
                    <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      ✕ Without TrustPulse
                    </span>
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                      Rating: 3.9 ⭐
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs text-rose-950 dark:text-rose-200/90 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">1.</span>
                      <span>Customer experiences slight wait-time delay and vents frustration directly on public Google Maps.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">2.</span>
                      <span>Public star rating permanently drops from 4.9★ to 4.2★, degrading local SEO search pack rank.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">3.</span>
                      <span>Prospective high-value patients choose competitors with 4.8+ ratings; lost monthly revenue estimated at $3,400+.</span>
                    </li>
                  </ul>
                </div>

                {/* TrustPulse Way */}
                <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800/60">
                    <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ✓ With TrustPulse Shield
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      Rating: 4.98 ⭐
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs text-emerald-950 dark:text-emerald-200/90 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">1.</span>
                      <span>Customer scans QR stand. 1–3★ ratings are intercepted by our private feedback gatekeeper with zero Google exposure.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">2.</span>
                      <span>Owner receives instant alert; manager contacts customer within 15 mins to de-escalate and offer a VIP courtesy.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">3.</span>
                      <span>4–5★ happy clients are guided directly to Google with 1-click text copy. Public 5-star reviews increase by 340%!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* =========================================================================
                INTERACTIVE LIVE WIDGET STUDIO SANDBOX
               ========================================================================= */}
            <div id="widgets" className="mt-16 max-w-4xl mx-auto rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-4 sm:p-6 shadow-2xl overflow-hidden relative">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--sp-line)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[var(--sp-mute)]">
                    trustpulse_widget_engine.js
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-[var(--sp-stage)] text-xs font-medium">
                  <button
                    onClick={() => setActiveWidgetTab("toast")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "toast"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-xs font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Floating Toast
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("wall")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "wall"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-xs font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Wall of Love
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("pill")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeWidgetTab === "pill"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-xs font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Corner Rating Pill
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Body with Real Avatars */}
              <div className="py-8 px-2 sm:px-6 min-h-[290px] flex items-center justify-center">
                {activeWidgetTab === "toast" && (
                  <div className="w-full max-w-md p-4 rounded-2xl border border-[var(--sp-line)] bg-slate-900 text-white shadow-xl animate-fade-in flex gap-3.5 items-start">
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
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        &ldquo;Dr. Thorne made my smile makeover completely painless. Pristine clinic and zero wait time!&rdquo;
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Google Review
                        </span>
                        <span>4 mins ago</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeWidgetTab === "wall" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full animate-fade-in">
                    <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                            alt="Marcus Vance"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold">Marcus Vance</span>
                        </div>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-[var(--sp-mute)] leading-relaxed">
                        &ldquo;World-class front desk and pristine hygiene. They even gave me a warm scented towel after treatment.&rdquo;
                      </p>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        ✓ Verified Patient • Google
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Elena Rostova"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold">Elena Rostova</span>
                        </div>
                        <span className="text-amber-500 font-bold">★★★★★</span>
                      </div>
                      <p className="text-[var(--sp-mute)] leading-relaxed">
                        &ldquo;Did the 1-hour laser whitening before my wedding weekend. 4 shades whiter with zero sensitivity!&rdquo;
                      </p>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        ✓ Verified Client • Trustpilot
                      </div>
                    </div>
                  </div>
                )}

                {activeWidgetTab === "pill" && (
                  <div className="animate-fade-in">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900 text-white shadow-xl border border-slate-700">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-sm">4.94 / 5.0</span>
                      <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
                        184+ Verified Client Reviews
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Script Embed Bar */}
              <div className="pt-4 border-t border-[var(--sp-line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="font-mono text-[var(--sp-mute)] truncate max-w-md">
                  &lt;script src=&quot;https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
                </div>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sp-line)] bg-[var(--sp-stage)] hover:bg-[var(--sp-line)] transition-colors font-medium text-[var(--sp-ink)] cursor-pointer"
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
            3. INTERACTIVE NEGATIVE REVIEW SHIELD SIMULATOR
           ========================================================================= */}
        <section id="shield" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)] bg-[var(--sp-stage)]/40">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Core Gatekeeper Engine
              </div>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                Interactive Shield Simulator
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Try selecting 5 stars versus 2 stars below to witness how TrustPulse prevents public 1-star Google damage while amplifying happy customers.
              </p>
            </div>

            {/* Interactive Simulator Box */}
            <div className="rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-10 shadow-lg max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs font-mono uppercase text-[var(--sp-mute)] tracking-wider">
                  Live Customer Gatekeeper Simulation
                </span>
                <h3 className="text-lg font-bold mt-1">
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
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        (simulatedRating || 0) >= star
                          ? "fill-amber-400 text-amber-400 drop-shadow"
                          : "text-[var(--sp-line)] fill-[var(--sp-stage)]"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Condition 1: 4 or 5 Stars */}
              {simulatedRating !== null && simulatedRating >= 4 && (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg shadow">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    Positive Rating Detected ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-200/80 mb-4 max-w-md mx-auto">
                    TrustPulse automatically prompts the customer to copy their review and redirects them directly to Google Business Profile or Trustpilot in 1 click!
                  </p>
                  <Link
                    href="/r/apex-dental"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                  >
                    <span>Test Full Live Funnel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Condition 2: 1, 2, or 3 Stars */}
              {simulatedRating !== null && simulatedRating < 4 && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-3 shadow">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-rose-800 dark:text-rose-300 mb-1">
                    Negative Review Shield Activated! ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-900/80 dark:text-rose-200/80 mb-4 max-w-md mx-auto">
                    <strong>Zero public stars lost.</strong> Instead of posting to Google Maps, an empathetic private feedback form opens directly to the business owner, allowing instant resolution!
                  </p>
                  <div className="p-3.5 rounded-xl bg-[var(--sp-card)] border border-[var(--sp-line)] text-left text-xs space-y-1.5 max-w-sm mx-auto text-[var(--sp-ink)]">
                    <div className="font-semibold text-rose-600 dark:text-rose-400">
                      Private Resolution Inbox:
                    </div>
                    <div>&ldquo;Waited 25 mins because appointment was delayed...&rdquo;</div>
                    <div className="text-[10px] text-[var(--sp-mute)]">
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
        <section id="ai-replies" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                PulseMind™ Neural Engine
              </div>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                Autonomous 3-Angle AI Auto-Responder
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Responding to reviews boosts Google Maps local search visibility by 28%. PulseMind™ generates 3 strategic, contextual responses in under 2 seconds.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6">
              {/* Sample Review */}
              <div className="p-4 rounded-2xl bg-[var(--sp-stage)]/60 border border-[var(--sp-line)] text-xs sm:text-sm text-[var(--sp-ink)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Customer Review (Dr. Thorne Dental):</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-[var(--sp-mute)] italic">
                  &ldquo;Dr. Thorne and his assistants were incredible during my root canal. Virtually pain-free and super modern office!&rdquo;
                </p>
              </div>

              {/* Angle Selector Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--sp-stage)] text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("seo")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "seo"
                      ? "bg-[var(--sp-card)] text-emerald-600 shadow-sm"
                      : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                  }`}
                >
                  1. Local SEO Gratitude
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("empathy")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "empathy"
                      ? "bg-[var(--sp-card)] text-emerald-600 shadow-sm"
                      : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                  }`}
                >
                  2. Leadership Empathy
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAiAngle("loyalty")}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-semibold ${
                    activeAiAngle === "loyalty"
                      ? "bg-[var(--sp-card)] text-emerald-600 shadow-sm"
                      : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                  }`}
                >
                  3. Loyalty &amp; Referral
                </button>
              </div>

              {/* Generated Content Box */}
              <div className="p-5 rounded-2xl border border-[var(--sp-line)] bg-[var(--sp-paper)] text-xs sm:text-sm space-y-3">
                {activeAiAngle === "seo" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase mb-1">
                      Local Keyword Insertion (Austin Cosmetic Dentistry, Root Canal)
                    </div>
                    <p className="leading-relaxed text-[var(--sp-ink)]">
                      &ldquo;Thank you so much for the 5-star review, Sarah! The entire dental care team at Apex Dental Austin is thrilled that you experienced a completely painless root canal procedure. Delivering gentle, high-tech patient care is our daily priority. We look forward to seeing you at your next regular cleaning!&rdquo;
                    </p>
                  </div>
                )}

                {activeAiAngle === "empathy" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase mb-1">
                      Professional Leadership Attentiveness
                    </div>
                    <p className="leading-relaxed text-[var(--sp-ink)]">
                      &ldquo;Hi Sarah, Dr. Thorne and our clinical assistants truly appreciate you taking the time to share your feedback. Dental procedures can be stressful, and we designed our office protocols specifically to make your visit comfortable and reassuring. Thank you for placing your trust in our practice.&rdquo;
                    </p>
                  </div>
                )}

                {activeAiAngle === "loyalty" && (
                  <div>
                    <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase mb-1">
                      Referral &amp; Retention Magnet
                    </div>
                    <p className="leading-relaxed text-[var(--sp-ink)]">
                      &ldquo;We love hearing this, Sarah! Patients like you make what we do so rewarding. Mention this review to our front desk coordinator on your next visit for a complimentary VIP enamel polish kit, and don&apos;t hesitate to refer your friends and family!&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-[11px] text-[var(--sp-mute)] border-t border-[var(--sp-line)]">
                  <span>Engine: PulseMind™ Neural Engine v5.0</span>
                  <Link
                    href="/dashboard/ai-replies"
                    className="text-emerald-600 font-bold hover:underline"
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
            6. AGENCY RETENTION & ROI CALCULATOR
           ========================================================================= */}
        <section id="roi" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" />
                Agency Resale Blueprint
              </div>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                Turn TrustPulse Into a High-Margin Agency Retainer
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Marketing agencies resell TrustPulse to local dentists, plumbers, roofers, and spas for $99–$299/mo per client location with zero monthly software costs.
              </p>
            </div>

            {/* Calculator Card */}
            <div className="rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-10 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
              {/* Sliders on Left */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-[var(--sp-ink)] flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Client Locations Managed:
                    </label>
                    <span className="text-lg font-bold font-mono text-emerald-600">
                      {clientCount} clients
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={clientCount}
                    onChange={(e) => setClientCount(Number(e.target.value))}
                    className="w-full h-2 bg-[var(--sp-stage)] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--sp-mute)] mt-1 font-mono">
                    <span>1 client</span>
                    <span>25 clients</span>
                    <span>50 clients</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-[var(--sp-ink)] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Monthly Retainer Billed per Client:
                    </label>
                    <span className="text-lg font-bold font-mono text-emerald-600">
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
                    className="w-full h-2 bg-[var(--sp-stage)] rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-[var(--sp-mute)] mt-1 font-mono">
                    <span>$49/mo (Basic)</span>
                    <span>$149/mo (Standard)</span>
                    <span>$299/mo (VIP Local)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--sp-stage)]/50 border border-[var(--sp-line)] text-xs text-[var(--sp-mute)] space-y-1">
                  <div className="font-semibold text-[var(--sp-ink)]">
                    Infrastructure Cost Breakdown:
                  </div>
                  <div>• Vercel Edge Serverless: $0.00 / month</div>
                  <div>• Supabase PostgreSQL Database: $0.00 / month</div>
                  <div>• PulseMind™ Neural Processing Layer: $0.00 / month</div>
                </div>
              </div>

              {/* Result on Right */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-emerald-600 text-white shadow-xl text-center space-y-4">
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
                  className="mt-2 block w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Explore Agency Hub Demo ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. COMPETITOR COMPARISON BATTLECARD (TrustPulse vs Birdeye vs Podium)
           ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)] bg-[var(--sp-stage)]/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                Honest Market Comparison
              </span>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                Why Buyers &amp; Agencies Choose TrustPulse
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Compare our turnkey, zero-cost architecture against bloated legacy enterprise solutions.
              </p>
            </div>

            <div className="bg-[var(--sp-card)] rounded-3xl border border-[var(--sp-line)] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--sp-line)] bg-[var(--sp-stage)] text-[var(--sp-mute)]">
                      <th className="py-4 px-6 font-semibold">Capability</th>
                      <th className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400">TrustPulse AI</th>
                      <th className="py-4 px-6 font-medium">Birdeye</th>
                      <th className="py-4 px-6 font-medium">Podium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sp-line)]">
                    <tr>
                      <td className="py-4 px-6 font-semibold">Monthly Software Cost</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">$0.00 / month</td>
                      <td className="py-4 px-6 text-slate-500">$399 / location</td>
                      <td className="py-4 px-6 text-slate-500">$449 / location</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Negative Review Shield</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">✓ Included (1-3★ Gatekeeper)</td>
                      <td className="py-4 px-6 text-slate-500">Limited / Extra add-on</td>
                      <td className="py-4 px-6 text-slate-500">No (Public only)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">1-Line Script Embeds</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">✓ Universal (&lt; 15KB)</td>
                      <td className="py-4 px-6 text-slate-500">Heavy iframe</td>
                      <td className="py-4 px-6 text-slate-500">Proprietary widget</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">AI Auto-Responder</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">✓ PulseMind™ Neural Engine (3 Angles)</td>
                      <td className="py-4 px-6 text-slate-500">Basic template text</td>
                      <td className="py-4 px-6 text-slate-500">Manual templates</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold">Codebase Ownership</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">✓ 100% Turnkey Transfer</td>
                      <td className="py-4 px-6 text-slate-500">SaaS subscription lock-in</td>
                      <td className="py-4 px-6 text-slate-500">SaaS subscription lock-in</td>
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
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                Simple, High-Margin Pricing
              </span>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                Turnkey Stripe Subscription Tiers
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Pre-configured Stripe Checkout links. Set your own pricing or flip on Flippa as a recurring SaaS.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Starter Plan */}
              <div className="rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-lg">Starter</h3>
                  <p className="text-xs text-[var(--sp-mute)] mt-1">
                    For solo business owners &amp; single locations
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black">$19</span>
                    <span className="text-xs text-[var(--sp-mute)]">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[var(--sp-ink)]">
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
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-[var(--sp-line)] hover:bg-[var(--sp-stage)] transition-colors cursor-pointer"
                >
                  Choose Starter
                </Link>
              </div>

              {/* Pro Plan (Featured) */}
              <div className="rounded-3xl border-2 border-emerald-500 bg-[var(--sp-card)] p-6 sm:p-8 flex flex-col justify-between shadow-xl relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                  Most Popular
                </span>
                <div>
                  <h3 className="font-bold text-lg">Growth Pro</h3>
                  <p className="text-xs text-[var(--sp-mute)] mt-1">
                    For growing multi-doctor or multi-location practices
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-emerald-600">$49</span>
                    <span className="text-xs text-[var(--sp-mute)]">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[var(--sp-ink)]">
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
              <div className="rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="font-bold text-lg">Agency White-Label</h3>
                  <p className="text-xs text-[var(--sp-mute)] mt-1">
                    For digital agencies managing 20+ clients
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black">$129</span>
                    <span className="text-xs text-[var(--sp-mute)]">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-[var(--sp-ink)]">
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
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-[var(--sp-line)] hover:bg-[var(--sp-stage)] transition-colors cursor-pointer"
                >
                  Explore Agency Hub
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. FREQUENTLY ASKED QUESTIONS
           ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)] bg-[var(--sp-stage)]/40">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                Answers to Common Questions
              </span>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
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
                  className="p-6 rounded-2xl border border-[var(--sp-line)] bg-[var(--sp-card)] space-y-2 shadow-xs"
                >
                  <h3 className="font-bold text-base text-[var(--sp-ink)] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--sp-mute)] leading-relaxed pl-6">
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
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl border border-[var(--sp-line)] bg-slate-900 text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
              alt="Claire Danvers"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold truncate">Claire Danvers</span>
                <button
                  type="button"
                  onClick={() => setShowLiveToast(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                  aria-label="Close live toast preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex text-amber-400 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                &ldquo;Just had my whitening done at Apex Dental. 5 stars, gentle &amp; super fast!&rdquo;
              </p>
              <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
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