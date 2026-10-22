import nodemailer from "nodemailer";

export interface SmtpConfig {
  user: string;
  pass: string;
  fromName?: string;
}

export function getGoogleSmtpConfig(): SmtpConfig | null {
  const user =
    process.env.GOOGLE_SMTP_USER ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    "";
  const pass =
    process.env.GOOGLE_SMTP_APP_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_PASS ||
    "";

  if (!user || !pass) return null;

  return {
    user: user.trim(),
    pass: pass.trim().replace(/\s+/g, ""), // Google App Passwords are 16 chars, sometimes copied with spaces
    fromName: process.env.SMTP_FROM_NAME || "TrustPulse AI Reputation Shield",
  };
}

export function createGoogleSmtpTransporter() {
  const config = getGoogleSmtpConfig();
  if (!config) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
  configUsed?: string;
}

export async function sendEmailWithGoogleSmtp(
  payload: SendEmailPayload
): Promise<SendEmailResult> {
  const config = getGoogleSmtpConfig();
  const transporter = createGoogleSmtpTransporter();

  // 1. If real Google SMTP credentials are configured, send live email
  if (config && transporter) {
    try {
      const fromAddress = `"${payload.fromName || config.fromName}" <${config.user}>`;
      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        subject: payload.subject,
        text: payload.text || payload.subject,
        html: payload.html,
      });

      console.log(`[Google SMTP] Email dispatched to ${payload.to}. MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        simulated: false,
        configUsed: `Google SMTP (${config.user})`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[Google SMTP] Delivery failed, falling back to simulation mode:", errorMsg);
      return {
        success: false,
        error: errorMsg,
        simulated: false,
      };
    }
  }

  // 2. High-fidelity simulation mode if credentials not yet set in environment
  console.log(`[TrustPulse Email Simulator] Google SMTP credentials not set in .env. To activate real delivery, set GOOGLE_SMTP_USER and GOOGLE_SMTP_APP_PASSWORD.`);
  console.log(`[TrustPulse Email Simulator] To: ${payload.to} | Subject: "${payload.subject}"`);

  return {
    success: true,
    messageId: `sim-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    simulated: true,
    configUsed: "Simulation Mode (Set GOOGLE_SMTP_USER and GOOGLE_SMTP_APP_PASSWORD for live inbox delivery)",
  };
}
