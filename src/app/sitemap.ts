import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trustpulse-ai.vercel.app";
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
    { path: "/dashboard/shield", changeFrequency: "daily", priority: 0.9 },
    { path: "/dashboard/widgets", changeFrequency: "daily", priority: 0.9 },
    { path: "/dashboard/qr-studio", changeFrequency: "weekly", priority: 0.85 },
    { path: "/dashboard/ai-replies", changeFrequency: "weekly", priority: 0.85 },
    { path: "/dashboard/agency", changeFrequency: "weekly", priority: 0.85 },
    { path: "/r/apex-dental", changeFrequency: "daily", priority: 0.9 },
    { path: "/r/bayview-auto", changeFrequency: "daily", priority: 0.85 },
    { path: "/embed/widget-apex-wall", changeFrequency: "weekly", priority: 0.8 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.8 },
    { path: "/security", changeFrequency: "monthly", priority: 0.75 },
    { path: "/legal/privacy", changeFrequency: "monthly", priority: 0.7 },
    { path: "/legal/terms", changeFrequency: "monthly", priority: 0.7 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
