"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Printer,
  RefreshCw,
  Share2,
  Sparkles,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SegmentedGauge } from "@/components/ui/SegmentedGauge";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";
import {
  getAuditById,
  getSavedArticles,
  getWhiteLabelConfig,
  gradeArticleReal,
  saveAuditReport,
  SavedArticle,
  syncFromServerDb,
} from "@/lib/storage/workspace-store";
import { SAMPLE_AUDITS } from "@/lib/sample-audits";
import { AuditReport, PillarKey, WhiteLabelConfig } from "@/types/audit";

export default function AuditReportPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const params = useParams();
  const reportId = (params?.id as string) || "voice-one-com";

  const [report, setReport] = useState<AuditReport>(
    SAMPLE_AUDITS[reportId] ||
      SAMPLE_AUDITS["voice-one-com"] ||
      SAMPLE_AUDITS["stripe-com"]
  );
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(
    getWhiteLabelConfig()
  );
  const [whiteLabelPreview, setWhiteLabelPreview] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<
    "all" | "critical" | "warning" | "pass"
  >("all");
  const [showAllMetaTags, setShowAllMetaTags] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [rescanning, setRescanning] = useState(false);
  const [freshlyFetched, setFreshlyFetched] = useState(false);

  useEffect(() => {
    setWhiteLabel(getWhiteLabelConfig());
    setArticles(getSavedArticles());
    setFreshlyFetched(false);

    const found = getAuditById(reportId);
    if (found) {
      setReport(found);
    }

    syncFromServerDb().then(({ audits: srvAudits, articles: srvArticles }) => {
      setArticles(srvArticles);
      const srvFound = srvAudits.find(
        (a) =>
          a.id === reportId ||
          a.domain.replace(/[^a-z0-9]/gi, "-").toLowerCase() ===
            reportId.toLowerCase()
      );
      if (srvFound) {
        setReport(srvFound);
      } else if (!found) {
        const guessedDomain = reportId
          .replace(/-[a-z0-9]{4}$/i, "")
          .replace(/-/g, ".");
        handleLiveRescan(guessedDomain, false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  async function handleLiveRescan(targetUrl?: string, forceRefresh = true) {
    setRescanning(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl || report.url,
          existingId: report.id,
          forceRefresh,
        }),
      });
      const data = await res.json();
      if (data?.report) {
        const updatedReport: AuditReport = {
          ...data.report,
          id: report.id || data.report.id,
        };
        saveAuditReport(updatedReport, !data.cached);
        setReport(updatedReport);
        if (forceRefresh) {
          setFreshlyFetched(true);
        }
      }
    } finally {
      setRescanning(false);
    }
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seospace-audit-${report.domain}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
  }

  function handleExportCsv() {
    const headers =
      "Check_ID,Pillar,Check_Name,Status,Points_Earned,Points_Max,Severity,Impact_Score,Recommendation\n";
    const rows = (report.checks || [])
      .map(
        (c) =>
          `"${c.id}","${c.pillar}","${c.title}","${c.severity}",${
            c.pointsEarned
          },${c.pointsMax},"${c.severity}",${c.impactScore},"${(
            c.recommendedValue ||
            c.description ||
            ""
          ).replace(/"/g, '""')}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seospace-diagnostic-${report.domain}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
  }

  const filteredChecks = report.checks.filter((c) =>
    filterSeverity === "all" ? true : c.severity === filterSeverity
  );

  // Connected AI Articles for this audited domain
  const connectedArticles = useMemo(() => {
    return articles.filter(
      (art) =>
        art.linkedAuditId === report.id ||
        (art.linkedDomain &&
          art.linkedDomain.toLowerCase() === report.domain.toLowerCase())
    );
  }, [articles, report.id, report.domain]);

  const rawMetaEntries = useMemo(() => {
    const raw = report.metadata?.rawMetaTags || {};
    return Object.entries(raw);
  }, [report.metadata]);

  function handleCopyShareLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function handleCopyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="min-h-screen bg-paper text-ink pb-20 font-sans">
      {/* Top Action Control Bar (Hidden when printing to PDF) */}
      <div className="no-print bg-night text-[#f3f0e8] py-2.5 px-4 sm:px-6 border-b border-[#2a2a2c] sticky top-0 z-30">
        <div className="w-full max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[#8a8984] hover:text-[#f3f0e8] inline-flex items-center gap-1.5 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <span className="text-[#3a3a3c]">|</span>
            <span className="text-[#8a8984]">
              Audited URL:{" "}
              <strong className="text-[#f3f0e8] font-mono">{report.url}</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono">
              <Database className="w-3 h-3" />
              {report.metadata?.extractionSource || "Seospace Edge Crawler + Live DOM"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-[#2a2a2c] text-[#8a8984] text-[11px] font-mono">
              {freshlyFetched ? (
                <span className="text-emerald-400 font-semibold">
                  ✓ Fresh Live Data Fetched &amp; Saved
                </span>
              ) : (
                <span>
                  ✓ Loaded from Saved Database •{" "}
                  {new Date(report.createdAt).toLocaleDateString()}{" "}
                  {new Date(report.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </span>

            <Link
              href={`/compare?primary=${encodeURIComponent(report.url)}`}
              className="px-3 py-1.5 rounded-xl bg-cobalt hover:opacity-90 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <span>⚔️ Compare vs. Competitor</span>
            </Link>

            <button
              onClick={() => handleLiveRescan(undefined, true)}
              disabled={rescanning}
              className="px-3 py-1.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              {rescanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching Latest Live Data...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Fetch Latest Data</span>
                </>
              )}
            </button>

            <button
              onClick={() => setWhiteLabelPreview(!whiteLabelPreview)}
              className={`px-3 py-1.5 rounded-xl font-semibold border transition cursor-pointer text-xs ${
                whiteLabelPreview
                  ? "bg-accent/20 border-accent/40 text-accent font-bold"
                  : "bg-black/30 border-[#2a2a2c] text-[#8a8984] hover:text-[#f3f0e8]"
              }`}
            >
              {whiteLabelPreview
                ? "✓ White-Label Mode: ON"
                : "White-Label Mode: OFF"}
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[#f3f0e8] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Report"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#f3f0e8] text-[#141413] hover:bg-white font-bold inline-flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleExportCsv}
              title="Download diagnostic checklist as CSV"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[#f3f0e8] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              title="Download complete audit payload as JSON"
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[#f3f0e8] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
            >
              <Code2 className="w-3.5 h-3.5 text-[#f5d547]" />
              <span>JSON</span>
            </button>

            <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
            <OpenSiteNavigatorButton variant="dark" label="All Pages" />
          </div>
        </div>
      </div>

      {/* Branded Report Header */}
      <header className="bg-card border-b border-line text-ink">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-3 min-h-[5rem] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {whiteLabelPreview ? (
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: whiteLabel.primaryColor }}
                  className="w-10 h-10 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shadow-xs"
                >
                  {whiteLabel.agencyName.charAt(0)}
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight text-ink font-display">
                    {whiteLabel.agencyName}
                  </div>
                  <div className="text-[11px] text-mute font-mono">
                    Official Technical SEO, CRO &amp; AI Search Diagnostic
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/">
                <SeospaceLogo auto />
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whiteLabelPreview ? whiteLabel.ctaUrl : "/#pricing"}
              target="_blank"
              rel="noreferrer"
              style={
                whiteLabelPreview
                  ? { backgroundColor: whiteLabel.primaryColor }
                  : undefined
              }
              className="px-4 py-2.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition"
            >
              <span>
                {whiteLabelPreview
                  ? whiteLabel.ctaText
                  : "Unlock Full Agency Suite"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Report Container */}
      <div className="w-full max-w-[1440px] mx-auto px-6 pt-8 space-y-8">
        {/* Executive Overview Card */}
        <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow text-ink">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-stage border border-line">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-mute mb-2">
                UNINFLATED MATHEMATICAL SCORE
              </div>
              <SegmentedGauge
                score={report.overallScore}
                sublabel={`Grade ${report.letterGrade} — ${report.statusLabel}`}
                size="lg"
                theme={isDark ? "dark" : "light"}
              />
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
                  {report.estimatedConversionLift}
                </span>
                <span className="text-mute font-mono">
                  TTFB: <strong className="text-ink">{report.responseTimeMs}ms</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/25">
                    <Sparkles className="w-3.5 h-3.5" /> Seospace Neural Engine
                    + Live DOM Diagnostic
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2 font-display">
                    {report.domain} — Growth &amp; Technical SEO Audit
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-mute bg-stage border border-line px-3 py-1.5 rounded-xl font-mono font-medium">
                    Saved Snapshot:{" "}
                    {new Date(report.createdAt).toLocaleDateString()}{" "}
                    {new Date(report.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <p className="text-sm text-mute leading-relaxed bg-stage p-4 rounded-2xl border border-line">
                {report.executiveSummary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl border border-line bg-stage">
                  <div className="text-[11px] text-mute font-mono">
                    Indexed Words
                  </div>
                  <div className="text-sm font-bold text-ink mt-0.5 font-display">
                    {report.wordCount.toLocaleString()} words
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-line bg-stage">
                  <div className="text-[11px] text-mute font-mono">
                    Internal / Ext Links
                  </div>
                  <div className="text-sm font-bold text-ink mt-0.5 font-mono">
                    {report.metadata.internalLinks} /{" "}
                    {report.metadata.externalLinks}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-line bg-stage">
                  <div className="text-[11px] text-mute font-mono">
                    JSON-LD Schema
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      report.metadata.hasJsonLd
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {report.metadata.hasJsonLd ? "✓ Verified" : "✕ Missing"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl border border-line bg-stage">
                  <div className="text-[11px] text-mute font-mono">
                    AI Search /llms.txt
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      report.metadata.hasLlmsTxt
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {report.metadata.hasLlmsTxt ? "✓ Active" : "⚠ Missing"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Pillar Score Cards Row */}
          <div className="mt-8 pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(report.pillars) as PillarKey[]).map((key) => {
              const p = report.pillars[key];
              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl border border-line bg-stage flex flex-col justify-between text-ink"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-ink">
                      <span>{p.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[11px] border ${
                          p.score >= 80
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : p.score >= 60
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {p.grade}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-ink font-display">
                        {p.score}
                      </span>
                      <span className="text-xs text-mute font-mono">/100</span>
                    </div>
                    <div className="mt-2 w-full h-2 rounded-full bg-card border border-line overflow-hidden">
                      <div
                        style={{ width: `${p.score}%` }}
                        className={`h-full rounded-full ${
                          p.score >= 80
                            ? "bg-emerald-500"
                            : p.score >= 60
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-mute leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            LIVE EXTRACTED METADATA & DOM INSPECTOR SECTION
           ============================================================ */}
        <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow space-y-6 text-ink">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                REAL-TIME EDGE DOM &amp; METADATA EXTRACTION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-ink mt-0.5 font-display">
                Live Extracted Website Metadata &amp; OpenGraph Tags
              </h2>
              <p className="text-xs text-mute mt-0.5">
                Authentic metadata payload extracted directly from{" "}
                <strong className="text-ink">{report.url}</strong> and stored in your server
                database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllMetaTags(!showAllMetaTags)}
              className="no-print px-3.5 py-2 rounded-xl border border-line bg-stage hover:bg-stage/80 text-xs font-semibold text-ink inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center transition"
            >
              <Code2 className="w-3.5 h-3.5 text-accent" />
              <span>
                {showAllMetaTags
                  ? "Hide Raw Meta Tag Table"
                  : `Inspect All Raw Meta Tags (${rawMetaEntries.length})`}
              </span>
            </button>
          </div>

          {/* Core Extracted Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stage border border-line text-ink">
              <div className="text-[11px] font-mono font-bold uppercase text-mute">
                Extracted &lt;title&gt; ({report.metadata.title.length} chars)
              </div>
              <div className="text-xs font-semibold text-ink mt-1 break-words">
                {report.metadata.title || "Missing <title>"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stage border border-line text-ink">
              <div className="text-[11px] font-mono font-bold uppercase text-mute">
                Meta Description ({report.metadata.description.length} chars)
              </div>
              <div className="text-xs text-mute mt-1 line-clamp-3 leading-relaxed">
                {report.metadata.description || "Missing meta description"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stage border border-line text-ink">
              <div className="text-[11px] font-mono font-bold uppercase text-mute">
                Language / CMS Generator
              </div>
              <div className="text-xs font-semibold text-ink mt-1">
                Lang: {report.metadata.language || "en"} • Generator:{" "}
                {report.metadata.generator || "Custom / Next.js"}
              </div>
              {report.metadata.modifiedTime && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-1">
                  Last Modified: {report.metadata.modifiedTime.slice(0, 10)}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-stage border border-line text-ink">
              <div className="text-[11px] font-mono font-bold uppercase text-mute">
                Viewport &amp; OpenGraph Image
              </div>
              <div className="text-xs font-semibold text-ink mt-1 truncate">
                {report.metadata.viewport || "width=device-width, initial-scale=1"}
              </div>
              <div
                className={`text-[11px] font-mono font-bold mt-1 ${
                  report.metadata.ogImage ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                og:image: {report.metadata.ogImage ? "✓ Present" : "✕ Missing"}
              </div>
            </div>
          </div>

          {/* Raw Meta Tags Key-Value Inspector Table */}
          {showAllMetaTags && rawMetaEntries.length > 0 && (
            <div className="rounded-2xl border border-line overflow-hidden">
              <div className="bg-night text-[#f3f0e8] px-4 py-2.5 flex items-center justify-between text-xs border-b border-[#2a2a2c]">
                <span className="font-mono font-semibold text-accent">
                  Live DOM Extraction → metaTags ({rawMetaEntries.length}{" "}
                  extracted keys)
                </span>
                <span className="text-[11px] text-[#8a8984] font-mono">
                  Saved to Server DB
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-line bg-card">
                {rawMetaEntries.map(([k, v]) => {
                  const isDefect =
                    (k === "viewport" &&
                      (v.includes("user-scalable=0") ||
                        v.includes("maximum-scale=1"))) ||
                    (k === "article:modified_time" &&
                      /201[0-9]|202[0-2]/.test(v));
                  return (
                    <div
                      key={k}
                      className={`px-4 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs transition ${
                        isDefect ? "bg-rose-500/10" : "hover:bg-stage/60"
                      }`}
                    >
                      <div className="sm:col-span-4 font-mono font-bold text-ink flex items-center gap-2">
                        <span>{k}</span>
                        {isDefect && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-sans">
                            SEO/WCAG Defect
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-8 font-mono text-mute break-all">
                        {v}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Cloudflare 1.1.1.1 DNS, Email Security, Wayback & AI Crawler Intelligence */}
          {report.metadata?.dns && (
            <div className="pt-4 border-t border-line space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                  CLOUDFLARE 1.1.1.1 DNS-OVER-HTTPS • EMAIL SECURITY &amp; AI CRAWLER ACCESS
                </div>
                <span className="text-[11px] font-mono text-mute">
                  Zero-Key Public Intelligence Layer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stage border border-line text-ink">
                  <div className="text-[11px] font-mono font-bold uppercase text-mute">
                    Mail Provider &amp; SPF
                  </div>
                  <div className="font-bold text-ink mt-1 font-display">
                    {report.metadata.dns.mailProvider}
                  </div>
                  <div
                    className={`mt-1 font-semibold ${
                      report.metadata.dns.hasSpf
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    SPF: {report.metadata.dns.hasSpf ? "✓ Configured" : "✕ Missing"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line text-ink">
                  <div className="text-[11px] font-mono font-bold uppercase text-mute">
                    DMARC Anti-Spoofing Policy
                  </div>
                  <div
                    className={`font-bold mt-1 ${
                      report.metadata.dns.hasDmarc
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {report.metadata.dns.hasDmarc
                      ? `✓ Active (p=${report.metadata.dns.dmarcPolicy})`
                      : "✕ Missing _dmarc TXT"}
                  </div>
                  <div className="text-[11px] font-mono text-mute mt-1 truncate">
                    {report.metadata.dns.dmarcRecord ||
                      `_dmarc.${report.domain} not set`}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line text-ink">
                  <div className="text-[11px] font-mono font-bold uppercase text-mute">
                    A Records &amp; Nameservers
                  </div>
                  <div className="font-mono font-semibold text-ink mt-1 truncate">
                    IP: {report.metadata.dns.aRecords?.[0] || "Edge Anycast"}
                  </div>
                  <div className="text-[11px] text-mute font-mono mt-1 truncate">
                    NS: {report.metadata.dns.nameservers?.slice(0, 2).join(", ") || "Cloudflare"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stage border border-line text-ink">
                  <div className="text-[11px] font-mono font-bold uppercase text-mute">
                    Domain Age &amp; AI Crawlers
                  </div>
                  <div className="font-bold text-ink mt-1">
                    {report.metadata.domainHistory?.firstSeenYear
                      ? `Since ${report.metadata.domainHistory.firstSeenYear} (${report.metadata.domainHistory.domainAgeYears} yrs)`
                      : "Active Domain"}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    GPTBot:{" "}
                    {report.metadata.robotsAnalysis?.allowsGptBot !== false
                      ? "✓ Allowed"
                      : "Blocked"}{" "}
                    • ClaudeBot:{" "}
                    {report.metadata.robotsAnalysis?.allowsClaudeBot !== false
                      ? "✓ Allowed"
                      : "Blocked"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            CONNECTED AI ARTICLES & CONTENT FIXES FOR THIS DOMAIN
           ============================================================ */}
        <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow space-y-6 text-ink">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                AUDIT-TO-ARTICLE PIPELINE • SEOSPACE NEURAL ENGINE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-ink mt-0.5 font-display">
                Connected AI SEO Articles &amp; Content Fixes for{" "}
                {report.domain} ({connectedArticles.length})
              </h2>
              <p className="text-xs text-mute mt-0.5">
                Articles generated to fix keyword gaps and content deficits
                discovered on <strong className="text-ink">{report.domain}</strong>. Each article is
                viewable, shareable, and mathematically graded.
              </p>
            </div>

            <Link
              href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                report.domain
              )}&auditId=${encodeURIComponent(
                report.id
              )}&keyword=${encodeURIComponent(
                report.keywords?.[0]?.keyword || report.domain
              )}&autoGenerate=1`}
              className="no-print px-4 py-2.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Generate New AI Fix Article for {report.domain}</span>
            </Link>
          </div>

          {connectedArticles.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stage border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-ink">
              <div>
                <h4 className="text-sm font-bold text-ink">
                  No AI Articles connected to {report.domain} yet
                </h4>
                <p className="text-xs text-mute mt-0.5">
                  Click any failed check or keyword below to generate a complete,
                  mathematically graded SEO article tailored to {report.domain}.
                </p>
              </div>
              <Link
                href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                  report.domain
                )}&auditId=${encodeURIComponent(
                  report.id
                )}&keyword=${encodeURIComponent(
                  report.keywords?.[0]?.keyword || report.domain
                )}&autoGenerate=1`}
                className="px-4 py-2 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-bold shrink-0 transition"
              >
                Generate First Article →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {connectedArticles.map((art) => {
                const g = gradeArticleReal(
                  art.title,
                  art.content,
                  art.focusKeyword,
                  art.metaDescription
                );
                return (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl border border-line bg-stage flex flex-col justify-between gap-4 hover:border-accent/40 transition text-ink"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink bg-card border border-line px-2.5 py-0.5 rounded-full">
                          <Globe className="w-3 h-3 text-accent" />
                          Target KW: {art.focusKeyword}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            g.score >= 85
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          SEO Score: {g.score}/100 ({g.letterGrade})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-ink mb-1.5 font-display">
                        {art.title}
                      </h3>
                      <p className="text-xs text-mute line-clamp-2 leading-relaxed">
                        {art.metaDescription || art.content.slice(0, 150)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-mute font-mono">
                        {g.wordCount} words • {g.keywordCount}x keyword hits (
                        {g.density}%)
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/article/${art.id}`}
                          className="px-3 py-1.5 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" />
                          <span>Live Article &amp; SERP Preview ↗</span>
                        </Link>
                        <Link
                          href={`/dashboard?tab=editor&articleId=${art.id}`}
                          className="px-3 py-1.5 rounded-xl border border-line bg-card hover:bg-stage text-ink text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Copywriting & Conversion Rewrites Section */}
        <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow text-ink">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                SEOSPACE NEURAL ENGINE CONVERSION &amp; SERP REWRITER
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-ink mt-0.5 font-display">
                Ready-to-Paste Copy &amp; Meta Tag Upgrades for {report.domain}
              </h2>
            </div>
            <Link
              href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                report.domain
              )}&auditId=${encodeURIComponent(
                report.id
              )}&keyword=${encodeURIComponent(
                report.keywords?.[0]?.keyword || report.domain
              )}`}
              className="no-print text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
            >
              Open in Live AI SEO Editor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {report.aiRewrites.map((rw, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-line p-5 bg-stage flex flex-col justify-between space-y-4 text-ink"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink font-display">
                      {rw.element}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {rw.expectedLift}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-card border border-line text-xs">
                    <div className="text-[10px] font-mono font-bold uppercase text-mute mb-1">
                      Current Detected Copy on {report.domain}:
                    </div>
                    <div className="text-mute break-words">
                      {rw.currentText}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-card border border-accent/40 text-xs text-ink">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-accent">
                        ✨ Recommended High-Converting Copy:
                      </span>
                      <button
                        onClick={() =>
                          handleCopyText(`rw-${idx}`, rw.suggestedText)
                        }
                        className="no-print text-[11px] font-bold text-accent hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>
                          {copiedIndex === `rw-${idx}` ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>
                    <div className="font-semibold text-ink leading-relaxed">
                      {rw.suggestedText}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-mute pt-2 border-t border-line">
                  <strong className="text-ink">Why it wins:</strong> {rw.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Intent Keyword Opportunities + Active Diagnostic Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-ink">
          <div className="lg:col-span-4 bg-card rounded-3xl border border-line p-6 sp-card-shadow h-fit text-ink">
            <h3 className="text-base font-bold text-ink mb-1 font-display">
              Keyword Opportunities for {report.domain}
            </h3>
            <p className="text-xs text-mute mb-4">
              Click any keyword to generate a connected, mathematically graded
              SEO article in the AI Studio.
            </p>

            <div className="space-y-3">
              {report.keywords.map((kw, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-line bg-stage space-y-2 text-xs text-ink"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-ink">{kw.keyword}</div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] border ${
                        kw.difficulty <= 40
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      KD {kw.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-line">
                    <span className="text-[11px] text-mute font-mono">
                      {kw.volume}/mo • {kw.intent}
                    </span>
                    <Link
                      href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                        report.domain
                      )}&auditId=${encodeURIComponent(
                        report.id
                      )}&keyword=${encodeURIComponent(
                        kw.keyword
                      )}&autoGenerate=1`}
                      className="no-print text-[11px] font-bold text-accent hover:underline"
                    >
                      + Write AI Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 8 Cols: Active Suggestion & Uninflated Point Checklist */}
          <div className="lg:col-span-8 bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow text-ink">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-ink font-display">
                  Uninflated Point-by-Point Diagnostic Checklist
                </h3>
                <p className="text-xs text-mute mt-0.5">
                  Every check displays exact points earned vs. maximum possible
                  points — zero fake or inflated scoring.
                </p>
              </div>

              <div className="no-print flex items-center gap-1.5 bg-stage p-1 rounded-xl text-xs font-semibold border border-line">
                {(["all", "critical", "warning", "pass"] as const).map(
                  (sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        filterSeverity === sev
                          ? "bg-ink text-paper shadow-xs"
                          : "text-mute hover:text-ink"
                      }`}
                    >
                      {sev}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredChecks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-4 rounded-2xl border border-line bg-stage space-y-3 text-ink"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {chk.severity === "pass" ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✓
                        </span>
                      ) : chk.severity === "critical" ? (
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          ✕
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          !
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-bold text-ink font-display">
                          {chk.title}
                        </div>
                        <p className="text-xs text-mute mt-0.5 leading-relaxed">
                          {chk.description}
                        </p>
                        {chk.currentValue && (
                          <div className="mt-1.5 text-[11px] text-mute font-mono break-all">
                            <strong className="text-ink">Detected:</strong> {chk.currentValue}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {typeof chk.pointsEarned === "number" &&
                        typeof chk.pointsMax === "number" && (
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold border ${
                              chk.severity === "pass"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : chk.severity === "warning"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            }`}
                          >
                            +{chk.pointsEarned}/{chk.pointsMax} pts
                          </span>
                        )}
                      <span className="px-2.5 py-0.5 rounded-full bg-card border border-line text-mute text-[10px] font-mono font-bold uppercase">
                        {chk.pillar}
                      </span>
                    </div>
                  </div>

                  {chk.codeSnippet && (
                    <div className="pl-8">
                      <div className="rounded-xl bg-night text-[#f3f0e8] p-3.5 text-xs font-mono relative border border-[#2a2a2c]">
                        <div className="flex items-center justify-between text-[10px] text-[#8a8984] mb-1.5 font-sans">
                          <span>Recommended Fix Snippet</span>
                          <div className="flex items-center gap-3">
                            {chk.severity !== "pass" && (
                              <Link
                                href={`/dashboard?tab=editor&domain=${encodeURIComponent(
                                  report.domain
                                )}&auditId=${encodeURIComponent(
                                  report.id
                                )}&keyword=${encodeURIComponent(
                                  chk.fixKeyword ||
                                    report.keywords?.[0]?.keyword ||
                                    report.domain
                                )}&autoGenerate=1`}
                                className="no-print text-accent hover:underline font-semibold"
                              >
                                ✨ Generate AI Fix Article →
                              </Link>
                            )}
                            <button
                              onClick={() =>
                                handleCopyText(chk.id, chk.codeSnippet!)
                              }
                              className="no-print text-accent hover:underline cursor-pointer"
                            >
                              {copiedIndex === chk.id ? "Copied!" : "Copy Code"}
                            </button>
                          </div>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap">
                          {chk.codeSnippet}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* White-Label Report Footer */}
        <footer className="bg-card rounded-2xl border border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mute">
          <div>
            {whiteLabelPreview
              ? whiteLabel.footerNote
              : "Generated by Seospace AI Growth Engine — Real-time DOM Extraction, SEO, CRO & Compliance Diagnostics."}
          </div>
          {!whiteLabel.hidePoweredBy && (
            <Link
              href="/"
              className="font-bold text-accent hover:underline shrink-0"
            >
              Powered by Seospace AI ↗
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
