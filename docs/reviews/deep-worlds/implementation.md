# Deep worlds: what was built (PR on `atlas/deep-worlds`)

Mckay's request (2026-10-26): bring the detail and abilities of the shared Society Atlas into the repo, give
every universe the same depth of narrative content, and let visitors drill down from a world into specific
cities and areas to explore what happened there.

## 1. Engine: places you can enter (PACK_FORMAT §22)

- **`public/atlas/places.js`** builds a procedural ground-level view of any site: terrain coloured from the
  world's own palette, sky and sunlight from its star and atmosphere, a street plan and city blocks in one of
  13 architecture styles, coasts with piers, rivers, lakes, caverns (sietches, mines), stations and habitats in
  orbit over the world, weather (dust, snow, rain, ash, mist, spores, storm) and air traffic.
  `places-lm.js` draws about 60 kinds of landmark; `places-fx.js` plays event scenes (battle, bombard, blast,
  fleet, storm, quake, crowd, duel, flood, launch, arrival, eruption, worm); `places-audio.js` is optional
  synthesised ambience (off by default). All procedural; no files or network.
- **Engine view "place"**: _Enter_ from a site card (or click a site's label twice) → landmarks list, Day /
  Dusk / Night / Dawn, "What happened here", hops to the world's other places, _Back_ / Esc to the surface.
  Clicking an event inside a place flies to its landmark and plays its scene. Deep links:
  `#world=…&site=…&view=place&lm=…`. Landmarks use the same book gating as sites.
- **Walk the surface**: a world with no named places offers an unnamed schematic view, labelled as such.
- **▶ Tour** in the Chronicle bar plays the selected book's events in order, travelling into each place.
- Validator (`tests/atlas-pack-validator.mjs`) checks scenes, landmark kinds, `at`/`h` ranges, landmark book
  gating, event `lm` references and `fx` names.

## 2. Content (all six galactic packs)

| pack       | worlds with sites | sites     | scenes | landmarks | events   | events → landmark | events with scene | codex    |
| ---------- | ----------------- | --------- | ------ | --------- | -------- | ----------------- | ----------------- | -------- |
| sun-eater  | 26 → 37           | 61 → 72   | 72     | 138       | 64 → 84  | 58                | 25                | 56 → 71  |
| hyperion   | 31 → 35           | 70 → 75   | 75     | 97        | 57 → 81  | 62                | 8                 | 69 → 72  |
| expanse    | 14 → 32           | 34 → 58   | 58     | 112       | 88 → 116 | 95                | 33                | 65 → 95  |
| dune       | 6 → 14            | 46 → 56   | 56     | 101       | 54 → 90  | 64                | 26                | 86 → 97  |
| foundation | 20 → 21           | 40 → 44   | 44     | 101       | 68 → 121 | 104               | 7                 | 91 → 132 |
| cosmere    | 15 → 16           | 174 → 175 | 175    | 190       | 63 → 124 | 105               | 34                | 41 → 59  |

Rules followed: paraphrase only; spoilers gated by book (later-book facts moved out of base site text into
gated landmarks or eras); positions inside a place are schematic (`/* layout schematic */`); new site
positions estimated where the books give none (`/* estimated */`); every lore-corrections row (PR #24,
through revision 3 at c91ea29) kept.

**Sources were thinner than the pipeline normally requires.** The builders worked from the existing packs,
their own knowledge of the books, and plot summaries (SuperSummary, Wikipedia, BookRags, BooksThatSlay,
asimov.fandom, Coppermind where reachable); several wikis were blocked. Treat new content as unaudited.

### Items the builders flagged for checking

- **Sun Eater**: Lady Liliana's name, Count Balian's first name, Cielcin prisoners under the Colosso (single
  source); b1j moved from Castle Borosevo to the Colosso dungeons (least sure); Padmurak `books` [1,4] → [4].
- **Hyperion**: spoiler mode stays _cumulative_ per L8; the Sphinx text changed so it no longer spoils book II;
  raft launch books [3] → [3,4]; Cicero's, Stan Leweski and a Cleft cruciform-caves landmark left out.
- **Expanse**: b6i (Transport Union) moved from Medina to Ceres; Medina's railguns placed in the slow-zone
  scene without naming the hull; b3f / b6g / b8j split into b3l / b6l / b8n.
- **Dune**: d5 now credits Duncan _and_ Liet-Kynes with the testing-station rescue; d3 split (d14 harvester
  rescue); "takes the name Muad'Dib" moved to the Jamis duel (d19); Jamis duel, Kynes's death, the raid that
  kills Paul's son and Gurney's return left at world level (exact place unconfirmed).
- **Foundation**: f1d moved to the Terminus city (Board meeting place not given); f7g moved to the Trantor
  Library; Korell emblem moved to the foundry; Siwenna Barr estate → Barr home.
- **Cosmere**: e35 (Edgedancer) target wording; duplicate Yolen `sites` key removed; book lists on Azimir,
  the Valley, the Reshi Isles, Rall Elorim and Kasitor; The Lost Metal kept to its two existing events.

## 3. Society Atlas (`public/atlas/society.*`)

The page is now the owner's newer Society Atlas with the repo-only features carried over: about 35 more
scenes, captioned set pieces, tours, sound, Names / CC / Detail controls, the expanded war mode and 58 HD maps
in `public/atlas/tex/` (Solar System Scope CC BY 4.0, NASA via three.js, Celestia; credited on the page), plus
the repo's Gravity Lab link, local fonts and three.js, phone layout, Kepler orbits, Kuiper Belt / Oort Cloud,
plumes, moon view and Easter eggs. Lore corrections r1–r3 re-applied; the newer scenes and set-piece buttons
open only from their own book. One deviation from r3: Tyche opens at Book IV, with its later-book landmark text gated.
Correction (SO6, 2026-11-09): this deviation was originally justified by the staged Iron Gold prologue. That
staging was unverified and has been omitted (SO1-SO3 on PR37: event g1, set-piece `irongoldprologue`, the Tyche
prologue toggle, `SITES.prologue`, `FX.irongoldprologue` and `FX.irongoldreaper`), and it is not evidence for
Book IV availability. The Book IV gate itself is unchanged; it still needs its own accepted evidence or disposition.

## 4. Checks at bb5eb23 (re-run at 14f7a52 after merging main: pnpm check 82/82, test:pages 12×2)

`pnpm check` 68/68 and check-dist 172 files; `test:pages` 12 pages × 2 viewports; browser smoke passed;
Society spoiler-gate suite 676/0 at 1440×900 and 390×844 (run with drawing off for speed); phone Tour and
siege briefing verified by tap; place enter / landmark / event / Back flow verified at desktop and phone.
Screenshots in `shots/`.

## 5. Overlaps with other open PRs

PR #28 (family tree) and #33 (LDS) also edit `engine.js` / `engine.css` / `PACK_FORMAT.md` / the validator.
A trial merge shows three one-line overlaps in `engine.js` (Escape handler, `refreshAll`, `parseHash`) and
small ones elsewhere; whichever PR merges second takes both sides.

## 6. Review fixes (PR #41 checkpoints 1–2, at f778b6b)

- e05c2be: DW02 (book-change cancellation in `society.js`, tests in `tests/society-transitions.test.ts`),
  DW03, DW04, DW05 and the conservative DW06 cuts (dungeons, Terminus Board, Yeddaw orphanage, Ceres
  conference and Medina rooms untied or marked schematic; e35 narrowed; disputed given names dropped).
- Follow-up: DW07 (Tabr entrance keeps only its book-I sentence), Trantor terminal narrowed to the S06 wording,
  the Hyperion ship-landing return clause omitted at III, and the Iron Gold prologue blurb reduced to
  supported context (the wordless cinematic itself was later omitted entirely, SO1-SO3; see the SO6 correction in §3).
- DW01 (Europa) unchanged. Everything else in the DW06 evidence holds and the 202 uncompared sample records
  stays open for ChatGPT.

## 7. Cosmere primary-source corrections CB01–CB04 (queued in HANDOFF_PLAN, 2026-11-04)

Baseline: PR #37 head `9a09dbce1e777d3255e058e11d2b81c53cae8d98`, `public/atlas/packs/cosmere.js` blob `aff59f8d` (matches
the reviewed baseline). This is a content-only patch: `public/atlas/packs/cosmere.js` changes; no engine, timeline or
gate change. Event IDs, `site`, `world` and `book` are kept for all four.

| Row  | Event | Change                                                                                                                                                                                                                                                                                                  |
| ---- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CB01 | e6    | `lm: "clubs"` removed. Title “Kelsier meets Vin”. Copy “In Luthadel, Kelsier meets Vin and recognizes her as Mistborn.” The Clubs landmark itself is unchanged.                                                                                                                                         |
| CB02 | e77   | `lm: "enclave"` removed. Copy “After killing Blushweaver and threatening Llarimar, the plotters obtain Lightsong’s command phrase, change it, and order the Lifeless to march on Idris.”                                                                                                                |
| CB03 | e15   | `lm: "palaces"` removed. Copy “In captivity, Lightsong gives his Breath to heal Susebron, sacrificing himself to restore the God King’s tongue.”                                                                                                                                                        |
| CB04 | e78   | Landmark removed for the composite (the first of the two offered options). Copy “Susebron uses Awakened cloth to rescue Siri. Vasher entrusts him with the D’Denir army, which is sent after the Lifeless marching on Idris.” `fx: "battle"` kept as it was; the site effect is not tied to a landmark. |

Not done: the optional e14 market anchor and the e16 Manywar wording. Neither is a core correction, so both are left
for ChatGPT's call.

Callbacks: the engine's landmark panel lists events by `e.lm === landmark.id`. With `lm` gone, none of the four is
listed under, or focuses, its old landmark. Selecting such an event in the place view takes the existing
no-landmark path (`evInPlace`: overview, effect without a landmark), the same path e16 already uses. Tours use the same
handler. The galactic atlases have no search box, so the place view's event list is the surface checked.

Checks on the patched tree (head in status History):

- `pnpm check` passed: format check, build, 89/89 tests, `check:dist` 173 files.
- `pnpm test:pages` passed: 12 pages × 2 viewports.
- `cb/cb-probe.mjs` (vite preview, software GL) passed **56/56** at 1440×900 and 390×844, output in
  `cb/cb-probe-output.txt`. For each event:
  - at its gate, the title and new copy are in the place view;
  - the loaded pack has no `lm`, and `book` and `site` are kept;
  - one book below the gate, the copy is absent from the DOM;
  - the superseded copy is gone at both settings;
  - no page errors.
- `pnpm test:browser` (root sandbox smoke) is flaky on this older branch in this container. It times out at the
  save/load `#count` step (browser-smoke.mjs:88) **on unmodified `9a09dbc` too**: 1 pass out of 3 runs there, 0 out of
  3 with the patch. That step does not load the atlas. PR CI on the new head is the authority for it.

Not merged; no deploy. DWR-A/B engine holds and every gate are unchanged.
