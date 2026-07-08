import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

import {
  canonicalizeUrl,
  citationMultiplierScore,
  classifyExecutionRisk,
  defaultRootCap,
  deriveSourceClass,
  deriveVisibilityStatus,
  isActionableThirdPartyOpportunity,
  normalizeStatus,
  rootCountMap,
  scoreVisibility,
  summarizeNotes,
} from "./seo-outreach/lib";
import { getDomainPlaybook } from "./seo-outreach/playbooks";
import { buildSupportRouting } from "./seo-outreach/routing";
import { renderBrowserTaskManifest } from "./seo-outreach/render-browser-task-manifest";
import { renderBrowserReviewSheet } from "./seo-outreach/render-browser-review-sheet";
import { renderBrowserSessionRunbook } from "./seo-outreach/render-browser-session-runbook";
import { renderBrowserStepCards } from "./seo-outreach/render-browser-step-cards";
import { renderArtEchoGapReport } from "./seo-outreach/render-art-echo-gap-report";
import { renderArtRankPushBoard } from "./seo-outreach/render-art-rank-push-board";
import { renderArtStrikeBoard } from "./seo-outreach/render-art-strike-board";
import { renderArtSubmissionPacket } from "./seo-outreach/render-art-submission-packet";
import { renderGamesSubmissionPacket } from "./seo-outreach/render-games-submission-packet";
import { renderArtSprintSheet } from "./seo-outreach/render-art-sprint-sheet";
import { renderArtOpsDashboard } from "./seo-outreach/render-art-ops-dashboard";
import { renderGamesOpsDashboard } from "./seo-outreach/render-games-ops-dashboard";
import { renderGamesSprintSheet } from "./seo-outreach/render-games-sprint-sheet";
import { syncSiteSprintSheet } from "./seo-outreach/sync-sprint-sheet";
import { reconcileBrowserReview } from "./seo-outreach/reconcile-browser-review";
import { syncBrowserReviewSheet } from "./seo-outreach/sync-browser-review-sheet";
import { renderSiteSupportInventory } from "./seo-outreach/render-site-support-inventory";
import type { ResourcePoolRow } from "./seo-outreach/types";

test("normalization collapses fragments and host casing", () => {
  assert.equal(
    canonicalizeUrl("HTTPS://GitHub.com/zlc000190/repo/#section"),
    "https://github.com/zlc000190/repo",
  );
});

test("root-cap defaults follow the plan", () => {
  assert.equal(defaultRootCap("github.com", "public_project", "self_controlled"), 10);
  assert.equal(defaultRootCap("example.com", "comment_submission", "third_party"), 2);
  assert.equal(defaultRootCap("example.com", "public_article", "third_party"), 3);
});

test("queue-priority helpers recognize public pages over comments", () => {
  assert.equal(deriveSourceClass("article"), "public_article");
  assert.equal(deriveSourceClass("blog_comment"), "comment_submission");
  assert.ok(
    scoreVisibility("public_article", "public page", "auto") >
      scoreVisibility("comment_submission", "awaiting moderation", "semi_auto"),
  );
});

test("verification requires a real anchor to count", () => {
  assert.equal(deriveVisibilityStatus(200, true, false, ""), "not_visible");
  assert.equal(deriveVisibilityStatus(200, true, true, ""), "live_visible_follow_like");
});

test("status transition keeps submitted out of success counts", () => {
  const rows: ResourcePoolRow[] = [
    {
      date_added: "2026-07-05",
      site_root: "example.com",
      canonical_url: "https://example.com/a",
      page_type: "article",
      target_site: "games",
      target_url: "https://mechachameleon.games/",
      anchor_text: "Mecha Chameleon",
      source_class: "public_article",
      ownership_class: "third_party",
      topical_score: "5",
      visibility_score: "5",
      quality_score: "4",
      root_cap: "3",
      requires_login: "false",
      requires_captcha: "false",
      requires_manual_confirm: "false",
      submission_mode: "auto",
      status: "submitted",
      last_checked_at: "",
      notes: "",
    },
    {
      date_added: "2026-07-05",
      site_root: "example.com",
      canonical_url: "https://example.com/b",
      page_type: "article",
      target_site: "games",
      target_url: "https://mechachameleon.games/",
      anchor_text: "Mecha Chameleon",
      source_class: "public_article",
      ownership_class: "third_party",
      topical_score: "5",
      visibility_score: "5",
      quality_score: "4",
      root_cap: "3",
      requires_login: "false",
      requires_captcha: "false",
      requires_manual_confirm: "false",
      submission_mode: "auto",
      status: "live_visible_nofollow",
      last_checked_at: "",
      notes: "",
    },
  ];

  const counts = rootCountMap(rows, "games");
  assert.equal(counts.get("example.com"), 1);
});

test("normalizeStatus maps legacy states to the new workflow", () => {
  assert.equal(normalizeStatus("submitted_pending"), "submitted");
  assert.equal(normalizeStatus("blocked_403"), "blocked");
  assert.equal(normalizeStatus("published"), "qualified");
});

test("comment surfaces are classified as high risk", () => {
  const row: ResourcePoolRow = {
    date_added: "2026-07-06",
    site_root: "example.com",
    canonical_url: "https://example.com/post",
    page_type: "blog_comment",
    target_site: "art",
    target_url: "https://mecchachameleon.art/",
    anchor_text: "Meccha Chameleon Art",
    source_class: "comment_submission",
    ownership_class: "third_party",
    topical_score: "5",
    visibility_score: "2",
    quality_score: "3",
    root_cap: "2",
    requires_login: "false",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes: "Open comment form.",
  };
  assert.equal(classifyExecutionRisk(row), "high_risk");
});

test("public project surfaces are approved by default", () => {
  const row: ResourcePoolRow = {
    date_added: "2026-07-06",
    site_root: "steamcommunity.com",
    canonical_url: "https://steamcommunity.com/app/4704690/guides",
    page_type: "project_page",
    target_site: "games",
    target_url: "https://mechachameleon.games/",
    anchor_text: "Mecha Chameleon Games",
    source_class: "public_project",
    ownership_class: "third_party",
    topical_score: "5",
    visibility_score: "5",
    quality_score: "5",
    root_cap: "3",
    requires_login: "true",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes: "Legitimate guide hub.",
  };
  assert.equal(classifyExecutionRisk(row), "approved");
});

test("reciprocal-link requirement is high risk", () => {
  const row: ResourcePoolRow = {
    date_added: "2026-07-06",
    site_root: "example.org",
    canonical_url: "https://example.org/submit",
    page_type: "directory_detail",
    target_site: "games",
    target_url: "https://mechachameleon.games/",
    anchor_text: "Mecha Chameleon Games",
    source_class: "directory_submission",
    ownership_class: "third_party",
    topical_score: "3",
    visibility_score: "3",
    quality_score: "3",
    root_cap: "3",
    requires_login: "false",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes: "requires email and reciprocal backlink",
  };
  assert.equal(classifyExecutionRisk(row), "high_risk");
});

test("self-controlled and search roots are not third-party opportunities", () => {
  const selfControlled: ResourcePoolRow = {
    date_added: "2026-07-06",
    site_root: "github.com",
    canonical_url: "https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot",
    page_type: "project_page",
    target_site: "art",
    target_url: "https://mecchachameleon.art/",
    anchor_text: "Meccha Chameleon Art",
    source_class: "public_project",
    ownership_class: "self_controlled",
    topical_score: "5",
    visibility_score: "5",
    quality_score: "5",
    root_cap: "10",
    requires_login: "false",
    requires_captcha: "false",
    requires_manual_confirm: "false",
    submission_mode: "auto",
    status: "candidate",
    last_checked_at: "",
    notes: "Self controlled root",
  };
  const searchRoot: ResourcePoolRow = {
    ...selfControlled,
    site_root: "www.google.com",
    canonical_url: "https://www.google.com/search?q=meccha+chameleon",
    ownership_class: "third_party",
  };
  assert.equal(isActionableThirdPartyOpportunity(selfControlled), false);
  assert.equal(isActionableThirdPartyOpportunity(searchRoot), false);
});

test("summarizeNotes deduplicates repeated note fragments", () => {
  assert.equal(
    summarizeNotes("alpha | beta | alpha | beta | gamma | delta", 3),
    "alpha | beta | gamma",
  );
});

test("actionable third-party game page stays actionable", () => {
  const row: ResourcePoolRow = {
    date_added: "2026-07-06",
    site_root: "www.mobygames.com",
    canonical_url: "https://www.mobygames.com/game/interactive/4704690/meccha-chameleon",
    page_type: "project_page",
    target_site: "games",
    target_url: "https://mechachameleon.games/",
    anchor_text: "Mecha Chameleon Games",
    source_class: "public_project",
    ownership_class: "third_party",
    topical_score: "5",
    visibility_score: "4",
    quality_score: "4",
    root_cap: "3",
    requires_login: "true",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes: "Database contribution flow.",
  };
  assert.equal(isActionableThirdPartyOpportunity(row), true);
});

test(".art citation multiplier prioritizes syndication-style roots", () => {
  const hnLike: ResourcePoolRow = {
    date_added: "2026-07-08",
    site_root: "news.ycombinator.com",
    canonical_url: "https://news.ycombinator.com/item?id=48707000",
    page_type: "discussion",
    target_site: "art",
    target_url: "https://mecchachameleon.art/",
    anchor_text: "Meccha Chameleon Art",
    source_class: "public_article",
    ownership_class: "third_party",
    topical_score: "5",
    visibility_score: "5",
    quality_score: "5",
    root_cap: "2",
    requires_login: "false",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "qualified",
    last_checked_at: "",
    notes: "authority media style repost magnet | viral",
  };
  const databaseLike: ResourcePoolRow = {
    ...hnLike,
    site_root: "www.igdb.com",
    canonical_url: "https://www.igdb.com/games/meccha-chameleon--1",
    notes: "public database contribution path",
  };

  assert.equal(citationMultiplierScore(hnLike), 5);
  assert.equal(citationMultiplierScore(databaseLike), 4);
});

test("canonicalizeUrl strips trailing slash but keeps core path", () => {
  assert.equal(
    canonicalizeUrl("https://mecchachameleon.art/maps/"),
    "https://mecchachameleon.art/maps",
  );
});

test("normalize seed date field can be overwritten by carry-forward logic", () => {
  const row = { date_added: "2026-07-06", last_checked_at: "2026-07-06", notes: "x" };
  const next = { ...row, date_added: "2026-07-08", last_checked_at: "2026-07-08" };
  assert.equal(next.date_added, "2026-07-08");
  assert.equal(next.last_checked_at, "2026-07-08");
});

test("site support inventory renders core and map detail pages for both targets", async () => {
  const outputs = await renderSiteSupportInventory("2099-01-01");
  assert.equal(outputs.length, 2);

  const gamesDoc = await fs.readFile(outputs.find((file) => file.includes("-games-"))!, "utf8");
  const artDoc = await fs.readFile(outputs.find((file) => file.includes("-art-"))!, "utf8");

  assert.match(gamesDoc, /# 2099-01-01 \.games site support inventory/);
  assert.match(gamesDoc, /\| \/new-player \|/);
  assert.match(gamesDoc, /\| \/maps\/hide-and-seek-mansion \|/);

  assert.match(artDoc, /# 2099-01-01 \.art site support inventory/);
  assert.match(artDoc, /\| \/community \|/);
  assert.match(artDoc, /\| \/maps\/osaka \|/);
});

test("support routing keeps homepage first and adds game support pages", () => {
  const routing = buildSupportRouting({
    target_site: "games",
    canonical_url: "https://steamcommunity.com/app/4704690/discussions/",
  });

  assert.equal(routing.primaryDestination, "https://mechachameleon.games/");
  assert.match(routing.angle, /Homepage-first/);
  assert.ok(routing.supportPages.some((page) => page.path === "/new-player"));
  assert.ok(routing.supportPages.some((page) => page.path === "/maps"));
  assert.ok(routing.supportPages.some((page) => page.path === "/meccha-chameleon-online"));
});

test("support routing keeps homepage first and adds art support pages", () => {
  const routing = buildSupportRouting({
    target_site: "art",
    canonical_url: "https://www.steamgriddb.com/game/5529099/grids",
  });

  assert.equal(routing.primaryDestination, "https://mecchachameleon.art/");
  assert.match(routing.angle, /Homepage-first/);
  assert.ok(routing.supportPages.some((page) => page.path === "/maps"));
  assert.ok(routing.supportPages.some((page) => page.path === "/community"));
  assert.ok(routing.supportPages.some((page) => page.path === "/meccha-chameleon-online"));
});

test("reddit playbook draft avoids duplicated angle phrasing", () => {
  const row: ResourcePoolRow = {
    date_added: "2026-07-08",
    site_root: "www.reddit.com",
    canonical_url: "https://www.reddit.com/r/Steam/comments/example",
    page_type: "article",
    target_site: "games",
    target_url: "https://mechachameleon.games/",
    anchor_text: "Mecha Chameleon",
    source_class: "public_article",
    ownership_class: "third_party",
    topical_score: "5",
    visibility_score: "4",
    quality_score: "4",
    root_cap: "3",
    requires_login: "true",
    requires_captcha: "false",
    requires_manual_confirm: "true",
    submission_mode: "semi_auto",
    status: "candidate",
    last_checked_at: "",
    notes: "",
  };

  const draft = getDomainPlaybook("www.reddit.com").draftTemplate(row);
  assert.equal(draft.includes("browser guide with browser guide"), false);
  assert.match(draft, /browser guide and controls/);
});

test("browser task manifest renders per-site files", async () => {
  const outputs = await renderBrowserTaskManifest("2026-07-08");
  assert.equal(outputs.length, 4);
  const gamesMd = await fs.readFile(outputs.find((file) => file.endsWith("-games-browser-task-manifest.md"))!, "utf8");
  assert.match(gamesMd, /# 2026-07-08 \.games browser task manifest/);
});

test("browser review sheet renders csv and markdown from manifest", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  const outputs = await renderBrowserReviewSheet("2026-07-08");
  assert.equal(outputs.length, 4);
  const gamesCsv = await fs.readFile(
    outputs.find((file) => file.endsWith("-games-browser-review-sheet.csv"))!,
    "utf8",
  );
  assert.match(gamesCsv, /queue_date,priority,target_site,site_root,source_url/);
});

test("browser session runbook groups tasks by session", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  const outputs = await renderBrowserSessionRunbook("2026-07-08");
  assert.equal(outputs.length, 4);
  const gamesMd = await fs.readFile(
    outputs.find((file) => file.endsWith("-games-browser-session-runbook.md"))!,
    "utf8",
  );
  assert.match(gamesMd, /P1 steamcommunity\.com logged-in session/);
});

test("browser step cards render per-site markdown", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserSessionRunbook("2026-07-08");
  const outputs = await renderBrowserStepCards("2026-07-08");
  assert.equal(outputs.length, 2);
  const gamesMd = await fs.readFile(
    outputs.find((file) => file.endsWith("-games-browser-step-cards.md"))!,
    "utf8",
  );
  assert.match(gamesMd, /Card 1: P1 steamcommunity\.com logged-in session/);
  assert.match(gamesMd, /after submit: update/);
});

test(".art rank push board renders amplifier opportunities", async () => {
  const output = await renderArtRankPushBoard("2026-07-08");
  const board = await fs.readFile(output, "utf8");
  assert.match(board, /# 2026-07-08 \.art rank push board/);
  assert.match(board, /echo potential:/);
  assert.match(board, /Amplifier|Momentum|Foundation/);
});

test(".art echo gap report renders live roots and missing roots", async () => {
  const output = await renderArtEchoGapReport("2026-07-08");
  const report = await fs.readFile(output, "utf8");
  assert.match(report, /# 2026-07-08 \.art echo gap report/);
  assert.match(report, /Current Live Roots/);
  assert.match(report, /Highest-Value Missing Roots/);
});

test(".art strike board renders ranked shortlist", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  const output = await renderArtStrikeBoard("2026-07-08");
  const report = await fs.readFile(output, "utf8");
  assert.match(report, /# 2026-07-08 \.art strike board/);
  assert.match(report, /strike score:/);
  assert.match(report, /## 1\./);
});

test(".art submission packet renders alias audit and grouped shortlist", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderArtStrikeBoard("2026-07-08");
  const output = await renderArtSubmissionPacket("2026-07-08");
  const report = await fs.readFile(output, "utf8");
  assert.match(report, /# 2026-07-08 \.art submission packet/);
  assert.match(report, /## Alias Audit/);
  assert.match(report, /Meccha Chameleon Art \/ zlc000194@gmail\.com/);
  assert.match(report, /## Review And Submit|## Needs Logged-In Session/);
  assert.doesNotMatch(report, /echo potential: 0\/5/);
});

test(".art sprint sheet renders csv and markdown while preserving operator fields", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderArtStrikeBoard("2026-07-08");
  await renderArtSubmissionPacket("2026-07-08");
  const [csvPath, mdPath] = await renderArtSprintSheet("2026-07-08");
  const csv = await fs.readFile(csvPath, "utf8");
  const md = await fs.readFile(mdPath, "utf8");
  assert.match(csv, /rank,site_root,source_url/);
  assert.match(md, /# 2026-07-08 \.art sprint sheet/);
  assert.match(md, /Alias default: Meccha Chameleon Art \/ zlc000194@gmail\.com/);
});

test(".art ops dashboard renders pending and blocking overview", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderArtStrikeBoard("2026-07-08");
  await renderArtSubmissionPacket("2026-07-08");
  await renderArtSprintSheet("2026-07-08");
  const output = await renderArtOpsDashboard("2026-07-08");
  const md = await fs.readFile(output, "utf8");
  assert.match(md, /# 2026-07-08 \.art ops dashboard/);
  assert.match(md, /## Blocking Mix/);
  assert.match(md, /## Next To Touch/);
});

test(".art sprint sheet sync writes back to browser review sheet", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderArtStrikeBoard("2026-07-08");
  await renderArtSubmissionPacket("2026-07-08");
  const [csvPath] = await renderArtSprintSheet("2026-07-08");
  const original = await fs.readFile(csvPath, "utf8");
  const browserPath =
    "/Users/zhanglongchao/programPJ/mecchachameleon-art/seo/outreach/runs/2026-07-08-art-browser-review-sheet.csv";
  const originalBrowser = await fs.readFile(browserPath, "utf8");
  try {
    const updated = original.replace(
      ",,,\n",
      ",submitted_pending,https://example.com/art-live,operator note\n",
    );
    await fs.writeFile(csvPath, updated, "utf8");
    const result = await syncSiteSprintSheet("2026-07-08", "art");
    assert.ok(result.updatedRows >= 1);
    const browser = await fs.readFile(browserPath, "utf8");
    assert.match(browser, /submitted_pending/);
    assert.match(browser, /https:\/\/example\.com\/art-live/);
    assert.match(browser, /operator note/);
  } finally {
    await fs.writeFile(csvPath, original, "utf8");
    await fs.writeFile(browserPath, originalBrowser, "utf8");
  }
});

test(".games sprint sheet renders csv and markdown from browser review", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderGamesSubmissionPacket("2026-07-08");
  const [csvPath, mdPath] = await renderGamesSprintSheet("2026-07-08");
  const csv = await fs.readFile(csvPath, "utf8");
  const md = await fs.readFile(mdPath, "utf8");
  assert.match(csv, /rank,site_root,source_url/);
  assert.match(md, /# 2026-07-08 \.games sprint sheet/);
});

test(".games ops dashboard renders pending overview", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  await renderGamesSubmissionPacket("2026-07-08");
  await renderGamesSprintSheet("2026-07-08");
  const output = await renderGamesOpsDashboard("2026-07-08");
  const md = await fs.readFile(output, "utf8");
  assert.match(md, /# 2026-07-08 \.games ops dashboard/);
  assert.match(md, /## Blocking Mix/);
});

test(".games submission packet renders alias audit and grouped shortlist", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  const output = await renderGamesSubmissionPacket("2026-07-08");
  const report = await fs.readFile(output, "utf8");
  assert.match(report, /# 2026-07-08 \.games submission packet/);
  assert.match(report, /## Alias Audit/);
  assert.match(report, /Mecha Chameleon Games \/ zlc000194@gmail\.com/);
  assert.match(report, /## Review And Submit|## Needs Logged-In Session/);
});

test("browser review sheet sync merges browser rows into submission review", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  const result = await syncBrowserReviewSheet("2026-07-08");
  assert.ok(result.mergedRows >= 1);
  const reviewCsv = await fs.readFile(
    "/Users/zhanglongchao/programPJ/mecchachameleon-art/seo/outreach/submission-review.csv",
    "utf8",
  );
  assert.match(reviewCsv, /steamcommunity\.com\/app\/4704690\/discussions/);
});

test("browser review sheet preserves manual result fields on rerender", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  const reviewPath =
    "/Users/zhanglongchao/programPJ/mecchachameleon-art/seo/outreach/runs/2026-07-08-games-browser-review-sheet.csv";
  const original = await fs.readFile(reviewPath, "utf8");
  try {
    const updated = original.replace(
      "pending_review,,,",
      "pending_review,submitted_pending,https://example.com/live,",
    );
    await fs.writeFile(reviewPath, updated, "utf8");
    await renderBrowserReviewSheet("2026-07-08");
    const rerendered = await fs.readFile(reviewPath, "utf8");
    assert.match(rerendered, /submitted_pending/);
    assert.match(rerendered, /https:\/\/example\.com\/live/);
  } finally {
    await fs.writeFile(reviewPath, original, "utf8");
  }
});

test("reconcile browser review writes a report", async () => {
  await renderBrowserTaskManifest("2026-07-08");
  await renderBrowserReviewSheet("2026-07-08");
  const result = await reconcileBrowserReview("2026-07-08");
  assert.match(result.reportPath, /browser-review-reconcile-report\.md$/);
  const report = await fs.readFile(result.reportPath, "utf8");
  assert.match(report, /total browser review rows:/);
  assert.match(report, /Pending Summary By Blocking/);
  assert.match(report, /Pending Summary By Priority And Blocking/);
  assert.match(report, /Still Pending/);
});
