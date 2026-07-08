import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, RESOURCE_POOL_FILE } from "./config";
import { parseCsv } from "./csv";
import { citationMultiplierScore } from "./lib";
import type { ResourcePoolRow, TargetSite } from "./types";

interface BrowserTaskRow {
  queueDate: string;
  targetSite: TargetSite;
  siteRoot: string;
  sourceUrl: string;
  targetUrl: string;
  homepageFirstTarget: string;
  supportPages: Array<{ path: string; reason: string }>;
  routingAngle: string;
  blockingStep: string;
  nextHumanAction: string;
  submissionMode: string;
  action: string;
  contributionType: string;
  aliasName: string;
  aliasEmail: string;
  payloadPath: string;
  queueStatus: string;
  reviewStatus: string;
  priority: "p1" | "p2";
  notes: string;
}

interface StrikeRow {
  siteRoot: string;
  sourceUrl: string;
  strikeScore: number;
  echoScore: number;
  priority: "p1" | "p2";
  blockingStep: string;
  action: string;
  nextHumanAction: string;
  homepageFirstTarget: string;
  supportPages: string[];
  payloadPath: string;
}

async function readResourceRows(): Promise<ResourcePoolRow[]> {
  const text = await fs.readFile(RESOURCE_POOL_FILE, "utf8");
  return parseCsv(text) as ResourcePoolRow[];
}

export async function renderArtStrikeBoard(date: string): Promise<string> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  const manifestPath = path.join(runDir, `${date}-art-browser-task-manifest.json`);
  const tasks = JSON.parse(await fs.readFile(manifestPath, "utf8")) as BrowserTaskRow[];
  const resources = await readResourceRows();
  const resourceMap = new Map(
    resources.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  const strikeRows = tasks
    .map((task) => toStrikeRow(task, resourceMap.get(`art::${task.sourceUrl}`)))
    .sort((a, b) => b.strikeScore - a.strikeScore || a.sourceUrl.localeCompare(b.sourceUrl))
    .slice(0, 10);

  await fs.mkdir(runDir, { recursive: true });
  const filePath = path.join(runDir, `${date}-art-strike-board.md`);
  await fs.writeFile(filePath, `${renderMarkdown(date, strikeRows)}\n`, "utf8");
  return filePath;
}

function toStrikeRow(task: BrowserTaskRow, resource?: ResourcePoolRow): StrikeRow {
  const echoScore = resource ? citationMultiplierScore(resource) : 2;
  const quality = Number(resource?.quality_score || "0");
  const visibility = Number(resource?.visibility_score || "0");
  const priorityBoost = task.priority === "p1" ? 3 : 0;
  const blockingPenalty =
    task.blockingStep === "login_confirm"
      ? 1
      : task.blockingStep === "final_submit_review"
        ? 0
        : task.blockingStep === "captcha"
          ? 3
          : 2;
  const strikeScore = echoScore * 4 + quality * 3 + visibility * 2 + priorityBoost - blockingPenalty;

  return {
    siteRoot: task.siteRoot,
    sourceUrl: task.sourceUrl,
    strikeScore,
    echoScore,
    priority: task.priority,
    blockingStep: task.blockingStep,
    action: task.action,
    nextHumanAction: task.nextHumanAction,
    homepageFirstTarget: task.homepageFirstTarget,
    supportPages: task.supportPages.map((page) => page.path),
    payloadPath: task.payloadPath,
  };
}

function renderMarkdown(date: string, rows: StrikeRow[]): string {
  const lines = [`# ${date} .art strike board`, ""];
  lines.push(
    "Top .art execution shortlist for today, blending citation upside, authority, visibility, and friction into one order of operations.",
  );
  lines.push("");

  if (!rows.length) {
    lines.push("No .art execution rows available.");
    return lines.join("\n");
  }

  rows.forEach((row, index) => {
    lines.push(`## ${index + 1}. ${row.siteRoot}`);
    lines.push("");
    lines.push(`- source: ${row.sourceUrl}`);
    lines.push(`- strike score: ${row.strikeScore}`);
    lines.push(`- echo potential: ${row.echoScore}/5`);
    lines.push(`- priority: ${row.priority.toUpperCase()} | blocking: ${row.blockingStep}`);
    lines.push(`- action: ${row.action}`);
    lines.push(`- next step: ${row.nextHumanAction}`);
    lines.push(`- homepage target: ${row.homepageFirstTarget}`);
    lines.push(`- support pages: ${row.supportPages.join(" | ")}`);
    lines.push(`- payload: ${row.payloadPath}`);
    lines.push("");
  });

  return lines.join("\n");
}
