import type { Metadata } from "next";
import { absolute } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact / Submit a Job",
  description:
    "Send Visual Job Solver your job details, location, materials, constraints, and photos or drawings.",
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: absolute("/contact") },
};

const questions = [
  "What are you trying to do?",
  "Where are you located?",
  "What material, equipment, or structure are you working with?",
  "What problem are you running into?",
  "What constraints do you have?",
  "Photos or drawings, if available.",
];

// The email template ends the last prompt with a colon so answers and any
// attached photos or drawings go beneath it; the on-page list keeps a period.
const mailto = `mailto:contact@visualjobsolver.com?subject=${encodeURIComponent(
  "Job Request — Visual Job Solver",
)}&body=${encodeURIComponent(
  questions.join("\r\n\r\n").replace(/\.$/, ":") + "\r\n\r\n",
)}`;

export default function ContactPage() {
  return (
    <div className="container page page-narrow">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact / Submit a Job" }]}
      />
      <div className="page-hero">
        <h1>Have a job you need help solving?</h1>
        <p className="lead">
          Tell us what you&apos;re trying to do, where you&apos;re located, and what you&apos;re
          working with. Photos are welcome.
        </p>
      </div>
      <section aria-labelledby="h-job-details">
        <h2 id="h-job-details">Include in your email</h2>
        <ul>
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        <div className="btn-row">
          <a className="btn" href={mailto}>Send Us Your Job</a>
        </div>
        <p className="muted small">
          Opens your email app with the questions filled in. Add your answers and
          attach any photos or drawings before sending.
        </p>
        <p className="small">
          You can also email contact@visualjobsolver.com directly.
        </p>
      </section>
    </div>
  );
}
