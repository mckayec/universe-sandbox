# TH01-RULES-01 return at PR48 61e26af

Claude, 2026-11-20 UTC. Implements only [th01-handoff-2026-11-20.md](th01-handoff-2026-11-20.md) TH01-RULES-01. Not merged; no PR24/PR37 edit; no canon approval; no gate change; TH01 remains incomplete (unit 1/2).

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 61e26afb4514f4b9510f33ce9f8b0b7bbe84e964                                                   |
| actual parent (handoff head)              | 0636b08ad9096274c793e045cc601324945844d9                                                   |
| cosmere.js blob at head                   | 05170eab9f4c10f18c98a6fac51cf825e63c8a56 (parent 7850087a03ff82650632d28015c755568f8d784f) |

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +1/−1 (source line 175, `SITES_THRENODY`): `worlds[threnody].sites[forests].desc`, last sentence only:
  `No fire, no blood: the Simple Rules keep you alive.` → `To avoid drawing shades, the Simple Rules prohibit kindling flame, shedding another’s blood, and running at night.`
  Preceding sentence preserved byte-for-byte. No id, coordinate, name, books, first, req/needs, field gate, parent, registry, e32, geometry or other prose change. engine.js and reading.js unchanged. Accepted Kenton (TA01-KENTON-01) and earlier corrections retained; PR37 nested landmarks not imported.
- `tests/atlas-th01-rules.test.ts` (new, 2 tests).

## Evidence

| Check | Result |
| --- | --- |
| Focused test, head | **passed** 2/2. Source: new sentence once, old sentence and "keep you alive" absent; whole-source reversal equal to parent; parsed pack with only the sentence reversed deep-equals the parent build. Actual engine selectors (evOk/eText, siteSeen/sDesc, rdWorldHidden, eraBlurb, eraVal cut from engine.js) in 13 reading states: 819/819 event (visibility+text) and 91/91 Threnody-site (visibility+description) comparisons equal to parent except the forests sentence substitution where visible; world hidden, blurb and facts equal in 13/13; old wording returned in 0/13. Parent exposure asserted: exactly All, legacy7, legacy12, bucket7, all works (5/13). |
| Focused test against actual parent pack | **fails** at the "new sentence occurs once" guard (expected) |
| `pnpm format`, `pnpm check` | **passed**, 663/663 tests, check:dist 115 files OK |
| `pnpm test:pages` | **passed**, 12 pages x 2 viewports |
| Rendered [th01rules-probe.mjs](th01rules-probe.mjs) | head **80/80**; actual parent pack 48/80 (32 expected failures = 4 eligible states × 4 text checks × 2 viewports). Raw: [head](th01rules-rendered-output-61e26af.txt), [parent](th01rules-rendered-negative-0636b08.txt) |
| `pnpm test:browser` | **failed** (2/2 runs) at `tests/browser-smoke.mjs:88` `waitForFunction` timeout — the known open Save/Load wait limitation, unrelated to this field. Not claimed as passing. |

Rendered probe scope: `pnpm preview` of the head build, routes `/atlas/index.html?pack=cosmere` + hash; 1440x900 and 390x844 (touch; phone sheet expanded with a real tap on `#grab`), 6 states each: All (`#book=0`), legacy7, legacy6 (denied), full bucket 7, all works, Shadows for Silence only (denied). Threnody is selected **programmatically** (`__atlas.selectWorld`); the Forests of Hell place is then opened with a **real click (desktop) / tap (phone)** on its Places button and its `.place.sel .pd` text read from the DOM. Eligible states (4/6 per viewport): list and opened descriptions equal "preserved sentence + replacement", opened site is `forests`, description inside the viewport, old sentence absent from page text. Denied states (2/6 per viewport): no forests place button, neither sentence on the page. 0 console/page errors in 12/12. Screenshots (All, desktop; bucket 7, phone): [desktop](shots/th01rules-head-1440x900.jpg), [phone](shots/th01rules-head-390x844.jpg) — viewed; text wraps cleanly in the dossier on both.

## Limits retained

- Shadows for Silence alone still hides Threnody's sites — the existing whole-bucket fallback, not a per-work mapping; unchanged here and not authorized by this packet.
- Not certified: the forests site's first sentence, other Threnody sites/blurb/facts, e32, astronomy/Shard claims, edition mapping. Rule exceptions, silver protection and shade mechanics not asserted.
- Save/Load and search/graph/modal surface-route limitations unchanged. Not in scope: PR24/PR37.

fixing/claude → implementation-review/chatgpt.
