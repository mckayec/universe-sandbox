# Existing atlas lore corrections

Reviewed: 2026-10-25 UTC. Reviewer: ChatGPT. Scope: the eight files below; no atlas code changed.

## Results and evidence limits

All 36 audit leads received a disposition: **19 error confirmed / 13 not an error / 4 can't verify (cut or neutralize)**. The second pass contains **120 atomic checks: 15 for each of seven fictional series, plus 15 for the Solar System**, producing **4 new findings** (3 corrections and 1 unsupported route to cut). Counts are per lead, not per sentence or edit.

This is a source-backed correction handoff, **not a completed primary-book canon sign-off**. A dedicated Deep Research tool was not available in this session. Research used web search, retrieved pages and extracts, publisher/author material, NASA and scientific literature, and book-focused secondary references. Full copies of the novels were not available. Chapter references supplied by a wiki are identified as such; they are not claims that I read those book chapters. Fan wikis and commercial summaries are secondary sources, not official author confirmation. Repeated summaries can share errors; absence from a summary never proves absence from a book.

Confidence: **(C)** directly supported by an opened primary/official source or the inspected repository; **(L)** secondary-supported or otherwise provisional (used conservatively even when a secondary page was opened); **(U)** unresolved. These tags deliberately distinguish strength of evidence in addition to the template's opened/not-opened distinction. “Error confirmed” is the requested disposition for a supported correction; an (L) tag still requires caution and does not certify primary-book verification. Unsupported specifics are removed rather than replaced with guesses.

Claude can implement the conservative wording below after `fix/audit-atlas` merges. This handoff does not authorize deployment or final canon approval. Line numbers refer to the reviewed snapshots; locate object IDs after rebasing.

## Reviewed snapshots

| File | Blob SHA |
| --- | --- |
| `public/atlas/packs/sun-eater.js` | 1c9925daf8073f9086f4aa31c7b52c8a1a5f9a16 |
| `public/atlas/packs/hyperion.js` | ca59a3b74b873ce93425e2cc819df05819b6bb15 |
| `public/atlas/packs/expanse.js` | c5b14f061e7502dae76471ba408d2463ad25de3c |
| `public/atlas/packs/dune.js` | c7cc33f8f3ab2e5d7d6688ec1ccc84651dd63227 |
| `public/atlas/packs/foundation.js` | bb9f4424bb22ce0fa8cca6207346ae9de603de2f |
| `public/atlas/packs/cosmere.js` | edb16e0abb13a5a11d8fd9617096cd1edea56b1e |
| `public/atlas/society.html` | 4f4ab886c1bcf6aae98fe2cd101356feacdced3c |
| `public/atlas/solar.html` | 69050982160e0e1701431b3ddacb9ff88ddc8264 |

## L1–L36 dispositions

Replacement prose inside quotation marks is newly paraphrased suggested UI text, not a quotation from a book. Instructions outside quotation marks specify field edits. “Retain” means no mandatory factual change; optional clarification is labelled. Each table row cites its own evidence.

| ID | File | Object / line | Verdict and confidence | Exact replacement or disposition | Spoiler book (`first`) | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| L1 | `public/atlas/packs/sun-eater.js` | b7c:496; forum.eras[7]:53; r7:423 | (U) Can't verify — cut the precise location | For b7c: “William names Hadrian Auctor of the Imperium.” Remove its Forum/eternal pin and Forum stop from r7 pending a book check; remove the Auctor sentence from forum.eras[7]. Do not add Aurora coordinates. The audit's chapter-summary website is insufficient to certify the proposed location; the reopened Sun Eater wiki has empty chapter 48–49 summaries. | 7 | [source 1](https://www.suneater.wiki/books/novels/page/shadows-upon-time-chapter-summaries); [source 2](https://ursummary.com/shadows-upon-time-summary-chapter-by-chapter-ruocchio/) |
| L2 | `public/atlas/packs/sun-eater.js` | catraeth.desc:157; b7h:501 | (U) Can't verify — neutralize attribution | Catraeth: “Gododdin’s capital suffers a devastating explosion amid the final book’s unrest; Hadrian is blamed.” b7h: “An explosion devastates Catraeth, and Hadrian is blamed.” Cut both the Chantry attribution and any proposed Alexander attribution. Conflicting summaries are not independent proof. | 7; base site description first 3 must omit the later sentence | [source 1](https://ursummary.com/shadows-upon-time-summary-chapter-by-chapter-ruocchio/); [source 2](https://ursummary.com/shadows-upon-time-summary-christopher-ruocchio/) |
| L3 | `public/atlas/packs/sun-eater.js` | INTRO.text:13; Dating concept:570 | (C) Error confirmed — internal inconsistency | Replace both numerical future offsets with “In humanity’s distant future”. Do not infer an exact AD date by adding an Imperial calendar year to the present. | 1 | [source 1](https://github.com/mckayec/universe-sandbox/blob/main/public/atlas/packs/sun-eater.js) |
| L4 | `public/atlas/packs/sun-eater.js` | ganelon.star.name:198 | (L) Error confirmed — secondary support; planet/star distinction | Set star.name to “Unnamed sun”; add “VA-639D” to Ganelon’s aliases. The source identifies a planet, not a named star: merely replacing DB with VA in star.name would preserve a category error. | 5 | [source 1](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| L5 | `public/atlas/packs/sun-eater.js` | Thermon blurb:138; William XXIII character:559 | (L) Not an error — reign corroborated | Retain the approximate seventeen-century reign: the wiki gives ISD 15826–17521, a difference of 1,695 years. Retain Thermon as the trial site; do not treat the audit’s line 401 as its current location. The duration of the trial is not newly certified by this reign calculation. | existing gates; reign spans 1–7 | [source 1](https://www.suneater.wiki/books/sollan-empire-vBP/page/sollan-empire); [source 2](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| L6 | `public/atlas/packs/hyperion.js` | b1j:370 | (L) Error confirmed — conflated investigation/chase; audit partly wrong | Replace itinerary clause with “Lamia and Johnny investigate his death and reach a replica of Old Earth.” Madhya is actually visited during the investigation; the audit’s assertion that it is only remembered is false. Do not replace one unsupported complete itinerary with another. | 1 | [source 1](https://hyperioncantos.fandom.com/wiki/Hyperion_Plot_Summary); [source 2](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| L7 | `public/atlas/packs/hyperion.js` | madhya.blurb:69 | (L) Not an error — events corroborated, gate separately | Optional clearer text: “Lamia and Johnny investigate here.” Later: “FORCE uses a concealed farcaster here during the war.” Later: “Catholic loyalists establish a rival Vatican here.” The wiki cites Hyperion ch. 5, Fall chs. 15/35/44, Rise ch. 33. These are references reported by the wiki, not book pages independently read. | 1 / 2 / 4 respectively | [source 1](https://hyperioncantos.fandom.com/wiki/Madhya) |
| L8 | `public/atlas/packs/hyperion.js` | spoilers:543; oldearth:329–334; Hoyt:442; Johnny:451; Moneta:453 (also Rachel:447) | (C) Error confirmed — source-level spoiler leaks | Use cumulative gating AND safe base fields. Old Earth blurb/short: “Humanity’s lost birthplace, believed destroyed in the Big Mistake.” Hoyt role: “Priest, pilgrim”; desc: “A priest returning to Hyperion with the story of Paul Duré.” Johnny: “A Keats cybrid who hires Brawne Lamia.” Moneta: “A mysterious woman connected to Kassad and the Shrike.” Rachel: “Sol’s daughter, afflicted by reverse aging.” Remove late details from base roles, short text, facts and coordinates too; see implementation notes below. | base 1; identity reveal 2; Earth location 3, return 4; Hoyt’s Pax role 3; named Aenea parentage 3 conservatively | [source 1](https://github.com/mckayec/universe-sandbox/blob/main/public/atlas/packs/hyperion.js); [source 2](https://en.wikipedia.org/wiki/Endymion_(Simmons_novel)) |
| L9 | `public/atlas/packs/hyperion.js` | garden.blurb:76 | (U) Can't verify — cut poem attribution only | “A forest world whose native centaurs were exterminated during human expansion.” Garden and its centaurs are supported; the Silenus poem attribution is not established. The Death of the Centaur is also the title of a Simmons story, which is not evidence of an in-universe poem. | retain current gate; no earlier reveal inferred | [source 1](https://en.wikipedia.org/wiki/Hyperion_Cantos); [source 2](https://www.washingtonpost.com/archive/entertainment/books/1990/02/25/after-the-big-mistake/a0029807-c2cb-4f01-8fe5-9c333b4962c8/) |
| L10 | `public/atlas/packs/hyperion.js` | Dating concept:493 | (C) Error confirmed — inconsistent arithmetic; absolute chronology unresolved | “Endymion begins 274 years after the Fall of the WorldWeb; The Rise of Endymion continues that story.” 2850 + 274 is 3124, not 3126. Publisher supports the interval; avoid selecting a disputed absolute calendar. | 3 (or bibliographic About text) | [source 1](https://www.penguinrandomhouse.com/books/167466/endymion-by-dan-simmons/) |
| L11 | `public/atlas/packs/expanse.js` | b7e:614; jupiter.eras[7]:298; s7:770 | (L) Error confirmed — secondary location support | b7e: “At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest.” Remove the Jupiter battle sentence and Jupiter battle pin/route endpoints. Use a separately labelled, schematic Belt battle marker, not Pallas as a substitute. Keep the later surrender distinct. | 7 | [source 1](https://expanse.fandom.com/wiki/Guard_of_Passage); [source 2](https://www.supersummary.com/persepolis-rising/summary/) |
| L12 | `public/atlas/packs/expanse.js` | tycho.eras[7]:268; pallas.aka:285; b7f:615 | (L) Error confirmed — destruction, not existence, is wrong | Tycho era: “Tycho withdraws from the Pallas–Tycho complex before the Tempest destroys Pallas.” b7f title: “Pallas destroyed”; text: “After Tycho’s section withdraws, the Tempest destroys Pallas Station.” Retain the historical Pallas–Tycho association. The wiki cites Persepolis Rising ch. 31 (Drummer). | 7 | [source 1](https://expanse.fandom.com/wiki/Tempest_elimination_of_Pallas); [source 2](https://expanse.fandom.com/wiki/Transport_Union) |
| L13 | `public/atlas/packs/expanse.js` | ilus.blurb:421 | (L) Not an error — secondary corroboration | Retain the thirteen moons in a shared orbit. The absence of this detail in a plot summary is not counterevidence. | 4 | [source 1](https://expanse.fandom.com/wiki/Ilus_IV) |
| L14 | `public/atlas/packs/expanse.js` | r1:749; b1c:551 | (L) Error confirmed — misplaced pin and omitted return | r1.path: ["saturn", "tycho", "eros", "tycho", "thoth", "tycho", "eros", "venus"]. This remains a simplified route. For the Tycho-pinned event use title “The Rocinante reaches Tycho” and text “After escaping the destruction of the Donnager, Holden’s crew reaches Fred Johnson’s station.” Alternatively split off a Donnager event with an explicitly unknown deep-space location. | 1 | [source 1](https://www.supersummary.com/leviathan-wakes/chapters-34-44-summary/); [source 2](https://www.supersummary.com/leviathan-wakes/summary/) |
| L15 | `public/atlas/packs/expanse.js` | nieuwestad:508–509; b9 events and r9b | (L) Not an error — do not change to Nieuwestadt | Retain “Nieuwestad”. The book-focused wiki uses this spelling and cites Leviathan Falls ch. 6 (Naomi); a Wikipedia spelling alone is not sufficient to override it. | 9 | [source 1](https://expanse.fandom.com/wiki/Nieuwestad) |
| L16 | `public/atlas/packs/dune.js` | kaitain.star:314; est:true | (C) Not an error — already identified as conjecture | Retain only as an explicitly estimated fan placement. Optional clearer star.name: “Unknown in the novels; Alpha Piscium is a fan placement”. Do not present the astronomical coordinates as a canonical identification. | 1 | [source 1](https://github.com/mckayec/universe-sandbox/blob/main/public/atlas/packs/dune.js) |
| L17 | `public/atlas/packs/dune.js` | wallach.eras[6]:350; naraj:440 | (L) Not an error — uncertainty already qualified; Naraj supported | Retain Naraj/Farok’s son/stone-burner connection. USGS/IAU’s Naraj entry explicitly cites Dune Messiah; the detailed wiki cites ch. 4. Wallach’s reported conquest/destruction is also supported by the Dune wiki. Optional conservative era text: “Wallach falls to the Honored Matres.” Do not upgrade a reported uncertain fate into certain annihilation. | Naraj 2; Wallach fate 6 | [source 1](https://planetarynames.wr.usgs.gov/Feature/15547); [source 2](https://dune.fandom.com/wiki/Naraj); [source 3](https://dune.fandom.com/wiki/Wallach_IX) |
| L18 | `public/atlas/packs/foundation.js` | smyrno.blurb:214 | (L) Not an error — corroborated | Retain underground habitation; more than one world can have it. The book-universe reference also links it to Smyrno’s hot, dry conditions. | 1 | [source 1](https://asimov.fandom.com/wiki/Smyrno); [source 2](https://en.wikipedia.org/wiki/Foundation_universe) |
| L19 | `public/atlas/packs/foundation.js` | loris.blurb:264; wye.desc:165 | (U) Can't verify — wine identity; soften pole wording | Loris: “A Foundation world reached by Bel Riose’s campaign.” Remove the wine clause: Locris is a wine source, but identification with Loris is not secure. In Wye replace “at the south pole” with “near the south pole”; retain the rest. This is not evidence that Wye itself is invented. | Loris 2; Wye 6 | [source 1](https://asimovonline.com/oldsite/trantorian_empire.html); [source 2](https://asimov.fandom.com/wiki/Wye_Sector); [source 3](https://www.bookrags.com/studyguide-prelude-to-foundation/chapanal016.html) |
| L20 | `public/atlas/packs/cosmere.js` | gas-giant generator status:338 and Order:342 | (C) Error confirmed — off-by-one | Replace both i + 5 expressions with i + 4. The asteroid belt is not an extra planet. Jes through Ishi should be positions 4 through 13. | 7 (existing generated-body gate) | [source 1](https://coppermind.net/wiki/Rosharan_System) |
| L21 | `public/atlas/packs/cosmere.js` | e12:703; alleged duplicate in Scadrial era | (C) Error confirmed — author corroboration | e12: “Sazed takes up both Shards and restores the world, clearing the ash.” Sanderson explicitly says Harmony still sends mists. The inspected Scadrial era text says no ash, not no mists: do not ‘correct’ that unaffected field. | 2; explanation about continuing Harmony mists belongs at 6 | [source 1](https://www.brandonsanderson.com/blogs/blog/annotation-the-alloy-of-law-chapter-seventeen) |
| L22 | `public/atlas/packs/cosmere.js` | e59:760; roshar.eras[12]:313 | (L) Error confirmed — name; proposed storm exemption expansion rejected | e59 title: “Stormfall”. Text: “Retribution’s ascension ends the old storms and leaves Roshar isolated in slowed time.” Replace the era’s disputed exemption sentence with “Azir, Urithiru and the Shattered Plains resist his rule.” Political freedom is not the same as exemption from the Everstorm; do not say all three are spared the storm. Azir’s storm clearing is itself delayed. | 12 | [source 1](https://coppermind.net/wiki/Stormfall); [source 2](https://coppermind.net/wiki/Battle_of_Azimir); [source 3](https://coppermind.net/wiki/Retribution) |
| L23 | `public/atlas/packs/cosmere.js` | e24:718 | (L) Error confirmed — secondary scene support | “At the king’s palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar.” Remove site:"narak"; bind to a warcamp palace marker if supported, otherwise leave the event at world:"roshar" with this explicit location text. | 5 (Words of Radiance) | [source 1](https://coppermind.net/wiki/Kaladin) |
| L24 | `public/atlas/packs/cosmere.js` | obrodai.blurb:649 | (L) Not an error — audit rejects a supported identification | Retain Patji. Optional precision: “Patji, an avatar of Autonomy, mentions Obrodai in a letter to Hoid.” The Letters/Patji pages and indexed author Q&A support the identification; a differently abbreviated epigraph page is not a disproof. | 8 (Oathbringer) | [source 1](https://coppermind.net/wiki/Letters); [source 2](https://coppermind.net/wiki/Patji_(being)); [source 3](https://wob.coppermind.net/adv_search/?tags=patji) |
| L25 | `public/atlas/packs/cosmere.js` | books[12]:237 | (C) Error confirmed — bundled year misleading | Display year label “2024–2026” for the existing combined label, or label it “2024 onward” if the UI requires publication certainty across editions. Isles was distributed in July 2025. Do not copy the audit’s exact Fires release dates without checking the relevant edition’s publisher listing. | bibliographic; retain 12 for spoiler gate | [source 1](https://www.brandonsanderson.com/blogs/blog/isles-of-the-emberdark-coming-soon-weekly-update); [source 2](https://www.brandonsanderson.com/blogs/blog/state-of-the-sanderson-2025) |
| L26 | `public/atlas/packs/cosmere.js` | Nomad more:803; canticle.eras[12]:625 | (L) Not an error — conservative late reveal | Optional usability change: move only the Sigzil identity sentence to gate 11: “Nomad is Sigzil, formerly of Bridge Four.” Keep Wind and Truth-specific details at 12. A late gate hides valid information but does not leak spoilers. | 11 for identity only | [source 1](https://coppermind.net/wiki/Sigzil) |
| L27 | `public/atlas/society.html` | rhea facts:743; r1:836; blurb:741 | (L) Error confirmed — secondary chronology support | Replace 681 PCE with 701 PCE in each Rhea field. Retain “about 60 million”; the Rhea reference supports that toll. Do not treat a precise fan chronology as independently read primary text. | 2 for recalled event | [source 1](https://red-rising.fandom.com/wiki/Rhea); [source 2](https://red-rising.fandom.com/wiki/Magnus_au_Grimmus) |
| L28 | `public/atlas/society.html` | rheacities.desc:829 | (L) Not an error — book passage located | Retain the scepter incident. Golden Son ch. 18, Bloodstains, is reproduced with a location reference by the quotation index; it corroborates Octavia’s account of the governor striking the Ash Lord. Phrase as an attributed recollection if desired. | 2 | [source 1](https://www.redrisingquotes.com/quotes/characters/octavia-au-lune/) |
| L29 | `public/atlas/society.html` | base blurbs:477–487; ERA:851; filter:3449 | (C) Error confirmed — spoiler control does not protect base fields | Safe base blurbs: Mercury “A scorched world of the Core.” Venus “A cloud-covered Core world.” Earth “Humanity’s homeworld, governed from Luna.” Luna “The Society’s political center and home of its Sovereign.” Phobos “An industrial moon of Mars.” Earth control: “The Society”. Add opening notice “Spoilers are shown through the selected book.” Start with Book I; require explicit selection for all six. Move later political outcomes to gates for their actual books, not blindly ERAS[3]. | base 1; end-trilogy outcomes 3; later outcomes 4–6 | [source 1](https://github.com/mckayec/universe-sandbox/blob/main/public/atlas/society.html) |
| L30 | `public/atlas/society.html` | g8:655; bleeding.desc:638 | (L) Not an error — Bellerephon supported; proposed Seraphina win rejected | Retain Cassius killing Bellerephon. Optional fuller sentence: “Cassius wins successive duels; Lysander reveals his identity before the threatened duel with Seraphina.” Do not insert a Seraphina victory merely because one synopsis phrases the sequence loosely. | 4 | [source 1](https://red-rising.fandom.com/wiki/Bellerephon_au_Raa); [source 2](https://red-rising.fandom.com/wiki/Cassius_against_House_Raa) |
| L31 | `public/atlas/society.html` | newsparta.desc:620; rome.desc:623; l3:679 | (L) Error confirmed — two locations conflated; Rome is supported | New Sparta desc: “Atalantia’s African seat, where she pressures Lysander before the summit.” Keep l3 there with text “Atalantia pressures Lysander at New Sparta, using Glirastes as leverage.” Rome desc: “Atalantia convenes the Two Hundred in Rome’s Colosseum.” Add a separate Rome event: title “The Two Hundred”; text “Lysander defies Atalantia at the summit and gathers support for attacking Mars.” Do not remove Rome in favor of New Sparta. | 6 | [source 1](https://red-rising.fandom.com/wiki/Earth); [source 2](https://www.bookseriesrecaps.com/light-bringer-summary-with-spoilers-red-rising/) |
| L32 | `public/atlas/society.html` | r3:838; Pluto blurb | (L) Not an error — search found corroboration | Retain the Pluto posting. The Howlers and Pluto pages explicitly place the group there, guarding House Krakova’s terraforming operations. ‘House Krakova of Pluto’ was not the only available evidence. | 2 | [source 1](https://red-rising.fandom.com/wiki/The_Howlers); [source 2](https://red-rising.fandom.com/wiki/Pluto) |
| L33 | `public/atlas/solar.html` | neso.blurb:831 | (C) Error confirmed — unqualified superlative unsafe | Replace the opening superlative with “One of Neptune’s most distant known moons.” NASA uses a qualified description. Avoid substituting a permanent new winner: ranking depends on the orbital measure and discovery date. | n/a | [source 1](https://science.nasa.gov/neptune/moons/neso/) |
| L34 | `public/atlas/solar.html` | phoebe.blurb:771 | (C) Error confirmed — primary research | Replace the radial extent clause with “a faint ring extending roughly 6–16 million km from Saturn’s center”. Hamilton et al. (2015) give 100–270 Saturn radii with R_S = 60,330 km: 6.033–16.289 million km. Radius and diameter must not be mixed. | n/a | [source 1](https://authors.library.caltech.edu/records/ec0a0-tzz59) |
| L35 | `public/atlas/solar.html` | sedna facts:879 | (C) Error confirmed — perihelion mislabeled as current distance | Replace “76 AU now” with “Perihelion: about 76 AU”. Do not substitute the audit’s undated 83-AU estimate; a current distance requires an epoch-specific ephemeris. | n/a | [source 1](https://science.nasa.gov/solar-system/kuiper-belt/facts/) |
| L36 | `public/atlas/solar.html` | MOON_TOTALS.jupiter:893; jupiter facts:654 | (C) Not an error — NASA currently supports 115 | Retain 115. Optional date label: “115 recognized (checked 2026-10-25)”. NASA explicitly gives 115 IAU-recognized moons; an older 101-moon announcement is not a current correction. | n/a | [source 1](https://science.nasa.gov/jupiter/jupiter-moons/) |

## New findings

| ID | File | Object / line | Verdict and confidence | Exact replacement or disposition | Spoiler book (`first`) | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| N1 | `public/atlas/packs/foundation.js` | intro:99 | (L) Error confirmed — the Empire's age is not the elapsed time since human expansion | Replace the first sentence with: “In the distant future, the Galactic Empire rules twenty-five million worlds from Trantor, a planet covered by a single city.” Keep the remainder. | 1 | [source 1](https://www.europeanperspectives.org/storage/74/07-International-Scientific-Journal-on-European-Perspectives-Maj-2019-internet-Milan-Jazbec.pdf) |
| N2 | `public/atlas/packs/cosmere.js` | books[8]:233; same bundled-year pattern in books[2] and books[6] | (C) Error confirmed — Dawnshard was published in 2020 | For the combined Oathbringer & Dawnshard entry, replace displayed year 2017 with “2017–2020”. Apply the same display convention to bundled books[2]: “2006–2008”, and books[6]: “2011–2016”. Keep the numeric spoiler keys unchanged. These are display ranges, not new release dates. | bibliographic | [source 1](https://www.brandonsanderson.com/blogs/blog/dawnshard-is-out); [source 2](https://en.wikipedia.org/wiki/Cosmere) |
| N3 | `public/atlas/packs/cosmere.js` | h-nomad:913; path ["canticle", "komashi"] | (U) Can't verify — cut unsupported worldhopping destination | Delete the h-nomad link. Do not replace Komashi with a definite UTol destination: the UTol reference itself treats the identification as likely. Hoid's appearance is not evidence that Nomad traveled to Komashi. | 11 | [source 1](https://coppermind.net/wiki/UTol); [source 2](https://coppermind.net/wiki/Hoid?mobileaction=toggle_view_desktop) |
| N4 | `public/atlas/solar.html` | mars.blurb:617 | (C) Error confirmed — unsupported deepest-canyon superlative | Replace the first sentence with: “A cold desert world with enormous volcanoes and the vast Valles Marineris canyon system.” Keep the remainder. NASA describes enormous canyons on Miranda too; do not infer a new definitive depth ranking from differently measured features. | n/a | [source 1](https://science.nasa.gov/mars/facts/); [source 2](https://science.nasa.gov/uranus/moons/miranda/) |

## Spoiler and implementation notes

- L8: cumulative event filtering alone cannot hide unconditional character descriptions, roles, aliases, coordinates, or world facts. Apply the safe base replacements to every rendered surface, then put later revelations into book-gated entries. Old Earth's actual location must not remain inferable from a book-1 map position. If the engine cannot gate its position, omit the early marker and retain only the safe codex description.
- L8: Moneta/Rachel identity belongs at book 2; the relocated Earth is disclosed at book 3 and the return occurs in book 4. Use book 3 for the named Aenea parentage and Hoyt's Pax role. The named-parentage gate is conservative, not a certified earliest-chapter finding; the pregnancy and significance of the unborn child are already present earlier. Do not move the later named revelation into a book-1 role string.
- L29: use explicit book gates for each political outcome. A single book-3 bucket is wrong for later-sextet developments. The initial selected book and all-books option must make spoiler exposure clear. These are recommendations, not browser-tested fixes.
- L1/L2/L9/L19/N3: a cut removes the unsupported assertion, not necessarily the entire object. Do not restore the removed specificity from the original AI audit. L2's conflicting attribution remains unresolved.
- L14: the route is intentionally schematic; the secondary chapter account includes the Anubis detour between Eros and Tycho. The proposed sequence fixes the named major stops, not every transit. Label it a simplified route.
- Star positions marked estimated are not canon identifications. Keep that distinction visible (L4/L16). Do not add fabricated coordinates for uncertain event sites.
- No source-code, build, or browser tests were run for this documentation-only handoff.

## Second-pass check ledger

These are 120 **atomic assertions**, not 120 whole entries certified. Titles, roles and individual measurements are counted separately and their exact scope is stated. Every series has 15 checks. An unflagged result only supports the named claim; it does not approve all text, dates, routes or spoiler gates in the containing object. There are four newly flagged checks, listed above.

### sun-eater — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | BOOKS[1]:10 | Empire of Silence: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 2 | BOOKS[2]:10 | Howling Dark: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 3 | BOOKS[3]:10 | Demon in White: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 4 | BOOKS[4]:10 | Kingdoms of Death: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 5 | BOOKS[5]:10 | Ashes of Man: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 6 | BOOKS[6]:10 | Disquiet Gods: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 7 | BOOKS[7]:10 | Shadows Upon Time: title and series position | (C) Supported — publisher | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 8 | delos:20–22 | Hadrian’s home world | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 9 | earth:34–37 | Chantry-protected forbidden Earth | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 10 | avalon:45–47 | Birthplace of the Empire | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 11 | forum:52–55 | Gas-giant capital with floating cities | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 12 | colchis:91–97 | Colchis orbits Atlas | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 13 | caritas:85–87 | New Vatican / Museum Catholic center | (L) Corroborated — secondary | [SW](https://www.suneater.wiki/books/helpful-links/page/index-of-worlds) |
| 14 | INTRO:13 | Hadrian’s retrospective memoir (excluding L3 date) | (C) Supported — publisher premise | [SE](https://www.penguinrandomhouse.com/series/SE1/sun-eater/) |
| 15 | r1:417 | Delos → Emesh, simplified first-book journey | (L) Corroborated — secondary; not every stop | [SC](https://www.suneater.wiki/books/novels/page/empire-of-silence-chapter-summaries) |

### hyperion — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | BOOKS[1]:9 | Hyperion: title and order | (C) Supported — publisher | [HP](https://www.penguinrandomhouse.com/series/HYC/hyperion-cantos/) |
| 2 | BOOKS[2]:9 | The Fall of Hyperion: title and order | (C) Supported — publisher | [HP](https://www.penguinrandomhouse.com/series/HYC/hyperion-cantos/) |
| 3 | BOOKS[3]:9 | Endymion: title and order | (C) Supported — publisher | [HP](https://www.penguinrandomhouse.com/series/HYC/hyperion-cantos/) |
| 4 | BOOKS[4]:9 | The Rise of Endymion: title and order | (C) Supported — publisher | [HP](https://www.penguinrandomhouse.com/series/HYC/hyperion-cantos/) |
| 5 | The Consul:441 | Diplomat/pilgrim role only | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 6 | Lenar Hoyt:442 | Priest/pilgrim role only, excluding L8 later titles | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 7 | Kassad:444 | Martian FORCE officer/pilgrim | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 8 | Silenus:445 | Poet/pilgrim | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 9 | Sol Weintraub:446 | Scholar/pilgrim; daughter reverses age | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 10 | Brawne Lamia:448 | Detective/pilgrim, excluding L8 parentage | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 11 | Het Masteen:449 | Templar and treeship captain | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 12 | hyperion:20–22 | Time Tombs move backward | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 13 | WorldWeb:478 | Farcaster-connected human worlds | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 14 | Siri and Merin Aspic:468 | Maui-Covenant relationship | (L) Corroborated — secondary | [HW](https://en.wikipedia.org/wiki/Hyperion_(Simmons_novel)) |
| 15 | tethys3:352 | Renaissance Vector → jungle → Mare Infinitus → Hebron → Sol Draconi Septem → Qom Riyadh → God’s Grove → Earth | (L) Corroborated — secondary sequence | [HE](https://en.wikipedia.org/wiki/Endymion_(Simmons_novel)) |

### expanse — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | books[1]:100 | Leviathan Wakes: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 2 | books[2]:101 | Caliban’s War: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 3 | books[3]:102 | Abaddon’s Gate: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 4 | books[4]:103 | Cibola Burn: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 5 | books[5]:104 | Nemesis Games: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 6 | books[6]:105 | Babylon’s Ashes: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 7 | books[7]:106 | Persepolis Rising: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 8 | books[8]:107 | Tiamat’s Wrath: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EP](https://www.jamessacorey.com/books/) |
| 9 | books[9]:108 | Leviathan Falls: title | (C) Supported — author/publisher catalog (last: library publisher copy) | [EF](https://www.kpl.gov/catalog/item/?i=ent%3A%2F%2FERC_215_348%2F0%2F215_348%3AOVERDRIVE%3A088fb6dc-8120-4532-9995-8cf94c6725b2) |
| 10 | intro:127 | Earth governed by the UN | (L) Corroborated — secondary | [EW](https://en.wikipedia.org/wiki/Leviathan_Wakes) |
| 11 | intro:127 | Martian Congressional Republic | (L) Corroborated — secondary | [EW](https://en.wikipedia.org/wiki/Leviathan_Wakes) |
| 12 | intro:127 | Belters supply labor/resources | (L) Corroborated — secondary | [EW](https://en.wikipedia.org/wiki/Leviathan_Wakes) |
| 13 | ceres.helix:257 | Miller’s Julie Mao investigation begins on Ceres | (L) Corroborated — secondary | [EW](https://en.wikipedia.org/wiki/Leviathan_Wakes) |
| 14 | thoth:271 | Protogen research station | (L) Corroborated — secondary | [ET](https://www.supersummary.com/leviathan-wakes/chapters-34-44-summary/) |
| 15 | r1m:750 | Miller travels Ceres → Eros | (L) Corroborated — secondary; distinct from L14 crew route | [EW](https://en.wikipedia.org/wiki/Leviathan_Wakes) |

### dune — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | books[1]:79 | Dune: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 2 | books[2]:80 | Dune Messiah: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 3 | books[3]:81 | Children of Dune: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 4 | books[4]:82 | God Emperor of Dune: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 5 | books[5]:83 | Heretics of Dune: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 6 | books[6]:84 | Chapterhouse: Dune: title/order | (C) Supported — publisher | [DP](https://www.penguinrandomhouse.com/series/AU8/dune/) |
| 7 | intro:106 | Arrakis supplies spice in the first novel | (L) Corroborated — secondary; scope is opening era | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 8 | caladan:258–261 | Ocean homeworld of House Atreides | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 9 | Paul Atreides:638 | Jessica trains Paul in Bene Gesserit disciplines | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 10 | Lady Jessica:640 | Bene Gesserit and Paul’s mother | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 11 | Duke Leto:642 | Sent to rule Arrakis despite the trap | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 12 | Shaddam IV:659 | Corrino emperor supports attack on Atreides | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 13 | Thufir Hawat:649 | Atreides Mentat | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 14 | Duncan Idaho:651 | Dies protecting Paul and Jessica | (L) Corroborated — secondary | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |
| 15 | r1:741 | Caladan → Arrakis | (L) Corroborated — secondary journey | [DW](https://en.wikipedia.org/wiki/Dune_(novel)) |

### foundation — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | books[1]:76 | Foundation: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 2 | books[2]:77 | Foundation and Empire: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 3 | books[3]:78 | Second Foundation: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 4 | books[4]:79 | Foundation’s Edge: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 5 | books[5]:80 | Foundation and Earth: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 6 | books[6]:81 | Prelude to Foundation: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 7 | books[7]:82 | Forward the Foundation: title/publication sequence | (C) Supported — publisher; prequels last is intentional | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 8 | intro:99 | 12,000 years since human expansion | (see finding) New finding N1 — wrong clock | [FN](https://www.europeanperspectives.org/storage/74/07-International-Scientific-Journal-on-European-Perspectives-Maj-2019-internet-Milan-Jazbec.pdf) |
| 9 | trantor:123–127 | Forty-billion population | (C) Supported — publisher’s Prelude description | [FP](https://www.penguinrandomhouse.com/series/FOU/foundation/) |
| 10 | terminus:179–183 | Mineral-poor Foundation world | (L) Corroborated — secondary | [FW](https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)) |
| 11 | anacreon:200 | Strongest of Four Kingdoms | (L) Corroborated — secondary | [FW](https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)) |
| 12 | askone.grandmaster:234 | Ponyets bargains for Gorov | (L) Corroborated — secondary | [FW](https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)) |
| 13 | Salvor Hardin:529 | First mayor of Terminus | (L) Corroborated — secondary | [FW](https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)) |
| 14 | Gaal Dornick:527 | Mathematician from Synnax | (L) Corroborated — secondary | [FW](https://en.wikipedia.org/wiki/Foundation_(Asimov_novel)) |
| 15 | j5:649 | Gaia → Comporellon → Aurora → Solaria → Melpomenia → Alpha → Earth → Moon | (L) Corroborated — secondary sequence | [FE](https://en.wikipedia.org/wiki/Foundation_and_Earth) |

### cosmere — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | books[1]:226 | Elantris label | (C) Supported — author catalog | [CP](https://www.brandonsanderson.com/pages/books-and-art) |
| 2 | books[2]:227 | Mistborn original-trilogy grouping (not year range) | (C) Supported — author catalog | [CP](https://www.brandonsanderson.com/pages/books-and-art) |
| 3 | books[3]:228 | Warbreaker label | (C) Supported — author catalog | [CP](https://www.brandonsanderson.com/pages/books-and-art) |
| 4 | books[4]:229 | The Way of Kings label/year | (L) Corroborated — bibliography | [CW](https://en.wikipedia.org/wiki/Cosmere) |
| 5 | books[5]:230 | Words of Radiance label/year | (L) Corroborated — bibliography | [CW](https://en.wikipedia.org/wiki/Cosmere) |
| 6 | books[9]:234 | Rhythm of War label/year | (L) Corroborated — bibliography | [CW](https://en.wikipedia.org/wiki/Cosmere) |
| 7 | books[10]:235 | The Lost Metal label/year | (L) Corroborated — bibliography | [CW](https://en.wikipedia.org/wiki/Cosmere) |
| 8 | books[8]:233 | Oathbringer & Dawnshard assigned 2017 | (see finding) New finding N2 — bundled years | [CD](https://www.brandonsanderson.com/blogs/blog/dawnshard-is-out) |
| 9 | sel:405 | Elantris setting is Sel | (L) Corroborated — secondary | [CW](https://en.wikipedia.org/wiki/Cosmere) |
| 10 | nalthis:461 | Endowment’s world | (L) Corroborated — secondary | [CN](https://coppermind.net/wiki/Nalthian_system) |
| 11 | taldain:530 | Autonomy’s tidally locked world | (L) Corroborated — secondary | [CT](https://coppermind.net/wiki/Taldain) |
| 12 | lumar:573–580 | Twelve spore-producing moons | (L) Corroborated — secondary | [CL](https://coppermind.net/wiki/Lumar) |
| 13 | roshar.moons:317 | Salas, Nomon and Mishim | (L) Corroborated — secondary | [CR](https://coppermind.net/wiki/Rosharan_System) |
| 14 | intro:260 | Separate worlds share one cosmology | (C) Supported — author catalog organization; no blanket approval of all intro lore | [CP](https://www.brandonsanderson.com/pages/books-and-art) |
| 15 | h-nomad:913 | Worldhopping route Canticle → Komashi | (U) New finding N3 — unsupported destination; cut | [CU](https://coppermind.net/wiki/UTol) |

### society — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | BOOKS[1]:471 | Red Rising: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 2 | BOOKS[2]:471 | Golden Son: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 3 | BOOKS[3]:471 | Morning Star: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 4 | BOOKS[4]:471 | Iron Gold: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 5 | BOOKS[5]:471 | Dark Age: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 6 | BOOKS[6]:471 | Light Bringer: title/order | (C) Supported — author series page | [RP](https://www.piercebrown.com/redrisingsaga) |
| 7 | mars.blurb:485 | Darrow’s Reds work underground | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 8 | mars.blurb:485 | Their terraforming-pioneer story is a lie | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 9 | e1:522 | Darrow’s wife is executed | (C) Supported — author premise; method/details not included in check | [RP](https://www.piercebrown.com/redrisingsaga) |
| 10 | e2:523 | Darrow infiltrates the Gold caste | (C) Supported — author synopsis; surgery details not included | [RP](https://www.piercebrown.com/redrisingsaga) |
| 11 | g1:648 | Iron Gold starts a decade after the revolution | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 12 | mars.eras[4]:574 | Lyria is a displaced Red refugee | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 13 | mercury.eras[5]:564 | Darrow’s Dark Age war on Mercury | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 14 | luna.eras[4]:571 | Virginia/Mustang is Republic Sovereign | (C) Supported — author synopsis | [RP](https://www.piercebrown.com/redrisingsaga) |
| 15 | l4/l5 and europa.athena:680–681/640 | Darrow’s book-VI journey includes Venus, Quicksilver’s asteroid, then Europa (not necessarily adjacent stops) | (L) Corroborated — secondary | [RR](https://www.bookseriesrecaps.com/light-bringer-summary-with-spoilers-red-rising/) |

### solar — 15 checks

| # | Object / line | Assertion checked | Result / evidence | Source |
| --- | --- | --- | --- | --- |
| 1 | mars.facts:616 | Year: 687 Earth days | (C) Supported — NASA | [NM](https://science.nasa.gov/mars/facts/) |
| 2 | mars.facts:616 | Average solar distance: 228 million km | (C) Supported — NASA | [NM](https://science.nasa.gov/mars/facts/) |
| 3 | mars.facts:616 | Two moons | (C) Supported — NASA | [NM](https://science.nasa.gov/mars/facts/) |
| 4 | mars.blurb/Olympus Mons:617–619 | Largest volcano | (C) Supported — NASA; altitude datum not checked | [NM](https://science.nasa.gov/mars/facts/) |
| 5 | mars.blurb:617 | Deepest canyon in Solar System | (see finding) New finding N4 — unsafe superlative | [NN](https://science.nasa.gov/uranus/moons/miranda/) |
| 6 | mars.blurb:617 | Ancient rivers and lakes | (C) Supported — NASA | [NM](https://science.nasa.gov/mars/facts/) |
| 7 | jupiter.blurb:655 | Largest planet | (C) Supported — NASA | [NJ](https://science.nasa.gov/jupiter/jupiter-facts/) |
| 8 | jupiter.blurb:655 | Over twice other planets’ combined mass | (C) Supported — NASA | [NJ](https://science.nasa.gov/jupiter/jupiter-facts/) |
| 9 | jupiter.facts:654 | Average solar distance: 778 million km | (C) Supported — NASA | [NJ](https://science.nasa.gov/jupiter/jupiter-facts/) |
| 10 | jupiter.facts:654 | Year: approximately 11.9 Earth years | (C) Supported — NASA (4,333 days) | [NJ](https://science.nasa.gov/jupiter/jupiter-facts/) |
| 11 | jupiter.facts:654 | Day: approximately 9 h 56 min | (C) Supported — NASA rounded 9.9 hours | [NJ](https://science.nasa.gov/jupiter/jupiter-facts/) |
| 12 | io.blurb:670 | Most volcanically active world | (C) Supported — NASA | [NI](https://science.nasa.gov/jupiter/jupiter-moons/io/) |
| 13 | ganymede.facts/blurb:689–690 | Own intrinsic magnetic field | (C) Supported — NASA | [NG](https://science.nasa.gov/jupiter/jupiter-moons/ganymede/) |
| 14 | ceres.blurb:635 | Largest asteroid-belt object | (C) Supported — NASA | [NC](https://science.nasa.gov/dwarf-planets/ceres/facts/) |
| 15 | ceres.facts:634 | Year: approximately 4.6 Earth years | (C) Supported — NASA | [NC](https://science.nasa.gov/dwarf-planets/ceres/facts/) |

## Handoff

Implement only the source-supported corrections and conservative cuts, preserving the “not an error” findings. Keep disputed specifics out of the atlas until a book passage resolves them. This report is ready for Claude's implementation review; full primary-book verification and final canon sign-off remain outstanding.
