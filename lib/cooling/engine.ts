import { answerLabel, normalizeAnswers } from "./questions";
import { RULES, type RuleId } from "./evidence";
import type { Category, CoolingAnswers, CoolingOption, CoolingResult, ExhaustPath } from "./types";

export const CATEGORY_TITLES: Record<Category, string> = {
  fixed_split: "Fixed Split / Mini-split",
  portable_split: "Portable Split AC",
  monoblock: "Portable Monoblock AC",
};
function option(category: Category): CoolingOption {
  return { category, title: CATEGORY_TITLES[category], technical_fit: "review", practical_fit: "unknown",
    why: [], checks: [], tradeoffs: [], flags: [], rule_ids: [] };
}
function rule(o: CoolingOption, id: RuleId) {
  if (!o.rule_ids.includes(id)) o.rule_ids.push(id);
}
export function deriveExhaustPath(a: CoolingAnswers): ExhaustPath {
  return a.window_type && !["fixed", "unknown"].includes(a.window_type) ? "possible" : "unknown";
}
export function monoblockTechnicalFit(path: ExhaustPath): CoolingOption["technical_fit"] {
  return path === "no" ? "blocked" : path === "unknown" ? "review" : "possible";
}
function addPracticalFit(o: CoolingOption, a: CoolingAnswers) {
  rule(o, "DE_BUDGET_001");
  const budgetMismatch = a.budget_eur === "under_300" ||
    (o.category === "fixed_split" && a.budget_eur === "300_700");
  o.practical_fit = !a.budget_eur || a.budget_eur === "unknown" ? "unknown"
    : budgetMismatch ? "budget_mismatch"
    : o.technical_fit === "suitable" && !a.usage.includes("sleep") &&
      a.room_size_m2 !== "unknown" && a.room_size_m2 !== null &&
      a.room_size_m2 !== "over_60" && a.room_size_m2 !== "40_60" ? "good" : "tradeoffs";
  if (budgetMismatch) {
    o.tradeoffs.push("Your budget may not cover a complete setup. This is an indicative budget flag, not a verified price or quote.");
  } else if (o.practical_fit === "unknown") {
    o.checks.push("Set a full-setup budget, including accessories and installation, before comparing costs.");
  } else {
    o.checks.push("Confirm the total equipment, accessories and installation cost; your budget band is not a price guarantee.");
  }
  rule(o, "DE_ROOM_001");
  if (a.room_size_m2 === null || a.room_size_m2 === "unknown") {
    o.checks.push("Confirm room dimensions and heat conditions before equipment sizing.");
    o.flags.push("room_size_check");
  } else if (["40_60", "over_60"].includes(a.room_size_m2)) {
    o.checks.push("Ask for a room-specific capacity assessment for this larger space; this check does not calculate cooling load.");
    o.flags.push("capacity_review");
  }
  if (a.usage.includes("sleep")) {
    rule(o, "DE_NOISE_001");
    o.flags.push("indoor_noise_consideration");
    o.tradeoffs.push(o.category === "monoblock"
      ? "The compressor is indoors: check its noise at the operating setting you would use while sleeping."
      : "Check indoor-unit sound for sleep and outdoor sound near neighbours; a split layout is not a silence guarantee.");
  } else if (a.usage.includes("work")) {
    o.tradeoffs.push("Check operating noise at your desk, especially during calls.");
  }
  if (a.usage.includes("summer")) o.tradeoffs.push("Compare running costs and maintenance for frequent summer use.");
}
export function evaluateCooling(input: CoolingAnswers): CoolingResult {
  const a = normalizeAnswers(input);
  const banned = a.exterior_restrictions === "restricted" && a.exterior_prohibition === "yes";
  const permissionsUnclear = a.exterior_restrictions !== "none";
  const exhaust_path = deriveExhaustPath(a);
  const opening = exhaust_path === "possible";
  const place = a.outdoor_space === "yes" && a.outdoor_unit_possible === "yes";

  const fixed = option("fixed_split");
  rule(fixed, "DE_FIXED_SPLIT_001");
  rule(fixed, "DE_EXTERIOR_001");
  fixed.why.push(a.permanent_installation === "no"
    ? "You said permanent building changes are not available."
    : a.permanent_installation === "yes"
      ? "You indicated permanent building changes are allowed."
      : "Permission for permanent building work has not been confirmed.");
  fixed.why.push(banned ? "You reported an explicit prohibition on outdoor AC equipment."
    : a.housing === "rent" ? "Renting alone does not rule this category out; the actual permissions matter."
    : "Your housing status alone does not establish installation permission.");
  if (banned || a.permanent_installation === "no") fixed.technical_fit = "blocked";
  else if (a.permanent_installation === null) fixed.technical_fit = "review";
  else fixed.technical_fit = a.permanent_installation === "yes" && !permissionsUnclear && place ? "suitable" : "possible";
  if (a.permanent_installation === "unknown" || a.permanent_installation === null) {
    fixed.flags.push("approval_required"); rule(fixed, "DE_UNKNOWN_001");
    fixed.checks.push("Confirm permission for wall penetrations and permanent equipment with the relevant owner/building parties.");
  }
  if (permissionsUnclear) fixed.checks.push("Clarify the exterior rules before any outdoor installation.");
  fixed.checks.push("Have a qualified installer assess the mounting location, structure, electrical supply and installation route.");
  if (!place) fixed.checks.push("An outdoor-unit location still needs professional assessment; no balcony does not by itself rule out wall mounting.");
  fixed.tradeoffs.push("Permanent work and professional installation add planning, disruption and cost.");

  const split = option("portable_split");
  rule(split, "DE_PORTABLE_SPLIT_001"); rule(split, "DE_EXTERIOR_001");
  split.why.push(a.outdoor_space === "yes"
    ? a.outdoor_unit_possible === "yes" ? "You identified potential outdoor space for a small unit."
      : a.outdoor_unit_possible === "no" ? "The outdoor space you identified cannot currently accommodate a small unit."
      : "You have outdoor space, but the proposed unit placement is not confirmed."
    : "A usable outdoor-unit location has not been identified.");
  split.why.push(a.permanent_installation === "no"
    ? "A temporary arrangement is worth investigating when permanent building changes are unavailable."
    : "A temporary arrangement still needs a suitable route between the indoor and outdoor units.");
  if (a.usage.includes("sleep")) split.why.push("With nighttime use in mind, separating the compressor from the room may be worth investigating.");
  if (banned) {
    split.technical_fit = "blocked";
    split.why.push("You reported an explicit prohibition on outdoor AC equipment.");
  } else if (a.outdoor_space === "yes" && a.outdoor_unit_possible === "no") {
    split.technical_fit = "poor_fit";
    split.checks.push("A different outdoor position would need setup review; the stated position is not practical.");
  } else if (!place || !opening) {
    split.technical_fit = "review";
    rule(split, "DE_UNKNOWN_001"); rule(split, "DE_PORTABLE_SPLIT_002");
    split.flags.push("photo_review");
    split.checks.push("Show the window and outside area so an alternative placement or connecting-line route can be reviewed.");
  } else split.technical_fit = permissionsUnclear ? "possible" : "suitable";
  if (permissionsUnclear && !banned) {
    split.flags.push("approval_check");
    split.checks.push("Check landlord/building restrictions; an unknown rule is not an automatic ban.");
  }
  split.checks.push("Verify safe outdoor placement, mounting suitability and the specific model's instructions.",
    "Check how the connecting line passes through the window or door, including closure and sealing.");
  split.tradeoffs.push("The two units must stay connected; placement and opening geometry can limit the arrangement.");

  const mono = option("monoblock");
  rule(mono, "DE_MONOBLOCK_001");
  mono.technical_fit = monoblockTechnicalFit(exhaust_path);
  mono.why.push(opening
    ? "Your " + answerLabel("window_type", a.window_type) + " may provide an exhaust opening."
    : "Your window answer does not confirm a route for exhaust air to the outside.");
  mono.why.push(a.outdoor_space === "no"
    ? "You have no outdoor space identified; this category has no separate outdoor unit, but still needs exhaust."
    : "This category has no separate outdoor unit, but still needs an exhaust route.");
  if (opening) {
    mono.flags.push("window_seal_check");
    mono.checks.push("Confirm a compatible window seal and an unobstructed exhaust route to outside.");
  } else {
    mono.flags.push("photo_review");
    rule(mono, "DE_UNKNOWN_001");
    mono.checks.push("A fixed or unidentified window does not prove impossibility. Show any alternative opening or existing exhaust provision.");
  }
  if (a.exterior_restrictions !== "none") mono.checks.push("Check whether the building rules also restrict visible hoses or window accessories.");
  mono.checks.push("Follow the unit's electrical, hose and condensate instructions.");
  mono.tradeoffs.push("The exhaust hose and window seal occupy part of the opening.");

  const options = [fixed, split, mono];
  for (const o of options) addPracticalFit(o, a);
  const constraint_conflict = !options.some(o => o.technical_fit === "suitable" || o.technical_fit === "possible");
  const conflict_reasons: string[] = [];
  if (constraint_conflict) {
    if (a.permanent_installation === "no") conflict_reasons.push("Permanent building changes are unavailable.");
    if (banned) conflict_reasons.push("You reported a ban on outdoor AC equipment.");
    if (!place) conflict_reasons.push("An outdoor-unit position is unconfirmed or unsuitable.");
    if (!opening) conflict_reasons.push("A window or other route to outside is unconfirmed.");
    if (a.permanent_installation === null) conflict_reasons.push("Permanent-installation permission is unanswered.");
  }
  const rule_ids = [...new Set(options.flatMap(o => o.rule_ids))];
  if (constraint_conflict) rule_ids.push("DE_CONFLICT_001");
  return { options, exhaust_path, constraint_conflict, conflict_reasons,
    needs_review: constraint_conflict || options.some(o => o.technical_fit === "review" || o.technical_fit === "poor_fit"),
    rule_ids };
}
export function statusLabel(o: CoolingOption): string {
  if (o.technical_fit === "blocked" || o.technical_fit === "poor_fit") return "Not currently practical";
  if (o.technical_fit === "review") return "Needs more information";
  if (o.technical_fit === "suitable") return "Good fit";
  return o.category === "monoblock" ? "Possible with trade-offs" : "Possible with checks";
}
export const PRACTICAL_LABELS = {
  good: "Good practical fit", tradeoffs: "Practical trade-offs",
  budget_mismatch: "Budget may not cover the setup", unknown: "Budget not confirmed",
} as const;
export function evidenceFor(result: CoolingResult) {
  return result.rule_ids.map(id => RULES[id as RuleId]);
}
