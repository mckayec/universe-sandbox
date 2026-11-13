# S44 — The Church of Jesus Christ of Latter-day Saints: breadcrumb contrast

Reviewed PR33 `4aa6571c45bd6cc9063e77c57f7a40156e0a4c26` against `d84599cd2e67abc9265cc00873bd9eb482a0ce14`; prior review `673556dccd1a5fa45e51189857852e795b945d9e`. Covers builder checkpoint 45. No release approval.

## Verdict

**S43-V1's text-readability correction closes in the inspected scope.** The added 88%-opaque themed dark surface makes the breadcrumb readable in both supplied 1440 and 390 crops. The generic change preserves existing text/link/current-item colors and all navigation semantics. Separators use muted text at 75% opacity. `:empty` hides an unused strip. Pack data, engine JavaScript, gates, chronology, sources and all prior import/semantic accounting remain unchanged. Earth/Earth retains distinct group/world actions as previously advised.

Independently recalculated source-theme contrast across the seven named packs and pure-white/pure-black backdrop endpoints. Minimum ratios: **links 5.3145:1; current text 7.8470:1; hover text 11.2563:1; separators 3.6292:1**. Calculations use source colors plus alpha compositing, not screenshot pixel sampling or a browser run. All actual themes use a sufficiently dark composite surface that the bright endpoint bounds text contrast in this model. This corroborates the builder's computed-color results, including the reported 5.31 minimum link ratio. [W3C's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), checked 2026-11-03, uses 4.5:1 for ordinary text and warns that nominal contrast is not a complete readability assessment. This is not a blanket WCAG conformance finding.

## Independent checks

- `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`: **63/63 passed**, saved log. These tests do not prove CSS rendering.
- `node docs/universes/packs/lds-standard-works/supplementary-review-s44/verify.cjs`: pins both SHAs, proves CSS is the only changed runtime file, loads seven actual pack themes in a pure VM and independently computes default/current/hover/separator colors over both backdrops. Saved per-pack results. No DOM/browser/server execution.
- Exact-head implementation [CI 41581474504](https://github.com/mckayec/universe-sandbox/actions/runs/41581474504) completed success. Pages CI is not separate full browser smoke or hardware acceptance.

Actually inspected `s45-crumbs-1440.png` and `s45-crumbs-390.png`: all four breadcrumb labels are visible with the dark surface; no obvious text overlap in these crops. Their cropped scope does not establish full-page layout, finished baking or all long breadcrumb paths. CSS padding/border changes the strip's dimensions even though its top/left positioning rules are unchanged; final compact-layout checks should include long paths and focus outlines.

## Probe/receipt precision and remaining tests

Builder `s45-crumbs-contrast-probe-output.txt` reports 14 pack/viewport cases, all visible and nonempty, zero page errors, terminal PASS/exit 0. This is useful computed-style evidence. It samples two viewports, seven hardcoded packs and initial crumbs; it does not traverse every possible path. Black/white backgrounds are mathematically composited, not actual rendered dark/light captures for every pack. Hover was not exercised by that probe; the independent source calculation above checks its color, not pointer interaction.

**S44-A1 (evidence wording, not a text-color blocker):** the script comment says it Tabs to the first crumb and the receipt describes keyboard focus, but the script calls `b.focus({focusVisible:true})`. Replace that claim with “Programmatic focus with focus-visible requested on the first breadcrumb; computed outline color/style inspected.” No keyboard traversal occurs in this probe. The ring calculation against the modeled surface is not a measurement of a fully visible outline: narrow CSS uses `overflow:hidden`, and no focused screenshot or clipping assertion is supplied. Return actual Tab-reached focus evidence in the existing final keyboard pass, including first/last links and narrow layouts. This preserves an existing acceptance gate rather than reopening the text-color correction.

The probe logs `visible` and item counts but does not assert them; the supplied run has valid nonempty cases, so its results are usable. Harden future reruns to fail on hidden/empty breadcrumbs rather than silently testing no labels. It catches page exceptions, not all console/request failures. Do not broaden “zero page errors” into “zero browser/network errors”. Its older luminance breakpoint differs from current guidance; the independent calculation uses 0.04045 and produces the same rounded conclusions for these colors.

## Next handoff

Claude can retain this contrast treatment and continue final keyboard/compact-layout evidence, finished 4K/1280/phone captures and wider source-vision/semantic omission work in parallel. No new canon/source defect was introduced; no scripture reread requested. The 1,271 imports remain accounted and the 146 summary-level omission dispositions remain unclosed by this UI test. Physical-phone/real-GPU acceptance, final same-head technical/content evidence and specific-PR owner approval remain required. Preserve Claude ownership/locks and nonblocking timeline/basemap/Cosmere follow-ons. No implementation edit, approval, merge or deployment performed.
