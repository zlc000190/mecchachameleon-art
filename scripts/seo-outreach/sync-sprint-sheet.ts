import { syncSprintSheet } from "./sprint-flow";
import type { TargetSite } from "./types";

export async function syncSiteSprintSheet(
  date: string,
  site: TargetSite,
): Promise<{ updatedRows: number }> {
  return syncSprintSheet(date, site);
}
