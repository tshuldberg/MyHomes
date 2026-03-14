# CLAUDE.md — HumanHomes

## Overview

HumanHomes is a full real estate operating system that democratizes homeownership. It replaces agents, MLS gatekeeping, and middlemen with direct buyer-seller connections, community verification, open market intelligence, and human-first home stories. Web + iOS + Android.

## Stack

- **Language:** TypeScript 5.9+ (full stack)
- **Web:** Next.js 15 (App Router, RSC, SSR/SSG/ISR)
- **Mobile:** React Native + Expo (SDK 54+, Expo Router, New Architecture)
- **API:** tRPC + Fastify
- **Database:** PostgreSQL + Drizzle ORM (PostGIS for geospatial, native FTS)
- **Auth:** Clerk (identity verification, multi-platform SDKs)
- **Real-time:** Supabase Realtime (MVP) > Ably (scale)
- **Chat:** Stream Chat SDK
- **Video:** Daily.co SDK
- **Search:** PostgreSQL FTS (MVP) > Meilisearch (scale)
- **Storage:** Cloudflare R2 (zero egress)
- **Jobs:** Inngest (durable workflows)
- **Maps:** react-map-gl + MapLibre GL (rendering) + Mapbox (geocoding)
- **Styling:** NativeWind v5 (Tailwind CSS cross-platform)
- **UI Components:** Gluestack UI v3
- **State:** Zustand (client) + TanStack Query (server)
- **Monorepo:** Turborepo + pnpm workspaces
- **Identity Verification:** Persona (startup program)
- **E-Signatures:** Dropbox Sign API
- **Public Records:** ATTOM Data API
- **Hosting:** Railway (MVP) > AWS (scale)

## TypeScript Requirement

- TypeScript-first across all apps and packages in this project.
- New runtime code should be .ts/.tsx with strict typing and no implicit any.
- Use .js/.cjs only where required by tooling or platform constraints.

## Standalone And Hub Module Parity (Critical)

- `MyHomes` is the canonical product source while it remains an active standalone workspace.
- `modules/homes` is a hub adapter and partial migration surface, not a full representation of the HumanHomes platform.
- Do not describe hub parity as complete unless the API, auth, chat, video, jobs, maps, and marketplace scope have been verified in the hub.
- When parity or archival status changes, update both `AGENTS.md` and `CLAUDE.md` in the same session.

## Agent Instructions and Tooling

- Persistent agent instructions are stored in both `AGENTS.md` and `CLAUDE.md`. Keep them in sync when rules change.
- Global Codex skills are sourced from `/Users/trey/.codex/skills`.
- In-repo skill snapshot is tracked in `.claude/skills-available.md`.
- Plugin/MCP availability and re-verification steps are tracked in `.claude/plugins.md`.
- Local execution allow-list settings live in `.claude/settings.local.json`.

## Key Commands

```bash
# Monorepo (from root)
pnpm install                   # Install all dependencies
pnpm dev                       # Run all apps in dev mode
pnpm build                     # Build all apps and packages
pnpm test                      # Run all tests
pnpm lint                      # Lint all packages
pnpm typecheck                 # Type check all packages

# Web app (apps/web/)
pnpm --filter web dev          # Next.js dev server
pnpm --filter web build        # Production build

# Mobile app (apps/mobile/)
pnpm --filter mobile start     # Expo dev server
pnpm --filter mobile ios       # Run on iOS simulator
pnpm --filter mobile android   # Run on Android emulator

# API (apps/api/)
pnpm --filter api dev          # Fastify + tRPC dev server
pnpm --filter api build        # Build API

# Database (packages/db/)
pnpm --filter db generate      # Generate Drizzle migrations
pnpm --filter db migrate       # Run migrations
pnpm --filter db push          # Push schema to database
```

## Architecture

```
humanhomes/
  apps/
    web/              # Next.js 15 (App Router) — primary web experience
    mobile/           # Expo (React Native + Expo Router) — iOS + Android
    api/              # Fastify + tRPC server — API layer
  packages/
    db/               # Drizzle ORM schema, migrations, seed
    shared/           # Shared types, Zod validators, business logic
    trpc/             # tRPC router definitions (shared between api and clients)
    ui/               # Shared UI components (NativeWind-styled, cross-platform)
    api-client/       # tRPC typed client for web and mobile
    config/           # Shared ESLint, TypeScript, Prettier configs
  docs/
    plans/            # Design documents, research, specs, roadmap
  turbo.json          # Turborepo pipeline config
  pnpm-workspace.yaml # Workspace definition
```

**Data flow:** Client > tRPC > Fastify > Drizzle > PostgreSQL (Supabase-managed)

**Key architectural decisions:**
- tRPC for end-to-end type safety (no REST/GraphQL for internal clients)
- Drizzle over Prisma for SQL control, PostGIS support, zero codegen
- Cloudflare R2 over S3 for zero-egress media storage
- Stream Chat SDK over custom messaging for moderation and offline support
- Resonance engine (private preference sorting) never filters results, only reorders

## Git Workflow

- **Branch naming:** `feature/`, `fix/`, `refactor/`, `docs/` prefixes
- **Commit format:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- **Default branch:** `main`
- **Merge strategy:** Squash merge to `main`

## Design Documents

All design documentation lives in `docs/plans/`:

| Document | Purpose |
|----------|---------|
| `2026-02-20-humanhomes-product-spec.md` | Authoritative product specification (start here) |
| `2026-02-20-humanhomes-design.md` | Original vision and mission document |
| `2026-02-20-humanhomes-features-and-flows.md` | Complete feature inventory and user journey flows |
| `2026-02-20-humanhomes-ux-design.md` | UX flows, wireframe concepts, interaction patterns, visual design |
| `2026-02-20-humanhomes-implementation-roadmap.md` | Technical feasibility, dependency graph, phased build plan, risk register |
| `2026-02-20-frontend-mobile-stack.md` | Frontend and mobile tech stack research |
| `2026-02-20-backend-api-stack.md` | Backend and API tech stack research |
| `2026-02-20-data-pipeline-infrastructure.md` | Data pipeline, infrastructure, and cost analysis |

## Revenue Model

Inverted marketplace: professionals (realtors, brokers, inspectors, attorneys) pay to be listed and respond to user requests. Core functionality (listing, searching, messaging, basic tools) is free for users. Additional revenue from premium analytics, AI pricing guidance, and optional closing coordination services.

## Key Design Principles

1. **Stories before statistics** — Home Story excerpts appear above beds/baths/sqft on listing cards
2. **Never subtract, always refine** — Resonance filters reorder results, never remove them
3. **People over properties** — Buyer/seller profiles are central to every interaction
4. **No middlemen** — Direct buyer-seller connection through the platform
5. **Anti-cookie-cutter** — Celebrate neighborhood character, yard space, walkability over density
6. **Collective paths to ownership** — Groups, friends, and communities deserve homeownership tools too
7. **Graceful transitions** — Aging homeowners deserve dignity, not pressure from flippers
8. **Private preferences, public respect** — Community filters are private and never create visible exclusion
9. **Warmth over efficiency** — Warm terracotta palette, serif headlines, generous spacing, no urgency

## File Ownership Zones (Parallel Agent Work)

| Zone | Owner | Files |
|------|-------|-------|
| Root configs | lead | `package.json`, `turbo.json`, `pnpm-workspace.yaml` |
| Web App | web-dev | `apps/web/**` |
| Mobile App | mobile-dev | `apps/mobile/**` |
| API Server | api-dev | `apps/api/**` |
| Database | db-dev | `packages/db/**` |
| Shared types | shared-dev | `packages/shared/**` |
| tRPC Router | trpc-dev | `packages/trpc/**` |
| UI Package | ui-dev | `packages/ui/**` |
| Tests | tester | `**/*.test.ts`, `**/*.test.tsx` |
| Docs | docs-dev | `CLAUDE.md`, `AGENTS.md`, `timeline.md`, `docs/**` |

## Agent Teams Strategy

When 2+ plans target this project with overlapping scope, use an Agent Team instead of parallel subagents. Custom agent definitions from `/Users/trey/Desktop/Apps/.claude/agents/` and `/Users/trey/Desktop/Apps/MyLife/.claude/agents/`:
- `plan-executor` -- Execute plan phases with testing and verification
- `test-writer` -- Write tests without modifying source code
- `docs-agent` -- Update documentation
- `reviewer` -- Read-only code review (uses Sonnet)

Agents working in different File Ownership Zones can run in parallel without conflicts. Agents sharing a zone must coordinate via the team task list.

## Important Notes

- **No MLS dependency.** All listings are user-generated. No MLS data import.
- **Fair Housing Act compliance is critical.** The resonance engine must be audited for proxy-discrimination.
- **State-specific legal templates** require attorney review. Launch with CA, TX, FL, NY, WA.
- **Price is not shown on listing cards.** This is an intentional design decision (stories over shopping).
- **First contact is structured.** Buyer profile is auto-attached. No anonymous inquiries.
- **Vouch limits.** Each user can provide max 10 vouches. Vouches expire after 2 years.
- **Group size limit.** Max 6 co-buyers per group (initial limit).

## Context7 — Live Documentation

When writing or modifying code that uses external libraries, automatically use Context7 MCP tools (`resolve-library-id` → `query-docs`) to fetch current documentation instead of relying on training data.

**Pre-resolved library IDs for this project:**
- Next.js: `/vercel/next.js`
- Expo: `/expo/expo`
- tRPC: `/trpc/trpc`
- Drizzle ORM: `/drizzle-team/drizzle-orm`
- Zod: `/colinhacks/zod`
- Supabase (Realtime): `/supabase/supabase`
- Clerk: `/clerk/javascript`
- TanStack Query: `/tanstack/query`
- Zustand: `/pmndrs/zustand`
- Vitest: `/vitest-dev/vitest`

Use when: implementing library APIs, upgrading dependencies, debugging API behavior, writing framework configuration.
Skip when: pure business logic, editing docs/config with no framework dependency.

## Change Tracking

Update `timeline.md` in the project root after every development session.


## Writing Style
- Do not use em dashes in documents or writing.


### Code Intelligence

Prefer LSP over Grep/Read for code navigation - it's faster, precise, and avoids reading entire files:
- `workspaceSymbol` to find where something is defined
- `findReferences` to see all usages across the codebase
- `goToDefinition` / `goToImplementation` to jump to source
- `hover` for type info without reading the file

Use Grep only when LSP isn't available or for text/pattern searches (comments, strings, config).

After writing or editing code, check LSP diagnostics and fix errors before proceeding.
