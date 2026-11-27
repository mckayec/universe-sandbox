# Remaining key-2 events: inventory and bounded e8 narrowing

ChatGPT · 2026-11-17T03:18Z. Source-based web research, not the separate Deep Research product.

**5/5 remaining events and their 5/5 site parents inventoried; one text-only correction supplied, 0 new per-work mappings authorized.** This closes the narrow e8 prose disposition, not the event's location audit or any full-book audit. Four other event prose units remain held. Hand K2-E8-01 to Claude; preserve all existing record/ancestor restrictions.

## Exact repository evidence

PR48 `feature/cosmere-reading-state` at **0b43f8ee562b232387e9342d00985c91df9663fb**:
- pack: **a5dec3452a855e4680fb4b604b0ff6274528f906**
- reading helper: **4d9bc177294e5e33accf6f19825ef467f0bb90d4**
- engine: **0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0**

All **3/3** fetched input blob hashes independently matched locally. The actual pack was parsed in a Node VM, without changing application files. [Inventory and candidate](key2-events-inventory-0b43f8e.json) contains the exact five event objects, compiled own gates, site records, world field gates and e6/e12 controls. Registry normalization succeeded without errors; **5/5** remaining own gates compile to unreviewed original-trilogy fallback. These are repository/helper observations (C), not five canon verifications.

Fresh older heads:
- PR24 `fix/lore-corrections`: **cf25cda66e91c573c421a0f3712623db72737a3b**, pack **3ff0aab059fa54e00f6e2ccc7b849d4bd206d958**.
- PR37 `atlas/deep-worlds`: **03394c32816fcb5c95261bf6a9ea4520381a5838**, pack **5a74e300eaf88b2d3c81fa9bc957584cd4708e33**.

The e8 text is identical on all three branches. PR37 additionally attaches `lm:"throne"` and `fx:"duel"`; neither exists on PR48 and neither may be imported by this packet. PR24/PR37 stay untouched. The earlier [key2 dispositions](key2-handoff-2026-11-10.md) covered a different 14-event PR37 inventory; PR48 has **7** key-2 events. e7 remains distinct from PR37 e74.

## Five-event disposition inventory

Line numbers refer to the exact PR48 pack above. Existing text in the JSON is an inventory quotation from the repository, not a newly certified description.

| Event / line | Parent site | Current disposition and missing evidence |
| --- | --- | --- |
| e7 / 749 | hathsin | Hold whole text and mapping: wife’s fate, survival, transformation and “every” power need scene-level checks. S4 below gives context but does not verify this entire statement or its earliest reveal. |
| e8 / 750 | kredikshaw | K2-E8-01: narrow text only to the supported death/defeat statement below. Palace attachment, site description and geometry remain held; no earlier gate. |
| e9 / 751 | luthadel | Hold: Elend’s governing context, exact count of armies and simultaneous placement need MB02 locators. Accepted Luthadel name/description fields do not verify this event. |
| e10 / 752 | well | Hold: reaching/relinquishing power, liberation and deception attribution need MB02 scene evidence. Do not silently identify the released entity or promote the mixed site description. |
| e11 / 753 | fadrex | Hold: participants, cache-search motive, siege and timing need MB03 locators. Site text is not an independent source for its own event. |

All five site records have `books:[2]`, `until:6`, and no own record gate. Scadrial has `first:2` and no own record gate. Existing field gates on Scadrial and Luthadel do **not** promote these parent records. The actual engine `worldChain`, `siteChain`, `evChain` at lines 968–973 intersect event restrictions with the existing parents. Preserve that behavior; no public marker, guessed explicit trilogy gate or parent promotion is authorized.

## Sources opened this run

These are author commentary, **not chapter text and not independent witnesses of one another**. Four pages opened; **0 primary chapter-body passages** from these scenes retrieved. Search-discovered unauthorized full-text mirrors were not opened or used.

| Tag | Opened source and locator | Supported conclusion / limit |
| --- | --- | --- |
| S1 | [Mistborn chapter 38, part 1 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-chapter-thirty-eight-part-one), entrance and failed-attempt discussion, retrieved lines 117–128 | Discusses Vin’s attempt and why the shadow approach fails. Not proof of a palace-room coordinate or the complete final killing sequence. |
| S2 | [Chapter 38, part 3 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-chapter-thirty-eight-part-three), lines 119–125 | Discusses revised use of the mists and an abandoned bracelet-removal draft. Do not import that discarded hand-grabbing sequence into published canon. |
| S3 | [Chapter 38, part 4 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-chapter-thirty-eight-part-four), lines 119–124 | Explicitly discusses the immortality revelation, the defeated Lord Ruler and his death. Supports the narrowed statement (C, commentary). Does not supply an exact palace attachment in the opened passage. |
| S4 | [Chapter 14, part 2 annotation](https://www.brandonsanderson.com/blogs/blog/annotation-mistborn-chapter-fourteen-part-two), lines 119–129 | Gives failed-infiltration/Mare context, Kelsier’s changed capabilities and the author’s interpretation of the Pits’ psychological effects. Insufficient for all e7 clauses; no new e7 mapping. |

No full novel was read. No direct second independent witness was obtained. These gaps remain visible rather than being converted into a full-entry confidence label.

## K2-E8-01 — Medium source-precision narrowing, not a proven falsehood

Location: `events[id=e8].text`, PR48 pack line 750.

The current sentence combines discovery, killing agent, immortality wording and exact palace location. The opened evidence supports a smaller proposition without requiring us to certify every clause or site. This is conservative editorial scope, not a claim that Vin’s role or the palace setting is false.

**Replace only the text with:**

> The Lord Ruler is defeated and dies.

Support: **S3 (C, author commentary)**, chapter 38 of MB01. Chapter attribution is a source locator, not a newly granted record gate. Preserve title “The Lord Ruler falls”, `id`, `book:2`, `world:"scadrial"`, `site:"kredikshaw"`, array order and every other property. The retained site link remains an explicitly unverified legacy attachment; this packet does not certify it or its destination's mixed description. No new `gate` or `gates`, landmark, effect or new event is authorized.

A local in-memory candidate changed only this text; restoring it produced byte-for-byte equality of the serialized parsed pack with the original. This checks proposal scope, not implementation or rendering. **0 application edits, 0 independent browser cases, 0 fresh full-suite runs.**

## Required builder return

Claude: apply K2-E8-01 on PR48 only and return an exact head, one-field diff and payload read-back. Confirm e7/e9/e10/e11 and accepted e6/e12 are unchanged; retain all prior CBR/SH and MB01/MB05/MB10 corrections and holds. Run relevant existing checks and report failures/unavailable checks separately; do not imply the unresolved browser-smoke failure at line 88 is fixed.

At 1440×900 and 390×844, show the revised event text in an allowed selection and verify an incomplete-trilogy selection remains withheld under the unchanged chain. Confirm legacy/All behavior has only the intended wording change. Return for implementation review before further content work. Do not relax a parent restriction to expose the wording.

## Coverage and next checkpoint

- **5/5** remaining event records and **5/5** site parents inventoried.
- **1/5** event texts has a finite narrowing disposition; **0/5** whole events newly canon-approved.
- **2/7** events remain mapped (e6/e12); **0** new mappings authorized or implemented.
- e8 site attachment and the other four event prose units remain research gaps. After this return is reviewed, the next source unit should target e7’s MB01 survival/Mare claim, with a two-checkpoint cap; either supply verified narrow wording or an explicit conservative omission/defer disposition. Do not expand to MB09 again.
- Prior **0/2** parent promotions and **0/33** full-work approvals unchanged. Earlier PR37 148-field accounting is not silently recalculated from this smaller PR48 inventory.
- MB09 remains deferred; SH-E1 closure stands. No whole Cognitive or key-2 canon approval.

Intake read **18/18 pack statuses and 8/8 review statuses** on current main; no pending implementation/final/content build audit superseded this owned source unit, and no stale research-ready/claude self-audit was eligible. Agreement remains active with both sign-offs. WIP remains over its limit, so no queued universe was activated. No site-code or PR-branch edit, merge, deployment or Mckay approval.
