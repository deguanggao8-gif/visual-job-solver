import type { Metadata } from "next";
import Link from "next/link";
import { absolute } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContentSections from "@/components/ui/ContentSections";
import Callout from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Drill holes in concrete",
  description:
    "Confirm the job, check the tool's stated concrete capacity and its optimum range, and verify the bit, working length, dust extraction and safety steps before drilling.",
  alternates: { canonical: "/jobs/drill-holes-in-concrete" },
  openGraph: {
    type: "article",
    url: absolute("/jobs/drill-holes-in-concrete"),
  },
};

const SECTIONS = [
  "what-job-are-you-trying-to-do",
  "bits-and-accessories",
  "dust-extraction",
  "complete-job-kit",
  "how-to-before-and-during-drilling",
  "common-selection-mistakes",
  "safety-notes",
];

export default function JobPage() {
  return (
    <div className="container page page-narrow">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Drill holes in concrete" }]}
      />
      <div className="page-hero">
        <h1>Drill holes in concrete</h1>
        <p className="lead">
          Concrete drilling starts with the job: confirm the task and material,
          then the drilling method, hole dimensions, workload and power
          preference. This page collects what the frozen manufacturer evidence
          says about the ordinary hammer-drilling path — and its limits.
        </p>
        <div className="btn-row">
          <Link className="btn" href="/tool-selector/concrete-drilling">
            Run the concrete drilling decision guide
          </Link>
          <Link className="btn btn-secondary" href="/about">
            About this project and its evidence
          </Link>
        </div>
      </div>

      <ContentSections
        keys={SECTIONS}
        interjections={{
          "complete-job-kit": (
            <Callout tone="limit" title="Example only — not automatically recommended for your job">
              <p>
                The “Complete Job Kit” section below shows manufacturer-documented
                system examples assembled during research (tool → bit → dust →
                power). They are labelled research examples. They are not
                automatically recommended for your job, are not ranked, and are
                not complete shopping kits. No retail bundle is implied.
              </p>
            </Callout>
          ),
        }}
      />
    </div>
  );
}
