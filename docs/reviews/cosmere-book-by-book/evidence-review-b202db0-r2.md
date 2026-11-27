# KO01-EVID-01 recheck — evidence revision 2

Date: 2026-11-21 UTC. Reviewer: ChatGPT.
Application: PR48 `feature/cosmere-reading-state`, **b202db06188bc11a694e5232ee0ce983882a7fb8**; actual parent **61e26afb4514f4b9510f33ce9f8b0b7bbe84e964**.

## Verdict

**KO01-EVID-01 closed (1/1). KO01-TEXT-01 accepted for its two authorized prose fields (2/2) at this exact application head.** This accepts the bounded correction and reconciled builder evidence, not a full-book canon audit, independent rendered pass or release. The [original review](implementation-review-b202db0.md) remains intact; its provenance finding was valid for the old evidence.

Read [Claude's evidence return](ko01text-evidence-return-b202db0.md), the complete rewritten probe and both complete verbose r2 logs. The prior uncommitted108-check harness remains unrecoverable, and its historical logs remain explicitly superseded. Newly committed/rerun evidence is not retroactive proof of the earlier execution.

## Independent source and evidence checks

Fresh PR and commit metadata confirm the same app head and parent. The actual incremental diff still comprises2/2 files: cosmere.js (+2/-2 lines) and tests/atlas-ko01-text.test.ts. Re-fetched both pack files; GitHub blobs remain head **ad08f0d153576859e9d4fa64f691148c6bb9db56**, parent **05170eab9f4c10f18c98a6fac51cf825e63c8a56**. The initial review's complete test-file inspection and unchanged-source dispositions carry forward; no new test execution is implied.

Independently executed3/3 JavaScript data checks this run against the actual fetched files: exact2-field handoff strings; replacing only those strings restores the complete source to the actual parent; restoring only those parsed fields restores the entire parsed pack. All pass. These are source/data checks, not browser tests.

| Current main evidence | GitHub blob |
|---|---|
| ko01text-evidence-return-b202db0.md | f88da97939c2c8641c0738aa8b49acf0b4f18add |
| ko01text-probe.mjs | 970b1c9d3bd876adcd58396eb343aba79e17d8e2 |
| ko01text-rendered-output-b202db0-r2.txt | ab4c434bb7257b54378f96af354d8d6e76408ce2 |
| ko01text-rendered-negative-61e26af-r2.txt | 316d1c977bc8dbe76ce4edda28c0b29925db32cf |

These identifiers match the return's4/4 declared evidence blobs. They are GitHub-returned IDs, not independent local hash recomputations.

The rewritten source actually invokes page.click(row) on desktop and page.tap(row) on phone, checks S.ev, open class and replacement text, and then checks positive width/height plus left/top/right/bottom bounds. Programmatic world selection and phone sheet expansion remain separately identified. It performs10 assertions per eligible combination and7 per denied combination:8×10+4×7=108.

Independently counted all216/216 assertion lines across the two verbose logs:
- Head108 successes,0 failures;8/8 opened-row records show e51/open/replacement;8/8 box records satisfy the recorded viewport bounds.
- Parent52 successes,56 failures; all56 failures are the expected seven text assertions in each of8 eligible combinations.8/8 opened-row records show the original text and successful opening;8/8 viewport checks pass.
- Both logs include all12/12 state/viewport combinations. Four denied combinations preserve absence;12/12 no-error assertions per log pass.

The negative control is the same head runtime with the actual-parent pack swapped, as explicitly reported, not a complete independent parent-runtime build. For this two-field-only application change that is an appropriate scoped control. Log contents now agree with the committed harness. Execution provenance remains builder-attested; independent inspection of the code and logs is not independent execution.

## Limits retained

Independent rendered cases0; screenshots inspected0/2. No new pnpm/check/page suite execution this run; prior CI step-success evidence and builder665/665 tests,115 distribution files,24/24 pages retain their original attribution. Save/Load smoke failure remains open. The probe covers the event text box, not the entire sheet or blurb; rounding box coordinates to0.1px limits subpixel precision. Claude's reported pre-existing clipped Descend button remains an attributed out-of-scope observation, not a new independently verified defect or blanket layout approval.

Yumi-only access still has the whole-bucket11 fallback. Other Komashi/UTol facts, sites, e52, links, codex, geometry, map/edition equivalence and reveal mapping remain unverified as previously recorded. PR24/37 are unchanged comparison snapshots, not targets of this acceptance. No complete SP01/SP02 closure across all branches is claimed.

## Continuation

Resume **research/chatgpt, KO01 unit2/2**: seek lawful published later passages/maps for machine-era explanation, geography and UTol; keep earlier Y01–Y07 private-passage findings attributed unless actually reopened. At the shared cap, provide finite sourced corrections or defer the full audit and continue CA01. This evidence recheck does not consume a research unit.

All18/18 pack and8/8 review statuses inspected; no eligible research-ready/claude parallel self-audit. Agreement and sign-offs unchanged. Preserve LU01/DR01/DR02 deferrals, prior accepted corrections, SA07/S20/WAT06 and source/runtime/release holds.0/33 full-work approvals. No code/PR-branch edits, merge, deployment or Mckay release approval.
