import fs from "node:fs/promises";
import path from "node:path";

import {
  EXECUTION_QUEUE_FILE,
  IMPORT_DIR,
  PAYLOAD_DIR,
  RESOURCE_POOL_FILE,
} from "./config";
import { parseCsv } from "./csv";
import { enrichQueueRow } from "./playbooks";
import type { ExecutionQueueRow, ResourcePoolRow, TargetSite } from "./types";

async function readCsv<T extends Record<string, string>>(filePath: string): Promise<T[]> {
  const text = await fs.readFile(filePath, "utf8");
  return parseCsv(text) as T[];
}

export async function prepareExecutionBatches(
  date: string,
): Promise<{ allPath: string; bySitePaths: string[] }> {
  const [queueRows, resourceRows] = await Promise.all([
    readCsv<ExecutionQueueRow>(EXECUTION_QUEUE_FILE),
    readCsv<ResourcePoolRow>(RESOURCE_POOL_FILE),
  ]);

  const resourceMap = new Map(
    resourceRows.map((row) => [`${row.target_site}::${row.canonical_url}`, row] as const),
  );

  const runDir = path.join(IMPORT_DIR, "..", "runs");
  await fs.mkdir(runDir, { recursive: true });

  const batch = queueRows.map((queueRow) => {
    const key = `${queueRow.target_site}::${queueRow.canonical_url}`;
    const resource = resourceMap.get(key);
    if (!resource) {
      return {
        ...queueRow,
        error: "missing_resource_row",
      };
    }

    const payloadPath = queueRow.prepared_payload_ref;
    return {
      ...queueRow,
      ...enrichQueueRow(queueRow, resource),
      target_url: resource.target_url,
      anchor_text: resource.anchor_text,
      payload_path: payloadPath,
    };
  });

  const allPath = path.join(runDir, `${date}-execution-batch.json`);
  await fs.writeFile(allPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");

  const bySitePaths: string[] = [];
  for (const site of ["games", "art"] as TargetSite[]) {
    const siteRows = batch.filter((row) => row.target_site === site);
    const sitePath = path.join(runDir, `${date}-${site}-execution-batch.json`);
    await fs.writeFile(sitePath, `${JSON.stringify(siteRows, null, 2)}\n`, "utf8");
    bySitePaths.push(sitePath);
  }

  return { allPath, bySitePaths };
}
