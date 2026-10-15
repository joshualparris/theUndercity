# PDF specification coverage and current build

Updated: 15 October 2026. Source: the uploaded 64-page Undercity/Neathbound technical-and-content blueprint. This is an **implementation audit**, not a claim of full PDF completion.

## Playable, implemented

| PDF system | Current implementation |
| --- | --- |
| Browser RPG and local persistence | Dependency-free HTML/CSS/JS; autosaved version-1 character with validation and JSON import/export |
| Opening | Welcome/tutorial choice, past/faction selection, Bell-Cage with four ability-related exits |
| Four abilities and CP | Observation, Guile, Persuasion, Resolve; piecewise CP costs flatten at 70 CP per level from level 70, with CP awards determined by challenge outcome |
| Action regeneration | 10 minutes; 10 actions initially, earn a 20-action cap through reputations |
| Opportunity cards | Location-aware weighted random draws; 4-minute regeneration, up to six in hand; repeat/discard paths |
| World and travel | Map with explicit connections, two clue-gated remote districts, contextual routes, recovery wards |
| Base city mystery | Four stages including irreversible remember-or-silence conclusion |
| Personal ambitions | Four original ambitions, eight continuous chapters and alternative final approaches each |
| Making Your Name | Four parallel seven-stage reputations, stat-appropriate challenges, final keepsakes |
| Careers | Ten Tier 1 and eight Tier 2, work stories, gated promotion and weekly wages |
| Destinies | Nine ordinary and eleven greater, exclusive saved-life selection |
| Quirks | Nine character traits earned by story decisions |
| Exceptional stories | Three independent three-chapter investigations |
| Seasonal encounters | Six themed events rotating in two-month windows |
| Equipment | Twenty equipment slots in the current build (the PDF's earlier slot list names eighteen), metadata for supported items and additive stat-check bonuses |
| Living stories | Four time-triggered delayed messages and rewards, persisted across reloads |
| Journal/condition/economy | Four pyramidal Menaces with distinct level-8 recovery hubs, permanent Record consequences, journal, pennies and shop |
| Testing/deployment | Node regression tests in GitHub Actions, Vercel Git deployment at https://the-undercity.vercel.app |

## Partial compared with the PDF's complete scope

- **Ambition length.** The PDF proposes 30–40 unique storylets per ambition; each of the four ambitions currently has eight authored stages. The major plot structures work, but the deeper middle sections and character-dependent dialogue remain to be written.
- **Qualities and menaces.** The canonical engine enumerates fourteen quality categories and powers primary CP, dispositions, equipment, affiliations and four Menaces. Remaining work: route every legacy story flag, progression counter and timed event through the shared Quality schema, and add more varied penalty-hub narratives.
- **Narrative content.** The build includes more than 140 playable storylets, but does not yet offer the hundreds/thousands of bespoke storylets, unique branches, NPC arcs and completion-proof coverage described in the PDF.
- **Professions.** Tier 1 and Tier 2 are playable. Tier 3–4 professional progression, exhaustive specialised equipment and every income variant remain to be designed.
- **Card logic.** Draw weight, hand exclusions and local gates work. The full documented high-urgency bypass and every multiplicative-unlock edge case still need acceptance tests and implementation.
- **Items.** Twenty slots are exposed but not every slot has an available equipable item. Inventory, bonuses and choice rewards work; a full trading/crafting economy does not.
- **Living Stories.** Four timed letters are available; a general authoring scheduler covering arbitrarily defined temporal quality triggers remains a future system.
- **UI and accessibility.** Responsive layouts and keyboard-focused controls exist. Formal screen-reader, contrast, screen-size and low-bandwidth audits remain outstanding.
- **Content architecture.** Authored content is modular JavaScript with tests. The PDF's authoring CMS, versioned JSON schema/content tracker and bulk validation/editor workflows remain a priority.

## Not implemented / intentionally excluded

- Cross-player multiplayer social messages, trades and shared-world events.
- Cloud-based accounts and cross-device save synchronisation; browser saves are local by design.
- Paid premium purchases, premium action upgrades or commercial Fate processing. The playtest is free with optional no-wait testing.
- Complete, fully authored encyclopaedia of NPC histories, faction relationships, setting lore and an endgame spanning hundreds of hours.
- Studio-equivalent live operations, authoring infrastructure or exact reproduction of any proprietary game.

## Development priorities

1. Expand the four personal ambitions toward the PDF's target length, with substantive consequences at each branch, not filler content.
2. Add server-independent data contracts and a readable content tracker: all storylet IDs, locations, gates, rewards, authorship and quest progression.
3. Upgrade encounter cards to cover high urgency, unlock multiplicity and urgency timing; confirm probability distribution in automated tests.
4. Expand the four new penalty locations with multi-step recovery choices and support more named NPC relationship outcomes.
5. Fill unused equipment slots with meaningful items and differentiate elite professions mechanically.
6. Run end-to-end mobile/browser, keyboard and screen-reader audits before calling this a complete release.

## Acceptance checks

- Test an existing version-1 save after every migration, including exports and corrupt-save recovery.
- Every navigable district must have a return route; hidden districts must not be bypassed.
- Every story, choice and item ID must resolve; each story gate must have a reachable path.
- Both outcomes of ambition and city-wide ending branches must persist.
- No silent online-save claims: all progress currently belongs to the local browser until a backend is actually tested.

**Status:** playable substantial prototype; **not** 100% implementation of the entire research specification.
