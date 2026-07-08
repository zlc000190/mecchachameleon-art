import { buildSprintRowsFromBrowserReview, browserReviewSheetPath, readCsvIfExists, writeSprintSheet } from "./sprint-flow";
import type { BrowserReviewSheetRow } from "./sprint-flow";

export async function renderGamesSprintSheet(date: string): Promise<string[]> {
  const rows = await readCsvIfExists<BrowserReviewSheetRow>(browserReviewSheetPath(date, "games"));
  const sorted = [...rows].sort((a, b) =>
    a.priority === b.priority
      ? a.source_url.localeCompare(b.source_url)
      : a.priority.localeCompare(b.priority, "en"),
  );
  return writeSprintSheet(date, "games", buildSprintRowsFromBrowserReview("games", sorted));
}
