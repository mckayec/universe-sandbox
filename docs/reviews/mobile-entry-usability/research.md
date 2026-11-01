# Mobile landing-page usability: research and implementation brief

Requested by Mckay on 2026-10-31 (America/Denver): the Universe Sandbox landing page is hard to use on mobile; make it more intuitive and easier to use, and add this to the research/work queue.

## Implementation handoff update — 2026-11-01 UTC

Claude: read the [source audit and implementation addendum](research-addendum.md) before the baseline capture and layout proposal. It identifies existing mobile features to preserve, concrete control-size/instruction/state gaps, prioritized changes, and the expanded verification matrix. Its live check was limited by cloud-browser WebGL initialization; it is not a mobile acceptance pass. The existing Claude-owned queue item and release gates remain unchanged.

## Scope and current evidence

Start with the root Gravity Lab / Universe Sandbox entry experience and first-use path into an exhibit or universe. Check the atlas chooser as an adjacent entry path; do not assume the complaint is limited to it.

Source inspection of main's src/ui/template.ts shows several tool groups, an Add/Inspect/Navigate mode switch, universe and exhibit dialogs, and desktop wording such as CLICK, SCROLL and DOUBLE-CLICK. These are candidates to investigate, not confirmed mobile layout defects: CSS, live behavior and screenshots were not audited in this research pass.

No application code was changed. This item is queued; it does not approve a release or change existing atlas audit gates.

## Primary-source research, checked 2026-10-31

1. Apple HIG, Buttons: https://developer.apple.com/design/human-interface-guidelines/buttons
   Recommend clear, recognizable controls, space around buttons, visible press feedback, and only one or two visually prominent actions in a view. Apple describes a general 44-by-44-point hit region. Native points are not a web CSS-pixel requirement.
2. W3C, WCAG 2.2 Target Size (Enhanced): https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
   44-by-44 CSS-pixel targets are the enhanced AAA criterion, with exceptions. Use at least this size as the project target for primary mobile controls, rather than aiming for the smallest allowed target.
3. W3C, Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
   The AA criterion is 24-by-24 CSS pixels or qualifying exceptions, including spacing. Do not mislabel 44 pixels as the AA minimum.
4. W3C, Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow
   Non-excepted content must remain usable at 320 CSS pixels without two-dimensional reading scroll. A map/game canvas can require spatial navigation; its surrounding text and controls do not automatically inherit that exception.
5. Google Android Accessibility, Touch target size: https://support.google.com/accessibility/android/answer/7101858
   Recommends at least 48-by-48 dp touch targets, potentially larger than the visible icon. Native dp values are design guidance, not literal CSS-pixel conversions.

## Proposed direction to validate

- Give first-time visitors an obvious start: prototype a small set of plain-language entry choices such as Explore universes, Try a guided experiment, and Free play. Choose one primary action after observing the existing journey; these labels and hierarchy are proposals.
- Keep advanced simulation controls available behind a clearly labeled Tools or More panel. Preserve quick access to common actions and the active mode; never hide essential state.
- Make primary touch targets at least 44 by 44 CSS pixels, with adequate separation and visible pressed/selected states.
- Use text with icons, touch-appropriate instructions, and explicit alternatives to hover, double-click or precision dragging.
- Evaluate reachable navigation/bottom sheets against available canvas space. A bottom navigation bar is an option, not an automatic requirement.
- Make sheets easy to dismiss and reopen. Respect device safe areas and changing mobile browser bars; do not let fixed panels cover important controls or content.
- Keep page text readable without pinch zoom; support text enlargement, screen readers, focus visibility and reduced motion.
- Preserve desktop usability and saved simulations. Verify that tapping navigation or scrolling a sheet cannot accidentally add a celestial body.

## Work plan and acceptance

1. Capture the current root page, universe dialog and atlas chooser on 320, 375, 390, 430 and 768 CSS-pixel widths; include portrait and landscape. Record the exact commit and concrete problems before selecting a layout.
2. Walk through: start a guided exhibit; open a universe/atlas; return home; switch Add/Inspect/Navigate; pause; reopen tools; dismiss a sheet. Record taps, errors and confusing labels.
3. Prototype the smallest useful layout change and compare those journeys. Suggested design goal: reach an exhibit or universe in no more than two deliberate selection taps from the entry screen; distinguish this proposed goal from a universal research finding.
4. Claude implements the chosen changes in an isolated PR, retaining existing features and runtime behavior. ChatGPT reviews research-to-design traceability and wording.
5. Verify actual iPhone Safari as well as automated mobile Chromium; include Android Chrome if available. Emulation is not proof of real-device acceptance.
6. Acceptance: no clipped/overlapping essential controls; non-canvas content reflows at 320 CSS pixels; primary controls meet the 44 CSS-pixel project target; mode and selected navigation are evident; first-use paths complete without accidental placement; zoomed text and landscape remain usable; keyboard/screen-reader and motion checks recorded; desktop regression checks pass.
7. Record before/after screenshots, exact revision, test results and unresolved limitations. Follow the existing review and owner release gate before merge/deploy.

This brief is initial source-backed research and an implementation plan, not a completed mobile audit or measured user-test result.
