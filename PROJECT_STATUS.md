# NeighbourGrid project status

**Last updated:** 2026-11-07, 7:25 p.m. Vancouver time
**Current stage:** Developer A and C merged; waiting for B and final integration/deployment
**Shared branch:** `main` at `387828d` (Developer C Help/Beacon PR merged)
**Active lane in this checkout:** Developer C verification on `test/help-live-rehearsal`
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`
**UI overhaul merge:** `ed5c7ba Merge pull request #1 from jashanbains-24/feat/ui-overhaul`

## Verified baseline

- UI overhaul is merged into `main`. Landing, shell, home, and placeholders use the NeighbourGrid
  design system.
- DeepSpace app registration is complete (`wrangler.toml` carries the server-minted app ID).
- Developer A schemas, session/demo fence, home aggregates, Activity/Profile, and BC Hydro Surrey
  official-updates API are merged into `main`.
- Developer C’s merged work uses A’s authenticated session and `help_items`/`help_responses`
  collections, with server-enforced lifecycle actions and the local demo adapter as fallback.
- Two authenticated DeepSpace test users completed create → respond → accept → resolve, with both
  browser sessions updating without refresh.
- The Gemini endpoint is implemented but the secret and live authenticated call are not verified.
- n8n remains intentionally deferred.

## Current parallel lanes

- **Developer A:** platform/home baseline merged; next owns deployment, Figma, and integration review.
- **Developer B:** `feat/communities` — bounded community membership/post/comment work.
- **Developer C:** Help/Beacon merged; live DeepSpace lifecycle verified; Gemini intentionally deferred.

**Figma URL:** Not created yet — Developer A owns this action.

### Starting or refreshing a lane

Each developer runs:

```bash
git switch main
git pull origin main
npm install
npm run build
git switch -c feat/home-alerts       # A
# or: git switch -c feat/communities # B
# or: git switch -c feat/help-beacon # C
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
| HelpItem | `help_items` | `authorId` userBound |
| HelpResponse | `help_responses` | `responderId` userBound |
| OfficialUpdate | `official_updates` | Admin write; live path prefers API |

Live official feed: `GET /api/official-updates`
Verified Surrey RSS: `https://www.bchydro.com/rss/outages/surrey.xml`
(from official index `.../outages_rss.html`)

Developer C hardened the two help collections so writes occur only through authenticated server
actions. Developer A should review this schema adjustment during integration.

## Sponsor/integration plan

- **DeepSpace:** primary auth, records, permissions, realtime, secrets, and deployment platform.
- **Gemini API:** endpoint is implemented; key setup is intentionally deferred by the owner.
- **n8n:** account setup pending; does not block A/B/C core lanes.
- **Best Design:** Figma share link still required before claiming that track.
- **Auth0 and unrelated sponsor services:** intentionally excluded.

## Current blockers and user actions

1. **Create the shared Figma file** (Developer A ownership):
   1. In Figma, create a file named `NeighbourGrid — HackCamp 2026`.
   2. Add frames for: tokens/components, landing mobile+desktop, home mobile+desktop, communities, help, beacon confirmation, focus/error/empty states.
   3. Turn on link sharing for the team.
   4. Paste the URL into `PROJECT_STATUS.md` (**Figma URL**) and `README.md` (**Design file**).
2. **Gemini key:** intentionally deferred for now. When the owner resumes it, use the secure
   commands in `README.md`; never paste the key into source or chat.
3. **Deploy verification:** Developer A deploys and records the live `*.space` URL.
4. **Developer B integration:** B must push/review the Communities PR before the final deployment.
5. **n8n account:** remains optional and deferred until after final A/B/C integration.

## Next safe handoff

Developer C should merge the profile-bootstrap fix and authenticated lifecycle regression test.
Developer A then pulls `main`, runs final integration checks, and deploys after Developer B merges.
Gemini and n8n remain deferred by current owner priority.

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

### 2026-11-07 19:25 — Developer C, branch `test/help-live-rehearsal`

- Completed: Created two synthetic `@deepspace.test` users and added a true authenticated,
  two-context help lifecycle regression. The first live run exposed a profile-bootstrap bug:
  the client supplied the server-owned `userBound` profile ID, so no profile row was created and
  help actions correctly rejected community writes. The client now omits that field.
- Notable files: `src/neighbourgrid/session.tsx`, `tests/help-live.spec.ts`.
- Tests run: authenticated DeepSpace create → respond → accept → resolve passed in two separate
  browser contexts; all four server actions were observed and the second session updated without
  refresh. Type-check, lint, 11 unit tests, and production build also passed.
- Service/schema/config changes: two synthetic test accounts were created in the local DeepSpace
  test-account pool; no credentials or secret values were committed.
- Blockers or user action: Gemini intentionally deferred; Developer B branch is not yet on origin;
  deployment and Figma remain Developer A actions.
- Next task / handoff: complete checks, push the regression fix, merge it, then let A perform final
  integration/deployment after B.

### 2026-11-07 19:05 — Developer C, branch `feat/help-beacon`

- Completed: Merged Developer A’s platform baseline; connected Help/Beacon to authenticated
  DeepSpace queries and session identity; added server actions for create/respond/accept/
  resolve/cancel; enforced community eligibility, response uniqueness, owner transitions, beacon
  target checks, and cooldown; retained the labelled browser-local demo fallback.
- Notable files: `src/actions/help-actions.ts`, `src/features/help/help-network.ts`,
  `src/schemas/neighbourgrid-schema.ts`, Help/Beacon routes, and integration documentation.
- Tests run: type-check passed; lint passed; 11 unit tests passed; production build passed;
  6/6 static smoke tests passed; 4/4 help demo browser tests passed.
- Service/schema/config changes: normal members can read but cannot directly mutate help
  collections; authenticated server actions own all help writes; response user/item pairs are
  unique. No secret values were added.
- Blockers or user action: authenticated two-user DeepSpace rehearsal and Gemini secret/live call
  remain unverified; deployment URL and Figma URL remain Developer A actions; n8n stays deferred.
- Next task / handoff: push C’s integration update; Developer A reviews the help schema/action
  boundary and deploys; owner runs the two-user rehearsal and secure Gemini setup.

### 2026-11-07 18:44 — Developer C, branch `feat/help-beacon`

- Completed: Ordinary request/offer creation; participant demo switcher; offer, accept, matched,
  resolve, and cancel lifecycle; targeted beacon confirmation; safety warning; cooldown;
  owner-only controls; local persistence; no-refresh two-tab synchronization; server-only Gemini
  Request Clarity endpoint and editable manual fallback.
- Notable files: `src/features/help/`, help/beacon routes, `src/server/help-routes.ts`, `worker.ts`,
  `tests/help.spec.ts`.
- Tests run: type-check passed; lint passed; 6 unit tests passed; production build passed; 4/4 help
  browser tests passed, including two-session synchronization. IDE diagnostics clean.
- Service/schema/config changes: Added `/api/help/clarify`; no shared DeepSpace schema changes and
  no secret values committed.
- Blockers or user action: Gemini key upload and A’s authenticated session flow; A-owned
  DeepSpace help schemas for real cross-device persistence/realtime; n8n account/workflow deferred.
- Next task / handoff: integrate A’s schema exports, verify on two devices, then consider n8n.

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
- Deployment URL: not verified (DeepSpace CLI not authenticated in agent environment).
- Git: committed locally as `bd1b438` on `feat/home-alerts`. Push from agent failed
  (sandbox blocked GitHub credentials); owner must push.
- Blockers or user action: push branch; review; local smoke; deploy; Figma URL.
- Next task / handoff: team review of `feat/home-alerts`; B/C may begin after pull of `main`
  and can depend on A’s exports once this branch merges.

### 2026-11-07 18:30 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: UI overhaul polish (later merged via PR #1 at `ed5c7ba`).
- See git history on `main` for prior UI-gate sessions.
