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
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";

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
          className="bg-butter text-[#141413] px-1.5 py-0.5 rounded font-semibold border border-amber-300/60"
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
          className="text-lg font-bold font-display text-ink mt-6 mb-2 tracking-tight"
        >
          {highlightText(line.replace(/^###\s+/, ""))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="text-xl sm:text-2xl font-bold font-display text-ink mt-8 mb-3 pb-2 border-b border-line tracking-tight"
        >
          {highlightText(line.replace(/^##\s+/, ""))}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2
          key={index}
          className="text-2xl font-bold font-display text-ink mt-8 mb-3 tracking-tight"
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
          className="flex items-start gap-3 pl-2 py-1 text-ink/90 leading-relaxed"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
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
          className="flex items-start gap-3 pl-2 py-1 text-ink/90 leading-relaxed"
        >
          <span className="text-xs font-mono font-bold text-ink bg-stage border border-line px-1.5 py-0.5 rounded mt-0.5 shrink-0">
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
          className="text-xl font-bold font-display text-ink mt-7 mb-2.5 tracking-tight"
        >
          {highlightText(line)}
        </h2>
      );
    } else {
      elements.push(
        <p
          key={index}
          className="text-[15.5px] text-ink/90 leading-relaxed mb-3"
        >
          {highlightText(line)}
        </p>
      );
    }
  });

  return elements;
}

function convertToCleanHtml(article: ArticleDraft, computedScore?: number): string {
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

  const finalScore = computedScore ?? article.seoScore ?? 94;

  return `<!-- Generated & Verified by Seospace Neural Engine v4.2 -->
<!-- Target Domain: ${domain} | Focus Keyword: ${article.focusKeyword} | SEO Score: ${finalScore}/100 -->
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
  const { isDark, toggleTheme } = usePublicTheme(false);
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : "art-voiceone-guide";

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
      navigator.clipboard.writeText(convertToCleanHtml(article, grade?.score));
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

  const handleExportJson = () => {
    if (!article) return;
    const exportData = {
      article,
      mathematicalGrade: grade,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seospace-article-${article.focusKeyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.json`;
    a.click();
  };

  if (loading || !article || !grade) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-mute text-sm">
          <Sparkles className="w-5 h-5 text-accent animate-spin" />
          <span>Loading AI Article Preview &amp; Mathematical SEO Grader...</span>
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
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans pb-20">
      {/* Top Action Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur-md print:hidden">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3 min-h-[4.5rem] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href={`/dashboard?tab=editor&articleId=${article.id}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-ink bg-stage hover:bg-card border border-line px-3.5 py-2 rounded-xl transition shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>AI Content Studio</span>
            </Link>

            {article.linkedAuditId && (
              <Link
                href={`/report/${article.linkedAuditId}`}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-ink bg-stage hover:bg-card border border-line px-3.5 py-2 rounded-xl transition shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span className="truncate max-w-[180px]">
                  Audit: {article.linkedDomain || article.linkedAuditId}
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Link>
            )}
          </div>

          {/* Center View Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-stage border border-line p-1 rounded-2xl">
            <button
              onClick={() => setActiveView("blog")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === "blog"
                  ? "bg-night text-[#f3f0e8] shadow-xs"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Article</span>
            </button>
            <button
              onClick={() => setActiveView("serp")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === "serp"
                  ? "bg-night text-[#f3f0e8] shadow-xs"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SERP &amp; Social</span>
            </button>
            <button
              onClick={() => setActiveView("scorecard")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === "scorecard"
                  ? "bg-night text-[#f3f0e8] shadow-xs"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>SEO Scorecard ({grade.score}/100)</span>
            </button>
            <button
              onClick={() => setActiveView("html")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === "html"
                  ? "bg-night text-[#f3f0e8] shadow-xs"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML Export</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy("markdown")}
              className="flex items-center gap-1.5 text-xs font-semibold bg-stage hover:bg-card border border-line text-ink px-3 py-2 rounded-xl transition cursor-pointer"
            >
              {copiedType === "markdown" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-mute" />
              )}
              <span>{copiedType === "markdown" ? "Copied MD!" : "Copy MD"}</span>
            </button>

            {activeView !== "html" && (
              <button
                onClick={() => handleCopy("html")}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-stage hover:bg-card border border-line text-ink px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {copiedType === "html" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-accent" />
                )}
                <span>{copiedType === "html" ? "Copied HTML!" : "Copy HTML"}</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-stage hover:bg-card border border-line text-ink px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-mute" />
              <span>PDF</span>
            </button>

            <button
              onClick={handleExportJson}
              title="Export complete article payload and mathematical rubric as JSON"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-stage hover:bg-card border border-line text-ink px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-cobalt" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => handleCopy("share")}
              className="flex items-center gap-1.5 text-xs font-bold bg-accent text-[#141413] hover:opacity-90 px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
            >
              {copiedType === "share" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{copiedType === "share" ? "Copied!" : "Share Link"}</span>
            </button>

            <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
            <OpenSiteNavigatorButton variant="dark" label="All Pages" />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1440px] mx-auto">
          {/* Left Column: Article Preview / SERP / Scorecard / HTML */}
          <div
            className={`${
              activeView === "scorecard" ? "lg:col-span-12" : "lg:col-span-8"
            } space-y-6`}
          >
            {/* Mobile View Switcher */}
            <div className="flex lg:hidden flex-wrap gap-2 print:hidden">
              {(["blog", "serp", "scorecard", "html"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveView(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                    activeView === mode
                      ? "bg-night text-[#f3f0e8] shadow-xs"
                      : "bg-card text-mute border border-line"
                  }`}
                >
                  {mode === "blog"
                    ? "Live Article"
                    : mode === "serp"
                    ? "SERP & Social"
                    : mode === "scorecard"
                    ? `SEO Score (${grade.score})`
                    : "HTML Code"}
                </button>
              ))}
            </div>

            {activeView === "blog" && (
              <article className="rounded-3xl bg-card border border-line overflow-hidden sp-card-shadow">
                {/* Editorial Hero Banner */}
                <div className="p-6 sm:p-10 border-b border-line bg-stage">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink bg-card border border-line px-3 py-1 rounded-full font-mono">
                        <Globe className="w-3.5 h-3.5 text-accent" />
                        {displayDomain}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#141413] bg-butter border border-amber-300/60 px-3 py-1 rounded-full">
                        <Tag className="w-3 h-3" />
                        Keyword: &ldquo;{article.focusKeyword}&rdquo;
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-mute bg-card border border-line px-3 py-1 rounded-full font-mono">
                        <Clock className="w-3 h-3" />
                        {readingTimeMin} min read • {grade.wordCount} words
                      </span>
                    </div>

                    <button
                      onClick={() => setHighlightKw(!highlightKw)}
                      className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer font-mono font-semibold print:hidden ${
                        highlightKw
                          ? "bg-butter text-[#141413] border-amber-300/80 shadow-xs"
                          : "bg-card border-line text-mute hover:text-ink"
                      }`}
                    >
                      {highlightKw ? "✓ Keyword Highlight ON" : "Keyword Highlight OFF"}
                    </button>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-ink tracking-tight leading-tight mb-4">
                    {article.title}
                  </h1>

                  {article.metaDescription && (
                    <div className="text-sm sm:text-base text-mute leading-relaxed bg-card border border-line rounded-2xl p-4">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                        Meta Description ({grade.metaLength} chars)
                      </span>
                      {article.metaDescription}
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs text-mute font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-accent text-[#141413] font-bold text-[11px] flex items-center justify-center">
                        S
                      </span>
                      <span>
                        Authored by{" "}
                        <strong className="text-ink">
                          Seospace Neural Engine v4.2
                        </strong>
                      </span>
                    </div>
                    <span>Updated {article.updatedAt}</span>
                  </div>
                </div>

                {/* Formatted Article Body */}
                <div className="p-6 sm:p-12">
                  <div className="max-w-3xl mx-auto">
                    {renderFormattedArticle(
                      article.content,
                      highlightKw ? article.focusKeyword : undefined
                    )}
                  </div>

                  {/* Connected Domain Conversion CTA */}
                  <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-night text-[#f3f0e8] border border-[#2a2a2c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-1">
                        Target Domain: {displayDomain}
                      </div>
                      <h4 className="text-lg font-bold font-display text-[#f3f0e8]">
                        Publish this SEO-verified article directly to your CMS
                      </h4>
                      <p className="text-xs text-[#8a8984] mt-1">
                        Graded at{" "}
                        <strong className="text-emerald-400 font-mono">
                          {grade.score}/100 ({grade.letterGrade})
                        </strong>{" "}
                        with {grade.keywordCount} verified occurrences of &ldquo;
                        {article.focusKeyword}&rdquo;.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 print:hidden">
                      <button
                        onClick={() => handleCopy("html")}
                        className="sp-btn sp-btn-accent text-xs"
                      >
                        {copiedType === "html" ? "Copied Clean HTML!" : "Copy Clean HTML"}
                      </button>
                      <Link
                        href={`/dashboard?tab=editor&articleId=${article.id}`}
                        className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f3f0e8] text-xs font-semibold transition inline-flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {activeView === "serp" && (
              <div className="space-y-6">
                {/* Google Search Result Simulator */}
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line sp-card-shadow">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold font-display text-ink">
                        Live Google Search (SERP) Snippet Preview
                      </h2>
                      <p className="text-xs text-mute mt-0.5">
                        Pixel &amp; character rendering of how Google indexes
                        this article for &ldquo;{article.focusKeyword}&rdquo;.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-ink bg-stage border border-line px-3 py-1 rounded-full">
                      Desktop &amp; Mobile SERP
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-stage border border-line max-w-2xl">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-card border border-line flex items-center justify-center text-xs font-bold text-accent uppercase font-mono">
                        {displayDomain.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs text-ink font-medium">
                          {displayDomain}
                        </div>
                        <div className="text-[11px] text-mute font-mono">
                          https://{displayDomain} › blog › {slug}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl text-cobalt hover:underline cursor-pointer font-normal leading-snug mb-1.5 font-sans">
                      {article.title.length > 60
                        ? article.title.slice(0, 59) + "..."
                        : article.title}
                    </h3>
                    <p className="text-sm text-mute leading-relaxed">
                      <span className="text-ink/80 font-medium">
                        {article.updatedAt} —{" "}
                      </span>
                      {article.metaDescription
                        ? article.metaDescription.length > 160
                          ? article.metaDescription.slice(0, 157) + "..."
                          : article.metaDescription
                        : article.content.slice(0, 155) + "..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-stage border border-line">
                      <div className="text-[11px] text-mute font-mono uppercase">
                        Title Length
                      </div>
                      <div className="text-base font-mono font-bold text-ink mt-1">
                        {grade.titleLength} / 60 chars
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-stage border border-line">
                      <div className="text-[11px] text-mute font-mono uppercase">
                        Meta Description
                      </div>
                      <div className="text-base font-mono font-bold text-ink mt-1">
                        {grade.metaLength} / 155 chars
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-stage border border-line">
                      <div className="text-[11px] text-mute font-mono uppercase">
                        Canonical Slug
                      </div>
                      <div className="text-base font-mono font-bold text-accent mt-1 truncate">
                        /blog/{slug}
                      </div>
                    </div>
                  </div>
                </div>

                {/* OpenGraph Social Card Simulator */}
                <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line sp-card-shadow">
                  <h2 className="text-lg font-bold font-display text-ink mb-1">
                    OpenGraph Social Preview (LinkedIn / X / Slack)
                  </h2>
                  <p className="text-xs text-mute mb-5">
                    How this article renders when shared across social channels.
                  </p>

                  <div className="max-w-xl rounded-2xl overflow-hidden border border-line bg-stage shadow-sm">
                    <div className="h-44 bg-night text-[#f3f0e8] p-6 flex flex-col justify-between border-b border-[#2a2a2c]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-accent border border-white/10">
                          {displayDomain}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                          SEO Grade: {grade.score}/100
                        </span>
                      </div>
                      <div className="text-lg font-bold font-display text-[#f3f0e8] line-clamp-2">
                        {article.title}
                      </div>
                    </div>
                    <div className="p-4 bg-card">
                      <div className="text-[11px] uppercase tracking-wider text-mute font-mono mb-1">
                        {displayDomain}
                      </div>
                      <div className="text-sm font-bold text-ink mb-1 font-display">
                        {article.title}
                      </div>
                      <div className="text-xs text-mute line-clamp-2">
                        {article.metaDescription || article.content.slice(0, 140)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === "scorecard" && (
              <div className="p-6 sm:p-10 rounded-3xl bg-card border border-line sp-card-shadow space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      100% Uninflated Mathematical Grading
                    </span>
                    <h2 className="text-2xl font-bold font-display text-ink mt-1">
                      7-Point Content SEO Verification Breakdown
                    </h2>
                    <p className="text-xs text-mute mt-1">
                      Every point is strictly earned from verifiable text length,
                      keyword density, and heading hierarchy.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 bg-stage border border-line px-5 py-3 rounded-2xl shrink-0">
                    <div>
                      <div className="text-[11px] text-mute uppercase font-mono">
                        Total Score
                      </div>
                      <div className="text-3xl font-bold font-mono text-ink">
                        {grade.score}
                        <span className="text-sm text-mute">/100</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-accent text-[#141413] flex items-center justify-center text-xl font-bold font-mono shadow-xs">
                      {grade.letterGrade}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {grade.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-4 rounded-2xl bg-stage border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        {chk.status === "pass" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : chk.status === "warning" ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-sm font-bold text-ink font-display">
                            {chk.label}
                          </div>
                          <div className="text-xs text-mute mt-0.5">
                            {chk.detail}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span
                          className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                            chk.status === "pass"
                              ? "bg-card text-emerald-700 border-emerald-300"
                              : chk.status === "warning"
                              ? "bg-butter text-[#141413] border-amber-300"
                              : "bg-card text-rose-600 border-rose-300"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line sp-card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold font-display text-ink">
                      Production-Ready HTML + Meta Tags
                    </h2>
                    <p className="text-xs text-mute">
                      Copy and paste directly into WordPress, Webflow, Shopify, or Next.js.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy("html")}
                    className="sp-btn sp-btn-accent text-xs"
                  >
                    {copiedType === "html" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === "html" ? "Copied!" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-5 rounded-2xl bg-night text-[#f3f0e8] border border-[#2a2a2c] text-xs font-mono overflow-x-auto leading-relaxed">
                  {convertToCleanHtml(article, grade.score)}
                </pre>
              </div>
            )}
          </div>

          {/* Right Column: Live Mathematical SEO Grader Sidebar */}
          {activeView !== "scorecard" && (
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 print:hidden">
              <div className="p-6 rounded-3xl bg-card border border-line sp-card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
                      Content Grader
                    </span>
                    <h3 className="text-base font-bold font-display text-ink">
                      Mathematical Score
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono text-ink">
                      {grade.score}
                      <span className="text-xs text-mute">/100</span>
                    </div>
                    <div className="text-[11px] font-mono font-bold text-accent">
                      Grade {grade.letterGrade}
                    </div>
                  </div>
                </div>

                {/* Solid Progress bar */}
                <div className="h-2.5 rounded-full bg-stage overflow-hidden mb-5 border border-line">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      grade.score >= 85
                        ? "bg-accent"
                        : grade.score >= 65
                        ? "bg-cobalt"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${grade.score}%` }}
                  />
                </div>

                {/* Key Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <div className="p-3 rounded-2xl bg-stage border border-line text-center">
                    <div className="text-[10px] uppercase text-mute font-mono">
                      Words
                    </div>
                    <div className="text-sm font-bold font-mono text-ink mt-0.5">
                      {grade.wordCount}
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stage border border-line text-center">
                    <div className="text-[10px] uppercase text-mute font-mono">
                      KW Hits
                    </div>
                    <div className="text-sm font-bold font-mono text-accent mt-0.5">
                      {grade.keywordCount}x
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stage border border-line text-center">
                    <div className="text-[10px] uppercase text-mute font-mono">
                      Density
                    </div>
                    <div className="text-sm font-bold font-mono text-ink mt-0.5">
                      {grade.density}%
                    </div>
                  </div>
                </div>

                {/* 7 Checks List */}
                <div className="space-y-2.5">
                  {grade.checks.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-stage border border-line"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                          {c.status === "pass" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : c.status === "warning" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          )}
                          <span>{c.label}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-ink shrink-0">
                          {c.earnedPoints}/{c.maxPoints}
                        </span>
                      </div>
                      <p className="text-[11px] text-mute pl-5 leading-relaxed">
                        {c.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Connected Audit Box */}
                {article.linkedAuditId && (
                  <div className="mt-5 pt-5 border-t border-line">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-mute mb-2">
                      Connected Website Audit
                    </div>
                    <Link
                      href={`/report/${article.linkedAuditId}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-stage hover:bg-card border border-line transition group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Globe className="w-4 h-4 text-accent shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-bold text-ink truncate font-mono">
                            {article.linkedDomain || article.linkedAuditId}
                          </div>
                          <div className="text-[11px] text-mute">
                            View Live Audit Report
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-mute group-hover:text-accent transition shrink-0" />
                    </Link>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href={`/dashboard?tab=editor&articleId=${article.id}`}
                    className="w-full sp-btn sp-btn-primary text-xs flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in AI Content Studio</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
