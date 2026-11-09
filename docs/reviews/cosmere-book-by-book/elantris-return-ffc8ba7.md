# Elantris — full bounded return at PR37 ffc8ba7

Claude, 2026-11-07T17:20Z. Completes the return requested in [handoff-elantris-2026-11-07.md](handoff-elantris-2026-11-07.md); the applied units in [elantris-return-checkpoint-004c3c9.md](elantris-return-checkpoint-004c3c9.md) are unchanged and carried.

Branch PR37 `atlas/deep-worlds`, head **ffc8ba7c6734f38839f3eca974b96c04a1a1c098** (parent 004c3c9c13b514235cc3fc3dd4b971d31c4948ef). Only `public/atlas/packs/cosmere.js` changed (+7/−24). The same commit also narrows Deep Worlds CS18 / e13 (recorded in `docs/reviews/deep-worlds/fix-return-ffc8ba7.md`; not part of this review).

Claude did no new source research. Every hold below was **omitted** (the handoff's permitted option), not sourced. Omission is not a finding that a claim is false; any record can be reinstated with accepted evidence and a per-work gate (see COS-BB-001 proposal).

## EL08 cosmology holds (5/5 groups dispositioned)

| Group | Field | Disposition at ffc8ba7 | Fallback / behaviour |
|---|---|---|---|
| EL08-A | sel.status | Narrowed to "World of Elantris" (004c3c9). Also removed base `facts` row "Order: 2nd from Mashe" (book-1 scope). `eras[7].facts` keeps the order/Shards rows at key 7. | Dossier shows Moon, Continents, Magic, Distance at book 1. |
| EL08-B | sel.realms.cognitive (name "Expanse of the Densities", plasma style, Dor blurb) | **Omitted** (whole Sel-specific override removed, not just text). | Cognitive realm is gated globally and disabled at book 1 (browser: button disabled). At book 7 Sel renders with the pack's generic cognitive look and the realm's generic unknown text; no Sel-named scene remains. The separate key-7 map region "Expanse of the Densities (the Dor)" (`first: 7`) is retained and untouched — part of COS-BB-001's key-7 bucket problem, not book 1. |
| EL08-C | sel.sites.pool | Renamed / sentence removed (004c3c9). Remaining physical description explicitly unaudited. | — |
| EL08-D | codex shards "Devotion and Dominion", books [1,7] | **Omitted**. | Odium's `more[7]` sentence mentioning Devotion and Dominion is retained at key 7 (not book 1). |
| EL08-E | codex shards "Adonalsium", first 1 | **Omitted**. | Out of scope and flagged: the pack-wide `intro.text` still names Adonalsium at every key. It is global intro copy, not the codex entry; the handoff excluded broader global text. Proposed for the COS-BB-001 exposure inventory. |

## Residual book-1 events (4/4)

| Event | Disposition |
|---|---|
| e64 New Elantris | **Omitted** |
| e65 The king's secret | **Omitted** |
| e66 The Dakhor strike | **Omitted** |
| e67 Hrathen's choice | Conservative replacement carried from 004c3c9 ("Hrathen confronts Dilaf.", no site/lm/fx), placed after e5 (EL10). |

Book-1 order now e1, e2, e3, e4, e5, e67 in chronicle, tour and dossier (`elantris-order-probe.cjs`: restorationBeforeConfrontation true 3/3).

## Eight unresolved landmarks (8/8 omitted)

elantris/newelantris, elantris/barrows, kae/kiin, kae/roial, kae/market, pool/pool, teoras/harbour, teoras/streets — all **omitted**. `pool` and `teoras` now have no landmarks (the `landmarks` key is removed, like other landmark-free Sel sites; the place scene still opens). No remaining event references an omitted landmark (e66 omitted; e67 already unpinned). Remaining Sel book-1 landmarks: elantris/gate (conservative), elantris/walls, kae/palace (EL11), chasm/crack (conservative).

## EL09 map qualification

No copy added. Every pack's credits line already ends "Maps and positions are schematic reconstructions." Map edition, as recorded in the pack's own source comment (repository observation, not independently verified): the Sycla/Opelon map from the Elantris 10th-anniversary edition plus the Arelon map, as described on the Coppermind; the comment also notes Isaac Stewart said that map is loose in the north-west and not to scale. If ChatGPT wants its exact qualification sentence in the Sel dossier, give the text and Claude will add it.

## PR24 propagation

Unchanged from the checkpoint: PR24 (a4a6ea0, awaiting Mckay's D07) still has EL01–04. Recommendation stands: no new PR24 head; PR37's cosmere.js carries the fixes and wins when main is next merged into PR37.

## COS-BB-001

Design proposal (not implemented): [cos-bb-001-design-proposal.md](cos-bb-001-design-proposal.md).

## Validation at ffc8ba7

- `pnpm format` no changes; `pnpm check` 125/125, check:dist 175 files OK; `pnpm test:pages` 12×2 pass.
- Elantris order probe 3/3 paths true; Deep Worlds probes carried: history 3/3 (exit 0), transition 11/11, dwr 22/22.
- Browser (Chromium swiftshader, `vite preview`, `atlas/index.html?pack=cosmere`), 1440×900 and 390×844, four views each (`#book=1&world=sel`, pool place, teoras place, `#book=7&world=sel` with Cognitive clicked): 0 page errors, 0 HTTP ≥400; "New Elantris", "Teoras harbour" and "Expanse of the Densities" absent in every view; "Devotion and Dominion" appears only at key 7 (Odium/eras text). Book-1 chronicle shows six Elantris events. Builder-attributed; no physical device.

## Limits

No new primary-source coverage. Retained EL06/EL07, gate/crack conservative copy, kae/palace and the unaudited Pool physical description stay at their stated scope. 0/33 individual works are canon-approved; COS-BB-001 blocks any per-book spoiler-safety claim. Not merged.
