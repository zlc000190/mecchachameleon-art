import { TARGET_DEFAULTS } from "./config";
import type { TargetSite } from "./types";

export interface SupportPage {
  path: string;
  label: string;
  reason: string;
}

export interface SupportRoutingPlan {
  primaryDestination: string;
  supportPages: SupportPage[];
  angle: string;
}

export interface SupportRoutingInput {
  target_site: TargetSite;
  canonical_url: string;
}

export function buildSupportRouting(row: SupportRoutingInput): SupportRoutingPlan {
  if (row.target_site === "games") {
    return {
      primaryDestination: TARGET_DEFAULTS.games.targetUrl,
      supportPages: supportPagesForGames(row.canonical_url),
      angle: angleForGames(row.canonical_url),
    };
  }

  return {
    primaryDestination: TARGET_DEFAULTS.art.targetUrl,
    supportPages: supportPagesForArt(row.canonical_url),
    angle: angleForArt(row.canonical_url),
  };
}

function supportPagesForGames(urlValue: string): SupportPage[] {
  const url = urlValue.toLowerCase();
  const pages: SupportPage[] = [
    {
      path: "/new-player",
      label: "New Player Guide",
      reason: "Best fit when the public surface leans toward beginner help, controls, or first-match setup.",
    },
    {
      path: "/maps",
      label: "Map Index",
      reason: "Use when the visible context mentions routes, map references, hiding spots, or spot-finding help.",
    },
  ];

  if (
    url.includes("steamcommunity") ||
    url.includes("gamefaqs") ||
    url.includes("mobygames") ||
    url.includes("online")
  ) {
    pages.push({
      path: "/meccha-chameleon-online",
      label: "Meccha Chameleon Online",
      reason: "Useful when the contribution angle is quick play, instant trial, or low-friction friend-room start.",
    });
  }

  return dedupeSupportPages(pages);
}

function supportPagesForArt(urlValue: string): SupportPage[] {
  const url = urlValue.toLowerCase();
  const pages: SupportPage[] = [
    {
      path: "/maps",
      label: "Map Index",
      reason: "Primary support page for atlas, hiding spots, paint-match notes, and map-reference intent.",
    },
    {
      path: "/community",
      label: "Community Challenges",
      reason: "Useful when the public surface is visual, screenshot-led, or community-submission oriented.",
    },
  ];

  if (url.includes("steamcommunity") || url.includes("steamgriddb")) {
    pages.push({
      path: "/meccha-chameleon-online",
      label: "Meccha Chameleon Online",
      reason: "Adds a quick playable destination when the public surface is social, visual, or experiment-driven.",
    });
  }

  return dedupeSupportPages(pages);
}

function angleForGames(urlValue: string): string {
  const url = urlValue.toLowerCase();
  if (url.includes("gamefaqs") || url.includes("mobygames") || url.includes("igdb")) {
    return "Homepage-first, supported by controls, route notes, and first-match guidance.";
  }
  if (url.includes("steamcommunity")) {
    return "Homepage-first, supported by quick-play and player-help pages.";
  }
  return "Homepage-first with one support page that matches the visible player-help context.";
}

function angleForArt(urlValue: string): string {
  const url = urlValue.toLowerCase();
  if (url.includes("steamgriddb") || url.includes("steamcommunity")) {
    return "Homepage-first, supported by map index and community screenshot-style pages.";
  }
  if (url.includes("igdb") || url.includes("mobygames") || url.includes("ign")) {
    return "Homepage-first, supported by atlas and map-reference pages.";
  }
  return "Homepage-first with map index as the main supporting destination.";
}

function dedupeSupportPages(pages: SupportPage[]): SupportPage[] {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.path)) {
      return false;
    }
    seen.add(page.path);
    return true;
  });
}
