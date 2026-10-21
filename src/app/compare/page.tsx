"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  XCircle,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SAMPLE_AUDITS } from "@/lib/sample-audits";
import { saveAuditReport, syncFromServerDb } from "@/lib/storage/workspace-store";
import { AuditReport, PillarKey } from "@/types/audit";

const PILLAR_KEYS: PillarKey[] = ["seo", "cro", "geo", "a11y", "security"];

function CompareContent() {
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
        ? "Fetching fresh live RapidAPI + Cloudflare DoH DNS + DOM audits for both domains..."
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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-20">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="w-full max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <SeospaceLogo />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Swords className="w-3.5 h-3.5" /> Head-to-Head Competitor Battlecard
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Link
              href="/tools"
              className="hidden md:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Free SEO &amp; DNS Tools
            </Link>
            <Link
              href="/docs"
              className="hidden md:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              REST API Docs
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Workspace Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1440px] mx-auto px-6 pt-8 space-y-8">
        {/* Hero Battlecard Input Form */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Seospace Neural Engine v4.2 •
                5-Pillar + Live Cloudflare DoH DNS Comparison
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Competitor Domain Battlecard &amp; Gap Analyzer
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Compare your URL head-to-head against any competitor across
                Technical SEO, CRO, AI Search (GEO), WCAG 2.2, and DNS/Email
                Security.
              </p>
            </div>

            {/* Preset Battlecards */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Instant Presets:</span>
              <button
                type="button"
                onClick={() => {
                  setPrimaryInput("https://voice-one.com/services/");
                  setCompetitorInput("https://stripe.com");
                  runComparison(
                    "https://voice-one.com/services/",
                    "https://stripe.com",
                    false
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer transition"
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
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer transition"
              >
                linear.app vs vercel.com
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runComparison(primaryInput, competitorInput, forceRefresh);
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
          >
            <div className="lg:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1.5">
                Primary Domain (Your Website)
              </label>
              <input
                type="text"
                value={primaryInput}
                onChange={(e) => setPrimaryInput(e.target.value)}
                placeholder="https://voice-one.com/services/"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="lg:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
                Competitor Domain (Benchmark Target)
              </label>
              <input
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                placeholder="https://stripe.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end pt-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    <span>Run Battlecard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{statusMessage}</span>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <RefreshCw className="w-3 h-3 text-blue-400" />
              <span>Force Live Re-Scan (Bypass Saved Database Snapshot)</span>
            </label>
          </div>
        </div>

        {/* Winner Banner + Outrank CTA */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                HEAD-TO-HEAD VERDICT • +{scoreDiff} POINT ADVANTAGE
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-0.5">
                {winnerReport.domain} outperforms {trailingReport.domain} (
                {winnerReport.overallScore}/100 vs {trailingReport.overallScore}
                /100)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {trailingReport.domain} can close the {scoreDiff}-point gap by
                fixing its {trailingReport.checks.filter((c) => c.severity === "critical").length}{" "}
                critical technical issues and publishing an AI-calibrated
                comparison guide.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                trailingReport.domain
              )}&auditId=${encodeURIComponent(
                trailingReport.id
              )}&keyword=${encodeURIComponent(
                `${trailingReport.domain.split(".")[0]} vs ${winnerReport.domain.split(".")[0]} comparison`
              )}&autoGenerate=1`}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                1-Click Generate AI Article to Outrank {winnerReport.domain}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Side-by-Side Domain Scorecards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              label: "Primary Domain",
              badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
              rep: primaryReport,
            },
            {
              label: "Competitor Benchmark",
              badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
              rep: competitorReport,
            },
          ].map(({ label, badgeColor, rep }) => (
            <div
              key={rep.id + label}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}
                  >
                    {label}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-950 mt-2">
                    {rep.domain}
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    {rep.url}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-black text-slate-950">
                    {rep.overallScore}
                    <span className="text-base font-medium text-slate-400">
                      /100
                    </span>
                  </div>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    Grade {rep.letterGrade} • {rep.statusLabel}
                  </div>
                </div>
              </div>

              {/* 5 Pillar Bars */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {PILLAR_KEYS.map((k) => {
                  const p = rep.pillars[k];
                  return (
                    <div key={k} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          {p.label}
                        </span>
                        <span className="font-bold text-slate-900">
                          {p.score}/100 ({p.grade})
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${p.score}%` }}
                          className={`h-full rounded-full ${
                            p.score >= 80
                              ? "bg-emerald-500"
                              : p.score >= 65
                              ? "bg-blue-600"
                              : "bg-amber-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/report/${rep.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <span>Open Full Diagnostic Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400">
                  TTFB: <strong>{rep.responseTimeMs}ms</strong> •{" "}
                  <strong>{rep.wordCount.toLocaleString()}</strong> words
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Deep Technical, Metadata & DNS Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                SIDE-BY-SIDE TECHNICAL &amp; DNS MATRIX
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                Metadata, AI Crawler &amp; Cloudflare DoH DNS Comparison
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {primaryReport.domain} vs {competitorReport.domain}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="py-3.5 px-6 font-bold">Diagnostic Signal</th>
                  <th className="py-3.5 px-6 font-bold text-blue-300">
                    {primaryReport.domain}
                  </th>
                  <th className="py-3.5 px-6 font-bold text-emerald-300">
                    {competitorReport.domain}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Overall Mathematical Score
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-950">
                    {primaryReport.overallScore}/100 ({primaryReport.letterGrade})
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-950">
                    {competitorReport.overallScore}/100 (
                    {competitorReport.letterGrade})
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Edge Server Response (TTFB)
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    {primaryReport.responseTimeMs}ms
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    {competitorReport.responseTimeMs}ms
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Indexed On-Page Word Count
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.wordCount.toLocaleString()} words
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.wordCount.toLocaleString()} words
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Meta Title Length
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.metadata.title.length} chars
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.metadata.title.length} chars
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    OpenGraph Social Image (og:image)
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.metadata.ogImage ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                        <XCircle className="w-4 h-4" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.metadata.ogImage ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Configured
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                        <XCircle className="w-4 h-4" /> Missing
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Schema.org JSON-LD Structured Graph
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.metadata.hasJsonLd ? (
                      <span className="text-emerald-600 font-bold">✓ Present</span>
                    ) : (
                      <span className="text-rose-600 font-bold">✕ Missing</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.metadata.hasJsonLd ? (
                      <span className="text-emerald-600 font-bold">✓ Present</span>
                    ) : (
                      <span className="text-rose-600 font-bold">✕ Missing</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    AI Search /llms.txt Manifest
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.metadata.hasLlmsTxt ? (
                      <span className="text-emerald-600 font-bold">✓ Active</span>
                    ) : (
                      <span className="text-amber-600 font-bold">⚠ Missing</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.metadata.hasLlmsTxt ? (
                      <span className="text-emerald-600 font-bold">✓ Active</span>
                    ) : (
                      <span className="text-amber-600 font-bold">⚠ Missing</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Email SPF + DMARC Anti-Spoofing (Cloudflare DoH)
                  </td>
                  <td className="py-3.5 px-6 font-mono text-xs">
                    SPF: {primaryReport.metadata.dns?.hasSpf ? "✓" : "✕"} | DMARC:{" "}
                    {primaryReport.metadata.dns?.dmarcPolicy || "unknown"}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-xs">
                    SPF: {competitorReport.metadata.dns?.hasSpf ? "✓" : "✕"} |
                    DMARC: {competitorReport.metadata.dns?.dmarcPolicy || "unknown"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    Wayback Archive First Seen
                  </td>
                  <td className="py-3.5 px-6">
                    {primaryReport.metadata.domainHistory?.firstSeenYear
                      ? `${primaryReport.metadata.domainHistory.firstSeenYear} (${primaryReport.metadata.domainHistory.domainAgeYears} yrs)`
                      : "Verified Live"}
                  </td>
                  <td className="py-3.5 px-6">
                    {competitorReport.metadata.domainHistory?.firstSeenYear
                      ? `${competitorReport.metadata.domainHistory.firstSeenYear} (${competitorReport.metadata.domainHistory.domainAgeYears} yrs)`
                      : "Verified Live"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center text-slate-600 text-sm">
          Loading Seospace Competitor Battlecard...
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
