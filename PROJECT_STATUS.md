# NeighbourGrid project status

**Last updated:** 2026-11-07, ~6:55 p.m. Vancouver time  
**Current stage:** Developer A platform/home lane on `feat/home-alerts` (ready for team review)  
**Shared branch:** `main` @ `ed5c7ba` (UI overhaul merged)  
**Active lane branch:** `feat/home-alerts`  
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`  
**UI overhaul merge:** `ed5c7ba Merge pull request #1 from jashanbains-24/feat/ui-overhaul`

## Verified baseline

- UI overhaul is merged into `main`. Landing, shell, home, and placeholders use the NeighbourGrid
  design system.
- DeepSpace app registration is complete (`wrangler.toml` carries the server-minted app ID).
- Developer A schemas, session/demo fence, home aggregates, Activity/Profile, and BC Hydro Surrey
  official-updates API are implemented on `feat/home-alerts`.
- Gemini and n8n remain intentionally unimplemented (Person C).

## Immediate sequence

### Gate complete — UI overhaul merged

1. ~~Developer A UI overhaul~~ merged at `ed5c7ba`
2. All developers pull `main` and create parallel branches

```bash
git switch main
git pull origin main
npm install
npm run build
git switch -c feat/home-alerts       # A (this branch)
# or: git switch -c feat/communities # B
# or: git switch -c feat/help-beacon # C
```

### Developer A — `feat/home-alerts` (in review)

Completed in this session (see session history). Do **not** merge without team review.

**Figma URL:** Not created yet — Developer A still owns adding the share link to README + status.

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
| HelpItem | `help_items` | `authorId` userBound |
| HelpResponse | `help_responses` | `responderId` userBound |
| OfficialUpdate | `official_updates` | Admin write; live path prefers API |

Live official feed: `GET /api/official-updates`  
Verified Surrey RSS: `https://www.bchydro.com/rss/outages/surrey.xml`  
(from official index `.../outages_rss.html`)

Propose schema/permission changes to Person A before depending on new fields.

## Sponsor/integration plan

- **DeepSpace:** primary auth, records, permissions, realtime, secrets, and deployment platform.
- **Gemini API:** deferred until Person C has the server endpoint.
- **n8n:** account setup pending; does not block A/B/C core lanes.
- **Best Design:** Figma share link still required before claiming that track.
- **Auth0 and unrelated sponsor services:** intentionally excluded.

## Current blockers and user actions

1. **Approve / review `feat/home-alerts`** (do not merge until reviewed).
2. **Run smoke locally** (agent sandbox blocked Chrome + Cloudflare Vite watchers):

```bash
git switch feat/home-alerts
npm install
npm run build
npm run test:smoke
# if Vite/Cloudflare fails in a restricted environment:
SMOKE_STATIC=1 npm run test:smoke
```

3. **Deploy verification** (owner machine; agent is not logged in to DeepSpace):

```bash
npx deepspace auth login
npx deepspace deploy
```

Success: CLI prints a live `*.space` URL; phone-width + desktop home show DEMO fence or signed-in
profile; Official updates show Surrey feed items or an honest empty/error state with timestamps.

4. **Create the shared Figma file** (Developer A ownership):
   1. In Figma, create `NeighbourGrid — HackCamp 2026`.
   2. Add frames for tokens/components, landing, home, communities, help, beacon, states.
   3. Enable link sharing.
   4. Paste the URL into `PROJECT_STATUS.md` (**Figma URL**) and `README.md` (**Design file**).

5. **n8n account** remains optional.
6. **Gemini secret setup** waits for Person C’s server endpoint.

## Next safe handoff

- B may start `feat/communities` from current `main`, then rebase onto `feat/home-alerts` after
  merge (or branch from `feat/home-alerts` now if coordinating schema early).
- C may start `feat/help-beacon` similarly; import help aggregates via documented exports once A
  merges.
- A next: address review feedback, complete deploy URL verification, add Figma URL when ready.

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

### 2026-11-07 18:55 — Developer A, branch `feat/home-alerts`

- Completed:
  - Documented UI overhaul merge in README/PROJECT_STATUS.
  - Narrowed always-applied no-localhost browser rule (local visual QA allowed).
  - Fixed ambiguous mobile smoke DEMO assertion (`data-testid="demo-scenario-notice"`).
  - Implemented product schemas with server-side identity (`userBound`) + RBAC.
  - Published `@/neighbourgrid/exports` for B/C.
  - DeepSpace auth + fenced Maya demo session; persisted home community.
  - Wired home counts/latest posts/help; useful Activity + Profile pages.
  - Verified BC Hydro Surrey RSS from official index; Worker fetch/parse/~15m cache;
    honest empty/failure; municipality note (no Newton invention).
- Notable files: `src/schemas/neighbourgrid-schema.ts`, `src/neighbourgrid/*`,
  `src/server/official-updates*.ts`, `src/pages/(app)/app/{index,activity,profile}.tsx`,
  `src/components/neighbourgrid.tsx`, `tests/smoke.spec.ts`, `tests/static-smoke-server.mjs`.
- Tests run: `type-check` pass; `lint` pass; `test:unit` 5/5 pass; `build` pass.
  Browser smoke blocked in agent sandbox (Chrome framework dlopen + Cloudflare EMFILE).
  Static smoke server starts; Chrome launch requires unsandboxed host — owner should run
  `npm run test:smoke` locally.
- Service/schema/config changes: registered NeighbourGrid collections in `src/schemas.ts`;
  added `GET /api/official-updates`.
- Deployment URL: not verified in this session (needs `npx deepspace deploy` on owner machine).
- Blockers or user action: review branch; local smoke; deploy; Figma URL.
- Next task / handoff: team review of `feat/home-alerts`; B/C may begin after pull of `main`
  and can depend on A’s exports once this branch merges.

### 2026-11-07 18:30 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: UI overhaul polish (later merged via PR #1 at `ed5c7ba`).
- See git history on `main` for prior UI-gate sessions.
