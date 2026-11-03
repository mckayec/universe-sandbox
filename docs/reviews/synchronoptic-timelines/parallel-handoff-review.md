# Parallel timeline handoff and proposal review

ChatGPT, 2026-11-02. Reviewed proposal.md blob `209523b96385e9797b2d116e54f0e68615a362de` and status.md blob `ea6b61430345ffa3863fa68f1c021c95841a8430`.

## Immediate assignment to Claude

Mckay asked: “Claude seems to be 'sitting' a lot while you work. Can you hand anything off to Claude to get it to work simultaneously?”

**Start the bounded timeline prototype on `engine/timelines` now, independently of the PR33 review.** This reinforces the parallel implementation decision already recorded in HANDOFF_PLAN.md; it is not a new requirement for the initial Standard Works release. The existing status remains implementation / claude. The branch was not present at this review, so implementation is not claimed started.

Use the proposed Abrahamic-first order, followed by Standard Works. Original symbols are a suitable first implementation. Keep Gospel-harmony and circular views later. The first deliverable is a working linear chart plus equivalent list view on a separate draft PR, with its exact commit and test/screenshot evidence. Do not wait for Apocrypha date research, a second design approval, or PR33's review to complete before implementing that bounded unit. Do not merge or deploy without the applicable owner approval.

Prefer an isolated module/adapter change and branch/worktree. Do not mix prototype code into PR33 or alter its handoff, release gates, accepted content, or pending fixes. If the same builder cannot execute both at once, finish the small current PR33 correction batch first, then build this prototype during its review. No idle wait is needed while ChatGPT owns a review.

## Concrete proposal corrections to include in implementation

1. **Source and chronology fields:** make edge source locators required for displayed factual relationships. Add the missing `describes` edge type or preserve the existing typed relation without coercing it into same-entity. Preserve claim type, date basis/precision and provenance through every adapter and aggregate.
2. **Presence is not a dated lifespan:** keep uncertain emergence windows distinct from a known start followed by continued presence. Do not extend a tentative emergence range into an unqualified continuous history. Retain the existing ongoing/undated distinctions and visibly mark uncertainty.
3. **Sites are not journeys:** a dated site alone cannot create a travel edge. Map routes to travel only where the accepted route's ordered stops and source support it; a route-level date range does not establish dates for individual legs. Unsupported legs stay undated.
4. **Narrative ordering:** source reading order, narrated chronology and manuscript/composition dates differ. Label which ordering is used. Unknown or mutually incompatible chronology stays outside the numeric axis; no invented alignment between scripture and civil history.
5. **Family branch still required:** a tradition's branch/division is not the family genealogy requested in the brief. The Abrahamic-first slice can demonstrate institutional branching, but it must report family genealogy as a remaining requirement until accepted parent/child data exists. Do the same for unsupported succession or migration examples; do not call the prototype full coverage.
6. **Gating and UI:** filter both endpoints and the edge's own gate before layout, counts, search, selected details, list/export or URL restoration. Revalidate pending selections after work/chapter downgrade. Avoid a chronological leak through a later death/succession. Test BCE/CE boundary behavior explicitly; store calendar semantics without assuming that simple integer subtraction matches an axis with no year zero.
7. **Interaction tests:** include repeated open/close, Escape/focus restoration, browser back/forward, unknown URL IDs, zoom/reset, collapsed lanes, reduced motion and keyboard-accessible alternatives to lane dragging. Verify the 390px presentation without shrinking dense labels into illegibility.

These are bounded implementation requirements, not a demand for another proposal round. Build the supported slice and make any unsupported data visible as coverage gaps.

## Research split

Yes, Christian Apocrypha composition/transmission chronology needs a separate source-checked research pass before numeric plotting. ChatGPT owns that research when scheduled; it is **not complete**, and the proposal's inventory counts were not independently reproduced in this document. Claude can implement the adapter/undated view now using existing records, with distinct optional composition/transmission fields that accept future reviewed data. No fabricated dates or placeholders presented as historical claims.

ChatGPT continues the PR33 exact-head review independently and reviews this prototype once its draft PR is supplied. A working branch and evidence, rather than another broad planning document, are the next timeline handoff.

## Verification limits

This was a documentation/proposal review, not execution of the prototype or a content sign-off on the pack inventories. No timeline code, browser test, release, merge or deployment is claimed by this handoff.

## Independent implementation review — 2026-11-02, 708f26c

This dated update supersedes the earlier proposal-only verification limits above. Independently reviewed PR45 (`engine/timelines`) at **708f26c689a6ae58120040a1c7a1b5aa344720ac**, stacked on PR39; [full review and reproducible evidence](https://github.com/mckayec/universe-sandbox/blob/4cc983f7a1cef5ce9269f51333f9123c08f5c763/docs/reviews/synchronoptic-timelines/independent-review-708f26c.md) on `review/timelines-708f26c`, docs commit `4cc983f7a1cef5ce9269f51333f9123c08f5c763`. Remote review-file readback verified. **Keep stage implementation / owner claude; fix and research now, without another proposal review.** No approval, merge or deployment. PR33 code, review branch and release gates remain unchanged.

Concrete next steps for Claude:

1. **TL-R01:** preserve source-qualified note/event wording and identity guards. All 42 adapted source-bearing records currently expose internal record references as “Source”; none is a citation locator. Render real locators and atlas navigation, retaining missing evidence explicitly.
2. **TL-R02/R03:** fix collapsed-list completeness (Judaism collapse hides 18 undated entries with no list expansion control) and focus loss after clear/deselect/gate refresh.
3. **TL-R04/R05:** preserve event book/work/chapter gates before multi-work rollout; complete or explicitly narrow time-range and default-order URL restoration. This is not a claim of a current-pack spoiler leak.
4. **TL-R06:** fix phone filter layout in the appropriate builder branch. At 390 pixels the filter container is zero-width and the canvas intercepts click/tap. Relevant CSS is unchanged from PR39 base; it is an inherited integration issue, not a claimed new PR45 regression.
5. Continue claim-specific relationship locator research and accessible connector details. The current slice has 169 records (91 dated / 78 undated), 19 emergence windows and 129 unsourced relationships, with zero drawn connectors. Preserve genealogy, succession, travel and missing adapters as gaps. Standard Works work may proceed independently without altering PR33. Supply a new exact head plus regression evidence when ready.

Independent validation: npm package-script equivalents for format/build/tests/dist passed (121 tests, 120 files); pnpm itself failed environment initialization, recorded in the review. Model and DOM probes verified calendar/representation/gates and reproduced the findings. Inspected screenshots at 1440, 390 and 3840 pixels; zoom/reset, Back/Forward, repeated Escape, lane controls and cold invalid/gated URLs exercised. The full phone sequence failed at TL-R06; a separate 4K run completed. Chromium/SwiftShader and emulated touch are not physical-device or final canon acceptance. Existing PR45 CI run 41514500369 succeeded with deploy skipped.

Publication status: review branch is pushed and verified. Creating its draft PR was **denied by automatic approval review**, which stated it lacked trusted explicit authorization; no PR was created and the denied action was not retried. The review remains available through the immutable link above. This does not block Claude from acting on the findings.

Publication follow-up (2026-11-02): after the parent supplied authorization addressing the denial, the permitted retry succeeded. **[Draft review PR #46](https://github.com/mckayec/universe-sandbox/pull/46)** is open against main at review head `4cc983f7a1cef5ce9269f51333f9123c08f5c763`; remote readback confirms draft/open/unmerged. The earlier PR-creation blocker is resolved. No approval, merge or deployment; Claude ownership and PR33 gates remain unchanged.
