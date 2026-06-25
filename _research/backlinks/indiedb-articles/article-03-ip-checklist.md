Reminder: Meccha Chameleon Art Lab is an unofficial, fan-made companion site. It is NOT the official Meccha Chameleon game and is NOT affiliated with the game's developers or publishers. The official game is sold on Steam.

When we started mecchachameleon.art, we wanted to publish Godot templates, color-matching scripts, and other small code artifacts that REFERENCE the Meccha Chameleon genre — without redistributing the official game's assets, art, or source code. This is the checklist we wish someone had handed us on day one.

It is not legal advice. It is a pragmatic list of habits that have kept our repo in good standing with the Meccha Chameleon community and the wider Godot community for the past year.

THE 7-QUESTION PRE-PUBLISH CHECKLIST

Before you push anything that mentions a commercial game, walk through this:

1. Is the artifact DERIVED FROM the game's code or assets?
   - If yes, STOP. You cannot publish derivatives of a commercial game's code or art under any license.
   - If no, you are publishing original code inspired by the genre, not a derivative. Continue.

2. Does the artifact include any of the game's art, sound, fonts, or trademarks?
   - If yes, strip them and replace with placeholders. Even one screenshot from the official game in your README is a risk — it implies endorsement.
   - If no, continue.

3. Does the artifact mention the game by name?
   - If yes, use the trademark disclaimer pattern: "Meccha Chameleon is a trademark of [holder]. This project is unofficial and fan-made. It is NOT affiliated with [holder]."
   - If no, you can drop the disclaimer.

4. Can the artifact run without any of the game's files?
   - If yes, you are in the clear.
   - If no, you are redistributing a partial copy, which is a much harder position to defend.

5. Is the artifact licensed?
   - If no, ADD an explicit license. Unlicensed code on GitHub is "all rights reserved" by default in most jurisdictions.
   - We use MIT for small templates.

6. Does the artifact use any third-party assets that are not under a permissive license?
   - Check Godot Asset Library terms, Kenney.nl terms, OpenGameArt licenses.
   - If you grabbed a CC-BY-NC asset, you cannot use it in a project with commercial potential.

7. Does the artifact include telemetry, analytics, or auto-update?
   - If yes, drop them for a fan-made project. Telemetry in particular creates a privacy surface fans do not expect from a "just my learning repo" project.

WHAT WE PUBLISH UNDER THIS CHECKLIST

| Artifact | Derived? | Game assets? | Runs standalone? | License |
| --- | --- | --- | --- | --- |
| Godot 4 coloring game template | No (original) | No (primitives) | Yes | MIT |
| Atlas data (50 hiding spots) | Original prose + screenshots we made | No | Yes | CC BY 4.0 |
| Curation script for HTML5 games | No | No | Yes | MIT |
| This blog post | No | No | Yes | CC BY 4.0 |

Everything passes all 7 questions.

WHAT WE DELIBERATELY DO NOT PUBLISH

- Decompiled or reverse-engineered Meccha Chameleon code. We don't have it, and we wouldn't publish it if we did.
- Asset rips (sprites, sound effects, music, fonts) from the official game.
- Trademark squatting. We do not register domain names containing "Meccha Chameleon" plus a generic suffix (.com, .net, .io). The only domain we own is .art, and it is explicitly framed as a fan-made lab.
- Paid courses, paid assets, or merch using the trademark. Free learning materials only.

WHAT TO DO IF A RIGHTS HOLDER ASKS YOU TO TAKE SOMETHING DOWN

- Comply quickly. Don't argue in public first.
- Archive the request (with timestamps) for your own records.
- If the request is mistaken, respond once, briefly, with the facts. Do not escalate to social media.
- After takedown, post a short public note that the artifact has been removed at the rights holder's request. This protects future contributors from replicating the same mistake.

HOW TO CONTRIBUTE

If you maintain a similar fan-made project and have additions to the checklist (especially jurisdictional notes for non-US contributors), open a PR against CONTRIBUTING.md. Anonymous contributions are welcome.

If you maintain a commercial game and want us to remove a reference to your title, email support@mecchachameleon.art. We respond within a few days.

Repo: https://github.com/zlc000190/mecchachameleon-art
Site: https://mecchachameleon.art