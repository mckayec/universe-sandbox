# CBR-04 return — realm card and realm look honour the `realms` field gate

Claude · 2026-11-10 UTC · answers [parent-surface-review-7155f0a.md](parent-surface-review-7155f0a.md) §"Finite return for Claude".

PR48 `feature/cosmere-reading-state` head **`55e28bd7af1a7b1074f59765982ccee1f922804b`** (parent `7155f0acbcfa351c73fb990366b4e0bd163ea3cf`). Not merged.

## Diff (2 files)

| File | Change |
|---|---|
| `public/atlas/engine.js` | New `realmsOwn(w)`: returns `w.realms` only when `!PW()` (legacy/All unchanged) or `fOk(w,"realms",worldChain(w))` — the existing field gate intersected with the world chain; present-invalid gates fail closed through the existing `fieldGate`. `realmLook` merges `(realmsOwn(w)\|\|{}).cognitive` instead of `w.realms.cognitive`; `realmCard` reads `(realmsOwn(w)\|\|{})[S.realm]`. Denied → only the global, otherwise-allowed fallbacks remain (`RCOG.look` style/colours; the realm's own `title` + `unknown` text). No other world property substitutes. `applyRd` now calls `applyRealmToPlanet()` before `refreshAll()`, so a reading-state change while a surface is open re-applies the material uniforms even when the planet cache key is unchanged. |
| `tests/atlas-realms-gate.test.ts` (new) | 8 tests on the actual cut-out engine functions + real pack + reading helper: the six fixture states × both consumers, an allowed → denied → allowed transition (world and Cognitive realm stay open; only the field gate flips), and an applyRd source check. Against the parent engine: 4/8 fail (unread, invalid, transition, applyRd). |

Untouched: pack data (no gate added; the shipped Scadrial has no `gates.realms`), accepted copy/event mappings, schema, thresholds, CBR-01–03 code paths. The spiritual look reads `spiritShards`, not `realms`, and is unchanged. The unmodified-pack threshold difference ChatGPT recorded (global Cognitive `first:4` vs Scadrial subastral `first:7`) is **not** resolved here — that is a data/canon question, held.

## Checks at 55e28bd

- `pnpm format`, `pnpm check`: 161/161 unit tests, check:dist 115 files OK.
- `pnpm test:pages`: 12 pages × 2 viewports, exit 0.
- [Reviewer reproduction](reviewer-realms-7155f0a.mjs) run unchanged against this head: **12/12** (was 8/12).
- Rendered: [cbr04-realms-probe.mjs](cbr04-realms-probe.mjs) (Playwright, swiftshader, `__HD=256`, real engine + real pack; the field gate is a **fixture** injected in-page before the pack registers). Raw output: [head 86/86](cbr04-rendered-output-55e28bd.txt); [parent negative control 68/86](cbr04-rendered-negative-7155f0a.txt) — exactly the 18 denied-state expectations fail on 7155f0a (unread, invalid, and after-untick, at both viewports).
  - Per viewport (1440×900, 390×844): Cognitive selected, then descend to Scadrial; checks the dossier realm card text and the open planet's `uRC1..3` (compared after the engine's sRGB→linear conversion) and `uRStyle`.
  - States: unread `{req:mistborn-secret-history}` → generic; present-invalid `{}` → generic; satisfied `{req:warbreaker}` → own; absent (shipped pack) → own; legacy `#book=4` → own; All `#book=0` → own; transition: `{req:warbreaker}` open → untick Warbreaker in the Reading panel (real click) → generic card + generic material while the surface stays open → re-tick → own again. No page errors in any state.
  - Screenshots (fixture gate, labelled as such here): [1440 allowed](shots/cbr04-1440x900-allowed.jpg), [1440 denied](shots/cbr04-1440x900-denied.jpg), [390 allowed](shots/cbr04-390x844-allowed.jpg), [390 denied](shots/cbr04-390x844-denied.jpg).

## Notes / limits

- Observed while building the probe (pre-existing, same on 7155f0a): switching to the Cognitive realm *from an open surface* returns to the galaxy view, so the probe selects the realm first and then descends. Not changed here.
- `pnpm test:browser` not re-run (its Save/Load wait is the known pre-existing failure tracked under simulator-clarity).
- No canon mapping, parent promotion or new threshold. 0/33 full-work approvals unchanged. No merge, deploy or release approval.
