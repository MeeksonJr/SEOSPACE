# Product Requirements Document (PRD)
**Project**: TrustPulse AI — Autonomous Social Proof, Multi-Source Review Aggregator & Negative Review Shield SaaS  
**Version**: 1.0.0  
**Status**: In Review (Pre-Code Architectural Blueprint)  
**Created**: 2026-10-22  
**Last Updated**: 2026-10-22  

---

## 1. Executive Summary
**TrustPulse AI** is an all-in-one reputation management, social proof, and review amplification SaaS designed specifically for digital marketing agencies, local service businesses (dentists, plumbers, clinics, salons, law firms), and e-commerce founders. It eliminates the #1 dread of business owners—public 1-star reviews—through an intelligent "Negative Review Shield" QR code funnel, while aggregating 5-star customer reviews across Google, Trustpilot, and manual submissions into high-converting embeddable "Wall of Love" and floating toast notification widgets. Built for turnkey acquisition on Flippa / Acquire.com with zero ongoing infrastructure costs ($0/mo operating overhead).

---

## 2. Problem Statement
**Problem**: 
1. **Unfair 1-Star Google Reviews**: A single disgruntled customer can tank a local business's 4.9 rating to 4.3, causing up to 30% loss in phone calls and foot traffic. Local business owners have no buffer or private feedback funnel before a customer vents publicly.
2. **Scattered Social Proof**: Customer praise is fragmented across Google Reviews, Trustpilot, emails, and direct messages, leaving landing pages bare and conversions low.
3. **Agency Resale Opportunity**: Marketing agencies desperately need high-margin recurring SaaS tools ($99–$299/month per client) that require zero technical maintenance to manage reputation and generate monthly proof reports for local clients.

**Target Users**:
- Digital Marketing & SEO Agencies looking for white-label recurring client retainers.
- Local Business Owners (clinics, automotive, restaurants, home services).
- E-commerce & SaaS founders needing high-converting social proof widgets.
- Turnkey SaaS investors on Flippa / Acquire.com looking for a clean, zero-maintenance business in a box.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Zero Operating Overhead | Monthly hosting & API cost | **$0.00 / month** on standard usage tiers |
| Buyer Conversion on Flippa | Perceived asset valuation | **$2,500 – $6,500+** listing valuation |
| Widget Render Latency | Embed script execution time | **< 120ms** via lightweight static edge endpoint |
| Negative Review Interception | Private feedback shield capture rate | **> 85%** of unhappy ratings redirected away from Google |
| AI Response Speed | Gemini sentiment & reply generation | **< 1.8 seconds** with 3 distinct reply angles |

---

## 4. User Personas

### Persona 1: Marcus Vance — Digital Agency Owner (Primary Buyer on Flippa)
- **Role**: Founder of a 4-person local SEO & marketing agency managing 28 local clients.
- **Goals**: Offer an automated "Reputation Booster & Review Protection" service add-on for $149/mo per client with zero manual work.
- **Frustrations**: Tools like Birdeye and Podium cost $300-$500/month per location and have predatory contracts.
- **Key Behaviors**: Uses TrustPulse's agency dashboard to create client workspaces, download branded QR codes, and generate monthly PDF reports.

### Persona 2: Dr. Aris Thorne — Local Dental Clinic Owner
- **Role**: Owner of a private cosmetic dental practice.
- **Goals**: Protect clinic from negative public reviews while collecting more 5-star Google ratings from happy patient cleanings.
- **Frustrations**: Unhappy patients vent publicly on Google Maps without speaking to the office manager first.
- **Key Behaviors**: Places TrustPulse QR code card at the reception counter. Happy patients get routed to Google Maps; unhappy patients write private messages to Dr. Thorne directly.

---

## 5. Feature Requirements

### MVP Features (Must Have — v1.0)
- [ ] **Interactive Live Widget Generator**:
  - Floating Social Proof Toasts ("⭐ Sarah M. rated 5 stars 4m ago" with animated transitions).
  - Wall of Love Masonry Grid with star ratings, avatar, platform badges (Google, Trustpilot, Product Hunt).
  - Floating review pill badge ("4.9 / 5.0 ⭐ from 320+ verified reviews").
  - 1-click script tag (`<script src=".../widget.js" data-site="..."></script>`) & iframe embed code.
- [ ] **Negative Review Shield & QR Code Funnel (`/r/[slug]`)**:
  - Interactive 5-star rating selector for customers.
  - Smart Gatekeeper logic:
    - 4 or 5 stars -> Direct one-click redirect to Google Business Profile or Trustpilot.
    - 1, 2, or 3 stars -> Opens a private, empathetic de-escalation feedback form (stored internally, triggers alert).
  - Live printable QR Code generator with customizable brand colors and business name.
- [ ] **AI Review Responder & Sentiment Engine**:
  - Powered by Google Gemini 2.5 Flash / 2.0.
  - Analyzes sentiment (Positive, Neutral, Negative, Escalation).
  - Synthesizes 3 SEO-tailored response drafts:
    1. *SEO-Rich Gratitude Reply* (boosts local search signals).
    2. *De-escalation & Resolution Reply* (professional, defuses tension).
    3. *Loyalty & Referral Reply* (encourages next visit or promo).
- [ ] **Multi-Source Review Aggregator**:
  - Google Places query / simulated import.
  - Trustpilot & CSV file bulk import.
  - Manual verified review creation modal.
- [ ] **Agency Multi-Workspace & White-Label Management**:
  - Manage multiple business locations or client brands from a single login.
  - Custom brand colors, logos, and business URLs.
- [ ] **Stripe Monetization & Turnkey Flippa Package**:
  - Starter ($19/mo), Pro ($49/mo), and Agency ($129/mo) pricing tiers.
  - Comprehensive handover documentation (`ACQUISITION_GUIDE.md`, `FLIPPA_LISTING.md`).

### Phase 2 Features (Should Have — v1.x)
- [ ] Automated SMS / WhatsApp review request broadcast simulator.
- [ ] White-label Client Portal subdomains (`reviews.agencyclient.com`).
- [ ] Zapier & Make.com webhook triggers for new review notifications.

---

## 6. Technical Architecture

### Stack Decision
| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) | Best-in-class React 19 SSR, Edge routes, and SEO |
| **Styling** | Tailwind CSS v4 + Lucide Icons | Ultra-clean, modern dark/light UI with glassmorphism |
| **Database & Auth** | Supabase PostgreSQL + Auth (with Local In-Memory Fallback) | Zero-cost managed PostgreSQL with instant failover fallback |
| **AI Engine** | Google Gemini API (`@google/genai`) | Ultra-fast sentiment analysis and reply generation |
| **Payments** | Stripe Billing (Checkout & Customer Portal) | Industry gold standard for subscription SaaS |
| **Hosting** | Vercel Edge / Serverless | 100% free Hobby tier with unlimited deployments |

### Architecture Decisions (ADRs)
- **ADR-001: Zero-Friction Standalone Widget Delivery**: The embed widget is hosted as a lightweight standalone JS bundle `/api/widget/script` and `/widget/embed` iframe, requiring zero client dependencies.
- **ADR-002: Dual-Storage Resilience**: System operates on Supabase PostgreSQL when credentials exist, with an intelligent local JSON storage fallback ensuring flawless demo execution even during offline testing.

---

## 7. Data Model (High-Level)
```
users ──owns──> workspaces (agencies / businesses)
workspaces ──has_many──> campaigns (QR review funnels)
campaigns ──collects──> reviews (stars, text, platform, status)
campaigns ──collects──> private_feedback (shielded 1-3 star grievances)
workspaces ──has_many──> widgets (wall_of_love, toast_notifications, badge)
workspaces ──has_one──> subscriptions (Stripe customer_id, plan, status)
```

---

## 8. User Flows

### Primary Flow: Customer Scanning Review QR Code
1. Customer finishes dinner or dental appointment and scans table QR code -> loads `/r/apex-dental`.
2. Screen prompts: "How was your experience today?" with 5 interactive stars.
3. If customer clicks **5 Stars**:
   - Celebratory animation pops up: "We are thrilled! Could you take 10 seconds to share this on Google?"
   - Customer clicks "Copy & Open Google" -> review copied to clipboard, opens Google Maps review dialogue.
4. If customer clicks **2 Stars**:
   - Shield activates: "We are so sorry we did not deliver a 5-star experience. Please let our clinic director know how we can make it right."
   - Feedback form submitted directly to private portal; clinic manager gets an alert; 0 negative stars posted to Google!

---

## 9. Non-Functional Requirements
| Requirement | Target |
|---|---|
| **Page Speed** | Lighthouse Performance Score > 95, LCP < 1.5s |
| **Embed Script Size** | < 15KB uncompressed, no jQuery or heavy libs |
| **Mobile Responsiveness** | 100% fluid touch interaction on iOS Safari & Android Chrome |
| **CORS Compatibility** | Widget endpoints support wildcard `Access-Control-Allow-Origin: *` |

---

## 10. Out of Scope for MVP
- Native iOS/Android Swift/Kotlin apps (PWA mobile web is sufficient).
- Paid Google Places API enterprise scraping accounts (uses free standard queries / synthetic verified mock import).

---

## 11. Open Questions & Approvals
- Review and approval by USER before commencement of full multi-agent implementation.
