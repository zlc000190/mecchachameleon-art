import path from "node:path";

import fs from "node:fs/promises";

import { OUTREACH_DIR, TARGET_DEFAULTS } from "./config";
import { writeSprintSheet } from "./sprint-flow";

export async function renderArtSprintSheet(date: string): Promise<string[]> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  const submissionPacket = await fs.readFile(
    path.join(runDir, `${date}-art-submission-packet.md`),
    "utf8",
  );
  return writeSprintSheet(date, "art", parsePacket(submissionPacket));
}

function parsePacket(text: string): Array<Record<string, string>> {
  const lines = text.split("\n");
  const rows: Array<Record<string, string>> = [];
  let current: Record<string, string> = {};
  let rank = 0;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (current.source_url) rows.push(finalize(current, rank));
      current = { alias_name: TARGET_DEFAULTS.art.alias, alias_email: TARGET_DEFAULTS.art.email };
      continue;
    }
    if (line.startsWith("- source: ")) {
      rank += 1;
      current.rank = String(rank);
      current.source_url = line.replace("- source: ", "").trim();
      continue;
    }
    if (line.startsWith("- strike score: ")) current.strike_score = line.replace("- strike score: ", "").trim();
    if (line.startsWith("- echo potential: ")) current.echo_potential = line.replace("- echo potential: ", "").trim();
    if (line.startsWith("- action: ")) current.action = line.replace("- action: ", "").trim();
    if (line.startsWith("- homepage target: ")) current.homepage_target = line.replace("- homepage target: ", "").trim();
    if (line.startsWith("- support pages: ")) current.support_pages = line.replace("- support pages: ", "").trim();
    if (line.startsWith("- payload: ")) current.payload_path = line.replace("- payload: ", "").trim();
    if (line.startsWith("- alias review: ")) {
      const [name, email] = line.replace("- alias review: ", "").split(" / ");
      current.alias_name = name;
      current.alias_email = email;
    }
  }
  if (current.source_url) rows.push(finalize(current, rank));
  return rows;
}

function finalize(current: Record<string, string>, _rank: number): Record<string, string> {
  const source = current.source_url || "";
  const siteRoot = source ? new URL(source).hostname : "";
  return {
    rank: current.rank || "",
    site_root: siteRoot,
    source_url: source,
    strike_score: current.strike_score || "",
    echo_potential: current.echo_potential || "",
    blocking_step: source.includes("steamcommunity.com") || source.includes("steamgriddb.com")
      ? "login_confirm"
      : "final_submit_review",
    action: current.action || "",
    alias_name: current.alias_name || TARGET_DEFAULTS.art.alias,
    alias_email: current.alias_email || TARGET_DEFAULTS.art.email,
    homepage_target: current.homepage_target || TARGET_DEFAULTS.art.targetUrl,
    support_pages: current.support_pages || "",
    payload_path: current.payload_path || "",
  };
}
