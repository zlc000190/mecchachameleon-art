Reminder: Meccha Chameleon Art Lab is an unofficial, fan-made companion site. It is NOT the official Meccha Chameleon game and is NOT affiliated with the game's developers or publishers. The official game is sold on Steam.

One of the side projects under mecchachameleon.art is a small, open Godot 4 coloring game template that mimics the "match the room's RGB to stay hidden" mechanic of Meccha Chameleon. This post is a walkthrough of the design — not a copy of the official game's code, we do not have access to it.

The full source lives in our GitHub repo under `_research/godot-templates/coloring-game/`. It is published as a learning template, not a finished game.

WHAT THE TEMPLATE INCLUDES

- One scene: Main.tscn with a Player, a HidingSpot, and a RoundManager.
- player.gd — handles WASD movement and the player's current Color.
- hiding_spot.gd — exposes target_rgb: Color and match_threshold: float.
- round_manager.gd — picks a random spot, resets the player, and tracks per-round score.
- One resource file: default_env.tres so the project boots without manual setup.

The template is intentionally small — about 200 lines of GDScript and one scene. It is meant to be READ in 20 minutes, not played for 20 hours.

THE RGB-MATCHING MECHANIC

Each HidingSpot has a target_rgb (the color the player should match to stay hidden) and a match_threshold (how close the player's color needs to be). On round start:

1. The round manager picks a random spot.
2. The player moves (WASD) and presses Space to "paint" themselves with the current held color.
3. Once painted, the player's current_color is compared to the spot's target_rgb using a Euclidean distance in RGB space:

   func is_hidden(player: Color, spot: HidingSpot) -> bool:
       var d = sqrt(
           pow(player.r - spot.target_rgb.r, 2) +
           pow(player.g - spot.target_rgb.g, 2) +
           pow(player.b - spot.target_rgb.b, 2)
       )
       return d <= spot.match_threshold

4. A simple UI label shows the player's distance. When the distance drops below the threshold, the spot "accepts" the player and the round ends.

This is intentionally NOT a stealth-game mechanic. There is no line-of-sight, no AI hunter, no patrol path. It is a color-matching puzzle with movement layered on top.

GOTCHAS WE HIT

A few things that bit us during the port from Godot 3 to Godot 4:

- `Color` is no longer implicitly castable from a 3-tuple. In Godot 3 you could pass (1.0, 0.5, 0.0) and get a Color. In Godot 4 you must use Color(1.0, 0.5, 0.0, 1.0) or Color.html("#FF8000").
- `Input.is_action_just_pressed` is fine, but `Input.is_action_pressed` reads more cleanly inside `_physics_process`. Our first draft mixed the two and got frame-rate dependent behavior.
- `Color` comparison with `==` does an exact float compare and will almost never be true. Use the Euclidean distance shown above, or convert to a perceptual space (CIELAB) if you want better results.
- Resource files (.tres) need `ResourceSaver.save()` to be flushed before you re-import. We lost an hour to "my changes are gone" before noticing the editor had cached the old .tres.

WHAT IS DELIBERATELY NOT IN THE TEMPLATE

- No Meccha Chameleon assets, art, or sound. The template uses placeholder primitives (a colored square for the player, a colored rectangle for the spot). We will not redistribute the official game's art under any license.
- No multiplayer, no networking. Adding these would balloon the template past the "read in 20 minutes" budget.
- No third-party plugin dependencies. The template opens and runs in a stock Godot 4.2+ install.
- No analytics, no telemetry, no auto-update.

WHY WE PUBLISHED IT

Two reasons:

1. Learning is more fun with a real, runnable artifact. A "match the RGB" mechanic is small enough to grasp in an evening, but rich enough to teach input handling, scene composition, and resource management in Godot 4.
2. The Meccha Chameleon community on Steam and Reddit has been asking for a "how does the hiding mechanic actually work" explainer for a while. We can't answer that for the official game (we don't have the source), but we can answer it for a faithful, openly-licensed template.

HOW YOU CAN HELP

If you port the template to a new mechanic (timed rounds, two-player, color-blind mode), open a PR. We accept new HidingSpot subclasses, new round manager modes, accessibility improvements (high-contrast mode, color-blind-safe palettes), and translations of the README.

We do NOT accept PRs that re-skin the template with the official Meccha Chameleon game's art or name. The unofficial / fan-made positioning is non-negotiable.

Repo: https://github.com/zlc000190/mecchachameleon-art
Site: https://mecchachameleon.art