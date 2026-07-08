import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, SUBMISSION_REVIEW_FILE } from "./config";
import { parseCsv } from "./csv";
import { applySubmissionReview } from "./review-loop";
import { syncSiteSprintSheet } from "./sync-sprint-sheet";
import { syncBrowserReviewSheet } from "./sync-browser-review-sheet";
import type { SubmissionReviewRow } from "./types";

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

export async function reconcileBrowserReview(date: string): Promise<{
  mergedRows: number;
  syncedRows: number;
  updatedResources: number;
  updatedQueueRows: number;
  reportPath: string;
}> {
  await Promise.all([
    syncSiteSprintSheet(date, "art"),
    syncSiteSprintSheet(date, "games"),
  ]);
  const syncResult = await syncBrowserReviewSheet(date);
  const applyResult = await applySubmissionReview(date);
  const reportPath = await writeReconcileReport(date);

  return {
    mergedRows: syncResult.mergedRows,
    syncedRows: syncResult.updatedRows,
    updatedResources: applyResult.updatedResources,
    updatedQueueRows: applyResult.updatedQueueRows,
    reportPath,
  };
}

async function writeReconcileReport(date: string): Promise<string> {
  const [reviewText, browserRows] = await Promise.all([
    fs.readFile(SUBMISSION_REVIEW_FILE, "utf8"),
    readBrowserReviewRows(date),
  ]);
  const rows = (parseCsv(reviewText) as SubmissionReviewRow[]).filter(
    (row) => row.review_date === date,
  );

  const lines = [`# ${date} browser review reconcile report`, ""];
  const interesting = rows.filter(
    (row) => row.submission_result && row.submission_result !== "pending_review",
  );
  const pending = rows.filter(
    (row) => !row.submission_result || row.submission_result === "pending_review",
  );
  const browserMap = new Map(
    browserRows.map((row) => [`${row.target_site}::${row.source_url}`, row] as const),
  );
  const changed = rows.filter((row) => {
    const browser = browserMap.get(`${row.target_site}::${row.source_url}`);
    if (!browser) return false;
    const previous = browser.previous_review_status || "pending_review";
    return row.submission_result !== previous;
  });

  lines.push(`- total browser review rows: ${rows.length}`);
  lines.push(`- updated vs previous status: ${changed.length}`);
  lines.push(`- non-pending results: ${interesting.length}`);
  lines.push(`- still pending: ${pending.length}`);
  lines.push("");

  if (changed.length) {
    lines.push("## Changed Since Previous Status");
    lines.push("");
    lines.push("| Site | Source | Previous | Current | Public URL |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const row of changed) {
      const browser = browserMap.get(`${row.target_site}::${row.source_url}`);
      lines.push(
        `| ${row.site_root} | ${row.source_url} | ${browser?.previous_review_status || "pending_review"} | ${row.submission_result} | ${row.public_source_url || ""} |`,
      );
    }
    lines.push("");
  }

  if (!interesting.length) {
    lines.push("## Non-Pending Results");
    lines.push("");
    lines.push("No non-pending browser review results for this date.");
  } else {
    lines.push("## Non-Pending Results");
    lines.push("");
    lines.push("| Site | Source | Result | Public URL |");
    lines.push("| --- | --- | --- | --- |");
    for (const row of interesting) {
      lines.push(
        `| ${row.site_root} | ${row.source_url} | ${row.submission_result} | ${row.public_source_url || ""} |`,
      );
    }
    lines.push("");
  }

  if (pending.length) {
    const pendingByBlocking = aggregateCounts(
      pending,
      (row) => row.blocking_step || "unknown",
    );
    const pendingBySite = aggregateCounts(pending, (row) => row.target_site);
    const pendingByPriorityAndBlocking = aggregateCounts(
      pending,
      (row) => {
        const browser = browserMap.get(`${row.target_site}::${row.source_url}`);
        return `${browser?.priority || "other"} :: ${row.blocking_step || "unknown"}`;
      },
    );

    lines.push("## Pending Summary By Blocking");
    lines.push("");
    lines.push("| Blocking | Count |");
    lines.push("| --- | ---: |");
    for (const [blocking, count] of pendingByBlocking) {
      lines.push(`| ${blocking} | ${count} |`);
    }
    lines.push("");

    lines.push("## Pending Summary By Target Site");
    lines.push("");
    lines.push("| Target Site | Count |");
    lines.push("| --- | ---: |");
    for (const [site, count] of pendingBySite) {
      lines.push(`| ${site} | ${count} |`);
    }
    lines.push("");

    lines.push("## Pending Summary By Priority And Blocking");
    lines.push("");
    lines.push("| Priority + Blocking | Count |");
    lines.push("| --- | ---: |");
    for (const [key, count] of pendingByPriorityAndBlocking) {
      lines.push(`| ${key} | ${count} |`);
    }
    lines.push("");

    lines.push("## Still Pending");
    lines.push("");
    lines.push("| Site | Source | Blocking | Queue Status |");
    lines.push("| --- | --- | --- | --- |");
    for (const row of pending) {
      lines.push(
        `| ${row.site_root} | ${row.source_url} | ${row.blocking_step} | ${row.queue_status} |`,
      );
    }
  }

  const reportPath = path.join(OUTREACH_DIR, "runs", `${date}-browser-review-reconcile-report.md`);
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
  return reportPath;
}

function aggregateCounts<T>(rows: T[], getKey: (row: T) => string): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = getKey(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], "en"),
  );
}

async function readBrowserReviewRows(date: string): Promise<BrowserReviewSheetRow[]> {
  const rows: BrowserReviewSheetRow[] = [];
  for (const site of ["games", "art"] as const) {
    const filePath = path.join(OUTREACH_DIR, "runs", `${date}-${site}-browser-review-sheet.csv`);
    try {
      const text = await fs.readFile(filePath, "utf8");
      rows.push(...(parseCsv(text) as BrowserReviewSheetRow[]));
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") throw error;
    }
  }
  return rows;
}
