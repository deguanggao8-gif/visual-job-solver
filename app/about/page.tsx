import type { Metadata } from "next";
import Link from "next/link";
import { absolute } from "@/lib/seo";
import { FROZEN } from "@/lib/frozenMeta";
import { allSources } from "@/lib/sources";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SourceList from "@/components/ui/SourceList";
import Callout from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "About this project",
  description:
    "Visual Job Solver is a job-first decision guide. V0.1 covers concrete drilling with frozen, evidence-bounded rules and cited official sources.",
  alternates: { canonical: "/about" },
  openGraph: { type: "website", url: absolute("/about") },
};

export default function AboutPage() {
  const allIds = allSources().map((s) => s.id);

  return (
    <div className="container page page-narrow">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "About this project" }]}
      />
      <div className="page-hero">
        <h1>About this project</h1>
        <p className="lead">
          Visual Job Solver is a job-first tool site: show us the problem and
          we help you figure out what it requires. V0.1 is deliberately small —
          one job, one decision guide, four explainer pages, one evidence
          baseline.
        </p>
      </div>

      <section aria-labelledby="h-guide">
        <h2 id="h-guide">What the decision guide does</h2>
        <p>
          The Concrete Drilling decision guide walks you through the conditions
          that matter for ordinary hammer drilling — material, drilling method,
          hole size, depth, workload and power preference — then reports three
          things: <strong>what we know</strong>,{" "}
          <strong>what cannot be determined</strong> from the supplied
          information, and <strong>what to verify next</strong> against the
          specific manufacturer’s stated capability.
        </p>
        <p>
          It is a decision guide, not a “find the exact tool” engine. The frozen
          evidence does not support naming one correct tool class or SDS system
          for a job, so the guide does not pretend to.{" "}
          <Link href="/tool-selector/concrete-drilling">Try the decision guide</Link>.
        </p>
      </section>

      <section aria-labelledby="h-evidence">
        <h2 id="h-evidence">The frozen evidence baseline</h2>
        <p>
          Every technical claim on this site traces to a machine-readable rules
          file and a human-readable content file that were frozen on{" "}
          {FROZEN.freezeDate} (version {FROZEN.version}).
        </p>
        <ul>
          <li>
            {FROZEN.ruleCount} rules — {FROZEN.green} executable GREEN,{" "}
            {FROZEN.yellow} explanation-only YELLOW, {FROZEN.red} RED
            (no automatic judgement).
          </li>
          <li>
            {FROZEN.sourceCount} cited official sources (product pages,
            instruction manuals and manufacturer guidance), each with its
            applicable scope and locator.
          </li>
          <li>
            {FROZEN.systemChainCount} manufacturer-documented system examples
            (tool → bit → dust extraction → power) — kept as labelled examples,
            never as automatic recommendations.
          </li>
          <li>
            {FROZEN.fixedSkuUnconditionalApprovals} fixed-SKU systems are
            unconditionally approved. The baseline withholds deterministic
            recommendations and asks you to verify the specific manufacturer
            system.
          </li>
        </ul>
        <p className="muted small">
          The application fails its build if the copied rules or content drift
          from the frozen originals.
        </p>
      </section>

      <section aria-labelledby="h-boundaries">
        <h2 id="h-boundaries">What V0.1 deliberately does not do</h2>
        <ul>
          <li>Design anchors, approve hole sizes or embedment depths, or waive anchor-hole cleaning.</li>
          <li>Judge whether a location is safe to drill — concealed services, reinforcement and structural questions need on-site verification or engineering judgement.</li>
          <li>Guarantee dust-exposure compliance, safety, or suitability for every application.</li>
          <li>Rank tools, recommend a single SDS system, or give a universal size/workload switch-over rule.</li>
        </ul>
        <Callout tone="limit" title="Verify before you proceed">
          <p>
            Follow the specific tool and accessory manuals, and check the exact
            manufacturer’s stated capability for your model, region and method.
            Local regulations may apply. See the{" "}
            <Link href="/jobs/drill-holes-in-concrete">drill-holes guide</Link> for
            the verification checklist.
          </p>
        </Callout>
      </section>

      <section aria-labelledby="h-sources">
        <h2 id="h-sources">Evidence sources</h2>
        <p className="muted small">
          Access date for all entries: 2026-09-04. N-sources are the newly
          admitted official sources for this baseline. PDF text was reviewed;
          unresolved visual-table checks are not claimed complete, and no
          conflicting numeric field has been selected as a universal answer.
        </p>
        <SourceList ids={allIds} />
      </section>
    </div>
  );
}
