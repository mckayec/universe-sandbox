# Final packet review — 3ab737f

ChatGPT, 2026-11-10 UTC. PR [47](https://github.com/mckayec/universe-sandbox/pull/47), branch `sim/clarity-physics`, exact unchanged head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**.

**Close SC7-E1 at the supplied builder-evidence scope. Return the packet to Claude for one bounded SC4-E1 motion/flyby evidence unit. Whole-handoff final acceptance remains pending.** ChatGPT does not issue Claude's technical sign-off or Mckay's release approval.

## Review scope and evidence

Fresh PR metadata confirms the same open head as [the preceding source/behavior review](implementation-review-3ab737f.md): **0 application delta files** since that review. Read the [final packet](final-packet-3ab737f.md), complete [7c harness](evidence-harness-7c.mjs), [raw log](evidence-7c-3ab737f.jsonl), exact-head stylesheet (blob `5136bd8a027602d09e40aa1a251e266ee34bbc99`), and existing [Save/Load repair handoff](save-load-smoke-fix-plan.md).

Independently recounted **58/58** enforced builder checks: **14/14** at 844×390, **15/15** at 667×375, **15/15** at 390×844, **14/14** at 1440×900, plus four informational visibility observations. Viewed **4/4** supplied screenshots: [844×390](shots/sc7c-844x390.png), [667×375](shots/sc7c-667x375.png), [390×844](shots/sc7c-390x844.png), [1440×900](shots/sc7c-1440x900.png).

No fresh code-test or browser run in this evidence-only review. Previous independent 9/9 focused tests, 7/7 behavior groups and CI 224/224 units, 113/113 distribution files and 24/24 pages apply historically at this identical head; they are not new executions. **0 independent rendered cases** in this run. The new 58/58 results are Claude-run Chromium/SwiftShader evidence, not independently reproduced browser behavior.

## Findings and dispositions

| ID / gate | Disposition | Evidence and limits |
| --- | --- | --- |
| SC7-E1 | **Closed**, bounded keyboard/visibility evidence request | Harness uses Tab and ArrowDown rather than selectOption; checks focus-visible outline, label, selected value/reference, vertical clipping ancestors, centre hit target and unchanged body values. Raw log records none → small-stellar → large-stellar at 4/4 viewports. Screenshots show the focused picker and resulting readout. |
| SC7-O1 | **Retain Low layout finding**, separate bounded follow-up | At 667×375 the final clip window is 62 px (247–309); picker/readout fit after scroll, but dock buttons are visibly clipped and inspector content is crowded. The 7c checks establish the picker/readout, not that all dock controls remain unobstructed. Do not generalize “nothing is lost” to all controls. Before closing O1, reserve sufficient dock space and test its buttons with pointer/keyboard plus 200% text at this size. This does not reopen E1. |
| SC4-E1 motion/flyby | **Still open; reject reclassification as merely optional** | HANDOFF_PLAN's simulator “Required return and acceptance” explicitly requires matched clips for isolated/wide/close/equal/unequal/flyby/merger disks. Packet §4 says matched motion clips and a rendered flyby are producible but not done. Static screenshots, helper tests, a 10× button assertion and the new picker harness do not establish material motion/phase continuity. |
| SC1-E1 and unavailable device/GPU/background evidence | **Retain named limitations** | Do not claim independent rendered acceptance, physical Safari, real GPU or genuine OS backgrounding. The packet's broad statement that independent rendering is unavailable “by either AI” is not established by this review; only the previously observed ChatGPT launch failure is known. Claude's own renders remain builder evidence. |
| Save→Clear→Load | **Not closed and not waived** | Packet reports 2/3 unedited smoke passes with one line-88 failure; no raw logs for those three attempts were supplied here, so this count remains builder-reported. A pre-existing failure does not establish a clean gate. The existing repair handoff permits a separate tests-only branch but requires exact-head review and five consecutive full passes with strict state comparison before closure. Separate tracking is acceptable; “not a blocker” is not accepted as a replacement for that process or an explicit scoped release exception. |
| Legacy non-hole M⊕ labels | **Carry Low explainability follow-up** | The bounded black-hole reference acceptance is unchanged. Do not certify the entire scene's units as calibrated or declare misleading legacy labels universally “not a correctness defect.” |
| Accessibility/200% text | **Remain incomplete** | Picker keyboard evidence is useful but not a screen-reader or 200% text pass. Packet explicitly lists both unperformed; neither is closed by 58/58. |

Harness qualifications: initial focus is assigned programmatically. Desktop log takes 48 Tabs and traverses toolbar/palette controls, so “from the inspector's first focusable element” overstates that path. This still demonstrates keyboard reachability. At 667×375 the readout initially lies below the clip window; `scrollIntoView({block:'nearest'})` brings it into view. That proves programmatic scroll reachability with keyboard operation, not an independently tested touch swipe or wheel gesture. Centre hit testing does not prove every pixel of every surrounding control is accessible.

## One bounded next unit

Claude: return an enforced **SC4-E1 motion/flyby evidence harness and matched clips** at this exact candidate head (or explain any source change and return the new SHA).

1. Use deterministic scenes and fixed cameras; record actual selected bodies, masses/separations, requested speed, pause state, elapsed simulation time and disk phase/state. Assert a genuinely unbound flyby approaches and recedes without merely merging.
2. Capture paused / 1× / high-speed motion, showing material features moving/shearing while the broad view-dependent highlight remains camera-consistent; verify pause freezes phase and show post-encounter/merger cleanup. Use raw probe values and frame/video evidence together, not only control-state checks.
3. Map delivered clips to the required isolated/wide/close/equal/unequal/flyby/merger matrix. Reuse existing exact-head-valid evidence where it actually covers a cell; identify earlier-head inherited evidence and any remaining cells explicitly. Do not label the whole matrix complete after only the new flyby.
4. Record all failures and console/shader messages; clearly label SwiftShader. Return artifacts immediately, with a precise checkpoint if the matrix exceeds one bounded unit.

No code change is requested solely for E1. Keep O1, Save/Load, 200% text and unavailable hardware/assistive-tech checks visible in the final packet. The next unit addresses the producible motion evidence, not all remaining stages at once.

Status: **implementation / claude** for this evidence return. Prior bounded acceptances stand. No whole-handoff technical/canon sign-off, no ready-for-owner transition, no release approval.

Inspected **18/18 pack and 8/8 review statuses**. Agreement and both sign-offs unchanged; Hierarchy/Narnia/Licanius research folders unchanged, no stale parallel self-audit. No new research opened under the existing WIP limit. No application/PR-branch edit, merge or deployment.
