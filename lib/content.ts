/**
 * Build-time renderer for the frozen human-readable content file.
 *
 * SERVER-ONLY: reads the frozen Markdown from disk at build/SSG time and
 * renders sections to HTML with `marked`. Client components must NOT import
 * this module.
 *
 * Rules/content separation is preserved: this module knows nothing about the
 * rule engine, and the engine knows nothing about this Markdown. Editing the
 * Markdown never changes selector behaviour.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

const CONTENT_FILE = path.join(
  process.cwd(),
  "data/content/concrete-drilling-content-v0.1.md"
);

export interface ContentSection {
  key: string;
  heading: string;
  raw: string;
  html: string;
  sourceIds: string[];
}

export interface ContentDoc {
  meta: Record<string, string>;
  /** '# Concrete Drilling' heading text. */
  title: string;
  /** Body between the H1 and the first H2 (scope statement). */
  introHtml: string;
  introSourceIds: string[];
  sections: ContentSection[];
  /** True when content could not be read/parsed (build should surface it). */
  ok: boolean;
  error?: string;
}

function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { meta, body: raw.slice(m[0].length) };
}

function findDefinitions(body: string): { ids: string[]; block: string } {
  const lines: string[] = [];
  const ids: string[] = [];
  for (const match of body.matchAll(/^\[([A-Z]\d{2})\]:[ \t]*(\S+)[ \t]*$/gm)) {
    ids.push(match[1]);
    lines.push(`[${match[1]}]: ${match[2]}`);
  }
  return { ids, block: lines.join("\n") };
}

function extractSourceIds(md: string): string[] {
  const set = new Set<string>();
  for (const match of md.matchAll(/\[(S\d{2}|N\d{2})\]/g)) {
    set.add(match[1]);
  }
  return [...set].sort((a, b) => {
    const ta = a.startsWith("S") ? 0 : 1;
    const tb = b.startsWith("S") ? 0 : 1;
    if (ta !== tb) return ta - tb;
    return a.localeCompare(b);
  });
}

function render(md: string): string {
  return marked.parse(md, { gfm: true, async: false }) as string;
}

let cached: ContentDoc | null = null;

export function getContent(): ContentDoc {
  if (cached) return cached;

  let raw: string;
  try {
    raw = readFileSync(CONTENT_FILE, "utf8").replace(/^﻿/, "");
  } catch (err) {
    cached = {
      meta: {},
      title: "",
      introHtml: "",
      introSourceIds: [],
      sections: [],
      ok: false,
      error: `Could not read frozen content file: ${(err as Error).message}`,
    };
    return cached;
  }

  const { meta, body } = splitFrontMatter(raw);
  const { block: defsBlock } = findDefinitions(body);

  const sections: ContentSection[] = [];
  let title = "";
  let intro = "";

  const lines = body.split(/\r?\n/);
  const heads: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) heads.push(i);
  }

  // Title + intro (anything before the first '## ' that is after the '# ' line).
  const titleIdx = lines.findIndex((l) => /^#\s+/.test(l));
  if (titleIdx >= 0) {
    title = lines[titleIdx].replace(/^#\s+/, "").trim();
    const introStart = titleIdx + 1;
    const introEnd = heads[0] ?? lines.length;
    const introLines = lines.slice(introStart, introEnd);
    // Skip the leading blank after the H1.
    const firstContent = introLines.findIndex((l) => l.trim() !== "");
    intro = introLines
      .slice(Math.max(0, firstContent))
      .join("\n")
      .trim();
  }

  for (let i = 0; i < heads.length; i++) {
    const start = heads[i];
    const end = i + 1 < heads.length ? heads[i + 1] : lines.length;
    const heading = lines[start].replace(/^##\s+/, "").trim();
    const rawSection = lines.slice(start + 1, end).join("\n").trim();
    const html = render(`${rawSection}\n\n${defsBlock}`);
    sections.push({
      key: slugify(heading),
      heading,
      raw: rawSection,
      html,
      sourceIds: extractSourceIds(rawSection),
    });
  }

  cached = {
    meta,
    title,
    introHtml: intro ? render(`${intro}\n\n${defsBlock}`) : "",
    introSourceIds: intro ? extractSourceIds(intro) : [],
    sections,
    ok: true,
  };
  return cached;
}

export function sectionByKey(key: string): ContentSection | undefined {
  return getContent().sections.find((s) => s.key === key);
}

/** Render the listed section keys in order; throws on an unknown key. */
export function sectionHtmlFor(keys: string[]): Array<{ key: string; heading: string; html: string; sourceIds: string[] }> {
  const doc = getContent();
  return keys.map((key) => {
    const s = doc.sections.find((x) => x.key === key);
    if (!s) {
      throw new Error(`[content] unknown section key "${key}". Available: ${doc.sections.map((x) => x.key).join(", ")}`);
    }
    return s;
  });
}

/** True if the frozen content file was parsed OK (for build-time sanity). */
export function contentOk(): boolean {
  return getContent().ok;
}
