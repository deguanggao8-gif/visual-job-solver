import { emptyAnswers, type AnswerField, type CoolingAnswers, type Question } from "./types";

const certainty = [
  { value: "yes", label: "Yes" }, { value: "no", label: "No" },
  { value: "unknown", label: "Not sure" },
] as const;
export const QUESTIONS: readonly Question[] = [
  { field: "housing", title: "Do you rent or own this home?", options: [
    { value: "rent", label: "Rent" }, { value: "own", label: "Own" },
    { value: "unknown", label: "Other / Not sure" },
  ]},
  { field: "permanent_installation", title: "Are permanent changes to the building allowed?",
    helper: "For example: drilling through an exterior wall or permanently mounting AC equipment.",
    options: [...certainty.slice(0, 2), { value: "unknown", label: "Not sure / Need landlord approval" }] },
  { field: "window_type", title: "What type of window do you have in the room?", options: [
    { value: "tilt_turn", label: "Tilt & Turn" }, { value: "casement", label: "Casement" },
    { value: "sliding", label: "Sliding" }, { value: "balcony_door", label: "Balcony Door" },
    { value: "fixed", label: "Fixed Window" }, { value: "unknown", label: "Other / I don't know" },
  ], helper: "Tilt & Turn opens inward and can tilt at the top. Casement opens on a side hinge." },
  { field: "outdoor_space", title: "Do you have a balcony or another safe outdoor space next to this room?",
    options: certainty, followup: { when: "yes", field: "outdoor_unit_possible",
      title: "Could a small outdoor AC unit potentially sit there?", options: certainty } },
  { field: "exterior_restrictions", title: "Are there restrictions on placing equipment outside your window or on the balcony?",
    helper: "For example: landlord rules, building rules, façade restrictions or safety concerns.",
    options: [{ value: "none", label: "No known restrictions" },
      { value: "restricted", label: "Yes, restrictions apply" }, { value: "unknown", label: "I don't know" }],
    followup: { when: "restricted", field: "exterior_prohibition",
      title: "Do those restrictions explicitly prohibit outdoor AC equipment?", options: certainty } },
  { field: "room_size_m2", title: "How large is the room you want to cool?",
    helper: "A rough range is enough. This is not a cooling-load calculation.",
    options: [{ value: "under_15", label: "Under 15 m²" }, { value: "15_25", label: "15–25 m²" },
      { value: "25_40", label: "25–40 m²" }, { value: "40_60", label: "40–60 m²" },
      { value: "over_60", label: "Over 60 m²" }, { value: "unknown", label: "I don't know" }] },
  { field: "usage", title: "When do you mainly need cooling?", helper: "Select all that apply.", multiple: true,
    options: [{ value: "sleep", label: "Sleeping at night" }, { value: "work", label: "Working from home" },
      { value: "daytime", label: "Daytime living" }, { value: "heatwaves", label: "Occasional heat waves" },
      { value: "summer", label: "Most of the summer" }] },
  { field: "budget_eur", title: "What's your approximate budget for the cooling setup?",
    helper: "Think about the full setup, including accessories and any installation.",
    options: [{ value: "under_300", label: "Under €300" }, { value: "300_700", label: "€300–700" },
      { value: "700_1500", label: "€700–1,500" }, { value: "1500_plus", label: "€1,500+" },
      { value: "unknown", label: "Not sure yet" }] },
];

export function stepComplete(answers: CoolingAnswers, index: number): boolean {
  const q = QUESTIONS[index];
  if (!q) return false;
  const value = answers[q.field];
  if (Array.isArray(value) ? !value.length : value === null) return false;
  return !q.followup || value !== q.followup.when || answers[q.followup.field] !== null;
}
export function allComplete(a: CoolingAnswers) {
  return QUESTIONS.every((_, i) => stepComplete(a, i));
}
export function updateAnswer(a: CoolingAnswers, field: AnswerField, value: string | string[]): CoolingAnswers {
  const next = { ...a, [field]: value };
  if (field === "outdoor_space" && value !== "yes") next.outdoor_unit_possible = null;
  if (field === "exterior_restrictions" && value !== "restricted") next.exterior_prohibition = null;
  return normalizeAnswers(next);
}
/** Treat restored data as untrusted. Unknown enum values become unanswered. */
export function normalizeAnswers(raw: unknown): CoolingAnswers {
  const clean = emptyAnswers();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return clean;
  const input = raw as Record<string, unknown>;
  for (const q of QUESTIONS) {
    const fields = [{ field: q.field, options: q.options }, ...(q.followup ? [q.followup] : [])];
    for (const f of fields) {
      const value = input[f.field];
      if (f.field === "usage") {
        clean.usage = Array.isArray(value)
          ? [...new Set(value.filter((v): v is CoolingAnswers["usage"][number] =>
            typeof v === "string" && f.options.some(o => o.value === v)))] : [];
      } else if (typeof value === "string" && f.options.some(o => o.value === value)) {
        // This assignment is guarded by the enum options belonging to this field.
        Object.assign(clean, { [f.field]: value });
      }
    }
  }
  if (clean.outdoor_space !== "yes") clean.outdoor_unit_possible = null;
  if (clean.exterior_restrictions !== "restricted") clean.exterior_prohibition = null;
  return clean;
}
export function answerLabel(field: AnswerField, value: string | null): string {
  for (const q of QUESTIONS) {
    const config = q.field === field ? q : q.followup?.field === field ? q.followup : null;
    if (config) return config.options.find(o => o.value === value)?.label ?? "Not answered";
  }
  return "Not answered";
}
