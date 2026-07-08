import path from "node:path";

import type {
  BlockingStep,
  ExecutionQueueRow,
  ResourcePoolRow,
  SubmissionReviewRow,
  VisibilityVerificationRow,
} from "./types";

export const ROOT_DIR = "/Users/zhanglongchao/programPJ/mecchachameleon-art";
export const OUTREACH_DIR = path.join(ROOT_DIR, "seo", "outreach");
export const PAYLOAD_DIR = path.join(OUTREACH_DIR, "payloads");
export const REPORT_DIR = path.join(OUTREACH_DIR, "reports");
export const IMPORT_DIR = path.join(OUTREACH_DIR, "imports");

export const RESOURCE_POOL_FILE = path.join(OUTREACH_DIR, "resource-pool.csv");
export const EXECUTION_QUEUE_FILE = path.join(OUTREACH_DIR, "execution-queue.csv");
export const VERIFICATION_FILE = path.join(
  OUTREACH_DIR,
  "visibility-verification.csv",
);
export const SUBMISSION_REVIEW_FILE = path.join(
  OUTREACH_DIR,
  "submission-review.csv",
);
export const GAMES_QUEUE_FILE = path.join(
  OUTREACH_DIR,
  "games-visible-queue.csv",
);
export const ART_QUEUE_FILE = path.join(OUTREACH_DIR, "art-visible-queue.csv");

export const LEGACY_ART_TRACKER = path.join(OUTREACH_DIR, "backlink-tracker.csv");
export const LEGACY_GAMES_TRACKER = path.join(
  OUTREACH_DIR,
  "backlink-tracker-mechachameleon-games.csv",
);
export const COMMENT_PROSPECTS_FILE = path.join(
  OUTREACH_DIR,
  "wp-comment-prospects-2026-07-03.csv",
);
export const COMPETITOR_QUEUE_FILE = path.join(
  OUTREACH_DIR,
  "competitor-cross-linking-queue.csv",
);

export const RESOURCE_POOL_HEADERS: Array<keyof ResourcePoolRow> = [
  "date_added",
  "site_root",
  "canonical_url",
  "page_type",
  "target_site",
  "target_url",
  "anchor_text",
  "source_class",
  "ownership_class",
  "topical_score",
  "visibility_score",
  "quality_score",
  "root_cap",
  "requires_login",
  "requires_captcha",
  "requires_manual_confirm",
  "submission_mode",
  "status",
  "last_checked_at",
  "notes",
];

export const EXECUTION_QUEUE_HEADERS: Array<keyof ExecutionQueueRow> = [
  "queue_date",
  "target_site",
  "site_root",
  "canonical_url",
  "submission_mode",
  "prepared_payload_ref",
  "blocking_step",
  "next_human_action",
  "status",
];

export const VERIFICATION_HEADERS: Array<keyof VisibilityVerificationRow> = [
  "verified_at",
  "target_site",
  "site_root",
  "source_url",
  "target_url",
  "html_contains_target",
  "anchor_present",
  "rel_value",
  "visibility_status",
  "verification_method",
  "notes",
];

export const SUBMISSION_REVIEW_HEADERS: Array<keyof SubmissionReviewRow> = [
  "review_date",
  "target_site",
  "site_root",
  "source_url",
  "target_url",
  "prepared_payload_ref",
  "alias_name",
  "alias_email",
  "blocking_step",
  "action",
  "contribution_type",
  "queue_status",
  "submission_result",
  "public_source_url",
  "notes",
];

export const TARGET_DEFAULTS = {
  games: {
    targetUrl: "https://mechachameleon.games/",
    anchorText: "Mecha Chameleon Games",
    alias: "Mecha Chameleon Games",
    email: "zlc000194@gmail.com",
    angles: [
      "browser guide",
      "controls",
      "route notes",
      "play notes",
      "map references",
    ],
  },
  art: {
    targetUrl: "https://mecchachameleon.art/",
    anchorText: "Meccha Chameleon Art",
    alias: "Meccha Chameleon Art",
    email: "zlc000194@gmail.com",
    angles: [
      "fan atlas",
      "hiding spots",
      "map references",
      "paint-match notes",
    ],
  },
} as const;

export const SELF_CONTROLLED_PATTERNS = [
  "github.com/zlc000190/",
  "gist.github.com/zlc000190/",
  "zlc000190.github.io/",
  "dev.to/dive-one-person-comp",
  "medium.com/@zlc000194",
  "mecchachameleon.itch.io/",
  "gamejolt.com/games/mecha-chameleon-games/",
  "indiedb.com/games/meccha-chameleon-art-lab-unofficial-fan-made",
];

export const ROOT_CAP_OVERRIDES: Record<string, number> = {
  "github.com": 10,
  "dev.to": 3,
  "gist.github.com": 3,
  "gamejolt.com": 3,
  "news.ycombinator.com": 2,
};

export const FOLLOW_LIKE_REL_VALUES = new Set(["", "noopener", "noreferrer"]);

export const COUNTABLE_STATUSES = new Set([
  "live_visible",
  "live_visible_follow_like",
  "live_visible_nofollow",
]);

export const DEFAULT_BLOCKING_BY_MODE: Record<
  string,
  { step: BlockingStep; action: string }
> = {
  auto: {
    step: "none",
    action: "Run automated submission and verify public visibility.",
  },
  semi_auto: {
    step: "final_submit_review",
    action: "Review populated fields, finish the human checkpoint, then resume verification.",
  },
  manual_only: {
    step: "publish_confirm",
    action: "Manual handling required before this can enter visible verification.",
  },
};
