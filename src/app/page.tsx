"use client";

import React, { useState } from "react";
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
  HeartHandshake,
  TrendingUp,
  Code2,
  Layers,
  Bot,
  ExternalLink,
  ChevronRight,
  Building2,
  DollarSign,
  QrCode,
  Sliders,
  HelpCircle,
  Zap,
  Globe,
  Lock,
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

  // Interactive Shield Simulator State
  const [simulatedRating, setSimulatedRating] = useState<number | null>(5);

  // Agency ROI Calculator State
  const [clientCount, setClientCount] = useState<number>(14);
  const [clientFee, setClientFee] = useState<number>(149);

  const calculatedMRR = clientCount * clientFee;
  const calculatedARR = calculatedMRR * 12;

  const copyEmbedCode = () => {
    const code = `<script src="https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`;
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)] transition-colors duration-200">
      {/* Sticky Glassmorphic Navbar */}
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION: High-Design, Visual Trust Badges & Action CTAs
           ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            {/* Top pill badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--sp-line)] bg-[var(--sp-card)] text-xs font-mono font-medium shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--sp-mute)]">Autonomous Reputation SaaS</span>
                <span className="text-emerald-600 font-semibold">• Turnkey Ready</span>
              </div>
            </div>

            {/* Main Title & Pitch */}
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
                The smart QR review funnel that <strong className="text-[var(--sp-ink)] font-semibold">shields your business from unfair 1-star public reviews</strong> while streaming verified 5-star testimonials into embeddable website widgets.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-7 py-3.5 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Open Live Demo Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/r/apex-dental"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--sp-line)] bg-[var(--sp-card)] hover:bg-[var(--sp-stage)] text-[var(--sp-ink)] font-semibold text-sm sm:text-base px-6 py-3.5 transition-all"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Test Live QR Funnel ↗</span>
                </Link>
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
                VISUAL WORKFLOW ARCHITECTURE: 3-Step Diagram
               ========================================================================= */}
            <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 flex-shrink-0"
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
                The Core Value Loop
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
                      Manager alerted via email · Public rating preserved at 4.9⭐
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. CONTINUOUS MARQUEE TICKER (Real Customer Feedback Cards)
           ========================================================================= */}
        <CustomerReviewMarquee />

        {/* =========================================================================
            5. AGENCY RETENTION & ROI CALCULATOR
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
                  <div>• Google Gemini API Free Tier: $0.00 / month</div>
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
            6. COMPETITOR COMPARISON BATTLECARD (TrustPulse vs Birdeye vs Podium)
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
                      <td className="py-4 px-6 font-bold text-emerald-600">✓ Gemini 2.5 Flash (3 Angles)</td>
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
            7. PRICING SECTION CONNECTED TO STRIPE
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
                      <span>50 AI Review Replies / mo</span>
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
                      <span>Unlimited Gemini AI Replies</span>
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
            8. FREQUENTLY ASKED QUESTIONS
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
                  a: "Yes. TrustPulse is engineered to run completely inside the permanent free tiers of Vercel (Edge serverless), Supabase (PostgreSQL), and Google Gemini (15 RPM free tier). There are zero required paid SaaS subscriptions.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-[var(--sp-line)] bg-[var(--sp-card)] space-y-2 shadow-xs"
                >
                  <h3 className="font-bold text-base text-[var(--sp-ink)] flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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

      {/* Footer */}
      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
