import fs from "node:fs/promises";
import path from "node:path";

import {
  EXECUTION_QUEUE_FILE,
  EXECUTION_QUEUE_HEADERS,
  IMPORT_DIR,
  OUTREACH_DIR,
  RESOURCE_POOL_FILE,
  RESOURCE_POOL_HEADERS,
  SUBMISSION_REVIEW_FILE,
  SUBMISSION_REVIEW_HEADERS,
  TARGET_DEFAULTS,
} from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import { enrichQueueRow } from "./playbooks";
import type {
  ExecutionQueueRow,
  ResourcePoolRow,
  SubmissionReviewRow,
} from "./types";

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return parseCsv(text) as T[];
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    throw error;
  }
}

export async function prepareSubmissionReview(date: string): Promise<string> {
  const [queueRows, resourceRows, existingReviews] = await Promise.all([
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
    readCsv<SubmissionReviewRow>(SUBMISSION_REVIEW_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );
  const existingMap = new Map(
    existingReviews.map((row) => [
      `${row.review_date}::${row.target_site}::${row.source_url}`,
      row,
    ]),
  );

  const rows: SubmissionReviewRow[] = [];
  for (const queueRow of queueRows) {
    const key = `${queueRow.target_site}::${queueRow.canonical_url}`;
    const resource = resourceMap.get(key);
    if (!resource) continue;
    const enriched = enrichQueueRow(queueRow, resource);
    const reviewKey = `${date}::${queueRow.target_site}::${queueRow.canonical_url}`;
    const existing = existingMap.get(reviewKey);
    rows.push(
      existing
        ? {
            ...existing,
            site_root: queueRow.site_root,
            target_url: resource.target_url,
            prepared_payload_ref:
              existing.prepared_payload_ref || queueRow.prepared_payload_ref,
            alias_name: existing.alias_name || TARGET_DEFAULTS[queueRow.target_site].alias,
            alias_email: existing.alias_email || TARGET_DEFAULTS[queueRow.target_site].email,
            blocking_step: queueRow.blocking_step,
            action: enriched.action,
            contribution_type: enriched.contributionType,
            queue_status: queueRow.status,
            notes: existing.notes || `Review fields before final submit. ${enriched.notes}`,
          }
        : {
            review_date: date,
            target_site: queueRow.target_site,
            site_root: queueRow.site_root,
            source_url: queueRow.canonical_url,
            target_url: resource.target_url,
            prepared_payload_ref: queueRow.prepared_payload_ref,
            alias_name: TARGET_DEFAULTS[queueRow.target_site].alias,
            alias_email: TARGET_DEFAULTS[queueRow.target_site].email,
            blocking_step: queueRow.blocking_step,
            action: enriched.action,
            contribution_type: enriched.contributionType,
            queue_status: queueRow.status,
            submission_result: "pending_review",
            public_source_url: "",
            notes: `Review fields before final submit. ${enriched.notes}`,
          },
    );
  }

  await fs.writeFile(
    SUBMISSION_REVIEW_FILE,
    stringifyCsv(rows, SUBMISSION_REVIEW_HEADERS),
    "utf8",
  );

  const runsDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runsDir, { recursive: true });
  const datedPath = path.join(runsDir, `${date}-submission-review.csv`);
  await fs.writeFile(datedPath, stringifyCsv(rows, SUBMISSION_REVIEW_HEADERS), "utf8");
  return datedPath;
}

export async function applySubmissionReview(date?: string): Promise<{
  updatedResources: number;
  updatedQueueRows: number;
}> {
  const [reviews, resourceRows, queueRows] = await Promise.all([
    readCsv<SubmissionReviewRow>(SUBMISSION_REVIEW_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
  ]);

  const relevantReviews = reviews.filter((row) => {
    if (date && row.review_date !== date) return false;
    return row.submission_result !== "pending_review" && row.submission_result !== "";
  });

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );
  const queueMap = new Map(
    queueRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  let updatedResources = 0;
  let updatedQueueRows = 0;

  for (const review of relevantReviews) {
    const key = `${review.target_site}::${review.source_url}`;
    const resource = resourceMap.get(key);
    if (resource) {
      resource.status = mapReviewResultToResourceStatus(review.submission_result);
      resource.last_checked_at = review.review_date;
      resource.notes = [resource.notes, review.notes, review.public_source_url]
        .filter(Boolean)
        .join(" | ");
      updatedResources += 1;
    }

    const queueRow = queueMap.get(key);
    if (queueRow) {
      queueRow.status = mapReviewResultToQueueStatus(review.submission_result);
      updatedQueueRows += 1;
    }
  }

  await Promise.all([
    fs.writeFile(
      RESOURCE_POOL_FILE,
      stringifyCsv(Array.from(resourceMap.values()), RESOURCE_POOL_HEADERS),
      "utf8",
    ),
    fs.writeFile(
      EXECUTION_QUEUE_FILE,
      stringifyCsv(Array.from(queueMap.values()), EXECUTION_QUEUE_HEADERS),
      "utf8",
    ),
  ]);

  return { updatedResources, updatedQueueRows };
}

function mapReviewResultToResourceStatus(result: string): ResourcePoolRow["status"] {
  switch (result) {
    case "submitted":
    case "submitted_pending":
      return "submitted";
    case "live_visible":
      return "live_visible";
    case "live_visible_follow_like":
      return "live_visible_follow_like";
    case "live_visible_nofollow":
      return "live_visible_nofollow";
    case "blocked":
      return "blocked";
    case "skipped":
      return "qualified";
    default:
      return "queued";
  }
}

function mapReviewResultToQueueStatus(result: string): string {
  switch (result) {
    case "submitted":
    case "submitted_pending":
      return "submitted_manual";
    case "live_visible":
    case "live_visible_follow_like":
    case "live_visible_nofollow":
      return "verified_visible";
    case "blocked":
      return "blocked_manual";
    case "skipped":
      return "skipped_manual";
    default:
      return "ready_semi_auto";
  }
}
