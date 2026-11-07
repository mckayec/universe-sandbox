# Lore corrections — source-confidence implementation (Revision 6)

2026-11-07T12:10Z UTC · Claude (builder report). PR [#24](https://github.com/mckayec/universe-sandbox/pull/24) `fix/lore-corrections`, new exact head **6a961275cade4494a2d90b59e13fced5a2431155** (parent 4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef). Implements [source-confidence-proposal-review.md](source-confidence-proposal-review.md) (9ef2f2d). No main integration in this revision; no new literary source opened; nothing upgraded to certain.

## Representation chosen

**Inline, reader-visible copy** in the same string as the claim ("Provisional account based on [named source]; not independently checked against the novel(s)/book."). No new renderer, no schema, no change to existing `facts` "Source" rows or other source metadata. Because the note is part of the effective field string, it carries that field's existing gate (`eras`, `more`, `from`, POI_FULL_AT, set() overrides, event `book`) and disappears with it on downgrade; no later identity can appear in a note before its claim. Text is rendered through the existing escaping paths (engine `esc()`, society text nodes); no HTML added. Notes are attached sentence-level, never pack-level.

## Diff (actual, 4a13b1b → 6a96127)

9 files: the six packs and `society.js` (43 lines changed in place), `implementation.md` (Revision 6 note), `source-confidence-probe.cjs` (new). No engine, CSS, test or unrelated change. Timer code (R4-C1) untouched.

## Field manifest (line numbers at 6a96127)

| Lead | Record · field / override | Change | Source on record (corrections.md) | Gate (unchanged) |
|---|---|---|---|---|
| L4 | sun-eater:197 ganelon `aka` | **Option taken: alias removed** (no note) | suneater.wiki Index of Worlds | book 5 |
| L5 | sun-eater:558 William XXIII `desc` | Reign length moved to its own sentence + Q (Sun Eater fan wiki) | suneater.wiki Sollan Empire / Index | books [3,5,6,7] |
| L6 | hyperion:369 b1j `text` | Q (Wikipedia and fan-wiki plot summaries) on the retained investigation account | hyperioncantos.fandom Plot Summary; Wikipedia | book 1 |
| L7 / R-1 | hyperion:69 madhya base `blurb`; :67 `eras[4]`; :67 `eras[2]` | "chase" → "Lamia and Johnny's investigation in the Detective's Tale brings them here" in all three; Q (Hyperion Cantos fan wiki) in base **and** both eras | hyperioncantos.fandom Madhya | base / 2 / 4 |
| Bressia | hyperion:80 bressia `blurb` | Wife/son clause removed; provocation stays cut; accepted text verbatim | (inherited; none recorded) | as before |
| L11 | expanse:295 leuctra `blurb`; :621 b7e `text`; leuctra `short` | Q (Expanse fan wiki and SuperSummary) on blurb and b7e; hover `short` neutralised to "A battle site in the Belt." | expanse.fandom Guard of Passage; SuperSummary PR | book 7 |
| L12 | expanse:288 pallas `blurb`; :622 b7f `text`; :268 tycho `eras[7].blurb`; pallas `short` | Q (Expanse fan wiki) on all three; `short` → "A refinery station in the Belt." | expanse.fandom Tempest elimination of Pallas | book 7 |
| L13 | expanse:428 ilus `blurb`; :430 ilus `facts` Moons | Q inline in blurb sentence; facts row "Thirteen, sharing one orbit, per the Expanse fan wiki" | expanse.fandom Ilus IV | book 4 |
| L14 | expanse:558 b1c `text`; :132 intro legend "Coloured lines" (the r1 presentation) | Q (SuperSummary's plot summary) on b1c; legend note: book-one route stops/order follow SuperSummary. r1's `label` is not rendered by the engine | SuperSummary LW ch.34–44, summary | book 1 / intro |
| L15 | expanse:518 nieuwestad `blurb` | Spelling-only note (Expanse fan wiki); b9i / Alex `more[9]` reuse the name, not re-noted | expanse.fandom Nieuwestad | book 9 |
| L17 | dune:440 naraj `blurb` | Q (Dune fan wiki) on the Farok/stone-burner/son sentence only; Naraj name keeps official-index category; Wallach unchanged | USGS Planetary Names 15547; dune.fandom Naraj | book 2 |
| L18 | foundation:214 smyrno `blurb` | Q (Asimov fan wiki and Wikipedia) | asimov.fandom Smyrno; Wikipedia | book 1 |
| N1 | foundation:99 `intro.text`; :510 codex Galactic Empire `desc` | Q naming the secondary journal article (Jazbec, *European Perspectives*, 2019) in both | europeanperspectives.org PDF | intro / first 1 |
| L22 | cosmere:760 e59 `text`; :313 roshar `eras[12].blurb` | Q (Coppermind wiki) on both | coppermind Stormfall / Battle of Azimir / Retribution | book 12 |
| L23 | cosmere:718 e24 `text` | Q (Coppermind wiki) | coppermind Kaladin | book 5 |
| L24 | cosmere:649 obrodai `blurb` | Epigraph-letter attribution kept; Q on identifying the writer as Patji | coppermind Letters / Patji; WoB | book 8 |
| L26 / R-2 | cosmere:803 Nomad `more[12]`; :625 canticle `eras[12].blurb` | Q on the Sigzil identity in both; "then Skips on to UTol" → "then moves on to another world" | coppermind Sigzil | 12 (both) |
| L27 | society:283 rhea `blurb` (copied to `eras[2]` at runtime, base neutral); rhea `facts`; :377 r1 `text` | Q (Red Rising fan wiki) in blurb; new facts row ["Source","Red Rising fan wiki; not independently checked against the novels"]; Q on r1 | red-rising.fandom Rhea / Magnus | era 2 / book 2 |
| L28 | society:370 rheacities `desc` | "In Octavia's telling, the ArchGovernor of Rhea died in the burning after striking the Ash Lord…" (accepted text). Provenance: redrisingquotes.com Golden Son ch.18 quotation index; not an inspected book page | redrisingquotes.com Octavia | as before |
| L30 | society:195 g8 `text`; :178 bleeding `desc`; :256 Io `set("bleeding")` override | Q on all three | red-rising.fandom Bellerephon / Cassius against House Raa | book 4 / from 4 |
| L31 / R-3 | society:160 newsparta POI; :163 rome POI; :219 l3; :220 l3b; :2633 SITES.newsparta `blurb`; :2641 palace landmark `desc` | Q (Red Rising fan wiki and Book Series Recaps) on all six; scene blurb "summit of the Two Hundred" → "summit in Rome"; palace → "The Dictator's seat. Lysander is brought before Atalantia here and coerced." + Q | red-rising.fandom Earth; bookseriesrecaps Light Bringer | from 6 / book 6 |
| L32 | society:379 r3 `text`; :292 pluto `blurb` | Q on both. Note: pluto's Howlers blurb is overwritten by its neutral BASE and has no era entry, so it is not currently displayed; qualified anyway | red-rising.fandom Howlers / Pluto | book 2 |

**Counts:** 20/21 leads with a Q-or-removal action (L4 by removal; 19 by Q, L15 spelling-only); L28 by attribution. R-1 3/3 blurbs, R-2 1/1, R-3 2/2 surfaces, Bressia 1/1. 5/5 U dispositions untouched (L1, L2, L9, L19, N3; no canticle→komashi link reintroduced). 41 effective field strings changed.

## Validation at 6a96127 (builder-run, this sandbox)

- `pnpm check`: format check, build, **89/89** unit tests, check:dist 111 files OK.
- `pnpm test:pages`: **12 pages × 2 viewports** pass (installed Chromium 1243).
- [source-confidence-probe.cjs](https://github.com/mckayec/universe-sandbox/blob/6a961275cade4494a2d90b59e13fced5a2431155/docs/reviews/lore-corrections/source-confidence-probe.cjs) (served `public/`, swiftshader): **29/29 at 1440×900 and 29/29 at 390×844**, 0 page errors. Covers: intro (Foundation N1; Expanse legend route note), world base/era/downgrade (Madhya 1→2→4→1), world facts (Ilus), events (b1j, b7e, b1c, e59), codex + character `more` (Galactic Empire; Nomad at book 11 shows no Sigzil and no note, book 12 shows both, downgrade 12→11 removes both), world era 12 (Canticle R-2), Bressia, society POIs / events / scene blurb / palace landmark (effective data at book 6) and a rendered New Sparta scene entry with the note in the page, no horizontal overflow at 390. On phone, text checks read the dossier DOM (sheet collapsed); one expanded-sheet screenshot inspected for readability.
- Screenshots: [madhya-1440x900-r6.jpg](madhya-1440x900-r6.jpg) (era 4 + note), [canticle-390x844-r6.jpg](canticle-390x844-r6.jpg) (era 12 + note, phone). The note uses the body text style: legible, not muted.
- Not run: `test:browser` (main-app smoke; no main-app change) and exact-head CI (will run on push; result not yet read). These are builder results, not independent checks.

## Ask

ChatGPT: verify the effective copy and qualifications at 6a96127. Canon remains not approved; no release request.
