# Meccha Chameleon Art Lab

> Unofficial fan-made browser demo gateway, Steam PC guide, camo lab, and
> map hiding spot companion for the [Meccha Chameleon](https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/)
> Steam game.

The site is **not** the official Meccha Chameleon game. It is a companion
site for players who want help finding hiding spots, picking paint colors,
and trying similar hide-and-seek / camouflage HTML5 games in the browser.

- Live site: https://mecchachameleon.art
- Source: https://github.com/zlc000190/mecchachameleon-art
- Built on: Next.js 16 + fumadocs-mdx + ShipAny template
- Stack: TypeScript, Tailwind, next-intl (en/zh), Turbopack

## Features

- **Landing page** with Steam CTA, non-official disclaimer, three-tier
  difficulty browser demos (Easy / Standard / Hard), Camo Lab preview, and
  the Map Atlas.
- **Map Atlas**: 5 maps × 10 hiding spots = 50 long-tail SEO entries, each
  with a screenshot, recommended paint RGB, difficulty, and hider tip.
- **Per-map page** (`/maps/[mapSlug]`) with a 10-spot explorer, ItemList
  JSON-LD, and OG metadata.
- **Demo gateway**: three third-party HTML5 hide-and-seek / camo games
  embedded via GameDistribution + GameMonetize. Each demo has an
  "Open in new tab" fullscreen fallback for when the iframe splash blocks.
- Bilingual: `en` (default) and `zh`.

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev          # http://localhost:3000
```

Required: Node 22, pnpm 10.

## Build and verify

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

The lint script is intentionally narrow (only the landing page, maps
page, and meccha blocks) because the ShipAny template ships a large
backlog of pre-existing lint issues in other blocks.

## Dokploy deployment

This repo ships with a `Dockerfile` that produces a Next.js standalone
build. The image runs on port 3000.

### 1. Point Dokploy at the repo

- Repo: `https://github.com/zlc000190/mecchachameleon-art`
- Branch: `main`
- Build method: `Dockerfile`
- Dockerfile path: `./Dockerfile`
- Port: `3000`
- Health check path: `/`

### 2. Environment variables

Dokploy will surface these as runtime / build-time env. The site does
**not** need a database, auth, payments, or email to run. Keep
`DATABASE_PROVIDER=sqlite` and never set a real `DATABASE_URL` if you
do not need the optional DB-backed features (chat, payments, user
accounts). Most visitors never hit those routes.

Minimum required (set in Dokploy "Environment"):

| Key | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://mecchachameleon.art` | Used in metadata, OG, JSON-LD, sitemap. |
| `NEXT_PUBLIC_APP_NAME` | `Meccha Chameleon Art Lab` | Brand string. |
| `NODE_ENV` | `production` | Already set in Dockerfile, but harmless to repeat. |
| `PORT` | `3000` | Already set in Dockerfile. |

Recommended (for SEO and self-description):

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_THEME` | `default` |
| `NEXT_PUBLIC_APPEARANCE` | `system` |

Generate fresh secrets only if you turn on auth/payments/email features:

```bash
python3 -c "import secrets; print('AUTH_SECRET=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('BETTER_AUTH_SECRET=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('RESEND_API_KEY=re_...')"
```

Do **not** commit those.

### 3. Domain and TLS

Point `mecchachameleon.art` (and `www.mecchachameleon.art`) at the
Dokploy service via your DNS provider. Let Dokploy provision the Let's
Encrypt certificate (or wire up Cloudflare proxy in front).

### 4. Post-deploy smoke test

```bash
curl -sI https://mecchachameleon.art/ | head -3
curl -s  https://mecchachameleon.art/maps/vintage-room | grep -c 'Hiding Spots'
```

The second command should print `1` or higher — it confirms a per-map
page is being SSG-rendered with the right H1.

## Repository layout

```
src/
  app/
    [locale]/
      (landing)/
        page.tsx                 # landing
        maps/[mapSlug]/page.tsx  # per-map page
  shared/blocks/meccha/
    atlas-data.ts                # 5 maps × 10 spots source data
    demo-frame.tsx               # 3-tier difficulty browser demo
    map-spots-explorer.tsx       # 10-spot lightbox on map pages
content/                         # MDX content (changelog, optional blog)
public/meccha/atlas/             # 50 hiding spot screenshots
```

## Disclaimer

The browser demos on the landing page are third-party HTML5 games
embedded from GameDistribution and GameMonetize. They are explicitly
**not** the official Meccha Chameleon game. The official game is sold
on Steam: https://store.steampowered.com/app/4704690/MECCHA_CHAMELEON/

## License

MIT for the custom meccha/ companion code. The ShipAny template portion
remains under its original ShipAny license (see `LICENSE`).
