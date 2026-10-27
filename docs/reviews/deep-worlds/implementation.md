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
- **Engine view "place"**: *Enter* from a site card (or click a site's label twice) → landmarks list, Day /
  Dusk / Night / Dawn, "What happened here", hops to the world's other places, *Back* / Esc to the surface.
  Clicking an event inside a place flies to its landmark and plays its scene. Deep links:
  `#world=…&site=…&view=place&lm=…`. Landmarks use the same book gating as sites.
- **Walk the surface**: a world with no named places offers an unnamed schematic view, labelled as such.
- **▶ Tour** in the Chronicle bar plays the selected book's events in order, travelling into each place.
- Validator (`tests/atlas-pack-validator.mjs`) checks scenes, landmark kinds, `at`/`h` ranges, landmark book
  gating, event `lm` references and `fx` names.

## 2. Content (all six galactic packs)

| pack | worlds with sites | sites | scenes | landmarks | events | events → landmark | events with scene | codex |
|---|---|---|---|---|---|---|---|---|
| sun-eater | 26 → 37 | 61 → 72 | 72 | 138 | 64 → 84 | 58 | 25 | 56 → 71 |
| hyperion | 31 → 35 | 70 → 75 | 75 | 97 | 57 → 81 | 62 | 8 | 69 → 72 |
| expanse | 14 → 32 | 34 → 58 | 58 | 112 | 88 → 116 | 95 | 33 | 65 → 95 |
| dune | 6 → 14 | 46 → 56 | 56 | 101 | 54 → 90 | 64 | 26 | 86 → 97 |
| foundation | 20 → 21 | 40 → 44 | 44 | 101 | 68 → 121 | 104 | 7 | 91 → 132 |
| cosmere | 15 → 16 | 174 → 175 | 175 | 190 | 63 → 124 | 105 | 34 | 41 → 59 |

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
- **Hyperion**: spoiler mode stays *cumulative* per L8; the Sphinx text changed so it no longer spoils book II;
  raft launch books [3] → [3,4]; Cicero's, Stan Leweski and a Cleft cruciform-caves landmark left out.
- **Expanse**: b6i (Transport Union) moved from Medina to Ceres; Medina's railguns placed in the slow-zone
  scene without naming the hull; b3f / b6g / b8j split into b3l / b6l / b8n.
- **Dune**: d5 now credits Duncan *and* Liet-Kynes with the testing-station rescue; d3 split (d14 harvester
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
open only from their own book. One deviation from r3: Tyche opens at Book IV (the Iron Gold prologue is staged
there), with its later-book landmark text gated.

## 4. Checks at bb5eb23

`pnpm check` 68/68 and check-dist 172 files; `test:pages` 12 pages × 2 viewports; browser smoke passed;
Society spoiler-gate suite 676/0 at 1440×900 and 390×844 (run with drawing off for speed); phone Tour and
siege briefing verified by tap; place enter / landmark / event / Back flow verified at desktop and phone.
Screenshots in `shots/`.

## 5. Overlaps with other open PRs

PR #28 (family tree) and #33 (LDS) also edit `engine.js` / `engine.css` / `PACK_FORMAT.md` / the validator.
A trial merge shows three one-line overlaps in `engine.js` (Escape handler, `refreshAll`, `parseHash`) and
small ones elsewhere; whichever PR merges second takes both sides.
