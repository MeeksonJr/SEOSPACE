export interface PricingPlan {
  id: "starter" | "pro" | "agency";
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  annualTotal: number;
  monthlyPriceId: string;
  annualPriceId: string;
  monthlyPaymentLink: string;
  annualPaymentLink: string;
  auditsPerMonth: string;
  highlighted?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Best for solo founders testing their own landing pages.",
    monthlyPrice: 0,
    annualPricePerMonth: 0,
    annualTotal: 0,
    monthlyPriceId: "",
    annualPriceId: "",
    monthlyPaymentLink: "/signup?plan=starter",
    annualPaymentLink: "/signup?plan=starter",
    auditsPerMonth: "3 Audits / month",
    features: [
      "3 full 5-pillar URL audits per month",
      "Technical SEO & On-Page DOM analysis",
      "WCAG 2.2 accessibility & security check",
      "Shareable public report URL",
      "Standard Seospace community support",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    badge: "Most Popular",
    tagline: "Best for growing businesses, marketers & SEO consultants.",
    monthlyPrice: 29,
    annualPricePerMonth: 23,
    annualTotal: 276,
    monthlyPriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
      "price_1UT5vaFZKCl4K7QEY7LlKX4v",
    annualPriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID ||
      "price_1UT5vgFZKCl4K7QEF7p1hCNn",
    monthlyPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK ||
      "https://buy.stripe.com/4gM28reqk2tFaj7ctH9k400",
    annualPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_LINK ||
      "https://buy.stripe.com/7sYdR96XS2tF2QF2T79k401",
    auditsPerMonth: "100 Audits / month",
    highlighted: true,
    features: [
      "100 deep AI website audits per month",
      "AI Copywriting & Hero CRO Rewrite Engine",
      "Real-time AI Content & SEO Score Editor",
      "AI Search (GEO) & LLMs.txt readiness scan",
      "1-Click Print & PDF Report Export",
      "100 keyword opportunity reports per month",
      "Priority email & chat support",
    ],
  },
  {
    id: "agency",
    name: "Agency White-Label",
    badge: "Unlimited + CRM",
    tagline: "For agencies closing high-ticket retainers with branded audits.",
    monthlyPrice: 79,
    annualPricePerMonth: 63,
    annualTotal: 756,
    monthlyPriceId:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_PRICE_ID ||
      "price_1UT5vnFZKCl4K7QE3bSWBV22",
    annualPriceId:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_PRICE_ID ||
      "price_1UT5vpFZKCl4K7QEBvJ79Uju",
    monthlyPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_LINK ||
      "https://buy.stripe.com/3cI6oH3LG6JVdvj2T79k402",
    annualPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_LINK ||
      "https://buy.stripe.com/aFafZh81Wb0bezn1P39k403",
    auditsPerMonth: "Unlimited Audits",
    features: [
      "Unlimited AI SEO, CRO & Compliance audits",
      "100% White-Label PDF Reports (Your Logo & Brand)",
      "Custom 'Book Strategy Call' CTA on every report",
      "Embeddable Lead-Capture Audit Widget for your site",
      "Built-in Client Lead CRM & CSV export",
      "Multi-domain competitor watchlist & alerts",
      "Dedicated agency onboarding & priority API queue",
    ],
  },
];
