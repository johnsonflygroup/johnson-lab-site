import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Johnson Laboratory home">
          <span>
            Johnson Laboratory
            <small>Cell signalling and rare metabolic disease</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="mobile-note">Menu links appear on desktop. Use direct page URLs on small screens.</div>
      </div>
    </header>
  );
}
