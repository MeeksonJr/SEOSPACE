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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-20">
      {/* Top Action Control Bar (Hidden when printing to PDF) */}
      <div className="no-print bg-slate-950 text-white py-2.5 px-6 border-b border-slate-800 sticky top-0 z-30">
        <div className="w-full max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">
              Audited URL:{" "}
              <strong className="text-white">{report.url}</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
              <Database className="w-3 h-3" />
              {report.metadata?.extractionSource || "RapidAPI + Live DOM"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px]">
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
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚔️ Compare vs. Competitor</span>
            </Link>

            <button
              onClick={() => handleLiveRescan(undefined, true)}
              disabled={rescanning}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
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
              className={`px-3 py-1.5 rounded-lg font-semibold border transition cursor-pointer ${
                whiteLabelPreview
                  ? "bg-blue-600/20 border-blue-500 text-blue-300"
                  : "bg-slate-900 border-slate-700 text-slate-400"
              }`}
            >
              {whiteLabelPreview
                ? "✓ White-Label Agency Mode: ON"
                : "White-Label Agency Mode: OFF"}
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Report"}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-white text-slate-950 hover:bg-slate-100 font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export White-Label PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Branded Report Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="w-full max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {whiteLabelPreview ? (
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: whiteLabel.primaryColor }}
                  className="w-9 h-9 rounded-xl text-white font-extrabold text-sm flex items-center justify-center shadow-xs"
                >
                  {whiteLabel.agencyName.charAt(0)}
                </div>
                <div>
                  <div className="text-base font-extrabold tracking-tight text-slate-950">
                    {whiteLabel.agencyName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Official Technical SEO, CRO &amp; AI Search Diagnostic
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/">
                <SeospaceLogo />
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
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs hover:opacity-95 transition"
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50/80 border border-slate-200/70">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                UNINFLATED MATHEMATICAL SCORE
              </div>
              <SegmentedGauge
                score={report.overallScore}
                sublabel={`Grade ${report.letterGrade} — ${report.statusLabel}`}
                size="lg"
              />
              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                  {report.estimatedConversionLift}
                </span>
                <span className="text-slate-500">
                  TTFB: <strong>{report.responseTimeMs}ms</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    <Sparkles className="w-3.5 h-3.5" /> Seospace Neural Engine
                    + RapidAPI Metadata Diagnostic
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-2">
                    {report.domain} — Growth &amp; Technical SEO Audit
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    Saved Snapshot:{" "}
                    {new Date(report.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLiveRescan(undefined, true)}
                    disabled={rescanning}
                    className="no-print px-3 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${rescanning ? "animate-spin" : ""}`}
                    />
                    <span>
                      {rescanning ? "Fetching..." : "Fetch Latest"}
                    </span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {report.executiveSummary}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-400">
                    Indexed Words
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {report.wordCount.toLocaleString()} words
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-400">
                    Internal / Ext Links
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {report.metadata.internalLinks} /{" "}
                    {report.metadata.externalLinks}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-400">
                    JSON-LD Schema
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      report.metadata.hasJsonLd
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {report.metadata.hasJsonLd ? "✓ Verified" : "✕ Missing"}
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                  <div className="text-[11px] text-slate-400">
                    AI Search /llms.txt
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      report.metadata.hasLlmsTxt
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {report.metadata.hasLlmsTxt ? "✓ Active" : "⚠ Missing"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Pillar Score Cards Row */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(report.pillars) as PillarKey[]).map((key) => {
              const p = report.pillars[key];
              return (
                <div
                  key={key}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{p.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          p.score >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : p.score >= 60
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {p.grade}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-950">
                        {p.score}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                    <div className="mt-2 w-full h-2 rounded-full bg-slate-200 overflow-hidden">
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
                  <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            LIVE EXTRACTED METADATA & RAPIDAPI INSPECTOR SECTION
           ============================================================ */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                REAL-TIME RAPIDAPI URL-TO-METADATA + DOM EXTRACTION
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                Live Extracted Website Metadata &amp; OpenGraph Tags
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic metadata payload extracted directly from{" "}
                <strong>{report.url}</strong> and stored in your server
                database.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAllMetaTags(!showAllMetaTags)}
              className="no-print px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {showAllMetaTags
                  ? "Hide Raw Meta Tag Table"
                  : `Inspect All Raw Meta Tags (${rawMetaEntries.length})`}
              </span>
            </button>
          </div>

          {/* Core Extracted Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Extracted &lt;title&gt; ({report.metadata.title.length} chars)
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-1 break-words">
                {report.metadata.title || "Missing <title>"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Meta Description ({report.metadata.description.length} chars)
              </div>
              <div className="text-xs text-slate-700 mt-1 line-clamp-3">
                {report.metadata.description || "Missing meta description"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Language / CMS Generator
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-1">
                Lang: {report.metadata.language || "en"} • Generator:{" "}
                {report.metadata.generator || "Custom / Next.js"}
              </div>
              {report.metadata.modifiedTime && (
                <div className="text-[11px] text-amber-700 font-medium mt-1">
                  Last Modified: {report.metadata.modifiedTime.slice(0, 10)}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Viewport &amp; OpenGraph Image
              </div>
              <div className="text-xs font-semibold text-slate-900 mt-1 truncate">
                {report.metadata.viewport || "width=device-width, initial-scale=1"}
              </div>
              <div
                className={`text-[11px] font-bold mt-1 ${
                  report.metadata.ogImage ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                og:image: {report.metadata.ogImage ? "✓ Present" : "✕ Missing"}
              </div>
            </div>
          </div>

          {/* Raw Meta Tags Key-Value Inspector Table */}
          {showAllMetaTags && rawMetaEntries.length > 0 && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-950 text-white px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="font-mono font-semibold text-blue-300">
                  RapidAPI url-to-metadata → metaTags ({rawMetaEntries.length}{" "}
                  extracted keys)
                </span>
                <span className="text-[11px] text-slate-400">
                  Saved to Server DB (.data/seospace-db.json)
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
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
                      className={`px-4 py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs ${
                        isDefect ? "bg-rose-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="sm:col-span-4 font-mono font-bold text-slate-800 flex items-center gap-2">
                        <span>{k}</span>
                        {isDefect && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-sans">
                            SEO/WCAG Defect
                          </span>
                        )}
                      </div>
                      <div className="sm:col-span-8 font-mono text-slate-600 break-all">
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
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  CLOUDFLARE 1.1.1.1 DNS-OVER-HTTPS • EMAIL SECURITY &amp; AI CRAWLER ACCESS
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Zero-Key Public Intelligence Layer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Mail Provider &amp; SPF
                  </div>
                  <div className="font-bold text-slate-900 mt-1">
                    {report.metadata.dns.mailProvider}
                  </div>
                  <div
                    className={`mt-1 font-semibold ${
                      report.metadata.dns.hasSpf
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    SPF: {report.metadata.dns.hasSpf ? "✓ Configured" : "✕ Missing"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    DMARC Anti-Spoofing Policy
                  </div>
                  <div
                    className={`font-bold mt-1 ${
                      report.metadata.dns.hasDmarc
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {report.metadata.dns.hasDmarc
                      ? `✓ Active (p=${report.metadata.dns.dmarcPolicy})`
                      : "✕ Missing _dmarc TXT"}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                    {report.metadata.dns.dmarcRecord ||
                      `_dmarc.${report.domain} not set`}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    A Records &amp; Nameservers
                  </div>
                  <div className="font-mono font-semibold text-slate-900 mt-1 truncate">
                    IP: {report.metadata.dns.aRecords?.[0] || "Edge Anycast"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    NS: {report.metadata.dns.nameservers?.slice(0, 2).join(", ") || "Cloudflare"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400">
                    Domain Age &amp; AI Crawlers
                  </div>
                  <div className="font-bold text-slate-900 mt-1">
                    {report.metadata.domainHistory?.firstSeenYear
                      ? `Since ${report.metadata.domainHistory.firstSeenYear} (${report.metadata.domainHistory.domainAgeYears} yrs)`
                      : "Active Domain"}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                AUDIT-TO-ARTICLE PIPELINE • SEOSPACE NEURAL ENGINE
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                Connected AI SEO Articles &amp; Content Fixes for{" "}
                {report.domain} ({connectedArticles.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Articles generated to fix keyword gaps and content deficits
                discovered on <strong>{report.domain}</strong>. Each article is
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
              className="no-print px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Generate New AI Fix Article for {report.domain}</span>
            </Link>
          </div>

          {connectedArticles.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  No AI Articles connected to {report.domain} yet
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
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
                className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold shrink-0"
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
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-4 hover:border-blue-400 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                          <Globe className="w-3 h-3" />
                          Target KW: {art.focusKeyword}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            g.score >= 85
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          SEO Score: {g.score}/100 ({g.letterGrade})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-950 mb-1.5">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {art.metaDescription || art.content.slice(0, 150)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">
                        {g.wordCount} words • {g.keywordCount}x keyword hits (
                        {g.density}%)
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/article/${art.id}`}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live Article &amp; SERP Preview ↗</span>
                        </Link>
                        <Link
                          href={`/dashboard?tab=editor&articleId=${art.id}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold inline-flex items-center gap-1"
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                SEOSPACE NEURAL ENGINE CONVERSION &amp; SERP REWRITER
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-0.5">
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
              className="no-print text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Open in Live AI SEO Editor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {report.aiRewrites.map((rw, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {rw.element}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {rw.expectedLift}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Current Detected Copy on {report.domain}:
                    </div>
                    <div className="text-slate-600 break-words">
                      {rw.currentText}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-blue-700">
                        ✨ Recommended High-Converting Copy:
                      </span>
                      <button
                        onClick={() =>
                          handleCopyText(`rw-${idx}`, rw.suggestedText)
                        }
                        className="no-print text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>
                          {copiedIndex === `rw-${idx}` ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>
                    <div className="font-semibold text-slate-950 leading-relaxed">
                      {rw.suggestedText}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <strong>Why it wins:</strong> {rw.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Intent Keyword Opportunities + Active Diagnostic Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs h-fit">
            <h3 className="text-base font-bold text-slate-950 mb-1">
              Keyword Opportunities for {report.domain}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click any keyword to generate a connected, mathematically graded
              SEO article in the AI Studio.
            </p>

            <div className="space-y-3">
              {report.keywords.map((kw, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{kw.keyword}</div>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        kw.difficulty <= 40
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      KD {kw.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500">
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
                      className="no-print text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      + Write AI Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 8 Cols: Active Suggestion & Uninflated Point Checklist */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  Uninflated Point-by-Point Diagnostic Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Every check displays exact points earned vs. maximum possible
                  points — zero fake or inflated scoring.
                </p>
              </div>

              <div className="no-print flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(["all", "critical", "warning", "pass"] as const).map(
                  (sev) => (
                    <button
                      key={sev}
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                        filterSeverity === sev
                          ? "bg-white text-slate-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
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
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3"
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
                        <div className="text-sm font-bold text-slate-950">
                          {chk.title}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {chk.description}
                        </p>
                        {chk.currentValue && (
                          <div className="mt-1.5 text-[11px] text-slate-500 break-all">
                            <strong>Detected:</strong> {chk.currentValue}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {typeof chk.pointsEarned === "number" &&
                        typeof chk.pointsMax === "number" && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                              chk.severity === "pass"
                                ? "bg-emerald-100 text-emerald-800"
                                : chk.severity === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            +{chk.pointsEarned}/{chk.pointsMax} pts
                          </span>
                        )}
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 text-[10px] font-bold uppercase">
                        {chk.pillar}
                      </span>
                    </div>
                  </div>

                  {chk.codeSnippet && (
                    <div className="pl-8">
                      <div className="rounded-xl bg-slate-950 text-blue-300 p-3.5 text-xs font-mono relative">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-sans">
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
                                className="no-print text-emerald-400 hover:underline font-semibold"
                              >
                                ✨ Generate AI Fix Article →
                              </Link>
                            )}
                            <button
                              onClick={() =>
                                handleCopyText(chk.id, chk.codeSnippet!)
                              }
                              className="no-print text-blue-400 hover:underline cursor-pointer"
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
        <footer className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {whiteLabelPreview
              ? whiteLabel.footerNote
              : "Generated by Seospace AI Growth Engine — Real-time RapidAPI Metadata, SEO, CRO & Compliance Diagnostics."}
          </div>
          {!whiteLabel.hidePoweredBy && (
            <Link
              href="/"
              className="font-bold text-blue-600 hover:underline shrink-0"
            >
              Powered by Seospace AI ↗
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
