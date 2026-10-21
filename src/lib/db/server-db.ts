import fs from "fs";
import path from "path";
import { AuditReport } from "@/types/audit";
import { SAMPLE_AUDITS } from "@/lib/sample-audits";
import { INITIAL_ARTICLES, SavedArticle } from "@/lib/storage/workspace-store";

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "seospace-db.json");

export interface ServerDatabaseSchema {
  audits: AuditReport[];
  articles: SavedArticle[];
  updatedAt: string;
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
    updatedAt: new Date().toISOString(),
  };
}

export function readServerDb(): ServerDatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDb();
      writeServerDb(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ServerDatabaseSchema;

    // Deduplicate audits by normalized URL key while preserving sample audits
    const rawAudits = Array.isArray(parsed.audits)
      ? parsed.audits
      : Object.values(SAMPLE_AUDITS);
    const seenUrls = new Set<string>();
    const dedupedAudits: AuditReport[] = [];
    for (const a of [...rawAudits, ...Object.values(SAMPLE_AUDITS)]) {
      if (!a || !a.url) continue;
      const key = normalizeUrlKey(a.url);
      if (!seenUrls.has(key)) {
        seenUrls.add(key);
        dedupedAudits.push(a);
      }
    }

    return {
      audits: dedupedAudits,
      articles: Array.isArray(parsed.articles)
        ? parsed.articles
        : INITIAL_ARTICLES,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return getInitialDb();
  }
}

export function writeServerDb(data: ServerDatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ ...data, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
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
