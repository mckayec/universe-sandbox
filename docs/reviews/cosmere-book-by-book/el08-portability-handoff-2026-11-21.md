# EL08 A–E portability reconciliation and finite handoff

2026-11-21 · ChatGPT · **Five previously accepted EL08 disposition groups need porting to PR48; seven logical data operations.** This is an implementation-debt reconciliation against saved evidence, not a new full Elantris research allowance or a claim that omitted cosmology is false.

The separate [R1 review](implementation-review-1fdd398.md) is saved at a06fbc8765d42fac7c4e80ea9adb44f0a2c440fb. Preserve that engine fix and all accepted prose changes.

## Revision and evidence boundary

| Input | Exact revision |
| --- | --- |
| PR48 feature/cosmere-reading-state | 1fdd398a7ac936d21e11ddb9da8de65a895aac9b |
| PR48 cosmere.js | blob0ec8d80d4b9e184dafbc6461867fb9be54c6c631 |
| PR48 engine.js / reading.js | blobs7c2daaa7bc159e88b6aec6157019780baa7bf209 / 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| PR37 atlas/deep-worlds | 03394c32816fcb5c95261bf6a9ea4520381a5838; pack5a74e300eaf88b2d3c81fa9bc957584cd4708e33 |
| PR24 fix/lore-corrections | cf25cda66e91c573c421a0f3712623db72737a3b; pack3ff0aab059fa54e00f6e2ccc7b849d4bd206d958 |

Re-read the [original handoff](handoff-elantris-2026-11-07.md), blob dcd8ce1004238a46bdaaf2eb8b1d34275fa19829, the partial/full Claude returns, and the [prior independent acceptance](implementation-review-ffc8ba7.md), blob c53f7f12cc5f0790ebe8e2fcba86e1c079833ad4. The latter expressly accepted **5/5 EL08 groups** at finite narrow/omit scope. Current PR37 still contains those operations; PR24 and PR48 retain the old targeted fields. This is not a PR37 regression.

No new literary web sources opened. The previous earliest-reveal/edition/source uncertainty is retained, not upgraded to confirmation. No separate Deep Research usage. The inspection and proposal execution below use actual current GitHub files, not Claude's report as sole evidence.

## Exact PR48-only implementation request

All targets are in public/atlas/packs/cosmere.js. IDs/name matches identify records; do not copy PR37's whole pack.

| ID / severity | Target | Exact operation |
| --- | --- | --- |
| EL08-PORT-A / Medium | worlds[id=sel].status and base facts | Set status to **World of Elantris**. Remove the single base facts row **["Order","2nd from Mashe"]**. Keep the other three base rows in their existing order. |
| EL08-PORT-B / Medium | worlds[id=sel].realms.cognitive | Remove the **entire** Sel-specific cognitive override (name, style, colors, blurb), not only its prose. At this head it is the sole realms member; remove the empty realms container as well, matching the accepted PR37 shape. Preserve any concurrently added unrelated realm member if the head changes. |
| EL08-PORT-C / Medium | worlds[id=sel].sites[id=pool] | Set name to **The Pool**. Remove exactly ** It opens into Sel’s Cognitive Realm.** (including its preceding space) from desc. Keep all other fields and the remaining description unchanged. |
| EL08-PORT-D / Medium | codex[id=shards].list | Remove the complete entry named **Devotion and Dominion**, including its books metadata. Keep all other entries in order. |
| EL08-PORT-E / Medium | codex[id=shards].list | Remove the complete entry named **Adonalsium**, including first and more. Keep all other entries in order. |

Seven logical operations: two A, one B including empty-container cleanup, two C, one D, one E. No gate relocation or invented later source mapping. No coordinates, scene/landmark imports, new events, e67, HO01, parent promotion or PR24/PR37 changes.

Required resulting Pool description:

> A small, deep pool of thick, crystalline blue liquid in the Atad Mountains south-east of Elantris, reached by tunnel or switchbacks.

This retained physical description is still **unaudited at full geographic/scene scope**. Removing its final sentence does not verify its other clauses.

## Proposal checks actually executed

[evidence JSON](el08-portability-evidence-2026-11-21.json) records exact inputs and before/candidate observations.

- Parsed the three actual packs. **5/5 group dispositions reconciled**; current PR37 target values/absences match the proposed PR48 operations.
- Constructed a candidate in memory only. **7/7 logical target checks pass** against PR37's corresponding dispositions. Restoring the targeted values/containers/list to the actual PR48 originals restores the entire parsed pack, **1/1** canonical deep equality. This proves no unrelated candidate-data change; it is not an implemented diff.
- Executed actual fetched AtlasReading and engine source: span var RREG=null through statusFor (ending before const bk1), actual realm selectors/card/open predicates, and actual renderCodex. Supplied inert DOM nodes and plain pack/world bindings; badge markup was stubbed. No rendering pipeline, URL interaction or search UI was executed.
- **10/10 paired state checks pass** for visibility invariance, omitted named codex entries, generic cognitive fallback and preservation of denied text. States: All; legacy1; legacy7; none; safe; Hope only; Elantris only; Elantris+Hope; all bucket7 IDs without Elantris; all33 work IDs.

| State population | Proposal observation |
| --- | --- |
| All, legacy1, legacy7, Elantris, Elantris+Hope, all33 (6/10) | Sel/Pool stay visible. Status narrows, Pool label/description narrow, both named codex entries disappear. |
| none, safe, Hope only, bucket7 without Elantris (4/10) | Sel/Pool remain denied; status/description empty, name stays neutral placeholder. No parent unlock. |
| legacy1, Elantris, Elantris+Hope (3/10) | Base Order fact disappears; other base facts remain. Cognitive realm remains closed. |
| All, legacy7, all33 (3/10) | Era7 facts still supply Order/Shards rows. This is retained unresolved scope, not a failed base-row deletion or an approved reveal mapping. |
| all10 direct cognitive selector calls | Candidate returns generic unsea style4 and the existing generic unknown/illustration card, without the Sel-specific plasma override/name/blurb. |

For the final row the harness deliberately sets S.realm=cognitive to inspect the fallback even when realmOpen is false. Those are **direct function observations, not evidence that a closed realm is accessible to the user**. The actual open predicate is unchanged: three tested states permit cognitive and seven deny it.

**0 implemented revisions and 0 browser cases** for this proposal. Independent Chromium launch for the preceding R1 unit failed before navigation with socket permission denied; no rendered proposal acceptance is implied.

## Retained holds and no scope inflation

This batch removes only the named fields. In particular:
- Sel eras[7].facts, the pack-level named Sel cognitive subastral at first7, generic realm prose, relevant spiritual associations/perpendicularity effects and the global intro are unchanged.
- Odium's later more[7] line is unchanged. Removing the two codex entries does not remove all named-Shard or Adonalsium mentions from the atlas.
- The global/era material retains prior source, work/edition and parent-gate holds. No claim of complete book1 or per-work spoiler safety follows.
- Residual events/landmarks and full geography remain at their existing dispositions. Do not bring absent PR37-only records onto PR48 while porting these omissions.
- Prior finite fixes, including R1 cancellation, EL01 and EL-PORT-02..05, remain accepted only at their recorded evidence levels. The Save/Load browser-smoke timeout, independent rendered limits and release gates remain.

The ledger remains28 deferred/5 partial, **0/33 full-work approvals**. FD01 remains deferred2/2; HO01 addition held. This does not reset capped research by treating each field as a new item.

## Claude return / continuation

Apply the seven logical operations on current PR48 after re-reading its head and targets. Preserve concurrent edits; record actual parent/head and full changed-file/field crosswalk. Keep application changes on Claude's existing branch; this ChatGPT run writes only review documents on main.

Run required validations and focused allowed/denied checks against the **actual fetched parent**, not only a synthesized reversal. Verify exact fields plus all-other-data invariance. Check the generic realm fallback in dossier and surface appearance at an eligible state, the disabled realm at legacy1/Elantris-only, Pool label/description and named codex-entry absence. Include before/after desktop/phone evidence with exact head and clear pass/fail/unavailable reporting; do not convert missing evidence into a pass. Any existing search exposure must be checked where applicable, or identify its absence at this branch. Preserve R1 selected-site/delayed-callback regressions.

Save the return before moving to **implementation-review/chatgpt**. Current handoff is **fixing/claude** for this batch only. After independent acceptance, reconcile the remaining already-recorded finite portability obligations once; if no actionable authorized unit remains, leave a precise deferred checkpoint rather than opening repeated source searches. No merge, deployment or Mckay release approval is authorized.
