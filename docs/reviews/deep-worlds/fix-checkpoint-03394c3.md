# Deep worlds — fix checkpoint at 03394c3 (DWO-S1 + report reconciliation)

2026-11-09, Claude. PR [#37](https://github.com/mckayec/universe-sandbox/pull/37), `atlas/deep-worlds`.
Head `03394c32816fcb5c95261bf6a9ea4520381a5838`, parent `68d47cebf40b37c345a37cb8b0080590c52a0339`.
Continuation of [implementation-review-68d47ce.md](implementation-review-68d47ce.md) §"Precise continuation".

## 1. DWO-S1 — resolved (item 1)

Change: `public/atlas/engine.js` only, +5/−2. Society and all pack files unchanged.

- `hideUnseen` (was line 948): a site id that `siteOf` cannot resolve is now dropped exactly like one the book does
  not reach yet (`o.site`/`o.lm` cleared, `place` → `world`). Previously only an existing-but-gated site was dropped.
  This governs the URL (`urlFor`), `asVisible` presentation and `selHidden`.
- `selectSite(id)`: when a world is selected and `id` names none of its sites, `S.site` is set to `null` instead of
  the unknown id. Sites that exist are untouched; `selectSite(null)` and calls with no selected world behave as before.
- Earlier lifecycle closures (DWO-E2-F1/F2 downgrade presentation, DWT-03 closure) are not touched: the only new
  branch is `!st`, which those paths never reached with a real site. DWT-03-R1 tree-integration trigger: not
  affected (no tree code changed).

Evidence, [dwo-s1-probe.cjs](dwo-s1-probe.cjs) (rendered, swiftshader headless, built dist via `vite preview`,
strict exit code; Hyperion book 1 stale `site=sphinx` links at `view=surface` and `view=place`, a direct
`selectSite('no-such-site')`, and negative controls `selectSite('tombs')` + valid `site=tombs` link):

| Run | Result |
| --- | --- |
| Head 03394c3, 390×844 | [13/13 PASS, exit 0](dwo-s1-probe-output-03394c3-390.txt) |
| Head 03394c3, 1440×900 | [13/13 PASS](dwo-s1-probe-output-03394c3-1440-partial.txt); the run then hit the 400 s wrapper in its 390 leg (4 more PASS rows printed); 390 was re-run separately above |
| Parent 68d47ce, 1440×900 | [7 PASS / 6 FAIL, exit 1](dwo-s1-probe-output-68d47ce-parent-1440.txt) — all 6 positive rows fail (`site=sphinx` / `no-such-site` kept in state and hash), all controls pass: the probe discriminates |

Limits: the place-view stale link lands on the surface (view=world) at both head and parent; this probe does not
re-test hash place entry for valid links (known environment limit, see fix-return-c8159ae.md). Parent 390 not run.

At head: `pnpm check` (format, build, **125/125** unit tests, check:dist 175 files OK) and `pnpm test:pages`
(**12 pages × 2 viewports**) pass.

## 2. Report reconciliation (item 3) — done on the branch

`docs/reviews/deep-worlds/implementation.md` on the branch (§3) now records: Tyche opens at Book V (pin and site),
superseding the Book IV deviation; Book V tour = 6 steps; phone main log at 68d47ce = 25 rows (22 PASS + 3 FAIL,
superseded by separate focused logs, not summed); DWO-S1 fixed at 03394c3.

## 3. Item 2 progress (partial) — same run

- `society.html` does not load `engine.js`; `public/atlas/society.js` is byte-identical between 68d47ce and 03394c3,
  so the DWO-S1 delta cannot change Society behaviour. The Society suite is still being re-run at the final head.
- [dwd-probe at 03394c3, 1440 leg](dwd-probe-output-03394c3-1440-partial.txt): **30 PASS / 1 FAIL**, then the 390 leg
  was cut off (6 PASS printed, then the browser was closed by my run-time limit — harness stop, not an app error).
  The 1 FAIL is the same amplified-page stale V→IV row as at 68d47ce (covered separately by dwd-stale-probe 4/4 there);
  not re-run yet at this head. Includes the leviathan shared-text row (data-level, not a rendered click).
- Landing screenshots (Book I, `__atlasFast` hook, 0 page errors each): [390×844](shots/03394c3-society-390x844.jpg),
  [1280×800](shots/03394c3-society-1280x800.jpg), [1440×900](shots/03394c3-society-1440x900.jpg),
  [3840×2160](shots/03394c3-society-3840x2160.jpg). Looked at: crisp labels and orbits at 4K, no overlap of panels
  at 390. Observation (pre-existing, not changed): the phone hint still says right-drag/scroll.

## 4. Not yet done (item 2) — next Claude run

Final-head Society spoiler suite at 03394c3 (dwd-probe, dwd-flood-probe, dwd-stale-probe, plus rendered leviathan
popup/landmark checks) and four-viewport screenshots at 3840×2160, 1440×900, 1280×800, 390×844, with
passed/failed/not-run counts and a consolidated unresolved-gate list. Society.js is byte-identical between 68d47ce
and 03394c3, so only the engine delta is new for that suite. Swiftshader timing limits carry over unchanged.

Stage stays fixing/claude. No merge or deploy.
