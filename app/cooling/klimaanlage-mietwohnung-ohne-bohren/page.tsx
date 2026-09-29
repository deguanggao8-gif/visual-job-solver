import type { Metadata } from "next";
import Link from "next/link";
import { absolute } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Callout from "@/components/ui/Callout";

const path = "/cooling/klimaanlage-mietwohnung-ohne-bohren/";
const title = "Klimaanlage Mietwohnung ohne Bohren: Welche Lösung passt?";
const description = "Welche Klimaanlage passt zu einer Mietwohnung ohne Bohren? Vergleiche Monoblock, mobile Split- und Split-Lösungen anhand von Fenster, Balkon und Einbaumöglichkeiten.";
const solver = "/cooling/germany-apartment/";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absolute(path) },
  robots: { index: true, follow: true },
  openGraph: { type: "article", locale: "de_DE", title, description, url: absolute(path) },
};

function SolverLink({ children }: { children: React.ReactNode }) {
  return <div className="btn-row"><Link className="btn" href={solver}>{children}</Link></div>;
}

export default function CoolingWithoutDrillingPage() {
  return <article lang="de" className="container page page-narrow prose" style={{ paddingInline: 20, overflowWrap: "anywhere" }}>
    <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Kühllösungen", href: solver }, { label: "Mietwohnung ohne Bohren" }]} />
    <header className="page-hero">
      <h1>Klimaanlage in der Mietwohnung ohne Bohren: Welche Lösung passt zu deiner Wohnung?</h1>
      <p className="lead">Du möchtest deine Wohnung im Sommer kühlen, kannst oder möchtest aber keine Löcher in Wände oder Fenster bohren?</p>
      <p>Dann solltest du nicht nur nach einer „Klimaanlage ohne Bohren“ suchen.</p>
      <p>Ob eine Lösung wirklich zu deiner Wohnung passt, hängt unter anderem davon ab,</p>
      <ul>
        <li>welches Fenster du hast,</li>
        <li>ob ein Balkon oder anderer geeigneter Außenbereich vorhanden ist,</li>
        <li>ob dauerhafte Änderungen erlaubt sind,</li>
        <li>wie groß der Raum ist,</li>
        <li>wann du ihn hauptsächlich kühlen möchtest,</li>
        <li>und welches Budget du einplanst.</li>
      </ul>
      <p><strong>Prüfe zuerst deine Wohnsituation – bevor du ein Klimagerät kaufst.</strong></p>
      <SolverLink>Meine Möglichkeiten prüfen</SolverLink>
      <p className="small muted">Kostenlos · ca. 2 Minuten · Keine Markenempfehlung · Kein Kauf erforderlich</p>
    </header>

    <section aria-labelledby="arten">
      <h2 id="arten">Welche Klimaanlagen kommen ohne Bohren infrage?</h2>
      <h3>Mobiles Monoblock-Klimagerät</h3>
      <p>Das Gerät steht im Raum. Die warme Abluft muss nach draußen, typischerweise durch einen Schlauch an einem Fenster oder einer Tür. Ein dauerhafter Wanddurchbruch ist dafür nicht zwingend nötig. Entscheidend sind ein brauchbarer Abluftweg und eine passende Fensterlösung.</p>
      <h3>Mobile Split-Klimaanlage</h3>
      <p>Sie besteht aus einem Innen- und einem Außenteil. Bestimmte Geräte können ohne dauerhaften Wanddurchbruch eingesetzt werden. Trotzdem brauchst du einen geeigneten Außenplatz und einen Weg für die Verbindung zwischen beiden Einheiten. Nicht jede mobile Split-Klimaanlage lässt sich ohne Bohren aufstellen.</p>
      <h3>Fest installierte Split-Klimaanlage</h3>
      <p>Diese Lösung wird dauerhaft installiert und hat eine Außeneinheit. Die Leitungen werden typischerweise durch die Gebäudehülle geführt. Bei einer Mietwohnung sind deshalb bauliche Änderungen und die erforderliche Zustimmung zu klären. Wenn dauerhafte Eingriffe ausgeschlossen sind, ist dieser übliche Installationsweg nicht ohne Weiteres verfügbar.</p>
    </section>

    <section aria-labelledby="randbedingungen">
      <h2 id="randbedingungen">„Ohne Bohren“ allein reicht nicht als Entscheidungskriterium</h2>
      <p>Zwei Wohnungen können beide „ohne Bohren“ verlangen und trotzdem unterschiedliche Lösungen benötigen.</p>
      <h3>Beispiel A: Dreh-Kipp-Fenster und Balkon</h3>
      <p>Du wohnst zur Miete, hast ein Dreh-Kipp-Fenster und einen Balkon, darfst aber keine dauerhaften Veränderungen vornehmen. Eine mobile Split-Lösung kommt grundsätzlich zur näheren Prüfung infrage. Auch ein Monoblock kann technisch möglich sein, wenn sich ein geeigneter Abluftweg herstellen lässt.</p>
      <p>Vor einer Entscheidung bleiben konkrete Fragen offen: Ist der Platz für das Außengerät geeignet? Wie verläuft die Verbindung? Lässt sich das Fenster passend abdichten? Welche Geräusche entstehen, und welche Gebäuderegeln gelten?</p>
      <h3>Beispiel B: Festes Fenster ohne geeigneten Außenbereich</h3>
      <p>Du wohnst zur Miete, darfst keine dauerhaften Änderungen vornehmen und hast eine Festverglasung sowie keinen Balkon oder anderen geeigneten Außenbereich. Standardlösungen lassen sich anhand dieser Angaben nicht sicher bestätigen. Das bedeutet nicht automatisch, dass keine Klimaanlage möglich ist; andere Öffnungen oder Aufstellmöglichkeiten müssten genauer betrachtet werden.</p>
      <Callout tone="scope"><p><strong>Deine konkrete Situation muss genauer geprüft werden.</strong></p></Callout>
      <SolverLink>Meine Situation prüfen</SolverLink>
    </section>

    <section aria-labelledby="fuenf-punkte">
      <h2 id="fuenf-punkte">Diese 5 Punkte solltest du vor dem Kauf prüfen</h2>
      <h3>1. Welchen Fenstertyp hast du?</h3>
      <p>Fenstertyp, Öffnungsrichtung und nutzbarer Spalt beeinflussen den Abluftweg oder die Verbindungsleitung. Eine Lösung für ein Schiebefenster passt nicht automatisch zu einem Dreh-Kipp-Fenster. Prüfe die tatsächlichen Maße und die Anleitung des Geräts.</p>
      <h3>2. Gibt es einen Balkon oder einen anderen geeigneten Außenbereich?</h3>
      <p>Ein Balkon allein bestätigt noch keinen sicheren Standort. Platz, Befestigung, Zugänglichkeit, Leitungsführung und Vorgaben des Gebäudes müssen zur vorgesehenen Aufstellung passen. Fehlt ein Balkon, ist eine andere Außenposition nicht automatisch ausgeschlossen, aber auch nicht bestätigt.</p>
      <h3>3. Sind dauerhafte Änderungen am Gebäude erlaubt?</h3>
      <p>Ein Mietverhältnis bedeutet nicht automatisch, dass eine Split-Anlage unmöglich ist. Entscheidend sind die konkreten Änderungen und die dafür nötigen Zustimmungen. Unbekannte Vorgaben solltest du klären, statt sie als Erlaubnis oder Verbot zu behandeln.</p>
      <h3>4. Möchtest du in dem Raum schlafen?</h3>
      <p>Dann ist das Innengeräusch ein wichtiger praktischer Kompromiss. Ein Monoblock ist deshalb nicht automatisch ausgeschlossen. Prüfe die Geräuschangaben für die Betriebsstufe, die du nachts tatsächlich nutzen würdest; auch eine Split-Lösung ist nicht grundsätzlich lautlos.</p>
      <h3>5. Wie groß und wie warm wird der Raum?</h3>
      <p>Die Fläche gibt nur einen ersten Anhaltspunkt. Sonneneinstrahlung, Fensterfläche, Dämmung und Raumhöhe können ebenfalls relevant sein. Aus der Raumgröße allein ergibt sich keine genaue Kühllast oder verlässliche Geräteauslegung.</p>
    </section>

    <section aria-labelledby="vergleich">
      <h2 id="vergleich">Monoblock oder mobile Split-Klimaanlage?</h2>
      <h3>Ein Monoblock kann interessant sein, wenn …</h3>
      <p>du eine einfache mobile Lösung suchst, keinen geeigneten Außenplatz für ein separates Gerät hast, aber einen brauchbaren Abluftweg herstellen kannst. Die Fensterabdichtung gehört zur Planung: Offene Spalte können warme Luft hereinlassen und die praktische Kühlwirkung verschlechtern.</p>
      <h3>Eine mobile Split-Klimaanlage kann interessant sein, wenn …</h3>
      <p>ein geeigneter Platz für die Außeneinheit vorhanden ist und die Verbindung durch Fenster oder Tür geführt werden kann. Ein Teil der Technik befindet sich außerhalb. Je nach Gerät und Aufstellung können sich Vorteile bei Effizienz oder Innengeräusch ergeben; das ist keine pauschale Zusage. Die Eignung hängt von Gerät, Fenster, Außenbereich und Gebäude ab.</p>
      <p><strong>Welche Variante praktisch besser zu deiner Wohnung passt, lässt sich deshalb erst anhand deiner konkreten Randbedingungen beurteilen.</strong></p>
      <SolverLink>Meine Wohnung prüfen</SolverLink>
    </section>

    <section aria-labelledby="vermieter">
      <h2 id="vermieter">Brauche ich die Zustimmung meines Vermieters?</h2>
      <p>Eine fest installierte Split-Anlage erfordert normalerweise dauerhafte Eingriffe. Dafür ist die Zustimmung des Vermieters erforderlich; gegebenenfalls sind weitere Vorgaben des Gebäudes zu beachten.</p>
      <p>Bei mobilen Lösungen kommt es auf die tatsächliche Aufstellung an. Frei und reversibel aufgestellt ist nicht dasselbe wie eine dauerhafte Befestigung an Fassade, Balkon oder anderen Gebäudeteilen. „Ohne Bohren“ bedeutet daher nicht automatisch „ohne Abstimmung erlaubt“.</p>
      <p>Bei gemeinschaftlichem Eigentum können zusätzlich Beschlüsse über bauliche Veränderungen relevant sein. <a href="https://www.gesetze-im-internet.de/woeigg/__20.html">§ 20 WEG</a> ist dazu ein rechtlicher Hintergrund, keine allgemeine Freigabe und keine eigenständige Antwort auf jede Mietfrage.</p>
      <p>Dieses Tool ersetzt keine rechtliche Prüfung der konkreten Wohn- oder Gebäudesituation.</p>
    </section>

    <section aria-labelledby="dreh-kipp">
      <h2 id="dreh-kipp">Was ist bei Dreh-Kipp-Fenstern zu beachten?</h2>
      <p>Bei einem Monoblock brauchst du einen Abluftweg nach außen und eine geeignete Fensterabdichtung. Prüfe, ob die vorgesehene Lösung zur Öffnungsart und zum Rahmen passt.</p>
      <p>Bei einzelnen mobilen Split-Geräten existieren spezielle Lösungen. Beispielsweise zeigt <a href="https://www.midea.com/de/klimatisieren-heizen/portasplit/installation">Midea für die PortaSplit</a> eine Fensterhalterung und Fensterabdichtung, mit denen die Außeneinheit bei geeigneten Dreh-Kipp-Fenstern außen positioniert werden kann.</p>
      <p>Das ist jedoch eine produktspezifische Lösung. Daraus folgt weder eine allgemeine Eignung aller mobilen Split-Geräte noch eine Freigabe für dein Fenster. Das Beispiel ist keine Kaufempfehlung.</p>
      <p><strong>Prüfe deshalb immer, ob das konkrete Gerät zu deinem Fenster passt.</strong></p>
    </section>

    <section aria-labelledby="faq">
      <h2 id="faq">Häufige Fragen</h2>
      <h3>Kann ich eine Klimaanlage in einer Mietwohnung ohne Bohren nutzen?</h3>
      <p>Das kann möglich sein, wenn Abluftweg oder Außenaufstellung, Verbindung und Gebäuderegeln passen. Allein die Angabe „ohne Bohren“ reicht für eine Bestätigung nicht aus.</p>
      <h3>Welche Klimaanlage eignet sich für ein Dreh-Kipp-Fenster?</h3>
      <p>Ein Monoblock mit passender Abluft- und Abdichtungslösung oder ein dafür geeignetes mobiles Split-Gerät kann infrage kommen. Prüfe immer das konkrete Gerät und die Fenstermaße.</p>
      <h3>Braucht eine mobile Klimaanlage immer einen Abluftschlauch?</h3>
      <p>Ein mobiles Monoblock-Klimagerät führt warme Abluft typischerweise über einen Schlauch nach draußen. Eine mobile Split-Anlage nutzt stattdessen eine Außeneinheit mit einer Verbindung zum Innengerät; ihre Installationsanforderungen bleiben zu prüfen.</p>
      <h3>Kann eine mobile Split-Klimaanlage auf dem Balkon stehen?</h3>
      <p>Die Außeneinheit kann dort je nach Modell und Aufstellung Platz finden. Sicherheit, Leitungsführung, Geräusch und Gebäuderegeln müssen passen; das Innengerät bleibt im zu kühlenden Raum.</p>
      <h3>Brauche ich für eine Klimaanlage die Erlaubnis meines Vermieters?</h3>
      <p>Bei dauerhaften baulichen Eingriffen ist die Zustimmung erforderlich. Bei mobilen Lösungen sind die tatsächliche Aufstellung und mögliche Befestigungen entscheidend. Kläre unklare Vorgaben vorab.</p>
    </section>

    <section aria-labelledby="abschluss">
      <h2 id="abschluss">Welche Lösung passt zu deiner Wohnung?</h2>
      <p>Fenster, Außenbereich, Raumgröße, Nutzung und Installationsmöglichkeiten können die Auswahl deutlich verändern.</p>
      <p>Deshalb solltest du nicht mit einer Marke beginnen.</p>
      <p><strong>Beginne mit deiner Wohnung.</strong></p>
      <p>Beantworte einige Fragen zu deiner Situation und sieh, welche Kühllösungen grundsätzlich infrage kommen und was du vor dem Kauf noch prüfen solltest.</p>
      <SolverLink>Meine Möglichkeiten prüfen</SolverLink>
      <p className="small muted">Kostenlos · ca. 2 Minuten · Keine Markenempfehlung · Kein Kauf erforderlich</p>
    </section>

    <section aria-labelledby="hinweis" className="small muted">
      <h2 id="hinweis">Hinweis</h2>
      <p>Diese Einschätzung bietet eine erste Orientierung. Sie ersetzt keine technische, rechtliche oder bauliche Prüfung vor Ort. Genehmigungen, sichere Montage, elektrische Voraussetzungen, Kühllast und die Eignung eines konkreten Geräts müssen bei Bedarf separat geprüft werden.</p>
    </section>
    <section aria-labelledby="quellen" className="small">
      <h2 id="quellen">Quellen &amp; Hinweise</h2>
      <ul>
        <li><a href="https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/klimaanlage-installieren-was-ist-zu-beachten-10525">Verbraucherzentrale: Klimaanlage installieren – Was ist zu beachten?</a> — allgemeine Hinweise zu Gerätearten, Abluft und Installation.</li>
        <li><a href="https://www.midea.com/de/klimatisieren-heizen/portasplit/installation">Midea Deutschland: PortaSplit Installation</a> — ausschließlich produktspezifische Installationsbeispiele, keine Aussage über alle mobilen Split-Geräte.</li>
        <li><a href="https://www.gesetze-im-internet.de/woeigg/__20.html">Wohnungseigentumsgesetz, § 20: Bauliche Veränderungen</a> — rechtlicher Hintergrund bei gemeinschaftlichem Eigentum, keine individuelle rechtliche Prüfung.</li>
      </ul>
    </section>
  </article>;
}
