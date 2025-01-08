FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json pnpm-lock.yaml ./
RUN corepack disable && corepack enable && corepack prepare --activate pnpm@8.6.1

FROM base as installer
WORKDIR /app
COPY --chown=nodejs:nodejs . .
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Builder stage 
FROM base AS builder
WORKDIR /app
COPY --chown=nodejs:nodejs . .
COPY --chown=nodejs:nodejs --from=installer /app/node_modules ./node_modules
RUN npx prisma generate
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules
USER nodejs
EXPOSE 4005
ENTRYPOINT ["node", "dist/src/main.js"]
