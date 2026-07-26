import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const getArg = (name, fallback = undefined) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const usage = `Usage:
  node scripts/indexnow-submit.mjs --changed [--baseline git|live] [--dry-run]
  node scripts/indexnow-submit.mjs --all [--dry-run]
  node scripts/indexnow-submit.mjs --urls https://example.com/a,https://example.com/b [--dry-run]

Options:
  --baseline git|live   For --changed, compare current sitemap with previous git sitemap or live sitemap. Default: git, then live fallback.
  --limit 100           Limit submitted URLs.
  --dry-run             Print payload without calling IndexNow.
`;

if (hasFlag('--help') || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

const config = await readJson(path.join(root, 'indexnow.config.json'));
const sitemapPath = path.resolve(root, config.sitemap || 'public/sitemap.xml');
const dryRun = hasFlag('--dry-run');
const limit = Number.parseInt(getArg('--limit', '10000'), 10);
const baseline = getArg('--baseline', 'git');

const currentSitemap = await fs.readFile(sitemapPath, 'utf8');
const currentUrls = parseSitemapUrls(currentSitemap);
let urls = [];

if (hasFlag('--urls')) {
  urls = getArg('--urls', '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
} else if (hasFlag('--all')) {
  urls = currentUrls;
} else if (hasFlag('--changed')) {
  const previousSitemap = await loadPreviousSitemap(baseline);
  const previousUrls = new Set(parseSitemapUrls(previousSitemap));
  urls = currentUrls.filter((url) => !previousUrls.has(url));
} else {
  throw new Error('Choose one mode: --changed, --all, or --urls.');
}

urls = [...new Set(urls)]
  .filter((url) => belongsToHost(url, config.host))
  .slice(0, Number.isFinite(limit) ? limit : 10000);

if (urls.length === 0) {
  console.log('IndexNow: no URLs to submit.');
  process.exit(0);
}

const payload = {
  host: config.host,
  key: process.env.INDEXNOW_KEY || config.key,
  keyLocation: config.keyLocation,
  urlList: urls,
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  console.log(`IndexNow dry-run: ${urls.length} URL(s) prepared.`);
  process.exit(0);
}

const response = await fetch(config.endpoint || 'https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(payload),
});

const body = await response.text();
if (!response.ok) {
  throw new Error(
    `IndexNow submit failed: HTTP ${response.status} ${response.statusText}${body ? `\n${body}` : ''}`
  );
}

console.log(
  `IndexNow submitted ${urls.length} URL(s): HTTP ${response.status} ${response.statusText}`
);

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function belongsToHost(url, host) {
  try {
    return new URL(url).hostname === host;
  } catch {
    return false;
  }
}

async function loadPreviousSitemap(mode) {
  if (mode === 'live') {
    return fetchLiveSitemap();
  }

  try {
    const { stdout } = await execFileAsync('git', [
      'show',
      'HEAD~1:public/sitemap.xml',
    ], { cwd: root, maxBuffer: 10 * 1024 * 1024 });
    return stdout;
  } catch (error) {
    console.warn(
      `IndexNow: could not read previous git sitemap, falling back to live sitemap. ${error.message}`
    );
    return fetchLiveSitemap();
  }
}

async function fetchLiveSitemap() {
  const response = await fetch(config.liveSitemap);
  if (!response.ok) {
    throw new Error(
      `Could not fetch live sitemap: HTTP ${response.status} ${response.statusText}`
    );
  }
  return response.text();
}
