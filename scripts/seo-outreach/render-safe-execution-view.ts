import fs from "node:fs/promises";
import path from "node:path";

import { EXECUTION_QUEUE_FILE, EXECUTION_QUEUE_HEADERS, OUTREACH_DIR, RESOURCE_POOL_FILE } from "./config";
import { parseCsv, stringifyCsv } from "./csv";
import { classifyExecutionRisk, summarizeNotes } from "./lib";
import type { ExecutionQueueRow, ResourcePoolRow, TargetSite } from "./types";

type SafeBucket = "approved" | "caution" | "high_risk";

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function renderSafeExecutionView(date: string): Promise<string[]> {
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
    const siteQueueRows = queueRows
      .filter((row) => row.target_site === site)
      .map((row) => {
        const resource = resourceMap.get(`${row.target_site}::${row.canonical_url}`);
        return {
          queue: row,
          resource,
          risk: resource ? classifyExecutionRisk(resource) : ("caution" as SafeBucket),
        };
      });

    const safeQueuePath = path.join(runDir, `${date}-${site}-approved-queue.csv`);
    const approvedRows = siteQueueRows
      .filter((row) => row.risk !== "high_risk")
      .map((row) => row.queue);
    await fs.writeFile(safeQueuePath, stringifyCsv(approvedRows, EXECUTION_QUEUE_HEADERS), "utf8");

    const mdPath = path.join(runDir, `${date}-${site}-safe-execution-view.md`);
    await fs.writeFile(mdPath, `${renderMarkdown(site, date, siteQueueRows)}\n`, "utf8");
    outputs.push(mdPath, safeQueuePath);
  }

  return outputs;
}

function renderMarkdown(
  site: TargetSite,
  date: string,
  rows: Array<{ queue: ExecutionQueueRow; resource?: ResourcePoolRow; risk: SafeBucket }>,
): string {
  const lines = [`# ${date} ${site === "games" ? ".games" : ".art"} safe execution view`, ""];

  if (rows.length === 0) {
    lines.push("No queue rows for this date.");
    return lines.join("\n");
  }

  for (const bucket of ["approved", "caution", "high_risk"] as const) {
    const bucketRows = rows.filter((row) => row.risk === bucket);
    if (!bucketRows.length) continue;
    lines.push(`## ${label(bucket)} (${bucketRows.length})`);
    lines.push("");
    for (const row of bucketRows) {
      lines.push(`- ${row.queue.site_root} | ${row.queue.canonical_url}`);
      lines.push(`  mode: ${row.queue.submission_mode} | blocking: ${row.queue.blocking_step}`);
      lines.push(`  payload: ${row.queue.prepared_payload_ref}`);
      lines.push(`  notes: ${summarizeNotes(row.resource?.notes || "")}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function label(bucket: SafeBucket): string {
  switch (bucket) {
    case "approved":
      return "Approved Public Surfaces";
    case "caution":
      return "Caution";
    case "high_risk":
      return "High-Risk Or Spammy Surfaces";
  }
}
