# COS-BB-001 mapping research checkpoint — 2026-11-09

This is a bounded initial research packet under D08 option c, not a full catalogue or completed mapping audit.

## Source snapshot and inventory

Repository: mckayec/universe-sandbox. PR37 head **08d10e1736d3e6916d7a061d311ddb13f444bb05**, pack blob **5a74e300eaf88b2d3c81fa9bc957584cd4708e33**. The complete `public/atlas/packs/cosmere.js` was fetched and evaluated with Node VM.

- No `works` or `presets` registry is present.
- The spoiler mode remains `cumulative`.
- Key 2 has **14 events**: e6, e68, e69, e8, e9, e70, e71, e10, e72, e73, e11, e74, e75, e12.
- Key 12 has **20 events**: e55, e118, e56, e119, e122, e123, e57, e124, e120, e121, e125, e58, e59, e60, e61, e62, e126, e63, e127, e128.

These counts cover only the event array, not world/site/landmark/codex/era/intro/realm/search/route fields. No complete claim denominator is asserted. The companion [inventory probe](mapping-inventory-probe.cjs) checks these five observations against the pinned pack. It is not an implementation test.

## Bibliography verified from the author's page

[S1] [The Mistborn Saga: The Original Trilogy](https://www.brandonsanderson.com/pages/the-mistborn-saga-the-original-trilogy), opened 2026-11-09. Evidence type: author bibliography and author synopsis. Review units: **3/3 initial trilogy titles/years/order**.

| Existing audit ID | Suggested permanent work ID | Title | Publication year | Existing key | Verified boundary |
|---|---|---|---:|---:|---|
| MB01 | mistborn-the-final-empire | Mistborn: The Final Empire | 2006 | 2 | Author identifies it as book 1; “Mistborn” is a title alias, not a fourth work. |
| MB02 | mistborn-the-well-of-ascension | The Well of Ascension | 2007 | 2 | Author identifies it as book 2, with hardcover publication in August 2007. |
| MB03 | mistborn-the-hero-of-ages | The Hero of Ages | 2008 | 2 | Author identifies it as book 3, with hardcover publication in October 2008. |

The suggested IDs are implementation candidates and must be reconciled once before they are shipped, then preserved. The order [MB01, MB02, MB03] supports a specifically labeled **Original Mistborn trilogy** preset. It does not establish a complete Cosmere publication rank or a universal reading order.

[S1] separately identifies Mistborn: Secret History as a companion story, included in Arcanum Unbounded. Its warning says it has major spoilers for all three original novels and minor spoilers for The Bands of Mourning. Do not add it to a completed-trilogy set or infer the reader completed it. Bibliographic membership does not grant any plot record visibility, and the warning is not by itself a complete per-record prerequisite ledger.

## One narrow event-gate disposition

[S2] [Annotation Mistborn 3 Chapter Eighty-Two](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-3-chapter-eighty-two), opened 2026-11-09. Evidence type: **author commentary**, not the full chapter text. The “Sazed Ascendant” section directly describes Sazed ascending with power and remaking the world using knowledge stored in his metalminds.

- Target: event **e12**, current title “The Hero of Ages”, attached to world scadrial.
- Current full copy: “Sazed takes up both Shards and restores the world, clearing the ash.”
- Source-supported narrow copy for this checkpoint: **“Sazed ascends and remakes the world.”**
- Proposed work gate for that narrow copy: `in: ["mistborn-the-hero-of-ages"]`, `req: "mistborn-the-hero-of-ages"`.
- No inferred read-set expansion: selecting this work alone does not check either earlier novel. Do not grant independent earlier records through publication order.
- The opened annotation supports the narrow ascension/remaking statement. This checkpoint does **not** independently verify every clause of the existing “both Shards / clearing the ash” wording from the chapter text. Preserve an evidence hold on the broader wording or narrow it as above.
- Parent/field rules still apply. The event cannot bypass an unreviewed or hidden Scadrial ancestor, or expose unrelated era, realm, codex or site text. Do not make the ancestor public simply to demonstrate e12.

**Coverage: 1/14 key-2 event gate/copy units has this narrow commentary-supported disposition; 13/14 are not newly audited here. Zero entire world/site/landmark/codex/era/realm/route units approved by this checkpoint.** The entire bucket is not mapping-complete. Rendering and integration have not been tested.

## Next bounded packet

After the infrastructure interface is returned, inventory all key-2 exposure fields and their ancestors against that exact head. Reconcile e6/e68/e69/e8, e9/e70/e71/e10, and e72/e73/e11/e74/e75/e12 with opened work-specific evidence, retaining unsupported geography/scene details as holds rather than guessing. Source and gate the parent/field data before promoting child records.

For key 12, do not infer that all 20 records share one work. Retain the earlier publication/edition hold on The Fires of December until its status and relevant text are verified. The current pack title is a repository claim, not bibliographic evidence.

No full novel was read end to end for this checkpoint. The source pages are from the author and are not independent witnesses of one another. No new whole-book approval, source-wide canon sign-off, implementation acceptance, merge or release follows.
