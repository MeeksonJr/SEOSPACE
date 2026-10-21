import { AuditReport } from "@/types/audit";
import { generateGeminiJson } from "@/lib/ai/gemini-client";

interface GeminiAuditEnrichment {
  executiveSummary: string;
  estimatedConversionLift: string;
  keywords: Array<{
    keyword: string;
    volume: string;
    difficulty: number;
    intent: "Commercial" | "Transactional" | "Informational";
  }>;
  aiRewrites: Array<{
    element: string;
    currentText: string;
    suggestedText: string;
    expectedLift: string;
    rationale: string;
  }>;
}

export async function enrichReportWithGemini(
  baseReport: AuditReport,
  bodyExcerpt = ""
): Promise<AuditReport> {
  const prompt = `You are an elite B2B SaaS Conversion Rate Optimization (CRO), Technical SEO, and AI Search (GEO) Principal Auditor.
Analyze this REAL website diagnostic scan and return ONLY valid JSON to enrich the audit report.
Be highly specific to the actual domain, its detected title, H1, description, and body text excerpt—never use generic placeholders!

Domain: ${baseReport.domain}
URL: ${baseReport.url}
Overall Score: ${baseReport.overallScore}/100 (${baseReport.letterGrade})
Response Time: ${baseReport.responseTimeMs}ms
Word Count: ${baseReport.wordCount}
Detected Meta Title: ${baseReport.metadata.title}
Detected Meta Description: ${baseReport.metadata.description}
Detected Primary H1: ${baseReport.metadata.h1}
Total Images: ${baseReport.metadata.imageCount} (Missing Alt Text: ${baseReport.metadata.missingAltCount})
Internal Links: ${baseReport.metadata.internalLinks} | External Links: ${baseReport.metadata.externalLinks}
Has JSON-LD Schema: ${baseReport.metadata.hasJsonLd}
Has /llms.txt AI Manifest: ${baseReport.metadata.hasLlmsTxt}
Live Page Body Excerpt: "${bodyExcerpt.slice(0, 900)}"

Return a JSON object with this exact shape:
{
  "executiveSummary": "3 specific, authoritative sentences analyzing ${baseReport.domain}'s exact positioning, technical SEO strengths/gaps, and top conversion rate optimization lever.",
  "estimatedConversionLift": "+XX.X% Projected Conversion & Organic Lift",
  "keywords": [
    { "keyword": "specific niche keyword 1 for ${baseReport.domain}", "volume": "14,200", "difficulty": 34, "intent": "Commercial" },
    { "keyword": "specific niche keyword 2 for ${baseReport.domain}", "volume": "8,900", "difficulty": 29, "intent": "Transactional" },
    { "keyword": "specific niche keyword 3 for ${baseReport.domain}", "volume": "21,500", "difficulty": 46, "intent": "Commercial" },
    { "keyword": "specific niche keyword 4 for ${baseReport.domain}", "volume": "6,400", "difficulty": 24, "intent": "Informational" }
  ],
  "aiRewrites": [
    {
      "element": "Hero H1 Headline (CRO Conversion Upgrade)",
      "currentText": ${JSON.stringify(baseReport.metadata.h1 || baseReport.metadata.title)},
      "suggestedText": "A punchy, specific, high-converting H1 headline tailored specifically to ${baseReport.domain}'s actual product/service",
      "expectedLift": "+19.4% Above-the-Fold Engagement",
      "rationale": "1 specific sentence explaining why this new H1 converts better for ${baseReport.domain}'s visitors."
    },
    {
      "element": "SEO Meta Description (SERP CTR Magnet)",
      "currentText": ${JSON.stringify(baseReport.metadata.description || "Missing meta description")},
      "suggestedText": "A compelling 145-155 character meta description tailored specifically to ${baseReport.domain} with a clear call-to-action",
      "expectedLift": "+16.8% Organic SERP CTR",
      "rationale": "1 specific sentence explaining how this improves Google & AI search click-through rates."
    }
  ]
}`;

  const { data } = await generateGeminiJson<GeminiAuditEnrichment>(prompt, 0.35);

  if (!data) {
    return baseReport;
  }

  return {
    ...baseReport,
    executiveSummary: data.executiveSummary || baseReport.executiveSummary,
    estimatedConversionLift:
      data.estimatedConversionLift || baseReport.estimatedConversionLift,
    keywords:
      Array.isArray(data.keywords) && data.keywords.length > 0
        ? data.keywords
        : baseReport.keywords,
    aiRewrites:
      Array.isArray(data.aiRewrites) && data.aiRewrites.length > 0
        ? data.aiRewrites
        : baseReport.aiRewrites,
  };
}
