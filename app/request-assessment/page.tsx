import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import { absolute } from "@/lib/seo";

const path = "/request-assessment";
export const metadata: Metadata = {
  title: "Request an HVAC Assessment",
  description: "Request an initial scope review for an independent HVAC technical assessment.",
  alternates: { canonical: path },
  openGraph: { type: "website", url: absolute(path), title: "Request an HVAC Technical Assessment", description: "Share the defined decision, project context and timeline for an initial fit review." },
};

export default function RequestAssessmentPage() {
  return <div className="container page page-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "HVAC Technical Assessment", href: "/services/hvac-technical-assessment" }, { label: "Request an assessment" }]} /><header className="page-hero"><p className="eyebrow">Initial fit review</p><h1>Request an assessment</h1><p className="lead">Tell us about the specific HVAC decision, the project location and what information is already available. We will first assess whether the request is a suitable fit.</p></header><AssessmentForm /></div>;
}
