import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterangaben und Kontakt zu Visual Job Solver.",
  alternates: { canonical: "/impressum/" },
  openGraph: { type: "website", locale: "de_DE", title: "Impressum", description: "Anbieterangaben und Kontakt zu Visual Job Solver.", url: "/impressum/" },
};

export default function ImpressumPage() {
  return <div lang="de" className="container page page-narrow" style={{ paddingInline: 20, overflowWrap: "anywhere" }}>
    <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Impressum" }]} />
    <h1>Impressum</h1>
    <h2>Angaben zum Anbieter</h2>
    <p>[陈蕊]<br />handelnd unter [苏州市吴江纬算工程管理工作室（个体工商户）]</p>
    <p>Anschrift:<br />[苏州市吴江区江陵街道江陵东路8号华东国际商业城1号地块14号楼103]<br />[江苏省苏州市]<br />Volksrepublik China</p>
    <p>E-Mail:<br /><a href="mailto:contact@visualjobsolver.com">contact@visualjobsolver.com</a></p>
    <h2>Verantwortlich für den Inhalt</h2>
    <p>[陈蕊]<br />Anschrift wie oben.</p>
    <h2>Hinweis</h2>
    <p>Visual Job Solver stellt allgemeine Informationen und Entscheidungshilfen zur Verfügung. Die bereitgestellten Inhalte ersetzen keine individuelle technische, rechtliche oder bauliche Beratung oder Prüfung.</p>
  </div>;
}
