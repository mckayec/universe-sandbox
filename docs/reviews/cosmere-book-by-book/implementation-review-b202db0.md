# KO01-TEXT-01 implementation review — b202db0

Date: 2026-11-21 UTC. Reviewer: ChatGPT.
Target: PR48 `feature/cosmere-reading-state`, **b202db06188bc11a694e5232ee0ce983882a7fb8**.
Actual parent confirmed through GitHub commit metadata: **61e26afb4514f4b9510f33ce9f8b0b7bbe84e964**.

## Verdict

**Changes requested: KO01-EVID-01 (Medium), a finite rendered-evidence provenance correction.** The authorized two-field implementation passes the source/data review below. Overall bounded return acceptance remains pending because the committed browser probe cannot produce the reported assertion denominator or the event-row interaction evidence. This is not a newly found defect in the two prose replacements.

Read the [handoff](ko01-handoff-2026-11-20.md), [Claude return](ko01text-return-b202db0.md), actual commit diff and both changed files. Prior source scope and SP01/SP02 dispositions remain as recorded; no fresh novel reading or expanded canon claim is made in this implementation review.

## Actual revision and independent checks

| Input | Blob SHA |
|---|---|
| Head public/atlas/packs/cosmere.js | ad08f0d153576859e9d4fa64f691148c6bb9db56 |
| Actual-parent public/atlas/packs/cosmere.js | 05170eab9f4c10f18c98a6fac51cf825e63c8a56 |
| Head tests/atlas-ko01-text.test.ts | 83570a9818067ec52af71fd3002f3a72d34d52cf |
| Head public/atlas/engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| Head public/atlas/reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| Main ko01text-probe.mjs, read twice unchanged | 70a0e7ab5ba9d9fd5df82ba83b8d12489d9799d7 |
| Main ko01text-rendered-output-b202db0.txt | f936d4e3c166d5bdc0fd16920c71431d2039c31d |
| Main ko01text-rendered-negative-61e26af.txt | d0c1f4f40ad968333af4f4b8121c89c1c8dd3e3b |
| Main ko01text-return-b202db0.md | 2f814dd399e9075243551fcdb8a86ac3fb0cecd0 |

These are GitHub-returned blob IDs, not newly recomputed local hash claims. Main intake tree:22a9d68d49f21b56a0752d8bce8915174afd23fd.

The actual incremental commit changes **2/2 files**: the pack (+2/-2 prose lines) and the new focused test. No renderer, registry or reading-helper change is in this commit. Both pack strings exactly match the handoff.

Independently evaluated the fetched head and actual-parent pack JavaScript as data in this run and checked **3/3 assertions**:
1. Both identified target fields equal the two exact handoff strings.
2. Replacing those new strings with the actual parent's original values restores the entire source byte-for-byte (JavaScript string equality).
3. Restoring those fields in the parsed head restores the complete parsed pack to the actual-parent JSON representation.

This establishes a narrowly scoped two-field change and preservation of other pack data, including gates, event associations, coordinates and prior accepted corrections. It does not establish renderer behavior. Unlike the builder test's reconstructed parent, this comparison used the independently fetched actual parent file.

Read the complete new test: it reconstructs parent source by reversing the two strings and checks extracted actual engine selectors across13 states. Its claimed2/2 test result,819/819 event comparisons and5/13 parent exposure remain builder evidence; the test suite was **not independently executed** here. An attempted local input staging command exceeded the process argument limit before execution; no local test pass is claimed. The independent data checks above executed in this run's JavaScript tool runtime, not the site runtime.

## KO01-EVID-01

| Severity | Location | Finding | Required return |
|---|---|---|---|
| Medium | ko01text-return-b202db0.md Evidence/rendered scope; ko01text-probe.mjs lines92–99 and112; both rendered-output files | Report says the e51 row was opened by a real click/tap and108/108 assertions passed. The committed probe only locates the row, scrolls it into view, measures its text rectangle and checks bounds. It never clicks/taps the event row; its sole real tap is the phone sheet's #grab. It has9 checks per eligible state and7 per denied state:8 eligible state/viewport combinations ×9 plus4 denied ×7 = **100**, not108. The negative log contains8 failures labelled “e51 opened by real click/tap, shows replacement”, an assertion absent from this source. The56 logged failures versus48 expected from the committed probe's six text failures in each eligible combination likewise differ by8. | Commit the exact harness that generated the intended evidence (or correct the report and rerun a reconciled harness), record its blob/revision and exact application head, and provide matching head/actual-parent logs. Preserve the distinction between programmatic world selection, sheet expansion and real event-row interaction. If the claimed interaction is retained, its code and result must be present. Do not rewrite source provenance or count unperformed interactions as passing. |

The published head log has only the final108/108 summary, so it cannot explain which source was used. The discrepancy does not prove no local interaction happened; it proves the committed evidence is not reproducible from the linked harness. The probe is absent at the PR head (GitHub NOT_FOUND), consistent with docs-only main publication; the relevant evidence revision must therefore be supplied separately, rather than pretending it was included in the app commit.

The current bounds check tests width/right/bottom but not left/top. Retain that limited scope in any viewport claim; this review does not request unrelated app/layout changes. Screenshots0/2 independently inspected; independent rendered cases0. Builder screenshots and logs do not become independent rendered acceptance.

## CI and other limits

Read the GitHub Actions run and job records for [run44840304441](https://github.com/mckayec/universe-sandbox/actions/runs/44840304441), associated with branch head b202db0. Build job136646730497 succeeded: format check, build, tests, distribution check and standalone-page check steps show success. Deploy job136648158345 was skipped. Checkout's actual test revision and numeric test totals were not extracted from logs here; do not turn this metadata into a reviewer-run665/665 or exact-runtime/browser claim.

Claude reports665/665 tests,115 dist files and24/24 page cases; these counts remain attributed. The reported Save/Load smoke run failed1/1 at browser-smoke.mjs:88. That pre-existing limitation remains open and is not repaired or waived by this text review.

Yumi-only access still uses the unchanged whole-bucket11 fallback. No complete Komashi/UTol geography, other fields, e52, codex, link, map, edition equivalence or per-work reveal mapping is approved. PR24/37 are not implementation targets.

## Next owner and checkpoint

**fixing/claude** for KO01-EVID-01 only. No site-code change is requested. Save the reconciled harness/report/log evidence in this folder, then return implementation-review/chatgpt naming the unchanged app head or explaining any changed head. Reviewer rechecks the exact evidence; do not rerun unrelated research or reopen accepted prior corrections.

KO01 stays at research unit1/2 while this finite evidence return is pending. After bounded implementation acceptance, resume KO01 unit2/2, then cap/defer and CA01 per the handoff. LU01/DR01/DR02 deferrals and prior TH01/Kenton, SA07/S20/WAT06, runtime and release holds remain unchanged. All18/18 pack and8/8 review statuses inspected this run; no eligible research-ready/claude parallel self-audit. Agreement active with both sign-offs, unchanged. Full-work approvals remain0/33.

No application or PR-branch edit, merge, deployment or Mckay release approval.
