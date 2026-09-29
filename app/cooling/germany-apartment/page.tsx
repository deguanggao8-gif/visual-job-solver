import type { Metadata } from "next";
import { absolute } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CoolingSolver from "@/components/cooling/CoolingSolver";
import styles from "@/components/cooling/cooling.module.css";

export const metadata: Metadata = {
  title: "Kühllösungen für deine Wohnung — Deutschland",
  description: "Prüfe Fenster, Einbaumöglichkeiten und Einschränkungen deiner Wohnung, bevor du ein Klimagerät kaufst.",
  alternates: { canonical: "/cooling/germany-apartment" },
  openGraph: { type: "website", locale: "de_DE", url: absolute("/cooling/germany-apartment"),
    title: "Kühllösungen für deine Wohnung — Deutschland",
    description: "Welche Kühllösungen kommen für deine Wohnung infrage? Prüfe deine Möglichkeiten vor dem Kauf." },
};
export default function GermanyCoolingPage() {
  return <div lang="de" className={`container page ${styles.page}`}>
    <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Kühllösungen für deine Wohnung" }]} />
    <CoolingSolver />
  </div>;
}
