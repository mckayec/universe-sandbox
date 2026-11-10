# Item 7a return — black-hole catalog and honest units (+ SC6-O2)

Claude, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, head **07464c3c379aa0632fcc8526a39983a391c20e2a**, parent **20837c0211575d03ed0ad3ff3c34fcb98adeb653**. Bounded unit 7a of item 7 (HANDOFF_PLAN "Simulator clarity and physics implementation handoff", item 7 and "Black-hole catalog reference values"). Not merged.

## What changed (11 files, +425/−9)

- **New pure `src/black-hole-catalog.ts`.** Constants from IAU nominal GM☉ and c: Schwarzschild radius 2GM/c² = 2.95325 km per M☉ (test-checked). Five UI presets at 5, 30, 1,000, 1 million and 1 billion M☉, explicitly *not* five classes: `blackHoleClass` maps them to stellar-mass ×2, intermediate-mass, supermassive ×2 (boundaries 100 and 100,000 M☉, labelled approximate). The six handoff examples (Cygnus X-1 ≈21, Gaia BH3 ≈33, GW190521 remnant ≈142, HLX-1 ≈20,000, Sgr A* ≈4 million, M87* ≈6.5 billion M☉), each with its status/uncertainty wording, context and source URL. `blackHoleSizes(M)` returns horizon, photon sphere (1.5×), far-field shadow radius (√27·GM/c² ≈ 2.598× horizon), ISCO inner disk edge (3×) for a nonspinning model; `outerDiskKm` is always `null` (disk extent is not set by mass). Every length scales linearly with mass.
- **Honest labels.** Black-hole mass in the inspector, object menu and canvas label now reads "600 model units" (was "600 M⊕"); other bodies keep their existing readout. New **Scale** row ("Model units · not to scale") and a collapsible **Real black-hole sizes** block (native `<details>`) listing the five presets with class, horizon, shadow and nearest same-class example, plus a caveat that the simulator is softened Newtonian gravity in model units and not accurate near a horizon. Hidden for non-black-holes and in the collapsed compact sheet (shown under Details).
- **No solver change.** Nothing in the catalog reaches the solver, velocity clamp, contacts, display radius or picking (test asserts gravity-engine, simulate, collisions and celestial-catalog do not import it).
- **SC6-O2.** `notePointerUp` keeps no released entry for a pointer with no recorded press; `down`/`released` are capped at `MAX_TRACKED_POINTERS = 16`, evicting oldest; `notePress` records only while Kids mode is on and the grown-up dialog is open (opening/closing still resets). Per-pointer identity, the identity-less fallback (`last`), keyboard detail-0 activation and reset behaviour are unchanged.

## Checks at 07464c3

Passed:
- `pnpm format`; `pnpm check`: format, build, **214/214** units (10 new: 8 catalog, 2 SC6-O2 incl. 1,000-ID retention and the extracted actual `notePress` handler under open/closed/adult), check:dist **113** files.
- `pnpm test:pages`: **12 pages × 2 viewports**.
- Rendered, builder-run: [evidence-harness-7a.mjs](evidence-harness-7a.mjs), raw [evidence-7a-07464c3.jsonl](evidence-7a-07464c3.jsonl): **40/40** checks at 1440×900, 390×844 and 844×390 (production build, `vite preview`, headless Chromium + SwiftShader). Black hole placed via palette + playfield click; mass and canvas label read model units; compact collapsed sheet hides the block, Details reveals it; 5 rows incl. Sgr A* and M87*; panel inside viewport; selecting a placed rocky world hides Scale and the block and keeps M⊕; 0 page/console errors.
- Screenshots viewed (3/3): [1440](shots/sc7a-1440x900.png), [390×844](shots/sc7a-390x844.png), [844×390](shots/sc7a-844x390.png).

Not run / unavailable: parent negative control for the rendered harness (the new elements do not exist at 20837c0); `pnpm test:browser` (pre-existing Save→Clear→Load wait); physical iPhone/Safari, real GPU, screen reader.

## Known gaps

| Gap | Impact | Blocks 7a review? |
|---|---|---|
| **7b not started:** no per-body reference-scale choice, so a simulated black hole is not tied to any preset; no documented scene-wide μ_sim = μ_SI·T0²/L0³ conversion; no linear horizon scaling with model mass growth/mergers. Needs a persisted field (save/load/history/merge rules). | Explanation is catalog-level, not per object | No; next unit |
| Other bodies still print legacy masses as M⊕ (e.g. a default star is 210 "M⊕"; event-feed strings in stellar-evolution.ts and collisions.ts). Out of item-7 black-hole scope. | Low, explainability | No; ChatGPT to dispose (fold into 7b or a later units pass) |
| The 6 examples use the handoff's rounded values verbatim; I did not re-open the sources this run. | Low | No |
| 844×390 and the scrolled desktop panel: the pre-existing perf badge overlaps the panel's last lines. Not introduced here. | Low, visual | No |
| Builder-produced SwiftShader evidence only; no device, GPU or assistive-tech pass. | Release gate | No |

## Next action

ChatGPT: implementation-review of 7a at 07464c3 (catalog values/wording, unit honesty, SC6-O2 bounds). Claude then implements 7b (per-body reference scale + documented unit mapping) unless the review redirects.
