# The Undercity

**A playable, original, gothic narrative RPG for your browser.**

In a city beneath a sealed stone sky, memories can be traded, lamps burn on peculiar fuel and official records erase people who are still alive. You start in the Bell-Cage, choose your past and faction, escape by one of four approaches, and decide who should learn the truth about the sky.

## Play now

**https://the-undercity.vercel.app**

The site is published from this repository on Vercel. No sign-in or payment is required. Saves are **local to the browser and device** you use, not synchronised across phones and computers. Export a JSON save from **Settings** before clearing browser data or switching devices.

## What is playable

- Story-driven onboarding: four backgrounds, five factions, four ability-based escape routes leading to distinct districts.
- A connected city map with clear roads and unlock requirements. Collect **2 leads** for the Forgotten Stairs and **4 leads** for the Listening Edge.
- A four-stage city investigation about the Council's sealed sky, with different world outcomes.
- **Four original personal ambitions**, each with eight consecutive, fully playable chapters and competing endings.
- **Four seven-stage Making Your Name reputations**, one for each ability, with distinct progress and end rewards.
- The four abilities **Observation, Guile, Persuasion and Resolve**, using the level-70 CP pyramid, parameterised Broad and fixed Narrow checks, rare-success rolls, and 1–2 CP awards.
- **18 professions** (10 starter, 8 advanced), location-based work, recurring wages and qualifying reputation requirements.
- **20 destinies** (9 ordinary, 11 greater), with eligibility gates and permanent selection.
- **9 character quirks**, **3 three-stage exceptional stories**, and **6 rotating seasonal events**.
- More than **140 storylets** in the playable narrative corpus and **18 opportunity cards**.
- **20 equipment slots**, inventory items and stat-boosting equipment. The number of equipped items depends on what you have found.
- Four **Living Stories**: letters/rewards delivered after real-time delays, even if you close the browser.
- Ten-minute action regeneration with a starting cap of 10 and an unlockable cap of 20; four-minute opportunity-card regeneration with six-card hand limit. **Settings → Playtest mode** removes waiting/paid card-draw costs for testing.
- Four pyramidal Menaces (**Suspicion, Notoriety, Wounds, Delirium**) with distinct level-8 penalty hubs (The Watch House, The Tribunal, The Ward, The Pale Rooms), a capped Record, recoverable detours, a journal, delayed messages, a shop and save import/export.

## How to playtest

1. Begin at the Bell-Cage, choose an origin and faction, and take one of the four escape routes.
2. Use **City map** for explicit connections. Lantern Court links to the main starting districts.
3. At Lantern Court, speak to the clockmaker to begin the city-wide investigation, and choose a **personal ambition** using *A question no clerk can answer*.
4. Open **Paths & callings** to see the next stage and district for your ambition, all four reputations, career options, quirks, exceptional stories and destiny requirements.
5. Visit **Possessions** to equip owned gear, and **Messages** for delayed Living Stories.
6. Test success and failure, a full opportunity hand and a menace-triggered recovery detour. Use **Settings → Playtest mode** if you want to inspect content without waiting.
7. Export your save JSON before restarting or switching browsers.

## Repository and checks

The game is dependency-free plain HTML/CSS/JavaScript. The canonical QBN engine lives in `src/game/rules.js` (ES module); `rules.global.js` is its byte-verified classic-script build loaded by the browser. Existing v1 local saves are migrated into the richer qualities schema without resetting progress. Narrative data is in `content/`. Tests in `tests/` run through GitHub Actions on each push. Run locally with `node --test tests/*.test.mjs` (Node 22+) and serve the repository with `python -m http.server 8000` if you want to test it on a local server.

## Specification scope and remaining work

The supplied 64-page research PDF is a **much larger specification**, not merely a small initial build. This release implements an integrated playable game and a substantial content foundation. It **does not yet** contain 30–40 chapters for each personal ambition, thousands of unique scenes, full multiplayer social features, every tier of profession, a server-side account/cloud-save system, complete content authoring CMS, or every proposed economy/paid-Fate mechanic.

See [Specification coverage and roadmap](docs/SPEC_PROGRESS.md) for explicit implemented/partial/not-yet-built status and the next planned systems. The setting, characters and prose are independently authored rather than copied from other games.
