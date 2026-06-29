import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ImagePanel from "@/components/ImagePanel";
import { getPublications } from "@/lib/pubmed";
import { researchThemes, tools } from "@/lib/site-data";

export default async function Home() {
  const publications = await getPublications(2);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div>
              <h1>Cell signalling and rare metabolic disease laboratory</h1>
              <p>
                Discovering preclinical treatments for severe genetic conditions that impact children.
              </p>
            </div>
          </div>
        </section>

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

        <section className="section white">
          <div className="container section-heading">
            <div>
              <h2>Research themes</h2>
              <p className="lead">
                We combine disease models, imaging, behavioural analysis, and therapeutic screening to move from genetic diagnosis toward testable intervention strategies.
              </p>
            </div>
          </div>
          <div className="container grid two theme-grid">
            {researchThemes.map((theme, index) => (
              <article className="card pad theme-card" key={theme.title}>
                <div className="theme-card-heading">
                  <div className="icon">{index + 1}</div>
                  <h3>{theme.title}</h3>
                </div>
                <div className="theme-card-content">
                  {theme.image ? (
                    <img
                      src={theme.image}
                      alt={theme.title}
                      className={`theme-card-image${theme.title === "Disease mechanism discovery" ? " theme-card-image--small" : ""}`}
                    />
                  ) : null}
                  <div className="theme-card-text">
                    <p>{theme.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container grid two">
            <div>
              <h2 className="section-heading-title">Latest news</h2>
              <p className="lead">
                Recent Johnson Lab publications. The publications page lists more work and provides links.
              </p>
              <div className="news-list">
                {publications.map((publication, index) => (
                  <div className="news-item" key={`${publication.title}-${index}`}>
                    {publication.title}
                      {publication.pubDate && (
                        <time>
                          {publication.pubDate}
                          {publication.firstAuthor && (publication.journalFull || publication.journal) ? (
                            <>
                              {' '}- {publication.firstAuthor} <em>et al.</em>, {publication.journalFull || publication.journal}
                            </>
                          ) : null}
                        </time>
                      )}
                  </div>
                ))}
              </div>
              <div className="button-row">
                <Link className="button" href="/publications">View all publications</Link>
              </div>
            </div>
            <ImagePanel
              src="/images/fly-reflection.png"
              label=""
            />
          </div>
        </section>

        <section className="section white">
          <div className="container section-heading">
            <div>
              <h2>Software and resources</h2>
              <p className="lead">
                We build tools that help researchers select models, analyse behaviour, and move from candidate genes to experimentally tractable biology.
              </p>
            </div>
          </div>
          <div className="container grid two software-grid">
            {tools
              .map((tool) => (
                <article
                  className={`card image-card software-card${
                    tool.slug === "integrative-imd-model-organism-explorer"
                      ? " image-card--contain"
                      : ""
                  }`}
                  key={tool.slug}
                >
                  {tool.slug === "samba" ? (
                    <video
                      className="software-card-video"
                      src="/images/Example 10x speed.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  ) : (
                    <img
                      src={
                        tool.slug === "integrative-imd-model-organism-explorer"
                          ? "/images/model orgs.png"
                          : tool.image
                      }
                      alt={tool.title}
                    />
                  )}
                  <div className="caption">
                    {tool.sourceUrl ? (
                      <a
                        className="tag"
                        href={tool.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tool.status}
                      </a>
                    ) : (
                      <span className="tag">{tool.status}</span>
                    )}
                    <h3>
                      <Link href={`/tools/${tool.slug}`}>{tool.title}</Link>
                    </h3>
                    <p>{tool.summary}</p>
                  </div>
                </article>
              ))}
          </div>
        </section>

      </main>
    </>
  );
}
