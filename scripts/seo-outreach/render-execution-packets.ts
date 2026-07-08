import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, SUBMISSION_REVIEW_FILE, TARGET_DEFAULTS } from "./config";
import { parseCsv } from "./csv";
import { buildSupportRouting } from "./routing";
import type { SubmissionReviewRow, TargetSite } from "./types";

interface ExecutionBatchRow {
  queue_date: string;
  target_site: TargetSite;
  site_root: string;
  canonical_url: string;
  submission_mode: string;
  prepared_payload_ref: string;
  blocking_step: string;
  next_human_action: string;
  status: string;
  action: string;
  contributionType: string;
  notes: string;
  draft: string;
  target_url: string;
  anchor_text: string;
  payload_path: string;
}

async function readReviewRows(): Promise<SubmissionReviewRow[]> {
  const text = await fs.readFile(SUBMISSION_REVIEW_FILE, "utf8");
  return parseCsv(text) as SubmissionReviewRow[];
}

async function readBatchRows(date: string, site: TargetSite): Promise<ExecutionBatchRow[]> {
  const filePath = path.join(OUTREACH_DIR, "runs", `${date}-${site}-execution-batch.json`);
  const text = await fs.readFile(filePath, "utf8");
  return JSON.parse(text) as ExecutionBatchRow[];
}

export async function renderExecutionPackets(date: string): Promise<string[]> {
  const [reviewRows, runDir] = await Promise.all([
    readReviewRows(),
    fs.mkdir(path.join(OUTREACH_DIR, "runs"), { recursive: true }).then(() =>
      path.join(OUTREACH_DIR, "runs"),
    ),
  ]);

  const reviewMap = new Map(
    reviewRows.map((row) => [`${row.target_site}::${row.source_url}`, row] as const),
  );

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const batchRows = await readBatchRows(date, site);
    const markdown = renderPacket(
      site,
      date,
      batchRows.map((row) => ({
        ...row,
        review: reviewMap.get(`${row.target_site}::${row.canonical_url}`),
      })),
    );
    const filePath = path.join(runDir, `${date}-${site}-execution-packet.md`);
    await fs.writeFile(filePath, `${markdown}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function renderPacket(
  site: TargetSite,
  date: string,
  rows: Array<ExecutionBatchRow & { review?: SubmissionReviewRow }>,
): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const defaults = TARGET_DEFAULTS[site];
  const lines: string[] = [
    `# ${date} ${siteLabel} execution packet`,
    "",
    `Target homepage: ${defaults.targetUrl}`,
    `Preferred anchor: ${defaults.anchorText}`,
    `Alias for required contact fields: ${defaults.alias} / ${defaults.email}`,
    "",
  ];

  if (rows.length === 0) {
    lines.push("No execution rows for this date.");
    return lines.join("\n");
  }

  const grouped = new Map<string, Array<ExecutionBatchRow & { review?: SubmissionReviewRow }>>();
  for (const row of rows) {
    const key = row.blocking_step;
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  }

  for (const step of [
    "final_submit_review",
    "login_confirm",
    "captcha",
    "publish_confirm",
    "await_publication",
    "none",
  ]) {
    const groupRows = grouped.get(step);
    if (!groupRows?.length) continue;
    lines.push(`## ${labelForBlockingStep(step)} (${groupRows.length})`);
    lines.push("");

    groupRows.forEach((row, index) => {
      const routing = buildSupportRouting(row);
      lines.push(`### ${index + 1}. ${row.site_root}`);
      lines.push("");
      lines.push(`- source: ${row.canonical_url}`);
      lines.push(`- target: ${row.target_url}`);
      lines.push(`- homepage-first target: ${routing.primaryDestination}`);
      lines.push(`- routing angle: ${routing.angle}`);
      lines.push(`- action: ${row.action}`);
      lines.push(`- contribution type: ${row.contributionType}`);
      lines.push(`- next step: ${row.next_human_action}`);
      lines.push(`- payload: ${row.payload_path || row.prepared_payload_ref}`);
      lines.push(`- submission status: ${row.review?.submission_result || row.status}`);
      if (row.review?.public_source_url) {
        lines.push(`- public source url: ${row.review.public_source_url}`);
      }
      lines.push(`- notes: ${row.notes}`);
      if (routing.supportPages.length) {
        lines.push(`- support pages:`);
        for (const page of routing.supportPages) {
          lines.push(`  - ${page.path}: ${page.reason}`);
        }
      }
      lines.push("");
      lines.push(`Draft:`);
      lines.push(`> ${row.draft}`);
      lines.push("");
      lines.push(`Privacy check:`);
      lines.push(`- alias: ${row.review?.alias_name || defaults.alias}`);
      lines.push(`- email: ${row.review?.alias_email || defaults.email}`);
      lines.push("");
    });
  }

  return lines.join("\n");
}

function labelForBlockingStep(step: string): string {
  switch (step) {
    case "final_submit_review":
      return "Review And Submit";
    case "login_confirm":
      return "Needs Logged-In Session";
    case "captcha":
      return "Captcha Gate";
    case "publish_confirm":
      return "Manual Publish";
    case "await_publication":
      return "Await Publication";
    case "none":
      return "Ready To Run";
    default:
      return step;
  }
}
