import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || undefined;
  const reviews = TrustPulseStore.getReviews(workspaceId);
  return NextResponse.json({ success: true, reviews });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.workspaceId || !body.authorName || !body.rating || !body.reviewText) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = TrustPulseStore.addReview({
      workspaceId: body.workspaceId,
      authorName: body.authorName,
      authorRole: body.authorRole || "Customer",
      authorLocation: body.authorLocation || "",
      rating: Number(body.rating),
      reviewText: body.reviewText,
      platform: body.platform || "direct",
      sentiment: body.rating >= 4 ? "positive" : body.rating === 3 ? "neutral" : "negative",
      isVerified: true,
      isFeatured: body.isFeatured !== undefined ? body.isFeatured : true,
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
