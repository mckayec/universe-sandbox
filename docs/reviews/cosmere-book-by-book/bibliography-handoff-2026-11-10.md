# R-A: Cosmere bibliography and conservative registry handoff

ChatGPT · 2026-11-10 UTC · run `chatgpt-20261110T172038Z-r17-8c641a`

**Builder-ready routing for 33/33 ledger units across 12/12 existing buckets; 30/33 rows have supported publication years, 2/33 have explicit year holds, and 1/33 is a qualified 2026 catalogue listing.** These are not 33 novels or completed canon audits. Full-work approvals remain **0/33**. Ordinary source-based web research was used; the separate Deep Research product was not invoked.

This answers R-A in [Claude’s inventory return](key2-inventory-return-f746229.md). [Machine-readable research payload](bibliography-2026-11-10.json) supplies `works`, three frozen named-series `presets`, and separate research qualifications. Copy only the applicable application schema fields. Do not discard the qualifications in the implementation evidence.

## Exact inputs and implementation boundary

- PR48 `feature/cosmere-reading-state`: `f74622957d0a889001598b3a4ad874181da75763`; pack blob `0ca2f3eedf23bd6b453240c3e047e8c50671e5d2`.
- PR37 `03394c32816fcb5c95261bf6a9ea4520381a5838`; pack blob `5a74e300eaf88b2d3c81fa9bc957584cd4708e33`.
- PR24 `cf25cda66e91c573c421a0f3712623db72737a3b`; pack blob `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958`.
- Read actual PR48 `public/atlas/reading.js` and PACK_FORMAT. Year metadata is optional; neither `y` nor `pub` establishes a visibility gate. IDs and bucket membership are the functional requirements. Two missing years therefore do not justify dropping those work IDs.
- This is authorization to implement the bounded bibliography/control return already requested under D08 option c, with these holds. It is **not** certification of complete first-publication metadata, all mappings, app rendering or release readiness. Preserve legacy as the initial production mode pending the real-registry return review. Do not alter fail-closed behavior.
- Re-read current main and all relevant PR heads before implementation. Add to the pack actually on main; do not transplant PR24 or PR37 wholesale into PR48. Preserve prior corrections and distinct event identities.

## Registry rows

Year means a source-supported publication year for the identified work or component, not a total publication-order key. Sources are bibliographic evidence, not proof of all plot assertions. Bucket assignments are a **conservative repository routing decision** against the existing `books[1..12]` labels and the 33-row ledger; sources establish work identity/year, not application bucket numbers.

| Ledger | Permanent work ID | Checklist title | Year | Bucket | Evidence |
|---|---|---|---:|---:|---|
| SEL01 | `elantris` | Elantris | 2005 | 1 | [S01](#s01) |
| SEL02 | `the-hope-of-elantris` | The Hope of Elantris | **Held; omit y** | 7 | [S34](#s34) |
| SEL03 | `the-emperors-soul` | The Emperor’s Soul | 2012 | 7 | [S07](#s07) |
| MB01 | `mistborn-the-final-empire` | Mistborn: The Final Empire | 2006 | 2 | [S02](#s02) |
| MB02 | `mistborn-the-well-of-ascension` | The Well of Ascension | 2007 | 2 | [S02](#s02) |
| MB03 | `mistborn-the-hero-of-ages` | The Hero of Ages | 2008 | 2 | [S02](#s02) |
| MB04 | `the-eleventh-metal` | The Eleventh Metal | 2011 | 7 | [S08](#s08), [S09](#s09), [S10](#s10) |
| MB05 | `the-alloy-of-law` | The Alloy of Law | 2011 | 6 | [S08](#s08) |
| MB06 | `shadows-of-self` | Shadows of Self | 2015 | 6 | [S13](#s13) |
| MB07 | `the-bands-of-mourning` | The Bands of Mourning | 2016 | 6 | [S13](#s13) |
| MB08 | `allomancer-jak-and-the-pits-of-eltania` | Allomancer Jak and the Pits of Eltania, Episodes 28 through 30 | 2014 | 7 | [S11](#s11), [S12](#s12), [S16](#s16) |
| MB09 | `mistborn-secret-history` | Mistborn: Secret History | 2016 | 7 | [S14](#s14), [S16](#s16), [S02](#s02) |
| MB10 | `the-lost-metal` | The Lost Metal | 2022 | 10 | [S15](#s15) |
| NA01 | `warbreaker` | Warbreaker | 2009 | 3 | [S05](#s05) |
| SA01 | `the-way-of-kings` | The Way of Kings | 2010 | 4 | [S06](#s06) |
| SA02 | `words-of-radiance` | Words of Radiance | 2014 | 5 | [S01](#s01) |
| SA03 | `edgedancer` | Edgedancer | 2016 | 7 | [S16](#s16), [S17](#s17), [S18](#s18) |
| SA04 | `oathbringer` | Oathbringer | 2017 | 8 | [S19](#s19) |
| SA05 | `dawnshard` | Dawnshard | 2020 | 8 | [S20](#s20), [S21](#s21) |
| SA06 | `rhythm-of-war` | Rhythm of War | 2020 | 9 | [S22](#s22) |
| SA07 | `wind-and-truth` | Wind and Truth | 2024 | 12 | [S23](#s23) |
| TA01 | `white-sand-volume-1` | White Sand — Volume 1 | 2016 | 7 | [S24](#s24) |
| TA02 | `white-sand-volume-2` | White Sand — Volume 2 | 2018 | 7 | [S24](#s24) |
| TA03 | `white-sand-volume-3` | White Sand — Volume 3 | 2019 | 7 | [S24](#s24) |
| TA04 | `white-sand-omnibus` | White Sand omnibus — revisions and additions | **Held; omit y** | 7 | [S24](#s24), [S25](#s25), [S26](#s26) |
| TH01 | `shadows-for-silence-in-the-forests-of-hell` | Shadows for Silence in the Forests of Hell | 2013 | 7 | [S27](#s27) |
| DR01 | `sixth-of-the-dusk` | Sixth of the Dusk | 2014 | 7 | [S28](#s28) |
| DR02 | `isles-of-the-emberdark` | Isles of the Emberdark | 2025 | 12 | [S29](#s29) |
| LU01 | `tress-of-the-emerald-sea` | Tress of the Emerald Sea | 2023 | 11 | [S30](#s30) |
| KO01 | `yumi-and-the-nightmare-painter` | Yumi and the Nightmare Painter | 2023 | 11 | [S31](#s31) |
| CA01 | `the-sunlit-man` | The Sunlit Man | 2023 | 11 | [S32](#s32) |
| AU01 | `arcanum-unbounded-system-essays-and-maps` | Arcanum Unbounded — system essays and maps | 2016 | 7 | [S16](#s16), [S17](#s17) |
| FD01 | `the-fires-of-december` | The Fires of December | 2026 (catalogue only) | 12 | [S33](#s33), [S35](#s35) |

Bucket coverage: **1:1, 2:3, 3:1, 4:1, 5:1, 6:3, 7:13, 8:2, 9:1, 10:1, 11:3, 12:3** (33 total). MB01–03 retain the IDs from the prior checkpoint. Treat the other supplied IDs as permanent once adopted; future title/year corrections must not silently rename saved-state IDs.

## Holds and edition rules

1. **SEL02 — year hold.** S34 dates composition to January 2006, not publication. Its original Amazon link returned HTTP 500 in this run. Secondary search results disagreed on 2006/2007, so neither date is certified here. Omit `y`; show “publication year unverified” if the UI needs a year label. Its identity and inclusion in the 2016 collection are supported, so retain the work in bucket 7. Next evidence: original Amazon Shorts publication record or a dated publisher/author release notice.
2. **TA04 — omnibus edition/year hold.** S25 establishes an omnibus with added material was out by 2023; S26 dates a specific hardcover ISBN to 2024. Neither proves the first worldwide/English digital publication date across formats. The campaign update attempted in this run returned no readable body. Omit `y`; do not replace it with the volume-1 year or assert a universal 2024 first release. TA04 is the ledger’s revisions/additions unit, not a fourth numbered volume. No equivalence between checking the omnibus and automatically checking TA01–03 is authorized.
3. **AU01 — component boundary.** This checkbox means the collection’s system essays and maps. It does not mark the anthology’s stories read, and none of those story checkboxes marks AU01 read. S16–17 support the component identity and 2016 year. No essay/map claim or map geometry is certified by that bibliography. White Sand in Arcanum Unbounded is an excerpt, not proof of completing the three graphic volumes or revised omnibus.
4. **MB09 — bucket 7, not bucket 2.** Secret History’s publication/collection identity is separate from the original trilogy. S02 explicitly warns of original-trilogy spoilers and a smaller Bands of Mourning spoiler. The bibliography does not settle its per-record `needs` clauses. No original-trilogy or Wax-and-Wayne preset may silently mark MB09 read.
5. **FD01 — qualified catalogue metadata / narrative hold.** S33 lists a 2026 audio edition; this run did not establish delivered full-text availability or read the completed work. The official preview S35 is only a preview. Retain ID and bucket 12; `y: 2026` is catalogue-derived, not narrative certification or proof of actual release. Never describe the work as still unpublished solely from an older projected date. Do not expand preview evidence into later plot claims. Reader selection must mean they actually read the relevant work; no preset below selects FD01.
6. **SA03/SA05 — distinguish work from later print edition.** Edgedancer’s collection appearance is 2016; standalone 2017 adds a previously published Lift prologue (S18). Dawnshard’s original ebook is 2020 (S20–21), not the later Tor print year. Detailed edition-equivalence and all story facts remain outside this packet.

These holds are real research limits. Keeping IDs in conservative fallback is safer than removing them: dropping a held work would reduce the bucket’s required set and could reveal content sooner. Conversely, requiring all 13 bucket-7 units is deliberately restrictive and may keep content hidden for someone who read only the anthology or only the omnibus. Explain this as unreviewed fallback, not an assertion that every claim occurs in every member.

## Named-series presets: three bounded sequences

These are sequence conveniences, **not a complete Cosmere publication-order or spoiler-optimal order**. No global `pub` ranks are supplied. Bibliographic years do not disambiguate same-year releases, omnibus editions or inter-series dependencies.

| Preset ID, version | Exact selected-prefix sequence | Basis |
|---|---|---|
| `mistborn-original-trilogy`, v1 | MB01 → MB02 → MB03 | S02 author series order |
| `mistborn-wax-and-wayne`, v1 | MB05 → MB06 → MB07 → MB10 | S03 author four-book order |
| `stormlight-with-novellas`, v1 | SA01 → SA02 → SA03 → SA04 → SA05 → SA06 → SA07 | S04 numbered novels; S18 Edgedancer between 2/3; S20 Dawnshard between Oathbringer/Rhythm |

Only the listed IDs belong to each sequence. Original-trilogy selection does not grant Secret History; Stormlight does not grant Warbreaker, AU essays, Isles or Fires. A seven-work Stormlight prefix still cannot satisfy all of bucket 7 or 12. That is expected until individual content gates are researched; do not weaken ancestors to make the preset seem more complete. Freeze version 1; additions require a new preset version rather than changing saved links.

## Finite builder return and verification

Claude can implement this registry with all **12/12 nonempty buckets**, the three presets, explicit unknown-year display and the above component distinctions. Leave unmapped records on **unreviewed** bucket fallback. Do not convert holds into explicit all-trilogy gates: the implementation marks an explicit gate as reviewed, which would misstate the evidence. R-B separately identifies narrow candidate copy/gates and parent holds.

Return the exact new PR head, actual changed-file list, registry/preset tests and rendered evidence for the real registry. Check counts 33/33 and 12/12, unknown-year behavior, strict frozen prefixes, independent AU/White Sand selections, all-work restoration, reload/deep-link behavior and ancestor restrictions. Preserve earlier CBR closures; a new registry is not covered by old synthetic-only rendered results. Mckay’s release approval is still required.

Reviewer validation here is a **data/schema compatibility check**, not a browser or build pass. [Validation record](bibliography-validation-2026-11-10.json): 43/43 independent data/schema expectations pass, including 14/14 exact preset prefixes and 24/24 complete/missing-one bucket evaluations using the actual PR48 helper. No application code was changed by this handoff.

## Source register

All sources below were opened on 2026-11-10. Author pages, publisher catalogues, rights-agent catalogue and an anthology editor’s announcement provide bibliography/sequence evidence. S10 is an author-authored blog syndicated on Goodreads; S14 is publisher-supplied retailer metadata. No fan summary is being used as a substitute for full text. Unreadable original Amazon/campaign pages and the failed guessed Secret History continuity URL were not used as positive evidence.

### S01

[Source](https://www.brandonsanderson.com/pages/about-brandon) — Author biography; Elantris May 2005; Words of Radiance March 2014.

### S02

[Source](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-original-trilogy) — Author series page; three titles, years 2006/2007/2008 and sequence; Secret History spoiler warning.

### S03

[Source](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-wax-wayne-series) — Author series page; four-book sequence.

### S04

[Source](https://www.brandonsanderson.com/pages/the-stormlight-archive-series) — Author series page; five numbered novels, Dawnshard placement.

### S05

[Source](https://www.brandonsanderson.com/blogs/blog/another-long-and-rambling-post-on-future-books) — Author retrospective; Warbreaker and The Gathering Storm in 2009.

### S06

[Source](https://www.brandonsanderson.com/blogs/blog/brandon-sanderson-newsletter-for-may-2013) — Author newsletter; retrospective The Way of Kings 2010 release.

### S07

[Source](https://www.brandonsanderson.com/blogs/blog/hugo-nomination-season) — Author awards post; The Emperor’s Soul, Tachyon, November 2012.

### S08

[Source](https://www.brandonsanderson.com/blogs/blog/brandon-sanderson-newsletter-for-november-2011) — Dated author newsletter; The Alloy of Law release; forthcoming RPG includes The Eleventh Metal.

### S09

[Source](https://www.brandonsanderson.com/blogs/blog/mistborn-adventure-game-out-now-updates) — Author confirms RPG ebook available; see S10 for dated author-blog syndication.

### S10

[Source](https://www.goodreads.com/author/show/38550.Brandon_Sanderson/blog?page=83) — Author-blog syndication, December 19, 2011, same RPG release post. S08–10 jointly support 2011 for The Eleventh Metal; print RPG followed later.

### S11

[Source](https://www.brandonsanderson.com/pages/the-alloy-of-law-blogs) — Author index dates the Allomancer Jak supplement post October 21, 2014.

### S12

[Source](https://www.brandonsanderson.com/blogs/blog/mistborn-adventure-game-alloy-of-law-supplement-new-allomancer-jak-story-giveaway) — Author identifies new Allomancer Jak story in already released supplement; paired with S11.

### S13

[Source](https://www.brandonsanderson.com/blogs/blog/mistborn-releases-award-nomination-season) — Author January 2016 release/award context: Bands just released, Shadows previous October / 2015 award eligibility.

### S14

[Source](https://play.google.com/store/books/details/Brandon_Sanderson_Mistborn_Secret_History?id=I6VxCwAAQBAJ) — Publisher-supplied listing, sold by Dragonsteel Entertainment; January 2016. Bibliography, not full text.

### S15

[Source](https://www.brandonsanderson.com/blogs/blog/the-lost-metal-is-out-now-weekly-update) — Author release announcement around Dragonsteel 2022.

### S16

[Source](https://us.macmillan.com/books/9780765391179/arcanumunboundedthecosmerecollection/) — Publisher; November 22, 2016; contents include Edgedancer, essays/illustrations and a White Sand excerpt.

### S17

[Source](https://www.brandonsanderson.com/blogs/blog/arcanum-unbounded-the-cosmere-collection-is-out-today) — Author launch; new Edgedancer, system essays and star charts.

### S18

[Source](https://www.brandonsanderson.com/blogs/blog/edgedancer-is-out) — Author standalone release; earlier collection version, added Lift interlude prologue, placement between Stormlight 2 and 3.

### S19

[Source](https://www.brandonsanderson.com/blogs/blog/oathbringer-is-finally-out) — Author release post; 2017 award-eligibility context.

### S20

[Source](https://www.brandonsanderson.com/blogs/blog/dawnshard-is-out) — Author ebook release; between Oathbringer and Rhythm of War.

### S21

[Source](https://www.brandonsanderson.com/pages/the-way-of-kings-blogs) — Author index dates Dawnshard release November 10, 2020.

### S22

[Source](https://us.macmillan.com/books/9780765326386/rhythmofwar/) — Publisher; November 17, 2020.

### S23

[Source](https://read.macmillan.com/torforge/the-stormlight-archive/) — Publisher launch page; Wind and Truth December 6, 2024.

### S24

[Source](https://agenceelianebenisti.com/wp-content/uploads/2025/02/JABBERWOCKY-LBF-2025-Comics-Insert.pdf) — Rights-agent catalogue, PDF page 12: White Sand volumes 1/2/3 dated 2016/2018/2019. Omnibus has updated material, but no first-edition date given.

### S25

[Source](https://www.brandonsanderson.com/blogs/blog/state-of-the-sanderson-2023) — Author/team annual report; omnibus already out with added material by 2023.

### S26

[Source](https://www.simonandschuster.com/books/Brandon-Sandersons-White-Sand-Omnibus/Brandon-Sanderson/9781524122577) — Publisher/distributor listing for hardcover ISBN 9781524122577: February 13, 2024. This edition date is not a verified first release for all omnibus formats.

### S27

[Source](https://georgerrmartin.com/dangerous-women-anthology-released/) — Anthology co-editor’s December 11, 2013 release post: Dangerous Women released December 3; contents name Shadows for Silence.

### S28

[Source](https://www.brandonsanderson.com/blogs/blog/introducing-the-writing-excuses-anthology) — Author launch announcement signed June 30, 2014; Sixth of the Dusk in Shadows Beneath.

### S29

[Source](https://words-of-radiance-leatherbound.backerkit.com/hosted_preorders/project_updates) — Team Dragonsteel project updates: July 1, 2025 digital Isles of the Emberdark files ready, later fulfillment updates. No full-text read implied.

### S30

[Source](https://us.macmillan.com/books/9781250899651/tressoftheemeraldsea/) — Publisher trade edition April 4, 2023; year routing only, not earliest backer-release date.

### S31

[Source](https://us.macmillan.com/books/9781250899699/yumiandthenightmarepainter/) — Publisher trade edition October 3, 2023; year routing only.

### S32

[Source](https://www.brandonsanderson.com/blogs/blog/lightning-signing-reveal-weekly-update) — Author Secret Project 4 available / book-club update before Dragonsteel 2023; supports Sunlit Man year 2023, not a specific first-edition day.

### S33

[Source](https://us.macmillan.com/books/9781250505897/thefiresofdecember/) — Macmillan Audio / Dragonsteel listing ISBN 9781250505897: October 6, 2026. Catalogued year only; availability/completeness of narrative not established here.

### S34

[Source](https://www.brandonsanderson.com/blogs/blog/the-hope-of-elantris) — Author-hosted story introduction says written January 2006 and originally sold on Amazon. Writing date is not publication date.

### S35

[Source](https://www.brandonsanderson.com/blogs/blog/the-fires-of-december) — Official chapter-one preview; February 2026 preview is not the completed work.

## Continuation checkpoint

R-A’s usable ID/title/bucket set is delivered; **SEL02 and TA04 first-publication years remain unresolved**, FD01 is qualified catalogue metadata, and no complete publication-order preset is certified. R-B is a separate bounded content packet; keep its holds explicit. Full-book ledger states and prior SA07 user-ebook evidence remain unchanged: **0/33 full-book approvals**. This checkpoint does not request Mckay to obtain sources or approve a release.
