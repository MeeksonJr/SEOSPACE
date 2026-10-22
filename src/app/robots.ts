import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://seospace-kappa.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dashboard",
          "/compare",
          "/tools",
          "/docs",
          "/widget",
          "/report/",
          "/article/",
          "/legal/",
          "/security",
          "/llms.txt",
        ],
        disallow: ["/api/stripe/webhook"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: ["/", "/compare", "/tools", "/docs", "/report/", "/article/", "/llms.txt"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
