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

(async ()=>{
  try {
    const res = await fetch(pubmedRssUrl);
    if (!res.ok) throw new Error('fetch failed '+res.status);
    const xml = await res.text();
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map(m=>m[1]);
    const parsed = items.slice(0,6).map(item => {
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
      // DOI detection
      const dcIdentifier = getTag(item,'dc:identifier');
      let doi = undefined;
      if (dcIdentifier){ const m=dcIdentifier.match(/10\.\d{4,9}\/[^\s"'<>;]+/i); if (m) doi = m[0]; }
      // anchors
      const anchors = Array.from(descriptionHtml.matchAll(/href=["']([^"']+)["']/gi)).map(m=>m[1]);
      let externalLink = undefined;
      for (const href of anchors){
        if (!href) continue;
        const lower = href.toLowerCase();
        if (lower.includes('doi.org') || lower.includes('dx.doi.org')){
          const f = href.match(/10\.\d{4,9}\/[^\s"'<>;]+/i);
          if (f) doi = doi || f[0];
          externalLink = href; break;
        }
        const pathDoi = href.match(/\/10\.\d{4,9}\/[^\s"'<>;]+/i);
        if (pathDoi){ const found = pathDoi[0].replace(/\//,''); doi = doi || found; externalLink = href; break; }
        if (!/pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov|pubmed\.ncbi/.test(lower) && !externalLink){ externalLink = href; }
      }
      if (!doi){ const m=descriptionHtml.match(/10\.\d{4,9}\/[^\s"'<>;]+/i) || description.match(/10\.\d{4,9}\/[^\s"'<>;]+/i); if (m) doi = m[0]; if (doi && !externalLink) externalLink = `https://doi.org/${doi}`; }
      const abstractSnippet = description.split(/(?<=\.)\s+/).slice(0,2).join(' ').trim();
      return { title, link, pubDate, authors, journal, journalFull, doi, externalLink, abstractSnippet };
    });
    console.log(JSON.stringify(parsed,null,2));
  } catch (err){
    console.error('Error:',err);
    process.exit(1);
  }
})();
