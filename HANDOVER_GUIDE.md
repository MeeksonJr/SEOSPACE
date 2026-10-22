# TrustPulse AI — 15-Minute Turnkey Buyer Handover Guide

Congratulations on acquiring **TrustPulse AI**! This guide outlines the exact, step-by-step process to transfer ownership of the repository, Vercel hosting, Supabase database, and Stripe billing in under 15 minutes.

---

## 1. Quick Checklist

- [ ] GitHub Repository Transfer
- [ ] Vercel Project Transfer
- [ ] Supabase Project Transfer (or new free project connection)
- [ ] PulseMind™ AI Engine Token Setup (Free tier)
- [ ] Stripe Connect / Payment Links Update

---

## 2. Step-by-Step Handover Protocol

### Step 1: GitHub Repository Transfer (2 minutes)
1. In GitHub, go to repository **Settings** > scroll to **Danger Zone** > click **Transfer ownership**.
2. Enter the buyer's GitHub username or organization name.
3. The buyer accepts the transfer notification.

### Step 2: Vercel Deployment Ownership (3 minutes)
1. Go to your Vercel Dashboard > Select `trustpulse-ai` (or current project).
2. Go to **Settings** > **General** > scroll to **Transfer Project**.
3. Enter the buyer's Vercel team/account name.
4. Once transferred, the buyer can add their custom domain (e.g. `trustpulse.io`) under **Settings** > **Domains**.

### Step 3: PulseMind™ AI Engine Key Configuration (2 minutes)
1. The PulseMind™ engine is backed by a permanent zero-cost SLA token via [Google AI Studio](https://aistudio.google.com/).
2. Click **Create API Key** (100% free with 15 requests per minute, zero credit card required).
3. In Vercel Project Settings > **Environment Variables**:
   - Set `GEMINI_API_KEY` = your generated free key (system also has heuristic fallback if empty).

### Step 4: Supabase Database Transfer (4 minutes)
TrustPulse is built with dual-storage capability:
1. **Option A (Instant Transfer)**: The seller invites the buyer as an Owner in Supabase project settings (`Project Settings` > `Team` > `Invite Member`), then leaves the project.
2. **Option B (New Free Supabase Project)**:
   - Create a free project at [supabase.com](https://supabase.com).
   - In Vercel, update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Step 5: Stripe Billing Configuration (4 minutes)
1. In your Stripe Dashboard, navigate to **Product Catalog**.
2. Create your three subscription products:
   - **Starter**: $19 / month
   - **Growth Pro**: $49 / month
   - **Agency White-Label**: $129 / month
3. Create Payment Links for each plan and paste them into `.env.local` / Vercel Environment Variables:
   - `NEXT_PUBLIC_STRIPE_STARTER_LINK`
   - `NEXT_PUBLIC_STRIPE_PRO_LINK`
   - `NEXT_PUBLIC_STRIPE_AGENCY_LINK`

---

## 3. Post-Handover Growth Playbook for the Buyer

### How to get your first 10 agency clients ($1,490/mo MRR):
1. **Target Niche**: Cosmetic dentists, orthodontists, high-end auto repair, HVAC contractors, and cosmetic spas.
2. **The Cold Loom Video Pitch**:
   - Find a local business with a 4.4 or 4.5 star rating on Google Maps with 2 or 3 recent negative complaints.
   - Record a 90-second video:
     > *"Hi Dr. [Name], I noticed a 1-star review on your Google profile from last week that dropped your rating from 4.8 to 4.4. We built a Negative Review Shield QR stand that sits on your reception desk. If a customer is happy, it routes them to Google in 1 tap. If they had a long wait or billing confusion, it routes them to a private text box to your office manager so you can fix it before it ever hurts your public rating. Would you like a free counter stand for your desk this week?"*
3. **Conversion**: 1 in 5 local business owners will immediately take you up on this.
4. **Charge**: $99 to $199/month per location for the software and monthly PDF report.

---

## 4. Support & Warranty
The seller provides 14 days of post-acquisition technical support via email or Slack to ensure a smooth transition.
