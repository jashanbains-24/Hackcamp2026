# NeighbourGrid

NeighbourGrid is a mobile-first neighbourhood hub for local conversations, trusted official
information, and opt-in neighbour-to-neighbour help. It is a HackCamp 2026 prototype—not an
emergency service or official alert system.

## Phase 0 status

This repository currently contains **Phase 0 only**:

- Polished public landing page at `/`
- Responsive app shell and Newton, Surrey demo dashboard at `/app`
- Working mobile and desktop navigation
- Placeholder routes for Communities, Help, Activity, Profile, help creation, and the Community
  Help Beacon
- Centralized TypeScript contracts and fictional demo data
- Clearly separated official-source empty state and simulated scenario

Persistent records, authentication UX, community posting, help matching, realtime updates, the BC
Hydro feed, Gemini, and n8n are intentionally not implemented yet.

The DeepSpace app is registered. Developer A’s UI overhaul lives on `feat/ui-overhaul` (pending
review/commit). Parallel A/B/C feature branches start only after that work is merged into `main`.

## Local setup

Requirements: Node.js 22.15+ (or Node 24/26) and npm 11.6+.

```bash
git clone https://github.com/jashanbains-24/Hackcamp2026.git
cd Hackcamp2026
npm install
npm run dev
```

Open `http://localhost:8780`. `npm run dev` starts the mock-capable UI; `npm run dev:deepspace`
starts the full registered DeepSpace runtime.

No application secrets are required for Phase 0. Copy `.env.example` only when a later workstream
adds an integration:

```bash
cp .env.example .env
```

## Stack

- DeepSpace 0.43 scaffold and local runtime
- React 19 + TypeScript + Vite
- React Router file-based routes
- Tailwind CSS 4 semantic theme tokens
- Lucide icons and accessible scaffold UI primitives
- Hono/Cloudflare Worker foundation (unused by Phase 0 product features)

The technology decision and fallback threshold are recorded in `DECISIONS.md`.

The DeepSpace app registration is complete. Teammates who need to run the full runtime, manage
secrets, or deploy must sign in and be trusted DeepSpace collaborators. Collaborator access
includes plaintext access to every app secret; do not grant it merely for UI work.

When a feature developer needs DeepSpace access, the owner runs:

```bash
npx deepspace app collaborators add teammate@example.com
```

The teammate signs in with the invited email and accepts the emailed invitation, or runs:

```bash
npx deepspace auth login
npx deepspace app collaborators invites
npx deepspace app collaborators accept <app-id>
```

Success means the shared app appears in `npx deepspace app list` with role `collaborator`.

## Useful commands

```bash
npm run dev        # Phase 0 local app at http://localhost:8780
npm run dev:deepspace # Full SDK runtime after app registration
npm run lint       # React hooks lint
npm run type-check # TypeScript validation
npm run test:unit  # Unit/prerender checks
npm run build      # Production build
```

## Secure Gemini and n8n setup

Do not put real values in `.env`, `.env.example`, client code, `VITE_*`, chat, or commits. Do not
manually edit `.dev.vars`; DeepSpace regenerates it from the encrypted app store.

The user already has the Gemini API key. Wait until Person C has implemented the server endpoint,
then ask the user to run these commands locally from the repository:

```bash
read -s GEMINI_API_KEY
printf 'GEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" | npx deepspace secrets upload -
unset GEMINI_API_KEY
npx deepspace secrets list
```

Success means `GEMINI_API_KEY` appears by name in the masked list. Restart
`npm run dev:deepspace`; after a production secret change, redeploy. Server code reads only
`env.GEMINI_API_KEY`.

When the n8n account and server workflow are ready, use the same pattern with
`N8N_WEBHOOK_URL`. Keep the webhook server-side and send only anonymized, replay-safe demo events.

## Demo and safety notes

- `/demo` redirects to `/app?demo=1`.
- Maya and all community activity shown in Phase 0 are fictional.
- The dashboard truthfully states that no verified local outage update is connected.
- Official resource cards link directly to BC Hydro, PreparedBC, or EmergencyInfoBC.
- The beacon preview sends nothing and prominently says to call 911 for immediate danger.
- No precise location, phone number, or sensitive personal information is collected.

## Project map

- `src/pages/index.tsx` — public landing
- `src/pages/(app)/app/` — app shell routes
- `src/components/neighbourgrid.tsx` — brand, shell, card, section, and loading primitives
- `src/shared/types.ts` — stable shared contracts
- `src/shared/demo-data.ts` — centralized fictional demo data
- `src/styles.css` — NeighbourGrid visual tokens and global accessibility behavior
- `TEAM_HANDOFF.md` — file ownership and the three next workstreams
- `PROJECT_STATUS.md` — current stage, blockers, test evidence, and next safe handoff

## Team workflow

The team uses a serial UI gate before parallel feature work:

```bash
# Owner first pushes the registered/documented Phase 0 baseline.

# Developer A:
git pull origin main
git switch -c feat/ui-overhaul
# Implement and verify shared Figma/design-system/UI work, then push and merge.

# After the UI overhaul is merged, all three developers:
git switch main
git pull origin main
git switch -c feat/home-alerts       # A
# or: git switch -c feat/communities # B
# or: git switch -c feat/help-beacon # C
```

Do not silently rename shared interfaces or edit another lane’s owned routes. Coordinate shared
schema/auth changes through Person A. Every coding agent must read `AGENTS.md` and update
`PROJECT_STATUS.md` before handing work to another agent.

## Design file

Implementation system of record: [`DESIGN.md`](./DESIGN.md). Developer A/UI lead also owns the shared Figma file.

**Figma:** Pending share URL.