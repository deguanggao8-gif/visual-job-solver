import { test } from "node:test";
import assert from "node:assert/strict";

import { evaluateJob } from "../../lib/engine";
import type { JobInput, SelectorStatus } from "../../lib/types";
import { FROZEN } from "../../lib/frozenMeta";

function job(partial: Partial<JobInput>): JobInput {
  return {
    material: "concrete",
    method: "ordinary",
    diameterMm: null,
    depthMm: null,
    holeCount: null,
    power: null,
    forAnchor: false,
    ...partial,
  };
}

const ALLOWED: SelectorStatus[] = [
  "request_information",
  "outside_selector_scope",
  "insufficient_evidence",
];

test("frozen metadata counts stay 20 / 7 / 7 / 6", () => {
  assert.equal(FROZEN.ruleCount, 20);
  assert.equal(FROZEN.green, 7);
  assert.equal(FROZEN.yellow, 7);
  assert.equal(FROZEN.red, 6);
  assert.equal(FROZEN.fixedSkuUnconditionalApprovals, 0);
});

test("unknown material requests the material (CDR-016)", () => {
  const o = evaluateJob(job({ material: "unknown" }));
  assert.equal(o.status, "request_information");
  assert.equal(o.code, "material_not_confirmed");
  assert.ok(o.requestFields?.includes("material"));
  assert.ok(o.verifyNext.length > 0);
});

test("missing material is treated as request for information", () => {
  const o = evaluateJob(job({ material: null }));
  assert.equal(o.status, "request_information");
  assert.equal(o.code, "material_not_confirmed");
});

test("non-concrete material leaves the job scope", () => {
  const o = evaluateJob(job({ material: "other" }));
  assert.equal(o.status, "outside_selector_scope");
  assert.equal(o.code, "non_concrete_outside_job_scope");
});

test("concrete with unconfirmed method asks for the method", () => {
  for (const m of [null, "unknown"] as const) {
    const o = evaluateJob(job({ method: m }));
    assert.equal(o.status, "request_information");
    assert.equal(o.code, "drilling_method_not_confirmed");
    assert.ok(o.requestFields?.includes("method"));
  }
});

test("special drilling method routes out of scope (CDR-009)", () => {
  const o = evaluateJob(job({ method: "special" }));
  assert.equal(o.status, "outside_selector_scope");
  assert.equal(o.code, "special_drilling_method");
});

test("ordinary concrete drilling with dimensions yields the decision report", () => {
  const o = evaluateJob(
    job({ diameterMm: 10, depthMm: 60, holeCount: 5, power: "cordless", forAnchor: false })
  );
  assert.equal(o.status, "insufficient_evidence");
  assert.equal(o.code, "ordinary_concrete_drilling");
  assert.ok(o.whatWeKnow.length >= 4);
  assert.ok(o.verifyNext.length >= 5);
  assert.ok(o.cannotDetermine.some((t) => t.includes("SDS system")));
  assert.ok(o.sources.includes("N04"));
});

test("anchor context adds anchor-specific verification steps", () => {
  const o = evaluateJob(job({ forAnchor: true }));
  assert.equal(o.status, "insufficient_evidence");
  const anchorStep = o.verifyNext.find((v) => v.text.includes("anchor"));
  assert.ok(anchorStep, "expected an anchor verification step");
  assert.ok(anchorStep.sources.includes("S17"));
});

test("NO input combination can fabricate a deterministic recommendation", () => {
  const materials: JobInput["material"][] = ["concrete", "other", "unknown", null];
  const methods: JobInput["method"][] = ["ordinary", "special", "unknown", null];
  const powers: JobInput["power"][] = ["corded", "cordless", "no_preference", null];
  const dims = [null, 6, 12, 40];

  let checked = 0;
  for (const material of materials) {
    for (const method of methods) {
      for (const power of powers) {
        for (const d of dims) {
          const o = evaluateJob(job({ material, method, power, diameterMm: d }));
          checked += 1;
          assert.ok(ALLOWED.includes(o.status), `unexpected status ${o.status}`);
          assert.ok(
            !/^(approve|recommend)/i.test(o.code ?? ""),
            `approval-like code for status ${o.status}: ${o.code}`
          );
          const flat = JSON.stringify(o);
          assert.ok(
            !/use (an? )?(SDS|SDS-Plus|SDS-Max)|buy|should (choose|use)|best tool for/i.test(flat),
            "engine output appears to name or recommend a tool class"
          );
        }
      }
    }
  }
  assert.ok(checked >= 3 * 4 * 4 * 4, `expected a broad combination sweep, checked=${checked}`);
});

test("the report never emits a numeric threshold invented by code", () => {
  const o = evaluateJob(job({ diameterMm: 12, depthMm: 100 }));
  // The only numbers allowed are echoes of user inputs inside "as entered".
  for (const item of o.whatWeKnow) {
    if (item.text.includes("as entered")) continue;
    assert.ok(!/\b\d{1,3}\s*mm\b/.test(item.text), `unexpected numeric claim: ${item.text}`);
  }
  for (const t of o.cannotDetermine) {
    assert.ok(!/\b\d{1,3}\s*mm\b/.test(t), `unexpected numeric claim: ${t}`);
  }
  for (const v of o.verifyNext) {
    assert.ok(!/\b\d{1,3}\s*mm\b/.test(v.text), `unexpected numeric claim: ${v.text}`);
  }
});
