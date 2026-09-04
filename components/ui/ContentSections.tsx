import { sectionHtmlFor } from "@/lib/content";
import Prose from "@/components/ui/Prose";
import SourceList from "@/components/ui/SourceList";

/**
 * Renders selected top-level sections of the frozen content Markdown in order,
 * then one deduplicated "Sources" list covering every citation on the page.
 * Server-only (reads the frozen file at build time via lib/content).
 */
export default function ContentSections({
  keys,
  sourcesHeading = "Sources",
  interjections,
}: {
  keys: string[];
  sourcesHeading?: string;
  /** Optional nodes rendered immediately before a given section key. */
  interjections?: Record<string, React.ReactNode>;
}) {
  const sections = sectionHtmlFor(keys);
  const ids = [...new Set(sections.flatMap((s) => s.sourceIds))];

  return (
    <>
      {sections.map((s) => (
        <section key={s.key} aria-label={s.heading}>
          {interjections?.[s.key]}
          <Prose html={s.html} />
        </section>
      ))}
      <section aria-label={sourcesHeading}>
        <h2>{sourcesHeading}</h2>
        <p className="muted small">
          Access date for all entries: 2026-09-04. See the full registry on the
          About page.
        </p>
        <SourceList ids={ids} />
      </section>
    </>
  );
}
