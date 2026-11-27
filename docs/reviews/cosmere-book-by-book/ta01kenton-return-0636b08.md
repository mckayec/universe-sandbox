# TA01-KENTON-01 return at PR48 0636b08

Claude, 2026-11-20 UTC. Implements only [ta01-handoff-2026-11-20.md](ta01-handoff-2026-11-20.md) TA01-KENTON-01. Not merged; no PR24/PR37 edit; no canon approval; no gate change; TA01 remains incomplete (unit 1/2).

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 0636b08ad9096274c793e045cc601324945844d9                                                   |
| actual parent (handoff head)              | 9a6e54bdf4f33364bc98b9f2482d75e1c5868857                                                   |
| cosmere.js blob at head                   | 7850087a03ff82650632d28015c755568f8d784f (parent 0f5f5dd897f959bfa9afe4bb8af04bc95fb38f21) |

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +1/−1: Taldain world `blurb`, last sentence only:
  `Kenton, son of their leader, is left as the only master after a massacre.` → `After a massacre of the Sand Masters, Kenton believes himself to be the only survivor.`
  No gate, era, book list, registry, id, geometry, event, fact, site or codex change. engine.js and reading.js unchanged (blobs 0bc5357… / 4d9bc17… as in the handoff). Accepted SA07/WAT06 omissions retained.
- `tests/atlas-ta01-kenton.test.ts` (new, 2 tests).

## Evidence

| Check | Result |
| --- | --- |
| Focused test, head | **passed** 2/2. Source: new sentence once, old sentence and "only master" absent; whole-source reversal equal to parent; parsed pack with only the sentence reversed deep-equals the parent build. Actual engine selectors (eraBlurb, eraVal, evOk/eText, siteSeen/sDesc, rdWorldHidden cut from engine.js) in the 16 handoff states: 1008/1008 event (visibility+text) and 144/144 Taldain-site (visibility+description) comparisons equal to parent; world hidden and facts equal in 16/16; blurb equals parent with only the substitution wherever visible; old claim returned in 0/16. Parent exposure asserted inside the test: exactly All, legacy7, legacy12, bucket7, all works (5/16). |
| Focused test against actual parent pack | **fails** at the "new sentence occurs once" guard (expected) |
| `pnpm format`, `pnpm check` | **passed**, 661/661 tests, check:dist 115 files OK |
| `pnpm test:pages` | **passed**, 12 pages x 2 viewports |
| Rendered [ta01kenton-probe.mjs](ta01kenton-probe.mjs) | head **56/56**; actual parent pack 32/56 (24 expected failures = 4 eligible states × 3 blurb checks × 2 viewports). Raw: [head](ta01kenton-rendered-output-0636b08.txt), [parent](ta01kenton-rendered-negative-9a6e54b.txt) |
| `pnpm test:browser` | **failed** (2/2 runs) at `tests/browser-smoke.mjs:88` `waitForFunction` timeout — the known open Save/Load wait limitation, unrelated to this field. Not claimed as passing. |

Rendered probe scope: 1440x900 and 390x844 (touch; phone sheet opened with a real tap on `#grab` when collapsed), 6 states each: All (`#book=0`), legacy7, legacy6 (denied), full bucket 7, all works, White Sand Volume 1 only (denied). Taldain is selected **programmatically** (`__atlas.selectWorld`), not by a user click on the world; the blurb is a **direct DOM read** of `#dossier p.blurb`. Eligible states: blurb ends with the replacement exactly once. Denied states: no Taldain blurb, replacement text absent. "only master" absent from page text in 12/12. 0 console/page errors in 12/12. Screenshots (All, desktop; bucket 7, phone): [desktop](shots/ta01kenton-head-1440x900.jpg), [phone](shots/ta01kenton-head-390x844.jpg). The tooltip path (`showTipWorld`, first blurb sentence) is unaffected because only the last sentence changed; not separately rendered.

## Limits retained

- Volume 1 alone / original three volumes / all four White Sand entries still hide Taldain — the existing whole-bucket fallback, not a per-work mapping; unchanged here.
- Not certified: the rest of the Taldain blurb, facts, sites, e33, Khriss/Autonomy cross-work claims, edition mapping (TA01–03 vs TA04), S6/S7 date conflict.
- Save/Load and search/graph/modal surface-route limitations unchanged. Not in scope: PR24/PR37, SA07 deferred items.

fixing/claude → implementation-review/chatgpt.
