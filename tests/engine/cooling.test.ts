import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateCooling, monoblockTechnicalFit, evidenceFor } from "../../lib/cooling/engine";
import { emptyAnswers, type CoolingAnswers } from "../../lib/cooling/types";
import { allComplete, updateAnswer, normalizeAnswers } from "../../lib/cooling/questions";
import { restoreSession, serializeSession } from "../../lib/cooling/session";
import { reviewDraft, reviewMailto } from "../../lib/cooling/review";

const base: CoolingAnswers = { ...emptyAnswers(), housing: "rent", permanent_installation: "no",
  window_type: "tilt_turn", outdoor_space: "yes", outdoor_unit_possible: "yes",
  exterior_restrictions: "none", room_size_m2: "15_25", usage: ["sleep"], budget_eur: "700_1500" };
const fits = (a: CoolingAnswers) => evaluateCooling(a).options.map(o => o.technical_fit);

test("rental example preserves portable split and monoblock candidates", () => {
  assert.deepEqual(fits(base), ["blocked", "suitable", "possible"]);
  assert.equal(allComplete(base), true);
  assert.equal(evaluateCooling(base).constraint_conflict, false);
});
test("ownership does not substitute for permissions", () => {
  for (const permission of ["yes", "no", "unknown"] as const) {
    assert.deepEqual(fits({...base, permanent_installation: permission, housing: "own"}),
      fits({...base, permanent_installation: permission, housing: "rent"}));
  }
  const o = evaluateCooling({...base, permanent_installation: "unknown"}).options[0];
  assert.equal(o.technical_fit, "possible");
  assert.ok(o.flags.includes("approval_required"));
});
test("unknown restrictions require checks; explicit prohibition blocks outdoor units", () => {
  assert.equal(fits({...base, exterior_restrictions: "unknown"})[1], "possible");
  assert.equal(fits({...base, exterior_restrictions: "restricted", exterior_prohibition: "no"})[1], "possible");
  assert.deepEqual(fits({...base, permanent_installation: "yes", exterior_restrictions: "restricted",
    exterior_prohibition: "yes"}), ["blocked", "blocked", "possible"]);
});
test("missing outdoor space is review, not an automatic ban", () => {
  assert.equal(fits({...base, outdoor_space: "no"})[1], "review");
  assert.equal(fits({...base, outdoor_unit_possible: "unknown"})[1], "review");
  assert.equal(fits({...base, outdoor_unit_possible: "no"})[1], "poor_fit");
});
test("fixed window conflict has no winner and explains review", () => {
  const r = evaluateCooling({...base, outdoor_space: "no", window_type: "fixed"});
  assert.deepEqual(r.options.map(o => o.technical_fit), ["blocked", "review", "review"]);
  assert.equal(r.constraint_conflict, true);
  assert.ok(r.conflict_reasons.length >= 3);
  assert.ok(r.rule_ids.includes("DE_CONFLICT_001"));
});
test("exhaust certainty is conservative and supports future confirmed routes", () => {
  assert.equal(monoblockTechnicalFit("yes"), "possible");
  assert.equal(monoblockTechnicalFit("no"), "blocked");
  assert.equal(monoblockTechnicalFit("unknown"), "review");
  assert.equal(evaluateCooling(base).exhaust_path, "possible");
  assert.equal(evaluateCooling({...base, window_type:"unknown"}).exhaust_path, "unknown");
});
test("budget and sleep never independently change technical feasibility", () => {
  for (const permanent_installation of ["yes", "no", "unknown"] as const)
  for (const window_type of ["tilt_turn", "casement", "sliding", "balcony_door", "fixed", "unknown"] as const)
  for (const outdoor_space of ["yes", "no", "unknown"] as const)
  for (const exterior_restrictions of ["none", "restricted", "unknown"] as const) {
    const a = {...base, permanent_installation, window_type, outdoor_space, exterior_restrictions};
    const technical = fits(a);
    for (const budget_eur of ["under_300", "300_700", "700_1500", "1500_plus", "unknown"] as const)
    for (const usage of [["sleep"], ["daytime"]] as CoolingAnswers["usage"][]) {
      const r = evaluateCooling({...a, budget_eur, usage});
      assert.deepEqual(r.options.map(o => o.technical_fit), technical);
      for (const o of r.options) {
        assert.ok(o.why.length >= 2 && o.why.length <= 4);
        assert.ok(o.checks.length && o.tradeoffs.length);
        if (budget_eur === "under_300") assert.equal(o.practical_fit, "budget_mismatch");
      }
      assert.ok(evidenceFor(r).every(Boolean));
    }
  }
});
test("conditional answers are cleared and untrusted saved data is sanitized", () => {
  assert.equal(updateAnswer(base, "outdoor_space", "no").outdoor_unit_possible, null);
  const a = updateAnswer({...base, exterior_restrictions:"restricted", exterior_prohibition:"yes"}, "exterior_restrictions","none");
  assert.equal(a.exterior_prohibition, null);
  assert.equal(allComplete({...base, outdoor_unit_possible:null}), false);
  const clean = normalizeAnswers({...base, budget_eur:"invented", usage:["sleep","sleep","invalid"], email:"private"});
  assert.equal(clean.budget_eur, null);
  assert.deepEqual(clean.usage, ["sleep"]);
  assert.equal("email" in clean, false);
});
test("session restore survives corruption, clamps steps, and rejects incomplete results", () => {
  assert.equal(restoreSession("invalid").phase, "landing");
  assert.equal(restoreSession(JSON.stringify({version:1,answers:{country:"FR"}})).phase, "landing");
  const saved = serializeSession({answers:base,step:7,phase:"results"});
  assert.deepEqual(restoreSession(saved), {answers:base,step:7,phase:"results"});
  assert.equal(restoreSession(JSON.stringify({version:1,answers:emptyAnswers(),step:99,phase:"results"})).phase,"questions");
  assert.equal(restoreSession(JSON.stringify({version:1,answers:base,step:99,phase:"questions"})).step,7);
});
test("email draft includes labeled context without persisting contact information", () => {
  const body = reviewDraft(base, "tester@example.com", "Please check my window.");
  assert.ok(body.includes("tester@example.com") && body.includes("Tilt & Turn"));
  assert.ok(reviewMailto(body).startsWith("mailto:contact@visualjobsolver.com?"));
  const saved = serializeSession({answers:{...base,email:"secret",notes:"private"} as CoolingAnswers,step:7,phase:"results"});
  assert.ok(!saved.includes("secret") && !saved.includes("private"));
});
