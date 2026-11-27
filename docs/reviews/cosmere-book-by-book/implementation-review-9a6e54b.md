# Implementation review — SA07-WAT06-OMIT at 9a6e54b
ChatGPT, 2026-11-20 UTC. **Accept 2/2 requested field omissions as implemented.** WAT-06 is mitigated, not closed; full SA07 stays deferred at checkpoint 2/2. No full canon, runtime or release approval.

## Exact revision and scope
PR48 `feature/cosmere-reading-state`: **9a6e54bdf4f33364bc98b9f2482d75e1c5868857**; actual Git parent **36bbde8d6d0d188c04db1ea6c70c37623e7f2867**. Current head and commit parent were independently fetched. Both incremental files were inspected: the pack has two text substitutions; `tests/atlas-sa07-wat06.test.ts` is added.
| Input | Blob |
| --- | --- |
| Head cosmere.js | 0f5f5dd897f959bfa9afe4bb8af04bc95fb38f21 |
| Actual-parent cosmere.js | 92680a69eafaea2877851db4872b58006c9a46ea |
| Head engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| Head reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| New focused test | 30f5d13ac9c980faa1ef4f1c0fe5c7e08eea98a7 |

The [handoff](sa07-wat06-handoff-2026-11-20.md) is matched exactly: Roshar's Moons fact loses only the fourth-moon aside, and pool.desc loses only the Cultivation-departure sentence. The retained values are exact. IDs, geometry, book lists, gates, eras, ancestry, other facts and all other pack data are unchanged. This review does not re-certify the baseline text.

## Independent verification
[Reviewer reproduction](reviewer-wat06-9a6e54b.ts), Node 24+: `node reviewer-wat06-9a6e54b.ts INPUT_DIR`. Use the five files above as head.js, parent.js, engine.js, reading.js and test.ts. The reviewer adapts the committed test to read the actual fetched Git parent instead of reconstructing it from the candidate; adds exact-source equality and verifies all five Git blob hashes.

- **5/5 hashes verified**, **3/3 tests pass**: payload, actual-selector states and whole-source equality after exactly two substitutions. Whole parsed pack equals the parent after reversing only the authorized fields.
- **14/14 states**, **882/882 event comparisons** (63 × 14), **728/728 Roshar-site comparisons** (52 × 14), and 14/14 world-hidden/pool-seen comparisons unchanged.
- Original moon clause is reachable in **10/14** parent states; original departure clause in **7/14**. Neither is returned from the head in **14/14** states. Earlier legacy and per-work exclusions are included; parent-first restrictions stay intact.
- `PARENT_NEGATIVE=1 node reviewer-wat06-9a6e54b.ts INPUT_DIR`: **0/3 pass, 3 expected failures** (old moon value, facts payload and source substitution guard). This negative run stops each failing test at its first failure; it is not a completed negative 14-state sweep.
- Local file-transfer initially added a trailing newline and failed the head hash guard. The extra transfer newline was removed; all five hashes passed before tests. No repository file was altered to make the test pass.

## CI checked independently
[Actions run 44723426502](https://github.com/mckayec/universe-sandbox/actions/runs/44723426502), build job 136244712928: success. Logs confirm checkout **74aab5cdd527c3c2425acce78dfaccc34bfa2fa3**, a synthetic merge of head 9a6e54b into main **3378f91e4004fbd3e112f5e9ae56e2998fc1212a**. Thus these are independently inspected integration-CI results, not a standalone exact-head full-suite rerun.
- Frozen install, format check, build, **659/659 tests**, **115/115 distribution files** and **24/24 page/viewport checks** (12 × 2) passed.
- Deployment was skipped.
- Exact-head independent evidence in this review is the focused local reproduction above. Claude's reported branch-local pnpm checks remain separately attributed.

## Rendered return and limitations
Read [Claude's return](sa07wat06-return-9a6e54b.md), [probe](sa07wat06-probe.mjs), [head output](sa07wat06-rendered-output-9a6e54b.txt) and [actual-parent output](sa07wat06-rendered-negative-36bbde8.txt). The builder reports **134/134 head**, **66/134 parent** (68 expected failures) across eight states at two viewports. The probe's assertion structure supports that denominator; the negative log records old-copy failures.

These results are **builder-attributed**, not an independent browser execution: **0 independent rendered cases; 0/2 linked screenshots inspected**. Roshar selection is programmatic. Facts and pool descriptions are direct DOM reads; pool selection uses a real click on desktop and `tap()` on phone. Low reporting qualification: phone panel expansion uses `p.click('#grab')`, not the tap described in the return and probe comment. This does not invalidate the finite text omission, but is not phone-touch proof for the handle. No physical device, surface-route, search/graph/modal coverage or visual-layout approval is claimed.

The return reports Save/Load browser smoke **0/2 passes** at browser-smoke.mjs:88; not independently rerun here. Preserve that limitation rather than treating CI's standalone-page checks as a substitute.

## Disposition and continuation
SA07-WAT06-OMIT accepted for **2/2 fields only**. WAT-06 still lacks its later-state model: the update is absent even in All/complete views, and retained pool wording is the pre-Stormfall baseline, not evidence of continued gateway operation after WaT. This is the explicitly accepted completeness cost of the scoped mitigation.

Preserve S20/WAT-02's direct-primary sequence discrepancy, all other WAT-01–15 gaps, eight bridge holds, prior SA01–07 scoped acceptances, and PR24/37 ownership. No fresh primary book passages were read in this implementation review; no separate Deep Research product was invoked. **0/33 full-work audits approved.**

Next owned bounded unit: **TA01, White Sand volume 1**. Begin by fetching fresh PR24/37/48 heads and packs, inventorying Taldain/Dayside/Darkside/Kenton/sand-mastery fields and applicable events, reconciling prior corrections, and opening official volume-1 versus omnibus source/edition information. Keep TA04 omnibus additions distinct from original volume 1; do not infer plot or earliest-reveal gates from a synopsis. Checkpoint incomplete research at research/chatgpt, at most two bounded research checkpoints before handoff/defer under R3. No new universe activation while WIP remains over limit.

This completed implementation-review unit is saved before status advances to research/chatgpt. All **18/18 pack** and **8/8 review** statuses were fetched on current main; this was the only ChatGPT-owned item, with no eligible research-ready/Claude self-audit. No site-code or PR-branch edit, merge, deploy or Mckay approval.
