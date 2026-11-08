# Presentation & Devpost visuals

Polished captures from the integrated demo (`npm run dev`, `/app?demo=1`).

## Recommended Devpost gallery (pick 4–6)

| Priority | File | Slide / caption idea |
| --- | --- | --- |
| 1 | `10-landing-mobile-390.png` | Brand-first mobile landing |
| 2 | `10-home-mobile-390.png` | Home: help CTA + official BC Hydro feed |
| 3 | `10-help-mobile-390.png` | Help board with offer lifecycle |
| 4 | `10-beacon-mobile-390.png` | Beacon + 911 disclaimer |
| 5 | `20-communities-desktop.png` | Communities discovery (desktop shell) |
| 6 | `20-home-desktop.png` | Desktop side-rail operate UI |

Also available: activity/profile mobile+desktop, remaining desktop routes.

## Re-capture

With the local app on `:8780`:

```bash
node scripts/capture-presentation-shots.mjs
```

## Visual QA notes (2026-11-07 final integration)

Checked at **390×844** and **1280×800**:

- Landing: brand-first navy hero, grid motif, CTAs, non-emergency disclaimer.
- Home: DEMO fence, Ask for help peak, official updates, bottom/side nav.
- Communities: directory + home community control.
- Help: board, participant switcher, request cards, I can help.
- Beacon: mandatory 911 disclaimer visible above form.
- Activity / Profile: load under shell without layout break.
- Desktop: left rail flush; content column readable (~720px max).

No product UI bugs found that block presentation. Do not claim Gemini/n8n live.
