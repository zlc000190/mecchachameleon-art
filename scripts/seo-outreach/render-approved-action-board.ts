import fs from "node:fs/promises";
import path from "node:path";

import { EXECUTION_QUEUE_FILE, OUTREACH_DIR, RESOURCE_POOL_FILE } from "./config";
import { parseCsv } from "./csv";
import { classifyExecutionRisk, summarizeNotes } from "./lib";
import { buildSupportRouting } from "./routing";
import type { ExecutionQueueRow, ResourcePoolRow, TargetSite } from "./types";

type ActionBucket = "approved" | "caution";

interface ActionBoardRow {
  queue: ExecutionQueueRow;
  resource: ResourcePoolRow;
  bucket: ActionBucket;
  routing: ReturnType<typeof buildSupportRouting>;
}

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function renderApprovedActionBoard(date: string): Promise<string[]> {
  const [queueRows, resourceRows] = await Promise.all([
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const rows = queueRows
      .filter((row) => row.target_site === site)
      .map((row) => {
        const resource = resourceMap.get(`${row.target_site}::${row.canonical_url}`);
        if (!resource || resource.ownership_class !== "third_party") {
          return undefined;
        }

        const risk = classifyExecutionRisk(resource);
        if (risk === "high_risk") {
          return undefined;
        }

        return {
          queue: row,
          resource,
          bucket: risk,
          routing: buildSupportRouting(row),
        } satisfies ActionBoardRow;
      })
      .filter((row): row is ActionBoardRow => Boolean(row))
      .sort(compareBoardRows);

    const filePath = path.join(runDir, `${date}-${site}-approved-action-board.md`);
    await fs.writeFile(filePath, `${renderMarkdown(site, date, rows)}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function compareBoardRows(a: ActionBoardRow, b: ActionBoardRow): number {
  const bucketDiff = bucketRank(a.bucket) - bucketRank(b.bucket);
  if (bucketDiff !== 0) {
    return bucketDiff;
  }

  const qualityDiff = Number(b.resource.quality_score) - Number(a.resource.quality_score);
  if (qualityDiff !== 0) {
    return qualityDiff;
  }

  const visibilityDiff =
    Number(b.resource.visibility_score) - Number(a.resource.visibility_score);
  if (visibilityDiff !== 0) {
    return visibilityDiff;
  }

  return a.queue.canonical_url.localeCompare(b.queue.canonical_url);
}

function bucketRank(bucket: ActionBucket): number {
  return bucket === "approved" ? 0 : 1;
}

function renderMarkdown(site: TargetSite, date: string, rows: ActionBoardRow[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${siteLabel} approved action board`, ""];

  if (rows.length === 0) {
    lines.push("No approved third-party execution rows for this date.");
    return lines.join("\n");
  }

  for (const bucket of ["approved", "caution"] as const) {
    const bucketRows = rows.filter((row) => row.bucket === bucket);
    if (!bucketRows.length) {
      continue;
    }

    lines.push(`## ${bucket === "approved" ? "Approved" : "Caution"} (${bucketRows.length})`);
    lines.push("");

    for (const row of bucketRows) {
      lines.push(`### ${row.resource.site_root}`);
      lines.push("");
      lines.push(`- source: ${row.queue.canonical_url}`);
      lines.push(`- quality: ${row.resource.quality_score} | visibility: ${row.resource.visibility_score}`);
      lines.push(`- mode: ${row.queue.submission_mode} | blocking: ${row.queue.blocking_step}`);
      lines.push(`- homepage target: ${row.routing.primaryDestination}`);
      lines.push(`- routing angle: ${row.routing.angle}`);
      if (row.routing.supportPages.length) {
        lines.push(`- support pages:`);
        for (const page of row.routing.supportPages) {
          lines.push(`  - ${page.path}: ${page.reason}`);
        }
      }
      lines.push(`- payload: ${row.queue.prepared_payload_ref}`);
      lines.push(`- notes: ${summarizeNotes(row.resource.notes, 4)}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}
