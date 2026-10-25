# Gravity Lab audit: book-series Atlas engine and packs (code, data, UX, performance)

Scope: `public/atlas/index.html`, `engine.js`, `engine.css`, `PACK_FORMAT.md`, `packs/*.js` (sun-eater, hyperion, expanse, dune, foundation, cosmere, _template, registry), and how `src/universe-packs.ts` and `src/ui/exhibit-flow.ts` link to them. Commit 667673f, read-only. `dist/atlas` is byte-identical to `public/atlas` (checked with `diff -rq`).

## Method

- **Static checks.** `/home/claude/audit/atlas/validate.js` loads each pack in a Node `vm` sandbox and checks it against PACK_FORMAT.md: duplicate IDs, references from events, links, labels, glows, realms, `hero`, `rel`, `at.of` and `ui.go`, book numbers, gfx types, the 14-entry `feat` cap, lat/lon ranges, moon/planet overlap, spoiler ordering and polar sites. Raw output is in `validate.json`.
- **Browser checks.** I ran `pnpm preview --port 4182` and drove it with Python Playwright on Chromium with SwiftShader (`drive.py`, `e36.py`, `leak.py`, `hdr.py`, `resize.py`, `sites2.py`, `cdnfail.py`). Each pack was tested at 1440×900 and at 390×844 (DPR 3, touch). The tests:
  - selected every world and opened every event;
  - cycled every book filter;
  - opened every Codex tab and closed it with Esc;
  - descended into the 3 worlds with the most sites and selected their sites;
  - repeated descend/ascend and tracked `renderer.info.memory`;
  - cycled the Cosmere realms in both galaxy and world view.
- **CDN workaround.** This sandbox blocks cdnjs, so I served three r128 from the npm tarball for these tests. That block also exposed finding A2.
- **Subpath test.** I copied `dist` to `/home/claude/audit/atlas/sub/universe-sandbox/`, served it with `python -m http.server`, and loaded the atlas pages under `/universe-sandbox/atlas/...`.
- **Results.** Screenshots are in `/home/claude/audit/atlas/shots/`.

**What came back clean:**
- No JS page errors and no console errors in any pack, at either viewport.
- No NaN positions.
- No broken ID references of the event→world, event→site, link→world, label→world or realm→world kind.
- No duplicate IDs.
- No 404s under the subpath.
- No texture or geometry growth across 8 descend/ascend cycles: textures stayed at 8 and geometries at 26 on Dune.

---

## Confirmed findings

### A1 — High — No way back to the Gravity Lab sandbox from any atlas
- **Where:** `engine.js:435-456` (shell has no link), `index.html:36-38` (chooser has no link), `engine.js:1319` (the error panel only links to `?`).
- **What happens:** No page under `atlas/` has a link back to the simulator. The scan of `document.querySelectorAll('a')` returned `[]` on every pack page.
- **Impact:** The sandbox opens atlases with `location.assign` (`exhibit-flow.ts:179`), so the browser Back button is the only way out. The app ships a manifest with `display: standalone`. In an installed PWA (iOS home screen) there is no Back button, so the user is stuck in the atlas.
- **Fix:** Add a "← Gravity Lab" link with `href="../"` (relative, so the subpath keeps working) in the header brand area and in the chooser. A pack could override its label through `ui.backLink`. Also add `history.back()` as a fallback when `document.referrer` is the sandbox.

### A2 — High — three.js is loaded at runtime from cdnjs; the atlas fails offline and with the CDN blocked
- **Where:** `index.html:41` (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`).
- **What happens:** With that request aborted, the page shows a bare white `<p>` reading "Could not load https://cdnjs…/three.min.js". There is no styling and no link back (the code path at `index.html:44` runs before `AtlasEngine` exists). I reproduced it in `cdnfail.py`, and it also happened naturally here because the proxy blocks cdnjs.
- **Why it matters beyond this sandbox:**
  - `sw.js` skips cross-origin requests, so the atlas never works offline, even though the PWA caches the shell.
  - It goes against PACK_FORMAT §18, "self-contained (no network requests)".
  - School and museum networks often block CDNs.
- **Fix:** Vendor `three.min.js` (r128, about 600 KB) into `public/atlas/vendor/` and load it with a relative path. Alternatively, build the engine through Vite against the repo's own three 0.180, but that needs shader and encoding API updates. Style the failure message and give it a back link.

### A3 — High (Cosmere, Foundation, Expanse); Medium (others) — The desktop header overflows and the Codex, Galaxy and Home buttons go off-screen at common laptop widths
- **Where:** `engine.css:91` (`.top`), `:97` (`.controls{min-width:0}` with no wrap and no overflow handling). The mobile layout only applies at ≤820px.
- **How confirmed:** `hdr.py` measured buttons whose right edge falls past `innerWidth`:

  | Pack | 1440 | 1280 | 1024 | 900 | 821 |
  |---|---|---|---|---|---|
  | cosmere | Codex | Galaxy, Cluster, Codex | books VIII–XII plus all 3 buttons | from V on | from III on |
  | foundation | — | — | Galaxy, Empire, Codex | — | books III–VII and buttons |
  | expanse | — | — | Galaxy, Sol, Codex | — | — |
  | sun-eater | — | — | Codex | — | 3 buttons |
  | dune | — | — | — | — | 3 buttons |
  | hyperion | — | — | — | — | Codex |

  The deep run on Cosmere at 1440 also reported `cxBtn:1380..1446`. Screenshots: `shots/cosmere-1024.png`, `shots/cosmere-desk-galaxy.png`.
- **Effect:** Elements wider than the viewport are clipped by `#app{overflow:hidden}`, so they cannot be reached at all. A 1280px or 1366px laptop cannot open the Cosmere Codex.
- **Fix:**
  - Let `.controls` wrap (`flex-wrap:wrap; justify-content:flex-end`).
  - Or apply the existing `.manybooks` treatment (books on their own row) whenever books > 7, at any width.
  - Or raise the mobile breakpoint to about 1100px for many-book packs.
  - Add a regression check to the smoke test: no header button past `innerWidth`.

### A4 — Medium — Chronicle events on realm-only worlds fly to an invisible world (Cosmere e36, e62)
- **Where:** `engine.js:1233-1237` (`openEvent`). The realm auto-switch only fires when the event has a `site` that has a `realm`. It ignores `world.realm`.
- **What happens:** In the Physical realm, clicking "The view from outside" (e36, Silverlight) or "Dusk and Starling" (e62, Emberdark) in the Chronicle sets `S.sel` to a world that `seen()` hides. Its label opacity is 0, it is absent from the index and it has no marker. The camera flies to empty space and the dossier still shows the world. Confirmed in `e36.py`: `realm:'physical', lbl:'0', idxHas:false`.
- **Note on e62:** its site `hiddengate` has no `realm` (its world does), so the existing check does not catch it either.
- **Fix:** In `openEvent`, use `const rr = (st && (st.realm||st.realms)) || ew.realm || ew.realms` and call `setRealm` before flying. Do the same in `selectWorld` and `descend` when the target world is realm-gated.

### A5 — Medium — The mobile layout is decided once at load; resizing or rotating breaks the layout
- **Where:** `engine.js:468` (`const MOB=isMob()`, never re-evaluated) against the CSS `@media (max-width:820px)` rules.
- **What happens:** I loaded at 1440, then resized to 700×900. The CSS switched to the mobile layout, but the JS stayed in desktop mode:
  - the dossier was not collapsed (class `panel`);
  - the dossier spans y 272–848 while the Chronicle starts at 725, so they overlap (`shots/cosmere-resized-700.png`);
  - tapping the grab handle does nothing useful because `dosCollapsed` logic is gated on `MOB`.
- **Also affected:** iPad split-view and rotation, and desktop windows dragged narrow. The reverse case has the same mismatch: a phone in landscape at >820px gets desktop JS with the coarse-pointer CSS.
- **Fix:** Recompute `MOB` in `resize()`. On a change, toggle the collapsed and closed classes, re-run `renderDossier` and `closeChron`, and update the pixel-ratio cap. Better still, drive everything from `matchMedia(...).addEventListener('change')`.

### A6 — Medium (performance) — Mobile still bakes 4096×2048 planet maps and 4096×2048 vector maps
- **Where:**
  - `engine.js:482` sets `HD = window.__HD || Math.min(4096, MAXTEX)` with no `MOB` branch. On iPhones MAXTEX is 4096 or more, so HD is 4096.
  - `engine.js:737`: MAPW on mobile is also 4096.
  - Each descent allocates albedo and normal render targets at 4096×2048 RGBA with mipmaps, plus the cloud target at 2048×1024. That is roughly 32 MB × 1.33 × 2 + 11 MB ≈ 96 MB of GPU memory.
  - During the swap the 512 preview is also alive, and each moon adds 1024² targets.
  - `gfx.map` worlds (Cosmere Roshar and Scadrial) also build a 4096×2048 canvas, read it back synchronously and draw several 1024×512 canvases with `getImageData` on the main thread.
- **How confirmed:** Code reading, plus a measured stall. With HD forced down to 1024, SwiftShader still took more than 90 s to finish the Arrakis bake (`bake_timeout: ["arrakis"]`), and frame rate during the bake was 1–4 fps. SwiftShader overstates this, but iOS Safari tab-kill risk at this memory level is real.
- **Fix:**
  - Use `HD = MOB ? 2048 : …`, and `MAPW = MOB ? 2048 : …`.
  - Use 1024 when `navigator.deviceMemory < 4`.
  - Skip mipmaps on the normal target.
  - Free `MAP_CACHE` in `clearPlanet` (see A12).

### A7 — Medium — Sun Eater: a Book-1 event points at a Book-3 site, which leaks a spoiler and makes the event a dead click
- **Where:** `sun-eater.js:434`: event `b1a` (book 1, Colchis) has `site:"belgaer"`. That site (`:99`) has `books:[3,4,5]` and its description says "Hadrian finds his old tutor Gibson alive here".
- **What happens:** With book I selected, the Colchis dossier event line shows "NOV BELGAER" (confirmed: `['NOV BELGAER']`). On the surface that site is filtered out by `siteSeen`, so `selectSite('belgaer')` does nothing.
- **Fix:** Drop `site` from b1a, or point it at a site that exists in book 1. The validator flags this class of problem as `site first book > event book`. Making the validator a test would stop it coming back.

### A8 — Low — Hyperion: 3 surface features are silently dropped
- **Where:** `hyperion.js`, world `hyperion`, `gfx.feat` has 17 entries. The engine keeps only the first 14 (`engine.js:723`, `slice(0,14)`, matching the shader's `uFA[14]`).
- **What is lost:** a flame biome at (-9, 86) and two rivers.
- **Fix:** Trim or merge the entries, or move the extras into `gfx.map`. The engine should also `console.warn` when the list is truncated.

### A9 — Low — Expanse and Cosmere: many landable bodies have no sites, including stars rendered as planets
- **Data:**
  - Expanse: 20 of 34 worlds have no sites, including `luna`, `europa`, `pallas`, `phoebe`, `tycho`, `thoth`, `jupiter` and `saturn`. This matches the known rough spot about Expanse moons.
  - Cosmere: 45 of 60 worlds have no sites, including 9 stars.
  - Dune: 22 of 28. Foundation: 11 of 31. Sun Eater: 26 of 52. Hyperion: 15 of 46.
- **What happens:** Descending into one of these shows a bare globe. Stars (Expanse `sun`, Cosmere `rosharsun`, `scadsun`, `nalthsun`…) render as "lava" planets with terrain, ice caps and bumps (`expanse.js:150-158`).
- **Fix:**
  - Give story-relevant moons at least one site, for example Luna's Copernicus and Europa's Ice Mines.
  - Add an engine flag (`gfx.type:"star"` or `noSurface:true`) that hides Descend and shows a glowing sphere.
  - Have the validator warn when a `major` world has no sites.

### A10 — Low — Keyboard and screen-reader problems
- **Invisible focusable buttons.** Every world label and site label is a `<button>` hidden only with `opacity:0; pointer-events:none` (`engine.js:955`, `:980`). They stay in the tab order, so Tab walks through 30–60 invisible buttons before reaching the panels. Fix: set `tabIndex=-1` or `visibility:hidden` when hidden, or use `inert`.
- **Codex dialog.** It has `aria-modal="true"` but no focus trap, and focus is not returned to `#cxBtn` on close (`:1094-1096`). Fix: trap focus and restore it on close.
- **Dossier announcements.** `#dossier` has `aria-live="polite"` and is rebuilt with `innerHTML` on every `refreshAll` (book click, hover-free selection and so on). Screen readers re-announce the whole panel each time. Fix: announce a short summary in a separate live region instead.
- **Mobile touch targets.** On mobile the book buttons for 12-book Cosmere are 27×30 px, against a 44 px guideline. Fix: give the `.manybooks .seg` row its own scroll, or use a `<select>` when there are more than 9 books.

### A11 — Low — No deep links or history for in-atlas state
- **Where:** `engine.js` has no `history` or `popstate` usage. Only `?pack=` is read.
- **Effects:**
  - There is no way to link to "Dune, book III, Arrakis, Sietch Tabr".
  - A reload loses the reading position. This matters for the spoiler gate: a reader on book 2 who reloads is shown "All" again, with spoilers.
  - Browser Back exits the atlas instead of ascending from the surface.
- **Fix:** Mirror `book`, `world`, `site` and `realm` into `location.hash` with `replaceState`, and restore them on load. Remember the selected book per pack in `localStorage`, inside try/catch. Push a history entry on descend so Back ascends.

### A12 — Low — `gfx.map` textures outlive the surface view
- **Where:** `clearPlanet` (`engine.js:882-884`) does not call `freeMaps`. The 8192×4096 or 4096×2048 hi-map texture and its canvases stay alive in the galaxy view until the next descent.
- **Fix:** Call `freeMaps(null)` in `ascend`.

### A13 — Low (polish) — Credits overlap the dossier at 1440×900
- **What happens:** The `.credits` line in the Chronicle header draws over the bottom row of the desktop dossier, its last legend row ("Coloured lines…"). Seen in `shots/dune-desk-galaxy.png` and `shots/cosmere-desk-galaxy.png`.
- **Fix:** Cap `#dossier` at `bottom: calc(var(--ch) + 8px)`, or hide credits when they collide.

### A14 — Low — `_template.js` cannot be registered as written; registry and universe-packs disagree
- **Template mismatch.** `_template.js` registers the key `"template"`. `index.html:43` loads `packs/<id>.js`, so `{id:"template"}` would 404 and `{id:"_template"}` would fail the key check. Its example link also passes through `frontier`, a book-2 world, in book 1, which is a spoiler example in the template itself.
- **Two lists.** The pack list exists twice, in `packs/registry.js` and `src/universe-packs.ts`, with diverging copy and accents (cosmere `#c9b8ff` against `#9b83f5`).
- **Fix:** Document "copy to `packs/<id>.js` and change the key to `<id>`". Fix the template's link book. Consider generating `registry.js` from `universe-packs.ts` at build time, or adding a test that keeps them in sync.

### A15 — Low — Sun Eater Padmurak: `first: 4` but `books` includes 1
- **Where:** `sun-eater.js:109`.
- **What happens:** In book I or II mode the world is hidden, yet a book-1 badge would be implied. This is probably intentional (it is mentioned in book 1 but only visited later). Confirm with the content reviewer.

## Suspected (not reproduced)

- **S1 — WebGL context loss is unhandled.** There is no `webglcontextlost` or `webglcontextrestored` listener. With large render targets (A6), iOS Safari is likely to drop the context when the tab is backgrounded, which leaves a black canvas until reload. Suggest at minimum a "Tap to reload" overlay on context loss.
- **S2 — Dropped site selection on low-fps devices.** In the deep runs some sites were still at opacity 0 1.6 s after `selectSite`: Hyperion Maui `firstsite`, Expanse Earth/Mars/Ilus, Foundation Trantor. Re-running Mars and waiting for the turn to finish showed all sites visible, so this was SwiftShader slowness, not a placement bug. The turn tween is 1.5 s; on very slow devices a second tap during a turn starts a new turn from a mid-tween angle, which is fine.
- **S3 — Main-thread jank from `mapTextures` on descent.** It draws an 8192×4096 canvas plus pixel loops synchronously when a `gfx.map` world (Roshar, Scadrial) is opened. Not timed on real hardware. Moving it to an idle callback or an OffscreenCanvas worker would help.

## Checked and fine

- **Subpath.** Every URL in the engine, CSS (`url(fonts/…)`), packs and chooser is relative. `earth-base.png` resolves through `ENGINE_BASE`. Under `/universe-sandbox/atlas/?pack=…` all six packs, the chooser and `index.html?pack=cosmere` loaded with no 4xx. `universe-packs.test.ts` already rejects absolute `atlasPath`.
- **Unknown or invalid `?pack=`.** `nope`, `_template` and `registry` all fall back to the chooser with a clear "No atlas called … is installed" notice. A pack that throws in `normalise` gets the styled fail panel.
- **Polar landing (Arrakis, Scadrial).** Dune has 15 sites at ≥65° (Polar Sink at 87°) and Scadrial has 14. `selectSite` clamps pitch to ±1.2 rad and the orbit allows ±1.45 rad, so all of them became visible after selection in the deep run (no Dune or Cosmere entries in `site_not_visible`). The Arrakis landing screenshot shows the north-polar cluster legible. Labels are dense but they do not stack. I consider this rough spot resolved.
- **Realm switching (Cosmere).** Physical → Cognitive → Spiritual → Physical restores the link set (10 links before and after). Spiritual thread geometries go from 24 to 61 and are disposed on return (back to 24). Switching realm on the Roshar surface applies the subastral look and hides moons and clouds; ascending afterwards keeps the realm consistent.
- **Memory.** 8 descend/ascend cycles on Dune (Giedi, Caladan) kept textures and geometries flat (8 and 26) and site labels at 0 in galaxy view. Cancelled bake jobs dispose their targets.
- **Pixel ratio.** Capped at 1.6 on mobile and 2 on desktop. Galaxy points are 70k on mobile and 150k on desktop, drawn as one `Points` call each. Galaxy view draws 15–43 calls per pack.
- **Esc.** Closes the Codex, otherwise ascends from the surface.

## Per-pack summary

| Pack | JS / console errors | Broken refs | Data warnings | Browser notes |
|---|---|---|---|---|
| sun-eater (52 worlds / 65 events / 61 sites) | 0 | 0 | b1a→belgaer spoiler (A7); padmurak first > min(books) (A15) | header clipped ≤1024 (A3) |
| hyperion (46 / 57 / 70) | 0 | 0 | hyperion `feat` 17 > 14 (A8) | fine at 1024; Codex clipped at 821 |
| expanse (34 / 88 / 34) | 0 | 0 | 20 worlds without sites incl. Luna and Europa; Sun is a lava "planet" (A9) | header clipped at 1024 (A3) |
| dune (28 / 54 / 46) | 0 | 0 | terra sits at Sol (intended); 22 worlds without sites | polar sites reachable; slowest bake (A6) |
| foundation (31 / 68 / 40) | 0 | 0 | earth at Sol (intended); trantor/wye at −80° (reachable) | header clipped at 1024 (A3) |
| cosmere (60 / 63 / 174) | 0 | 0 | 45 worlds without sites; e36/e62 on realm-only worlds (A4) | Codex clipped even at 1440 (A3); 27 px book buttons on mobile |
| _template | n/a | 0 | key/file-name mismatch; spoiler example link (A14) | n/a |

## Top 5 improvements by value

1. **Add a relative "← Gravity Lab" link (`../`) to the atlas header, chooser and error panel (A1).** It is the only way out of an atlas in the installed PWA.
2. **Vendor three r128 locally instead of loading it from cdnjs, and style the load-failure message (A2).** This makes atlases work offline and on filtered networks, and honours the pack-format rule.
3. **Fix header overflow for packs with many books (A3).** Wrap the controls or move books to their own row at every width. Today Codex and Home are unreachable at 1024–1440 for Cosmere, Foundation and Expanse.
4. **Cut mobile bake sizes (HD and MAPW 2048, or 1024 on low-memory devices), free map textures on ascend, and add a context-loss overlay (A6, A12, S1).** This is the main crash and jank risk on phones.
5. **Turn `validate.js` into a `pnpm test` case, add `MOB` re-evaluation on resize, and make `openEvent` honour `world.realm` (A4, A5, A7, A8).** This catches the remaining data bugs automatically and fixes the two real interaction bugs found.

Artifacts: `/home/claude/audit/atlas/validate.js`, `/home/claude/audit/atlas/validate.json`, `/home/claude/audit/atlas/results-deep-*.json`, `/home/claude/audit/atlas/shots/`.
