import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, RESOURCE_POOL_FILE, ROOT_CAP_OVERRIDES } from "./config";
import { parseCsv } from "./csv";
import {
  citationMultiplierScore,
  classifyExecutionRisk,
  isActionableThirdPartyOpportunity,
  shouldCountStatus,
} from "./lib";
import type { ResourcePoolRow } from "./types";

interface RootGapRow {
  siteRoot: string;
  echoScore: number;
  qualityScore: number;
  visibilityScore: number;
  approvedOpen: number;
  cautionOpen: number;
  countedVisible: number;
  remainingCap: number;
  sampleUrl: string;
}

async function readResourceRows(): Promise<ResourcePoolRow[]> {
  const text = await fs.readFile(RESOURCE_POOL_FILE, "utf8");
  return parseCsv(text) as ResourcePoolRow[];
}

export async function renderArtEchoGapReport(date: string): Promise<string> {
  const rows = await readResourceRows();
  const artRows = rows.filter(
    (row) => row.target_site === "art" && row.ownership_class === "third_party",
  );

  const byRoot = new Map<string, RootGapRow>();
  for (const row of artRows) {
    if (!isActionableThirdPartyOpportunity(row)) {
      continue;
    }

    const risk = classifyExecutionRisk(row);
    const rootCap = ROOT_CAP_OVERRIDES[row.site_root] ?? Number(row.root_cap || "3");
    const current =
      byRoot.get(row.site_root) ??
      {
        siteRoot: row.site_root,
        echoScore: 0,
        qualityScore: 0,
        visibilityScore: 0,
        approvedOpen: 0,
        cautionOpen: 0,
        countedVisible: 0,
        remainingCap: rootCap,
        sampleUrl: row.canonical_url,
      };

    current.echoScore = Math.max(current.echoScore, citationMultiplierScore(row));
    current.qualityScore = Math.max(current.qualityScore, Number(row.quality_score || "0"));
    current.visibilityScore = Math.max(
      current.visibilityScore,
      Number(row.visibility_score || "0"),
    );

    if (["candidate", "qualified", "queued", "submitted"].includes(row.status)) {
      if (risk === "approved") current.approvedOpen += 1;
      if (risk === "caution") current.cautionOpen += 1;
    }
    if (shouldCountStatus(row.status)) {
      current.countedVisible += 1;
    }

    current.remainingCap = Math.max(0, rootCap - current.countedVisible);
    byRoot.set(row.site_root, current);
  }

  const roots = Array.from(byRoot.values());
  const liveRoots = roots
    .filter((row) => row.countedVisible > 0)
    .sort((a, b) => b.echoScore - a.echoScore || b.countedVisible - a.countedVisible);
  const gapRoots = roots
    .filter(
      (row) =>
        row.countedVisible === 0 &&
        row.remainingCap > 0 &&
        (row.approvedOpen > 0 || row.cautionOpen > 0),
    )
    .sort(
      (a, b) =>
        b.echoScore - a.echoScore ||
        b.qualityScore - a.qualityScore ||
        b.visibilityScore - a.visibilityScore ||
        b.approvedOpen - a.approvedOpen,
    );

  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });
  const filePath = path.join(runDir, `${date}-art-echo-gap-report.md`);
  await fs.writeFile(filePath, `${renderMarkdown(date, liveRoots, gapRoots)}\n`, "utf8");
  return filePath;
}

function renderMarkdown(date: string, liveRoots: RootGapRow[], gapRoots: RootGapRow[]): string {
  const lines = [`# ${date} .art echo gap report`, ""];
  lines.push(
    "This view separates the current third-party public-visible footprint from the highest-value missing roots that could still expand the citation chain.",
  );
  lines.push("");

  lines.push(`- live third-party roots: ${liveRoots.length}`);
  lines.push(`- missing high-potential roots: ${gapRoots.length}`);
  lines.push("");

  lines.push("## Current Live Roots");
  lines.push("");
  if (!liveRoots.length) {
    lines.push("No third-party live-visible roots are currently counted for .art.");
  } else {
    lines.push("| Root | Echo | Counted Visible | Remaining Cap | Sample |");
    lines.push("| --- | ---: | ---: | ---: | --- |");
    for (const row of liveRoots) {
      lines.push(
        `| ${row.siteRoot} | ${row.echoScore} | ${row.countedVisible} | ${row.remainingCap} | ${row.sampleUrl} |`,
      );
    }
  }
  lines.push("");

  lines.push("## Highest-Value Missing Roots");
  lines.push("");
  if (!gapRoots.length) {
    lines.push("No missing high-potential roots found.");
  } else {
    lines.push("| Root | Echo | Approved Open | Caution Open | Quality | Visibility | Remaining Cap | Sample |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |");
    for (const row of gapRoots) {
      lines.push(
        `| ${row.siteRoot} | ${row.echoScore} | ${row.approvedOpen} | ${row.cautionOpen} | ${row.qualityScore} | ${row.visibilityScore} | ${row.remainingCap} | ${row.sampleUrl} |`,
      );
    }
  }

  return lines.join("\n");
}
