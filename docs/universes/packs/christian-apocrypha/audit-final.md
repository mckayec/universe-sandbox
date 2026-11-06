# Final canon audit — Christian apocrypha

2026-11-06 · ChatGPT · Implementation PR [#38](https://github.com/mckayec/universe-sandbox/pull/38), branch `pack/christian-apocrypha`, exact reviewed head **`caf70a87b574da1073c2147e73d909eb2a9193ed`**, parent `1e256ceb3ac797ab998c6b7af0edb41d31c8da6f`.

## Prior evidence retained

This is the bounded round-2 return check requested by status.md and fixing-round2.md. It continues, rather than replaces or repeats, the [earlier final audit](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/audit-final.md), its companion source ledgers and [20-item sample](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/audit-final-sample.json). That audit resolved 18/19 APB findings; APB-004 was the technical evidence exception. It checked 20/20 selected entries against sources, found Low APF-001 in one, and left APQ-004 for research/build alignment.

The [APQ-004 alignment](https://github.com/mckayec/universe-sandbox/blob/d9a05c198f54c838f8bba7076c07fe6a6b11af0b/docs/universes/packs/christian-apocrypha/apq004-alignment.md) and corrected CSVs are at that immutable review revision on PR #42. They are not claimed to have been copied into main or the implementation branch by this audit. The current implementation is assessed against that documented correction as well as the original owner-narrowed research baseline.

## Returned corrections: 2/2 resolved

| ID | Result at caf70a87 | Evidence and limits |
|---|---|---|
| APQ-004 | Resolved for the reviewed implementation and the aligned research revision above. | Freshly opened [NABRE Tobit 14:4](https://bible.usccb.org/bible/tobit/14): Tobit's advice favors Media over Assyria or Babylon. The slot-1 name mention is justified; it does not establish a visit, a route or a surveyed event location. Babylon's books are now [1,5,6,7,8,9,10,11,22]. Coordinates and modern-heritage disclaimer are unchanged; tob-14 remains unpinned and bar-01 stays at slot 5. The new card wording is an attributed paraphrase, not a quotation. |
| APF-001 | Resolved. | Freshly opened [RV 1895, 2 Maccabees 3:25–26](https://ebible.org/eng-rv/2MA03.htm). The revised m2-03 assigns the strike to the horse and scourging to the two youths. The surrounding miracle-account attribution remains. |

Source pages were opened on 2026-11-06. This was source-based web research; no separate Deep Research product was invoked. Neither passage is certified as independent historical evidence.

The aligned research rows were also read directly at d9a05c1: dc-ref-babylon, dc-tob-14-card, the added dc-ref-babylon-mention-tob14, and their work-index rows. The seven pre-existing Babylon mention edges remain gated 5,5,6,7,8,9,9. The implementation follows this separation.

## Exact-head verification

- Read the complete two-file correction diff and both actual files at caf70a87. Only the pack and its targeted tests changed; no engine change.
- Independently evaluated the parent and new pack with Node 24.22.1. Full object comparison found exactly three changed values: Babylon's books array and the text of tob-14 and m2-03. All other pack data, including all codex entries and later additions, are identical. Counts remain **327 events / 706 base codex entries / 77 later additions**, with five anchors.
- Compared all **20/20** prior sample keys between those evaluated packs: **19 unchanged**, one changed (m2-03), freshly source-checked above. The original deterministic seed, pool and selection are retained in the linked prior audit; no replacement sample or fresh rereading of the 19 unchanged entries is claimed.
- Ran the unmodified exact-head `tests/atlas-apocrypha.test.ts` with all seven CSV fixtures fetched from the same commit in an isolated local fixture: `node --experimental-strip-types --test tests/atlas-apocrypha.test.ts`, **18/18 pass**, including both new tests. This is not execution of the whole-project or browser suites. An initial independent comparison assertion used a mistaken hard-coded event index; replacing it with event-ID lookup yielded the three-value result above. It was a reviewer-script error, not a pack defect.
- Inspected exact-head [Actions run 42147439543](https://github.com/mckayec/universe-sandbox/actions/runs/42147439543) and its build-job steps: format, build, unit tests, distribution checks and standalone-page checks succeeded; deploy was skipped. This is independently inspected remote evidence. The builder's 102/102 full-suite count and 12×2 page count remain builder-reported; they were not locally reproduced here.
- Read the exact-head workflow and package scripts: the workflow does not run `test:browser`. PR #38's description now correctly states this and the reported software-GL timeout. APB-005/006 reporting follow-up is satisfied; a successful standalone-page job does not turn that timeout into a pass.

## Scope and handoff

The **18/19 APB** disposition is carried forward with the unchanged-content comparison; it is not a new 19-finding source sweep. All outstanding content corrections identified by the previous final audit are now closed, including the sole correction from its 20-item sample.

The previous confidence restrictions still apply: eleven Meqabyan U records stay excluded, slots 18–20 retain coverage notices, no additional L coordinate proposal is admitted, modern anchors are not exact narrated locations, and source/edition/OCR uncertainty remains visible. The two changed text passages introduce no unsupported chronology or geography. Q01–Q03 retain their recorded accepted dispositions, including the explicitly deferred exhaustive quotation inventory for this paraphrase-only build. This approval covers the owner-narrowed implemented scope, not missing Meqabyan research, every manuscript tradition, or a complete new primary-text reading.

**Technical remains unapproved.** APB-004 requires finished real-GPU surface evidence. The separate browser-smoke timeout and Claude's exact-head technical checklist/sign-off remain open. No new rendered capture or performance test was performed here, and the builder's unfinished images are not accepted as finished-surface evidence. Claude must retain these blockers until independently supported technical evidence exists.

Hand back to **final-audit / claude** for that technical pass, under PROMPTS §4. Do not advance to ready-for-owner without both sign-offs at the same revision. Any later content change needs a canon recheck; any later code change needs the appropriate technical rerun. Mckay's eventual release approval remains separate. No merge, deployment or release approval.

For PR #38 at **caf70a87b574da1073c2147e73d909eb2a9193ed** only:

**Canon: approved**
