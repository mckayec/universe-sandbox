# Mobile accessibility return review

2026-11-06 UTC · ChatGPT. Exact target: PR44, `fix/mobile-entry-usability`, **d699aaacdbd2cf381dab3808dcbe8f4ebcdd0242**, parent **4ffda2d28678588c829751339dcaf619711ccc40**. Open, draft, unmerged.

**Changes/evidence requested. Both A11Y items reviewed (2/2); neither is a completed acceptance closure. Prior M1/M2 closures remain intact.**

Read the prior implementation review, current status, a11y-acceptance.md, complete a11y.cjs and raw a11y-d699aaa.json. Read the actual return diff: **1/1 changed file**, src/style.css, 37 inserted lines; fetched full CSS (blob e086dd1568556f9c30cd8bdc6a62b1981519003e) and template (db390a44833a261cd52428fa69ba7c51e2c1f021) at the target SHA. No application code was changed by this review.

## A11Y-1 — partial; prove enlarged labels remain available

The compact CSS fixes control-box overflow by shrinking top actions and hiding overflow with ellipsis, and allows lower action labels to wrap. This is a useful improvement, but the acceptance report itself says Universes/Exhibits become “UNI…” / “EX…”. The raw portrait 200% output still flags universes-button, exhibits-button and fullscreen-button as textOverflow. Zero clipped element boxes does not establish zero lost label content; the fullscreen icon's special styling also means three flagged elements are not automatically three text failures.

[W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), reopened 2026-11-06, requires enlarged text without loss of content/functionality. It allows some truncation where full content is available on focus or activation and availability is indicated beyond truncation itself. An unchanged accessible name alone does not demonstrate that a sighted user enlarging text can recover the label.

**Next:** preferably let the two text labels wrap/reflow with sufficient button height while retaining 44px targets. Alternatively demonstrate a discoverable, touch- and keyboard-usable way to reveal their full meaning at the tested scale. Check focus and activation, not only bounding boxes. Preserve fullscreen's meaningful icon/name. This is an unresolved project acceptance item, not a blanket WCAG conformance verdict from one fixture.

Acceptance: record 100%, an intermediate scale, and 200% at 390×844 and 844×390, plus the 320px compact baseline. Show label availability, usable controls, no overlap and no horizontal page overflow; use assertions for expected outcomes. The current a11y.cjs logs diagnostics rather than failing on violations. Its injected font-size/text-size-adjust is an approximation, not native Dynamic Type or proof of every zoom mechanism.

## A11Y-2 — choose option (b)

Move Undo/Redo before Named structures in the actual DOM, preserving Undo then Redo and native tab behavior. A corresponding desktop toolbar ordering change is acceptable within this review's design decision; it requires a desktop regression check, not a new owner permission round. Reconcile redundant CSS ordering and do not use positive tabindex.

[W3C Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html), reopened 2026-11-06, permits more than one logical order and does not require literal visual equality. Therefore the current mismatch alone does not prove a failure. Matching these simple controls is nevertheless the clearer design.

The raw tabSequence contains neither undo nor redo. They begin disabled in the exact template, and the focus fixture never makes an edit before tabbing. Thus this recording **does not test enabled Undo/Redo focus order or visibility**. The separate DOM/visual lists establish their order mismatch, not their actual enabled navigation.

Acceptance: make an edit to enable Undo, traverse forward/backward, invoke Undo to enable Redo, then test Redo and focus retention. Check compact portrait, landscape and desktop, including toolbar scrolling and visible focus. Record disabled-state skipping separately. No need to redo unchanged touch mechanics.

## Validation and evidence limits

Independently read CI run [42178297785](https://github.com/mckayec/universe-sandbox/actions/runs/42178297785), build job 127761770805 and complete logs:
- **82/82** unit tests pass; formatting/build/distribution pass (111 files).
- **24/24** standalone page/viewport cases pass.
- Touch suite finishes all awaited markers: B6, M1, pinch, and final mobile-touch completion.
- Deployment skipped; test:browser is not run by this workflow.

Actual tested merge **d702738fb3c8c9138296a7ce63d9fef07875e6fe** differs from the reviewed head only under docs/. Runtime/test equivalence was checked. No new local tests or independent rendered session were run here. The new reduced-motion, rotation and 200% measurements remain builder-attributed. Rotation output supports three selected-sheet transitions with stable count five; toolsExpanded is false, so it does not certify rotation with the tools panel open.

Physical Safari/Android, VoiceOver/TalkBack, native font scaling and real-GPU evidence remain Known gaps. The separate Save/Load smoke race remains explicitly unresolved. Do not promote emulation or accessible-name inspection to physical-device or screen-reader acceptance.

Return to fixing/claude for these two bounded items, retaining existing optional-entry-card/no-WebGL follow-up scope and Mckay's eventual release gate. No release decision is requested yet.

**Verdict: not approved for release. A11Y-1 is partial pending visible-label availability; A11Y-2 option (b) is accepted as the implementation direction, with enabled-control keyboard verification required.**
