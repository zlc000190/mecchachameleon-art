export type TargetSite = "games" | "art";

export type PageType =
  | "directory_detail"
  | "project_page"
  | "article"
  | "profile"
  | "wiki"
  | "issue"
  | "release"
  | "tag"
  | "gist"
  | "discussion"
  | "blog_comment";

export type SourceClass =
  | "public_profile"
  | "public_article"
  | "public_project"
  | "directory_submission"
  | "comment_submission";

export type OwnershipClass = "third_party" | "self_controlled";

export type SubmissionMode = "auto" | "semi_auto" | "manual_only";

export type ResourceStatus =
  | "candidate"
  | "qualified"
  | "queued"
  | "submitted"
  | "live_visible"
  | "live_visible_follow_like"
  | "live_visible_nofollow"
  | "blocked"
  | "rejected";

export type BlockingStep =
  | "none"
  | "login_confirm"
  | "captcha"
  | "email_verify"
  | "final_submit_review"
  | "publish_confirm"
  | "await_publication";

export interface ResourcePoolRow {
  date_added: string;
  site_root: string;
  canonical_url: string;
  page_type: PageType;
  target_site: TargetSite;
  target_url: string;
  anchor_text: string;
  source_class: SourceClass;
  ownership_class: OwnershipClass;
  topical_score: string;
  visibility_score: string;
  quality_score: string;
  root_cap: string;
  requires_login: string;
  requires_captcha: string;
  requires_manual_confirm: string;
  submission_mode: SubmissionMode;
  status: ResourceStatus;
  last_checked_at: string;
  notes: string;
}

export interface ExecutionQueueRow {
  queue_date: string;
  target_site: TargetSite;
  site_root: string;
  canonical_url: string;
  submission_mode: SubmissionMode;
  prepared_payload_ref: string;
  blocking_step: BlockingStep;
  next_human_action: string;
  status: string;
}

export interface VisibilityVerificationRow {
  verified_at: string;
  target_site: TargetSite;
  site_root: string;
  source_url: string;
  target_url: string;
  html_contains_target: string;
  anchor_present: string;
  rel_value: string;
  visibility_status: string;
  verification_method: string;
  notes: string;
}

export interface SubmissionReviewRow {
  review_date: string;
  target_site: TargetSite;
  site_root: string;
  source_url: string;
  target_url: string;
  prepared_payload_ref: string;
  alias_name: string;
  alias_email: string;
  blocking_step: BlockingStep;
  action: string;
  contribution_type: string;
  queue_status: string;
  submission_result: string;
  public_source_url: string;
  notes: string;
}
