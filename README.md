# NeighbourGrid

NeighbourGrid is a mobile-first neighbourhood hub for local conversations, trusted official
information, and opt-in neighbour-to-neighbour help. It is a HackCamp 2026 prototype—not an
emergency service or official alert system.

## Current status

**Live app:** [hackcamp2026.app.space](https://hackcamp2026.app.space)

`main` includes PR #11 (`7b79a56`), with UI overhaul, platform/home, Communities, Help/Beacon,
authenticated two-user Help realtime, presentation assets, the Home Neighbourhood Guide, and the
anonymous n8n help-request event. The deployed source is the claimed GitHub repository
`jashanbains-24/hackcamp2026`. Production still needs a redeploy before the live site shows the
Guide or sends n8n events.

| Lane | Status | Owner |
| --- | --- | --- |
| Platform / home / official updates | Merged (`feat/home-alerts`) | Developer A |
| Communities / posts / comments | Merged (`feat/communities`) | Developer B |
| Help / beacon / Gemini / n8n | Help, Home Guide, and n8n event merged; production redeploy pending | Developer C |

Authenticated Help writes use server-checked lifecycle actions with a labelled local demo
fallback. The live two-user DeepSpace lifecycle passed. Production landing, demo home,
Communities, and the real BC Hydro Surrey feed were verified. The Home Guide is now on `main`:
an authenticated, read-only Gemini assistant. A signed-in local answer passed on the free plan.
Figma and the production redeploy remain pending. The local n8n execution passed.

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

Gemini powers two server-only features: editable request clarity and the authenticated
**Neighbourhood Guide** on Home. The Guide receives a bounded snapshot of community activity the
user can already see and the existing BC Hydro server feed. Live Google Search is optional.
A no-billing Gemini plan does not include Search on Gemini 3, so the Guide answers without it
and says so. It is read-only and never publishes or mutates records.

The default model is `gemini-3.5-flash-lite`. `gemini-2.5-flash` returns 404 for new API keys.
A no-billing Google AI project can use only whatever free
quota Google currently grants that project/model; exact limits vary and are shown in AI Studio.
When quota is exhausted, requests fail rather than silently becoming paid, provided no billing
account is linked.

To configure the key, run these commands locally from the repository. Do not paste the key into
chat:

```bash
npx deepspace auth login
read -s GEMINI_API_KEY
printf 'GEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" | npx deepspace secrets upload -
unset GEMINI_API_KEY
npx deepspace secrets list
```

Success means `GEMINI_API_KEY` appears by name in the masked list—its value remains hidden. Then:

```bash
npm run dev:deepspace
```

Sign in, open Home, and ask “Are there current power outage updates?” with web search enabled.
Success means the answer appears with clickable sources. After the feature branch is merged, run
`npx deepspace deploy` so the production Worker receives the secret-backed feature. Server code
reads only `env.GEMINI_API_KEY`.

There is no direct X integration. Google Search may surface a public X page, but NeighbourGrid
must not claim complete or real-time X access without a separate authorized X API integration.

n8n receives one anonymous event after a verified help request is saved. Store both secrets the
same way, without pasting them into chat:

```bash
read -s N8N_WEBHOOK_URL
printf 'N8N_WEBHOOK_URL=%s\n' "$N8N_WEBHOOK_URL" | npx deepspace secrets upload -
unset N8N_WEBHOOK_URL
read -s N8N_WEBHOOK_TOKEN
printf 'N8N_WEBHOOK_TOKEN=%s\n' "$N8N_WEBHOOK_TOKEN" | npx deepspace secrets upload -
unset N8N_WEBHOOK_TOKEN
npx deepspace secrets list
```

Use the n8n **Production URL** and the Header Auth value. Restart `npm run dev:deepspace` after
uploading. Server code reads only `env.N8N_WEBHOOK_URL` and `env.N8N_WEBHOOK_TOKEN`.

## Deploy (owner)

Exact steps live in [`docs/DEMO_SCRIPT.md`](./docs/DEMO_SCRIPT.md). Summary:

```bash
git switch main && git pull origin main
npm install
npm run type-check && npm run lint && npm run test:unit && npm run build
npx deepspace auth login   # if needed
npx deepspace deploy
```

Record the live `*.space` URL in this README and `PROJECT_STATUS.md`. Upload only integrations
that were tested; n8n remains deferred.

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
