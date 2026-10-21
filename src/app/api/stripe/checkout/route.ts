import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING_PLANS } from "@/lib/stripe/plans";

export async function POST(req: NextRequest) {
  try {
    const { planId, billingCycle = "monthly", email } = await req.json();

    const selectedPlan =
      PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];

    const priceId =
      billingCycle === "annual"
        ? selectedPlan.annualPriceId
        : selectedPlan.monthlyPriceId;

    const directPaymentLink =
      billingCycle === "annual"
        ? selectedPlan.annualPaymentLink
        : selectedPlan.monthlyPaymentLink;

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    // If STRIPE_SECRET_KEY is configured, create a custom Checkout Session
    if (stripeSecret && stripeSecret.startsWith("sk_") && priceId) {
      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: email || undefined,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: `${appUrl}/dashboard?upgraded=${selectedPlan.id}`,
        cancel_url: `${appUrl}/#pricing`,
      });

      if (session.url) {
        return NextResponse.json({ url: session.url, mode: "stripe-session" });
      }
    }

    // Otherwise use our live Hosted Stripe Payment Link on acct_1Qxf8DFZKCl4K7QE
    const urlWithParams = email
      ? `${directPaymentLink}?prefilled_email=${encodeURIComponent(email)}`
      : directPaymentLink;

    return NextResponse.json({
      url: urlWithParams,
      mode: "stripe-payment-link",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to initialize checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
