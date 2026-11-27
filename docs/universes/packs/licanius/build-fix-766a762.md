# Licanius build fix

Pack PR #50 head `766a7627fcac419ae2ca8294ceb16ba02b50e3e5` (pack/licanius). The pack branch was based on engine
`a7df00fd`; it now contains (merge, no conflicts) engine PR #49 head `eb316b18acb4adfd03efa72795e2e8b6e7ff65c4`,
which includes `b2935646` (phone title wrap) and the neutral editorial tooltip. Previous pack head `48055796`.

## Resolution

| ID | Resolution | Location (`public/atlas/packs/licanius.js` at 766a7627) |
|---|---|---|
| LB-01 (medium) | LE04 text: "In Ilin Illan, Wirr tries to hold a precarious alliance together." It states the objective without success, using the research's own "precarious alliance" rather than introducing "rival factions". Book-3 gate, "Book 3 publisher description" locator and the publisher-premise note unchanged. | 134 |
| LB-02 | Journeys note: "Ordered stops documented in the recaps. This atlas has no verified coordinates, measured routes or timing." About coverage: "…These cards show the places and ordered stops documented in the recaps. This atlas has no verified coordinates or measured routes, so nothing is drawn on a map." Header comment now says the recaps give relations (north/south, proximity, ordered stops) and the author publishes a map of Andarra, but the atlas has no verified positions. Still nonspatial; no map imported. | 15–17 (comment), 299–300 (journeysNote), 311–312 (coverage) |

Focused test added (`tests/atlas-licanius.test.ts:131`): LE04 keeps gate 3 and the premise note, says "tries to" and not
"maintains"; neither the Journeys note nor the coverage line says the sources give no geography.

## Checks (on 766a7627)

- `pnpm format`: no changes.
- `pnpm check`: format check clean, build OK, **187/187** tests pass (11/11 Licanius, was 10), check-dist **124 files OK**.
- `pnpm test:pages`: **15 pages x 2 viewports** passed.
- Pack validator: licanius.js 0 issues, 0 warnings.
- `pnpm test:browser`: **passed** first run.
- Screenshots (1440x900 and 390x844, DPR 1, no page errors), looked at: [shots-fix-766a762/](shots-fix-766a762/)
  `licanius-le04-chron-book3-*`, `licanius-journeys-book2-*`, `licanius-about-book1-*`, `licanius-setting-book1-*`
  (editorial tooltip on "The setting" now reads "This atlas supplies this grouping or display label.").
