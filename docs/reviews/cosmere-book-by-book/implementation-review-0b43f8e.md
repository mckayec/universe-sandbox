# SH-D1–03 implementation review at 0b43f8e

ChatGPT, 2026-11-17T01:24Z.

**Result: 3/3 requested payload dispositions accepted at source/selector scope; the complete return remains pending one finite evidence finding, SH-E1.** Route implementation-review/chatgpt → fixing/claude. No new canon claim or release approval.

## Exact scope and independent checks

- PR48 `feature/cosmere-reading-state`, head **0b43f8ee562b232387e9342d00985c91df9663fb**, parent **f793e1142ec1eb550507c29e2da1b2809e17312c**. Head reread unchanged before publication.
- Read all **3/3 incremental file patches** (+62/−4), their complete head files, unchanged engine/reading inputs, [the requested handoff](secret-history-omission-handoff-2026-11-17.md), [Claude's return](sh-omission-return-0b43f8e.md), rendered probe and both rendered logs.
- **6/6 local input Git blob hashes match GitHub**, including the parent pack. Exact hashes and counts: [reviewer output](reviewer-sh-output-0b43f8e.json).
- Independently ran `node --test tests/atlas-scadrial-reduced.test.ts tests/atlas-realms-gate.test.ts` on Node v24.22.1 against the fetched head inputs: **476/476 pass**, 0 failures/skips/cancellations. These are focused tests, not 476 browser cases.
- Independently parsed both packs in fresh Node VM contexts. Verified all three target values, restored only those targets in the head object in memory, and obtained deep equality of the entire parsed pack with the parent. No unrelated pack change was found.

| Disposition | Verified implementation | Decision |
| --- | --- | --- |
| SH-D1 | Scadrial `realms` is empty; the entire world-specific Cognitive bundle is absent. | Accept payload omission. |
| SH-D2 | Only the Scadrial subastral row's `name` is removed; row and other properties remain. | Accept label omission. |
| SH-D3 | Global selected-world fallback matches the handoff's exact neutral text. | Accept replacement. |

The added 38-state matrix exercises the actual extracted `realmCard`/`realmLook` selectors. The seven old gate regressions now assert the real bundle is absent before installing a clearly labelled synthetic fixture; they continue to test gate behavior without representing fixture values as canon. The 476-test pass supports this bounded selector/test adaptation. Engine and reading helper are unchanged. Prior accepted MB01/MB05/MB10 and CBR work is preserved.

## SH-E1 — completed surface evidence missing (Medium, validation gap)

**This is an evidence gap, not a reproduced application rendering defect.** The required return asks for descended Scadrial's generic material at **1440×900 and 390×844**. I directly inspected both supplied surface screenshots: both display **“Charting surface”** and a dark planet. Claude accurately discloses this limitation.

In [sh-omission-probe.mjs](sh-omission-probe.mjs), the descent wait tests only whether `__atlas.PL.w.id === "scadrial"`, then waits 800 ms. At this exact engine head, `buildPlanet` assigns `PL` after queuing the incremental bake; that assignment does not mean the bake has completed. The screenshots and uniform assertions therefore show the selected material configuration and an intermediate rendered state. They do not close the requested finished-surface check. The probe's `notRun:0` refers to its existing PL predicate; it is not proof that both surface renders finished. Its current exit code also ignores `notRun`.

**Finite correction for Claude:**

1. Keep SH-D1–03 and all accepted gates/copy unchanged. Strengthen this evidence probe to distinguish assembly availability from completed surface rendering. Wait for the intended world and Cognitive realm, completed bake/loading indicator, and subsequent rendered frames; recheck material uniforms at capture time. Do not count a timeout as completion.
2. Supply **2/2 finished surface captures**, desktop 1440×900 and phone 390×844, with the exact audited application head and readiness result. Inspect both images. A clearly disclosed existing reduced-resolution diagnostic mode can establish that bounded rendering path; it must not be described as the default-resolution pass. No engine change is requested.
3. If the surface cannot finish within the bounded run, record the exact failing/readiness condition as incomplete and keep a precise fixing checkpoint. Make a missing required case fail the probe or explicitly prevent an all-complete verdict. Do not rerun unrelated research or infer the unverified visual result from the uniform values.

Return the narrow evidence correction for implementation review. Do not reopen the three payload edits or restart the capped MB09 source search.

## Evidence accounting and remaining limits

- Independently viewed **3/8** supplied screenshots: both surface captures and the phone Cognitive dossier. The dossier's neutral text and retained Physical section are legible; this is inspection of supplied evidence, not independent browser execution.
- Independent browser execution this run: **0 cases**. No browser launch or full repository suite was attempted in this bounded review.
- Claude's saved rendered logs report **86/86 head** and **52/86 parent** checks, with 34 negative-control failures. I read the probe/logs; these remain builder-executed DOM/uniform checks, not my browser results or 2/2 finished-surface passes.
- Claude reports **629/629** repository tests, **24/24** page cases and **430/476** focused parent tests. Those complete executions were not independently reproduced here. GitHub check metadata independently shows [build success and deploy skipped](https://github.com/mckayec/universe-sandbox/actions/runs/43990596124) for the requested head; job logs/CI checkout parity were not audited in this run, so metadata is not used to independently certify those detailed counts.
- The reported browser-smoke timeout at `tests/browser-smoke.mjs:88` remains unresolved in this return. No fresh parent execution establishes its pre-existence here. Do not import PR47 or treat the smoke failure as a pass.
- All earlier canon holds remain: global Cognitive home-card text, global look/geometry, threshold, other subastral names, perpendicularity content and retained Scadrial row geometry/`first:7`. Omission acceptance does not certify these.
- Deferred MB09 ledger: **0/2 missing witnesses obtained, 0/1 whole Cognitive blurb certified**. Whole-parent/full-work ledger unchanged: **0/2 parent promotions; 0/33 full-work approvals**.

Run intake inspected **18/18 pack statuses and 8/8 review statuses** on current main. This was the only owned eligible unit; no stale research-ready/claude self-audit was eligible. Agreement with both sign-offs remains unchanged. No site-code or PR-branch edits, merge, deployment, final canon sign-off or Mckay release approval.
