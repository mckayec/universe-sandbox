# Implementation review — SA07 text return at 36bbde8
ChatGPT, 2026-11-20 UTC. **Accept the implementation of SA07-OPEN-01 and SA07-HOID-01, 2/2 requested text corrections.** This is a bounded implementation acceptance, not full canon, spoiler-system, rendering or release approval.

## Revision
PR48 `feature/cosmere-reading-state`: **36bbde8d6d0d188c04db1ea6c70c37623e7f2867**. Actual parent: **5c59d326e1e2fb188b75203cdfd594c08c77ef2a**. Current PR head, commit parent and both changed-file patches were retrieved from GitHub.
| Input | Git blob |
| --- | --- |
| Head cosmere.js | 92680a69eafaea2877851db4872b58006c9a46ea |
| Actual-parent cosmere.js | b10a2f5d0bda2710c38afa5f70f36072207d0bbc |
| engine.js | 0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0 |
| reading.js | 4d9bc177294e5e33accf6f19825ef467f0bb90d4 |
| tests/atlas-sa07-text.test.ts | 003b16ad97b4eccd39bf8a306491ef3c45a0c30a |

Only e55.text and e60.text change in the pack (+2/−2); one focused test file is added. The new text exactly matches [the handoff](sa07-handoff-2026-11-20.md). IDs, titles, book 12, worlds, e55 Urithiru association, e60's absent site, gates, event order, codex and all other data remain unchanged. Whole source equals the separately fetched parent after exactly those two replacements; whole parsed pack equals it after masking the two fields.

## Independent evidence
[Reviewer script](reviewer-sa07-36bbde8.ts) adapts the pinned builder test to use the **actual fetched parent**, not its reconstructed parent. It checks all five Git hashes and adds exact-source equality. Reproduce with Node 24+: `node reviewer-sa07-36bbde8.ts INPUT_DIR`; input names and expected hashes are embedded.
- **5/5** input blob hashes verified.
- **3/3** tests pass: payload/whole-pack comparison, visibility, source equality.
- **12/12** reading states compare **63/63** events (**756/756** event values), Urithiru eligibility (**12/12**), Roshar hidden state (**12/12**) and Scadrial hidden state (**12/12**).
- Each corrected event is eligible in All, legacy12 and all works (**3/12**) and withheld in the remaining **9/12**, preserving the handoff's conservative ancestor/fallback behavior.
- Actual-parent negative control (`SA07_PARENT_NEGATIVE=1`): **1/3 pass and 2/3 expected failures**. Visibility passes; payload and new-text/source guards fail. No new per-work mapping is certified.

## CI and builder evidence, kept separate
Inspected [Actions run 44715712313](https://github.com/mckayec/universe-sandbox/actions/runs/44715712313), build job 136218450888 and logs. The run is associated with PR head 36bbde8, but checkout logs identify **synthetic merge d91a7cf77dd1f0a778e04377615c2aa8c6a834df**, merging that head into **808c93097c3dff042cceca8bd1ed5a7dd144594d**. Do not call this an exact-branch-head full-suite rerun.
Verified CI results: format check, build, **657/657** tests, check:dist, standalone pages **12 × 2 = 24/24**. Deploy is skipped. The independent checks above ran the fetched branch-head files themselves; the full CI suite was not locally rerun.

Read [Claude's return](sa07text-return-36bbde8.md), [render probe](sa07text-probe.mjs) and [output](sa07text-rendered-output-36bbde8.txt). The probe uses real click/tap for event opening, programmatic world selection and a real mobile-panel click. Reported head **144/144** assertions, actual-parent **96/144** with **48/144** expected copy failures, across **24/24** head loads. The saved head output lists per-assertion successes and the parent failures.

One precision limit: e60's “place label observed” check asserts item existence, not that the label is null. The return reports null on head/parent; the reviewer independently confirms only that e60 has no site in the source. Do not promote that probe line into a strict null-label assertion.

**0 independent rendered runs or screenshot inspections in this review.** Claude's results remain attributed; source/DOM evidence is not surface-route travel. Chronicle travel/surface rendering remain unverified here. Claude reports **3/3** browser-smoke attempts failing at browser-smoke.mjs:88 Save/Load wait; not independently rerun and not cleared by this acceptance. No blanket browser pass.

## Dispositions and continuation
| Finding | Resolution |
| --- | --- |
| SA07-OPEN-01, Low, e55.text | Implemented exactly. Existing countdown distinguished from fresh negotiation. Prior opened-preview evidence retained. |
| SA07-HOID-01, Medium, e60.text | Implemented exactly. Recovery, later employment and intended search distinguished. Prior primary-packet provenance and secondary corroboration retained, including its primary-scene completeness limitation. |

This review checks conformity to the sourced handoff; **no fresh novel passage or separate Deep Research product was invoked**. It does not upgrade incomplete primary coverage to certification. Full WAT-03 codex/route requirements are not closed by this e60 repair.

WAT-02's S20/secondary ordering conflict, WAT-06 residual base-field spoilers, other 15-unit dispositions, eight cross-work bridge holds, and magic/connection specification remain open. SA01–06 scoped acceptances remain intact. **0/33 full-work audits approved.** PR24/37 ownership and release gates unchanged.

**Continuation checkpoint — research / ChatGPT:** first reopen the prior S20 source register and seek the exact primary sequence around chapter 143; compare renunciation, destruction and absorption separately, retaining the conflict if direct text remains unavailable. Then take WAT-06's Roshar moon fact and pool disappearance sentence as a bounded field/ancestor exposure unit at current PR48, reconciling current PR24/37 before any request. Do not import PR37 landmarks or broaden gates from book order alone. Save source availability, checked fields and held claims explicitly. No code edit, merge, deployment or Mckay approval.
