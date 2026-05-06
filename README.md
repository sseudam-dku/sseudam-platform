# Sseudam

pnpm monorepo for the Sseudam web client and REST API server.

## Stack

- `apps/web`: Next.js 16, React 19, TypeScript 6, React Compiler, Tailwind CSS v4, PWA
- `apps/server`: NestJS 11 REST API, Prisma 7, PostgreSQL
- `deploy`: local PostgreSQL Docker Compose
- `.github`: CI workflow

## Getting Started

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
docker compose -f deploy/docker-compose.yml up -d
pnpm db:generate
pnpm dev
```

Web runs on `http://localhost:3000`.
Server runs on `http://localhost:4000`.
Swagger docs are available at `http://localhost:4000/docs`.

## Useful Commands

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test
pnpm db:migrate
pnpm db:studio
```
