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

  // Privacy & Data Protection: Sanitize captured prospect emails and webhook tokens
  const sanitizedLeads = (db.leads || []).map((lead) => ({
    ...lead,
    email: lead.email
      ? lead.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      : "prospect@client.demo",
  }));

  const sanitizedWhiteLabel = db.whiteLabel
    ? {
        ...db.whiteLabel,
        webhookUrl: db.whiteLabel.webhookUrl
          ? db.whiteLabel.webhookUrl.split("/").slice(0, 5).join("/") + "/••••••••"
          : undefined,
      }
    : undefined;

  return NextResponse.json({
    ...db,
    leads: sanitizedLeads,
    whiteLabel: sanitizedWhiteLabel,
  });
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

      // Asynchronously trigger agency webhook if configured
      const currentDb = readServerDb();
      const webhookUrl = currentDb.whiteLabel?.webhookUrl;
      let isAllowedWebhook = false;
      if (webhookUrl && /^https?:\/\//i.test(webhookUrl)) {
        try {
          const parsed = new URL(webhookUrl);
          const host = parsed.hostname.toLowerCase();
          if (
            host !== "localhost" &&
            host !== "127.0.0.1" &&
            host !== "0.0.0.0" &&
            host !== "::1" &&
            !host.endsWith(".local") &&
            !host.endsWith(".internal") &&
            !/^10\./.test(host) &&
            !/^192\.168\./.test(host) &&
            !/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) &&
            !/^169\.254\./.test(host)
          ) {
            isAllowedWebhook = true;
          }
        } catch {
          // ignore malformed
        }
      }
      if (isAllowedWebhook && webhookUrl) {
        const isDiscord = /discord(?:app)?\.com\/api\/webhooks/i.test(webhookUrl);
        const isSlack = /hooks\.slack\.com/i.test(webhookUrl);
        let payload: Record<string, unknown>;
        if (isDiscord) {
          payload = {
            username: "Seospace Lead Engine",
            embeds: [
              {
                title: "🎯 New Inbound Agency Lead Captured!",
                color: 0xff4d14,
                fields: [
                  { name: "Prospect Name", value: saved.name || "Anonymous", inline: true },
                  { name: "Work Email", value: saved.email || "None", inline: true },
                  { name: "Website URL", value: saved.websiteUrl || "None", inline: false },
                  { name: "Score", value: `${saved.auditScore || 0}/100`, inline: true },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          };
        } else if (isSlack) {
          payload = {
            text: `🎯 *New Inbound Agency Lead Captured!*\n*Prospect:* ${saved.name} (${saved.email})\n*Website:* ${saved.websiteUrl}\n*Score:* ${saved.auditScore}/100`,
          };
        } else {
          payload = {
            event: "lead.created",
            timestamp: new Date().toISOString(),
            lead: saved,
          };
        }
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

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
