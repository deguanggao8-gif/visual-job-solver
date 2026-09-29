"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AnswerField, Option } from "@/lib/cooling/types";
import { allComplete, stepComplete, updateAnswer } from "@/lib/cooling/questions";
import { evaluateCooling } from "@/lib/cooling/engine";
import { DE_QUESTIONS as QUESTIONS, deAnswerLabel as answerLabel, germanResult, TECHNICAL_LABELS, PRACTICAL_LABELS } from "@/lib/cooling/de";
import { emptySession, restoreSession, serializeSession, STORAGE_KEY, type CoolingSession } from "@/lib/cooling/session";
import { trackCooling } from "@/lib/cooling/analytics";
import { nextStep, personalizedSummary } from "@/lib/cooling/presentation";
import SetupReview from "./SetupReview";
import Methodology from "./Methodology";
import styles from "./cooling.module.css";

function Choices({ field, options, value, multiple, onChange }: {
  field: AnswerField; options: readonly Option[]; value: string | string[] | null;
  multiple?: boolean; onChange: (field: AnswerField, value: string | string[]) => void;
}) {
  return <div className={styles.choices}>{options.map(o => {
    const selected = Array.isArray(value) ? value.includes(o.value) : value === o.value;
    return <label className={styles.choice} data-selected={selected} key={o.value}>
      <input type={multiple ? "checkbox" : "radio"} name={field} value={o.value} checked={selected}
        onChange={() => onChange(field, multiple
          ? selected ? (Array.isArray(value) ? value : []).filter(v => v !== o.value)
            : [...(Array.isArray(value) ? value : []), o.value]
          : o.value)} />
      <span>{o.label}</span>
    </label>;
  })}</div>;
}

export default function CoolingSolver() {
  const [session, setSession] = useState<CoolingSession>(emptySession);
  const [ready, setReady] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const reached = useRef("");
  const { answers, step, phase } = session;
  const result = useMemo(() => germanResult(evaluateCooling(answers)), [answers]);

  useEffect(() => {
    try { setSession(restoreSession(sessionStorage.getItem(STORAGE_KEY))); }
    catch { setStorageUnavailable(true); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(STORAGE_KEY, serializeSession(session)); }
    catch { setStorageUnavailable(true); }
  }, [session, ready]);
  useEffect(() => {
    if (!ready) return;
    if (phase !== "landing") heading.current?.focus();
    const key = phase + ":" + step;
    if (phase === "questions" && reached.current !== key) trackCooling("question_reached", { step: step + 1 });
    reached.current = key;
  }, [phase, step, ready]);

  function change(field: AnswerField, value: string | string[]) {
    setSession(s => ({ ...s, answers: updateAnswer(s.answers, field, value) }));
  }
  function start() {
    trackCooling("solver_started");
    setSession(s => ({ ...s, phase: "questions" }));
  }
  function next() {
    if (!stepComplete(answers, step)) return;
    if (step < QUESTIONS.length - 1) {
      setSession(s => ({ ...s, step: s.step + 1 })); return;
    }
    if (!allComplete(answers)) {
      setSession(s => ({ ...s, step: QUESTIONS.findIndex((_, i) => !stepComplete(answers, i)) }));
      return;
    }
    setReviewOpen(false);
    setSession(s => ({ ...s, phase: "results" }));
    trackCooling("solver_completed", { conflict: result.constraint_conflict });
    for (const o of result.options) {
      trackCooling(`result_${o.category}`, { category: o.category, technical_fit: o.technical_fit, practical_fit: o.practical_fit });
    }
    if (result.constraint_conflict) trackCooling("constraint_conflict");
  }
  function edit(index: number) {
    setReviewOpen(false);
    setSession(s => ({ ...s, phase: "questions", step: index }));
  }
  function review() {
    trackCooling("setup_review_clicked");
    setReviewOpen(true);
    if (reviewOpen) document.getElementById("setup-review-title")?.focus();
  }
  function reset() {
    setReviewOpen(false);
    setSession(emptySession());
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* In-memory reset still works. */ }
  }

  return <div className={styles.solver}>
    <div className={styles.eyebrow}><span className="chip">Deutschland · Beta</span><span>Kühllösungen für deine Wohnung</span></div>
    {phase === "landing" && <section className={styles.hero}>
      <h1>Welche Kühllösung passt wirklich zu deiner Wohnung?</h1>
      <p className="lead">Prüfe Fenster, Einbaumöglichkeiten und wichtige Einschränkungen, bevor du ein Klimagerät kaufst.</p>
      <p className={styles.intro}>Dauert etwa 2 Minuten.</p>
      <button type="button" className="btn" onClick={start} disabled={!ready}>Meine Möglichkeiten prüfen <span aria-hidden="true">→</span></button>
      <p className={styles.reassurance}>Keine Markenempfehlung. Kein Kauf erforderlich.</p>
      <div className={styles.routeStrip} aria-label="So funktioniert die Einschätzung">
        <span><b>01</b> Deine Wohnsituation</span><span><b>02</b> Deine Einschränkungen</span><span><b>03</b> Deine Möglichkeiten</span>
      </div>
      <p className="small muted">Für einen Raum in Deutschland. Erste Orientierung zu Lösungsarten, keine Freigabe oder Geräteauslegung.</p>
    </section>}

    {phase === "questions" && <section>
      <div className={styles.progressHeader}><span key={step} aria-live="polite">{`Schritt ${step + 1} von ${QUESTIONS.length}`}</span><span>Deutschland / DE</span></div>
      <progress className={styles.progress} value={step + 1} max={QUESTIONS.length} aria-label="Fortschritt" />
      <h1 className={styles.questionTitle} id="cooling-question" ref={heading} tabIndex={-1}>{QUESTIONS[step].title}</h1>
      {QUESTIONS[step].helper && <p id="cooling-hint" className="muted">{QUESTIONS[step].helper}</p>}
      <fieldset className={styles.questionFieldset} aria-labelledby="cooling-question"
        aria-describedby={QUESTIONS[step].helper ? "cooling-hint" : undefined}>
        <Choices field={QUESTIONS[step].field} options={QUESTIONS[step].options}
          value={answers[QUESTIONS[step].field]} multiple={QUESTIONS[step].multiple} onChange={change} />
      </fieldset>
      {(() => {
        const follow = QUESTIONS[step].followup;
        if (!follow || answers[QUESTIONS[step].field] !== follow.when) return null;
        return <fieldset className={styles.followup}><legend>{follow.title}</legend>
          <Choices field={follow.field} options={follow.options} value={answers[follow.field]} onChange={change} />
        </fieldset>;
      })()}
      {QUESTIONS[step].field === "usage" && answers.usage.includes("sleep") && <p className="small">✓ Wir berücksichtigen die Geräuschentwicklung im Raum.</p>}
      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={() => setSession(s =>
          s.step === 0 ? { ...s, phase: "landing" } : { ...s, step: s.step - 1 })}>Zurück</button>
        <button type="button" className="btn" onClick={next} disabled={!stepComplete(answers, step)}>
          {step === QUESTIONS.length - 1 ? "Meine Möglichkeiten anzeigen" : "Weiter"} <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="small muted">{storageUnavailable ? "Dein Fortschritt kann in diesem Tab nicht gespeichert werden. Lass ihn während der Einschätzung geöffnet."
        : "Deine Antworten bleiben in diesem Tab gespeichert. Du kannst zurückgehen und sie ändern."}</p>
    </section>}

    {phase === "results" && <section>
      <h1 ref={heading} tabIndex={-1}>Deine Kühlmöglichkeiten</h1>
      <p className="lead">Auf Basis deiner Angaben zeigen wir dir, welche Lösungen du näher prüfen solltest – und wo noch offene Punkte bestehen.</p>
      <div className={styles.personalized} aria-label="Deine Situation im Überblick"><h2>Deine Situation im Überblick</h2><p>{personalizedSummary(result).join(" ")}</p></div><p className="small muted">Technische Eignung und praktische Eignung werden getrennt bewertet. Eine technisch geeignete Lösung muss nicht in dein Budget passen und ist damit noch nicht zur Installation freigegeben.</p>
      {result.constraint_conflict ? <div className={styles.reviewBanner}>
        <span className="chip chip--scope">Weitere Prüfung nötig</span>
        <h2>Deine Situation hat wichtige Einschränkungen</h2>
        <p>Nach deinen Angaben lässt sich derzeit keine der üblichen Installationsmöglichkeiten bestätigen.</p>
        <ul>{result.conflict_reasons.map(r => <li key={r}>{r}</li>)}</ul>
        <button className="btn" type="button" onClick={review}>Meine Situation prüfen</button>
      </div> : result.needs_review ? <div className="callout callout--scope">
        <strong>Einige Optionen müssen näher geprüft werden.</strong> Ein unklarer Fenstertyp oder Außenstandort bedeutet nicht, dass eine Lösung ausgeschlossen ist.
      </div> : null}

      <div className={styles.results}>{result.options.map(o => <article className={styles.resultCard} key={o.category} data-category={o.category}>
        <div className={styles.cardTop}><div><span className={styles.fitLabel}>Technische Eignung</span><span className="chip" data-fit={o.technical_fit}>{TECHNICAL_LABELS[o.technical_fit]}</span></div>
          <span className={styles.categoryNumber}>{o.category === "fixed_split" ? "01" : o.category === "portable_split" ? "02" : "03"}</span></div>
        <h2>{o.title}</h2>
        <p className={styles.practical}><span>Praktische Eignung</span><strong>{PRACTICAL_LABELS[o.practical_fit]}</strong></p>
        <div className={styles.nextStep}><h3>Nächster Schritt</h3><p>{nextStep(o)}</p>{(o.technical_fit === "review" || o.technical_fit === "poor_fit") && <button className="btn" type="button" onClick={review}>Meine Situation prüfen</button>}</div>
        <h3>Warum diese Option infrage kommt</h3>
        <ul>{o.why.map(t => <li key={t}>{t}</li>)}</ul>
        <h3>Was du noch prüfen solltest</h3>
        <ul>{o.checks.map(t => <li key={t}>{t}</li>)}</ul>
        <h3>Wichtige Abwägungen</h3>
        <ul>{o.tradeoffs.map(t => <li key={t}>{t}</li>)}</ul>
      </article>)}</div>

      <details className={styles.summary}>
        <summary>Deine Antworten · Angaben ändern</summary>
        <dl>{QUESTIONS.map((q, i) => <div key={q.field}>
          <dt>{q.title}</dt><dd>{Array.isArray(answers[q.field])
            ? (answers[q.field] as string[]).map(v => answerLabel(q.field, v)).join(", ")
            : answerLabel(q.field, answers[q.field] as string | null)}
            {q.followup && answers[q.field] === q.followup.when &&
              <span> · {q.followup.title} {answerLabel(q.followup.field, answers[q.followup.field] as string | null)}</span>}
            <button className={styles.textButton} type="button" aria-label={`Schritt ${i + 1} ändern: ${q.title}`} onClick={() => edit(i)}>Ändern</button>
          </dd>
        </div>)}</dl>
      </details>

      <div className={styles.reviewBanner}>
        <h2>Passt diese Lösung wirklich zu deiner Situation?</h2>
        
        <p>Einige Punkte hängen vom tatsächlichen Fenster, Außenbereich und der Raumaufteilung ab.</p>
        <button className="btn" type="button" onClick={review}>Meine Situation prüfen</button>
        <p className="small muted">Du kannst uns kurz beschreiben, was du prüfen möchtest. Fotos von Fenster, Raum oder Balkon können bei der Einschätzung helfen.</p>
      </div>
      {reviewOpen && <SetupReview answers={answers} />}
      <p className={styles.scope}><strong>Hinweis</strong><br />Dieses Tool bietet eine erste Orientierung auf Basis deiner Angaben. Es ersetzt keine technische, rechtliche oder bauliche Prüfung vor Ort. Genehmigungen, sichere Montage, elektrische Voraussetzungen, Kühllast und die Eignung eines konkreten Geräts müssen bei Bedarf separat geprüft werden.</p>
      <button className={styles.textButton} type="button" onClick={reset}>Neue Einschätzung starten und gespeicherte Antworten löschen</button>
    </section>}
    <Methodology />
    <noscript>Diese interaktive Einschätzung benötigt JavaScript. Du kannst uns deine Angaben auch über die Kontaktseite senden.</noscript>
  </div>;
}
