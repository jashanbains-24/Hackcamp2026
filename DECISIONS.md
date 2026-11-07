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
retrying completed successfully. DeepSpace app registration then returned `not_authenticated`;
no account credentials were available. Phase 0 therefore runs through Vite with a local-only
preview identity. `vite.config.ts` detects a real app ID and automatically restores the SDK build
plugin after Person A runs `deepspace auth login` and `deepspace app init`. No ID was invented or
written into `wrangler.toml`.

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

## Safety and product language

- “Community Help Beacon” is an opt-in community assistance concept, never SOS or dispatch.
- The preview cannot send a beacon.
- Official and simulated information are visually and semantically separate.
- Approximate community is used instead of geolocation or precise addresses.
