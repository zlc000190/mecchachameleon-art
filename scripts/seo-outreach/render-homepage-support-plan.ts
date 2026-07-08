import fs from "node:fs/promises";
import path from "node:path";

import { EXECUTION_QUEUE_FILE, OUTREACH_DIR } from "./config";
import { parseCsv } from "./csv";
import { buildSupportRouting, type SupportPage } from "./routing";
import type { ExecutionQueueRow, TargetSite } from "./types";

interface SupportPlanRow {
  queue: ExecutionQueueRow;
  primaryDestination: string;
  supportPages: SupportPage[];
  angle: string;
}

async function readQueueRows(): Promise<ExecutionQueueRow[]> {
  const text = await fs.readFile(EXECUTION_QUEUE_FILE, "utf8");
  return parseCsv(text) as ExecutionQueueRow[];
}

export async function renderHomepageSupportPlan(date: string): Promise<string[]> {
  const queueRows = await readQueueRows();
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const siteRows = queueRows
      .filter((row) => row.target_site === site)
      .map((row) => buildSupportPlanRow(row));
    const filePath = path.join(runDir, `${date}-${site}-homepage-support-plan.md`);
    await fs.writeFile(filePath, `${renderMarkdown(site, date, siteRows)}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function buildSupportPlanRow(row: ExecutionQueueRow): SupportPlanRow {
  const routing = buildSupportRouting(row);
  return {
    queue: row,
    primaryDestination: routing.primaryDestination,
    supportPages: routing.supportPages,
    angle: routing.angle,
  };
}

function renderMarkdown(site: TargetSite, date: string, rows: SupportPlanRow[]): string {
  const title = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${title} homepage support plan`, ""];

  if (rows.length === 0) {
    lines.push("No queue rows for this date.");
    return lines.join("\n");
  }

  for (const row of rows) {
    lines.push(`## ${row.queue.site_root}`);
    lines.push("");
    lines.push(`- source: ${row.queue.canonical_url}`);
    lines.push(`- homepage-first destination: ${row.primaryDestination}`);
    lines.push(`- angle: ${row.angle}`);
    lines.push(`- payload: ${row.queue.prepared_payload_ref}`);
    lines.push(`- blocking: ${row.queue.blocking_step}`);
    lines.push(`- support pages:`);
    for (const page of row.supportPages) {
      lines.push(`  - ${page.label} -> ${page.path}: ${page.reason}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
