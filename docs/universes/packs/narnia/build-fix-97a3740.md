# Narnia build fix

Pack PR #52 head `97a374092325b8d7c294127211c2c27fc687219a` (pack/narnia), which contains engine PR #49 head
`eb316b18acb4adfd03efa72795e2e8b6e7ff65c4` (engine/world-only). Previous heads: pack `c6f8c1a1`, engine `b2935646`.

## Resolution

| ID | Resolution | Location |
|---|---|---|
| NB-01 | The book-I London card (P16) now reads "Four siblings are sent away from London during the wartime air raids." No surname appears in any book-I place text. The book-VI Digory and Polly addition is unchanged. | `public/atlas/packs/narnia.js:97` |
| NB-02 (engine) | Engine commit `eb316b18`: the default badge tooltip is now "This atlas supplies this grouping or display label." and never claims the source is silent about a name. A record may carry its own `editorialNote`, which overrides `ui.editorialNote` (exported helper `AtlasCards.editorialNote`). The validator rejects a non-string/empty `editorialNote` and warns when it sits on a record without `editorial:true`. PACK_FORMAT §22 documents the precedence. | `public/atlas/cards.js:36–42, 85, 212, 750`; `tests/atlas-pack-validator.mjs:124–129, 133, 221, 352`; `tests/atlas-gate.test.ts:105–114`; `docs/atlas/PACK_FORMAT.md:883` |
| NB-02 (pack) | `ui.editorialNote` = "This atlas supplies the grouping or display label." (the audit's wording). Per-record notes: Narnia (world) "The books name Narnia. This atlas supplies the world-level grouping and its display label."; Earth "This atlas supplies this grouping of the children's home-world places and its display label."; Country beyond the stable door "A descriptive display label supplied by this atlas." The three flags and the container/political-boundary notes are unchanged. | `public/atlas/packs/narnia.js:84, 93, 107, 229` |

Focused test added (`tests/atlas-narnia.test.ts:131`): no "Pevensie" in book-I place text; all four tooltip strings exist
and none says the place has no name. Hierarchy (own `ui.editorialNote`) and Licanius (now the neutral default, which
fits its "The setting" container and "Caladel school site" label) were re-read in the browser after the engine change.

## Checks (on 97a37409)

- `pnpm format`: no changes.
- `pnpm check`: format check clean, build OK, **185/185** tests pass (9/9 Narnia, was 8), check-dist **124 files OK**.
- `pnpm test:pages`: **15 pages x 2 viewports** passed.
- Pack validator: narnia.js 0 issues, 0 warnings.
- `pnpm test:browser`: **passed** first run.
- Screenshots (1440x900 and 390x844, DPR 1, no page errors), looked at: [shots-fix-97a3740/](shots-fix-97a3740/)
  `narnia-london-book1-*`, `narnia-earth-book1-*`, `narnia-narnia-world-book1-*`, `narnia-stable-door-book7-*`.
  The badge tooltip is a `title` attribute (not visible in a still), so its text was read back from the DOM for each
  card and matches the strings above.
