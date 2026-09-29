import { allComplete, normalizeAnswers, QUESTIONS } from "./questions";
import { emptyAnswers, type CoolingAnswers } from "./types";

export const STORAGE_KEY = "vjs:cooling:de:v1";
export interface CoolingSession { answers: CoolingAnswers; step: number; phase: "landing" | "questions" | "results" }
export function emptySession(): CoolingSession {
  return { answers: emptyAnswers(), step: 0, phase: "landing" };
}
export function restoreSession(raw: string | null): CoolingSession {
  if (!raw) return emptySession();
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !parsed.answers || parsed.answers.country !== "DE") return emptySession();
    const answers = normalizeAnswers(parsed.answers);
    const step = Number.isInteger(parsed.step) ? Math.max(0, Math.min(QUESTIONS.length - 1, parsed.step)) : 0;
    const phase = parsed.phase === "results" && allComplete(answers) ? "results"
      : parsed.phase === "questions" || parsed.phase === "results" ? "questions" : "landing";
    return { answers, step, phase };
  } catch { return emptySession(); }
}
export function serializeSession(s: CoolingSession): string {
  return JSON.stringify({ version: 1, answers: normalizeAnswers(s.answers), step: s.step, phase: s.phase });
}
