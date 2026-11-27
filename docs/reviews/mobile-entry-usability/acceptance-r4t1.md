# R4-T1 return — repaired acceptance predicates (Claude, 2026-11-07)

Target: PR #44 head `2e305cc24ad714be8211d839d283d114748a4310` (unchanged — **no application code edited**; the repaired assertions exposed no PR44 failure). Responds to [implementation-review-r4.md](implementation-review-r4.md) R4-T1.

Script: [accept-r4t1.cjs](accept-r4t1.cjs) (copy of accept-r4.cjs with the repairs below; same resize/rotation/text-size population). Chromium headless via Playwright, swiftshader WebGL; `vite preview` of the exact head build. Emulation only, not native devices.

## Repairs

| Item | Before | After |
| --- | --- | --- |
| Picker closure (§3) | `… \|\| !el.open` — always true on the `div role=dialog`. | Asserts the picker **visible before** close (not hidden, display/visibility, non-zero box); after close asserts **not visible AND** (`hidden` attribute or `display:none`). No `.open` reference. |
| Pause (topOk) | `shown` only. | Requires `shown && on && hit` (on-screen box and `elementFromPoint` at its centre is Pause or a descendant). Compact layouts (the app's own compact media query) must pass **without scrolling**; every layout must pass after scrolling Pause's own container (`scrollIntoView nearest`, panel scroll restored). |
| No-WebGL (§6) | WebGL state was informational. | `no-WebGL precondition: WebGL context unavailable` is an assertion. |

## Results at 2e305cc

| Run | Result | File |
| --- | --- | --- |
| Normal | **148 passed, 0 failed**, exit 0 | [accept-r4t1-2e305cc.txt](accept-r4t1-2e305cc.txt) |
| Negative control `NEG=picker` (close tap skipped, picker left open) | 147 passed, **1 failed** (`universe picker closes after rotation` — state `hidden:false, display:block, visible:true`), exit 1 | [accept-r4t1-neg-picker.txt](accept-r4t1-neg-picker.txt) |
| Negative control `NEG=pause` (Pause `translateX(-200vw)`) | 116 passed, **32 failed** (every Pause predicate in all 18 layout checks: 14 compact × 2 + 4 desktop × 1), exit 1 | [accept-r4t1-neg-pause.txt](accept-r4t1-neg-pause.txt) |

The script was formatted with Prettier after these runs (whitespace only).

## Observation (not a PR44 regression)

R4T1-O1: at desktop sizes (1440x900, 1280x800 incl. 200% text, also 1920x1080 in a probe) Pause starts **below the fold of the scrollable `#tool-panel`** (e.g. 1440x900: Pause top 1053 px vs panel bottom 840 px) and has no keyboard shortcut; it is reachable by scrolling the panel. A probe against current `main` (`ea08de4`) gives **identical geometry**, so this is pre-existing desktop layout, outside PR44's mobile scope. The strict "without scrolling" predicate therefore applies to compact layouts only, and desktop runs log an `info` line. Recommendation: separate small follow-up (e.g. pin `.actions` to the panel foot on desktop) if Mckay/ChatGPT want it; not done here per "do not change application code unless the repaired assertions expose a real failure".

## Unchanged

R4-1 implementation, prior M1/M2/A11Y closures, entry-card deferral, Known gaps (no physical device/screen reader, native text sizing, safe-area, pre-existing Save/Load smoke race). No merge, deploy or release approval.
