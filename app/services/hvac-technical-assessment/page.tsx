import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Callout from "@/components/ui/Callout";
import { absolute } from "@/lib/seo";

const path = "/services/hvac-technical-assessment";
export const metadata: Metadata = {
  title: "HVAC Technical Assessment",
  description: "Independent HVAC technical assessment for defined building and project decisions. Evidence-led options, risks and next-step recommendations.",
  alternates: { canonical: path },
  openGraph: { type: "website", url: absolute(path), title: "Independent HVAC Technical Assessment", description: "A focused technical review of HVAC options, constraints, evidence and decision risks." },
};

export default function HvacAssessmentPage() {
  return <div className="container page page-narrow">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "HVAC Technical Assessment" }]} />
    <header className="page-hero"><p className="eyebrow">Engineering Services</p><h1>Independent HVAC Technical Assessment</h1><p className="lead">A focused, evidence-led review that helps you understand feasible options, material uncertainties and the next technical decisions—before committing to equipment or a larger design engagement.</p><div className="btn-row"><Link className="btn" href="/request-assessment">Request an assessment</Link></div></header>
    <section><h2>Standard MVP scope</h2><div className="card price-card"><p className="eyebrow">Test-market range</p><p className="service-price">USD 900–1,500</p><p>Final fee depends on the agreed question, available documentation, system complexity and required turnaround. This range is a commercial hypothesis, not a fixed quotation.</p></div></section>
    <section><h2>What the assessment can include</h2><ul><li>Review of the defined HVAC problem, building context and available documents.</li><li>Comparison of plausible technical approaches and their key constraints.</li><li>Identification of missing inputs, decision risks and verification needs.</li><li>A concise written assessment with findings, assumptions and recommended next steps.</li><li>One review call, when included in the agreed scope.</li></ul></section>
    <section><h2>Best suited to</h2><p>Building owners, operators, small project teams and advisers who have a specific HVAC decision but are not yet ready for full design, procurement or site services.</p></section>
    <section><h2>Independence</h2><p>Visual Job Solver does not sell HVAC equipment and does not accept supplier commissions. The assessment is intended to clarify the client&apos;s decision, not to generate a product sale.</p></section>
    <section><Callout tone="limit" title="Professional boundary"><p>This service is an independent technical assessment only. It is not statutory design, a sealed or certified engineering deliverable, permitting, code approval, construction supervision, commissioning, or a substitute for services that must be provided by a locally licensed professional. Site verification and jurisdiction-specific requirements remain outside scope unless separately and lawfully arranged.</p></Callout></section>
    <section><h2>How it works</h2><ol><li>Send a short request describing the decision and available information.</li><li>We perform an initial fit and conflict check.</li><li>If suitable, you receive a proposed scope, deliverables, fee, assumptions and terms.</li><li>Work starts only after written agreement. Submitting a request does not create an engagement.</li></ol><div className="btn-row"><Link className="btn" href="/request-assessment">Request an assessment</Link></div></section>
  </div>;
}
