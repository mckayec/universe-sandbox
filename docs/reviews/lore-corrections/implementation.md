# Lore corrections: implementation

Branch `fix/lore-corrections` (from main 85b2182), PR #24. Applied by Claude, 2026-10-25, from `corrections.md`. Content only: no engine, styling or behaviour code changed. Later-book text sits behind book gates.

Commits: **955e9ef** (all corrections) and **09f26a0** (removes the `noSurface` flag from the new Point Leuctra marker, so the engine no longer labels it "A star").

Counts: **27 applied** (19 error confirmed, 4 can't verify / cut, 4 new findings), **13 not an error / no change** (7 of these had optional text, which was skipped), **0 skipped outright**. One part of L29 was not applied because it is a behaviour change (see the L29 row).

| ID | Status | File · object | What changed | Commit |
| --- | --- | --- | --- | --- |
| L1 | applied | `packs/sun-eater.js` · b7c, forum.eras[7], links r7 | b7c text is now "William names Hadrian Auctor of the Imperium.", and its `site:"eternal"` pin is removed. The Auctor sentence is cut from forum.eras[7]. Forum is removed from r7. Limit: the engine needs every event to have a `world`, so b7c still sits on Forum at world level, with no site. No Aurora coordinates were added. | 955e9ef |
| L2 | applied | `packs/sun-eater.js` · gododdin site catraeth, gododdin.eras[7], b7h | The Catraeth site description is cut to "The white-stone capital." (sites cannot be era-gated). The neutral sentence "Gododdin’s capital suffers a devastating explosion…; Hadrian is blamed." goes in gododdin.eras[7].blurb. b7h text is "An explosion devastates Catraeth, and Hadrian is blamed." No attribution remains. | 955e9ef |
| L3 | applied | `packs/sun-eater.js` · INTRO.text, codex "Imperial Standard Date" | Both numeric offsets are replaced with "In humanity’s distant future". | 955e9ef |
| L4 | applied | `packs/sun-eater.js` · ganelon | star.name is now "Unnamed sun", and `aka:["VA-639D"]` is added. | 955e9ef |
| L5 | not an error (no change) | `packs/sun-eater.js` · William XXIII | — | — |
| L6 | applied | `packs/hyperion.js` · b1j | The itinerary clause is replaced: "Lamia and Johnny investigate his death and reach a replica of Old Earth." | 955e9ef |
| L7 | not an error · skipped-optional | `packs/hyperion.js` · madhya | Optional split-gated blurb not applied. | — |
| L8 | applied | `packs/hyperion.js` · spoilers, ui, oldearth, codex Hoyt/Rachel/Lamia/Johnny/Moneta, "Lions and Tigers and Bears" | Spoiler mode changed `single` → `cumulative`, and the book-bar strings now match that mode ("Reading", "All four books, with spoilers"). **Old Earth** gets `first:3`, so its marker and its Magellanic position stay hidden in books I–II. Its base blurb and short are "Humanity’s lost birthplace, believed destroyed in the Big Mistake." The Magellanic text and facts move to eras[3], and the return to Sol to eras[4]. **Hoyt**: role "Priest, pilgrim", desc per the table; the Pax/Pope text moves to `more[3]`. **Johnny**: "A Keats cybrid who hires Brawne Lamia."; Core persona and murder go in `more[2]`, "Aenea’s father." in `more[3]`. **Moneta**: safe desc; the grown-Rachel identity goes in `more[2]`. **Rachel**: "Sol’s daughter, afflicted by reverse aging."; the Moneta reveal goes in `more[2]`. **Lamia**: "mother of Aenea" moves to `more[3]`. The "Lions and Tigers and Bears" codex entry (which says they moved Old Earth) gets `first:3`. | 955e9ef |
| L9 | applied | `packs/hyperion.js` · garden.blurb | "A forest world whose native centaurs were exterminated during human expansion." | 955e9ef |
| L10 | applied | `packs/hyperion.js` · codex "Dating" | The table text replaces the old text, and the entry is gated `first:3`. | 955e9ef |
| L11 | applied | `packs/expanse.js` · b7e, jupiter.eras[7], s7, new world `leuctra` | Added a schematic Belt marker, **Point Leuctra** (`group:"belt"`, `est:true`, distText says the position is schematic, books [7]/first 7). Its blurb is the table sentence. b7e moves to `leuctra` with the replacement text. The Jupiter battle sentence is removed from jupiter.eras[7], and the following blackout sentence went with it, leaving "The great gas giant and its crowded moons.". s7 endpoints are now solring→leuctra→pallas. The surrender (b7g, Earth) stays a separate event. | 955e9ef, 09f26a0 |
| L12 | applied | `packs/expanse.js` · tycho.eras[7], pallas.blurb, b7f | Tycho era: status "Withdrawn from Pallas", blurb per the table. b7f: title "Pallas destroyed", text per the table. The Pallas blurb's destruction sentence uses the same b7f wording. `aka:["Pallas-Tycho"]` stays, because the historical association is retained. | 955e9ef |
| L13 | not an error (no change) | `packs/expanse.js` · ilus | — | — |
| L14 | applied | `packs/expanse.js` · links r1, b1c | r1.path is now `["saturn","tycho","eros","tycho","thoth","tycho","eros","venus"]`, plus a descriptive `label:"Simplified route"`. b1c: title "The Rocinante reaches Tycho", text per the table. | 955e9ef |
| L15 | not an error (no change) | `packs/expanse.js` · nieuwestad | — | — |
| L16 | not an error · skipped-optional | `packs/dune.js` · kaitain | — | — |
| L17 | not an error · skipped-optional | `packs/dune.js` · wallach, naraj | — | — |
| L18 | not an error (no change) | `packs/foundation.js` · smyrno | — | — |
| L19 | applied | `packs/foundation.js` · loris.blurb, trantor site wye | Loris: "A Foundation world reached by Bel Riose’s campaign." (the wine and distance sentence is removed). Wye: "at the south pole" → "near the south pole". | 955e9ef |
| L20 | applied | `packs/cosmere.js` · gas-giant generator | Both `i + 5` → `i + 4` (status and Order fact). Jes now shows "4th from the sun". | 955e9ef |
| L21 | applied | `packs/cosmere.js` · e12 | "Sazed takes up both Shards and restores the world, clearing the ash." The Scadrial era text is untouched, as instructed. | 955e9ef |
| L22 | applied | `packs/cosmere.js` · e59, roshar.eras[12] | e59: title "Stormfall", text per the table. Era sentence "Only Azir is spared the storm." → "Azir, Urithiru and the Shattered Plains resist his rule." | 955e9ef |
| L23 | applied | `packs/cosmere.js` · e24 | `site:"narak"` removed. The event stays at `world:"roshar"` with the explicit location text, because the existing `warcamps` site is the ten-crater region, not a palace marker. | 955e9ef |
| L24 | not an error · skipped-optional | `packs/cosmere.js` · obrodai | — | — |
| L25 | applied | `packs/cosmere.js` · books[12].y | `2024` → `"2024–2026"` (shown only in the book-button tooltip; the spoiler key stays 12). | 955e9ef |
| L26 | not an error · skipped-optional | `packs/cosmere.js` · Nomad codex | — | — |
| L27 | applied | `society.js` · rhea control/facts, r1 | 681 PCE → 701 PCE in all three fields. "About 60 million" is kept. | 955e9ef |
| L28 | not an error (no change) | `society.js` · rheacities | — | — |
| L29 | applied (content part) | `society.js` · BODIES mercury/venus/earth/luna/phobos, ERAS, #chronHint | The base blurbs are replaced with the five safe sentences, and Earth's base control is now "The Society". The original trilogy-end texts move to new `ERAS[3]` entries: Venus, Earth (including control "The Society, then the Rising"), Luna and Phobos, plus Mercury's Ash-Lord sentence appended to its existing era-1 text. Book-IV–VI outcomes were already in ERAS[4–6]. The notice "Spoilers are shown through the selected book." is prepended to the Chronicle hint. **Not applied:** "Start with Book I; require explicit selection for all six". That changes start-up behaviour (`let ERA=6`, `bookFilter=0` and the HTML's `aria-pressed` default), which the task rules exclude. Also note that the Chronicle hint is hidden on phones by existing CSS. | 955e9ef |
| L30 | not an error · skipped-optional | `society.js` · g8 | — | — |
| L31 | applied | `society.js` · POIS.earth newsparta/rome, l3, new event l3b | New Sparta desc and l3 text per the table. Rome desc: "Atalantia convenes the Two Hundred in Rome’s Colosseum." Added event `l3b` (book 6, earth/rome) titled "The Two Hundred", text per the table. The other l3 sentences (Glirastes killed, Ajax sides with Lysander) were dropped because the prescribed l3 text replaces them. | 955e9ef |
| L32 | not an error (no change) | `society.js` · r3, Pluto | — | — |
| L33 | applied | `solar.js` · neso.blurb | Opening → "One of Neptune’s most distant known moons". | 955e9ef |
| L34 | applied | `solar.js` · phoebe.blurb | "…a faint ring extending roughly 6–16 million km from Saturn’s center." | 955e9ef |
| L35 | applied | `solar.js` · sedna facts "From Sun" | "76 AU now" → "Perihelion: about 76 AU" (", up to ~940 AU" kept). | 955e9ef |
| L36 | not an error · skipped-optional | `solar.js` · MOON_TOTALS.jupiter | 115 is kept; the optional date label is skipped. | — |
| N1 | applied | `packs/foundation.js` · INTRO.text | The first sentence is replaced with the given text; the rest is kept. The codex "Twelve thousand years old" for the Empire is a separate claim that N1 doesn't cover, so it is unchanged. | 955e9ef |
| N2 | applied | `packs/cosmere.js` · books[2], [6], [8] | y → "2006–2008", "2011–2016", "2017–2020"; numeric keys unchanged. | 955e9ef |
| N3 | applied | `packs/cosmere.js` · links h-nomad | The link is deleted. No other reference to it remains (`h-nomad2`, Roshar→Canticle, is a different link and is kept). | 955e9ef |
| N4 | applied | `solar.js` · mars.blurb | The first sentence is replaced with the given text; the rest is kept. | 955e9ef |

Note: line numbers in `corrections.md` refer to older snapshots. Every item was found by object id or text. All prescribed objects existed.

## Checks

- `pnpm format && pnpm check`: passed. Format clean, build OK, 59/59 tests including the atlas pack validator, `check-dist` 109 files OK. The only validator warning added is `world oldearth: first=3 > min(books)=1`, which is intentional (L8) and not fatal.
- `CHROME_PATH=… pnpm test:pages`: passed. 12 pages × 2 viewports under `/universe-sandbox/`, no errors.
- Browser spot-check (`pnpm preview` on 4201, Python Playwright with swiftshader WebGL): 40+ checks across all eight atlases passed, with no page errors. Examples:
  - **Hyperion, gated:** with book I selected, Old Earth is missing from the index and its deep link falls back to the About panel. The codex shows the safe Moneta, Johnny and Hoyt text. With book III, Old Earth appears with the Magellanic blurb. With book IV, the codex shows "grown Rachel", "Urban XVI" and "Aenea’s father", and Old Earth's status reads "returns to Sol". b1j text is correct with book I.
  - **Sun Eater:** Gododdin at book III has no explosion text; at book VII it shows the neutral explosion sentence and the b7h text. Forum book VII era and b7c text are correct. Ganelon star is "Unnamed sun". The About text reads "In humanity’s distant future".
  - **Expanse:** Point Leuctra is hidden at book VI and visible at book VII with b7e. Pallas blurb and b7f are correct. b1c is retitled.
  - **Cosmere:** Jes shows "4th from the sun". Roshar book XII era and Stormfall are correct. The book tooltips show the four ranges.
  - **Foundation:** Loris and the About text are correct.
  - **Society:** with book I, Earth reads "Humanity’s homeworld, governed from Luna." with no Mustang text, and Luna is safe. With book III, Earth shows the trilogy-end text. With book VI, the Rome place and the "The Two Hundred" event are listed. Rhea shows 701 PCE. The spoiler notice is present.
  - **Solar:** Neso, Phoebe, Sedna and Mars show the new text.
