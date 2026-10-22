import { NextResponse } from "next/server";
import { generateAIReplyOptions } from "@/lib/ai/gemini-responder";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { ReviewItem } from "@/types/trustpulse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, reviewData, workspaceId } = body;

    let review: ReviewItem | undefined;
    if (reviewId) {
      const allReviews = TrustPulseStore.getReviews();
      review = allReviews.find((r) => r.id === reviewId);
    } else if (reviewData) {
      review = reviewData;
    }

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    const wsId = workspaceId || review.workspaceId;
    const ws = TrustPulseStore.getWorkspaceById(wsId) || {
      name: "Our Business",
      category: "Customer Service",
    };

    const options = await generateAIReplyOptions(
      review,
      ws.name,
      ws.category
    );

    return NextResponse.json({ success: true, options });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "AI reply generation failed";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
