import Link from "next/link";
import { SITE } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";
import Callout from "@/components/ui/Callout";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container page page-narrow">
        <section className="page-hero">
          <h1>What are you trying to do?</h1>
          <p className="lead">
            Not sure which tool you need? Start with the job, not the brand.
          </p>
          <p>
            Tell us about the work and we’ll help you understand what your job
            requires, what the manufacturer evidence can and cannot determine,
            and what to check next. Start with{" "}
            <strong>drilling holes in concrete</strong>, or check cooling options for a German apartment.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/tool-selector/concrete-drilling">
              Check what your concrete drilling job requires
            </Link>
            <Link className="btn btn-secondary" href="/jobs/drill-holes-in-concrete">
              Drill holes in concrete
            </Link>
          </div>
          <p className="small">
            Have a job to discuss? <Link href="/contact">Submit a job</Link>.
          </p>
        </section>

        <section aria-labelledby="h-cooling"><div className="card"><span className="chip">Germany · Beta</span><h2 id="h-cooling">Cool your apartment</h2><p>Check your window, installation permissions and outdoor space before buying an AC. Compare three cooling categories and the checks each one needs.</p><Link className="btn" href="/cooling/germany-apartment">Check my cooling setup</Link></div></section>
        <section aria-labelledby="h-what">
          <h2 id="h-what">How this site helps</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>1. Describe the job</h3>
              <p>
                Material, how you’ll drill, hole size, depth and workload — the
                conditions that actually matter.
              </p>
            </div>
            <div className="card">
              <h3>2. See what the evidence can tell you</h3>
              <p>
                Understand which tool choices are genuinely supported and why
                simple “size = tool” rules can be misleading.
              </p>
            </div>
            <div className="card">
              <h3>3. Verify before you drill</h3>
              <p>
                Get a practical list of what to confirm against the specific
                manufacturer’s stated capability before you proceed.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="h-guides">
          <h2 id="h-guides">Understand your concrete drilling job</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>
                <Link href="/guides/hammer-drill-vs-rotary-hammer">
                  Hammer Drill vs Rotary Hammer
                </Link>
              </h3>
              <p>
                How the tool categories differ, why names alone don’t classify
                a tool, and why “concrete always means rotary hammer” is wrong.
              </p>
            </div>
            <div className="card">
              <h3>
                <Link href="/guides/sds-plus-vs-sds-max">SDS-Plus vs SDS-Max</Link>
              </h3>
              <p>
                What SDS actually is (a holder interface, not a tool type) and
                why there is no universal switch-over diameter.
              </p>
            </div>
            <div className="card">
              <h3>
                <Link href="/jobs/drill-holes-in-concrete">Drill holes in concrete</Link>
              </h3>
              <p>
                Bits, working length, dust extraction and the safety checks
                before and during drilling.
              </p>
            </div>
          </div>
        </section>

        <section>
          <Callout tone="limit" title="What this site is not">
            <p>
              This is not a shop, a brand’s sales page or an automatic “exact
              tool for your job” engine. It does not approve tools or drilling
              locations, and it makes no structural or dust-exposure compliance
              claims. Where evidence is insufficient it says so — and tells you
              what to verify next.
            </p>
          </Callout>
        </section>
      </div>
    </>
  );
}
