import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result: GooglePlaceResult = body.business;

    if (!result || !result.name || !result.slug) {
      return NextResponse.json(
        { success: false, error: "Invalid business data provided." },
        { status: 400 }
      );
    }

    const { workspace, reviews, widgets } = TrustPulseStore.registerGoogleClient(result);

    return NextResponse.json({
      success: true,
      message: `Client workspace for "${workspace.name}" created with live QR funnel and embed widgets.`,
      workspace,
      reviewCount: reviews.length,
      widgetsGenerated: widgets.map((w) => w.id),
      funnelUrl: `/r/${workspace.slug}`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
