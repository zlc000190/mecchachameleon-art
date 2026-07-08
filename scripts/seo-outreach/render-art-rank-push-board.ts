import fs from "node:fs/promises";
import path from "node:path";

import { EXECUTION_QUEUE_FILE, OUTREACH_DIR, RESOURCE_POOL_FILE } from "./config";
import { parseCsv } from "./csv";
import {
  citationMultiplierScore,
  classifyExecutionRisk,
  summarizeNotes,
} from "./lib";
import { buildSupportRouting } from "./routing";
import type { ExecutionQueueRow, ResourcePoolRow } from "./types";

interface RankPushRow {
  queue: ExecutionQueueRow;
  resource: ResourcePoolRow;
  echoScore: number;
  risk: ReturnType<typeof classifyExecutionRisk>;
  routing: ReturnType<typeof buildSupportRouting>;
}

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function renderArtRankPushBoard(date: string): Promise<string> {
  const [queueRows, resourceRows] = await Promise.all([
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  const rows = queueRows
    .filter((row) => row.target_site === "art")
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
        echoScore: citationMultiplierScore(resource),
        risk,
        routing: buildSupportRouting(row),
      } satisfies RankPushRow;
    })
    .filter((row): row is RankPushRow => Boolean(row))
    .sort(compareRows);

  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const filePath = path.join(runDir, `${date}-art-rank-push-board.md`);
  await fs.writeFile(filePath, `${renderMarkdown(date, rows)}\n`, "utf8");
  return filePath;
}

function compareRows(a: RankPushRow, b: RankPushRow): number {
  const echoDiff = b.echoScore - a.echoScore;
  if (echoDiff !== 0) {
    return echoDiff;
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

  const blockingDiff = blockingRank(a.queue.blocking_step) - blockingRank(b.queue.blocking_step);
  if (blockingDiff !== 0) {
    return blockingDiff;
  }

  return a.queue.canonical_url.localeCompare(b.queue.canonical_url);
}

function blockingRank(blockingStep: string): number {
  switch (blockingStep) {
    case "login_confirm":
      return 0;
    case "final_submit_review":
      return 1;
    case "captcha":
      return 2;
    default:
      return 3;
  }
}

function bandLabel(score: number): string {
  if (score >= 5) return "Amplifier";
  if (score >= 4) return "Momentum";
  return "Foundation";
}

function renderMarkdown(date: string, rows: RankPushRow[]): string {
  const lines = [`# ${date} .art rank push board`, ""];

  if (!rows.length) {
    lines.push("No qualified third-party .art opportunities for this date.");
    return lines.join("\n");
  }

  const banded = new Map<string, RankPushRow[]>();
  for (const row of rows) {
    const label = bandLabel(row.echoScore);
    const existing = banded.get(label) ?? [];
    existing.push(row);
    banded.set(label, existing);
  }

  lines.push(
    "Focus this board on public-visible third-party pages most likely to trigger secondary references, reposts, or follow-on mentions.",
  );
  lines.push("");

  for (const label of ["Amplifier", "Momentum", "Foundation"] as const) {
    const bandRows = banded.get(label) ?? [];
    if (!bandRows.length) continue;

    lines.push(`## ${label} (${bandRows.length})`);
    lines.push("");

    for (const row of bandRows) {
      lines.push(`### ${row.resource.site_root}`);
      lines.push("");
      lines.push(`- source: ${row.queue.canonical_url}`);
      lines.push(`- echo potential: ${row.echoScore}/5`);
      lines.push(
        `- quality: ${row.resource.quality_score} | visibility: ${row.resource.visibility_score} | risk: ${row.risk}`,
      );
      lines.push(`- blocking: ${row.queue.blocking_step}`);
      lines.push(`- homepage target: ${row.routing.primaryDestination}`);
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
