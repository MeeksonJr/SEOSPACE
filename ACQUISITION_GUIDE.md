# Seospace AI — Acquisition & Turnkey Handover Guide

> **Asset:** Seospace AI (Autonomous Technical SEO, CRO, Generative Engine Optimization (GEO) & Agency White-Label Growth SaaS)  
> **Deployment:** Production live on Vercel Edge (`https://seospace-kappa.vercel.app/`)  
> **Repository:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, Stripe Billing  

---

## 1. Executive Summary & Listing Overview (For Flippa / Acquire.com)

### A. Listing Title & Subtitle
- **Listing Title:** `Seospace AI — Turnkey Technical SEO, GEO & White-Label Agency Growth SaaS (Next.js 15 + Stripe + Supabase)`
- **Subtitle:** `Production-ready B2B SEO platform with real-time 35-point DOM audits, Cloudflare 1.1.1.1 DoH DNS checks, 0-100 mathematical AI Article Studio, white-label PDF generator, and embeddable lead widget CRM.`

### B. Elevator Pitch
Seospace AI is a modern, high-ticket B2B SaaS designed for digital marketing agencies, SEO consultants, and SaaS founders. Unlike generic AI wrappers that generate templated text or fake scores, Seospace performs **100% authentic, real-time website scans**:
1. Crawls live HTML DOM structures, OpenGraph tags, and canonical tags.
2. Queries Cloudflare 1.1.1.1 DNS-over-HTTPS for authoritative SPF, DMARC, and MX records.
3. Indexes Internet Archive Wayback Machine data for verified domain creation longevity.
4. Synthesizes 95+/100 mathematically graded content in an interactive AI Content Studio.
5. Enables agencies to re-sell audits under their own brand via custom White-Label PDF reports and an embeddable lead-capture widget with Discord/Slack/Zapier webhook notifications.

---

## 2. Valuation & Financial Profile

| Metric | Turnkey Baseline (Current) | With Custom Domain & First 10 Customers |
|---|---|---|
| **Estimated Sale Range** | **$1,500 – $2,500** | **$3,500 – $6,500+** |
| **Gross Margin** | **98.5% – 100%** | **98.5% – 100%** |
| **Monthly Operating Overhead** | **$0.00 – $10.00/mo** | **$0.00 – $10.00/mo** |
| **Pricing Tiers** | Starter (Free), Pro ($19/mo), Agency ($49/mo) | Pro ($29/mo), Agency ($79/mo) |

### Monthly Operating Cost Breakdown

| Component | Provider | Cost | Scalability Limit |
|---|---|---|---|
| **App Hosting & CDN** | Vercel Serverless & Edge | **$0.00/mo** | 100GB bandwidth, up to 150k monthly page views on Hobby tier |
| **Database & Auth** | Supabase PostgreSQL | **$0.00/mo** | 500MB DB storage, 50,000 monthly active users (stores 15,000+ audits) |
| **DNS Intelligence** | Cloudflare 1.1.1.1 DoH | **$0.00/mo** | Free unlimited public API forever |
| **Domain History** | Wayback Machine CDX API | **$0.00/mo** | Free public archive API forever |
| **Edge Crawler / DOM** | Edge Workers + RapidAPI | **$0.00 – $10.00/mo** | Free tier + fallback native fetch if quota reached |
| **Billing & Payments** | Stripe | **$0.00 fixed** | Pay-as-you-go (2.9% + 30¢ per transaction only when revenue is earned) |
| **TOTAL FIXED OVERHEAD** | — | **$0.00 to $10.00/month** | **Net Profit Margin: ~98.5%+** |

---

## 3. Data Authenticity & Verification Schedule

Every score, check, and metric displayed across Seospace is **verifiable and derived from live URL data**:

| Signal / Section | Upstream Source | Verification Method |
|---|---|---|
| **Meta Title & Duplication** | Live HTML `<title>` tag | Exact character length calculation; regex duplication detection. |
| **Meta Description** | Live `<meta name="description">` | Exact character count vs Google 110–160 character SERP window. |
| **Heading Hierarchy** | Live `<h1>`, `<h2>`, `<h3>` tags | Exact count and text list extracted from DOM. |
| **Image Alt Tags** | Live `<img>` tags in HTML | Exact count of total images vs images lacking `alt=""` attributes. |
| **Link Velocity** | Live `<a href="...">` tags | Categorized into internal domain links vs external authority outbound links. |
| **Authoritative DNS** | Cloudflare 1.1.1.1 DoH | Real-time query returning live IPv4 A records and IPv6 AAAA support. |
| **Email Deliverability & Anti-Spoofing** | Cloudflare 1.1.1.1 DoH | Real TXT record inspection verifying `v=spf1` and `v=DMARC1` policy (`none`/`quarantine`/`reject`). |
| **Domain Longevity** | Internet Archive Wayback Machine | Earliest recorded snapshot year and continuous domain age. |
| **AI Crawler Files** | Direct HTTP HEAD/GET | Verified presence of `/robots.txt`, `/sitemap.xml`, and `/llms.txt`. |
| **Extracted Keywords** | Page DOM Text & Headings | Dynamic n-gram extraction matching H1/H2 phrases with real search volume and difficulty models. |
| **Mathematical Article Score** | 7-point content rubric | Calculated strictly on word count, keyword density, and heading intervals. |

---

## 4. Key Product Capabilities (What the Buyer Gets)

1. **Executive Workspace Dashboard (`/dashboard`):**
   - Live URL scanner with 40-tick synchronized Segmented Gauge.
   - Global audited domains watchlist with 1-click **Export to CSV** and **Export to JSON**.
   - Collapsible desktop sidebar and responsive mobile drawer.
2. **Autonomous AI SEO Content Studio ("AI Letters"):**
   - Multi-document switcher with draft management.
   - Real-time 0–100 mathematical grader evaluating focus keyword density, title tags, and structure.
   - Live Google desktop & mobile SERP preview simulator.
   - Clean HTML and Markdown exporters.
3. **Agency White-Label Suite:**
   - Full agency customization (Agency Name, Custom Brand Hex Color, Logo, CTA Booking URL, Footer Note).
   - Generates client-ready branded PDF reports with zero Seospace watermark.
4. **Embeddable Lead-Capture Widget & CRM (`/widget`):**
   - `<script>` / `<iframe>` embed snippet generator for WordPress, Webflow, Framer, and Next.js.
   - Real-time **Webhook Dispatcher** supporting Discord (60-second setup), Slack, and Zapier.
   - Integrated CRM table with status progression (`New` → `Contacted` → `Qualified` → `Closed`) and 1-click CSV/JSON export.
5. **Competitor Domain Battlecard (`/compare`):**
   - Head-to-head 2-domain comparison analyzing SEO, CRO, GEO, WCAG, and TTFB with 1-click "Outrank" workflow.
6. **4-in-1 Free Growth Tools Suite (`/tools`):**
   - Interactive `/llms.txt` Generator, JSON-LD Schema Studio, AI Crawler `robots.txt` Builder, and Live Cloudflare DNS Inspector.
7. **Public REST API & Developer Playground (`/docs`):**
   - Interactive in-browser API console with live request editor, cURL code generator, and response inspector.
8. **Owner Admin Operations Portal (`/admin`):**
   - Active recurring MRR telemetry, user management table, 1-click user subscription tier cycling (`starter` → `pro` → `agency`), and live system health diagnostics.

---

## 5. 10-Minute Turnkey Handover Checklist (For the Buyer)

### Step 1: Transfer the Vercel Project (2 minutes)
1. In the Vercel Dashboard, navigate to `Settings` → `General` → `Transfer Project`.
2. Enter the buyer's Vercel team or username.
3. Once accepted, the production domain and edge deployment instantly transfer to their account.

### Step 2: Transfer the Supabase Database (3 minutes)
1. In the Supabase Dashboard, invite the buyer's email address under `Project Settings` → `Members` as **Owner**.
2. Once accepted, the buyer removes the seller.
3. Alternatively, the buyer creates a fresh Supabase project and pastes the schema from `supabase/schema.sql` (1 click).

### Step 3: Connect Buyer's Stripe Account (3 minutes)
1. Create a free Stripe account or log in to an existing one.
2. Create 2 recurring subscription products:
   - **Pro Plan:** $19/mo (or $29/mo).
   - **Agency Plan:** $49/mo (or $79/mo).
3. Create payment links for each product and update the environment variables in Vercel:
   ```env
   NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK="https://buy.stripe.com/..."
   NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_LINK="https://buy.stripe.com/..."
   ```

### Step 4: Add a Custom Domain (Optional, 2 minutes)
1. Purchase any domain (e.g. `seospace.io`, `seospace.ai`, or `seospace.com`) via Namecheap, Cloudflare, or Google Domains.
2. In Vercel Project Settings → `Domains`, enter the domain.
3. Set the CNAME record to `cname.vercel-dns.com`. Vercel automatically issues an SSL certificate within 60 seconds.

---

## 6. Flippa / Acquire.com Listing Copy Template

```markdown
### Summary
For sale is Seospace AI, a high-converting, fully functional B2B SaaS platform for SEO agencies and consultants. Built with Next.js 15 App Router, React 19, TypeScript, Supabase PostgreSQL, and Stripe Billing. 

Unlike typical AI wrappers, Seospace performs authentic, real-time website scans using live DOM extraction, Cloudflare 1.1.1.1 DNS-over-HTTPS, and Wayback Machine domain history. It includes an AI Article Studio with mathematical 0-100 scoring, White-Label agency PDF reports, an embeddable lead-generation widget with real-time Discord/Slack webhooks, and competitor comparison engines.

### Key Highlights:
- **Turnkey Infrastructure:** Fully deployed on Vercel Edge with zero server maintenance.
- **98.5%+ Gross Margins:** Free-tier stack (Vercel, Supabase, Cloudflare DoH) keeps monthly operating costs between $0 and $10/mo.
- **Bespoke "Studio Paper" UI:** Editorial design system with Bricolage Grotesque typography, fluid layouts, and full Day/Night theme toggle.
- **Agency Monetization:** White-label reporting suite and lead capture widget built for agency retainers ($49/mo Agency tier).
- **Owner Operations Portal:** Dedicated /admin center with real-time MRR tracking and 1-click user tier cycling.

### What is Included in the Sale:
- 100% complete source code (GitHub repository).
- Production Vercel deployment project transfer.
- Production Supabase PostgreSQL database with all tables, RLS policies, and sample data.
- Full ownership handover guide with step-by-step documentation.
- 30 days of email/Discord post-sale technical support.
```
