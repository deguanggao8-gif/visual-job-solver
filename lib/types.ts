/**
 * Shared types for the V0.1 Concrete Drilling decision-guide engine.
 * Mirrors only the shapes the site needs from the frozen rules baseline.
 */

/** What the user says they are drilling into. */
export type MaterialAnswer = "concrete" | "other" | "unknown";

/**
 * How the user will drill. 'ordinary' = ordinary hammer drilling with a solid
 * hammer bit (the V0.1 scope). 'special' = breakthrough-bit / percussion-core /
 * diamond-core (routed out by CDR-009). 'unknown' = to be clarified, never
 * inferred.
 */
export type MethodAnswer = "ordinary" | "special" | "unknown";

export type PowerPreference = "corded" | "cordless" | "no_preference";

export interface JobInput {
  material: MaterialAnswer | null;
  method: MethodAnswer | null;
  /** Context only — never used to invent a capability threshold. */
  diameterMm: number | null;
  /** Context only — never used to invent a depth threshold. */
  depthMm: number | null;
  /** Context only — workload explanation only (CDR-011). */
  holeCount: number | null;
  power: PowerPreference | null;
  /** Marks an anchor/fixing hole so anchor-specific guidance is offered. */
  forAnchor: boolean;
}

/**
 * The only three result states implemented in V0.1. There is intentionally NO
 * candidate-approval state: the frozen baseline cannot deterministically
 * approve a tool (automatic_optimum_ranking=false, passing checks is not
 * sufficient, fixed-SKU unconditional approvals = 0).
 */
export type SelectorStatus = "request_information" | "outside_selector_scope" | "insufficient_evidence";

export interface EvidenceItem {
  kind: "fact" | "gate" | "content";
  text: string;
  sources: string[];
}

export interface VerifyStep {
  text: string;
  sources: string[];
}

export interface SelectorOutcome {
  status: SelectorStatus;
  /** Machine code that the UI maps to plain-language copy. */
  code?: string;
  /** Fields the engine still needs, for request_information. */
  requestFields?: Array<"material" | "method">;
  whatWeKnow: EvidenceItem[];
  cannotDetermine: string[];
  verifyNext: VerifyStep[];
  limitations: string[];
  /** Source ids cited by this outcome, in registry order. */
  sources: string[];
}

/** Everything the user told us, echoed back as plain facts. */
export interface JobSpec {
  lines: string[];
}
