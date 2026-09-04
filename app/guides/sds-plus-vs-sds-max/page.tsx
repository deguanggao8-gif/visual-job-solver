import type { Metadata } from "next";
import Link from "next/link";
import { absolute } from "@/lib/seo";
import { sectionHtmlFor } from "@/lib/content";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Prose from "@/components/ui/Prose";
import SourceList from "@/components/ui/SourceList";
import Faq from "@/components/ui/Faq";
import { faqJsonLd } from "@/components/ui/FaqJsonLd";
import JsonLd from "@/components/ui/JsonLd";
import LearnLinks from "@/components/ui/LearnLinks";

export const metadata: Metadata = {
  title: "SDS-Plus vs SDS-Max",
  description:
    "What SDS actually means: SDS-Plus and SDS-Max are holder interfaces, not tool types, and there is no universal diameter at which every job must switch.",
  alternates: { canonical: "/guides/sds-plus-vs-sds-max" },
  openGraph: { type: "article", url: absolute("/guides/sds-plus-vs-sds-max") },
};

const FAQ = [
  {
    q: "What does SDS actually mean?",
    a: "SDS-Plus and SDS-Max describe the accessory shank and tool-holder interface. They sit below the tool category, alongside the tool's operating modes — they are not two additional tool types. Hilti calls SDS-Plus TE-C and SDS-Max TE-Y.",
  },
  {
    q: "Is SDS-Max always better than SDS-Plus?",
    a: "No. Specific SDS-Plus and SDS-Max models have overlapping optimum ranges, and there is no supported universal diameter at which every job must switch to SDS-Max. Compare the complete verified system and the actual work rather than choosing from the interface name alone.",
  },
  {
    q: "Can I use an adapter to change the interface?",
    a: "Native interface matching is the baseline in V0.1. Manufacturer-supported conversions can exist — for example Hilti's TE-Y-BFH adapter from TE-Y holding to TE-C accessories. V0.1 does not automatically approve an adapter system or extend a tool's capacity because an accessory can be fitted. Verify the specific manufacturer's approved configuration.",
  },
];

export default function SdsGuidePage() {
  const secs = sectionHtmlFor([
    "what-sds-actually-means",
    "sds-plus-vs-sds-max",
    "maximum-capacity-vs-optimum-range",
  ]);
  const ids = [...new Set([...secs.flatMap((s) => s.sourceIds), "S07", "S08", "S15"])];

  return (
    <div className="container page page-narrow">
      <JsonLd data={faqJsonLd(FAQ)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "SDS-Plus vs SDS-Max" },
        ]}
      />
      <div className="page-hero">
        <h1>SDS-Plus vs SDS-Max</h1>
        <p className="lead">
          SDS-Plus and SDS-Max are accessory-shank and tool-holder interfaces —
          not two extra tool categories, and not fixed diameter bands. There is
          no supported universal diameter at which every job must switch.
        </p>
        <div className="btn-row">
          <Link className="btn" href="/tool-selector/concrete-drilling">
            Check what your job requires
          </Link>
          <Link className="btn btn-secondary" href="/guides/hammer-drill-vs-rotary-hammer">
            Hammer Drill vs Rotary Hammer
          </Link>
        </div>
      </div>

      {secs.map((s) => (
        <section key={s.key}>
          <Prose html={s.html} />
        </section>
      ))}

      <section aria-labelledby="h-faq">
        <h2 id="h-faq">Common questions</h2>
        <Faq items={FAQ} />
      </section>

      <section aria-labelledby="h-next">
        <h2 id="h-next">Keep the job in view</h2>
        <LearnLinks />
      </section>

      <section aria-label="Sources">
        <h2>Sources</h2>
        <p className="muted small">
          Access date for all entries: 2026-09-04. See the full registry on the
          About page.
        </p>
        <SourceList ids={ids} />
      </section>
    </div>
  );
}
