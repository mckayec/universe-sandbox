# Gravity Lab: rendering, UI and runtime review (main sandbox page)

Reviewed at `audit` = main 667673f, without changing the repo. Experiments were done in `/home/claude/audit/visuals/`:
- `repo/` is a copy of the repo with a `window.__dbg` export added to `main.ts`, built to `dist-dbg` and previewed on port 4186.
- The untouched `dist` was previewed on port 4181.
- Driven with Python Playwright on Chromium + SwiftShader. SwiftShader takes about 40 s to start, so FPS numbers here mean nothing.
- Scripts are in `scripts/`, screenshots in `shots/`, logs in `leak.log`, `ui.log` and `confirm.log`.

## Confirmed

### V1: Habitable-zone labels are never removed and pile up on screen (High)
- **Where:** `src/visuals/create-visual.ts:299-306` (the zone label is a CSS2DObject *child* of the star group); removal happens in `src/bodies/lifecycle.ts:20-21,93-94`.
- **What happens:** three.js only fires the `removed` event on the object passed to `scene.remove()` (the group), not on its children. So the zone label's `<div>` never leaves `.label-layer`. Only `b.label` is cleaned up, and that is done by hand. Every star rebuild (`replaceVisual` on stage changes, transforms, undo/redo, exhibit loads, Clear) leaves an orphaned "POTENTIAL LIQUID-WATER ZONE" pill. If the label was visible at the time (planet drag with life zones on), it stays visible forever at its last screen position.
- **How confirmed:** star + planet, life zones on, drag frame, then `replaceVisual(star)`, five times. `.habitable-zone-label` count went 1, 2, 3, 4, 5, and was still 5 after removing both bodies. The stale pill shows in `shots/closeup-*.png` and `supernova-late.png`, where no star exists.
- **Fix:** add a `disposeLabels(object)` to `scene/dispose.ts` that traverses and calls `el.remove()` on every `CSS2DObject`, and call it from `disposeObject`. Better still, create one shared zone label instead of one per star.

### V2: Clicking a body in Inspect mode sets its velocity to zero (High)
- **Where:** `src/ui/pointer.ts:264-270`.
- **What happens:** on `pointerup` without a drag, `velocity.copy(dragStart).sub(dragPoint).multiplyScalar(app.didDrag ? 0.55 : 0)` gives zero. Just selecting a planet to read its panel stops it dead, and it falls into its star. No undo entry is recorded because `didDrag` is false.
- **How confirmed:** 1440x900, paused, Inspect, real mouse click on Jovia 03. Velocity went from `[0.12, 0, 3.25]` to `[0, 0, 0]`, and it was selected.
- **Fix:** only assign velocity when `app.didDrag` is true. Otherwise leave it unchanged.

### V3: After 120 s idle, attract mode wipes the visitor's universe and the build cannot be fully recovered (High)
- **Where:** `src/ui/feed.ts:36-56` → `loadExhibit` → `resetSimulation()` with no `recordHistory`. The recovery overwrite is in `src/app/loop.ts:58-66`.
- **What happens:**
  - After 2 minutes without pointer or key input (someone watching, or reading the panel), the build is replaced by the black-hole demo.
  - Undo only restores the snapshot taken *before the last edit*, so the latest change is lost.
  - The 15 s recovery timer then overwrites the recovery checkpoint with the demo scene.
- **Same bug after a reload:** the pagehide snapshot is overwritten 15 s after reload by the default 4-body scene. "Recover" is useless unless pressed within 15 s.
- **How confirmed:** placed a body (5 bodies) and set `idleSeconds = 121`. The scene became `Void 01…` and undo gave 4 bodies (Terra 05 lost). In the reload test, recovery held 9 bodies right after reload and 4 after the timer fired.
- **Fix:**
  - Call `recordHistory()` (or save a separate "pre-attract" snapshot) before attract mode, and restore it on the first touch.
  - Skip recovery saves while `attractMode` is on.
  - Don't overwrite the recovery slot until the user has made a change in this session (a dirty flag).

### V4: At ≤800 px wide, a running guided exhibit hides Universes, Exhibits and Fullscreen with no way back except "Exit guide" (High)
- **Where:** `src/style.css:1475-1477` (`.shell:has(.guide-card:not([hidden])) .top-actions {display:none}`).
- **What happens:** on iPad portrait (768) and phones, after starting an exhibit the visitor cannot switch exhibits or open the library. On iPad the guide card spans the full width.
- **How confirmed:** at both 768x1024 and 390x844, Playwright's click on `#exhibits-button` after loading "Feed a Black Hole" timed out with "element is not visible" (`ui.log`, `shots/768x1024-blackhole.png`).
- **Fix:** keep `.top-actions` visible, for example as compact icon buttons. Or move them into the guide card ("Other exhibits").

### V5: Top action buttons are clipped behind the universe toolbar on tablet and phone (Medium)
- **Where:** `src/style.css:1435-1438` and `1782-1784` (`.top-actions` at `top:42px/46px`), `1733-1738` (`.universe-toolbar` at `top:76px`, `z-index:9`, above the top bar's z-index 5).
- **What happens:** the Universes, Exhibits and Fullscreen buttons render half-hidden under the toolbar (visible in `shots/768x1024-home.png` and `390x844-home.png`). The 26 px touch targets are reduced to about 12 px of tappable area.
- **Fix:** move the toolbar down (`top: 84px`) or put `.top-actions` in the brand row on the right. Make touch targets at least 44 px.

### V6: Mobile and tablet layout problems (Medium)
- **No selected-object panel below 800 px:** `.info-panel {display:none}` (`src/style.css:1279`). iPad portrait and phones get no inspector at all, which is the core "explainable transformation" goal in AGENTS.md. Only the long-press menu remains.
- **Pause and Clear overlap Navigate:** they are positioned over the Navigate mode button (`style.css:1415-1424` vs `.interaction-modes` `right:112px`), so "Navigate" is partly covered (both mobile screenshots).
- **The tool panel covers about 40% of the iPad screen and about 45% of the phone screen,** and cannot be collapsed.
- **Text is far too small:** text sizes of 5–8 px are used throughout the mobile rules (68 declarations), e.g. `.object-label span {font-size:5px}` and `.interaction-modes button {font-size:7px}`. On a museum touch screen this fails legibility.
- **Toolbar overflow is hidden:** the universe toolbar scrolls sideways with its scrollbar hidden (`style.css:1555-1560`). At 390 px seven buttons (Life zones … Sound) are off-screen with no affordance, and at 768 two are.
- **Fix:**
  - Show a compact bottom-sheet inspector on mobile.
  - Make the tool panel collapsible.
  - Set a 10–11 px minimum font size.
  - Add an edge fade or "more" chevron to the toolbar.

### V7: The black-hole horizon draws on top of objects in front of it (Medium)
- **Where:** `src/visuals/create-visual.ts:44-57` (`depthTest:false`, `renderOrder 30`).
- **What happens:** a planet passing in front of a black hole gets a black disc punched through it, along with the photon ring (`shots/closeup-bh-occlusion.png`: Jovia in front of Void 01 shows the horizon over the planet).
- **Fix:** use `depthTest:true` and keep the high renderOrder. If the goal was to win over the additive disk, render the disk with `depthWrite:false` (it already is) and let depth do the work.

### V8: Auto and Low quality do almost nothing on desktop (Medium)
- **Where:** `src/scene/quality.ts:17-18`.
- **What happens:** the renderer pixel ratio is clamped with `Math.max(1, ratio*scale)` on non-mobile tiers. On a DPR-1 display, scales of 0.78 and 0.62 leave the canvas at 800x600, and the composer only drops to 0.9 (720 px). On DPR 2 the floor is less binding, but the auto loop's floor is 0.78, so it can only shave about 20%. Particle and galaxy budgets, bloom resolution and nebula raymarch are only partly tied to the scale. Galaxy budget is fixed at build time from `app.qualityScale` and never rebuilt.
- **How confirmed:** `applyQualityScale(1 / 0.78 / 0.62)` gave canvas 800x600 every time and composer RT 800, 720, 720.
- **Fix:**
  - Allow the floor to go to about 0.6–0.7 on desktop too.
  - Scale `bloom` resolution (`bloom.setSize`) separately, or disable bloom at the lowest step.
  - Hide `nebulaRaymarch` (the most expensive pass) below a threshold.
  - Expose a hysteresis so it doesn't oscillate.

### V9: Nebula bake cache and 3D noise texture are never freed (Medium)
- **Where:** `src/nebula-hd.ts:34,461-496,503-560`.
- **What happens:** the render-target textures in `bakeCache` (per look × sub-variant × layer) and the 64³ noise volume live for the whole session. The dispose path cannot reach them (they are in `uniforms`, which `disposeMaterial` does not walk), and nothing evicts them. Worst case across all 15 looks:
  - **Performance tier** (2048² main + 1024² halo, RGBA8 with mipmaps): about 28 MB per look, about 420 MB total.
  - **Mobile** (768 + 512): about 4.5 MB per look, about 68 MB total. This is significant on iPhone, where Safari kills tabs over roughly 1–1.5 GB.
- **How confirmed:** after every exhibit followed by Clear, the leak tracer listed an undisposed render-target texture and a 3D texture with no live users (`scripts/leak2.py` output). `renderer.info.memory.textures` ratcheted 21 → 24 → 30 → 34 over the clear cycles and never returned to baseline. Geometry fully returned (4 after each clear), so there is no geometry leak.
- **Fix:** reference-count cache entries per look and dispose the `WebGLRenderTarget` (keep the target, not just `.texture`) when the last nebula of that look is removed. Or use an LRU of about 4 looks. Lower `mainSize` on balanced to 1024 and on performance to 1536.

### V10: Per-object CPU texture generation causes hitches on impacts and supernovae (Medium)
- **Where:** `src/visuals/textures.ts:22-94`; callers in `effects.ts:58,107,131,144,278,309,374,473`, `materials.ts:180`, and `matter-streams.ts:97,108`.
- **What happens:** every impact builds a fresh 256² corona canvas (56 gradient strokes). Every supernova builds two 384² `cloudTexture`s with a per-pixel JS loop of about 147k pixels × 4 sines each, plus GPU uploads, all in the frame of the event. Each star creates its own glow and corona textures even though they are keyed only by colour and seed. This is the classic mid-explosion stutter on iPhone.
- **Fix:** memoise textures by `(fn, color, seed)` in a module cache, and pre-warm the supernova and impact textures at startup or during idle time. Then `disposeMaterial` must skip shared textures (mark them `userData.shared`).

### V11: Per-frame allocations in the hot loop (Low/Medium)
These are all code-confirmed.
- `update-visuals.ts:178` allocates `new THREE.Matrix4()` per nebula per frame; it duplicates the `onBeforeRender` in `nebula-hd.ts:778-780` and can be deleted.
- `update-visuals.ts:94-188` runs a full `traverse` closure per body per frame, with string compares on every child.
- `updateCometVisual` does `clone()` ×3 per frame.
- `updateVisuals` does `bodies.find` per galaxy.
- `loop.ts:131-138` does 3 `document.querySelector` calls and `textContent` writes every frame, even when unchanged.
- `pointer.ts:150-170` allocates Vector3/Vector2 per move event.
- **Fix:**
  - Cache per-body part lists at build time (`userData.parts`).
  - Use module-scope temporaries.
  - Cache DOM nodes.
  - Write text only on change.

### V12: Escape always forces Inspect mode (Low)
- **Where:** `src/ui/toolbar.ts:233-238`.
- **What happens:** pressing Esc to close the Universe library also switches the visitor out of Add mode or Navigate mode.
- **Fix:** if a dialog or menu was open, close it and return. Only change mode when nothing was open.

### V13: Dialog accessibility (Low)
- The `#universe-picker` and `#scenario-picker` dialogs have no `role="dialog"`, `aria-modal`, focus move or focus trap. Focus stays on the opener behind the overlay.
- `#toast` has no `aria-live`.
- `prefers-reduced-motion` only defaults Effects to "gentle". Camera transitions, attract mode and the screen flash still play (flash scaled down to 0.35).
- **Fix:**
  - Add the dialog roles and move focus to the heading.
  - Add `aria-live="polite"` to the toast.
  - Under reduced motion, also skip `transitionCamera` easing and attract mode.

## Suspected (not reproduced)

- **S1 (Medium): `100vh` on iOS Safari.**
  - **Where:** `style.css:26,1449,1708,1767,1967,2044`.
  - **Suspicion:** with the URL bar showing, `100vh` is taller than the visible area, so the bottom time controls, Orbit mode and part of the tool panel can sit under the Safari toolbar. There are no `env(safe-area-inset-*)` paddings for notch or home indicator, even though `apple-mobile-web-app-capable` is set.
  - **Fix:** use `100dvh` (fallback `100vh`) and add safe-area padding to fixed bottom and top UI.
- **S2 (Medium): supernova bloom blowout at close range.** In SwiftShader (very low FPS), a supernova viewed from about 80 u filled the frame white (`shots/supernova-late.png`). Low FPS stretches the flash phase, so this is not conclusive. Code-wise, `bloom.strength` can reach 0.66 + 2.15 while `toneMappingExposure` reaches 1.82 *and* the CSS `#screen-flash` reaches 0.86 opacity, all at once (`loop.ts:123-129`). That stacking will clip to white on real GPUs too. Suggest capping the combined boost and letting only one of the three carry the flash.
- **S3 (Low): drag continues on a removed body.** If the body being dragged is consumed in a collision, `app.dragBody` still points at the removed body. Pointermove keeps moving its detached mesh, and pointerup records history and sets velocity on it (`pointer.ts:218-224`, `collisions.ts:58,156`). Clear `app.dragBody` in `removeBody` when it matches.
- **S4 (Low): service worker.** I found no stale-build risk:
  - Navigations are network-first.
  - Hashed `assets/` are cache-first.
  - `skipWaiting` + `clients.claim` are used.
  - The SW is fetched with default `updateViaCache`.

  However:
  - `CACHE` is a constant `gravity-lab-shell-v3`, so old hashed bundles accumulate forever (one per deploy, about 1 MB each).
  - Network-first has no timeout, so on bad museum Wi-Fi a navigation waits for the full network failure before falling back.

  Prune `assets/*` entries not referenced by the current `index.html` on activate, and add about a 3 s timeout race for navigations.
- **S5 (Low): Life zones toggle has no UI on mobile.** The toolbar is clipped as described in V6, and the zone only appears while dragging a planet, which on touch requires Inspect mode plus a drag. The feature is likely undiscoverable on tablets.

## Checked and fine
- No geometry leak on place, galaxy, Clear, transform ×20, undo/redo ×10, or exhibit loads: geometries returned to 4 after each clear, and the tracer found no undisposed geometries.
- Composer, bloom and label renderer resize correctly on `resize`. The DPR caps (2 / 1.75 / 1.35) are sensible.
- No page errors or console errors. The only warnings were SwiftShader "GPU stall due to ReadPixels".
- Pinch-to-zoom cancels pending touch placement and drag correctly.
- The lensing shader guards division by zero (`distanceToLens>.0001`). The glow and nebula shaders fade before the quad edge, so I saw no boxy edges.
- Galaxy disk z-fighting with the grid is handled by `polygonOffset`.

## Top 5 improvements by value
1. **Stop attract mode and the recovery timer from destroying visitor work (V3).** This is a data-loss path in normal museum use. Snapshot before attract, restore on touch, and don't autosave demo or default scenes over real work.
2. **Don't zero velocity on a plain click (V2).** Selecting is the most common action and it currently breaks orbits.
3. **Fix the mobile and tablet chrome (V4, V5, V6).** Keep Exhibits and Universes reachable during guides, unclip the top buttons, add a compact inspector and a collapsible tool panel, and set a font size floor. iPad is a target device and is currently the weakest layout.
4. **Remove CSS2D children on dispose (V1).** This gets rid of the floating "POTENTIAL LIQUID-WATER ZONE" pills and the DOM growth.
5. **Make performance scaling real and bounded (V8, V9, V10).** Lower the desktop floor and scale bloom and raymarch. Add a ref-counted or LRU nebula bake cache. Memoise and pre-warm canvas textures to remove impact and supernova hitches on iPhone.
