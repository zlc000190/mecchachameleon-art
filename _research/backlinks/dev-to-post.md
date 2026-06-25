---
title: "Building a Fan-Made Source-Code Portal for Indie Games"
published: true
tags: gamedev, godot, learning, opensource
---

I built [mecchachameleon.art](https://mecchachameleon.art) — a fan-made portal that surfaces indie games which ship with source code, so other devs can learn by cloning.

The premise is simple:

1. Many indie devs on itch.io release their Godot, Ren'Py, GB Studio, PICO-8, and Bevy projects with source included (often under MIT or CC0).
2. Most "play free games" sites embed the games but ignore the source-code aspect.
3. Source-code learning is genuinely underserved vs. pure play-and-forget portals.

What I shipped:

- 44 free HTML5 indie games playable in-browser (curated from itch.io, all credit back to the original devs)
- 4 Godot starter projects linked with full source + credits (Learn Godot's GDScript From Zero, Godot 4 Beginner Pack, Godot Coloring Game Template, Wordle English)
- Every game page credits the original developer and links to their itch.io / Steam page
- Multilingual (en / ru, more planned)
- ~50 pages total, Next.js shipany template, Dokploy deploy

## The technical pipeline

The curation loop is the interesting part. Each game goes through:

1. **Discovery** — scrape itch.io tag pages (`free + platform-web` + engine tag), dedupe by URL.
2. **Verification** — open each game detail page via headless browser, check that `load_iframe_btn` exists (HTML5 web playable) and that the price badge says `FREE` or `donate_btn` only (PWYW, no fixed price).
3. **Categorization** — score by tag priority: `source-code > kid-friendly > cozy > no-violence > html5 > pixel > godot`.
4. **Page generation** — Next.js generates per-game pages with: embed iframe, source-code download link (if available), credit line, language switcher.

Verification is ~1 game per 3 seconds via headless Chrome, so a full sweep of 200 candidates finishes in ~10 minutes.

## What I learned about fan-made framing

The biggest design question was: how do you re-host a game without (a) stealing from the developer or (b) looking like a doorway site?

Three rules I ended up with:

1. **Never host the game files.** Always iframe itch.io's HTML5 embed. The original host gets all the download/visit traffic.
2. **Never change the title or remove attribution.** Every page shows "by [original dev], original at [itch.io URL]" prominently.
3. **Add value the original doesn't.** For me that's the source-code link (the original page often buries it) and a "fan-made unofficial" disclaimer.

This keeps Google happy (no content duplication) and developers happy (they keep all the traffic).

## What's next

The biggest gap is **per-game tutorials**. The 4 source-code projects I link to are great starter codebases, but a new dev staring at `Learn Godot's GDScript From Zero` doesn't necessarily know which file to open first. If anyone's interested in writing a 500-word "build this game in 1 hour" tutorial for one of the listed projects, drop me a note — I'll add it to the game page and credit you as a contributor.

Source for everything: [mecchachameleon.art](https://mecchachameleon.art)
