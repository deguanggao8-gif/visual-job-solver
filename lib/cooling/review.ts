import { de } from "./de";
import { answerLabel, QUESTIONS } from "./questions";
import type { CoolingAnswers } from "./types";

export const REVIEW_EMAIL = "contact@visualjobsolver.com";
export function reviewDraft(a: CoolingAnswers, email: string, notes: string, locale: "en" | "de" = "en") {
  const text = locale === "de" ? de : (value: string) => value;
  const label = (field: Parameters<typeof answerLabel>[0], value: string | null) => text(answerLabel(field, value));
  const lines = [text("Germany Apartment Cooling — Setup Review"), "", (locale === "de" ? "E-Mail-Adresse für die Antwort: " : "Reply email: ") + email.trim(), text("Country: Germany")];
  for (const q of QUESTIONS) {
    const value = a[q.field];
    lines.push(text(q.title), Array.isArray(value) ? value.map(v => label(q.field, v)).join(", ") : label(q.field, value));
    if (q.followup && value === q.followup.when) {
      const v = a[q.followup.field];
      lines.push(text(q.followup.title), label(q.followup.field, typeof v === "string" ? v : null));
    }
    lines.push("");
  }
  lines.push(text("Question / notes:"), notes.trim(), "", text("Photos I may attach: window, room/window area, balcony (if available)."),
    text("Please help me understand which setup details still need checking."));
  return lines.join("\r\n");
}
export function reviewMailto(draft: string, locale: "en" | "de" = "en") {
  return "mailto:" + REVIEW_EMAIL + "?subject=" + encodeURIComponent(locale === "de" ? de("Germany Apartment Cooling — Setup Review") : "Germany Apartment Cooling — Setup Review")
    + "&body=" + encodeURIComponent(draft);
}
