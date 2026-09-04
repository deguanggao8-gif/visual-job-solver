export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Simple native <details>/<summary> FAQ. Content is authored server-side.
 * Pair with FaqJsonLd (components/ui/FaqJsonLd.tsx) for structured data.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q} name="faq">
          <summary>{item.q}</summary>
          <div className="faq__a">
            <p style={{ margin: 0 }}>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
