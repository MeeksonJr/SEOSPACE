import { NextRequest, NextResponse } from "next/server";
import {
  findAuditInServerDbAsync,
  readServerDb,
  readServerDbWithSupabase,
  saveArticleToServerDb,
  saveAuditToServerDb,
  saveComparisonToServerDb,
  saveLeadToServerDb,
  saveWhiteLabelToServerDb,
  upsertArticleToSupabase,
  upsertAuditToSupabase,
  upsertComparisonToSupabase,
  upsertLeadToSupabase,
  upsertWhiteLabelToSupabase,
  writeServerDb,
} from "@/lib/db/server-db";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const db = await readServerDbWithSupabase();
  const auditId = req.nextUrl.searchParams.get("auditId");
  const articleId = req.nextUrl.searchParams.get("articleId");

  if (auditId) {
    const found =
      (await findAuditInServerDbAsync(auditId)) ||
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
    const supabase = getServerSupabaseAdmin();

    if (body.type === "save_audit" && body.audit) {
      const saved = saveAuditToServerDb(body.audit);
      await upsertAuditToSupabase(saved);
      return NextResponse.json({ ok: true, audit: saved, db: readServerDb() });
    }

    if (body.type === "save_article" && body.article) {
      const saved = saveArticleToServerDb(body.article);
      await upsertArticleToSupabase(saved);
      return NextResponse.json({
        ok: true,
        article: saved,
        db: readServerDb(),
      });
    }

    if (body.type === "save_comparison" && body.comparison) {
      const saved = saveComparisonToServerDb(body.comparison);
      await upsertComparisonToSupabase(saved);
      return NextResponse.json({
        ok: true,
        comparison: saved,
        db: readServerDb(),
      });
    }

    if (body.type === "save_lead" && body.lead) {
      const saved = saveLeadToServerDb(body.lead);
      await upsertLeadToSupabase(saved);
      return NextResponse.json({ ok: true, lead: saved, db: readServerDb() });
    }

    if (body.type === "save_whitelabel" && body.whiteLabel) {
      const saved = saveWhiteLabelToServerDb(body.whiteLabel);
      await upsertWhiteLabelToSupabase(saved);
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
      if (supabase) {
        await supabase.from("audits").delete().eq("id", body.id);
      }
      return NextResponse.json({ ok: true, db });
    }

    if (body.type === "delete_article" && body.id) {
      const db = readServerDb();
      db.articles = db.articles.filter((a) => a.id !== body.id);
      writeServerDb(db);
      if (supabase) {
        await supabase.from("articles").delete().eq("id", body.id);
      }
      return NextResponse.json({ ok: true, db });
    }

    return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
