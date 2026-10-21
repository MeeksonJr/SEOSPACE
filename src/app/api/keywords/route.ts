import { NextRequest, NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/ai/gemini-client";

export interface LiveKeywordResult {
  keyword: string;
  volume: string;
  cpc: string;
  difficulty: number;
  intent: "Commercial" | "Transactional" | "Informational";
  topicTitle: string;
}

interface KeywordApiResponse {
  keywords: LiveKeywordResult[];
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const seed = (query || "AI SEO & Content Marketing").trim();

    const prompt = `You are an elite SEO & SEM Keyword Strategist.
The user searched for the topic, niche, or domain: "${seed}".
Generate 6 high-opportunity, realistic search keywords specifically tailored to "${seed}".

Return ONLY valid JSON with this exact structure:
{
  "keywords": [
    {
      "keyword": "specific long-tail or commercial keyword 1",
      "volume": "14,800",
      "cpc": "$5.40",
      "difficulty": 34,
      "intent": "Commercial",
      "topicTitle": "Compelling 55-char SEO article title starting with this keyword"
    }
  ]
}`;

    const { data, modelUsed, latencyMs } =
      await generateGeminiJson<KeywordApiResponse>(prompt, 0.4);

    if (data?.keywords && Array.isArray(data.keywords) && data.keywords.length > 0) {
      return NextResponse.json({
        keywords: data.keywords,
        modelUsed,
        latencyMs,
      });
    }

    return NextResponse.json(
      { error: "Unable to fetch live keyword data." },
      { status: 500 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Keyword research failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
