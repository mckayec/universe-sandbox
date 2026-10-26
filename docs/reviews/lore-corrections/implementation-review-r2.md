# Lore corrections — implementation re-review, revision 2

Reviewed 2026-10-26 by ChatGPT. **Verdict: request changes; no canon sign-off.** This is a completed local review proposal, not a published GitHub review or authorization to merge.

## Target, state and method

- PR [#24](https://github.com/mckayec/universe-sandbox/pull/24), branch `fix/lore-corrections`, exact audited head **78eaf99035e618939cab1569936503f55e3d16d0**. PR was open and unmerged when fetched; GitHub initially reported `mergeable:false`; the final read returned `mergeable:true` with the same head SHA. Mergeability is asynchronous metadata, not a demonstrated conflict or a content approval. No issue comments, published reviews or review threads were returned. The substantive discussion is in repository documents.
- Current main inspected: **cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79**. The local review worktree is based on that revision; the PR was separately checked out detached. No app files were edited.
- Read `CHATGPT.md`, the signed `HANDOFF_PLAN.md`, original `corrections.md`, `implementation-review.md`, branch `implementation.md` including Revision 2, current status, and main's `claude-addendum-r2.md`. Read the changed pack data and the actual Society renderer/CSS. Independently exercised the PR's page in Chromium at desktop and phone sizes and evaluated pack/data gates in Node.
- This review verifies implementation and conservative containment. It does **not** establish every original literary claim from the novels. The earlier `(L)`/`(U)` qualifications remain. No dedicated Deep Research capability was available or used.

## Disposition and counts

| Prior blocker | Result at this SHA | Evidence |
| --- | --- | --- |
| IR1 / L1 | Mapping defect resolved. Small unrelated timing clause should be cut as below. | `b7c` absent, r7 excludes Forum, book-7 William codex retains Auctor without a location. |
| IR2 / L8 | Three specifically required gates resolved; broader sign-off remains blocked by unsupported retained clauses in R2-C5. | Lamia rescue at 2, Shared Moment at 4, LTB observer at 4; safe base descriptions present. |
| IR3 / L29, L31 | Partial. New Sparta gate and startup/opt-in state resolved; actual Chronicle visibility and other content surfaces still fail. | New Sparta only visible at VI in I/IV/V/VI probe. Book I header/state does not hide later columns because of CSS. |

The prior 40-row reconciliation is preserved, not represented as 40 newly re-sourced literary checks. Its 23 conforming mandatory rows and 13 no-change rows are unchanged by the targeted fixes. L1 and L31 now meet the prescribed mapping/gate changes; L8 and L29 remain open. Thus **25 mandatory rows conform to their specified implementation, 2 remain partial, 13 retained = 40**, with the explicit evidence qualifications above. L1's new conservative wording disposition below is required before a release recommendation.

There are **5 blocking finding groups: 4 High, 1 Medium**. R2-C1/C2/C3 preserve Claude's IDs; R2-C3 consolidates R2-1. R2-C4 extends the review to an unprotected rendering surface. R2-C5 records unresolved evidence, not a finding that the disputed statements are demonstrably false.

## R2-C1 — Chronicle CSS defeats the filter (High)

**Confirmed**, `society.css:168`, `society.js:3020`. Fresh Book I loads at both viewports set columns II–VI to `hidden=true`, but their computed `display` is `flex`, each has a layout rectangle, and the book-VI `l13` event button remains rendered. This contradicts the implementation report's claim that only Book I appears. `hidden` properties alone are not a visibility test.

Exact CSS addition immediately after `.book{...}`:

```css
.book[hidden]{display:none}
```

Keep the new Book I defaults and explicit All label/notice. Acceptance: on fresh load and after selecting each I–VI button, only the selected Chronicle column has layout boxes; All shows all six. Check keyboard focusability and pointer access to hidden events as well as DOM attributes. Run at both sizes.

## R2-C2 — final Io overrides defeat earlier text edits (High)

**Confirmed**, `society.js:252–256`. Effective Nesos and Garter descriptions are overwritten after their first declarations. Neither has `from`, so both later event descriptions show in Book I. Apply the change at the final setter or normalize once after all data construction.

Conservative exact dispositions (no new first-appearance claim):

| Effective object | Replace / gate |
| --- | --- |
| `POIS.io.raaseat` | Set `from:3`; replace final `desc` with `"Io’s capital and the seat of House Raa."`. The existing book-III `e18` retains the negotiation event. |
| `POIS.io.garter` | Set `from:6`; replace final `desc` with `"A belt of farmland around Io’s equator."`. The book-VI `l13` retains the bombardment. Remove the unsupported quantitative food-share claim pending a cited passage. |

These gates are conservative display policies based on the existing narrative associations, not independently verified earliest mentions. They may hide earlier neutral geography. Earlier access can be restored only with a sourced safe base and consistent scene/landmark gating. Existing unsupported map precision is not certified by this review.

## R2-C3 — bodies and POIs still disclose later books (High; includes R2-1)

**Confirmed.** All nine POIs named in Revision 2 evaluate visible at Book I with their later text. In addition, `olympia.from:4` reveals Dark Age deaths and `nucleus.from:4` reveals Light Bringer command activity (`society.js:171,174`).

**Decision on Claude's proposed rule:** use the latest explicitly named book in the retained description as a **conservative minimum display gate**, not as a claim about the location's first appearance. If a description has no securely identified book, cut the plot clause or withhold the entry. Gate text and every route to it, not only the globe marker. Do not blindly infer a literary first appearance from the pack's event list.

Apply this concrete minimum set, preserving stricter existing gates:

| POI IDs | `from` | Basis / treatment |
| --- | --- | --- |
| `heliopolis`, `tyche`, `ladon`, `redreach`, `polar` | 5 | Existing prose explicitly names Dark Age. |
| `gorgon`, `rath` | 4 | Existing prose explicitly names Iron Gold. |
| `vdocks`, `garter` | 6 | Existing prose explicitly names Light Bringer. Garter also needs C2's final-override edit. |
| `olympia` | 5 | Whole current description must not show at IV; do not retain `from:4` with deaths in base text. |
| `nucleus` | 6 | Whole current description belongs to the Light Bringer-associated content. |
| `raaseat` | 3 | C2. |

For the ten body dossiers flagged in the addendum, use these **exact neutral base replacements**. This deliberately removes plot information; it does not invent extra era facts. Retain only already gated plot text whose underlying support is accepted; do not automatically move every deleted sentence to an era.

| Body | Exact base `blurb` | Other base-field treatment |
| --- | --- | --- |
| jupiter | `"A gas giant of the outer Solar System."` | Set control to `"Not specified for this reading selection"`. |
| io | `"A moon of Jupiter."` | Use epithet `"Moon of Jupiter"` and the same neutral control. |
| europa | `"A moon of Jupiter."` | Use epithet `"Moon of Jupiter"` and neutral control. |
| ganymede | `"A moon of Jupiter."` | Neutral control; no `then the Rim` in base. |
| kalyke | `"A small moon of Jupiter."` | Neutral control; keep the existing late event behind VI. |
| neptune | `"The outermost giant planet of the Solar System."` | Neutral control; no Sons of Ares base affiliation. |
| triton | `"A moon of Neptune."` | Use epithet `"Moon of Neptune"` and neutral control; remove the comics-only paragraph from novel-layer base. |
| pluto | `"A distant world beyond Neptune."` | Use epithet `"Distant world"` and neutral control. |
| asteroid | `"An asteroid in the belt."` | Use epithet `"Asteroid belt"` and neutral control; withhold its hidden-base POI/scene until VI. |
| rhea | `"A moon of Saturn."` | Use epithet `"Moon of Saturn"`, neutral control; move all destruction facts/control to book II or remove pending verification. L27/L28's prior gate was II. |

These sentences use only astronomical parent/type relationships already present in the data; they make no new plot assertions. The table is a safe fallback, not a requirement to discard an independently sourced richer early-book description. An alternative must supply the exact source passage and book gate for review.

## R2-C4 — bird’s-eye scenes bypass POI protection (High)

`enterSite` (`society.js:3169`) has no book check. `renderDossier` renders **every** `S.landmarks` description (`:3215`), and `buildSiteLabels` does the same for scene labels (`:3266`). Site `blurb`, `facts`, `epithet`, nested `enter` links, selected landmarks and animation text are separate surfaces. The data helper `eraVal` (`:393–394`) returns the earliest value even when its key is later than ERA: `{6:"secret"}` is **not** a safe hidden base.

Concrete example: Agea `field` at `:1056` says Fitchner's head is in the box; Europa `athena` at `:2693` describes the Light Bringer trial despite the globe POI having `from:6`. POI-only fixes leave these routes exposed.

Exact containment requirements:

1. Make one visibility predicate apply to scene entry, scene labels, dossier landmarks, nested entry links, direct/URL entry, event navigation and already-open scenes when lowering the book selection. A `from` property on a landmark currently has no effect without renderer changes.
2. Withhold `gala` scene until II; `gorgon` until IV; `helios`, `heliopolis`, `tyche`, `ladon` until V; `venusdocks`, `garter`, `newsparta` and the Asteroid 12193 hidden-base scene until VI. These are conservative containment gates; audit all remaining scene blurbs/facts for later sentences before claiming complete protection.
3. For the scene containers themselves, delete Agea’s base `Jackal’s seat` fact; replace Europa’s base blurb with `"An ocean world of islands under Jupiter."` and remove the Daughters reference from its always-visible note until VI. These were independently displayed at Book I in the scene probe.
4. Minimum exact replacements for known exposed landmarks, keeping later actions only in their already gated events unless separately verified:

| Scene / landmark | Exact safe replacement or disposition |
| --- | --- |
| agea / field | `"A plaza at the Citadel entrance."` — remove the box/head reveal from base. |
| hyperion / citadel | `"Seat of the Sovereign on the city’s western edge."` |
| hyperion / dragonmaw | `"A gravLift leading beneath the Citadel."` |
| hyperion / palatine | `"A quarter of the Citadel."` |
| hyperion / arch | `"The Citadel’s main gate."` |
| asgard / asgard | Withhold until III; current description includes the capture and Alia's death. |
| asgard / field | Withhold until III; current description includes Ragnar's death. |
| phobos / docks | `"Orbital docks serving Phobos."` |
| phobos / nucleus | Withhold until VI, including label, focus target and description. |
| ganymede / ring | `"Shipyards around Ganymede’s equator."` |
| ganymede / newtroy | `"A city on Ganymede below the dock ring."` |
| europa / athena | Withhold until VI, including label and focus target. |
| Asteroid 12193 / tabula | Withhold entire scene and its Tabula Rasa landmark until VI. |

The cut texts are deliberately short subsets/paraphrases of already displayed geography. They do not certify architecture, coordinates, or earliest literary mention. Review all scenes, including later extensions at the end of society.js, before declaring the spoiler gate complete. Do not solve this only by adding `from` fields that no renderer reads.

## R2-C5 — unresolved retained clauses: cut, do not guess a gate (Medium)

The addendum expressly identifies these as lacking a supported book. Their presence is independently confirmed at the audited head; the correct verdict is **cannot verify**, not **false**. Selecting a later gate without evidence does not turn the content into verified canon. Exact conservative dispositions:

| File / object | Exact change |
| --- | --- |
| hyperion.js / bressia.blurb (`:80`) | Delete `", provoked as the Consul later learns,"`; use `"The Ouster attack here killed his wife and son, and Kassad fought in the Bressian campaign."` for that sentence only if the already accepted remainder is retained. No new attribution is asserted. |
| hyperion.js / deneb3 base and era-4 blurb (`:191,193`) | Delete `", home of the Jamnu Republic"` from both occurrences. |
| hyperion.js / hebron era-3 blurb (`:147`) | Replace the final sentence with `"In Endymion, Aenea’s party finds it empty."` — remove the attribution to the Core. |
| hyperion.js / Glennon-Height rebels.more (`:437`) | Delete the book-2 `more` entry about Armaghast cells. |
| hyperion.js / Fatline.more (`:475`) | Delete the book-4 assertion `"It is really carried by the Void."`. |
| hyperion.js / Farcasters.more (`:472`) | Remove the Void-mechanism assertion; remove the hidden-Core clause unless a passage and book are supplied. Preserve the independently accepted destruction event. |
| sun-eater.js / William XXIII.more[7] (`:558`) | Replace with `"William names Hadrian Auctor of the Imperium."` — remove `before he dies`. |

The addendum's Sphinx and Rome concerns are already cut from the **site** descriptions at this head; do not report those as unfixed site leaks. Their gated world/event versions remain subject to the original source limitations.

## Validation and evidence limitations

- **19/19 targeted Node assertions passed:** 12 checks for Lamia / Shared Moment / LTB across I–IV; 3 Sun Eater checks (no b7c, no Forum in r7, Auctor retained in book-7 codex); 4 New Sparta checks across I/IV/V/VI. The script evaluates actual pack files; it models the relevant `first`/`more` semantics rather than claiming browser coverage of all Hyperion surfaces.
- **9/9 reported Society POI leak examples reproduced** by evaluating the actual data prefix and `poiVisible`/`poiDesc` at ERA 1. The final overrides, not just first declarations, were evaluated.
- **2/2 viewport browser reproductions of C1:** 1440×900 and 390×844. Book I header correct; all six columns have `display:flex`; five have `hidden=true`; VI's l13 still has layout. Explicit All makes its notice visible (`display:block`) at both sizes. No page errors in this focused run. This is independent evidence and does not rely on Claude's previous screenshots.
- **2/2 focused scene leaks reproduced in Chromium at Book I:** Agea / Field of Mars displays the Fitchner-head reveal when selected; Europa / Daughters of Athena displays its explicitly Light Bringer trial paragraph. The harness exposed the existing `enterSite` function through an in-memory response addition (no file edits), entered each scene, then clicked its ordinary landmark button. This demonstrates absent entry/render guards; it is not a claim to have exercised every normal navigation route. Both scenes also exposed later material in their base facts/blurbs.
- The 40 original dispositions were reconciled with the targeted revision; this was not a new 40-book-fact primary-source audit. No new full `pnpm check`, 4K layout pass or deployment check is claimed. `git diff --check` passed for the documentation changes. Documentation-only changes do not alter app behavior.
- Attempts to reopen the Fandom pages for Nesos, Demeter's Garter, Olympia and The Nucleus failed (inaccessible responses; Olympia returned 402). No text from those failed fetches is used as new corroboration. Full novel texts were not available in this checkout. Gates above are explicitly conservative containment decisions; uncertain assertions are cut or withheld rather than upgraded to sourced facts.

## Sources and concrete handoff

Primary implementation evidence, pinned to the reviewed revision:

- [Society data and rendering](https://github.com/mckayec/universe-sandbox/blob/78eaf99035e618939cab1569936503f55e3d16d0/public/atlas/society.js) — object IDs and line anchors above.
- [Society CSS](https://github.com/mckayec/universe-sandbox/blob/78eaf99035e618939cab1569936503f55e3d16d0/public/atlas/society.css#L168) — hidden/display conflict.
- [Hyperion data](https://github.com/mckayec/universe-sandbox/blob/78eaf99035e618939cab1569936503f55e3d16d0/public/atlas/packs/hyperion.js) — current gates and retained clauses.
- [Sun Eater data](https://github.com/mckayec/universe-sandbox/blob/78eaf99035e618939cab1569936503f55e3d16d0/public/atlas/packs/sun-eater.js) — Auctor mapping removed; timing clause remains.
- [Revision-2 implementation report](https://github.com/mckayec/universe-sandbox/blob/78eaf99035e618939cab1569936503f55e3d16d0/docs/reviews/lore-corrections/implementation.md) and [Claude addendum on inspected main](https://github.com/mckayec/universe-sandbox/blob/cd85ea8dcb36d4d5b54afd5ec05bc03c2c173d79/docs/reviews/lore-corrections/claude-addendum-r2.md) — leads independently checked above.
- [Original correction ledger](corrections.md) — retained source links and confidence limitations; [first implementation review](implementation-review.md) — previous counts and acceptance criteria.

Proposed next state is `fixing`, owner `claude`, **only when the parent authorizes publication of these docs**. Keep PR #24 unmerged. Builder should implement the five groups, supply exact revised SHA and a per-object book-gate matrix, and demonstrate safe globe, Chronicle, scene, label, direct-entry and book-downgrade behavior at desktop/phone sizes. Any subsequent integration/content change requires a relevant review. No conflict-resolution operation was attempted; the final connector read reported `mergeable:true`, so an actual merge conflict is not claimed. No push, PR review publication, merge, deployment, automation change or message to Claude was performed.
