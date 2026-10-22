import { NextRequest, NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const id = req.nextUrl.searchParams.get("id");

    if (slug) {
      const ws = TrustPulseStore.getWorkspaceBySlug(slug);
      if (!ws) {
        return NextResponse.json(
          { success: false, error: "Workspace not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    if (id) {
      const ws = TrustPulseStore.getWorkspaceById(id);
      if (!ws) {
        return NextResponse.json(
          { success: false, error: "Workspace not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, workspace: ws });
    }

    const workspaces = TrustPulseStore.getWorkspaces();
    return NextResponse.json({ success: true, workspaces });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to retrieve workspaces";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      category,
      brandColor,
      googleReviewUrl,
      trustpilotUrl,
      starThreshold,
      customHeadline,
      customSubheadline,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");

    const newWorkspace: Workspace = {
      id: body.id || `ws-${cleanSlug}-${Date.now().toString(36)}`,
      name: name.trim(),
      slug: cleanSlug,
      category: category || "Local Business",
      brandColor: brandColor || "#10b981",
      googleReviewUrl: googleReviewUrl || "https://maps.google.com",
      trustpilotUrl: trustpilotUrl || undefined,
      starThreshold: Number(starThreshold) || 4,
      customHeadline: customHeadline || "How was your experience today?",
      customSubheadline: customSubheadline || "Please take 10 seconds to share your feedback.",
      createdAt: new Date().toISOString(),
      stats: {
        averageRating: 5.0,
        totalReviews: 3,
        shieldedReviews: 0,
        positiveRedirects: 3,
      },
    };

    const saved = TrustPulseStore.saveWorkspace(newWorkspace);

    return NextResponse.json({
      success: true,
      message: "Workspace created successfully",
      workspace: saved,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create workspace";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
