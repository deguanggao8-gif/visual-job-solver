import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export const dynamic = "force-static";

const ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/cooling/germany-apartment", priority: 0.9 },
  { path: "/cooling/klimaanlage-mietwohnung-ohne-bohren/", priority: 0.8 },
  { path: "/tool-selector/concrete-drilling", priority: 0.9 },
  { path: "/jobs/drill-holes-in-concrete", priority: 0.9 },
  { path: "/guides/hammer-drill-vs-rotary-hammer", priority: 0.8 },
  { path: "/guides/sds-plus-vs-sds-max", priority: 0.8 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-04");
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r.path === "/" ? "" : r.path}`,
    lastModified: r.path === "/" || r.path.startsWith("/cooling/") ? new Date("2026-09-29") : lastModified,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}
