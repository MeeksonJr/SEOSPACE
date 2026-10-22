import { NextResponse } from "next/server";
import {
  sendEmailWithGoogleSmtp,
  getGoogleSmtpConfig,
} from "@/lib/email/google-smtp";
import {
  renderShieldAlertEmailHtml,
  renderCustomerApologyEmailHtml,
  renderWeeklyDigestEmailHtml,
} from "@/lib/email/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, templateType, customData } = body;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid recipient email address." },
        { status: 400 }
      );
    }

    const type = templateType || "shield_alert";
    let subject = "";
    let html = "";

    const businessName = customData?.businessName || "Apex Cosmetic Dentistry & Orthodontics";
    const brandColor = customData?.brandColor || "#059669";

    if (type === "shield_alert") {
      subject = `🚨 [Shield Alert] 2-Star Review Intercepted Privately: ${businessName}`;
      html = renderShieldAlertEmailHtml({
        businessName,
        brandColor,
        rating: customData?.rating || 2,
        customerName: customData?.customerName || "Marcus Sterling (Test)",
        customerEmail: to,
        customerPhone: customData?.customerPhone || "(512) 555-0199",
        grievanceText:
          customData?.grievanceText ||
          "Had to wait 25 minutes past my scheduled appointment time before being called into the operatory. Front desk seemed rushed.",
        dashboardShieldUrl: "https://seospace-kappa.vercel.app/dashboard/shield",
      });
    } else if (type === "customer_apology") {
      subject = `A Personal Note from the Director of ${businessName}`;
      html = renderCustomerApologyEmailHtml({
        businessName,
        brandColor,
        customerName: customData?.customerName || "Valued Client",
      });
    } else if (type === "weekly_digest") {
      subject = `Weekly Reputation Intelligence Report: ${businessName}`;
      html = renderWeeklyDigestEmailHtml({
        businessName,
        totalReviews: customData?.totalReviews || 184,
        averageRating: customData?.averageRating || 4.94,
        shieldedCount: customData?.shieldedCount || 19,
        positiveRedirects: customData?.positiveRedirects || 165,
        revenueProtectedFormatted: customData?.revenueProtectedFormatted || "$28,400",
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Unknown templateType: ${type}. Available: shield_alert, customer_apology, weekly_digest` },
        { status: 400 }
      );
    }

    const result = await sendEmailWithGoogleSmtp({
      to,
      subject,
      html,
      fromName: `TrustPulse AI — ${businessName}`,
    });

    const config = getGoogleSmtpConfig();

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      simulated: result.simulated,
      configUsed: result.configUsed,
      templateType: type,
      recipient: to,
      subject,
      hasLiveCredentials: Boolean(config),
      note: config
        ? `Delivered live to ${to} via Google SMTP (${config.user}).`
        : `Email dispatched in high-fidelity simulation mode. To enable live delivery directly to inboxes, set GOOGLE_SMTP_USER and GOOGLE_SMTP_APP_PASSWORD in environment variables.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
