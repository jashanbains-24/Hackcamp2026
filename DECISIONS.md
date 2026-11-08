# NeighbourGrid technical decisions

## 2026-11-07 — DeepSpace scaffold retained

**Decision:** Use the official DeepSpace 0.43 starter scaffold as the single application
foundation.

**Why:** The generated React/TypeScript/Vite stack matches the brief, provides a Cloudflare Worker
backend path, and keeps a direct route to DeepSpace records, permissions, auth, and realtime sync
for the Phase 1 multi-user demo.

The current documentation and generated conventions were checked before implementation. Phase 0
uses no product records or persistent backend behavior; the scaffold providers remain ready for
the team to wire after synchronization.

**Local result:** The scaffold installed locally. The first dependency install stopped because the
laptop had very little free disk space; removing only the partial generated `node_modules` and
retrying completed successfully. The owner subsequently completed DeepSpace authentication and
app registration. `wrangler.toml` now contains the server-minted app ID, so the normal DeepSpace
build/runtime path is active.

## Fallback threshold

Stay on DeepSpace unless focused Phase 1 testing cannot produce persisted realtime updates within
the 60–90 minute threshold from the build brief. If that occurs, switch once to Next.js +
Supabase, record the change here, and do not operate two databases in parallel.

## Phase 0 data and routing

- Public `/` remains static and prerenderable.
- `/app` and its child routes live under the generated dynamic provider boundary.
- `/demo` redirects to `/app?demo=1`; all visible Phase 0 app data is fictional and labelled.
- Shared domain interfaces live in `src/shared/types.ts`.
- Seed content lives only in `src/shared/demo-data.ts`.
- Phase 0 does not ingest RSS, call AI, trigger automations, or persist user changes.

## 2026-11-07 — Serial UI gate before feature branches

**Decision:** Developer A/UI lead first overhauls the shared Figma/design system, app shell,
landing, and homepage on `feat/ui-overhaul`. B and C do not start feature work from the old visual
baseline. After A merges into `main`, all three pull and create their normal A/B/C branches.

**Why:** This avoids three agents independently rebuilding shared UI and reduces conflicts in the
shell, tokens, and reusable components. Developer A continues into the platform/home lane after
the UI gate.

## 2026-11-07 — Sponsor integrations

- DeepSpace remains the single auth, records, realtime, secrets, and deployment platform. Do not
  add Auth0 or a parallel database.
- Gemini is reserved for an editable Request Clarity Assistant in Person C’s flow. A generic
  chatbot is intentionally rejected as less relevant to the core product.
- n8n is optional and follows, rather than precedes, a working two-user help lifecycle. Its event
  must be server-side, anonymized, minimal, and safe to replay.
- Other sponsor products are not added solely for prize eligibility.

## 2026-11-07 — Source-grounded Neighbourhood Guide

**Decision:** Expand Gemini beyond request clarity with a bounded, read-only Neighbourhood Guide
on Home. This supersedes the earlier rejection only for this product-specific assistant; an
unrestricted generic chatbot remains out of scope.

The Guide receives only a size-limited snapshot of community posts/help already visible to the
signed-in user, the server-fetched BC Hydro Surrey feed, and optional Gemini Google Search
grounding. It must return source links, distinguish official/community/DEMO content, treat record
content as untrusted, and state when current information is missing.

The Guide cannot mutate records, auto-publish, infer emergency or medical severity, expose exact
locations or personal details, or promise volunteer response. It has no direct X integration;
public search results are labelled as web sources rather than complete X coverage.

## 2026-11-07 — Secrets

DeepSpace’s encrypted per-app secrets store is the only source of truth for Gemini and n8n
credentials. `.dev.vars` is generated and must not be edited or committed. Client-side `VITE_*`
secrets are forbidden.

## Safety and product language

- “Community Help Beacon” is an opt-in community assistance concept, never SOS or dispatch.
- Demo beacons never leave the browser. Authenticated beacons create only in-app records and do
  not contact emergency services or external broadcasters.
- Official and simulated information are visually and semantically separate.
- Approximate community is used instead of geolocation or precise addresses.

## 2026-11-07 — BC Hydro Surrey feed URL

**Decision:** Use the municipality feed linked from the official RSS index as
`https://www.bchydro.com/rss/outages/surrey.xml`.

**Why:** Verified by opening
https://www.bchydro.com/safety-outages/power-outages/outages_rss.html and following the
“Surrey” municipality link. The Worker fetches and caches this feed for ~15 minutes and must
not claim Surrey municipality items are Newton-specific.

## 2026-11-07 — UI overhaul gate complete

**Decision:** Parallel A/B/C feature branches start from `main` at/after `ed5c7ba`.

## 2026-11-07 — Help lifecycle uses server actions

**Decision:** Normal members may read help records but cannot write those collections directly.
Authenticated server actions create requests/beacons/responses and enforce ownership, community
eligibility, lifecycle transitions, response uniqueness, allowed beacon targets, and cooldowns.

**Why:** Per-record owner RBAC alone cannot safely let a responder move somebody else’s request to
`offered`, or let only the requester mark a response accepted. Keeping those multi-record
transitions in one server-owned boundary prevents browser clients from skipping the workflow.
