# AGENTS.md

This file is mandatory guidance for every coding agent working on NeighbourGrid.

## Start every session this way

1. Read `PROJECT_STATUS.md`, `TEAM_HANDOFF.md`, `DECISIONS.md`, and `README.md`.
2. Read the relevant sections of `NEIGHBOURGRID_INITIAL_BUILD.md`.
3. Run `git status --short --branch` and `git log -5 --oneline`.
4. Confirm the current stage and the developer lane before editing.
5. Preserve user and teammate changes. Never discard or overwrite an unfamiliar change.

If the UI-overhaul gate in `PROJECT_STATUS.md` is not complete, only Developer A/UI lead should
make product UI changes. Developers B and C wait for the updated `main` baseline.

## Product boundary

NeighbourGrid is a mobile-first community coordination prototype. It is not an emergency service,
government alert system, medical service, or guaranteed volunteer-dispatch system.

- Use approximate communities, never precise public addresses or automatic geolocation.
- Keep official information source-linked and separate from community-reported content.
- Mark fictional data and simulated scenarios clearly.
- Beacons must say: “Community volunteers may not respond. For immediate danger, call 911. This
  is not an emergency service.”
- Never auto-publish AI output or let AI determine emergency severity.

## Current stack and source of truth

This is a registered **DeepSpace 0.43** app using React 19, TypeScript, Vite, Tailwind CSS 4,
Hono/Cloudflare Workers, and DeepSpace auth/records/realtime.

GitHub `origin` and `main` are the shared team source. Do not introduce another Git host or run
`deepspace push` unless the team explicitly changes this decision. Use normal branches and pushes.

For DeepSpace work, first read <https://docs.deep.space/llms.txt>, then fetch the relevant current
page as Markdown by appending `.md`. The installed package types and CLI `--help` describe the
exact version in this checkout; never invent SDK methods.

## Staged Git workflow

The team intentionally has a serial UI gate before parallel feature development:

1. The owner pushes the registered Phase 0 baseline to `origin/main`.
2. Developer A creates `feat/ui-overhaul`, updates the shared design system, landing, shell, and
   home using mock data, verifies mobile/desktop, then pushes and merges it into `main`.
3. Only after that merge, all three developers pull the new `main`.
4. A creates `feat/home-alerts`, B creates `feat/communities`, and C creates
   `feat/help-beacon`.

Never develop directly on `main`. Do not start B/C feature branches from the pre-overhaul commit.
Do not force-push `main`.

Before a commit:

```sh
npm run type-check
npm run lint
npm run test:unit
npm run build
```

Run `npm run test:smoke` for navigation or UI changes. Commit only files belonging to the lane,
plus an accurate `PROJECT_STATUS.md` update.

## Ownership and conflict prevention

- Developer A/UI lead owns the initial visual overhaul, `src/components/neighbourgrid.tsx`,
  shared tokens, shell/navigation, `/`, `/app`, Activity/Profile, auth/schema integration,
  official updates, and deployment.
- Developer B owns community discovery, memberships, posts, details, and comments.
- Developer C owns help requests/offers, matching, beacon behavior, Gemini request assistance,
  and optional n8n automation.
- Person A owns shared DeepSpace auth/schema/provider files. B/C propose contract changes before
  depending on them.
- Do not broadly reformat or rename shared interfaces while lanes are parallel.

## Design and Figma

Developer A/UI lead owns the shared Figma file and implementation design system. Teammates may
comment, but A maintains components, mobile 390px screens, desktop screens, interaction states,
focus/error/empty states, and the final share link. Add the Figma URL to `PROJECT_STATUS.md` and
`README.md` when available.

Implementation must retain 44px tap targets, visible keyboard focus, sufficient contrast,
reduced-motion support, and clear non-colour status labels.

## Secrets and sponsor integrations

Never commit secrets, paste them into source, expose them through `VITE_*`, or manually edit
`.dev.vars`. DeepSpace owns an encrypted per-app store and regenerates `.dev.vars`.

The user already has a Gemini API key. Do not ask them to paste it into chat or source. When
Developer C has the request form and server endpoint ready, give the user the exact “Gemini key”
steps in `README.md`, then read the key only as `env.GEMINI_API_KEY` in Worker/server code.

The user is creating an n8n account while A performs the UI overhaul. Do not block the UI gate on
n8n. Add n8n only after the two-user help lifecycle works. Store `N8N_WEBHOOK_URL` in DeepSpace
secrets and send only a minimal, anonymized, replay-safe event from the server.

Do not add Auth0: DeepSpace is the chosen auth system. Do not bolt on unrelated sponsor products
at the expense of the P0 loop.

## Agent progress protocol

At the end of every meaningful work session, update `PROJECT_STATUS.md` with:

- date/time and branch;
- developer lane;
- completed behavior and notable files;
- tests actually run and their results;
- migrations/configuration or service changes;
- blockers and any user action required;
- the next concrete task and safe handoff point.

When user action is required, explain it with short numbered steps, exact commands/URLs, where to
run them, and what success looks like. Do not merely say “configure the API.” Never claim a
feature, integration, deployment, or test works until it was actually verified.

## Project commands

```sh
npm run dev             # mock-capable Vite app on http://localhost:8780
npm run dev:deepspace   # full registered DeepSpace local runtime
npm run type-check
npm run lint
npm run test:unit
npm run test:smoke
npm run build
npx deepspace deploy
npx deepspace secrets list
```

`worker.ts` already exposes tools from `src/ai/tools.ts`; add tools there rather than registering
the routes again. For app tools, run `deepspace agent tools` first and follow the returned schema.
