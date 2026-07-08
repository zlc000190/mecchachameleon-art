import fs from "node:fs/promises";
import path from "node:path";

import {
  EXECUTION_QUEUE_FILE,
  OUTREACH_DIR,
  RESOURCE_POOL_FILE,
  SUBMISSION_REVIEW_FILE,
  TARGET_DEFAULTS,
} from "./config";
import { parseCsv } from "./csv";
import { classifyExecutionRisk, summarizeNotes } from "./lib";
import { buildSupportRouting } from "./routing";
import type {
  ExecutionQueueRow,
  ResourcePoolRow,
  SubmissionReviewRow,
  TargetSite,
} from "./types";

type BrowserTaskPriority = "p1" | "p2";

interface BrowserTask {
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
  priority: BrowserTaskPriority;
  notes: string;
}

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function renderBrowserTaskManifest(date: string): Promise<string[]> {
  const [queueRows, resourceRows, reviewRows] = await Promise.all([
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
    readCsv<SubmissionReviewRow>(SUBMISSION_REVIEW_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );
  const reviewMap = new Map(
    reviewRows.map((row) => [`${row.target_site}::${row.source_url}`, row] as const),
  );

  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const tasks = queueRows
      .filter((row) => row.target_site === site)
      .map((row) => buildTask(row, resourceMap, reviewMap))
      .filter((task): task is BrowserTask => Boolean(task))
      .sort(compareTasks);

    const jsonPath = path.join(runDir, `${date}-${site}-browser-task-manifest.json`);
    const mdPath = path.join(runDir, `${date}-${site}-browser-task-manifest.md`);

    await fs.writeFile(jsonPath, `${JSON.stringify(tasks, null, 2)}\n`, "utf8");
    await fs.writeFile(mdPath, `${renderMarkdown(site, date, tasks)}\n`, "utf8");
    outputs.push(jsonPath, mdPath);
  }

  return outputs;
}

function buildTask(
  queueRow: ExecutionQueueRow,
  resourceMap: Map<string, ResourcePoolRow>,
  reviewMap: Map<string, SubmissionReviewRow>,
): BrowserTask | undefined {
  const resource = resourceMap.get(`${queueRow.target_site}::${queueRow.canonical_url}`);
  if (!resource) {
    return undefined;
  }
  if (resource.ownership_class !== "third_party") {
    return undefined;
  }
  if (classifyExecutionRisk(resource) === "high_risk") {
    return undefined;
  }

  const review = reviewMap.get(`${queueRow.target_site}::${queueRow.canonical_url}`);
  const routing = buildSupportRouting(queueRow);
  return {
    queueDate: queueRow.queue_date,
    targetSite: queueRow.target_site,
    siteRoot: queueRow.site_root,
    sourceUrl: queueRow.canonical_url,
    targetUrl: resource.target_url,
    homepageFirstTarget: routing.primaryDestination,
    supportPages: routing.supportPages.map((page) => ({
      path: page.path,
      reason: page.reason,
    })),
    routingAngle: routing.angle,
    blockingStep: queueRow.blocking_step,
    nextHumanAction: queueRow.next_human_action,
    submissionMode: queueRow.submission_mode,
    action: review?.action || "",
    contributionType: review?.contribution_type || "",
    aliasName: review?.alias_name || TARGET_DEFAULTS[queueRow.target_site].alias,
    aliasEmail: review?.alias_email || TARGET_DEFAULTS[queueRow.target_site].email,
    payloadPath: queueRow.prepared_payload_ref,
    queueStatus: queueRow.status,
    reviewStatus: review?.submission_result || "pending_review",
    priority: taskPriority(resource, queueRow.blocking_step),
    notes: summarizeNotes(resource.notes, 4),
  };
}

function taskPriority(
  resource: ResourcePoolRow,
  blockingStep: ExecutionQueueRow["blocking_step"],
): BrowserTaskPriority {
  if (
    Number(resource.quality_score) >= 5 &&
    (blockingStep === "login_confirm" || blockingStep === "final_submit_review")
  ) {
    return "p1";
  }
  return "p2";
}

function compareTasks(a: BrowserTask, b: BrowserTask): number {
  const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  const blockDiff = blockingRank(a.blockingStep) - blockingRank(b.blockingStep);
  if (blockDiff !== 0) {
    return blockDiff;
  }
  return a.sourceUrl.localeCompare(b.sourceUrl);
}

function priorityRank(priority: BrowserTaskPriority): number {
  return priority === "p1" ? 0 : 1;
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

function renderMarkdown(site: TargetSite, date: string, tasks: BrowserTask[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${siteLabel} browser task manifest`, ""];

  if (tasks.length === 0) {
    lines.push("No browser-ready tasks for this date.");
    return lines.join("\n");
  }

  for (const priority of ["p1", "p2"] as const) {
    const priorityTasks = tasks.filter((task) => task.priority === priority);
    if (!priorityTasks.length) continue;

    lines.push(`## ${priority.toUpperCase()} (${priorityTasks.length})`);
    lines.push("");
    for (const task of priorityTasks) {
      lines.push(`### ${task.siteRoot}`);
      lines.push("");
      lines.push(`- source: ${task.sourceUrl}`);
      lines.push(`- action: ${task.action || "Review payload and execute"}`);
      lines.push(`- blocking: ${task.blockingStep}`);
      lines.push(`- next step: ${task.nextHumanAction}`);
      lines.push(`- homepage target: ${task.homepageFirstTarget}`);
      lines.push(`- support pages:`);
      for (const page of task.supportPages) {
        lines.push(`  - ${page.path}: ${page.reason}`);
      }
      lines.push(`- alias: ${task.aliasName}`);
      lines.push(`- email: ${task.aliasEmail}`);
      lines.push(`- payload: ${task.payloadPath}`);
      lines.push(`- notes: ${task.notes}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}
