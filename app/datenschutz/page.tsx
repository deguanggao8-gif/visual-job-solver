import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei Visual Job Solver.",
  alternates: { canonical: "/datenschutz/" },
  openGraph: { type: "website", locale: "de_DE", title: "Datenschutzerklärung", description: "Informationen zur Verarbeitung personenbezogener Daten bei Visual Job Solver.", url: "/datenschutz/" },
};

export default function DatenschutzPage() {
  return <div lang="de" className="container page page-narrow" style={{ paddingInline: 20, overflowWrap: "anywhere" }}>
    <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Datenschutzerklärung" }]} />
    <h1>Datenschutzerklärung</h1>
    <p>Diese Erklärung beschreibt die aktuelle Website einschließlich des Germany Apartment Cooling Solver, der Kontaktaufnahme per E-Mail und des Formulars zur Anfrage einer HVAC Technical Assessment.</p>

    <h2>Verantwortlicher und Kontakt</h2>
    <p>[陈蕊]<br />handelnd unter [苏州市吴江纬算工程管理工作室（个体工商户）<br />[苏州市吴江区江陵街道江陵东路8号华东国际商业城1号地块14号楼103]<br />[江苏省苏州市]<br />Volksrepublik China</p>
    <p>Der Betreiber ist eine natürliche Person mit einer gültigen chinesischen Gewerberegistrierung als 个体工商户. Damit wird keine deutsche Gesellschaftsform bezeichnet.</p>
    <p>Für Fragen zum Datenschutz und zur Ausübung deiner Rechte: <a href="mailto:contact@visualjobsolver.com">contact@visualjobsolver.com</a>.</p>

    <h2>Bereitstellung der Website über Cloudflare</h2>
    <p>Die statische Website wird über Cloudflare Pages und das Cloudflare-Netzwerk bereitgestellt. Beim Aufruf werden technisch notwendige Verbindungs- und Anfragedaten verarbeitet. Dazu gehören insbesondere IP-Adresse, Zeitpunkt, angeforderte Adresse, Browser- und Geräteinformationen sowie gegebenenfalls Referrer, Status- und Fehlerdaten.</p>
    <p>Diese Daten dienen der Auslieferung, Stabilität, Fehleranalyse und Abwehr missbräuchlicher Zugriffe. Cloudflare kann hierfür technische Protokolle verarbeiten. Umfang und Aufbewahrung hängen vom eingesetzten Dienst und seiner Konfiguration ab.</p>
    <p>Soweit die DSGVO anwendbar ist, stützt sich diese Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO: das berechtigte Interesse an einem sicher erreichbaren und funktionsfähigen Informationsangebot.</p>

    <h2>Cooling Solver und Speicherung im Browser</h2>
    <p>Der Solver verarbeitet deine Angaben zur Wohnsituation, zu Einbaumöglichkeiten, Fenstern, Außenbereich, Einschränkungen, Raumgröße, Nutzung und Budget direkt in deinem Browser. Seine Antworten und der Bearbeitungsstand werden im sessionStorage unter dem Schlüssel <code>vjs:cooling:de:v1</code> gespeichert, damit du zurückgehen oder die Seite neu laden kannst.</p>
    <p>Die Anwendung sendet diese Fragebogenantworten nicht automatisch an einen Visual-Job-Solver-Server. Es gibt keine Visual-Job-Solver-Benutzerkonten und keine serverseitige Datenbank für diese Antworten. Das schließt die technisch notwendige Verarbeitung von Verbindungsdaten beim Seitenaufruf nicht aus.</p>
    <p>Die Speicherung ist an die Sitzung des Browser-Tabs gebunden. Sie endet normalerweise mit dem Schließen des Tabs; Funktionen zur Sitzungswiederherstellung können Daten erneut herstellen. Über „Neue Einschätzung starten und gespeicherte Antworten löschen“ kannst du die gespeicherten Antworten zurücksetzen. Ist der Speicher nicht verfügbar, kann die Einschätzung im geöffneten Tab fortgesetzt werden.</p>
    <p>Die Speicherung dient ausschließlich dem von dir angeforderten Fragebogenablauf. Soweit dabei personenbezogene Daten verarbeitet werden und die DSGVO anwendbar ist, ist Art. 6 Abs. 1 lit. f DSGVO die Grundlage; unser Interesse ist die zuverlässige Bereitstellung dieser Funktion. Die Speicherung dient nicht der Werbung oder Wiedererkennung über Websites hinweg.</p>

    <h2>Anfrage vorbereiten und E-Mail-Kontakt</h2>
    <p>„Meine Situation prüfen“ öffnet ein Formular zur Vorbereitung einer Anfrage. E-Mail-Adresse und Notizen bleiben zunächst im Arbeitsspeicher der Seite und werden nicht mit den Fragebogenantworten im sessionStorage gespeichert. „E-Mail-Entwurf erstellen“ erzeugt nur einen lokalen Entwurf mit deinen Angaben.</p>
    <p>Es erfolgt keine automatische Übermittlung oder Einsendung über ein Kontakt-Backend. Erst wenn du den Entwurf in deinem E-Mail-Programm tatsächlich absendest, wird daraus eine E-Mail an <a href="mailto:contact@visualjobsolver.com">contact@visualjobsolver.com</a>. Beim Öffnen des E-Mail-Programms werden die Entwurfsdaten an dieses übergeben; beim Kopieren gelangen sie in die Zwischenablage deines Geräts.</p>
    <p>Du kannst freiwillig Texte und Anhänge, etwa Fotos von Fenster, Raum oder Balkon, per E-Mail mitsenden. Vermeide nicht erforderliche Angaben zu anderen Personen und sensible Inhalte. Die Website bietet keinen Foto-Upload und keine KI-Fotoanalyse.</p>
    <p>Eingehende Nachrichten werden über Cloudflare Email Routing an das verwendete Empfangspostfach weitergeleitet. Dabei sind Cloudflare sowie die beteiligten E-Mail-Anbieter an Transport, Zustellung und gegebenenfalls Speicherung beteiligt. Verarbeitet werden Absender- und Empfängeradressen, technische E-Mail-Metadaten, Betreff, Nachrichtentext und die von dir mitgesendeten Anhänge. Das Empfangspostfach ist kein Benutzerkonto dieser Website.</p>
    <p>Zweck ist die Bearbeitung und Beantwortung deiner Anfrage. Bei einer von dir gewünschten vorvertraglichen oder vertraglichen Anfrage kommt Art. 6 Abs. 1 lit. b DSGVO in Betracht; bei sonstigen Anfragen Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres Interesses an der Kommunikation. Gesetzlich erforderliche Aufbewahrung beruht, soweit anwendbar, auf Art. 6 Abs. 1 lit. c DSGVO. Ohne ausreichende Kontaktangaben können wir möglicherweise nicht antworten.</p>

    <h2>Anfrage einer HVAC Technical Assessment</h2>
    <p>Über das gesonderte Assessment-Anfrageformular kannst du Name, geschäftliche E-Mail-Adresse, Organisation (freiwillig), Projektstandort, Projektart, Projektbeschreibung und gewünschten Zeitrahmen übermitteln. Bitte gib dort keine besonderen Kategorien personenbezogener Daten und keine für die erste Prüfung nicht erforderlichen Angaben zu anderen Personen ein.</p>
    <p>Die Angaben werden über eine Cloudflare Pages Function entgegengenommen, serverseitig geprüft und über den E-Mail-Dienst Resend an das Empfangspostfach des Betreibers gesendet. Resend verarbeitet dabei die Formularinhalte sowie Absender-, Empfänger- und technische Versanddaten. Ein erfolgreicher Hinweis im Formular bedeutet, dass der Versanddienst die Nachricht zur Verarbeitung angenommen hat; er ist keine Garantie für die endgültige Zustellung oder für die Annahme eines Auftrags.</p>
    <p>Zum Schutz vor automatisierten und missbräuchlichen Übermittlungen wird Cloudflare Turnstile eingesetzt. Dabei können Cloudflare insbesondere Verbindungs-, Browser-, Geräte- und Interaktionsdaten sowie die IP-Adresse verarbeiten und ein Prüfergebnis an die Website übermitteln. Die Website prüft dieses Ergebnis serverseitig. Für Turnstile gelten zusätzlich die Datenschutzbestimmungen von Cloudflare.</p>
    <p>Zur Begrenzung wiederholter Anfragen wird aus der von Cloudflare übermittelten IP-Adresse mit einem geheimen Schlüssel ein nicht unmittelbar lesbarer Prüfwert gebildet. In Cloudflare KV werden dieser Prüfwert und ein zeitlich begrenzter Zähler gespeichert; die rohe IP-Adresse wird nicht als KV-Schlüssel gespeichert. Der Zähler läuft nach höchstens zwei Stunden ab. Eine zufällige Vorgangskennung wird zur Erkennung wiederholter Übermittlungen verarbeitet und nach erfolgreicher Annahme bis zu 24 Stunden, während einer laufenden Verarbeitung bis zu zehn Minuten gespeichert.</p>
    <p>Zweck dieser Verarbeitung ist die Prüfung, Bearbeitung und Beantwortung einer von dir angefragten möglichen Geschäftsbeziehung sowie die Absicherung des Formulars. Soweit die DSGVO anwendbar ist, kommt für vorvertragliche Anfragen Art. 6 Abs. 1 lit. b DSGVO und für Missbrauchsschutz sowie sonstige Anfragen Art. 6 Abs. 1 lit. f DSGVO in Betracht. Unser berechtigtes Interesse liegt im sicheren Betrieb des Formulars und in der zuverlässigen Bearbeitung ernsthafter Anfragen. Das Absenden des Formulars begründet keinen Vertrag.</p>

    <h2>Empfänger und internationale Verarbeitung</h2>
    <p>Empfänger sind der Betreiber sowie die für Website-Auslieferung, Sicherheit und E-Mail-Kommunikation eingesetzten Dienstleister, insbesondere Cloudflare, Resend und die beteiligten E-Mail-Anbieter. Weitere Empfänger kommen in Betracht, soweit eine gesetzliche Pflicht zur Offenlegung besteht.</p>
    <p>Der Betreiber befindet sich in der Volksrepublik China. Bei der Bearbeitung von E-Mails kann daher dort auf die Daten zugegriffen werden. Cloudflare und E-Mail-Anbieter können Daten außerdem außerhalb der EU beziehungsweise des EWR verarbeiten, etwa in den USA. Eine ausschließliche Verarbeitung innerhalb der EU wird nicht zugesichert.</p>
    <p>Soweit eine Übermittlung den Art. 44 ff. DSGVO unterliegt, benötigt sie die dort vorgesehenen Voraussetzungen, beispielsweise einen anwendbaren Angemessenheitsbeschluss oder geeignete Garantien wie Standardvertragsklauseln, gegebenenfalls mit ergänzenden Maßnahmen. Diese Erklärung behauptet nicht, dass eine bestimmte Garantie für jede beteiligte Verarbeitung bereits nachgewiesen ist. Informationen zu den für deinen Vorgang einschlägigen Empfängern und Übermittlungsbedingungen kannst du über die oben genannte E-Mail-Adresse anfragen.</p>

    <h2>Speicherdauer</h2>
    <p>Browserdaten werden wie im Abschnitt zum Solver beschrieben behandelt. Die kurzlebigen KV-Einträge des Assessment-Formulars werden wie oben angegeben automatisch begrenzt. Assessment- und E-Mail-Anfragen sowie Anhänge werden nur so lange aufbewahrt, wie sie zur Bearbeitung und erforderlichen Nachverfolgung benötigt werden. Gesetzliche Aufbewahrungspflichten oder die erforderliche Klärung von Rechtsansprüchen können eine längere Speicherung erfordern; danach sind die Daten zu löschen. Für technische Protokolle, Versandmetadaten und Sicherungskopien der Dienstleister gelten deren jeweilige Konfigurationen und Aufbewahrungsregeln. Eine einheitliche feste Frist für alle Datenarten wird deshalb nicht angegeben.</p>

    <h2>Deine Rechte</h2>
    <p>Soweit die gesetzlichen Voraussetzungen vorliegen, kannst du Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit verlangen. Gegen eine Verarbeitung aufgrund berechtigter Interessen kannst du aus Gründen deiner besonderen Situation Widerspruch einlegen. Eine etwaige Einwilligung kannst du für die Zukunft widerrufen.</p>
    <p>Wende dich dazu an <a href="mailto:contact@visualjobsolver.com">contact@visualjobsolver.com</a>. Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere am Ort deines gewöhnlichen Aufenthalts, deines Arbeitsplatzes oder des vermuteten Verstoßes.</p>

    <h2>Keine Werbe-Tracker in der aktuellen Anwendung</h2>
    <p>Visual Job Solver setzt derzeit keine Werbe- oder Marketing-Tracker wie Google Analytics oder Meta Pixel ein. Die Anwendung selbst setzt keine Cookies und verwendet keinen localStorage. Interaktionsereignisse des Solvers werden lediglich lokal im Browser ausgelöst; es ist kein externer Statistikdienst angeschlossen. Es gibt keine eingebetteten Drittanbieter-Videos, extern geladenen Schriftarten oder KI-Dienste.</p>
    <p>Links zu externen Informationsquellen öffnen fremde Websites erst bei deinem Aufruf. Dort gelten deren eigene Datenschutzbedingungen. Sollten künftig nicht notwendige Analyse- oder Trackingfunktionen hinzukommen, müssen deren Verarbeitung und diese Erklärung erneut geprüft und, soweit rechtlich erforderlich, vorherige Einwilligungen eingeholt werden.</p>

    <h2>Weiterführende Informationen</h2>
    <ul>
      <li><a href="https://www.cloudflare.com/privacypolicy/">Cloudflare – Datenschutzhinweise</a></li>
      <li><a href="https://www.cloudflare.com/cloudflare-customer-dpa/">Cloudflare – Vereinbarung zur Datenverarbeitung</a></li>
      <li><a href="https://www.cloudflare.com/products/email-routing/">Cloudflare – Email Routing</a></li>
      <li><a href="https://www.cloudflare.com/privacypolicy/">Cloudflare Turnstile – Datenschutzinformationen des Anbieters</a></li>
      <li><a href="https://resend.com/legal/privacy-policy">Resend – Datenschutzhinweise</a></li>
      <li><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj">Datenschutz-Grundverordnung – amtlicher Text</a></li>
    </ul>
  </div>;
}
