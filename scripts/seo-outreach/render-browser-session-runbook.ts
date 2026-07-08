import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR } from "./config";
import type { TargetSite } from "./types";

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

interface RunbookGroup {
  sessionKey: string;
  sessionLabel: string;
  loginRequired: boolean;
  blockingStep: string;
  priority: "p1" | "p2";
  tasks: BrowserTaskRow[];
}

export async function renderBrowserSessionRunbook(date: string): Promise<string[]> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const manifestPath = path.join(runDir, `${date}-${site}-browser-task-manifest.json`);
    const tasks = JSON.parse(await fs.readFile(manifestPath, "utf8")) as BrowserTaskRow[];
    const groups = buildGroups(tasks);

    const jsonPath = path.join(runDir, `${date}-${site}-browser-session-runbook.json`);
    const mdPath = path.join(runDir, `${date}-${site}-browser-session-runbook.md`);

    await fs.writeFile(jsonPath, `${JSON.stringify(groups, null, 2)}\n`, "utf8");
    await fs.writeFile(mdPath, `${renderMarkdown(site, date, groups)}\n`, "utf8");
    outputs.push(jsonPath, mdPath);
  }

  return outputs;
}

function buildGroups(tasks: BrowserTaskRow[]): RunbookGroup[] {
  const grouped = new Map<string, RunbookGroup>();

  for (const task of tasks) {
    const sessionKey = deriveSessionKey(task);
    const existing = grouped.get(sessionKey);
    if (existing) {
      existing.tasks.push(task);
      continue;
    }

    grouped.set(sessionKey, {
      sessionKey,
      sessionLabel: deriveSessionLabel(task),
      loginRequired: task.blockingStep === "login_confirm",
      blockingStep: task.blockingStep,
      priority: task.priority,
      tasks: [task],
    });
  }

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      tasks: group.tasks.sort(compareTasks),
      priority: group.tasks.some((task) => task.priority === "p1") ? "p1" : "p2",
    }))
    .sort(compareGroups);
}

function deriveSessionKey(task: BrowserTaskRow): string {
  if (task.blockingStep === "login_confirm") {
    return `login::${task.siteRoot}`;
  }
  return `review::${task.siteRoot}`;
}

function deriveSessionLabel(task: BrowserTaskRow): string {
  if (task.blockingStep === "login_confirm") {
    return `${task.siteRoot} logged-in session`;
  }
  if (task.blockingStep === "final_submit_review") {
    return `${task.siteRoot} review-and-submit pass`;
  }
  return `${task.siteRoot} execution pass`;
}

function compareGroups(a: RunbookGroup, b: RunbookGroup): number {
  const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  const loginDiff = Number(b.loginRequired) - Number(a.loginRequired);
  if (loginDiff !== 0) {
    return loginDiff;
  }
  return a.sessionLabel.localeCompare(b.sessionLabel);
}

function compareTasks(a: BrowserTaskRow, b: BrowserTaskRow): number {
  const priorityDiff = priorityRank(a.priority) - priorityRank(b.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return a.sourceUrl.localeCompare(b.sourceUrl);
}

function priorityRank(priority: "p1" | "p2"): number {
  return priority === "p1" ? 0 : 1;
}

function renderMarkdown(site: TargetSite, date: string, groups: RunbookGroup[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${siteLabel} browser session runbook`, ""];

  if (groups.length === 0) {
    lines.push("No browser session groups for this date.");
    return lines.join("\n");
  }

  for (const group of groups) {
    lines.push(`## ${group.priority.toUpperCase()} ${group.sessionLabel}`);
    lines.push("");
    lines.push(`- blocking: ${group.blockingStep}`);
    lines.push(
      `- session goal: ${group.loginRequired ? "Stay in the same logged-in session and complete the full batch." : "Finish the review-and-submit batch before switching roots."}`,
    );
    lines.push(`- tasks: ${group.tasks.length}`);
    lines.push("");

    group.tasks.forEach((task, index) => {
      lines.push(`### ${index + 1}. ${task.siteRoot}`);
      lines.push("");
      lines.push(`- source: ${task.sourceUrl}`);
      lines.push(`- action: ${task.action}`);
      lines.push(`- next step: ${task.nextHumanAction}`);
      lines.push(`- homepage target: ${task.homepageFirstTarget}`);
      lines.push(`- payload: ${task.payloadPath}`);
      lines.push(`- alias: ${task.aliasName} / ${task.aliasEmail}`);
      lines.push("");
    });
  }

  return lines.join("\n");
}
