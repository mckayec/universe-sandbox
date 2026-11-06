# Checkpoint 9 — TL-R08 and TL-R09

Parent: `35ca9a2439299b7e99069de07f5e563a3416de90` (checkpoint 8, independently reviewed at PR46 `4c5e4444`). Religious Traditions only. Claude keeps implementation ownership; no release acceptance; PR33 untouched.

## TL-R08 (Medium) — record details now carry the full citation

`timeline-view.js` record details called `edgeCite(e, true)`, whose `short` guard dropped each source's alternate routes and scope. Details now call `edgeCite(e, false)`, the same rendering the relationship list uses: for X08, the publisher link, the inspected **chapter proof PDF** and **DOI** alternatives, and the "printed pp 34–36, 44–46" scope. Nothing else in the data or the gate pipeline changed; the only remaining effect of `short` is gone from details (a relationship with no locator now reads "no source locator on this relationship" there too).

## TL-R09 (Low) — visible undated-bracket legend on phones

The header `.tl-note` stays hidden at ≤760 px (header space), but the Overview intro, which is shown at every size, now says: "Brackets in the left gutter join related traditions; they are not dated." SVG titles and the accessible relationship list are unchanged.

## Evidence (this commit)

- `pnpm format`; `pnpm check`: 126/126 tests; `pnpm check:dist`: 121 files OK; `pnpm test:pages`: 12 pages x 2 viewports.
- [tl9/tl9-probe.mjs](tl9/tl9-probe.mjs) at 390x844 (touch, isMobile), 1440x900, 3840x2160, reduced motion: **16/16** — Overview legend visible and inside the viewport at all three sizes; X08 proof route + scope in the list **and** in Daoism details; no citation/scope overflow in details; the details proof link is focusable inside the dialog; zero console/page/request errors. Results: [tl9/results.json](tl9/results.json). Screenshots inspected: [390 overview](tl9/390-overview.jpg), [390](tl9/390-daoism-details.jpg) / [1440](tl9/1440-daoism-details.jpg) / [3840](tl9/3840-daoism-details.jpg) Daoism details.
- `pnpm test:browser` (main sandbox smoke, `tests/browser-smoke.mjs:88`, Save/Load count after "Clear all") times out in this run's container **on the unmodified parent 35ca9a2 as well**, with the locally available Chromium build 1243 (the repo's Playwright expects a different build). It does not touch the atlas timeline. Treat as an environment limitation of this run; CI on this head is the reference.

## Still open (unchanged)

Standard Works adapter with chapter-aware host gates, drag reorder, physical hardware/browser and assistive-technology acceptance; genealogy, succession, ordered dated travel, Apocrypha composition chronology and world calendars stay explicit gaps; all 169 record-level `src` arrays empty; CH13 403 and X08's partial independent inspection unchanged.
