---
name: NeighbourGrid
description: Ambient-glass neighbourhood hub for BC outage coordination and opt-in help
colors:
  field-light: "#E6EEF4"
  field-dark: "#03303D"
  ink: "#03303D"
  ink-dark: "#E7EEF6"
  ink-muted: "#3E5674"
  ink-muted-dark: "#B7C6DC"
  primary: "#03303D"
  primary-ink: "#022833"
  primary-dark: "#839CC5"
  primary-ink-dark: "#D5E1F0"
  primary-foreground: "#F4F7FB"
  stone: "#839CC5"
  scarlet: "#E82F33"
  glass: "rgba(247, 250, 252, 0.74)"
  glass-strong: "rgba(247, 250, 252, 0.88)"
  glass-dark: "rgba(131, 156, 197, 0.14)"
  glass-strong-dark: "rgba(8, 52, 66, 0.82)"
  glass-border: "rgba(131, 156, 197, 0.45)"
  glass-highlight: "rgba(255, 255, 255, 0.4)"
  hairline: "rgba(3, 48, 61, 0.12)"
  ambient-stone: "#C9D7E8"
  ambient-mist: "#D7E3F0"
  ambient-egyptian-dark: "#1A5C6E"
  ambient-stone-dark: "#839CC5"
  advisory: "#F6F0E4"
  advisory-foreground: "#5C4314"
  beacon: "#E82F33"
  beacon-dark: "#E82F33"
  success: "#1A5560"
typography:
  brand:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.75rem, 12.4vw, 5.75rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.85rem, 3.8vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
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
  label:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  field: "12px"
  control: "14px"
  pane: "22px"
  pill: "9999px"
spacing:
  tight: "8px"
  copy: "16px"
  section: "24px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-ink}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
  button-glass:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
    height: "44px"
  button-chip:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  pane:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pane}"
    padding: "16px"
  pane-strong:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pane}"
    padding: "16px"
  input:
    backgroundColor: "rgba(255, 255, 255, 0.7)"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "44px"
  status-label:
    backgroundColor: "rgba(16, 36, 58, 0.08)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "24px"
  tab-bar:
    backgroundColor: "{colors.glass-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "64px"
---

# Design System: NeighbourGrid

## Overview

**Creative North Star: "Ambient Glass"**

NeighbourGrid is a quiet place to check on your block when the power is uncertain. The whole product sits on Egyptian blue: a pale wash in light, and `#03303D` itself in dark. Stone blue (`#839CC5`) is the second colour, about a fifth of what you see. Scarlet (`#E82F33`) is only the Community Help Beacon. Panes are soft glass with one stone hairline. There is no gradient rim and no second accent.

Density is low and the text is cut hard: one short line per section, details behind a tap, disclaimers folded into a single footnote per screen. Fraunces appears exactly once per screen, on the brand or the one display headline; everything else is Manrope. Teal is the only accent and does only one job, action. Coral exists for the Community Help Beacon and nowhere else. The old navy full-bleed hero, divider-only lists, and amber badge stacks are the anti-reference this world replaced.

**Key Characteristics:**
- One ambient field (fixed, blurred, drifting) under every surface; only `html` paints the ground.
- Glass panes at three depths: grouped lists sit in the field, panes rest on it, controls float over it.
- Settings-style grouped rows with hairline dividers and chevrons, never card grids.
- Pill geometry for floating controls (top bar, tab bar, chips); 14px controls and 22px panes for everything else.
- Light and dark follow `prefers-color-scheme`. Light is a pastel Egyptian wash. Dark is the Egyptian blue itself, with stone blue for actions.
- Required labels (Official / Community-reported / DEMO) and the beacon's 911 sentence are never designed away.

## Colors

A pastel Egyptian-blue field. Stone blue is the quieter second colour. Scarlet appears only on the beacon.

### Primary
- **Egyptian Blue** (`primary`, `#03303D`): the light-mode field's ink, filled actions, checked states. Text links use **Egyptian Ink** (`primary-ink`).
- **Stone Blue** (`primary-dark`, `#839CC5`): dark-mode actions, checks, and the focus ring, with **Stone Ink** (`primary-ink-dark`) for links. About 20% of the screen.

### Tertiary
- **Scarlet** (`beacon`, `#E82F33`): the Community Help Beacon only. Small scarlet text uses `beacon-ink` so it stays readable. Never a general decoration.
- **Advisory sand** (`advisory` / `advisory-foreground`): the pending / cooldown notices only.

### Neutral
- **Pastel Field** (`field-light`) and **Egyptian Field** (`field-dark`, `#03303D`): the only opaque ground, painted on `html`.
- **Ambient**: two soft washes of the same blue family on `body::before`. Not a multi-colour glow.
- **Glass / Glass Strong**: pane fills under a light blur. One stone hairline. No gradient rim.
- **Ink** for text; **Muted Ink** for secondary copy. Both clear 4.5:1 on their field.
- **Hairline**: row dividers inside grouped panes, the same stone family as the pane edge.

### Named Rules
**The 70 / 20 / 10 Rule.** Egyptian blue is most of what you see. Stone blue is the second colour. Scarlet means "beacon" and nothing else. Status is carried by a text label, never by colour alone.

**The Field Shows Through Rule.** No element between `html` and a glass pane may paint an opaque background. If a pane reads as a white card, the glass alpha is too high or something underneath is opaque.

## Typography

**Display Font:** Fraunces (with Georgia, serif)
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** A warm, slightly bookish serif used sparingly against a plain, even sans. The serif is a signature, not a voice; it appears once per screen.

### Hierarchy
- **Brand** (Fraunces 600, `clamp(2.75rem, 12.4vw, 5.75rem)`, 0.92): the landing wordmark only; centered below 640px, left-aligned above.
- **Display** (Fraunces 600, `clamp(1.85rem, 3.8vw, 2.75rem)`, 1.08): the single page `h1` on every app screen (greeting, "Help", "Communities", a post title).
- **Headline** (Manrope 600, `clamp(1.75rem, 3.2vw, 2.5rem)`, 1.15): the landing message line under the wordmark.
- **Title / Title-sm** (Manrope 600, 1.375rem / 1.125rem): pane and section titles, help and post card titles.
- **Lead / Body** (Manrope 400, 1.125rem / 1rem): landing lead and in-pane prose; measure 34–48ch on lead, ≤ 75ch on body.
- **Meta** (Manrope 500, 0.8125rem): row second lines, footnotes, timestamps.
- **Label** (Manrope 600, 11px, +0.01em): `StatusLabel` pills; also the 10.5px tab captions.

### Named Rules
**The One Serif Rule.** Beyond the wordmark in the top bar, Fraunces appears exactly once per screen: the brand on the landing, the `h1` in the app. Pane titles, card titles, avatars, and section heads are Manrope.

**The No Eyebrow Rule.** Nothing sits above a heading. Kind and status labels live beside the title or in the meta line beneath it.

## Layout

- **Landing:** fixed glass pill top bar; a full-height first viewport (brand, one headline, one sentence, one filled CTA + one text link, one meta line) over the neighbourhood grid motif; one supporting section (display line + a three-row glass list); footer. Container 1180px.
- **App:** a single 720px column, `px-4` on mobile and `px-6` from 640px, `py-5` / `py-8`. Mobile: sticky glass pill top bar (52px) and a fixed glass pill tab bar (64px, five tabs, sliding indicator). Desktop (≥1024px): a 248px glass rail with the user footer; the content column is centred in the remainder.
- **Rhythm:** 8px within a unit, 16px title→prose, 24px between sections (`mt-6`), 10px between a section head and its pane. Section heads are inset 8px (`px-2`) to align optically with pane text.
- **Rows:** grouped list rows are 52–56px tall, `px-4`, `gap-3`, with a 16px chevron or external-link glyph at the trailing edge.
- Tap targets stay ≥ 44px; the tab bar's five targets are 44px tall inside the 64px pill.

## Elevation & Depth

Depth is material, not shadow: panes are translucent and blurred, so whatever is behind them is the depth. Three tiers are used and nothing else:

### Shadow Vocabulary
- **Inset-only** (`inset 0 1px 0 0 glass-highlight`): grouped-list panes (`ng-row-divide`). They sit *in* the field.
- **Glass** (`0 1px 1px rgba(16,36,58,.04), 0 10px 30px -14px rgba(16,36,58,.22)` + inset highlight): resting panes and glass buttons.
- **Glass Float** (`0 2px 4px rgba(16,36,58,.06), 0 18px 44px -18px rgba(16,36,58,.32)` + inset highlight): the top bar, tab bar, rail, and the Home help pane (`Pane strong`).

Dark mode swaps the shadow tint to black at higher alpha; the tiers stay the same. Every glass surface also carries a 1px specular rim (`::before`, 135° highlight gradient masked to the border) so the edge catches light at the top-left.

### Named Rules
**The Three Tiers Rule.** Lists sit in the field, panes rest on it, controls float over it. A surface that needs a fourth level is a modal, and modals are rare.

## Shapes

Soft, continuous geometry. Panes are 22px (`--radius-xl`), controls and the primary buttons are 14px, inputs and the select are 12px, and anything that floats over content or is a compact chip is a full pill (top bar, tab bar, segmented control, `StatusLabel`, `Join` / `Change` chips, icon buttons). A 1px hairline on the glass border plus the inset highlight is the only stroke; the specular rim is the only ornament. Checkboxes are 20px with a 6px radius and fill teal when checked.

## Components

### Buttons
- **Shape:** 14px (`rounded-[14px]`); `sm` and `icon` sizes are pills.
- **Primary:** Deep Teal fill, white text, inset 1px top highlight; hover shifts to Teal Ink; `active:scale(0.97)`; 44px default, 48px `lg`, 36px `sm`.
- **Glass (outline):** `ng-glass-control` fill with the specular rim; hover to glass-strong.
- **Secondary / Ghost:** 6 % ink tint at rest / on hover.
- **Beacon:** coral fill or `beacon/12` tint for the beacon CTA only.
- **Focus:** 3px ring at `ring/50`, visible on every control.

### Chips (StatusLabel)
- 24px pill, 11px Manrope 600. Tones: neutral (8 % ink), official (12 % teal / Teal Ink), demo (8 % ink / full ink), warning (advisory), help (coral tint), success (teal-green tint). Always a readable word (Official, Current, DEMO, Open, Home), never colour alone.

### Panes (Cards / Containers)
- **Corner:** 22px. **Background:** glass or glass-strong. **Shadow:** per the three tiers. **Border:** 1px glass border + specular rim. **Padding:** 16px, 20px from 640px.
- **Grouped list variant** (`ng-row-divide`): zero offset shadow, hairline dividers, 52–56px rows, trailing chevron.
- `<details className="ng-disclosure">` rows hide their marker and rotate a chevron when open; used for official updates.

### Inputs / Fields
- 12px radius, `card/70` fill, 1px `input` border, 16px text (no iOS zoom), 44px tall; focus is a 3px `ring/35` glow. Textareas share the treatment with a character counter in meta type.

### Segmented control (`ng-segment`)
- Pill track in 6 % ink; the pressed segment is a glass pill with the float shadow. Used for help filters and the request/offer toggle.

### Navigation
- **Mobile:** fixed glass pill tab bar, five columns, a sliding indicator (`translateX`, 300ms `--ease-out`) under the active tab; 10.5px captions, teal glyph when active.
- **Desktop:** 248px glass rail, 44px rows, active row in 8 % ink; user footer with initial, name, and a one-line mode ("Demo · fictional data" / community / "Sign in from Profile").

### Footnote
- Centered meta type in muted ink; one per screen carries every disclaimer that screen needs (DEMO, provenance, "Help is opt-in · Emergency? Call 911."). The beacon's `role="note"` 911 pane is the one exception and is mandatory.

### Neighbourhood grid motif (landing)
- A pointer-reactive canvas grid of hairlines and teal nodes behind the hero; under reduced motion an identical static SVG pattern (56px cell, 1.6px nodes) masked radially toward the copy.

## Do's and Don'ts

### Do:
- **Do** paint the ground only on `html` and keep `body`, `#root`, and layout wrappers transparent.
- **Do** put every status word in a `StatusLabel` and every disclaimer in the screen's single `Footnote`.
- **Do** use grouped rows (`Pane` + `ng-row-divide`) for lists; same-size card grids are not this world.
- **Do** keep the beacon sentence verbatim: "Community volunteers may not respond. For immediate danger, call 911. This is not an emergency service."
- **Do** gate all motion behind `prefers-reduced-motion: no-preference` and keep defaults fully visible.

### Don't:
- **Don't** place a label, kicker, or chip above a heading.
- **Don't** set more than one Fraunces element per screen.
- **Don't** use a pill radius on a primary or full-width action; pills are for floating controls and chips.
- **Don't** add a second accent, a gradient rim, or a border colour outside the stone hairline and the beacon.
- **Don't** convey status by colour alone, nest panes, or invent live outage or response-time claims.

## Motion

Aligned with the `ui-animation-polish` tokens in `src/styles.css` (`--dur-*`, `--ease-out`, `--press-scale`).

- **Ambient:** `body::before` drifts over 28s (`ng-ambient-drift`); panes enter with `ng-pane-in` (blur → clear, three delay steps). Both stop under reduced motion.
- **Landing focal:** `ng-brand-reveal` (clip-path + 5px blur settle, 450ms, ends at the brand's -0.045em tracking); supporting copy rises with 30ms stagger; scroll-driven motif exit and step entry via `animation-timeline: view()` where supported.
- **Feedback:** CTA arrow nudge (150ms), `ng-press` / `active:scale(0.97)`, beacon `ng-attend` one-shot, tab indicator slide (300ms exponential ease-out).
- **Overlays:** enter 200ms from `scale(0.95)` toward the trigger; exit 160ms. **Switch:** area-preserving knob stretch after mount.
- Route View Transitions on shell and landing links with the shared `ng-vt-brand` name.
