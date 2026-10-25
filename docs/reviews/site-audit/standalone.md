# Gravity Lab audit: standalone pages and site plumbing

Scope: `public/atlas/society.html`, `public/atlas/solar.html`, `public/exoplanets/**`, `public/powers/**`, `public/sw.js`, `public/manifest.webmanifest`, `public/icon.svg`, `vite.config.ts`, `index.html`, `package.json`, `.github/workflows/deploy-pages.yml`. Commit 667673f. Nothing in the repo was modified.

## How I tested
- I served `dist` under the subpath `/universe-sandbox/` (copied to `/home/claude/audit/standalone/sub/`, `python -m http.server 4187`) and also ran `pnpm preview --port 4183`.
- I opened every page with Python Playwright and Chromium on SwiftShader, at 1440x900 and at 390x844 (mobile, touch, DPR 3). I captured console output, page errors, failed requests and response bytes. Scripts and screenshots are in `/home/claude/audit/standalone/` (`run.py`, `inter.py`, `swtest.py`, `shots/`, `sub.json`).
- **Environment limits:**
  - The sandbox proxy blocks cdnjs, jsdelivr, Google Fonts, the NASA archive TAP endpoint and `mckayec.github.io`.
  - I routed three.js r128 and OrbitControls to identical copies from the npm registry (`three@0.128.0`) and aborted the font requests. Fallback fonts are therefore shown in the screenshots.
  - I could not fetch the live site directly. Instead I confirmed the deployed content through the GitHub API: the `main` tree and the deploy runs, all `success`, the latest at 667673f.
  - SwiftShader frame rates (2–10 fps) say nothing about real devices, so I did not use them as findings.

---

## Confirmed

### S1 — High — The atlas texture folder `atlas/tex/` does not exist, so 50–73 image 404s fire on every load and the Solar atlas planets render as blank white spheres
- **Where:**
  - `public/atlas/solar.html:1136` (`loader.load("tex/"+key+".jpg")`), `:1142` (`pngTex`), `:1456`, `:1864-1865`
  - `public/atlas/society.html:2489` (`tex/helios_h.png`), `:2556` (`tex/helios_color.jpg`), `:3778` (`"tex/"+name`), `:4288` (`tex/hd/`)
- **What happens:**
  - Solar requests 50 files under `tex/lo/*.jpg` plus the ring PNGs. Society requests 73 `tex/*.jpg` and `tex/*.png` files. Every one returns 404.
  - The loaders fall back (`res(null)`), so neither page goes blank. But in the Solar atlas, Earth's close-up is a featureless white ball with only a rim glow (`shots/solar-earth.png`), and every planet in the overview is a white dot.
  - Society falls back to procedural surfaces that look acceptable (`shots/society-mars.png`). It still floods the console with 73 errors.
  - Both footers credit "Solar System Scope" and "Celestia" textures that are not shipped.
- **How I confirmed it:**
  - Playwright network log (`sub.json`, desktop and mobile).
  - `git log --all` contains no path matching `tex/`.
  - The GitHub API tree for `main` and for every branch (atlas-engine, atlas-hub, galaxy-hd, nebula-hd, exoplanets, powers-of-ten) has 0 `atlas/tex/` entries.
  - The pages arrived in 11d7d5c as single-file drops, apparently exported without their sibling `tex/` folder.
  - Because Pages deploys the build of `main`, the live site has the same 404s.
- **Fix:**
  - Add `public/atlas/tex/{lo,hi,hd}/…` from the original export. Use 2K `lo` JPEGs at about 100–300 KB each, keep `hi` for on-demand close-ups, and convert to WebP or KTX2 if you can.
  - If the files can't be recovered, remove the `tex()` calls, use the procedural fallbacks deliberately, and change the credits.
  - Add a CI check that every `"tex/…"` literal resolves to a file in `dist` (see S9).

### S2 — High — All four standalone pages depend on a third-party CDN for three.js r128, and a blocked CDN leaves the page blank
- **Where:**
  - `public/atlas/society.html` head: `cdnjs …/three.js/r128/three.min.js`
  - `public/atlas/solar.html`: the same, plus `cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`
  - `public/exoplanets/index.html:302`
  - `public/powers/index.html` (the cdnjs script tag)
- **What happens:**
  - When cdnjs is unreachable (corporate filters, some school networks, regions where it is blocked, offline PWA use), Society and Solar throw `PAGEERROR: THREE is not defined` and show an empty page.
  - Exoplanets and Powers also render nothing.
  - The service worker skips cross-origin requests (`sw.js:11`), so three.js is never cached for offline use, even though the standalone HTML is.
  - These pages download a second copy of three.js (r128, 603 KB raw, 149 KB gzip) on top of the main app, which bundles three 0.180.
- **How I confirmed it:** On the first Playwright run, the CDN was blocked and every page reported `THREE is not defined`, or the "Could not load …three.min.js" error in the atlas engine page. Every page rendered once I routed the same file locally.
- **Fix:** Vendor `three.min.js` r128 and `OrbitControls.js` into `public/vendor/three-r128/`, either copied in a build step from an npm dependency pinned with an alias such as `"three-r128": "npm:three@0.128.0"` or committed directly, and reference them relatively (`../vendor/three-r128/three.min.js`). This also lets the SW cache them.

### S3 — High — No standalone page links back to the sandbox, so users are stuck in installed-PWA mode
- **Where:** `society.html`, `solar.html`, `exoplanets/index.html`, `powers/index.html`. A grep finds 0 links to `../` or any sandbox URL.
- **What happens:**
  - The main app opens these pages with `location.assign(pack.atlasPath)` (`src/ui/exhibit-flow.ts:179`). In a normal browser tab, Back works.
  - The manifest sets `"display": "standalone"`, and iOS standalone has no back button or gesture. Anyone who installs Gravity Lab and opens an atlas has to force-quit to return.
  - Deep links (a shared `exoplanets/` URL) never lead to the rest of the site.
  - The Exoplanets "brand" button (`index.html:253`) and the Society and Solar "back" buttons only navigate inside each page.
- **How I confirmed it:** grep, plus review of the screenshots.
- **Fix:** Add a small fixed "← Gravity Lab" link (`href="../"`) to each page's header, using an identical snippet on every page.

### S4 — High — 27 non-transiting radial-velocity planets are marked as having a *measured* radius
- **Where:** `public/exoplanets/data/nearby.json` (and `nearby.js`), `radius_src:"measured"`. Displayed via `js/app.js:479`, which puts the value under "Radius" in the measured block with no ≈ sign.
- **Affected planets:**
  - 51 Peg b (17.93 R⊕). NASA labels its radius "1.26 RJ (estimate)", and the planet does not transit.
  - GJ 411 b and c, HD 164922 b–e, GJ 1148 b and c, HD 140901 b and c, HD 156668 b and c, GJ 720 A b, HD 18143 b and c, BD-21 397 b and c, and others. All have `method:"RV"` and `transiting:false`.
- **How I confirmed it:** A script over nearby.json selecting `radius_src=="measured" and not transiting and method=="RV"` returned 27 rows. I checked 51 Peg b against science.nasa.gov/exoplanet-catalog/51-pegasi-b, which says "1.26 x Jupiter (estimate)".
- **Fix:** In the extractor, force `radius_src="estimated"` whenever `transiting` is false and the method is not imaging. OEC fills radii from a mass-radius relation without flagging them.

### S5 — High — A wrong mass type and several wrong distances or orbits for well-known systems
Values checked against the NASA Exoplanet Archive and the NASA Science catalogue:

| Planet | Atlas | NASA | Issue |
|---|---|---|---|
| 51 Peg b | dist 14.7 pc / 47.9 ly; mass 146.2 M⊕ `true` | 15.46 pc / 50.4 ly; M sin i 147 M⊕ | distance 5% low (pre-Gaia); mass should be `min` (RV only) |
| GJ 1214 b | dist 13.0 pc / 42.4 ly | 14.64 pc / 47.8 ly | 11% low (old parallax). Planet M and R (8.41, 2.733) match |
| HD 189733 b | 19.3 pc / 62.9 ly | 19.8 pc / 64.5 ly | 2.5% low |
| LTT 1445 A c | a = 0.0396 AU (P 3.124 d) | a = 0.02661 AU | a is inconsistent with P; Kepler gives 0.0266 for 0.256 M☉ |
| HIP 12961 b | a = 0.13 AU (P 57.4 d) | a = 0.25 AU | a is wrong; Kepler gives 0.25 |
| Epsilon Eridani b | 1.0 MJ `true`, P 2677 d, a 3.53 | 1 MJ table / 0.66 intro, ~7.3 yr, 3.53 AU | OK; the note explains the mass |

The following matched within rounding: Proxima b, c and d (1.295 pc, P 11.185 d, ≥1.055 M⊕); all seven TRAPPIST-1 planets (Agol 2021 masses and radii, 12.43 pc); 55 Cnc e (7.98 M⊕, 1.875 R⊕); Teegarden b–d; Barnard b–e; Ross 128 b; LHS 1140 b and c; L 98-59 b–f; Gliese 876 b–e; tau Ceti (b–e retracted, f/g/h disputed, matching the 2025 ESPRESSO result). Light-year and parsec conversion is consistent for all 286 systems (ly = pc × 3.2616, max error < 2%).

- **Fix:**
  - Prefer Gaia DR3 distances from NASA `pscomppars.sy_dist` over OEC's.
  - Recompute `a` from P and M★ whenever the catalogue `a` disagrees by more than 15%. Run a Kepler consistency check in the build: it also flags TOI-198 b, HIP 70849 b and DE CVn b (see S13).
  - Set `mass_src="min"` for every RV-only detection.

### S6 — Medium — `nearby.json` (685 KB) is shipped but never loaded, and its generator is not in the repo
- **Where:** `public/exoplanets/data/nearby.json`. Only `nearby.js` is referenced (`index.html:303`). The header of `nearby.js` says it is "Generated by tools/build_nearby.py", but `tools/` does not exist in the repo.
- **How I confirmed it:** The parsed `window.NEARBY` deep-equals nearby.json (`True`). A grep finds no reference to nearby.json outside nearby.js's comment.
- **Fix:**
  - Either `fetch('data/nearby.json')` in app.js and delete nearby.js, or move nearby.json out of `public/` into the repo's data folder.
  - Commit `tools/extract_oec.py` and `tools/build_nearby.py`. Without them the data can't be regenerated or fixed (S4, S5).

### S7 — Medium — The service worker cache grows without bound: one constant name, and every same-origin GET is stored in it
- **Where:** `public/sw.js:1` (`CACHE='gravity-lab-shell-v3'`), `:6` (`remember` puts every OK response), `:5` (activate deletes only *other* cache names).
- **What happens:**
  - Each deploy produces a new `assets/index-<hash>.js` (741 KB) and `.css`. All of them are written into the same `v3` cache and never evicted.
  - The atlas pages, packs, `nearby.js` (477 KB) and fonts accumulate there too.
  - After a dozen deploys, a regular visitor holds about 10 MB or more of dead bundles.
- **How I confirmed it:** `swtest.py` showed 16 cache entries after visiting 4 pages once, including `nearby.js`, all `powers/*.js` and `society.html`. The code path shows old hashed assets are never removed.
- **Fix:**
  - Stamp the cache name per build: have Vite write `sw.js` with the build hash, or inject `__BUILD_ID__` with a small Vite plugin. Activate then purges previous builds.
  - Alternatively, on activate, delete `assets/` entries not referenced by the freshly fetched `index.html`.
  - Optionally use a separate size-capped runtime cache for atlas and data files.

**Note on stale deploys: no trap found.** Navigations and all non-hashed files are network-first, and `skipWaiting()` plus `clients.claim()` activate updates immediately. In `swtest.py`, editing `society.html` after the SW had cached it was reflected on the next navigation. The only staleness is GitHub Pages' own `Cache-Control: max-age=600` on the HTTP cache, which can delay updates up to about 10 minutes.

### S8 — Medium — Payload: very large single-file pages with no code splitting

| Page | Own bytes (raw / gzip) | + three r128 (CDN) | Other | Requests |
|---|---|---|---|---|
| `/` (sandbox) | 774 KB / ~215 KB | bundled three 0.180 | — | 3 |
| `atlas/society.html` | 558 KB / 181 KB (517 KB inline JS) | 603 / 149 KB | Google Fonts; 73 × 404 (S1) | 74 |
| `atlas/solar.html` | 466 KB / 145 KB (434 KB inline JS) | 603 / 149 KB + OrbitControls 26 KB | Google Fonts; 50 × 404 | 53 |
| `exoplanets/` | 604 KB / ~120 KB (`nearby.js` 477 / 79 KB) | 603 / 149 KB | — | 6 |
| `powers/` | 220 KB / ~58 KB | 603 / 149 KB | — | 5 |

- Pages serves gzip, so wire sizes stay moderate: about 200–330 KB per page plus three.js.
- Parse and compile cost on mobile is the real expense: about 0.5 MB of inline JS per atlas page has to be compiled before first paint, and none of it is cached separately from the HTML. Every deploy that touches the page re-downloads all of it.
- **Fix:**
  - Split Society and Solar into `page.html`, `page.js` and `page.css` so the JS caches independently.
  - Load chronicle and event data lazily.
  - Vendor three.js (S2) so it is fetched once and cached for all four pages.
  - For exoplanets, switch to `fetch` JSON (S6) with a minified payload (current JSON is pretty-printed at 685 KB; minified JS is 477 KB).

### S9 — Medium — CI can deploy broken standalone pages; the browser smoke test does not run in CI
- **Where:** `.github/workflows/deploy-pages.yml`
- **What happens:**
  - The workflow runs `pnpm build` and `pnpm test`, the unit tests only.
  - `tests/browser-smoke.mjs` (`pnpm test:browser`) never runs.
  - No test opens `atlas/*.html`, `exoplanets/` or `powers/`, or checks that referenced assets exist. That is how S1 shipped unnoticed.
  - `concurrency.cancel-in-progress: true` on the `pages` group can cancel a deploy job in flight. GitHub's own Pages starter uses `false` for this.
- **Fix:**
  - Add a job step that installs Playwright Chromium, runs `pnpm test:browser`, and extends the smoke test to load each standalone page under a `/universe-sandbox/` subpath. It should fail on `pageerror` or any same-origin 4xx.
  - Add a cheap static check: grep `dist/**/*.html,*.js` for `"tex/…"`, `src=` and `href=` literals and assert each relative target exists.
  - Set `cancel-in-progress: false`.

### S10 — Low — Subpath handling: OK
- `vite.config.ts` sets `base: './'`.
- Every reference in my scope is relative (`data/nearby.js`, `js/*.js`, `stops.js`, `tex/…`, `./sw.js`, `./manifest.webmanifest`). No URL in scope starts with `/`.
- `sw.js` derives `scopePath` from `registration.scope`, and `manifest.start_url` is `"."`.
- I confirmed it under `/universe-sandbox/`: no same-origin 404s other than S1.

### S11 — Low — Polish and accessibility
- `society.html:2`: the `<title>` reads "The Society Atlas (Mobile)", a leftover from the mobile-copy export. It shows in the tab, history and the SW title test.
- `society.html:1` and `solar.html:1`: `<html>` has no `lang`, and both declare `color-scheme:light` on dark pages, so native scrollbars and form controls render light.
- Both atlas pages carry the meta `claude:viewport-fit-sides` (`solar.html:3`, `exoplanets/index.html:8`), artifact-export cruft.
- `powers/index.html:5`: `user-scalable=no` blocks pinch-zoom of the caption text (WCAG 1.4.4). Pinch is already handled on the canvas, so the UI could keep `touch-action:none` on the canvas only.
- `dist/atlas/PACK_FORMAT.md` (36 KB) is deployed publicly, which is harmless but unnecessary.
- `manifest.webmanifest`: one SVG icon with `"purpose": "any maskable"`. Some Android launchers need a 192 and 512 PNG, and combining `any maskable` on one icon is discouraged. Add PNGs, and a separate maskable icon with safe-zone padding.

### S12 — Low — Mobile layout at 390x844
All four pages fit without horizontal page scroll (`scrollWidth == 390`), and pointer and touch handlers are present.
- **Solar:** the view-mode tab row is clipped at the right edge ("NEARBY ST…"). It is a scroller, but nothing signals that it scrolls; a fade mask would help.
- **Society:** at overview zoom, labels overlap ("HAUMEA / URANUS", "SOL / MERCURY") on both desktop and mobile.
- **Pixel ratio:** capped at 2 (atlas pages, powers) or 1.6 (exoplanets on mobile).
- **Detail textures:** Exoplanets caps them at 2048 on mobile (`app.js:40`). Society rasterises its vector maps at 4096 on phones, which costs about 64 MB of GPU memory per map and is risky on low-end iPhones. I did not verify this on a device.

---

## Suspected (not fully verified)

### S13 — Medium — More exoplanet orbit and classification oddities from automated checks
- **Kepler mismatches above 25% between `a` and `period_d`:**
  - TOI-198 b (a 0.10 AU vs 0.072 AU implied)
  - HIP 70849 b (P exactly 10000 d and a exactly 10 AU look like placeholders)
  - DE CVn b (a 5.75 vs 7.05 implied)
- **Objects above 13 MJ classed as "gas-giant" planets:** 2M 0746+20 b (30 MJ), HN Peg b (22 MJ), Gliese 504 b (30 MJ `upper`), 2M 2206-20 b, 2M 2140+16 b. These are brown dwarfs by the IAU working definition. I suggest a "brown dwarf" class or a footnote.
- **AU Mic b mass:** 57.2 M⊕ marked `true`. That equals 0.18 MJ, which is Plavchan et al. 2020's *upper limit*. Published RV masses are about 10–20 M⊕. With this value the planet is labelled an ice giant instead of a Neptune-mass world.

### S14 — Low — Powers of Ten scale and models
I checked every stop's stated size (L = −16 … 27) against reality. All are within rounding:
- L=13: Neptune orbit about 60 AU across.
- L=15: 10¹⁵ m ≈ 6,685 AU, matching "≈ 6,700 AU".
- L=17: Alpha Centauri at 4.37 ly.
- L=25: Laniakea about 520 Mly.
- L=27: 93 Gly.
- L=−13: the atom-to-nucleus ratio of about 20,000× matches 70 pm / 2.7 fm ≈ 26,000.

Remaining issues:
- **Jump to L=8:** when jumping there with `__powers.setL(8)`, the first frames showed only the labels ("Earth", "GPS orbits", "geostationary orbit") over black. The geometry appeared seconds later, and loading `#L=8` directly renders correctly. This looks like lazy scene building; with a real GPU it is probably a brief flash.
- **Earth-to-Sun transition (L 9 → 10):**
  - At L=9 the camera is centred on Earth. At L=10 it is centred on the Sun, with no Earth or Moon in view ("Heading sunward…").
  - Between them there is a camera re-centre across 1 AU with nothing on screen to explain it.
  - That matches the known rough spot. A suggested fix is an intermediate L≈9.5–10.5 frame with Earth's orbit arc and a "1 AU →" marker, or keeping Earth's orbit ring visible at L=10.
- **Person (L=0) and Hand (L=−1) models:**
  - Both are capsule primitives. The shoulders show visible gaps between arm cylinders and torso, and the arms hang outward.
  - At L=−1 the hand is a single slab with four stubby fingers. The thumb sits far from the palm and has a seam artefact (`shots/powers-L-1.png`).
  - The person's caption says "One metre is about the height of a child" while the badge reads "≈ 1.7 m tall". That is fine, but the model's head is cropped at the 1 m view on desktop.
  - Cheap upgrades: a merged, smooth-shaded mesh, or a low-poly glTF of about 30 KB.

### S15 — Low — Offline behaviour and network-first without a timeout
- Network-first navigation (`sw.js:7`) has no timeout. On flaky mobile connections the page waits for the network to fail before falling back to the cache.
- Offline, the standalone pages load from cache but are blank because three.js is cross-origin and uncached (S2).
- **Fix:** race the network against about a 3 s timeout before falling back, and vendor three.js.

---

## Per-page summary (subpath `/universe-sandbox/`, Chromium + SwiftShader)

| Page | Download (raw incl. three) | Load errors | Mobile 390x844 |
|---|---|---|---|
| `/` sandbox | 775 KB | none (SW-blocked warning only in test) | OK |
| `atlas/society.html` | 1.19 MB | 73 × 404 `tex/*`; `THREE is not defined` if CDN blocked | OK; label overlap; 4096 map raster on phones |
| `atlas/solar.html` | 1.11 MB | 50 × 404 `tex/lo/*`, ring PNGs; white untextured planets | OK; tab row clipped |
| `exoplanets/` | 1.21 MB | none (CDN dependency) | OK |
| `powers/` | 824 KB | none (CDN dependency) | OK (slow first frame under SwiftShader) |

## Top 5 improvements by value
1. **Restore or ship `public/atlas/tex/`, or remove the texture calls (S1).** This fixes the white planets in the Solar atlas and 50–73 console errors per load on both atlases.
2. **Vendor three.js r128 and OrbitControls locally (S2).** This removes the single point of failure that leaves all four pages blank, enables offline use, and saves a cross-origin fetch.
3. **Gate deploys on a browser smoke test that opens every standalone page under the subpath and fails on page errors or same-origin 404s (S9).** This would have caught S1, and it guards against future single-file drops.
4. **Fix the exoplanet pipeline and commit it (S4, S5, S6, S13).** Commit the `tools/` scripts. Mark RV-only masses as minimum and non-transit radii as estimated. Use Gaia DR3 distances. Recompute `a` from Kepler's law. Drop the unused 685 KB `nearby.json` from `public/`.
5. **Version the SW cache per build and add a "← Gravity Lab" link on every standalone page (S7, S3).** This stops unbounded cache growth and stops installed-PWA users from getting stuck in an atlas.

Sources used for data checks:
- [51 Peg overview, NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/overview/51%20Peg)
- [51 Pegasi b, NASA Science](https://science.nasa.gov/exoplanet-catalog/51-pegasi-b)
- [GJ 1214 b overview, NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/overview/GJ%201214%20b)
- [HD 189733 b, Wikipedia](https://en.wikipedia.org/wiki/HD_189733_b)
- [LTT 1445 A c, NASA Science](https://science.nasa.gov/exoplanet-catalog/ltt-1445-a-c/)
- [HIP 12961 b, NASA Science](https://science.nasa.gov/exoplanet-catalog/hip-12961-b)
- [Epsilon Eridani b, NASA Science](https://science.nasa.gov/exoplanet-catalog/epsilon-eridani-b/)
