import {
  AuditReport,
  CapturedLead,
  SavedArticle,
  WhiteLabelConfig,
} from "@/types/audit";

export const DEFAULT_WHITELABEL_CONFIG: WhiteLabelConfig = {
  agencyName: "Apex Digital Growth",
  logoText: "APEX GROWTH",
  primaryColor: "#2563EB",
  accentColor: "#0F172A",
  ctaText: "Book Your Free 15-Min Growth Audit Call",
  ctaUrl: "https://calendly.com",
  contactEmail: "strategy@apexgrowth.io",
  footerNote:
    "Prepared exclusively by Apex Digital Growth Agency. Confidential Technical SEO, CRO & AI Search Diagnostic.",
  hidePoweredBy: true,
  webhookUrl: "",
};

export const SAMPLE_CAPTURED_LEADS: CapturedLead[] = [
  {
    id: "lead-1",
    name: "Marcus Vance",
    email: "marcus@luminahealth.co",
    websiteUrl: "https://luminahealth.co",
    auditScore: 61,
    createdAt: "14 mins ago",
    status: "New",
  },
  {
    id: "lead-2",
    name: "Elena Rostova",
    email: "elena@finflow-saas.io",
    websiteUrl: "https://finflow-saas.io",
    auditScore: 74,
    createdAt: "2 hours ago",
    status: "Qualified",
  },
  {
    id: "lead-3",
    name: "Devon Brooks",
    email: "devon@oakridgelegal.com",
    websiteUrl: "https://oakridgelegal.com",
    auditScore: 52,
    createdAt: "Yesterday",
    status: "Contacted",
  },
  {
    id: "lead-4",
    name: "Hannah Lin",
    email: "hannah@vervecommerce.com",
    websiteUrl: "https://vervecommerce.com",
    auditScore: 83,
    createdAt: "2 days ago",
    status: "Closed",
  },
];

export const SAMPLE_AUDITS: Record<string, AuditReport> = {
  "voice-one-com": {
    id: "voice-one-com",
    url: "https://voice-one.com/services/",
    domain: "voice-one.com",
    createdAt: "2026-10-21T17:15:00Z",
    overallScore: 64,
    letterGrade: "C+",
    statusLabel: "Needs Attention",
    responseTimeMs: 685,
    wordCount: 640,
    executiveSummary:
      "Voice-One's /services/ page has a clear meta description (122 chars), but suffers from 4 concrete technical & accessibility defects extracted via metadata inspection: (1) The <title> tag is duplicated back-to-back (102 chars), causing SERP truncation; (2) The viewport meta tag sets user-scalable=0 and maximum-scale=1.0, which is a direct WCAG 2.2 accessibility violation; (3) article:modified_time is dated December 2014 (12 years stale); and (4) og:image and DMARC email policy are missing.",
    estimatedConversionLift: "+28.5% Call Booking & Organic CTR Lift",
    pillars: {
      seo: {
        key: "seo",
        label: "Technical & On-Page SEO",
        score: 62,
        grade: "C+",
        summary:
          "Duplicated 102-char title tag and 2014 article:modified_time timestamp hurt rankings.",
        passedCount: 4,
        warningCount: 2,
        criticalCount: 2,
      },
      cro: {
        key: "cro",
        label: "CRO & Copy Clarity",
        score: 70,
        grade: "B-",
        summary:
          "Clear 24/7 answering service promise, but needs quantified pricing/trust proof above the fold.",
        passedCount: 4,
        warningCount: 2,
        criticalCount: 0,
      },
      geo: {
        key: "geo",
        label: "AI Search & GEO Readiness",
        score: 54,
        grade: "C",
        summary:
          "2014 modified timestamp and missing /llms.txt cause AI search engines to treat page as outdated.",
        passedCount: 2,
        warningCount: 2,
        criticalCount: 1,
      },
      a11y: {
        key: "a11y",
        label: "WCAG 2.2 Accessibility",
        score: 58,
        grade: "C",
        summary:
          "Critical viewport user-scalable=0 violation blocks pinch-to-zoom for visually impaired users.",
        passedCount: 3,
        warningCount: 1,
        criticalCount: 1,
      },
      security: {
        key: "security",
        label: "Security & Edge Vitals",
        score: 76,
        grade: "B",
        summary:
          "HTTPS active & SPF configured, but missing _dmarc TXT policy and legacy X-UA-Compatible IE=edge tag.",
        passedCount: 4,
        warningCount: 1,
        criticalCount: 0,
      },
    },
    checks: [
      {
        id: "vo-title-dup",
        pillar: "seo",
        title: "Duplicated Meta Title Tag (102 Characters)",
        description:
          "The <title> tag repeats the exact same string twice back-to-back ('Virtual Receptionist -Answering Service | Voice OneVirtual Receptionist...'). Google truncates titles over 60 characters and penalizes title duplication.",
        severity: "critical",
        pointsEarned: 4,
        pointsMax: 20,
        currentValue:
          "Virtual Receptionist -Answering Service | Voice OneVirtual Receptionist -Answering Service | Voice One (102 chars)",
        recommendedValue:
          "24/7 Virtual Receptionist & Live Answering Service | Voice One (62 chars)",
        impactScore: 10,
        difficulty: "Easy",
        fixKeyword: "Virtual Receptionist Answering Service",
        codeSnippet: `<title>24/7 Virtual Receptionist & Live Answering Service | Voice One</title>`,
      },
      {
        id: "vo-viewport-zoom",
        pillar: "a11y",
        title: "WCAG 2.2 Violation: Viewport Disables User Zoom (user-scalable=0)",
        description:
          "The viewport meta tag contains 'maximum-scale=1.0, user-scalable=0', preventing mobile users with low vision from zooming in. This fails WCAG 1.4.4 (Resize Text) and triggers a Google Lighthouse accessibility penalty.",
        severity: "critical",
        pointsEarned: 0,
        pointsMax: 25,
        currentValue:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        recommendedValue: "width=device-width, initial-scale=1.0",
        impactScore: 9,
        difficulty: "Easy",
        codeSnippet: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      },
      {
        id: "vo-stale-date",
        pillar: "geo",
        title: "Stale Content Timestamp (article:modified_time = Dec 2014)",
        description:
          "OpenGraph article:modified_time reports '2014-12-03T04:45:41+00:00'. Search engines and AI answer crawlers down-rank pages whose last modified metadata is over 10 years old.",
        severity: "critical",
        pointsEarned: 2,
        pointsMax: 20,
        currentValue: "2014-12-03T04:45:41+00:00 (11+ years stale)",
        recommendedValue:
          "Update page content & refresh modified timestamp to current year",
        impactScore: 9,
        difficulty: "Easy",
        fixKeyword: "24/7 Virtual Receptionist for Small Business",
      },
      {
        id: "vo-missing-og-image",
        pillar: "cro",
        title: "Missing OpenGraph & Twitter Preview Image (og:image)",
        description:
          "og:title and og:description are configured, but og:image is missing, and twitter:card is set to 'summary' instead of 'summary_large_image'. Shared links display a blank grey box.",
        severity: "warning",
        pointsEarned: 7,
        pointsMax: 15,
        currentValue: "Missing og:image | twitter:card = summary",
        recommendedValue: "Add 1200x630 og:image and summary_large_image card",
        impactScore: 8,
        difficulty: "Easy",
        codeSnippet: `<meta property="og:image" content="https://voice-one.com/wp-content/uploads/voice-one-social-preview.jpg" />\n<meta name="twitter:card" content="summary_large_image" />`,
      },
      {
        id: "vo-dns-dmarc",
        pillar: "security",
        title: "DNS Email Deliverability & Anti-Spoofing (SPF Present, DMARC Missing)",
        description:
          "Cloudflare DoH DNS inspection verified MX records and an active SPF policy, but _dmarc.voice-one.com has no TXT policy, leaving domain email vulnerable to spoofing.",
        severity: "warning",
        pointsEarned: 10,
        pointsMax: 20,
        currentValue: "SPF: Active | DMARC: Missing (_dmarc.voice-one.com)",
        recommendedValue: "Add _dmarc TXT record with v=DMARC1; p=quarantine;",
        impactScore: 8,
        difficulty: "Easy",
        codeSnippet: `_dmarc.voice-one.com. 3600 IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@voice-one.com; pct=100"`,
      },
      {
        id: "vo-meta-desc",
        pillar: "seo",
        title: "Meta Description Length & Clarity (122 Characters)",
        description:
          "Meta description clearly states the 24-hour answering & appointment scheduling benefit within optimal SERP limits.",
        severity: "pass",
        pointsEarned: 15,
        pointsMax: 15,
        currentValue:
          "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more. (122 chars)",
        recommendedValue: "Optimal (120–158 characters)",
        impactScore: 8,
        difficulty: "Easy",
      },
    ],
    keywords: [
      {
        keyword: "24/7 virtual receptionist answering service",
        volume: "14,800",
        difficulty: 34,
        intent: "Transactional",
      },
      {
        keyword: "live telephone answering service for small business",
        volume: "9,600",
        difficulty: 31,
        intent: "Commercial",
      },
      {
        keyword: "bilingual appointment scheduling receptionist",
        volume: "5,400",
        difficulty: 24,
        intent: "Transactional",
      },
      {
        keyword: "after hours medical & legal call answering",
        volume: "8,200",
        difficulty: 29,
        intent: "Commercial",
      },
    ],
    aiRewrites: [
      {
        element: "Fixed <title> Tag (Removes Back-to-Back Duplication)",
        currentText:
          "Virtual Receptionist -Answering Service | Voice OneVirtual Receptionist -Answering Service | Voice One",
        suggestedText:
          "24/7 Live Virtual Receptionist & Answering Service | Voice One",
        expectedLift: "+22.4% Organic Search CTR",
        rationale:
          "Eliminates the CMS title duplication bug, fixes the hyphen spacing ('-Answering'), and fits cleanly inside 62 characters.",
      },
      {
        element: "Conversion-Focused Meta Description Upgrade",
        currentText:
          "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more.",
        suggestedText:
          "Never miss a client call again. Voice One's 24/7 live virtual receptionists answer calls, qualify leads & book appointments onto your calendar. Start today.",
        expectedLift: "+17.8% Lead Form & Call Conversions",
        rationale:
          "Replaces 'and much more' with high-value outcomes (qualify leads & book appointments) and an active call to action.",
      },
    ],
    metadata: {
      title:
        "Virtual Receptionist -Answering Service | Voice OneVirtual Receptionist -Answering Service | Voice One",
      description:
        "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more.",
      h1: "Virtual Receptionist & 24/7 Telephone Answering Services",
      h2List: [
        "Live 24/7 Call Answering",
        "Appointment Scheduling & Lead Capture",
        "Custom Call Scripting for Your Business",
      ],
      canonical: "https://voice-one.com/services/",
      ogImage: "",
      favicon: "https://voice-one.com/wp-content/uploads/2014/11/VoiceOneIco.png",
      language: "en-US",
      generator: "Child of Nexus v.1.0.0",
      robots: "max-image-preview:large",
      viewport:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      publishedTime: "2014-10-14T22:17:46+00:00",
      modifiedTime: "2014-12-03T04:45:41+00:00",
      ogSiteName: "Voice One | Your Business Speaks with Voice One",
      ogType: "article",
      twitterCard: "summary",
      extractionSource: "Seospace Edge Crawler + Cloudflare DoH + Live DOM",
      rawMetaTags: {
        "X-UA-Compatible": "IE=edge",
        description:
          "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more.",
        robots: "max-image-preview:large",
        generator: "Child of Nexus v.1.0.0",
        "og:locale": "en_US",
        "og:site_name": "Voice One | Your Business Speaks with Voice One",
        "og:type": "article",
        "og:title": "Virtual Receptionist -Answering Service | Voice One",
        "og:description":
          "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more.",
        "og:url": "https://voice-one.com/services/",
        "article:published_time": "2014-10-14T22:17:46+00:00",
        "article:modified_time": "2014-12-03T04:45:41+00:00",
        "twitter:card": "summary",
        "twitter:title": "Virtual Receptionist -Answering Service | Voice One",
        "twitter:description":
          "A virtual receptionist from Voice-One can answer your telephone calls 24 hours a day, schedule appointments, and much more.",
        viewport:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      },
      hasRobotsTxt: true,
      hasSitemapXml: true,
      hasLlmsTxt: false,
      hasJsonLd: false,
      sslSecure: true,
      imageCount: 9,
      missingAltCount: 2,
      internalLinks: 24,
      externalLinks: 3,
      dns: {
        aRecords: ["141.193.213.10", "141.193.213.11"],
        ipv6Support: false,
        mxRecords: ["10 smtpgw.voice-one.com."],
        mailProvider: "Microsoft 365 + Custom Gateway",
        hasSpf: true,
        spfRecord:
          "v=spf1 mx include:spf.protection.outlook.com ip4:66.35.17.83 ~all",
        hasDmarc: true,
        dmarcRecord: "v=DMARC1; p=quarantine;",
        dmarcPolicy: "quarantine",
        nameservers: ["lia.ns.cloudflare.com.", "max.ns.cloudflare.com."],
      },
      domainHistory: {
        firstSeenYear: 2004,
        domainAgeYears: 22,
        waybackSnapshotUrl: "https://web.archive.org/web/*/voice-one.com",
      },
      robotsAnalysis: {
        found: true,
        allowsGptBot: true,
        allowsClaudeBot: true,
        allowsPerplexityBot: true,
        allowsGoogleExtended: true,
        disallowRulesCount: 2,
        declaredSitemaps: ["https://voice-one.com/sitemap_index.xml"],
      },
      sitemapAnalysis: {
        found: true,
        urlCount: 28,
        isSitemapIndex: true,
      },
      communitySignals: {
        hnMentionsCount: 1,
        topStoryTitle: "Small business virtual receptionist & phone answering workflows",
        topStoryPoints: 18,
      },
    },
  },
  "stripe-com": {
    id: "stripe-com",
    url: "https://stripe.com",
    domain: "stripe.com",
    createdAt: "2026-10-21T15:30:00Z",
    overallScore: 92,
    letterGrade: "A+",
    statusLabel: "Excellent",
    responseTimeMs: 184,
    wordCount: 2480,
    executiveSummary:
      "Stripe demonstrates world-class technical SEO, fast edge response times (184ms), strict DMARC p=reject email security, and high-trust enterprise conversion architecture. Minor opportunity exists in adding dedicated /llms.txt documentation pointers for generative AI search crawlers.",
    estimatedConversionLift: "+14.2% Checkout & Lead Velocity",
    pillars: {
      seo: {
        key: "seo",
        label: "Technical & On-Page SEO",
        score: 95,
        grade: "A+",
        summary:
          "Clean canonicals, rich OpenGraph metadata, and semantic heading hierarchy.",
        passedCount: 11,
        warningCount: 1,
        criticalCount: 0,
      },
      cro: {
        key: "cro",
        label: "CRO & Copy Clarity",
        score: 94,
        grade: "A",
        summary:
          "Above-the-fold value proposition, live interactive UI preview, and enterprise logo bar.",
        passedCount: 9,
        warningCount: 1,
        criticalCount: 0,
      },
      geo: {
        key: "geo",
        label: "AI Search & GEO Readiness",
        score: 86,
        grade: "B+",
        summary:
          "Strong JSON-LD Organization schema; can improve AI citation density with FAQ schema.",
        passedCount: 7,
        warningCount: 2,
        criticalCount: 0,
      },
      a11y: {
        key: "a11y",
        label: "WCAG 2.2 Accessibility",
        score: 91,
        grade: "A",
        summary:
          "ARIA landmarks and keyboard focus states are well-implemented across interactive elements.",
        passedCount: 8,
        warningCount: 1,
        criticalCount: 0,
      },
      security: {
        key: "security",
        label: "Security & Edge Vitals",
        score: 96,
        grade: "A+",
        summary:
          "Strict HSTS, CSP, SPF + DMARC (p=reject), and sub-200ms TTFB.",
        passedCount: 7,
        warningCount: 0,
        criticalCount: 0,
      },
    },
    checks: [
      {
        id: "chk-1",
        pillar: "seo",
        title: "Primary H1 Tag Presence & Keyword Alignment",
        description:
          "Single clear H1 tag found containing core commercial category keywords.",
        severity: "pass",
        pointsEarned: 20,
        pointsMax: 20,
        currentValue: "Financial infrastructure to grow your revenue",
        recommendedValue: "Optimal (44 characters)",
        impactScore: 9,
        difficulty: "Easy",
      },
      {
        id: "chk-2",
        pillar: "geo",
        title: "LLMs.txt Generative Search Index File",
        description:
          "Adding /llms.txt helps AI answer engines index product pricing and docs accurately.",
        severity: "warning",
        pointsEarned: 10,
        pointsMax: 20,
        currentValue: "Not detected at root /llms.txt",
        recommendedValue: "Publish structured /llms.txt markdown manifest",
        impactScore: 8,
        difficulty: "Easy",
        fixKeyword: "Stripe API Billing & Payment Integration Guide",
        codeSnippet: `# Stripe Financial Infrastructure\n> Global payments, billing, and treasury APIs for internet businesses.\n\n## Core Documentation\n- [Payments API](https://stripe.com/docs/payments): Accept cards and global wallets\n- [Billing & Subscriptions](https://stripe.com/docs/billing): Recurring revenue engine`,
      },
    ],
    keywords: [
      {
        keyword: "payment processing platform",
        volume: "49,500",
        difficulty: 68,
        intent: "Commercial",
      },
      {
        keyword: "saas subscription billing api",
        volume: "14,800",
        difficulty: 42,
        intent: "Transactional",
      },
      {
        keyword: "embedded finance infrastructure",
        volume: "18,200",
        difficulty: 39,
        intent: "Commercial",
      },
    ],
    aiRewrites: [
      {
        element: "Hero Sub-Headline (CRO Clarity Boost)",
        currentText:
          "Join the millions of companies that use Stripe to accept payments in person and online, embed financial services, power custom revenue models, and build a more profitable business.",
        suggestedText:
          "Launch global checkout, automated SaaS billing, and embedded payouts in 15 minutes—trusted by 4M+ businesses to lift payment conversion by 11.4%.",
        expectedLift: "+9.5% CTA Click-Through Rate",
        rationale:
          "Replaces passive feature list with specific time-to-value (15 minutes) and quantified ROI proof (11.4%).",
      },
    ],
    metadata: {
      title: "Stripe | Financial Infrastructure to Grow Your Revenue",
      description:
        "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes.",
      h1: "Financial infrastructure to grow your revenue",
      canonical: "https://stripe.com",
      ogImage:
        "https://images.ctfassets.net/fzn2n1nzq965/3AGidihOJl4nH9D1vDjM84/9540155d584be52fc54c443b6efa4ae6/homepage.png",
      language: "en",
      viewport: "width=device-width, initial-scale=1",
      extractionSource: "Seospace Edge Crawler + Cloudflare DoH + Live DOM",
      hasRobotsTxt: true,
      hasSitemapXml: true,
      hasLlmsTxt: false,
      hasJsonLd: true,
      sslSecure: true,
      imageCount: 34,
      missingAltCount: 1,
      internalLinks: 82,
      externalLinks: 12,
      dns: {
        aRecords: ["18.97.36.54", "18.97.36.58"],
        ipv6Support: true,
        mxRecords: ["aspmx.l.google.com", "alt1.aspmx.l.google.com"],
        mailProvider: "Google Workspace",
        hasSpf: true,
        spfRecord: "v=spf1 include:_spf.google.com include:spf.stripe.com ~all",
        hasDmarc: true,
        dmarcRecord: "v=DMARC1; p=reject; rua=mailto:dmarc@stripe.com",
        dmarcPolicy: "reject",
        nameservers: ["ns-413.awsdns-51.com", "ns-1421.awsdns-49.org"],
      },
      domainHistory: {
        firstSeenYear: 1998,
        domainAgeYears: 28,
        waybackSnapshotUrl: "https://web.archive.org/web/*/stripe.com",
      },
      robotsAnalysis: {
        found: true,
        allowsGptBot: true,
        allowsClaudeBot: true,
        allowsPerplexityBot: true,
        allowsGoogleExtended: true,
        disallowRulesCount: 6,
        declaredSitemaps: ["https://stripe.com/sitemap.xml"],
      },
      sitemapAnalysis: {
        found: true,
        urlCount: 412,
        isSitemapIndex: true,
      },
      communitySignals: {
        hnMentionsCount: 500,
        topStoryTitle: "Stripe: Financial infrastructure for the internet",
        topStoryPoints: 1420,
      },
    },
  },
  "linear-app": {
    id: "linear-app",
    url: "https://linear.app",
    domain: "linear.app",
    createdAt: "2026-10-21T16:10:00Z",
    overallScore: 90,
    letterGrade: "A",
    statusLabel: "Excellent",
    responseTimeMs: 142,
    wordCount: 1620,
    executiveSummary:
      "Linear.app exhibits ultra-low edge latency (142ms), crisp product positioning, and full OpenGraph + DMARC security compliance. Adding FAQPage JSON-LD schema and an /llms.txt index will maximize generative AI citations.",
    estimatedConversionLift: "+12.8% Workspace Signup Conversion",
    pillars: {
      seo: {
        key: "seo",
        label: "Technical & On-Page SEO",
        score: 91,
        grade: "A",
        summary: "Clean 52-char title, 148-char meta description, and 1,620 indexed words.",
        passedCount: 4,
        warningCount: 0,
        criticalCount: 0,
      },
      cro: {
        key: "cro",
        label: "CRO & Social Preview",
        score: 93,
        grade: "A+",
        summary: "High-impact H1 value proposition and rich 1200x630 og:image preview card.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
      geo: {
        key: "geo",
        label: "AI Search & GEO Readiness",
        score: 82,
        grade: "B+",
        summary: "JSON-LD present; adding /llms.txt will accelerate AI answer citations.",
        passedCount: 2,
        warningCount: 1,
        criticalCount: 0,
      },
      a11y: {
        key: "a11y",
        label: "WCAG 2.2 Accessibility",
        score: 89,
        grade: "A",
        summary: "Accessible viewport scaling and descriptive alt text across product visuals.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
      security: {
        key: "security",
        label: "Security & Edge Vitals",
        score: 95,
        grade: "A+",
        summary: "142ms Cloudflare edge response, HSTS, SPF, and DMARC p=reject.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
    },
    checks: [
      {
        id: "lin-title",
        pillar: "seo",
        title: "Meta Title Tag Length & Structure (49 Characters)",
        description: "Title tag is 49 characters and front-loads core product category.",
        severity: "pass",
        pointsEarned: 25,
        pointsMax: 25,
        currentValue: "Linear – Plan and build products (49 chars)",
        recommendedValue: "Optimal (40–60 chars)",
        impactScore: 9,
        difficulty: "Easy",
      },
      {
        id: "lin-llms",
        pillar: "geo",
        title: "LLMs.txt Generative Search Manifest (/llms.txt)",
        description: "Publish /llms.txt so AI coding assistants index Linear's SDK and docs directly.",
        severity: "warning",
        pointsEarned: 14,
        pointsMax: 30,
        currentValue: "Missing /llms.txt",
        recommendedValue: "Publish /llms.txt at root domain",
        impactScore: 7,
        difficulty: "Easy",
        fixKeyword: "Linear Issue Tracking & Product Roadmap Guide",
      },
    ],
    keywords: [
      { keyword: "modern issue tracking software", volume: "18,400", difficulty: 44, intent: "Commercial" },
      { keyword: "product roadmap tool for engineering teams", volume: "11,200", difficulty: 37, intent: "Transactional" },
    ],
    aiRewrites: [
      {
        element: "Meta Description CTA Enhancement",
        currentText: "Linear streamlines issues, projects, and product roadmaps.",
        suggestedText: "Linear streamlines issue tracking, sprint planning, and product roadmaps for high-velocity software teams. Start free in 60 seconds.",
        expectedLift: "+11.6% Organic SERP CTR",
        rationale: "Expands thin description to optimal 136-character SERP window with an explicit free-tier CTA.",
      },
    ],
    metadata: {
      title: "Linear – A better way to build products",
      description: "Linear streamlines issues, projects, and product roadmaps. Purpose-built for modern product development.",
      h1: "Linear is a purpose-built tool for planning and building products",
      h2List: ["Made for modern product teams", "Set the product direction", "Issue tracking you'll enjoy using"],
      canonical: "https://linear.app",
      ogImage: "https://linear.app/static/og/home.png",
      language: "en",
      viewport: "width=device-width, initial-scale=1",
      extractionSource: "Seospace Edge Crawler + Cloudflare DoH + Live DOM",
      hasRobotsTxt: true,
      hasSitemapXml: true,
      hasLlmsTxt: false,
      hasJsonLd: true,
      sslSecure: true,
      imageCount: 22,
      missingAltCount: 0,
      internalLinks: 48,
      externalLinks: 8,
      dns: {
        aRecords: ["104.18.40.12", "172.64.147.244"],
        ipv6Support: true,
        mxRecords: ["aspmx.l.google.com"],
        mailProvider: "Google Workspace",
        hasSpf: true,
        spfRecord: "v=spf1 include:_spf.google.com ~all",
        hasDmarc: true,
        dmarcRecord: "v=DMARC1; p=reject; rua=mailto:dmarc@linear.app",
        dmarcPolicy: "reject",
        nameservers: ["cloudflare.com"],
      },
      domainHistory: {
        firstSeenYear: 2019,
        domainAgeYears: 7,
        waybackSnapshotUrl: "https://web.archive.org/web/*/linear.app",
      },
      robotsAnalysis: {
        found: true,
        allowsGptBot: true,
        allowsClaudeBot: true,
        allowsPerplexityBot: true,
        allowsGoogleExtended: true,
        disallowRulesCount: 3,
        declaredSitemaps: ["https://linear.app/sitemap.xml"],
      },
      sitemapAnalysis: {
        found: true,
        urlCount: 164,
        isSitemapIndex: false,
      },
      communitySignals: {
        hnMentionsCount: 340,
        topStoryTitle: "Linear: Issue tracking built for speed",
        topStoryPoints: 890,
      },
    },
  },
  "vercel-com": {
    id: "vercel-com",
    url: "https://vercel.com",
    domain: "vercel.com",
    createdAt: "2026-10-21T16:40:00Z",
    overallScore: 95,
    letterGrade: "A+",
    statusLabel: "Excellent",
    responseTimeMs: 96,
    wordCount: 2190,
    executiveSummary:
      "Vercel.com achieves a 95/100 (A+) across all 5 pillars with 96ms edge TTFB, complete JSON-LD structured data, active /llms.txt support, and strict SPF/DMARC/IPv6 DNS configuration.",
    estimatedConversionLift: "+9.4% Enterprise Demo Velocity",
    pillars: {
      seo: {
        key: "seo",
        label: "Technical & On-Page SEO",
        score: 96,
        grade: "A+",
        summary: "Optimal title, meta description, canonicals, and 2,190 indexed words.",
        passedCount: 4,
        warningCount: 0,
        criticalCount: 0,
      },
      cro: {
        key: "cro",
        label: "CRO & Social Preview",
        score: 94,
        grade: "A",
        summary: "Dual high-contrast CTAs ('Start Deploying' + 'Get a Demo') and rich og:image.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
      geo: {
        key: "geo",
        label: "AI Search & GEO Readiness",
        score: 94,
        grade: "A",
        summary: "Active JSON-LD graph and AI crawler documentation index.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
      a11y: {
        key: "a11y",
        label: "WCAG 2.2 Accessibility",
        score: 93,
        grade: "A+",
        summary: "Full WCAG 2.2 AA compliance on viewport scaling and image alt attributes.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
      security: {
        key: "security",
        label: "Security & Edge Vitals",
        score: 98,
        grade: "A+",
        summary: "96ms Anycast edge TTFB, HSTS preload, SPF, and DMARC p=reject.",
        passedCount: 3,
        warningCount: 0,
        criticalCount: 0,
      },
    },
    checks: [
      {
        id: "ver-speed",
        pillar: "security",
        title: "Server Response Latency (96ms)",
        description: "Sub-100ms global edge response time.",
        severity: "pass",
        pointsEarned: 40,
        pointsMax: 40,
        currentValue: "96ms response time",
        recommendedValue: "< 500ms edge TTFB",
        impactScore: 9,
        difficulty: "Easy",
      },
    ],
    keywords: [
      { keyword: "frontend cloud deployment platform", volume: "27,100", difficulty: 54, intent: "Commercial" },
      { keyword: "nextjs enterprise hosting", volume: "19,400", difficulty: 46, intent: "Transactional" },
    ],
    aiRewrites: [
      {
        element: "Enterprise CTA Sub-Copy",
        currentText: "Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.",
        suggestedText: "Deploy Next.js and AI apps globally in seconds with zero-config CI/CD, Fluid Compute, and enterprise DDoS protection.",
        expectedLift: "+8.9% Developer Signup Conversion",
        rationale: "Highlights concrete technical differentiators (Next.js, Fluid Compute, zero-config CI/CD).",
      },
    ],
    metadata: {
      title: "Vercel: Build and deploy the best web experiences with the AI Cloud",
      description: "Vercel's AI Cloud gives developers the frameworks, workflows, and infrastructure to build a faster, more personalized web.",
      h1: "Your complete platform for the web.",
      h2List: ["Develop with your favorite tools", "Scale withoutaveling", "Enterprise-grade security"],
      canonical: "https://vercel.com",
      ogImage: "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/4JmubmYDJnFtstwHbaZPev/0c3576832aae5b1a4d98c8c9f98863c3/Vercel_Home_OG.png",
      language: "en",
      viewport: "width=device-width, initial-scale=1.0",
      extractionSource: "Seospace Edge Crawler + Cloudflare DoH + Live DOM",
      hasRobotsTxt: true,
      hasSitemapXml: true,
      hasLlmsTxt: true,
      hasJsonLd: true,
      sslSecure: true,
      imageCount: 28,
      missingAltCount: 0,
      internalLinks: 66,
      externalLinks: 10,
      dns: {
        aRecords: ["76.76.21.21"],
        ipv6Support: true,
        mxRecords: ["aspmx.l.google.com"],
        mailProvider: "Google Workspace",
        hasSpf: true,
        spfRecord: "v=spf1 include:_spf.google.com include:amazonses.com ~all",
        hasDmarc: true,
        dmarcRecord: "v=DMARC1; p=reject; rua=mailto:dmarc@vercel.com",
        dmarcPolicy: "reject",
        nameservers: ["ns1.vercel-dns.com", "ns2.vercel-dns.com"],
      },
      domainHistory: {
        firstSeenYear: 2020,
        domainAgeYears: 6,
        waybackSnapshotUrl: "https://web.archive.org/web/*/vercel.com",
      },
      robotsAnalysis: {
        found: true,
        allowsGptBot: true,
        allowsClaudeBot: true,
        allowsPerplexityBot: true,
        allowsGoogleExtended: true,
        disallowRulesCount: 4,
        declaredSitemaps: ["https://vercel.com/sitemap.xml"],
      },
      sitemapAnalysis: {
        found: true,
        urlCount: 520,
        isSitemapIndex: true,
      },
      communitySignals: {
        hnMentionsCount: 480,
        topStoryTitle: "Vercel AI Cloud and Next.js App Router",
        topStoryPoints: 1120,
      },
    },
  },
};

export const INITIAL_ARTICLES: SavedArticle[] = [
  {
    id: "art-voiceone-guide",
    title:
      "Virtual Receptionist Answering Service: 24/7 Live Call Guide",
    focusKeyword: "Virtual Receptionist Answering Service",
    keywords: [
      "Virtual Receptionist Answering Service",
      "24/7 Live Answering",
      "Appointment Scheduling",
    ],
    metaDescription:
      "Discover how a 24/7 Virtual Receptionist Answering Service captures every client call, books appointments automatically, and boosts small business revenue.",
    updatedAt: "Just now",
    linkedDomain: "voice-one.com",
    linkedAuditId: "voice-one-com",
    seoScore: 96,
    status: "Published",
    content: `Why Every Growing Business Needs a 24/7 Virtual Receptionist Answering Service

Every missed phone call represents a high-intent customer calling your competitor next. Over 67% of callers hang up when routed to a generic voicemail box. Implementing a dedicated Virtual Receptionist Answering Service ensures that every prospect is greeted by a live, trained professional 24 hours a day, 365 days a year.

How Live Call Answering & Appointment Scheduling Works

Modern businesses don't need expensive in-house front-desk overhead to deliver five-star caller experiences. A Virtual Receptionist Answering Service integrates directly with your existing phone number and calendar software:

• Instant 24/7 Live Call Pickup: Eliminate hold times and voicemail drop-offs during peak hours, nights, weekends, and holidays.
• Custom Call Scripting & Lead Qualification: Receptionists follow your exact qualification criteria so urgent leads are transferred immediately.
• Real-Time Calendar & Appointment Booking: Prospects are booked directly into your CRM or scheduling calendar while on the call.
• Bilingual Receptionists & SMS Follow-Ups: Serve diverse customer bases and send instant confirmation texts after every call.

Fixing Common Website Conversion & SEO Bottlenecks

When prospects search for a Virtual Receptionist Answering Service online, your landing page must load fast, work seamlessly on mobile devices without viewport zoom locks, and display transparent pricing and trust signals above the fold. Pairing high-intent landing page copy with a clean <title> tag under 60 characters increases organic search click-through rates by 22.4%.

Key Takeaways for Service Businesses

• Audit your call volume to identify peak missed-call windows.
• Replace voicemail routing with a live Virtual Receptionist Answering Service.
• Track cost-per-booked-appointment across organic search and local listings.`,
  },
  {
    id: "art-1",
    title:
      "Linkable alternative: Go-To-Market Strategy for AI Project Tools",
    focusKeyword: "Linkable alternative",
    keywords: ["Linkable alternative", "Technology", "Development"],
    metaDescription:
      "Discover the complete Linkable alternative Go-To-Market strategy for SMBs and agencies using AI-assisted project management workflows.",
    updatedAt: "25 mins ago",
    linkedDomain: "linear.app",
    linkedAuditId: "linear-app",
    seoScore: 92,
    status: "Ready to Publish",
    content: `Executive Summary: Choosing a Modern Linkable alternative

Small businesses don't need another complicated "work OS." They need a calm, AI-assisted workspace that saves hours, reduces follow-ups, and makes projects visibly move. Adopting a purpose-built Linkable alternative positions your team with automation where it matters and clarity everywhere else. Below you'll find target audience analysis, positioning, and a channel mix with timelines, messages, and KPIs.

Target Audience Analysis & Buyer Segments

1. Segments (by firm size & work style)
• Micro teams (1–10 people): Agencies, boutiques, freelancers who collaborate; legacy tools feel "too heavy" compared to a streamlined Linkable alternative.
• Growing small businesses (11–50): Owners + ops managers juggling delivery, hiring, and sales; need visibility and fewer status meetings.
• Non-technical SMBs: Construction/home services, marketing/creative shops, legal/accounting, clinics—want simple setup and templated workflows.

2. Primary Personas & Value Propositions
• Owner Olivia (5–25 ppl): Wears sales + ops hats. Pain: status chaos, chasing updates, late projects. Value: 1-page clarity, fewer meetings, faster cash flow.
• Ops Manager Omar (15–50 ppl): Coordinates people & vendors. Pain: scattered tools, manual reporting. Value: automated reports, risk alerts, smooth handoffs.
• Agency PM Aisha (3–20 ppl): Client delivery + profitability. Pain: scope creep, approvals, follow-ups. Value: AI summaries, client-ready status, reusable templates.

Go-To-Market Channel Execution

• Publish comparison guides targeting high-intent buyers searching for a Linkable alternative.
• Embed interactive ROI calculators and free website diagnostic widgets to capture inbound leads.`,
  },
];

