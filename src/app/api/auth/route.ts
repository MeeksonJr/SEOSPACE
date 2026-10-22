import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";

function planDisplayLabel(plan: string): string {
  if (plan === "agency") return "Agency White-Label ($49/mo)";
  if (plan === "pro") return "Pro Growth ($19/mo)";
  return "Starter Audit (Free)";
}

function planSlugFromLabel(label: string): "starter" | "pro" | "agency" {
  const lower = (label || "").toLowerCase();
  if (lower.includes("agency")) return "agency";
  if (lower.includes("pro")) return "pro";
  return "starter";
}

export async function GET() {
  const supabase = getServerSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ users: [], provider: "local" });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return NextResponse.json({ users: [], provider: "supabase" });
    }

    const users = data.map((row: Record<string, unknown>) => {
      const planSlug = planSlugFromLabel(String(row.plan || "agency"));
      return {
        id: String(row.id),
        name: String(row.full_name || "Growth Team"),
        email: String(row.email || ""),
        plan: planSlug,
        creditsUsed: Number(row.audits_used_this_month || 4),
        creditsLimit: Number(
          row.monthly_audit_quota ||
            (planSlug === "agency" ? 999 : planSlug === "pro" ? 100 : 3)
        ),
        joined: row.created_at
          ? new Date(String(row.created_at)).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Oct 2026",
      };
    });

    return NextResponse.json({ users, provider: "supabase-postgres" });
  } catch {
    return NextResponse.json({ users: [], provider: "local" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action || "sync";
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "");
    const name =
      String(body?.name || "").trim() ||
      email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ") ||
      "Growth User";
    const planSlug: "starter" | "pro" | "agency" =
      body?.plan === "starter" || body?.plan === "pro" || body?.plan === "agency"
        ? body.plan
        : "agency";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const supabase = getServerSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        ok: true,
        provider: "local-fallback",
        user: {
          id: "usr-" + Math.random().toString(36).slice(2, 8),
          name,
          email,
          plan: planSlug,
          creditsUsed: 4,
          creditsLimit:
            planSlug === "agency" ? 999 : planSlug === "pro" ? 100 : 3,
          joined: "Oct 2026",
        },
      });
    }

    // 1. Check if profile already exists in public.profiles
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    let authUserId: string | undefined = existingProfile?.id;

    // 2. If signing up or user doesn't exist in auth.users yet, provision via Supabase Admin Auth API (with email_confirm: true so instant login works!)
    if ((action === "signup" || action === "login") && password.length >= 6) {
      const { data: createdAuth, error: createErr } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: name,
            plan: planSlug,
          },
        });

      if (createdAuth?.user?.id) {
        authUserId = createdAuth.user.id;
      } else if (createErr && action === "login") {
        // User already exists in Supabase Auth — verify or continue with existing profile
      }
    }

    const quota =
      planSlug === "agency" ? 999 : planSlug === "pro" ? 100 : 3;

    const profilePayload: Record<string, unknown> = {
      email,
      full_name: existingProfile?.full_name || name,
      company_name: existingProfile?.company_name || `${name} Workspace`,
      role: planSlug === "agency" ? "agency" : "user",
      plan: existingProfile?.plan || planDisplayLabel(planSlug),
      monthly_audit_quota: existingProfile?.monthly_audit_quota || quota,
      audits_used_this_month: existingProfile?.audits_used_this_month ?? 4,
      updated_at: new Date().toISOString(),
    };
    if (authUserId) {
      profilePayload.id = authUserId;
    }

    const { data: upsertedProfile } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "email" })
      .select("*")
      .maybeSingle();

    const finalPlan = upsertedProfile?.plan
      ? planSlugFromLabel(String(upsertedProfile.plan))
      : planSlug;

    return NextResponse.json({
      ok: true,
      provider: "supabase-auth-postgres",
      user: {
        id: String(upsertedProfile?.id || authUserId || "usr-supabase"),
        name: String(upsertedProfile?.full_name || name),
        email,
        plan: finalPlan,
        creditsUsed: Number(upsertedProfile?.audits_used_this_month ?? 4),
        creditsLimit: Number(upsertedProfile?.monthly_audit_quota ?? quota),
        joined: "Oct 2026",
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
