# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are residents in British Columbia who need their neighbourhood connected during power outages and similar disruptions—people seeking practical local help, conversation, and trustworthy official context without pretending the product is emergency dispatch.

Secondary audiences for the current build include HackCamp judges evaluating a mobile-first prototype demo; they are not the product’s intended end users.

## Product Purpose

NeighbourGrid is a mobile-first neighbourhood hub that helps BC residents get context from official disruption information, discuss local events, request or offer supplies and assistance, and coordinate opt-in community help in real time. It should be useful on ordinary days and more valuable during storms, outages, and temporary disruptions.

Success for this hackathon build means a smooth demo of the P0 loop: polished home → neighbourhood space → help request → Community Help Beacon → live two-user coordination, with official sources and DEMO/simulated content clearly separated.

## Positioning

NeighbourGrid makes the path from local information → concrete help request → opt-in coordinated response → resolution feel continuous. Neighbouring products that only host posts or only show outage dashboards cannot truthfully claim that same end-to-end neighbour help loop.

It is a community-coordination prototype, not a first-responder service, government alert system, medical triage tool, or guaranteed volunteer-dispatch system.

## Operating Context

- Demo home community: Newton, Surrey (approximate neighbourhood, not precise GIS or GPS).
- Curated BC sample communities for discovery and membership.
- Official information is source-linked (e.g. BC Hydro, PreparedBC, EmergencyInfoBC) and kept separate from community-reported content.
- Fictional/demo seed content is labelled DEMO or SIMULATED SCENARIO.
- HackCamp 2026 judging context: short live or recorded walkthrough on phone-width and laptop browsers.

## Capabilities and Constraints

**Intended capabilities (P0/P1 product truth):**
- Public landing and authenticated app shell with Home, Communities, Help, Activity, Profile.
- Home community selection; browse/join or request-to-join communities.
- Community posts and one-level comments.
- Help requests/offers with a clear status lifecycle and owner-only resolve/cancel.
- Community Help Beacon: high-visibility, opt-in, targeted community assistance request with realtime updates—never 911 or agency contact.
- At least one realtime multi-user update without refresh.
- Optional later: BC Hydro server-side official feed; editable Gemini request-clarity assistance; anonymized n8n webhook after the help lifecycle works.

**Hard constraints:**
- Approximate communities only; never precise public addresses or automatic geolocation.
- Beacon copy must include: “Community volunteers may not respond. For immediate danger, call 911. This is not an emergency service.”
- Never auto-publish AI output or let AI determine emergency severity.
- No exact phone numbers or sensitive personal details in public posts.
- DeepSpace is the auth/records/realtime/secrets platform; do not add Auth0 or a parallel database for the core loop.
- Canadian spelling: NeighbourGrid.

**Undecided / deferred:** Figma share URL for Best Design track; n8n account readiness; live BC Hydro feed wiring; Gemini secret upload until the server endpoint exists.

## Brand Commitments

- **Name:** NeighbourGrid (Canadian spelling throughout).
- **Voice:** Calm, trustworthy, civic; clear safety boundaries; never panic or siren language.
- **Tagline (brief):** “When something happens nearby, neighbours can show up for each other.”
- Binding product language: “Community Help Beacon” / community assistance—not SOS, not emergency dispatch.

## Evidence on Hand

- Build brief: `NEIGHBOURGRID_INITIAL_BUILD.md`
- Live execution docs: `AGENTS.md`, `TEAM_HANDOFF.md`, `PROJECT_STATUS.md`, `DECISIONS.md`, `README.md`
- Shared contracts and fictional seeds: `src/shared/types.ts`, `src/shared/demo-data.ts`
- Runnable Phase 0 / UI-overhaul surfaces: `/`, `/app`, communities/help/beacon placeholders
- Do not fabricate testimonials, customer logos, live outage claims, or guaranteed-response metrics.

## Product Principles

1. Neighbours first, systems second — help people coordinate locally without impersonating official emergency response.
2. Source honesty — official, community-reported, and demo/simulated content must stay visually and semantically distinct.
3. Privacy by design — approximate place only; no public exact addresses, GPS, or personal contact details.
4. Opt-in coordination — help and beacons are voluntary; never promise response or auto-broadcast widely.
5. Demo truthfulness — only claim integrations and realtime behaviour that actually work in the build being shown.

## Accessibility & Inclusion

Required bar for this product: WCAG-conscious interaction—real labels, 44px tap targets, visible keyboard focus, sufficient contrast, reduced-motion respect, and status that is never conveyed by colour alone. Mobile-first usability at ~390px width is part of product success, not polish.
