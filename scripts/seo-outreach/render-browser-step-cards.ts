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

export async function renderBrowserStepCards(date: string): Promise<string[]> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const runbookPath = path.join(runDir, `${date}-${site}-browser-session-runbook.json`);
    const groups = JSON.parse(await fs.readFile(runbookPath, "utf8")) as RunbookGroup[];

    const mdPath = path.join(runDir, `${date}-${site}-browser-step-cards.md`);
    await fs.writeFile(mdPath, `${renderMarkdown(site, date, groups)}\n`, "utf8");
    outputs.push(mdPath);
  }

  return outputs;
}

function renderMarkdown(site: TargetSite, date: string, groups: RunbookGroup[]): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const reviewSheet = path.join(
    OUTREACH_DIR,
    "runs",
    `${date}-${site}-browser-review-sheet.csv`,
  );
  const lines: string[] = [`# ${date} ${siteLabel} browser step cards`, ""];

  if (groups.length === 0) {
    lines.push("No browser step cards for this date.");
    return lines.join("\n");
  }

  groups.forEach((group, groupIndex) => {
    lines.push(`## Card ${groupIndex + 1}: ${group.priority.toUpperCase()} ${group.sessionLabel}`);
    lines.push("");
    lines.push(`1. Open the root session for \`${group.sessionLabel}\`.`);
    if (group.loginRequired) {
      lines.push(`2. Confirm the logged-in account before touching any submission fields.`);
    } else {
      lines.push(`2. Open the public form or contribution surface and review the drafted fields.`);
    }
    lines.push(`3. Work through this batch without switching roots:`);
    lines.push("");

    group.tasks.forEach((task, taskIndex) => {
      lines.push(`### Step ${groupIndex + 1}.${taskIndex + 1}`);
      lines.push("");
      lines.push(`- source: ${task.sourceUrl}`);
      lines.push(`- action: ${task.action}`);
      lines.push(`- next move: ${task.nextHumanAction}`);
      lines.push(`- homepage target: ${task.homepageFirstTarget}`);
      lines.push(`- support pages: ${task.supportPages.map((page) => page.path).join(" | ")}`);
      lines.push(`- payload: ${task.payloadPath}`);
      lines.push(`- alias: ${task.aliasName} / ${task.aliasEmail}`);
      lines.push(`- after submit: update \`${reviewSheet}\` for this source with \`submission_result\`, \`public_source_url\`, and \`final_notes\`.`);
      lines.push("");
    });
  });

  return lines.join("\n");
}
