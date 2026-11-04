import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { webhookUrl } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== "string" || !/^https?:\/\//i.test(webhookUrl)) {
      return NextResponse.json(
        { error: "Invalid webhook URL. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    try {
      const parsed = new URL(webhookUrl);
      const host = parsed.hostname.toLowerCase();
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        host === "::1" ||
        host.endsWith(".local") ||
        host.endsWith(".internal") ||
        /^10\./.test(host) ||
        /^192\.168\./.test(host) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
        /^169\.254\./.test(host)
      ) {
        return NextResponse.json(
          { error: "Webhook URL cannot point to internal or private addresses." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Malformed webhook URL." },
        { status: 400 }
      );
    }

    const isDiscord = /discord(?:app)?\.com\/api\/webhooks/i.test(webhookUrl);
    const isSlack = /hooks\.slack\.com/i.test(webhookUrl);

    let payload: Record<string, unknown>;

    if (isDiscord) {
      payload = {
        username: "Seospace Lead Engine",
        avatar_url: "https://seospace.pro/favicon.ico",
        embeds: [
          {
            title: "🎯 New Inbound Agency Lead Captured!",
            description: "A high-intent prospect just audited their website via your embedded Seospace lead widget.",
            color: 0xff4d14, // Vermilion accent
            fields: [
              { name: "Prospect Name", value: "Marcus Vance", inline: true },
              { name: "Work Email", value: "marcus@luminahealth.co", inline: true },
              { name: "Audited Website", value: "https://luminahealth.co", inline: false },
              { name: "Audit Score", value: "61/100 (Grade D)", inline: true },
              { name: "Est. Retainer Pipeline", value: "$1,500/mo", inline: true },
            ],
            footer: {
              text: "Seospace AI Lead Dispatcher • Discord Webhook Active",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else if (isSlack) {
      payload = {
        text: "🎯 *New Inbound Agency Lead Captured!*\n*Prospect:* Marcus Vance (marcus@luminahealth.co)\n*Website:* https://luminahealth.co\n*Score:* 61/100\n*Estimated Retainer:* $1,500/mo",
      };
    } else {
      // Generic Webhook payload (Zapier, Make, HubSpot, webhook.site)
      payload = {
        event: "lead.created",
        timestamp: new Date().toISOString(),
        lead: {
          id: `lead-test-${Date.now()}`,
          name: "Marcus Vance",
          email: "marcus@luminahealth.co",
          websiteUrl: "https://luminahealth.co",
          auditScore: 61,
          letterGrade: "D",
          status: "New",
          estimatedPipelineValue: 1500,
        },
        source: "seospace-lead-widget",
      };
    }

    const start = Date.now();
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const latencyMs = Date.now() - start;

    if (!res.ok && res.status !== 204) {
      return NextResponse.json(
        {
          error: `Webhook destination returned HTTP ${res.status}: ${res.statusText}`,
          status: res.status,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      latencyMs,
      provider: isDiscord ? "Discord" : isSlack ? "Slack" : "Custom Webhook / Zapier",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
