# SEL02 / HO01 reconciliation and existing EL01 portability handoff

2026-11-21 · ChatGPT · Source-based web research and exact-source inspection; no separate Deep Research product invoked.

**Disposition: one Medium correction for Claude on PR48, SEL02-EL01-PORT.** This ports the already accepted EL01 omission; it is not a new Hope narrative finding or a restart of SEL01's deferred full audit. The prospective HO01 addition remains held. **4/4 selected HO01 propositions checked; 0/1 complete story audits; 0/33 full-work canon approvals.** Do not treat the proposed change or this research receipt as implementation acceptance.

## Exact revision boundary

| Input | Exact head / blob |
| --- | --- |
| PR24, fix/lore-corrections | head `cf25cda66e91c573c421a0f3712623db72737a3b`; pack blob `3ff0aab059fa54e00f6e2ccc7b849d4bd206d958` |
| PR37, atlas/deep-worlds | head `03394c32816fcb5c95261bf6a9ea4520381a5838`; pack blob `5a74e300eaf88b2d3c81fa9bc957584cd4708e33` |
| PR48, feature/cosmere-reading-state | head `614a391443a87cd67d27caca255d2836b5f15d37`; pack blob `179dfb810f22e3694f7751cf02c1e609ca8992f0` |
| PR48 reading helper | `public/atlas/reading.js`, blob `4d9bc177294e5e33accf6f19825ef467f0bb90d4` |
| PR48 renderer/selectors | `public/atlas/engine.js`, blob `0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0` |

All pack inputs are `public/atlas/packs/cosmere.js`. All three PR heads were re-fetched unchanged before this handoff. These are research inspection heads, not approval of those branches.

Prior evidence: [Elantris handoff](handoff-elantris-2026-11-07.md), blob `dcd8ce1004238a46bdaaf2eb8b1d34275fa19829`, EL01; [implementation review](implementation-review-ffc8ba7.md), blob `c53f7f12cc5f0790ebe8e2fcba86e1c079833ad4`, bounded seven-correction acceptance at PR37 `ffc8ba7c6734f38839f3eca974b96c04a1a1c098`. Current PR37 retains that omission. Current PR24 and PR48 retain the earlier sentence. This is a cross-branch carryover, not evidence that the accepted PR37 correction regressed.

## Opened sources and selected-passage findings

Both author pages were fetched successfully this run (HTTP 200), using fresh Firecrawl retrieval. The story was returned in full, but this review read **selected passages**, not every line. No retail/anthology edition collation was performed.

**S1 — [The Hope of Elantris, author-hosted story](https://www.brandonsanderson.com/blogs/blog/the-hope-of-elantris).** Direct posted narrative plus its introduction, not secondary summary. Four narrow propositions are supported at this version's selected passages:

1. The introduction places the central account during the novel's climax and recommends reading the novel first. The later framing conversation is distinct from that account.
2. The Roost houses children near New Elantris's center and the Korathi chapel. This provides relative context, not survey coordinates.
3. Matisse organizes escape and directs Ashe toward Idotris and the library. The ending credits Ashe with hiding children there. Galladon and Karata had left; do not describe them receiving the children.
4. Ati is a proposed seon; in the ending Ashe identifies Aeo with an explicit qualification. Preserve the distinction between proposal and reported outcome.

Confidence: high for these limited posted-text observations; no complete story/edition or earliest-reveal certification. Source locators: introduction; first Roost description; attack/escape and library passages; closing Raoden–Ashe conversation. These are research notes, not an approved new payload.

**S2 — [Annotation Elantris 61-3](https://www.brandonsanderson.com/blogs/blog/annotation-elantris-61-3), “The Spirit of Elantris (Part Two)”.** Author commentary, not the novel chapter. It explains the city and outer cities forming Aon Rao and the missing Chasm line. It does not establish that the streets alone trace either Ela or Rao. This supports the conservative existing EL01 omission, without adding a climax explanation or certifying map geometry.

## Actual current overlap and parent boundary

Inspected one Sel world out of 60 worlds per pack; selected Elantris and Kae parent/site descriptions out of 23 Sel sites per pack. Sel-event enumeration found 6/6 records on PR24 and PR48 (e1–e5, e30), and 7/7 on PR37 (those plus e67). Enumeration and selected prose inspection do not certify those events. Also inspected the selected Raoden/Sarene codex entry. No full 23-site/landmark or whole-codex audit is claimed.

A case-insensitive recursive scan of all string leaves for Matisse, Roost, Idotris, Riika, Aeo, Taid, Teor, Tiil and “Hope of Elantris” found zero hits on PR24/37 and only `spoilers.works.10.title` on PR48. The [evidence JSON](sel02-reconciliation-evidence-2026-11-21.json) records the results. This is a defined lexical scan, not proof that every unnamed overlap or synonym is absent.

PR48 has stable work ID `the-hope-of-elantris` in legacy bucket 7. That resolves the old lack of separate registry identity; it does **not** certify the Sel/Elantris ancestor payload. Sel and the Elantris site have `books:[1,7]`, no explicit reviewed own gate; Sel's first book and the site's minimum bucket remain 1. Actual selector probes show Hope alone denied the site description, while Elantris alone already permits it. Parent copy includes claims outside this selected story check.

Accordingly, **do not add HO01 yet, add coordinates, or promote parent gates to make it display**. A story-specific child gate alone cannot establish the parent contract. Broad HO01 addition is deferred pending an atomic proposed payload, relevant parent/overlap coverage and a safe source-specific display decision under the agreed layer protocol. This reconciliation does not allocate repeated new research allowances by splitting those gaps into fields. Existing capped work stays deferred.

## One-field implementation request: SEL02-EL01-PORT

Severity: **Medium**. Target **PR48 only**, `public/atlas/packs/cosmere.js`, line 466 at the inspected head:
`worlds[id=sel].sites[id=elantris].desc`.

Delete exactly `Its streets trace Aon Ela. ` including the trailing separator. Do not substitute Rao.

Current field:

> The shining city of the Elantrians in north-east Arelon, near the coast and the northern end of the Atad Mountains. Its streets trace Aon Ela. After the Reod its walls hold the Shaod’s victims; Raoden is thrown in here at the start of the book.

Required field:

> The shining city of the Elantrians in north-east Arelon, near the coast and the northern end of the Atad Mountains. After the Reod its walls hold the Shaod’s victims; Raoden is thrown in here at the start of the book.

Preserve every other field, gate, ID, book list, event, coordinate, mapping and ordering. The retained geography is not newly certified here. No work on PR24/37 is requested by this handoff. Other old Elantris wording differs across branches and remains portability backlog; this one correction does not close it or justify a bulk branch merge.

## Proposal-only validation actually executed

The candidate was constructed in memory from the fetched PR48 pack; no application file was edited. Three checks passed: exact old sentence occurs **1/1** times; the intended field has the proposed value **1/1**; restoring its old value restores deep equality with the entire original parsed pack **1/1**.

Actual `AtlasReading` and renderer selector code from the listed blobs were evaluated, using the renderer span from `var RREG=null;` up to `function eTitle(e)`, the actual `firstOf` helper, and supplied pack/world/state bindings. This is a selected actual-code execution, not a browser render or whole-engine integration test. Original and candidate `sDesc` output were compared in **10/10 paired states**:

| States | Count | Observed proposal result |
| --- | --- | --- |
| all; legacy 1; legacy 7; Elantris only; Elantris + Hope; all 33 registered work IDs | 6/6 | Description stays visible with only the old sentence removed |
| none; safe; Hope only; all bucket-7 work IDs without Elantris | 4/4 | Description remains denied/empty |

Full state inputs and outputs are in the evidence JSON. These observations establish this candidate's selected output invariance only. **0 implemented revisions audited, 0 browser cases executed, 0 new gate promotions approved.**

## Claude return and continuation

Apply only the specified omission on the current PR48 branch after rechecking the target. If the branch advanced, preserve concurrent work and record the actual parent and resulting head; do not overwrite newer prose blindly. Save a return document in this folder describing the exact diff and checks. Run the branch's required validations and a focused allowed/denied description check; record failures or unavailable checks honestly. Include desktop/phone evidence where required by the current review workflow, distinguishing direct observations from automated checks.

Then set this review to **implementation-review / chatgpt** after the return evidence is saved. ChatGPT must independently inspect the actual diff/files at that exact head and run available required checks; Claude's report alone is not independent verification. No merge, deployment or Mckay release approval follows from this handoff.

The 33-work ledger remains **28 deferred / 5 partial / 0 fully approved**. SEL02 remains partial, with broader HO01 addition explicitly held and this separate existing-EL01 portability correction pending. FD01 remains deferred at 2/2. After the finite return, reconcile remaining previously accepted Elantris portability debt against actual current heads before deciding another bounded action; do not reopen full deferred work or imply all stages will finish in one run.
