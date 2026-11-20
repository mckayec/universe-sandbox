# SA07-WAT06-OMIT return at PR48 9a6e54b

Claude, 2026-11-20 UTC. Implements only [sa07-wat06-handoff-2026-11-20.md](sa07-wat06-handoff-2026-11-20.md) SA07-WAT06-OMIT. Not merged; no PR24/PR37 edit; no canon approval; WAT-06 is mitigated, not closed.

|                                           | SHA                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| PR48 `feature/cosmere-reading-state` head | 9a6e54bdf4f33364bc98b9f2482d75e1c5868857                                                   |
| actual parent (handoff head)              | 36bbde8d6d0d188c04db1ea6c70c37623e7f2867                                                   |
| cosmere.js blob at head                   | 0f5f5dd897f959bfa9afe4bb8af04bc95fb38f21 (parent 92680a69eafaea2877851db4872b58006c9a46ea) |

## Incremental diff (2 files)

- `public/atlas/packs/cosmere.js` +2/−2, text values only:
  - Roshar base `facts` row `Moons`: `Salas, Nomon, Mishim (a fourth broke up long ago)` → `Salas, Nomon, Mishim`.
  - Roshar site `pool.desc`: removed ` It vanished when Cultivation left in Wind and Truth.`; retained value is exactly the handoff string.
  - No gate, era, book list, world/site prerequisite, id, geometry or key change; facts array not suppressed. engine.js and reading.js unchanged (blobs 0bc5357… / 4d9bc17… as in the handoff).
- `tests/atlas-sa07-wat06.test.ts` (new, 2 tests).

## Evidence

| Check                                                 | Result                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused test, head                                    | **passed** 2/2. Source: new values occur once, old values absent, neither omitted clause anywhere in the source. Parsed pack with only the two fields reversed deep-equals the parent build. Actual engine selectors (eraVal, sDesc, evOk, siteSeen, rdWorldHidden cut from engine.js) in the 14 handoff states: 882/882 event and 728/728 Roshar-site comparisons equal to parent, world hidden/pool seen equal in 14/14, facts equal to parent except the Moons value, pool text = retained string wherever eligible, omitted clauses returned in 0/14. Parent negative control inside the test: moon aside reachable 10/14, departure sentence 7/14 (asserted). |
| Focused test against actual parent pack               | **fails** at the "new value occurs once" guard (expected)                                                                                                                                                                                                                                                                                                                                                                 |
| `pnpm format`, `pnpm check`                           | **passed**, 659/659 tests, check:dist 115 files OK                                                                                                                                                                                                                                                                                                                                                                        |
| `pnpm test:pages`                                     | **passed**, 12 pages x 2 viewports                                                                                                                                                                                                                                                                                                                                                                                        |
| Rendered [sa07wat06-probe.mjs](sa07wat06-probe.mjs)   | head **134/134**; actual parent build 66/134 (68 expected failures: old Moons value / departure sentence present). Raw: [head](sa07wat06-rendered-output-9a6e54b.txt), [parent](sa07wat06-rendered-negative-36bbde8.txt)                                                                                                                                                                                                  |
| `pnpm test:browser`                                   | **failed** (2/2 runs) at `tests/browser-smoke.mjs:88` `waitForFunction` 30 s timeout — the known open Save/Load wait limitation, unrelated to these fields. Not claimed as passing.                                                                                                                                                                                                                                         |

Rendered probe scope: 1440x900 and 390x844 (touch, phone sheet opened with a real tap on `#grab`), 8 states each: All (`#book=0`), legacy 4/9/11, WoK only, all minus WaT, all works, WaT only. Roshar is selected programmatically (`__atlas.selectWorld`). World facts `Moons` and pool `.pd` text are **direct DOM reads**; where the pool is listed (All, legacy 9/11, all minus WaT, all works) it is then selected with an **actual click/tap** on its place button and the page re-checked. Pool listing matched the selector evidence in 16/16 cases (absent in legacy4/WoK only; Roshar facts absent in WaT only). 0 console/page errors in 16/16 pages. Screenshots: [desktop](shots/sa07wat06-head-1440x900.png), [phone](shots/sa07wat06-head-390x844.png) (all works, after selecting the pool).

## Limits retained

- Accepted completeness cost: the WaT-era pool update is now absent even in All/WaT-complete views; later-state model stays in the deferred backlog. Retained pool copy is pre-Stormfall baseline, not a claim the gateway still works.
- Not certified: remaining moon/pool wording, earliest reveals, current geography, search/graph/modal surface routes, other spoiler surfaces.
- Not in scope: WAT-02/S20 order (open), era-12 claims, other WAT-01–15 gaps, eight bridge holds, PR24/PR37.

fixing/claude → implementation-review/chatgpt.
