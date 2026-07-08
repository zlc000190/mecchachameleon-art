import fs from "node:fs/promises";
import path from "node:path";

import { IMPORT_DIR, TARGET_DEFAULTS } from "./config";
import { stringifyCsv } from "./csv";
import { canonicalizeUrl, siteRootFromUrl } from "./lib";
import type { TargetSite } from "./types";

type CandidateSeed = {
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

interface SurfaceCandidate {
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
  "www.reddit.com": 2,
};

const SURFACE_CANDIDATES: SurfaceCandidate[] = [
  {
    targetSite: "games",
    url: "https://steamcommunity.com/app/4704690/discussions",
    pageType: "discussion",
    sourceClass: "public_article",
    topicalScore: 5,
    visibilityScore: 4,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "Steam discussion hub for help replies, route notes, and browser-guide references.",
  },
  {
    targetSite: "games",
    url: "https://steamcommunity.com/app/4704690/screenshots",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 4,
    visibilityScore: 4,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "Steam screenshot hub; useful for contextual captions or guide support.",
  },
  {
    targetSite: "games",
    url: "https://gamefaqs.gamespot.com/pc/654890-meccha-chameleon/reviews",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 5,
    visibilityScore: 4,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "GameFAQs reviews surface; strong match for concise player-help framing.",
  },
  {
    targetSite: "games",
    url: "https://gamefaqs.gamespot.com/pc/654890-meccha-chameleon/answers",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 5,
    visibilityScore: 4,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "GameFAQs answers surface; good for direct controls or route-help answers.",
  },
  {
    targetSite: "games",
    url: "https://steamcommunity.com/app/4704690/guides",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 5,
    visibilityScore: 5,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "Steam guide hub; valuable for legitimate controls and route-note guides.",
  },
  {
    targetSite: "art",
    url: "https://steamcommunity.com/app/4704690/guides",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 5,
    visibilityScore: 5,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "Steam guide hub; good for map references, hiding spots, and fan-atlas style help.",
  },
  {
    targetSite: "art",
    url: "https://www.steamgriddb.com/game/5529099/icons",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 4,
    visibilityScore: 4,
    qualityScore: 4,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "SteamGridDB icon surface aligned with visual reference and atlas positioning.",
  },
  {
    targetSite: "art",
    url: "https://www.steamgriddb.com/game/5529099/logos",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 4,
    visibilityScore: 4,
    qualityScore: 4,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "SteamGridDB logo surface aligned with visual reference and atlas positioning.",
  },
  {
    targetSite: "art",
    url: "https://www.steamgriddb.com/game/5529099/grids",
    pageType: "project_page",
    sourceClass: "public_project",
    topicalScore: 4,
    visibilityScore: 4,
    qualityScore: 4,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "SteamGridDB grid surface aligned with map and visual reference context.",
  },
  {
    targetSite: "art",
    url: "https://steamcommunity.com/app/4704690/discussions",
    pageType: "discussion",
    sourceClass: "public_article",
    topicalScore: 5,
    visibilityScore: 4,
    qualityScore: 5,
    requiresLogin: true,
    requiresCaptcha: false,
    requiresManualConfirm: true,
    notes: "Steam discussion hub; good fit for hiding-spots and map-reference replies.",
  },
];

async function probeUrl(url: string): Promise<{
  ok: boolean;
  finalUrl: string;
  statusCode: number;
}> {
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
    return {
      ok: false,
      finalUrl: url,
      statusCode: 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function rootCapFor(url: string): number {
  return ROOT_CAP_BY_HOST[siteRootFromUrl(url)] ?? 3;
}

function toSeedRow(date: string, candidate: SurfaceCandidate, finalUrl: string, statusCode: number): CandidateSeed {
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
    notes: `${candidate.notes} | live_probe_${statusCode} on ${date}.`,
  };
}

export async function generateSurfaceSeeds(date: string): Promise<{
  filePath: string;
  totalCandidates: number;
  liveRows: number;
}> {
  await fs.mkdir(IMPORT_DIR, { recursive: true });

  const rows: CandidateSeed[] = [];
  for (const candidate of SURFACE_CANDIDATES) {
    const probe = await probeUrl(candidate.url);
    if (!probe.ok) {
      continue;
    }
    rows.push(toSeedRow(date, candidate, probe.finalUrl, probe.statusCode));
  }

  const deduped = Array.from(
    new Map(
      rows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
    ).values(),
  ).sort((a, b) =>
    a.target_site === b.target_site
      ? a.canonical_url.localeCompare(b.canonical_url)
      : a.target_site.localeCompare(b.target_site),
  );

  const filePath = path.join(IMPORT_DIR, `surface-seeds-${date}.csv`);
  await fs.writeFile(filePath, stringifyCsv(deduped, [...IMPORT_HEADERS]), "utf8");

  return {
    filePath,
    totalCandidates: SURFACE_CANDIDATES.length,
    liveRows: deduped.length,
  };
}
