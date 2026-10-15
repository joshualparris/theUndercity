# The Undercity

**A playable, original, gothic browser-narrative RPG prototype.**

The Undercity is a subterranean metropolis lit by cultivated moss, oil lamps and rumours. You begin in the Bell-Cage prison; choose your past and faction, escape by one of four methods, and navigate connected districts to uncover who sealed the sky.

## Play

This project is plain HTML/CSS/JavaScript without external dependencies. Open index.html directly or deploy the repository as a static site on Vercel / GitHub Pages. Your story is saved locally in your browser.

## Current vertical slice

- Opening onboarding with four backgrounds, five faction alignments and four original escape routes
- Eight visible, connected districts with a map and explicit travel guidance; later areas are gated by collected investigation leads
- Four-part main ambition and 20+ additional authored storylets, multiple stat-checked choices
- Four abilities (Observation, Guile, Persuasion, Resolve), pyramidal change points, challenges with visible odds
- Health, Sanity, Suspicion and Notoriety; consequence-driven recovery detours rather than game-overs
- Pennies, possessions, faction relations, journal, opportunity-card hand (8 cards)
- Browser local save, manual JSON export/import, real-time action/card regeneration
- **Playtest mode** in Settings to explore without waiting or consuming actions
- Mobile-responsive, keyboard-operable controls, readable choice requirements and adjustable text size

## How to playtest

1. Start at the Bell-Cage and escape.
2. Talk to the clockmaker in Lantern Court and take the main mission.
3. Travel using **City map** or the sidebar's **Close destinations** links.
4. Collect 2 leads to unlock the Forgotten Stairs, 4 to unlock the Listening Edge.
5. Follow the four-step mission across Lantern Court → Inkward → Forgotten Stairs → Listening Edge.
6. Test all four abilities, collect items, play chance cards and check what happens if a menace reaches its threshold.
7. Enable playtest mode under Settings for a faster run.

## Implementation notes

This is a focused vertical slice, **not** the full multi-thousand-storylet game envisioned by the supplied design research. Narrative and place names are independently authored, and do not reuse other games' text, art or characters. It uses no cookies, analytics, accounts, servers or payment mechanics. Local browser saves are not synchronised between devices.

For development, no install or build is required. Serve this directory with \`python -m http.server 8000\` and open http://localhost:8000. In the browser console, inspect \`UndercityDiagnostics\` to see testable engine information.

Future improvements: external JSON storylet validation; better QBN gates and content indexing; more ambitions, faction consequences and hand-crafted art; automated browser E2E tests; cloud saves by opt-in; comprehensive automated content coverage.
