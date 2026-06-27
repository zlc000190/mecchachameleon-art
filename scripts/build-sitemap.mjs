// Build-time static sitemap generator. Replaces the Next.js dynamic
// sitemap.ts because the operator wants a static XML that Google can
// index regardless of server runtime state. Run via: pnpm sitemap
// or as a prebuild step in package.json.
//
// SEO rules (2026-06-26 fix):
//   - Only list locales with REAL translations in <url> entries.
//   - Only SEO-approved locales appear in <xhtml:link hreflang="...">.
//     Half-translated locales are redirected/noindexed until keyword-researched
//     native rewrites justify promotion.
//   - x-default always points to the en page (default locale), never to /xx/.
//   - All in-urls use canonical absolute URLs ending with a trailing slash.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mecchachameleon.art';
const base = envUrl.replace(/\/$/, '');

const maps = [
  { slug: 'vintage-room', name: 'The Vintage Drawing Room' },
  { slug: 'cow-farm', name: 'The Pastoral Cow Farm' },
  { slug: 'brick-tavern', name: 'The Brick Tavern Hall' },
  { slug: 'grand-ballroom', name: 'The Grand Ballroom' },
  { slug: 'blue-parlor', name: 'The Blue Floral Parlor' },
];

// Only SEO-approved locales appear in sitemap/hreflang. Half-translated
// locales are stopped until target-country keyword research + native rewrites
// justify promoting them.
const allLocales = ['en', 'zh', 'ru', 'es', 'de'];

// ONLY these locales get their own <url> entry. Each must have a full i18n
// JSON bundle under src/config/locale/messages/<locale>/.
const fullyTranslatedLocales = ['en', 'zh', 'ru'];
const homepageOnlyLocales = ['es', 'de'];

const defaultLocale = 'en';
const now = new Date().toISOString();

const locUrl = (locale, p) => {
  const normalizedPath = p.endsWith('/') ? p : `${p}/`;
  if (locale === defaultLocale) return `${base}${normalizedPath}`;
  return `${base}/${locale}${normalizedPath}`;
};

const entries = [];

// Home, new-player, tools, and 5 maps — but only for fullyTranslatedLocales.
// The other 12 fallback locales still get hreflang coverage via alternates.
const pageSpecs = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/new-player', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools', priority: '0.85', changefreq: 'monthly' },
];

for (const spec of pageSpecs) {
  const localesForPage = spec.path === '/'
    ? [...fullyTranslatedLocales, ...homepageOnlyLocales]
    : fullyTranslatedLocales;
  for (const loc of localesForPage) {
    entries.push({
      loc: locUrl(loc, spec.path),
      alternates: Object.fromEntries(
        allLocales
          .filter((l) => spec.path === '/' || !homepageOnlyLocales.includes(l))
          .map((l) => [l, locUrl(l, spec.path)])
      ),
      'x-default': locUrl(defaultLocale, spec.path),
      lastmod: now,
      changefreq: spec.changefreq,
      priority: spec.priority,
    });
  }
}

for (const map of maps) {
  for (const loc of fullyTranslatedLocales) {
    entries.push({
      loc: locUrl(loc, `/maps/${map.slug}`),
      alternates: Object.fromEntries(
        allLocales
          .filter((l) => !homepageOnlyLocales.includes(l))
          .map((l) => [l, locUrl(l, `/maps/${map.slug}`)])
      ),
      'x-default': locUrl(defaultLocale, `/maps/${map.slug}`),
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.8',
    });
  }
}

const buildUrl = (entry) => {
  let xml = '  <url>\n';
  xml += `    <loc>${entry.loc}</loc>\n`;
  xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  xml += `    <priority>${entry.priority}</priority>\n`;
  // hreflang alternates — include EVERY supported locale so Google can dedupe
  for (const [hreflang, href] of Object.entries(entry.alternates)) {
    xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>\n`;
  }
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${entry['x-default']}"/>\n`;
  xml += '  </url>\n';
  return xml;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(buildUrl).join('')}
</urlset>
`;

const outPath = path.join(root, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${outPath} (${entries.length} entries, ${xml.length} bytes)`);
console.log(`Locales with <url> entries: ${[...fullyTranslatedLocales, ...homepageOnlyLocales].join(', ')}`);
console.log(`Locales with hreflang coverage only: ${allLocales.filter((l) => !fullyTranslatedLocales.includes(l)).join(', ')}`);
