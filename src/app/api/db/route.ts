import { NextRequest, NextResponse } from "next/server";
import {
  findAuditInServerDb,
  readServerDb,
  saveArticleToServerDb,
  saveAuditToServerDb,
  saveComparisonToServerDb,
  saveLeadToServerDb,
  saveWhiteLabelToServerDb,
  writeServerDb,
} from "@/lib/db/server-db";

export async function GET(req: NextRequest) {
  const db = readServerDb();
  const auditId = req.nextUrl.searchParams.get("auditId");
  const articleId = req.nextUrl.searchParams.get("articleId");

  if (auditId) {
    const found =
      findAuditInServerDb(auditId) ||
      db.audits.find(
        (a) =>
          a.id === auditId ||
          a.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase() === auditId
      );
    return NextResponse.json({ audit: found || null });
  }

  if (articleId) {
    const found = db.articles.find((a) => a.id === articleId);
    return NextResponse.json({ article: found || null });
  }

  return NextResponse.json(db);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.type === "save_audit" && body.audit) {
      const saved = saveAuditToServerDb(body.audit);
      return NextResponse.json({ ok: true, audit: saved, db: readServerDb() });
    }

    if (body.type === "save_article" && body.article) {
      const saved = saveArticleToServerDb(body.article);
      return NextResponse.json({
        ok: true,
        article: saved,
        db: readServerDb(),
      });
    }

    if (body.type === "save_comparison" && body.comparison) {
      const saved = saveComparisonToServerDb(body.comparison);
      return NextResponse.json({
        ok: true,
        comparison: saved,
        db: readServerDb(),
      });
    }

    if (body.type === "save_lead" && body.lead) {
      const saved = saveLeadToServerDb(body.lead);
      return NextResponse.json({ ok: true, lead: saved, db: readServerDb() });
    }

    if (body.type === "save_whitelabel" && body.whiteLabel) {
      const saved = saveWhiteLabelToServerDb(body.whiteLabel);
      return NextResponse.json({
        ok: true,
        whiteLabel: saved,
        db: readServerDb(),
      });
    }

    if (body.type === "delete_audit" && body.id) {
      const db = readServerDb();
      db.audits = db.audits.filter((a) => a.id !== body.id);
      writeServerDb(db);
      return NextResponse.json({ ok: true, db });
    }

    if (body.type === "delete_article" && body.id) {
      const db = readServerDb();
      db.articles = db.articles.filter((a) => a.id !== body.id);
      writeServerDb(db);
      return NextResponse.json({ ok: true, db });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
