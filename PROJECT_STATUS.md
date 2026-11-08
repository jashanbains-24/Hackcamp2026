# NeighbourGrid project status

**Last updated:** 2026-11-07, 5:21 p.m. Vancouver time  
**Current stage:** Registered Phase 0 baseline; waiting for owner push, then Developer A UI gate  
**Shared branch:** `main`  
**Phase 0 commit:** `77745fc feat: scaffold neighbourgrid mobile app shell`

## Verified baseline

- Public landing, responsive app shell, Newton demo dashboard, placeholder feature routes, shared
  types, and centralized demo data are implemented.
- DeepSpace app registration is complete and `wrangler.toml` now carries the server-minted app ID.
- No persistent records, product auth flow, realtime feature, RSS integration, Gemini call, or n8n
  workflow is implemented yet.
- The existing UI is a functional baseline. Developer A is explicitly authorized to overhaul its
  visual system before parallel feature work starts.
- Phase 0 verification passed: type-check, lint, production build, 3 unit tests, and 6 browser
  smoke tests covering mobile and desktop.

## Immediate sequence — do not skip

### Owner: publish this baseline

1. Confirm the worktree contains the registration/documentation commit.
2. Push `main` to GitHub.
3. Send Developer A the GitHub repository URL and confirm they can pull it.
4. Add trusted teammates as DeepSpace collaborators only if they need secrets/deploy access.
   Collaborators can read and modify every app secret, so this is not required merely to edit UI.

### Developer A: UI-overhaul gate

1. Pull the latest `main`.
2. Create `feat/ui-overhaul`.
3. Read `AGENTS.md`, `TEAM_HANDOFF.md`, and the design section of the build brief.
4. Create and own the shared Figma file.
5. Rework tokens, reusable components, landing, app shell/navigation, and homepage using existing
   mock contracts; do not implement B/C backend features during this gate.
6. Verify `/`, `/app`, placeholder routes, 390px mobile, desktop, keyboard focus, contrast, no
   horizontal overflow, and reduced motion.
7. Add the Figma URL below and to `README.md`.
8. Run all required checks, update this file, commit, push, and merge into `main`.

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
  Real product integration is required before claiming the sponsor prize.
- **Gemini API:** Person C adds an editable Request Clarity Assistant after the manual help form
  works. The user already has the API key; request secure setup only when the server integration
  is ready.
- **n8n:** account setup is pending with the user. Add an anonymized server-side workflow only
  after realtime help matching works.
- **Best Design / accessibility / Community Impact:** Developer A’s Figma and UI work should
  preserve accessible interaction and capture final implemented screens.
- **Auth0 and unrelated sponsor services:** intentionally excluded to avoid duplicating DeepSpace
  auth or weakening the core demo.

## Current blockers and user actions

- GitHub `main` has not yet received the local Phase 0 commit.
- The user needs to create an n8n account, but this does not block the UI overhaul.
- Gemini secret setup is deliberately deferred until Person C has server code ready.

## Next safe handoff

The next coding agent should be Developer A on `feat/ui-overhaul`. Developers B and C should not
start feature implementation until that branch is merged into `main`.

## Session log template

Copy this block to the top of a new entry after meaningful work:

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
