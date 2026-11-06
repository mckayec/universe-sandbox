# Independent checkpoint 8 review

Reviewed exact PR45 head **35ca9a2439299b7e99069de07f5e563a3416de90**, parent `eaa2e9c303883b88b3f239898c32181d5575e3c8`, on 2026-11-03. Religious Traditions only. Claude retains implementation ownership; PR33 is untouched. No approval, merge, deployment or final source/device acceptance.

**TL-R07 is resolved within the bounded chart contract.** The nine relationships now use row-linked brackets in a separate gutter, without any calendar coordinate. JTS's relationship no longer implies 1801 or substitutes an invented 1886 relationship date. The previous Christian-label crossings are removed. Two remaining presentation findings are below; neither invalidates the corrected gutter geometry.

## TL-R08 — Medium: record details still omit the inspected source route and scope

Reproduce at 390, 1440 or 3840 pixels: Timeline → List → select Daoism (also applicable to the other X08 contact targets). Its relationship citation shows the original X08 publisher link, but **no chapter proof PDF, DOI alternative or scope**. The relationship list itself shows all of these. `timeline-view.js:604` calls `edgeCite(e, true)`; the `!short` guards at lines 52–53 suppress the new fields in the record panel.

Thus checkpoint-8.md's statement that scope appears in both list and details is not true of the rendered implementation. The original route returned only “Loading…” during checkpoint 7 review; the inspected alternative is particularly useful here. Do not require a user who opens record details to discover the separate relationship list to recover it. Render the alternate routes and scope in record details too, or provide a clearly labelled route to the full citation. Verify the proof link and page scope in **both** locations at phone and desktop widths. This is a usability/provenance presentation gap, not evidence the historical claim is false.

## TL-R09 — Low: phone view hides the undated-bracket explanation

At 390×844, `.tl-note` is `display:none` (`engine.css:629`). The newly added header explanation therefore disappears precisely where touch users cannot rely on SVG hover titles. Overview explains windows/bars/diamonds but does not explain the gutter brackets. Geometry still separates relationships from dates; the semantic explanation is missing from the ordinary phone view.

Keep a concise visible undated-relationship legend in Overview or another compact location at narrow widths. Retain named source/target/type information in the accessible relationship list and the SVG titles. Verify by actual screenshot and keyboard/touch-emulated navigation; this does not substitute for physical-device or screen-reader acceptance.

## Independent verification

Evidence: [independent-35ca9a2](independent-35ca9a2/). Reviewer-owned probes were run against a fresh production build of the exact detached head, not the builder's stored results.

- npm package-script equivalents of format/build/test/dist pass: **126 tests, 121 distribution files**. Direct Prettier check of both timeline modules passes.
- Previous independent browser regression probe: **59/59**, with zero observed console/page/request/HTTP errors. Covers phone filter taps, collapsed-list completeness (169 records), notes/identity guards, clear/deselect/gate-refresh focus, lane order/default URL restoration, unsupported range removal, Back/Forward and codex navigation.
- New gutter/source probe at **390×844, 1440×900 and 3840×2160**, reduced motion: checks initial view, zoom twice, reset, collapse, expansion and reordered lanes. Nine paths initially, six with Judaism collapsed, nine after expansion. All path bounds remain inside the gutter; no page overflow. Titles explicitly call the relationships undated. Source/target row association is retained by the model; no endpoint dates changed. Source-link keyboard navigation remains inside the dialog and Escape closes at all three sizes.
- All three sizes show X08's proof link and page scope in the relationship list, and omit both in Daoism details: TL-R08 reproduced. Phone screenshot and CSS inspection confirm TL-R09. Actual chart and phone-details screenshots inspected; the charts no longer draw relationships through record labels.
- Independent old/new generated-data comparison: **129 edge mappings unchanged; all 62 primary titles/URLs unchanged; 52 source scopes added**. X08's alternate proof/DOI routes and printed-page scope match the pre-existing dossier register. These fields convey the dossier researcher's inspected scope, not a new assertion that this reviewer reread those full pages. Checkpoint 7's bounded 13-key external sample and remaining retrieval/verification limits still apply; no new external-source certification in this pass.
- `coverage().drawable` correctly replaces the ambiguous `drawn` name: 95 sourced candidates, distinct from nine default rendered brackets. The unchanged gate pipeline filters records and both endpoints plus each edge's gate before view/count/search/URL operations; existing tests and host-filter regression still pass. No new bypass found.
- Exact-head CI [41615904659](https://github.com/mckayec/universe-sandbox/actions/runs/41615904659) reports success. The supplied CI evidence says standalone-page checks passed and deploy was skipped. Local full standalone/browser smoke suites were not rerun; targeted runtime testing above is independent. No deployment was requested by this review.

Reproduce: build this exact head, preview on port 4198; run `source-compare.mjs` from repository root and `gutter-probe.mjs`; run `regression/probe.mjs` with `BASE=http://127.0.0.1:4198/atlas/?pack=abrahamic-world-religions`. Probes use Playwright with `/usr/bin/chromium`, SwiftShader and emulated phone touch. Initial local launch preceded build completion and a first probe used an ambiguous zoom selector; these harness issues were corrected before the recorded completed runs. They were not product failures. The published gutter probe scopes zoom controls to `#timeline` and verifies lane order after URL restoration.

## Handoff

Claude can fix TL-R08/TL-R09 immediately without another proposal-review wait. Keep TL-R01–R07 closed only within the documented bounded prototype contract. Preserve all remaining gaps: **Standard Works adapter, chapter enforcement, all 169 empty record-level explicit citation arrays, genealogy, succession, ordered dated travel, Apocrypha composition chronology, world calendars, drag reorder, physical hardware/browser and assistive-technology acceptance**. CH13's prior 403 and X08's partial independent inspection remain limitations. PR33's separate review and release gates are unchanged.
