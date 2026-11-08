# NeighbourGrid project status

**Last updated:** 2026-11-07, 7:45 p.m. Vancouver time
**Current stage:** Final integration / presentation prep (no new product features)
**Shared branch:** `main` at `1b1ce8d` (Help live-rehearsal merge); active work on `chore/final-integration`
**Active lane in this checkout:** Developer A — final integration and presentation lead
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`
**UI overhaul merge:** `ed5c7ba Merge pull request #1 from jashanbains-24/feat/ui-overhaul`
**Help/beacon merge:** `387828d Merge pull request #2 from jashanbains-24/feat/help-beacon`
**Communities merge:** `c212d00 Merge pull request #4 from jashanbains-24/feat/communities`
**Help live rehearsal merge:** `1b1ce8d Merge pull request #5 from jashanbains-24/test/help-live-rehearsal`

## Verified baseline

- UI overhaul, Developer A platform/home, Developer B Communities, and Developer C Help/Beacon
  are **merged into `main`** (at/after `1b1ce8d`).
- Authenticated two-user DeepSpace Help realtime (create → respond → accept → resolve, both
  sessions without refresh) **passed** and is merged.
- Gemini endpoint exists; secret upload and live call remain **intentionally deferred**.
- n8n remains **intentionally deferred** until after deployment.
- Final integration branch updates stale docs/copy, runs full verification, captures Devpost
  screenshots, and prepares demo/deploy instructions.

## Current lanes (post-merge)

- **Developer A:** final integration, visual QA, Figma share URL, deploy steps, presentation.
- **Developer B:** Communities merged via PR #4 — no further feature work expected.
- **Developer C:** Help/Beacon + authenticated lifecycle merged via PR #2/#5 — Gemini/n8n deferred.

**Figma URL:** Pending owner create/share — follow [`docs/FIGMA_HANDOFF.md`](./docs/FIGMA_HANDOFF.md).
Paste the share link here and in `README.md` when ready.

### Refreshing this checkout

```bash
git switch main
git pull origin main
npm install
npm run build
git switch -c chore/final-integration   # or pull the open PR branch
```

## B/C import contract (stable)

```ts
import {
  useNeighbourGridSession,
  useHomeAggregates,
  useOfficialUpdates,
  neighbourgridCollectionNames,
  NeighbourGridSessionProvider,
} from '@/neighbourgrid/exports'
```

| Collection | Name | Notes |
| --- | --- | --- |
| UserProfile | `profiles` | `userId` userBound; `UserProfile.id` === auth user id |
| Community | `communities` | Admin write; public read |
| Membership | `memberships` | uniqueOn user+community; userBound |
| Post | `posts` | `authorId` userBound; author own update/delete |
| Comment | `comments` | `authorId` userBound |
| HelpItem | `help_items` | `authorId` userBound; member read; writes via server actions |
| HelpResponse | `help_responses` | `responderId` userBound; member read; writes via server actions |
| OfficialUpdate | `official_updates` | Admin write; live path prefers API |

Live official feed: `GET /api/official-updates`
Verified Surrey RSS: `https://www.bchydro.com/rss/outages/surrey.xml`

## Sponsor/integration plan

- **DeepSpace:** primary auth, records, permissions, realtime, secrets, and deployment platform.
- **Gemini API:** endpoint implemented; key setup deferred by owner.
- **n8n:** deferred until after deploy; does not block presentation.
- **Best Design:** Figma share link still required (frame inventory in `docs/FIGMA_HANDOFF.md`).
- **Auth0 and unrelated sponsor services:** intentionally excluded.

## Current blockers and user actions

1. **Create/share the Figma file** (≈10 min — see `docs/FIGMA_HANDOFF.md`):
   1. Create `NeighbourGrid — HackCamp 2026` in Figma.
   2. Add Tokens / Components / Mobile 390 / Desktop / States frames (or paste
      `docs/presentation/` screenshots onto frames).
   3. Enable link sharing (view).
   4. Paste the URL into **Figma URL** above and `README.md` → Design file.
2. **Deploy** (Developer A / owner — do **not** configure Gemini or n8n yet):
   1. `git switch main && git pull origin main && npm install`
   2. `npm run type-check && npm run lint && npm run test:unit && npm run build`
   3. `npx deepspace auth login` (if needed) → `npx deepspace deploy`
   4. Record the live `*.space` URL in README + this file.
3. **Gemini / n8n:** remain deferred. When desired, use only the secure steps in `README.md`.

## Next safe handoff

Merge `chore/final-integration` → `main`. Owner creates Figma share URL and runs `npx deepspace
deploy`. Use `docs/DEMO_SCRIPT.md` for the 3–4 minute pitch and backup path. Do not enable
Gemini/n8n for the presentation unless explicitly verified afterward.

## Session log template

```text
### YYYY-MM-DD HH:MM — Developer [A/B/C], branch `<branch>`
- Completed:
- Notable files:
- Tests run:
- Service/schema/config changes:
- Blockers or user action:
- Next task / handoff:
```

## Session history

### 2026-11-07 19:45 — Developer A, branch `chore/final-integration`

- Completed: Synced `main` @ `1b1ce8d`; created final-integration branch; replaced stale Home empty
  posts copy (no more “Developer B’s lane”); refreshed README/PROJECT_STATUS/TEAM docs; added
  demo script, Figma handoff, presentation screenshots + capture script; visual QA at 390px and
  desktop for landing/home/communities/help/beacon/activity/profile.
- Notable files: `src/pages/(app)/app/index.tsx`, `docs/DEMO_SCRIPT.md`, `docs/FIGMA_HANDOFF.md`,
  `docs/presentation/*`, `scripts/capture-presentation-shots.mjs`, `README.md`, `PROJECT_STATUS.md`.
- Tests run: `type-check` pass; `lint` pass; `test:unit` 15/15 pass; `build` pass;
  `SMOKE_STATIC=1 npm run test:smoke` 6/6 pass; Playwright `tests/help.spec.ts` +
  `tests/communities.spec.ts` 7/7 pass.
- Service/schema/config changes: none. Gemini/n8n not configured.
- Blockers or user action: owner must create/share Figma URL; owner must deploy and record live
  URL. Gemini/n8n stay deferred.
- Next task / handoff: merge this PR; owner Figma + deploy; present from `docs/DEMO_SCRIPT.md`.

### 2026-11-07 19:25 — Developer C, branch `test/help-live-rehearsal`

- Completed: Created two synthetic `@deepspace.test` users and added a true authenticated,
  two-context help lifecycle regression. Fixed profile-bootstrap bug (omit server-owned
  `userBound` profile ID). Merged to `main` as `1b1ce8d`.
- Notable files: `src/neighbourgrid/session.tsx`, `tests/help-live.spec.ts`.
- Tests run: authenticated DeepSpace create → respond → accept → resolve passed in two separate
  browser contexts; type-check, lint, 15 unit tests, and production build also passed after
  merging latest A/B `main`.
- Service/schema/config changes: two synthetic test accounts in local DeepSpace test-account pool;
  no credentials committed.
- Blockers or user action: Gemini deferred; deployment and Figma remain Developer A actions.
- Next task / handoff: A final integration/deployment.

### 2026-11-07 19:25 — Developer A, branch `main` @ `c212d00`

- Completed: Synced `main` after Help PR #2 and Communities PR #4; confirmed help actions,
  schemas, routes, docs, and demo adapter are present; reviewed server-enforced ownership,
  permissions, beacon targets, and cooldown; ran full verification suite for the merged Help lane.
- Notable files reviewed (no product-code edits): `src/actions/help-actions.ts`,
  `src/actions/help-actions.test.ts`, `src/schemas/neighbourgrid-schema.ts`,
  `src/features/help/*`, `src/server/help-routes.ts`, `src/server/action-routes.ts`,
  `tests/help.spec.ts`, Help/Beacon routes.
- Tests run: `type-check` pass; `lint` pass; `test:unit` 15/15 pass; `build` pass;
  `SMOKE_STATIC=1 npm run test:smoke` 6/6 pass; Playwright `tests/help.spec.ts` 4/4 pass.
- Service/schema/config changes: none. Gemini key not configured. n8n not added.
- Next task / handoff: superseded by Help live-rehearsal merge + this final-integration pass.

### Prior sessions

See git history on `main` for UI-overhaul, home-alerts, communities, and help-beacon session
detail. Older verbose session entries were trimmed here after A/B/C feature merge.
