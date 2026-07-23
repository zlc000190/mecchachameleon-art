FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat git && corepack enable

# ── install dependencies ────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* source.config.ts next.config.mjs ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ── build (Next.js app + Colyseus server) ───────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm postinstall
RUN pnpm build && pnpm server:build

# ── production runner ───────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Next.js standalone output (self-contained, no pnpm install needed at runtime)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Colyseus server (compiled)
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/node_modules/colyseus ./node_modules/colyseus
COPY --from=builder /app/node_modules/@colyseus ./node_modules/@colyseus
COPY --from=builder /app/node_modules/uWebSockets.js ./node_modules/uWebSockets.js

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000 2567
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV CI=true

# Start Next.js standalone server + Colyseus server
CMD ["sh", "-c", "node server/dist/index.js & node server.js"]
