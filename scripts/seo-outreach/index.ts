import {
  buildResourcePool,
  ensureOutreachLayout,
  generateDailySummary,
  generateExecutionQueues,
  verifyVisibleLinks,
} from "./lib";
import { carryForwardSeeds } from "./carry-forward-seeds";
import { generateApprovedRootSeeds } from "./generate-approved-root-seeds";
import { generateSurfaceSeeds } from "./generate-surface-seeds";
import { renderHomepageSupportPlan } from "./render-homepage-support-plan";
import { renderSiteSupportInventory } from "./render-site-support-inventory";
import { prepareExecutionBatches } from "./prepare-batches";
import { renderExecutionPackets } from "./render-execution-packets";
import { renderPriorityBoard } from "./render-priority-board";
import { renderApprovedRootOpportunities } from "./render-approved-root-opportunities";
import { renderApprovedActionBoard } from "./render-approved-action-board";
import { renderBrowserTaskManifest } from "./render-browser-task-manifest";
import { renderBrowserReviewSheet } from "./render-browser-review-sheet";
import { renderBrowserSessionRunbook } from "./render-browser-session-runbook";
import { renderBrowserStepCards } from "./render-browser-step-cards";
import { reconcileBrowserReview } from "./reconcile-browser-review";
import { renderArtEchoGapReport } from "./render-art-echo-gap-report";
import { renderArtRankPushBoard } from "./render-art-rank-push-board";
import { renderArtStrikeBoard } from "./render-art-strike-board";
import { renderArtSubmissionPacket } from "./render-art-submission-packet";
import { renderGamesSubmissionPacket } from "./render-games-submission-packet";
import { renderArtSprintSheet } from "./render-art-sprint-sheet";
import { renderArtOpsDashboard } from "./render-art-ops-dashboard";
import { renderGamesSprintSheet } from "./render-games-sprint-sheet";
import { renderGamesOpsDashboard } from "./render-games-ops-dashboard";
import { syncSiteSprintSheet } from "./sync-sprint-sheet";
import { syncBrowserReviewSheet } from "./sync-browser-review-sheet";
import { renderReviewChecklists } from "./render-review-checklists";
import { renderSafeExecutionView } from "./render-safe-execution-view";
import { applySubmissionReview, prepareSubmissionReview } from "./review-loop";

async function main(): Promise<void> {
  const command = process.argv[2] ?? "all";
  const today = process.argv[3] ?? new Date().toISOString().slice(0, 10);
  const targetSiteArg = process.argv[4];
  const targetSite =
    targetSiteArg === "games" || targetSiteArg === "art" ? targetSiteArg : undefined;
  const limitArg = process.argv[5];
  const limit = limitArg ? Number(limitArg) : undefined;

  await ensureOutreachLayout();

  switch (command) {
    case "init":
      console.log("Initialized outreach workspace.");
      return;
    case "build-pool": {
      const rows = await buildResourcePool(today);
      console.log(`Built resource pool with ${rows.length} rows.`);
      return;
    }
    case "generate-queues": {
      const queues = await generateExecutionQueues(today);
      console.log(
        `Generated queues: all=${queues.all.length}, games=${queues.games.length}, art=${queues.art.length}.`,
      );
      return;
    }
    case "generate-surface-seeds": {
      const result = await generateSurfaceSeeds(today);
      console.log(
        `Surface seeds written: ${result.filePath} (live=${result.liveRows}/${result.totalCandidates}).`,
      );
      return;
    }
    case "carry-forward-seeds": {
      const result = await carryForwardSeeds(today);
      console.log(
        `Carry-forward complete: created=${result.created.length}, skipped=${result.skipped.length}.`,
      );
      return;
    }
    case "generate-approved-root-seeds": {
      const result = await generateApprovedRootSeeds(today);
      console.log(
        `Approved root seeds written: ${result.filePath} (live=${result.liveRows}/${result.totalCandidates}).`,
      );
      return;
    }
    case "verify": {
      const rows = await verifyVisibleLinks(today, targetSite, limit);
      console.log(`Verification rows written: ${rows.length}.`);
      return;
    }
    case "summary": {
      const summaryPath = await generateDailySummary(today);
      console.log(`Summary written to ${summaryPath}.`);
      return;
    }
    case "prepare-batches": {
      const result = await prepareExecutionBatches(today);
      console.log(
        `Execution batches written: all=${result.allPath}, bySite=${result.bySitePaths.join(",")}.`,
      );
      return;
    }
    case "prepare-review": {
      const reviewPath = await prepareSubmissionReview(today);
      console.log(`Submission review sheet written: ${reviewPath}.`);
      return;
    }
    case "render-review-checklists": {
      const outputs = await renderReviewChecklists(today);
      console.log(`Review checklists written: ${outputs.join(",")}.`);
      return;
    }
    case "render-priority-board": {
      const outputs = await renderPriorityBoard(today);
      console.log(`Priority boards written: ${outputs.join(",")}.`);
      return;
    }
    case "render-safe-execution-view": {
      const outputs = await renderSafeExecutionView(today);
      console.log(`Safe execution views written: ${outputs.join(",")}.`);
      return;
    }
    case "render-approved-root-opportunities": {
      const outputs = await renderApprovedRootOpportunities(today);
      console.log(`Approved root opportunities written: ${outputs.join(",")}.`);
      return;
    }
    case "render-approved-action-board": {
      const outputs = await renderApprovedActionBoard(today);
      console.log(`Approved action boards written: ${outputs.join(",")}.`);
      return;
    }
    case "render-browser-task-manifest": {
      const outputs = await renderBrowserTaskManifest(today);
      console.log(`Browser task manifests written: ${outputs.join(",")}.`);
      return;
    }
    case "render-browser-review-sheet": {
      const outputs = await renderBrowserReviewSheet(today);
      console.log(`Browser review sheets written: ${outputs.join(",")}.`);
      return;
    }
    case "render-browser-session-runbook": {
      const outputs = await renderBrowserSessionRunbook(today);
      console.log(`Browser session runbooks written: ${outputs.join(",")}.`);
      return;
    }
    case "render-browser-step-cards": {
      const outputs = await renderBrowserStepCards(today);
      console.log(`Browser step cards written: ${outputs.join(",")}.`);
      return;
    }
    case "render-art-rank-push-board": {
      const output = await renderArtRankPushBoard(today);
      console.log(`.art rank push board written: ${output}.`);
      return;
    }
    case "render-art-echo-gap-report": {
      const output = await renderArtEchoGapReport(today);
      console.log(`.art echo gap report written: ${output}.`);
      return;
    }
    case "render-art-strike-board": {
      const output = await renderArtStrikeBoard(today);
      console.log(`.art strike board written: ${output}.`);
      return;
    }
    case "render-art-submission-packet": {
      const output = await renderArtSubmissionPacket(today);
      console.log(`.art submission packet written: ${output}.`);
      return;
    }
    case "render-art-sprint-sheet": {
      const outputs = await renderArtSprintSheet(today);
      console.log(`.art sprint sheet written: ${outputs.join(",")}.`);
      return;
    }
    case "render-games-sprint-sheet": {
      const outputs = await renderGamesSprintSheet(today);
      console.log(`.games sprint sheet written: ${outputs.join(",")}.`);
      return;
    }
    case "render-games-submission-packet": {
      const output = await renderGamesSubmissionPacket(today);
      console.log(`.games submission packet written: ${output}.`);
      return;
    }
    case "render-art-ops-dashboard": {
      const output = await renderArtOpsDashboard(today);
      console.log(`.art ops dashboard written: ${output}.`);
      return;
    }
    case "render-games-ops-dashboard": {
      const output = await renderGamesOpsDashboard(today);
      console.log(`.games ops dashboard written: ${output}.`);
      return;
    }
    case "sync-art-sprint-sheet": {
      const result = await syncSiteSprintSheet(today, "art");
      console.log(`.art sprint sheet sync complete: updated=${result.updatedRows}.`);
      return;
    }
    case "sync-games-sprint-sheet": {
      const result = await syncSiteSprintSheet(today, "games");
      console.log(`.games sprint sheet sync complete: updated=${result.updatedRows}.`);
      return;
    }
    case "sync-browser-review-sheet": {
      const result = await syncBrowserReviewSheet(today);
      console.log(
        `Browser review sync complete: merged=${result.mergedRows}, updated=${result.updatedRows}.`,
      );
      return;
    }
    case "reconcile-browser-review": {
      const result = await reconcileBrowserReview(today);
      console.log(
        `Browser review reconcile complete: merged=${result.mergedRows}, synced=${result.syncedRows}, resources=${result.updatedResources}, queueRows=${result.updatedQueueRows}, report=${result.reportPath}.`,
      );
      return;
    }
    case "render-homepage-support-plan": {
      const outputs = await renderHomepageSupportPlan(today);
      console.log(`Homepage support plans written: ${outputs.join(",")}.`);
      return;
    }
    case "render-site-support-inventory": {
      const outputs = await renderSiteSupportInventory(today);
      console.log(`Site support inventories written: ${outputs.join(",")}.`);
      return;
    }
    case "render-execution-packets": {
      const outputs = await renderExecutionPackets(today);
      console.log(`Execution packets written: ${outputs.join(",")}.`);
      return;
    }
    case "apply-review": {
      const result = await applySubmissionReview(today);
      console.log(
        `Applied manual review updates: resources=${result.updatedResources}, queueRows=${result.updatedQueueRows}.`,
      );
      return;
    }
    case "all": {
      await carryForwardSeeds(today);
      await generateSurfaceSeeds(today);
      await generateApprovedRootSeeds(today);
      const pool = await buildResourcePool(today);
      const queues = await generateExecutionQueues(today);
      await prepareExecutionBatches(today);
      await prepareSubmissionReview(today);
      await renderReviewChecklists(today);
      await renderPriorityBoard(today);
      await renderSafeExecutionView(today);
      await renderApprovedRootOpportunities(today);
      await renderApprovedActionBoard(today);
      await renderBrowserTaskManifest(today);
      await renderBrowserReviewSheet(today);
      await renderBrowserSessionRunbook(today);
      await renderBrowserStepCards(today);
      await renderArtRankPushBoard(today);
      await renderArtEchoGapReport(today);
      await renderArtStrikeBoard(today);
      await renderArtSubmissionPacket(today);
      await renderGamesSubmissionPacket(today);
      await renderArtSprintSheet(today);
      await renderArtOpsDashboard(today);
      await renderGamesSprintSheet(today);
      await renderGamesOpsDashboard(today);
      await reconcileBrowserReview(today);
      await renderHomepageSupportPlan(today);
      await renderSiteSupportInventory(today);
      await renderExecutionPackets(today);
      const summaryPath = await generateDailySummary(today);
      console.log(
        `Backlink factory complete: pool=${pool.length}, queue=${queues.all.length}, summary=${summaryPath}.`,
      );
      return;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
