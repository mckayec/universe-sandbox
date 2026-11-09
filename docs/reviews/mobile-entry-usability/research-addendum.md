# Mobile entry usability: source audit and implementation addendum

Date: 2026-11-01 UTC (2026-10-31 America/Denver).
Continues [research.md](research.md); does not replace the existing queue item.
Research baseline: main `b34448bf6812cb40adcbc24d454489042028d53a`.
Status remains `research-ready`, owner `claude`. No application code, PR, release approval or stage change is included.

## What is verified, and what is not

Reviewed the root interface source, compact CSS, toolbar initialization and interaction-mode handlers. The deployed [root page](https://mckayec.github.io/universe-sandbox/) was opened in cloud Chrome at approximately 03:36 UTC. Its HTML interface rendered, but the browser reported `GL_VENDOR = Disabled, GL_RENDERER = Disabled` and `THREE.WebGLRenderer: Error creating WebGL context`. Clicking Universes did not open the chooser. The deployed bundle reported in the console was `assets/index-DY4dhvXl.js`; its correspondence to the source baseline was not established.

This is an environment-limited live check, not a successful interactive audit and not evidence that users' phones have this error. No mobile-size rendering, real iPhone Safari, gesture, screen-reader, performance or usability test passed in this run. Source findings below are independently useful, but must not be presented as observed phone screenshots or measured user friction.

## Preserve the mobile work already implemented

The compact layout in [src/style.css](../../../src/style.css) already includes dynamic viewport height, safe-area offsets, single-column universe/exhibit cards, 44-pixel top actions, a bottom dock, collapsible tools, and expandable object details. [src/ui/toolbar.ts](../../../src/ui/toolbar.ts) starts tools collapsed when compact layout is active and height is below 900 pixels. It also implements horizontal-toolbar edge fades.

Do not commission these features again as if absent. Improve the existing system incrementally and verify behavior after renderer initialization.

## Prioritized findings and proposed work

| Priority | Source evidence | Recommended smallest change | Acceptance evidence |
| --- | --- | --- | --- |
| P1 | Compact toolbar controls specify 34 px height; zoom buttons 40 px, Focus/All 34 px; mode/action/panel buttons specify 40 px minimum; time buttons 42 px. | Apply the existing brief's 44-by-44 CSS-pixel project target to essential controls. Audit actual hit regions, not just icons. Reflow or move secondary controls rather than enlarging everything into overlap. | Actual bounding-box/hit-target measurements and screenshots at 320, 390 and 430 px; no newly occluded canvas, labels or controls. These declarations are a project-target gap, not by themselves a WCAG AA failure. |
| P1 | Root template exposes simulation controls immediately; Universes and Exhibits are peer top actions. The secondary toolbar contains 14 controls, including save/recovery and visual/model settings. | Compare a concise first-use entry panel with the current direct-to-canvas flow: primary “Explore universes,” secondary “Try an experiment,” and a clearly available “Free play” choice. Put infrequent simulation settings behind a labeled Tools/More disclosure. Preserve direct access for returning users and avoid mandatory onboarding. | New visitors can explain the three paths; complete a chosen path without help or accidental object creation. Record taps and errors before/after, rather than claiming that fewer controls automatically improve usability. |
| P1 | Compact CSS hides `.hint`; the template/navigation mode still uses “SCROLL” and “DOUBLE-CLICK.” Builder choices call `setInteractionMode(true)`, with placement instructions written into the hidden hint. | Show a short contextual instruction near the active mobile mode: e.g. “Tap empty space to place,” “Tap an object to inspect,” “Drag empty space to move.” Keep a visible Focus action and explicit gesture alternatives. Do not rely on hover or a desktop-only hint. | Selecting a builder makes the next action understandable without opening help. Tool taps, sheet scrolling and dismissal never place bodies. Validate all three modes and mode changes with an object selected. |
| P1 | Mode and speed handlers in `src/ui/controls.ts` update CSS `active` classes; template mode buttons have no `aria-pressed` state. | Expose selected mode/speed programmatically with an appropriate button-group state pattern, retaining visible selected styling. | VoiceOver and keyboard users can identify current mode and speed; visual, spoken and actual behavior stay synchronized after every transition. |
| P2 | Pause and Clear all are adjacent actions. Clear all resets immediately, with history recorded before reset. Undo is in the horizontally scrollable toolbar. | Keep Pause prominent. Separate destructive Clear from the frequent-use cluster, or provide a clearly reachable Undo immediately after clearing. Do not remove existing recovery/history behavior. | Accidental-clear recovery is discoverable on a narrow screen; existing simulation restoration passes. |
| P2 | Cloud WebGL failure leaves rendered controls without a working chooser in this observation. | Reproduce on a controlled no-WebGL test and consider rendering entry navigation independently of simulation startup, with an understandable unavailable-renderer message. | Either navigation remains usable or the user receives a clear recoverable error, not inert controls. This is a resilience investigation, not a confirmed general production failure. |

Source files: [template.ts](../../../src/ui/template.ts), [style.css](../../../src/style.css), [toolbar.ts](../../../src/ui/toolbar.ts), [controls.ts](../../../src/ui/controls.ts). All were read from main during this audit; pin the implementation report to its own exact revision.

## Additional primary-source checks

- [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced): 44-by-44 CSS pixels is the AAA criterion with exceptions. It is the chosen project goal, not a claim that all smaller controls violate AA.
- [W3C Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): AA uses 24-by-24 CSS pixels or qualifying exceptions, including spacing. Assess the actual target geometry.
- [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow): verify non-excepted content at 320 CSS pixels. Spatial simulation content may require a two-dimensional layout; that does not automatically exempt all surrounding text and controls.
- [W3C Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements): assess single-pointer, non-drag alternatives where dragging is not essential. Keyboard shortcuts alone are not the touch alternative.
- [W3C Pointer Gestures](https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures): retain single-pointer alternatives to nonessential multipoint/path-based gestures. Existing zoom buttons are useful; explicitly inventory remaining navigation/placement operations.
- [Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): native button guidance supports generous, recognizable interaction targets. Native points must not be described as identical to CSS pixels.

The entry hierarchy and destructive-action proposals above are design hypotheses derived from the current interface, not universal standards or measured research outcomes.

## Bounded implementation and verification handoff

1. Claude first captures the working baseline on a WebGL-capable browser at 320, 375, 390, 430 and 768 CSS-pixel widths, plus short landscape. Include real iPhone Safari where available and label emulation separately.
2. Prototype only the entry hierarchy, essential target sizes and contextual instruction/state changes first. Keep physics, pack data and in-flight atlas branches unchanged.
3. Compare these journeys: open a universe; start an experiment; enter free play; choose a body and place it; inspect then focus; pause/resume; open/close/reopen tools; clear then undo; navigate back from atlas.
4. Include repeated taps, interrupted navigation, Cancel/Close, Back/Forward, 200% text enlargement, keyboard focus, VoiceOver, reduced motion, safe-area/browser-bar changes and portrait-to-landscape rotation. Record failed and not-run cases separately.
5. Report completion time, deliberate taps, wrong turns and unintended placements for each journey. The brief's two-selection-tap entry goal is a project hypothesis; compare it with the baseline without adding an unnecessary welcome step for returning users.
6. Follow AGENTS.md checks: `pnpm format`, `pnpm check`, console inspection and changed-flow desktop/mobile checks. Include relevant browser/page smoke tests from the current package scripts.
7. Return before/after evidence, exact branch/head SHA and limitations to ChatGPT. Existing review, PR and owner release gates remain unchanged. This addendum does not authorize merge/deploy.

Research/source review completed; implementation and rendered mobile acceptance remain pending with the existing Claude-owned item.
