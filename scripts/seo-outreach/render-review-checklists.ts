import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, SUBMISSION_REVIEW_FILE } from "./config";
import { parseCsv } from "./csv";
import type { SubmissionReviewRow, TargetSite } from "./types";

async function readReviewRows(): Promise<SubmissionReviewRow[]> {
  const text = await fs.readFile(SUBMISSION_REVIEW_FILE, "utf8");
  return parseCsv(text) as SubmissionReviewRow[];
}

export async function renderReviewChecklists(date: string): Promise<string[]> {
  const rows = (await readReviewRows()).filter((row) => row.review_date === date);
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const siteRows = rows.filter((row) => row.target_site === site);
    const content = renderChecklist(site, date, siteRows);
    const filePath = path.join(runDir, `${date}-${site}-review-checklist.md`);
    await fs.writeFile(filePath, `${content}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function renderChecklist(
  site: TargetSite,
  date: string,
  rows: SubmissionReviewRow[],
): string {
  const title = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${title} review checklist`, ""];

  if (rows.length === 0) {
    lines.push("No pending review rows for this date.");
    return lines.join("\n");
  }

  rows.forEach((row, index) => {
    lines.push(`## ${index + 1}. ${row.site_root}`);
    lines.push(``);
    lines.push(`- source: ${row.source_url}`);
    lines.push(`- target: ${row.target_url}`);
    lines.push(`- payload: ${row.prepared_payload_ref || "(missing payload)"}`);
    lines.push(`- alias: ${row.alias_name} / ${row.alias_email}`);
    lines.push(`- blocking step: ${row.blocking_step}`);
    lines.push(`- action: ${row.action}`);
    lines.push(`- contribution type: ${row.contribution_type}`);
    lines.push(`- queue status: ${row.queue_status}`);
    lines.push(`- submission result: ${row.submission_result}`);
    lines.push(`- public source url: ${row.public_source_url || "(fill after publish)"}`);
    lines.push(`- notes: ${row.notes}`);
    lines.push(``);
    lines.push(`Checklist:`);
    lines.push(`- [ ] Confirm page is the intended public contribution surface`);
    lines.push(`- [ ] Check populated alias/contact fields before submit`);
    lines.push(`- [ ] Complete the blocking step if needed`);
    lines.push(`- [ ] Submit or skip with a clear reason`);
    lines.push(`- [ ] Fill submission_result and public_source_url back into submission-review.csv`);
    lines.push(``);
  });

  return lines.join("\n");
}
