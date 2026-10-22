import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://seospace-kappa.vercel.app";
  const lastModified = new Date();

  const routes: Array<{
    path: string;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/dashboard", changeFrequency: "daily", priority: 0.95 },
    { path: "/compare", changeFrequency: "daily", priority: 0.9 },
    { path: "/tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.85 },
    { path: "/widget", changeFrequency: "weekly", priority: 0.85 },
    { path: "/report/voice-one-com", changeFrequency: "daily", priority: 0.85 },
    { path: "/report/stripe-com", changeFrequency: "weekly", priority: 0.85 },
    {
      path: "/article/art-voiceone-guide",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { path: "/security", changeFrequency: "monthly", priority: 0.75 },
    { path: "/legal/privacy", changeFrequency: "monthly", priority: 0.7 },
    { path: "/legal/terms", changeFrequency: "monthly", priority: 0.7 },
    { path: "/login", changeFrequency: "monthly", priority: 0.6 },
    { path: "/signup", changeFrequency: "monthly", priority: 0.65 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
