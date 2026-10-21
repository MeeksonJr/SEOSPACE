import { GoogleGenAI } from "@google/genai";

const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
];

export async function generateGeminiJson<T>(
  prompt: string,
  temperature = 0.35
): Promise<{
  data: T | null;
  modelUsed: string;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_FALLBACK,
  ].filter((k, idx, arr): k is string =>
    Boolean(k && k.trim().length > 10 && arr.indexOf(k) === idx)
  );

  let lastError = "";

  for (const apiKey of keys) {
    const ai = new GoogleGenAI({ apiKey });
    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature,
          },
        });

        const rawText = res.text?.trim();
        if (!rawText) continue;

        const cleaned = rawText
          .replace(/^```json\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();

        const parsed = JSON.parse(cleaned) as T;
        return {
          data: parsed,
          modelUsed: "Seospace Neural Engine v4.2",
          latencyMs: Date.now() - start,
        };
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
        continue;
      }
    }
  }

  return {
    data: null,
    modelUsed: "Seospace Core Engine",
    latencyMs: Date.now() - start,
    error: lastError,
  };
}
