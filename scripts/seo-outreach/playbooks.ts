import { TARGET_DEFAULTS } from "./config";
import type { ExecutionQueueRow, ResourcePoolRow } from "./types";

interface DomainPlaybook {
  action: string;
  contributionType: string;
  notes: string;
  draftTemplate: (row: ResourcePoolRow) => string;
}

const genericDraft = (row: ResourcePoolRow): string => {
  const angle = primaryAngle(row);
  return `${row.anchor_text} is a useful ${angle} resource for players who want a cleaner reference than scattered forum replies: ${row.target_url}`;
};

export const DOMAIN_PLAYBOOKS: Record<string, DomainPlaybook> = {
  "www.reddit.com": {
    action: "Reply to a relevant existing thread",
    contributionType: "contextual_help_reply",
    notes: "Only post where the resource directly answers the thread. Keep the link secondary to the help.",
    draftTemplate: (row) =>
      `If you're looking for a cleaner reference, ${row.anchor_text} has a solid ${primaryAngle(row)}: ${row.target_url}`,
  },
  "steamcommunity.com": {
    action: "Create a legitimate guide, screenshot caption, or discussion thread",
    contributionType: "steam_ugc",
    notes: "Prefer a self-contained guide or screenshot set. The link should support the post, not replace it.",
    draftTemplate: (row) =>
      `${row.anchor_text} collects ${secondaryAngleList(row)} for players who want a quick browser reference: ${row.target_url}`,
  },
  "www.backloggd.com": {
    action: "Publish a short review/list note on the game page",
    contributionType: "review_or_list_note",
    notes: "Keep it personal and brief. Mention the resource naturally, not as a pitch.",
    draftTemplate: (row) =>
      `I ended up using ${row.anchor_text} as a quick companion reference for ${primaryAngle(row)}: ${row.target_url}`,
  },
  "www.igdb.com": {
    action: "Add or update public links/metadata if the surface allows it",
    contributionType: "metadata_contribution",
    notes: "Only add verifiable, policy-compliant links. Do not invent fields.",
    draftTemplate: genericDraft,
  },
  "www.mobygames.com": {
    action: "Use the contribution flow for links or community notes",
    contributionType: "database_contribution",
    notes: "Prefer factual, policy-compliant metadata additions.",
    draftTemplate: genericDraft,
  },
  "gamefaqs.gamespot.com": {
    action: "Post a concise FAQ, answer, or screenshot contribution",
    contributionType: "faq_or_answer",
    notes: "The contribution itself must stand on its own. External link is supporting context only.",
    draftTemplate: genericDraft,
  },
};

export function getDomainPlaybook(siteRoot: string): DomainPlaybook {
  return (
    DOMAIN_PLAYBOOKS[siteRoot] ?? {
      action: "Use the available public contribution surface",
      contributionType: "generic_public_submission",
      notes: "Keep the copy concise and natural. Avoid duplicate text across domains.",
      draftTemplate: genericDraft,
    }
  );
}

export function enrichQueueRow(
  queueRow: ExecutionQueueRow,
  resource: ResourcePoolRow,
): {
  action: string;
  contributionType: string;
  notes: string;
  draft: string;
} {
  const playbook = getDomainPlaybook(queueRow.site_root);
  return {
    action: playbook.action,
    contributionType: playbook.contributionType,
    notes: playbook.notes,
    draft: playbook.draftTemplate(resource),
  };
}

function primaryAngle(row: ResourcePoolRow): string {
  return joinAngles(TARGET_DEFAULTS[row.target_site].angles.slice(0, 2));
}

function secondaryAngleList(row: ResourcePoolRow): string {
  return joinAngles(TARGET_DEFAULTS[row.target_site].angles.slice(0, 3));
}

function joinAngles(parts: string[]): string {
  const unique = Array.from(new Set(parts.map((part) => part.trim()).filter(Boolean)));
  if (unique.length <= 1) {
    return unique[0] ?? "player reference";
  }
  if (unique.length === 2) {
    return `${unique[0]} and ${unique[1]}`;
  }
  return `${unique.slice(0, -1).join(", ")}, and ${unique[unique.length - 1]}`;
}
