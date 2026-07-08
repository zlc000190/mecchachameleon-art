import { renderOpsDashboard } from "./sprint-flow";

export async function renderGamesOpsDashboard(date: string): Promise<string> {
  return renderOpsDashboard(date, "games");
}
