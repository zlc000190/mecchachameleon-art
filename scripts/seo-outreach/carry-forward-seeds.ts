import fs from "node:fs/promises";
import path from "node:path";

import { IMPORT_DIR } from "./config";
import { parseCsv, stringifyCsv } from "./csv";

const SEED_PREFIXES = [
  "manual-seeds",
  "serp-seeds",
  "surface-seeds",
  "approved-root-seeds",
] as const;

type SeedPrefix = (typeof SEED_PREFIXES)[number];

async function findLatestSeedFile(prefix: SeedPrefix, date: string): Promise<string | null> {
  const files = (await fs.readdir(IMPORT_DIR))
    .filter((file) => file.startsWith(`${prefix}-`) && file.endsWith(".csv"))
    .sort();

  const targetName = `${prefix}-${date}.csv`;
  if (files.includes(targetName)) {
    return null;
  }

  const earlier = files.filter((file) => file < targetName);
  return earlier.length ? earlier[earlier.length - 1] : null;
}

function bumpDateFields(rows: Array<Record<string, string>>, date: string): Array<Record<string, string>> {
  return rows.map((row) => {
    const next = { ...row };
    if ("date_added" in next) next.date_added = date;
    if ("last_checked_at" in next && next.last_checked_at) next.last_checked_at = date;
    return next;
  });
}

export async function carryForwardSeeds(date: string): Promise<{
  created: string[];
  skipped: string[];
}> {
  await fs.mkdir(IMPORT_DIR, { recursive: true });

  const created: string[] = [];
  const skipped: string[] = [];

  for (const prefix of SEED_PREFIXES) {
    const latest = await findLatestSeedFile(prefix, date);
    const targetPath = path.join(IMPORT_DIR, `${prefix}-${date}.csv`);

    if (!latest) {
      skipped.push(targetPath);
      continue;
    }

    const sourcePath = path.join(IMPORT_DIR, latest);
    const text = await fs.readFile(sourcePath, "utf8");
    const rows = parseCsv(text);
    const headers = text.split(/\r?\n/, 1)[0].split(",");
    const bumped = bumpDateFields(rows, date);
    await fs.writeFile(
      targetPath,
      stringifyCsv(
        bumped as Array<Record<string, string>>,
        headers as Array<keyof Record<string, string>>,
      ),
      "utf8",
    );
    created.push(targetPath);
  }

  return { created, skipped };
}
