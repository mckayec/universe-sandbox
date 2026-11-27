# Hierarchy build fix

Pack PR #51 head `cc965ccf3490bab8ce9f40b7c18df76b3ba28eb2` (pack/hierarchy), which contains engine PR #49 head
`eb316b18acb4adfd03efa72795e2e8b6e7ff65c4` (engine/world-only), merged in at `14f0f928`. Fix commit `cc965ccf`.
Previous heads: pack `ddb4ad99`, engine `b2935646`.

## Resolution

| ID | Resolution | Location (`public/atlas/packs/hierarchy.js` at cc965ccf) |
|---|---|---|
| HB-01 | Each of the 8 locators now ends with its research ID and source tag, keeping the scene wording and gates: HE01/HE05/HE02 and HJ01 carry `S2`; HE03/HE06/HE04 and HJ02 carry `S3` (e.g. "Chapter I · HE01 · S2", "Chapter I, closing · HE04 · S3"). The About legend's promise ("Each card names its source and record number") now holds for event and journey cards. | 164, 174, 184, 194, 205, 215 (events); 229, 238 (journeys) |
| HB-02 | Journeys note: "This atlas shows only the documented order of stops, from two partial text itineraries. It does not plot positions or measure distances." Footer: "…All original rights remain with their respective holders. This atlas plots no map positions or distances; the author publishes the official maps." (replaces "Geography is schematic."). Both sequences and the cards layout unchanged. | 34 (footer notice), 70–71 (journeysNote) |
| HB-03 | Res blurb: "Res is one of the three worlds named in the second novel’s premise." Gate II and the synopsis source (HP10 · S3) kept. | 153 |

Engine change merged in (NB-02, see narnia): the shared default editorial tooltip is now neutral. Hierarchy keeps its own
`ui.editorialNote` ("This name is the atlas’s own label: the source gives no name for it."), which the audit did not
question for its four flagged records (container, archway site, crater, ridge).

## Checks (on cc965ccf)

- `pnpm format`: no changes.
- `pnpm check`: format check clean, build OK, **176/176** tests pass, check-dist **124 files OK**.
- `pnpm test:pages`: **15 pages x 2 viewports** passed (includes the Hierarchy reading-gate checks).
- Pack validator: hierarchy.js 0 issues, 0 warnings. Gate suite (tests/atlas-gate.test.ts) 10/10 (one new test).
- `pnpm test:browser`: first run timed out at tests/browser-smoke.mjs:88 (simulator Save/Load count wait; known pre-existing flake, no atlas code involved); rerun **passed**.
- Screenshots (1440x900 and 390x844, DPR 1, no page errors), looked at: [shots-fix-cc965cc/](shots-fix-cc965cc/)
  `hierarchy-chron-book1-*`, `hierarchy-chron-book2-*`, `hierarchy-journeys-book2-*`, `hierarchy-res-book2-*`,
  `hierarchy-footer-about-book2-*`. DOM text read back matches the strings above.
