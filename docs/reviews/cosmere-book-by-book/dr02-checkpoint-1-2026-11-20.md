# DR02 — Isles of the Emberdark: checkpoint 1 of 2

Date: 2026-11-20. Owner: ChatGPT. Status: **research incomplete**, first bounded checkpoint. This is source-based web research, not the separate Deep Research product and not a full-book reading. DR01 remains deferred at its two-checkpoint cap; this later novel does not silently repair original-novella evidence gaps.

## Exact implementation and inventory

Read actual `public/atlas/packs/cosmere.js` from all three PR snapshots, not just builder reports. Recomputed the Git blob SHA for each fetched source before evaluating its data in an isolated JavaScript context. This is a static inventory check, not application or browser validation.

| PR / branch | Audited head | Pack blob |
|---|---|---|
| 24 / `fix/lore-corrections` | `cf25cda66e91c573c421a0f3712623db72737a3b` | `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` |
| 37 / `atlas/deep-worlds` | `03394c32816fcb5c95261bf6a9ea4520381a5838` | `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` |
| 48 / `feature/cosmere-reading-state` | `61e26afb4514f4b9510f33ce9f8b0b7bbe84e964` | `05170eab9f4c10f18c98a6fac51cf825e63c8a56` |

[The machine-readable inventory](dr02-inventory-2026-11-20.json) preserves the selected records and source line references. In each snapshot it selects 4/60 world records (`firstsun`, `yolen`, `dhatri`, `emberdark`), all 10/10 sites nested in those four records, 2/2 selected events (`e61`, `e62`), the Lumar key-12 era, the Cognitive Realm overview, and 1/1 `h-dusk` record containing 2/2 pairs. PR37 adds 6/6 landmarks within the selected sites. Codex matching returns 3 entries in PR24/48 and 4 in PR37: Autonomy, Dusk, Perpendicularities, plus PR37's Starling entry. These are selection denominators, not a claim that every atlas assertion relevant to DR02 has been enumerated.

No new finite correction is established by this checkpoint. Existing accepted corrections, implementation closures, and other review owners are unchanged.

## Edition and source register

All sources below were opened this run. Search snippets were discovery aids, not substitutes for reading the source. Multiple publisher/author pages are not independent canon witnesses.

| ID | Source and evidence type | Access and permissible use |
|---|---|---|
| E1 | [Reactor: published excerpt, Brandon Sanderson, February 3, 2026](https://reactormag.com/excerpts-isles-of-the-emberdark-by-brandon-sanderson/) — narrative text | Search-service opening returned HTTP 403. Normal browser navigation nevertheless exposed the full article in its accessibility tree, which was read through the excerpt copyright. An age prompt was present; no age answer or submission was made. Coverage is exactly the prologue and chapters 1, 2, and 22, not four consecutive chapters or the entire novel. |
| B1 | [Macmillan / Tor Books listing, ISBN 9781250415394](https://us.macmillan.com/books/9781250415394/islesoftheemberdark/) — bibliography and promotional synopsis | Opened. Lists February 3, 2026 and 416 pages for this edition. Synopsis supports the marketed voyage/alliance/map premise, not exact scene locations or an ending. Do not infer that this was the work's first release. |
| B2 | [Hachette listing, ISBN 9781399634526](https://adaptive.hachettelearning.com/titles/brandon-sanderson/isles-of-the-emberdark/9781399634526/) — bibliography | Opened. Separate hardcover listing dated February 3, 2026. Its text was not collated against Tor or Dragonsteel editions. |
| B3 | [Author's Cosmere standalones page](https://www.brandonsanderson.com/pages/standalones-cosmere) — promotional synopsis | Opened. Same broad premise as B1; not an independent textual witness. |
| B4 | [Author's Emberdark fulfillment update](https://www.brandonsanderson.com/blogs/blog/emberdark-fulfillment-starts-today-weekly-update) — publication commentary | Opened transcript, especially the fulfillment section. Distinguishes backer delivery from general ebook/audio availability; it is not story text or proof of word-for-word edition equivalence. |

The 2024 readings and earlier sequel drafts are not substituted for this published excerpt. A secondary search result supplied an alleged complete chapter count, but that count was not verified against a published contents page and is not used as a coverage denominator.

### Narrow narrative observations from E1

- Prologue: Starling's early transformation occurs on Yolen; the heading places it fifty-seven years earlier.
- Chapter 1: Dusk demonstrates wildlife at a heritage park amid modernization. A missing bird and his grief do not, alone, establish its fate.
- Chapter 2: a five-years-earlier voyage revisits the original opening with expanded navigation material. It is later-edition text, not proof of the original novella's wording.
- Chapter 22: Starling has been exiled and constrained to human form for twelve years. Her connection to Hoid and service aboard the Dynamic are explicit. Dhatri's perpendicularity is no longer available; the ticket discussion distinguishes physical travel from Cognitive travel. The ship's technology combines several origins. The narration distinguishes established routes from unexplored regions.

These observations support only their stated propositions. The selected text does not supply the hidden-gate discovery or climax, a complete route map, or the original novella's post-meeting narrative.

## Eight bounded claim groups

Here C means the specifically identified support was read; U means unresolved. A partly supported paragraph is not certified as a whole. Field references apply to the inventory snapshots above; PR37 line references aid navigation, not a substitute for field identity.

| Group | Actual implementation scope | Disposition and limit |
|---|---|---|
| DR02-01 | `firstsun.eras[12]`, `e61`, `patjiseye`, PR37 `pool` landmark (approximately lines 618, 1114, 1380) | **Partial C / U.** E1 chapter 1 supports the social-change context. B1 supports a portal voyage only as synopsis. Avatar identity, pool composition, worms/paste mechanics, the particular crossing, and precise event/landmark placement require additional narrative evidence. Do not certify these from a book blurb. |
| DR02-02 | `emberdark` world, `hiddengate`, `e62`, PR37 `ring`, `dakwara`, `cave`, `dynamic` landmarks (approximately lines 732–738, 1242–1249, 1380) | **Partial C / U.** B1 supplies the broad alliance/map premise; E1 chapter 22 supplies narrow Dynamic context. No selected narrative section verifies the alliance at the ring, guards, serpent, cave route, gate discovery, or outcome. Retain the event-attachment question: a hunt for a gate is not evidence that its participants were already standing at that gate. This is an evidence hold, not a demonstrated location error. |
| DR02-03 | `yolen.eras[12]`, PR37 Starling codex, Dusk `more[12]` (approximately lines 1174–1178, 1422, 1435) | **Partial C.** E1 prologue/chapter 22 support the narrow personal-history propositions above. B1 supplies the advertised alliance. Do not infer a direct Yolen-to-Emberdark itinerary, full chronology, or all later identities from these sections. PR24/48 lack the separately named Starling codex entry; that difference is inventory, not automatically a defect. |
| DR02-04 | `dhatri` and `lumar.eras[12]` (approximately lines 1141, 1226–1228) | **Partial C / U.** E1 chapter 22 supports the specific current access constraint. It does not independently certify the entire Dhatrian network, the aethers' ultimate origin, the Lumar/Firstsun distance, or all spaceship travel claims. Keep a ticket purchase distinct from a completed journey. |
| DR02-05 | `realms.cognitive.text`, `firstsun.realms.cognitive`, `emberdark` scene and its Drominad anchor (approximately line 1462 and world records) | **Partial C / U.** E1 chapter 22 is relevant to regional terminology and ship travel. The implementation also makes much broader claims about flat geometry, cosmological alignment, universal sky conditions and exact placement. Those are not validated by this excerpt. The Drominad anchor is implementation layout, not newly established astronomical geography. |
| DR02-06 | `h-dusk.pairs`, `e61/e62` ordering, Yolen and Lumar era text | **U beyond the limited headings above.** Two pairs exist: Firstsun→Emberdark and Yolen→Emberdark. They must not be summarized as two verified legs of Dusk's journey. Publication order, chapter presentation and in-world chronology remain separate. No runtime journey or ordering assertion is made. |
| DR02-07 | Firstsun baseline sites/scene, Yolen `greatstar`, `fainlife`, `shattering`, Autonomy and Perpendicularities codex | **U for this checkpoint.** Preserve DR01's original-text boundaries. This excerpt does not establish every reused baseline claim, current mainland portrayal, Great Star/Fainlife description, Shattering detail, or earliest reveal. The six PR37 landmarks are inventoried, not six confirmed landmarks. |
| DR02-08 | Book-key 7 versus 12, per-work mapping, missing-content scope | **U / continuation.** Do not label a later rewrite as original-text proof or reuse chapter 2 as an original-novella closure. No new per-work spoiler mapping is approved. A full proper-noun/entity comparison, all-journey check, ending audit and independent corroboration pass remain outstanding. Absence of an entity from this bounded inventory does not prove absence from the application. |

## Known gaps

| Gap | Impact | Blocks what? |
|---|---|---|
| Only 4/4 displayed excerpt sections read; full novel not read | Later action and resolution cannot be certified; no full atomic claim denominator | Blocks DR02 full canon approval, not preservation of the bounded observations |
| Exact gate scene and route evidence absent | `e62` attachment and four hidden-gate landmarks remain unverified in their entirety | Blocks approval of those scene/geography assertions |
| Pool mechanics, avatar claims, broad network/geography not verified in the selected text | Unsupported portions must remain visibly unresolved | Blocks claiming complete validation of the corresponding paragraphs |
| Published Tor/Dragonsteel/Gollancz wording not collated | Revisions and original-novella reuse remain separate evidence units | Blocks cross-edition equivalence and retroactive DR01 closure |
| No exhaustive inventory, proper-noun sweep or per-work gate test | Selection counts cannot become whole-atlas totals | Blocks full work approval and new spoiler/technical certification |

Coverage: 3/3 implementation snapshots read and blob-checked; 8/8 selected groups dispositioned, **0/8 groups wholly certified**; 4/4 displayed narrative sections read; **0/1 full DR02 novels read and 0/33 full-work audits approved**. No required implementation validation is reported as passed: this stage performed research and static inventory only.

## Precise continuation

DR02 remains `research / chatgpt`, checkpoint **1/2**. Next bounded unit: look for lawful published narrative access specifically addressing the Eye crossing and hidden-gate discovery/scene, then reconcile those claims and the two `h-dusk` pairs against fresh PR24/37/48 heads. Use an actual contents page if assigning a complete chapter denominator. Distinguish secondary/editorial leads from narrative proof. If usable text remains unavailable at checkpoint 2, defer DR02 with these named gaps and move to the next eligible work; do not create a third search-only checkpoint. Hand off any genuinely sourced finite correction promptly, without reopening prior closures.

No site code, PR branch, merge, deployment, full canon sign-off or release approval is included.

## Same-run access follow-up (checkpoint 1, not a second checkpoint)

Opened the [OverDrive ebook catalogue](https://www.overdrive.com/media/11831083/isles-of-the-emberdark) and its [Queens Public Library record](https://queenslibrary.overdrive.com/library/kids/media/11831083). These identify the Dragonsteel ebook, ISBN 9781938570513, with the platform release date July 10, 2025. The library page provides an authorized public [sample link](https://samples.overdrive.com/?crid=c566961e-f07a-41d6-b28d-1a5eed073235&.epub-sample.overdrive.com). Following it in the search service returned a redirect to an OverDrive reader that this tool could not access; the reader itself was not inspected in this follow-up. This is a concrete next access route, not a blanket claim that the sample is unavailable in a normal browser, and not a full-book entitlement. No borrowing, hold, sign-in or purchase occurred.

A Google Books search located Dragonsteel record `39xUEQAAQBAJ`; [opening the record](https://books.google.com/books/about/Isles_of_the_Emberdark.html?hl=en&id=39xUEQAAQBAJ&output=html_text) returned HTTP403. Its searchable term list and unverified page metadata are not narrative evidence. No additional primary passages were read. The next bounded unit should try the public library sample through normal reader interaction before repeating search-only requests; establish its actual coverage and edition internally, then address the named Eye/gate gaps if the sample reaches them. All checkpoint-1 counts and holds remain unchanged.
