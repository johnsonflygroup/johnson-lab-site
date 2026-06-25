import Link from "next/link";
import { tools } from "@/lib/site-data";

export default function HeroActions() {
  return (
    <section className="hero-actions">
      <div className="container">
        <div className="button-row">
          <div className="dropdown hero-dropdown">
            <button className="button dropdown-button" aria-haspopup="true">Tools ▾</button>
            <div className="dropdown-menu">
              {tools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="dropdown-item">{tool.title}</Link>
              ))}
            </div>
          </div>
          <Link className="button secondary" href="/team">Team</Link>
          <Link className="button secondary" href="/publications">Latest publications</Link>
        </div>
      </div>
    </section>
  );
}
