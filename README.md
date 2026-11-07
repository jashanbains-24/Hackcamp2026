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

## Local setup

Requirements: Node.js 22.15+ (or Node 24/26) and npm 11.6+.

```bash
git clone <shared-repository-url>
cd Hackcamp2026
npm install
npm run dev
```

Open `http://localhost:8780`. One documented command, `npm run dev`, starts the mock-only Phase 0
app without shared service credentials.

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

The app is not registered to a DeepSpace account because no credentials were available during
Phase 0. Person A should run `npx deepspace auth login && npx deepspace app init` once for the
shared project. Until then, Vite uses a local-only preview identity; the normal DeepSpace build
plugin turns on automatically after registration.

## Useful commands

```bash
npm run dev        # Phase 0 local app at http://localhost:8780
npm run dev:deepspace # Full SDK runtime after app registration
npm run lint       # React hooks lint
npm run type-check # TypeScript validation
npm run test:unit  # Unit/prerender checks
npm run build      # Production build
```

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

## Team workflow

All three developers should first pull this baseline, run the checks above, and then branch:

```bash
git pull origin main
git switch -c feat/home-alerts       # Person A
# or feat/communities                # Person B
# or feat/help-beacon                # Person C
```

Do not silently rename shared interfaces or edit another lane’s owned routes. Coordinate shared
schema/auth changes through Person A.