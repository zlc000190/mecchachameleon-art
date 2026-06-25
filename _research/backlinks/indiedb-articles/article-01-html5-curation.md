Reminder: Meccha Chameleon Art Lab is an unofficial, fan-made companion site. It is NOT the official Meccha Chameleon game and is NOT affiliated with the game's developers or publishers. The official game is sold on Steam.

When we started building mecchachameleon.art, we wanted a "play in your browser" gateway that did not ask visitors to sign up, install anything, or hand over their email. Just click, play, leave. Here is how we got from zero to 44 embeddable HTML5 games and what we filtered out.

WHY A BROWSER DEMO GATEWAY AT ALL

The Steam version of Meccha Chameleon is great if you have ten minutes and a desktop. Many visitors land on the site from a phone, a school computer, or a restrictive network where Steam is blocked. A browser demo gateway gives them a way to feel out the genre — hide-and-seek, camouflage, color matching — without friction.

We are clear in the UI that these are third-party HTML5 games, not the official Meccha Chameleon game. The disclaimer is on the landing page, in the README, and in every embed. We will not pass off someone else's game as the real thing.

WHERE THE 44 CAME FROM

We pulled from two embed-focused aggregators:

- GameDistribution — white-label embed SDK used by many publishers. Each game has a permanent embed URL and an iframe-friendly policy.
- GameMonetize — similar model, different catalog. Some overlap with GameDistribution but enough unique titles to be worth pulling.

We also cherry-picked a handful of itch.io HTML5 titles (the ones with `kind: html5` in their manifest and a working iframe embed URL). These became the source-code candidates for a separate walkthrough.

THE FILTER WE APPLIED

Out of roughly 600 candidates, we kept 44. The filter is brutal on purpose:

1. Free to play, no login. If the game shows a paywall, signup modal, or "connect your Google account" in the first 10 seconds, it is out.
2. Embeddable in an iframe with `allow="gameplay"` only. No remote scripts outside the embed domain, no `X-Frame-Options: DENY`.
3. Permanent URL. No "this is a limited time demo" landing pages that 404 after a campaign ends.
4. Not a Meccha Chameleon clone. Some HTML5 games literally copy the Steam game's name and art and pretend to be the official browser version. We reject these on principle — they hurt the real game's reputation and are confusing for visitors.
5. Genre fit. Hide-and-seek, camouflage, color matching, find the hidden object, spot the difference. We do not include match-3, runners, or hypercasual clickers even if they are well made.
6. Loads in under 5 seconds on a mid-range phone. Tested on a throttled Slow 4G profile. Anything over 5s goes.

The 44 that pass are tagged Easy / Standard / Hard on the landing page.

WHAT WE DELIBERATELY DID NOT DO

We did NOT:

- Re-upload or re-host any third-party game's assets, art, or code. Every embed is an iframe to the publisher's CDN.
- Add tracking pixels, ad networks, or analytics inside the embeds. The landing page has none either.
- Strip or modify the publisher's branding inside the iframe.
- Hide the fact that the embedded games are not the official Meccha Chameleon game.

HOW YOU CAN HELP

If you know of a free HTML5 hide-and-seek / camouflage game that runs in the browser without a login, has a permanent embeddable URL, and is not a Meccha Chameleon clone — open an issue on GitHub with the link, a screenshot, and one sentence on why it fits.

Anonymous submissions are welcome.

Repo: https://github.com/zlc000190/mecchachameleon-art
Site: https://mecchachameleon.art