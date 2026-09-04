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
  title: "Hammer Drill vs Rotary Hammer",
  description:
    "How drill, hammer drill and rotary hammer differ in mechanism, why a page title alone does not classify a tool, and why “concrete always means rotary hammer” is not supported.",
  alternates: { canonical: "/guides/hammer-drill-vs-rotary-hammer" },
  openGraph: { type: "article", url: absolute("/guides/hammer-drill-vs-rotary-hammer") },
};

const FAQ = [
  {
    q: "Can a hammer drill drill into concrete?",
    a: "Some hammer drill models explicitly support concrete — for example Makita's HP2010N lists a 20 mm concrete capacity. That is one model's capacity, not a category-wide rule and not a guarantee of equal productivity to a rotary hammer. Verify the exact tool, bit, mode and operating limits for your model.",
  },
  {
    q: "Is a rotary hammer always the right choice for concrete?",
    a: "Rotary hammers are relevant concrete candidates, but the material alone does not determine the best tool. The specific tool's concrete capability for the method you use still has to be checked. There is no universal boundary in the evidence that picks one category for every job.",
  },
  {
    q: "Why doesn't this page tell me the one tool to buy?",
    a: "The frozen evidence contains no universal rule that maps a hole size or job type to a single tool class. Published model capabilities overlap, so a responsible answer depends on verifying the specific tool you are considering. That is why the decision guide returns what to check next rather than a single product class.",
  },
];

export default function HammerGuidePage() {
  const secs = sectionHtmlFor(["drill-vs-hammer-drill-vs-rotary-hammer"]);
  const ids = [...new Set([...secs.flatMap((s) => s.sourceIds), "S02", "S07", "S14"])];

  return (
    <div className="container page page-narrow">
      <JsonLd data={faqJsonLd(FAQ)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Hammer Drill vs Rotary Hammer" },
        ]}
      />
      <div className="page-hero">
        <h1>Hammer Drill vs Rotary Hammer</h1>
        <p className="lead">
          Three tool names — Drill, Hammer Drill, Rotary Hammer — describe
          different mechanisms. The evidence-based boundary is narrower than
          the marketing: mechanism and holder interface are separate
          dimensions, and a product name alone does not classify a tool.
        </p>
        <div className="btn-row">
          <Link className="btn" href="/tool-selector/concrete-drilling">
            Check what your job requires
          </Link>
          <Link className="btn btn-secondary" href="/guides/sds-plus-vs-sds-max">
            SDS-Plus vs SDS-Max
          </Link>
        </div>
      </div>

      {secs.map((s) => (
        <section key={s.key}>
          <Prose html={s.html} />
        </section>
      ))}

      <section aria-labelledby="h-related">
        <h2 id="h-related">Where SDS fits in</h2>
        <p>
          SDS-Plus and SDS-Max are accessory-shank / tool-holder interfaces,
          not two additional tool types that sit alongside Drill, Hammer Drill
          or Rotary Hammer. See the SDS-Plus vs SDS-Max guide for how they
          relate to tool categories and why there is no universal switch-over
          diameter.
        </p>
        <LearnLinks />
      </section>

      <section aria-labelledby="h-faq">
        <h2 id="h-faq">Common questions</h2>
        <Faq items={FAQ} />
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
