import { renderOpsDashboard } from "./sprint-flow";

export async function renderArtOpsDashboard(date: string): Promise<string> {
  return renderOpsDashboard(date, "art");
}
