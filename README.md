# NeighbourGrid

NeighbourGrid is a mobile-first neighbourhood hub for local conversations, trusted official
information, and opt-in neighbour-to-neighbour help. It is a HackCamp 2026 prototype—not an
emergency service or official alert system.

## Current status

`main` is at/after `1b1ce8d` with UI overhaul, Developer A platform/home, Help/Beacon (PR #2 +
authenticated lifecycle PR #5), and Communities (PR #4) merged. Developer A is the final
integration and presentation lead. **No new product features** in this pass.

| Lane | Status | Owner |
| --- | --- | --- |
| Platform / home / official updates | Merged (`feat/home-alerts`) | Developer A |
| Communities / posts / comments | Merged (`feat/communities`) | Developer B |
| Help / beacon / Gemini / n8n | Help lifecycle + authenticated realtime merged; Gemini/n8n deferred | Developer C |

Authenticated Help writes use server-checked lifecycle actions with a labelled local demo
fallback. The live two-user DeepSpace lifecycle **passed**. Remaining owner actions: Figma share
URL, deploy URL, optional Gemini/n8n later (see `PROJECT_STATUS.md` and `docs/DEMO_SCRIPT.md`).

## Local setup

Requirements: Node.js 22.15+ (or Node 24/26) and npm 11.6+.

```bash
git clone https://github.com/jashanbains-24/Hackcamp2026.git
cd Hackcamp2026
git switch main
git pull origin main
npm install
npm run dev
```

Open `http://localhost:8780`. `npm run dev` starts the mock-capable UI; `npm run dev:deepspace`
starts the full registered DeepSpace runtime (needed for live records + `/api/official-updates`).

No application secret is required for the manual help lifecycle. Gemini suggestions require the
server-only secret described below:

```bash
cp .env.example .env
```

## Stack

- DeepSpace 0.43 scaffold and local runtime
- React 19 + TypeScript + Vite
- React Router file-based routes
- Tailwind CSS 4 semantic theme tokens
- Lucide icons and accessible scaffold UI primitives
- Hono/Cloudflare Worker (official updates, Gemini, help actions, and records)

The technology decision and fallback threshold are recorded in `DECISIONS.md`.

The DeepSpace app registration is complete. Teammates who need to run the full runtime, manage
secrets, or deploy must sign in and be trusted DeepSpace collaborators. Collaborator access
includes plaintext access to every app secret; do not grant it merely for UI work.

When a feature developer needs DeepSpace access, the owner runs:

```bash
npx deepspace app collaborators add teammate@example.com
```

The teammate signs in with the invited email and accepts the emailed invitation, or runs:

```bash
npx deepspace auth login
npx deepspace app collaborators invites
npx deepspace app collaborators accept <app-id>
```

Success means the shared app appears in `npx deepspace app list` with role `collaborator`.

## Useful commands

```bash
npm run dev             # Local app at http://localhost:8780
npm run dev:deepspace   # Full SDK runtime after app registration
npm run lint
npm run type-check
npm run test:unit
npm run test:smoke      # Playwright UI smoke (needs Chrome + Vite/worker)
npm run test:e2e        # Authenticated multi-user tests; needs 2 local DeepSpace test accounts
SMOKE_STATIC=1 npm run test:smoke  # UI smoke against dist/client after build
npm run build
npx deepspace deploy
```

## Exports for Developers B and C

Import shared session/home helpers from:

```ts
import {
  useNeighbourGridSession,
  useHomeAggregates,
  useOfficialUpdates,
  neighbourgridCollectionNames,
} from '@/neighbourgrid/exports'
```

- Domain interfaces remain in `@/shared/types` (do not rename).
- Collection schemas live in `src/schemas/neighbourgrid-schema.ts` (Person A owns merges).
- Collections: `profiles`, `communities`, `memberships`, `posts`, `comments`, `help_items`,
  `help_responses`, `official_updates`.
- Live official feed: `GET /api/official-updates` (Surrey municipality RSS, ~15 min cache).

## Secure Gemini and n8n setup

Do not put real values in `.env`, `.env.example`, client code, `VITE_*`, chat, or commits. Do not
manually edit `.dev.vars`; DeepSpace regenerates it from the encrypted app store.

The Gemini endpoint is implemented. **Do not configure it for the presentation pass** unless the
owner explicitly resumes it. When ready, run locally from the repository:

```bash
read -s GEMINI_API_KEY
printf 'GEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" | npx deepspace secrets upload -
unset GEMINI_API_KEY
npx deepspace secrets list
```

Success means `GEMINI_API_KEY` appears by name in the masked list. Restart
`npm run dev:deepspace`; after a production secret change, redeploy. Server code reads only
`env.GEMINI_API_KEY`.

When the n8n account and server workflow are ready, use the same pattern with
`N8N_WEBHOOK_URL`. Keep the webhook server-side and send only anonymized, replay-safe demo events.

## Deploy (owner)

Exact steps live in [`docs/DEMO_SCRIPT.md`](./docs/DEMO_SCRIPT.md). Summary:

```bash
git switch main && git pull origin main
npm install
npm run type-check && npm run lint && npm run test:unit && npm run build
npx deepspace auth login   # if needed
npx deepspace deploy
```

Record the live `*.space` URL in this README and `PROJECT_STATUS.md`. Do not upload Gemini/n8n
secrets as part of this deploy.

## Demo and safety notes

- `/demo` redirects to `/app?demo=1`.
- Signed-out `/app` browsing uses a fenced Maya DEMO account unless the visitor leaves demo mode.
- Maya and seed community/help activity are fictional.
- Official updates use the verified BC Hydro Surrey municipality feed and never claim Newton
  specificity without verified detail.
- Official resource cards link directly to BC Hydro, PreparedBC, or EmergencyInfoBC.
- Demo beacons remain browser-local and contact nobody. Authenticated live beacons create only an
  in-app DeepSpace record; they do not contact emergency services or external broadcasters.
- No precise location, phone number, or sensitive personal information is collected.
- Pitch script + backup checklist: [`docs/DEMO_SCRIPT.md`](./docs/DEMO_SCRIPT.md).
- Devpost screenshots: [`docs/presentation/`](./docs/presentation/).

## Project map

- `src/pages/index.tsx` — public landing
- `src/pages/(app)/app/` — app shell routes
- `src/components/neighbourgrid.tsx` — brand, shell, and shared UI primitives
- `src/neighbourgrid/` — A-owned session/home/official hooks and B/C exports
- `src/features/help/` — help UI adapter, demo fallback, and lifecycle presentation
- `src/actions/help-actions.ts` — authenticated, server-checked help lifecycle
- `src/schemas/neighbourgrid-schema.ts` — product collections + RBAC
- `src/shared/types.ts` — stable shared contracts
- `src/shared/demo-data.ts` — centralized fictional demo data
- `src/server/official-updates.ts` — BC Hydro Surrey RSS fetch/parse/cache
- `TEAM_HANDOFF.md` — file ownership and the three workstreams
- `PROJECT_STATUS.md` — current stage, blockers, test evidence, and next safe handoff

## Team workflow

Feature lanes A/B/C are merged. Prefer small integration PRs on branches like
`chore/final-integration` rather than editing `main` directly.

```bash
git switch main
git pull origin main
npm install
npm run build
git switch -c chore/final-integration
```

Do not silently rename shared interfaces. Coordinate shared schema/auth changes through Person A.
Every coding agent must read `AGENTS.md` and update `PROJECT_STATUS.md` before handing work to
another agent.

## Design file

Implementation system of record: [`DESIGN.md`](./DESIGN.md). Developer A/UI lead also owns the
shared Figma file. Frame inventory and create/share steps:
[`docs/FIGMA_HANDOFF.md`](./docs/FIGMA_HANDOFF.md).

**Figma:** Pending share URL — create `NeighbourGrid — HackCamp 2026`, turn on link sharing, paste
here and in `PROJECT_STATUS.md`.
