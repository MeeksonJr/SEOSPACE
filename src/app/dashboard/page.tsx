"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Code,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FilePlus2,
  Globe,
  HelpCircle,
  Home,
  LayoutGrid,
  Loader2,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SegmentedGauge } from "@/components/ui/SegmentedGauge";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";
import {
  deleteArticle,
  deleteAuditById,
  deleteLeadById,
  findSavedAuditByUrl,
  getCapturedLeads,
  getSavedArticles,
  getSavedAudits,
  getWhiteLabelConfig,
  getWorkspaceUser,
  gradeArticleReal,
  saveArticle,
  saveAuditReport,
  SavedArticle,
  saveWhiteLabelConfig,
  syncFromServerDb,
  updateLeadStatus,
  WorkspaceUser,
} from "@/lib/storage/workspace-store";
import { AuditReport, CapturedLead, WhiteLabelConfig } from "@/types/audit";
import { PRICING_PLANS } from "@/lib/stripe/plans";

type DashboardTab = "overview" | "editor" | "whitelabel" | "widget" | "billing";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as DashboardTab) || "overview";

  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [user, setUser] = useState<WorkspaceUser>({
    id: "usr-owner",
    name: "Zaim Maulana",
    email: "zaim@seospace.io",
    plan: "agency",
    creditsUsed: 4,
    creditsLimit: 999,
    joined: "Oct 2026",
  });
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [leads, setLeads] = useState<CapturedLead[]>([]);
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(
    getWhiteLabelConfig()
  );
  const [wlSavedToast, setWlSavedToast] = useState(false);
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<string | null>(null);

  // Live URL Scanner inside Dashboard
  const [scanUrl, setScanUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [rescanningId, setRescanningId] = useState<string | null>(null);

  // Real Multi-Document AI Article Studio State
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [currentArticleIdx, setCurrentArticleIdx] = useState(0);
  const [editorViewMode, setEditorViewMode] = useState<
    "write" | "preview" | "library"
  >("write");
  const [libraryDomainFilter, setLibraryDomainFilter] = useState<string>("all");

  const [editorTitle, setEditorTitle] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [metaDesc, setMetaDesc] = useState("");
  const [editorBody, setEditorBody] = useState("");
  const [linkedDomain, setLinkedDomain] = useState<string>("");
  const [linkedAuditId, setLinkedAuditId] = useState<string>("");

  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [rightPanelTab, setRightPanelTab] = useState<
    "assistant" | "seo" | "details"
  >("seo");
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiNote, setAiNote] = useState("");
  const [newArticlePrompt, setNewArticlePrompt] = useState("");
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightGraderOpen, setRightGraderOpen] = useState(true);

  function loadArticleIntoState(art: SavedArticle) {
    setEditorTitle(art.title);
    setFocusKeyword(art.focusKeyword);
    setKeywordsList(art.keywords || [art.focusKeyword]);
    setMetaDesc(art.metaDescription || "");
    setEditorBody(art.content);
    setLinkedDomain(art.linkedDomain || "");
    setLinkedAuditId(art.linkedAuditId || "");
  }

  // Load persisted data on mount + sync with server database (/api/db)
  useEffect(() => {
    setUser(getWorkspaceUser());
    const localAudits = getSavedAudits();
    setAudits(localAudits);
    setLeads(getCapturedLeads());
    setWhiteLabel(getWhiteLabelConfig());

    const loadedArticles = getSavedArticles();
    setArticles(loadedArticles);
    if (loadedArticles[0]) {
      loadArticleIntoState(loadedArticles[0]);
    }

    syncFromServerDb().then(({ audits: srvAudits, articles: srvArticles }) => {
      setAudits(srvAudits);
      setArticles(srvArticles);
    });
  }, []);

  // Handle URL query params (?tab=editor&articleId=... or ?tab=editor&keyword=...&domain=...&auditId=...&autoGenerate=1)
  useEffect(() => {
    const tabParam = searchParams.get("tab") as DashboardTab;
    if (
      tabParam &&
      ["overview", "editor", "whitelabel", "widget", "billing"].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }

    const articleIdParam = searchParams.get("articleId");
    if (articleIdParam && articles.length > 0) {
      const foundIdx = articles.findIndex((a) => a.id === articleIdParam);
      if (foundIdx >= 0) {
        setCurrentArticleIdx(foundIdx);
        loadArticleIntoState(articles[foundIdx]);
        setEditorViewMode("write");
      }
    }

    const kwParam = searchParams.get("keyword");
    const domainParam = searchParams.get("domain");
    const auditIdParam = searchParams.get("auditId");
    const autoGen = searchParams.get("autoGenerate");

    if (domainParam) setLinkedDomain(domainParam);
    if (auditIdParam) setLinkedAuditId(auditIdParam);

    if (kwParam) {
      setFocusKeyword(kwParam);
      setKeywordsList((prev) =>
        prev.includes(kwParam) ? prev : [kwParam, ...prev]
      );
      if (autoGen === "1") {
        triggerGenerateFullArticle(
          kwParam,
          domainParam || undefined,
          auditIdParam || undefined
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Real-time calculated portfolio KPIs from actual audits & leads
  const portfolioStats = useMemo(() => {
    if (audits.length === 0) {
      return {
        avgScore: 0,
        avgGeoScore: 0,
        avgCroScore: 0,
        totalKeywordVolume: 0,
        criticalCount: 0,
        pipelineValue: leads.length * 1500,
      };
    }

    const avgScore =
      audits.reduce((sum, a) => sum + a.overallScore, 0) / audits.length;
    const avgGeoScore = Math.round(
      audits.reduce((sum, a) => sum + (a.pillars?.geo?.score || 0), 0) /
        audits.length
    );
    const avgCroScore = Math.round(
      audits.reduce((sum, a) => sum + (a.pillars?.cro?.score || 0), 0) /
        audits.length
    );

    let totalKeywordVolume = 0;
    let criticalCount = 0;
    for (const a of audits) {
      for (const kw of a.keywords || []) {
        const numeric = parseInt(String(kw.volume).replace(/[^0-9]/g, ""), 10);
        if (!isNaN(numeric)) totalKeywordVolume += numeric;
      }
      criticalCount += (a.checks || []).filter(
        (c) => c.severity === "critical" || c.severity === "warning"
      ).length;
    }

    return {
      avgScore: Number(avgScore.toFixed(1)),
      avgGeoScore,
      avgCroScore,
      totalKeywordVolume,
      criticalCount,
      pipelineValue: leads.length * 1500,
    };
  }, [audits, leads]);

  // 100% Honest, Uninflated Mathematical SEO Grading for AI Articles
  const articleGrade = useMemo(() => {
    return gradeArticleReal(editorTitle, editorBody, focusKeyword, metaDesc);
  }, [editorTitle, editorBody, focusKeyword, metaDesc]);

  async function handleQuickScan(
    e?: React.FormEvent,
    targetOverride?: string,
    forceRefresh = false,
    existingId?: string
  ) {
    if (e) e.preventDefault();
    const urlToScan = (targetOverride || scanUrl).trim();
    if (!urlToScan) return;

    // 1. Unless forceRefresh is requested, open existing saved audit immediately without re-scanning!
    if (!forceRefresh) {
      const existingSaved = findSavedAuditByUrl(urlToScan);
      if (existingSaved) {
        setScanUrl("");
        router.push(`/report/${existingSaved.id}`);
        return;
      }
    }

    setIsScanning(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlToScan,
          forceRefresh,
          existingId,
        }),
      });
      const data = await res.json();
      if (data?.report) {
        saveAuditReport(data.report, !data.cached);
        setAudits(getSavedAudits());
        setUser(getWorkspaceUser());
        setScanUrl("");
        router.push(`/report/${data.report.id}`);
      }
    } finally {
      setIsScanning(false);
      setRescanningId(null);
    }
  }

  async function handleRescanDomain(report: AuditReport) {
    setRescanningId(report.id);
    await handleQuickScan(undefined, report.url, true, report.id);
  }

  function handleDeleteAudit(id: string) {
    const updated = deleteAuditById(id);
    setAudits(updated);
  }

  function persistCurrentArticleChanges(
    overrides?: Partial<SavedArticle>
  ): SavedArticle[] {
    const activeId =
      overrides?.id ||
      articles[currentArticleIdx]?.id ||
      "art-" + Math.random().toString(36).slice(2, 7);
    const updatedObj: SavedArticle = {
      id: activeId,
      title: editorTitle,
      focusKeyword,
      keywords: keywordsList,
      metaDescription: metaDesc,
      content: editorBody,
      linkedDomain: linkedDomain || undefined,
      linkedAuditId: linkedAuditId || undefined,
      updatedAt: "Saved just now",
      ...overrides,
    };
    const nextList = saveArticle(updatedObj);
    setArticles(nextList);
    return nextList;
  }

  function handleSwitchArticle(nextIdx: number) {
    persistCurrentArticleChanges();
    const clamped =
      ((nextIdx % articles.length) + articles.length) % articles.length;
    setCurrentArticleIdx(clamped);
    loadArticleIntoState(articles[clamped]);
  }

  async function handleAiEditorAction(
    action: "optimize" | "expand" | "generate_article",
    customTopic?: string,
    overrideDomain?: string,
    overrideAuditId?: string
  ) {
    setAiOptimizing(true);
    setAiNote("");
    const targetDom = overrideDomain ?? linkedDomain;
    const targetAudId = overrideAuditId ?? linkedAuditId;

    try {
      const res = await fetch("/api/ai-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editorTitle,
          content: editorBody,
          focusKeyword,
          action,
          topicPrompt: customTopic || newArticlePrompt || focusKeyword,
          linkedDomain: targetDom,
        }),
      });
      const data = await res.json();
      const nextTitle = data?.optimizedTitle || editorTitle;
      const nextBody = data?.optimizedContent || editorBody;
      const nextMeta = data?.metaDescription || metaDesc;
      let nextKw = focusKeyword;
      let nextKws = keywordsList;

      if (data?.optimizedTitle) setEditorTitle(data.optimizedTitle);
      if (data?.optimizedContent) setEditorBody(data.optimizedContent);
      if (data?.metaDescription) setMetaDesc(data.metaDescription);
      if (
        Array.isArray(data?.suggestedKeywords) &&
        data.suggestedKeywords.length > 0
      ) {
        nextKws = data.suggestedKeywords;
        nextKw = data.suggestedKeywords[0];
        setKeywordsList(nextKws);
        setFocusKeyword(nextKw);
      }
      if (data?.summaryNote) {
        setAiNote(
          `${data.summaryNote} (${
            data.modelUsed || "Seospace Neural Engine v4.2"
          } in ${data.latencyMs || 420}ms)`
        );
      }

      persistCurrentArticleChanges({
        title: nextTitle,
        content: nextBody,
        metaDescription: nextMeta,
        focusKeyword: nextKw,
        keywords: nextKws,
        linkedDomain: targetDom || undefined,
        linkedAuditId: targetAudId || undefined,
        status: "optimized",
      });
    } finally {
      setAiOptimizing(false);
      setShowNewArticleModal(false);
    }
  }

  async function triggerGenerateFullArticle(
    topicOrKeyword: string,
    targetDom?: string,
    targetAudId?: string
  ) {
    const newId = "art-" + Math.random().toString(36).slice(2, 7);
    const domToUse = targetDom ?? linkedDomain;
    const audToUse = targetAudId ?? linkedAuditId;

    const placeholder: SavedArticle = {
      id: newId,
      title: `${topicOrKeyword}: Generating SEO Guide...`,
      focusKeyword: topicOrKeyword,
      keywords: [topicOrKeyword],
      metaDescription: `Generating comprehensive SEO article for ${topicOrKeyword}...`,
      content:
        "Synthesizing multi-section SEO article via Seospace Neural Engine v4.2...",
      linkedDomain: domToUse || undefined,
      linkedAuditId: audToUse || undefined,
      updatedAt: "Generating...",
    };
    const updatedList = saveArticle(placeholder);
    setArticles(updatedList);
    setCurrentArticleIdx(0);
    loadArticleIntoState(placeholder);
    setEditorViewMode("write");
    await handleAiEditorAction(
      "generate_article",
      topicOrKeyword,
      domToUse,
      audToUse
    );
  }

  function insertFormatting(type: "h2" | "bold" | "italic" | "bullet") {
    const snippets: Record<typeof type, string> = {
      h2: `\n\n## ${focusKeyword || "Growth"} Implementation Blueprint\n`,
      bold: ` **${focusKeyword || "high-converting strategy"}** `,
      italic: ` *verified benchmark* `,
      bullet: `\n• Actionable ${
        focusKeyword || "SEO"
      } milestone with measurable ROI\n• Automated technical check and validation`,
    };
    const nextBody = editorBody + snippets[type];
    setEditorBody(nextBody);
    persistCurrentArticleChanges({ content: nextBody });
  }

  function handleExportMarkdown() {
    const md = `# ${editorTitle}\n\n> **Meta Description:** ${metaDesc}\n> **Focus Keyword:** ${focusKeyword}\n> **Connected Domain:** ${
      linkedDomain || "N/A"
    }\n\n${editorBody}`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${editorTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40)}.md`;
    a.click();
  }

  function handleExportLeadsCsv() {
    const header = "Name,Email,Website URL,Audit Score,Captured,Status\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.name}","${l.email}","${l.websiteUrl}",${l.auditScore},"${l.createdAt}","${l.status}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seospace-captured-agency-leads.csv";
    a.click();
  }

  function handleExportLeadsJson() {
    const blob = new Blob([JSON.stringify(leads, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seospace-captured-agency-leads.json";
    a.click();
  }

  function handleExportAuditsCsv() {
    const header =
      "Domain,URL,Score,Grade,Status,SEO,CRO,GEO,WCAG,DNS,Extraction_Source,Date\n";
    const rows = audits
      .map(
        (a) =>
          `"${a.domain}","${a.url}",${a.overallScore},"${a.letterGrade}","${
            a.statusLabel
          }",${a.pillars?.seo?.score || 0},${a.pillars?.cro?.score || 0},${
            a.pillars?.geo?.score || 0
          },${a.pillars?.a11y?.score || 0},${
            a.pillars?.security?.score || 0
          },"${a.metadata?.extractionSource || "Edge Crawler + DOM"}","${
            a.createdAt
          }"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seospace-audited-domains-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
  }

  function handleExportAuditsJson() {
    const blob = new Blob([JSON.stringify(audits, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seospace-audited-domains-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
  }

  async function handleTestWebhook() {
    if (!whiteLabel.webhookUrl?.trim()) {
      setWebhookStatus("Please enter a webhook URL first.");
      setTimeout(() => setWebhookStatus(null), 3000);
      return;
    }
    setTestingWebhook(true);
    setWebhookStatus(null);
    try {
      const res = await fetch("/api/widget/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: whiteLabel.webhookUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWebhookStatus(`✓ Test Ping Sent! Provider: ${data.provider} (${data.latencyMs}ms)`);
      } else {
        setWebhookStatus(`× Error: ${data.error || "Failed to reach webhook URL"}`);
      }
    } catch {
      setWebhookStatus("× Network error testing webhook.");
    } finally {
      setTestingWebhook(false);
      setTimeout(() => setWebhookStatus(null), 6000);
    }
  }

  function handleSaveWhiteLabel(e: React.FormEvent) {
    e.preventDefault();
    saveWhiteLabelConfig(whiteLabel);
    setWlSavedToast(true);
    setTimeout(() => setWlSavedToast(false), 3000);
  }

  function handleAddKeyword(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    const kw = newKeywordInput.trim();
    const nextKws = keywordsList.includes(kw)
      ? keywordsList
      : [...keywordsList, kw];
    setKeywordsList(nextKws);
    setFocusKeyword(kw);
    setNewKeywordInput("");
    persistCurrentArticleChanges({ keywords: nextKws, focusKeyword: kw });
  }

  const embedSnippet = `<iframe src="${
    typeof window !== "undefined"
      ? window.location.origin
      : "https://seospace-kappa.vercel.app"
  }/widget?agency=${encodeURIComponent(
    whiteLabel.agencyName
  )}&color=${encodeURIComponent(
    whiteLabel.primaryColor
  )}" width="100%" height="460" style="border:none;border-radius:16px;overflow:hidden;" title="Free Instant Website SEO & CRO Audit"></iframe>`;

  const latestAudit = audits[0];
  const activeArticleId =
    articles[currentArticleIdx]?.id || "art-voiceone-guide";

  const filteredLibraryArticles = useMemo(() => {
    if (libraryDomainFilter === "all") return articles;
    return articles.filter((a) => a.linkedDomain === libraryDomainFilter);
  }, [articles, libraryDomainFilter]);

  const sidebarInnerContent = (isMobile = false) => (
    <div className="flex flex-col h-full min-h-0 bg-card text-ink">
      {/* Fixed Top Brand & Agency Pill */}
      <div className="shrink-0 pb-3 border-b border-line">
        <div className="flex items-center justify-between px-1.5 py-1">
          <Link href="/" onClick={() => isMobile && setMobileSidebarOpen(false)}>
            <SeospaceLogo size="sm" auto />
          </Link>
          <div className="flex items-center gap-1.5">
            <Link
              href="/admin"
              onClick={() => isMobile && setMobileSidebarOpen(false)}
              title="Owner Admin Portal"
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stage text-mute hover:text-ink transition border border-line"
            >
              Admin
            </Link>
            {isMobile ? (
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                title="Close Sidebar"
                className="p-1.5 rounded-lg bg-stage hover:bg-stage/80 text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDesktopSidebarOpen(false)}
                title="Collapse Left Sidebar"
                className="px-2 py-1 rounded-lg bg-stage hover:bg-stage/80 text-mute hover:text-ink text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition border border-line"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
                <span>Hide</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-2xl bg-stage border border-line flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-lg bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0">
              {whiteLabel.agencyName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-ink truncate">
              {whiteLabel.agencyName || "Seospace Agency"}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent uppercase shrink-0">
            {user.plan}
          </span>
        </div>
      </div>

      {/* Independently Scrollable Middle Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0 py-3 space-y-5 pr-0.5">
        <div>
          <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-mute mb-2">
            Workspace Menu
          </div>
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Home & Intelligence", icon: Home },
              {
                id: "editor",
                label: `AI Articles (${articles.length})`,
                icon: BookOpen,
              },
              {
                id: "whitelabel",
                label: "White-Label Branding",
                icon: Palette,
              },
              {
                id: "widget",
                label: `Lead CRM (${leads.length})`,
                icon: Users,
              },
              { id: "billing", label: "Billing & Plans", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as DashboardTab);
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    active
                      ? "bg-ink text-paper border border-ink shadow-sm"
                      : "text-mute hover:bg-stage hover:text-ink"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? "text-accent" : "text-mute"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 pt-2 border-t border-line">
          <div className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-mute mb-1">
            Platform Pages
          </div>
          <Link
            href={
              latestAudit ? `/report/${latestAudit.id}` : "/report/voice-one-com"
            }
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-mute hover:bg-stage hover:text-ink"
          >
            <HelpCircle className="w-4 h-4 text-mute shrink-0" />
            <span className="truncate">Latest Audited Report</span>
          </Link>
          <Link
            href={`/article/${activeArticleId}`}
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-mute hover:bg-stage hover:text-ink"
          >
            <Eye className="w-4 h-4 text-mute shrink-0" />
            <span className="truncate">Shareable Article View</span>
          </Link>
          <Link
            href="/compare"
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-mute hover:bg-stage hover:text-ink"
          >
            <Globe className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Competitor Battlecard</span>
          </Link>
          <Link
            href="/tools"
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-mute hover:bg-stage hover:text-ink"
          >
            <Code className="w-4 h-4 text-accent shrink-0" />
            <span className="truncate">Free SEO &amp; DNS Tools</span>
          </Link>
          <Link
            href="/docs"
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-mute hover:bg-stage hover:text-ink"
          >
            <LayoutGrid className="w-4 h-4 text-cobalt shrink-0" />
            <span className="truncate">REST API Playground</span>
          </Link>
        </div>

        <div className="p-3 rounded-2xl bg-stage border border-line">
          <div className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Seospace Neural Engine</span>
          </div>
          <p className="text-[11px] text-mute mt-1 leading-relaxed">
            Seospace edge crawling &amp; mathematical grading active.
          </p>
          <button
            onClick={() => {
              setActiveTab("editor");
              setEditorViewMode("write");
              setShowNewArticleModal(true);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className="mt-2 text-[11px] font-semibold text-accent hover:underline cursor-pointer"
          >
            + Generate New AI Article
          </button>
        </div>
      </div>

      {/* Fixed Bottom User Profile Bar */}
      <div className="shrink-0 pt-3 border-t border-line flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-ink text-paper font-bold text-xs flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="leading-tight truncate">
            <div className="text-xs font-bold text-ink truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-mute truncate">
              {user.email}
            </div>
          </div>
        </div>
        <Link
          href="/login"
          className="text-[10px] font-semibold text-mute hover:text-ink shrink-0 ml-2"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );

  return (
    <div className="sp-page min-h-screen lg:h-screen lg:overflow-hidden bg-paper flex flex-col lg:flex-row text-ink font-sans transition-colors duration-300">
      {/* DESKTOP CONSTANT NON-SCROLLING LEFT SIDEBAR */}
      {desktopSidebarOpen && (
        <aside className="hidden lg:flex lg:w-64 lg:h-screen bg-card border-r border-line flex-col p-4 shrink-0 overflow-hidden text-ink">
          {sidebarInnerContent(false)}
        </aside>
      )}

      {/* MOBILE & TABLET SLIDE-OVER SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-night/60 backdrop-blur-xs"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-card border-r border-line p-4 flex flex-col overflow-hidden shadow-2xl text-ink">
            {sidebarInnerContent(true)}
          </aside>
        </div>
      )}

      {/* FULL-WIDTH INDEPENDENTLY SCROLLABLE RIGHT WORKSPACE AREA */}
      <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto flex flex-col">
        {/* UNIVERSAL STICKY WORKSPACE TOP BAR */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-line px-4 sm:px-6 h-14 flex items-center justify-between gap-2 shrink-0 text-ink">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Sidebar Open Button */}
            {!mobileSidebarOpen && (
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open Workspace Sidebar"
                className="lg:hidden px-2.5 py-1.5 rounded-xl bg-stage hover:bg-stage/80 text-ink border border-line text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Menu className="w-4 h-4 text-accent" />
                <span>Sidebar</span>
              </button>
            )}

            {/* Desktop Sidebar Open Button */}
            {!desktopSidebarOpen && (
              <button
                type="button"
                onClick={() => setDesktopSidebarOpen(true)}
                title="Open Left Sidebar"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stage hover:bg-stage/80 text-ink border border-line text-xs font-bold cursor-pointer transition"
              >
                <PanelLeftOpen className="w-3.5 h-3.5 text-accent" />
                <span>Open Sidebar</span>
              </button>
            )}

            {(!desktopSidebarOpen || !mobileSidebarOpen) && (
              <div className={desktopSidebarOpen ? "lg:hidden" : ""}>
                <Link href="/">
                  <SeospaceLogo size="sm" auto />
                </Link>
              </div>
            )}

            <span className="hidden sm:inline-block text-mute">|</span>
            <span className="text-xs font-bold text-ink truncate">
              {activeTab === "overview"
                ? "Executive Intelligence"
                : activeTab === "editor"
                ? "AI SEO Content Studio"
                : activeTab === "whitelabel"
                ? "White-Label PDF Branding"
                : activeTab === "widget"
                ? "Lead Capture CRM"
                : "Subscription & Stripe Billing"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
            <Link
              href="/"
              className="hidden md:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold text-mute hover:text-ink hover:bg-stage transition"
            >
              Home
            </Link>
            <Link
              href="/compare"
              className="hidden sm:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold text-mute hover:text-ink hover:bg-stage transition"
            >
              Battlecard
            </Link>
            <Link
              href="/tools"
              className="hidden md:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold text-mute hover:text-ink hover:bg-stage transition"
            >
              Free Tools
            </Link>
            <Link
              href="/docs"
              className="hidden xl:inline-flex px-2.5 py-1.5 rounded-xl text-xs font-semibold text-mute hover:text-ink hover:bg-stage transition"
            >
              API Docs
            </Link>
            <OpenSiteNavigatorButton label="All Pages" />
          </div>
        </header>
        {/* ============================================================
            TAB 1: 100% DATA-DRIVEN EXECUTIVE INTELLIGENCE DASHBOARD
           ============================================================ */}
        {activeTab === "overview" && (
          <div className="w-full px-5 sm:px-8 py-6 space-y-6 text-ink">
            {/* Dark Executive Banner Header */}
            <div className="rounded-3xl bg-night text-[#f3f0e8] border border-[#2a2a2c] p-6 sm:p-8 relative overflow-hidden shadow-md">
              <svg
                className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none"
                viewBox="0 0 400 200"
                fill="none"
              >
                <path
                  d="M0 150 C 120 20, 240 220, 400 40"
                  stroke="var(--sp-accent, #FF4D14)"
                  strokeWidth="2"
                />
                <path
                  d="M0 170 C 130 40, 250 240, 400 60"
                  stroke="#2A4BFF"
                  strokeWidth="1.5"
                />
              </svg>

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                  <div className="text-sm text-[#8a8984] font-medium font-mono">
                    Executive Intelligence Workspace • {audits.length} Audited Sites • {articles.length} AI Articles
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#f3f0e8] mt-1 font-display">
                    {user.name}
                  </h1>
                </div>

                {/* Live URL Audit Bar */}
                <form
                  onSubmit={(e) => handleQuickScan(e)}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 p-1.5 rounded-2xl w-full xl:max-w-xl"
                >
                  <div className="flex items-center gap-2 px-3 py-2 flex-1">
                    <Globe className="w-4 h-4 text-accent shrink-0" />
                    <input
                      type="text"
                      value={scanUrl}
                      onChange={(e) => setScanUrl(e.target.value)}
                      placeholder="Scan any live URL for real-time SEO + DOM diagnostics (e.g. voice-one.com/services/)..."
                      className="bg-transparent text-xs sm:text-sm text-[#f3f0e8] placeholder:text-[#8a8984] focus:outline-none w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isScanning}
                    className="px-4 py-2.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#141413]" />
                        <span>Extracting Live Metadata...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute Audit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sub-navigation bar (Only displays tab pills when left sidebar is collapsed/hidden so tabs aren't duplicated) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3 text-xs font-semibold">
              <div
                className={`${
                  desktopSidebarOpen ? "flex lg:hidden" : "flex"
                } flex-wrap items-center gap-2`}
              >
                {[
                  { id: "overview", label: "Dashboard" },
                  {
                    id: "editor",
                    label: `AI Content Studio (${articles.length})`,
                  },
                  { id: "whitelabel", label: "White-Label PDF" },
                  {
                    id: "widget",
                    label: `Lead Capture CRM (${leads.length})`,
                  },
                  { id: "billing", label: "Subscription & API" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as DashboardTab)}
                    className={`px-3.5 py-1.5 rounded-full transition cursor-pointer ${
                      activeTab === t.id
                        ? "bg-ink text-paper shadow-xs border border-ink"
                        : "bg-stage text-mute hover:text-ink border border-line"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-mute ml-auto">
                {latestAudit && (
                  <Link
                    href={`/report/${latestAudit.id}`}
                    className="hover:text-ink font-semibold"
                  >
                    Latest Scan: {latestAudit.domain} ({latestAudit.overallScore}/100) ↗
                  </Link>
                )}
              </div>
            </div>

            {/* MAIN BENTO GRID — Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                {/* 3 Real Calculated Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Real Avg Portfolio Score + Bar Chart of actual audits */}
                  <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-mute">
                      AVG PORTFOLIO SEO SCORE
                    </div>
                    <div className="text-3xl font-bold text-ink mt-1">
                      {portfolioStats.avgScore}{" "}
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        / 100 ({audits.length} sites)
                      </span>
                    </div>
                    <div className="mt-4 flex items-end gap-1.5 h-12">
                      {audits.slice(0, 8).map((a) => (
                        <div
                          key={a.id}
                          title={`${a.domain}: ${a.overallScore}/100`}
                          style={{ height: `${Math.max(20, a.overallScore)}%` }}
                          className={`flex-1 rounded-t transition cursor-pointer ${
                            a.overallScore >= 80
                              ? "bg-emerald-500/85 hover:bg-emerald-600"
                              : a.overallScore >= 60
                              ? "bg-amber-400/85 hover:bg-amber-500"
                              : "bg-rose-500/85 hover:bg-rose-600"
                          }`}
                          onClick={() => router.push(`/report/${a.id}`)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Real Summed Keyword Volume */}
                  <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-mute">
                      KEYWORD VOLUME DISCOVERED
                    </div>
                    <div className="text-3xl font-bold text-ink mt-1">
                      {portfolioStats.totalKeywordVolume.toLocaleString()}{" "}
                      <span className="text-xs font-medium text-accent">
                        /mo
                      </span>
                    </div>
                    <svg
                      viewBox="0 0 200 55"
                      className="w-full h-12 mt-4 overflow-visible"
                    >
                      <path
                        d="M 0 45 Q 40 40, 70 25 T 140 20 T 200 5"
                        fill="none"
                        stroke="var(--sp-accent, #FF4D14)"
                        strokeWidth="2.5"
                      />
                      <circle cx="140" cy="20" r="4" fill="var(--sp-accent, #FF4D14)" />
                    </svg>
                  </div>

                  {/* Card 3: Real Pipeline Value from Captured Leads */}
                  <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow">
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-mute">
                      AGENCY CRM PIPELINE ({leads.length} LEADS)
                    </div>
                    <div className="text-3xl font-bold text-ink mt-1">
                      ${portfolioStats.pipelineValue.toLocaleString()}{" "}
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Est.
                      </span>
                    </div>
                    <div className="mt-4 flex items-end gap-2 h-12">
                      {leads.slice(0, 6).map((l) => (
                        <div
                          key={l.id}
                          title={`${l.name}: ${l.auditScore}/100`}
                          style={{ height: `${Math.max(30, l.auditScore)}%` }}
                          className="flex-1 rounded-t-lg bg-emerald-500/80"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Row: Audited Domains List + Dynamic Proactive Intelligence Engine */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5 bg-card rounded-3xl border border-line p-6 sp-card-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-ink">
                          Audited Sites ({audits.length})
                        </h3>
                        <span className="text-[10px] text-mute font-mono uppercase font-semibold">
                          UNINFLATED SCORES
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {audits.slice(0, 6).map((a) => (
                          <Link
                            key={a.id}
                            href={`/report/${a.id}`}
                            className="flex items-center justify-between py-2 hover:bg-stage rounded-xl px-2.5 transition border border-transparent hover:border-line"
                          >
                            <span className="font-semibold text-ink truncate pr-2">
                              {a.domain}
                            </span>
                            <span
                              className={`font-bold shrink-0 ${
                                a.overallScore >= 85
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : a.overallScore >= 60
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {a.overallScore}/100 ({a.letterGrade})
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 mt-3 border-t border-line text-[11px] text-mute">
                      Click any domain for full DOM metadata &amp; PDF report
                    </div>
                  </div>

                  {/* Dynamic Proactive Intelligence Engine Card */}
                  <div className="md:col-span-7 bg-card rounded-3xl border border-line p-6 sp-card-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-ink">
                          <div className="w-6 h-6 rounded-full bg-accent text-[#141413] flex items-center justify-center font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span>Seospace Neural Engine</span>
                        </div>
                        {latestAudit && (
                          <span className="text-[11px] font-mono font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                            Focus: {latestAudit.domain}
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-xs sm:text-sm text-mute leading-relaxed">
                        {latestAudit ? (
                          <>
                            Latest diagnostic on{" "}
                            <strong className="text-ink">
                              {latestAudit.domain}
                            </strong>{" "}
                            scored{" "}
                            <strong className="text-accent">
                              {latestAudit.overallScore}/100 (
                              {latestAudit.letterGrade})
                            </strong>{" "}
                            with{" "}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                              {latestAudit.estimatedConversionLift}
                            </strong>
                            . {latestAudit.executiveSummary.slice(0, 150)}...
                          </>
                        ) : (
                          "Scan any website URL above to generate real-time CRO, SEO, and AI Search recommendations."
                        )}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => {
                            if (latestAudit) {
                              const kw =
                                latestAudit.keywords?.[0]?.keyword ||
                                latestAudit.domain;
                              setLinkedDomain(latestAudit.domain);
                              setLinkedAuditId(latestAudit.id);
                              setFocusKeyword(kw);
                              setActiveTab("editor");
                              triggerGenerateFullArticle(
                                kw,
                                latestAudit.domain,
                                latestAudit.id
                              );
                            } else {
                              setActiveTab("editor");
                            }
                          }}
                          className="px-4 py-2 rounded-xl border border-line bg-stage hover:bg-stage/80 text-xs font-semibold text-ink transition cursor-pointer"
                        >
                          ✨ Write AI Fix Article for{" "}
                          {latestAudit?.domain || "Top Keyword"}
                        </button>
                        {latestAudit && (
                          <Link
                            href={`/report/${latestAudit.id}`}
                            className="px-4 py-2 rounded-xl bg-ink text-paper text-xs font-semibold hover:bg-ink/90 transition shadow-xs"
                          >
                            Open {latestAudit.domain} Report →
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-line grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] text-mute font-mono">
                          Avg AI Search (GEO) Readiness
                        </div>
                        <div className="text-xl font-bold text-ink mt-0.5">
                          {portfolioStats.avgGeoScore}{" "}
                          <span className="text-xs font-normal text-mute">
                            / 100
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-mute font-mono">
                          Open Warnings / Fixes Across Sites
                        </div>
                        <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                          {portfolioStats.criticalCount}{" "}
                          <span className="text-xs font-normal text-mute">
                            Action Items
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 4 Columns: Real Calculated 40-Tick Gauge + Real Audit Signals */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow">
                  <h3 className="text-sm font-bold text-ink mb-2">
                    Portfolio Health Score
                  </h3>
                  <SegmentedGauge
                    score={Math.round(portfolioStats.avgScore)}
                    label={
                      portfolioStats.avgScore >= 85
                        ? "Optimal"
                        : "Optimization Active"
                    }
                    variant="ticks"
                    theme={isDark ? "dark" : "light"}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-line">
                    <div>
                      <div className="text-[11px] text-mute">
                        Avg CRO Score
                      </div>
                      <div className="text-base font-bold text-ink">
                        {portfolioStats.avgCroScore}%
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-stage overflow-hidden border border-line">
                        <div
                          style={{ width: `${portfolioStats.avgCroScore}%` }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-mute">
                        Avg GEO Score
                      </div>
                      <div className="text-base font-bold text-ink">
                        {portfolioStats.avgGeoScore}%
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-stage overflow-hidden border border-line">
                        <div
                          style={{ width: `${portfolioStats.avgGeoScore}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Signals Feed Derived from Latest Audited Domains */}
                <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow space-y-3">
                  <div className="text-xs font-bold text-ink">
                    Real-Time Audit Signals (From Your Scans)
                  </div>

                  {audits.slice(0, 3).map((a) => {
                    const topIssue =
                      a.checks.find((c) => c.severity !== "pass") ||
                      a.checks[0];
                    return (
                      <Link
                        key={a.id}
                        href={`/report/${a.id}`}
                        className="block p-3.5 rounded-2xl bg-stage hover:bg-stage/80 border border-line text-xs transition"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span
                            className={
                              topIssue?.severity === "pass"
                                ? "text-emerald-600 dark:text-emerald-400 uppercase font-mono"
                                : "text-amber-600 dark:text-amber-400 uppercase font-mono"
                            }
                          >
                            {a.domain} • {a.overallScore}/100
                          </span>
                          <span className="text-mute font-mono">
                            {a.responseTimeMs}ms
                          </span>
                        </div>
                        <p className="text-mute mt-1 leading-relaxed truncate">
                          {topIssue?.title || a.estimatedConversionLift}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Full-Width Audited Domains Watchlist Table with Live Re-Scan & Delete */}
            <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    Global Audited Domains Watchlist
                  </h3>
                  <p className="text-xs text-mute mt-0.5">
                    Re-scan any domain live via Edge DOM Crawler + Seospace
                    Neural Engine, open its White-Label PDF report, or generate
                    connected AI fix articles.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportAuditsCsv}
                    title="Download all saved audit reports as CSV spreadsheet"
                    className="px-3 py-1.5 rounded-xl border border-line bg-stage hover:bg-card text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-accent" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportAuditsJson}
                    title="Export complete audits database as JSON"
                    className="px-3 py-1.5 rounded-xl border border-line bg-stage hover:bg-card text-ink text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5 text-cobalt" />
                    <span>JSON</span>
                  </button>
                  <span className="px-3 py-1.5 rounded-xl bg-stage border border-line text-xs font-mono font-bold text-ink">
                    {audits.length} Audits
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mute font-mono">
                      <th className="py-3 px-3">Domain</th>
                      <th className="py-3 px-3">Uninflated Score</th>
                      <th className="py-3 px-3">Metadata Source</th>
                      <th className="py-3 px-3">TTFB Speed</th>
                      <th className="py-3 px-3">Connected Articles</th>
                      <th className="py-3 px-3">Est. Lift</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {audits.map((item) => {
                      const domainArticles = articles.filter(
                        (art) =>
                          art.linkedAuditId === item.id ||
                          art.linkedDomain === item.domain
                      );
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-stage/60 transition"
                        >
                          <td className="py-3.5 px-3 font-bold text-ink flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-stage border border-line text-ink flex items-center justify-center font-bold text-xs">
                              {item.domain.charAt(0).toUpperCase()}
                            </div>
                            <span>{item.domain}</span>
                          </td>
                          <td className="py-3.5 px-3 font-bold">
                            <span
                              className={`px-2.5 py-1 rounded-full font-mono text-[11px] ${
                                item.overallScore >= 80
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                  : item.overallScore >= 60
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {item.overallScore}/100 ({item.letterGrade})
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-mute">
                            <span className="px-2 py-0.5 rounded-md bg-stage border border-line text-ink font-mono text-[11px]">
                              {item.metadata?.extractionSource ||
                                "Seospace Edge Crawler + DOM"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-mute font-mono">
                            {item.responseTimeMs} ms
                          </td>
                          <td className="py-3.5 px-3">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("editor");
                                setEditorViewMode("library");
                                setLibraryDomainFilter(item.domain);
                              }}
                              className="text-accent hover:underline font-semibold cursor-pointer"
                            >
                              {domainArticles.length} Article
                              {domainArticles.length === 1 ? "" : "s"} →
                            </button>
                          </td>
                          <td className="py-3.5 px-3 font-medium text-emerald-600 dark:text-emerald-400">
                            {item.estimatedConversionLift}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                href={`/report/${item.id}`}
                                className="px-3 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink font-semibold transition inline-flex items-center gap-1 text-xs"
                              >
                                <span>Open Saved</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleRescanDomain(item)}
                                disabled={rescanningId === item.id}
                                title="Fetch Latest Live Data from URL"
                                className="px-2.5 py-1.5 rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent font-semibold transition inline-flex items-center gap-1 cursor-pointer text-xs"
                              >
                                <RefreshCw
                                  className={`w-3 h-3 ${
                                    rescanningId === item.id
                                      ? "animate-spin"
                                      : ""
                                  }`}
                                />
                                <span>
                                  {rescanningId === item.id
                                    ? "Fetching..."
                                    : "Fetch Latest"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAudit(item.id)}
                                title="Delete Audit Report"
                                className="p-2 rounded-xl border border-line hover:bg-rose-500/10 text-mute hover:text-rose-600 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: SEOSPACE AI CONTENT STUDIO (ORGANIZED, GRADED, SHAREABLE)
           ============================================================ */}
        {activeTab === "editor" && (
          <div className="min-h-full flex flex-col bg-paper text-ink">
            {/* Top Document Action Bar — Non-sticky so it never overlaps the sticky workspace header */}
            <div className="min-h-16 px-4 sm:px-6 py-3 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-card text-ink">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* View Mode Toggle: Write | Live Preview | Organized Library */}
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-stage border border-line text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setEditorViewMode("write")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      editorViewMode === "write"
                        ? "bg-ink text-paper shadow-xs"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    ✍️ Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorViewMode("preview")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer inline-flex items-center gap-1 ${
                      editorViewMode === "preview"
                        ? "bg-ink text-paper shadow-xs"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Blog &amp; SERP Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorViewMode("library")}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer inline-flex items-center gap-1 ${
                      editorViewMode === "library"
                        ? "bg-ink text-paper shadow-xs"
                        : "text-mute hover:text-ink"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Article Library ({articles.length})</span>
                  </button>
                </div>

                {/* Working Multi-Article Switcher (< 1 of N >) */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-line bg-stage text-xs font-semibold text-ink">
                  <button
                    type="button"
                    onClick={() => handleSwitchArticle(currentArticleIdx - 1)}
                    className="p-0.5 hover:bg-card rounded cursor-pointer text-mute hover:text-ink"
                    title="Previous Article"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono">
                    {currentArticleIdx + 1} of {articles.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSwitchArticle(currentArticleIdx + 1)}
                    className="p-0.5 hover:bg-card rounded cursor-pointer text-mute hover:text-ink"
                    title="Next Article"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Connected Audited Domain Selector */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-line bg-stage text-xs max-w-full text-ink">
                  <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                  <select
                    value={linkedDomain}
                    onChange={(e) => {
                      const dom = e.target.value;
                      const matchedAudit = audits.find((a) => a.domain === dom);
                      setLinkedDomain(dom);
                      setLinkedAuditId(matchedAudit?.id || "");
                      persistCurrentArticleChanges({
                        linkedDomain: dom || undefined,
                        linkedAuditId: matchedAudit?.id || undefined,
                      });
                    }}
                    className="bg-transparent font-semibold text-ink focus:outline-none cursor-pointer truncate"
                  >
                    <option value="" className="bg-card text-ink">Link to Audited Domain...</option>
                    {audits.map((a) => (
                      <option key={a.id} value={a.domain} className="bg-card text-ink">
                        {a.domain} ({a.overallScore}/100)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Only show + New AI Article button when the New Article drawer isn't already open */}
                {!showNewArticleModal && (
                  <button
                    type="button"
                    onClick={() => setShowNewArticleModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    <span>+ New AI Article</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Only show Open Score Panel button when the Right Score Panel is collapsed */}
                {!rightGraderOpen && editorViewMode !== "library" && (
                  <button
                    type="button"
                    onClick={() => setRightGraderOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <PanelRightOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Open Score Panel ({articleGrade.score}/100)</span>
                  </button>
                )}
                <Link
                  href={`/article/${activeArticleId}`}
                  className="px-3.5 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-accent" />
                  <span>Shareable Article Page ↗</span>
                </Link>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="px-3 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-mute" />
                  <span>.MD</span>
                </button>
              </div>
            </div>

            {/* New AI Article Generator Drawer */}
            {showNewArticleModal && (
              <div className="bg-night text-[#f3f0e8] px-6 py-4 border-b border-[#2a2a2c] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1">
                  <Sparkles className="w-4 h-4 text-accent shrink-0" />
                  <input
                    type="text"
                    value={newArticlePrompt}
                    onChange={(e) => setNewArticlePrompt(e.target.value)}
                    placeholder="Enter target keyword or topic (e.g. 'Virtual Receptionist Answering Service' or 'B2B SaaS Checkout Optimization')..."
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-[#f3f0e8] placeholder:text-[#8a8984] focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={aiOptimizing || !newArticlePrompt.trim()}
                    onClick={() =>
                      triggerGenerateFullArticle(newArticlePrompt.trim())
                    }
                    className="px-4 py-2 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {aiOptimizing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Full Article...</span>
                      </>
                    ) : (
                      <span>
                        Generate via Seospace Neural Engine →
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewArticleModal(false)}
                    className="px-3 py-2 rounded-xl text-xs text-[#8a8984] hover:text-[#f3f0e8] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================
                VIEW MODE 3: ORGANIZED AI ARTICLES LIBRARY GRID
               ============================================================ */}
            {editorViewMode === "library" && (
              <div className="p-6 sm:p-8 bg-paper text-ink flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink font-display">
                      Organized AI SEO Articles Library ({articles.length})
                    </h2>
                    <p className="text-xs text-mute mt-0.5">
                      Every article is mathematically graded on 7 real SEO checks, connected to an audited website, and shareable via a public preview URL.
                    </p>
                  </div>

                  {/* Filter by Audited Domain */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setLibraryDomainFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                        libraryDomainFilter === "all"
                          ? "bg-ink text-paper shadow-xs"
                          : "bg-card text-mute hover:text-ink border border-line"
                      }`}
                    >
                      All Domains ({articles.length})
                    </button>
                    {Array.from(
                      new Set(
                        articles
                          .map((a) => a.linkedDomain)
                          .filter(Boolean) as string[]
                      )
                    ).map((dom) => (
                      <button
                        key={dom}
                        onClick={() => setLibraryDomainFilter(dom)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                          libraryDomainFilter === dom
                            ? "bg-accent text-[#141413] font-bold shadow-xs"
                            : "bg-card text-mute hover:text-ink border border-line"
                        }`}
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredLibraryArticles.map((art) => {
                    const g = gradeArticleReal(
                      art.title,
                      art.content,
                      art.focusKeyword,
                      art.metaDescription
                    );
                    const realIdx = articles.findIndex((x) => x.id === art.id);
                    return (
                      <div
                        key={art.id}
                        className="bg-card rounded-3xl border border-line p-6 sp-card-shadow flex flex-col justify-between hover:border-accent/40 transition text-ink"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink bg-stage border border-line px-2.5 py-1 rounded-full">
                              <Globe className="w-3 h-3 text-accent" />
                              {art.linkedDomain || "General Workspace"}
                            </span>
                            <span
                              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                                g.score >= 85
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : g.score >= 65
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                              }`}
                            >
                              SEO Grade: {g.score}/100 ({g.letterGrade})
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-ink line-clamp-2 mb-2 font-display">
                            {art.title}
                          </h3>
                          <p className="text-xs text-mute line-clamp-3 leading-relaxed mb-4">
                            {art.metaDescription || art.content.slice(0, 150)}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-line space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-mute">
                            <span>
                              Focus KW:{" "}
                              <strong className="text-ink">
                                {art.focusKeyword}
                              </strong>
                            </span>
                            <span className="font-mono">
                              {g.wordCount} words • {g.density}% density
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (realIdx >= 0) {
                                  setCurrentArticleIdx(realIdx);
                                  loadArticleIntoState(articles[realIdx]);
                                }
                                setEditorViewMode("write");
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-semibold cursor-pointer text-center transition"
                            >
                              Edit in Studio
                            </button>
                            <Link
                              href={`/article/${art.id}`}
                              className="py-2 px-3 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink text-xs font-semibold inline-flex items-center gap-1 transition"
                            >
                              <span>Preview / Share</span>
                              <ExternalLink className="w-3 h-3 text-mute" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ============================================================
                VIEW MODE 1 & 2: EDITOR OR LIVE BLOG/SERP PREVIEW + RIGHT GRADER
               ============================================================ */}
            {editorViewMode !== "library" && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-line">
                {/* Left 8 or 12 Cols: Write Mode OR Live Blog & SERP Preview Mode */}
                <div
                  className={`${
                    rightGraderOpen ? "lg:col-span-8" : "lg:col-span-12"
                  } p-4 sm:p-8 flex flex-col bg-paper text-ink`}
                >
                  {editorViewMode === "write" ? (
                    <>
                      {/* Working Formatting Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-line">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink">
                          <button
                            type="button"
                            onClick={() => insertFormatting("h2")}
                            className="px-2.5 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 cursor-pointer text-ink"
                          >
                            + H2 Subheading
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("bold")}
                            className="w-8 h-8 rounded-xl border border-line bg-stage hover:bg-stage/80 font-bold cursor-pointer text-ink"
                            title="Insert Bold Keyword"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("italic")}
                            className="w-8 h-8 rounded-xl border border-line bg-stage hover:bg-stage/80 italic cursor-pointer text-ink"
                            title="Insert Italic Emphasis"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("bullet")}
                            className="px-2.5 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 cursor-pointer text-ink"
                          >
                            • Bullet List
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAiEditorAction("expand")}
                            disabled={aiOptimizing}
                            className="px-2.5 py-1.5 rounded-xl border border-line bg-stage hover:bg-stage/80 text-ink cursor-pointer"
                          >
                            + Expand (+250w &amp; FAQ)
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAiEditorAction("optimize")}
                          disabled={aiOptimizing}
                          className="px-4 py-2 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer shadow-xs"
                        >
                          {aiOptimizing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Seospace Neural Engine Optimizing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Assistant (Auto-Fix SEO)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {aiNote && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-stage border border-line text-xs text-ink flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent shrink-0" />
                            <span>
                              <strong>Seospace Neural Engine:</strong> {aiNote}
                            </span>
                          </div>
                          <button
                            onClick={() => setAiNote("")}
                            className="text-accent font-semibold hover:underline shrink-0 cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-mute">
                            Page / Article H1 Title ({articleGrade.titleLength}{" "}
                            / 60 chars optimal)
                          </label>
                          {linkedAuditId && (
                            <Link
                              href={`/report/${linkedAuditId}`}
                              className="text-[11px] font-semibold text-accent hover:underline inline-flex items-center gap-1"
                            >
                              <span>
                                Connected Audit: {linkedDomain || linkedAuditId}
                              </span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <input
                          type="text"
                          value={editorTitle}
                          onChange={(e) => {
                            setEditorTitle(e.target.value);
                            persistCurrentArticleChanges({
                              title: e.target.value,
                            });
                          }}
                          className="w-full text-2xl sm:text-3xl font-bold text-ink border-b border-line bg-transparent focus:border-accent focus:outline-none pb-2 font-display"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-mute mb-1">
                          SEO Meta Description ({articleGrade.metaLength} / 155
                          chars — include &ldquo;{focusKeyword}&rdquo;)
                        </label>
                        <input
                          type="text"
                          value={metaDesc}
                          onChange={(e) => {
                            setMetaDesc(e.target.value);
                            persistCurrentArticleChanges({
                              metaDescription: e.target.value,
                            });
                          }}
                          placeholder={`Write a 130–155 char meta description containing "${focusKeyword}"...`}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-stage text-xs text-ink placeholder:text-mute focus:border-accent focus:outline-none"
                        />
                      </div>

                      <textarea
                        value={editorBody}
                        onChange={(e) => {
                          setEditorBody(e.target.value);
                          persistCurrentArticleChanges({
                            content: e.target.value,
                          });
                        }}
                        rows={18}
                        className="w-full flex-1 text-sm sm:text-base text-ink placeholder:text-mute font-sans leading-relaxed bg-transparent focus:outline-none resize-none pt-2"
                      />
                    </>
                  ) : (
                    /* LIVE BLOG & GOOGLE SERP PREVIEW INSIDE STUDIO */
                    <div className="space-y-6">
                      {/* Google SERP Simulator Box */}
                      <div className="p-6 rounded-3xl bg-stage border border-line">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-ink">
                            <Search className="w-4 h-4 text-accent" />
                            <span>Live Google Search Result Snippet</span>
                          </div>
                          <Link
                            href={`/article/${activeArticleId}`}
                            className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open Full-Screen Shareable Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-line sp-card-shadow text-ink">
                          <div className="text-[11px] text-mute mb-0.5 font-mono">
                            https://{linkedDomain || "yourdomain.com"} › blog ›{" "}
                            {focusKeyword
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")}
                          </div>
                          <div className="text-lg font-medium text-cobalt dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                            {editorTitle}
                          </div>
                          <p className="text-xs text-mute mt-1 leading-relaxed">
                            {metaDesc || editorBody.slice(0, 155) + "..."}
                          </p>
                        </div>
                      </div>

                      {/* Formatted Editorial Article Preview */}
                      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-line sp-card-shadow space-y-4 text-ink">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-stage border border-line text-ink font-semibold">
                            {linkedDomain || "Seospace Content Studio"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                            Focus KW: {focusKeyword}
                          </span>
                          <span className="text-mute font-mono">
                            {articleGrade.wordCount} words •{" "}
                            {articleGrade.density}% density
                          </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight font-display">
                          {editorTitle}
                        </h1>

                        <div className="pt-4 border-t border-line space-y-3 text-sm sm:text-base text-ink leading-relaxed whitespace-pre-line">
                          {editorBody}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right-Hand Mathematical SEO Score Panel (4 cols, collapsible via rightGraderOpen) */}
                {rightGraderOpen && (
                <div className="lg:col-span-4 p-4 sm:p-6 bg-card border-l border-line space-y-6 text-ink">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-ink">
                        Uninflated SEO Score
                      </h3>
                      <p className="text-[11px] text-mute font-mono">
                        {articleGrade.wordCount}w • {articleGrade.density}% KW
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRightGraderOpen(false)}
                      title="Collapse SEO Score Panel"
                      className="px-2.5 py-1 rounded-xl bg-stage hover:bg-stage/80 border border-line text-mute hover:text-ink text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      <PanelRightClose className="w-3.5 h-3.5" />
                      <span>Hide Panel</span>
                    </button>
                  </div>

                  {/* 9-Segment Gauge + Working Tab Switcher */}
                  <div className="bg-stage rounded-3xl border border-line p-5 sp-card-shadow">
                    <SegmentedGauge
                      score={articleGrade.score}
                      sublabel={`Grade ${articleGrade.letterGrade} • ${articleGrade.keywordCount}x "${focusKeyword}"`}
                      theme={isDark ? "dark" : "light"}
                    />

                    <div className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-xl bg-card border border-line text-xs font-semibold">
                      {(["seo", "assistant", "details"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setRightPanelTab(tab)}
                          className={`py-1.5 rounded-lg capitalize transition cursor-pointer ${
                            rightPanelTab === tab
                              ? "bg-ink text-paper shadow-xs"
                              : "text-mute hover:text-ink"
                          }`}
                        >
                          {tab === "seo"
                            ? `Checks (${articleGrade.checks.length})`
                            : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUB-TAB A: 7 REAL MATHEMATICAL SEO CHECKS & KEYWORDS */}
                  {rightPanelTab === "seo" && (
                    <>
                      <div>
                        <div className="text-xs font-bold text-ink mb-2">
                          Target Keywords (Click to set Focus)
                        </div>
                        <div className="p-3 rounded-2xl bg-stage border border-line flex flex-wrap gap-2">
                          {keywordsList.map((kw) => {
                            const isFocus = kw === focusKeyword;
                            return (
                              <button
                                key={kw}
                                type="button"
                                onClick={() => {
                                  setFocusKeyword(kw);
                                  persistCurrentArticleChanges({
                                    focusKeyword: kw,
                                  });
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                                  isFocus
                                    ? "bg-accent text-[#141413] border-accent font-bold"
                                    : "bg-card text-ink border-line hover:border-accent/50"
                                }`}
                              >
                                {kw}
                              </button>
                            );
                          })}
                        </div>
                        <form
                          onSubmit={handleAddKeyword}
                          className="mt-2 flex gap-1.5"
                        >
                          <input
                            type="text"
                            value={newKeywordInput}
                            onChange={(e) => setNewKeywordInput(e.target.value)}
                            placeholder="Add target keyword..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-line bg-stage text-xs text-ink placeholder:text-mute focus:outline-none focus:border-accent"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded-xl bg-ink text-paper text-xs font-semibold cursor-pointer"
                          >
                            + Add
                          </button>
                        </form>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-ink">
                            7-Check Point Breakdown
                          </span>
                          <span className="text-[11px] font-mono font-bold text-accent">
                            {articleGrade.score} / 100 pts
                          </span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          {articleGrade.checks.map((chk) => (
                            <div
                              key={chk.id}
                              className="p-3.5 rounded-2xl bg-stage border border-line text-ink"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 font-bold text-ink">
                                  {chk.status === "pass" ? (
                                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                                      ✓
                                    </span>
                                  ) : chk.status === "warning" ? (
                                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                                      !
                                    </span>
                                  ) : (
                                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 text-[10px]">
                                      ✕
                                    </span>
                                  )}
                                  <span>{chk.label}</span>
                                </div>
                                <span
                                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                    chk.status === "pass"
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                      : chk.status === "warning"
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                  }`}
                                >
                                  +{chk.earnedPoints}/{chk.maxPoints}
                                </span>
                              </div>
                              <p className="text-[11px] text-mute mt-1.5 pl-6 leading-relaxed">
                                {chk.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* SUB-TAB B: AI ASSISTANT CO-PILOT */}
                  {rightPanelTab === "assistant" && (
                    <div className="space-y-3 text-xs">
                      <div className="font-bold text-ink">
                        Seospace Neural Engine Actions
                      </div>
                      <button
                        type="button"
                        disabled={aiOptimizing}
                        onClick={() => handleAiEditorAction("optimize")}
                        className="w-full p-4 rounded-2xl bg-stage border border-line hover:border-accent text-left transition cursor-pointer"
                      >
                        <div className="font-bold text-accent">
                          ✨ Fix Failed SEO Checks Automatically
                        </div>
                        <p className="text-mute mt-1 leading-relaxed">
                          Rewrites H1 title to front-load &ldquo;{focusKeyword}
                          &rdquo; under 60 chars, writes a 145-char meta
                          description, and calibrates keyword density.
                        </p>
                      </button>

                      <button
                        type="button"
                        disabled={aiOptimizing}
                        onClick={() => handleAiEditorAction("expand")}
                        className="w-full p-4 rounded-2xl bg-stage border border-line hover:border-accent text-left transition cursor-pointer"
                      >
                        <div className="font-bold text-ink">
                          📈 Append Deep-Dive Section + 3 GEO FAQs
                        </div>
                        <p className="text-mute mt-1 leading-relaxed">
                          Adds 250+ words of tactical steps and structured
                          Q&amp;As for ChatGPT &amp; Perplexity citations.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowNewArticleModal(true)}
                        className="w-full p-4 rounded-2xl bg-stage border border-line hover:border-accent text-left transition cursor-pointer"
                      >
                        <div className="font-bold text-ink">
                          📝 Generate Brand-New Article from Keyword
                        </div>
                        <p className="text-mute mt-1 leading-relaxed">
                          Create a fresh multi-section guide on any topic.
                        </p>
                      </button>
                    </div>
                  )}

                  {/* SUB-TAB C: DOCUMENT DETAILS & SHARE LINK */}
                  {rightPanelTab === "details" && (
                    <div className="space-y-4 text-xs">
                      <div className="p-4 rounded-2xl bg-stage border border-line space-y-2.5 text-ink">
                        <div className="flex justify-between">
                          <span className="text-mute">
                            Connected Website:
                          </span>
                          <span className="font-bold text-ink">
                            {linkedDomain || "Not linked"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mute">Word Count:</span>
                          <span className="font-bold font-mono">
                            {articleGrade.wordCount} words
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mute">
                            Keyword Occurrences:
                          </span>
                          <span className="font-bold font-mono text-accent">
                            {articleGrade.keywordCount}x ({articleGrade.density}
                            %)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mute">
                            Focus Keyword:
                          </span>
                          <span className="font-bold text-accent">
                            {focusKeyword}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/article/${activeArticleId}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-accent text-[#141413] hover:opacity-90 font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Open Public Shareable Article Page</span>
                      </Link>

                      {articles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentId = articles[currentArticleIdx]?.id;
                            if (!currentId) return;
                            const remaining = deleteArticle(currentId);
                            setArticles(remaining);
                            setCurrentArticleIdx(0);
                            loadArticleIntoState(remaining[0]);
                          }}
                          className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold cursor-pointer transition"
                        >
                          Delete Current Article
                        </button>
                      )}
                    </div>
                  )}
                </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: WHITE-LABEL AGENCY PDF BRANDING STUDIO
           ============================================================ */}
        {activeTab === "whitelabel" && (
          <div className="w-full px-5 sm:px-8 py-6 space-y-6 text-ink">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink font-display">
                  White-Label Agency PDF &amp; Report Branding
                </h1>
                <p className="text-xs sm:text-sm text-mute mt-1">
                  Customize every public audit URL and exported PDF report with
                  your agency&apos;s brand identity and booking link.
                </p>
              </div>
              <Link
                href={
                  latestAudit
                    ? `/report/${latestAudit.id}`
                    : "/report/voice-one-com"
                }
                className="px-4 py-2.5 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-semibold inline-flex items-center gap-2 transition shadow-xs"
              >
                <span>Preview Branded Report</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {wlSavedToast && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  White-Label Agency Branding saved! All audit reports &amp; PDF
                  exports now display your custom branding.
                </span>
              </div>
            )}

            <form
              onSubmit={handleSaveWhiteLabel}
              className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow space-y-6 text-ink"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Agency / Company Name
                  </label>
                  <input
                    type="text"
                    value={whiteLabel.agencyName}
                    onChange={(e) =>
                      setWhiteLabel({
                        ...whiteLabel,
                        agencyName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Header Badge / Logo Text
                  </label>
                  <input
                    type="text"
                    value={whiteLabel.logoText}
                    onChange={(e) =>
                      setWhiteLabel({ ...whiteLabel, logoText: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Primary Brand Color (Hex)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={whiteLabel.primaryColor}
                      onChange={(e) =>
                        setWhiteLabel({
                          ...whiteLabel,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-11 h-10 rounded-xl border border-line cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={whiteLabel.primaryColor}
                      onChange={(e) =>
                        setWhiteLabel({
                          ...whiteLabel,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Agency Contact Email
                  </label>
                  <input
                    type="email"
                    value={whiteLabel.contactEmail}
                    onChange={(e) =>
                      setWhiteLabel({
                        ...whiteLabel,
                        contactEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Report CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={whiteLabel.ctaText}
                    onChange={(e) =>
                      setWhiteLabel({ ...whiteLabel, ctaText: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-2">
                    Booking / Calendly CTA Destination URL
                  </label>
                  <input
                    type="url"
                    value={whiteLabel.ctaUrl}
                    onChange={(e) =>
                      setWhiteLabel({ ...whiteLabel, ctaUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  Custom Report Footer Note
                </label>
                <textarea
                  rows={2}
                  value={whiteLabel.footerNote}
                  onChange={(e) =>
                    setWhiteLabel({ ...whiteLabel, footerNote: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-line">
                <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whiteLabel.hidePoweredBy}
                    onChange={(e) =>
                      setWhiteLabel({
                        ...whiteLabel,
                        hidePoweredBy: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-accent rounded"
                  />
                  <span>
                    Hide &ldquo;Powered by Seospace AI&rdquo; badge on client
                    reports
                  </span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold transition cursor-pointer"
                >
                  Save Branding Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================
            TAB 4: EMBEDDABLE LEAD-CAPTURE WIDGET & INTERACTIVE CRM
           ============================================================ */}
        {activeTab === "widget" && (
          <div className="w-full px-5 sm:px-8 py-6 space-y-6 text-ink">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-ink font-display">
                  Embeddable Lead-Gen Audit Widget &amp; CRM
                </h1>
                <p className="text-xs sm:text-sm text-mute mt-1">
                  Embed our instant SEO &amp; CRO scanner on your agency website
                  to capture high-intent prospect emails automatically.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportLeadsCsv}
                  className="px-3.5 py-2 rounded-xl border border-line bg-stage hover:bg-card text-ink text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5 text-accent" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportLeadsJson}
                  className="px-3.5 py-2 rounded-xl border border-line bg-stage hover:bg-card text-ink text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Code className="w-3.5 h-3.5 text-cobalt" />
                  <span>JSON</span>
                </button>
                <Link
                  href="/widget"
                  className="px-4 py-2 rounded-xl bg-ink text-paper hover:bg-ink/90 text-xs font-semibold inline-flex items-center gap-2 transition shadow-xs"
                >
                  <span>Test Live Widget Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Embed Snippet Box */}
            <div className="bg-card rounded-3xl border border-line p-6 sp-card-shadow space-y-4 text-ink">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Code className="w-4 h-4 text-accent" />
                  <span>
                    Copy &amp; Paste Embed Snippet (WordPress, Webflow, Framer,
                    Next.js)
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(embedSnippet);
                    setCopiedWidget(true);
                    setTimeout(() => setCopiedWidget(false), 2500);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedWidget ? "Copied!" : "Copy Embed Code"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-night text-[#f3f0e8] border border-[#2a2a2c] text-xs overflow-x-auto font-mono">
                {embedSnippet}
              </pre>
            </div>

            {/* Instant Inbound Lead Webhook Dispatcher (Discord, Slack, Zapier) */}
            <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow space-y-4 text-ink">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent">
                    Real-Time Lead Alert Dispatcher
                  </span>
                  <h3 className="text-base font-bold text-ink font-display mt-0.5">
                    Instant Webhook Integration (Discord, Slack, Zapier)
                  </h3>
                  <p className="text-xs text-mute mt-0.5">
                    Every time a prospect submits their URL on your website, Seospace instantly sends a rich lead notification to your private channel or CRM.
                  </p>
                </div>
                {webhookStatus && (
                  <span className={`text-xs px-3 py-1.5 rounded-xl font-mono font-semibold border ${
                    webhookStatus.startsWith("✓")
                      ? "bg-card text-emerald-600 border-emerald-300"
                      : "bg-card text-rose-600 border-rose-300"
                  }`}>
                    {webhookStatus}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/... or https://hooks.slack.com/..."
                  value={whiteLabel.webhookUrl || ""}
                  onChange={(e) => {
                    const next = { ...whiteLabel, webhookUrl: e.target.value };
                    setWhiteLabel(next);
                    saveWhiteLabelConfig(next);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-stage border border-line text-xs font-mono text-ink placeholder:text-mute focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook}
                  className="px-4 py-2.5 rounded-2xl bg-accent text-[#141413] hover:opacity-90 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition shrink-0"
                >
                  {testingWebhook ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test Ping...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Send Test Webhook Ping</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-mute font-mono">
                <div className="p-3 rounded-xl bg-stage border border-line">
                  <strong className="text-ink block">Discord (Free, 60s):</strong>
                  Channel Settings → Integrations → Webhooks → Copy URL.
                </div>
                <div className="p-3 rounded-xl bg-stage border border-line">
                  <strong className="text-ink block">Slack (Free, 2 mins):</strong>
                  api.slack.com/apps → Incoming Webhooks → Activate.
                </div>
                <div className="p-3 rounded-xl bg-stage border border-line">
                  <strong className="text-ink block">Zapier / Make (Free):</strong>
                  Catch Hook URL → Pipe leads directly to Google Sheets or HubSpot.
                </div>
              </div>
            </div>

            {/* Captured Leads CRM Table with Status Cycling & Delete */}
            <div className="bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow text-ink">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-ink font-display">
                    Captured Agency Prospects ({leads.length})
                  </h3>
                  <p className="text-xs text-mute mt-0.5">
                    Click any lead&apos;s CRM status badge to progress them
                    through your sales pipeline.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-line text-[11px] uppercase tracking-wider text-mute font-mono">
                      <th className="py-3 px-3">Prospect Name</th>
                      <th className="py-3 px-3">Work Email</th>
                      <th className="py-3 px-3">Audited Website</th>
                      <th className="py-3 px-3">Site Score</th>
                      <th className="py-3 px-3">Captured</th>
                      <th className="py-3 px-3">CRM Status (Click)</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {leads.map((lead) => {
                      const nextStatusMap: Record<
                        CapturedLead["status"],
                        CapturedLead["status"]
                      > = {
                        New: "Contacted",
                        Contacted: "Qualified",
                        Qualified: "Closed",
                        Closed: "New",
                      };
                      return (
                        <tr key={lead.id} className="hover:bg-stage/60 transition">
                          <td className="py-3.5 px-3 font-bold text-ink">
                            {lead.name}
                          </td>
                          <td className="py-3.5 px-3 text-accent font-medium">
                            {lead.email}
                          </td>
                          <td className="py-3.5 px-3 text-ink">
                            {lead.websiteUrl}
                          </td>
                          <td className="py-3.5 px-3 font-bold">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] border ${
                                lead.auditScore >= 75
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {lead.auditScore}/100
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-mute font-mono">
                            {lead.createdAt}
                          </td>
                          <td className="py-3.5 px-3">
                            <button
                              type="button"
                              onClick={() =>
                                setLeads(
                                  updateLeadStatus(
                                    lead.id,
                                    nextStatusMap[lead.status]
                                  )
                                )
                              }
                              className="px-2.5 py-1 rounded-xl bg-stage hover:bg-stage/80 border border-line text-ink font-semibold cursor-pointer transition text-xs"
                            >
                              {lead.status} ↻
                            </button>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setLeads(deleteLeadById(lead.id))
                              }
                              className="p-1.5 rounded-xl text-mute hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: BILLING & LIVE STRIPE CHECKOUT
           ============================================================ */}
        {activeTab === "billing" && (
          <div className="w-full px-5 sm:px-8 py-6 space-y-6 text-ink">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink font-display">
                Subscription, Usage Credits &amp; Stripe Billing
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-1">
                Active Plan:{" "}
                <strong className="uppercase text-accent font-mono">{user.plan}</strong>{" "}
                • Audits Run This Session:{" "}
                <strong className="text-ink font-mono">{audits.length} Reports</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-3xl bg-card p-7 flex flex-col justify-between border sp-card-shadow text-ink ${
                    plan.highlighted
                      ? "border-2 border-accent shadow-md"
                      : "border-line"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-ink font-display">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/15 text-accent border border-accent/25">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-ink font-display">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-xs text-mute">/month</span>
                    </div>
                    <p className="mt-2 text-xs text-mute">
                      {plan.tagline}
                    </p>

                    <div className="mt-5 pt-5 border-t border-line space-y-2.5">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-ink"
                        >
                          <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={plan.monthlyPaymentLink}
                    target={plan.monthlyPrice > 0 ? "_blank" : undefined}
                    rel="noreferrer"
                    className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition block shadow-xs ${
                      plan.monthlyPrice > 0
                        ? "bg-accent text-[#141413] hover:opacity-90"
                        : "bg-stage border border-line text-ink hover:bg-stage/80"
                    }`}
                  >
                    {plan.monthlyPrice === 0
                      ? "Starter Plan"
                      : `Subscribe via Stripe ($${plan.monthlyPrice}/mo) ↗`}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading Seospace Workspace...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
