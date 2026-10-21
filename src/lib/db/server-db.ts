import fs from "fs";
import os from "os";
import path from "path";
import {
  AuditReport,
  CapturedLead,
  DomainComparisonRecord,
  WhiteLabelConfig,
} from "@/types/audit";
import {
  DEFAULT_WHITELABEL_CONFIG,
  SAMPLE_AUDITS,
  SAMPLE_CAPTURED_LEADS,
} from "@/lib/sample-audits";
import { INITIAL_ARTICLES, SavedArticle } from "@/lib/storage/workspace-store";

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
        primaryScore: 64,
        competitorScore: 92,
        winnerDomain: "stripe.com",
        scoreDelta: 28,
        createdAt: "2026-10-21T17:30:00Z",
      },
    ],
    whiteLabel: DEFAULT_WHITELABEL_CONFIG,
    updatedAt: new Date().toISOString(),
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
        : globalThis.__SEOSPACE_MEM_DB__?.comparisons || getInitialDb().comparisons,
      whiteLabel:
        parsed.whiteLabel ||
        globalThis.__SEOSPACE_MEM_DB__?.whiteLabel ||
        DEFAULT_WHITELABEL_CONFIG,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
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
  };
  globalThis.__SEOSPACE_MEM_DB__ = stamped;
  const serialized = JSON.stringify(stamped, null, 2);

  // Always write to os.tmpdir() (writable on Vercel serverless AND local OS)
  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, "utf-8");
  } catch {
    // ignore
  }

  // Also write to .data/seospace-db.json when running locally
  try {
    if (!process.env.VERCEL) {
      if (!fs.existsSync(LOCAL_DATA_DIR)) {
        fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_FILE, serialized, "utf-8");
    }
  } catch {
    // On read-only serverless file systems, fail gracefully
  }
}

export function findAuditInServerDb(urlOrId: string): AuditReport | null {
  if (!urlOrId) return null;
  const db = readServerDb();
  const cleanId = urlOrId.trim().toLowerCase();
  const normTarget = normalizeUrlKey(urlOrId);

  // 1. Exact ID match
  const byId = db.audits.find((a) => a.id.toLowerCase() === cleanId);
  if (byId) return byId;

  // 2. Exact normalized URL match (e.g., "voice-one.com/services")
  const byUrl = db.audits.find((a) => normalizeUrlKey(a.url) === normTarget);
  if (byUrl) return byUrl;

  // 3. Exact domain match (e.g., "stripe.com" or "voice-one.com")
  const byDomain = db.audits.find(
    (a) => normalizeUrlKey(a.domain) === normTarget
  );
  if (byDomain) return byDomain;

  return null;
}

export function saveAuditToServerDb(report: AuditReport): AuditReport {
  const db = readServerDb();
  const normReportUrl = normalizeUrlKey(report.url);

  // If an audit for this exact URL already exists, preserve its primary ID so links don't break
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
  return finalReport;
}

export function saveArticleToServerDb(article: SavedArticle): SavedArticle {
  const db = readServerDb();
  const exists = db.articles.some((a) => a.id === article.id);
  db.articles = exists
    ? db.articles.map((a) => (a.id === article.id ? article : a))
    : [article, ...db.articles];
  writeServerDb(db);
  return article;
}

export function saveComparisonToServerDb(
  comparison: DomainComparisonRecord
): DomainComparisonRecord {
  const db = readServerDb();
  const filtered = (db.comparisons || []).filter((c) => c.id !== comparison.id);
  db.comparisons = [comparison, ...filtered].slice(0, 50);
  writeServerDb(db);
  return comparison;
}

export function saveLeadToServerDb(lead: CapturedLead): CapturedLead {
  const db = readServerDb();
  const exists = (db.leads || []).some((l) => l.id === lead.id);
  db.leads = exists
    ? db.leads.map((l) => (l.id === lead.id ? lead : l))
    : [lead, ...(db.leads || [])];
  writeServerDb(db);
  return lead;
}

export function saveWhiteLabelToServerDb(
  config: WhiteLabelConfig
): WhiteLabelConfig {
  const db = readServerDb();
  db.whiteLabel = config;
  writeServerDb(db);
  return config;
}
