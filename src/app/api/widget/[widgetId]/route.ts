import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";

export async function GET(
  request: Request,
  props: { params: Promise<{ widgetId: string }> }
) {
  const params = await props.params;
  const widgetId = params.widgetId;

  const widget = TrustPulseStore.getWidgetConfigById(widgetId);
  if (!widget) {
    return NextResponse.json(
      { success: false, error: "Widget not found" },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  }

  const allReviews = TrustPulseStore.getReviews(widget.workspaceId);
  const eligibleReviews = allReviews
    .filter((r) => r.rating >= widget.minRating)
    .slice(0, widget.maxReviews);

  const workspace = TrustPulseStore.getWorkspaceById(widget.workspaceId);

  return NextResponse.json(
    {
      success: true,
      widget,
      workspace: workspace
        ? {
            name: workspace.name,
            brandColor: workspace.brandColor,
            stats: workspace.stats,
          }
        : null,
      reviews: eligibleReviews,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
