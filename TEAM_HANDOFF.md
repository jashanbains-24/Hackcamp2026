# NeighbourGrid team handoff

Read `AGENTS.md` and `PROJECT_STATUS.md` first. `PROJECT_STATUS.md` is the live operational record;
this file defines stable ownership and acceptance criteria.

## Gate 1 — Developer A UI overhaul before parallel work

Developer A is the UI lead. A pulls the registered Phase 0 baseline, creates
`feat/ui-overhaul`, and owns the shared Figma file plus the initial visual overhaul.

**A may edit during this gate:**

- `src/styles.css`, theme tokens, and shared visual primitives
- `src/components/neighbourgrid.tsx` and app shell/navigation
- `src/pages/index.tsx`
- `src/pages/(app)/app/index.tsx`
- visual presentation of placeholder routes without implementing their backend behavior
- UI smoke tests and documentation screenshots

**UI-gate requirements:**

- Design at 390px mobile first, then desktop.
- Preserve working routes, centralized mock data, and shared domain interfaces.
- Every visible action navigates, opens a labelled preview, or gives clear feedback.
- Include loading, empty, error, focus, hover, disabled, and status treatments.
- Maintain 44px tap targets, keyboard focus, contrast, reduced motion, source labels, and explicit
  demo labels.
- Figma should include reusable components, mobile/desktop home, community, help, beacon
  confirmation, and key interaction states. Add its share URL to `README.md` and
  `PROJECT_STATUS.md`.
- Do not start community persistence or help matching during this gate.

After verification, A pushes and merges the UI overhaul into `main`. B and C then pull that exact
baseline before creating their feature branches.

## Shared foundation after the UI gate

- App chrome and navigation: `src/components/neighbourgrid.tsx`
- Visual tokens/global behavior: `src/styles.css`
- Domain contracts: `src/shared/types.ts`
- Fictional seeds: `src/shared/demo-data.ts`
- DeepSpace provider boundary: `src/pages/(app)/_layout.tsx`
- App route shell: `src/pages/(app)/app/_layout.tsx`
- Live progress and blockers: `PROJECT_STATUS.md`

Keep `src/shared/types.ts` stable until all three developers agree on a change.

## Person A — Platform, home, official updates, deployment

**Feature branch after UI merge:** `feat/home-alerts`

**Own:**

- `/`, `/app`, `/app/activity`, `/app/profile`
- shared shell and reusable global UI
- DeepSpace auth, shared schemas, providers, permissions coordination, and deployment
- official BC Hydro server fetch and home aggregation

**Deliver:**

1. DeepSpace auth/demo-account flow and persisted home community.
2. Shared record schemas and server-enforced identity/permission conventions for B/C.
3. Home counts/latest items through documented hooks or services.
4. Verified BC Hydro feed URL, server fetch, ~15-minute cache, source/event/fetched timestamps,
   and honest empty/error handling.
5. Deployed phone-accessible URL and integration checks.

Do not build B’s post flows or C’s help flows. Announce schema changes before merging them.

## Person B — Communities, membership, posts, comments

**Feature branch after UI merge:** `feat/communities`

**Own:**

- `/app/communities`
- `/app/communities/:slug`
- `/app/communities/:slug/posts/:id`
- community, membership, post, and comment components/hooks/services

**Deliver:**

1. Discover, join, request-to-join, pending state, and home selection.
2. Community feed, create post, post detail, and one-level comments.
3. Approved-member write rules and author-only mutation checks.
4. Real-time post/comment updates where reliable.
5. Stable `useCommunityFeed`/`useMembership`-style exports for A.

Keep community disruption reports labelled unverified/demo as appropriate. Do not edit Home or
Help roots.

## Person C — Help network, beacon, Gemini, n8n

**Feature branch after UI merge:** `feat/help-beacon`

**Own:**

- `/app/help`
- `/app/help/new`
- `/app/beacon/new`
- help cards/forms, responses, lifecycle, realtime behavior
- Gemini Request Clarity Assistant
- optional n8n workflow after the core lifecycle works

**Deliver in this order:**

1. Manual request/offer form and status lifecycle.
2. “I can help,” requester acceptance, and owner-only resolve/cancel.
3. Beacon confirmation, 911 disclaimer, allowed targets, cooldown, and demo isolation.
4. Reliable two-browser/two-user realtime synchronization.
5. Editable Gemini suggestions for title/category/summary/tags/privacy note; never auto-publish or
   infer emergency severity.
6. Only then, an anonymized replay-safe n8n event/workflow and aggregate hooks for A.

The user already has the Gemini API key. Ask them to follow the secure setup in `README.md` only
when the server endpoint is ready. The n8n account is pending and does not block steps 1–4.

Do not add generic chat, exact geolocation, public contact details, medical triage, mass
notifications, or automatic external broadcasting.

**Current C integration status:** Developer A’s platform PR is merged. `feat/help-beacon` now uses
the shared authenticated session plus `help_items` and `help_responses` realtime queries.
Authenticated writes run through `src/actions/help-actions.ts`, which checks ownership, lifecycle,
community eligibility, response uniqueness, beacon targets, and cooldowns before bypassing RBAC.
The collection schemas are read-only to normal members so clients cannot forge transitions.
The browser-local adapter remains only for the labelled fictional demo. Remaining proof: run the
flow with two authenticated users on separate sessions, configure/test Gemini, then request A’s
review of the help schema/action boundary. n8n is still deferred.

## Integration and agent protocol

- Person A owns shared schemas/auth/provider configuration.
- Each lane updates `PROJECT_STATUS.md` at every safe handoff.
- Each lane includes tests and a short demo script.
- Use small commits and pull current `main` before proposing a merge.
- Never claim a sponsor integration on Devpost until its actual code path and demo were verified.
- Preserve the working end-to-end path over architecture cleanup near the deadline.
