import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  const errorDescription =
    requestUrl.searchParams.get("error_description") ||
    requestUrl.searchParams.get("error");

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorDescription)}`,
        requestUrl.origin
      )
    );
  }

  if (code) {
    const supabase = getServerSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data?.user) {
          const user = data.user;
          // Ensure profile exists in public.profiles
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Seospace Member";

          await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email,
              full_name: fullName,
              role: "user",
              plan: "starter",
              credits_used: 0,
              credits_limit: 10,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          const response = NextResponse.redirect(new URL(next, requestUrl.origin));

          if (data.session) {
            response.cookies.set("sb-access-token", data.session.access_token, {
              path: "/",
              httpOnly: false,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              maxAge: data.session.expires_in || 3600,
            });
            response.cookies.set("sb-refresh-token", data.session.refresh_token, {
              path: "/",
              httpOnly: false,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 30, // 30 days
            });
          }

          return response;
        }
      } catch (err) {
        console.error("Supabase auth code exchange error:", err);
      }
    }
  }

  // Fallback: Redirect to dashboard with code/tokens for browser client detection
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
