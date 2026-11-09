# R4-T1 return review — 2026-11-07

ChatGPT · PR44 `fix/mobile-entry-usability` · exact application head **2e305cc24ad714be8211d839d283d114748a4310**, unchanged and open/unmerged. Reviewed documentation snapshot on main **7a01dd2160e662b238f33b4e2dae5ae735f35872**, current acceptance-r4t1.md, complete accept-r4t1.cjs and all three output files. Prior review: implementation-review-r4.md.

## Disposition

**R4-T1 closed: 2/2 requested predicate repairs accepted; additional no-WebGL precondition1/1 implemented.**

- Picker: asserts visible-before, then requires not-visible AND either hidden attribute or display:none. The invalid div.open alternative is gone. NEG=picker skips the close tap and therefore tests the relevant still-open condition.
- Pause: compact layouts require shown/on-screen/centre hit target without scrolling. Every layout additionally requires all three after scrollIntoView. The compact media query matches actual head style.css. NEG=pause translates Pause off screen before inspection and fails the relevant predicates.
- No-WebGL: gl===false is asserted before the notice checks; it is no longer only diagnostic output.

Read and independently counted **3/3 saved logs**: normal148 pass/0 fail; picker control147 pass/1 fail; Pause control116 pass/32 fail. The32 failures correspond to14 compact states checked twice plus4 desktop states checked once. These are **audited builder outputs, not reviewer-executed browser results**. Formatting after the reported run and lack of an independently rerun browser remain provenance limits. No fresh rendered/device acceptance or new CI counts are claimed.

## R4T1-O1 — desktop Pause scope

Accept as a documented follow-up, not a new blocker for this mobile patch. Source confirms a scrollable tool panel; the revised test explicitly checks reachability after scrolling instead of falsely promising initial visibility. Claude reports identical below-fold geometry on main ea08de4; that baseline geometry was not independently reproduced here. The observation remains an acknowledged desktop discoverability limitation. Pinning desktop actions can be a separate bounded improvement; do not represent it as implemented or make an unrequested site change.

The source repair and truthful distinction between initial visibility and scroll reachability satisfy R4-T1. Prior M1/M2, A11Y-1/A11Y-2 and R4-1 closures remain intact at the unchanged application head, including the prior4/4 isolated renderer checks (not rerun).

## Remaining limits and handoff

Known gaps remain: physical Safari/Android and screen readers, native text sizing/safe areas, real hardware performance, inert toolbar on no-WebGL failure, cramped568x320 panel, Save/Load smoke intermittency, and deferred optional entry card/human journey comparison. Recorded emulation does not establish physical-device equivalence. The earlier local Chromium socket-permission failure is not newly retested here; no independent browser execution is claimed.

Return ready/claude for a concise final technical acceptance/release recommendation at this same head with these Known gaps. This review supplies the requested implementation acceptance, not Mckay's release approval. If Claude's technical acceptance is complete, record it and open the owner decision; do not send unchanged predicates back for another review. No code, PR branch, formal GitHub approval, merge or deployment changed.

**Verdict: approved with disclosed Known gaps for the reviewed implementation; R4-T1 closed. Release remains subject to final technical disposition and Mckay approval.**
