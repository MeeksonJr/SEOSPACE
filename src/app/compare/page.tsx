"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicNavbar, PublicFooter, usePublicTheme } from "@/components/ui/PublicChrome";
import { SAMPLE_AUDITS } from "@/lib/sample-audits";
import { saveAuditReport, syncFromServerDb } from "@/lib/storage/workspace-store";
import { AuditReport, PillarKey } from "@/types/audit";

const PILLAR_KEYS: PillarKey[] = ["seo", "cro", "geo", "a11y", "security"];

function CompareContent() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const searchParams = useSearchParams();
  const initialPrimary =
    searchParams.get("primary") || "https://voice-one.com/services/";
  const initialCompetitor =
    searchParams.get("competitor") || "https://stripe.com";

  const [primaryInput, setPrimaryInput] = useState(initialPrimary);
  const [competitorInput, setCompetitorInput] = useState(initialCompetitor);

  const [primaryReport, setPrimaryReport] = useState<AuditReport>(
    SAMPLE_AUDITS["voice-one-com"]
  );
  const [competitorReport, setCompetitorReport] = useState<AuditReport>(
    SAMPLE_AUDITS["stripe-com"]
  );

  const [loading, setLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Loaded saved-first domain snapshots from Server Database"
  );

  useEffect(() => {
    syncFromServerDb().then(({ audits }) => {
      if (audits.length > 0) {
        const pMatch = audits.find(
          (a) =>
            a.url.toLowerCase().includes(
              initialPrimary.replace(/^https?:\/\//i, "").toLowerCase()
            ) || a.domain.toLowerCase() === initialPrimary.toLowerCase()
        );
        const cMatch = audits.find(
          (a) =>
            a.url.toLowerCase().includes(
              initialCompetitor.replace(/^https?:\/\//i, "").toLowerCase()
            ) || a.domain.toLowerCase() === initialCompetitor.toLowerCase()
        );
        if (pMatch) setPrimaryReport(pMatch);
        if (cMatch) setCompetitorReport(cMatch);
      }
    });
  }, [initialPrimary, initialCompetitor]);

  async function runComparison(
    urlA = primaryInput,
    urlB = competitorInput,
    refresh = forceRefresh
  ) {
    if (!urlA.trim() || !urlB.trim()) return;
    setLoading(true);
    setStatusMessage(
      refresh
        ? "Fetching fresh live Edge Crawler + Cloudflare DoH DNS + DOM audits for both domains..."
        : "Resolving saved-first database snapshots (or scanning live if new)..."
    );

    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlA.trim(), forceRefresh: refresh }),
        }).then((r) => r.json()),
        fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlB.trim(), forceRefresh: refresh }),
        }).then((r) => r.json()),
      ]);

      if (resA?.report && resB?.report) {
        const repA: AuditReport = resA.report;
        const repB: AuditReport = resB.report;
        saveAuditReport(repA, !resA.cached);
        saveAuditReport(repB, !resB.cached);
        setPrimaryReport(repA);
        setCompetitorReport(repB);

        const winner =
          repA.overallScore >= repB.overallScore ? repA.domain : repB.domain;
        const delta = Math.abs(repA.overallScore - repB.overallScore);

        setStatusMessage(
          `Comparison complete • ${
            resA.cached && resB.cached
              ? "Instant Saved DB Snapshot"
              : "Live Engine + Saved to Server DB"
          } • ${winner} leads by +${delta} pts`
        );

        fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "save_comparison",
            comparison: {
              id: `cmp-${repA.domain.replace(/\./g, "-")}-vs-${repB.domain.replace(/\./g, "-")}`,
              primaryUrl: repA.url,
              competitorUrl: repB.url,
              primaryDomain: repA.domain,
              competitorDomain: repB.domain,
              primaryScore: repA.overallScore,
              competitorScore: repB.overallScore,
              winnerDomain: winner,
              scoreDelta: delta,
              createdAt: new Date().toISOString(),
            },
          }),
        }).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  }

  const winnerReport =
    primaryReport.overallScore >= competitorReport.overallScore
      ? primaryReport
      : competitorReport;
  const trailingReport =
    primaryReport.overallScore >= competitorReport.overallScore
      ? competitorReport
      : primaryReport;
  const scoreDiff = Math.abs(
    primaryReport.overallScore - competitorReport.overallScore
  );

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans transition-colors duration-300">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-[88rem] mx-auto w-full space-y-10">
        {/* ====================================================================
            HEADER & INPUT STAGE
            ==================================================================== */}
        <div className="sp-stage border border-line p-6 sm:p-10 rounded-3xl sp-card-shadow space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="sp-eyebrow text-accent mb-1.5">
                Competitor Intelligence Engine • 5 Pillars + Cloudflare DoH
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Battlecard<span className="text-accent">+</span> <br />
                <span className="text-mute font-normal">Side-by-side domain gap analyzer.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-2 max-w-2xl leading-relaxed">
                Benchmark your website against any competitor across Technical SEO, CRO heuristics, AI Search (GEO) citations, WCAG 2.2 accessibility, and live Cloudflare DNS security.
              </p>
            </div>

            {/* Instant Battlecard Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="sp-eyebrow !text-[0.62rem] text-mute">Instant Pairs:</span>
              <button
                type="button"
                onClick={() => {
                  setPrimaryInput("https://voice-one.com/services/");
                  setCompetitorInput("https://stripe.com");
                  runComparison("https://voice-one.com/services/", "https://stripe.com", false);
                }}
                className="px-3 py-1.5 rounded-full border border-line bg-card hover:bg-ink hover:text-paper transition cursor-pointer font-mono text-[0.72rem]"
              >
                voice-one.com vs stripe.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrimaryInput("https://linear.app");
                  setCompetitorInput("https://vercel.com");
                  runComparison("https://linear.app", "https://vercel.com", false);
                }}
                className="px-3 py-1.5 rounded-full border border-line bg-card hover:bg-ink hover:text-paper transition cursor-pointer font-mono text-[0.72rem]"
              >
                linear.app vs vercel.com
              </button>
            </div>
          </div>

          {/* Side-by-Side Dual URL Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runComparison(primaryInput, competitorInput, forceRefresh);
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center pt-2"
          >
            <div className="lg:col-span-5 space-y-1.5">
              <label className="sp-eyebrow !text-[0.62rem] text-cobalt block font-bold">
                Primary Target (Your Domain)
              </label>
              <div className="rounded-2xl border-2 border-line bg-card px-3.5 py-2.5 flex items-center gap-2">
                <span className="text-cobalt font-mono font-bold">01</span>
                <input
                  type="text"
                  value={primaryInput}
                  onChange={(e) => setPrimaryInput(e.target.value)}
                  placeholder="https://voice-one.com/services/"
                  className="sp-input text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-1.5">
              <label className="sp-eyebrow !text-[0.62rem] text-accent block font-bold">
                Competitor Benchmark (Rival Domain)
              </label>
              <div className="rounded-2xl border-2 border-line bg-card px-3.5 py-2.5 flex items-center gap-2">
                <span className="text-accent font-mono font-bold">02</span>
                <input
                  type="text"
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  placeholder="https://stripe.com"
                  className="sp-input text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end pt-5">
              <button
                type="submit"
                disabled={loading}
                className="sp-btn sp-btn-accent text-xs font-bold w-full"
              >
                {loading ? "Analyzing..." : "Compare ↗"}
              </button>
            </div>
          </form>

          {/* Status & Force Refresh Toggle */}
          <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs text-mute font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{statusMessage}</span>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="accent-[#ff4d14]"
              />
              <span className="sp-eyebrow !text-[0.62rem]">Force Live Re-Scan</span>
            </label>
          </div>
        </div>

        {/* ====================================================================
            WINNER VERDICT & GAP ACTION
            ==================================================================== */}
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 sp-card-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="sp-eyebrow text-accent font-bold">
              Head-to-Head Result • +{scoreDiff} Point Advantage
            </div>
            <h2 className="sp-display text-2xl sm:text-3xl text-ink font-bold">
              {winnerReport.domain} leads {trailingReport.domain} ({winnerReport.overallScore}/100 vs {trailingReport.overallScore}/100)
            </h2>
            <p className="text-xs sm:text-sm text-mute leading-relaxed max-w-2xl">
              {trailingReport.domain} can close the {scoreDiff}-point gap by addressing its{" "}
              {trailingReport.checks.filter((c) => c.severity === "critical").length} critical technical issues and publishing targeted comparison content.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                trailingReport.domain
              )}&auditId=${encodeURIComponent(
                trailingReport.id
              )}&keyword=${encodeURIComponent(
                `${trailingReport.domain.split(".")[0]} vs ${winnerReport.domain.split(".")[0]} comparison`
              )}&autoGenerate=1`}
              className="sp-btn sp-btn-primary text-xs font-bold"
            >
              Draft Article to Outrank {winnerReport.domain} ↗
            </Link>
          </div>
        </div>

        {/* ====================================================================
            SIDE-BY-SIDE DOMAIN SCORECARDS
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {[
            {
              label: "Primary Domain",
              pillClass: "bg-cobalt text-white",
              rep: primaryReport,
            },
            {
              label: "Competitor Benchmark",
              pillClass: "bg-accent text-[#141413]",
              rep: competitorReport,
            },
          ].map(({ label, pillClass, rep }) => (
            <div
              key={rep.id + label}
              className="rounded-3xl border border-line bg-card p-6 sm:p-8 sp-card-shadow space-y-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className={`sp-eyebrow !text-[0.62rem] px-2.5 py-1 rounded-full font-bold ${pillClass}`}>
                    {label}
                  </span>
                  <h3 className="sp-display text-2xl sm:text-3xl text-ink font-bold mt-2">
                    {rep.domain}
                  </h3>
                  <p className="text-xs text-mute truncate max-w-sm mt-0.5 font-mono">{rep.url}</p>
                </div>

                <div className="text-right">
                  <div className="sp-display text-4xl sm:text-5xl font-extrabold text-ink">
                    {rep.overallScore}
                    <span className="text-lg text-mute font-normal">/100</span>
                  </div>
                  <div className="sp-eyebrow text-accent font-bold mt-1">
                    Grade {rep.letterGrade} • {rep.statusLabel}
                  </div>
                </div>
              </div>

              {/* 5 Pillar Bars */}
              <div className="space-y-3 pt-2 border-t border-line">
                {PILLAR_KEYS.map((k) => {
                  const p = rep.pillars[k];
                  return (
                    <div key={k} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-ink">{p.label}</span>
                        <span className="font-mono text-mute">{p.score}/100 ({p.grade})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stage overflow-hidden">
                        <div
                          style={{ width: `${p.score}%` }}
                          className={`h-full rounded-full ${
                            p.score >= 80 ? "bg-emerald-500" : p.score >= 65 ? "bg-accent" : "bg-amber-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                <Link href={`/report/${rep.id}`} className="font-bold text-accent hover:underline">
                  Open full diagnostic report ↗
                </Link>
                <span className="text-mute font-mono text-[11px]">
                  TTFB: <strong>{rep.responseTimeMs}ms</strong> • <strong>{rep.wordCount.toLocaleString()}</strong> words
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ====================================================================
            DETAILED TECHNICAL COMPARISON MATRIX
            ==================================================================== */}
        <div className="rounded-3xl border border-line bg-card overflow-hidden sp-card-shadow">
          <div className="p-6 sm:p-8 border-b border-line flex items-center justify-between">
            <div>
              <div className="sp-eyebrow text-accent">Technical Audit Diff</div>
              <h3 className="sp-display text-2xl text-ink font-bold mt-1">
                Side-by-side engineering breakdown
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-line bg-stage text-mute sp-eyebrow !text-[0.62rem]">
                  <th className="py-3.5 px-4 sm:px-6">Signal / Metric</th>
                  <th className="py-3.5 px-4 sm:px-6">{primaryReport.domain}</th>
                  <th className="py-3.5 px-4 sm:px-6">{competitorReport.domain}</th>
                  <th className="py-3.5 px-4 sm:px-6">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  {
                    label: "Overall Diagnostic Score",
                    valA: `${primaryReport.overallScore}/100 (${primaryReport.letterGrade})`,
                    valB: `${competitorReport.overallScore}/100 (${competitorReport.letterGrade})`,
                    adv: primaryReport.overallScore >= competitorReport.overallScore ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "Technical SEO Pillar",
                    valA: `${primaryReport.pillars.seo.score}/100`,
                    valB: `${competitorReport.pillars.seo.score}/100`,
                    adv: primaryReport.pillars.seo.score >= competitorReport.pillars.seo.score ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "Conversion Rate (CRO) Pillar",
                    valA: `${primaryReport.pillars.cro.score}/100`,
                    valB: `${competitorReport.pillars.cro.score}/100`,
                    adv: primaryReport.pillars.cro.score >= competitorReport.pillars.cro.score ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "AI Search & GEO Readiness",
                    valA: `${primaryReport.pillars.geo.score}/100`,
                    valB: `${competitorReport.pillars.geo.score}/100`,
                    adv: primaryReport.pillars.geo.score >= competitorReport.pillars.geo.score ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "WCAG 2.2 AA Accessibility",
                    valA: `${primaryReport.pillars.a11y.score}/100`,
                    valB: `${competitorReport.pillars.a11y.score}/100`,
                    adv: primaryReport.pillars.a11y.score >= competitorReport.pillars.a11y.score ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "Cloudflare 1.1.1.1 DNS & Security",
                    valA: `${primaryReport.pillars.security.score}/100`,
                    valB: `${competitorReport.pillars.security.score}/100`,
                    adv: primaryReport.pillars.security.score >= competitorReport.pillars.security.score ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "Server TTFB Response Latency",
                    valA: `${primaryReport.responseTimeMs}ms`,
                    valB: `${competitorReport.responseTimeMs}ms`,
                    adv: primaryReport.responseTimeMs <= competitorReport.responseTimeMs ? primaryReport.domain : competitorReport.domain,
                  },
                  {
                    label: "Live /robots.txt AI Crawlers Allowed",
                    valA: primaryReport.metadata?.robotsAnalysis?.allowsGptBot ? "✓ Allowed" : "× Blocked",
                    valB: competitorReport.metadata?.robotsAnalysis?.allowsGptBot ? "✓ Allowed" : "× Blocked",
                    adv: competitorReport.metadata?.robotsAnalysis?.allowsGptBot ? competitorReport.domain : primaryReport.domain,
                  },
                  {
                    label: "DMARC Anti-Spoofing Policy",
                    valA: primaryReport.metadata?.dns?.hasDmarc ? `✓ ${primaryReport.metadata.dns.dmarcPolicy}` : "× Missing",
                    valB: competitorReport.metadata?.dns?.hasDmarc ? `✓ ${competitorReport.metadata.dns.dmarcPolicy}` : "× Missing",
                    adv: competitorReport.metadata?.dns?.hasDmarc ? competitorReport.domain : primaryReport.domain,
                  },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-stage/60 transition-colors">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-ink">{row.label}</td>
                    <td className="py-3 px-4 sm:px-6 font-mono text-ink">{row.valA}</td>
                    <td className="py-3 px-4 sm:px-6 font-mono text-ink">{row.valB}</td>
                    <td className="py-3 px-4 sm:px-6 font-mono text-accent font-bold">
                      {row.adv}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-paper text-ink font-mono text-xs">
          Loading Battlecard Engine...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
