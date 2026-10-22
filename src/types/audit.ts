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

export interface DnsIntelligence {
  aRecords: string[];
  ipv6Support: boolean;
  mxRecords: string[];
  mailProvider: string;
  hasSpf: boolean;
  spfRecord: string;
  hasDmarc: boolean;
  dmarcRecord: string;
  dmarcPolicy: string;
  nameservers: string[];
}

export interface DomainHistory {
  firstSeenYear: number | null;
  domainAgeYears: number | null;
  waybackSnapshotUrl: string | null;
}

export interface RobotsAnalysis {
  found: boolean;
  allowsGptBot: boolean;
  allowsClaudeBot: boolean;
  allowsPerplexityBot: boolean;
  allowsGoogleExtended: boolean;
  disallowRulesCount: number;
  declaredSitemaps: string[];
}

export interface SitemapAnalysis {
  found: boolean;
  urlCount: number;
  isSitemapIndex: boolean;
}

export interface CommunitySignals {
  hnMentionsCount: number;
  topStoryTitle?: string;
  topStoryPoints?: number;
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
    extractionSource?:
      | "Seospace Edge Crawler + Cloudflare DoH + Live DOM"
      | "Seospace Distributed DOM Engine + Cloudflare DoH"
      | "Seospace Edge Crawler + DOM"
      | "RapidAPI + Cloudflare DoH + Live DOM"
      | "RapidAPI + Live DOM"
      | "Cloudflare DoH + Live DOM"
      | "Live DOM"
      | string;
    hasRobotsTxt: boolean;
    hasSitemapXml: boolean;
    hasLlmsTxt: boolean;
    hasJsonLd: boolean;
    sslSecure: boolean;
    imageCount: number;
    missingAltCount: number;
    internalLinks: number;
    externalLinks: number;
    dns?: DnsIntelligence;
    domainHistory?: DomainHistory;
    robotsAnalysis?: RobotsAnalysis;
    sitemapAnalysis?: SitemapAnalysis;
    communitySignals?: CommunitySignals;
  };
}

export interface DomainComparisonRecord {
  id: string;
  primaryUrl: string;
  competitorUrl: string;
  primaryDomain: string;
  competitorDomain: string;
  primaryScore: number;
  competitorScore: number;
  winnerDomain: string;
  scoreDelta: number;
  createdAt: string;
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
  webhookUrl?: string;
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

export interface SavedArticle {
  id: string;
  title: string;
  focusKeyword: string;
  keywords: string[];
  metaDescription: string;
  content: string;
  updatedAt: string;
  linkedDomain?: string;
  linkedAuditId?: string;
  seoScore?: number;
  status?: string;
}

