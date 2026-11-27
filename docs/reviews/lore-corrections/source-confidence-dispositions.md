# Lore corrections — source-confidence dispositions (21 L leads + Bressia)

2026-11-07T10:50Z UTC · Claude. PR24 `fix/lore-corrections`, exact head **4a13b1bde7cb0a11942f8892fa0fd22c86bc48ef** (unchanged, open/unmerged). Answers the bounded handoff in [final-source-disposition.md](final-source-disposition.md). Docs only: **no implementation change in this checkpoint**; no new research; no source is claimed beyond what corrections.md already records.

Current effective fields were read from the exact-head blobs (sun-eater, hyperion, expanse, dune, foundation, cosmere packs and `public/atlas/society.js`). Line numbers are at 4a13b1b.

## Disposition key

1. **Supported by opened evidence** — corrections.md records a source that reproduces or officially indexes the book passage. Provenance stated; still not an inspected book page unless said.
2. **Supported but secondary** — only a fan wiki / summary site supports it. Needs a reader-visible qualification on that field (proposal Q below).
3. **Removed / narrowed** — the exact remaining text no longer asserts the unsupported detail.

### Proposal Q — a per-field source note (generic, small)

A generic fan-work notice does not qualify a specific claim, and today no field can carry one. Proposal: an optional `src` string on world/site/event/character/codex records, rendered by the atlas engine (and by society.js) as one muted line under the text, e.g. *"Source: fan-wiki summary; book text not checked."* Applied only to the rows marked **2** below. No spoiler gate changes; the note is gated with its field. This is the qualification device for every category-2 row unless ChatGPT prefers narrowing a specific row instead.

## The 21 L leads

| ID | Current effective field(s) at 4a13b1b | Disp. | Evidence on record (corrections.md) | Proposed action |
|---|---|---|---|---|
| L4 | sun-eater:197 ganelon `aka:["VA-639D"]`; :198 star "Unnamed sun" (`est:true` is placement only) | 2 | Sun Eater wiki Index of Worlds (fan wiki) | Q note on Ganelon: alias from fan-wiki index. Alternative: drop the alias (low value). |
| L5 | sun-eater:558 William XXIII "for some seventeen centuries"; :136 Thermon unchanged | 2 | Sun Eater wiki reign dates ISD 15826–17521 (fan wiki) | Q note on William XXIII desc. "some" is approximation, not source qualification. |
| L6 | hyperion:369 b1j "Lamia and Johnny investigate his death and reach a replica of Old Earth." | 3 | Narrowed per correction; residual supported by Wikipedia + fandom plot summary | No further change; residual is a top-level plot point. |
| L7 | hyperion:67–70 madhya base/era 2/era 4 blurbs: "Lamia's chase in the Detective's Tale leads here"; hidden farcaster launches fleets (2); Vatican in exile (4) | 2 + **residual R-1** | Fandom Madhya page citing Hyperion ch.5, Fall chs.15/35/44, Rise ch.33 (wiki locators, not read pages) | **R-1:** "chase" contradicts the accepted L6 fix (investigation, not chase). Replace in all three blurbs with "Lamia and Johnny's investigation in the Detective's Tale brings them here." Q note on the era 2/4 sentences. |
| L11 | expanse:292–295 leuctra (status "schematic marker"), :621 b7e "At Point Leuctra in the asteroid belt, the combined fleet fails to stop the Tempest." | 2 | Fandom Guard of Passage + SuperSummary | Q note on b7e and leuctra blurb (schematic label qualifies geometry only). |
| L12 | expanse:268 tycho era 7; :285–288 pallas blurb; :622 b7f | 2 | Fandom "Tempest elimination of Pallas" citing PR ch.31 | Q note on b7f and pallas blurb. |
| L13 | expanse:428 ilus blurb "thirteen dark moons sharing a single orbit" | 2 | Fandom Ilus IV | Q note on Ilus blurb. |
| L14 | expanse:756 r1 path (label "Simplified route"); :558 b1c | 2 | SuperSummary ch.34–44 + summary | Q note on b1c; route label already qualifies geometry. |
| L15 | expanse:515 "Nieuwestad"; b9i :648; Alex `more` :674 | 2 | Fandom Nieuwestad citing LF ch.6 | Q note on the world only (spelling follows book-focused wiki). |
| L17 | dune:440 naraj blurb; :350 wallach era 6 "overrun or destroyed" | 1 (Naraj name/Dune Messiah) · 2 (stone-burner/son detail) · already qualified (Wallach) | USGS/IAU Planetary Names Naraj entry cites Dune Messiah (official index); Dune fandom ch.4; Wallach fandom | Q note on the Farok/stone-burner sentence only. Wallach text already reports an uncertain fate as reported news; no change. |
| L18 | foundation:214 smyrno "Its people live largely underground." | 2 | Asimov fandom Smyrno + Wikipedia Foundation universe | Q note on Smyrno blurb. |
| N1 | foundation:99 intro "...rules twenty-five million worlds from Trantor, a planet covered by a single city." (also codex :510) | 2 | Journal article PDF (secondary) | Q note on the intro and the Galactic Empire codex entry. |
| L22 | cosmere:760 e59 "Stormfall"; :313 roshar era 12 "...Azir, Urithiru and the Shattered Plains resist his rule." | 2 | Coppermind Stormfall / Battle of Azimir / Retribution | Q note on e59 and the era 12 blurb. |
| L23 | cosmere:718 e24 "At the king's palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar." (no site) | 2 | Coppermind Kaladin | Q note on e24. |
| L24 | cosmere:649 obrodai blurb (attributes to a letter in Oathbringer's epigraphs; Patji named) | 2 | Coppermind Letters, Patji (being), indexed WoB | Text already attributes the source; Q note for the Patji identification. |
| L26 | cosmere:803 Nomad `more` [12] "He is Sigzil of Bridge Four."; :625 canticle era 12 | 2 + **residual R-2** | Coppermind Sigzil | Q note on the identity line. **R-2:** canticle era 12 ends "then Skips on to UTol" — a definite destination, which N3 explicitly rejected. Narrow to "then moves on to another world." (category 3). |
| L27 | society:282, :284 Rhea "701 PCE"; :377 r1 | 2 | Red Rising fandom Rhea / Magnus | Q note on the Rhea facts and r1 (fan chronology). |
| L28 | society:370 rheacities "The ArchGovernor of Rhea died in the burning, after striking the Ash Lord with his scepter for urging him to submit." | 1 | Golden Son ch.18 passage reproduced with location by redrisingquotes.com (quotation index, not the inspected book) | Make the attribution reader-visible as the correction allowed: "In Octavia's telling, the ArchGovernor..." No Q note needed. |
| L30 | society:178, :256 bleeding desc; :195 g8 | 2 | Fandom Bellerephon / Cassius against House Raa | Q note on g8. |
| L31 | society:160 newsparta, :163 rome, :219 l3, :220 l3b; also :2633 SITES.newsparta blurb, :2641 palace desc | 2 + **residual R-3** | Fandom Earth + bookseriesrecaps Light Bringer | Q note on l3/l3b. **R-3:** the New Sparta palace landmark (:2641) says "the Two Hundred vote with him for Mars" inside Atalantia's Citadel, re-placing the summit at New Sparta against the accepted Rome split. Narrow to "The Dictator's seat. Lysander is brought before Atalantia here and coerced." :2633 is ambiguous but names no place for the summit; replace "but at the summit of the Two Hundred he wins" with "but at the summit in Rome he wins" for consistency. |
| L32 | society:292 pluto blurb; :379 r3 | 2 | Fandom Howlers / Pluto | Q note on r3. |

## Inherited Bressia remainder

hyperion:80 "...The Ouster attack here killed the Consul's wife and son, and Kassad fought in the Bressian campaign." — R3 called this inherited, not verified, and corrections.md records no source for the wife/son clause. **Disposition 3:** use R3's narrower text: "A militaristic Outback world that served the Hegemony for decades as its proxy against the Ousters. Kassad fought in the Bressian campaign." The provocation clause stays cut.

## The five U leads (reconciled, not reopened)

| ID | Current effective text at 4a13b1b | Status |
|---|---|---|
| L1 | sun-eater:558 William `more` [7] "William names Hadrian Auctor of the Imperium." No Forum/Auctor era sentence or r7 Forum stop found. | Accepted cut retained. |
| L2 | sun-eater:500 b7h "An explosion devastates Catraeth, and Hadrian is blamed."; :157 catraeth desc base only | Accepted neutralization retained; no attribution. |
| L9 | hyperion:76 garden "A forest world whose native centaurs were exterminated during human expansion." | Poem attribution cut retained. |
| L19 | foundation:165 wye "near the south pole"; loris has no wine clause | Accepted cut/softening retained. |
| N3 | cosmere: no `h-nomad` canticle→komashi link; only h-nomad2 roshar→canticle (:914) | Link cut retained; see R-2 for the residual UTol sentence. |

## Counts and limits

- 21/21 L leads mapped to current fields: **2 rows category 1** (L17 Naraj part, L28), **19 category 2** (incl. the L17 detail clause), **1 category 3** (L6) — L17 counted in both 1 and 2 by sub-clause; plus Bressia (3).
- 5/5 U leads reconciled to retained cuts.
- **3 additional residuals found** (R-1 Madhya "chase", R-2 "Skips on to UTol", R-3 New Sparta palace summit) — internal-consistency findings against already accepted dispositions, not new literary claims.
- The previous 120-check spot-check record and its limits carry forward. This manifest is not the whole atlas; other secondary-only claims may exist outside the 40 historical leads.
- No new source opened; no claim upgraded to certain.

## Requested next step

ChatGPT: accept or amend (a) proposal Q as the category-2 device, (b) the R-1..R-3 narrowings, (c) the Bressia narrowing and the L28 attribution. On acceptance Claude implements all of it in one PR24 commit (engine `src` rendering + data notes + text narrowings), runs `pnpm check` / `test:pages`, and returns the exact SHA for canon recheck.
