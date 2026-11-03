# Timeline checkpoint 8 — TL-R07: undated relationship connectors; X08 inspected route and scope

Branch `engine/timelines` (draft PR #45), parent `eaa2e9c303883b88b3f239898c32181d5575e3c8` (checkpoint 7, reviewed in
PR46 `independent-review-eaa2e9c.md` at `aa9fcfc`). Exact head: see status.md / the commit that adds this file.

## TL-R07 (Medium) — connector placed on the time axis

**Cause.** `timeline-view.js` drew both ends of every connector at the target's first emergence year, so JTS →
Conservative/Masorti began at 1801 on the JTS row, 85 years before JTS (1886). The relationship (JU-R14) has no date.

**Fix — explicitly non-temporal rendering.** Relationships are now drawn as brackets in a gutter left of the time
axis, outside any year position:

- `timeline.js` (pure, tested): `bracketColumns(spans)` assigns each connector a gutter column so brackets whose row
  spans overlap never share one; `gutterWidth(count)`; `bracketPath(col, count, ya, yb)` — a short nub at each
  endpoint row and a vertical join, every x inside the gutter.
- `timeline-view.js`: the time axis (`X`), lane titles, label fallbacks and year ticks start right of the gutter;
  the gutter is a faint band titled "Relationship links: undated, joined by row only"; each path's `<title>` names
  both records and the relationship type and adds "(relationship not dated; the bracket joins the two rows, its
  position is not a year)". The header note adds "relationship brackets at the left are undated".
- No date was invented: no endpoint is moved to 1886 or any other year. A relationship that did carry its own date
  would still render in the gutter (none of the nine does); its date stays in the list/details.
- This also removes the Christian connectors crossing row labels (they no longer enter the chart body).
- `coverage().drawn` is renamed `drawable`: it counts sourced candidates (95), not rendered paths (9 at default).

**All nine paths checked** (the reviewer asked for windows and sources that start later than targets): Anglican →
Methodist, Latter Day Saint movement → Utah / Community of Christ / Bickerton / Strang, Ananites → Karaite, JTS →
Conservative/Masorti, Second Temple → Early Jesus communities, Anglican → African church. Each joins exactly its two
endpoint rows and no x coordinate reaches the time axis.

## X08 source access (follow-up)

`tl7/build-locators.mjs` kept only the first publisher URL. It now also keeps, per register row, the other links
(the "use" column's inspected copies first, then the remaining title-cell links) as `alt`, and the "use" text as
`scope`. X08 now shows the publisher route plus "(also: chapter proof PDF, 10.1515/9781474402286-006)" and "Scope:
Publisher routes returned loading/403; subsequently inspected chapter proof PDF, printed pp 34–36, 44–46 …". 52 of the
62 keys have a scope line. Regenerated part: edges identical, primary title/URL unchanged for all 62 keys (diffed).
Scope is shown in the list and details only; short (overview) citations are unchanged.

## Evidence

- `pnpm format`, `pnpm check`: 126/126 tests (new: "TL-R07: relationship connectors are undated brackets outside the
  time axis" — nine drawable connectors, JTS edge has no date, every x inside the gutter, each bracket touches only
  its two rows, no overlapping brackets share a column), check:dist 121 files OK.
- `pnpm test:pages` 12 pages x 2 viewports; `pnpm test:browser` passed.
- `tl8/tl8-connector-probe.mjs` at 390x844, 1280x800, 1440x900, 3840x2160 (reduced motion): **97/97**, zero
  console/page/request errors. Per size: nine connectors, all in the gutter; marks, lane titles and ticks right of
  the gutter; every title says "not dated"; JTS → Conservative/Masorti joins exactly those two rows; the same after
  zoom x2.5, after collapsing the first lane (its connectors removed) and after re-expanding (nine again); list still
  129 relationships; X08 shows the proof link and page scope; no citation/scope runs off screen.
- Checkpoint 7 probe `tl7/tl7-locator-probe.mjs` rerun on this build: 37/37 (run from a temporary copy so the tl7
  evidence is not overwritten).
- Screenshots looked at: `tl8/390-chart.jpg`, `tl8/1440-chart.jpg`, `tl8/3840-chart.jpg`.

## Still open (unchanged)

Standard Works adapter with chapter-aware host gates; drag reorder; physical devices and assistive technology;
genealogy, succession, ordered dated travel, Apocrypha composition chronology and world-calendar data remain explicit
gaps. All 169 record-level `src` arrays remain empty. CH13's WCC route returned 403 to the reviewer — not changed
here (no replacement source invented). No PR33 changes. Not merged.
