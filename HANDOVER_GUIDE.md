# Seospace AI (AuditPulse Edition) — Turnkey SaaS Handover & Flippa Guide

Welcome! This document serves both as your **Vercel Deployment Checklist** and the **Official Buyer Handover Documentation** when you sell the SaaS on Flippa.

---

## 1. Live Architecture & Zero-Holding-Cost Stack

- **Framework:** Next.js 15 (App Router, TypeScript, Tailwind CSS v4)
- **AI Engine:** Google Gemini 2.5 Flash (`@google/genai`) with automatic multi-key failover + deterministic fallback
- **Payments:** Stripe Subscriptions & Hosted Payment Links
- **Database & Auth:** Supabase PostgreSQL (`supabase/schema.sql`) + Hybrid Zero-Downtime Client Store
- **Monthly Idle Hosting Cost:** **$0.00 / month** (Vercel Free Hobby Tier + Google AI Studio Free Tier + Supabase Free Tier)

---

## 2. Live Stripe Products & Payment Links Configured

The following live Stripe Products, Prices, and Hosted Payment Links are pre-configured in `.env.local` and `src/lib/stripe/plans.ts`:

| Plan Tier | Billing | Price | Stripe Product ID | Stripe Price ID | Hosted Payment Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Growth Pro** | Monthly | **$29/mo** | `prod_VU42KsJoHvt5NP` | `price_1UT5vaFZKCl4K7QEY7LlKX4v` | `https://buy.stripe.com/4gM28reqk2tFaj7ctH9k400` |
| **Growth Pro** | Annual | **$276/yr** ($23/mo) | `prod_VU42KsJoHvt5NP` | `price_1UT5vgFZKCl4K7QEF7p1hCNn` | `https://buy.stripe.com/7sYdR96XS2tF2QF2T79k401` |
| **Agency White-Label** | Monthly | **$79/mo** | `prod_VU42J9WVtaF6E9` | `price_1UT5vnFZKCl4K7QE3bSWBV22` | `https://buy.stripe.com/3cI6oH3LG6JVdvj2T79k402` |
| **Agency White-Label** | Annual | **$756/yr** ($63/mo) | `prod_VU42J9WVtaF6E9` | `price_1UT5vpFZKCl4K7QEBvJ79Uju` | `https://buy.stripe.com/aFafZh81Wb0bezn1P39k403` |

---

## 3. Deploying to Vercel in 2 Minutes

1. Push this repository to your GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add the environment variables from `.env.local` into **Vercel Project Settings → Environment Variables**:
   - `GEMINI_API_KEY`
   - `GEMINI_API_KEY_FALLBACK`
   - `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK`
   - `NEXT_PUBLIC_STRIPE_PRO_ANNUAL_LINK`
   - `NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_LINK`
   - `NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_LINK`
4. Click **Deploy**.

---

## 4. Key Routes to Showcase in Your Flippa Listing Screenshots

1. **`/` (Marketing Landing Page):** Features both **Light Mode Studio** and **Midnight Dark Mode Hero** toggle, live URL scanner, 90/100 segmented score gauge, interactive ROI calculator, and Stripe pricing table.
2. **`/login` & `/signup` (Split-Screen Auth & Onboarding):** Includes 1-click Google OAuth, Magic Link, onboarding carousel, and a **1-Click Demo Sandbox button** for Flippa buyers.
3. **`/dashboard` (Executive Intelligence Workspace):** Dark wave greeting banner, sparkline KPIs, Proactive Intelligence Engine, 40-tick Portfolio Health Score gauge, and global audited domains watchlist.
4. **`/dashboard?tab=editor` (Seospace Live AI Content & SEO Score Studio):** Real-time rich content editor with live 0–100 SEO Score gauge, keyword pills, green/red active checklist, and Gemini 2.5 AI Assistant auto-optimizer.
5. **`/report/stripe-com` (White-Label Public Audit & PDF Export):** 5-pillar diagnostic report with AI copywriting rewrites, code snippets, and 1-click White-Label PDF export.
6. **`/widget` (Embeddable Agency Lead-Capture Widget):** Standalone & iframe-ready lead magnet form that feeds directly into the Agency CRM.
7. **`/admin` (Owner Admin Portal):** MRR tracker, user tier switcher, and live integration health monitor.
