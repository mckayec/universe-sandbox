# SC6-K3 correction return — 20837c0

Claude, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, exact head **20837c0211575d03ed0ad3ff3c34fcb98adeb653**; parent (reviewed) **a50f1aa58ce6e26756a5b0e2b4510c8079a81532**. Scope: only the SC6-K3 gesture-identity remainder in [implementation-review-a50f1aa.md](implementation-review-a50f1aa.md). SC6-K1/K2, 6a and SC6-O1 code is unchanged.

## Fix (4 files)

- `src/kids-mode.ts`: the global boolean is replaced by a per-pointer record `DialogPresses` = `down` (pointer → press began in the dialog), `released` (pointer → origin, awaiting its click) and `last` (most recent release). Pure helpers `notePointerDown/Up/Cancel`, `resetDialogPresses` and `dialogClickAllowed(state, click)`:
  - `detail === 0` (keyboard / assistive activation) is always allowed.
  - Otherwise the click's own `pointerId` selects the record (Pointer Events 3 §4.2.12.1: pointing-device clicks carry the causing pointer's id). A click with no usable id (`undefined` or negative with `detail > 0`) falls back to the most recently released pointer — the pointer whose release dispatches that click.
  - The matching authorization is **consumed** by the click; `pointercancel` deletes it; a new press of the same id overwrites it (reused mouse id 1).
- `src/ui/kids.ts`: window-capture `pointerdown` / `pointerup` / `pointercancel` listeners (registered before the gate) record per pointer. Opening the dialog (Grown-ups) and closing it (Stay / Leave) call `resetDialogPresses`, so only presses made on the open dialog count and nothing outlives the dialog. The gate passes the click event itself.
- `src/state/app-state.ts`: `app.kidsPressInDialog` → `app.kidsDialogPresses` (per-pointer record).
- `tests/kids-cancel.test.ts`: updated contract test plus three new SC6-K3 tests (both interleavings with and without pointerup, canceled / consumed / reused / dialog-lifetime / pointer-less clicks, reset wiring).

Not done: no rejection of multi-touch or of all `detail === 0` input; the browser's own click generation is unchanged.

## Evidence

- `pnpm format && pnpm check`: format OK, build OK, **204/204 units** (201 + 3 new), check:dist **113 files OK**. `pnpm test:pages` was not re-run this return (aborted under CPU contention with a parallel probe); CI on the PR will run it.
- **Actual-handler runner** [builder-kids-k3.mjs](builder-kids-k3.mjs) (reviewer-kids-a50f1aa.mjs adapted to the per-pointer state shape: same extraction of the real `gate`, plus the real `notePress` / `noteRelease` / `noteCancel`) → [output](builder-kids-k3-output-20837c0.json): **18/18** at head — the five held-touch cases, the reviewer's two no-pointerup interleavings, both interleavings with pointerup, cancel, pre-reopen press, reused id, pointer-less clicks and a second click after consumption. The reviewer's original runner cannot run unmodified at this head because its adapter seeds the removed `kidsPressInDialog` field.
- **Rendered CDP evidence** [evidence-harness-6e.mjs](evidence-harness-6e.mjs), production build, SwiftShader, emulated **390×844 and 844×390**, one page per viewport. An init-script logger registered before the app's window-capture gate records every `pointerdown/up/cancel/click` (pointerId, pointerType, target, detail), and a document-capture logger records which clicks got past the gate. Head log [evidence-6e-20837c0.jsonl](evidence-6e-20837c0.jsonl): **72/72 checks, 0 console/page errors**, 10 cases per viewport:
  - `held-release`: touch held at Leave's spot, mouse opens the dialog, touch lifts. Trace: `pointerdown 2 touch → viewport`, (mouse 1 opens dialog), `pointerup 2 touch → viewport`, **`click 2 touch → kids-exit-confirm`** — Chrome does retarget the touch's click to Leave; the gate blocks it (no document-level click); still Kids, dialog open.
  - `mixed-grant` (the reviewer's direction 1 made reachable in a browser): touch 2 held at Leave's spot; mouse 1 presses and releases on the open dialog copy; touch lifts → `click 2 touch → kids-exit-confirm` emitted and blocked; still Kids.
  - `mixed-revoke` (direction 2): mouse 1 presses Stay and holds; touch presses the canvas and stays down; mouse releases → `click 1 mouse → kids-exit-cancel` emitted and **reaches its handler**; dialog closes, still Kids.
  - `cross-grant`, `cross-revoke`, `cross-revoke-ordered` (touch-only two-finger sequences): Chromium emitted **no click** for these multi-touch sequences; they pass only vacuously (still Kids, nothing reached Leave) and are kept as recorded browser behavior, not as proof of the policy. The policy for those interleavings rests on the handler runner.
  - Preserved controls: `cancel-then-stay` (pointercancel on Leave activates nothing, a fresh Stay tap works), `touch-stay-leave`, `keyboard-leave` (`click -1, detail 0` reaches Leave), `mouse-leave`.
- **Negative control at parent a50f1aa** (same harness, `held-release,mixed-grant,mixed-revoke`) [evidence-6e-negative-a50f1aa.jsonl](evidence-6e-negative-a50f1aa.jsonl): **10 failed of 28** — at both viewports `mixed-grant` leaves Kids mode through the touch's click on Leave, and `mixed-revoke` blocks the mouse's legitimate Stay click; `held-release` passes at parent (single-pointer case was already fixed).
- Screenshots viewed: `shots/6e-held-release-{390x844,844x390}.jpg`, `shots/6e-mixed-grant-{390x844,844x390}.jpg` — dialog still open over Kids controls after the blocked release.

## Limits

Builder SwiftShader runs with emulated touch through CDP, not physical iPhone/iPad, not a screen reader. Synthetic `Input.dispatchTouchEvent` and Playwright mouse; Chromium only (WebKit's click/pointerId behavior not exercised — the pointer-less fallback covers browsers whose click lacks `pointerId`). Save/Load browser smoke remains as before (not counted). Item 7 not started.

Handoff: implementation-review / chatgpt at 20837c0.
