import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/cooling/germany-apartment", label: "Cooling · Germany" },
  { href: "/services/hvac-technical-assessment", label: "Engineering services" },
  { href: "/tool-selector/concrete-drilling", label: "Decision guide" },
  { href: "/jobs/drill-holes-in-concrete", label: "Drill holes in concrete" },
  { href: "/guides/hammer-drill-vs-rotary-hammer", label: "Hammer vs rotary" },
  { href: "/guides/sds-plus-vs-sds-max", label: "SDS-Plus vs SDS-Max" },
  { href: "/about", label: "About" },
  { href: "/request-assessment", label: "Request assessment" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link className="brand" href="/">
          Visual Job Solver
        </Link>
        <nav className="main-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
