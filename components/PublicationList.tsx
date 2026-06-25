import { Publication } from "@/lib/pubmed";

function formatPubDate(pubDate: string) {
  if (!pubDate) return "";

  const date = new Date(pubDate);

  if (Number.isNaN(date.getTime())) {
    return pubDate;
  }

  return date.getFullYear().toString();
}

function formatDateNoYear(pubDate: string) {
  if (!pubDate) return "";
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return pubDate.split(" ").slice(0, 2).join(" ");
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function cleanCitationText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/^Johnson Lab Publications\s*/i, "")
    .trim();
}

export default function PublicationList({
  publications,
}: {
  publications: Publication[];
}) {
  return (
    <div className="grid">
      {publications.map((publication, index) => {
        const year = formatPubDate(publication.pubDate);
        const journalInfo = publication.journalFull || publication.journal || undefined;
        const abstractSnippet = publication.abstractSnippet || "";
        const titleHref = publication.doi ? `https://doi.org/${publication.doi}` : (publication.externalLink || publication.link);
        const showAbstract = Boolean(abstractSnippet && publication.description && abstractSnippet.trim() !== (publication.title || "").trim());

        return (
          <article
  className="card publication-card"
  key={`${publication.title}-${index}`}
>
            <p className="eyebrow">{year ? `${year}` : "Publication"}</p>

            {publication.pubDate ? (
              <p className="publication-date">{formatDateNoYear(publication.pubDate)}</p>
            ) : null}

            <h3>{publication.title}</h3>

            {publication.authors && publication.authors.length ? (
              <p className="publication-authors">{publication.authors.join(", ")}</p>
            ) : null}

            {journalInfo ? <p className="publication-journal"><em>{journalInfo}</em></p> : null}

            {showAbstract ? <p className="publication-abstract">{abstractSnippet}</p> : null}

            <p className="publication-links">
              <a href={publication.link} target="_blank" rel="noreferrer">
                View on PubMed →
              </a>
              {publication.doi ? (
                <> {"|"} <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">View DOI →</a></>
              ) : null}
              {publication.externalLink && !publication.doi ? (
                <> {"|"} <a href={publication.externalLink} target="_blank" rel="noreferrer">View publisher site →</a></>
              ) : null}
            </p>
          </article>
        );
      })}
    </div>
  );
}