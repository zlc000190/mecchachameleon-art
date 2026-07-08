import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR } from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import type { TargetSite } from "./types";

interface BrowserTaskRow {
  queueDate: string;
  targetSite: TargetSite;
  siteRoot: string;
  sourceUrl: string;
  targetUrl: string;
  homepageFirstTarget: string;
  supportPages: Array<{ path: string; reason: string }>;
  routingAngle: string;
  blockingStep: string;
  nextHumanAction: string;
  submissionMode: string;
  action: string;
  contributionType: string;
  aliasName: string;
  aliasEmail: string;
  payloadPath: string;
  queueStatus: string;
  reviewStatus: string;
  priority: "p1" | "p2";
  notes: string;
}

interface BrowserReviewSheetRow {
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

const BROWSER_REVIEW_HEADERS: Array<keyof BrowserReviewSheetRow> = [
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

export async function renderBrowserReviewSheet(date: string): Promise<string[]> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const manifestPath = path.join(runDir, `${date}-${site}-browser-task-manifest.json`);
    const tasks = JSON.parse(await fs.readFile(manifestPath, "utf8")) as BrowserTaskRow[];
    const csvPath = path.join(runDir, `${date}-${site}-browser-review-sheet.csv`);
    const mdPath = path.join(runDir, `${date}-${site}-browser-review-sheet.md`);
    const existingRows = await readCsvIfExists<BrowserReviewSheetRow>(csvPath);
    const existingMap = new Map(
      existingRows.map((row) => [`${row.queue_date}::${row.target_site}::${row.source_url}`, row] as const),
    );
    const rows = tasks.map((task) => toReviewRow(task, existingMap));

    await fs.writeFile(csvPath, stringifyCsv(rows, BROWSER_REVIEW_HEADERS), "utf8");
    await fs.writeFile(mdPath, `${renderMarkdown(site, date, rows)}\n`, "utf8");
    outputs.push(csvPath, mdPath);
  }

  return outputs;
}

async function readCsvIfExists<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return parseCsv(text) as T[];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function toReviewRow(
  task: BrowserTaskRow,
  existingMap: Map<string, BrowserReviewSheetRow>,
): BrowserReviewSheetRow {
  const existing = existingMap.get(`${task.queueDate}::${task.targetSite}::${task.sourceUrl}`);
  return {
    queue_date: task.queueDate,
    priority: task.priority.toUpperCase(),
    target_site: task.targetSite,
    site_root: task.siteRoot,
    source_url: task.sourceUrl,
    blocking_step: task.blockingStep,
    next_human_action: task.nextHumanAction,
    action: task.action,
    contribution_type: task.contributionType,
    alias_name: task.aliasName,
    alias_email: task.aliasEmail,
    target_url: task.targetUrl,
    homepage_first_target: task.homepageFirstTarget,
    support_pages: task.supportPages.map((page) => page.path).join(" | "),
    payload_path: task.payloadPath,
    queue_status: task.queueStatus,
    previous_review_status: task.reviewStatus,
    submission_result: existing?.submission_result || "",
    public_source_url: existing?.public_source_url || "",
    final_notes: existing?.final_notes || task.notes,
  };
}

function renderMarkdown(site: TargetSite, date: string, rows: BrowserReviewSheetRow[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${siteLabel} browser review sheet`, ""];

  if (rows.length === 0) {
    lines.push("No browser review rows for this date.");
    return lines.join("\n");
  }

  lines.push("| Priority | Root | Blocking | Action | Source | Payload |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(
      `| ${row.priority} | ${row.site_root} | ${row.blocking_step} | ${row.action} | ${row.source_url} | ${row.payload_path} |`,
    );
  }
  lines.push("");

  return lines.join("\n");
}
