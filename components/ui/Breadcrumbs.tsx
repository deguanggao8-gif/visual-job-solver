import Link from "next/link";
import { absolute } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Visible breadcrumb trail + matching BreadcrumbList structured data.
 * The last crumb is current-page text with no link.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const list = items.map((c, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: absolute(c.href) } : {}),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb">
        <ol className="crumbs">
          {items.map((c) => (
            <li key={c.label}>
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
