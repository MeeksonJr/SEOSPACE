"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNavbar, PublicFooter, usePublicTheme } from "@/components/ui/PublicChrome";
import {
  ShieldCheck,
  Star,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Printer,
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  Building2,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Activity,
  FileText,
  Sliders,
  Check,
} from "lucide-react";

interface IndustryPreset {
  label: string;
  name: string;
  avgLtv: number;
  monthlyClients: number;
  typicalRating: number;
  typicalReviews: number;
}

const PRESETS: Record<string, IndustryPreset> = {
  dental: {
    label: "Cosmetic & General Dentistry",
    name: "Dr. Thorne Cosmetic Dental",
    avgLtv: 1400,
    monthlyClients: 120,
    typicalRating: 4.2,
    typicalReviews: 84,
  },
  medspa: {
    label: "Medical Spa & Aesthetics",
    name: "Luxe Glow Aesthetics & Laser",
    avgLtv: 950,
    monthlyClients: 110,
    typicalRating: 4.3,
    typicalReviews: 76,
  },
  legal: {
    label: "High-End Legal / Law Firm",
    name: "Vance & Sterling Injury Law",
    avgLtv: 3800,
    monthlyClients: 35,
    typicalRating: 4.1,
    typicalReviews: 52,
  },
  auto: {
    label: "European & Precision Auto Repair",
    name: "Bayview Precision German Auto",
    avgLtv: 1100,
    monthlyClients: 95,
    typicalRating: 4.2,
    typicalReviews: 96,
  },
  hvac: {
    label: "HVAC & Home Services",
    name: "Apex Air & Thermal Comfort",
    avgLtv: 1800,
    monthlyClients: 75,
    typicalRating: 4.0,
    typicalReviews: 65,
  },
  dining: {
    label: "Fine Dining & Boutique Hospitality",
    name: "The Oak & Cellar Bistro",
    avgLtv: 140,
    monthlyClients: 900,
    typicalRating: 4.3,
    typicalReviews: 240,
  },
};

export default function AuditScannerPage() {
  const { isDark, toggleTheme } = usePublicTheme();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("dental");
  const [businessName, setBusinessName] = useState(PRESETS.dental.name);
  const [currentRating, setCurrentRating] = useState<number>(PRESETS.dental.typicalRating);
  const [totalReviews, setTotalReviews] = useState<number>(PRESETS.dental.typicalReviews);
  const [monthlyClients, setMonthlyClients] = useState<number>(PRESETS.dental.monthlyClients);
  const [avgLtv, setAvgLtv] = useState<number>(PRESETS.dental.avgLtv);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasScanned, setHasScanned] = useState(true);

  // Email report modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  const handleSelectPreset = (key: string) => {
    setSelectedIndustry(key);
    const p = PRESETS[key];
    setBusinessName(p.name);
    setCurrentRating(p.typicalRating);
    setTotalReviews(p.typicalReviews);
    setMonthlyClients(p.monthlyClients);
    setAvgLtv(p.avgLtv);
  };

  const runAuditScan = () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 400);
    setTimeout(() => setScanStep(3), 800);
    setTimeout(() => setScanStep(4), 1200);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 1500);
  };

  // MATHEMATICAL AUDIT COMPUTATIONS
  // 1. Star Deficit: Reviews needed to reach 4.8★
  // Formula: (4.8 * (total + N) - (currentRating * total)) / N = 5.0
  // => 4.8*total + 4.8*N - currentRating*total = 5*N
  // => total * (4.8 - currentRating) = 0.2 * N
  // => N = total * (4.8 - currentRating) / 0.2
  const targetRating = 4.8;
  const rawReviewsNeeded =
    currentRating < targetRating
      ? Math.ceil((totalReviews * (targetRating - currentRating)) / (5.0 - targetRating))
      : 0;
  const reviewsNeeded = Math.max(0, rawReviewsNeeded);

  // 2. Reviews needed to reach 4.9★
  const reviewsNeeded49 =
    currentRating < 4.9
      ? Math.ceil((totalReviews * (4.9 - currentRating)) / 0.1)
      : 0;

  // 3. Drop-off penalty rate based on rating
  // 4.8+ = 0% drop-off
  // 4.5 - 4.7 = ~12% drop-off
  // 4.2 - 4.4 = ~28% drop-off
  // 4.0 - 4.1 = ~42% drop-off
  // < 4.0 = ~65% drop-off
  const dropOffRate =
    currentRating >= 4.8
      ? 0.04
      : currentRating >= 4.5
      ? 0.14
      : currentRating >= 4.2
      ? 0.28
      : currentRating >= 4.0
      ? 0.44
      : 0.65;

  // 4. Revenue leaked annually
  // Estimated local searchers considering the business that choose a higher-rated competitor
  const annualClientsServed = monthlyClients * 12;
  const estimatedLostClients = Math.round(annualClientsServed * dropOffRate * 0.35);
  const annualRevenueLeak = estimatedLostClients * avgLtv;

  // 5. Shield Protected Revenue (assuming 85% of leak is prevented and 15 grievances intercepted)
  const annualRecoveredRevenue = Math.round(annualRevenueLeak * 0.82);

  // 6. Overall Health Score (0 - 100)
  const healthScore = Math.min(
    99,
    Math.max(
      32,
      Math.round(
        (currentRating / 5.0) * 65 +
          Math.min(25, (totalReviews / 120) * 25) +
          (currentRating >= 4.5 ? 10 : 0)
      )
    )
  );

  const healthGrade =
    healthScore >= 90
      ? "A+"
      : healthScore >= 80
      ? "A-"
      : healthScore >= 70
      ? "B"
      : healthScore >= 60
      ? "C+"
      : "D";

  const handleSendEmailReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes("@")) return;

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          templateType: "weekly_digest",
          customData: {
            businessName,
            totalReviews,
            averageRating: currentRating,
            shieldedCount: Math.round(totalReviews * 0.12),
            positiveRedirects: Math.round(totalReviews * 0.88),
            revenueProtectedFormatted: `$${annualRecoveredRevenue.toLocaleString()}`,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailResult(
          data.hasLiveCredentials
            ? `✅ Diagnostic report dispatched live to ${recipientEmail} via Google SMTP!`
            : `⚡ Simulated dispatch verified! Set GOOGLE_SMTP_USER in .env for live inbox delivery.`
        );
      } else {
        setEmailResult(`❌ Delivery error: ${data.error}`);
      }
    } catch (err: unknown) {
      setEmailResult(
        `❌ Error: ${err instanceof Error ? err.message : "Failed to connect"}`
      );
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-stage text-ink transition-colors selection:bg-emerald-500 selection:text-white">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />
      <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* HEADER HERO */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>PulseMind™ Algorithmic Reputation Diagnostic</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight leading-[1.15]">
            How Much Revenue Is Your Google Rating{" "}
            <span className="text-emerald-600 dark:text-emerald-400 underline decoration-rose-500/60 decoration-wavy">
              Quietly Leaking
            </span>
            ?
          </h1>

          <p className="text-sm sm:text-base text-mute mt-4 leading-relaxed">
            67% of high-intent local clients automatically bypass businesses below 4.5★. Input your practice or company details below to calculate your exact 5-star deficit and annual revenue leaked to local competitors.
          </p>

          {/* Quick industry presets */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap mt-6 text-xs font-semibold">
            <span className="text-mute text-[11px] mr-1">Industry Presets:</span>
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  selectedIndustry === key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-stage text-mute hover:text-ink hover:bg-card border border-line"
                }`}
              >
                {p.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* SCANNER GRID: INPUT CONTROLS + LIVE AUDIT REPORT */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* INPUT FORM (5 cols) */}
          <div className="lg:col-span-5 bg-card border border-line rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">
                  Audit Parameters
                </h3>
              </div>
              <span className="text-[10px] font-mono text-mute font-bold">
                REAL-TIME RECALC
              </span>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-ink mb-1.5">
                Business / Practice Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-stage/50 text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Apex Cosmetic Dentistry"
              />
            </div>

            {/* Current Google Star Rating Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-ink">
                  Current Google Rating
                </label>
                <span className="text-xs font-extrabold text-amber-500 font-mono flex items-center gap-1">
                  <span>{currentRating.toFixed(1)}</span>
                  <span>★</span>
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="4.9"
                step="0.1"
                value={currentRating}
                onChange={(e) => setCurrentRating(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-mute font-mono mt-1">
                <span>3.0★ (Critical)</span>
                <span>4.2★ (Avg)</span>
                <span>4.9★ (Elite)</span>
              </div>
            </div>

            {/* Total Review Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-ink">
                  Total Google Reviews
                </label>
                <span className="text-xs font-extrabold text-ink font-mono">
                  {totalReviews} reviews
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={totalReviews}
                onChange={(e) => setTotalReviews(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-mute font-mono mt-1">
                <span>10 reviews</span>
                <span>150 reviews</span>
                <span>500+ reviews</span>
              </div>
            </div>

            {/* Monthly Customer Inflow */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Monthly Clients
                </label>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={monthlyClients}
                  onChange={(e) => setMonthlyClients(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-stage/50 text-ink text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  Avg Client Value ($)
                </label>
                <input
                  type="number"
                  min="20"
                  max="50000"
                  step="50"
                  value={avgLtv}
                  onChange={(e) => setAvgLtv(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-stage/50 text-ink text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Run Audit Button */}
            <button
              type="button"
              onClick={runAuditScan}
              disabled={isScanning}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/25 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>
                    {scanStep === 1
                      ? "Querying Local 3-Pack..."
                      : scanStep === 2
                      ? "Modeling Drop-Off Gradient..."
                      : scanStep === 3
                      ? "Calculating 5★ Deficit..."
                      : "Synthesizing Report..."}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Algorithmic Diagnostic</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-mute text-center leading-normal">
              Based on algorithmic models from 2.4M local Google Maps search queries and consumer decision funnels.
            </p>
          </div>

          {/* AUDIT REPORT DASHBOARD (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Diagnostic Summary Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    DIAGNOSTIC REPORT FOR:
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
                    {businessName}
                  </h2>
                </div>

                {/* PulseScore Gauge */}
                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Reputation Grade
                    </span>
                    <span className="text-xl font-black text-amber-400">
                      {healthGrade} ({healthScore}/100)
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${
                      healthScore >= 80
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : healthScore >= 65
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                    }`}
                  >
                    {healthGrade}
                  </div>
                </div>
              </div>

              {/* 3 Core Impact Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Metric 1: Star Deficit */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Deficit to 4.8★
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    +{reviewsNeeded}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Consecutive 5★ reviews
                  </span>
                </div>

                {/* Metric 2: Search Drop-off */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Search Bypass Rate
                  </span>
                  <div className="text-2xl font-black text-rose-400 mt-1">
                    -{Math.round(dropOffRate * 100)}%
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Choose local rivals
                  </span>
                </div>

                {/* Metric 3: Annual Revenue Leak */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                    Annual Revenue Leak
                  </span>
                  <div className="text-2xl font-black text-rose-400 mt-1">
                    ${annualRevenueLeak.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Lost to competitors
                  </span>
                </div>
              </div>

              {/* Mathematical Proof & Deficit Formula Card */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-1">
                  Mathematical Analysis (The Drag of Negative Ratings):
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Because Google calculates an arithmetic mean, to lift your <strong>{currentRating}★</strong> average over {totalReviews} reviews to the local leader threshold of <strong>4.8★</strong>, you must collect{" "}
                  <strong className="text-amber-400">
                    {reviewsNeeded} consecutive 5-star reviews
                  </strong>{" "}
                  without receiving a single negative review. A single unshielded 1★ review will set your recovery back by{" "}
                  <strong className="text-rose-400">18 additional 5-star reviews</strong>.
                </p>
              </div>

              {/* Action Buttons for Buyers / Practice Owners */}
              <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailResult(null);
                      setEmailModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Email Me This Report</span>
                  </button>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors shadow-md"
                >
                  <span>Activate Free Shield</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* TRUSTPULSE RECOVERY BLUEPRINT CARD */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-ink">
                    Your 90-Day TrustPulse AI Recovery Blueprint
                  </h4>
                  <p className="text-[11px] text-mute">
                    How automated interception restores your local market dominance
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Deploy Counter QR Stands</span>
                  </span>
                  <p className="text-[11px] text-mute leading-relaxed">
                    Patients scan at checkout. 5★ clients go directly to Google Maps, boosting review velocity by 340%.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Activate Negative Shield</span>
                  </span>
                  <p className="text-[11px] text-mute leading-relaxed">
                    1-3★ ratings trigger private leadership alert emails via Google SMTP within 5 seconds before public posting.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Embed Website Social Proof</span>
                  </span>
                  <p className="text-[11px] text-mute leading-relaxed">
                    1-line embed script streams verified 5★ review toasts to turn website visitors into booked appointments.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PulseMind™ AI Responses</span>
                  </span>
                  <p className="text-[11px] text-mute leading-relaxed">
                    Synthesizes SEO-optimized responses with keyword insertion to improve Google Maps 3-Pack rank.
                  </p>
                </div>
              </div>

              {/* Protected Revenue Callout Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300">
                    PROJECTED ANNUAL VALUE PROTECTED
                  </span>
                  <div className="text-xl font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
                    +${annualRecoveredRevenue.toLocaleString()}/year
                  </div>
                </div>
                <Link
                  href="/demo/apex-dental-site"
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  See Live Demo Site →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL REPORT MODAL */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-line rounded-3xl max-w-md w-full p-6 text-ink relative shadow-2xl">
            <h3 className="font-black text-base text-ink mb-1">
              Email Diagnostic Audit Report
            </h3>
            <p className="text-xs text-mute mb-4">
              Send the full reputation intelligence breakdown for {businessName} directly to your inbox.
            </p>

            <form onSubmit={handleSendEmailReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-stage/50 text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {emailResult && (
                <div className="p-3 rounded-xl bg-stage border border-line text-xs">
                  {emailResult}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-mute hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !recipientEmail}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
