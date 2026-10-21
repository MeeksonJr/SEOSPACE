"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Printer,
  Share2,
  FileText,
  Code2,
  Eye,
  Award,
  ExternalLink,
  BookOpen,
  Clock,
  Tag,
  Search,
  Edit3,
} from "lucide-react";
import {
  getArticles,
  syncFromServerDb,
  gradeArticleReal,
  ArticleDraft,
} from "@/lib/storage/workspace-store";

function renderFormattedArticle(content: string, highlightKeyword?: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  const highlightText = (text: string) => {
    if (!highlightKeyword || !highlightKeyword.trim()) return text;
    const escaped = highlightKeyword
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === highlightKeyword.trim().toLowerCase() ? (
        <mark
          key={idx}
          className="bg-indigo-500/25 text-indigo-200 px-1.5 py-0.5 rounded font-semibold border border-indigo-500/30"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      elements.push(<div key={`sp-${index}`} className="h-3" />);
      return;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="text-lg font-bold font-display text-white mt-6 mb-2 tracking-tight"
        >
          {highlightText(line.replace(/^###\s+/, ""))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="text-xl sm:text-2xl font-bold font-display text-white mt-8 mb-3 pb-2 border-b border-white/[0.08] tracking-tight"
        >
          {highlightText(line.replace(/^##\s+/, ""))}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2
          key={index}
          className="text-2xl font-bold font-display text-white mt-8 mb-3 tracking-tight"
        >
          {highlightText(line.replace(/^#\s+/, ""))}
        </h2>
      );
    } else if (
      line.startsWith("• ") ||
      line.startsWith("- ") ||
      line.startsWith("* ")
    ) {
      elements.push(
        <div
          key={index}
          className="flex items-start gap-3 pl-2 py-1 text-slate-300 leading-relaxed"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0" />
          <span className="text-[15px]">
            {highlightText(line.replace(/^[•\-*]\s+/, ""))}
          </span>
        </div>
      );
    } else if (/^\d+\.\s+/.test(line)) {
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      elements.push(
        <div
          key={index}
          className="flex items-start gap-3 pl-2 py-1 text-slate-300 leading-relaxed"
        >
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
            {numMatch ? numMatch[1] : "•"}
          </span>
          <span className="text-[15px]">
            {highlightText(numMatch ? numMatch[2] : line)}
          </span>
        </div>
      );
    } else if (
      line.length < 75 &&
      !line.endsWith(".") &&
      !line.endsWith("?") &&
      !line.includes(":")
    ) {
      // Standalone subheading line
      elements.push(
        <h2
          key={index}
          className="text-xl font-bold font-display text-white mt-7 mb-2.5 tracking-tight"
        >
          {highlightText(line)}
        </h2>
      );
    } else {
      elements.push(
        <p
          key={index}
          className="text-[15.5px] text-slate-300 leading-relaxed mb-3"
        >
          {highlightText(line)}
        </p>
      );
    }
  });

  return elements;
}

function convertToCleanHtml(article: ArticleDraft): string {
  const slug = article.focusKeyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const domain = article.linkedDomain || "example.com";
  const lines = article.content.split("\n");
  const bodyHtml = lines
    .map((raw) => {
      const l = raw.trim();
      if (!l) return "";
      if (l.startsWith("### ")) return `  <h3>${l.replace(/^###\s+/, "")}</h3>`;
      if (l.startsWith("## ")) return `  <h2>${l.replace(/^##\s+/, "")}</h2>`;
      if (l.startsWith("# ")) return `  <h2>${l.replace(/^#\s+/, "")}</h2>`;
      if (l.startsWith("• ") || l.startsWith("- ") || l.startsWith("* ")) {
        return `  <li>${l.replace(/^[•\-*]\s+/, "")}</li>`;
      }
      return `  <p>${l}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<!-- Generated & Verified by Seospace Neural Engine -->
<!-- Target Domain: ${domain} | Focus Keyword: ${article.focusKeyword} | SEO Score: ${article.seoScore}/100 -->
<head>
  <title>${article.title}</title>
  <meta name="description" content="${article.metaDescription || ""}" />
  <link rel="canonical" href="https://${domain}/blog/${slug}" />
  <meta property="og:title" content="${article.title}" />
  <meta property="og:description" content="${article.metaDescription || ""}" />
  <meta property="og:type" content="article" />
</head>
<article>
  <h1>${article.title}</h1>
${bodyHtml}
</article>`;
}

export default function ArticlePreviewPage() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : "art-voice-one";

  const [article, setArticle] = useState<ArticleDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<
    "blog" | "serp" | "scorecard" | "html"
  >("blog");
  const [highlightKw, setHighlightKw] = useState(true);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const localList = getArticles();
      const foundLocal = localList.find((a) => a.id === rawId);
      if (foundLocal && mounted) {
        setArticle(foundLocal);
        setLoading(false);
      }

      const synced = await syncFromServerDb();
      if (mounted) {
        const foundSynced = synced.articles.find((a) => a.id === rawId);
        if (foundSynced) {
          setArticle(foundSynced);
        } else if (!foundLocal && synced.articles.length > 0) {
          setArticle(synced.articles[0]);
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [rawId]);

  const grade = useMemo(() => {
    if (!article) return null;
    return gradeArticleReal(
      article.title,
      article.content,
      article.focusKeyword,
      article.metaDescription
    );
  }, [article]);

  const handleCopy = (type: "html" | "markdown" | "share") => {
    if (!article) return;
    if (type === "html") {
      navigator.clipboard.writeText(convertToCleanHtml(article));
    } else if (type === "markdown") {
      const md = `# ${article.title}\n\n> **Meta Description:** ${
        article.metaDescription || ""
      }\n> **Focus Keyword:** ${article.focusKeyword}\n\n${article.content}`;
      navigator.clipboard.writeText(md);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  if (loading || !article || !grade) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
          Loading AI Article Preview & Mathematical SEO Grader...
        </div>
      </div>
    );
  }

  const slug = article.focusKeyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const displayDomain = article.linkedDomain || "seospace.ai";
  const readingTimeMin = Math.max(1, Math.ceil(grade.wordCount / 200));

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100">
      {/* Top Action Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-xl print:hidden">
        <div className="w-full px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/dashboard?tab=editor&articleId=${article.id}`}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-2 rounded-lg transition shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to AI Studio
            </Link>

            {article.linkedAuditId && (
              <Link
                href={`/report/${article.linkedAuditId}`}
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-lg transition shrink-0"
              >
                <Globe className="w-3.5 h-3.5" />
                Connected Audit: {article.linkedDomain || article.linkedAuditId}
                <ExternalLink className="w-3 h-3 opacity-75" />
              </Link>
            )}
          </div>

          {/* Center View Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/90 border border-white/[0.08] p-1 rounded-xl">
            <button
              onClick={() => setActiveView("blog")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === "blog"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Blog Preview
            </button>
            <button
              onClick={() => setActiveView("serp")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === "serp"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Google SERP & Social Preview
            </button>
            <button
              onClick={() => setActiveView("scorecard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === "scorecard"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Uninflated SEO Grade ({grade.score}/100)
            </button>
            <button
              onClick={() => setActiveView("html")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === "html"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Clean HTML Export
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy("markdown")}
              className="flex items-center gap-1.5 text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 px-3 py-2 rounded-lg transition"
            >
              {copiedType === "markdown" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-slate-400" />
              )}
              {copiedType === "markdown" ? "Copied MD!" : "Copy MD"}
            </button>
            <button
              onClick={() => handleCopy("html")}
              className="flex items-center gap-1.5 text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 px-3 py-2 rounded-lg transition"
            >
              {copiedType === "html" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
              )}
              {copiedType === "html" ? "Copied HTML!" : "Copy HTML"}
            </button>
            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 px-3 py-2 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              PDF
            </button>
            <button
              onClick={() => handleCopy("share")}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg transition shadow-lg shadow-indigo-600/20"
            >
              {copiedType === "share" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              {copiedType === "share" ? "Link Copied!" : "Share Article"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="w-full px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: Article Preview / SERP / HTML */}
          <div className="lg:col-span-8 space-y-6">
            {/* Mobile View Switcher */}
            <div className="flex lg:hidden flex-wrap gap-2 print:hidden">
              {(["blog", "serp", "scorecard", "html"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveView(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    activeView === mode
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-slate-400 border border-white/[0.08]"
                  }`}
                >
                  {mode === "blog"
                    ? "Live Blog Preview"
                    : mode === "serp"
                    ? "SERP & Social Preview"
                    : mode === "scorecard"
                    ? `SEO Grade (${grade.score})`
                    : "HTML Code"}
                </button>
              ))}
            </div>

            {activeView === "blog" && (
              <article className="rounded-3xl bg-slate-900/75 border border-white/[0.08] overflow-hidden shadow-2xl">
                {/* Editorial Hero Banner */}
                <div className="p-6 sm:p-10 border-b border-white/[0.08] bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
                        <Globe className="w-3.5 h-3.5" />
                        {displayDomain}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        Focus Keyword: &ldquo;{article.focusKeyword}&rdquo;
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {readingTimeMin} min read • {grade.wordCount} words
                      </span>
                    </div>

                    <button
                      onClick={() => setHighlightKw(!highlightKw)}
                      className={`text-xs px-3 py-1 rounded-full border transition print:hidden ${
                        highlightKw
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-200"
                          : "bg-white/[0.03] border-white/[0.08] text-slate-400"
                      }`}
                    >
                      {highlightKw
                        ? "Keyword Highlight: ON"
                        : "Keyword Highlight: OFF"}
                    </button>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight leading-tight mb-4">
                    {article.title}
                  </h1>

                  {article.metaDescription && (
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed bg-slate-950/60 border border-white/[0.06] rounded-xl p-4">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                        SEO Meta Description ({grade.metaLength} chars)
                      </span>
                      {article.metaDescription}
                    </p>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[11px]">
                        S
                      </div>
                      <span>
                        Authored via{" "}
                        <strong className="text-slate-200">
                          Seospace Neural Engine v4.2
                        </strong>
                      </span>
                    </div>
                    <span>Updated {article.updatedAt}</span>
                  </div>
                </div>

                {/* Formatted Article Body */}
                <div className="p-6 sm:p-10">
                  <div className="max-w-none">
                    {renderFormattedArticle(
                      article.content,
                      highlightKw ? article.focusKeyword : undefined
                    )}
                  </div>

                  {/* Connected Domain Conversion CTA */}
                  <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                        Ready to Publish on {displayDomain}
                      </div>
                      <h4 className="text-base font-bold text-white">
                        Deploy this SEO-verified article directly to your CMS
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Mathematically graded at{" "}
                        <strong className="text-emerald-400">
                          {grade.score}/100 ({grade.letterGrade})
                        </strong>{" "}
                        with {grade.keywordCount} natural occurrences of &ldquo;
                        {article.focusKeyword}&rdquo;.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 print:hidden">
                      <button
                        onClick={() => handleCopy("html")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                      >
                        {copiedType === "html"
                          ? "Copied Clean HTML!"
                          : "Copy Clean HTML"}
                      </button>
                      <Link
                        href={`/dashboard?tab=editor&articleId=${article.id}`}
                        className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Article
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {activeView === "serp" && (
              <div className="space-y-6">
                {/* Google Search Result Simulator */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold font-display text-white">
                        Live Google Search (SERP) Snippet Preview
                      </h2>
                      <p className="text-xs text-slate-400">
                        Exact pixel & character rendering of how Google indexes
                        this article for &ldquo;{article.focusKeyword}&rdquo;.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      Desktop & Mobile Indexed
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#1f1f1f] border border-white/[0.08] max-w-2xl">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 uppercase">
                        {displayDomain.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs text-[#dadce0] font-medium">
                          {displayDomain}
                        </div>
                        <div className="text-[11px] text-[#bdc1c6]">
                          https://{displayDomain} › blog › {slug}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer font-normal leading-snug mb-1.5">
                      {article.title.length > 60
                        ? article.title.slice(0, 59) + "..."
                        : article.title}
                    </h3>
                    <p className="text-sm text-[#bdc1c6] leading-relaxed">
                      <span className="text-[#9aa0a6]">
                        {article.updatedAt} —{" "}
                      </span>
                      {article.metaDescription
                        ? article.metaDescription.length > 160
                          ? article.metaDescription.slice(0, 157) + "..."
                          : article.metaDescription
                        : article.content.slice(0, 155) + "..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06]">
                      <div className="text-[11px] text-slate-400">
                        Title Tag Length
                      </div>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">
                        {grade.titleLength} / 60 chars
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06]">
                      <div className="text-[11px] text-slate-400">
                        Meta Description Length
                      </div>
                      <div className="text-sm font-mono font-bold text-white mt-0.5">
                        {grade.metaLength} / 155 chars
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06]">
                      <div className="text-[11px] text-slate-400">
                        URL Slug Structure
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5 truncate">
                        /blog/{slug}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OpenGraph Social Card Simulator */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-white/[0.08]">
                  <h2 className="text-lg font-bold font-display text-white mb-1">
                    OpenGraph Social Preview (LinkedIn / X / Slack)
                  </h2>
                  <p className="text-xs text-slate-400 mb-5">
                    Preview of how this article renders when shared on social
                    feeds.
                  </p>

                  <div className="max-w-xl rounded-2xl overflow-hidden border border-white/[0.12] bg-slate-950 shadow-xl">
                    <div className="h-48 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-cyan-500/20 p-6 flex flex-col justify-between border-b border-white/[0.08]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-black/40 text-indigo-300 border border-indigo-500/30">
                          {displayDomain}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                          SEO Grade: {grade.score}/100
                        </span>
                      </div>
                      <div>
                        <div className="text-lg font-bold font-display text-white line-clamp-2">
                          {article.title}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900">
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                        {displayDomain}
                      </div>
                      <div className="text-sm font-bold text-white mb-1">
                        {article.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2">
                        {article.metaDescription ||
                          article.content.slice(0, 140)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "scorecard" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-white/[0.08] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      100% Uninflated Mathematical Grading
                    </span>
                    <h2 className="text-2xl font-bold font-display text-white mt-1">
                      7-Point Content SEO Verification Breakdown
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Every point is strictly earned from verifiable text,
                      character length, density, and heading checks — zero
                      artificial score floors.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-950/90 border border-white/[0.08] px-5 py-3 rounded-2xl shrink-0">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase">
                        Total Score
                      </div>
                      <div className="text-3xl font-bold font-mono text-emerald-400">
                        {grade.score}
                        <span className="text-sm text-slate-500">/100</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xl font-bold font-mono text-emerald-300">
                      {grade.letterGrade}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {grade.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        {chk.status === "pass" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : chk.status === "warning" ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-sm font-bold text-white">
                            {chk.label}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {chk.detail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span
                          className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                            chk.status === "pass"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                              : chk.status === "warning"
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/25"
                              : "bg-rose-500/10 text-rose-300 border-rose-500/25"
                          }`}
                        >
                          +{chk.earnedPoints} / {chk.maxPoints} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === "html" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/75 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold font-display text-white">
                      Production-Ready HTML + Meta Tags
                    </h2>
                    <p className="text-xs text-slate-400">
                      Copy and paste directly into WordPress, Webflow, Shopify,
                      or Next.js.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy("html")}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition"
                  >
                    {copiedType === "html" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedType === "html" ? "Copied HTML!" : "Copy All HTML"}
                  </button>
                </div>
                <pre className="p-5 rounded-2xl bg-slate-950 border border-white/[0.08] text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  {convertToCleanHtml(article)}
                </pre>
              </div>
            )}
          </div>

          {/* Right 4 Columns: Live Mathematical SEO Grader Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 print:hidden">
            <div className="p-6 rounded-3xl bg-slate-900/75 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                    Real-Time Content Grader
                  </span>
                  <h3 className="text-base font-bold font-display text-white">
                    Mathematical SEO Score
                  </h3>
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-bold font-mono ${
                      grade.score >= 85
                        ? "text-emerald-400"
                        : grade.score >= 65
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {grade.score}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Grade {grade.letterGrade}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden mb-5 border border-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    grade.score >= 85
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                      : grade.score >= 65
                      ? "bg-gradient-to-r from-amber-500 to-indigo-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${grade.score}%` }}
                />
              </div>

              {/* Key Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] text-center">
                  <div className="text-[10px] uppercase text-slate-400">
                    Words
                  </div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    {grade.wordCount}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] text-center">
                  <div className="text-[10px] uppercase text-slate-400">
                    KW Hits
                  </div>
                  <div className="text-sm font-bold font-mono text-indigo-300 mt-0.5">
                    {grade.keywordCount}x
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/[0.06] text-center">
                  <div className="text-[10px] uppercase text-slate-400">
                    Density
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {grade.density}%
                  </div>
                </div>
              </div>

              {/* 7 Checks List */}
              <div className="space-y-2.5">
                {grade.checks.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        {c.status === "pass" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : c.status === "warning" ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span>{c.label}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-300 shrink-0">
                        {c.earnedPoints}/{c.maxPoints}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">
                      {c.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Connected Audit Box */}
              {article.linkedAuditId && (
                <div className="mt-5 pt-5 border-t border-white/[0.08]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Connected Website Audit
                  </div>
                  <Link
                    href={`/report/${article.linkedAuditId}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/25 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">
                          {article.linkedDomain || article.linkedAuditId}
                        </div>
                        <div className="text-[11px] text-indigo-300">
                          View Live SEO & Metadata Audit
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition shrink-0" />
                  </Link>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href={`/dashboard?tab=editor&articleId=${article.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold py-2.5 rounded-xl transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Open in AI Content Studio Editor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
