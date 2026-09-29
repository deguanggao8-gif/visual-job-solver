import type { Category, PracticalFit, TechnicalFit } from "./types";

export type CoolingEvent = "solver_started" | "question_reached" | "solver_completed"
  | "result_fixed_split" | "result_portable_split" | "result_monoblock"
  | "constraint_conflict" | "setup_review_clicked" | "lead_submitted"
  | "lead_draft_prepared" | "lead_email_opened";
export interface EventProperties {
  step?: number;
  category?: Category;
  technical_fit?: TechnicalFit;
  practical_fit?: PracticalFit;
  conflict?: boolean;
}
/** No tracker or network call. A future consent-aware adapter can subscribe.
 * lead_submitted is reserved for confirmed backend receipt, never mailto clicks. */
export function trackCooling(event: CoolingEvent, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;
  const { step, category, technical_fit, practical_fit, conflict } = properties;
  try {
    window.dispatchEvent(new CustomEvent("vjs:analytics", {
      detail: { event, solver: "germany_apartment_cooling", version: 1,
        properties: { step, category, technical_fit, practical_fit, conflict } },
    }));
  } catch { /* Measurement must never prevent completing a check. */ }
}
