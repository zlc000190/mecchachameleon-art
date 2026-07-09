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
//   - Locale homepages follow the live no-trailing-slash rule (/zh, /ru, /es...).
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
const allLocales = ['en', 'zh', 'ru', 'es', 'de', 'pt', 'fr', 'it', 'nl', 'ar', 'ja', 'ko'];

// ONLY these locales get their own <url> entry. Each must have a full i18n
// JSON bundle under src/config/locale/messages/<locale>/.
const fullyTranslatedLocales = ['en', 'zh', 'ru'];
const homepageOnlyLocales = [
  'es',
  'de',
  'pt',
  'fr',
  'it',
  'nl',
  'ar',
  'ja',
  'ko',
  'th',
  'vi',
  'zh-TW',
];

const defaultLocale = 'en';
const now = new Date().toISOString();

const locUrl = (locale, p) => {
  const normalizedPath = p === '/' ? '/' : p.replace(/\/$/, '');
  if (locale === defaultLocale) {
    return normalizedPath === '/' ? `${base}/` : `${base}${normalizedPath}`;
  }
  return normalizedPath === '/' ? `${base}/${locale}` : `${base}/${locale}${normalizedPath}`;
};

const entries = [];

// Home, new-player, tools, and 5 maps — but only for fullyTranslatedLocales.
// The other 12 fallback locales still get hreflang coverage via alternates.
// 2026-07-08 SEO expansion (GSC 28-day data):
//   - Add 3 play pages (unblocked/hide-and-seek/demo) + reinforced online
//   - Add 5 locale depth pages (ru/igrat, es/donde-jugar, etc)
//   - Add 11 English longtail + 5 locale longtail (en + zh MDX)
//
// Rule: pageSpecs.locales overrides default behavior. If unset:
//   - For /: include all locales (homepage only locales get their own entry)
//   - For other pages: only fullyTranslatedLocales (en/zh/ru)
//
// `singleLocale: true` marks locale-specific pages (e.g. /es/donde-jugar):
//   - Only one <loc> entry (no en alternate with double-prefix)
//   - alternateLocales = the single locale only (no hreflang loop)
const pageSpecs = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/meccha-chameleon-online', priority: '0.9', changefreq: 'weekly',
    locales: allLocales },  // expanded to all 12 locales (Batch 1 reinforcement)
  { path: '/unblocked', priority: '0.9', changefreq: 'weekly',
    locales: allLocales },  // Batch 1 - 12 locale play page
  { path: '/hide-and-seek', priority: '0.9', changefreq: 'weekly',
    locales: allLocales },  // Batch 1 - 12 locale play page
  { path: '/demo', priority: '0.8', changefreq: 'weekly',
    locales: allLocales },  // Batch 1 - 12 locale play page
  // Batch 2 - locale depth pages (single-locale each)
  { path: '/ru/igrat', priority: '0.9', changefreq: 'weekly', locales: ['ru'], singleLocale: true },
  { path: '/es/donde-jugar', priority: '0.8', changefreq: 'weekly', locales: ['es'], singleLocale: true },
  { path: '/ar/download', priority: '0.8', changefreq: 'weekly', locales: ['ar'], singleLocale: true },
  { path: '/pt/jogar-gratis', priority: '0.8', changefreq: 'weekly', locales: ['pt'], singleLocale: true },
  { path: '/ja/online', priority: '0.8', changefreq: 'weekly', locales: ['ja'], singleLocale: true },
  // Batch 3 - 11 English longtail MDX (12 locales each)
  { path: '/chameleon-hide-and-seek-game', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/hide-and-seek-paint-game', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/hide-and-seek-paint-game-online', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/paint-hide-and-seek-online', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/camouflage-game-online', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/chameleon-game', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/chameleon-paint-game', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/meccha-chameleon-poki', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/meccha-chameleon-official', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/chameleon', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  { path: '/chameleon-game-online', priority: '0.7', changefreq: 'monthly', locales: allLocales },
  // Batch 3 - 5 locale longtail MDX (single-locale each, en + zh handled by MDX i18n)
  { path: '/es/juego-camaleon', priority: '0.7', changefreq: 'monthly', locales: ['es'], singleLocale: true },
  { path: '/pt/jogo-camuflagem', priority: '0.7', changefreq: 'monthly', locales: ['pt'], singleLocale: true },
  { path: '/it/nascondino-online', priority: '0.7', changefreq: 'monthly', locales: ['it'], singleLocale: true },
  { path: '/fr/jeu-cache-cache', priority: '0.7', changefreq: 'monthly', locales: ['fr'], singleLocale: true },
  { path: '/de/chameleon-spiel', priority: '0.7', changefreq: 'monthly', locales: ['de'], singleLocale: true },
  { path: '/new-player', priority: '0.7', changefreq: 'monthly' },
  { path: '/tools', priority: '0.85', changefreq: 'monthly' },
  // Featured HTML5 game detail pages (each one is an internal detail page
  // wrapping an embed of the original hide-and-seek browser game).
  { path: '/hide-n-seek', priority: '0.85', changefreq: 'weekly' },
  { path: '/sneaky-friends', priority: '0.7', changefreq: 'weekly' },
  { path: '/stickman-hide-and-seek', priority: '0.7', changefreq: 'weekly' },
  { path: '/skibidi-titans-hide-and-seek', priority: '0.7', changefreq: 'weekly' },
  { path: '/hide-and-seek-horror-escape', priority: '0.7', changefreq: 'weekly' },
  { path: '/kitten-hide-and-seek', priority: '0.7', changefreq: 'weekly' },
  { path: '/among-them-hide-n-seek-2', priority: '0.7', changefreq: 'weekly' },
  { path: '/hunt-and-seek', priority: '0.7', changefreq: 'weekly' },
  { path: '/blumgi-slime', priority: '0.7', changefreq: 'weekly' },
  { path: '/wacky-steps', priority: '0.7', changefreq: 'weekly' },
];

for (const spec of pageSpecs) {
  // singleLocale: only emit one <loc> entry with the path as-is (no locale prefix)
  if (spec.singleLocale) {
    const onlyLocale = spec.locales[0];
    entries.push({
      loc: `${base}${spec.path}`,
      alternates: { [onlyLocale]: `${base}${spec.path}` },
      'x-default': `${base}${spec.path}`,
      lastmod: now,
      changefreq: spec.changefreq,
      priority: spec.priority,
    });
    continue;
  }
  const localesForPage = spec.locales || (spec.path === '/'
    ? [...fullyTranslatedLocales, ...homepageOnlyLocales]
    : fullyTranslatedLocales);
  const alternateLocales = spec.locales || allLocales.filter((l) => spec.path === '/' || !homepageOnlyLocales.includes(l));
  for (const loc of localesForPage) {
    entries.push({
      loc: locUrl(loc, spec.path),
      alternates: Object.fromEntries(
        alternateLocales.map((l) => [l, locUrl(l, spec.path)])
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
