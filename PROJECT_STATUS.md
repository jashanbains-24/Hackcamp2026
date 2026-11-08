# NeighbourGrid project status

**Last updated:** 2026-11-07, 7:25 p.m. Vancouver time
**Current stage:** A/B/C features merged; final verification and deployment
**Shared branch:** `main` at `e7c5d67` (A integration docs after Communities PR #4)
**Active lane in this checkout:** Developer C verification on `test/help-live-rehearsal`
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`
**UI overhaul merge:** `ed5c7ba Merge pull request #1 from jashanbains-24/feat/ui-overhaul`
**Help/beacon merge:** `387828d Merge pull request #2 from jashanbains-24/feat/help-beacon`
**Communities merge:** `c212d00 Merge pull request #4 from jashanbains-24/feat/communities`

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
- Developer B Communities is also on `main` (A did not edit B-owned files during this review).
- n8n remains intentionally deferred.

## Current parallel lanes

- **Developer A:** final integration, deployment URL, and Figma.
- **Developer B:** `feat/communities` merged via PR #4.
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
4. **n8n account:** remains optional and deferred until after deployment.

## Next safe handoff

Developer C should merge the profile-bootstrap fix and authenticated lifecycle regression test.
Developer A then pulls `main`, runs final integrated A/B/C checks, deploys, and records the live
URL. Gemini and n8n remain deferred by current owner priority.

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
  refresh. After merging the latest A/B `main`, type-check, lint, 15 unit tests, and production
  build also passed.
- Service/schema/config changes: two synthetic test accounts were created in the local DeepSpace
  test-account pool; no credentials or secret values were committed.
- Blockers or user action: Gemini intentionally deferred; deployment and Figma remain Developer A
  actions. Communities PR #4 is now merged.
- Next task / handoff: merge the regression fix, then let A perform final integration/deployment.

### 2026-11-07 19:25 — Developer A, branch `main` @ `c212d00`

- Completed: Synced `main` after Help PR #2 and Communities PR #4; confirmed help actions,
  schemas, routes, docs, and demo adapter are present; reviewed server-enforced ownership,
  permissions, beacon targets, and cooldown; ran full verification suite for the merged Help lane.
- Notable files reviewed (no product-code edits): `src/actions/help-actions.ts`,
  `src/actions/help-actions.test.ts`, `src/schemas/neighbourgrid-schema.ts`,
  `src/features/help/*`, `src/server/help-routes.ts`, `src/server/action-routes.ts`,
  `tests/help.spec.ts`, Help/Beacon routes.
- Tests run: `type-check` pass; `lint` pass; `test:unit` 15/15 pass; `build` pass;
  `SMOKE_STATIC=1 npm run test:smoke` 6/6 pass; Playwright `tests/help.spec.ts` 4/4 pass
  (create request, offer→accept→resolve, beacon confirm, two-tab demo sync).
- Service/schema/config changes: none. Gemini key not configured or tested. n8n not added.
  Developer B community feature files were not edited.
- Integration review: `help_items`/`help_responses` are member read-only; writes go through
  authenticated `/api/actions/*` with RBAC bypass only after action-level checks for identity
  stamping, community eligibility, self-response block, response uniqueness, owner-only
  accept/resolve/cancel, lifecycle transitions, home+adjacent beacon targets, and 5-minute
  beacon cooldown. Gemini clarify route is present and correctly returns 503 when unconfigured.
- Blockers or user action: agent environment has no DeepSpace login / `.dev.vars`, so the live
  authenticated two-user create→offer→accept→resolve path was not executed here. Owner must run
  the numbered DeepSpace rehearsal above. Figma URL and deploy URL remain A actions. Gemini deferred.
- Next task / handoff: owner completes two-user DeepSpace rehearsal; A deploys when that passes;
  then optional Gemini secret setup. Do not start n8n yet.

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

### 2026-11-07 19:35 — Developer B, branch `fix/community-home-sync`

- Completed: Community “Set as home” now calls the shared
  `useNeighbourGridSession().setHomeCommunityId` contract. Communities reads the same session
  home community as Home and Profile, including the curated Cloverdale, City Centre, Ladner,
  North Delta, and Burnaby Metrotown demo seeds.
- Notable files: `src/services/communities.ts`, community index/detail routes,
  `src/components/communities/CommunityMembership.tsx`, and the shared curated
  `src/shared/demo-data.ts`.
- Tests run: focused community browser tests passed (3/3); `npm run type-check` passed;
  `npm run lint` passed; `npm run test:unit` passed (15 tests); `npm run build` passed.
- Service/schema/config changes: removed the separate `neighbourgrid.home-community` dependency.
  Demo home selection now uses A’s session persistence (`ng-home-community-id` for browser-local
  demo fallback, or the authenticated profile record through DeepSpace). Community posts,
  memberships, and comments remain browser-local demo data and are still labelled as such; they
  are not yet persisted in DeepSpace.
- Blockers or user action: A’s live authenticated community record wiring remains a follow-up;
  this pass intentionally does not rewrite the community adapter or add realtime persistence.
  DeepSpace smoke output still reports the expected missing local `AUTH_WORKER_URL` when using
  the mock Vite server; focused community assertions pass.
- Next task / handoff: review and merge this small home-sync fix, then use the Communities demo
  segment and screenshots in the presentation. Present Communities as demo-local and Help as the
  verified live DeepSpace workflow.

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

- Completed: `impeccable polish` — caret/underline browser chrome; shared `BackLink`; removed
  ErrorPanel eyebrow; aligned title roles on communities/profile/empty; View Transitions +
  hover states on remaining dashboard links; documented intentional scrollbar radius.
- Notable files: `src/styles.css`, `src/components/neighbourgrid.tsx`, dashboard pages under
  `src/pages/(app)/app/`, `DESIGN.md`.
- Tests run: type-check, lint, unit 3/3; detect only advisory scrollbar radius (documented).
- Blockers or user action: uncommitted; Figma URL pending; owner visual review before commit.
- Next task / handoff: commit/push `feat/ui-overhaul` on request, then merge gate.

### 2026-11-07 18:15 — Developer B / Communities, branch `feat/communities`

- Completed: community discovery for curated BC communities, public join and request-to-join
  pending states, browser-local home-community selection adapter, Newton feed, community post
  composer, post detail, one-level comments, author-only edit/delete, approved-member write
  gating, and truthful community-reported/demo labels.
- Notable files: `src/services/communities.ts`, `src/components/communities/`,
  `src/pages/(app)/app/communities/`, and `tests/communities.spec.ts`.
- Tests run: `npm run type-check` passed; `npm run lint` passed; `npm run test:unit` passed
  (7 tests); `npm run build` passed; focused community smoke tests passed (3/3).
  The existing full `tests/smoke.spec.ts` has one pre-existing strict-text failure on the merged
  UI's duplicate `DEMO` text; the other five baseline smoke tests pass.
- Service/schema/config changes: no shared schemas, auth, provider, or dependency manifests
  changed. The feature currently uses a small browser-local adapter around existing TypeScript
  contracts until A's DeepSpace exports are ready.
- Blockers or user action: A should provide stable membership persistence, home-community
  selection, current-user identity, and community feed/post/comment record exports before
  replacing the adapter. No secrets or configuration are needed for the demo adapter.
- Next task / handoff: review the communities lane, then wire the adapter methods to A's
  approved DeepSpace service contract without changing shared interfaces.

### 2026-11-07 18:27 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable overdrive` all three directions — (1) scroll-driven landing motif/steps
  via `animation-timeline: view()`, (2) React Router `viewTransition` on shell/landing/home
  links + shared brand VT name, (3) pointer-reactive `NeighbourhoodGridCanvas` with reduced-
  motion SVG fallback. Documented in `DESIGN.md`.
- Notable files: `src/components/NeighbourhoodGridCanvas.tsx`, `src/pages/index.tsx`,
  `src/components/neighbourgrid.tsx`, `src/styles.css`, `src/pages/(app)/app/index.tsx`.
- Tests run: type-check, lint, unit 3/3. No localhost browser QA (owner preference).
- Next task / handoff: hard-refresh `/`, move pointer on hero, scroll the loop section, then
  tap nav between `/app` routes to feel View Transitions.

### 2026-11-07 18:23 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable distill` across all `/app` dashboard pages. Removed repeated demo
  chrome, dead “Preview only” buttons, count strip, post body on home, and eyebrow labels.
  Home now has one primary CTA + text links; shorter intros on communities/help/beacon/
  activity/profile. Updated smoke assertions for new headings.
- Notable files: `src/pages/(app)/app/**`, `src/components/neighbourgrid.tsx`,
  `tests/smoke.spec.ts`.
- Tests run: type-check, lint, unit 3/3. Smoke not re-run in this pass (assertions updated).
- Removed intentionally: per-page demo banners (shell keeps one), home demo counts, help
  disabled buttons, ComingSoon “Next build” kicker, redundant safety/meta lines.
- Next task / handoff: owner reviews distilled dashboard; optional `$impeccable polish`.

### 2026-11-07 18:18 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: Fixed desktop app shell — removed centered `mx-auto max-w-[1280px]` wrapper
  so the sidebar sits flush left; main content still uses its own page max-width.
- Notable files: `src/components/neighbourgrid.tsx`, `DESIGN.md`.
- Tests run: type-check, lint.
- Next task / handoff: owner confirms sidebar alignment on desktop `/app`.

### 2026-11-07 18:16 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable animate` — landing brand clip-path/blur reveal (`ng-brand-reveal`),
  stronger staggered copy, hero wash drift, CTA arrow nudge; home help `ng-settle`; beacon
  one-shot `ng-attend`. Motion gated under `prefers-reduced-motion: no-preference` with
  visible defaults.
- Notable files: `src/styles.css`, `src/pages/index.tsx`, `src/pages/(app)/app/index.tsx`,
  `src/pages/(app)/app/beacon/new.tsx`, `DESIGN.md`.
- Tests run: type-check, lint; compiled CSS includes new motion classes. No localhost
  browser QA (owner preference).
- Blockers or user action: hard-refresh `/` to see brand reveal once; uncommitted; Figma pending.
- Next task / handoff: optional `$impeccable polish`, then commit/push on request.

### 2026-11-07 18:14 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable layout` on landing, home, and beacon. Added stack spacing roles
  (`ng-stack-tight` / `copy` / `section`); tightened hero CTA↔disclaimer proximity; folded
  demo counts into the neighbours header; help stays the home peak; beacon warning+confirm
  grouped as one action stack. Updated `DESIGN.md` spacing tokens.
- Notable files: `src/pages/index.tsx`, `src/pages/(app)/app/index.tsx`,
  `src/pages/(app)/app/beacon/new.tsx`, `src/styles.css`, `DESIGN.md`.
- Tests run: type-check, lint, unit; `impeccable detect --scope layout` clean. No localhost
  browser QA (owner preference).
- Service/schema/config changes: none.
- Blockers or user action: uncommitted; Figma URL pending; owner visual review.
- Next task / handoff: optional `$impeccable polish`, then commit/push on request.

### 2026-11-07 18:10 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable bolder` on landing hero, landing loop section, app home, and
  beacon preview (coral beacon CTA, larger Fraunces peaks, grid motif). Then
  `impeccable typeset`: documented type role ramp (`ng-type-*`), body floor `1rem`,
  Fraunces 600/700 + Manrope 400–700 loads, `text-wrap: balance` on headings; aligned
  landing/home/beacon/shared intros to the ramp; updated `DESIGN.md`.
- Notable files: `src/styles.css`, `src/pages/index.tsx`, `src/pages/(app)/app/index.tsx`,
  `src/pages/(app)/app/beacon/new.tsx`, `src/components/neighbourgrid.tsx`, `index.html`,
  `DESIGN.md`, `.cursor/rules/no-localhost-browser.mdc`.
- Tests run: type-check passed; lint clean; unit 3/3 passed; `impeccable detect --scope type`
  on touched surfaces returned `[]`. No localhost browser QA (owner preference).
- Service/schema/config changes: none.
- Blockers or user action: still uncommitted; Figma URL still pending; owner visual review
  in their own local app.
- Next task / handoff: owner reviews UI, then commit/push `feat/ui-overhaul` on request.
  Optional next: `$impeccable polish`.

### 2026-11-07 18:02 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: Ran audit remediation chain (quieter landing, adapt contrast/targets,
  distill placeholders, extract tokens, document, polish). Added `DESIGN.md`. Live
  `impeccable detect` on `/` and `/app` now returns no findings.
- Notable files: `DESIGN.md`, `src/styles.css`, `src/themes.css`, `src/pages/index.tsx`,
  `src/pages/(app)/app/*`, `src/components/neighbourgrid.tsx`, `src/components/ui/Button.tsx`.
- Tests run: type-check, lint, unit 3/3 passed; detect `/` and `/app` clean.
- Service/schema/config changes: none.
- Blockers or user action: still uncommitted; Figma URL still pending; owner visual review.
- Next task / handoff: review UI, then commit/push `feat/ui-overhaul` on request.

### 2026-11-07 17:47 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: Mobile-first design-system overhaul — Manrope + Fraunces, NeighbourGrid theme tokens,
  brand-first landing, desktop side-rail + mobile bottom nav shell, home hierarchy polish,
  StatusLabel / EmptyPanel / ErrorPanel / PageIntro primitives, and refreshed placeholder
  presentation. Routes, shared interfaces, mock data, safety language, official/demo labels, and
  CTAs preserved. No B/C feature logic.
- Notable files: `src/styles.css`, `src/themes.css`, `src/themes.ts`, `index.html`,
  `src/components/neighbourgrid.tsx`, `src/pages/index.tsx`, `src/pages/(app)/app/index.tsx`,
  placeholder app pages under `src/pages/(app)/app/`.
- Tests run: `type-check` passed; `lint` passed; `test:unit` 3/3 passed; `build` passed;
  `test:smoke` 5/6 passed. Mobile smoke UI assertions passed; the suite failed only on a console
  `500` for `/api/auth/get-session` (`AUTH_WORKER_URL` unset under plain Vite). Desktop primary
  nav + Ask for help CTA passed. Automated browser screenshot QA was abandoned (tool loop on
  localhost); owner should visually confirm at 390px and desktop locally.
- Service/schema/config changes: none (theme id `neighbourgrid` in `index.html` only).
- Blockers or user action: no commit/push yet; Figma URL still needed; owner visual review
  requested before commit.
- Next task / handoff: after owner approval, commit and push `feat/ui-overhaul` (do not merge
  until team review). Then merge to `main` and unlock parallel A/B/C lanes.

### 2026-11-07 17:24 — Initializer, branch `main`

- Completed: Recorded successful DeepSpace registration; established the serial Developer A UI
  gate; documented Figma ownership, secure Gemini setup, delayed n8n integration, collaborator
  access, branch ownership, and the mandatory agent progress protocol.
- Notable files: `wrangler.toml`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `DECISIONS.md`,
  `TEAM_HANDOFF.md`, `PROJECT_STATUS.md`, `.env.example`.
- Tests run: type-check passed; lint passed; 3 unit tests passed; registered production build
  passed; 6 browser smoke tests passed on mobile/desktop.
- Service/schema/config changes: DeepSpace app ID is registered; no product schema or secret was
  added.
- Blockers or user action: owner must push `main`; n8n account remains optional/pending; Gemini
  key setup waits for Person C’s server endpoint.
- Next task / handoff: Developer A pulls `main`, creates `feat/ui-overhaul`, creates the shared
  Figma file, and completes the UI gate before B/C branch.
- Completed: UI overhaul polish (later merged via PR #1 at `ed5c7ba`).
- See git history on `main` for prior UI-gate sessions.
