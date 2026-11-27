# SH-E1 return: finished-surface evidence at PR48 0b43f8e

Claude, 2026-11-17T02:00Z. Requested by [implementation-review-0b43f8e.md](implementation-review-0b43f8e.md) §SH-E1.

- **Audited application head:** PR48 `feature/cosmere-reading-state` **0b43f8ee562b232387e9342d00985c91df9663fb** (unchanged; no PR-branch edit this run).
- **Scope:** evidence only. SH-D1–03, gates, copy, engine and tests are untouched. No new canon claim, no release approval, not merged.

## Result

**2/2 finished surface captures, at both the default production bake size and the disclosed reduced-resolution diagnostic mode.** Probe exit 0 in both modes; a timeout negative control exits 1 with both cases INCOMPLETE.

| Mode                     | Case     | Readiness at capture (after 30 more frames)                   | Time to ready | Capture                                      |
| ------------------------ | -------- | ------------------------------------------------------------- | ------------- | -------------------------------------------- |
| default (no override)    | 1440×900 | HD job pass 3, albedo **4096×2048**, `#bake` hidden, bar 100% | 154.1 s       | [png](shots/sh-surface-default-1440x900.png) |
| default (no override)    | 390×844  | HD job pass 3, albedo **2048×1024**, `#bake` hidden, bar 100% | 31.8 s        | [png](shots/sh-surface-default-390x844.png)  |
| diag (`window.__HD=256`) | 1440×900 | HD job pass 3, albedo 256×128, `#bake` hidden                 | 4.3 s         | [png](shots/sh-surface-diag-1440x900.png)    |
| diag (`window.__HD=256`) | 390×844  | HD job pass 3, albedo 256×128, `#bake` hidden                 | 3.2 s         | [png](shots/sh-surface-diag-390x844.png)     |

The default-mode rows are the default-resolution pass (expected size computed in-page with the engine's own rule at `engine.js:499`: 4096 desktop, 2048 coarse-pointer/phone). The diag rows use the existing reduced-resolution hook and establish only that bounded path.

At capture time in all four: `uRealm` 1, `uRStyle` 4, colours #1e1a2c / #5a5088 / #0e0c14 (global look); realm card has no held Scadrial copy; 0 page/console errors. Logs: [default](sh-surface-default-0b43f8e.txt) 12/12, [diag](sh-surface-diag-0b43f8e.txt) 12/12, [timeout negative control](sh-surface-timeout-negative-0b43f8e.txt) (5 s deadline, default mode: 0/2 complete, snapshots show pass 0, 512×256 preview texture, `#bake` visible at 9% / 27%; exit 1; [its desktop capture](shots/sh-surface-default-1440x900-INCOMPLETE.png) shows "Charting surface").

## What changed in the evidence probe

New [sh-surface-probe.mjs](sh-surface-probe.mjs) (the earlier [sh-omission-probe.mjs](sh-omission-probe.mjs) is left as it was). Same state as before: original trilogy + bucket 4 (The Way of Kings), Cognitive, `descend("scadrial")`. A case counts only when all hold, polled to a hard deadline:

1. R1 assembly: view `world`, selection and `PL.w.id` = scadrial, realm `cognitive`.
2. R2 bake finished: every `PL.jobs` entry has `pass > 2` and is not cancelled (the engine calls `done` and shifts the job only then, `engine.js:824`).
3. R3 HD applied: the material's `tAlb` texture is W×W/2 for the mode's expected W (the 512 preview no longer satisfies it).
4. R4 `#bake` loading indicator hidden.
5. R5 30 further `requestAnimationFrame` frames, then R1–R4 rechecked; uniforms read at capture time.

A timeout is recorded as INCOMPLETE with the readiness snapshot and an `-INCOMPLETE` capture, never as complete; the process exits 1 unless 2/2 cases are complete and every check passes.

R7 pixel statistics are **report only**. A first draft asserted that the capture centre was bright and failed on finished surfaces: the generic Cognitive look is dark by design, so brightness does not separate finished from intermediate frames. Completion rests on R2–R5; the images were inspected by eye.

## Inspection (all 4 completion captures and the INCOMPLETE capture viewed)

- Default and diag, both viewports: no "Charting surface" bar; the planet is the dark violet generic look with lighter violet patches on the lit limb, site labels over it, Cognitive button active. Desktop dossier shows "The Cognitive Realm" + the neutral SH-D3 text above the Physical section. The phone sheet is collapsed after descent (engine default), so the dossier text is not in the phone surface frame; it was evidenced in [sh-cognitive-390x844.png](shots/sh-cognitive-390x844.png) last return.
- The INCOMPLETE desktop capture shows the "Charting surface" bar, matching the earlier [sh-surface-1440x900.png](shots/sh-surface-1440x900.png). That confirms the reviewer's diagnosis that the earlier captures were intermediate.
- The visible site-label subset differs between captures (default desktop also shows Lekal City). That follows from planet rotation at capture time and is outside SH-E1. No label or site gating was changed.

Captures are 256-colour quantized PNGs (< 500 KB each); originals were inspected before quantizing.

## Environment and limits

- Builder-run: production build of 0b43f8e (`pnpm build`), `vite preview`, headless Chromium + SwiftShader (`--use-gl=swiftshader --enable-webgl --ignore-gpu-blocklist`), Node v22.23.4. Independent browser execution: 0 cases.
- Not re-run this run: `pnpm check`, `test:pages`, focused unit tests, browser smoke (`tests/browser-smoke.mjs:88` failure as reported last return, unresolved here). The application head is unchanged from the reviewed return.
- Software-GL timings are not device performance; physical-device behaviour remains unmeasured.
- All holds in implementation-review-0b43f8e.md are unchanged; MB09 deferred ledger and 0/2 parent promotions, 0/33 full-work approvals unchanged.

## Handoff

fixing/claude → implementation-review/chatgpt. ChatGPT: review the SH-E1 evidence at the unchanged head 0b43f8e.
