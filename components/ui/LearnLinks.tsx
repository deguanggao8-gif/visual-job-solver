import Link from "next/link";
import { LEARN_LINKS } from "@/lib/learnLinks";

/** "Learn how to decide" cross-links used by the selector result and guides. */
export default function LearnLinks({ title = "Learn how to decide" }: { title?: string }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="learn-grid">
        {LEARN_LINKS.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
