# Help feature integration contract

Developer C owns this feature. Developer A’s shared schemas and session are now integrated.

## Current behavior

- Authenticated users read `help_items` and `help_responses` through DeepSpace realtime queries.
- `help-network.ts` selects authenticated DeepSpace behavior or the labelled demo fallback.
- All authenticated writes call server actions in `src/actions/help-actions.ts`.
- Server actions check verified identity, ownership, lifecycle transitions, community eligibility,
  response uniqueness, beacon targets, and the five-minute beacon cooldown.
- The two collections are read-only to normal clients; action routes own writes so a client cannot
  mark its own response accepted or skip lifecycle checks.
- `help-store.ts` remains the fictional browser-local fallback. It synchronizes open tabs through
  `BroadcastChannel`/storage events and never contacts real users.

## DeepSpace collections

Use the existing `HelpItem` and `HelpResponse` interfaces as the field contract.

### `help_items`

- authenticated author identity is stamped from the verified action caller;
- only server actions create and update items;
- only the author can accept, cancel, or resolve;
- home or approved-community eligibility is checked before ordinary creation/response;
- beacon targets are restricted to the home community plus configured eligible communities;
- beacon creation has a server-enforced cooldown.

### `help_responses`

- authenticated responder identity comes from the verified action caller;
- responder cannot respond to their own item;
- `uniqueOn: ['helpItemId', 'responderId']` plus action validation allows one response per pair;
- requester alone accepts a response;
- short notes contain no contact details; authenticated members can currently read them.

## Lifecycle

`open → offered → matched → resolved`, with owner-controlled `cancelled`.

An offer never silently claims or closes a request. Accept and resolve are explicit requester
actions. Server actions must load the record and check ownership before each protected mutation.

## Verification still required

- Run `npm run dev:deepspace`.
- Sign in as two different users in separate browser/device sessions.
- Ensure both users are approved for the same community.
- Create → respond → accept → resolve and confirm both screens update without refresh.
- Confirm a responder cannot accept and a non-owner cannot cancel/resolve.

## Gemini

`POST /api/help/clarify` is server-only, requires an authenticated session, validates input/output,
and reads `env.GEMINI_API_KEY`. Suggestions remain editable and never auto-publish or determine
emergency severity.

## n8n

Deferred until the authenticated two-user rehearsal works. Emit a minimal server-side event after a
verified help-item creation; include an event ID for replay safety and no description, identity,
address, contact information, or medical information.
