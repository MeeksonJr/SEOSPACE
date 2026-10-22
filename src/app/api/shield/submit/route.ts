import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      campaignId,
      rating,
      customerName,
      customerEmail,
      customerPhone,
      grievanceText,
    } = body;

    if (!workspaceId || !rating || !customerName || !customerEmail || !grievanceText) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields" },
        { status: 400 }
      );
    }

    const feedback = TrustPulseStore.addPrivateFeedback({
      workspaceId,
      campaignId,
      rating: Number(rating),
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      grievanceText,
      status: "new",
    });

    return NextResponse.json({
      success: true,
      message: "Grievance received privately. Our management team has been alerted.",
      feedback,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to record feedback";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
