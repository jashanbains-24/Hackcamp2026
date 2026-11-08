# NeighbourGrid project status

**Last updated:** 2026-11-07, 6:30 p.m. Vancouver time  
**Current stage:** Developer A UI-overhaul polish complete on `feat/ui-overhaul` (uncommitted); awaiting review, Figma URL, then commit/push  
**Shared branch:** `main` (unchanged)  
**Active lane branch:** `feat/ui-overhaul`  
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`

## Verified baseline

- Public landing, responsive app shell, Newton demo dashboard, placeholder feature routes, shared
  types, and centralized demo data are implemented.
- DeepSpace app registration is complete and `wrangler.toml` now carries the server-minted app ID.
- No persistent records, product auth flow, realtime feature, RSS integration, Gemini call, or n8n
  workflow is implemented yet.

## Immediate sequence

### Developer A: UI-overhaul gate — in progress / ready for review

Implementation is on `feat/ui-overhaul` locally (not committed yet, per owner direction):

1. ~~Pull latest `main` and create `feat/ui-overhaul`~~
2. ~~Rework tokens, shell, landing, home, and placeholder presentation~~
3. Shared Figma file still needs a share URL (see user action below)
4. Owner/team reviews UI in the running local app
5. On approval: commit, push `feat/ui-overhaul`, then merge into `main`
6. Only after that merge: A/B/C start `feat/home-alerts`, `feat/communities`, `feat/help-beacon`

**Figma URL:** Not created yet — Developer A owns this action.

### All developers: start parallel lanes only after A merges

Each developer runs:

```bash
git switch main
git pull origin main
npm install
npm run build
```

Then branch:

```bash
git switch -c feat/home-alerts   # A
git switch -c feat/communities  # B
git switch -c feat/help-beacon  # C
```

## Sponsor/integration plan

- **DeepSpace:** primary auth, records, permissions, realtime, secrets, and deployment platform.
- **Gemini API:** deferred until Person C has the server endpoint.
- **n8n:** account setup pending; does not block UI gate.
- **Best Design:** Figma share link still required before claiming that track.
- **Auth0 and unrelated sponsor services:** intentionally excluded.

## Current blockers and user actions

1. **Review the UI overhaul** at `http://localhost:8780` (mobile 390px + desktop) before asking for a commit.
2. **Create the shared Figma file** (Developer A ownership):
   1. In Figma, create a file named `NeighbourGrid — HackCamp 2026`.
   2. Add frames for: tokens/components, landing mobile+desktop, home mobile+desktop, communities, help, beacon confirmation, focus/error/empty states.
   3. Turn on link sharing for the team.
   4. Paste the URL into `PROJECT_STATUS.md` (**Figma URL**) and `README.md` (**Design file**).
3. **n8n account** remains optional and does not block this gate.
4. **Gemini secret setup** waits for Person C’s server endpoint.

## Next safe handoff

UI implementation is ready for human visual review on `feat/ui-overhaul`. Do **not** merge or start B/C feature branches until the branch is committed, pushed, reviewed, and merged into `main`. Do not start `feat/home-alerts` until after that merge.

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

### 2026-11-07 18:30 — Developer A / UI lead, branch `feat/ui-overhaul`

- Completed: `impeccable polish` — caret/underline browser chrome; shared `BackLink`; removed
  ErrorPanel eyebrow; aligned title roles on communities/profile/empty; View Transitions +
  hover states on remaining dashboard links; documented intentional scrollbar radius.
- Notable files: `src/styles.css`, `src/components/neighbourgrid.tsx`, dashboard pages under
  `src/pages/(app)/app/`, `DESIGN.md`.
- Tests run: type-check, lint, unit 3/3; detect only advisory scrollbar radius (documented).
- Blockers or user action: uncommitted; Figma URL pending; owner visual review before commit.
- Next task / handoff: commit/push `feat/ui-overhaul` on request, then merge gate.

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
