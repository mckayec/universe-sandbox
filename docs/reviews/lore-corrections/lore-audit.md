# Gravity Lab: content accuracy audit (book-series atlases)

Read-only review of `public/atlas/packs/*.js`, `public/atlas/society.html` and `public/atlas/solar.html` at commit 667673f. Line numbers refer to those files. Confidence levels: **Confirmed** (a source agrees), **Likely** (strong recall, but no source I could open confirms it), **Unsure** (I could not verify it, so treat it as a candidate for checking).

Overall, these packs are much more accurate than typical AI-generated lore. Most names, star identifications and plot beats hold up. The errors that remain are mostly wrong locations for events, a few invented details, and an off-by-one bug in the Cosmere planet numbering.

---

## Sun Eater (`packs/sun-eater.js`)
**Verdict:** High accuracy. World list, ISD dates and battle sequence match suneater.wiki. There is one wrong event location in book VII and a few loose details.

- **L1 (Medium).** Line 496, event `b7c` "Auctor", placed at `world:"forum"`, site `eternal`. Also line 53, the Forum `eras[7]` text: "Hadrian returns to Forum to be named Auctor". William XXIII actually names Hadrian Auctor aboard the *Aurora* (ch. 48–49). Forum had already fallen; Hadrian learns this later (ch. 59). The book VII route at line 423 (`r7`, which includes `"forum"`) has the same error. Fix: move the event to the Emperor's fleet and drop Forum from `r7`. **Confirmed.** Source: https://ursummary.com/shadows-upon-time-summary-chapter-by-chapter-ruocchio/
- **L2 (Medium).** Line 157 (Catraeth site) and line 501 (`b7h`) say "a Chantry antimatter bomb … blamed on Hadrian". The chapter summary says Hadrian concludes that Alexander set it off to frame him. One summary of the same source credits the Chantry, so the sources disagree. Check the book; if it was Alexander, this matters because Alexander takes the throne. **Unsure.** Sources: https://ursummary.com/shadows-upon-time-summary-chapter-by-chapter-ruocchio/ and https://ursummary.com/shadows-upon-time-summary-christopher-ruocchio/
- **L3 (Low).** Line 13 (intro) says "Seventeen thousand years from now". The codex (line 570) says "roughly twenty thousand years from now". The two disagree with each other. Pick one; ISD ~16117 plus the pre-Empire centuries points to about 20,000.
- **L4 (Low).** Line 198, the Ganelon star is given as `"DB-639D"`. suneater.wiki lists it as VA-639D. **Confirmed** (wiki). Source: https://www.suneater.wiki/books/helpful-links/page/index-of-worlds
- **L5 (Low).** Lines 401 (Thermon) and 559 (William XXIII "Emperor … for some seventeen centuries") were not verified. The Thermon trial is correct. **Unsure** on the reign length.
- **Omissions (Low).** None of these would be missed by most readers: Judecca (the Irchtani homeworld named in the codex), Ius as its own body, and Aea as a site.

## Hyperion Cantos (`packs/hyperion.js`)
**Verdict:** Good. The pilgrimage, the Tethys raft route (it matches Wikipedia's order exactly) and the Endymion/Rise plot are right. The Detective's Tale itinerary is wrong, and the spoiler mode exposes the late twists.

- **L6 (Medium).** Line 370, event `b1j`, says the chase goes "through Lusus, TC² and Madhya to the Core's Earth". In the tale, Lamia and Johnny go Lusus → Renaissance Vector → God's Grove → Maui-Covenant → the Old Earth replica. Madhya is only where Johnny remembers being attacked. **Confirmed.** Source: https://www.supersummary.com/hyperion/chapter-5-summary
- **L7 (Medium).** Line 69, Madhya blurb: "Lamia's chase … leads here", "its hidden military farcaster launches the fleets", and "loyalists set up a Vatican in exile here". Given L6, the first claim is wrong. I could not confirm the other two; they are possible inventions. **Unsure.**
- **L8 (Medium, spoilers).** Line 543, `spoilers:{mode:"single"}`, means nothing is ever hidden. Base blurbs then give away late twists to a reader who has just started. Examples: Old Earth (line ~286 in the dump) "carried it away … to the Lesser Magellanic Cloud"; codex Moneta "the grown Rachel"; codex Hoyt "Pope Julius and then Urban XVI"; codex Johnny "Aenea's father". Either switch this pack to cumulative mode or move these into `eras`/`more`.
- **L9 (Low).** Line 76, Garden: "centaur-like natives … the subject of Silenus's poem 'The Death of the Centaur'". I found no source for this world or the poem. It is a possible invention. **Unsure.**
- **L10 (Low).** Line ~434, codex "Dating": "Fall … around 2850 AD". Fan timelines differ, and the entry hedges it, so this is acceptable.

## The Expanse (`packs/expanse.js`)
**Verdict:** Very good. The pack follows the books, not the TV show: Michio Pa leads the Union, Bobbie dies throwing the bomb by hand, and Naomi goes to Auberon. The book VII battle is in the wrong place.

- **L11 (Medium).** Line 614, event `b7e` "The fleets broken", is placed at `world:"jupiter"`. The Jupiter `eras[7]` text at line 298 and the link `["solring","jupiter"]` say the same. In the book, the combined fleet makes its last stand as the *Tempest* crosses the asteroid belt (Leuctra Point), not at Jupiter. **Confirmed.** Sources: https://en.wikipedia.org/wiki/Persepolis_Rising and https://www.supersummary.com/persepolis-rising/summary/
- **L12 (Medium).** Line 268, Tycho `eras[7]`: "By the seventh book Tycho is joined to Pallas … destroys it". Also lines 285 and 615, `aka:["Pallas-Tycho"]` and "Pallas-Tycho destroyed". The sources only say the *Tempest* destroys **Pallas Station**, the Belt's main shipyard. Nothing I found says Tycho was moved or destroyed. **Unsure**, possibly invented. Safer wording: "Pallas Station destroyed", with Tycho left out.
- **L13 (Low).** Line ~182, Ilus: "thirteen dark moons sharing a single orbit". I found no source for this, and the Wikipedia plot does not mention it. **Unsure.**
- **L14 (Low).** The book I route (`r1` in links) is `tycho→eros→thoth→tycho→eros`. The book order is Eros, then Tycho, then the Thoth assault, then Eros, so the stop at Tycho between Eros and Thoth is missing. Event `b1c` ("The Donnager falls") is pinned to Tycho, although the Donnager is lost in deep space. **Likely.**
- **L15 (Low).** Spelling: "Nieuwestad" (line ~242). Wikipedia spells it "Nieuwestadt". **Unsure** which the book uses.

## Dune (`packs/dune.js`)
**Verdict:** Excellent. The glossary star identifications (Canopus, Delta Pavonis, 36 Ophiuchi B, Gamma Waiping, Thalim and so on), the Zensunni migration stops and the six-book chronology are correct. Non-canon sources are labelled, and no film material has crept in.

- **L16 (Low).** Line 72, Kaitain star: "Alpha Piscium in a fan gazetteer". This is labelled, but Wikipedia only shows the name collision with Alpha Piscium; it does not identify the two. Either drop it or keep it as a clearly flagged guess.
- **L17 (Low).** The Wallach IX `eras[6]` text ("overrun or destroyed") and the Naraj details (Farok, the stone burner, his son's eyes) could not be confirmed. **Unsure.**

## Foundation (`packs/foundation.js`)
**Verdict:** Excellent. Dates (1 F.E. = 12,069 G.E.; Seldon born 11,988 G.E.; Quoriston 377 F.E.), the order of worlds in *Foundation and Earth*, Tazenda's 27 worlds and Sayshell's 86 worlds are all right. The TV series is explicitly excluded.

- **L18 (Low).** Line ~55, Smyrno: "Its people live largely underground". I could not confirm this; the same trait is given to Haven. **Unsure.**
- **L19 (Low).** Line ~90, Loris "known for its wine", and Wye placed "at the south pole" (Prelude). Neither confirmed. **Unsure.**

## Cosmere (`packs/cosmere.js`)
**Verdict:** High accuracy on star-chart data and the Roshar and Sel maps. It has one systematic numbering bug and several mislabelled events.

- **L20 (High).** Line 338: `status:"Gas giant · " + (i + 5) + "th from the sun"`, with matching `Order` facts. The Rosharan order is Ashyn (1), Roshar (2), Braize (3), the asteroid belt, then Jes (4) through Ishi (13). Every gas giant is therefore one place too far out: Jes is shown as 5th, Ishi as 14th. The sun's own blurb says 13 planets, so the pack contradicts itself. Fix: `i + 4`. **Confirmed.** Source: https://coppermind.net/wiki/Rosharan_system
- **L21 (Medium).** Line 703, event `e12` "The Hero of Ages": "remakes the world, ending the ash and the mists". The mists stay in Era 2; they become local and no longer Snap people. The same claim appears in the Scadrial ERA6 framing. **Confirmed.** Source: https://coppermind.net/wiki/Mists
- **L22 (Medium).** Line 760, event `e59` is titled "The Night of Sorrows". The withdrawal of Stormlight and the Everstorm covering Roshar is **Stormfall**; Coppermind lists the Night of Sorrows as a separate event. Line 313 (Roshar `eras[12]`) says "Only Azir is spared the storm". Coppermind says Azir *and* the Shattered Plains and Urithiru were kept free. **Confirmed.** Sources: https://coppermind.net/wiki/Stormfall and https://coppermind.net/wiki/Retribution
- **L23 (Medium).** Line 718, event `e24` "Kaladin's Third Ideal", is placed at `site:"narak"`. Kaladin swears the Third Ideal in the king's palace in the Kholin warcamp, while saving Elhokar from Moash and Graves. He flies out to the Plains afterwards. **Likely** (the Coppermind chapter pages I could reach did not cover the scene).
- **L24 (Low).** Line 649, Obrodai: "a letter from Patji to Hoid". Coppermind attributes the letter only to "an avatar of Autonomy", writing to Cephandrius; it does not name Patji. **Confirmed.** Source: https://coppermind.net/wiki/Oathbringer/Epigraphs
- **L25 (Low).** Line 237: book 12 is "Wind and Truth, Isles of the Emberdark & The Fires of December" with `y:2024`. *Isles* came out in 2025. *Fires* came out as an ebook on 6 Oct 2026, with the hardcover due 8 Dec 2026. Bundling three years under 2024 is misleading. Sources: https://booksofbrilliance.com/2026/10/06/the-fires-of-december-brandon-sanderson-release-date-news/ and https://risingshadow.net/book/97713-the-fires-of-december
- **L26 (Low).** Nomad is identified as Sigzil only from book 12 (codex `more`), but *The Sunlit Man* (book 11) already makes it clear. This is a late reveal, not a spoiler leak.

## Red Rising: Society Atlas (`society.html`)
**Verdict:** Good. The trilogy and the book IV–VI beats check out against Wikipedia and the fan wiki: Octavia, Ragnar, Trigg, Ash Lord, Kalyke, Cassius's death and Fá's death are all right. There is one wrong date, one possibly invented anecdote, and the book filter leaks spoilers.

- **L27 (Medium).** Line 743 (`facts` "681 PCE, First Moon Lord Rebellion") and line 836 (`r1` text) date the burning of Rhea. The Red Rising wiki dates it to **701 PCE**. The death toll ("about 60 million") is not confirmed either. **Confirmed** for the date. Source: https://red-rising.fandom.com/wiki/Magnus_au_Grimmus
- **L28 (Low).** Line 829, Rhea POI: "The ArchGovernor of Rhea … striking the Ash Lord with his scepter". I found no source. It is a possible invention. **Unsure.**
- **L29 (Medium, spoilers).** Lines 851–853 and 3449. The book buttons only filter the Chronicle. Body blurbs fall back to their base text for books I–III, and those base texts give away the end of the trilogy even when Book I is selected:
  - Earth (line 481): "The Rising takes it … Mustang finally tells Darrow her secret".
  - Luna (483): "The trilogy's final battle".
  - Phobos (487): "later seized by the Rising".
  - Mercury and Venus (477, 479): the Ash Lord's retreat.
  - Also, the page loads with `ERA=6` ("All") by default, showing everything up to Light Bringer with no warning.

  Move this text into `ERAS[3]`, and add a "reading through" gate or a spoiler notice.
- **L30 (Low).** Line 655, event `g8`: "Cassius kills Bellerephon in the Bleeding Place, Lysander reveals his name". Wikipedia has Cassius beaten by **Seraphina** in the duel, and Lysander reveals himself to save him; the wiki adds that he survives and is taken to Europa. Bellerephon is not confirmed. **Unsure** on the name, **Confirmed** that Seraphina's win is missing. Sources: https://en.wikipedia.org/wiki/Iron_Gold and https://red-rising.fandom.com/wiki/Cassius
- **L31 (Low).** Line 623 (Rome POI): "Said to host the Society's summit of the two hundred". Lines 620 and 679 put that same summit at **New Sparta**, so the atlas contradicts itself. Pick one.
- **L32 (Low).** Line 838, event `r3` (with the Pluto blurb): "Sevro and the Howlers are posted to distant Pluto". The wiki says their contracts were leased to House Krakova *of* Pluto and that they were sent to "far off planets". The book does not clearly say Pluto. **Unsure.** Source: https://red-rising.fandom.com/wiki/Sevro_au_Barca

## Solar System (`solar.html`)
**Verdict:** Accurate overall. Physical data, mission dates and features match NASA and standard references. There are a few factual slips and one moon count that sources disagree on.

- **L33 (Medium).** Line 831, Neso blurb: "The farthest known moon from its planet". S/2021 N 1 orbits farther: 50.7 million km and 27.5 years, against Neso's 49.9 million km and 26.8 years. The atlas's own `MINOR_MOONS.neptune` list includes S/2021 N 1. Line 940 ("among the most distant moons") is correct. **Confirmed.** Source: https://en.wikipedia.org/wiki/S/2021_N_1
- **L34 (Low).** Line 771, Phoebe: "a giant, faint ring 7 to 30 million km from Saturn". Measurements put it at about 100–270 Saturn radii, roughly 6 to 16 million km. "30 million" is wrong. **Confirmed.** Source: https://phys.org/news/2015-06-saturn-outer-bigger-thought.html
- **L35 (Low).** Line 879, Sedna: "76 AU now". 76 AU is its closest approach (perihelion); it is about 83 AU away in 2026. **Confirmed.** Source: https://en.wikipedia.org/wiki/Sedna_(dwarf_planet)
- **L36 (Low).** Line 893 `MOON_TOTALS.jupiter:115`, and the Jupiter facts at line 653 ("115 known"). The IAU Minor Planet Center reported **101** on 26 March 2026. One secondary site claims 115 as of 9 April 2026, but I found no IAU or NASA notice for that. Saturn's 293 matches NASA APOD (June 2026). **Unsure.** Sources: https://www.iau.org/IAU/IAU/News/Ann2026/MPC-New-Moons-Saturn-Jupiter.aspx , https://canadacurrent.org/blog/how-many-jupiter-moons/ and https://apod.nasa.gov/apod/ap260811.html

---

## Top 10 corrections, by importance
1. **L20.** Cosmere gas-giant order is off by one (`i + 5` should be `i + 4`). It shows on ten status chips and fact rows.
2. **L29.** The Society Atlas book filter shows trilogy-ending spoilers in base blurbs, and the page opens on "All".
3. **L8.** The Hyperion pack's single mode puts the books 3–4 twists (Old Earth's fate, Moneta = Rachel, Hoyt as Pope) in base text.
4. **L11.** Expanse: the *Tempest* breaks the combined fleet in the Belt, not at Jupiter.
5. **L1.** Sun Eater: Hadrian is named Auctor aboard the *Aurora*, not on Forum; drop Forum from the book VII route.
6. **L6.** Hyperion: the Detective's Tale itinerary is wrong (it is not TC² and Madhya).
7. **L21.** Cosmere: the mists do not end with *Hero of Ages*.
8. **L22.** Cosmere: "Night of Sorrows" should be Stormfall, and Azir was not the only place spared.
9. **L12.** Expanse: "Pallas-Tycho" and the destruction of Tycho are unsupported; say "Pallas Station" instead.
10. **L27 and L33, tied.** Rhea was burned in 701 PCE, not 681. Neso is not the farthest moon; S/2021 N 1 is.

Next tier: L23 (where Kaladin swears the Third Ideal), L2 (who set off the Catraeth bomb), and the possible inventions in L7, L9, L13 and L28, which should be checked against the books or cut.
