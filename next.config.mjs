/** @type {import('next').NextConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// V0.1 is fully static: canonical, Open Graph, robots and sitemap URLs are all
// derived from one origin at build time. A production export built without an
// explicit origin would bake a guessed or localhost domain into shipped
// metadata, so refuse to build rather than guess. `next dev` is unaffected
// (it falls back to http://localhost:3000 in lib/seo.ts).
if (process.env.NODE_ENV === "production" && !siteUrl) {
  throw new Error(
    "[release] NEXT_PUBLIC_SITE_URL is not set. " +
      "Set it to your production origin before building, e.g. " +
      'NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build ' +
      "(see README.md)."
  );
}

const nextConfig = {
  // V0.1 is a fully static, crawlable site: rules + content are local and frozen.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Keep file tracing inside this checkout when the repository is used as a
  // Git worktree beneath a directory that also contains unrelated lockfiles.
  outputFileTracingRoot: process.cwd(),
  eslint: { dirs: ["app", "components", "lib", "tests"] },
};

export default nextConfig;
