/**
 * V0.1 Concrete Drilling decision-guide engine.
 *
 * This module is the ONLY place that turns frozen rule semantics into a
 * result. It is a pure function of the user's JobInput and the frozen JSON.
 *
 * SAFETY BOUNDARIES (do not relax):
 *  - Only three statuses exist; there is no approval/rank state.
 *  - Only executable GREEN gates may run (CDR-009, CDR-016). YELLOW and RED
 *    rules are referenced here ONLY as explanation / limitation text.
 *  - No numeric threshold, capacity, optimum range, workload band or
 *    SDS switch point is ever invented. Numbers are never output except the
 *    user's own inputs echoed back verbatim.
 *  - A true gate fires its frozen action; a false gate is "not established",
 *    never "approved".
 */

import rulesData from "../data/rules/concrete-drilling-rules-v0.1.json";
import type {
  JobInput,
  SelectorOutcome,
  SelectorStatus,
  VerifyStep,
} from "./types";

type RegistryEntry = {
  source_id: string;
  manufacturer?: string | null;
  authority?: string | null;
  title: string;
  url: string;
  applicable_scope?: string | null;
  locator?: string | null;
  relevant_statement?: string | null;
  verification_limit?: string | null;
};

const REGISTRY: RegistryEntry[] = (rulesData as { source_registry: RegistryEntry[] })
  .source_registry;

const ORDERED_SOURCES = [...REGISTRY]
  .sort((a, b) => {
    const ta = a.source_id.startsWith("S") ? 0 : 1;
    const tb = b.source_id.startsWith("S") ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return a.source_id.localeCompare(b.source_id);
  })
  .map((s) => s.source_id);

const S = (id: string): string => id; // source-id literal, kept greppable

/** Rank sources in registry order (S01… then N01…). */
function orderSources(ids: Iterable<string>): string[] {
  const set = new Set(ids);
  return ORDERED_SOURCES.filter((id) => set.has(id));
}

function fact(text: string, sources: string[] = []) {
  return { kind: "fact" as const, text, sources: orderSources(sources) };
}
function gate(text: string, sources: string[] = []) {
  return { kind: "gate" as const, text, sources: orderSources(sources) };
}
function contentItem(text: string, sources: string[] = []) {
  return { kind: "content" as const, text, sources: orderSources(sources) };
}

function step(text: string, sources: string[]): VerifyStep {
  return { text, sources: orderSources(sources) };
}

export function describeJobSpec(job: JobInput): string[] {
  const lines: string[] = [];
  if (job.diameterMm != null && Number.isFinite(job.diameterMm)) {
    lines.push(`Diameter: ${formatNum(job.diameterMm)} mm (as entered)`);
  }
  if (job.depthMm != null && Number.isFinite(job.depthMm)) {
    lines.push(`Depth: ${formatNum(job.depthMm)} mm (as entered)`);
  }
  if (job.holeCount != null && job.holeCount > 0) {
    lines.push(`Number of holes: ${job.holeCount}`);
  }
  if (job.power === "corded" || job.power === "cordless") {
    lines.push(`Power preference: ${job.power === "corded" ? "corded" : "cordless"}`);
  } else if (job.power === "no_preference") {
    lines.push("Power preference: no preference");
  }
  if (job.forAnchor) {
    lines.push("Use: hole for an anchor / fixing");
  }
  return lines;
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
}

/** Convenience for the form: a "concrete + ordinary + nothing else" default. */
export function emptyJob(): JobInput {
  return {
    material: null,
    method: null,
    diameterMm: null,
    depthMm: null,
    holeCount: null,
    power: null,
    forAnchor: false,
  };
}

function base(status: SelectorStatus, code?: string) {
  const out: SelectorOutcome = {
    status,
    code,
    whatWeKnow: [],
    cannotDetermine: [],
    verifyNext: [],
    limitations: [],
    sources: [],
  };
  return out;
}

/** Finalize an outcome: collect cited sources into the top-level list. */
function finish(out: SelectorOutcome): SelectorOutcome {
  const cited = new Set<string>();
  for (const item of out.whatWeKnow) item.sources.forEach((s) => cited.add(s));
  for (const item of out.verifyNext) item.sources.forEach((s) => cited.add(s));
  for (const id of out.sources) cited.add(id);
  out.sources = orderSources(cited);
  return out;
}

/**
 * The single entry point. Maps any JobInput to one of the three V0.1 states.
 *
 * Gate order mirrors the frozen rules that matter for job-only inputs:
 *   1. CDR-016 material confirmation
 *   2. job-material scope (non-concrete → outside_job_scope)
 *   3. CDR-009 drilling-method routing
 * The other GREEN rules (CDR-001/005/007/010/012) operate on a verified
 * candidate catalog, which V0.1 intentionally does not contain — so they can
 * never approve anything here.
 */
export function evaluateJob(job: JobInput): SelectorOutcome {
  // Not started / material unknown (CDR-016).
  if (job.material === null || job.material === "unknown") {
    const out = base("request_information", "material_not_confirmed");
    out.requestFields = ["material"];
    out.cannotDetermine = [
      "Material-specific guidance cannot be applied while the material is unknown.",
    ];
    out.verifyNext = [
      step(
        "Confirm what you will drill. This guide covers concrete drilled with an ordinary hammer bit.",
        [S("S03")]
      ),
    ];
    return finish(out);
  }

  // Non-concrete material → outside this job's scope (execution contract:
  // non_concrete_material_result = outside_job_scope).
  if (job.material === "other") {
    const out = base("outside_selector_scope", "non_concrete_outside_job_scope");
    out.whatWeKnow = [fact("Material: not concrete (as stated).")];
    out.cannotDetermine = [
      "This decision guide covers drilling into concrete. It does not cover other materials.",
    ];
    out.verifyNext = [
      step("Follow the manufacturer's guidance for the material you are actually drilling.", [
        S("S03"),
      ]),
    ];
    return finish(out);
  }

  // Material is concrete. Confirm the method before scoping (CDR-009: an
  // unknown method must be clarified, not inferred).
  if (job.method === null || job.method === "unknown") {
    const out = base("request_information", "drilling_method_not_confirmed");
    out.requestFields = ["method"];
    out.whatWeKnow = [fact("Material: concrete (as stated).")];
    out.cannotDetermine = [
      "Whether this job is inside the guide's ordinary hammer-drilling scope, or a special method (breakthrough bit, percussion or diamond core drilling), is not yet established.",
    ];
    out.verifyNext = [
      step(
        "Confirm how you will drill. Ordinary hammer drilling with a standard hammer bit is the method this guide covers.",
        [S("S03"), S("S08")]
      ),
      step(
        "If you are using breakthrough bits or core drilling, verify the specific manufacturer system for that method.",
        [S("S08")]
      ),
    ];
    return finish(out);
  }

  // Special method (CDR-009 → outside_selector_scope).
  if (job.method === "special") {
    const out = base("outside_selector_scope", "special_drilling_method");
    out.whatWeKnow = [
      gate("Material: concrete (as stated)."),
      gate("Method: breakthrough-bit or core drilling (as stated)."),
    ];
    out.cannotDetermine = [
      "Ordinary hammer-bit checks in this guide cannot validate breakthrough or core drilling methods.",
    ];
    out.verifyNext = [
      step("Verify the specific manufacturer system for your bit and drilling method.", [
        S("S08"),
      ]),
    ];
    return finish(out);
  }

  // Concrete + ordinary hammer drilling → the standard V0.1 decision report.
  // This is the "insufficient evidence" state: it deliberately does NOT name a
  // tool class or SDS interface, and explains why.
  return insufficientEvidenceReport(job);
}

function insufficientEvidenceReport(job: JobInput): SelectorOutcome {
  const out = base("insufficient_evidence", "ordinary_concrete_drilling");

  out.whatWeKnow = [
    gate("Material: concrete (as stated).", []),
    gate("Method: ordinary hammer drilling with a solid hammer bit.", []),
    contentItem(
      "Tool mechanism and holder interface are separate dimensions. A product name alone does not classify a tool, and SDS-Plus / SDS-Max are holder interfaces, not additional tool types.",
      [S("S01"), S("S15")]
    ),
    contentItem(
      "Published capacities and optimum ranges describe specific models, materials and methods — they are not universal class boundaries.",
      [S("S04"), S("S07"), S("S08")]
    ),
  ];

  const spec = describeJobSpec(job);
  if (spec.length > 0) {
    out.whatWeKnow.push(
      fact(`Job details as entered: ${spec.join(" · ")}.`, [])
    );
  }

  // --- What cannot be determined (only statements the frozen evidence does
  // not support). ---
  out.cannotDetermine.push(
    "A single 'correct' tool class or SDS interface for this job cannot be determined from the information provided."
  );
  out.cannotDetermine.push(
    "There is no universal diameter, depth or hole-count at which every job must switch between Drill, Hammer Drill, Rotary Hammer, SDS-Plus or SDS-Max."
  );

  if (job.diameterMm != null) {
    out.cannotDetermine.push(
      "Hole diameter alone is not enough to determine the correct SDS system."
    );
  }
  if (job.depthMm != null) {
    out.cannotDetermine.push(
      "A setup's maximum usable depth depends on the verified bit working length and any dust-attachment limits — there is no universal depth band."
    );
  }
  if (job.holeCount != null && job.holeCount > 0) {
    out.cannotDetermine.push(
      "Hole count describes workload; it cannot be converted into runtime, duty-cycle or a corded/cordless cut-off."
    );
  }
  if (job.power === "corded" || job.power === "cordless") {
    out.cannotDetermine.push(
      "Cordless is not a synonym for lower capability (cordless SDS-Max exists), and no universal corded/cordless rule is established."
    );
  }
  if (job.forAnchor) {
    out.cannotDetermine.push(
      "Anchor hole size, depth, cleaning and installation can only come from the selected anchor system's current instructions."
    );
  }
  out.cannotDetermine.push(
    "This guide cannot determine whether a location is safe to drill: concealed services, reinforcement or prestressing, and structural questions need on-site verification or engineering judgement."
  );

  // --- What to verify next (practical steps, derived from the frozen
  // research, no invented numbers). ---
  out.verifyNext = [
    step(
      "Check the exact tool you are considering against its manufacturer-stated concrete drilling capacity for ordinary hammer bits in your model and region.",
      [S("S04"), S("S05"), S("S06"), S("S08")]
    ),
    step(
      "Compare your hole diameter with that model's optimum drilling range. Being outside the optimum is not automatically outside capacity.",
      [S("S04"), S("S06"), S("S08")]
    ),
    step(
      "Confirm the holder interface (e.g. SDS-Plus or SDS-Max) matches between tool and bit. If an adapter is involved, use only a manufacturer-approved configuration.",
      [S("S01"), S("S15")]
    ),
    step(
      "Check the bit's usable (working) length against your required depth. If you use a dust-extraction attachment, check its own maximum bit length and depth limits.",
      [S("S03"), S("N04"), S("S16")]
    ),
    step(
      "Follow the tool and attachment manuals for drilling mode, grips, depth control and power isolation.",
      [S("S10"), S("S11")]
    ),
  ];

  if (job.forAnchor) {
    out.verifyNext.push(
      step(
        "Obtain the selected anchor's current instructions and follow them for hole size, depth, cleaning and installation — do not derive them from the screw's nominal size.",
        [S("S17")]
      )
    );
  }
  if (job.power === "corded" || job.power === "cordless") {
    out.verifyNext.push(
      step(
        "Record your power preference when comparing verified candidates — cordless SDS-Max tools exist, so power source alone does not decide capability.",
        [S("S13")]
      )
    );
  }

  // --- Limitations (the guide is not an approval or a compliance claim). ---
  out.limitations = [
    "This guide does not approve a tool or a drilling location. Passing the checks above is not a positive recommendation for any tool or system.",
    "No structural, reinforcement-cut, or dust-exposure compliance statement is made. Manufacturer instructions and local regulations apply.",
    "Manufacturer figures describe models and scopes; they are not independent performance tests.",
  ];

  return finish(out);
}
