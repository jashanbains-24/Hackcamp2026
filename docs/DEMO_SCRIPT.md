# NeighbourGrid demo script and backup checklist

**Audience:** judges / teammates · **Length:** 3–4 minutes · **Branch baseline:** `main` @ `1b1ce8d+`

## Live demo script (≈3.5 minutes)

### 0:00–0:25 — Frame the product

> NeighbourGrid is a mobile-first neighbourhood hub for BC communities during outages and
> disruption. Neighbours can talk locally, see trusted official updates, and ask for opt-in help.
> It is **not** an emergency service—when someone is in immediate danger, call 911.

Open the **landing page** (`/`). Point to the brand-first hero and the clear non-emergency CTA.

### 0:25–0:55 — Home + official updates

Enter the app (`Open the app` → `/app`). On Home:

1. Show the DEMO account fence and home community (Newton).
2. Scroll to **Official updates** — BC Hydro Surrey municipality feed, source-linked, separate from
   community posts.
3. Note the safety language: fictional demo data is labelled; official cards link out.

### 0:55–1:35 — Communities

Navigate to **Communities**:

1. Browse curated BC communities; open **Newton**.
2. Show join / home selection if needed.
3. Open or create a short community post; mention one-level comments and community-reported labels.

### 1:35–2:45 — Help lifecycle (core demo)

Navigate to **Help**:

1. Create an ordinary request (title + category + summary). Emphasize editable form—no AI severity.
2. Switch to a second participant (demo switcher **or** second authenticated browser).
3. Respond with **I can help** → requester **Accept** → **Resolve**.
4. Call out: both sessions update without refresh (authenticated realtime verified).

Optional 20s: open **Beacon**, show confirmation + cooldown + the mandatory disclaimer:
> Community volunteers may not respond. For immediate danger, call 911. This is not an emergency
> service.

### 2:45–3:15 — Activity / Profile + close

Quick pass on **Activity** and **Profile**. Close with:

> Official information stays source-linked. Community help is opt-in and never guaranteed. DeepSpace
> powers auth, records, and realtime. Gemini request clarity and n8n automation are ready to enable
> but intentionally deferred for this demo.

## Backup-demo checklist (if live / DeepSpace / network fails)

Use this order—stop at the first path that works.

1. **Static / Vite demo path (preferred backup)**
   - `npm run build && SMOKE_STATIC=1 npm run test:smoke` already green means UI routes work.
   - Run `npm run dev` → `/app?demo=1`.
   - Demo Help adapter: create → offer → accept → resolve in two browser tabs (local sync).
   - Communities demo adapter: browse Newton, post, comment.
2. **Pre-recorded path**
   - Use screenshots in `docs/presentation/` (landing, home, communities, help, beacon).
   - Narrate the same script over stills; do not claim live Gemini/n8n.
3. **Talking-points only**
   - Product boundary + 911 disclaimer.
   - Three lanes merged: Home/official, Communities, Help/Beacon.
   - Authenticated two-user help realtime passed before presentation.
   - Sponsors claimed only where verified: DeepSpace yes; Gemini/n8n not claimed as live.

## Owner deployment steps (do not configure Gemini or n8n yet)

Run locally from the repo after merging `chore/final-integration`:

```bash
git switch main
git pull origin main
npm install
npm run type-check && npm run lint && npm run test:unit && npm run build
npx deepspace auth login          # if not already signed in
npx deepspace app list            # confirm the NeighbourGrid app appears
npx deepspace deploy
```

**Success looks like:** deploy command prints a live `*.space` URL; open it on a phone; landing
loads; `/app` shows auth or demo fence; Help/Communities routes resolve.

**After deploy (still optional / deferred):**

- Paste the live URL into `README.md` and `PROJECT_STATUS.md`.
- Gemini / n8n: follow `README.md` secure secrets steps **only when you choose to enable them**.
  Do not upload those secrets for this presentation pass.

## What not to claim on Devpost

- Not an emergency / government / medical service.
- Do not claim Gemini suggestions unless the secret was uploaded and a live call was verified.
- Do not claim n8n automation until the webhook secret and server event are verified.
- Do claim: DeepSpace auth/records/realtime; BC Hydro Surrey official feed path; merged A/B/C UX.
