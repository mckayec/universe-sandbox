# Deep worlds R0: engine-only candidate (implementation receipt)

2026-11-27 · Claude. Follows D10 (a) and [release-scope-review-v2-03394c3.md](release-scope-review-v2-03394c3.md).

**Candidate:** branch `engine/deep-worlds-r0`, head **7a25822e8504da0882fc593942065328794a579a**, draft PR **#53** ("Deep worlds R0: engine/places infrastructure only (do not merge)").
**Base:** fresh from main **718d84d5f54f25dc5649343c223ce60df34591ad**.
**Source:** PR #37 `atlas/deep-worlds` at **03394c32816fcb5c95261bf6a9ea4520381a5838**, diffed against the merge base 51fe68887ae2d6a4c4c7b291d2df534f7bf4d7b0.

This is a candidate for review only. It is not approved, merged or deployed.

## 1. Scope mapping (included)

| R0 path | Source in PR37 | How it was ported |
|---|---|---|
| `public/atlas/places.js`, `places-lm.js`, `places-fx.js`, `places-audio.js` | new files at 03394c3 | Copied whole. Blob hashes equal PR37's (see the scope-check output). |
| `public/atlas/engine.js` | PR37 hunks (+250/−43 vs merge base; candidate +255/−43 vs main, the +5 being the R0 gate): place hints, tour box and button, `S.lm`, DWO-E2-F2 `hideUnseen`/`asVisible`, DWO-S1 site-id drop, `PLACES` creation, site-label entry gesture, `enterBtn`/`evItem`/`placeDossier`, dossier actions, Escape/crumbs, DWT-01 `goBack`/`navBusy`, DWT-03 `selectSiteLater`, `enterPlace`/`cancelEntry`/`leavePlace`/`selectLandmark`/`evInPlace` (DWR-B, DWH-01, DWT-01a/c, DWT-02), tour (`goEvent`, DWT-01), book-change handling in place (DWO-E2-F1/F2), pointer/wheel/tap, `viewOffset`, render loop, `urlFor`/`parseHash`/`popNav`/`restoreFromURL`, API | `git apply -3` onto main. Three conflicts were resolved by hand: (1) `layoutSiteLabels`: kept main's PR39 chrome-rect culling and added PR37's `S.view==="place"` guard; (2) the dossier event list: kept PR37's `evItem()` and added main's E4 `refPlacesHtml`, the `e.ref` "no map point" span and `refBtn(e)` into it; (3) the dossier click handler: kept PR37's place actions and added main's codex `[data-cx]` handler. |
| `public/atlas/engine.css` | +25: `.place .enter`, `.goev`, `.fxm`, `.seg.tod`, `.hops`, landmark labels, `body.inplace #bake`, `#tourBox`/`#tourBtn` | Applied cleanly. |
| `public/atlas/index.html` | +4 loader lines (`places-lm`, `places-fx`, `places-audio`, `places`) | Placed after `engine.js` and before main's PACK_FORMAT 1.1 `parts` loader. |
| `package.json` | the four places files added to `format`/`format:check` | Added to main's list, which already includes `tree-rel.js` and `tree-view.js`. |
| `tests/atlas-pack-validator.mjs` | +66: PACK_FORMAT 22 `scene`/landmark/`fx`/`lm` checks; `places` as a top-level key | Applied cleanly onto main's validator. |

**R0 addition (not in PR37): the dormancy gate in `engine.js`.** The function `placesOn(raw)` returns true only for a pack with a top-level `places` object. When it is false:

- `PLACES` is null, so there is no Enter, Walk the surface, Go there or hop control, and no place view.
- The ▶ Tour button is not rendered. Without the gate PR37 would add it to every atlas.
- `view=place` in a link or in `pack.start` is parsed the way main parses it (as an unknown view), so stale PR37 place links land exactly as they do on main.

No main pack has `places`, `scene`, `landmarks`, `lm` or `fx`. A later content slice would turn the feature on by adding `places:{}`. The PACK_FORMAT §22 docs and this opt-in key are not written yet: docs belong to the coordinator, and this is a follow-up.

The always-active engine changes are the accepted DWT/DWO/DWH navigation fixes (history Back ownership, book-downgrade presentation, stale site ids). Section 4 shows that existing atlases render identical text and views to main at the probed states.

## 2. Exclusions honoured

| Excluded (scope review v2) | Status on the candidate |
|---|---|
| All pack data `public/atlas/packs/**` (scenes, 14 landmarks, events, link set L, b1k/e77/e78, d1/e35, omissions) | Tree hash identical to main (`7f02fe18…`). 0 pack files carry PACK_FORMAT 22 keys. |
| Society application and assets: `society.js/.html/.css`, `society-fonts.css`, `atlas/tex/**` (77 files), `tests/society-transitions.test.ts` | All identical to main. `atlas/tex` is absent, as on main. The test file is not added. |
| `tests/check-dist.mjs` | Not ported. Its PR37 hunks are the Society TEXSET/ERA_TEX check plus a comment about shipping tex. Main's "atlas/tex is not shipped" guard is kept. **Mixed hunk:** the comment was the only non-Society part, and it is about tex, so nothing was carried. |
| `public/atlas/solar.js` blurb edits (Mars, Phoebe, Neso, Sedna) | Not ported (unrelated solar changes). |
| PR37 `docs/**`, simulator `src/` | Untouched. |
| PR24/PR39/PR48 | PR24 is not imported. PR39 engine changes already on main are preserved (conflict 1 above). PR48 is not touched. |

## 3. Scope proof

[r0-scope-check.sh](r0-scope-check.sh) was run as `r0-scope-check.sh origin/main 7a25822 03394c3`; the full output is in [r0-scope-check-output-7a25822.txt](r0-scope-check-output-7a25822.txt). **RESULT PASS.** It shows:

- 9 changed paths, all in the allowlist and none in the deny set (`packs/`, `society*`, `tex/`, `solar`, `society-transitions`, `check-dist`, `src/`, `docs/`).
- 7 protected trees with equal hashes; `tex` absent.
- 4/4 places blobs equal to PR37.
- 0 pack files with scene/landmarks/fx/lm/places keys.

Positive control: the same pattern finds those keys in PR37's packs (cosmere 160, dune 180 and expanse 200 matching lines, and so on). Diff: 9 files, +4008/−46.

## 4. Checks (at 7a25822 unless noted)

| Check | Result |
|---|---|
| `pnpm format` then `pnpm check` | format check clean; build ok; unit tests **165/165**; check:dist **124 files OK** |
| `pnpm test:pages` | **14 pages × 2 viewports passed** |
| `pnpm test:browser` | **Flaky; the failure is not caused by R0.** On the branch it passed 2 of 8 runs; on a clean main worktree (718d84d) it passed 3 of 7, with the last 3 consecutive main runs failing. Every failure is the same timeout at `browser-smoke.mjs:88`, the simulator Save → Clear → Load count wait in `src/`. R0 changes nothing under `src/` (tree hash equal) and the simulator page does not load atlas files. It is load- or time-dependent on this shared machine. |
| [r0-dormancy-probe.cjs](r0-dormancy-probe.cjs) at 1440×900 | **138 PASS / 0 FAIL** ([output](r0-dormancy-output-7a25822-1440.txt)) |
| the same probe at 390×844 | **138 PASS / 0 FAIL** ([output](r0-dormancy-output-7a25822-390.txt)) |
| Exact-head CI | 1 check run (`build`), in progress at the time of writing. Not yet credited. |

**What the probe covers.** It runs all 8 atlases on R0 and on main (vite preview of each build). For each, it checks:

- no places object and no Tour button;
- after descend + select site, after re-clicking the selected site label (the PR37 entry gesture), after `openEvent(id, travel)` for a sited event, and after a deep link `#world=…&site=…&view=place&lm=x`: R0's view is never `place`, there are 0 enter/go/hop controls, the view equals main's, and the `#dossier`/`#chron`/`#crumbs` text is identical to main's;
- for the deep link, the URL is rewritten identically to main;
- 0 console errors on both builds.

**Isolated fixture (in memory only).** On R0, route interception appends `places={}` to the dune pack response. Nothing is written to disk or shipped. With that opt-in, the places object and Tour button appear, an Enter control shows, `enterPlace` reaches `view=place` (`#…&view=place`), `leavePlace` returns to `world`, and there are 0 console errors. This shows the gate is what keeps the ported code dormant.

An earlier probe run, before the link-parsing gate, found 24 rows where a `view=place` deep link landed on the surface on R0 but the galaxy on main. Gating `view=place` parsing fixed this; see the final runs above.

## 5. Screenshots (atlas regression, R0 vs main)

These are in [shots-r0-7a25822/](shots-r0-7a25822/): `cosmere`, `christian-apocrypha` and `abrahamic-world-religions` at 3840×2160, 1440×900, 1280×800 and 390×844, as R0/main pairs (24 JPEGs, each under 330 KB). Each is the landing state about 6 s after load, with swiftshader and deviceScaleFactor 1. All had 0 console errors and no Tour button.

I viewed these myself:

- cosmere 1440 side by side: same chrome, dossier, index and chronicle;
- christian-apocrypha 390 side by side: same surface sheet;
- abrahamic 3840 (R0): globe, labels, places list, layer bar and chronicle as on main.

Pixel difference (grey level >25/255) is 0.000–0.13% for the christian-apocrypha and abrahamic shots at most sizes, 0.86% for abrahamic at 390, and 1.2–1.5% for cosmere at 1280/1440. These are the animated starfield and galaxy, not chrome.

## 6. Limits and not done

- Not covered: real GPU, physical devices, pointer-hit testing, Save/Load of place state, or the DWT-03-R1 tree integration. Turning on tree-bearing place data triggers that requirement.
- The 32-slot R1 place matrix is deferred with R1 and is not credited.
- The DWO/DWT lifecycle probes in this folder were written for PR37's populated packs. Rerunning them on R0 needs a fixture pack with scenes, because R0's packs have none, so they were not rerun. The fixture rows above cover enter and leave only.
- PACK_FORMAT §22 documentation of the `places` opt-in is still to do (docs on main).
- Canon/content review of the R0 delta, technical sign-off and Mckay's release decision are still required.

## Recommended status

`stage: implementation-review`, `owner: chatgpt`, `blocked-on: none`.
`next-action: ChatGPT: review R0 candidate PR #53 at 7a25822e8504da0882fc593942065328794a579a against release-scope-review-v2-03394c3.md.`
