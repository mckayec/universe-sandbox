# Secret History opening-preview checkpoint — Scadrial Cognitive payload

ChatGPT, 2026-11-16 UTC. **Partial primary-text research; not ready for implementation or canon certification.** Follows the accepted [MB10 implementation return](implementation-review-f793e11.md). Keep `content-review / chatgpt`; this is existing review WIP.

## Scope and evidence

Ordinary source-based web research, not the separate Deep Research product. One public preview, **part of Part One, “Empire”, chapter 1**, was opened and read. No full chapter, full novella, complete map/essay, audiobook comparison or edition collation is claimed.

**SH-P1:** [Everand book preview](https://www.everand.com/book/296874434/Mistborn-Secret-History/277146900), metadata: publisher Dragonsteel, LLC; ISBN 9781938570124; January 26, 2016. Use the **Book preview** section, not the customer reviews above it. The preview starts at Part One / Empire / 1 and cuts off mid-scene at a subscription prompt. The relevant locus is after Kelsier's death, beginning “The mists coalesced into shapes.” Metadata and the visible preview were retrieved separately from search snippets; no subscription or restricted text was accessed.

Three deliberately narrow observations are supported at high confidence **within this scene**:

| ID | Supported observation | Locator in SH-P1 |
| --- | --- | --- |
| SH-O1 | Kelsier sees mist-shaped buildings and an overturned wagon; the ground beneath him is mist with a yielding texture. | After his arrival and recognition of the square; paragraphs following the locator above |
| SH-O2 | Prison bars, doorknobs and window latches appear as bright light rather than the surrounding mist. | The wagon and nearby metal-object paragraphs |
| SH-O3 | People in the living-world crowd appear as luminous human forms from his viewpoint. | The moving-lights paragraph, followed by recognition of the fleeing crowd |

**3/3 selected scene observations supported; 0/1 complete existing Cognitive blurb certified.** These observations are not universal proofs about every living being, every material, all locations or all eras. Kelsier's subsequent inference about metal and souls is character interpretation; it is not adopted as a physical law.

**SH-M1:** [Author's Original Trilogy page](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-original-trilogy), “Book 3.5: Mistborn Secret History”, opened. Establishes collection inclusion and explicitly warns about original-trilogy and minor Bands of Mourning spoilers. This is provenance/reading guidance, not a substitute for primary scene evidence. A story occurring during MB01 does not authorize exposing its later-published revelations to MB01-only readers.

**SH-M2:** [Hachette edition page](https://www.hachette.co.uk/titles/brandon-sanderson/mistborn-secret-history/9781409184546/), opened. Publisher warning corroborates the broad spoiler boundary; the selected format is audiobook, ISBN 9781409184546. Its “Read Excerpt” link returned the same listing through the web reader, not a chapter. Do not claim this edition's text was compared.

**SH-M3:** [Macmillan edition page](https://us.macmillan.com/books/9781250430755/mistbornsecrethistory/), opened. Tor listing, ISBN 9781250430755, 2026 edition. Synopsis only; no extra geography or mechanical claim is certified from it.

## Remaining evidence gaps — finite disposition

The existing `scadrial.realms.cognitive` object remains held as a whole. This preview does **not** discharge:

- The proper name **Expanse of the Vapors**, its source/edition and earliest work boundary.
- The complete water-to-rock geography claim and boat travel across misty land. The opening ground description alone does not establish that paired rule.
- The blanket “living beings and all metal” scope across the whole world, beyond the particular observations above.
- The explicit terminology connecting this preview's location to the named Cognitive/subastral structure. Reader reviews on the same page mention the Cognitive Realm; those are not primary-text evidence and were not used to close this point.
- Exact palette values, procedural treatment, geometry, cross-world behavior, and the global realm entry's content/threshold.

The narrow disclosure witness is **Mistborn: Secret History**, registry ID `mistborn-secret-history`, Part One chapter 1. An earliest-in-the-entire-series conclusion is still unverified. No new gate or threshold is approved by this checkpoint.

## Current implementation boundary, read from exact branches

| PR | Current head re-read | Pack blob |
| --- | --- | --- |
| 24 | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 | f793e1142ec1eb550507c29e2da1b2809e17312c | a296bf9241c5f515387b24f069562ff7e286d13b |

**2/2 older-branch Cognitive payload comparisons match PR48** (name, style, colors and blurb as the exact object text). No complete-pack equality across branches is claimed.

Read PR48 `public/atlas/engine.js` blob `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0`, lines 1333–1363:

- `realmsOwn` checks the world's `realms` field gate and ancestor chain.
- `realmLook` consumes that object's style/colors; `realmCard` consumes its name/blurb.
- Neither function in this inspected path independently checks a nested `cognitive.blurb` gate. Do not insert invented nested metadata and call the blurb protected.
- A denied world-specific payload falls back to global realm content/look. The current unknown text asserts that the books have not described the world; this cannot be assumed to be a suitable “unread” explanation for a newly gated, researched payload.
- The pack's global Cognitive entry is `first:4`, while the separate Scadrial subastral label is `first:7`. A world field gate is not proof that those other surfaces share its threshold.

These are source-inspection constraints on a future proposal, **not a new CBR defect finding or a reopening of CBR-04**. No new execution matrix or browser validation was run for a candidate, because no candidate is ready.

## Access record and stopping point

The [OverDrive title record](https://mlcstl.overdrive.com/media/2576848) opened and identified Dragonsteel/ISBN 9781938570124. Its public sample link redirected to an OverDrive reader that the web tool could not access (non-retryable error); no sample-body reading is claimed through that route.

The attempted alternate Hachette ebook-page retrieval through Firecrawl **did not run**: insufficient connected-app credits. Tool-reported allowance reset: **2026-11-17T02:11:23.143Z**. No retry with altered parameters was made. Ordinary web reads remained available; this is a route-specific tool limit, not a claim that all research is blocked. The successful Everand preview is already sufficient to preserve SH-O1–03.

The [Google Books Macmillan listing](https://books.google.com/books/about/Mistborn_Secret_History.html?id=OozUDAAAQBAJ) opened (ISBN 9780765395498). The preview link exposed only front-cover navigation; the Cognitive Realm term link redirected to Google's inaccessible challenge page. No book-body witness was obtained. The listing's word cloud is not a source passage, and its 32-page metadata was not used to infer the work's length or reading completeness.

No fan review, summary, search-only excerpt or unverified full-text mirror was substituted for primary evidence. No full-text source was copied into the repository.

## Precise next unit and ownership

Next run, keep the three observations above as a saved partial result. Locate **one accessible authorized passage that explicitly identifies this location as Cognitive and/or establishes the water/land travel rule**, with edition and section; do not restart the MB01 opening or entire-chart search. If that passage remains unavailable after a bounded attempt, retain the gap and prepare a finite omission/qualification proposal instead of recertifying the current full blurb.

Before any implementation handoff, choose an explicit boundary for the name/blurb/style bundle and global fallback/label exposures. Trace a proposed gate through actual selectors and relevant rendered surfaces; do not treat a gate for `realms` as independent approval of every child. Leave the world record, ancestor rules, accepted MB05/MB10 fields, CBR closures and all other owner work unchanged. Re-read PR heads again before requesting code.

Ledger unchanged: **1/1 nested era-10 field and 3/3 era-6 fields accepted at bounded implementation scope; 4/10 earlier parent fields narrowed, 6/10 held; 0/2 whole parents promoted; 2/7 PR48 key-2 events mapped; 8/148 earlier candidate fields, 140/148 held; 0/33 full-work approvals.** The three new scene observations are evidence units, not three newly mapped fields. No code/PR-branch edit, merge, deployment or release approval.
