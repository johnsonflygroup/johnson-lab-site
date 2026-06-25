const fetch = global.fetch || require('node-fetch');
const pubmedRssUrl = 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1l5TLiC_HMo8vbGQktv8uLkE9BD5L5O3S-hmqMSfg6rMNzzYw4/?limit=15&utm_campaign=pubmed-2&fc=20260601221600';

function decodeEntities(text) {
  if (!text) return '';
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
function stripHtml(text) {
  return decodeEntities(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function getTag(item, tag) {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? stripHtml(m[1]) : '';
}
function getTags(item, tag) {
  return Array.from(item.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))).map(m=>stripHtml(m[1]));
}

async function enrichFromPubmedPage(pubmedUrl){
  try{
    const r = await fetch(pubmedUrl);
    if (!r.ok) throw new Error('page fetch failed '+r.status);
    const html = await r.text();
    const meta = (name) => {
      const m = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'));
      return m ? m[1] : null;
    };
    const doi = meta('citation_doi') || (html.match(/10\.\d{4,9}\/[^\s"'<>;]+/i) || [null])[0];
    const journal = meta('citation_journal_title') || null;
    const volume = meta('citation_volume') || null;
    const firstpage = meta('citation_firstpage') || null;
    const lastpage = meta('citation_lastpage') || null;
    const pages = firstpage && lastpage ? `${firstpage}-${lastpage}` : (firstpage || null);
    return { doi, journal, volume, pages };
  } catch (e){
    return { doi: null, journal: null, volume: null, pages: null };
  }
}

(async ()=>{
  try {
    const res = await fetch(pubmedRssUrl);
    if (!res.ok) throw new Error('fetch failed '+res.status);
    const xml = await res.text();
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map(m=>m[1]);
    const parsed = [];
    for (const item of items.slice(0,6)){
      const title = getTag(item,'title');
      const link = getTag(item,'link');
      const pubDate = getTag(item,'pubDate');
      const rawDescriptionMatch = item.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
      const descriptionHtml = rawDescriptionMatch ? decodeEntities(rawDescriptionMatch[1]) : '';
      const description = stripHtml(descriptionHtml);
      const creators = getTags(item,'dc:creator');
      const authors = creators;
      // journal
      let journal = undefined;
      let journalFull = undefined;
      const journalMatch = descriptionHtml.match(/<(?:i|em)[^>]*>([\s\S]*?)<\/(?:i|em)>/i);
      if (journalMatch && journalMatch[1]){
        journal = stripHtml(journalMatch[1]);
        const after = descriptionHtml.slice(journalMatch.index + journalMatch[0].length);
        const detailsMatch = after.match(/[\s,.:;-]*([^<\n\.]{1,120})/);
        if (detailsMatch && detailsMatch[1]) journalFull = `${journal}. ${stripHtml(detailsMatch[1])}`;
        else journalFull = journal;
      }
      // DOI detection from description
      const anchors = Array.from(descriptionHtml.matchAll(/href=["']([^"']+)["']/gi)).map(m=>m[1]);
      let externalLink = undefined;
      let doi = null;
      for (const href of anchors){
        if (!href) continue;
        const lower = href.toLowerCase();
        if (lower.includes('doi.org') || lower.includes('dx.doi.org')){
          const f = href.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (f) doi = doi || f[0];
          externalLink = href; break;
        }
        const pathDoi = href.match(/\/10\.\d{4,9}\/[^\s"'<>;]+/i);
        if (pathDoi){ doi = doi || pathDoi[0].replace(/\//,''); externalLink = href; break; }
        if (!/pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov|pubmed\.ncbi/.test(lower) && !externalLink){ externalLink = href; }
      }
      // fetch pubmed page for richer metadata
      const meta = await enrichFromPubmedPage(link);
      if (meta.doi && !doi) doi = meta.doi;
      if (!journalFull && meta.journal) journalFull = meta.journal + (meta.volume ? `. ${meta.volume}` : '') + (meta.pages ? `: ${meta.pages}` : '');
      if (!journal && meta.journal) journal = meta.journal;
      if (!externalLink && doi) externalLink = `https://doi.org/${doi}`;
      const abstractSnippet = description.split(/(?<=\.)\s+/).slice(0,2).join(' ').trim();
      parsed.push({ title, link, pubDate, authors, journal, journalFull, doi, externalLink, abstractSnippet, meta });
    }
    console.log(JSON.stringify(parsed,null,2));
  } catch (err){
    console.error('Error:',err);
    process.exit(1);
  }
})();
