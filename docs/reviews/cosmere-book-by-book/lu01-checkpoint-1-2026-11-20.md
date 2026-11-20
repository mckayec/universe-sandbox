# LU01 — Tress of the Emerald Sea: checkpoint 1 of 2

Date: 2026-11-20. Owner: ChatGPT. **Research incomplete, checkpoint 1/2.** Source-based web research only; the separate Deep Research product was not invoked. This bounded opening-text audit follows the DR02 cap deferral and does not reopen prior accepted corrections.

## Inputs and exact heads

Read the initial [33-work ledger](audit-2026-11-06.md), [bibliography](bibliography-2026-11-10.json) and prior DR02 boundary findings before this unit. LU01's registry ID is `tress-of-the-emerald-sea`, year 2023, bucket 11. No standalone LU01 checkpoint was present in the main tree inspected at intake. A GitHub text search returned no results; that search is not evidence that all prior mentions are absent.

Actual `public/atlas/packs/cosmere.js` contents were fetched this run, their data registration evaluated without the application renderer, and the selected records preserved in [lu01-inventory-2026-11-20.json](lu01-inventory-2026-11-20.json). PR heads were re-read unchanged before writing. Returned pack blob IDs match the earlier same-run snapshots; no new local Git-hash recomputation is claimed.

| PR / branch | Audited head | Pack blob |
|---|---|---|
| 24 / fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b | 3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |
| 37 / atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838 | 5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| 48 / feature/cosmere-reading-state | 61e26afb4514f4b9510f33ce9f8b0b7bbe84e964 | 05170eab9f4c10f18c98a6fac51cf825e63c8a56 |

For each snapshot, selection covers Lumar (1/60 worlds), all 9/9 of its sites, all its events (2/2 in PR24 and PR48; 3/3 in PR37), 3 selected codex records, 2 links touching Lumar and the Threnody Lilting Abyss site. PR37 adds 5/5 landmarks within those nine sites. Six moon descriptors are inventoried per snapshot. Generated map polygons are omitted from the JSON and were not validated. These are selection counts, not every Tress-related claim in the application.

## Opened source register

| ID | Source | Evidence and coverage |
|---|---|---|
| T1 | [Author sample: chapter 1](https://www.brandonsanderson.com/blogs/blog/tress-chapter-one) | Entire posted narrative read through its ending, not merely the initial search excerpt. |
| T2 | [Author sample: chapter 2](https://www.brandonsanderson.com/blogs/blog/tress-chapter-two) | Entire posted narrative read through its ending. |
| T3 | [Author sample: chapter 3](https://www.brandonsanderson.com/blogs/blog/tress-chapter-three) | Entire posted narrative read through its ending. |
| T4 | [Author sample: chapter 4](https://www.brandonsanderson.com/blogs/blog/tress-chapter-four) | Entire posted narrative read through its ending. |
| T5 | [Author sample: chapter 5](https://www.brandonsanderson.com/blogs/blog/tress-chapter-five) | Entire posted narrative read through its ending. |
| B1 | [Tor / Macmillan listing](https://us.macmillan.com/books/9781250899651/tressoftheemeraldsea/) | ISBN9781250899651, 384 pages, April4,2023 for this edition. Synopsis is promotional evidence, not proof of the ending. Supports the registry's 2023 year; no assertion this was the earliest release. |
| B2 | [Orion paperback listing](https://www.orionbooks.co.uk/titles/brandon-sanderson/tress-of-the-emerald-sea/9781399613392/) | ISBN9781399613392, April2,2024. The extracted Read Excerpt link returned the same listing, not narrative. No normal-browser test of that control in this unit. |
| V1 | [First Look at Secret Project 1](https://www.brandonsanderson.com/blogs/blog/first-look-at-secret-project-1) | Opened introductory/early text only as an earlier-version comparison. Its opening wording differs from T1, including the orbital terminology. Do not merge draft/promo wording into the later individual chapter posts or count a duplicate opening as additional chapter coverage. |
| A1 | [Author's Hoid's Travails page](https://www.brandonsanderson.com/pages/hoids-travails) | Read Tress section and followed the extracted art link. That link resolved to an image URL named Yumi_Book_Page.png, so no Tress map/art inspection is credited. |
| X1 | [Yale / OverDrive record 9533141](https://yale.overdrive.com/media/9533141) | HTTP403 in this retrieval. No sample text, edition identity or reader coverage inferred from the search result. |

The five individual author posts are the narrative witness used here. Their exact printed-edition collation is not established by the separate Tor/Orion catalogues. **5/5 posted narrative chapters read; full novel not read; total novel chapter count not verified.** Multiple pages by the same author are not independent corroborating witnesses.

## Eight bounded dispositions

C denotes support for the specifically stated textual proposition. U denotes an unresolved part. No whole paragraph inherits certification from a single supported clause.

| ID | Implementation scope | Disposition |
|---|---|---|
| LU01-01 | Lumar baseline blurb/facts and moon descriptors | **Partial C / U.** T1 describes twelve low stationary moons, their falling spores and water-triggered growth; salt/silver can neutralize spores. It supports the basic spore-sea premise. The data defines six moon descriptors, although its prose says twelve. This is a static representation discrepancy to investigate, not a rendered defect certified here: scale, motion and decorative selection require their own review. No exact orbital geometry or complete spore-type catalogue approved. |
| LU01-02 | rock.desc; PR37 mansion and home descriptions | **Text support, geometry U.** T1–T2 support the saltstone Rock, its shape, approximate lunagree distance, settlement, elevated mansion, Tress's work/cups, Charlie and family home. The selected Rock description and the mansion/home description prose are supported at that narrow level. Coordinates, architecture, sizes and scene placement remain generated interpretations, not measured canon. |
| LU01-03 | emerald, kingsport, crimson, midnight, sorceress, rosesea, sapphire, lobu descriptions | **Partial C / U.** T5 presents the Midnight Sea as the Sorceress's domain and says reaching it requires crossing the Crimson Sea in this account. It does not establish the full adjacency graph, mountain enclosure, temperatures, dragon lair, tower technology, Lobu origins or Kingsport location. T1's spore fall does not by itself verify the sea's complete height profile. Preserve Kingsport's existing uncertainty label. |
| LU01-04 | e49; PR37 docks landmark | **Partial C / U.** T3–T5 establish the departure setup, reports of Charlie's fate and Tress's rescue decision. T5 ends with her decision, before her own departure. B1's stowaway premise is synopsis only. Do not count the actual embarkation, dock attachment or subsequent voyage as newly read narrative. |
| LU01-05 | e113 (PR37), e50, lair/tower landmarks | **U.** The five chapters do not reach Xisis's bargain, Crow's fate, the Sorceress encounter, starship departure or its causal resolution. PR24/48 lack e113; that difference alone is not a demonstrated omission requiring implementation. No ending claims approved. |
| LU01-06 | Tress, Hoid and Worldhoppers codex; h-sel-lum | **Partial C / U.** T4 explicitly identifies the narrator as Hoid during a cup delivery. That narrowly supports the key11 narrator line. Tress's captaincy, the Sel–Lumar connection and starship claims remain outside these chapters. T2's Iriali account is Charlie's explanation, followed by an imaginative cup history; do not convert that story into an independently documented migration route or exact cross-book chronology. |
| LU01-07 | Lumar key12 era, distText, h-dhatri; Threnody abyss site | **U for LU01.** Retain the separate DR02/IEC22 travel-estimate issue and later-work boundary. Do not use Tress's opening to certify Dhatrian-network membership, sublight duration, or Lilting Abyss geography. No earlier DR02 hold is closed by this unit. |
| LU01-08 | edition, maps, scene/gate provenance and full coverage | **U.** Author-post/printed-edition equivalence, art/map provenance, later proper nouns, complete mechanisms and cross-book identity sources remain incomplete. Bucket11 also contains Yumi and The Sunlit Man; no automatic per-work mapping or ancestor-gate approval follows from these excerpts. No rendering, accessibility or application validation was performed. |

All **8/8 groups** have a disposition; **0/8 whole groups** are certified. Positive narrow coverage is **1/9 Lumar site-description texts** (Rock), **2/5 PR37 landmark-description texts** (mansion/home), and **1/1 selected Hoid narrator line**. Those text counts exclude coordinates, scene geometry, ancestor visibility and spoiler policy. No complete Lumar world description or full event is approved. **0 new finite implementation corrections** are issued; these observations are a research checkpoint, not an instruction to change PR24, PR37 or PR48.

## Known gaps and next bounded unit

1. Chapters after five remain unread. Prioritize the actual departure and later Crow/Xisis/Sorceress narrative before deciding e49/e113/e50 and the three remaining landmark descriptions.
2. Try the publisher's Read Excerpt control through normal reader interaction, or a lawful catalogue-linked sample. Record what it actually exposes; the extracted link and the Yale403 are tool-specific outcomes, not proof that no lawful sample exists. No purchase or new account is required by this checkpoint.
3. If investigating the six-descriptor moon representation, read the actual renderer and schematic notices before asserting visible count/motion errors. T1 supports a textual twelve-moon fact, not an arbitrary demand for physically simulated astronomy.
4. Preserve source attribution for Charlie's history and reports of the Sorceress. Distinguish character explanations, narrator statements, synopsis, artwork and later DR02 revelations.
5. The full text, published contents denominator, map/art and complete cross-book mechanism/identity comparison are not available as verified coverage here. Keep the work at research/chatgpt. At unit2/2, hand off a finite supported correction if found, otherwise defer with these precise gaps and continue the ledger; do not open a third search-only checkpoint.

All18/18 pack and8/8 review statuses were inspected in this run; this was the only ChatGPT-owned folder and no stale parallel self-audit was eligible. DR01/DR02 deferrals, prior accepted Kenton/TH01 corrections and existing runtime/release holds remain intact. **0/33 full-work audits approved.** No application or PR-branch edit, merge, deploy or Mckay release approval.
