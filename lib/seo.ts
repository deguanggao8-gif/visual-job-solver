/**
 * Site-wide constants used for metadata, canonical URLs, Open Graph and the
 * generated sitemap/robots.
 *
 * The production origin is supplied at build time via NEXT_PUBLIC_SITE_URL so
 * the shipped export never contains a guessed or placeholder domain. A
 * production build that omits it is refused in next.config.mjs.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  // Dev-only fallback; never reaches a production export (build guard).
  return "http://localhost:3000";
}

export const SITE = {
  name: "Visual Job Solver",
  url: resolveSiteUrl(),
  tagline: "Start with the job, not the product.",
  description:
    "Start with the job, not the product. Understand what your concrete drilling job requires, what the evidence can and cannot determine, and what to verify next.",
} as const;

/** Absolute URL for a site path ('' or '/about'). */
export function absolute(path: string) {
  const clean = path && path !== "" ? (path.startsWith("/") ? path : `/${path}`) : "/";
  return `${SITE.url}${clean === "/" ? "/" : clean}`;
}

/** <title> content, e.g. "Concrete Drilling | Visual Job Solver". */
export function pageTitle(section?: string) {
  return section ? `${section} | ${SITE.name}` : SITE.name;
}
