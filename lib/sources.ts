/**
 * Source-registry views for the UI. Reads the frozen JSON's source_registry so
 * every technical claim rendered on the site can carry an official citation.
 * Safe to import from client components (pure data).
 */

import rulesData from "../data/rules/concrete-drilling-rules-v0.1.json";

type RawSource = {
  source_id: string;
  manufacturer?: string | null;
  authority?: string | null;
  title: string;
  url: string;
  applicable_scope?: string | null;
  locator?: string | null;
  relevant_statement?: string | null;
  access_date?: string | null;
  document_date?: string | null;
  verification_limit?: string | null;
};

const REGISTRY: RawSource[] = (rulesData as { source_registry: RawSource[] })
  .source_registry;

export interface SourceView {
  id: string;
  publisher: string;
  title: string;
  url: string;
  scope: string;
  locator: string;
  statement: string;
  accessDate: string | null;
  documentDate: string | null;
  verificationLimit: string | null;
}

export function toSourceView(e: RawSource): SourceView {
  return {
    id: e.source_id,
    publisher: e.manufacturer || e.authority || "Official documentation",
    title: e.title,
    url: e.url,
    scope: e.applicable_scope || "",
    locator: e.locator || "",
    statement: e.relevant_statement || "",
    accessDate: e.access_date || null,
    documentDate: e.document_date || null,
    verificationLimit: e.verification_limit || null,
  };
}

const BY_ID = new Map<string, SourceView>(REGISTRY.map((e) => [e.source_id, toSourceView(e)]));

/** True if the source-id style is an N-source (new this round) vs S-source. */
export function isNewSource(id: string): boolean {
  return /^N\d{2}$/.test(id);
}

/** Look up one source; returns undefined if unknown. */
export function sourceById(id: string): SourceView | undefined {
  return BY_ID.get(id);
}

/** Look up a list of ids, in the given order, skipping unknown ids. */
export function sourcesFor(ids: Iterable<string>): SourceView[] {
  const out: SourceView[] = [];
  for (const id of ids) {
    const s = BY_ID.get(id);
    if (s) out.push(s);
  }
  return out;
}

/** The full registry in canonical order (S01…S19 then N01…N13). */
export function allSources(): SourceView[] {
  const sorted = [...REGISTRY].sort((a, b) => {
    const ta = a.source_id.startsWith("S") ? 0 : 1;
    const tb = b.source_id.startsWith("S") ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return a.source_id.localeCompare(b.source_id);
  });
  return sorted.map(toSourceView);
}

export const ACCESS_DATE = REGISTRY[0]?.access_date ?? "2026-09-04";
