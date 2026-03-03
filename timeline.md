# HumanHomes — Timeline

## 2026-02-20 — Project Inception & Phase 1 Foundation

### Design & Planning
- Created GitHub repo at `tshuldberg/HumanHomes`
- Brainstormed full product vision: mission-driven real estate OS eliminating middlemen
- Expanded scope from listing platform to full MLS replacement (comps, offers, documents, verification)
- Spawned 3-agent research team (frontend, backend, infrastructure) for tech stack evaluation
- Incorporated raw feature brainstorm: inverted revenue model, anti-nepotism inspectors, collective purchasing, baby boomer transition, community affinity filters, legislative strategy
- Spawned 4-agent planning team (feature-organizer, product-designer, developer, tech-writer)
- Produced 8 design documents covering product spec, features/flows, UX design, implementation roadmap, and tech stack research
- Final product spec: 13 feature areas, 70+ features, 5 user journeys, 8-phase build plan (72 weeks)

### Phase 1 Build — Foundation (Monorepo + Auth + Core UI)
- Spawned 4-agent build team (scaffolder, backend-dev, web-dev, mobile-dev)
- **Scaffolder**: Created Turborepo + pnpm workspaces monorepo (71 files), shared TypeScript/ESLint/Prettier configs
- **Backend-dev**: Drizzle ORM schemas (users, profiles), tRPC routers (health, user), Fastify server with Clerk JWT auth, environment validation
- **Web-dev**: Next.js 15 App Router with HumanHomes design system (terracotta/sage/warm-white palette, Lora serif), landing page with story cards, authenticated layout with nav, Discover/Messages/Profile pages, Clerk sign-in/sign-up
- **Mobile-dev**: Expo with Expo Router, tab navigation, Clerk auth screens, NativeWind styling, discover/profile screens
- **Integration fixes**:
  - NativeWind v5 → v4.2.2 (v5 doesn't exist yet)
  - Added `nativewind-env.d.ts` for className type augmentation
  - Removed unused React imports (React 19 jsx transform)
  - Fixed drizzle.config.ts rootDir issue in packages/db
  - Fixed Clerk `verifyToken` API (standalone export, not ClerkClient method)
  - Fixed tRPC Fastify adapter implicit `any` type
  - Added `@types/node` to mobile tsconfig for `process.env`
  - Fixed tRPC api-client TS2742 portable type issue with explicit `CreateTRPCReact` annotation
  - Created `Providers` client component for graceful Clerk fallback during SSG
  - Added `force-dynamic` to all auth-gated pages for clean static/dynamic split
- **Build verification**: All 13 typecheck tasks pass, all 7 build tasks pass (packages + apps)

## 2026-02-26 — Dev Workflow Fixes

### Entry 2.1 — Root Dev Startup and Mobile Metro Resolution
**Phase:** Developer Experience / Local Runtime
**What happened:** Fixed root `pnpm dev` startup by installing `turbo` at the workspace root, then fixed mobile Metro ESM resolution by changing the import to `expo/metro-config.js`.
**Decision:** Keep root scripts (`turbo run ...`) and enforce local tool availability via root `devDependencies` so startup does not depend on globally installed CLIs. Keep Metro config in ESM-safe form for current Node/Expo resolution behavior.
**Files created/modified:** `package.json`, `pnpm-lock.yaml`, `apps/mobile/metro.config.js`, `timeline.md`

#### Confusion Point 1 (re-review of 2026-02-20 Integration fixes): Toolchain compatibility drift
**Updated finding:** Prior fixes addressed framework API mismatches; this session confirmed the same risk exists for tooling resolution and module specifier format. Pinning required CLIs in the workspace and using explicit ESM specifiers prevented repeat startup failures.

**Skill opportunity:** Add a reusable "dev startup doctor" script that checks required root CLIs, validates env vars, and probes key ports before running `turbo`.

### Next Steps
- Add a `.env` setup for local API runtime (`DATABASE_URL`, `CLERK_SECRET_KEY`) and verify API health endpoint on startup.
- Decide whether root `pnpm dev` should be fail-fast when API env vars are missing, or allow web/mobile to continue while API retries.
- Silence the Next.js workspace-root warning by setting `turbopack.root` in web config.

## 2026-03-02 - Discover Neighborhood Navigation Fix

### Entry 3.1 - `/discover` CTA Routing
**Phase:** Web App / UX Bug Fix
**What happened:** Fixed the non-functional `Explore neighborhood` action on `/discover` by converting each neighborhood card into a real link and adding a matching dynamic detail route.
**Decision:** Use slug-based URLs (`/discover/[slug]`) so card navigation is stable, readable, and testable. Extract shared neighborhood data into a single module used by both the list page and detail page to avoid data drift.
**Files created/modified:** `apps/web/src/app/(app)/discover/page.tsx`, `apps/web/src/app/(app)/discover/neighborhood-data.ts`, `apps/web/src/app/(app)/discover/[slug]/page.tsx`, `apps/web/test/full-buttons-and-pages.behavior.test.tsx`, `timeline.md`

### Verification
- `pnpm --filter @humanhomes/web test -- test/full-buttons-and-pages.behavior.test.tsx`
- `pnpm --filter @humanhomes/web test -- test/pages-and-data-loads.test.tsx`
