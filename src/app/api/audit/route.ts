import { NextRequest, NextResponse } from "next/server";
import { scanLiveUrl } from "@/lib/scanner/url-scanner";
import { enrichReportWithGemini } from "@/lib/ai/gemini-analyzer";
import {
  findAuditInServerDbAsync,
  saveAuditToServerDb,
  upsertAuditToSupabase,
} from "@/lib/db/server-db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("id") || searchParams.get("url") || "";
  const found = await findAuditInServerDbAsync(query);
  if (found) {
    return NextResponse.json({
      report: found,
      cached: true,
      mode: "supabase-saved-snapshot",
    });
  }
  return NextResponse.json(
    { error: "No saved audit found for this URL or ID." },
    { status: 404 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body?.url || "").trim();
    const forceRefresh = Boolean(body?.forceRefresh);
    const existingId = (body?.existingId || "").trim();

    if (!rawUrl && !existingId) {
      return NextResponse.json(
        { error: "Please provide a valid website URL to audit." },
        { status: 400 }
      );
    }

    // 1. Unless explicitly asked to Fetch Latest (forceRefresh: true), return saved audit from Supabase / Server DB!
    const existingSaved = await findAuditInServerDbAsync(rawUrl || existingId);
    if (!forceRefresh && existingSaved) {
      return NextResponse.json({
        report: existingSaved,
        cached: true,
        mode: "supabase-saved-snapshot",
      });
    }

    // 2. Otherwise execute a fresh live scan (RapidAPI url-to-metadata + Cloudflare DoH DNS + DOM + Seospace Neural Engine v4.2)
    const targetUrl = rawUrl || existingSaved?.url || "https://stripe.com";
    const { report: baseReport, bodyExcerpt } = await scanLiveUrl(targetUrl);
    const enrichedReport = await enrichReportWithGemini(
      baseReport,
      bodyExcerpt
    );

    const reportToSave = existingSaved
      ? { ...enrichedReport, id: existingId || existingSaved.id }
      : existingId
      ? { ...enrichedReport, id: existingId }
      : enrichedReport;

    const savedReport = saveAuditToServerDb(reportToSave);
    await upsertAuditToSupabase(savedReport);

    return NextResponse.json({
      report: savedReport,
      cached: false,
      mode: "seospace-neural-live-scan",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to complete URL scan.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
