import fs from "node:fs/promises";
import path from "node:path";

import { OUTREACH_DIR } from "./config";

type TargetSite = "games" | "art";

interface SupportInventoryRow {
  section: string;
  pagePath: string;
  audience: string;
  homepageRole: string;
  supportRole: string;
}

interface AtlasMap {
  name: string;
  slug: string;
  difficulty: string;
  desc: string;
}

const MAPS_DATA_PATH = "/Users/zhanglongchao/programPJ/mecchachameleon-art/src/shared/blocks/meccha/data/maps.json";

async function readMaps(): Promise<AtlasMap[]> {
  const text = await fs.readFile(MAPS_DATA_PATH, "utf8");
  return JSON.parse(text) as AtlasMap[];
}

export async function renderSiteSupportInventory(date: string): Promise<string[]> {
  const runDir = path.join(OUTREACH_DIR, "runs");
  await fs.mkdir(runDir, { recursive: true });

  const maps = await readMaps();
  const outputs: string[] = [];

  for (const site of ["games", "art"] as TargetSite[]) {
    const rows = buildRows(site, maps);
    const filePath = path.join(runDir, `${date}-${site}-site-support-inventory.md`);
    await fs.writeFile(filePath, `${renderMarkdown(site, date, rows)}\n`, "utf8");
    outputs.push(filePath);
  }

  return outputs;
}

function buildRows(site: TargetSite, maps: AtlasMap[]): SupportInventoryRow[] {
  const baseRows: SupportInventoryRow[] =
    site === "games"
      ? [
          {
            section: "Core",
            pagePath: "/",
            audience: "brand, direct navigation, general discovery",
            homepageRole: "Primary target page",
            supportRole: "Collect brand demand and pass users to beginner, online, and map help pages.",
          },
          {
            section: "Core",
            pagePath: "/new-player",
            audience: "beginners, controls, first-match searchers",
            homepageRole: "Supports homepage authority with how-to intent",
            supportRole: "Best support page for onboarding, controls, and first-match checklists.",
          },
          {
            section: "Core",
            pagePath: "/meccha-chameleon-online",
            audience: "quick-play, no-download, trial-intent visitors",
            homepageRole: "Supports homepage with play-now intent",
            supportRole: "Best support page for instant-play and friend-room start angles.",
          },
          {
            section: "Core",
            pagePath: "/maps",
            audience: "route notes, map references, spot-finding intent",
            homepageRole: "Supports homepage with map/help intent",
            supportRole: "Best support page when the external surface mentions routes or map-specific help.",
          },
          {
            section: "Core",
            pagePath: "/community",
            audience: "social proof, user-generated discovery",
            homepageRole: "Secondary support page",
            supportRole: "Useful for community signals, but not the first support page for .games.",
          },
        ]
      : [
          {
            section: "Core",
            pagePath: "/",
            audience: "brand, atlas, general discovery",
            homepageRole: "Primary target page",
            supportRole: "Collect brand demand and pass users to map and community pages.",
          },
          {
            section: "Core",
            pagePath: "/maps",
            audience: "map index, atlas, hiding-spot research",
            homepageRole: "Main support page for homepage-first campaigns",
            supportRole: "Strongest support page for atlas, hiding spots, and paint-match intent.",
          },
          {
            section: "Core",
            pagePath: "/community",
            audience: "visual proof, screenshots, community challenge intent",
            homepageRole: "Supports homepage with community and social proof",
            supportRole: "Useful for visual and screenshot-led public surfaces.",
          },
          {
            section: "Core",
            pagePath: "/meccha-chameleon-online",
            audience: "quick-play curiosity and playable demo intent",
            homepageRole: "Secondary support page",
            supportRole: "Useful when the external surface is social or visual and benefits from a playable next step.",
          },
          {
            section: "Core",
            pagePath: "/new-player",
            audience: "newcomers who need game basics first",
            homepageRole: "Secondary support page",
            supportRole: "Useful when atlas-style discovery turns into basic gameplay questions.",
          },
        ];

  const mapRows = maps.map((map) => ({
    section: "Map detail",
    pagePath: `/maps/${map.slug}`,
    audience: `${map.name} searchers, ${map.difficulty} map help`,
    homepageRole:
      site === "games"
        ? "Deep support page for route-note and map-specific queries"
        : "Deep support page for atlas and hiding-spot discovery",
    supportRole:
      site === "games"
        ? `Use when a public surface names ${map.name} directly or needs a specific route page.`
        : `Use when a public surface names ${map.name} directly or needs a specific atlas page.`,
  }));

  return [...baseRows, ...mapRows];
}

function renderMarkdown(
  site: TargetSite,
  date: string,
  rows: SupportInventoryRow[],
): string {
  const title = site === "games" ? ".games" : ".art";
  const lines: string[] = [`# ${date} ${title} site support inventory`, ""];

  const groups = new Map<string, SupportInventoryRow[]>();
  for (const row of rows) {
    const list = groups.get(row.section) ?? [];
    list.push(row);
    groups.set(row.section, list);
  }

  for (const [section, sectionRows] of groups) {
    lines.push(`## ${section}`);
    lines.push("");
    lines.push("| Page | Audience | Homepage Role | Support Role |");
    lines.push("| --- | --- | --- | --- |");
    for (const row of sectionRows) {
      lines.push(`| ${row.pagePath} | ${row.audience} | ${row.homepageRole} | ${row.supportRole} |`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
