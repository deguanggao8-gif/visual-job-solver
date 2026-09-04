# Visual Job Solver — V0.1

Start with the job, not the product. V0.1 is a static, evidence-based
**decision guide and screener** for concrete drilling: it explains what the
frozen manufacturer evidence can and cannot determine for your job, and what to
verify next. It never approves tools and never fabricates an "exact tool".

Rules and content are frozen copies of the V0.1 evidence set and are verified
byte-for-byte against the source on every build.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm test            # rule-engine tests (3-state safety + no-fabrication sweep)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # frozen-data verify → production build → static export (out/)
```

The build fails if `data/rules` / `data/content` drift from the frozen source
in `research/v0.1/`.

## Production configuration

Set a single environment variable to the production origin before building:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

- Drives `canonical`, Open Graph, `sitemap.xml` and `robots.txt` URLs.
- **Required** for `npm run build`. Without it the production build refuses to
  run rather than emit incorrect URLs. `next dev` is unaffected.
- Copy `.env.example` to `.env.local` (or set it in your host's dashboard) and
  configure the real domain before deploying.

## Deployment notes

- **Static-first Next.js site** (`output: "export"`, `trailingSlash: true`) —
  the output in `out/` is plain HTML/CSS/JS.
- **No database, no external runtime API, no secrets** required for V0.1.
- Rules, content and all sources are local and frozen; there is nothing to
  fetch at runtime.
- **The production site URL must be configured correctly** (see above) or
  canonical/sitemap metadata will be wrong.
- Deploy the `out/` directory to any static host (e.g. Vercel, Netlify, GitHub
  Pages, an S3/CDN bucket). No server runtime or env vars are needed at request
  time — the URL is resolved once at build time.
