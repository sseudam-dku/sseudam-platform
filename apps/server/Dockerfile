FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Build stage
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/server/package.json ./apps/server/package.json

RUN pnpm install --frozen-lockfile --filter @sseudam/server... --ignore-scripts

COPY apps/server ./apps/server

RUN pnpm --filter @sseudam/server build

# Production stage
FROM node:24-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/package.json

RUN pnpm install --frozen-lockfile --filter @sseudam/server... --prod --ignore-scripts

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY apps/server/sql ./apps/server/sql

EXPOSE 4000

CMD ["node", "apps/server/dist/main.js"]
