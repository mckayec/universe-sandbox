# PR33 integration canon recheck — 2026-11-09

Reviewer: ChatGPT. Branch: `pack/lds-standard-works`. Audited head: **3e5791ec9ea89bc5f362449f5bf1d07c963073c8**. Previously approved head: **3e3701ffcc4131200f0993e52f8f14a509016ced**. The actual merge parents are that approved head and main **9bff98760a880ffe3f629a879678243d18d6c270**.

**Canon: approved at 3e5791ec9ea89bc5f362449f5bf1d07c963073c8**, within the prior curated scope. This is a preservation/delta review, not a new full source audit or technical sign-off. The opt-in design is acceptable for this single-Earth LDS pack. Return to Claude for the exact-head technical sign-off, retaining the rendering limitations below; then follow D05 and D09. Do not describe the older technical approval as approval of this merge.

## Actual revision evidence

Read the existing `audit-final.md`, current status and `integration-3e5791e.md`; fetched exact-head files through GitHub. Recursive trees for both parents and the new head were untruncated. The comparison endpoint returned only 300 files, so that truncated list was **not** used as a complete inventory.

The tree comparison finds **28/28 non-doc changed paths** versus the approved head: **21/28** are byte-identical to the main parent; **7/28** combine PR33 and main changes. Inspected all seven combined files in full/diff: engine.js, engine.css, layers.js, the LDS pack, registry.js, src/universe-packs.ts and tests/atlas-layers.test.ts. Inherited main changes outside the atlas integration are identified, not independently re-certified by this canon pass.

- **Whole-pack preservation, 1/1:** new pack blob `386fe8967a3bf32c79ca2d4015b5bde9f1834310`; deleting exactly `, earthMask: 'hi'` reproduces approved blob `3d279a757303e6ae7e80c358a6f6e041269eb82c`. This covers all prose, sources, IDs, dates, layer/spoiler gates, locations, routes and the CS-2 scope notice, not a sample of the diff.
- **Both high-resolution mask assets, 2/2**, are unchanged: earth-hi.png `02b888a076036d2df3e139513472f345e56ef6b9`; earth-hi-4k.png `5372d2f0a76bfc42c5986b809f540343b652d219`.
- layers.js preserves the prior note/codex reading and layer gates, attributed-date display and route helpers; it adds main's compact work picker. The registry and landing-page entries preserve LDS and add the existing main apocrypha entry.
- The engine keeps frozen `gB` sampling and adds main's coastal noise attenuation. **The same mask files do not imply identical rendered pixels:** attenuation differs for interpolated coastal samples. Main's codex height/scroll and filter rules also change layout. These belong in Claude's technical disposition.
- The notice's exact selected-coverage text, narrow-width dossier path, muted ink and credits backing remain present.

## Independent execution and external CI

Local downloaded files were normalized back to and verified against their Git blob hashes before final execution. No repository code or PR branch was edited.

| Evidence | Result | What it establishes |
|---|---|---|
| Node 24.22.1: `node --test tests/lds-cs2.test.ts tests/atlas-layers.test.ts` | **17/17 passed** | Existing notice/contrast declarations, layer/reading/route logic and picker helper regressions |
| [Reviewer probe](reviewer-integration-3e5791e.mjs), executed against exact engine and pack blobs | **14/14 loader scenarios; 1/1 whole-pack preservation passed** | Actual extracted loader logic under Image/THREE stubs: desktop/phone/low-memory/max-texture/device-memory choices, override, fallback, terminal failure, promise reuse and mixed-world scope |
| GitHub Actions [42565302906](https://github.com/mckayec/universe-sandbox/actions/runs/42565302906), jobs and decoded build log opened by reviewer | **213/213 tests; 26/26 page/viewport cases**; format, build and check:dist success | External CI execution at exact head `3e5791e`, not merely Claude's reported result. Deploy job skipped. |
| Claude's integration receipt | Builder reports smoke pass, six rendered mask-request cases and screenshots | Attributed builder evidence; not independently rerun or visually certified in this pass |

The stub probe does not decode images, make network requests, render pixels or measure GPU/phone performance. This run did not launch an independent browser, run the full local build or inspect the new screenshots. CI's standalone-page pass is not a substitute for a complete technical/visual audit. The PR was open/unmerged at metadata read; its mergeability returned `null`/unknown, so the builder's earlier `mergeable:true` is not asserted as current.

## Findings and disposition

| ID | Severity | Location | Finding | Evidence | Suggested fix / disposition |
|---|---|---|---|---|---|
| INT71-O1 | Low | engine.js Earth loader; docs/atlas/PACK_FORMAT.md earthMask option; integration receipt | The option is described as world-specific, but one `EARTH_HI_MASK` computed with `WORLDS.some(...)` selects the single shared Earth texture for the entire pack. Mixed Earth worlds cannot independently select hi/base masks. | Exact source and mixed-world stub scenario | Accept current LDS configuration. Claude should clarify the pack-wide limitation in option documentation/receipt before it is used for mixed-mask packs. No canon correction or redesign required for PR33. |
| INT71-O2 | Low | integration receipt “same code path” / preservation wording | Asset choice is preserved, but the coast shader and failure fallback differ from the earlier approved rendering: the default fallback asset now comes from main. | Exact shader delta; base asset changed while hi assets did not | Carry this distinction into technical sign-off. Do not claim pixel identity or an unchanged full rendering path. |

**0 new High/Medium canon findings.** Both Low observations are implementation/documentation precision notes for Claude, not new unsupported scripture claims.

## Carried canon evidence and known gaps

Prior canon evidence carries because the entire pack except its mask option is identical: 33/33 added-source cards, the reproducible 20/20 final sample from 1,714 records, 26/26 anchor dispositions, 7/7 original finding groups and 5/5 addendum receipts. Those counts are inherited from the earlier linked audit, **not newly researched here**; fresh external scripture source openings in this integration-only pass: **0**. No separate Deep Research product was invoked.

Coverage remains curated rather than verse-complete. Preserve the earlier software-GL-only/physical-device and real-GPU limitations, prior full-frame 4K evidence and simulator Save/Load intermittency. The new-head receipt explicitly has no fresh 3840×2160 capture; its small/desktop mask-path checks cannot close that visual gap. The changed shader/layout means Claude must make an explicit technical disposition at this head rather than silently carry the old signature.

## Handoff and run coverage

Final canon output is complete for this bounded integration delta. Append the same-head canon confirmation to `audit-final.md`, then hand `final-audit` to Claude for the current technical signature and Low observations. Do not rerun unchanged 33-link/20-sample research merely because main was merged. After both signatures exist, route under existing D05/D09; this review grants no merge, deployment or owner release approval.

Run discovery inspected **18/18 pack statuses and 8/8 review statuses** on main. This was the only ChatGPT-owned unit. All files in the three research-ready folders (hierarchy, narnia, licanius) match the prior reviewed baseline `6622416e995012aabf65d304f3a0e75a173e4340`, including audits, addenda and questions; no stale self-audit was introduced. No other owner's status was changed.
