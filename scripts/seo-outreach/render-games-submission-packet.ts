import { renderSubmissionPacket } from "./submission-packet-flow";

export async function renderGamesSubmissionPacket(date: string): Promise<string> {
  return renderSubmissionPacket(date, "games");
}
