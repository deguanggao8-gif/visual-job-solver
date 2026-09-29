import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <p className="footer-note">
            <strong>Visual Job Solver</strong> — start with the job, not the
            product. Concrete Drilling V0.1 is a decision guide and evidence
            screener: it explains what the frozen manufacturer evidence can and
            cannot determine, and what to verify next.
          </p>
          <p className="footer-note">
            Concrete drilling rules and content frozen 2026-09-04. Nothing on this site is
            engineering, structural, or dust-exposure compliance approval.
            Manufacturer instructions and local regulations apply.
          </p>
        </div>
        <nav className="footer-col" aria-label="Pages">
          <h2>Pages</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tool-selector/concrete-drilling">Concrete drilling decision guide</Link></li>
            <li><Link href="/jobs/drill-holes-in-concrete">Drill holes in concrete</Link></li>
            <li><Link href="/about">About this project</Link></li>
            <li lang="de"><Link href="/impressum/">Impressum</Link></li>
            <li lang="de"><Link href="/datenschutz/">Datenschutzerklärung</Link></li>
          </ul>
        </nav>
        <nav className="footer-col" aria-label="Guides">
          <h2>Guides</h2>
          <ul>
            <li><Link href="/guides/hammer-drill-vs-rotary-hammer">Hammer Drill vs Rotary Hammer</Link></li>
            <li><Link href="/guides/sds-plus-vs-sds-max">SDS-Plus vs SDS-Max</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
