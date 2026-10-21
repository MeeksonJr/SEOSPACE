import React from "react";
import Link from "next/link";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/">
          <SeospaceLogo size="sm" />
        </Link>
        <h1 className="text-3xl font-bold mt-6">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last Updated: October 2026</p>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            By accessing or using Seospace AI, you agree to be bound by these
            Terms of Service and all applicable laws and regulations.
          </p>
          <h2 className="text-lg font-bold text-slate-950 pt-2">
            1. License & White-Label Agency Usage
          </h2>
          <p>
            Subscribers on the Professional and Agency White-Label plans are
            granted a commercial license to generate, brand, and export PDF
            audit reports for their own properties and client engagements.
          </p>
          <h2 className="text-lg font-bold text-slate-950 pt-2">
            2. Subscriptions & 30-Day Guarantee
          </h2>
          <p>
            Paid plans are billed monthly or annually via Stripe. You may cancel
            your subscription at any time with 1 click. First-time subscribers
            are covered by our 30-day money-back satisfaction guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
