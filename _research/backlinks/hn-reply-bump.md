Quick bump since this got flagged shortly after posting — wanted to clarify a few things that came up implicitly:

1. **Not affiliated with the developers of any of the games linked.** Every page credits the original developer prominently and links to their itch.io / Steam page. I never re-host the games; everything is iframed from itch.io's HTML5 embed, so the original developer keeps all the visit / download traffic.

2. **44 free games are all from itch.io devs who opted into HTML5 embeds.** I scraped itch.io's `free + platform-web` tags across godot / unity / gamemaker / pico-8 / gb-studio / bevy / renpy / rpg-maker / source-code and verified each one has a `load_iframe_btn` (i.e. is HTML5 web playable).

3. **The 4 source-code projects are all on itch.io under permissive licenses** — Learn Godot's GDScript From Zero (GDQuest, MIT), Godot 4 Beginner Pack (godotexamplehub), Godot Coloring Game Template (godotexamplehub), Wordle English (recepekmekci, MIT). If any of the original devs would rather I not link, I'm happy to remove — just drop a line.

Happy to answer technical questions about the curation pipeline (it's a headless-Chrome verifier that checks `load_iframe_btn` + price badge per game, ~3 sec per game) or the stack (Next.js shipany template, Dokploy deploy).

Stack: https://github.com/shipanyteam/shipany-template-two (Next.js + Tailwind + shadcn)