FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable

# ── install dependencies ────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# ── build (Next.js app + Colyseus server) ───────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js production build AND compile the Colyseus server (tsc -> server/dist)
RUN pnpm build && pnpm server:build

# ── production runner ────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

RUN chown -R nextjs:nodejs /app
USER nextjs

# Next.js (web) + Colyseus (real-time multiplayer) both run in this container.
EXPOSE 3000 2567
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Colyseus is backgrounded; Next.js is the foreground process.
# The client derives the Colyseus URL from the page origin (wss://host:2567),
# so both ports must be reachable in production.
CMD ["sh", "-c", "node server/dist/index.js & exec pnpm start"]
