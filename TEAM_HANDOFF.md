# NeighbourGrid team handoff

Phase 0 is the shared baseline. Pull it, run `npm install`, then confirm `npm run build` before
starting a lane. Keep `src/shared/types.ts` stable until all three developers agree on a change.

## Shared foundation

- App chrome and navigation: `src/components/neighbourgrid.tsx`
- Visual tokens/global behavior: `src/styles.css`
- Domain contracts: `src/shared/types.ts`
- Fictional seeds: `src/shared/demo-data.ts`
- DeepSpace provider boundary: `src/pages/(app)/_layout.tsx`
- App route shell: `src/pages/(app)/app/_layout.tsx`

Person A owns shared auth, record schemas, providers, and shell-level changes after Phase 0.

## Person A — Platform, home, official updates, deployment

**Branch:** `feat/home-alerts`

**Own these routes/files:**

- `src/pages/index.tsx`
- `src/pages/(app)/app/index.tsx`
- `src/pages/(app)/app/activity.tsx`
- `src/pages/(app)/app/profile.tsx`
- shared DeepSpace schemas/auth/provider configuration and deployment

**Next delivery:**

1. Add the demo/auth account flow and persist home-community selection.
2. Connect aggregate counts and latest items through explicit service/hooks.
3. Add a server-side BC Hydro RSS fetch only after verifying the real official feed URL; include
   source, event time, fetched time, cache, and honest empty/error states.
4. Keep the simulated scenario visually separate.
5. Deploy early and verify on a phone.

Coordinate with B/C on hook exports. Do not build their post or help views.

## Person B — Communities, membership, posts, comments

**Branch:** `feat/communities`

**Own these routes/files:**

- `src/pages/(app)/app/communities/index.tsx`
- `src/pages/(app)/app/communities/[slug].tsx`
- add `/app/communities/:slug/posts/:id`
- community/post/comment components and hooks

**Next delivery:**

1. Discover, join, request-to-join, pending state, and home selection.
2. Community feed with create post, post details, and one-level comments.
3. Approved-member write rules and author-only edits.
4. Real-time post/comment updates if viable.
5. Return stable hooks such as `useCommunityFeed` and `useMembership` for Person A.

Keep seeded disruption content marked community-reported or demo. Do not edit Home or Help roots.

## Person C — Help network, beacon, matching, realtime

**Branch:** `feat/help-beacon`

**Own these routes/files:**

- `src/pages/(app)/app/help/index.tsx`
- `src/pages/(app)/app/help/new.tsx`
- `src/pages/(app)/app/beacon/new.tsx`
- help cards, forms, responses, status hooks/services

**Next delivery:**

1. Create ordinary request/offer items with category and lifecycle.
2. Implement “I can help,” requester acceptance, and owner-only resolve/cancel.
3. Implement beacon confirmation, 911 disclaimer, allowed targets, cooldown, and demo isolation.
4. Prioritize reliable two-browser realtime synchronization.
5. Expose aggregate count hooks to Person A.

Do not add chat, exact geolocation, mass notifications, or public contact details. Add n8n only
after matching works.

## Integration protocol

- Person A owns shared schemas and auth configuration.
- Propose contract changes in a small commit before depending on them.
- Keep route ownership strict; avoid broad formatting passes.
- Merge working vertical slices every couple of hours.
- Every lane includes a smoke test and a short demo script.
- Preserve a working end-to-end flow over architecture cleanup near the deadline.
