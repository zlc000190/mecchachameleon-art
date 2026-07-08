import { renderSubmissionPacket } from "./submission-packet-flow";

export async function renderArtSubmissionPacket(date: string): Promise<string> {
  return renderSubmissionPacket(date, "art");
}
