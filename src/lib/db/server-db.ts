import fs from "fs";
import os from "os";
import path from "path";
import {
  AuditReport,
  CapturedLead,
  DomainComparisonRecord,
  SavedArticle,
  WhiteLabelConfig,
} from "@/types/audit";
import {
  DEFAULT_WHITELABEL_CONFIG,
  INITIAL_ARTICLES,
  SAMPLE_AUDITS,
  SAMPLE_CAPTURED_LEADS,
} from "@/lib/sample-audits";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, "seospace-db.json");
const TMP_DB_FILE = path.join(os.tmpdir(), "seospace-db.json");

export interface ServerDatabaseSchema {
  audits: AuditReport[];
  articles: SavedArticle[];
  leads: CapturedLead[];
  comparisons: DomainComparisonRecord[];
  whiteLabel: WhiteLabelConfig;
  updatedAt: string;
  storageEngine?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __SEOSPACE_MEM_DB__: ServerDatabaseSchema | undefined;
}

export function normalizeUrlKey(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

function getInitialDb(): ServerDatabaseSchema {
  return {
    audits: Object.values(SAMPLE_AUDITS),
    articles: INITIAL_ARTICLES,
    leads: SAMPLE_CAPTURED_LEADS,
    comparisons: [
      {
        id: "cmp-voiceone-vs-stripe",
        primaryUrl: "https://voice-one.com/services/",
        competitorUrl: "https://stripe.com",
        primaryDomain: "voice-one.com",
        competitorDomain: "stripe.com",
        primaryScore: 74,
        competitorScore: 92,
        winnerDomain: "stripe.com",
        scoreDelta: 18,
        createdAt: "2026-10-21T17:30:00Z",
      },
    ],
    whiteLabel: DEFAULT_WHITELABEL_CONFIG,
    updatedAt: new Date().toISOString(),
    storageEngine: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "Supabase PostgreSQL + Hybrid Cache"
      : "Hybrid Serverless Cache",
  };
}

function resolveDbFileToRead(): string | null {
  try {
    if (fs.existsSync(TMP_DB_FILE)) return TMP_DB_FILE;
  } catch {
    // ignore
  }
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) return LOCAL_DB_FILE;
  } catch {
    // ignore
  }
  return null;
}

export function readServerDb(): ServerDatabaseSchema {
  try {
    const fileToRead = resolveDbFileToRead();
    let parsed: Partial<ServerDatabaseSchema> | null = null;

    if (fileToRead) {
      const raw = fs.readFileSync(fileToRead, "utf-8");
      parsed = JSON.parse(raw) as Partial<ServerDatabaseSchema>;
    } else if (globalThis.__SEOSPACE_MEM_DB__) {
      parsed = globalThis.__SEOSPACE_MEM_DB__;
    }

    if (!parsed) {
      const initial = getInitialDb();
      writeServerDb(initial);
      return initial;
    }

    const memAudits = globalThis.__SEOSPACE_MEM_DB__?.audits || [];
    const rawAudits = Array.isArray(parsed.audits) ? parsed.audits : [];
    const seenUrls = new Set<string>();
    const dedupedAudits: AuditReport[] = [];

    for (const a of [
      ...memAudits,
      ...rawAudits,
      ...Object.values(SAMPLE_AUDITS),
    ]) {
      if (!a || !a.url) continue;
      const key = normalizeUrlKey(a.url);
      if (!seenUrls.has(key)) {
        seenUrls.add(key);
        dedupedAudits.push(a);
      }
    }

    const db: ServerDatabaseSchema = {
      audits: dedupedAudits,
      articles:
        Array.isArray(parsed.articles) && parsed.articles.length > 0
          ? parsed.articles
          : globalThis.__SEOSPACE_MEM_DB__?.articles || INITIAL_ARTICLES,
      leads:
        Array.isArray(parsed.leads) && parsed.leads.length > 0
          ? parsed.leads
          : globalThis.__SEOSPACE_MEM_DB__?.leads || SAMPLE_CAPTURED_LEADS,
      comparisons: Array.isArray(parsed.comparisons)
        ? parsed.comparisons
        : globalThis.__SEOSPACE_MEM_DB__?.comparisons ||
          getInitialDb().comparisons,
      whiteLabel:
        parsed.whiteLabel ||
        globalThis.__SEOSPACE_MEM_DB__?.whiteLabel ||
        DEFAULT_WHITELABEL_CONFIG,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      storageEngine: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "Supabase PostgreSQL + Hybrid Cache"
        : "Hybrid Serverless Cache",
    };

    globalThis.__SEOSPACE_MEM_DB__ = db;
    return db;
  } catch {
    if (globalThis.__SEOSPACE_MEM_DB__) {
      return globalThis.__SEOSPACE_MEM_DB__;
    }
    const fallback = getInitialDb();
    globalThis.__SEOSPACE_MEM_DB__ = fallback;
    return fallback;
  }
}

export function writeServerDb(data: ServerDatabaseSchema): void {
  const stamped: ServerDatabaseSchema = {
    ...data,
    updatedAt: new Date().toISOString(),
    storageEngine: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? "Supabase PostgreSQL + Hybrid Cache"
      : "Hybrid Serverless Cache",
  };
  globalThis.__SEOSPACE_MEM_DB__ = stamped;
  const serialized = JSON.stringify(stamped, null, 2);

  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, "utf-8");
  } catch {
    // ignore
  }

  try {
    if (!process.env.VERCEL) {
      if (!fs.existsSync(LOCAL_DATA_DIR)) {
        fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_FILE, serialized, "utf-8");
    }
  } catch {
    // ignore
  }
}

// ============================================================================
// SUPABASE POSTGRESQL REAL-TIME PERSISTENCE HELPERS
// ============================================================================

export async function upsertAuditToSupabase(report: AuditReport): Promise<void> {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return;

  try {
    await supabase.from("audits").upsert(
      {
        id: report.id,
        url: report.url,
        normalized_url: normalizeUrlKey(report.url),
        domain: report.domain,
        overall_score: report.overallScore,
        letter_grade: report.letterGrade,
        status_label: report.statusLabel,
        response_time_ms: report.responseTimeMs || 0,
        word_count: report.wordCount || 0,
        seo_score: report.pillars?.seo?.score || 0,
        cro_score: report.pillars?.cro?.score || 0,
        geo_score: report.pillars?.geo?.score || 0,
        a11y_score: report.pillars?.a11y?.score || 0,
        security_score: report.pillars?.security?.score || 0,
        executive_summary: report.executiveSummary || "",
        estimated_conversion_lift: report.estimatedConversionLift || "+15%",
        extraction_source:
          report.metadata?.extractionSource ||
          "Seospace Edge Crawler + Cloudflare DoH + Live DOM",
        has_spf: Boolean(report.metadata?.dns?.hasSpf),
        has_dmarc: Boolean(report.metadata?.dns?.hasDmarc),
        dmarc_policy: report.metadata?.dns?.dmarcPolicy || "missing",
        mail_provider: report.metadata?.dns?.mailProvider || "Unknown",
        ipv6_support: Boolean(report.metadata?.dns?.ipv6Support),
        domain_first_seen_year:
          report.metadata?.domainHistory?.firstSeenYear || null,
        has_robots_txt: Boolean(report.metadata?.hasRobotsTxt),
        has_sitemap_xml: Boolean(report.metadata?.hasSitemapXml),
        has_llms_txt: Boolean(report.metadata?.hasLlmsTxt),
        has_json_ld: Boolean(report.metadata?.hasJsonLd),
        pillars: report.pillars || {},
        checks: report.checks || [],
        keywords: report.keywords || [],
        ai_rewrites: report.aiRewrites || [],
        metadata: report.metadata || {},
        report_payload: report,
        is_public: true,
        last_scanned_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch {
    // Non-blocking fallback
  }
}

export async function upsertArticleToSupabase(
  article: SavedArticle
): Promise<void> {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return;

  try {
    const wordCount = (article.content || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    await supabase.from("articles").upsert(
      {
        id: article.id,
        linked_audit_id: article.linkedAuditId || null,
        linked_domain: article.linkedDomain || null,
        title: article.title,
        focus_keyword: article.focusKeyword,
        keywords: article.keywords || [article.focusKeyword],
        meta_description: article.metaDescription || "",
        content: article.content,
        word_count: wordCount,
        seo_score: article.seoScore || 94,
        status: article.status || "Ready to Publish",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch {
    // ignore
  }
}

export async function upsertComparisonToSupabase(
  cmp: DomainComparisonRecord
): Promise<void> {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return;

  try {
    await supabase.from("domain_comparisons").upsert(
      {
        id: cmp.id,
        primary_url: cmp.primaryUrl,
        competitor_url: cmp.competitorUrl,
        primary_domain: cmp.primaryDomain,
        competitor_domain: cmp.competitorDomain,
        primary_score: cmp.primaryScore,
        competitor_score: cmp.competitorScore,
        winner_domain: cmp.winnerDomain,
        score_delta: cmp.scoreDelta,
        comparison_payload: cmp,
      },
      { onConflict: "id" }
    );
  } catch {
    // ignore
  }
}

export async function upsertLeadToSupabase(lead: CapturedLead): Promise<void> {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return;

  try {
    await supabase.from("captured_leads").upsert(
      {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        website_url: lead.websiteUrl,
        audit_score: lead.auditScore || 0,
        status: lead.status || "New",
      },
      { onConflict: "id" }
    );
  } catch {
    // ignore
  }
}

export async function upsertWhiteLabelToSupabase(
  config: WhiteLabelConfig
): Promise<void> {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return;

  try {
    await supabase.from("agency_whitelabel").upsert(
      {
        id: "default",
        agency_name: config.agencyName,
        logo_text: config.logoText || config.agencyName,
        primary_color: config.primaryColor,
        accent_color: config.accentColor || "#0F172A",
        cta_text: config.ctaText,
        cta_url: config.ctaUrl,
        contact_email: config.contactEmail || "strategy@apexgrowth.io",
        footer_note: config.footerNote || "",
        hide_powered_by: Boolean(config.hidePoweredBy),
        config_payload: config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch {
    // ignore
  }
}

export async function readServerDbWithSupabase(): Promise<ServerDatabaseSchema> {
  const localDb = readServerDb();
  const supabase = getServerSupabaseAdmin();
  if (!supabase) return localDb;

  try {
    const [auditsRes, articlesRes, leadsRes, cmpRes, wlRes] = await Promise.all([
      supabase
        .from("audits")
        .select("*")
        .order("last_scanned_at", { ascending: false })
        .limit(60),
      supabase
        .from("articles")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(50),
      supabase
        .from("captured_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("domain_comparisons")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase.from("agency_whitelabel").select("*").eq("id", "default").maybeSingle(),
    ]);

    // Merge Audits from Supabase + Local
    const supaAudits: AuditReport[] = (auditsRes.data || [])
      .map((row: Record<string, unknown>) => {
        if (
          row.report_payload &&
          typeof row.report_payload === "object" &&
          (row.report_payload as AuditReport).url
        ) {
          return row.report_payload as AuditReport;
        }
        return null;
      })
      .filter((a): a is AuditReport => Boolean(a));

    const seenUrls = new Set<string>();
    const mergedAudits: AuditReport[] = [];
    for (const a of [...supaAudits, ...localDb.audits]) {
      if (!a || !a.url) continue;
      const key = normalizeUrlKey(a.url);
      if (!seenUrls.has(key)) {
        seenUrls.add(key);
        mergedAudits.push(a);
      }
    }

    // Merge Articles from Supabase + Local
    const supaArticles: SavedArticle[] = (articlesRes.data || []).map(
      (row: Record<string, unknown>) => ({
        id: String(row.id),
        title: String(row.title || ""),
        focusKeyword: String(row.focus_keyword || ""),
        keywords: Array.isArray(row.keywords)
          ? (row.keywords as string[])
          : [String(row.focus_keyword || "")],
        metaDescription: String(row.meta_description || ""),
        content: String(row.content || ""),
        updatedAt: row.updated_at
          ? new Date(String(row.updated_at)).toLocaleDateString()
          : "Saved in Supabase",
        linkedDomain: row.linked_domain ? String(row.linked_domain) : undefined,
        linkedAuditId: row.linked_audit_id
          ? String(row.linked_audit_id)
          : undefined,
        seoScore: Number(row.seo_score || 94),
        status: String(row.status || "Ready to Publish"),
      })
    );

    const seenArticleIds = new Set<string>();
    const mergedArticles: SavedArticle[] = [];
    const articleSources = [
      ...supaArticles,
      ...(Array.isArray(localDb.articles) && localDb.articles.length > 0
        ? localDb.articles
        : INITIAL_ARTICLES),
    ];
    for (const art of articleSources) {
      if (!art || !art.id) continue;
      if (!seenArticleIds.has(art.id)) {
        seenArticleIds.add(art.id);
        mergedArticles.push(art);
      }
    }
    const finalArticles =
      mergedArticles.length > 0 ? mergedArticles : INITIAL_ARTICLES;

    // Merge Leads
    const supaLeads: CapturedLead[] = (leadsRes.data || []).map(
      (row: Record<string, unknown>) => ({
        id: String(row.id),
        name: String(row.name || ""),
        email: String(row.email || ""),
        websiteUrl: String(row.website_url || ""),
        auditScore: Number(row.audit_score || 78),
        status: (row.status as CapturedLead["status"]) || "New",
        createdAt: row.created_at
          ? new Date(String(row.created_at)).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Saved",
      })
    );

    const seenLeadIds = new Set<string>();
    const mergedLeads: CapturedLead[] = [];
    for (const ld of [...supaLeads, ...localDb.leads]) {
      if (!ld || !ld.id) continue;
      if (!seenLeadIds.has(ld.id)) {
        seenLeadIds.add(ld.id);
        mergedLeads.push(ld);
      }
    }

    // Merge Comparisons
    const supaCmps: DomainComparisonRecord[] = (cmpRes.data || []).map(
      (row: Record<string, unknown>) => ({
        id: String(row.id),
        primaryUrl: String(row.primary_url || ""),
        competitorUrl: String(row.competitor_url || ""),
        primaryDomain: String(row.primary_domain || ""),
        competitorDomain: String(row.competitor_domain || ""),
        primaryScore: Number(row.primary_score || 0),
        competitorScore: Number(row.competitor_score || 0),
        winnerDomain: String(row.winner_domain || ""),
        scoreDelta: Number(row.score_delta || 0),
        createdAt: String(row.created_at || new Date().toISOString()),
      })
    );
    const seenCmpIds = new Set<string>();
    const mergedCmps: DomainComparisonRecord[] = [];
    for (const c of [...supaCmps, ...localDb.comparisons]) {
      if (!c || !c.id) continue;
      if (!seenCmpIds.has(c.id)) {
        seenCmpIds.add(c.id);
        mergedCmps.push(c);
      }
    }

    const whiteLabel: WhiteLabelConfig =
      wlRes.data?.config_payload &&
      typeof wlRes.data.config_payload === "object" &&
      (wlRes.data.config_payload as WhiteLabelConfig).agencyName
        ? (wlRes.data.config_payload as WhiteLabelConfig)
        : localDb.whiteLabel;

    const hydrated: ServerDatabaseSchema = {
      audits: mergedAudits,
      articles: finalArticles,
      leads: mergedLeads,
      comparisons: mergedCmps,
      whiteLabel,
      updatedAt: new Date().toISOString(),
      storageEngine: "Supabase PostgreSQL + Hybrid Cache",
    };

    writeServerDb(hydrated);
    return hydrated;
  } catch {
    return localDb;
  }
}

export async function findAuditInServerDbAsync(
  urlOrId: string
): Promise<AuditReport | null> {
  if (!urlOrId) return null;
  const localHit = findAuditInServerDb(urlOrId);
  if (localHit) return localHit;

  const supabase = getServerSupabaseAdmin();
  if (!supabase) return null;

  try {
    const cleanId = urlOrId.trim().toLowerCase();
    const normTarget = normalizeUrlKey(urlOrId);

    const { data } = await supabase
      .from("audits")
      .select("report_payload")
      .or(
        `id.eq.${cleanId},normalized_url.eq.${normTarget},domain.eq.${normTarget}`
      )
      .limit(1)
      .maybeSingle();

    if (
      data?.report_payload &&
      typeof data.report_payload === "object" &&
      (data.report_payload as AuditReport).url
    ) {
      const report = data.report_payload as AuditReport;
      saveAuditToServerDb(report);
      return report;
    }
  } catch {
    // ignore
  }
  return null;
}

export function findAuditInServerDb(urlOrId: string): AuditReport | null {
  if (!urlOrId) return null;
  const db = readServerDb();
  const cleanId = urlOrId.trim().toLowerCase();
  const normTarget = normalizeUrlKey(urlOrId);

  const byId = db.audits.find((a) => a.id.toLowerCase() === cleanId);
  if (byId) return byId;

  const byUrl = db.audits.find((a) => normalizeUrlKey(a.url) === normTarget);
  if (byUrl) return byUrl;

  const byDomain = db.audits.find(
    (a) => normalizeUrlKey(a.domain) === normTarget
  );
  if (byDomain) return byDomain;

  return null;
}

export function saveAuditToServerDb(report: AuditReport): AuditReport {
  const db = readServerDb();
  const normReportUrl = normalizeUrlKey(report.url);

  const existingMatch = db.audits.find(
    (a) => a.id === report.id || normalizeUrlKey(a.url) === normReportUrl
  );
  const finalReport: AuditReport = existingMatch
    ? { ...report, id: existingMatch.id }
    : report;

  const filtered = db.audits.filter(
    (a) =>
      a.id !== finalReport.id && normalizeUrlKey(a.url) !== normReportUrl
  );
  db.audits = [finalReport, ...filtered].slice(0, 100);
  writeServerDb(db);

  // Fire-and-forget sync to Supabase PostgreSQL
  void upsertAuditToSupabase(finalReport);

  return finalReport;
}

export function saveArticleToServerDb(article: SavedArticle): SavedArticle {
  const db = readServerDb();
  const exists = db.articles.some((a) => a.id === article.id);
  db.articles = exists
    ? db.articles.map((a) => (a.id === article.id ? article : a))
    : [article, ...db.articles];
  writeServerDb(db);

  void upsertArticleToSupabase(article);

  return article;
}

export function saveComparisonToServerDb(
  comparison: DomainComparisonRecord
): DomainComparisonRecord {
  const db = readServerDb();
  const filtered = (db.comparisons || []).filter((c) => c.id !== comparison.id);
  db.comparisons = [comparison, ...filtered].slice(0, 50);
  writeServerDb(db);

  void upsertComparisonToSupabase(comparison);

  return comparison;
}

export function saveLeadToServerDb(lead: CapturedLead): CapturedLead {
  const db = readServerDb();
  const exists = (db.leads || []).some((l) => l.id === lead.id);
  db.leads = exists
    ? db.leads.map((l) => (l.id === lead.id ? lead : l))
    : [lead, ...(db.leads || [])];
  writeServerDb(db);

  void upsertLeadToSupabase(lead);

  return lead;
}

export function saveWhiteLabelToServerDb(
  config: WhiteLabelConfig
): WhiteLabelConfig {
  const db = readServerDb();
  db.whiteLabel = config;
  writeServerDb(db);

  void upsertWhiteLabelToSupabase(config);

  return config;
}
