# Deep Worlds — DWH-01 fix return at fb79488

Claude, 2026-11-07. PR #37 / `atlas/deep-worlds`, exact head **fb79488cbc3ff9a404f2052dbd7314e15913d838** (parent d902c8a7092e5e1f2597af800b11f0f7f63dc901). One file changed: `public/atlas/engine.js` (+7/−5).

## Fix (DWH-01)

- `enterPlace` now tags the place history state it pushes/replaces with its generation: `{atlasSurface:true, atlasPlace:true, atlasEntry:gen}`.
- The stale-callback branch calls `cancelEntry(fromHistory, gen)`; `cancelEntry` replaces the state only when `history.state.atlasPlace && history.state.atlasEntry === gen`, i.e. only the entry that specific pending call created. A newer superseding entry's marker is never removed.
- `history` is only read when `!fromHistory && urlReady` (as before), so fixtures/pages without URL sync are unaffected.
- Unchanged: the generation/site/world/eligibility guard in the transition callback (DWR-B), DWR-A cancellation, lone-cancellation cleanup, the CS04 label "The guarded entrance", all pack and Society files.

## Evidence (Node 22.23.4, this head)

| Check | Result |
|---|---|
| `dwr-history-probe-d902c8a.cjs` | **H1, H2, H3 pass (3/3)**; H3 final history.state `{atlasSurface:true, atlasPlace:true, atlasEntry:2}`, site keats, view place, 1 place built |
| `dwr-transition-probe.cjs` | **11/11** |
| `dwr-probe.cjs` | **22/22** |
| `pnpm format && pnpm check` | pass, **125/125** unit tests, build ok |
| `pnpm test:pages` | **12 pages × 2 viewports** pass |
| `pnpm test:browser` | fails twice at `browser-smoke.mjs:88` (simulator Save/Load count wait) — the pre-existing, documented Save/Load intermittency, unrelated to the atlas (no atlas step reached/changed) |

## Real-browser check (`dwh-browser-check.cjs`, Chromium 1243 swiftshader, vite preview of this head)

Hyperion, book 2, surface at `site=tree`; two superseding entries (tree, then keats) dispatched through the dossier's delegated `[data-act=enter]` handler within one 430 ms fade; then `history.back()`.

| Viewport | After entries | After Back | Page errors |
|---|---|---|---|
| 1440×900 | state `{atlasSurface, atlasPlace, atlasEntry:4}`, URL `site=keats&view=place` | URL `site=tree&view=surface` (left the place) | none |
| 390×844 | same | same | none |

**Limitations, stated:** the clicks are synthetic `.click()` calls on delegated buttons, so pointer reachability through the fade overlay is not exercised. The same harness run at d902c8a did **not** reproduce the lost marker in the browser (old head also showed `atlasPlace:true` after the entries), so this browser run is a positive regression/navigation check only; the sensitive test remains the VM H3 (fails at d902c8a per ChatGPT, passes here). I did not diagnose why the browser timing differs from the VM queue.

No canon, pack text or gating changed. Known gaps from implementation-review-d902c8a.md (DW06 source coverage, CS18, inherited holds, release gates) are untouched.
