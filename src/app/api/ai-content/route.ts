import { NextRequest, NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/ai/gemini-client";

interface AiContentResult {
  optimizedTitle: string;
  optimizedContent: string;
  metaDescription: string;
  suggestedKeywords?: string[];
  faqSchemaSnippet?: string;
  summaryNote: string;
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, focusKeyword, action, topicPrompt, linkedDomain } =
      await req.json();

    const kw = (focusKeyword || topicPrompt || "AI SEO Strategy").trim();
    const domainContext = linkedDomain
      ? `\nTarget Website Domain being optimized: "${linkedDomain}". Tailor examples, terminology, and recommendations to help "${linkedDomain}" rank #1 on Google and AI Search engines.`
      : "";

    let prompt = "";

    if (action === "generate_article") {
      prompt = `You are Seospace Neural Engine v4.2, an elite B2B SEO & Conversion Copywriter.${domainContext}
Write a comprehensive, publication-ready, high-ranking SEO article/guide about: "${
        topicPrompt || title || kw
      }".
Target Focus Keyword: "${kw}".

CRITICAL MATHEMATICAL SEO GRADING RULES (Must pass all 7 checks):
1. "optimizedTitle" MUST start with the exact focus keyword "${kw}" and be strictly between 38 and 58 characters long.
2. "optimizedContent" MUST be a rich, structured, multi-section article (at least 450-650 words) using clear markdown section headings (## Heading), bullet points (•), concrete metrics, and naturally including "${kw}" at least 4 times (1.0% - 2.2% keyword density).
3. "metaDescription" MUST be strictly 130-156 characters and include the exact focus keyword "${kw}".
4. Include 4 relevant "suggestedKeywords".

Return ONLY valid JSON matching:
{
  "optimizedTitle": "${kw}: ...",
  "optimizedContent": "Full multi-section article text with ## headings and • bullet points...",
  "metaDescription": "145-char meta description containing ${kw}...",
  "suggestedKeywords": ["${kw}", "related kw 2", "related kw 3", "related kw 4"],
  "summaryNote": "Generated full SEO-optimized article via Seospace Neural Engine with focus keyword front-loaded in H1, meta description, and body."
}`;
    } else if (action === "expand") {
      prompt = `You are Seospace Neural Engine v4.2.${domainContext}
Expand the following article with a high-impact tactical implementation section, real-world ROI benchmarks, and a 3-question FAQ section at the end using ## headings and • bullet points. Ensure the focus keyword "${kw}" is naturally reinforced (at least 4 total occurrences across the article).

Current Title: ${title}
Focus Keyword: ${kw}
Current Content:
${content}

Return ONLY valid JSON:
{
  "optimizedTitle": ${JSON.stringify(title)},
  "optimizedContent": "The full original content PLUS the newly appended deep-dive tactical section and 3-question FAQ...",
  "metaDescription": "145-char SEO meta description including ${kw}",
  "summaryNote": "Appended tactical playbook section + 3-question FAQ block for AI Search (GEO) citations."
}`;
    } else {
      prompt = `You are Seospace Neural Engine v4.2, an expert SEO & Conversion Copywriter.${domainContext}
Optimize this article so it achieves a 95+/100 Mathematical SEO Score:
1. Rewrite "optimizedTitle" so it begins with the exact focus keyword "${kw}" and is strictly between 38 and 58 characters long!
2. Enhance "optimizedContent" (at least 420+ words) with ## subheadings and • bullet points so "${kw}" appears naturally in the opening paragraph, subheadings, and body (at least 4 occurrences).
3. Write a 135-156 character "metaDescription" containing "${kw}".

Current Title: ${title}
Focus Keyword: ${kw}
Current Content:
${content}

Return ONLY valid JSON:
{
  "optimizedTitle": "${kw}: ...",
  "optimizedContent": "Improved full article content...",
  "metaDescription": "Compelling 148-character meta description...",
  "summaryNote": "Front-loaded '${kw}' at start of H1 title (under 60 chars), added ## subheadings, and calibrated keyword density."
}`;
    }

    const { data, modelUsed, latencyMs, error } =
      await generateGeminiJson<AiContentResult>(prompt, 0.4);

    if (data && data.optimizedTitle && data.optimizedContent) {
      return NextResponse.json({
        ...data,
        modelUsed,
        latencyMs,
      });
    }

    return NextResponse.json(
      { error: error || "Seospace Neural Engine did not return content." },
      { status: 500 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unable to process AI request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
