export type Certainty = "yes" | "no" | "unknown";
export type TechnicalFit = "suitable" | "possible" | "poor_fit" | "blocked" | "review";
export type PracticalFit = "good" | "tradeoffs" | "budget_mismatch" | "unknown";
export type Category = "fixed_split" | "portable_split" | "monoblock";
export type ExhaustPath = "yes" | "possible" | "no" | "unknown";
export interface CoolingAnswers {
  country: "DE";
  housing: "rent" | "own" | "unknown" | null;
  permanent_installation: Certainty | null;
  window_type: "tilt_turn" | "casement" | "sliding" | "balcony_door" | "fixed" | "unknown" | null;
  outdoor_space: Certainty | null;
  outdoor_unit_possible: Certainty | null;
  exterior_restrictions: "none" | "restricted" | "unknown" | null;
  exterior_prohibition: Certainty | null;
  room_size_m2: "under_15" | "15_25" | "25_40" | "40_60" | "over_60" | "unknown" | null;
  usage: Array<"sleep" | "work" | "daytime" | "heatwaves" | "summer">;
  budget_eur: "under_300" | "300_700" | "700_1500" | "1500_plus" | "unknown" | null;
}
export type AnswerField = Exclude<keyof CoolingAnswers, "country">;
export interface Option { value: string; label: string }
export interface Question {
  field: AnswerField;
  title: string;
  helper?: string;
  options: readonly Option[];
  multiple?: boolean;
  followup?: {
    when: string;
    field: AnswerField;
    title: string;
    options: readonly Option[];
  };
}
export interface CoolingOption {
  category: Category;
  title: string;
  technical_fit: TechnicalFit;
  practical_fit: PracticalFit;
  why: string[];
  checks: string[];
  tradeoffs: string[];
  flags: string[];
  rule_ids: string[];
}
export interface CoolingResult {
  options: CoolingOption[];
  exhaust_path: ExhaustPath;
  needs_review: boolean;
  constraint_conflict: boolean;
  conflict_reasons: string[];
  rule_ids: string[];
}
export function emptyAnswers(): CoolingAnswers {
  return { country: "DE", housing: null, permanent_installation: null, window_type: null,
    outdoor_space: null, outdoor_unit_possible: null, exterior_restrictions: null,
    exterior_prohibition: null, room_size_m2: null, usage: [], budget_eur: null };
}
