/**
 * Read-only view of the frozen rules baseline metadata, derived from the JSON
 * at build time so the About page can never drift from the real counts.
 * Pure data — safe for server or client import.
 */

import rulesData from "../data/rules/concrete-drilling-rules-v0.1.json";

type FrozenRoot = {
  version?: string;
  freeze_date?: string;
  status?: string;
  rules?: Array<{ classification?: string }>;
  system_chains?: unknown[];
  source_registry?: unknown[];
  execution_contract?: Record<string, unknown>;
  audit?: { fixed_sku_unconditional_approvals?: number };
};

const root = rulesData as FrozenRoot;

export const FROZEN = {
  version: root.version ?? "0.1",
  freezeDate: root.freeze_date ?? "2026-09-04",
  status: root.status ?? "frozen",
  ruleCount: root.rules?.length ?? 0,
  green: root.rules?.filter((r) => String(r.classification).toUpperCase() === "GREEN").length ?? 0,
  yellow: root.rules?.filter((r) => String(r.classification).toUpperCase() === "YELLOW").length ?? 0,
  red: root.rules?.filter((r) => String(r.classification).toUpperCase() === "RED").length ?? 0,
  systemChainCount: root.system_chains?.length ?? 0,
  sourceCount: root.source_registry?.length ?? 0,
  fixedSkuUnconditionalApprovals: root.audit?.fixed_sku_unconditional_approvals ?? 0,
} as const;
