import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, TARGET_DEFAULTS } from "./config";
import { parseCsv } from "./csv";
import { readCsvIfExists, SprintRow } from "./sprint-flow";
import type { SubmissionReviewRow, TargetSite } from "./types";

export interface PacketTaskRow {
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

export interface PacketBrowserReviewRow {
  queue_date: string;
  priority: string;
  target_site: string;
  site_root: string;
  source_url: string;
  blocking_step: string;
  next_human_action: string;
  action: string;
  contribution_type: string;
  alias_name: string;
  alias_email: string;
  target_url: string;
  homepage_first_target: string;
  support_pages: string;
  payload_path: string;
  queue_status: string;
  previous_review_status: string;
  submission_result: string;
  public_source_url: string;
  final_notes: string;
}

export async function readReviewRows(date: string, site: TargetSite): Promise<SubmissionReviewRow[]> {
  const text = await fs.readFile(path.join(OUTREACH_DIR, "submission-review.csv"), "utf8");
  return (parseCsv(text) as SubmissionReviewRow[]).filter(
    (row) => row.review_date === date && row.target_site === site,
  );
}

export async function readBrowserReviewRows(
  date: string,
  site: TargetSite,
): Promise<PacketBrowserReviewRow[]> {
  const text = await fs.readFile(
    path.join(OUTREACH_DIR, "runs", `${date}-${site}-browser-review-sheet.csv`),
    "utf8",
  );
  return parseCsv(text) as PacketBrowserReviewRow[];
}

export async function readStrikeTaskRows(
  date: string,
  site: TargetSite,
): Promise<PacketTaskRow[]> {
  const sprintRows = await readCsvIfExists<SprintRow>(
    path.join(OUTREACH_DIR, "runs", `${date}-${site}-sprint-sheet.csv`),
  );
  const browserRows = await readBrowserReviewRows(date, site);
  const browserMap = new Map(browserRows.map((row) => [row.source_url, row] as const));
  return sprintRows.map((row) => {
    const browser = browserMap.get(row.source_url);
    return {
      siteRoot: row.site_root,
      sourceUrl: row.source_url,
      strikeScore: Number(row.strike_score || "0"),
      echoScore: Number(String(row.echo_potential || "").replace("/5", "") || "0"),
      priority: (browser?.priority || "P2").toLowerCase() === "p1" ? "p1" : "p2",
      blockingStep: row.blocking_step,
      action: row.action,
      nextHumanAction: browser?.next_human_action || "",
      homepageFirstTarget: row.homepage_target,
      supportPages: row.support_pages ? row.support_pages.split(" | ").filter(Boolean) : [],
      payloadPath: row.payload_path,
    };
  });
}

export async function renderSubmissionPacket(
  date: string,
  site: TargetSite,
): Promise<string> {
  const [reviewRows, taskRows, browserRows] = await Promise.all([
    readReviewRows(date, site),
    readStrikeTaskRows(date, site),
    readBrowserReviewRows(date, site),
  ]);

  const reviewMap = new Map(reviewRows.map((row) => [row.source_url, row] as const));
  const browserMap = new Map(browserRows.map((row) => [row.source_url, row] as const));
  const enriched = taskRows
    .map((row) => ({
      ...row,
      review: reviewMap.get(row.sourceUrl),
      browser: browserMap.get(row.sourceUrl),
    }))
    .sort((a, b) => b.strikeScore - a.strikeScore)
    .slice(0, 10);

  const aliases = Array.from(
    new Set(
      enriched.map((row) => {
        const alias =
          row.review?.alias_name || row.browser?.alias_name || TARGET_DEFAULTS[site].alias;
        const email =
          row.review?.alias_email || row.browser?.alias_email || TARGET_DEFAULTS[site].email;
        return `${alias} / ${email}`;
      }),
    ),
  );

  const filePath = path.join(OUTREACH_DIR, "runs", `${date}-${site}-submission-packet.md`);
  await fs.writeFile(filePath, `${renderMarkdown(date, site, enriched, aliases)}\n`, "utf8");
  return filePath;
}

function renderMarkdown(
  date: string,
  site: TargetSite,
  rows: Array<
    PacketTaskRow & {
      review?: SubmissionReviewRow;
      browser?: PacketBrowserReviewRow;
    }
  >,
  aliases: string[],
): string {
  const siteLabel = site === "games" ? ".games" : ".art";
  const defaults = TARGET_DEFAULTS[site];
  const lines: string[] = [
    `# ${date} ${siteLabel} submission packet`,
    "",
    `Target homepage: ${defaults.targetUrl}`,
    `Preferred anchor: ${defaults.anchorText}`,
    "",
    "## Alias Audit",
    "",
    "Review these before any final submit step:",
    "",
  ];

  aliases.forEach((alias) => lines.push(`- ${alias}`));
  lines.push("");

  const byBlocking = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = byBlocking.get(row.blockingStep) ?? [];
    list.push(row);
    byBlocking.set(row.blockingStep, list);
  }

  for (const blocking of [
    "final_submit_review",
    "login_confirm",
    "captcha",
    "publish_confirm",
    "await_publication",
    "none",
  ]) {
    const group = byBlocking.get(blocking);
    if (!group?.length) continue;
    lines.push(`## ${label(blocking)} (${group.length})`);
    lines.push("");
    for (const row of group) {
      const alias =
        row.review?.alias_name || row.browser?.alias_name || TARGET_DEFAULTS[site].alias;
      const email =
        row.review?.alias_email || row.browser?.alias_email || TARGET_DEFAULTS[site].email;
      lines.push(`### ${row.siteRoot}`);
      lines.push("");
      lines.push(`- source: ${row.sourceUrl}`);
      lines.push(`- strike score: ${row.strikeScore}`);
      if (row.echoScore) {
        lines.push(`- echo potential: ${row.echoScore}/5`);
      }
      lines.push(`- action: ${row.action}`);
      lines.push(`- next step: ${row.nextHumanAction}`);
      lines.push(`- homepage target: ${row.homepageFirstTarget}`);
      lines.push(`- support pages: ${row.supportPages.join(" | ")}`);
      lines.push(`- payload: ${row.payloadPath}`);
      lines.push(`- alias review: ${alias} / ${email}`);
      lines.push(
        `- review status: ${row.review?.submission_result || row.browser?.previous_review_status || "pending_review"}`,
      );
      lines.push(`- notes: ${row.review?.notes || row.browser?.final_notes || ""}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

function label(blocking: string): string {
  switch (blocking) {
    case "final_submit_review":
      return "Review And Submit";
    case "login_confirm":
      return "Needs Logged-In Session";
    case "captcha":
      return "Captcha Gate";
    case "publish_confirm":
      return "Manual Publish";
    case "await_publication":
      return "Await Publication";
    case "none":
      return "Ready To Run";
    default:
      return blocking;
  }
}
