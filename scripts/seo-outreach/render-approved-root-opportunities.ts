import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR, RESOURCE_POOL_FILE, ROOT_CAP_OVERRIDES } from "./config";
import { parseCsv } from "./csv";
import {
  classifyExecutionRisk,
  isActionableThirdPartyOpportunity,
  shouldCountStatus,
} from "./lib";
import type { ResourcePoolRow, TargetSite } from "./types";

interface RootSummary {
  siteRoot: string;
  approvedCandidates: number;
  cautionCandidates: number;
  countedVisible: number;
  rootCap: number;
  remainingCapacity: number;
  topQuality: number;
  sampleUrls: string[];
}

interface OpportunityGroups {
  priority: RootSummary[];
  reference: RootSummary[];
}

async function readResourceRows(): Promise<ResourcePoolRow[]> {
  const text = await fs.readFile(RESOURCE_POOL_FILE, "utf8");
  return parseCsv(text) as ResourcePoolRow[];
}

export async function renderApprovedRootOpportunities(date: string): Promise<string[]> {
  const rows = await readResourceRows();
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const outputs: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const siteRows = rows.filter((row) => row.target_site === site);
    const summaries = summarizeRoots(siteRows);
    const filePath = path.join(runDir, `${date}-${site}-approved-root-opportunities.md`);
    await fs.writeFile(filePath, `${renderMarkdown(site, date, summaries)}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function summarizeRoots(rows: ResourcePoolRow[]): OpportunityGroups {
  const priorityMap = new Map<string, RootSummary>();
  const referenceMap = new Map<string, RootSummary>();

  for (const row of rows) {
    const targetMap = isActionableThirdPartyOpportunity(row) ? priorityMap : referenceMap;
    const existing =
      targetMap.get(row.site_root) ??
      {
        siteRoot: row.site_root,
        approvedCandidates: 0,
        cautionCandidates: 0,
        countedVisible: 0,
        rootCap: ROOT_CAP_OVERRIDES[row.site_root] ?? Number(row.root_cap || "3"),
        remainingCapacity: 0,
        topQuality: 0,
        sampleUrls: [],
      };

    const risk = classifyExecutionRisk(row);
    if (risk === "approved" && ["candidate", "qualified", "queued", "submitted"].includes(row.status)) {
      existing.approvedCandidates += 1;
      if (existing.sampleUrls.length < 3) existing.sampleUrls.push(row.canonical_url);
    }
    if (risk === "caution" && ["candidate", "qualified", "queued", "submitted"].includes(row.status)) {
      existing.cautionCandidates += 1;
    }
    if (shouldCountStatus(row.status)) {
      existing.countedVisible += 1;
    }
    existing.topQuality = Math.max(existing.topQuality, Number(row.quality_score || "0"));
    existing.remainingCapacity = Math.max(0, existing.rootCap - existing.countedVisible);
    if (existing.sampleUrls.length > 0) {
      existing.sampleUrls = Array.from(new Set(existing.sampleUrls));
    }
    targetMap.set(row.site_root, existing);
  }

  return {
    priority: sortSummaries(Array.from(priorityMap.values())),
    reference: sortSummaries(Array.from(referenceMap.values())),
  };
}

function sortSummaries(rows: RootSummary[]): RootSummary[] {
  return rows
    .filter((row) => row.approvedCandidates > 0 || row.cautionCandidates > 0)
    .sort((a, b) => {
      const capacityDiff = b.remainingCapacity - a.remainingCapacity;
      if (capacityDiff !== 0) return capacityDiff;
      const approvedDiff = b.approvedCandidates - a.approvedCandidates;
      if (approvedDiff !== 0) return approvedDiff;
      const qualityDiff = b.topQuality - a.topQuality;
      if (qualityDiff !== 0) return qualityDiff;
      return a.siteRoot.localeCompare(b.siteRoot);
    });
}

function renderMarkdown(site: TargetSite, date: string, groups: OpportunityGroups): string {
  const title = site === "games" ? ".games" : ".art";
  const lines = [`# ${date} ${title} approved root opportunities`, ""];

  if (groups.priority.length === 0 && groups.reference.length === 0) {
    lines.push("No approved or caution roots available.");
    return lines.join("\n");
  }

  if (groups.priority.length > 0) {
    lines.push("## Third-Party Priority Roots");
    lines.push("");
    lines.push("| Root | Approved | Caution | Visible Counted | Remaining Cap | Top Quality | Sample URLs |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | --- |");
    for (const row of groups.priority) {
      lines.push(
        `| ${row.siteRoot} | ${row.approvedCandidates} | ${row.cautionCandidates} | ${row.countedVisible} | ${row.remainingCapacity} | ${row.topQuality} | ${row.sampleUrls.join("<br>")} |`,
      );
    }
    lines.push("");
  }

  if (groups.reference.length > 0) {
    lines.push("## Reference / Self-Controlled / Non-Actionable Roots");
    lines.push("");
    lines.push("| Root | Approved | Caution | Visible Counted | Remaining Cap | Top Quality | Sample URLs |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | --- |");
    for (const row of groups.reference) {
      lines.push(
        `| ${row.siteRoot} | ${row.approvedCandidates} | ${row.cautionCandidates} | ${row.countedVisible} | ${row.remainingCapacity} | ${row.topQuality} | ${row.sampleUrls.join("<br>")} |`,
      );
    }
  }

  return lines.join("\n");
}
