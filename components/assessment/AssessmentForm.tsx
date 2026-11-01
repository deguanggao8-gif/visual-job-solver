"use client";

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { assessmentErrorMessage, canSubmitAssessment, challengeReducer, initialChallengeState, type FormState } from "./assessment-state";

const endpoint = process.env.NEXT_PUBLIC_ASSESSMENT_ENDPOINT?.trim();
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function AssessmentForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [challenge, dispatchChallenge] = useReducer(challengeReducer, initialChallengeState);
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const submissionIdRef = useRef("");

  useEffect(() => {
    if (!scriptReady || !window.turnstile || !challengeRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(challengeRef.current, {
      sitekey: turnstileSiteKey,
      action: "assessment_submit",
      theme: "auto",
      callback: (token: string) => dispatchChallenge({ type: "VERIFIED", token }),
      "expired-callback": () => {
        dispatchChallenge({ type: "EXPIRED" });
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
      "error-callback": () => {
        dispatchChallenge({ type: "FAILED" });
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
      },
    });
    dispatchChallenge({ type: "READY" });
  }, [scriptReady]);

  const resetChallenge = useCallback(() => {
    dispatchChallenge({ type: "RESET" });
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");
    if (!form.reportValidity()) return;
    if (!endpoint || !turnstileSiteKey) {
      setState("error");
      setMessage("Online submission is not configured yet. No information has been sent.");
      return;
    }
    if (!canSubmitAssessment(state, challenge)) {
      setState("error");
      setMessage("Complete the anti-abuse check before submitting.");
      return;
    }
    setState("submitting");
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload["cf-turnstile-response"] = challenge.token;
      // Keep one ID across safe retries so the Function and mail provider can
      // recognize the same logical inquiry and suppress duplicate delivery.
      submissionIdRef.current ||= crypto.randomUUID();
      payload.submissionId = submissionIdRef.current;
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
      } catch { throw new Error("NETWORK_ERROR"); }
      const result = await response.json().catch(() => null) as { ok?: boolean; error?: { code?: string; message?: string } } | null;
      if (!response.ok || !result?.ok) throw new Error(result?.error?.code || `HTTP_${response.status}`);
      setState("success");
      setMessage("Your request was received. We will review the scope before proposing any engagement.");
      form.reset();
      submissionIdRef.current = "";
      resetChallenge();
    } catch (error) {
      const code = error instanceof Error ? error.message : "NETWORK_ERROR";
      setState("error");
      setMessage(assessmentErrorMessage(code));
      resetChallenge();
    }
  }

  return <form className="assessment-form" onSubmit={submit}>
    <div className="input-row">
      <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" required minLength={2} /></div>
      <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
    </div>
    <div className="input-row">
      <div className="field"><label htmlFor="organisation">Organisation <span className="field__hint">optional</span></label><input id="organisation" name="organisation" autoComplete="organization" /></div>
      <div className="field"><label htmlFor="location">Project location</label><input id="location" name="location" required minLength={2} /></div>
    </div>
    <div className="field"><label htmlFor="projectType">Project type</label><select id="projectType" name="projectType" required defaultValue=""><option value="" disabled>Select one</option><option>Existing-building HVAC review</option><option>Cooling or heating options assessment</option><option>Early-stage technical due diligence</option><option>Other defined HVAC question</option></select></div>
    <div className="field"><label htmlFor="brief">What decision do you need to make?</label><textarea id="brief" name="brief" required minLength={40} maxLength={4000} rows={7} placeholder="Describe the building, current problem, available information, constraints and the decision deadline." /><p className="field__hint">Minimum 40 characters. Do not include sensitive personal data.</p></div>
    <div className="field"><label htmlFor="timeline">Target timeline</label><select id="timeline" name="timeline" required defaultValue=""><option value="" disabled>Select one</option><option>Within 2 weeks</option><option>Within 1 month</option><option>Within 3 months</option><option>Exploratory / no fixed date</option></select></div>
    <label className="checkbox-line"><input name="privacyConsent" value="accepted" type="checkbox" required /><span>I agree that the information I provide may be processed to assess and respond to this request. I have read the <a href="/datenschutz/" target="_blank">privacy notice</a>.</span></label>
    <label className="checkbox-line"><input name="scopeAcknowledgement" value="accepted" type="checkbox" required /><span>I understand that this request does not create an engagement and that the service is not statutory design, certification, permitting, or locally licensed professional practice.</span></label>
    {turnstileSiteKey && <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} /><div ref={challengeRef} className="cf-turnstile" /><p className="small muted" role="status">{challenge.status === "verified" ? "Anti-abuse check complete. You can submit the form." : challenge.status === "expired" ? "The anti-abuse check expired. Please complete it again." : challenge.status === "error" ? "The anti-abuse check failed to load or verify. Please try it again." : "Complete the anti-abuse check to enable submission."}</p></>}
    {(!endpoint || !turnstileSiteKey) && <div className="form-status form-status--notice" role="status"><strong>Development preview:</strong> the secure receiving endpoint or anti-abuse check is not configured. Online submission is unavailable and this form is not production-ready.</div>}
    {message && <div className={`form-status form-status--${state}`} role={state === "error" ? "alert" : "status"}>{message}</div>}
    <button className="btn" type="submit" disabled={!endpoint || !turnstileSiteKey || !canSubmitAssessment(state, challenge)}>{state === "submitting" ? "Sending…" : "Request an assessment"}</button>
    <p className="small muted">No payment is taken through this form. Scope, availability, fee and terms must be agreed separately in writing.</p>
  </form>;
}
