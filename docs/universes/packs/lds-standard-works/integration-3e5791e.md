# PR33 integration with main (D05) — 3e5791ec9ea89bc5f362449f5bf1d07c963073c8

Approved head (D05): 3e3701ffcc4131200f0993e52f8f14a509016ced. New head: **3e5791ec9ea89bc5f362449f5bf1d07c963073c8**,
a merge of origin/main (9bff987) into `pack/lds-standard-works`. No LDS content changed; no rebase of the approved commits.

## Why the PR was dirty
main gained the christian-apocrypha release (PR38) after PR33's base 3c94fa8, which touched the same atlas engine:
TA-01 4096 Earth mask (`earth-base.png` + `earth-base-2048.png`), TA-03 coast noise fade, a compact book picker,
codex/filter CSS fixes, and a new registry/pack-list entry. Four files conflicted.

## Resolution (exact)
| File | Resolution |
|---|---|
| `public/atlas/packs/registry.js`, `src/universe-packs.ts` | Keep both entries (LDS, then christian-apocrypha). |
| `public/atlas/engine.css` codex | PR33's compact-chooser rules plus main's `min-height:0; overflow:hidden` panel and `flex:1 1 auto; min-height:0` body (grid rows `minmax(0,100%)`). |
| `engine.css` phone filters (≤820px) | PR33's `width:auto` plus main's `flex-wrap:nowrap; overflow-x:auto` layer bar and `button{flex:none}`. |
| `engine.css` file end | Both appended blocks kept (PR33 Sky button/landscape controls; main book picker). |
| `engine.js` height shader | PR33's frozen `gB`/`baseAt(p)` sampling plus main's TA-03 fade `(h-.5)*.12*clamp(abs(bt)/.075,0,1)`. |
| `engine.js` Earth mask loader | **Design choice (needs recheck):** the two branches use different masks — main a signed-distance coast ramp (`scripts/make-earth-mask.py`), PR33 a binary land-and-lakes mask (`tools/build_earth_mask.py`). To keep both approved renderings, main's mask stays the default for every Earth pack, and a world opts into PR33's mask with new `gfx.earthMask:"hi"` (8192 on capable desktops, 4096 elsewhere, falls back to `earth-base.png`). The LDS Earth world sets `earthMask:'hi'` (one-line, non-content change in `lds-standard-works.js`). `PACK_FORMAT.md` documents it. |

Net effect: live packs (dune, expanse, foundation, hyperion, sun-eater, christian-apocrypha) load exactly what they load on main today; LDS loads exactly what it loaded at 3e3701f.

## Verification at 3e5791e
- `pnpm check`: format OK, build OK, **213/213** tests (includes main's `earth-mask.test.ts` loader assertion and PR33's 177 LDS-era tests), check:dist 116 files OK.
- `pnpm test:pages`: 13 pages x 2 viewports pass (Chromium 1243).
- `pnpm test:browser`: pass (desktop construction, persistence, controls, mobile layout) on first try.
- Mask selection probe (Playwright, swiftshader, dist build), requests observed, 0 console/page errors each:
  - lds-standard-works 1440x900 → `earth-hi.png`; 390x844 → `earth-hi-4k.png`
  - christian-apocrypha 1440 → `earth-base.png`; 390 → `earth-base-2048.png`
  - dune 1440 → `earth-base.png`; 390 → `earth-base-2048.png`
- Screenshots: [LDS 1440](shots/integration-3e5791e-lds-1440.jpg), [apocrypha 1440](shots/integration-3e5791e-apocrypha-1440.jpg) — both render globe, labels, panels, legible fan notice; apocrypha keeps its book picker.
- Exact-head GitHub Actions: run 42565302906 (Deploy GitHub Pages workflow, PR event) — build job **success** (format, build, tests, check:dist, browser checks); deploy skipped as expected on a PR.
- PR33 now `mergeable: true`.

## For ChatGPT (exact-head recheck)
Material delta from 3e3701f is engine integration only: `git diff 3e3701f 3e5791e -- public/atlas/engine.js public/atlas/engine.css public/atlas/packs/lds-standard-works.js docs/atlas/PACK_FORMAT.md`.
Please confirm (1) no LDS content change (pack diff = `earthMask: 'hi'` only), (2) the opt-in mask design is acceptable, or say if all packs should instead move to one mask (that would change live packs and need its own review).

## Known gaps (unchanged plus)
All D05 Known gaps carried. Added: no 3840x2160 capture at this head (1440/390 only, swiftshader). *(Superseded by checkpoint 72: 4K frame captured; see audit-final.md.)*


## Corrections after review (checkpoint 72, 2026-11-09, per INT71-O1/O2)
- **Pack-wide, not per-world (INT71-O1):** `gfx.earthMask:"hi"` is read with `WORLDS.some(...)` and selects the one shared Earth texture for the whole pack. A pack cannot mix the hi and base masks across Earth worlds. PACK_FORMAT.md will say "pack-wide" in a docs-only follow-up after merge.
- **Not the same rendering path (INT71-O2):** LDS loads the same approved hi-mask files as 3e3701f, but main's TA-03 coastal noise fade now applies to its coastal samples and the load-failure fallback is main's `earth-base.png`. Globe-scale capture differs from 3e3701f only by JPEG noise (mean 0.11/255); pixel identity is not claimed.
