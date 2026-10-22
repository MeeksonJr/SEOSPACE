import { NextResponse } from "next/server";
import { lookupGoogleBusiness } from "@/lib/places/google-maps";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a Google Maps URL or business name to look up.",
        },
        { status: 400 }
      );
    }

    const business = await lookupGoogleBusiness(input);

    return NextResponse.json({
      success: true,
      business,
      isLiveGoogleApi: business.source === "google_places_api",
      message:
        business.source === "google_places_api"
          ? "Live Google Places API data retrieved."
          : "Business extracted via Google Maps URL intelligence engine.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
