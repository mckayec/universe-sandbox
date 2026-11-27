# Independent checkpoint-31 review

2026-11-09 UTC, ChatGPT. PR45 `engine/timelines`, exact head **420c1e77f50c9c34a433f00b4062911cc422c42b**, parent **eabf9c61ddd70558f0b5c8c3ba7244129262c47d**.

**R30-1 accepted at source/helper scope; keyboard focus repair accepted at source scope with bounded builder browser evidence. No full technical, canon or release approval.** Return to Claude for final technical consolidation, not another open-ended repetition of the completed year-history diagnosis.

## Scope and independent checks

Read 7/7 changed text files: checkpoint, both logs, keyboard probe, engine.js, layers.js and regression test. The application change is confined to 2/2 source files; the third non-documentation file is the test. Head blobs: engine `dc39aaccabe7f99ed5d0a5bcef9378dca3a56156`; layers `a04382c4490b4fe0d8f7e62ccfa5d78c27502934`.

Executed the actual head layers.js in a fresh Node VM. **17/17 independent assertions passed**:
- five axes (cross-era -800..2030/10 and -20..20/3, short 1..5/10, BCE-only -15..-1/4 and singleton 5..5/1): reachable integral-step top and full-range round trip, 10 assertions;
- full-range shrink/restore, unchanged explicit endpoints, moving only upper/lower endpoint, End to the true maximum and moved-back grid-year behavior, 7 assertions.

The fix correctly uses a reachable input maximum (2031 for the -799 axis minimum with step 10), clamps the logical year to 2030, and preserves an untouched endpoint even when the native control displays its snapped value. Moving an endpoint away and back can yield a grid year (600→611→601); that is the documented behavior, not proof of exact reversal to 600.

Extracted the actual renderFilters function and executed it against a small DOM stub: **3/3 cases** restore focus for the from handle, to handle and a layer control with preventScroll. This establishes the source branch, not native keyboard behavior or assistive-technology compatibility.

## Builder browser evidence: accepted with limits

Inspected all 8/8 PASS rows at 1440×900. Six state/URL predicates, one focus predicate and one no-error predicate passed in Claude's run. The parent control contains **0/1 passing predicates followed by a 30-second focus timeout**. It is not an eight-case parent run and cannot isolate the effect of the two fixes independently.

The probe uses real keyboard events after programmatic focus. Its state predicate checks exact S.range and URL yr, but only distinguishes “All years” from any other readout; it does **not** assert the exact formatted year string or input values. Those are logged. Focus is asserted only at the final endpoint case. Preserve these limits when citing “8/8”.

No 390-wide or pointer-drag completion is supplied. **0 independent rendered cases in this review**; no browser availability test or full-suite rerun is claimed. Claude's 166/166 tests and 12×2 page checks remain builder-reported in this review. Existing checkpoint-30 URL/history evidence retains its earlier qualifications.

## Dispositions

- **R29-1:** accept as an explicit remaining mobile discoverability gap for this bounded review; do not claim its fix or independent reachability verification. The mobile review is already awaiting Mckay, and its status does not mention R29-1. This review therefore does not silently expand that approved review's scope or transfer ownership. Claude should retain the gap in PR45's final technical packet; any mobile follow-up needs a separately scoped handoff.
- **Chapter-path control:** accept the incomplete control as an evidence limitation, not a product failure or completed comparative validation. A timeout does not by itself prove a non-software-GL browser is necessary; that is one proposed next environment.
- **Default-off layers:** deferred with a trigger before introducing such a pack. Existing defaultActive tests do not establish browser history behavior for omitted layers in that future configuration.
- **Hidden-surface hashes:** retain as untested. The source has filter cleanup paths; their existence is not rendered acceptance.
- **Physical-device/touch/AT, pointer drag, 390-wide keyboard qualification, final viewport evidence and PR33 integration:** remain explicit technical gaps requiring Claude's final scope/risk disposition. Do not silently relabel them as tested.

No content data changed, and 0/12 real relationships are promoted. Return **implementation / claude** for a finite final technical packet naming the candidate SHA, retained gaps and remaining integration/release requirements. No changes to Mckay-owned review statuses, PR branch, merge or deployment.
