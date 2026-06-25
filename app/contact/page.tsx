import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ImagePanel from "@/components/ImagePanel";
import { contactDetails, tools } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
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
        <section className="section">
          <div className="container grid two">
            <article className="card pad">
              <h2>Contact details</h2>
              <p><strong>Assoc Prof Travis Johnson</strong></p>
              <p>Department of Biochemistry and Chemistry, School of Agriculture, Biomedicine and the Environment (SABE)</p>
              <p>La Trobe Institute for Molecular Science (LIMS)</p>
              <p><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></p>
            </article>
            <a href="https://www.latrobe.edu.au/lims" target="_blank" rel="noopener noreferrer">
              <ImagePanel
                src="/images/La-Trobe-Institute-For-Molecular-Science-LIMS.jpg"
                label="La Trobe Institute for Molecular Science"
              />
            </a>
          </div>
        </section>
        <section className="section white">
          <div className="container grid two">
            <ImagePanel src="/images/LIMS building 2.jpg" label="" />
            <article className="card pad">
              <h2>Supporting our research</h2>
              <p>{contactDetails.funding}</p>
              <p>To contribute to finding treatments for rare childhood diseases, please contact us directly.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
