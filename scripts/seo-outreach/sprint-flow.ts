import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, TARGET_DEFAULTS } from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import type { TargetSite } from "./types";

export interface SprintRow {
  rank: string;
  site_root: string;
  source_url: string;
  strike_score: string;
  echo_potential: string;
  blocking_step: string;
  action: string;
  alias_name: string;
  alias_email: string;
  homepage_target: string;
  support_pages: string;
  payload_path: string;
  execution_status: string;
  public_source_url: string;
  operator_notes: string;
}

export interface BrowserReviewSheetRow {
  queue_date: string;
  priority: string;
  target_site: string;
  site_root: string;
  source_url: string;
  blocking_step: string;
  next_human_action: string;
  action: string;
  contribution_type: string;
  alias_name: string;
  alias_email: string;
  target_url: string;
  homepage_first_target: string;
  support_pages: string;
  payload_path: string;
  queue_status: string;
  previous_review_status: string;
  submission_result: string;
  public_source_url: string;
  final_notes: string;
}

export const SPRINT_HEADERS: Array<keyof SprintRow> = [
  "rank",
  "site_root",
  "source_url",
  "strike_score",
  "echo_potential",
  "blocking_step",
  "action",
  "alias_name",
  "alias_email",
  "homepage_target",
  "support_pages",
  "payload_path",
  "execution_status",
  "public_source_url",
  "operator_notes",
];

export const BROWSER_REVIEW_HEADERS: Array<keyof BrowserReviewSheetRow> = [
  "queue_date",
  "priority",
  "target_site",
  "site_root",
  "source_url",
  "blocking_step",
  "next_human_action",
  "action",
  "contribution_type",
  "alias_name",
  "alias_email",
  "target_url",
  "homepage_first_target",
  "support_pages",
  "payload_path",
  "queue_status",
  "previous_review_status",
  "submission_result",
  "public_source_url",
  "final_notes",
];

export async function readCsvIfExists<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return parseCsv(text) as T[];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    throw error;
  }
}

export function sprintSheetPaths(date: string, site: TargetSite): { csvPath: string; mdPath: string } {
  return {
    csvPath: path.join(OUTREACH_DIR, "runs", `${date}-${site}-sprint-sheet.csv`),
    mdPath: path.join(OUTREACH_DIR, "runs", `${date}-${site}-sprint-sheet.md`),
  };
}

export function browserReviewSheetPath(date: string, site: TargetSite): string {
  return path.join(OUTREACH_DIR, "runs", `${date}-${site}-browser-review-sheet.csv`);
}

export async function writeSprintSheet(
  date: string,
  site: TargetSite,
  baseRows: Array<Omit<SprintRow, "execution_status" | "public_source_url" | "operator_notes">>,
): Promise<string[]> {
  const { csvPath, mdPath } = sprintSheetPaths(date, site);
  const existing = await readCsvIfExists<SprintRow>(csvPath);
  const existingMap = new Map(existing.map((row) => [row.source_url, row] as const));

  const rows = baseRows.map((row) => ({
    ...row,
    execution_status: existingMap.get(row.source_url)?.execution_status || "",
    public_source_url: existingMap.get(row.source_url)?.public_source_url || "",
    operator_notes: existingMap.get(row.source_url)?.operator_notes || "",
  }));

  await fs.writeFile(csvPath, stringifyCsv(rows, SPRINT_HEADERS), "utf8");
  await fs.writeFile(mdPath, `${renderSprintMarkdown(date, site, rows)}\n`, "utf8");
  return [csvPath, mdPath];
}

export function renderSprintMarkdown(date: string, site: TargetSite, rows: SprintRow[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const lines = [`# ${date} ${siteLabel} sprint sheet`, ""];
  lines.push("| Rank | Root | Blocking | Action | Status | Public URL |");
  lines.push("| ---: | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(
      `| ${row.rank} | ${row.site_root} | ${row.blocking_step} | ${row.action} | ${row.execution_status} | ${row.public_source_url} |`,
    );
  }
  lines.push("");
  lines.push(
    `Alias default: ${TARGET_DEFAULTS[site].alias} / ${TARGET_DEFAULTS[site].email}`,
  );
  return lines.join("\n");
}

export async function syncSprintSheet(
  date: string,
  site: TargetSite,
): Promise<{ updatedRows: number }> {
  const sprintPath = sprintSheetPaths(date, site).csvPath;
  const browserPath = browserReviewSheetPath(date, site);
  const [sprintRows, browserRows] = await Promise.all([
    readCsvIfExists<SprintRow>(sprintPath),
    readCsvIfExists<BrowserReviewSheetRow>(browserPath),
  ]);

  const sprintMap = new Map(sprintRows.map((row) => [row.source_url, row] as const));
  let updatedRows = 0;
  const merged = browserRows.map((row) => {
    const sprint = sprintMap.get(row.source_url);
    if (!sprint) return row;
    const next: BrowserReviewSheetRow = {
      ...row,
      submission_result: sprint.execution_status || row.submission_result,
      public_source_url: sprint.public_source_url || row.public_source_url,
      final_notes: sprint.operator_notes || row.final_notes,
    };
    if (JSON.stringify(next) !== JSON.stringify(row)) {
      updatedRows += 1;
    }
    return next;
  });

  await fs.writeFile(browserPath, stringifyCsv(merged, BROWSER_REVIEW_HEADERS), "utf8");
  return { updatedRows };
}

export async function renderOpsDashboard(date: string, site: TargetSite): Promise<string> {
  const rows = await readCsvIfExists<SprintRow>(sprintSheetPaths(date, site).csvPath);
  const filePath = path.join(OUTREACH_DIR, "runs", `${date}-${site}-ops-dashboard.md`);
  await fs.writeFile(filePath, `${renderOpsMarkdown(date, site, rows)}\n`, "utf8");
  return filePath;
}

function renderOpsMarkdown(date: string, site: TargetSite, rows: SprintRow[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const pending = rows.filter((row) => !row.execution_status && !row.public_source_url);
  const inFlight = rows.filter(
    (row) =>
      Boolean(row.execution_status) &&
      !["live_visible", "live_visible_follow_like", "live_visible_nofollow", "success"].includes(
        row.execution_status,
      ),
  );
  const complete = rows.filter(
    (row) =>
      ["live_visible", "live_visible_follow_like", "live_visible_nofollow", "success"].includes(
        row.execution_status,
      ) || Boolean(row.public_source_url),
  );
  const lines = [`# ${date} ${siteLabel} ops dashboard`, ""];
  lines.push(`- sprint rows: ${rows.length}`);
  lines.push(`- pending: ${pending.length}`);
  lines.push(`- in flight: ${inFlight.length}`);
  lines.push(`- complete: ${complete.length}`);
  lines.push("");
  lines.push("## Blocking Mix");
  lines.push("");
  lines.push("| Blocking | Count |");
  lines.push("| --- | ---: |");
  for (const [key, count] of aggregate(rows, (row) => row.blocking_step || "unknown")) {
    lines.push(`| ${key} | ${count} |`);
  }
  lines.push("");
  lines.push("## Status Mix");
  lines.push("");
  lines.push("| State | Count |");
  lines.push("| --- | ---: |");
  for (const [key, count] of [
    ["pending", pending.length],
    ["in_flight", inFlight.length],
    ["complete", complete.length],
  ] as const) {
    lines.push(`| ${key} | ${count} |`);
  }
  lines.push("");
  lines.push("## Next To Touch");
  lines.push("");
  if (!pending.length) {
    lines.push("No untouched sprint rows.");
  } else {
    pending.slice(0, 5).forEach((row) => {
      lines.push(`- #${row.rank} ${row.site_root} | ${row.blocking_step} | ${row.action}`);
    });
  }
  lines.push("");
  lines.push("## In Flight");
  lines.push("");
  if (!inFlight.length) {
    lines.push("No in-flight sprint rows.");
  } else {
    inFlight.forEach((row) => {
      lines.push(
        `- #${row.rank} ${row.site_root} | ${row.execution_status} | ${row.public_source_url || "(no public URL yet)"} | ${row.operator_notes || ""}`,
      );
    });
  }
  lines.push("");
  lines.push("## Completed / Public");
  lines.push("");
  if (!complete.length) {
    lines.push("No completed sprint rows yet.");
  } else {
    complete.forEach((row) => {
      lines.push(
        `- #${row.rank} ${row.site_root} | ${row.execution_status || "public_url_recorded"} | ${row.public_source_url}`,
      );
    });
  }
  return lines.join("\n");
}

export function buildSprintRowsFromBrowserReview(
  site: TargetSite,
  rows: BrowserReviewSheetRow[],
  scores?: Map<string, { strikeScore?: string; echoPotential?: string }>,
): Array<Omit<SprintRow, "execution_status" | "public_source_url" | "operator_notes">> {
  const defaults = TARGET_DEFAULTS[site];
  return rows.map((row, index) => {
    const score = scores?.get(row.source_url);
    const derived = deriveFallbackScores(row);
    return {
      rank: String(index + 1),
      site_root: row.site_root,
      source_url: row.source_url,
      strike_score: score?.strikeScore || String(derived.strikeScore),
      echo_potential: score?.echoPotential || `${derived.echoPotential}/5`,
      blocking_step: row.blocking_step,
      action: row.action,
      alias_name: row.alias_name || defaults.alias,
      alias_email: row.alias_email || defaults.email,
      homepage_target: row.homepage_first_target || defaults.targetUrl,
      support_pages: row.support_pages || "",
      payload_path: row.payload_path || "",
    };
  });
}

function deriveFallbackScores(row: BrowserReviewSheetRow): {
  strikeScore: number;
  echoPotential: number;
} {
  const priorityBoost = row.priority.toLowerCase() === "p1" ? 6 : 2;
  const blockingPenalty =
    row.blocking_step === "login_confirm"
      ? 2
      : row.blocking_step === "final_submit_review"
        ? 0
        : row.blocking_step === "captcha"
          ? 6
          : 4;
  const root = row.site_root.toLowerCase();
  const echoPotential = new Set([
    "steamcommunity.com",
    "www.igdb.com",
    "www.backloggd.com",
    "www.mobygames.com",
    "www.steamgriddb.com",
  ]).has(root)
    ? 4
    : 3;
  const strikeScore = echoPotential * 7 + priorityBoost - blockingPenalty;
  return { strikeScore, echoPotential };
}

function aggregate<T>(rows: T[], getKey: (row: T) => string): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "en"));
}
