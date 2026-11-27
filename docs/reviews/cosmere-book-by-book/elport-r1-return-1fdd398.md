# EL-PORT-R1 return at PR48 1fdd398

Claude, 2026-11-21 UTC. Fixes only EL-PORT-R1 from [implementation-review-bfaab6b.md](implementation-review-bfaab6b.md). Not merged; no data change; the four accepted EL-PORT-02..05 data edits and the EL01 closure are untouched; no new site pin, geography, e67, palace landmark, HO01 or gate promotion.

|                                           | SHA                                      |
| ----------------------------------------- | ---------------------------------------- |
| PR48 `feature/cosmere-reading-state` head | 1fdd398a7ac936d21e11ddb9da8de65a895aac9b |
| actual sole parent (reviewed head)        | bfaab6b873a493150f090c3cfbb25202c4cf626a |

Remote head was re-read immediately before pushing and still equalled bfaab6b.

## Diff (3 files, +191/−2)

- `public/atlas/engine.js` (+10/−2)
  - `openEvent`: on travel, `NAVG++`; in the same-world branch, `if(e.site)selectSite(e.site);else if(S.site)selectSite(null);`. `selectSite(null)` is the existing safe selection path (sets `S.site`, re-renders dossier and breadcrumbs, `syncURL`). Only travel clears; the non-travel dossier click (`openEvent(id,false)`, line 1210) is unchanged.
  - `laterSite`: now captures `NAVG` as well as `RGEN`; a newer travel or a newer delayed place selection drops an older pending callback. The RGEN reading-state guard is unchanged. Legacy-only packs (no registry) still use their original `setTimeout` path, untouched.
- `tests/atlas-el-port-r1.test.ts` (new, 5 tests) — runs the actual `openEvent`, `laterSite`, `selectSite` (up to its scene branch) and `renderCrumbs` over the real Cosmere pack with inert stubs and a manual timer queue.
- `tests/atlas-el-port-02-05.test.ts` (+1): its existing travel harness now declares `NAVG: 0` (needed because `openEvent` references it); assertions unchanged.

## Evidence (builder execution, this run)

| Check | Result |
| --- | --- |
| Focused unit, head | **passed 9/9** (4 EL-PORT-02..05 + 5 R1): e4 travel on Sel's surface from null/chasm/kae → `S.site` null, breadcrumb ends at Sel, URL place cleared (3/3); e2→kae and e5→elantris travel (same-world and cross-world) still select their place; non-travel e4 keeps Chasm; e4 travel from Roshar's surface (descend only, 0 timers) and from galaxy view (fly only) selects no place; pending e2 `kae` callback, then e4 travel → dropped; pending tour-style `laterSite("chasm")`, then e4 → dropped; RGEN change still drops; newer `laterSite` supersedes older. |
| Same test vs parent engine | 1/5 pass, 4/5 fail — but the failure is at harness extraction (parent has no `var NAVG=0;` marker), so this is not a behavioural negative control. The behavioural negative is ChatGPT's own reproduction at bfaab6b (2/2 stale). |
| Rendered surface probe ([elport-r1-surface-probe.mjs](elport-r1-surface-probe.mjs), preview build, swiftshader, real pack, `__HD=256` test hook) | **16/16** at 1440×900 and 390×844: from deep-linked Sel surface with site null/chasm/kae, clicking the actual `#track .ev[data-ev=e4]` (track listener → `openEvent(id,true)`) ends with `S.site` null, view world, sel `sel`, breadcrumb tail "Sel", hash `#world=sel&view=surface` (no `site=`), no `.sel` place label; 0 page/console errors (6/6). Controls: e2 track travel from Chasm → Kae, `site=kae`; non-travel e4 dossier open keeps The Chasm. |
| Screenshots (viewed by Claude) | [desktop surface](shots/el-port-r1-e4-from-chasm-1440x900.jpg): Sel surface, The Chasm label not highlighted, breadcrumb ends at SEL, e4 expanded with the ported text. [phone surface](shots/el-port-r1-e4-from-chasm-390x844.jpg): Sel world dossier ("on the surface"), no place selected. |
| `pnpm format`, `pnpm check` | **passed**; 686/686 tests; check:dist 115 files OK |
| `pnpm test:pages` (CHROME_PATH = preinstalled Chromium 1243) | **passed**, 12 pages × 2 viewports |
| `pnpm test:browser` | **not run** this run; the inherited Save/Load timeout at browser-smoke.mjs:88 remains unresolved and still blocks rendered/release acceptance. |

## Limits retained

- Pending-callback cancellation covers registry packs (`laterSite`); legacy packs keep their original timers by design.
- Not covered: tour entry rendered in a browser (unit-covered via `laterSite` only); Back/Forward after e4 travel was not re-probed.
- Chasm site description stays on the partial/source hold as dispositioned. EL08/HO01/source/gate holds unchanged; 0/33 full-work approvals.

fixing/claude → implementation-review/chatgpt.
