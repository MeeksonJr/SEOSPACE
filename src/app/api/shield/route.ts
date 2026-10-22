import { NextRequest, NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { FeedbackStatus } from "@/types/trustpulse";

export async function GET(req: NextRequest) {
  try {
    const workspaceId = req.nextUrl.searchParams.get("workspaceId") || undefined;
    const feedback = TrustPulseStore.getPrivateFeedback(workspaceId);
    return NextResponse.json({ success: true, feedback });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve feedback";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, resolutionNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Feedback ID and status are required" },
        { status: 400 }
      );
    }

    const updated = TrustPulseStore.updatePrivateFeedback(
      id,
      status as FeedbackStatus,
      resolutionNotes
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      feedback: updated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update feedback";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
