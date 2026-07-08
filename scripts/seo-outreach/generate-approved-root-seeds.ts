import fs from "node:fs/promises";
import path from "node:path";

import { IMPORT_DIR, RESOURCE_POOL_FILE, TARGET_DEFAULTS } from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import {
  canonicalizeUrl,
  isActionableThirdPartyOpportunity,
  siteRootFromUrl,
} from "./lib";
import type { ResourcePoolRow, TargetSite } from "./types";

type CandidateSeed = {
  date_added: string;
  target_site: TargetSite;
  canonical_url: string;
  page_type: string;
  target_url: string;
  anchor_text: string;
  source_class: string;
  ownership_class: string;
  topical_score: string;
  visibility_score: string;
  quality_score: string;
  root_cap: string;
  requires_login: string;
  requires_captcha: string;
  requires_manual_confirm: string;
  status: string;
  last_checked_at: string;
  notes: string;
};

interface ExpansionCandidate {
  targetSite: TargetSite;
  url: string;
  pageType: string;
  sourceClass: string;
  topicalScore: number;
  visibilityScore: number;
  qualityScore: number;
  requiresLogin: boolean;
  requiresCaptcha: boolean;
  requiresManualConfirm: boolean;
  notes: string;
}

const IMPORT_HEADERS = [
  "date_added",
  "target_site",
  "canonical_url",
  "page_type",
  "target_url",
  "anchor_text",
  "source_class",
  "ownership_class",
  "topical_score",
  "visibility_score",
  "quality_score",
  "root_cap",
  "requires_login",
  "requires_captcha",
  "requires_manual_confirm",
  "status",
  "last_checked_at",
  "notes",
] as const;

const ROOT_CAP_BY_HOST: Record<string, number> = {
  "steamcommunity.com": 3,
  "gamefaqs.gamespot.com": 3,
  "www.steamgriddb.com": 3,
  "www.ign.com": 3,
  "www.mobygames.com": 3,
  "www.giantbomb.com": 3,
};

function rootCapFor(url: string): number {
  return ROOT_CAP_BY_HOST[siteRootFromUrl(url)] ?? 3;
}

async function readResourceRows(): Promise<ResourcePoolRow[]> {
  const text = await fs.readFile(RESOURCE_POOL_FILE, "utf8");
  return parseCsv(text) as ResourcePoolRow[];
}

async function probeUrl(url: string): Promise<{ ok: boolean; finalUrl: string; statusCode: number }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; MecchaChameleonOutreachBot/1.0; +https://mecchachameleon.art/)",
      },
    });
    return {
      ok: response.status >= 200 && response.status < 400,
      finalUrl: response.url,
      statusCode: response.status,
    };
  } catch {
    return { ok: false, finalUrl: url, statusCode: 0 };
  } finally {
    clearTimeout(timeout);
  }
}

function buildRootExpansionCandidates(rows: ResourcePoolRow[]): ExpansionCandidate[] {
  const candidates: ExpansionCandidate[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (!isActionableThirdPartyOpportunity(row)) continue;
    const templates = expansionTemplatesFor(row);
    for (const candidate of templates) {
      const key = `${candidate.targetSite}::${candidate.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(candidate);
    }
  }

  return candidates;
}

function expansionTemplatesFor(row: ResourcePoolRow): ExpansionCandidate[] {
  const url = row.canonical_url;
  const siteRoot = row.site_root;

  if (siteRoot === "steamcommunity.com" && url.includes("/app/4704690")) {
    return [
      makeCandidate(row.target_site, "https://steamcommunity.com/app/4704690/discussions", "discussion", "public_article", 5, 4, 5, "Steam discussion surface for contextual help and player answers."),
      makeCandidate(row.target_site, "https://steamcommunity.com/app/4704690/guides", "project_page", "public_project", 5, 5, 5, "Steam guides surface for durable how-to and route-note content."),
      makeCandidate(row.target_site, "https://steamcommunity.com/app/4704690/screenshots", "project_page", "public_project", 4, 4, 5, "Steam screenshots surface for visual proof and caption-led support pages."),
    ];
  }

  if (siteRoot === "gamefaqs.gamespot.com" && url.includes("/pc/654890-meccha-chameleon")) {
    return [
      makeCandidate(row.target_site, "https://gamefaqs.gamespot.com/pc/654890-meccha-chameleon/faqs", "project_page", "public_project", 5, 4, 5, "GameFAQs guide library for durable player-help resources."),
      makeCandidate(row.target_site, "https://gamefaqs.gamespot.com/pc/654890-meccha-chameleon/reviews", "project_page", "public_project", 4, 4, 4, "GameFAQs reviews surface for concise player-facing context."),
      makeCandidate(row.target_site, "https://gamefaqs.gamespot.com/pc/654890-meccha-chameleon/answers", "project_page", "public_project", 5, 4, 5, "GameFAQs answers surface for direct help-style replies."),
    ];
  }

  if (siteRoot === "www.steamgriddb.com" && url.includes("/game/5529099")) {
    return [
      makeCandidate(row.target_site, "https://www.steamgriddb.com/game/5529099/grids", "project_page", "public_project", 4, 4, 4, "SteamGridDB grids surface aligned with atlas and visual reference intent."),
      makeCandidate(row.target_site, "https://www.steamgriddb.com/game/5529099/icons", "project_page", "public_project", 4, 4, 4, "SteamGridDB icons surface aligned with atlas and visual reference intent."),
      makeCandidate(row.target_site, "https://www.steamgriddb.com/game/5529099/logos", "project_page", "public_project", 4, 4, 4, "SteamGridDB logos surface aligned with atlas and visual reference intent."),
      makeCandidate(row.target_site, "https://www.steamgriddb.com/game/5529099/heroes", "project_page", "public_project", 4, 4, 4, "SteamGridDB heroes surface aligned with atlas and visual reference intent."),
    ];
  }

  if (siteRoot === "www.mobygames.com" && url.includes("/game/interactive/4704690/meccha-chameleon")) {
    return [
      makeCandidate(row.target_site, "https://www.mobygames.com/game/interactive/4704690/meccha-chameleon", "project_page", "public_project", 5, 4, 4, "MobyGames game record with database contribution flow."),
    ];
  }

  if (siteRoot === "www.giantbomb.com" && url.includes("/meccha-chameleon/3030-472575")) {
    return [
      makeCandidate(row.target_site, "https://www.giantbomb.com/meccha-chameleon/3030-472575", "project_page", "public_project", 5, 4, 4, "Giant Bomb game entity page with wiki-style public surface."),
      makeCandidate(row.target_site, "https://www.giantbomb.com/meccha-chameleon/3030-472575/images", "project_page", "public_project", 4, 4, 4, "Giant Bomb images surface for public media-oriented contributions."),
    ];
  }

  if (siteRoot === "www.ign.com" && url.includes("/wikis/meccha-chameleon/")) {
    return [
      makeCandidate(row.target_site, "https://www.ign.com/wikis/meccha-chameleon/Meccha_Chameleon_Tips_and_Tricks", "wiki", "public_project", 4, 4, 4, "IGN wiki guide page with stable player-help intent."),
    ];
  }

  return [];
}

function makeCandidate(
  targetSite: TargetSite,
  url: string,
  pageType: string,
  sourceClass: string,
  topicalScore: number,
  visibilityScore: number,
  qualityScore: number,
  notes: string,
): ExpansionCandidate {
  return {
    targetSite,
    url,
    pageType,
    sourceClass,
    topicalScore,
    visibilityScore,
    qualityScore,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes,
  };
}

function toSeedRow(date: string, candidate: ExpansionCandidate, finalUrl: string, statusCode: number): CandidateSeed {
  const canonicalUrl = canonicalizeUrl(finalUrl);
  const defaults = TARGET_DEFAULTS[candidate.targetSite];
  return {
    date_added: date,
    target_site: candidate.targetSite,
    canonical_url: canonicalUrl,
    page_type: candidate.pageType,
    target_url: defaults.targetUrl,
    anchor_text: defaults.anchorText,
    source_class: candidate.sourceClass,
    ownership_class: "third_party",
    topical_score: String(candidate.topicalScore),
    visibility_score: String(candidate.visibilityScore),
    quality_score: String(candidate.qualityScore),
    root_cap: String(rootCapFor(canonicalUrl)),
    requires_login: String(candidate.requiresLogin),
    requires_captcha: String(candidate.requiresCaptcha),
    requires_manual_confirm: String(candidate.requiresManualConfirm),
    status: "candidate",
    last_checked_at: "",
    notes: `${candidate.notes} | approved_root_probe_${statusCode} on ${date}.`,
  };
}

export async function generateApprovedRootSeeds(date: string): Promise<{
  filePath: string;
  totalCandidates: number;
  liveRows: number;
}> {
  await fs.mkdir(IMPORT_DIR, { recursive: true });
  const resourceRows = await readResourceRows();
  const candidates = buildRootExpansionCandidates(resourceRows);

  const rows: CandidateSeed[] = [];
  for (const candidate of candidates) {
    const probe = await probeUrl(candidate.url);
    if (!probe.ok) continue;
    rows.push(toSeedRow(date, candidate, probe.finalUrl, probe.statusCode));
  }

  const deduped = Array.from(
    new Map(rows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const)).values(),
  ).sort((a, b) =>
    a.target_site === b.target_site
      ? a.canonical_url.localeCompare(b.canonical_url)
      : a.target_site.localeCompare(b.target_site),
  );

  const filePath = path.join(IMPORT_DIR, `approved-root-seeds-${date}.csv`);
  await fs.writeFile(filePath, stringifyCsv(deduped, [...IMPORT_HEADERS]), "utf8");

  return {
    filePath,
    totalCandidates: candidates.length,
    liveRows: deduped.length,
  };
}
