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
} from "lucide-react";

export default function HomePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  // Widget Preview Tab State
  const [activeWidgetTab, setActiveWidgetTab] = useState<"toast" | "wall" | "pill">("toast");
  const [copiedScript, setCopiedScript] = useState(false);

  // Interactive Shield Simulator State
  const [simulatedRating, setSimulatedRating] = useState<number | null>(5);

  // Agency ROI Calculator State
  const [clientCount, setClientCount] = useState<number>(12);
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
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION: Big Bold Title, Metrics & Live Interactive Demo
           ========================================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            {/* Top pill badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--sp-line)] bg-[var(--sp-card)] text-xs font-mono font-medium shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--sp-mute)]">Autonomous Social Proof &amp; Review Protection</span>
                <span className="text-emerald-600 font-semibold">v1.0 Ready</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="sp-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Protect your 5-star rating.
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
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
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

              {/* Trust metric tags */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-[var(--sp-mute)] font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Cost Infrastructure ($0/mo)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.94 Average Client Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span>1-Line Copy &amp; Paste Script</span>
                </div>
              </div>
            </div>

            {/* =========================================================================
                HERO PREVIEW INTERACTIVE PANEL: Real-time Widget Switcher
               ========================================================================= */}
            <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] p-4 sm:p-6 shadow-2xl overflow-hidden relative">
              {/* Header bar of preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--sp-line)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-[var(--sp-mute)]">
                    live_widget_studio.tsx
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-[var(--sp-stage)] text-xs font-medium">
                  <button
                    onClick={() => setActiveWidgetTab("toast")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeWidgetTab === "toast"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-sm font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Floating Toast
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("wall")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeWidgetTab === "wall"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-sm font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Wall of Love
                  </button>
                  <button
                    onClick={() => setActiveWidgetTab("pill")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      activeWidgetTab === "pill"
                        ? "bg-[var(--sp-card)] text-[var(--sp-ink)] shadow-sm font-semibold"
                        : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                    }`}
                  >
                    Rating Badge
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Body */}
              <div className="py-8 px-2 sm:px-6 min-h-[300px] flex items-center justify-center">
                {activeWidgetTab === "toast" && (
                  <div className="w-full max-w-md p-4 rounded-2xl border border-[var(--sp-line)] bg-slate-900 text-white shadow-xl animate-fade-in flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      S
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm truncate">
                          Sarah Jenkins (Cosmetic Dentistry)
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full animate-fade-in">
                    <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/60 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Marcus Vance</span>
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
                        <span className="font-semibold">Elena Rostova</span>
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
                  &lt;script src=&quot;https://trustpulse-ai.vercel.app/api/widget/script?id=...&quot; defer&gt;&lt;/script&gt;
                </div>
                <button
                  type="button"
                  onClick={copyEmbedCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sp-line)] bg-[var(--sp-stage)] hover:bg-[var(--sp-line)] transition-colors font-medium text-[var(--sp-ink)]"
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
            2. INTERACTIVE NEGATIVE REVIEW SHIELD SIMULATOR
           ========================================================================= */}
        <section id="shield" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)] bg-[var(--sp-stage)]/40">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Core Value Loop
              </div>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                See How The Negative Review Shield Works
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
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
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
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 font-bold">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    Positive Rating Detected ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-200/80 mb-4 max-w-md mx-auto">
                    TrustPulse automatically prompts the customer to copy their review and redirects them directly to Google Business Profile or Trustpilot in 1 click!
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow">
                    <span>Redirecting to Google Maps...</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Condition 2: 1, 2, or 3 Stars */}
              {simulatedRating !== null && simulatedRating < 4 && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-rose-800 dark:text-rose-300 mb-1">
                    Negative Review Shield Activated! ({simulatedRating} Stars)
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-900/80 dark:text-rose-200/80 mb-4 max-w-md mx-auto">
                    <strong>Zero public stars lost.</strong> Instead of posting to Google Maps, an empathetic private feedback form opens directly to the business owner, allowing instant resolution!
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--sp-card)] border border-[var(--sp-line)] text-left text-xs space-y-1.5 max-w-sm mx-auto text-[var(--sp-ink)]">
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
            3. AGENCY ROI CALCULATOR
           ========================================================================= */}
        <section id="roi" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
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
                    <span>$49/mo (Starter)</span>
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
            4. GEMINI AI REVIEW AUTO-RESPONDER SHOWCASE
           ========================================================================= */}
        <section id="ai-replies" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)] bg-[var(--sp-stage)]/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                Google Gemini 2.5 Flash Engine
              </div>
              <h2 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
                AI Auto-Responder with 3 Strategic Angles
              </h2>
              <p className="text-base sm:text-lg text-[var(--sp-mute)]">
                Never leave reviews unanswered. Generate SEO-optimized, de-escalating, and customer loyalty replies in 1.8 seconds.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  SEO
                </div>
                <h3 className="font-bold text-base">Local SEO Booster</h3>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Naturally weaves local service keywords and geographic markers into the reply to boost Google Maps local pack rankings without keyword stuffing.
                </p>
                <div className="p-3 rounded-xl bg-[var(--sp-stage)] text-xs text-[var(--sp-ink)] italic">
                  &ldquo;Thank you Sarah! Dr. Thorne and our cosmetic dental team in Austin are thrilled that your dental implant journey was painless!&rdquo;
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  DEF
                </div>
                <h3 className="font-bold text-base">De-escalation &amp; Empathy</h3>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Crafted for lukewarm or sensitive feedback: compassionate, professional, defuses tension, and invites offline direct resolution with management.
                </p>
                <div className="p-3 rounded-xl bg-[var(--sp-stage)] text-xs text-[var(--sp-ink)] italic">
                  &ldquo;We hold ourselves to rigorous standards and apologize for the delay. Please reach out to our clinic director directly so we can make this right.&rdquo;
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                  LOY
                </div>
                <h3 className="font-bold text-base">Loyalty &amp; Referral</h3>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Deepens relationship with 5-star brand advocates, offering courtesy upgrades on their next visit and encouraging word-of-mouth recommendations.
                </p>
                <div className="p-3 rounded-xl bg-[var(--sp-stage)] text-xs text-[var(--sp-ink)] italic">
                  &ldquo;Clients like you make our practice special! Mention this review during your next visit for a VIP courtesy upgrade.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. PRICING SECTION CONNECTED TO STRIPE
           ========================================================================= */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--sp-line)]">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-[var(--sp-line)] hover:bg-[var(--sp-stage)] transition-colors"
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
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
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
                  className="mt-8 block w-full py-3 rounded-full text-center text-xs font-bold border border-[var(--sp-line)] hover:bg-[var(--sp-stage)] transition-colors"
                >
                  Explore Agency Hub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
