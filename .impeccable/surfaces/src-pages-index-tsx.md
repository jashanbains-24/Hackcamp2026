---
version: 1
slug: "src-pages-index-tsx"
primary_target: "src/pages/index.tsx"
related_targets: ["src/components/neighbourgrid.tsx","src/pages/(app)/app/index.tsx"]
---

# Surface brief — NeighbourGrid (landing + app shell + all /app routes)

Scope: replacement visual world across `/` (Persuade) and every `/app` route (Operate). Mobile 390px first, desktop second. Follows device colour scheme (light + dark).
Audience/job: BC residents checking official outage context, neighbours, and opt-in help; HackCamp judges on phone + laptop.
Constraints kept untouched: routes, shared types, demo/official/community labels, beacon 911 sentence, 44px targets, focus, reduced motion, Playwright selectors.
User-pinned direction: Apple-style minimalism with liquid glass; keep Fraunces + Manrope; cut copy aggressively (one line per section, details behind a tap, disclaimers to one footnote).

## Direction contract

THESIS: One ambient field, a few floating glass panes, and almost no sentences. The page refuses the stacked-divider dashboard of labelled sections and paragraphs; each screen holds one headline, one primary action, and grouped inset lists.
OWN-WORLD: Ground is a near-white (or near-black) field with two slow-drifting teal/sky ambient blobs fixed behind content. Panes are translucent glass (blur 24px, saturate 1.6, inner 1px highlight, hairline border, soft offset shadow), radius 22px. Controls are 14px-radius glass or filled teal; the tab bar is a floating glass pill. Fraunces 600 for the single headline per screen; Manrope for everything else. One accent (teal); coral only for the beacon.
STORY: "This is calm, it knows my neighbourhood, and the one thing I might need is one tap away." Visitor opens the app, sees greeting + community, taps Ask for help or scans official updates in two lines each.
FIRST VIEWPORT (landing, 390px): ambient field; glass top bar with wordmark + Open app; centered Fraunces wordmark "NeighbourGrid" at ~3rem (deviation from the 3.5rem roll: the 13-glyph Fraunces wordmark overflows a 350px column above ~3.05rem, so the size is fluid at 12.4vw, filling the column edge to edge), one headline line "Help is nearby.", one short sentence, one filled CTA "Open the app" with a text link "Preview demo"; one meta line. Desktop: same, left-aligned at 1180 max.
FORM: Ambient glass (candidate 3 of 7 Apple-world renditions: iOS glass tiles, Maps sheets, Weather/Fitness ambient field, apple.com product page, visionOS panes, Settings grouped lists, Lock Screen widgets). seed:7e4fd19400114524. Roll ran degraded (no challengers); user pin beats the roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Signature interaction: glass pill tab bar active indicator slides between tabs; panes settle in with a short blur→clear reveal; CTA press scale.
