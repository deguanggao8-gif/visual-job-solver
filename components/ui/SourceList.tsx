import { sourcesFor } from "@/lib/sources";

/**
 * Ordered list of official sources for the given source ids. Server or client
 * safe — sources.ts is pure data.
 */
export default function SourceList({ ids }: { ids: string[] }) {
  const sources = sourcesFor(ids);
  if (sources.length === 0) return null;
  return (
    <ul className="sources">
      {sources.map((s) => (
        <li className="sources__item" key={s.id}>
          <div className="sources__head">
            <span className="sources__id">{s.id}</span>
            <a className="sources__title" href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
            </a>
            <span className="sources__meta">— {s.publisher}</span>
          </div>
          {(s.scope || s.locator) && (
            <div className="sources__meta">
              {s.scope}
              {s.scope && s.locator ? " · " : ""}
              {s.locator}
            </div>
          )}
          {s.verificationLimit && (
            <div className="sources__statement">Verification limit: {s.verificationLimit}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
