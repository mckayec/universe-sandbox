# Item 6a evidence completion — PR #47

Reviewed 2026-11-10 UTC by ChatGPT. Branch `sim/clarity-physics`, exact application head **8de912810c3fe029b79623f762b5eab325bc1236**.

**Close SC6-E2 and accept the bounded 6a label/Details/quiet-feedback implementation, with the limits below. Return implementation / claude for Kids 6b and the compact layout correction SC6-O1, then catalog/units item 7.** This does not accept the whole mobile/Kids scope or authorize release.

## Evidence disposition

Fresh GitHub PR metadata confirms the same open, unmerged head as the [preceding correction review](implementation-review-8de9128.md). The comparison against that audited head is identical: **0 application commits and 0 changed files**. This is an evidence-only return; prior source/handler findings are not reopened.

Read the complete [committed harness](evidence-harness-6a2.mjs), blob `07830c82502b913960dc4edbd0b7f810b7c51db0`, and [new raw log](evidence-8de9128-e2.jsonl), blob `5688f98ec64d42eb2e0ca454ea5cffd5c5257a8e`. Independently parsed all six JSON records and counted every result: desktop **29/29**, compact **30/30**, total **59/59** true checks, no failed rows. These are independently inspected **builder-run results**, not a reviewer browser execution.

The builder receipt identifies the exact head, byte-identical harness, command, default viewports with idle enabled at both, Node v22.23.4, Playwright 1.62.1 bundled Chromium with SwiftShader, run timestamps, exit 0 and empty stderr. Exit/environment assertions remain attributed to that receipt; the raw result counts agree. The old **53/54** log is preserved as historical evidence.

- Both viewport logs record Planetary fragmentation in the timeline, running at 10x before and after the event, and zero observed banner mutations during the measured simulation window.
- Both record idle start and one restart: two loads, attract badge visible, zero banner mutations and hidden narration card. This fills the previously omitted desktop idle case.
- The resize records contain Quiet Black Hole at both layouts, full desktop text and shortened compact text, with the same named object restored after resizing back. The extra Drifting Cloud element no longer creates a false whole-array mismatch. The nonempty long-name precondition is present, and the actual recorded opposite-layout values are also nonempty.
- The harness exits unsuccessfully on a failed check. Its variable `sound` still measures narration-card visibility, not audio. Desktop Details is invoked through the DOM handler because the control is hidden; that is not a desktop pointer-interaction test.

SC6-T1/T2 remain closed at the source/handler scope established previously; the requested rendered evidence return is now supplied. SC6-E1 remains addressed. SC6-E2 is closed.

## SC6-O1: compact legend obscures guide content — Low, open for 6b

Viewed **4/4 supplied screenshots**: [desktop labels](shots/sc6e2-labels-1440x900.jpg), [desktop quiet](shots/sc6e2-quiet-1440x900.jpg), [compact labels](shots/sc6e2-labels-390x844.jpg), [compact quiet](shots/sc6e2-quiet-390x844.jpg).

The 390x844 quiet image visibly places the science legend across the Restart / Exit guide button area. The compact labels image also shows the legend over guide prose. This is a confirmed visual readability defect, not a demonstrated failure of button activation.

Read [src/style.css at the exact head](https://github.com/mckayec/universe-sandbox/blob/8de912810c3fe029b79623f762b5eab325bc1236/src/style.css#L1419), blob `6c4fd601e9a3cbd9d6254f809c94e9bf07173528`. The legend is independently absolutely positioned, and its compact rule uses a fixed top offset while allowing wrapping. It has `pointer-events: none`, so the screenshot alone does not establish pointer interception. No hit-test or keyboard activation was executed in this review.

**Claude's finite correction:** include this in the next mobile/Kids 6b unit rather than leaving it as accepted layout. Allocate nonoverlapping space for the legend, guide prose and controls as content wraps. Keep scientific labels and controls available. Return screenshots and actual pointer plus keyboard activation of Restart / Exit guide, with the guide and legend visible, for the binary-stars and collision-lab cases at 390x844; include the already-required short-landscape and 200% text checks. State separately any physical-device or screen-reader cases not performed. No final mobile-layout acceptance until this is resolved.

The visible Guided exhibit banner in the quiet screenshots is consistent with the permitted visitor-action banner recorded before the measured 10x window. The still images cannot independently date it; the log records no new mutations in that window. It is not evidence of an unsolicited idle banner.

## Scope and continuation

The prior review's independent **12/12 focused tests**, **9/9 actual-handler groups** and **13/13 input blob checks** remain prior results at this identical head; they were not rerun here. Likewise its inspected CI evidence (184/184 unit tests, 113/113 distribution files, 24/24 standalone-page cases on equivalent source) is retained, not reported as a new test run. This run performed no browser execution: **0 independent rendered cases**. The preceding run's Chromium launch failure is historical, not a fresh attempt.

Kids 6b is unfinished: one placement per armed Add, reversible grown-up controls and input gating, Home fitting the existing scene, no idle replacement, preserved save/load/history/adult preferences, interruption/cancel/repeated-tap and accessibility checks remain required. Item 7 catalog/units is also unfinished. Keep SC1-E1/SC4-E1 motion/phase/flyby/background/ignition obligations, Save→Clear→Load smoke limitations, real GPU, physical iPhone/Safari and unperformed accessibility checks explicit. A partial implementation and builder evidence do not satisfy those release gates.

Run triage inspected **18/18 pack statuses and 8/8 review statuses** on main. Simulator clarity was the only ChatGPT-owned unit. Hierarchy/Narnia/Licanius research folders were unchanged against main checkpoint `ffeec3dd93670df5e4d13db467a813655e2d3ab7`; no stale parallel self-audit was identified. Other owners, existing decision blockers, WIP and the both-signed agreement remain unchanged. No code or PR-branch edit, merge, deployment or Mckay release approval.
