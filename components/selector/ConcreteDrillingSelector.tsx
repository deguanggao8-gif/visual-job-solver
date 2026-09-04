"use client";

import { useEffect, useRef, useState } from "react";
import {
  emptyJob,
  evaluateJob,
} from "@/lib/engine";
import type {
  JobInput,
  MaterialAnswer,
  MethodAnswer,
  PowerPreference,
  SelectorOutcome,
} from "@/lib/types";
import StatusChip from "@/components/ui/StatusChip";
import SourceList from "@/components/ui/SourceList";
import LearnLinks from "@/components/ui/LearnLinks";

const MATERIAL_OPTS: Array<{ value: MaterialAnswer; label: string; desc: string }> = [
  {
    value: "concrete",
    label: "Concrete",
    desc: "A concrete wall, slab, floor or block — the scope of this guide.",
  },
  {
    value: "other",
    label: "Something else",
    desc: "For example brick, timber, plasterboard or metal — outside this guide.",
  },
  {
    value: "unknown",
    label: "Not sure",
    desc: "We’ll ask you to confirm the material before applying concrete guidance.",
  },
];

const METHOD_OPTS: Array<{ value: MethodAnswer; label: string; desc: string }> = [
  {
    value: "ordinary",
    label: "Ordinary hammer drilling",
    desc: "A normal hole with a standard solid hammer bit in a hammer drill or rotary hammer.",
  },
  {
    value: "special",
    label: "Breakthrough bit or core drilling",
    desc: "Through-holes with a breakthrough bit, or percussion / diamond core drilling.",
  },
  {
    value: "unknown",
    label: "Not sure",
    desc: "We’ll ask you to confirm the method before scoping the job.",
  },
];

const POWER_OPTS: Array<{ value: PowerPreference | "none"; label: string }> = [
  { value: "no_preference", label: "No preference" },
  { value: "cordless", label: "Cordless" },
  { value: "corded", label: "Corded" },
];

function parsePositive(str: string): number | null {
  const t = str.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

export default function ConcreteDrillingSelector() {
  const [material, setMaterial] = useState<MaterialAnswer | null>(null);
  const [method, setMethod] = useState<MethodAnswer | null>(null);
  const [diameter, setDiameter] = useState("");
  const [depth, setDepth] = useState("");
  const [holes, setHoles] = useState("");
  const [power, setPower] = useState<PowerPreference | "none">("none");
  const [forAnchor, setForAnchor] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<SelectorOutcome | null>(null);
  const [showResult, setShowResult] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current.focus();
    }
  }, [showResult, outcome]);

  const concreteChosen = material === "concrete";
  const ordinaryChosen = concreteChosen && method === "ordinary";

  const canRun =
    material !== null &&
    (!concreteChosen || method !== null);

  function chooseMaterial(value: MaterialAnswer) {
    setMaterial(value);
    setMethod(null);
    resetConditions();
  }

  function resetConditions() {
    setOutcome(null);
    setShowResult(false);
    setFieldError(null);
  }

  function resetAll() {
    setMaterial(null);
    setMethod(null);
    setDiameter("");
    setDepth("");
    setHoles("");
    setPower("none");
    setForAnchor(false);
    resetConditions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function run() {
    const dia = parsePositive(diameter);
    const dep = parsePositive(depth);
    const hol = parsePositive(holes);
    const invalid = [dia, dep, hol].some((v) => v !== null && Number.isNaN(v));
    if (invalid) {
      setFieldError("Enter hole values in millimetres as positive numbers, or leave them blank.");
      return;
    }
    setFieldError(null);

    const job: JobInput = emptyJob();
    job.material = material;
    job.method = method;
    job.diameterMm = dia;
    job.depthMm = dep;
    job.holeCount = hol;
    job.power = power === "none" ? null : power;
    job.forAnchor = forAnchor;

    setOutcome(evaluateJob(job));
    setShowResult(true);
  }

  return (
    <div>
      <fieldset className="fieldset">
        <legend>Step 1 — What are you drilling into?</legend>
        <p className="fieldset__hint">
          Confirming the material comes first. Concrete-specific guidance cannot
          be applied while the material is unknown.
        </p>
        <div className="opt-grid opt-grid--2">
          {MATERIAL_OPTS.map((o) => (
            <RadioCard
              key={o.value}
              name="material"
              checked={material === o.value}
              label={o.label}
              desc={o.desc}
              onChange={() => chooseMaterial(o.value)}
            />
          ))}
        </div>
      </fieldset>

      {concreteChosen && (
        <fieldset className="fieldset">
          <legend>Step 2 — How are you drilling?</legend>
          <p className="fieldset__hint">
            This guide covers ordinary hammer drilling with a solid hammer bit.
            Breakthrough and core drilling need their own verified manufacturer
            systems, so they are routed out of this guide.
          </p>
          <div className="opt-grid opt-grid--2">
            {METHOD_OPTS.map((o) => (
              <RadioCard
                key={o.value}
                name="method"
                checked={method === o.value}
                label={o.label}
                desc={o.desc}
                onChange={() => {
                  setMethod(o.value);
                  resetConditions();
                }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {ordinaryChosen && (
        <fieldset className="fieldset">
          <legend>Step 3 — Job conditions (optional)</legend>
          <p className="fieldset__hint">
            These describe your job. The frozen evidence is recorded as context:
            the guide will not invent thresholds from them.
          </p>
          <div className="input-row">
            <div className="field">
              <label htmlFor="hole-diameter">
                Hole diameter <span className="field__hint">mm</span>
              </label>
              <input
                id="hole-diameter"
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                placeholder="e.g. 8"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="hole-depth">
                Hole depth <span className="field__hint">mm</span>
              </label>
              <input
                id="hole-depth"
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                placeholder="e.g. 60"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="hole-count">
                Number of holes <span className="field__hint">optional</span>
              </label>
              <input
                id="hole-count"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                placeholder="e.g. 6"
                value={holes}
                onChange={(e) => setHoles(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="power-pref">Power preference</label>
              <select
                id="power-pref"
                value={power}
                onChange={(e) => setPower(e.target.value as PowerPreference | "none")}
              >
                {POWER_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={forAnchor}
              onChange={(e) => setForAnchor(e.target.checked)}
            />
            <div>
              This hole is for an anchor / fixing
              <div className="field__hint">
                Anchor holes follow the selected anchor system’s own current
                instructions — they are not sized from the screw.
              </div>
            </div>
          </label>
        </fieldset>
      )}

      {fieldError && (
        <p role="alert" className="small" style={{ color: "var(--limit-ink)" }}>
          {fieldError}
        </p>
      )}

      <div className="btn-row">
        <button
          type="button"
          className="btn"
          disabled={!canRun}
          onClick={run}
          style={!canRun ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
        >
          Review what can be determined
        </button>
        <button type="button" className="btn btn-secondary" onClick={resetAll}>
          Start over
        </button>
      </div>

      {showResult && outcome && (
        <div
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          style={{ outline: "none" }}
        >
          <ResultReport outcome={outcome} />
        </div>
      )}
    </div>
  );
}

function RadioCard({
  name,
  checked,
  label,
  desc,
  onChange,
}: {
  name: string;
  checked: boolean;
  label: string;
  desc: string;
  onChange: () => void;
}) {
  const id = `${name}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="opt" htmlFor={id}>
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>
        <span className="opt__label">{label}</span>
        <span className="opt__desc">{desc}</span>
      </span>
    </label>
  );
}

const LEAD_BY_STATUS: Record<SelectorOutcome["status"], string> = {
  request_information:
    "One more detail is needed before the concrete-drilling evidence can be applied.",
  outside_selector_scope:
    "Based on what you entered, this work falls outside the scope of the concrete-drilling decision guide.",
  insufficient_evidence:
    "We can’t make a reliable recommendation from the information provided — and in V0.1 that is the correct outcome. Here is what the evidence does and doesn’t support.",
};

function ResultReport({ outcome }: { outcome: SelectorOutcome }) {
  const lead = LEAD_BY_STATUS[outcome.status];
  return (
    <div className="report">
      <div className="report__head">
        <StatusChip status={outcome.status} />
      </div>
      <p className="lead" style={{ fontSize: "1.05rem", marginTop: 12 }}>
        {lead}
      </p>

      {outcome.whatWeKnow.length > 0 && (
        <section aria-label="What we know">
          <h3>What we know</h3>
          <ul>
            {outcome.whatWeKnow.map((item, i) => (
              <li key={i}>
                {item.text}{" "}
                {item.sources.length > 0 && (
                  <Cite ids={item.sources} />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="What we cannot determine">
        <h3>What we cannot determine</h3>
        <ul>
          {outcome.cannotDetermine.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </section>

      <section aria-label="What to verify next">
        <h3>What to verify next</h3>
        <ol>
          {outcome.verifyNext.map((v, i) => (
            <li key={i}>
              {v.text} {v.sources.length > 0 && <Cite ids={v.sources} />}
            </li>
          ))}
        </ol>
        <p className="muted small">
          Verify the specific manufacturer’s stated capability before
          proceeding. If the evidence is insufficient, treat that as the answer.
        </p>
      </section>

      {outcome.limitations.length > 0 && (
        <section aria-label="Limitations">
          <h3>Limitations</h3>
          <ul>
            {outcome.limitations.map((text, i) => (
              <li key={i} className="muted small">
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Learn how to decide">
        <LearnLinks />
      </section>

      {outcome.sources.length > 0 && (
        <section aria-label="Sources">
          <h3>Sources</h3>
          <p className="muted small">
            Access date for all entries: 2026-09-04.
          </p>
          <SourceList ids={outcome.sources} />
        </section>
      )}
    </div>
  );
}

/** Small inline source markers, e.g. (S03, N04). */
function Cite({ ids }: { ids: string[] }) {
  return (
    <span className="muted small" aria-label={`Sources: ${ids.join(", ")}`}>
      ({ids.join(", ")})
    </span>
  );
}
