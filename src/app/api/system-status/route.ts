import { NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/ai/gemini-client";

export async function GET() {
  const { data, modelUsed, latencyMs, error } = await generateGeminiJson<{
    status: string;
  }>(
    `Return ONLY valid JSON: {"status": "online"}`,
    0.1
  );

  return NextResponse.json({
    geminiOnline: Boolean(data?.status),
    modelUsed,
    geminiLatencyMs: latencyMs,
    geminiError: error || null,
    stripeConfigured: Boolean(
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK &&
        process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_LINK
    ),
    stripeAccountId: "acct_1Qxf8DFZKCl4K7QE",
    timestamp: new Date().toISOString(),
  });
}
