# Contributing to Meccha Chameleon Art Lab

Thanks for stopping by. This document explains how you can help us build a
better unofficial, fan-made companion site for [Meccha Chameleon on Steam](https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/).

> **Reminder:** This site is unofficial and fan-made. It is **not** the
> official Meccha Chameleon game and is **not** affiliated with the
> game's developers or publishers. The official game is sold on Steam.
> Use this site for learning, experimentation, and community fun. Don't
> pass off content here as official.

---

## What we are building

We curate two things:

1. A **map atlas** of hiding spots for Meccha Chameleon (5 maps × 10 spots
   = 50 entries), each with a screenshot, recommended paint RGB,
   difficulty, and a tip.
2. A **browser demo gateway** that links to third-party HTML5
   hide-and-seek / camouflage games you can try in your browser without
   installing anything.

Everything on the site is original prose or fair-use commentary. We do
**not** redistribute game assets, art, or source code from the official
Meccha Chameleon game.

---

## How you can contribute

You don't need to be a coder. Pick any of these:

### 1. Add or fix a hiding spot (easiest)

Open `src/shared/blocks/meccha/atlas-data.ts` and find the map you want
to edit. Each spot has:

```ts
{
  id: 'vintage-room-01',
  title: 'Behind the standing lamp',
  rgb: '#7B5E3C',
  difficulty: 'easy',
  tip: 'Match the lamp shade. The bot checks this corner last.',
}
```

To add a spot:

1. Pick the next free `id` (e.g. `vintage-room-11`).
2. Add a screenshot to `public/meccha/atlas/<map>/<id>.png` (16:9, ~600px
   wide is fine).
3. Add the entry to the matching map's array.
4. Open a PR.

### 2. Improve a map page

Map pages are server-rendered from `atlas-data.ts`. If a tip is wrong or
a screenshot is outdated, fix it in the data file and open a PR.

### 3. Suggest a browser demo

We link out to (we do **not** host) third-party HTML5 games. If you know
of a good hide-and-seek / camouflage game that:

- is free to play,
- runs in the browser without a login,
- has a permanent, embeddable URL, and
- is not a clone of Meccha Chameleon selling itself as the real thing,

open an issue with the link, a screenshot, and one sentence on why it
fits. We will review and add it if it passes.

### 4. Translate

The site ships in `en` (default) and `zh`. If you want to add a new
locale:

1. Copy `src/i18n/messages/en.ts` to `<locale>.ts`.
2. Translate every string. Keep JSON-LD keys (`name`, `description`) in
   the source language; translate display strings only.
3. Add the locale to `src/i18n/config.ts` and `next-intl` middleware.
4. Open a PR.

### 5. Code / infra

For non-trivial code changes, please open an issue first describing:

- the problem,
- the change you want to make, and
- how you tested it locally (`pnpm lint`, `pnpm build`).

We will respond within a few days.

---

## Anonymity and identity

You can contribute fully **anonymously** if you prefer. We will not:

- publish your real name, email, or social handles in the site or repo,
- require you to add a `Signed-off-by:` trailer,
- mention your contribution in any external promo without your explicit
  OK.

Just open the PR from a GitHub account that does not link to your real
identity. If you want to be credited (e.g. "spot contributed by @handle"
on the map page), say so in the PR description and we will add it.

We **will** publicly credit contributors who opt in via the in-repo
`CONTRIBUTORS.md` file. See the file for the current list.

---

## What we will **not** accept

To keep the site useful and out of IP trouble, please do not open PRs
that:

- copy assets, art, music, or source code from the official Meccha
  Chameleon game,
- add a third-party game that clones Meccha Chameleon and markets itself
  as the real thing,
- add tracking scripts, ad networks, or any code that phones home
  without a clear opt-in,
- add SEO spam, doorway pages, or hidden links to other domains,
- change the unofficial / fan-made disclaimer,
- remove the GitHub source link from the site footer.

We reserve the right to close PRs and ban accounts that violate these.

---

## Code of conduct (short version)

- Be kind. Disagreement is fine; personal attacks are not.
- No harassment, doxxing, or hateful content.
- Assume good faith. Ask before assuming the worst.
- If something feels off, open an issue or email
  `support@mecchachameleon.art`.

---

## License

By contributing, you agree that your contributions are licensed under
the same MIT terms as the rest of the custom meccha/ companion code
(see `LICENSE`). The ShipAny template portion is **not** covered by
this and stays under its original license.

---

## Questions?

Open an issue or email `support@mecchachameleon.art`. We read every
message.