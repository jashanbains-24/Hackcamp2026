# NeighbourGrid — HackCamp 2026 Build Brief & Agent Handoff

> **Status:** Initial specification / source of truth for a three-person hackathon build.  
> **Event:** HackCamp 2026 (nwPlus, UBC Vancouver), November 7–8, 2026.  
> **Team:** 3 developers, working with coding agents.  
> **Deadline:** Devpost was reported as **November 8, 2026 at 12:15 p.m. PDT**. Vancouver switches to PST on November 1. **Do not assume the displayed timezone is correct**: open Devpost and confirm its live countdown. **Internal target: have everything submitted by 10:30 a.m. Vancouver local time on Nov 8** (or earlier if countdown requires it).  
> **First instruction:** Complete **PHASE 0 ONLY**, validate it, commit/push it, then STOP and give the team the three workstream handoffs. Do not independently implement the whole app in the initial run.

---

## 0. Executive product brief

**Tagline:** *When something happens nearby, neighbours can show up for each other.*

**One-sentence pitch:** NeighbourGrid is a mobile-first neighbourhood hub for BC residents to get context from official disruption information, discuss local events, request or offer supplies and assistance, and coordinate **opt-in community help** in real time.

### User vision

Think Reddit-like neighbourhood communities + a lightweight mutual-aid network + a community help beacon + a trustworthy information dashboard. The app is **useful on normal days**, while becoming much more valuable during storms, outages and other disruptions.

Illustrative flow: A resident of **Newton, Surrey** signs up and picks Newton as their home community. They can browse its feed, ask a question, comment, help a neighbour, or join neighbouring communities after approval. During a simulated power outage, another resident requests a phone power bank. A nearby volunteer accepts the request, and all open sessions update live. Meanwhile, the overview links to **official** BC Hydro updates with clear timestamps.

**Differentiator:** Existing neighbourhood networks allow posting; outage dashboards show events; NeighbourGrid makes the transition from **local information → concrete help request → opt-in coordinated response → resolution** seamless.

### Who benefits

- Neighbours facing power outages, storms, or temporary disruptions.
- People who need a temporary resource (charger, water, supplies, assistance) but have limited local connections.
- People willing to volunteer or lend supplies safely.
- Residents seeking familiar communities and practical local conversations during normal weeks.

**Important positioning:** This is a *hackathon prototype for community coordination*, not a first-responder service or an official emergency-alert system. No claims of guaranteed help, reliable evacuation guidance, or automatic dispatch.

### What the judges should see in ~90 seconds

1. **A polished mobile homepage:** "Good evening, Newton"; an official information card with attribution; community cards and recent conversations.
2. **A neighbourhood space:** Switch into Newton, read a thread, add a comment, see an active resource offer.
3. **A help request:** A neighbour posts "Need a portable charger for tonight" tagged *Power & charging*.
4. **A community help beacon:** Another user triggers a controlled *community assistance request* with an explanation and target communities, including a warning that it is **not emergency dispatch**.
5. **Live multi-user coordination:** On another browser/user session, someone offers help; request goes *Open → Offered/Matched → Resolved* without refreshing. The first user's app updates immediately.
6. **Verified vs simulated data:** Show a live BC Hydro source (if functioning), and explicitly show a **DEMO SCENARIO** banner for the simulated outage. Explain one meaningful AI feature only if actually working.

If we demonstrate those six steps smoothly, the core app succeeds.

---

## 1. Non-negotiable product boundaries and priority

### P0 — must work by judging

- Responsive **mobile-first** web app / PWA-style experience; works on normal laptop and phone browser.
- Public landing page (`/`) with brand, purpose, sample preview, obvious "Explore community" / sign-in CTA.
- Authenticated main app home (`/app`) with local overview, community preview, official/disaster information section, preparedness resources, and clear navigation.
- Select a **home community** during onboarding. Start with curated BC sample communities; use Newton as demo default, not precise user geolocation.
- Browse/join communities (instant join is acceptable for public groups; support a **request-to-join** state for private groups).
- Community discussion feed: create posts, view details, and comment.
- **Help requests/offers**, with a status lifecycle and owner-only resolution.
- **Community Help Beacon:** clear high-priority in-app assistance request directed to selected communities; cancel/resolve; visible real-time updates. It must **not** pretend to contact 911 or government agencies.
- At least **one real multi-user update** visible on two browsers without refresh, ideally request matching and beacon activity.
- Seeded demo content in a repeatable scenario. End-to-end deployed URL, source code, demo recording, submission.

### P1 — high value after P0

- BC Hydro outage RSS on the homepage via server-side fetch, with source/timestamp and a graceful empty/failure state.
- Meaningful AI feature: draft assistance for clear resource requests (extract category, suggest concise title and tags, *never auto-publish or decide emergency severity*), or concise **source-grounded summaries** of official updates with direct citations/links.
- Nearby/adjacent communities: send a help beacon to the user's joined community and one or two **opt-in** neighbouring community spaces; no surprise broad broadcast.
- Filter feed by discussion, local update, offers, requests; search communities.
- n8n automation: a demonstration webhook that records a new help-request event and creates a non-sensitive opt-in notification in a test destination, or a digest. Do not put webhook secrets in the browser.
- Feedback on help offers / status history, accessible toast notifications, useful empty states.

### P2 — only if everything else is polished

- Push notifications, direct messages, uploads, map pins, extensive moderation, complex reputation scores, PWA install prompt, multiple official data sources, richer resource directory.
- No full maps/routing feature, chat infrastructure, admin panel, payment flows, hardware or native mobile app in this 24-hour sprint.

**Timebox rule:** At any point, cut P2 first, then P1. Never sacrifice a demonstrable P0 loop for another integration.

---

## 2. Product design and pages

### Brand/design direction

- **Name:** NeighbourGrid (Canadian spelling throughout). Icon concept: interlinked houses or a simplified location grid + connection lines.
- **Mood:** Calm, trustworthy, contemporary civic-tech; **not** disaster sirens, blood-red panic UI, or generic purple AI gradients.
- **Suggested palette:** Deep navy `#10243A`, warm cream `#F7F8F5`, teal `#138B83`, amber `#F3B34C` for advisory context, muted coral `#D66A52` only for high-priority assistance. Neutral body text with strong contrast.
- **Typography:** Inter, Geist or another readable modern sans. 8px-ish spacing system, rounded cards, clear hierarchy, subtle borders/shadows, minimal stock imagery.
- **Accessibility:** WCAG-conscious contrast; real labels; 44px tap targets; keyboard operability; accessible alerts; avoid status conveyed only by color; reduced-motion respect. Visible source status and "Demo" labels.
- **Reference interaction:** Feels like a clean mobile neighbourhood app (Reddit community structure + modern local mutual-aid dashboard), **not a clone of either**.
- Icons: lucide-react; use polished empty/loading/error states and real interaction.

### Core navigation

Mobile sticky bottom bar: **Home**, **Communities**, **Help**, **Activity**, **Profile**. For MVP, Activity can be a filtered list of joined-community notifications/activity; Profile can show user's display name and home community. Desktop uses a side rail or top navigation with the same destinations.

### Pages / routes (logical routes; adapt actual router syntax to chosen framework)

| Route | Purpose | Priority | Ownership after PHASE 0 |
|---|---|---|---|
| `/` | Branded public landing with CTA and preview | P0 | Person A |
| `/app` | Personalized dashboard, official updates, shortcuts | P0 | Person A |
| `/app/communities` | Discover, join/request, switch home community | P0 | Person B |
| `/app/communities/:slug` | Local feed, posts, discussion | P0 | Person B |
| `/app/communities/:slug/posts/:id` | Post detail and comments | P0 | Person B |
| `/app/help` | Help board for joined community, requests and offers | P0 | Person C |
| `/app/help/new` | Create ordinary request/offer | P0 | Person C |
| `/app/beacon/new` | Confirm targeted community help beacon | P0 | Person C |
| `/app/activity` | User-specific recent help/post activity | P1 | Person A |
| `/app/profile` | Profile, community preference, basic account controls | P1 | Person A |

### Required home visual hierarchy

1. Greeting + home neighbourhood chip (e.g. **Newton, Surrey**) + profile/avatar.
2. One tasteful **Official Updates** information card (source, updated time, "View original"), with no fabricated current incident. If no live data, show "No verified local outage updates available" and a separate demo toggle.
3. Prominent **How can your neighbours help?** CTA, which opens ordinary request flow; a *separate*, high-visibility **Community Help Beacon** button with confirmation and warning.
4. Quick summary chips: **Active requests**, **Open offers**, **Community updates** (real counts once backend exists; placeholders explicitly marked in Phase 0).
5. "From your communities" preview (two seeded discussion cards).
6. Resource hub: "Before / During / After an outage", linking to official BC Hydro / PreparedBC / EmergencyInfoBC information (no invented advice or unsupported live assertions).
7. An inviting footer/tab navigation; no enormous hero graphic consuming a phone screen.

### Community experience

- Cards with name, municipality, description, tags, member count if available, join/join-request status.
- Suggested seed communities: **Newton**, **Guildford**, **Fleetwood**, **Cloverdale**, **City Centre (Surrey)**, **Ladner**, **North Delta**, **Burnaby Metrotown**. These are examples, not precise GIS-defined boundaries.
- Member feed supports `discussion`, `local_update`, `resource_offer`, and optionally `help_request` post types. Post title, body, author display name, timestamp, category badge, comment count; sort newest first.
- Threaded replies only one level deep for MVP; don't build Reddit-scale threading.
- Cross-community browsing follows visibility rules; publishing/commenting requires membership in that community.

### Help experience

- Help board cards: **Need help** vs **Can offer**, title, category, neighbourhood, approximate urgency/priority **self-selected by the user**, created time, status.
- Categories: power/charging, supplies, mobility/accessibility, transportation, wellness check-in (non-medical), other.
- Lifecycle: `open → offered → matched → resolved` and `cancelled`. Keep state transitions simple; owner must confirm a match/closure. An offer does **not** silently claim or close a request.
- Primary CTA: **I can help** opens a short public-to-participants offer note (no phone numbers publicly displayed).
- Personal safety: discourage meetups at private homes, personal addresses, and requests for sensitive medical information. Encourage safe public handoff locations where applicable.

### Community Help Beacon (the signature feature)

- This is deliberately **not** labelled an emergency SOS or an official emergency alert. Marketing may say "community help beacon" or "neighbourhood assistance signal".
- Entry point visible on Home and Help.
- Confirmation screen asks: category, short description, home community, optional select **one/two adjacent opt-in communities** (only communities user is allowed to post to or specifically preconfigured as accepting external assistance beacons), and "Send to community".
- Pre-send disclaimer: "Community volunteers may not respond. For immediate danger, call 911. This is not an emergency service." Provide cancel/back.
- Display an amber/coral high-priority card with a **Community assistance request** label, author, approximate neighbourhood only, and status: active / offered / resolved / cancelled.
- Don't expose street address, GPS, personal telephone or exact location. No automatic geolocation permission request. No implied response guarantees, unverified medical claims, or public emergency dispatch.
- Only owner cancels/resolves; users can flag reports; implement a basic request cooldown to prevent spam; do not allow a simple browser refresh to resend automatically.
- Demo beacon is tagged **DEMO** and never broadcasts to real external users/services.

### Official information vs community content

- Official cards: explicit **Official source**, publisher, original link, timestamp, fetched-at time; if possible, event timestamp. Do not rewrite source into stronger claims.
- Community posts: **Community-reported — not independently verified** label, particularly for disruption reports.
- Mocked outage: unmistakable **DEMO / SIMULATED SCENARIO** banner; never present seed data as live warnings.
- No automatic evacuation interpretation or "safe to travel" prediction.

---

## 3. Technical decisions and integration contract

### Preferred hackathon stack (single coherent path)

**Preferred:** **DeepSpace SDK's officially scaffolded full-stack app** (React + TypeScript + Vite frontend, Tailwind, shadcn-style components, Hono/Cloudflare Worker backend, DeepSpace records/auth/real-time sync). This is a **natural** use of the sponsor technology because real-time state changes are central to the product; it avoids maintaining a separate Supabase real-time backend solely for a prize.

**Verified start commands from official docs:**

```bash
npm create deepspace@latest neighbourgrid
cd neighbourgrid
npx deepspace dev start
```

**Read the current documentation before adding code**; SDK APIs may differ from examples. https://docs.deep.space/ — use the quickstart, data model, permissions, auth, records, and deployment pages. The scaffold already determines directory structure and route system; inspect it rather than guessing component paths.

**Fallback decision (important):** If DeepSpace local development **cannot produce a working app with persisted real-time updates after ~60–90 minutes of focused testing**, switch **once** to the team's familiar **Next.js + Supabase Auth/Postgres/Realtime** stack. If switching, preserve the same UI/data contracts and document the decision in `DECISIONS.md`. **Do not mix two parallel databases or build two competing backends.** When taking fallback, be honest that DeepSpace sponsor eligibility may be lost.

- UI: TypeScript, Tailwind, shadcn-style components, lucide icons.
- Auth: DeepSpace SDK auth, or Supabase Auth *only if fallback*. If account provisioning prevents judge testing, offer a gated, clearly labelled **demo user switcher** with **fake data and fake accounts only**, never anonymous privileged production access.
- Realtime: DeepSpace records/permissions/subscriptions first; Supabase Realtime only on fallback.
- Official data fetch: server/Worker endpoint, validated external RSS or a source-linked static guide if unavailable.
- AI: server-only Gemini API (optional but desirable P1), for helpful categorization/summarization. No client API keys, no blind posting of AI text, no fabrication.
- Automation: optional n8n webhook triggered by server-side verified request event, with test/sandbox delivery only; secret and URL server-side.
- Deployment: SDK deployment path if viable, else team's existing Vercel + Supabase setup. Deploy early, not at submission time.

### BC Hydro feed source

Official source: https://www.bchydro.com/safety-outages/power-outages/outages_rss.html

- BC Hydro says its **unplanned-outage RSS** is updated **every 15 minutes**, is organized by **region / municipality** (including Surrey), and can contain current/restored status, estimated restoration, affected customers, cause and last-updated information.
- Retrieve the actual Surrey or Lower Mainland feed link from the official index; **do not invent endpoint paths**. Test from server (CORS can block browser direct fetch).
- Use an RSS/XML parser; cache results for roughly 15 minutes; dedupe updates by source item/id and timestamps.
- Show meaningful loading, empty and failure states. Do not block app startup if unavailable; retain clickable source links.
- Outage municipality != precise neighbourhood location; **do not claim a Surrey-wide event is specifically in Newton** without verified granularity. No stale result presented as "live" without fetched-at time.

Additional official links (linked resources rather than scraping automatically in MVP):

- https://www.emergencyinfobc.gov.bc.ca/ — official BC emergency information.
- https://www.bchydro.com/safety-outages/power-outages.html — BC Hydro outage context.
- https://www2.gov.bc.ca/gov/content/safety/emergency-management/preparedbc — emergency preparedness information.

### Optional AI feature (choose one, make it meaningful)

**Recommended:** "Request Clarity Assistant" in the create-request flow.

User types: "My whole block's out, need somewhere to charge a phone for an hour." AI suggests:

```json
{
  "title": "Looking for a place to charge my phone",
  "category": "power_charging",
  "summary": "Would anyone in Newton be able to help with phone charging for about an hour?",
  "suggestedTags": ["charging", "power-outage"],
  "safetyNote": "Avoid sharing an exact home address in public posts."
}
```

- Structured JSON output, schema validation, short plain-language copy.
- All fields editable; **user must explicitly publish**.
- Do not let model decide medical acuity or automatically broadcast a beacon.
- Failure fallback: manual form always remains available.

**Alternative if official outage ingestion is reliable:** source-linked, attribution-preserving summary of confirmed outage update(s). Never generate details not present in source.

### Suggested shared data contracts (not implementation-specific)

Define these as TypeScript interfaces in a shared module during PHASE 0. Backing storage should use SDK schema and permissions, not blindly assume SQL.

```ts
type CommunityVisibility = 'public' | 'request_to_join';
type MemberStatus = 'pending' | 'approved' | 'rejected';
type PostKind = 'discussion' | 'local_update' | 'resource_offer';
type HelpKind = 'request' | 'offer' | 'beacon';
type HelpStatus = 'open' | 'offered' | 'matched' | 'resolved' | 'cancelled';
type HelpCategory =
  | 'power_charging'
  | 'supplies'
  | 'mobility_accessibility'
  | 'transportation'
  | 'wellness_checkin'
  | 'other';

type Community = {
  id: string; slug: string; name: string; municipality: string;
  description: string; visibility: CommunityVisibility;
  adjacentCommunityIds: string[]; createdAt: string;
};

type UserProfile = {
  id: string; displayName: string; homeCommunityId: string | null;
  createdAt: string;
};

type Membership = {
  id: string; userId: string; communityId: string;
  status: MemberStatus; createdAt: string;
};

type Post = {
  id: string; communityId: string; authorId: string;
  kind: PostKind; title: string; body: string;
  createdAt: string; updatedAt: string;
};

type Comment = {
  id: string; postId: string; authorId: string;
  body: string; createdAt: string;
};

type HelpItem = {
  id: string; communityId: string; authorId: string;
  kind: HelpKind; title: string; description: string;
  category: HelpCategory; status: HelpStatus;
  demo: boolean; targetCommunityIds: string[];
  createdAt: string; updatedAt: string;
};

type HelpResponse = {
  id: string; helpItemId: string; responderId: string;
  note: string; acceptedByRequester: boolean;
  createdAt: string;
};

type OfficialUpdate = {
  id: string; sourceName: string; sourceUrl: string;
  title: string; description: string;
  municipality: string | null;
  status: 'current' | 'restored' | 'advisory' | 'unknown';
  publishedAt: string | null; fetchedAt: string; isDemo: boolean;
};
```

**Contract rule:** `authorId`, `userId` and record-edit permissions must be enforced server-side from authenticated identity. Never trust browser-supplied identity or community membership. Store timestamps in UTC. Build explicit access checks for community membership and help response visibility. If full permissions aren't ready, keep sensitive functions behind sandbox/demo-only access until they are.

### Backend authorization, privacy, and safe demo design

- Read public community posts without membership if community is public; joining needed to create/comment.
- `request_to_join` communities require explicit approval before member-only reads/writes.
- Only author can edit/delete own post or help request; only requester accepts a help response and marks item resolved; others can offer assistance.
- Restrict beacon cross-posting to allowed target groups. Rate-limit/cooldown high-priority requests and prevent duplicate submission; basic reporting/muting if feasible.
- Do not expose precise locations, phone numbers, email addresses, medical issues, or private messages in public cards.
- Do not use unsanitized HTML from posts, RSS, or AI. Validate request inputs and escape output.
- Avoid push notifications to non-opted-in people. n8n webhook events must be authenticated, minimal, and safe to replay.
- Seeded demo users and sample events are explicitly fictional and not real government alerts.
- If user tests emergency functions, show **"Call 911 for immediate danger"**, not a fake escalation countdown.

---

## 4. PHASE 0 — INITIAL AGENT RUN (DO THIS FIRST, THEN STOP)

**Goal:** Get a clean, attractive, runnable mobile-first app shell on the initiating developer's laptop, with an immediately recognizable home dashboard, functioning navigation, and mock seeded content. The other two developers should be able to clone the repo and start in parallel.

### Instructions to the initiating coding agent

1. **Inspect the working directory first.** If already a Git repo, don't overwrite unrelated files. If no project exists, scaffold `neighbourgrid/` with preferred stack above. Inspect generated configuration and follow SDK conventions. Initialize Git if needed.
2. Add dependencies only as needed. Create `.env.example` with placeholders; `.env` and credentials ignored. Document exact setup commands in `README.md`.
3. Build the **shared app shell**: theme tokens, typography, responsive header, desktop navigation, mobile bottom navigation, accessible reusable `Button`, `Card`, `Badge`, `SectionHeader`, `EmptyState`, `LoadingSkeleton`, and toasts if easy.
4. Build **public `/`** (brand + concise value proposition + CTA) and **main `/app`** homepage **using seed/mock data only**. Include greeting/selected neighbourhood, official-info placeholder, simulated-outage demo banner, help CTA, beacon CTA, community discussion preview, preparedness resource cards.
5. Make all visible Phase 0 CTAs **actually navigate** to placeholder pages, open a labelled demo modal, or clearly indicate "coming in next build". No dead buttons. Add skeletal pages for Communities, Help, Activity and Profile to make routing work.
6. Define the **shared interfaces** in one place (`src/shared/types.ts` or framework-equivalent), seed data (`src/shared/demo-data.ts` or equivalent), and an optional thin repository/service layer so teammates don't hardcode fake data throughout UI. Avoid starting actual persistent backend features yet unless SDK scaffolding requires minimal config.
7. Create a `/demo` preview mode or `?demo=1` switch with fictional users and a clearly visible **Demo mode** badge. Default seeded locale: Newton, Surrey. No fake alert presented as real data.
8. Run whatever tests/build/lint the scaffold supports. Open locally and verify on a narrow mobile viewport (~390px) and desktop. Check routes, console errors, obvious overflow, buttons, keyboard focus.
9. Add `README.md` with setup, stack, initial design choices, testing, and "PHASE 0 only" status. Add `DECISIONS.md` (initial technology decision and fallback if chosen), and `TEAM_HANDOFF.md` with actual files/routes and the three work assignments below.
10. Make one clean local Git commit (`feat: scaffold neighbourgrid mobile app shell`). Push to agreed shared remote **only if repo remote and credentials are already available or explicitly provided**; otherwise print the exact commands the human should run. Never create an unrelated remote.
11. **STOP.** Do not independently implement the community backend, help matching, official feed, or n8n/Gemini in this first run. Report working URL, command, files changed, tests passed, and clear instructions for the other developers to pull and branch.

### PHASE 0 acceptance criteria

- [ ] One documented command boots the project locally.
- [ ] Landing page and main mobile home render without exceptions.
- [ ] Navigation links change pages and a Newton demo community is visibly selected.
- [ ] Home looks polished enough to screenshot, even before backend exists.
- [ ] Demo data is labelled simulated; official links go to the source.
- [ ] Shared interfaces and mock data are centralized, not scattered in components.
- [ ] Build/check passes; `.env` is excluded; Git commit exists.
- [ ] Agent stops after printing three team handoffs.

---

## 5. PHASE 1 — DIVIDE INTO THREE PARALLEL WORKSTREAMS

**Only after PHASE 0 is committed and all three have pulled the same baseline.** Assign one developer + one AI agent per lane. Use `feat/home-alerts`, `feat/communities`, `feat/help-beacon` branches (or Git worktrees). All three can run separate local dev servers; avoid simultaneous edits to shared files.

### Person A — Platform, home, official updates, deployment (initializing developer)

**Own:** Public landing `/`, `/app`, `/app/activity`, `/app/profile`; data/auth wiring, official feeds, deploy pipeline, overall integration.

**Ship:**
- DeepSpace auth / demo account flow; home community onboarding selection and persistence.
- Official BC Hydro RSS integration (if reachable) with proper source labels, server fetch, cache and empty/error handling; clearly separate demo disaster banner.
- Home dashboard wired to real aggregate community/help counts and latest items.
- Shared navigation polish, global skeletons/toasts, deployment URL, integration checks.
- Optional AI Request Clarity Assistant server integration only **after** P0 works, coordinate with C on its form interface.

**Avoid:** Building Person B's post routes and Person C's help routes. Person A alone owns shared auth/backend config; document precise exports for B/C.

**Definition of done:** On deploy, a signed-in/demo user sees the correct home community and real P0 counts; official info shows accurate source/timestamp or a truthful empty state; app can be opened on a phone.

### Person B — Communities, membership, threads and posts

**Own:** `/app/communities`, `/app/communities/:slug`, `/app/communities/:slug/posts/:id`; reusable post/comment/community components; membership and post collections.

**Ship:**
- Discover communities, choose/set home, join/request-to-join and pending indicator.
- Community feed with categories, timestamps, create post, post detail, add comments, sort newest.
- Sample seed posts for Newton and two other BC communities; ensure no unverified claims presented as live events.
- Permission checks: publish/comment only when approved member; only author can modify own content.
- Real-time feed updates between two demo sessions if SDK makes it straightforward.

**Avoid:** Editing Person A's Home root or Person C's Help views. Provide reusable hooks/services (`useCommunityFeed`, `useMembership`, etc.) and tell Person A which to import.

**Definition of done:** New post/comment created on one browser appears in the target community and obeys membership/author rules; other community remains isolated.

### Person C — Help network, beacon, matching and real-time demo

**Own:** `/app/help`, `/app/help/new`, `/app/beacon/new`; help cards, request form, help responses, beacon state.

**Ship:**
- Request/offer list by joined community with categories and status; functional create flow.
- Response button **I can help**, requester reviews/accepts, and status goes through open/offered/matched/resolved (or cancelled).
- Help beacon form, confirmation and 911 disclaimer, selected allowed target communities, owner cancel/resolve; distinct high-priority presentation.
- Real-time updates for requests and offers; prioritize **two-browser, two-user demo reliability**.
- Optional n8n webhook **only after** live request matching works, sending anonymized sandbox event to test workflow. Record its real architecture for sponsor submission.

**Avoid:** Building a full chat, geolocation tracking, mass SMS, or public phone number sharing. Person C defines help service APIs and returns aggregate count hooks to Person A.

**Definition of done:** One demo user creates a request/beacon; another user sees it and offers to help; first accepts; both screens update with the same status without page refresh.

### Integration / Git protocol

- Before coding, all three agree on contracts above and stable route ownership. No one silently renames shared interfaces or changes dependencies without announcing them.
- One owner per shared file (`app shell`, `types`, `backend config`). If a teammate needs a contract change, message the owner, document it, and merge one small PR first.
- For DeepSpace's shared schema/auth configuration: **Person A owns it**. B and C propose small schema/permission diffs in separate notes/PRs; A merges them. To avoid a bottleneck, agree on the schemas in the first 15 minutes after Phase 0.
- Commit small, meaningful changes; push frequently; PR each lane into `main`. Use a single integration owner (A). Avoid force pushes to `main`.
- At least every ~2 hours, merge **working vertical slices** into a deployed shared environment. Do not leave integration until the final hour.
- Each lane includes at least one smoke test and one short text summary of how to demo its feature.
- If conflict, prefer preserving the working end-to-end path over the cleaner architecture. Record deferred work honestly.

---

## 6. Timeboxed event plan / cut lines

**Assuming kickoff around 4–5 p.m. Saturday Nov 7; adjust relative times as needed. Submission target is fixed: 10:30 a.m. local Sunday Nov 8 or earlier if Devpost countdown dictates.**

| Window from kickoff | Outcome | Hard decision |
|---|---|---|
| **0–1.5h** | PHASE 0: scaffold, mobile home, placeholder routes, mock data, first commit | Test DeepSpace; if not viable by ~90 min, switch once to Supabase fallback |
| **1.5–2h** | Everyone pulls, fixes shared contracts, branches | No additional feature brainstorming |
| **2–7h** | Parallel build: A official/home/auth, B community feed, C help/beacon | At 7h, P0 flows should exist in branches |
| **7–11h** | Merge vertical slices; fix auth/permissions, real-time, mobile bugs; deploy | Cut P2 immediately; cut P1 if critical paths fail |
| **11–14h** | End-to-end rehearsals; official source checks; graceful fallbacks | Demo must work with real-time service *and* sample scenario |
| **14–16h** | UI polish, performance, accessibility, screenshots, 3–4-min video | Feature freeze; no breaking schema refactors |
| **16–17h** | README, attribution, Devpost submission, sponsor opt-ins, confirm links | Submit well before 10:30 a.m. local target |

**If behind:** Always protect these in order: deployed app → community feed → help request → two-browser offer/resolve → clear demo labeling → video/submission. Defer AI, RSS, n8n, complex onboarding, and private-community approvals if necessary.

### Demo storyboard / script

1. **0:00–0:25 — Problem:** "A power outage affects a neighbourhood. People have questions, supplies, and needs—but they're scattered across unrelated group chats and outage websites."
2. **0:25–0:50 — Home:** Show BC-wide context, official-source cards, Newton selected, local posts.
3. **0:50–1:25 — Local community:** Open Newton, show the feed, post or comment on an existing thread.
4. **1:25–2:15 — Action:** From account A, request a power bank; optionally activate a community beacon with its disclaimer.
5. **2:15–3:05 — Real-time:** On phone/account B, see the request immediately, offer help; account A accepts. Both change state live.
6. **3:05–3:35 — Technology:** Explain DeepSpace as the real-time coordination substrate; show source-labelled BC Hydro RSS if working; n8n/Gemini only if working.
7. **3:35–4:00 — Impact:** Everyday social fabric, stronger mutual aid during disruption, and honest limits: not emergency dispatch or government alerts.

**Backup:** Record a real working demo video early; keep sample accounts and resettable seed data. No live API call should be the only way to demonstrate your core features. Test demo on Chrome mobile viewport and a phone if available.

---

## 7. Sponsor and judging strategy

HackCamp evaluates **Problem & User Research, Innovation, Technical Implementation, Design & UX, Presentation**. Build evidence for each:

- **Problem & research:** Cite BC Hydro outages and BC community preparedness context. Ask 2–3 real classmates/residents whether they would trust/negotiate a neighbourhood assistance request, what details they would want shared, and what would make them hesitate. Don't invent interview results.
- **Innovation:** The **closed loop** from verified disruption context + local conversation + assistance offer + visible resolution, rather than a generic chat feed.
- **Technical:** Real-time synchronized state, scoped memberships, permission checks, official feed normalization, optional human-reviewed AI category helper, optional automation.
- **Design:** Excellent mobile hierarchy, accessible request flow, prominent source attribution, clear safety boundary, meaningful empty states.
- **Presentation:** Two device live demo + backup recording; show the actual state transition.

**Likely award fits:** Overall, Community Impact, Best Design (Figma link required for opt-in), Best Use of DeepSpace (meaningful real-time integration and demonstration), Best use of n8n (if genuinely integrated), Best Use of Gemini API (if working). **Don't opt into a sponsor track on the basis of a merely planned integration.** Verify actual rules before submitting.

### Evidence to capture for Devpost

- Working deployment URL and exact GitHub repo link.
- 3–4-minute recorded demo, clearly showing two sessions and request resolution.
- Figma design link if going for Best Design; simple responsive screens/flows are enough if accurately reflected in implemented UI.
- Architecture graphic showing DeepSpace real-time records, client UIs, RSS source, and optional Gemini/n8n integration.
- Screenshots: onboarding/community discovery; homepage; local post; beacon confirmation; help-offer resolution.
- Honest "built during hackathon" note and attributions for any reusable code/icons/models.
- Concise user-research notes and limitations (not a first responder system).

---

## 8. Quality checklist / completion gate

### Core workflows

- [ ] Resident can open landing and enter a signed-in or clearly fenced demo experience.
- [ ] Home area displays Newton and a working community switcher.
- [ ] Community browse/join works and the selected community governs posts shown.
- [ ] A new community post and comment survive refresh.
- [ ] Request created by one user appears in another authorized user's view.
- [ ] Other user responds; requester accepts; both see matched/resolved states.
- [ ] Beacon flow has explicit confirmation, community target, and correct safety warning.
- [ ] Source cards are official/source-linked; simulated data unmistakably marked.
- [ ] No unhandled errors during the 4-minute demo; mobile viewport looks intentional.

### Security/safety

- [ ] No API secrets in Git/client bundle; `.env.example` only.
- [ ] Input validation, escaping, basic authorization, member-scope checks.
- [ ] User can't edit another person's help request or accept their own offer as someone else.
- [ ] No precise home GPS, medical notes, or contact info exposed by default.
- [ ] App doesn't pretend to notify 911 or guarantee volunteers.
- [ ] No accidental real-world blast; demo data stays in an isolated demo environment.

### Ship

- [ ] Fresh clone setup documented and deploy URL loads.
- [ ] README explains purpose, technology, exactly what works, what is simulated and future work.
- [ ] Build/tests pass; two-browser smoke test performed.
- [ ] Video, Devpost description, repo, and optional Figma links submitted **before internal cutoff**.

---

## 9. Official references and integration documentation

- HackCamp 2026: https://hackcamp-2026.devpost.com/
- BC Hydro outage feeds (Surrey/Lowe Mainland linked from index): https://www.bchydro.com/safety-outages/power-outages/outages_rss.html
- EmergencyInfoBC (official BC emergency information): https://www.emergencyinfobc.gov.bc.ca/
- DeepSpace SDK (scaffold, records, realtime, permissions, deploy): https://docs.deep.space/
- DeepSpace sync architecture: https://docs.deep.space/concepts/realtime-sync
- n8n webhook docs: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- Gemini API docs (if used): https://ai.google.dev/gemini-api/docs

**Do not hardcode unverified BC Hydro feed URLs.** Find actual per-municipality URL from the official index in the browser and verify HTTP response before implementation. **Do not hardcode invented sponsor SDK methods**: check installed package version and current docs.

---

## 10. One-page prompt for the FIRST coding agent

> You are the initial NeighbourGrid repo bootstrap agent. Read **this entire `NEIGHBOURGRID_INITIAL_BUILD.md`**. Follow **PHASE 0 ONLY** in section 4. Create a clean, polished, working mobile-first app shell: public landing, personalized Newton, Surrey dashboard with source-labelled demo official updates, visible community previews, Help/Community Beacon CTAs, and working placeholder navigation. Prefer the current DeepSpace scaffold and its React/TypeScript stack; test it promptly and use the documented fallback only if necessary. Centralize interfaces and mock data, add README/.env.example/DECISIONS/TEAM_HANDOFF, run checks, commit. **Do not implement the full backend, real-time matching, RSS, Gemini, n8n, or all features in this initial run.** After Phase 0 passes, STOP and report setup commands, local URL, commit hash, notable files, tests, missing environment/permissions and ready-to-assign tasks for **A: platform/home/alerts**, **B: communities/threads**, **C: help/beacon/realtime**. Do not ask broad planning questions—make reasonable defaults and document assumptions. Never claim functionality is working until tested.

**Core north star:** A calm and welcoming app that is useful to a neighbourhood every day, but powerful when neighbours need each other.
