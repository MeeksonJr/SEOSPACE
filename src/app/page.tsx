"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PublicNavbar, PublicFooter, usePublicTheme } from "@/components/ui/PublicChrome";
import { CountUp } from "@/components/ui/Motion";
import { PRICING_PLANS } from "@/lib/stripe/plans";
import { findSavedAuditByUrl, saveAuditReport } from "@/lib/storage/workspace-store";
import { PILLAR_ARCHITECTURES, FAQ_ITEMS } from "@/lib/landing-data";
import { LiveKeywordResult } from "@/app/api/keywords/route";

const TRUST_LOGOS = [
  "Next.js 15",
  "Supabase PostgreSQL",
  "Cloudflare 1.1.1.1 DoH",
  "RapidAPI Engine",
  "Stripe Billing",
  "Wayback Machine",
  "WCAG 2.2 AA",
  "llms.txt / GEO",
  "JSON-LD Schema",
  "Vercel Edge",
];

export default function LandingPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = usePublicTheme(false);

  // Live URL Audit State
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");

  // Pillar Explorer State
  const [activePillarId, setActivePillarId] = useState("seo");

  // Before / After Diff State
  const [diffMode, setDiffMode] = useState<"split" | "before" | "after">("split");

  // Keyword Explorer State
  const [kwQuery, setKwQuery] = useState("AI SEO SaaS Audit");
  const [kwLoading, setKwLoading] = useState(false);
  const [liveKeywords, setLiveKeywords] = useState<LiveKeywordResult[]>([
    {
      keyword: "AI SEO Audit SaaS",
      volume: "14,200",
      cpc: "$6.40",
      difficulty: 34,
      intent: "Commercial",
      topicTitle: "Best AI SEO Audit Tools to Automate Technical Audits in 2026",
    },
    {
      keyword: "White Label SEO Report Generator",
      volume: "9,800",
      cpc: "$7.90",
      difficulty: 29,
      intent: "Transactional",
      topicTitle: "How Agencies Use White-Label Audits to Close $3,000/mo Retainers",
    },
    {
      keyword: "GEO AI Search Optimization",
      volume: "18,500",
      cpc: "$5.20",
      difficulty: 42,
      intent: "Informational",
      topicTitle: "Generative Engine Optimization (GEO): Complete /llms.txt Guide",
    },
  ]);

  // Pricing & ROI State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [auditsSentPerMonth, setAuditsSentPerMonth] = useState(25);
  const [clientRetainerValue, setClientRetainerValue] = useState(1500);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  async function handleRunAudit(e?: React.FormEvent, presetUrl?: string) {
    if (e) e.preventDefault();
    const targetUrl = (presetUrl || urlInput || "https://stripe.com").trim();

    const existingSaved = findSavedAuditByUrl(targetUrl);
    if (existingSaved) {
      router.push(`/report/${existingSaved.id}`);
      return;
    }

    setIsScanning(true);
    setScanStep(`Connecting to ${targetUrl} via RapidAPI & Cloudflare 1.1.1.1 DoH...`);

    const t1 = setTimeout(() => {
      setScanStep("Evaluating 35+ SEO, CRO, WCAG 2.2 & DNS security signals...");
    }, 700);

    const t2 = setTimeout(() => {
      setScanStep("Computing pillar scores with Seospace Neural Engine v4.2...");
    }, 1500);

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
      } else {
        router.push("/report/voice-one-com");
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

  const activePillar =
    PILLAR_ARCHITECTURES.find((p) => p.id === activePillarId) || PILLAR_ARCHITECTURES[0];

  const estimatedNewClients = Math.max(1, Math.round(auditsSentPerMonth * 0.12));
  const projectedMonthlyRevenue = estimatedNewClients * clientRetainerValue;

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans transition-colors duration-300">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* ====================================================================
            HERO SECTION: Studio Paper Editorial Layout with Real Photography
            ==================================================================== */}
        <section className="px-3 sm:px-6 pt-4 pb-12 sm:pb-20">
          <div className="mx-auto max-w-[88rem] sp-stage border border-line p-5 sm:p-10 lg:p-14 relative overflow-hidden">
            {/* Top Eyebrow Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8" data-reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-card text-xs">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="sp-eyebrow !text-[0.65rem] text-ink font-semibold">
                  Seospace Neural Engine v4.2 • Live 35-Point Audit Suite
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 sp-eyebrow !text-[0.65rem] text-mute">
                <span>Cloudflare 1.1.1.1 DoH</span>
                <span>•</span>
                <span>RapidAPI Metadata</span>
                <span>•</span>
                <span>Saved-First Cache (&lt;15ms)</span>
              </div>
            </div>

            {/* Split Asymmetric Hero Grid */}
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Bold Typography & Live URL Audit Form (7 cols) */}
              <div className="lg:col-span-7 space-y-7" data-reveal data-delay="1">
                <div>
                  <div className="sp-display text-[clamp(2.8rem,7.5vw,7.2rem)] text-ink leading-[0.92]">
                    Audit<span className="text-accent">+</span>
                    <br />
                    <span className="text-mute font-normal">Rank higher.</span>
                  </div>
                  <p className="mt-5 text-base sm:text-xl text-mute max-w-xl leading-relaxed">
                    Automate your entire technical SEO, CRO heuristics, live Cloudflare DNS security, and AI Search (GEO) auditing — with an AI Content Studio and white-label client PDF reports.
                  </p>
                </div>

                {/* Interactive Live URL Input Form */}
                <form
                  onSubmit={(e) => handleRunAudit(e)}
                  className="rounded-3xl border-2 border-ink bg-card p-2 sm:p-2.5 sp-card-shadow max-w-2xl"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex items-center gap-3 px-3 py-2 flex-1 min-w-0">
                      <span className="text-accent font-mono text-lg font-bold select-none">↗</span>
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Enter any domain to audit live (e.g. stripe.com)..."
                        className="sp-input text-sm sm:text-base font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="sp-btn sp-btn-accent text-sm font-bold shrink-0"
                    >
                      {isScanning ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                          <span>Scanning...</span>
                        </span>
                      ) : (
                        <span>Run live audit ↗</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Live Scanning Status or 1-Click Domain Chips */}
                {isScanning ? (
                  <div className="flex items-center gap-2.5 text-xs font-mono text-accent animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{scanStep}</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="sp-eyebrow !text-[0.62rem] text-mute">Instant sample audits:</span>
                    {["stripe.com", "voice-one.com/services/", "linear.app", "vercel.com"].map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => {
                          setUrlInput(dom);
                          handleRunAudit(undefined, dom);
                        }}
                        className="px-2.5 py-1 rounded-full border border-line bg-card hover:bg-ink hover:text-paper hover:border-ink transition-colors cursor-pointer font-mono text-[0.72rem]"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                )}

                {/* Social Proof Row */}
                <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-line/70">
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    {"★★★★★".split("").map((s, i) => (
                      <span key={i}>{s}</span>
                    ))}
                  </div>
                  <div className="text-xs text-mute font-medium">
                    <strong className="text-ink font-semibold">2,400+ agencies</strong> scaling client SEO with white-label deliverables
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Visual Showcase with Tilted Chips & Photo (5 cols) */}
              <div className="lg:col-span-5 relative" data-reveal data-delay="2">
                {/* Main Hero Photo Card */}
                <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[28px] overflow-hidden border border-line bg-card sp-card-shadow">
                  <Image
                    src="/images/hero-portrait.jpg"
                    alt="Agency founder reviewing live Seospace audit results"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                    priority
                  />

                  {/* Glassmorphic Live Indicator Chip (Top Right) */}
                  <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-md text-paper border border-white/20 rounded-full px-3 py-1.5 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>LIVE REPORT</span>
                  </div>

                  {/* Floating Metric Card Overlay (Bottom) */}
                  <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-line sp-card-shadow space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="sp-eyebrow !text-[0.62rem] text-mute">Audited Target</div>
                        <div className="text-sm font-bold text-ink">stripe.com/checkout</div>
                      </div>
                      <div className="text-right">
                        <div className="sp-display text-2xl text-emerald-600 font-extrabold">92/100</div>
                        <div className="sp-eyebrow !text-[0.58rem] text-emerald-600">GRADE A+</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-line text-center">
                      <div className="p-1 rounded bg-stage text-[10px] font-mono">
                        <div className="text-mute text-[8px]">SEO</div>
                        <div className="font-bold text-ink">94</div>
                      </div>
                      <div className="p-1 rounded bg-stage text-[10px] font-mono">
                        <div className="text-mute text-[8px]">CRO</div>
                        <div className="font-bold text-ink">89</div>
                      </div>
                      <div className="p-1 rounded bg-stage text-[10px] font-mono">
                        <div className="text-mute text-[8px]">GEO</div>
                        <div className="font-bold text-ink">96</div>
                      </div>
                      <div className="p-1 rounded bg-stage text-[10px] font-mono">
                        <div className="text-mute text-[8px]">DNS</div>
                        <div className="font-bold text-ink">95</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Tilted Sticky Note (Top Left) */}
                <div className="hidden sm:block absolute -top-5 -left-6 z-10 p-3.5 rounded-2xl bg-butter text-[#141413] sp-card-shadow sp-tilt-l max-w-[170px] select-none">
                  <div className="sp-eyebrow !text-[0.58rem] font-bold text-[#141413]/70">Pillar 05 Security</div>
                  <div className="text-xs font-bold leading-tight mt-1">
                    ✓ SPF &amp; DMARC Policy Verified
                  </div>
                  <div className="text-[10px] text-[#141413]/70 font-mono mt-1">Cloudflare 1.1.1.1</div>
                </div>

                {/* Floating Tilted Growth Badge (Right) */}
                <div className="hidden sm:block absolute top-1/3 -right-6 z-10 p-3.5 rounded-2xl bg-cobalt text-white sp-card-shadow sp-tilt-r max-w-[160px] select-none">
                  <div className="sp-eyebrow !text-[0.58rem] font-bold text-white/70">Organic Velocity</div>
                  <div className="sp-display text-2xl font-bold mt-0.5">+34%</div>
                  <div className="text-[10px] text-white/80 leading-tight">client traffic lift within 30 days</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            PROOF STRIP: Big Count-Up Metrics + Marquee
            ==================================================================== */}
        <section className="py-12 border-y border-line bg-card">
          <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { to: 35, suffix: "", label: "Automated checks per URL audit" },
                { to: 5, suffix: "", label: "Diagnostic pillars: SEO, CRO, GEO, A11y & DNS" },
                { to: 15, suffix: "s", prefix: "<", label: "Live audit round-trip scan time" },
                { to: 95, suffix: "+", label: "Average mathematical AI article score" },
              ].map((stat, i) => (
                <div key={stat.label} className="space-y-1.5" data-reveal data-delay={String(i + 1)}>
                  <div className="sp-display text-4xl sm:text-5xl lg:text-6xl text-ink font-bold">
                    <CountUp to={stat.to} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-xs sm:text-sm text-mute leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Marquee Tape */}
            <div className="sp-marquee mt-10 pt-6 border-t border-line" aria-hidden="true">
              <div className="sp-marquee-track">
                {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, idx) => (
                  <span
                    key={`${logo}-${idx}`}
                    className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-mute whitespace-nowrap mx-5 select-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{logo}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: How It Works — 3-Step Asymmetric Ruled Flow
            ==================================================================== */}
        <section id="how" className="py-16 sm:py-24 px-5 sm:px-8">
          <div className="mx-auto max-w-[88rem]">
            <div className="max-w-2xl space-y-3" data-reveal>
              <div className="sp-eyebrow text-accent">Workflow Engine</div>
              <h2 className="sp-display text-[clamp(2.4rem,6vw,5rem)] text-ink leading-tight">
                From live URL to client-ready deliverable in 3 steps.
              </h2>
              <p className="text-base text-mute">
                Designed for founders, digital agencies, and consultants who need instant answers, verifiable data, and zero generic boilerplate.
              </p>
            </div>

            <div className="mt-14 grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "01",
                  title: "15-Second Multi-Signal Crawl",
                  desc: "We extract OpenGraph, heading trees, and canonical tags via RapidAPI, ping Cloudflare 1.1.1.1 DoH for SPF/DMARC mail records, and verify live /robots.txt and /llms.txt manifests.",
                  badge: "RapidAPI + Cloudflare DoH",
                },
                {
                  step: "02",
                  title: "Mathematical 5-Pillar Scoring",
                  desc: "Every check is strictly evaluated against points-earned vs points-max. You get clear letter grades (A+ to F), exact line-item deductions, and automated AI copywriting diffs.",
                  badge: "Seospace Neural Engine v4.2",
                },
                {
                  step: "03",
                  title: "White-Label Delivery & Studio",
                  desc: "Export branded agency PDFs with your custom logo and Calendly call CTA, or click into the AI Article Studio to turn audited keyword gaps into 95+/100 ranked content.",
                  badge: "Custom Agency PDF Export",
                },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-line bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 sp-card-shadow"
                  data-reveal
                  data-delay={String(i + 1)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="sp-display text-4xl text-accent font-bold">{item.step}</span>
                      <span className="sp-eyebrow !text-[0.62rem] px-2.5 py-1 rounded-full bg-stage text-mute border border-line">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="sp-display text-2xl text-ink font-bold">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-mute leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-line text-xs font-mono text-ink font-semibold flex items-center justify-between">
                    <span>Explore in demo</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: 5-Pillar Architectural Breakdown with Real Telemetry
            ==================================================================== */}
        <section id="architecture" className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-stage">
          <div className="mx-auto max-w-[88rem] space-y-12">
            <div className="max-w-3xl space-y-3" data-reveal>
              <div className="sp-eyebrow text-accent">5-Pillar Diagnostic Framework</div>
              <h2 className="sp-display text-[clamp(2.4rem,6vw,5rem)] text-ink leading-tight">
                Real engineering checks. <br />
                <span className="text-mute font-normal">Zero random percentages.</span>
              </h2>
              <p className="text-sm sm:text-base text-mute">
                Select any pillar below to inspect its exact mathematical weighting, underlying API sources, individual check criteria, and real telemetry payloads.
              </p>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="flex flex-wrap gap-2" data-reveal data-delay="1">
              {PILLAR_ARCHITECTURES.map((pillar) => {
                const isSelected = pillar.id === activePillarId;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillarId(pillar.id)}
                    className={`sp-btn text-xs font-semibold cursor-pointer transition-all ${
                      isSelected
                        ? "sp-btn-primary"
                        : "sp-btn-ghost bg-card hover:bg-paper"
                    }`}
                  >
                    <span>{pillar.name}</span>
                    <span className="sp-eyebrow !text-[0.6rem] opacity-70">({pillar.weight})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Inspector Card */}
            <div
              key={activePillar.id}
              className="rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow grid lg:grid-cols-12 gap-8 items-start"
              data-reveal
              data-delay="2"
            >
              {/* Pillar Checks List (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="sp-eyebrow text-accent">{activePillar.badge}</div>
                    <h3 className="sp-display text-2xl sm:text-3xl text-ink font-bold mt-1">
                      {activePillar.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="sp-display text-3xl font-extrabold text-emerald-600">
                      {activePillar.scoreSample}/100
                    </div>
                    <div className="sp-eyebrow !text-[0.6rem] text-mute">{activePillar.weight}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-mute leading-relaxed">
                  {activePillar.summary}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="sp-eyebrow !text-[0.65rem] text-mute">Line-Item Signal Rubric</div>
                  {activePillar.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-line bg-stage flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                        <span className="font-medium text-ink">{chk.label}</span>
                      </div>
                      <span className="sp-eyebrow !text-[0.62rem] text-mute shrink-0">
                        {chk.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Telemetry JSON Viewer (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="sp-eyebrow text-mute">Live Telemetry Inspector</span>
                  <span className="font-mono text-[10px] text-accent font-semibold">200 OK</span>
                </div>
                <div className="rounded-2xl border border-line bg-night p-4 sm:p-5 text-[#f3f0e8] font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner">
                  <pre className="whitespace-pre-wrap">{activePillar.telemetrySample}</pre>
                </div>
                <div className="text-[11px] text-mute flex items-center justify-between pt-1">
                  <span>Engine: Seospace Neural Engine v4.2</span>
                  <Link href="/docs" className="text-accent hover:underline font-mono">
                    View REST spec ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: Live Keyword Explorer & AI Article Studio Showcase
            ==================================================================== */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-card">
          <div className="mx-auto max-w-[88rem] space-y-12">
            <div className="grid lg:grid-cols-12 gap-8 items-end" data-reveal>
              <div className="lg:col-span-8 space-y-3">
                <div className="sp-eyebrow text-accent">Niche Keyword Engine</div>
                <h2 className="sp-display text-[clamp(2.4rem,6vw,5rem)] text-ink leading-tight">
                  Discover keywords. <br />
                  <span className="text-mute font-normal">Generate 95+/100 articles in 1 click.</span>
                </h2>
                <p className="text-sm sm:text-base text-mute max-w-2xl">
                  Try our live keyword discovery tool below. Enter any industry, service, or competitor to retrieve real search volume, commercial CPC, difficulty ratings, and recommended editorial topics.
                </p>
              </div>

              {/* Working Keyword Search Form */}
              <div className="lg:col-span-4">
                <form
                  onSubmit={handleLiveKeywordSearch}
                  className="rounded-2xl border-2 border-ink bg-stage p-1.5 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={kwQuery}
                    onChange={(e) => setKwQuery(e.target.value)}
                    placeholder="Search any niche (e.g. Legal Tech SEO)..."
                    className="sp-input px-3 py-1.5 text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={kwLoading}
                    className="sp-btn sp-btn-primary !py-2 !px-3.5 text-xs font-bold shrink-0"
                  >
                    {kwLoading ? "..." : "Search ↗"}
                  </button>
                </form>
              </div>
            </div>

            {/* Keyword Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6" data-reveal data-delay="1">
              {liveKeywords.map((kw, i) => (
                <div
                  key={kw.keyword + i}
                  className="rounded-3xl border border-line bg-stage p-6 flex flex-col justify-between space-y-5 sp-card-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="sp-eyebrow !text-[0.62rem] px-2.5 py-0.5 rounded-full bg-card border border-line font-bold text-accent">
                        {kw.intent}
                      </span>
                      <span className="text-xs font-mono text-mute">KD: {kw.difficulty}/100</span>
                    </div>

                    <h3 className="sp-display text-xl text-ink font-bold">{kw.keyword}</h3>
                    <p className="text-xs text-mute leading-relaxed">{kw.topicTitle}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-line">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-mute">Vol: </span>
                        <strong className="text-ink">{kw.volume}/mo</strong>
                      </div>
                      <div>
                        <span className="text-mute">CPC: </span>
                        <strong className="text-emerald-600 font-bold">{kw.cpc}</strong>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard?tab=editor&keyword=${encodeURIComponent(
                        kw.keyword
                      )}&autoGenerate=1`}
                      className="sp-btn sp-btn-ghost w-full !py-2 text-xs font-bold"
                    >
                      Draft 95+ Article in Studio ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: Real Editorial Visual Break (Photography + Case Study)
            ==================================================================== */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-paper">
          <div className="mx-auto max-w-[88rem]">
            <div className="rounded-[32px] border border-line bg-night text-[#f3f0e8] p-6 sm:p-12 lg:p-16 relative overflow-hidden sp-card-shadow">
              <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
                {/* Left: Candid Team Review Photography (6 cols) */}
                <div className="lg:col-span-6 relative aspect-[3/2] rounded-2xl overflow-hidden border border-white/20">
                  <Image
                    src="/images/team-review.jpg"
                    alt="Digital marketing agency consultants reviewing Seospace audit report"
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-white/90">
                    Apex Digital Growth Agency · Real-time SEO sprint review
                  </div>
                </div>

                {/* Right: Agency Outcome & Retainer Pitch (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="sp-eyebrow text-accent">Agency Retention Secret</div>
                  <h2 className="sp-display text-[clamp(2.2rem,5vw,4.5rem)] text-white leading-tight">
                    Deliver audit reports that clients actually read.
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                    Most SEO audits are 90-page spreadsheets full of technical jargon that clients never open. Seospace condenses 35 technical checks into a single high-impact letter grade, visual pillar breakdown, and actionable before/after copywriting diffs that make value obvious.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                    <div>
                      <div className="sp-display text-3xl sm:text-4xl text-accent font-bold">12.4%</div>
                      <div className="text-xs text-white/60 mt-1">Audit-to-retainer close rate</div>
                    </div>
                    <div>
                      <div className="sp-display text-3xl sm:text-4xl text-white font-bold">$2,800</div>
                      <div className="text-xs text-white/60 mt-1">Average monthly retainer tier</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/dashboard?tab=whitelabel" className="sp-btn sp-btn-accent">
                      Customize your agency PDF branding ↗
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: Interactive Agency ROI Calculator
            ==================================================================== */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-card">
          <div className="mx-auto max-w-5xl space-y-10" data-reveal>
            <div className="text-center space-y-3">
              <div className="sp-eyebrow text-accent">Agency Economics</div>
              <h2 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Calculate your client acquisition ROI.
              </h2>
              <p className="text-sm sm:text-base text-mute max-w-xl mx-auto">
                See how many client retainers you can close by sending automated, white-label audit reports every month.
              </p>
            </div>

            <div className="rounded-3xl border border-line bg-stage p-6 sm:p-10 sp-card-shadow grid md:grid-cols-2 gap-8 items-center">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-ink mb-2">
                    <span>Audits Delivered Monthly</span>
                    <span className="font-mono text-accent font-bold">{auditsSentPerMonth} audits</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={auditsSentPerMonth}
                    onChange={(e) => setAuditsSentPerMonth(Number(e.target.value))}
                    className="w-full accent-[#ff4d14] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-mute font-mono mt-1">
                    <span>5</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-ink mb-2">
                    <span>Target Monthly Retainer Value</span>
                    <span className="font-mono text-accent font-bold">
                      ${clientRetainerValue.toLocaleString()}/mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="250"
                    value={clientRetainerValue}
                    onChange={(e) => setClientRetainerValue(Number(e.target.value))}
                    className="w-full accent-[#ff4d14] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-mute font-mono mt-1">
                    <span>$500</span>
                    <span>$2,500</span>
                    <span>$5,000</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-line text-xs text-mute">
                  Based on a conservative <strong className="text-ink">12% conversion rate</strong> achieved by agencies using Seospace white-label PDF reports and the embedded lead-capture widget.
                </div>
              </div>

              {/* Projected Revenue Display */}
              <div className="rounded-2xl border border-line bg-card p-6 sm:p-8 text-center space-y-4">
                <div className="sp-eyebrow text-mute">Projected Monthly Retainers</div>
                <div className="sp-display text-4xl sm:text-6xl text-emerald-600 font-extrabold">
                  ${projectedMonthlyRevenue.toLocaleString()}
                  <span className="text-xl font-normal text-mute">/mo</span>
                </div>
                <div className="text-xs text-mute font-medium">
                  Estimated <strong className="text-ink">{estimatedNewClients} new retained clients</strong> every single month
                </div>

                <div className="pt-4 border-t border-line">
                  <Link href="/signup?plan=agency" className="sp-btn sp-btn-primary w-full text-xs font-bold">
                    Start Closing Agency Retainers ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: Transparent Pricing Plans (Stripe Integrated)
            ==================================================================== */}
        <section id="pricing" className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-paper">
          <div className="mx-auto max-w-[88rem] space-y-12">
            <div className="text-center space-y-3" data-reveal>
              <div className="sp-eyebrow text-accent">Transparent Pricing</div>
              <h2 className="sp-display text-[clamp(2.4rem,6vw,5rem)] text-ink leading-tight">
                Simple plans. <br />
                <span className="text-mute font-normal">Immediate ROI.</span>
              </h2>
              <p className="text-sm sm:text-base text-mute max-w-xl mx-auto">
                No hidden API costs, no surprise credit drains. Choose the tier that matches your monthly audit volume.
              </p>

              {/* Monthly / Annual Toggle */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <div className="p-1 rounded-full border border-line bg-card inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-ink text-paper"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === "annual"
                        ? "bg-accent text-[#141413]"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-ink text-paper text-[9px] font-mono">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-stretch" data-reveal data-delay="1">
              {PRICING_PLANS.map((plan) => {
                const isAgency = plan.id === "agency";
                const isPro = plan.id === "pro";
                const price =
                  billingCycle === "annual"
                    ? plan.annualPricePerMonth
                    : plan.monthlyPrice;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                      isAgency
                        ? "border-2 border-accent bg-card sp-card-shadow relative"
                        : "border-line bg-stage hover:bg-card"
                    }`}
                  >
                    {isAgency && (
                      <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-accent text-[#141413] sp-eyebrow !text-[0.62rem] font-bold">
                        Most Popular for Agencies
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="sp-display text-2xl text-ink font-bold">{plan.name}</h3>
                        <span className="sp-eyebrow !text-[0.62rem] text-mute">{plan.auditsPerMonth}</span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="sp-display text-4xl sm:text-5xl text-ink font-bold">
                          ${price}
                        </span>
                        <span className="text-xs text-mute font-mono">/month</span>
                        {billingCycle === "annual" && plan.monthlyPrice > 0 && (
                          <span className="text-xs text-mute line-through ml-2">
                            ${plan.monthlyPrice}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-mute leading-relaxed">{plan.tagline}</p>

                      <div className="pt-4 border-t border-line space-y-2.5">
                        <div className="sp-eyebrow !text-[0.65rem] text-mute">Included Features</div>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-ink font-medium">
                            <span className="text-accent font-bold mt-0.5">✓</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={checkoutLoading === plan.id}
                        className={`w-full sp-btn text-xs font-bold ${
                          isAgency
                            ? "sp-btn-accent"
                            : isPro
                            ? "sp-btn-primary"
                            : "sp-btn-ghost"
                        }`}
                      >
                        {checkoutLoading === plan.id
                          ? "Connecting to Stripe..."
                          : plan.id === "starter"
                          ? "Get Started Free ↗"
                          : `Subscribe to ${plan.name} ↗`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================================
            SECTION: Frequently Asked Questions Accordion
            ==================================================================== */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 border-t border-line bg-card">
          <div className="mx-auto max-w-4xl space-y-10" data-reveal>
            <div className="text-center space-y-3">
              <div className="sp-eyebrow text-accent">Everything You Need to Know</div>
              <h2 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Frequently asked questions.
              </h2>
              <p className="text-sm sm:text-base text-mute max-w-xl mx-auto">
                Got questions about the 35-point audit logic, white-label client PDFs, or AI search manifests? We have answers.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-line bg-stage overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="sp-display text-lg sm:text-xl text-ink font-bold">
                        {faq.q}
                      </span>
                      <span className="sp-eyebrow text-accent font-bold text-base shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-mute leading-relaxed border-t border-line/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
