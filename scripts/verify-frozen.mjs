#!/usr/bin/env node
/**
 * Frozen-data verification for Visual Job Solver V0.1.
 *
 * Guarantees:
 *   1. The application copies under data/ are byte-identical to the frozen
 *      originals under research/v0.1/ (verbatim-copy rule).
 *   2. The application copies have not drifted from the recorded hashes in
 *      data/frozen.lock.json.
 *   3. The rule JSON still matches the frozen structure assertions
 *      (version 0.1, 20 rules, 7 GREEN / 7 YELLOW / 6 RED, no executable
 *      product ranking / no fixed-SKU unconditional approvals).
 *
 * The build command runs this script first; any drift fails the build.
 * Use `--write` only to (re)generate data/frozen.lock.json after a deliberate,
 * reviewed freeze update.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WRITE_MODE = process.argv.includes("--write");

const PAIRS = [
  {
    key: "rules",
    app: "data/rules/concrete-drilling-rules-v0.1.json",
    source: "research/v0.1/Concrete-Drilling-Rules-V0.1.json",
    parse: (text) => JSON.parse(text),
  },
  {
    key: "content",
    app: "data/content/concrete-drilling-content-v0.1.md",
    source: "research/v0.1/Concrete-Drilling-Content-V0.1.md",
    parse: null,
  },
];

const STRUCTURAL_ASSERTIONS = {
  version: "0.1",
  status: "frozen",
  rule_count: 20,
  green: 7,
  yellow: 7,
  red: 6,
  automatic_optimum_ranking: false,
  passing_checks_is_sufficient_recommendation: false,
  system_chains_are_executable_profiles: false,
  fixed_sku_unconditional_approvals: 0,
};

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function read(rel) {
  const p = join(ROOT, rel);
  return readFileSync(p, "utf8");
}

const errors = [];
const files = {};

for (const pair of PAIRS) {
  const appText = read(pair.app);
  const sourceText = read(pair.source);

  if (appText !== sourceText) {
    errors.push(
      `[${pair.key}] data copy is not byte-identical to its frozen source (${pair.source}).`
    );
  }

  const hash = sha256(appText);
  files[pair.key] = {
    app: pair.app,
    source: pair.source,
    sha256: hash,
  };
}

let assertions = { ...STRUCTURAL_ASSERTIONS };

try {
  const rules = JSON.parse(read(PAIRS[0].app));
  const counts = { green: 0, yellow: 0, red: 0 };
  for (const rule of rules.rules ?? []) {
    const c = String(rule.classification ?? "").toUpperCase();
    if (c === "GREEN") counts.green += 1;
    else if (c === "YELLOW") counts.yellow += 1;
    else if (c === "RED") counts.red += 1;
  }
  const actual = {
    version: rules.version,
    status: rules.status,
    rule_count: (rules.rules ?? []).length,
    green: counts.green,
    yellow: counts.yellow,
    red: counts.red,
    automatic_optimum_ranking: rules.execution_contract?.automatic_optimum_ranking,
    passing_checks_is_sufficient_recommendation:
      rules.execution_contract?.passing_checks_is_sufficient_recommendation,
    system_chains_are_executable_profiles:
      rules.execution_contract?.system_chains_are_executable_profiles,
    fixed_sku_unconditional_approvals: rules.audit?.fixed_sku_unconditional_approvals,
  };
  for (const key of Object.keys(STRUCTURAL_ASSERTIONS)) {
    if (String(actual[key]) !== String(STRUCTURAL_ASSERTIONS[key])) {
      errors.push(
        `[rules] structural assertion "${key}" mismatch: expected ${STRUCTURAL_ASSERTIONS[key]}, got ${actual[key]}.`
      );
    }
  }
  assertions = actual;
} catch (err) {
  errors.push(`[rules] could not parse rules JSON: ${err.message}`);
}

const lockPath = join(ROOT, "data/frozen.lock.json");

if (WRITE_MODE) {
  const lock = {
    schema: 1,
    generated_by: "scripts/verify-frozen.mjs",
    notes: "Do not edit by hand. Regenerate with `npm run verify -- --write` after a deliberate, reviewed freeze change.",
    files,
    assertions,
  };
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n", "utf8");
  console.log(`Wrote ${lockPath}`);
  if (errors.length > 0) {
    console.error(errors.map((e) => `ERROR ${e}`).join("\n"));
    process.exit(1);
  }
  console.log("Frozen-data lock regenerated (with --write).");
  process.exit(0);
}

// Check mode: compare against recorded lock.
let lock;
try {
  lock = JSON.parse(read("data/frozen.lock.json"));
} catch {
  errors.push("data/frozen.lock.json is missing or unreadable. Run `npm run verify -- --write`.");
}

if (lock) {
  for (const key of Object.keys(files)) {
    const recorded = lock.files?.[key];
    if (!recorded) {
      errors.push(`[${key}] no recorded hash in data/frozen.lock.json.`);
      continue;
    }
    if (recorded.app !== files[key].app || recorded.source !== files[key].source) {
      errors.push(`[${key}] recorded paths changed; regenerate lock after a reviewed freeze change.`);
    }
    if (recorded.sha256 !== files[key].sha256) {
      errors.push(`[${key}] content hash changed vs frozen.lock.json — frozen copy was modified.`);
    }
  }
}

if (errors.length > 0) {
  console.error("Frozen-data verification FAILED:");
  console.error(errors.map((e) => `  - ${e}`).join("\n"));
  console.error(
    "If this is an intentional, reviewed freeze change, run `npm run verify -- --write` and re-commit both the data copy and the lock."
  );
  process.exit(1);
}

console.log("Frozen-data verification PASSED (rules + content match frozen source and lock).");
