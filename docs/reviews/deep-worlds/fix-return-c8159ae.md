# Fix return — hold/dependency omission batch and Society source-or-omit table

2026-11-08, Claude. PR37 `atlas/deep-worlds`: parent **5bfde313d819ab89e273af4b9c6a5f788d6d6f3d** → head **c8159ae4aef82f6f05346a587e11f43a3df4e5e1**. Implements [canon-disposition-5bfde31.md](canon-disposition-5bfde31.md). Only `public/atlas/packs/expanse.js` (−6 lines) and `public/atlas/packs/hyperion.js` (−12 lines) changed. Full diff: [hold-omit-diff-c8159ae.patch](hold-omit-diff-c8159ae.patch). Not merged.

## 1. Incoming-reference inventory (before applying)

Base blobs matched the disposition: expanse `7834a74f…`, hyperion `982f0bab…`. Every occurrence of each target id was searched in the two packs, then across the whole branch outside `docs/` (packs, `society.js`, engine, tests, scripts):

| Target | In-pack references found | Outside the pack |
|---|---|---|
| expanse `drumring` | own landmark; `lm` of b3f, b3i | none |
| expanse `engineering` | own landmark; `lm` of b3o, b7d; the word "engineering decks" in drum site prose (not a reference) | none |
| expanse b3f, b3o, b3i, b7d | own event line only (b3o's `fx:"battle"` is inline) | none (sun-eater has its own unrelated b3f/b7d ids) |
| hyperion tombs `sphinx`, `jade` landmarks | own landmark line only; tombs site prose names the Sphinx (prose, kept) | none |
| hyperion site `sphinx` (+ nested door/inner/watch) | `site` of b1i2, b2k, b3b | none |
| hyperion b1n, b2b, b1i2, b2k, b3b | own event line only | none (sun-eater has its own b1n/b2b/b3b) |

No tour, chronicle list, codex, set-piece, effect or test references any target. No dependency beyond the named closure was found, so no sub-cut was stopped. No separate scene mapping exists for these objects (the Sphinx site's scene is nested and leaves with it), so no extra mapping removal.

## 2. Applied omissions

[hold-omit-apply.cjs](hold-omit-apply.cjs) checks an exact regex precondition on each of the 18 source lines before deleting them.

| Hold | Removed |
|---|---|
| SP09 | expanse medina/drum landmark `drumring` + b3f + dependent b3i |
| SP10 | expanse medina/drum landmark `engineering` + b3o + dependent b7d |
| SP11 | expanse b3f (b3l untouched) |
| SP12 | expanse b3o with its inline `fx:"battle"` |
| SP13 | hyperion tombs landmark `sphinx`; site `sphinx` with nested scene/door/inner/watch; dependent b1i2, b2k, b3b |
| SP14 | hyperion tombs landmark `jade` |
| SP15 | hyperion b1n |
| SP16 | hyperion b2b |

**Unique top-level targets: 14.** Expanse: 2 landmarks + 4 events. Hyperion: 2 Tombs landmarks + 1 site + 5 events. No replacement text, dates or coordinates.

## 3. Verification

- [hold-omit-check.cjs](hold-omit-check.cjs) (base vs head, VM-loaded packs) → [output](hold-omit-check-output-c8159ae.txt): **20/20 PASS**. Results:
  - dune, foundation, sun-eater and cosmere are byte-identical as loaded.
  - Expanse goes from 116 to 112 events and drum from 7 to 5 landmarks.
  - Hyperion goes from 81 to 76 events, tombs from 6 to 4 landmarks, and the hyperion world from 18 to 17 sites.
  - Each whole pack equals the base minus the named records, so no other leaf changed. That keeps the earlier 18 narrowed leaves, 3 scoped retains and 3 Dune omissions as they were.
  - 0 dangling world/site/lm references, and no quoted references to removed event ids remain.
  - The top-level count is 14.
- `pnpm check`: format, build, **125/125** unit tests, check:dist 175 files OK.
- `pnpm test:pages`: **12 pages × 2 viewports** pass.
- Rendered, [hold-omit-browser-check.cjs](hold-omit-browser-check.cjs), 1440×900 only, **partial** → [output](hold-omit-browser-output-c8159ae-1440-partial.txt). This environment (headless shell 1243, swiftshader) ran out of time twice, so the 390×844 pass was not run.
  - **Pass:** stale `ev=b3o` and `ev=b2k` links do not open anything, with 0 errors. Expanse book 3 and book 7 chronicles contain no removed events, and their neighbours b3g/b7p open by click. The runtime pack has no removed ids, so the tour list cannot include them, and the tour starts (10 and 11 stops). Back stays in the app. Downgrading book 3 → 2 gates b3g out. Stale landmark links (`lm=drumring`, `engineering`, `jade`) show none of the removed landmark copy, give 0 errors, and the scenes have 5/5/4 landmarks.
  - **Not attributable to the omission:** "enters place view" and "surviving landmark selectable" failed for the stale links. The CONTROL row shows that *valid* links (`lm=bridge`, `lm=obelisk`) also stay at view=world here, so hash place entry does not complete in this environment. This matches the earlier Dune run.
  - **Observation DWO-S1 (Low, pre-existing engine behaviour, not changed):** a stale `site=sphinx` link leaves `S.site="sphinx"` in state at view=world. The site is gone and no Sphinx copy renders. The cause is engine.js:948, which only re-validates a site that still exists. Proposed fix, deferred to the final-technical unit: clear `o.site` and `o.lm` when `siteOf` returns nothing.
  - Not run: Hyperion book 1–3 chronicle/tour/downgrade rows. The VM check covers their data-level exclusion.

## 4. Society source-or-omit table (exact selectors; no cuts applied)

All selectors are in `public/atlas/society.js` at 5bfde31, which is unchanged at c8159ae. I found no primary locator for any of these candidates in the repo's review evidence (audit.md and implementation.md have no Iron Gold prologue or Lorn-home citation), and I did no new source reading.

| # | Selector | Current text (abridged) | Incoming references | Proposed narrow deletion, if ChatGPT chooses omit | Primary locator available |
|---|---|---|---|---|---|
| SO1 | `EVENTS` id `g1` (line 197) | book 4, body mercury, poi tyche, fx irongoldprologue: "The Rain on Mercury — Ten years after Morning Star, Darrow leads the Republic's Iron Rain onto Mercury…against the wishes of the Senate." | chronicle/tour via EVENTS; fx → SO2 | delete the g1 line; SO2 then has no event caller but is still reachable through the prologue button (SO3) | none in repo |
| SO2 | set-piece `irongoldprologue` (line 257 entry; `FX.irongoldprologue` ≈7310; chain to `irongoldreaper` ≈7347; enter-and-play ≈7357) | view site tyche, "Iron Gold · The Prologue — The night of the Iron Rain on Mercury" | g1 fx; prologue toggle (≈7240); auto-chain into `irongoldreaper` | if omitted: remove the entry at 257, the toggle branch at ≈7240 and the 7357 caller; keep `FX` code or remove it together with `irongoldreaper`, which needs its own disposition | none in repo |
| SO3 | prologue toggle `id==="prologue"` (≈7240) and the `enterSite("prologue",…)` chain (≈7347) | UI play/stop of the prologue effect | → SO2 | goes with SO2 | n/a (UI) |
| SO4 | `POIS.europa[0]` id `lornhome` (line 51) | "Lorn's castle — A white limestone castle on a far-northern island of Europa's ocean, its walls ringing a private forest. Lorn au Arcos lives here…" | event e9 (book 2, `poi:"lornhome"`, `lm:"villa"`, line 67); book-keyed text (line 438); `POI_FULL_AT.europa.lornhome=2` (line 441) | narrow option: delete the description clauses "white limestone…private forest" in lines 51 and 438 and keep the POI and e9. A full omission would also have to remove or re-point e9, which is a larger cut that ChatGPT would need to authorize separately. | none in repo |
| SO5 | `POIS.mercury` id `tyche` (line 147) book-keyed `desc` 1/4/5…; place-map entry line 3483 | "Mercury's capital…towers of House Votum…Darrow's headquarters" (book 4+); map text "drowned by storm surges in Dark Age" | g1 poi; SO2 site; map enter "tyche" | narrow option: delete the book 4+ clause "Darrow's headquarters" and the 3483 Dark Age clause, keeping the book 1 text | none in repo |
| SO6 | implementation.md book-IV availability rationale for Tyche | doc text | — | doc correction only | n/a |

The Europa scene stays, as instructed, because later Athena material shares it. No gates moved. I have not checked the line numbers marked ≈ beyond the grep hits shown.

## 5. Status

Returned for review of the actual diff (c8159ae) and this finite Society packet. Canon is not approved, the 139 unselected records are uncertified, and Society cuts are not authorized. The final technical gate (Society suite plus 4-viewport shots at the final SHA, and DWO-S1) remains Claude's.
