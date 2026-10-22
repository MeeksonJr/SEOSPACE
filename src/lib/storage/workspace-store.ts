"use client";

import {
  AuditReport,
  CapturedLead,
  SavedArticle,
  WhiteLabelConfig,
} from "@/types/audit";
import {
  DEFAULT_WHITELABEL_CONFIG,
  INITIAL_ARTICLES,
  SAMPLE_AUDITS,
  SAMPLE_CAPTURED_LEADS,
} from "@/lib/sample-audits";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";

const AUDITS_STORAGE_KEY = "seospace_saved_audits_v3";
const WHITELABEL_STORAGE_KEY = "seospace_whitelabel_v3";
const LEADS_STORAGE_KEY = "seospace_captured_leads_v3";
const USER_STORAGE_KEY = "seospace_auth_user_v3";
const ARTICLES_STORAGE_KEY = "seospace_saved_articles_v3";
const ADMIN_USERS_STORAGE_KEY = "seospace_admin_users_v3";

export interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "pro" | "agency";
  creditsUsed: number;
  creditsLimit: number;
  joined: string;
}

export interface ArticleCheckResult {
  id: string;
  label: string;
  passed: boolean;
  status: "pass" | "warning" | "fail";
  pointsEarned: number;
  pointsMax: number;
  earnedPoints: number;
  maxPoints: number;
  detail: string;
}

export interface ArticleGradeBreakdown {
  score: number;
  letterGrade: string;
  wordCount: number;
  readingTimeMin: number;
  keywordCount: number;
  keywordDensityPct: number;
  density: number;
  titleLength: number;
  metaLength: number;
  headingCount: number;
  bulletCount: number;
  checks: ArticleCheckResult[];
}

export type { SavedArticle };
export type ArticleDraft = SavedArticle;

export function gradeArticleReal(
  title: string,
  content: string,
  focusKeyword: string,
  metaDescription = ""
): ArticleGradeBreakdown {
  const cleanTitle = (title || "").trim();
  const cleanBody = (content || "").trim();
  const cleanKw = (focusKeyword || "").trim().toLowerCase();
  const cleanMeta = (metaDescription || "").trim();

  const words = cleanBody.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Count exact keyword occurrences in body
  let keywordCount = 0;
  if (cleanKw.length > 1) {
    const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = cleanBody.match(new RegExp(escaped, "gi"));
    keywordCount = matches ? matches.length : 0;
  }
  const keywordDensityPct =
    wordCount > 0
      ? Number(
          (((keywordCount * cleanKw.split(/\s+/).length) / wordCount) * 100).toFixed(
            2
          )
        )
      : 0;

  // Count headings (lines that are short and preceded by blank line or #)
  const lines = cleanBody.split("\n").map((l) => l.trim());
  const headingCount = lines.filter(
    (l, i) =>
      l.length >= 8 &&
      l.length <= 90 &&
      !l.endsWith(".") &&
      !l.startsWith("•") &&
      !l.startsWith("-") &&
      (l.startsWith("#") || i === 0 || lines[i - 1] === "")
  ).length;

  const bulletCount = lines.filter(
    (l) => l.startsWith("•") || l.startsWith("- ") || /^\d+[\.\)]/.test(l)
  ).length;

  const checks: ArticleCheckResult[] = [];
  const pushCheck = (
    id: string,
    label: string,
    pts: number,
    max: number,
    detail: string
  ) => {
    const status: "pass" | "warning" | "fail" =
      pts === max ? "pass" : pts > 0 ? "warning" : "fail";
    checks.push({
      id,
      label,
      passed: pts === max,
      status,
      pointsEarned: pts,
      pointsMax: max,
      earnedPoints: pts,
      maxPoints: max,
      detail,
    });
  };

  // 1. Focus Keyword in H1 Title (20 pts)
  const kwInTitle =
    cleanKw.length > 0 && cleanTitle.toLowerCase().includes(cleanKw);
  pushCheck(
    "kw-title",
    `Focus keyword "${focusKeyword || "unset"}" appears in Page Title`,
    kwInTitle ? 20 : 0,
    20,
    kwInTitle ? "Present in H1 Title" : "Missing from H1 Title"
  );

  // 2. Title Length 35-62 chars & No Duplication (15 pts)
  const titleLen = cleanTitle.length;
  const titleOptimal = titleLen >= 35 && titleLen <= 62;
  const titlePts =
    titleOptimal ? 15 : titleLen >= 20 && titleLen <= 72 ? 8 : 0;
  pushCheck(
    "title-len",
    `Title length is optimal (${titleLen} of 60 chars used)`,
    titlePts,
    15,
    `${titleLen} characters (target 35–60 chars)`
  );

  // 3. Focus Keyword at Beginning of Title (15 pts)
  const kwAtStart =
    cleanKw.length > 0 &&
    cleanTitle.toLowerCase().indexOf(cleanKw) >= 0 &&
    cleanTitle.toLowerCase().indexOf(cleanKw) <= 18;
  pushCheck(
    "kw-start",
    `Focus keyword placed near beginning of Title`,
    kwAtStart ? 15 : kwInTitle ? 7 : 0,
    15,
    kwAtStart ? "Front-loaded in H1" : "Place keyword in first 18 chars of H1"
  );

  // 4. Meta Description Length & Keyword (15 pts)
  const metaLen = cleanMeta.length;
  const metaHasKw =
    cleanKw.length > 0 && cleanMeta.toLowerCase().includes(cleanKw);
  const metaOptimal = metaLen >= 100 && metaLen <= 162 && metaHasKw;
  const metaPts = metaOptimal
    ? 15
    : metaLen >= 70 && metaLen <= 170
    ? 9
    : metaLen > 0
    ? 4
    : 0;
  pushCheck(
    "meta-desc",
    `Meta description includes focus keyword (${metaLen}/155 chars)`,
    metaPts,
    15,
    metaLen > 0
      ? `${metaLen} chars ${metaHasKw ? "(includes keyword)" : "(missing keyword)"}`
      : "Missing meta description"
  );

  // 5. Content Depth / Word Count (15 pts)
  const depthPts =
    wordCount >= 350
      ? 15
      : wordCount >= 220
      ? 12
      : wordCount >= 140
      ? 8
      : wordCount >= 60
      ? 4
      : 0;
  pushCheck(
    "word-count",
    `Comprehensive article depth (${wordCount} words; target 350+ words)`,
    depthPts,
    15,
    `${wordCount} words indexed`
  );

  // 6. Keyword Integration & Density in Body (10 pts)
  const densityOptimal = keywordCount >= 2 && keywordDensityPct <= 3.5;
  const densityPts = densityOptimal ? 10 : keywordCount === 1 ? 6 : 0;
  pushCheck(
    "kw-density",
    `Keyword integrated naturally in body (${keywordCount}x, ${keywordDensityPct}% density)`,
    densityPts,
    10,
    `${keywordCount} occurrences (${keywordDensityPct}% density)`
  );

  // 7. Subheadings & Scannable Bullet Lists (10 pts)
  const structurePts =
    (headingCount >= 2 ? 5 : headingCount === 1 ? 3 : 0) +
    (bulletCount >= 2 ? 5 : bulletCount === 1 ? 3 : 0);
  pushCheck(
    "structure",
    `Structured subheadings (${headingCount}) & scannable lists (${bulletCount} items)`,
    structurePts,
    10,
    `${headingCount} subheadings, ${bulletCount} bullet points`
  );

  const totalEarned = checks.reduce((s, c) => s + c.pointsEarned, 0);
  const totalMax = checks.reduce((s, c) => s + c.pointsMax, 0);
  const score = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  const letterGrade =
    score >= 92
      ? "A+"
      : score >= 85
      ? "A"
      : score >= 78
      ? "B+"
      : score >= 70
      ? "B"
      : score >= 60
      ? "C"
      : "D";

  return {
    score,
    letterGrade,
    wordCount,
    readingTimeMin,
    keywordCount,
    keywordDensityPct,
    density: keywordDensityPct,
    titleLength: titleLen,
    metaLength: metaLen,
    headingCount,
    bulletCount,
    checks,
  };
}

export const DEFAULT_DEMO_USER: WorkspaceUser = {
  id: "usr-owner",
  name: "Zaim Maulana",
  email: "zaim@seospace.io",
  plan: "agency",
  creditsUsed: 4,
  creditsLimit: 999,
  joined: "Oct 2026",
};

export { INITIAL_ARTICLES };

export function normalizeClientUrl(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

export function getSavedAudits(): AuditReport[] {
  if (typeof window === "undefined") {
    return Object.values(SAMPLE_AUDITS);
  }
  try {
    const raw = localStorage.getItem(AUDITS_STORAGE_KEY);
    if (!raw) {
      const initial = Object.values(SAMPLE_AUDITS);
      localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: AuditReport[] = JSON.parse(raw);
    const seen = new Set<string>();
    const deduped: AuditReport[] = [];
    for (const a of parsed) {
      if (!a || !a.url) continue;
      const key = normalizeClientUrl(a.url);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(a);
      }
    }
    return deduped;
  } catch {
    return Object.values(SAMPLE_AUDITS);
  }
}

export function findSavedAuditByUrl(urlOrId: string): AuditReport | null {
  if (!urlOrId) return null;
  const all = getSavedAudits();
  const cleanId = urlOrId.trim().toLowerCase();
  const norm = normalizeClientUrl(urlOrId);

  const byId = all.find(
    (a) =>
      a.id.toLowerCase() === cleanId ||
      a.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase() === cleanId
  );
  if (byId) return byId;

  const byUrl = all.find((a) => normalizeClientUrl(a.url) === norm);
  if (byUrl) return byUrl;

  const byDomain = all.find((a) => normalizeClientUrl(a.domain) === norm);
  if (byDomain) return byDomain;

  if (SAMPLE_AUDITS[cleanId]) return SAMPLE_AUDITS[cleanId];
  return null;
}

export function getAuditById(id: string): AuditReport | null {
  return findSavedAuditByUrl(id);
}

export function saveAuditReport(
  report: AuditReport,
  incrementCredits = true
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedAudits();
    const normUrl = normalizeClientUrl(report.url);
    const filtered = existing.filter(
      (a) => a.id !== report.id && normalizeClientUrl(a.url) !== normUrl
    );
    localStorage.setItem(
      AUDITS_STORAGE_KEY,
      JSON.stringify([report, ...filtered].slice(0, 50))
    );
    if (incrementCredits) {
      const u = getWorkspaceUser();
      saveWorkspaceUser({ creditsUsed: (u.creditsUsed || 0) + 1 });
    }

    // Also sync to server database in background
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save_audit", audit: report }),
    }).catch(() => {});
  } catch {
    // ignore storage errors
  }
}

export function deleteAuditById(id: string): AuditReport[] {
  if (typeof window === "undefined") return [];
  const updated = getSavedAudits().filter((a) => a.id !== id);
  localStorage.setItem(AUDITS_STORAGE_KEY, JSON.stringify(updated));
  fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "delete_audit", id }),
  }).catch(() => {});
  return updated;
}

export function getSavedArticles(): SavedArticle[] {
  if (typeof window === "undefined") return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        ARTICLES_STORAGE_KEY,
        JSON.stringify(INITIAL_ARTICLES)
      );
      return INITIAL_ARTICLES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function getArticleById(id: string): SavedArticle | null {
  const all = getSavedArticles();
  return all.find((a) => a.id === id) || null;
}

export function saveArticle(article: SavedArticle): SavedArticle[] {
  if (typeof window === "undefined") return INITIAL_ARTICLES;
  const current = getSavedArticles();
  const exists = current.some((a) => a.id === article.id);
  const updated = exists
    ? current.map((a) => (a.id === article.id ? article : a))
    : [article, ...current];
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updated));

  // Sync to server DB
  fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "save_article", article }),
  }).catch(() => {});

  return updated;
}

export function deleteArticle(id: string): SavedArticle[] {
  if (typeof window === "undefined") return INITIAL_ARTICLES;
  const current = getSavedArticles().filter((a) => a.id !== id);
  const finalArticles = current.length > 0 ? current : INITIAL_ARTICLES;
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(finalArticles));
  fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "delete_article", id }),
  }).catch(() => {});
  return finalArticles;
}

export function getWhiteLabelConfig(): WhiteLabelConfig {
  if (typeof window === "undefined") return DEFAULT_WHITELABEL_CONFIG;
  try {
    const raw = localStorage.getItem(WHITELABEL_STORAGE_KEY);
    if (!raw) return DEFAULT_WHITELABEL_CONFIG;
    return { ...DEFAULT_WHITELABEL_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_WHITELABEL_CONFIG;
  }
}

export function saveWhiteLabelConfig(config: WhiteLabelConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WHITELABEL_STORAGE_KEY, JSON.stringify(config));
  fetch("/api/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "save_whitelabel", whiteLabel: config }),
  }).catch(() => {});
}

export function getCapturedLeads(): CapturedLead[] {
  if (typeof window === "undefined") return SAMPLE_CAPTURED_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        LEADS_STORAGE_KEY,
        JSON.stringify(SAMPLE_CAPTURED_LEADS)
      );
      return SAMPLE_CAPTURED_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_CAPTURED_LEADS;
  }
}

export function addCapturedLead(
  lead: Omit<CapturedLead, "id" | "createdAt" | "status">
): CapturedLead {
  const newLead: CapturedLead = {
    ...lead,
    id: "lead-" + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "New",
  };
  if (typeof window !== "undefined") {
    const current = getCapturedLeads();
    localStorage.setItem(
      LEADS_STORAGE_KEY,
      JSON.stringify([newLead, ...current])
    );
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save_lead", lead: newLead }),
    }).catch(() => {});
  }
  return newLead;
}

export function updateLeadStatus(
  id: string,
  status: CapturedLead["status"]
): CapturedLead[] {
  if (typeof window === "undefined") return SAMPLE_CAPTURED_LEADS;
  const updated = getCapturedLeads().map((l) =>
    l.id === id ? { ...l, status } : l
  );
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  const changed = updated.find((l) => l.id === id);
  if (changed) {
    fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "save_lead", lead: changed }),
    }).catch(() => {});
  }
  return updated;
}

export function deleteLeadById(id: string): CapturedLead[] {
  if (typeof window === "undefined") return [];
  const updated = getCapturedLeads().filter((l) => l.id !== id);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getWorkspaceUser(): WorkspaceUser {
  if (typeof window === "undefined") return DEFAULT_DEMO_USER;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO_USER;
    return { ...DEFAULT_DEMO_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DEMO_USER;
  }
}

export function saveWorkspaceUser(user: Partial<WorkspaceUser>): WorkspaceUser {
  const current = getWorkspaceUser();
  const updated: WorkspaceUser = {
    ...current,
    ...user,
    id:
      user.id ||
      current.id ||
      "usr-" + Math.random().toString(36).slice(2, 7),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    upsertAdminUser(updated);
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sync",
        email: updated.email,
        name: updated.name,
        plan: updated.plan,
      }),
    }).catch(() => {});
  }
  return updated;
}

export function logoutWorkspaceUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
  try {
    const supabase = getBrowserSupabaseClient();
    if (supabase) {
      void supabase.auth.signOut();
    }
  } catch {
    // ignore
  }
}

export function getAdminUsers(): WorkspaceUser[] {
  if (typeof window === "undefined") return [DEFAULT_DEMO_USER];
  try {
    const raw = localStorage.getItem(ADMIN_USERS_STORAGE_KEY);
    if (!raw) {
      const seed: WorkspaceUser[] = [
        DEFAULT_DEMO_USER,
        {
          id: "usr-2",
          name: "Sarah Jenkins",
          email: "sarah@elevateagency.co",
          plan: "agency",
          creditsUsed: 29,
          creditsLimit: 999,
          joined: "Oct 2026",
        },
        {
          id: "usr-3",
          name: "David Kim",
          email: "david@hypergrowth.io",
          plan: "pro",
          creditsUsed: 18,
          creditsLimit: 100,
          joined: "Oct 2026",
        },
      ];
      localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

export function upsertAdminUser(user: WorkspaceUser): WorkspaceUser[] {
  if (typeof window === "undefined") return [user];
  const list = getAdminUsers();
  const exists = list.some(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  const updated = exists
    ? list.map((u) =>
        u.email.toLowerCase() === user.email.toLowerCase()
          ? { ...u, ...user }
          : u
      )
    : [user, ...list];
  localStorage.setItem(ADMIN_USERS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export const getArticles = getSavedArticles;

export async function syncFromServerDb(): Promise<{
  audits: AuditReport[];
  articles: SavedArticle[];
}> {
  const localAudits = getSavedAudits();
  const localArticles = getSavedArticles();

  if (typeof window === "undefined") {
    return { audits: localAudits, articles: localArticles };
  }

  try {
    const res = await fetch("/api/db", { cache: "no-store" });
    if (!res.ok) return { audits: localAudits, articles: localArticles };
    const data = await res.json();

    let mergedAudits = localAudits;
    if (Array.isArray(data?.audits) && data.audits.length > 0) {
      const byUrlKey = new Map<string, AuditReport>();
      for (const a of [...data.audits, ...localAudits]) {
        if (!a || !a.url) continue;
        const k = normalizeClientUrl(a.url);
        if (!byUrlKey.has(k)) {
          byUrlKey.set(k, a);
        }
      }
      mergedAudits = Array.from(byUrlKey.values());
      localStorage.setItem(
        AUDITS_STORAGE_KEY,
        JSON.stringify(mergedAudits.slice(0, 50))
      );
    }

    let mergedArticles = localArticles;
    if (Array.isArray(data?.articles) && data.articles.length > 0) {
      const byId = new Map<string, SavedArticle>();
      for (const art of [...data.articles, ...localArticles]) {
        if (art && art.id && !byId.has(art.id)) {
          byId.set(art.id, art);
        }
      }
      mergedArticles = Array.from(byId.values());
      localStorage.setItem(
        ARTICLES_STORAGE_KEY,
        JSON.stringify(mergedArticles)
      );
    }

    return { audits: mergedAudits, articles: mergedArticles };
  } catch {
    return { audits: localAudits, articles: localArticles };
  }
}
