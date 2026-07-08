import fs from "node:fs/promises";
import path from "node:path";

import {
  ART_QUEUE_FILE,
  COMMENT_PROSPECTS_FILE,
  COMPETITOR_QUEUE_FILE,
  COUNTABLE_STATUSES,
  DEFAULT_BLOCKING_BY_MODE,
  EXECUTION_QUEUE_FILE,
  EXECUTION_QUEUE_HEADERS,
  FOLLOW_LIKE_REL_VALUES,
  GAMES_QUEUE_FILE,
  IMPORT_DIR,
  LEGACY_ART_TRACKER,
  LEGACY_GAMES_TRACKER,
  OUTREACH_DIR,
  PAYLOAD_DIR,
  REPORT_DIR,
  RESOURCE_POOL_FILE,
  RESOURCE_POOL_HEADERS,
  ROOT_CAP_OVERRIDES,
  SELF_CONTROLLED_PATTERNS,
  TARGET_DEFAULTS,
  VERIFICATION_FILE,
  VERIFICATION_HEADERS,
  SUBMISSION_REVIEW_FILE,
  SUBMISSION_REVIEW_HEADERS,
} from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import { getDomainPlaybook } from "./playbooks";
import { buildSupportRouting } from "./routing";
import type {
  ExecutionQueueRow,
  OwnershipClass,
  PageType,
  ResourcePoolRow,
  ResourceStatus,
  SourceClass,
  SubmissionMode,
  TargetSite,
  VisibilityVerificationRow,
} from "./types";

export type ExecutionRisk = "approved" | "caution" | "high_risk";

const NON_ACTIONABLE_OPPORTUNITY_ROOTS = new Set([
  "api.indexnow.org",
  "web.archive.org",
  "www.google.com",
]);

export function canonicalizeUrl(url: string): string {
  const raw = url.trim();
  if (!raw) {
    return "";
  }

  try {
    const parsed = new URL(raw);
    parsed.hash = "";
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    if (
      (parsed.protocol === "https:" && parsed.port === "443") ||
      (parsed.protocol === "http:" && parsed.port === "80")
    ) {
      parsed.port = "";
    }
    if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

export function siteRootFromUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function inferOwnershipClass(url: string): OwnershipClass {
  return SELF_CONTROLLED_PATTERNS.some((pattern) => url.includes(pattern))
    ? "self_controlled"
    : "third_party";
}

export function inferTargetUrl(targetSite: TargetSite, notes: string, url: string): string {
  if (notes.includes("https://mecchachameleon.art/maps") || url.includes("/maps")) {
    return "https://mecchachameleon.art/maps";
  }
  return TARGET_DEFAULTS[targetSite].targetUrl;
}

export function inferAnchorText(targetSite: TargetSite, notes: string): string {
  const match = notes.match(/anchor text\s+([^;,.]+)/i);
  if (match?.[1]) {
    return match[1].trim();
  }
  if (notes.includes("Meccha Chameleon")) {
    return "Meccha Chameleon";
  }
  return TARGET_DEFAULTS[targetSite].anchorText;
}

export function defaultRootCap(
  siteRoot: string,
  sourceClass: SourceClass,
  ownershipClass: OwnershipClass,
): number {
  if (ROOT_CAP_OVERRIDES[siteRoot]) {
    return ROOT_CAP_OVERRIDES[siteRoot];
  }
  if (sourceClass === "comment_submission") {
    return 2;
  }
  if (ownershipClass === "self_controlled") {
    return 3;
  }
  return 3;
}

export function scoreTopicalFit(text: string, url: string): number {
  const haystack = `${text} ${url}`.toLowerCase();
  if (haystack.includes("exact_meccha_chameleon")) return 5;
  if (haystack.includes("meccha chameleon")) return 5;
  if (haystack.includes("mecha chameleon")) return 5;
  if (haystack.includes("meccha_chameleon_mentioned")) return 4;
  if (haystack.includes("game_codes_related")) return 3;
  if (haystack.includes("gaming_news_related")) return 2;
  if (haystack.includes("indie_game")) return 2;
  return 1;
}

export function scoreVisibility(
  sourceClass: SourceClass,
  notes: string,
  submissionMode: SubmissionMode,
): number {
  if (sourceClass === "public_article" || sourceClass === "public_project") {
    return 5;
  }
  if (sourceClass === "public_profile") {
    return 4;
  }
  if (sourceClass === "directory_submission") {
    return notes.includes("public detail") ? 4 : 3;
  }
  if (sourceClass === "comment_submission") {
    if (notes.includes("awaiting moderation") || notes.includes("moderation")) {
      return 1;
    }
    return submissionMode === "semi_auto" ? 2 : 3;
  }
  return 2;
}

export function scoreQuality(siteRoot: string, notes: string): number {
  const authorityRoots = new Set([
    "github.com",
    "dev.to",
    "gamejolt.com",
    "news.ycombinator.com",
    "indiedb.com",
    "steamcommunity.com",
    "reddit.com",
  ]);
  if (authorityRoots.has(siteRoot)) {
    return 5;
  }
  if (notes.toLowerCase().includes("strong topical fit")) {
    return 4;
  }
  if (notes.toLowerCase().includes("authority")) {
    return 4;
  }
  return 3;
}

export function derivePageType(type: string, url: string): PageType {
  const lower = `${type} ${url}`.toLowerCase();
  if (lower.includes("comment")) return "blog_comment";
  if (lower.includes("profile")) return "profile";
  if (lower.includes("wiki")) return "wiki";
  if (lower.includes("issue")) return "issue";
  if (lower.includes("release")) return "release";
  if (lower.includes("tag")) return "tag";
  if (lower.includes("gist")) return "gist";
  if (lower.includes("forum") || lower.includes("discussion")) return "discussion";
  if (lower.includes("submission") || lower.includes("directory")) {
    return "directory_detail";
  }
  if (lower.includes("article") || lower.includes("news") || lower.includes("devlog")) {
    return "article";
  }
  return "project_page";
}

export function deriveSourceClass(pageType: PageType): SourceClass {
  if (pageType === "blog_comment") return "comment_submission";
  if (pageType === "directory_detail") return "directory_submission";
  if (pageType === "article" || pageType === "discussion") return "public_article";
  if (pageType === "profile") return "public_profile";
  return "public_project";
}

export function deriveSubmissionMode(
  pageType: PageType,
  requiresLogin: boolean,
  requiresCaptcha: boolean,
  requiresManualConfirm: boolean,
): SubmissionMode {
  if (pageType === "blog_comment") return "semi_auto";
  if (requiresLogin || requiresCaptcha || requiresManualConfirm) return "semi_auto";
  if (pageType === "directory_detail") return "semi_auto";
  return "auto";
}

export function normalizeStatus(rawStatus: string): ResourceStatus {
  if (
    rawStatus === "live_visible" ||
    rawStatus === "live_visible_follow_like" ||
    rawStatus === "live_visible_nofollow"
  ) {
    return rawStatus;
  }
  if (rawStatus.startsWith("blocked")) return "blocked";
  if (
    rawStatus === "submitted" ||
    rawStatus === "submitted_pending" ||
    rawStatus === "submitted_unknown"
  ) {
    return "submitted";
  }
  if (
    rawStatus === "qualified" ||
    rawStatus === "published" ||
    rawStatus === "live" ||
    rawStatus === "verified" ||
    rawStatus === "updated" ||
    rawStatus === "merged" ||
    rawStatus === "open" ||
    rawStatus === "open-mergeable"
  ) {
    return "qualified";
  }
  if (rawStatus.startsWith("checked_no") || rawStatus === "rejected_root_cap") {
    return "rejected";
  }
  if (rawStatus === "queued") return "queued";
  return "candidate";
}

export function shouldCountStatus(status: string): boolean {
  return COUNTABLE_STATUSES.has(status);
}

export function classifyExecutionRisk(row: ResourcePoolRow): ExecutionRisk {
  const notes = `${row.notes} ${row.canonical_url}`.toLowerCase();

  if (row.source_class === "comment_submission" || row.page_type === "blog_comment") {
    return "high_risk";
  }

  if (
    notes.includes("reciprocal backlink") ||
    notes.includes("phone") ||
    notes.includes("mobile number") ||
    notes.includes("docs upload")
  ) {
    return "high_risk";
  }

  if (
    row.source_class === "directory_submission" ||
    notes.includes("manual execution recommended") ||
    notes.includes("likely protected") ||
    notes.includes("moderation")
  ) {
    return "caution";
  }

  return "approved";
}

export function isApprovedExecutionSurface(row: ResourcePoolRow): boolean {
  return classifyExecutionRisk(row) !== "high_risk";
}

export function isActionableThirdPartyOpportunity(row: ResourcePoolRow): boolean {
  if (row.ownership_class !== "third_party") {
    return false;
  }

  if (NON_ACTIONABLE_OPPORTUNITY_ROOTS.has(row.site_root)) {
    return false;
  }

  const lower = row.canonical_url.toLowerCase();
  if (
    lower.includes("/search?") ||
    lower.includes("/web/") ||
    lower.includes("google.com/search") ||
    lower === "https://rawg.io" ||
    lower === "https://rawg.io/" ||
    lower === "https://www.giantbomb.com/" ||
    lower === "https://mecchachameleon.art/maps"
  ) {
    return false;
  }

  return true;
}

export function summarizeNotes(rawNotes: string, limit = 3): string {
  const parts = rawNotes
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  const unique = Array.from(new Set(parts));
  return unique.slice(0, limit).join(" | ");
}

export function citationMultiplierScore(row: ResourcePoolRow): number {
  const siteRoot = row.site_root.toLowerCase();
  const notes = `${row.notes} ${row.canonical_url}`.toLowerCase();

  if (row.source_class === "comment_submission" || row.page_type === "blog_comment") {
    return 1;
  }

  let score = 2;

  if (siteRoot === "news.ycombinator.com") {
    score = 5;
  } else if (
    new Set([
      "www.pcgamer.com",
      "kotaku.com",
      "www.gamesradar.com",
      "www.ign.com",
      "www.thegamer.com",
      "www.gamedeveloper.com",
      "gamingonlinux.com",
      "www.gamewatcher.com",
    ]).has(siteRoot)
  ) {
    score = 5;
  } else if (
    new Set([
      "www.igdb.com",
      "www.mobygames.com",
      "www.backloggd.com",
      "steamcommunity.com",
      "www.steamgriddb.com",
      "www.indiedb.com",
      "www.moddb.com",
      "gamejolt.com",
      "www.reddit.com",
    ]).has(siteRoot)
  ) {
    score = 4;
  } else if (
    row.source_class === "public_article" ||
    row.source_class === "public_project" ||
    row.source_class === "public_profile"
  ) {
    score = 3;
  }

  if (notes.includes("serp") || notes.includes("authority media") || notes.includes("viral")) {
    score += 1;
  }
  if (notes.includes("editorial/tip only") || notes.includes("secondary citation")) {
    score += 1;
  }

  return Math.min(score, 5);
}

export async function readCsvIfExists(filePath: string): Promise<Array<Record<string, string>>> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return parseCsv(content);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function ensureOutreachLayout(): Promise<void> {
  await fs.mkdir(OUTREACH_DIR, { recursive: true });
  await fs.mkdir(PAYLOAD_DIR, { recursive: true });
  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.mkdir(IMPORT_DIR, { recursive: true });

  await ensureCsvFile(RESOURCE_POOL_FILE, RESOURCE_POOL_HEADERS);
  await ensureCsvFile(EXECUTION_QUEUE_FILE, EXECUTION_QUEUE_HEADERS);
  await ensureCsvFile(VERIFICATION_FILE, VERIFICATION_HEADERS);
  await ensureCsvFile(SUBMISSION_REVIEW_FILE, SUBMISSION_REVIEW_HEADERS);
}

async function ensureCsvFile(filePath: string, headers: string[]): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, `${headers.join(",")}\n`, "utf8");
  }
}

function inferRequirementsFromNotes(notes: string): {
  requiresLogin: boolean;
  requiresCaptcha: boolean;
  requiresManualConfirm: boolean;
} {
  const lower = notes.toLowerCase();
  return {
    requiresLogin: lower.includes("login") || lower.includes("oauth"),
    requiresCaptcha:
      lower.includes("captcha") || lower.includes("cloudflare security"),
    requiresManualConfirm:
      lower.includes("manual") ||
      lower.includes("review") ||
      lower.includes("awaiting moderation") ||
      lower.includes("moderation"),
  };
}

export async function buildResourcePool(today: string): Promise<ResourcePoolRow[]> {
  const [artRows, gamesRows, commentRows, competitorRows, importRows, existingPool] = await Promise.all([
    readCsvIfExists(LEGACY_ART_TRACKER),
    readCsvIfExists(LEGACY_GAMES_TRACKER),
    readCsvIfExists(COMMENT_PROSPECTS_FILE),
    readCsvIfExists(COMPETITOR_QUEUE_FILE),
    readImportSeedRows(),
    readCsvIfExists(RESOURCE_POOL_FILE),
  ]);

  const pool = new Map<string, ResourcePoolRow>();

  for (const row of existingPool) {
    const resource = row as unknown as ResourcePoolRow;
    const normalizedResource: ResourcePoolRow = {
      ...resource,
      status: resource.status === "queued" ? "qualified" : resource.status,
    };
    pool.set(
      `${normalizedResource.target_site}::${normalizedResource.canonical_url}`,
      normalizedResource,
    );
  }

  for (const row of artRows) {
    ingestLegacyArtRow(pool, row, today);
  }
  for (const row of gamesRows) {
    ingestLegacyGamesRow(pool, row, today);
  }
  for (const row of commentRows) {
    ingestCommentProspect(pool, row, today);
  }
  for (const row of competitorRows) {
    ingestCompetitorProspect(pool, row, today);
  }
  for (const row of importRows) {
    ingestImportSeed(pool, row, today);
  }

  addRepoSiblingCandidates(pool, today);

  const resources = Array.from(pool.values()).sort((a, b) =>
    a.target_site === b.target_site
      ? a.canonical_url.localeCompare(b.canonical_url)
      : a.target_site.localeCompare(b.target_site),
  );

  await fs.writeFile(
    RESOURCE_POOL_FILE,
    stringifyCsv(resources, RESOURCE_POOL_HEADERS),
    "utf8",
  );

  return resources;
}

async function readImportSeedRows(): Promise<Array<Record<string, string>>> {
  try {
    const files = (await fs.readdir(IMPORT_DIR))
      .filter((file) => file.endsWith(".csv"))
      .sort();
    const allRows: Array<Record<string, string>> = [];
    for (const file of files) {
      const rows = await readCsvIfExists(path.join(IMPORT_DIR, file));
      allRows.push(...rows);
    }
    return allRows;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function mergeResource(
  pool: Map<string, ResourcePoolRow>,
  row: ResourcePoolRow,
): void {
  const key = `${row.target_site}::${row.canonical_url}`;
  const existing = pool.get(key);
  if (!existing) {
    pool.set(key, row);
    return;
  }

  const merged: ResourcePoolRow = {
    ...existing,
    ...row,
    notes: [existing.notes, row.notes].filter(Boolean).join(" | "),
    topical_score: String(
      Math.max(Number(existing.topical_score), Number(row.topical_score)),
    ),
    visibility_score: String(
      Math.max(Number(existing.visibility_score), Number(row.visibility_score)),
    ),
    quality_score: String(
      Math.max(Number(existing.quality_score), Number(row.quality_score)),
    ),
    root_cap: String(Math.max(Number(existing.root_cap), Number(row.root_cap))),
    status: pickStrongerStatus(existing.status, row.status),
    submission_mode:
      existing.submission_mode === "manual_only" || row.submission_mode === "manual_only"
        ? "manual_only"
        : existing.submission_mode === "semi_auto" || row.submission_mode === "semi_auto"
          ? "semi_auto"
          : "auto",
  };

  pool.set(key, merged);
}

function pickStrongerStatus(a: ResourceStatus, b: ResourceStatus): ResourceStatus {
  const order: ResourceStatus[] = [
    "candidate",
    "qualified",
    "queued",
    "submitted",
    "live_visible",
    "live_visible_follow_like",
    "live_visible_nofollow",
    "blocked",
    "rejected",
  ];
  return order.indexOf(b) > order.indexOf(a) ? b : a;
}

function ingestLegacyArtRow(
  pool: Map<string, ResourcePoolRow>,
  row: Record<string, string>,
  today: string,
): void {
  const rawUrl = row.url_submitted?.trim();
  if (!rawUrl) return;

  const canonicalUrl = canonicalizeUrl(rawUrl);
  const pageType = derivePageType(row.target_type ?? "", canonicalUrl);
  const sourceClass = deriveSourceClass(pageType);
  const ownershipClass = inferOwnershipClass(canonicalUrl);
  const requirements = inferRequirementsFromNotes(row.notes ?? "");
  const submissionMode = deriveSubmissionMode(
    pageType,
    requirements.requiresLogin,
    requirements.requiresCaptcha,
    requirements.requiresManualConfirm,
  );
  const siteRoot = siteRootFromUrl(canonicalUrl);
  const status = normalizeStatus(row.status ?? "");

  mergeResource(pool, {
    date_added: row.date || today,
    site_root: siteRoot,
    canonical_url: canonicalUrl,
    page_type: pageType,
    target_site: "art",
    target_url: inferTargetUrl("art", row.notes ?? "", rawUrl),
    anchor_text: inferAnchorText("art", row.notes ?? ""),
    source_class: sourceClass,
    ownership_class: ownershipClass,
    topical_score: String(scoreTopicalFit(row.notes ?? "", canonicalUrl)),
    visibility_score: String(scoreVisibility(sourceClass, row.notes ?? "", submissionMode)),
    quality_score: String(scoreQuality(siteRoot, row.notes ?? "")),
    root_cap: String(defaultRootCap(siteRoot, sourceClass, ownershipClass)),
    requires_login: String(requirements.requiresLogin),
    requires_captcha: String(requirements.requiresCaptcha),
    requires_manual_confirm: String(requirements.requiresManualConfirm),
    submission_mode: submissionMode,
    status,
    last_checked_at: row.date || "",
    notes: [row.target_repo, row.notes].filter(Boolean).join(" | "),
  });
}

function ingestLegacyGamesRow(
  pool: Map<string, ResourcePoolRow>,
  row: Record<string, string>,
  today: string,
): void {
  const rawUrl = row.source_url?.trim();
  if (!rawUrl) return;

  const canonicalUrl = canonicalizeUrl(rawUrl);
  const pageType = derivePageType(row.type ?? "", canonicalUrl);
  const sourceClass = deriveSourceClass(pageType);
  const ownershipClass = inferOwnershipClass(canonicalUrl);
  const requirements = inferRequirementsFromNotes(row.notes ?? "");
  const submissionMode = deriveSubmissionMode(
    pageType,
    requirements.requiresLogin,
    requirements.requiresCaptcha,
    requirements.requiresManualConfirm,
  );
  const siteRoot = siteRootFromUrl(canonicalUrl);
  const status = normalizeStatus(row.status ?? "");

  mergeResource(pool, {
    date_added: row.date || today,
    site_root: siteRoot,
    canonical_url: canonicalUrl,
    page_type: pageType,
    target_site: "games",
    target_url: inferTargetUrl("games", row.notes ?? "", rawUrl),
    anchor_text: inferAnchorText("games", row.notes ?? ""),
    source_class: sourceClass,
    ownership_class: ownershipClass,
    topical_score: String(scoreTopicalFit(row.notes ?? "", canonicalUrl)),
    visibility_score: String(scoreVisibility(sourceClass, row.notes ?? "", submissionMode)),
    quality_score: String(scoreQuality(siteRoot, row.notes ?? "")),
    root_cap: String(defaultRootCap(siteRoot, sourceClass, ownershipClass)),
    requires_login: String(requirements.requiresLogin),
    requires_captcha: String(requirements.requiresCaptcha),
    requires_manual_confirm: String(requirements.requiresManualConfirm),
    submission_mode: submissionMode,
    status,
    last_checked_at: row.date || "",
    notes: [row.source_domain, row.notes].filter(Boolean).join(" | "),
  });
}

function ingestCommentProspect(
  pool: Map<string, ResourcePoolRow>,
  row: Record<string, string>,
  today: string,
): void {
  const rawUrl = row.url?.trim();
  if (!rawUrl) return;

  const canonicalUrl = canonicalizeUrl(rawUrl);
  const targetSite = (row.recommended_target ?? "").includes(".games/")
    ? "games"
    : "art";
  const siteRoot = siteRootFromUrl(canonicalUrl);
  const notes = row.notes ?? "";
  const requiresCaptcha = (row.anti_spam_terms_detected ?? "").toLowerCase() === "yes";
  const requiresManualConfirm = true;

  mergeResource(pool, {
    date_added: normalizeDate(row.date_found || today),
    site_root: siteRoot,
    canonical_url: canonicalUrl,
    page_type: "blog_comment",
    target_site: targetSite,
    target_url: row.recommended_target?.trim() || TARGET_DEFAULTS[targetSite].targetUrl,
    anchor_text: targetSite === "games" ? "Mecha Chameleon" : "Meccha Chameleon",
    source_class: "comment_submission",
    ownership_class: "third_party",
    topical_score: String(scoreTopicalFit(`${row.topic_fit} ${notes}`, canonicalUrl)),
    visibility_score: String(scoreVisibility("comment_submission", notes, "semi_auto")),
    quality_score: String(scoreQuality(siteRoot, notes)),
    root_cap: String(defaultRootCap(siteRoot, "comment_submission", "third_party")),
    requires_login: "false",
    requires_captcha: String(requiresCaptcha),
    requires_manual_confirm: String(requiresManualConfirm),
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes,
  });
}

function ingestCompetitorProspect(
  pool: Map<string, ResourcePoolRow>,
  row: Record<string, string>,
  today: string,
): void {
  const rawUrl = row.source_url?.trim();
  if (!rawUrl) return;

  const canonicalUrl = canonicalizeUrl(rawUrl);
  const targetSite = (row.target_url ?? "").includes(".games/")
    ? "games"
    : "art";
  const pageType = derivePageType(row.type ?? "", canonicalUrl);
  const sourceClass = deriveSourceClass(pageType);
  const siteRoot = siteRootFromUrl(canonicalUrl);
  const lowerStatus = (row.status ?? "").toLowerCase();
  const requiresLogin = lowerStatus.includes("login");
  const requiresCaptcha = lowerStatus.includes("captcha") || lowerStatus.includes("policy");
  const requiresManualConfirm =
    lowerStatus.includes("monitor") ||
    lowerStatus.includes("optional") ||
    lowerStatus.includes("policy") ||
    requiresLogin;
  const submissionMode = deriveSubmissionMode(
    pageType,
    requiresLogin,
    requiresCaptcha,
    requiresManualConfirm,
  );

  mergeResource(pool, {
    date_added: row.date || today,
    site_root: siteRoot,
    canonical_url: canonicalUrl,
    page_type: pageType,
    target_site: targetSite,
    target_url: row.target_url?.trim() || TARGET_DEFAULTS[targetSite].targetUrl,
    anchor_text: row.anchor?.trim() || TARGET_DEFAULTS[targetSite].anchorText,
    source_class: sourceClass,
    ownership_class: "third_party",
    topical_score: String(scoreTopicalFit(`${row.type} ${row.notes}`, canonicalUrl)),
    visibility_score: String(scoreVisibility(sourceClass, row.notes ?? "", submissionMode)),
    quality_score: String(scoreQuality(siteRoot, row.notes ?? "")),
    root_cap: String(defaultRootCap(siteRoot, sourceClass, "third_party")),
    requires_login: String(requiresLogin),
    requires_captcha: String(requiresCaptcha),
    requires_manual_confirm: String(requiresManualConfirm),
    submission_mode: submissionMode,
    status: normalizeStatus(row.status ?? ""),
    last_checked_at: row.date || "",
    notes: `${row.priority || ""} ${row.notes || ""}`.trim(),
  });
}

function ingestImportSeed(
  pool: Map<string, ResourcePoolRow>,
  row: Record<string, string>,
  today: string,
): void {
  const rawUrl = row.canonical_url?.trim() || row.source_url?.trim() || row.url?.trim();
  if (!rawUrl) return;

  const canonicalUrl = canonicalizeUrl(rawUrl);
  const targetSite = (row.target_site ?? "").trim() === "games" ? "games" : "art";
  const siteRoot = siteRootFromUrl(canonicalUrl);
  const pageType = derivePageType(row.page_type ?? row.type ?? "", canonicalUrl);
  const sourceClass =
    row.source_class?.trim() && row.source_class !== "auto"
      ? (row.source_class as SourceClass)
      : deriveSourceClass(pageType);
  const ownershipClass =
    row.ownership_class?.trim() === "self_controlled"
      ? "self_controlled"
      : inferOwnershipClass(canonicalUrl);
  const requiresLogin = (row.requires_login ?? "").trim() === "true";
  const requiresCaptcha = (row.requires_captcha ?? "").trim() === "true";
  const requiresManualConfirm = (row.requires_manual_confirm ?? "").trim() !== "false";
  const submissionMode = deriveSubmissionMode(
    pageType,
    requiresLogin,
    requiresCaptcha,
    requiresManualConfirm,
  );
  const notes = row.notes ?? "";
  const key = `${targetSite}::${canonicalUrl}`;
  const existing = pool.get(key);

  if (
    existing &&
    ["submitted", "blocked", "rejected"].includes(existing.status) &&
    !shouldCountStatus(existing.status)
  ) {
    pool.delete(key);
  }

  mergeResource(pool, {
    date_added: normalizeDate(row.date_added || today),
    site_root: siteRoot,
    canonical_url: canonicalUrl,
    page_type: pageType,
    target_site: targetSite,
    target_url: row.target_url?.trim() || TARGET_DEFAULTS[targetSite].targetUrl,
    anchor_text: row.anchor_text?.trim() || TARGET_DEFAULTS[targetSite].anchorText,
    source_class: sourceClass,
    ownership_class: ownershipClass,
    topical_score: row.topical_score?.trim() || String(scoreTopicalFit(notes, canonicalUrl)),
    visibility_score:
      row.visibility_score?.trim() ||
      String(scoreVisibility(sourceClass, notes, submissionMode)),
    quality_score: row.quality_score?.trim() || String(scoreQuality(siteRoot, notes)),
    root_cap:
      row.root_cap?.trim() ||
      String(defaultRootCap(siteRoot, sourceClass, ownershipClass)),
    requires_login: String(requiresLogin),
    requires_captcha: String(requiresCaptcha),
    requires_manual_confirm: String(requiresManualConfirm),
    submission_mode: submissionMode,
    status: normalizeStatus(row.status ?? "candidate"),
    last_checked_at: row.last_checked_at?.trim() || "",
    notes,
  });
}

function addRepoSiblingCandidates(
  pool: Map<string, ResourcePoolRow>,
  today: string,
): void {
  const siblingSeeds = [
    {
      target_site: "games" as const,
      base: "https://github.com/zlc000190/mechachameleon-games",
      urls: [
        "/wiki",
        "/issues",
        "/releases",
        "/tags",
      ],
    },
    {
      target_site: "art" as const,
      base: "https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot",
      urls: [
        "/wiki",
        "/issues",
        "/releases",
        "/tags",
      ],
    },
  ];

  for (const seed of siblingSeeds) {
    for (const suffix of seed.urls) {
      const canonicalUrl = canonicalizeUrl(`${seed.base}${suffix}`);
      const pageType = derivePageType(suffix, canonicalUrl);
      const sourceClass = deriveSourceClass(pageType);
      const siteRoot = siteRootFromUrl(canonicalUrl);
      mergeResource(pool, {
        date_added: today,
        site_root: siteRoot,
        canonical_url: canonicalUrl,
        page_type: pageType,
        target_site: seed.target_site,
        target_url: TARGET_DEFAULTS[seed.target_site].targetUrl,
        anchor_text: TARGET_DEFAULTS[seed.target_site].anchorText,
        source_class: sourceClass,
        ownership_class: "self_controlled",
        topical_score: "5",
        visibility_score: "5",
        quality_score: "5",
        root_cap: String(defaultRootCap(siteRoot, sourceClass, "self_controlled")),
        requires_login: "false",
        requires_captcha: "false",
        requires_manual_confirm: "false",
        submission_mode: "auto",
        status: "candidate",
        last_checked_at: "",
        notes: "Derived sibling public surface from verified self-controlled GitHub repo.",
      });
    }
  }
}

export function normalizeDate(raw: string): string {
  const text = raw.trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const slash = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!slash) return text;
  return `${slash[1]}-${slash[2].padStart(2, "0")}-${slash[3].padStart(2, "0")}`;
}

export function rootCountMap(rows: ResourcePoolRow[], targetSite: TargetSite): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.target_site !== targetSite) continue;
    if (!shouldCountStatus(row.status)) continue;
    counts.set(row.site_root, (counts.get(row.site_root) ?? 0) + 1);
  }
  return counts;
}

function isExecutionEligible(row: ResourcePoolRow): boolean {
  if (!["candidate", "qualified"].includes(row.status)) {
    return false;
  }

  if (
    row.site_root === "web.archive.org" ||
    row.site_root === "api.indexnow.org" ||
    row.site_root === "www.google.com"
  ) {
    return false;
  }

  const lower = `${row.notes} ${row.canonical_url}`.toLowerCase();
  const historicalSignals = [
    "archive snapshot",
    "saved ",
    "published under",
    "created public",
    "updated public profile",
    "resubmitted live sitemap",
    "public page remains in search results",
    "self-link",
    "already existed",
  ];
  if (historicalSignals.some((signal) => lower.includes(signal))) {
    return false;
  }

  if (
    row.source_class === "directory_submission" ||
    row.source_class === "comment_submission"
  ) {
    return true;
  }

  if (row.ownership_class === "self_controlled") {
    return lower.includes("derived sibling public surface");
  }

  const actionCues = [
    "submit",
    "comment",
    "review",
    "login",
    "account",
    "profile",
    "forum",
    "workshop",
    "answers",
    "media",
    "q&a",
    "screenshots",
    "grids",
    "contribution",
    "question",
  ];
  return actionCues.some((cue) => lower.includes(cue));
}

export async function generateExecutionQueues(
  today: string,
): Promise<{
  all: ExecutionQueueRow[];
  games: ExecutionQueueRow[];
  art: ExecutionQueueRow[];
}> {
  const resourceRows = (await readCsvIfExists(RESOURCE_POOL_FILE)) as unknown as ResourcePoolRow[];
  const countsBySite = {
    games: rootCountMap(resourceRows, "games"),
    art: rootCountMap(resourceRows, "art"),
  };

  const queueRows: ExecutionQueueRow[] = [];
  const resourceUpdates = new Map<string, ResourcePoolRow>();

  for (const targetSite of ["games", "art"] as const) {
    const eligible = resourceRows
      .filter((row) => row.target_site === targetSite)
      .filter((row) => isExecutionEligible(row))
      .filter((row) => {
        const rootCount = countsBySite[targetSite].get(row.site_root) ?? 0;
        return rootCount < Number(row.root_cap || "0");
      })
      .sort((a, b) => compareForQueue(a, b, countsBySite[targetSite]));

    for (const row of eligible) {
      const preparedPayloadRef = await writePreparedPayload(row);
      const blocking = deriveBlockingStep(row);
      queueRows.push({
        queue_date: today,
        target_site: row.target_site,
        site_root: row.site_root,
        canonical_url: row.canonical_url,
        submission_mode: row.submission_mode,
        prepared_payload_ref: preparedPayloadRef,
        blocking_step: blocking.step,
        next_human_action: blocking.action,
        status: row.submission_mode === "auto" ? "ready_auto" : "ready_semi_auto",
      });
      resourceUpdates.set(`${row.target_site}::${row.canonical_url}`, {
        ...row,
        status: "queued",
        last_checked_at: today,
      });
    }

    const rejected = resourceRows
      .filter((row) => row.target_site === targetSite)
      .filter((row) => isExecutionEligible(row))
      .filter((row) => {
        const rootCount = countsBySite[targetSite].get(row.site_root) ?? 0;
        return rootCount >= Number(row.root_cap || "0");
      });

    for (const row of rejected) {
      resourceUpdates.set(`${row.target_site}::${row.canonical_url}`, {
        ...row,
        status: "rejected",
        notes: `${row.notes} | rejected_root_cap`,
      });
    }
  }

  const updatedResources = resourceRows.map((row) => {
    return (
      resourceUpdates.get(`${row.target_site}::${row.canonical_url}`) ?? row
    );
  });

  await fs.writeFile(
    RESOURCE_POOL_FILE,
    stringifyCsv(updatedResources, RESOURCE_POOL_HEADERS),
    "utf8",
  );
  await fs.writeFile(
    EXECUTION_QUEUE_FILE,
    stringifyCsv(queueRows, EXECUTION_QUEUE_HEADERS),
    "utf8",
  );

  const games = queueRows.filter((row) => row.target_site === "games");
  const art = queueRows.filter((row) => row.target_site === "art");
  await fs.writeFile(
    GAMES_QUEUE_FILE,
    stringifyCsv(games, EXECUTION_QUEUE_HEADERS),
    "utf8",
  );
  await fs.writeFile(
    ART_QUEUE_FILE,
    stringifyCsv(art, EXECUTION_QUEUE_HEADERS),
    "utf8",
  );

  return { all: queueRows, games, art };
}

function compareForQueue(
  a: ResourcePoolRow,
  b: ResourcePoolRow,
  rootCounts: Map<string, number>,
): number {
  const ownerA = a.ownership_class === "third_party" ? 0 : 1;
  const ownerB = b.ownership_class === "third_party" ? 0 : 1;
  if (ownerA !== ownerB) return ownerA - ownerB;

  const tierA = sourceTier(a);
  const tierB = sourceTier(b);
  if (tierA !== tierB) return tierA - tierB;

  const visibilityDiff = Number(b.visibility_score) - Number(a.visibility_score);
  if (visibilityDiff !== 0) return visibilityDiff;

  const qualityDiff = Number(b.quality_score) - Number(a.quality_score);
  if (qualityDiff !== 0) return qualityDiff;

  const rootCountDiff =
    (rootCounts.get(a.site_root) ?? 0) - (rootCounts.get(b.site_root) ?? 0);
  if (rootCountDiff !== 0) return rootCountDiff;

  return a.canonical_url.localeCompare(b.canonical_url);
}

function sourceTier(row: ResourcePoolRow): number {
  if (
    row.source_class === "public_article" ||
    row.source_class === "public_project" ||
    row.source_class === "public_profile"
  ) {
    return 1;
  }
  if (row.source_class === "directory_submission") {
    return 2;
  }
  return 3;
}

async function writePreparedPayload(row: ResourcePoolRow): Promise<string> {
  const siteDir = path.join(PAYLOAD_DIR, row.target_site);
  await fs.mkdir(siteDir, { recursive: true });

  const slug = row.canonical_url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  const filePath = path.join(siteDir, `${slug}.md`);

  const target = TARGET_DEFAULTS[row.target_site];
  const mergedNotes = Array.from(
    new Set(
      [row.notes, getDomainPlaybook(row.site_root).notes]
        .flatMap((value) => value.split("|"))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).join(" | ");
  const routing = buildSupportRouting({
    target_site: row.target_site,
    canonical_url: row.canonical_url,
  });
  const body = [
    `# Prepared payload`,
    ``,
    `- target_site: ${row.target_site}`,
    `- source_url: ${row.canonical_url}`,
    `- target_url: ${row.target_url}`,
    `- homepage_first_target: ${routing.primaryDestination}`,
    `- anchor_text: ${row.anchor_text}`,
    `- alias: ${target.alias}`,
    `- email: ${target.email}`,
    `- page_type: ${row.page_type}`,
    `- source_class: ${row.source_class}`,
    `- submission_mode: ${row.submission_mode}`,
    `- suggested_action: ${getDomainPlaybook(row.site_root).action}`,
    `- contribution_type: ${getDomainPlaybook(row.site_root).contributionType}`,
    ``,
    `## Draft angle`,
    `${target.angles.join(", ")}`,
    ``,
    `## Suggested action`,
    `${getDomainPlaybook(row.site_root).action}`,
    ``,
    `## Routing`,
    `${routing.angle}`,
    ``,
    `Primary homepage-first destination: ${routing.primaryDestination}`,
    ``,
    `Support pages:`,
    ...routing.supportPages.map(
      (page) => `- ${page.path} (${page.label}): ${page.reason}`,
    ),
    ``,
    `## Suggested snippet`,
    `${getDomainPlaybook(row.site_root).draftTemplate(row)}`,
    ``,
    `## Notes`,
    mergedNotes,
    ``,
    `## Privacy check`,
    `Use alias ${target.alias} and contact ${target.email} only where the destination explicitly requires a reply-capable field.`,
  ].join("\n");

  await fs.writeFile(filePath, `${body}\n`, "utf8");
  return filePath;
}

function deriveBlockingStep(row: ResourcePoolRow): {
  step: ExecutionQueueRow["blocking_step"];
  action: string;
} {
  if (row.requires_captcha === "true") {
    return {
      step: "captcha",
      action: "Complete CAPTCHA, then resume visibility verification.",
    };
  }
  if (row.requires_login === "true") {
    return {
      step: "login_confirm",
      action: "Use a logged-in browser session, confirm account choice, then continue.",
    };
  }
  if (row.requires_manual_confirm === "true") {
    return {
      step: "final_submit_review",
      action: "Review the drafted fields and complete the final submit step.",
    };
  }
  return DEFAULT_BLOCKING_BY_MODE[row.submission_mode];
}

export async function verifyVisibleLinks(
  today: string,
  onlyTargetSite?: TargetSite,
  limit?: number,
): Promise<VisibilityVerificationRow[]> {
  const resources = (await readCsvIfExists(RESOURCE_POOL_FILE)) as unknown as ResourcePoolRow[];
  const queueRows = (await readCsvIfExists(EXECUTION_QUEUE_FILE)) as unknown as ExecutionQueueRow[];
  const priorVerifications = (await readCsvIfExists(VERIFICATION_FILE)) as unknown as VisibilityVerificationRow[];
  const verificationMap = new Map<string, VisibilityVerificationRow>();
  for (const row of priorVerifications) {
    verificationMap.set(
      `${row.verified_at}::${row.target_site}::${canonicalizeUrl(row.source_url)}::${canonicalizeUrl(row.target_url)}`,
      row,
    );
  }
  const resourceUpdates = new Map<string, ResourcePoolRow>();
  const queuedKeys = new Set(
    queueRows.map((row) => `${row.target_site}::${canonicalizeUrl(row.canonical_url)}`),
  );

  const resourceByKey = new Map(
    resources.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  const prioritized: ResourcePoolRow[] = [];
  for (const queueRow of queueRows) {
    if (onlyTargetSite && queueRow.target_site !== onlyTargetSite) continue;
    const key = `${queueRow.target_site}::${canonicalizeUrl(queueRow.canonical_url)}`;
    const resource = resourceByKey.get(key);
    if (resource) {
      prioritized.push(resource);
    }
  }

  for (const resource of resources) {
    if (onlyTargetSite && resource.target_site !== onlyTargetSite) continue;
    if (!shouldCountStatus(resource.status)) continue;
    const key = `${resource.target_site}::${resource.canonical_url}`;
    if (!queuedKeys.has(key)) {
      prioritized.push(resource);
    }
  }

  const dedupedCandidates: ResourcePoolRow[] = [];
  const seen = new Set<string>();
  for (const row of prioritized) {
    const key = `${row.target_site}::${row.canonical_url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedCandidates.push(row);
  }

  const candidates = dedupedCandidates.slice(
    0,
    limit && limit > 0 ? limit : undefined,
  );

  for (const row of candidates) {
    const result = await verifySingleResource(row, today);
    verificationMap.set(
      `${result.verified_at}::${result.target_site}::${canonicalizeUrl(result.source_url)}::${canonicalizeUrl(result.target_url)}`,
      result,
    );
    resourceUpdates.set(`${row.target_site}::${row.canonical_url}`, {
      ...row,
      status: verificationToStatus(row.status, result.visibility_status),
      last_checked_at: today,
    });
  }

  const verifications = Array.from(verificationMap.values()).sort((a, b) =>
    a.verified_at === b.verified_at
      ? a.source_url.localeCompare(b.source_url)
      : a.verified_at.localeCompare(b.verified_at),
  );

  const updatedResources = resources.map((row) => {
    return resourceUpdates.get(`${row.target_site}::${row.canonical_url}`) ?? row;
  });

  await fs.writeFile(
    RESOURCE_POOL_FILE,
    stringifyCsv(updatedResources, RESOURCE_POOL_HEADERS),
    "utf8",
  );
  await fs.writeFile(
    VERIFICATION_FILE,
    stringifyCsv(verifications, VERIFICATION_HEADERS),
    "utf8",
  );

  return verifications;
}

async function verifySingleResource(
  row: ResourcePoolRow,
  today: string,
): Promise<VisibilityVerificationRow> {
  try {
    const response = await fetch(row.canonical_url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; MecchaChameleonOutreachVerifier/1.0)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    const html = await response.text();
    const targetNoHash = canonicalizeUrl(row.target_url);
    const htmlContainsTarget = html.includes(targetNoHash);
    const anchorMatch = findAnchorForTarget(html, targetNoHash);
    const relValue = extractRelValue(anchorMatch);
    const visibilityStatus = deriveVisibilityStatus(
      response.status,
      htmlContainsTarget,
      Boolean(anchorMatch),
      relValue,
    );

    return {
      verified_at: today,
      target_site: row.target_site,
      site_root: row.site_root,
      source_url: row.canonical_url,
      target_url: row.target_url,
      html_contains_target: String(htmlContainsTarget),
      anchor_present: String(Boolean(anchorMatch)),
      rel_value: relValue,
      visibility_status: visibilityStatus,
      verification_method: "http_fetch_html",
      notes: `HTTP ${response.status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      verified_at: today,
      target_site: row.target_site,
      site_root: row.site_root,
      source_url: row.canonical_url,
      target_url: row.target_url,
      html_contains_target: "false",
      anchor_present: "false",
      rel_value: "unknown",
      visibility_status: "blocked",
      verification_method: "http_fetch_html",
      notes: message,
    };
  }
}

function findAnchorForTarget(html: string, targetUrl: string): string | null {
  const escaped = escapeForRegex(targetUrl);
  const regex = new RegExp(`<a\\b[^>]*href=["']${escaped}["'][^>]*>`, "i");
  const match = html.match(regex);
  return match?.[0] ?? null;
}

function extractRelValue(anchorHtml: string | null): string {
  if (!anchorHtml) {
    return "unknown";
  }
  const relMatch = anchorHtml.match(/\brel=["']([^"']*)["']/i);
  if (!relMatch) {
    return "";
  }
  return relMatch[1].trim().toLowerCase().replace(/\s+/g, " ");
}

export function deriveVisibilityStatus(
  statusCode: number,
  htmlContainsTarget: boolean,
  anchorPresent: boolean,
  relValue: string,
): string {
  if (statusCode !== 200) return "blocked";
  if (!htmlContainsTarget || !anchorPresent) return "not_visible";
  if (relValue.includes("nofollow")) return "live_visible_nofollow";
  if (relValue.includes("ugc")) return "live_visible_ugc";
  if (FOLLOW_LIKE_REL_VALUES.has(relValue)) return "live_visible_follow_like";
  return "live_visible";
}

function verificationToStatus(
  currentStatus: ResourceStatus,
  visibilityStatus: string,
): ResourceStatus {
  if (visibilityStatus === "live_visible_follow_like") {
    return "live_visible_follow_like";
  }
  if (visibilityStatus === "live_visible_nofollow") {
    return "live_visible_nofollow";
  }
  if (visibilityStatus === "live_visible" || visibilityStatus === "live_visible_ugc") {
    return "live_visible";
  }
  if (currentStatus === "queued") {
    return "queued";
  }
  if (currentStatus === "qualified" || currentStatus === "candidate") {
    return currentStatus;
  }
  if (visibilityStatus === "blocked") {
    return currentStatus === "submitted" ? "blocked" : currentStatus;
  }
  return currentStatus === "submitted" ? "submitted" : currentStatus;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function generateDailySummary(today: string): Promise<string> {
  const resources = (await readCsvIfExists(RESOURCE_POOL_FILE)) as unknown as ResourcePoolRow[];
  const queue = (await readCsvIfExists(EXECUTION_QUEUE_FILE)) as unknown as ExecutionQueueRow[];

  const sections: string[] = [];

  for (const targetSite of ["games", "art"] as const) {
    const targetRows = resources.filter((row) => row.target_site === targetSite);
    const successes = targetRows.filter((row) => shouldCountStatus(row.status));
    const submitted = targetRows.filter((row) => row.status === "submitted");
    const blocked = targetRows.filter((row) => row.status === "blocked");
    const rejected = targetRows.filter((row) => row.status === "rejected");
    const queueRows = queue.filter((row) => row.target_site === targetSite);
    const rootCounts = rootCountMap(resources, targetSite);

    sections.push(`## ${targetSite}`);
    sections.push(``);
    sections.push(`public-visible successes: ${successes.length}`);
    sections.push(`submitted but not yet public: ${submitted.length}`);
    sections.push(`blocked/rejected: ${blocked.length + rejected.length}`);
    sections.push(`queued auto: ${queueRows.filter((row) => row.submission_mode === "auto").length}`);
    sections.push(
      `queued semi_auto: ${queueRows.filter((row) => row.submission_mode === "semi_auto").length}`,
    );
    sections.push(``);
    sections.push(`counted successes by root:`);
    for (const [root, count] of [...rootCounts.entries()].sort((a, b) => b[1] - a[1])) {
      const cap = targetRows.find((row) => row.site_root === root)?.root_cap ?? "0";
      sections.push(`- ${root}: ${count} counted, ${Math.max(Number(cap) - count, 0)} remaining`);
    }
    sections.push(``);

    const blockedByReason = new Map<string, number>();
    for (const row of [...blocked, ...rejected]) {
      const reason = row.notes.includes("rejected_root_cap")
        ? "rejected_root_cap"
        : row.notes.split("|").pop()?.trim() || "other";
      blockedByReason.set(reason, (blockedByReason.get(reason) ?? 0) + 1);
    }
    sections.push(`blocked items by reason:`);
    if (blockedByReason.size === 0) {
      sections.push(`- none`);
    } else {
      for (const [reason, count] of blockedByReason.entries()) {
        sections.push(`- ${reason}: ${count}`);
      }
    }
    sections.push(``);
  }

  const summary = `# Daily backlink visibility summary\n\nGenerated: ${today}\n\n${sections.join("\n")}\n`;
  const summaryPath = path.join(REPORT_DIR, `daily-summary-${today}.md`);
  await fs.writeFile(summaryPath, summary, "utf8");
  return summaryPath;
}
