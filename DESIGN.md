---
name: NeighbourGrid
description: Calm civic neighbourhood hub for BC outage coordination and opt-in help
colors:
  navy: "#10243A"
  mist: "#F3F6F2"
  primary: "#0A6560"
  primary-ink: "#084F4B"
  primary-foreground: "#FFFFFF"
  foreground: "#10243A"
  muted-foreground: "#4D5D6B"
  secondary: "#E4EFEA"
  border: "#D4DED8"
  advisory: "#FFF6E5"
  advisory-foreground: "#6A4A12"
  beacon: "#C85A45"
  destructive: "#C85A45"
  card: "#FFFFFF"
typography:
  brand:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(3.25rem, 11vw, 5.75rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.85rem, 3.8vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  meta:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  sm: "0.625rem"
  md: "0.75rem"
  lg: "1rem"
spacing:
  tight: "8px"
  copy: "16px"
  section: "24px"
  peak: "32px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "44px"
  nav-active:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    height: "44px"
---

## Overview

NeighbourGrid is a light, calm civic product. Persuade surfaces (landing) use a navy full-bleed brand field and restrained motion. Operate surfaces (app) are single-column, divider-led tools with almost no card chrome. Brand character comes from Fraunces for titles and teal action for primary work—not from gradients, glow, or badge stacks.

## Colors

- **Navy** (`#10243A`) anchors the landing hero and brand structure.
- **Mist** (`#F3F6F2`) is the app ground.
- **Primary teal** (`#0A6560`) is for filled actions. Use **primary-ink** (`#084F4B`) for text links on mist so contrast stays ≥4.5:1.
- **Advisory amber wash** is only for DEMO / SIMULATED notices.
- **Beacon coral** is only for high-visibility assistance actions—not general error chrome.
- On navy, secondary copy must be tinted from navy + mist/white—not gray.

## Typography

Authoritative faces: **Fraunces** (brand / display / titles) and **Manrope** (headline message, lead, body, meta, controls). Loaded weights: Fraunces 600/700, Manrope 400/500/600/700.

Role utilities in `src/styles.css`: `ng-type-brand`, `ng-type-headline`, `ng-type-display`, `ng-type-title`, `ng-type-title-sm`, `ng-type-lead`, `ng-type-body`, `ng-type-meta`.

- Prefer weight and space over colour for hierarchy. No uppercase kickers/eyebrows above headings.
- Body floor is `1rem`. Prose measure targets ~45–75ch (lead often tighter, ~34–48ch).
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty` where supported.
- On navy, open tracking slightly on lead copy and keep secondary text mist-tinted, not gray.

## Layout

- **Landing:** brand-first first viewport; one supporting section; footer.
- **App:** max content width ~720px, vertical sections separated by borders, not card grids.
- Mobile: bottom nav + compact top bar. Desktop: left rail flush to the viewport edge (not centered with the content column).
- Touch targets: minimum 44px height for primary controls.
- Stack utilities: `ng-stack-tight` (8px within a unit), `ng-stack-copy` (16px for title→prose), `ng-stack-section` (24px between units). Help/actions are the home peak; secondary feeds stay denser.
- Related meta (demo counts, disclaimers) sits with its parent group—never as a lone full-width section.

## Motion

- **Landing focal:** `ng-brand-reveal` — NeighbourGrid lifts in via clip-path + blur settle (~820ms). Supporting copy uses staggered `ng-rise`; hero wash/drift are slow atmosphere only.
- **Feedback:** primary CTA arrow nudge (`ng-cta-primary`); home help actions `ng-settle`; beacon safety note one-shot `ng-attend`.
- Prefer `prefers-reduced-motion: no-preference` gated motion. Default styles stay fully visible without animation.
- **Overdrive (progressive):**
  1. Scroll-driven hero/motif exit + loop-step entry via `animation-timeline: view()` (`@supports` + reduced-motion off).
  2. Route View Transitions on shell/landing Links (`viewTransition`); shared `ng-vt-brand` name; short crossfade fallback in unsupported browsers is a hard cut.
  3. Pointer-reactive neighbourhood grid canvas on the landing hero (`NeighbourhoodGridCanvas`); SVG `LayoutGrid` fallback when reduced-motion is on.

## Elevation & Depth

Operate UI is mostly flat: border or nothing. Prefer a single 1px border over soft multi-layer card shadows. Landing primary CTA may use a **neutral** navy-tinted shadow, never a coloured glow.

## Shapes

Radii stay modest (`~12–16px`). Pills are for compact header controls only, not content chrome. Scrollbar thumbs may use a tighter `0.25rem` radius (not a content token).

## Components

- **BrandMark:** grid icon + optional wordmark.
- **PageIntro:** title + optional description/action—no eyebrow.
- **BackLink:** shared nested-route back control with View Transition.
- **EmptyPanel / ErrorPanel / ComingSoon:** quiet, border-led, no decorative icon tiles; no eyebrow kickers.
- **AppShell:** foreground-weighted active nav (not low-contrast teal-on-tint).

## Do's and Don'ts

**Do**
- Separate Official / Community / DEMO content in plain language.
- Keep beacon and 911 safety copy visible where relevant.
- Use list + divider patterns for feeds and resources.

**Don't**
- Radial spotlight glows, coloured CTA halos, or icon+stat metric cards.
- Eyebrow/kicker labels above headings.
- Nest cards or convey status by colour alone.
- Invent live outage claims or guaranteed response language.
