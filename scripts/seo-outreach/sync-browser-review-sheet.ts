import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, SUBMISSION_REVIEW_FILE, SUBMISSION_REVIEW_HEADERS } from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import type { SubmissionReviewRow, TargetSite } from "./types";

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

export async function syncBrowserReviewSheet(date: string): Promise<{
  mergedRows: number;
  updatedRows: number;
}> {
  const [existingReviews, browserRows] = await Promise.all([
    readCsvIfExists<SubmissionReviewRow>(SUBMISSION_REVIEW_FILE),
    readBrowserReviewRows(date),
  ]);

  const reviewMap = new Map(
    existingReviews.map((row) => [`${row.review_date}::${row.target_site}::${row.source_url}`, row] as const),
  );

  let updatedRows = 0;
  for (const row of browserRows) {
    const targetSite = normalizeTargetSite(row.target_site);
    if (!targetSite) {
      continue;
    }

    const key = `${row.queue_date}::${targetSite}::${row.source_url}`;
    const existing = reviewMap.get(key);
    const merged: SubmissionReviewRow = {
      review_date: row.queue_date,
      target_site: targetSite,
      site_root: row.site_root,
      source_url: row.source_url,
      target_url: row.target_url,
      prepared_payload_ref: row.payload_path,
      alias_name: row.alias_name,
      alias_email: row.alias_email,
      blocking_step: row.blocking_step as SubmissionReviewRow["blocking_step"],
      action: row.action,
      contribution_type: row.contribution_type,
      queue_status: row.queue_status,
      submission_result: row.submission_result || existing?.submission_result || "pending_review",
      public_source_url: row.public_source_url || existing?.public_source_url || "",
      notes: row.final_notes || existing?.notes || "",
    };

    if (!existing || JSON.stringify(existing) !== JSON.stringify(merged)) {
      updatedRows += 1;
    }
    reviewMap.set(key, merged);
  }

  const mergedRows = Array.from(reviewMap.values()).sort((a, b) =>
    `${a.review_date}::${a.target_site}::${a.source_url}`.localeCompare(
      `${b.review_date}::${b.target_site}::${b.source_url}`,
    ),
  );

  await fs.writeFile(
    SUBMISSION_REVIEW_FILE,
    stringifyCsv(mergedRows, SUBMISSION_REVIEW_HEADERS),
    "utf8",
  );

  const datedPath = path.join(OUTREACH_DIR, "runs", `${date}-submission-review.csv`);
  await fs.writeFile(datedPath, stringifyCsv(mergedRows, SUBMISSION_REVIEW_HEADERS), "utf8");

  return { mergedRows: mergedRows.length, updatedRows };
}

async function readBrowserReviewRows(date: string): Promise<BrowserReviewSheetRow[]> {
  const runsDir = path.join(OUTREACH_DIR, "runs");
  const rows: BrowserReviewSheetRow[] = [];
  for (const site of ["games", "art"] as const) {
    const filePath = path.join(runsDir, `${date}-${site}-browser-review-sheet.csv`);
    rows.push(...(await readCsvIfExists<BrowserReviewSheetRow>(filePath)));
  }
  return rows;
}

function normalizeTargetSite(value: string): TargetSite | undefined {
  if (value === "games" || value === "art") {
    return value;
  }
  return undefined;
}
