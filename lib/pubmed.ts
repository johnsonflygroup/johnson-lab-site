import { pubmedRssUrl } from "./site-data";

export type Publication = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  summary: string;
  firstAuthor: string;
  year: string;
  authors: string[];
  externalLink?: string;
  journal?: string;
  abstractSnippet?: string;
  journalFull?: string;
  doi?: string;
};

function decodeEntities(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(text: string) {
  return decodeEntities(text).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function titleCase(text: string) {
  return stripHtml(text)
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      if (word === word.toUpperCase()) return word;
      const firstChar = word.charAt(0);
      if (!/[A-Za-z]/.test(firstChar)) return word;
      return firstChar.toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function simplifyJournalDetails(details: string) {
  const cleaned = stripHtml(details);
  const match = cleaned.match(/^(?:\d+(?:\([^)]*\))?[:;]?\s*)?(.*)$/);
  const remainder = match ? match[1].trim() : cleaned;
  return remainder ? `: ${remainder}` : "";
}

function getTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripHtml(match[1]) : "";
}

function getTags(item: string, tag: string) {
  return Array.from(item.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))).map(
    (match) => stripHtml(match[1])
  );
}

function formatPubDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.valueOf())) return dateString.split(" ").slice(0, 4).join(" ");
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function makeSummary(description: string, title: string) {
  const source = description || title;
  if (!source) return "Summary placeholder: add an AI-generated or manually written plain-language summary here.";
  const sentences = source.match(/[^.!?]+[.!?]+/g) || [source];
  const summary = sentences.slice(0, 2).join(" ").trim();
  return summary || "Summary placeholder: add an AI-generated or manually written plain-language summary here.";
}

export async function getPublications(limit = 15): Promise<Publication[]> {
    try {
      const response = await fetch(pubmedRssUrl, { next: { revalidate: 60 * 60 } });
      if (!response.ok) throw new Error(`RSS request failed: ${response.status}`);
      const xml = await response.text();
      const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map((match) => match[1]);

      const pubs: Publication[] = items.slice(0, limit).map((item) => {
        const title = getTag(item, "title");
        const link = getTag(item, "link");
        const rawPubDate = getTag(item, "pubDate");
        const pubDate = rawPubDate ? formatPubDate(rawPubDate) : "";
      const rawDescriptionMatch = item.match(new RegExp(`<description[^>]*>([\\s\\S]*?)<\\/description>`, "i"));
      const descriptionHtml = rawDescriptionMatch ? decodeEntities(rawDescriptionMatch[1]) : "";
      const description = stripHtml(descriptionHtml);
      const creators = getTags(item, "dc:creator");
      const firstAuthor = creators.length ? creators[0].split(",")[0].trim() : "";
      const year = rawPubDate ? new Date(rawPubDate).getFullYear().toString() : "";
      const authors = creators;

      let journal: string | undefined;
      let journalFull: string | undefined;
      const journalMatch = descriptionHtml.match(/<(?:i|em)[^>]*>([\s\S]*?)<\/(?:i|em)>/i);
      if (journalMatch && journalMatch[1]) {
        journal = titleCase(journalMatch[1]);
        const after = descriptionHtml.slice(journalMatch.index! + journalMatch[0].length);
        const detailsMatch = after.match(/[\s,.:;-]*([^<\n\.]{1,120})/);
        if (detailsMatch && detailsMatch[1]) {
          const details = simplifyJournalDetails(detailsMatch[1]);
          journalFull = `${journal}${details}`.trim();
        } else {
          journalFull = journal;
        }
      } else {
        const fallbackMatch = description.match(/([A-Za-z][^\.\n]{3,100})\.?\s*\d{4};/);
        if (fallbackMatch && fallbackMatch[1]) journal = titleCase(fallbackMatch[1].trim());
          journalFull = journal;
        }

        const abstractSnippet = makeSummary(description, title);

        const anchorMatches = Array.from(descriptionHtml.matchAll(/href=["']([^"']+)["']/gi)).map((m) => m[1]);
        const dcIdentifier = getTag(item, "dc:identifier");

        // article-id with pub-id-type="doi" — extract manually
        let articleIdMatch: RegExpMatchArray | null = null;
        const pubIdIndex = item.search(/pub-id-type=(['"])doi\1/i);
        if (pubIdIndex !== -1) {
          const start = item.lastIndexOf('<article-id', pubIdIndex);
          if (start !== -1) {
            const endTag = '</article-id>';
            const end = item.indexOf(endTag, pubIdIndex);
            if (end !== -1) {
              const slice = item.slice(start, end + endTag.length);
              const innerMatch = slice.match(/<article-id[^>]*>([\s\S]*?)<\/article-id>/i);
              if (innerMatch) articleIdMatch = innerMatch;
            }
          }
        }

        const elocationMatch = item.match(/<elocationid[^>]*>([\s\S]*?)<\/elocationid>/i);

        let doi: string | undefined = undefined;
        if (!doi && dcIdentifier) {
          const m = dcIdentifier.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (m) doi = m[0];
        }
        if (!doi && articleIdMatch && articleIdMatch[1]) {
          const candidate = stripHtml(articleIdMatch[1]);
          const m = candidate.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (m) doi = m[0];
        }
        if (!doi && elocationMatch && elocationMatch[1]) {
          const candidate = stripHtml(elocationMatch[1]);
          const m = candidate.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (m) doi = m[0];
        }

        let externalLink: string | undefined = undefined;
        for (const href of anchorMatches) {
          if (!href) continue;
          const lower = href.toLowerCase();
          if (lower.includes("doi.org") || lower.includes("dx.doi.org")) {
            const found = href.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
            if (found) doi = found[0];
            externalLink = href;
            break;
          }
          const pathDoi = href.match(/\/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (pathDoi) {
            const found = pathDoi[0].replace(/^\//, "");
            if (!doi) doi = found;
            externalLink = href;
            break;
          }
          if (!/pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov|pubmed\.ncbi/.test(lower) && !externalLink) {
            externalLink = href;
          }
        }

        if (!doi) {
          const doiMatch = descriptionHtml.match(/10\.\d{4,9}\/[^\s"'<>;]+/i) || description.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          doi = doiMatch ? doiMatch[0] : undefined;
          if (doi && !externalLink) externalLink = `https://doi.org/${doi}`;
        }

        return {
          title,
          link,
          pubDate,
          description,
          summary: makeSummary(description, title),
          firstAuthor,
          year,
          authors,
          externalLink,
          journal,
          journalFull,
          abstractSnippet,
          doi,
        };
      });

      // on-demand enrichment: fetch PubMed page for items missing DOI or journalFull
      const enriched = await Promise.all(
        pubs.map(async (pub) => {
          if ((pub.doi && pub.journalFull) || !pub.link) return pub;
          try {
            const resp = await fetch(pub.link, { next: { revalidate: 60 * 60 } });
            if (!resp.ok) return pub;
            const html = await resp.text();
            const meta = (name: string) => {
              // match either name then content or content then name, and allow property attribute
              const re = new RegExp(
                `<meta[^>]*(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']|<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`,
                'i'
              );
              const m = html.match(re);
              return m ? (m[1] || m[2]) : null;
            };
            const md: { doi?: string | null; journal?: string | null; volume?: string | null; firstpage?: string | null; lastpage?: string | null } = {
              doi: meta('citation_doi') || null,
              journal: meta('citation_journal_title') || null,
              volume: meta('citation_volume') || null,
              firstpage: meta('citation_firstpage') || null,
              lastpage: meta('citation_lastpage') || null,
            };
            if (!pub.doi && md.doi) pub.doi = md.doi || undefined;
            if (!pub.journalFull && md.journal) {
              const journalName = titleCase(decodeEntities(md.journal || ""));
              const pageSuffix = md.firstpage
                ? `: ${md.firstpage}${md.lastpage && md.lastpage !== md.firstpage ? `-${md.lastpage}` : ''}`
                : "";
              pub.journalFull = `${journalName}${pageSuffix}`.trim();
            }
            if (!pub.externalLink && pub.doi) pub.externalLink = `https://doi.org/${pub.doi}`;
          } catch {
            // ignore enrichment errors
          }
          return pub;
        })
      );

      return enriched;
    } catch {
      return [
        {
          title: "Publication feed unavailable during local development",
          link: pubmedRssUrl,
          pubDate: "",
          description:
            "The site is configured to read the Johnson Lab PubMed RSS feed. If this appears during development, check your internet connection and try again.",
          summary:
            "Fallback summary: the publication feed is wired up, but the RSS request did not complete in this environment.",
          firstAuthor: "",
          year: "",
          authors: [],
          externalLink: undefined,
          journal: undefined,
          journalFull: undefined,
          abstractSnippet: "",
          doi: undefined,
        },
      ];
    }
  }

