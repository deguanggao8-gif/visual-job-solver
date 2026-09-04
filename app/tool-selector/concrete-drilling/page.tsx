import type { Metadata } from "next";
import { absolute } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Callout from "@/components/ui/Callout";
import ContentSections from "@/components/ui/ContentSections";
import ConcreteDrillingSelector from "@/components/selector/ConcreteDrillingSelector";

export const metadata: Metadata = {
  title: "Concrete drilling decision guide",
  description:
    "A job-first decision guide for drilling holes in concrete. Enter the conditions and see what the manufacturer evidence can determine, what it cannot, and what to verify next.",
  alternates: { canonical: "/tool-selector/concrete-drilling" },
  openGraph: { type: "website", url: absolute("/tool-selector/concrete-drilling") },
};

const STATIC_SECTIONS = [
  "what-job-are-you-trying-to-do",
  "how-to-choose",
  "common-selection-mistakes",
];

export default function ConcreteDrillingPage() {
  return (
    <div className="container page page-narrow">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Concrete drilling decision guide" },
        ]}
      />
      <div className="page-hero">
        <h1>Concrete drilling decision guide</h1>
        <p className="lead">
          Understand what your job requires. Answer a few questions about the
          work and this guide reports what the manufacturer evidence can
          determine, what it cannot, and what to verify before you drill.
        </p>
      </div>

      <Callout tone="limit" title="What this guide can and can’t do">
        <p>
          It is a decision guide, not an “exact tool” engine. Where the evidence
          cannot support a single tool class or SDS system, the guide says so
          and gives you a verification path instead. It does not approve tools,
          drilling locations, or compliance.
        </p>
      </Callout>

      <ConcreteDrillingSelector />

      <hr className="rule" />
      <h2>The reasoning behind the guide</h2>
      <p>
        These sections from the frozen research explain how the evidence is
        used: start with the task and material, keep method families separate,
        use capacity and optimum range correctly, and never invent thresholds.
      </p>

      <ContentSections keys={STATIC_SECTIONS} />
    </div>
  );
}
