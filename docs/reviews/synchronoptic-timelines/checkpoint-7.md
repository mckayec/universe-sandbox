# Timeline checkpoint 7 — claim-specific relationship locators

Branch `engine/timelines` (draft PR #45), parent `24655ebda5b1c6b98803f4283fbd1e7b5a063069` (the head independently
reviewed in independent-review-24655eb.md on PR #46 at `69878c9`). Exact head: see status.md / the commit that adds
this file.

## What was open

parallel-handoff-review.md (checkpoint 6 review): "continue claim-specific relationship locators (129 unsourced
relationships; zero drawn connectors) and accessible connector details". Proposal correction 1 requires a source
locator on every displayed factual relationship.

## What changed

- **`tl7/relationship-locators.csv`** (review artifact, one row per timeline relationship, 129 rows): each
  relationship already in the pack is pointed at the research row that states it — the Judaism typed-relationship
  ledger (§8 JU-R01–R18), Christianity §6/§6a node-relation rows, the Islam "Explicit graph edges", ISL/ISC/ISM rows and
  the named Salafi/Wahhabi, Deobandi/Sufi and Barelvi relationships, and the crosswalk edge rows AI290/291/293/294/
  299–303 in identity-and-edges.csv — with that row's own evidence keys. No relationship, endpoint, date or evidence key
  was added; every key comes from the cited row. **95 sourced, 34 editorial.**
- **Editorial rows** are the pack's own overview groupings: the 30 ties labelled "grouped in this overview" (under the
  `judaism` and `christianity` overview containers) and the 4 "selected modern movement (overlapping)" ties under
  `islam`. identity-and-edges.md: "Generic editorial containers … are not factual origin claims and need no invented
  historical source." They are listed as "overview grouping, not a historical claim", never drawn, and no longer counted
  as missing sources. A test pins editorial marking to exactly those two pack labels.
- **`tl7/build-locators.mjs`** generates the data part
  `public/atlas/packs/abrahamic-world-religions/relationship-sources.js` from the CSV and the four dossiers' source
  registers (62 keys used; title + URL each). Register titles lost some spaces in the dossiers ("7December1965",
  "VaticanII"); the generator restores spacing for display only — words, numbers and punctuation are unchanged. The
  part is registered after the four tradition parts in `registry.js`; the pack file itself and its accepted content are
  untouched (the pack does not read the part).
- **`timeline.js`**: `relSourcesOf` / `withLocator` attach the locator to each relationship by key
  `<p|m|l>:<from>><to>`; a relationship's own `src` still wins. `visible()` adds `editorialEdges`; `unsourcedEdges`
  excludes them; `coverage()` reports `sourced` / `editorial` / `unsourced`. Gating is unchanged (endpoints and the
  edge's own gate before anything else). A pack without the part adapts exactly as before.
- **`timeline-view.js` / `engine.css`**: every relationship row (list view and record details) now ends with
  "Source: <dossier · ledger row> — <key · title>; …", each source linked (https, new tab, `noopener noreferrer`);
  editorial rows say "overview grouping, not a historical claim". Coverage text: "129 relationships: 95 with a source
  locator, 34 overview groupings (not historical claims), 0 without a locator." Drawn connectors get an SVG `<title>`
  (both endpoint names and the relationship type) for pointer hover; the list view remains the keyboard/screen-reader
  equivalent of the chart's connectors.

## Evidence (this head, Chromium / SwiftShader)

- `pnpm format`, `pnpm check`: 125/125 tests, check:dist 121 files OK. New tests: every relationship sourced or
  editorial (never both), overlay keys all match pack relationships, every locator names a dossier row, every source
  key resolves with an https URL, hand-checked rows (`p:jud-second-temple>jud-rabbinic` = JU-R04 · JU03, JU05;
  `l:islam>daoism-reference` = AI299 · X08, X09), editorial never drawn, gates still remove cross-layer ties, a pack
  without the part is unchanged.
- `pnpm test:pages` 12 pages x 2 viewports; `pnpm test:browser` passed (one earlier run timed out at the main
  sandbox's Save/Load count while a stray preview server was still running; it passed once that was stopped, and passed
  at the parent).
- `tl7/tl7-locator-probe.mjs` **37/37** at 390x844, 1280x800, 1440x900, 3840x2160: coverage counts; no
  "no source locator" gap; 9 drawn connectors (up from 0), each with a `<title>`; list view 129 relationships = 95 cited
  + 34 editorial + 0 gaps; 123 citation links, all https/new tab/noopener; no citation past the viewport edge; Rabbinic
  Judaism details cite JU-R04 with JU03; Tab x40 stays in the timeline; Escape closes; zero console/request errors.
  Output: `tl7/results.json`. Captures: `tl7/{390,1440,3840}-chart.jpg`, `tl7/{390,1280,1440,3840}-details.jpg`
  (inspected).

## Limits and still open

- This is a builder mapping of pack relationships to the research rows that state them; it is not an independent
  re-reading of the sources. Review should sample the CSV against the dossiers (especially the Islam rows, where the
  dossier gives classification rows rather than a numbered ledger, and the AI293/AI294 pair collapsed into the pack's
  single Hindu philosophy → Sufism tie).
- Only 9 of 95 sourced relationships are drawn: the rest have at least one undated endpoint, which stays off the axis.
- Observation: at 1440 a few connectors in the Christianity lane cross row labels (Anabaptist/Baptist); cosmetic.
- Unchanged gaps: family genealogy, succession, travel with ordered dated stops, Apocrypha chronology, world calendars;
  the Standard Works adapter with chapter-aware host gates; drag reorder; physical devices.
