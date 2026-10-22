export const PILLAR_ARCHITECTURES = [
  {
    id: "seo",
    name: "Technical SEO & Metadata",
    weight: "30% Weight",
    scoreSample: 94,
    badge: "Distributed Edge Crawler + Direct HTML DOM",
    summary:
      "Evaluates canonical tags, title character math (50–60 chars), meta description persuasive length (140–160 chars), single H1 discipline, H2/H3 semantic hierarchy, and internal/external link velocity.",
    checks: [
      {
        label: "Title Tag Front-Loaded Keyword & Length (50–60 chars)",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Meta Description CTA & Length (140–160 chars)",
        points: "15 pts",
        status: "pass",
      },
      {
        label: "Single Semantic H1 + Structured H2/H3 Subheadings",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Canonical URL & OpenGraph Social Card Completeness",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "XML Sitemap (/sitemap.xml) & Robots (/robots.txt) Verification",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "engine": "Seospace Neural Engine v4.2",
  "metadataSource": "Seospace Distributed Edge Crawler + DOM",
  "titleLength": 56,
  "metaDescriptionLength": 152,
  "h1Count": 1,
  "h2Count": 6,
  "canonicalPresent": true,
  "sitemapVerified": true
}`,
  },
  {
    id: "cro",
    name: "Conversion Rate (CRO)",
    weight: "25% Weight",
    scoreSample: 89,
    badge: "Behavioral & CTA Heuristics",
    summary:
      "Inspects above-the-fold call-to-action clarity, lead form friction, social proof density, trust badges, pricing transparency, and Time-to-First-Byte (TTFB) latency.",
    checks: [
      {
        label: "High-Contrast Action Verbs in Primary CTA Buttons",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Server Response Latency (TTFB < 600ms Target)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Quantified Social Proof, Reviews & Case Study Signals",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Low-Friction Lead Capture / Instant Trial Entry Point",
        points: "25 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "ttfbMs": 214,
  "ctaButtonsDetected": 7,
  "primaryCtaText": "Get Started Free",
  "trustSignals": ["SOC2 Ready", "30-Day Guarantee", "4.9/5 Stars"],
  "conversionFriction": "Low"
}`,
  },
  {
    id: "geo",
    name: "AI Search & GEO Readiness",
    weight: "20% Weight",
    scoreSample: 96,
    badge: "ChatGPT • Perplexity • Claude",
    summary:
      "Verifies whether generative AI answer engines can crawl, parse, and cite your brand via /llms.txt entity manifests, JSON-LD structured data graphs, and AI bot rules.",
    checks: [
      {
        label: "Live /llms.txt Machine-Readable Entity Manifest",
        points: "30 pts",
        status: "pass",
      },
      {
        label: "Organization, SoftwareApplication & FAQPage JSON-LD",
        points: "30 pts",
        status: "pass",
      },
      {
        label: "GPTBot, ClaudeBot & PerplexityBot Allowed in /robots.txt",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Direct Answer-First Paragraph Formatting for RAG Citation",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "llmsTxtStatus": "200 OK (/llms.txt verified)",
  "jsonLdTypes": ["Organization", "SoftwareApplication", "FAQPage"],
  "aiCrawlersAllowed": ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
  "geoCitationProbability": "High (96/100)"
}`,
  },
  {
    id: "a11y",
    name: "WCAG 2.2 AA Accessibility",
    weight: "15% Weight",
    scoreSample: 92,
    badge: "ADA & WCAG 2.2 Compliance",
    summary:
      "Audits image alt attribute coverage, HTML lang declarations, responsive viewport scaling, ARIA landmark roles, and keyboard focus navigation.",
    checks: [
      {
        label: "Image Alt Text Coverage Ratio (Target: 100% Descriptive)",
        points: "35 pts",
        status: "pass",
      },
      {
        label: "Valid HTML5 lang Attribute & Unblocked Viewport Scaling",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Semantic Landmarks (<main>, <nav>, <header>, <footer>)",
        points: "20 pts",
        status: "pass",
      },
      {
        label: "Form Input Labels & Accessible Button Descriptions",
        points: "20 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "htmlLang": "en",
  "totalImages": 18,
  "imagesMissingAlt": 0,
  "altCoveragePercent": 100,
  "viewportScalable": true,
  "wcagLevel": "2.2 AA Compliant"
}`,
  },
  {
    id: "security",
    name: "Cloudflare 1.1.1.1 DNS & Security",
    weight: "10% Weight",
    scoreSample: 95,
    badge: "Live Cloudflare DoH 1.1.1.1",
    summary:
      "Queries Cloudflare DNS-over-HTTPS in real time for A/AAAA records, MX mail servers, SPF TXT authorization, DMARC anti-spoofing policy, and HTTPS headers.",
    checks: [
      {
        label: "Strict Transport Security (HTTPS + HSTS Header)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "SPF TXT Record Configured for Domain Mail Authenticity",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "DMARC (_dmarc TXT) Policy Enforced (quarantine / reject)",
        points: "25 pts",
        status: "pass",
      },
      {
        label: "Redundant Authoritative Nameservers & IPv4/IPv6 Resolution",
        points: "25 pts",
        status: "pass",
      },
    ],
    telemetrySample: `{
  "resolver": "https://cloudflare-dns.com/dns-query",
  "aRecords": ["141.193.213.10", "141.193.213.11"],
  "spfVerified": true,
  "dmarcPolicy": "quarantine",
  "nameservers": ["lia.ns.cloudflare.com.", "max.ns.cloudflare.com."]
}`,
  },
];

export const FAQ_ITEMS = [
  {
    q: "Are the SEO audit scores and metadata checks 100% real or inflated?",
    a: "100% real and mathematically computed. When you enter any URL, Seospace extracts live metadata via our distributed edge crawler and direct HTML DOM inspection, queries Cloudflare 1.1.1.1 DNS-over-HTTPS for real A/MX/SPF/DMARC records, and checks /robots.txt, /sitemap.xml, and /llms.txt. If a site is missing image alt tags, has a 78-character duplicated title, or lacks DMARC, those exact points are deducted.",
  },
  {
    q: "How does the Saved-First URL Audit Database work?",
    a: "Every time a URL is audited, its complete 5-pillar report, DOM metadata, DNS intelligence, and AI copywriting diffs are saved to our persistent database. Visiting that URL again loads the saved snapshot in under 15ms without burning API credits — and you can click 'Fetch Latest Live Scan' anytime to force a fresh real-time crawl.",
  },
  {
    q: "How is the AI SEO Content Studio connected to my URL audits?",
    a: "Every URL audit uncovers high-intent niche keywords and content gaps for that exact domain. Clicking 'Generate AI SEO Article' on any audit report opens the AI Content Studio, generates an 800+ word structured guide linked to that domain, and grades it live against our 7-point mathematical rubric (95+/100) with a public shareable link (/article/[id]).",
  },
  {
    q: "What AI model powers Seospace AI?",
    a: "All automated copywriting diffs, meta tag rewrites, keyword intent clustering, and long-form SEO articles are powered by the proprietary Seospace Neural Engine v4.2, specifically calibrated for technical on-page SEO math and generative answer engine citations.",
  },
  {
    q: "What is GEO (Generative Engine Optimization) and /llms.txt?",
    a: "Traditional SEO targets Google's 10 blue links. GEO optimizes your site so AI answer engines (ChatGPT Search, Perplexity, Claude, and Google AI Overviews) cite your brand as the primary source. Seospace audits and generates your /llms.txt manifest, FAQPage JSON-LD schema, and AI bot rules automatically.",
  },
  {
    q: "Can I remove Seospace branding on PDF reports for my agency clients?",
    a: "Yes! On the Professional and Agency White-Label plans, you can upload your agency logo, set your primary brand hex color, and embed your custom Calendly booking link. Every exported PDF and shareable report reflects 100% your agency identity.",
  },
  {
    q: "How does the Embeddable Agency Lead-Gen Widget work?",
    a: "From the Dashboard, copy a single <iframe> snippet and paste it onto your agency website or landing page. Visitors can run a free 60-second audit of their site while their name, work email, audited URL, and score are automatically captured in your Dashboard CRM.",
  },
  {
    q: "Can I switch between Light Mode and Dark Mode across the platform?",
    a: "Yes! Click the Light/Dark Mode toggle in the top navigation bar or footer at any time. Your preference is saved automatically and switches the whole experience between a warm paper-white Day theme and a deep ink Night theme.",
  },
];
