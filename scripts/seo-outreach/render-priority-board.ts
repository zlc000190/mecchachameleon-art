import fs from "node:fs/promises";
import path from "node:path";

import {
  EXECUTION_QUEUE_FILE,
  OUTREACH_DIR,
  RESOURCE_POOL_FILE,
  SUBMISSION_REVIEW_FILE,
  VERIFICATION_FILE,
} from "./config";
import { parseCsv } from "./csv";
import type {
  ExecutionQueueRow,
  ResourcePoolRow,
  SubmissionReviewRow,
  TargetSite,
  VisibilityVerificationRow,
} from "./types";

type PriorityBucket =
  | "do_now"
  | "needs_login"
  | "captcha_hold"
  | "editorial_monitor";

interface PriorityRow {
  targetSite: TargetSite;
  siteRoot: string;
  sourceUrl: string;
  targetUrl: string;
  payloadRef: string;
  bucket: PriorityBucket;
  priorityScore: number;
  blockingStep: string;
  action: string;
  submissionResult: string;
  latestVisibility: string;
  notes: string;
}

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function renderPriorityBoard(date: string): Promise<string[]> {
  const [resourceRows, queueRows, reviewRows, verificationRows] = await Promise.all([
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<SubmissionReviewRow>(SUBMISSION_REVIEW_FILE),
    readCsv<VisibilityVerificationRow>(VERIFICATION_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );
  const verificationMap = new Map<string, VisibilityVerificationRow>();
  for (const row of verificationRows) {
    const key = `${row.target_site}::${row.source_url}`;
    const existing = verificationMap.get(key);
    if (!existing || existing.verified_at <= row.verified_at) {
      verificationMap.set(key, row);
    }
  }

  const filteredReviews = reviewRows.filter((row) => row.review_date === date);
  const bySiteOutputs: string[] = [];
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  for (const site of ["games", "art"] as TargetSite[]) {
    const rows: PriorityRow[] = filteredReviews
      .filter((row) => row.target_site === site)
      .map((review) => {
        const key = `${review.target_site}::${review.source_url}`;
        const resource = resourceMap.get(key);
        const verification = verificationMap.get(key);
        const bucket = classifyBucket(review, resource, verification);
        return {
          targetSite: site,
          siteRoot: review.site_root,
          sourceUrl: review.source_url,
          targetUrl: review.target_url,
          payloadRef: review.prepared_payload_ref,
          bucket,
          priorityScore: scorePriority(review, resource, verification, bucket),
          blockingStep: review.blocking_step,
          action: review.action,
          submissionResult: review.submission_result,
          latestVisibility: verification?.visibility_status ?? "unverified",
          notes: review.notes,
        };
      })
      .sort((a, b) =>
        a.bucket === b.bucket
          ? b.priorityScore - a.priorityScore || a.siteRoot.localeCompare(b.siteRoot)
          : bucketRank(a.bucket) - bucketRank(b.bucket),
      );

    const markdown = renderMarkdown(site, date, rows);
    const mdPath = path.join(runDir, `${date}-${site}-priority-board.md`);
    await fs.writeFile(mdPath, `${markdown}\n`, "utf8");
    bySiteOutputs.push(mdPath);
  }

  return bySiteOutputs;
}

function classifyBucket(
  review: SubmissionReviewRow,
  resource?: ResourcePoolRow,
  verification?: VisibilityVerificationRow,
): PriorityBucket {
  if (
    verification?.visibility_status === "live_visible" ||
    verification?.visibility_status === "live_visible_follow_like" ||
    verification?.visibility_status === "live_visible_nofollow"
  ) {
    return "editorial_monitor";
  }

  const notes = `${review.notes} ${resource?.notes ?? ""}`.toLowerCase();
  if (review.blocking_step === "captcha") {
    return "captcha_hold";
  }
  if (review.blocking_step === "login_confirm") {
    return "needs_login";
  }
  if (notes.includes("editorial") || notes.includes("monitor")) {
    return "editorial_monitor";
  }
  return "do_now";
}

function scorePriority(
  review: SubmissionReviewRow,
  resource: ResourcePoolRow | undefined,
  verification: VisibilityVerificationRow | undefined,
  bucket: PriorityBucket,
): number {
  const base =
    Number(resource?.quality_score ?? "0") * 3 +
    Number(resource?.topical_score ?? "0") * 2 +
    Number(resource?.visibility_score ?? "0");
  const frictionPenalty =
    bucket === "captcha_hold" ? 4 : bucket === "needs_login" ? 2 : bucket === "editorial_monitor" ? 3 : 0;
  const visibilityPenalty =
    verification?.visibility_status === "blocked"
      ? 3
      : verification?.visibility_status === "not_visible"
        ? 1
        : 0;
  return base - frictionPenalty - visibilityPenalty;
}

function bucketRank(bucket: PriorityBucket): number {
  switch (bucket) {
    case "do_now":
      return 0;
    case "needs_login":
      return 1;
    case "captcha_hold":
      return 2;
    case "editorial_monitor":
      return 3;
  }
}

function renderMarkdown(
  site: TargetSite,
  date: string,
  rows: PriorityRow[],
): string {
  const title = site === "games" ? ".games" : ".art";
  const lines = [`# ${date} ${title} priority board`, ""];

  if (rows.length === 0) {
    lines.push("No review rows for this date.");
    return lines.join("\n");
  }

  for (const bucket of ["do_now", "needs_login", "captcha_hold", "editorial_monitor"] as const) {
    const bucketRows = rows.filter((row) => row.bucket === bucket);
    if (bucketRows.length === 0) continue;
    lines.push(`## ${labelForBucket(bucket)}`);
    lines.push("");
    for (const row of bucketRows) {
      lines.push(`- ${row.siteRoot} | score ${row.priorityScore} | ${row.action}`);
      lines.push(`  source: ${row.sourceUrl}`);
      lines.push(`  target: ${row.targetUrl}`);
      lines.push(`  payload: ${row.payloadRef || "(missing payload)"}`);
      lines.push(`  blocking: ${row.blockingStep} | visibility: ${row.latestVisibility}`);
      lines.push(`  notes: ${row.notes}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function labelForBucket(bucket: PriorityBucket): string {
  switch (bucket) {
    case "do_now":
      return "Do Now";
    case "needs_login":
      return "Needs Login";
    case "captcha_hold":
      return "Captcha Hold";
    case "editorial_monitor":
      return "Monitor Only";
  }
}
