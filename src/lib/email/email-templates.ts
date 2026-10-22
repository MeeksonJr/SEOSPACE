/**
 * TrustPulse AI — Premium Responsive HTML Email Templates
 * Fully compatible with Gmail, Apple Mail, Outlook, and mobile mail clients.
 */

export interface ShieldAlertEmailProps {
  businessName: string;
  brandColor?: string;
  rating: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  grievanceText: string;
  dashboardShieldUrl?: string;
}

export function renderShieldAlertEmailHtml(props: ShieldAlertEmailProps): string {
  const brandColor = props.brandColor || "#10b981";
  const stars = "★".repeat(props.rating) + "☆".repeat(5 - props.rating);
  const dashboardUrl =
    props.dashboardShieldUrl || "https://seospace-kappa.vercel.app/dashboard/shield";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Negative Review Intercepted: ${props.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f5f7; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Top Accent Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; border-bottom: 3px solid #ef4444;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.2); color: #f87171; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.4);">
                      🚨 Negative Review Shield Alert
                    </span>
                    <h1 style="margin: 10px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                      Public Google Maps Rating Protected
                    </h1>
                  </td>
                  <td align="right" valign="top">
                    <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">
                      ${props.businessName}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Core Alert Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                A customer just rated your business <strong style="color: #ef4444;">${props.rating} out of 5 stars</strong> via your counter QR stand. Because the rating was below your 4-star threshold, <strong>the Negative Review Shield intercepted the feedback privately</strong> before it could be posted on Google.
              </p>

              <!-- Customer Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; margin: 20px 0; padding: 18px;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Customer Name:</span><br>
                    <strong style="font-size: 15px; color: #0f172a;">${props.customerName}</strong>
                  </td>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Star Rating:</span><br>
                    <strong style="font-size: 15px; color: #f59e0b;">${stars} (${props.rating}/5)</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Email Address:</span><br>
                    <a href="mailto:${props.customerEmail}" style="font-size: 13px; color: #0284c7; text-decoration: none; font-weight: 600;">${props.customerEmail}</a>
                  </td>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Phone Number:</span><br>
                    <span style="font-size: 13px; color: #0f172a; font-weight: 600;">${props.customerPhone || "Not provided"}</span>
                  </td>
                </tr>
              </table>

              <!-- Customer Grievance Statement -->
              <div style="margin: 24px 0;">
                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                  Customer's Private Grievance:
                </span>
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #7f1d1d; font-style: italic;">
                  &ldquo;${props.grievanceText}&rdquo;
                </div>
              </div>

              <!-- Recommendation Box -->
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; margin: 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="28" valign="top">
                      <span style="font-size: 18px;">💡</span>
                    </td>
                    <td>
                      <span style="font-size: 12px; color: #065f46; line-height: 1.5; display: block;">
                        <strong>Resolution Best Practice:</strong> Call or email ${props.customerName} within 30 minutes. An immediate, empathetic acknowledgment turns 82% of unhappy clients into lifelong brand advocates.
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px;">
                <tr>
                  <td align="center">
                    ${props.customerPhone ? `
                      <a href="tel:${props.customerPhone}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 13px 24px; border-radius: 12px; font-size: 13px; font-weight: 700; margin-right: 10px;">
                        📞 Call ${props.customerName}
                      </a>
                    ` : ""}
                    <a href="${dashboardUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 13px 24px; border-radius: 12px; font-size: 13px; font-weight: 700;">
                      Open Shield Inbox in Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <span style="font-size: 11px; color: #94a3b8;">
                Protected automatically by <strong>TrustPulse AI</strong> • Zero-Overhead Social Proof SaaS
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface CustomerApologyEmailProps {
  customerName: string;
  businessName: string;
  brandColor?: string;
}

export function renderCustomerApologyEmailHtml(props: CustomerApologyEmailProps): string {
  const brandColor = props.brandColor || "#10b981";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Personal Note from ${props.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: ${brandColor}; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                ${props.businessName}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
                Dear ${props.customerName},
              </h2>

              <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 16px 0;">
                Thank you for taking the time to share your honest feedback regarding your visit with us today. We hold ourselves to the highest clinical and service standards, and we are truly sorry that your experience did not meet expectations.
              </p>

              <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 16px 0;">
                Your private comments have been dispatched directly to our practice management team. We take every note to heart, and our leadership director is personally reviewing your file to ensure this is made right.
              </p>

              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6;">
                  <strong>Our Direct Line:</strong> If you would like to speak directly with our director before we reach out, please feel free to reply directly to this email or contact our desk.
                </p>
              </div>

              <p style="font-size: 14px; line-height: 1.7; color: #475569; margin: 0 0 24px 0;">
                Thank you for giving us the opportunity to improve and serve you better.
              </p>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <strong style="color: #0f172a; font-size: 14px; display: block;">Warm regards,</strong>
                <span style="color: #64748b; font-size: 13px;">The Leadership Team at ${props.businessName}</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export interface WeeklyDigestEmailProps {
  businessName: string;
  totalReviews: number;
  averageRating: number;
  shieldedCount: number;
  positiveRedirects: number;
  revenueProtectedFormatted: string;
}

export function renderWeeklyDigestEmailHtml(props: WeeklyDigestEmailProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Reputation Digest: ${props.businessName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #09090b; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #121316; border-radius: 24px; overflow: hidden; border: 1px solid #27272a; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #181a20; padding: 28px 32px; border-bottom: 1px solid #27272a;">
              <span style="color: #10b981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace;">
                Weekly Reputation Intelligence
              </span>
              <h1 style="margin: 6px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                ${props.businessName}
              </h1>
            </td>
          </tr>

          <!-- Metrics Grid -->
          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Metric 1 -->
                  <td width="48%" style="background-color: #1a1d24; border: 1px solid #27272a; border-radius: 16px; padding: 20px; text-align: center;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Average Rating</span>
                    <div style="font-size: 32px; font-weight: 900; color: #fbbf24; margin-top: 4px;">
                      ${props.averageRating} ★
                    </div>
                    <span style="font-size: 11px; color: #34d399; font-weight: 600;">Top 3% Locally</span>
                  </td>

                  <td width="4%"></td>

                  <!-- Metric 2 -->
                  <td width="48%" style="background-color: #1a1d24; border: 1px solid #27272a; border-radius: 16px; padding: 20px; text-align: center;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Reviews Shielded</span>
                    <div style="font-size: 32px; font-weight: 900; color: #f87171; margin-top: 4px;">
                      ${props.shieldedCount}
                    </div>
                    <span style="font-size: 11px; color: #94a3b8;">Caught Privately</span>
                  </td>
                </tr>

                <tr><td height="16" colspan="3"></td></tr>

                <tr>
                  <!-- Metric 3 -->
                  <td width="48%" style="background-color: #1a1d24; border: 1px solid #27272a; border-radius: 16px; padding: 20px; text-align: center;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">5★ Google Leads</span>
                    <div style="font-size: 32px; font-weight: 900; color: #10b981; margin-top: 4px;">
                      ${props.positiveRedirects}
                    </div>
                    <span style="font-size: 11px; color: #34d399;">Direct Boost</span>
                  </td>

                  <td width="4%"></td>

                  <!-- Metric 4 -->
                  <td width="48%" style="background-color: #1a1d24; border: 1px solid #27272a; border-radius: 16px; padding: 20px; text-align: center;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">Revenue Protected</span>
                    <div style="font-size: 26px; font-weight: 900; color: #38bdf8; margin-top: 6px;">
                      ${props.revenueProtectedFormatted}
                    </div>
                    <span style="font-size: 11px; color: #94a3b8;">Retained Bookings</span>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://seospace-kappa.vercel.app/dashboard" style="display: inline-block; background-color: #10b981; color: #09090b; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-size: 13px; font-weight: 800;">
                      View Live Command Center →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
