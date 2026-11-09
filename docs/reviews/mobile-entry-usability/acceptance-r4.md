# Remaining acceptance, return 4 (Claude, 2026-11-07)

PR [#44](https://github.com/mckayec/universe-sandbox/pull/44), branch `fix/mobile-entry-usability`, exact head **2e305cc24ad714be8211d839d283d114748a4310**, parent **38725238ed2df86910dc24438d9565fd14500d69** (last reviewed head).

## Change in this return

One finding and its fix: **R4-1 no-WebGL resilience.** With WebGL disabled (`--disable-webgl --disable-3d-apis --disable-gpu`), the reviewed head showed the full toolbar, `OBJ 0`, an empty playfield and only an uncaught `Error creating WebGL context` in the console: no explanation to the visitor. Fix (`src/scene/setup.ts`, `src/style.css`, +39/−5): renderer creation is wrapped; on failure a centred `role="alert"` notice ("3D graphics are unavailable — This exhibit needs WebGL. Turn on hardware acceleration, update the browser, or try another device.") is added, then the error is rethrown so startup still stops as before. No behaviour change when WebGL works. Screenshot: [shots/r4-nowebgl.jpg](shots/r4-nowebgl.jpg).

Known limit of the fix: the toolbar stays drawn underneath but inert (startup stops before handlers bind). Disabling it is a larger change; not attempted.

## Checks at 2e305cc (builder-executed)

- `pnpm format && pnpm check`: format OK, build OK, 82/82 unit tests, check:dist 111 files OK.
- `pnpm test:pages`: 12 pages × 2 viewports pass. `pnpm test:touch`: pass.
- [accept-r4.cjs](accept-r4.cjs) (assertion-based, exits non-zero): **132/132 pass**, output [accept-r4-2e305cc.txt](accept-r4-2e305cc.txt). Negative control: the same script against 3872523 fails exactly the 2 no-WebGL notice assertions (130 pass, 2 fail).
- Not rerun this return: a11y-r3.cjs (the change touches no top-bar/toolbar CSS), test:browser (Save/Load race disposition unchanged, see [save-load-smoke-disposition.md](save-load-smoke-disposition.md)).

## Acceptance matrix (emulated Chromium + SwiftShader; not native devices)

| Item from implementation-review / a11y-r3 | Result | Evidence |
| --- | --- | --- |
| Live resize on one page across 1440×900, 390×844, 844×390, 1280×800, 320×568 with text 100/150/200% changes | pass — top bar on screen, Pause reachable, no page overflow, no console errors | accept-r4 §1 |
| Short landscape 844×390, 667×375, 568×320: tools toggle on screen, tool body fits or scrolls, last tool button reachable | pass (568×320 is cramped: the open tool body shows ~1 row at a time but scrolls) | accept-r4 §2, [shots/r4-568x320.jpg](shots/r4-568x320.jpg) |
| Rotation with tool panel open, and with the universe library open; close still on screen and works | pass | accept-r4 §2–3 |
| Reduced motion (`prefers-reduced-motion: reduce`) | pass — query active, toolbar transitions ≤0.01 s, layout OK | accept-r4 §4 |
| Repeated taps (6) + 900 ms long press on canvas in Navigate | pass — object count unchanged, no errors | accept-r4 §5 |
| No-WebGL resilience | **failed at 3872523, fixed at 2e305cc** (R4-1) | accept-r4 §6 |
| 200% text, keyboard focus order, Undo/Redo | pass at 3872523 (a11y-r3, reviewed) — unchanged | a11y-return-3.md |
| Real iPhone Safari, Android Chrome, VoiceOver/TalkBack, native Dynamic Type, safe-area/browser-bar changes, real-GPU performance, human journey timing | **unavailable** to either AI (no physical devices) | — |
| test:browser Save/Load intermittent timeout | pre-existing race, not caused by PR #44; not fixed | save-load-smoke-disposition.md |

## Dispositions of the remaining open scope

- **Optional first-use entry card** (implementation.md §5, review direction in implementation-review.md): **deferred out of PR #44** to a separate follow-up review item. It is optional, needs its own design review and human journey comparison, and holding it here blocks shipping the accepted mobile fixes. Proposed as a new `docs/reviews/mobile-entry-card` item when Mckay wants it.
- **Real-device checks**: cannot be done by either AI. Proposed handling: Mckay spot-checks the live site on his iPhone after release (rotate, Hide tools, place/clear, Universes sheet), and any problem becomes a follow-up item. Recorded as a Known gap, not a pass.

## Known gaps

| Gap | Impact | Blocks release? |
| --- | --- | --- |
| No native device / screen-reader pass | Safari-specific layout or VoiceOver issues may remain | No — Mckay spot-check after release |
| Toolbar inert under the no-WebGL notice | Confusing only on devices without WebGL | No |
| 568×320 landscape tool body very short | Usable by scrolling | No |
| test:browser Save/Load race | Local smoke flake; CI does not run it | No |
| Entry card not built | No guided first-use orientation yet | No — separate item |

## Hand-off

To ChatGPT: review the one-commit return (2 files) and this matrix at 2e305cc; if acceptable, approve PR #44 at that exact head for Mckay's release decision. No merge, deploy or release approval is implied.
