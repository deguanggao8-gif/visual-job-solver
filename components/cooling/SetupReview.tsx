"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CoolingAnswers } from "@/lib/cooling/types";
import { REVIEW_EMAIL, reviewDraft, reviewMailto } from "@/lib/cooling/review";
import { trackCooling } from "@/lib/cooling/analytics";
import styles from "./cooling.module.css";

export default function SetupReview({ answers }: { answers: CoolingAnswers }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const draftArea = useRef<HTMLTextAreaElement>(null);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start" }); }, []);
  function prepare(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDraft(reviewDraft(answers, email, notes, "de"));
    setMessage("Der Entwurf wurde lokal erstellt. Es wurde nichts versendet. Öffne dein E-Mail-Programm oder kopiere den Entwurf.");
    trackCooling("lead_draft_prepared");
  }
  async function copy() {
    try { await navigator.clipboard.writeText(draft); setMessage("Entwurf kopiert. Füge ihn in eine E-Mail an " + REVIEW_EMAIL + "."); }
    catch {
      draftArea.current?.focus(); draftArea.current?.select();
      setMessage("Markiere und kopiere den Entwurf unten und füge ihn in dein E-Mail-Programm ein.");
    }
  }
  return <section className={styles.reviewForm} aria-labelledby="setup-review-title">
    <h2 id="setup-review-title" ref={heading} tabIndex={-1}>Deine Anfrage vorbereiten</h2>
    <p>Deine E-Mail-Adresse und Notizen bleiben auf dieser Seite, bis du dein E-Mail-Programm öffnest oder sie kopierst. Sie werden nicht zusammen mit deinen Fragebogenantworten gespeichert.</p>
    <form onSubmit={prepare}>
      <label htmlFor="review-email">E-Mail-Adresse für die Antwort</label>
      <input id="review-email" type="email" autoComplete="email" required maxLength={254} value={email}
        onChange={e => { setEmail(e.target.value); setDraft(""); setMessage(""); }} />
      <label htmlFor="review-notes">Deine Frage / Anmerkungen</label>
      <textarea id="review-notes" required maxLength={1000} rows={4} value={notes}
        placeholder="Was möchtest du zu deinem Fenster oder Außenbereich klären?"
        onChange={e => { setNotes(e.target.value); setDraft(""); setMessage(""); }} />
      <p className="small muted">Fotos von Fenster, Raum oder Balkon kannst du in deinem E-Mail-Programm anhängen. Teile nur die Angaben, die du weitergeben möchtest.</p>
      <button type="submit" className="btn">E-Mail-Entwurf erstellen</button>
    </form>
    <p role="status" className={styles.draftStatus}>{message}</p>
    {draft && <div>
      <div className="btn-row">
        <a className="btn" href={reviewMailto(draft, "de")} onClick={() => trackCooling("lead_email_opened")}>E-Mail-Programm öffnen</a>
        <button className="btn btn-secondary" type="button" onClick={copy}>Entwurf kopieren</button>
      </div>
      <p className="small">Senden an <a href={`mailto:${REVIEW_EMAIL}`}>{REVIEW_EMAIL}</a>. Du versendest die Nachricht in deinem E-Mail-Programm. Diese Website kann den Eingang nicht bestätigen.</p>
      <label htmlFor="review-draft">Dein Entwurf</label>
      <textarea ref={draftArea} id="review-draft" readOnly rows={8} value={draft} />
    </div>}
  </section>;
}
