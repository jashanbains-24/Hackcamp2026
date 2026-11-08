# Help feature integration contract

Developer C owns this feature. The current branch includes a complete fictional local demo adapter
so UI and lifecycle work can be reviewed before Developer A’s shared DeepSpace schemas land.

## Current behavior

- `help-store.ts` persists fictional help records in local storage.
- `BroadcastChannel`/storage events synchronize open tabs without refresh.
- Participant identity is session-scoped so two tabs can represent different fictional residents.
- This is a labelled demo fallback, not the final cross-device realtime implementation.

## Required DeepSpace collections from Developer A

Use the existing `HelpItem` and `HelpResponse` interfaces as the field contract.

### `help_items`

- authenticated author identity must come from the server/session, never the browser payload;
- author can update/cancel their own item;
- only the author can mark matched/resolved;
- approved community members can read relevant items and create ordinary requests/offers;
- beacon targets are restricted to the home community plus configured eligible communities;
- beacon creation has a server-enforced cooldown and idempotency protection.

### `help_responses`

- authenticated responder identity comes from the server/session;
- responder cannot respond to their own item;
- one active response per responder/item;
- requester alone accepts a response;
- response notes are visible only to authorized participants where practical.

## Lifecycle

`open → offered → matched → resolved`, with owner-controlled `cancelled`.

An offer never silently claims or closes a request. Accept and resolve are explicit requester
actions. Server actions must load the record and check ownership before each protected mutation.

## Adapter migration

Replace calls behind `helpDemoActions`/`useHelpDemoStore` with A’s stable DeepSpace hooks or a
provider implementing the same operations. Keep the local adapter as a truthful offline demo
fallback only if the UI labels it clearly.

## Gemini

`POST /api/help/clarify` is server-only, requires an authenticated session, validates input/output,
and reads `env.GEMINI_API_KEY`. Suggestions remain editable and never auto-publish or determine
emergency severity.

## n8n

Deferred until persisted two-user matching works. Emit a minimal server-side event after a
verified help-item creation; include an event ID for replay safety and no description, identity,
address, contact information, or medical information.
