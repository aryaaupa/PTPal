# Vitalize PT — Make rehab feel like progress

Monorepo with API, clinician web, patient mobile, and shared packages.

## Quick start

1. Install pnpm and docker
2. Install deps

```bash
pnpm i
```

3. Start database and redis

```bash
pnpm db:up
```

4. Setup API

```bash
cp apps/api/.env.example apps/api/.env
pnpm --filter @vitalize/api prisma generate
pnpm --filter @vitalize/api migrate
pnpm --filter @vitalize/api seed
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:4000/health

## Apps
- apps/api: Fastify + Prisma + PostgreSQL + Redis
- apps/web: Vite React clinician portal
- apps/mobile: Expo React Native patient app
- apps/site: Static marketing site

## Design system
- packages/ui: tokens, components, motion, charts
- packages/config: color tokens, feature flags, env parsing
- packages/models: Zod models and adaptive engine

## Privacy & Security
- On-device CV only; no frames uploaded
- JWT auth; RBAC per route
- Encrypted in transit; storage via Postgres and Prisma

## Testing
- Run package-level tests via `pnpm test`

## License
MIT
