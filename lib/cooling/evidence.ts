import type { Category } from "./types";

export interface RuleEvidence {
  rule_id: string;
  country: "DE";
  category: Category | "general";
  confidence: "high" | "medium" | "needs_verification";
  source_type: "consumer_authority" | "manufacturer" | "product_policy";
  source_name: string;
  source_url: string | null;
  last_verified: string | null;
  scope: string;
}
const consumer = {
  confidence: "high", source_type: "consumer_authority", source_name: "Verbraucherzentrale",
  source_url: "https://www.verbraucherzentrale.de/wissen/energie/energetische-sanierung/klimaanlage-installieren-was-ist-zu-beachten-10525",
  last_verified: "2026-09-29",
} as const;
const policy = {
  confidence: "needs_verification", source_type: "product_policy",
  source_name: "Cooling Solver V1 product specification",
  source_url: null, last_verified: null,
} as const;
function evidence(rule_id: string, category: RuleEvidence["category"], scope: string,
  source: typeof consumer | typeof policy | Omit<RuleEvidence, "rule_id" | "country" | "category" | "scope"> = policy): RuleEvidence {
  return { rule_id, country: "DE", category, ...source, scope };
}
export const RULES = {
  DE_FIXED_SPLIT_001: evidence("DE_FIXED_SPLIT_001", "fixed_split",
    "Permanent split systems need building work and installation checks. No legal approval is inferred from housing tenure.", consumer),
  DE_EXTERIOR_001: evidence("DE_EXTERIOR_001", "general",
    "An explicitly reported outdoor-equipment prohibition blocks outdoor-unit routes. Generic restrictions trigger checks, not a ban."),
  DE_PORTABLE_SPLIT_001: evidence("DE_PORTABLE_SPLIT_001", "portable_split",
    "A portable split has an outdoor component and a connecting-line route; the user's proposed location is not certified safe.", consumer),
  DE_PORTABLE_SPLIT_002: evidence("DE_PORTABLE_SPLIT_002", "portable_split",
    "Manufacturer example of window/balcony arrangements. Supports reviewing alternatives without a balcony; does not prove compatibility of other models or windows.",
    { confidence: "medium", source_type: "manufacturer", source_name: "Midea PortaSplit installation",
      source_url: "https://www.midea.com/de/klimatisieren-heizen/portasplit/installation",
      last_verified: "2026-09-29" }),
  DE_MONOBLOCK_001: evidence("DE_MONOBLOCK_001", "monoblock",
    "An exhaust route to outside is necessary; window sealing must be checked. Window-type mappings remain provisional screening, not measurements.", consumer),
  DE_UNKNOWN_001: evidence("DE_UNKNOWN_001", "general",
    "Unknown route/permission is uncertainty, never automatic evidence of impossibility."),
  DE_NOISE_001: evidence("DE_NOISE_001", "general",
    "Nighttime use calls for indoor/outdoor noise checks, not a ban on any category.", consumer),
  DE_ROOM_001: evidence("DE_ROOM_001", "general",
    "Area alone is not a cooling-load calculation. Size buckets are questionnaire context; professional sizing still requires other conditions.", consumer),
  DE_BUDGET_001: evidence("DE_BUDGET_001", "general",
    "Indicative screening only: under €300 for all categories and €300–700 for fixed split flag possible full-setup budget mismatch. Not sourced prices or quotations."),
  DE_CONFLICT_001: evidence("DE_CONFLICT_001", "general",
    "When no standard route can be confirmed, show constraints and request setup review rather than select a winner."),
} satisfies Record<string, RuleEvidence>;
export type RuleId = keyof typeof RULES;
