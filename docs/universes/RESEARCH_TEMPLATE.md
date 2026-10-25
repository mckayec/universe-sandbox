# Research template

ChatGPT writes `docs/universes/packs/<id>/research.md` in exactly this order. Claude builds the atlas pack directly from it, so structure matters as much as content. The engine's data format is described in `docs/atlas/PACK_FORMAT.md` (formerly `public/atlas/PACK_FORMAT.md`). Read it so the research matches what the engine can show.

## Rules for every entry
- **Cite everything.** After each fact, add a source tag like `[S3]` pointing to an entry in `sources.md`, plus a confidence tag: `(C)` confirmed by a source you opened, `(L)` likely but not opened, `(U)` unsure. Claude builds only `(C)` and `(L)`; `(U)` items are listed for the audit and otherwise left out.
- **Primary source first.** Cite book and chapter (or scripture reference) where possible; wikis are acceptable secondary sources. Note where film/TV canon differs, in a separate "Screen differences" line, never mixed into the main text.
- **Spoiler order.** Give every place, event and character fact the earliest book/volume where a reader learns it (`first: <book number>`). Put later developments under that place's **eras** (book number → what changes).
- **Paraphrase.** No quotations longer than one short phrase, except public-domain scripture.
- **No invention.** If a detail can't be found, write "unknown" rather than filling the gap.
- **Before canon approval,** every `(L)` claim is verified from opened evidence, explicitly labelled as uncertain or as a model, or removed. `(U)` claims never ship.
- **Coverage and checkpoints:** large universes are researched over several runs. Keep a coverage table at the top of `research.md` (per work or layer: covered / in progress / not started, plus exclusions) and commit checkpoints. Hand off as `research-ready` only when the agreed scope is covered.
- **Models aren't coordinates:** contested or unknown geography (e.g. Book of Mormon lands) is recorded as named models with their proposed locations, never as one asserted real-world coordinate.

## 1. Meta
- Universe id (kebab-case), title, short description (one sentence)
- Works covered, in reading/canonical order, with number, title, year
- Track (A/B/C/D from `PLAN.md`) and the recommended view: galaxy, world-only, Earth-historical, or custom
- Rights holders (for the fan-work notice)
- Suggested accent colors / visual theme (2–3 words of mood + reference descriptions of the look; no copyrighted images)

## 2. Structure
- **Galaxy/region layout** (Track C): regions, sectors, territories, and their rough relative positions (describe as "core / inner rim / near X" if no official map exists, and say so)
- **World(s)** (Track B): continents, seas, mountain ranges, climate bands, with relative positions ("north of", "across the X sea") and approximate scale if the source gives one
- **Earth-historical** (Track A): real locations with modern names + coordinates, historical names, and the date ranges each is relevant

## 3. Places
One entry per world/region/site:
- id, name, aliases, parent (which world/region it belongs to)
- type (planet, moon, city, region, landmark, battlefield, temple…)
- position (map coords if known, otherwise relative description; real lat/lon for Track A)
- first appearance (book/volume)
- description (2–4 sentences, spoiler-safe for `first`)
- eras: `book N:` what changes (spoilers go here)
- notable events here (ids from §4)

## 4. Events (the timeline)
One entry per event, in story order:
- id, title, book/volume (+ chapter or reference), place id(s), characters involved
- summary (1–2 sentences, paraphrased)
- date in the setting's calendar if given

## 5. Journeys
One entry per character or group journey: who, which book(s), ordered list of place ids, and a one-line note per leg. Mark legs that are inferred vs stated.

## 6. Codex
Short reference entries for concepts, factions, peoples, magic/technology systems, and key figures (spoiler-gated by `first`).

## 7. Open questions
Anything disputed between sources, unresolved in canon, or that you could not verify. Claude will not build these as fact.

## 8. Track A additions (religion & history)
- For each event or place: **text** (what the scripture says, with reference), **tradition** (what adherents believe), **scholarship** (what historians/archaeologists say), each labeled.
- For contested geographies (e.g. Book of Mormon lands): each major proposed model with its main proponents, how it maps the key places, and its strongest supporting/opposing arguments, all presented neutrally.
- For the world-religions tree: each tradition's origin (date range, place, founder/figures), parent tradition(s), schisms (date, cause, branches), present-day adherents and regions, and cross-tradition influences.
