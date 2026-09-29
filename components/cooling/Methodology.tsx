import { RULES } from "@/lib/cooling/evidence";
import styles from "./cooling.module.css";

export default function Methodology() {
  return <details className={styles.summary} id="quellen-methodik">
    <summary>Quellen &amp; Methodik</summary>
    <h2>Wie die Einschätzung funktioniert</h2>
    <p>Der Cooling Solver bewertet grundlegende Rahmenbedingungen wie Wohnsituation, mögliche bauliche Veränderungen, Fenstertyp, Außenbereich, bekannte Einschränkungen, Raumgröße, Nutzung und Budget.</p>
    <p>Die Ergebnisse sind eine Vorauswahl von Lösungsarten, keine Freigabe für eine konkrete Installation.</p>
    <p>Feste Regeln werten deine Angaben aus. Unbekannte Voraussetzungen bleiben offen und erfordern weitere Prüfung. Technische Eignung und praktische Eignung einschließlich Budget werden getrennt betrachtet.</p>
    <p>Budgetgrenzen sind vorläufige Orientierungswerte, keine aktuellen Marktpreise oder Angebote. Die Raumgröße ersetzt keine Kühllastberechnung.</p>
    <ul>
      <li><a href="https://www.gesetze-im-internet.de/woeigg/__20.html">§ 20 WEG – Bauliche Veränderungen</a>: rechtlicher Hintergrund zu Veränderungen am gemeinschaftlichen Eigentum. Daraus folgt keine Freigabe für deine konkrete Installation und keine pauschale Aussage zu einem Mietverhältnis.</li>
      <li><a href={RULES.DE_PORTABLE_SPLIT_002.source_url!}>Midea Deutschland – PortaSplit Installation</a>: Herstellerangaben zu einem bestimmten Produkt. Eigenschaften wie eine Montage ohne Bohren gelten nicht automatisch für alle mobilen Split-Klimaanlagen. Die Quelle ist keine Produktempfehlung.</li>
      <li><a href={RULES.DE_FIXED_SPLIT_001.source_url!}>Verbraucherzentrale – Klimaanlage installieren</a>: allgemeine Hinweise zu Gerätearten und Installationsfragen.</li>
    </ul>
    <p className="small muted">Die Quellen erläutern die Methodik; sie ersetzen keine Prüfung deiner Situation. Die bestehenden Entscheidungsregeln wurden für diese Sprachfassung nicht geändert.</p>
  </details>;
}
