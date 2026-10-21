import { NextRequest, NextResponse } from "next/server";
import { inspectDomainDns } from "@/lib/scanner/url-scanner";

export async function POST(req: NextRequest) {
  try {
    const { domain } = await req.json();
    const cleanDomain = (domain || "stripe.com")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/.*$/, "");

    if (!cleanDomain || !cleanDomain.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid domain (e.g., voice-one.com)" },
        { status: 400 }
      );
    }

    const start = Date.now();
    const dns = await inspectDomainDns(cleanDomain);
    return NextResponse.json({
      domain: cleanDomain,
      dns,
      resolver: "Cloudflare 1.1.1.1 DNS-over-HTTPS",
      latencyMs: Date.now() - start,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "DNS query failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
