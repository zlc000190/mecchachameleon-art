# Deploy — MECCHA CHAMELEON (Next.js + Colyseus)

## Architecture
- **Next.js** serves the game UI/3D client on **port 3000**.
- **Colyseus** (authoritative real-time server) runs in the **same container** on **port 2567**.
- The browser client auto-derives the Colyseus URL from the page origin
  (`wss://<host>:2567` in prod, `ws://localhost:2567` in dev) — no build-time
  config needed. Optionally override with `NEXT_PUBLIC_COLYSEUS_URL`.

> Current multiplayer scope: **Phase A** — players join a shared room and see
> each other's positions/colors (lerp-interpolated). No gameplay rules yet
> (seeking/catching, paint syncing) — those are later phases.

## Local development
```bash
pnpm install
pnpm dev:all        # Next (3001) + Colyseus (2567) together
```
Open **two** browser tabs at `http://localhost:3001/game/play`, pick a role in
each, and you should see the other player's white character move in real time.

Run the Colyseus server alone:
```bash
pnpm server:build   # tsc -> server/dist
pnpm server:start   # node server/dist/index.js
```

Verify the multiplayer wire (joins, position sync):
```bash
node_modules/.bin/tsx scripts/test-client.ts
```

## Docker (single container, two processes)
```bash
docker build -t meccha-chameleon .
docker run -p 3000:3000 -p 2567:2567 meccha-chameleon
```
- `pnpm build` + `pnpm server:build` run at image build time.
- Container entrypoint starts Colyseus (bg) and Next (fg).
- **Both 3000 and 2567 must be reachable** for multiplayer to work.

## Hosting (Railway / Fly / Render / VPS)
1. Build the image (above) or let the platform run `pnpm build && pnpm server:build`.
2. Expose **both** ports:
   - `3000` → web
   - `2567` → Colyseus WebSocket
3. The client auto-connects to `wss://<your-host>:2567`.

### If you can only expose one port (reverse proxy)
Proxy `/colyseus` (or any path) → container `2567`, then set at build/runtime:
```
NEXT_PUBLIC_COLYSEUS_URL=wss://<your-host>/colyseus
```
Colyseus accepts a path-based endpoint.

## Notes
- `server/dist` is a build artifact (gitignored); rebuild with `pnpm server:build`.
- Schema uses `@colyseus/schema` `@type()` decorators; the server is compiled
  with `tsc` (not tsx) because tsx mis-applies the decorators under Node 24.
- `experimentalDecorators: true` + `target: ES2017` in `server/tsconfig.json`
  are required for the decorators to wire up `$childType`/change-tracking.
