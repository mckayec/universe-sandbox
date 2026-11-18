# S43 — The Church of Jesus Christ of Latter-day Saints: narrative copy and breadcrumb evidence

Reviewed PR33 `d84599cd2e67abc9265cc00873bd9eb482a0ce14` against `b878e38a49ba76394f5e5d144e0cf09ae8e40b1e`; prior review `b2a5e75c82c0028c13386b9361a4f171a0a04040`. Covers builder checkpoint 44. Bounded verdict: requested copy and breadcrumb identification close; breadcrumb readability and previously open release gates remain. No release approval.

## Verified closures

**AE09/AE10 copy closes.** Both use the exact S41 wording, removing only `/vision` from “New Testament narrative”. Names, substantive descriptions, Matthew 26:30–57 / 27:33–35 locators, 2/nt gates and all links are unchanged. AE14 retains its visionary classification. This inherits accepted source evidence; no new primary-source reading is claimed.

The generator removes only the two obsolete SEM entries, and the CSV removes exactly those two rows. All remaining **152 rows are identical**, with 94 keyword candidates, 23 not-vision classifications and 17 inherited-only children. The 35 date-bearing entries, all 21 vision-family children, runtime gates, source links and 146 omission dispositions remain unchanged. Two isolated crosswalk reproductions pass. No counts were artificially preserved by retaining false keywords.

**Jerusalem identification closes.** The supplied DOM probe identifies the spaced-capitals text as `#crumbs .here` inside the Location navigation, not a globe, site or region label. Its desktop rectangle (805,115,76,14) agrees with the previously inspected pixels; the separate site labels remain near the mapped Jerusalem anchor. Source inspection supports the `.here` uppercase/letter-spaced styling. Do not move geographical coordinates or globe labels to address this navigation text. The identification is supported by builder-provided DOM evidence plus independent source/pixel inspection, not a browser session executed by this reviewer.

**Exact-head CI gap closes for this head.** [Implementation CI 41576696804](https://github.com/mckayec/universe-sandbox/actions/runs/41576696804) completed success at `d84599c`. This does not retroactively create runs for earlier skip-ci heads. Pages CI remains distinct from separately claimed `test:browser` and hardware acceptance.

## Readability finding and builder guidance

**S43-V1 — breadcrumb link readability remains unresolved.** Actually inspected both `s44-crumbs-detail.jpg` and `s44-crumbs-1440x900.jpg`. The non-current “Milky Way” and “Earth” navigation text is very faint over bright terrain; the current Jerusalem crumb is clearer. This confirms the builder's existing observation, not a newly introduced regression. Current CSS uses transparent buttons with muted foregrounds above variable imagery; its existing shadows do not make the supplied crop consistently readable. No numerical contrast ratio or accessibility conformance result was measured, so none is claimed.

Provide a stable contrasting breadcrumb surface/foreground treatment that works over bright land, dark sea and space, with readable hover and focus states. A suitable opaque or sufficiently strong backdrop is preferable to assuming a stronger shadow alone solves every background. Preserve link semantics, labels, gates and navigation actions. Return same-runtime crops at desktop and narrow widths across representative light/dark backgrounds and relevant packs, plus text/background contrast measurements from actual rendered colors and keyboard-focus evidence. Do not mistake this identification crop for a finished-render acceptance capture: the full image visibly says “CHARTING SURFACE”.

**Repeated “Earth › Earth”:** this reflects group and world names, not two different geographic Earths. Treat deduplication as optional navigation clarity, separately from restoring readable links. Do not simply delete one same-text crumb if it performs a different navigation action; if consolidated, preserve both destinations where they differ, including accessible names and keyboard access. No new canon research or owner scope decision is needed to investigate this safely, but no implementation is done here.

## Checks and precise evidence limits

- Exact-head `node --test tests/lds-pack.test.ts tests/atlas-layers.test.ts`: **63/63 passed**; saved log.
- `python docs/universes/packs/lds-standard-works/supplementary-review-s43/verify.py`: exact two-string-only pack change, engine/layers/CSS/import and omission equality, exact CSV removal with all remaining rows unchanged, two isolated generator reproductions and conflict check. Results saved.
- Supplied `s44-crumbs-probe-output.txt` has desktop and emulated-phone identification records, terminal PASS and exit 0. The script uses programmatic DOM click to select the site. This establishes identity/position, not physical tap/keyboard selection, full browser-smoke coverage or measured contrast. No new independent browser, server or DOM execution was performed here.
- Existing keyboard-order code is unchanged. Earlier bounded traversal evidence carries forward, with its 120-stop cap and hardware limits; no fresh full traversal claim.

## Mergeability and next handoff

Fresh GitHub lookup reports open/unmerged and **mergeable true** at `d84599c`. Independent `git merge-tree --write-tree --name-only` against fetched main **934b95e729a3439fad39a98fe7ca8cbc4c8362a7** returned exit 0, no conflict paths (tree `b2f8c57f49a98765e8b31d1e1b7c06757355fd9b`). No branch or working-tree merge occurred. Recheck current main before any later separately authorized merge; mergeability does not constitute acceptance.

Claude can proceed with breadcrumb readability, wider source-vision/semantic omission accounting and final finished 4K/1280/phone evidence in parallel with timeline research. All 1,271 imports remain accounted, but 146 summary-level omission dispositions are not newly source-certified. Final same-head content/technical, full keyboard/native-select, finished rendering and real-GPU/physical-phone evidence plus specific-PR owner approval remain. Preserve ownership/locks and nonblocking follow-ons; no research wait, approval, merge, deployment or release is imposed/performed.
