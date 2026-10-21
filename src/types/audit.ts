export type AuditSeverity = "pass" | "warning" | "critical";

export type PillarKey = "seo" | "cro" | "geo" | "a11y" | "security";

export interface AuditCheckItem {
  id: string;
  pillar: PillarKey;
  title: string;
  description: string;
  severity: AuditSeverity;
  pointsEarned: number;
  pointsMax: number;
  currentValue?: string;
  recommendedValue?: string;
  impactScore: number; // 1-10
  difficulty: "Easy" | "Medium" | "Hard";
  codeSnippet?: string;
  fixKeyword?: string; // Connects an audit check directly to the AI Article Generator!
}

export interface PillarScore {
  key: PillarKey;
  label: string;
  score: number; // 0-100 strictly calculated from pointsEarned / pointsMax
  grade: string;
  summary: string;
  passedCount: number;
  warningCount: number;
  criticalCount: number;
}

export interface KeywordOpportunity {
  keyword: string;
  volume: string;
  difficulty: number;
  intent: "Commercial" | "Transactional" | "Informational";
}

export interface AiRewriteSuggestion {
  element: string;
  currentText: string;
  suggestedText: string;
  expectedLift: string;
  rationale: string;
}

export interface AuditReport {
  id: string;
  url: string;
  domain: string;
  createdAt: string;
  overallScore: number;
  letterGrade: string;
  statusLabel: "Excellent" | "Optimal" | "Needs Attention" | "Critical Risk";
  responseTimeMs: number;
  wordCount: number;
  executiveSummary: string;
  estimatedConversionLift: string;
  pillars: Record<PillarKey, PillarScore>;
  checks: AuditCheckItem[];
  keywords: KeywordOpportunity[];
  aiRewrites: AiRewriteSuggestion[];
  metadata: {
    title: string;
    description: string;
    h1: string;
    h2List?: string[];
    canonical: string;
    ogImage: string;
    favicon?: string;
    language?: string;
    author?: string;
    generator?: string;
    robots?: string;
    viewport?: string;
    publishedTime?: string;
    modifiedTime?: string;
    ogSiteName?: string;
    ogType?: string;
    twitterCard?: string;
    rawMetaTags?: Record<string, string>;
    extractionSource?: "RapidAPI + Live DOM" | "Live DOM";
    hasRobotsTxt: boolean;
    hasSitemapXml: boolean;
    hasLlmsTxt: boolean;
    hasJsonLd: boolean;
    sslSecure: boolean;
    imageCount: number;
    missingAltCount: number;
    internalLinks: number;
    externalLinks: number;
  };
}

export interface WhiteLabelConfig {
  agencyName: string;
  logoText: string;
  primaryColor: string;
  accentColor: string;
  ctaText: string;
  ctaUrl: string;
  contactEmail: string;
  footerNote: string;
  hidePoweredBy: boolean;
}

export interface CapturedLead {
  id: string;
  name: string;
  email: string;
  websiteUrl: string;
  auditScore: number;
  createdAt: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
}
