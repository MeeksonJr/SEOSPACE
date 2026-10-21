import React from "react";
import Link from "next/link";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/">
          <SeospaceLogo size="sm" />
        </Link>
        <h1 className="text-3xl font-bold mt-6">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last Updated: October 2026</p>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            Seospace AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is
            committed to protecting the personal and business data you share when
            using our AI SEO, CRO, and Website Compliance Audit platform.
          </p>
          <h2 className="text-lg font-bold text-slate-950 pt-2">
            1. Information We Collect
          </h2>
          <p>
            We collect account credentials (name, work email), publicly accessible
            DOM and HTTP metadata from URLs submitted for auditing, and billing
            status processed securely via Stripe.
          </p>
          <h2 className="text-lg font-bold text-slate-950 pt-2">
            2. How We Use Information
          </h2>
          <p>
            Submitted URLs and keywords are processed to generate technical SEO,
            CRO, WCAG accessibility, and AI Search (GEO) reports. We never sell
            your personal data or prospect lead lists to third parties.
          </p>
          <h2 className="text-lg font-bold text-slate-950 pt-2">
            3. Third-Party Processors
          </h2>
          <p>
            Payments are handled by Stripe in compliance with PCI-DSS Level 1. AI
            copywriting suggestions are processed via Google Gemini APIs without
            training on private customer workspace data.
          </p>
        </div>
      </div>
    </div>
  );
}
