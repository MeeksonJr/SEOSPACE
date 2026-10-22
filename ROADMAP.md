# TrustPulse AI — Product & Execution Roadmap

**Target Goal**: Deliver an enterprise-grade, turnkey Social Proof & Reputation Management SaaS ready for listing on Flippa / Acquire.com with zero operational cost.

---

## Milestone 1: Pre-Code Architecture & Documentation (Current)
- [x] High-conviction Flippa opportunity analysis
- [x] Product Requirements Document (`PRD.md`)
- [x] Entity-Relationship Diagram (`ERD.md`)
- [x] Architectural Decision Records (`ADR.md`)
- [x] User Documentation & API Contracts (`DOKUMENTASI.md`)
- [ ] User Approval & Swarm Activation

---

## Milestone 2: Brand Identity, Visual Assets & Landing Experience
- [ ] TrustPulse AI Brand Identity (High-contrast Indigo/Violet glassmorphic aesthetic)
- [ ] High-Converting Landing Page with:
  - Interactive Live Widget Demonstration (real-time toggle between Wall of Love, Floating Toast, and Review Pill)
  - Interactive "Shield Demonstration" (test what happens when 5 stars vs 2 stars are clicked)
  - Agency ROI Calculator (Calculate monthly retainers: "20 clients @ $149/mo = $2,980 MRR")
  - Transparent Zero-Cost Technology Stack breakdown
  - Tiered Pricing Table connected to Stripe Checkout (Starter, Pro, Agency)

---

## Milestone 3: Core Engine & Product Modules
- [ ] **Negative Review Shield & QR Code Funnel (`/r/[slug]`)**:
  - Dynamic QR Code generator (SVG & PNG download with customizable table tent styling)
  - Gatekeeper rating logic (4-5 stars -> Google Maps redirect; 1-3 stars -> Private de-escalation form)
- [ ] **Multi-Format Widget Generator (`/widget/builder`)**:
  - Live customizable builder: Floating Toast, Wall of Love Grid, and Floating Rating Pill
  - 1-Click embed code generator (Lightweight CDN script `<script src="..." defer></script>` + iframe fallback)
  - Standalone embed endpoint (`/api/widget/script` and `/embed/[widgetId]`)
- [ ] **AI Review Responder & Sentiment Intelligence (`/dashboard/ai-replies`)**:
  - Google Gemini 2.5 Flash / 2.0 integration
  - 3-Way response generator (SEO Gratitude, De-escalation & Resolution, Loyalty Booster)
  - Sentiment scoring & alert badges

---

## Milestone 4: Multi-Workspace Agency Dashboard & Data Aggregator
- [ ] Agency Workspace Switcher (Manage unlimited local business clients)
- [ ] Multi-Platform Review Importer (Google Places search, Trustpilot import, CSV/JSON bulk upload)
- [ ] Private Feedback Inbox with customer contact details and resolution status toggle
- [ ] White-Label Monthly PDF Client Report generator

---

## Milestone 5: Commercial Hardening & Flippa Asset Package
- [ ] `FLIPPA_LISTING.md`: High-converting listing title, elevator pitch, financial multiple valuation, and buyer transition plan
- [ ] `ACQUISITION_GUIDE.md`: Step-by-step buyer handover guide (transferring Vercel, Supabase, Stripe, and Gemini keys in under 15 minutes)
- [ ] Build & Type Safety Verification: 0 lint errors, 100% clean Next.js build
