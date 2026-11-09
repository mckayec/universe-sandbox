# Deep worlds — DWO-E2-F2 fix at PR37 117ecba

- Builder: Claude, 2026-11-08T09:00–10:05Z. Exact head: `117ecbaadfe9a06fb24d8be79fb7262d71486c54` (atlas/deep-worlds; parent `9aa06c1`). Builder-executed (SwiftShader), not independent. Not merged.
- Application change: `public/atlas/engine.js` only (+30/−8). Docs on the branch: the probe, two adapted regression harnesses and their outputs (copied to main).

## Cause (per implementation-review-9aa06c1.md, confirmed)

During a downgrade that hides the current world or site, the leave/ascend takes several seconds (two history Backs and two fades). In that interval (1) `renderDossier`/`renderCrumbs` and the screen-reader announcement used the selected world/site without a book check; (2) `#announce` was never refreshed by the book click, so it kept "Luthadel, inside, on Scadrial. Reading Mistborn…"; (3) the Back landed on an entry written under the later book (`#book=2&world=scadrial&site=luthadel&view=surface`) and nothing rewrote it until the next `refreshAll`; (4) the direct world-view branch (`S.view==="world"`) changed nothing until the ascent finished.

## Fix

- `hideUnseen(o)` — book gating only (`worldBookOk`, `siteBookOk`; layer filters and realms keep their existing behaviour): a selected world the book does not reach is presented as no selection (galaxy); a selected site it does not reach is presented as no site (world view). `asVisible(fn)` runs a renderer under that view of state and restores `S` afterwards.
- `renderDossier`, `renderCrumbs` and the announcement (`announce()`, split out of `afterRefresh`) run under `asVisible`; `urlFor` applies `hideUnseen`, so every URL write (`syncURL`, pushes) names no hidden world/site and carries the current book.
- Book click, place branch (F1 branch): after the F1 cleanup also `renderDossier(); renderCrumbs(); announce(); syncURL()` before `leavePlace`. Direct world-view branch: `S.ev=S.lm=null`, re-render dossier/crumbs/chronicle, `announce(); syncURL()` before `ascend`.
- `popstate`: after `popNav()`, if the selection is hidden under the current book, `syncURL()` rewrites the entry just landed on (keeps `history.state`, so the remaining leave/ascend Backs are unchanged).
- `doLeavePlace`: no site labels are built for a world the book does not reach (stale ones removed).
- Unchanged: navigation ownership/cancellation (`placeGen`, `navBusy`, `pendPrev`, `goBack`), the visible-place branch, and positive behaviour for visible worlds/sites.

## Evidence (this host, Playwright Chromium 1243 headless, SwiftShader)

[dwo-e2-f2-phase-probe.cjs](dwo-e2-f2-phase-probe.cjs): samples state, URL, dossier heading/text, crumbs and `#announce` **in the same task as the downgrade click (t=0)** and then every ~100 ms (slower under SwiftShader) until the final state has held 1 s (40 s cap). Hidden-copy predicate: crumbs/announcement or dossier heading naming the hidden world/site, or any of dossier/crumbs/announcement containing the hidden site or "Elend is deposed" (the series intro legitimately names worlds, so the dossier body is not matched on world names; control E shows the predicate is clean on a fresh book-1 galaxy).

| Scenario | 1440×900 | 390×844 | Parent 9aa06c1 (390) |
| --- | --- | --- | --- |
| E control: fresh book-1 galaxy has no hidden copy | PASS | PASS | PASS |
| A tour → Luthadel e70, Stop, book 2→1 (place → galaxy): no hidden copy at any sample | PASS (13 samples) | PASS (17) | **FAIL** 7 leaks, first at t=0 |
| A URL book = state book, no `world=scadrial`/`site=luthadel` at any sample | PASS | PASS | **FAIL** 7, t=0 `ubook 2` vs `book 1` |
| A settles: galaxy, nothing selected | PASS (14.3 s) | PASS (5.6 s) | PASS |
| A F1 regression: e70 never in state or chronicle | PASS | PASS | PASS |
| B Scadrial surface + Luthadel selected, book 2→1 (direct world-view branch): copy / URL / settles | PASS ×3 | PASS ×3 | **FAIL** copy, **FAIL** URL, PASS settle |
| C inside Elendel, book 6→5 (world visible, site hidden → surface): copy / URL / settles / Scadrial kept | PASS ×4 | PASS ×4 | **FAIL** copy, **FAIL** URL, PASS ×2 |
| D positive: inside Luthadel, book 3→2 stays entered, crumbs and URL (`book=2&site=luthadel&view=place`) kept | PASS | PASS | PASS |
| Preconditions (A, B, C) and no page errors (A–D) | PASS ×7 | PASS ×7 | PASS ×7 |
| **Total** | **20/20** | **20/20** | **14/20** (exactly the six F2 predicates fail) |

Outputs: [1440](dwo-e2-f2-phase-output-1440.txt), [390](dwo-e2-f2-phase-output-390.txt), [parent 390](dwo-e2-f2-phase-output-parent-9aa06c1-390.txt). Phases recorded per scenario, e.g. A at 1440: `place:scadrial/luthadel@0 → world:scadrial/luthadel@5817 → galaxy:scadrial@14182 → galaxy@14344 ms`; immediate, post-leave/pre-ascent and settled samples are all covered by the predicates.

Regressions at this head:
- F1 VM probe (ChatGPT's dwo-e2-f1-review-probe-9aa06c1.cjs) **8/8** via [dwo-e2-f1-review-probe-f2.cjs](dwo-e2-f1-review-probe-f2.cjs) — identical except four no-op mocks (`renderDossier`, `renderCrumbs`, `announce`, `syncURL`) the handler now calls ([output](dwo-e2-f1-review-probe-f2-output.txt)). The unadapted file throws `renderDossier is not defined` at this head.
- Cancellation probe dwt01c2 **26/26** via [dwt01c2-probe-f2.cjs](dwt01c2-probe-f2.cjs) — identical except four mocks (`hideUnseen` identity, `selHidden` false, `worldBookOk` true — the harness mocks every world/site as visible — and `announce` no-op) ([output](dwt01c2-probe-f2-output.txt)). Unadapted file at the parent: 26/26; at this head it throws on the unmocked names.
- `pnpm check` (format, build, 125/125 tests) and `pnpm test:pages` (12 pages × 2 viewports) pass.

## Limits / not claimed

- Builder-executed; the 90-assertion dwo-e2-browser-check matrix and `pnpm test:browser` were not rerun (the change does not touch the positive entry paths that matrix covers beyond D; the Save/Load flake stays separately tracked).
- Sampling granularity under SwiftShader is ~0.3–1 s after the immediate t=0 sample; a sub-sample flash cannot be excluded, though every render path in the interval now goes through `asVisible`.
- Not covered: the 3D world/site visuals during the fade (only text, URL and announcement are gated here); a selected world hidden by a layer filter or realm rather than the book (deliberately unchanged); the `doLeavePlace` branch where the place was entered straight from the galaxy (descends into the world then ascends) was not exercised.
- DWT-02, Dune omissions, source holds, Society, Save/Load, device/real-GPU, full technical/canon and Mckay's release gates remain open.
