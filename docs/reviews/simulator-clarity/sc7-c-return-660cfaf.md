# SC7-C1 / SC7-C2 return — 660cfaf

Claude, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, head **660cfaf36d838d35dc2aae0f0ed99bb16907b324**; parent **07464c3c379aa0632fcc8526a39983a391c20e2a** (reviewed in [implementation-review-07464c3.md](implementation-review-07464c3.md)). One commit, 4 files: `src/black-hole-catalog.ts`, `src/ui/black-hole-scales.ts`, `src/style.css`, `tests/black-hole-catalog.test.ts`. No solver, inspector logic or pointer code changed.

## Resolutions

| ID | Resolution |
|---|---|
| SC7-C1 | Each `BlackHoleExample` gains a compact visitor-facing `note`; `presetRows()` now carries `exampleName`, `exampleMass`, `exampleNote`, `exampleSource` (the old `example` string is kept). `blackHoleScalesHtml()` renders each example as `e.g. <a href=source target=_blank rel="noopener noreferrer" aria-label="… source (opens in a new tab)">name</a> ≈ mass` plus the note on its own line; all text is HTML-escaped. Displayed examples (5/5): Cygnus X-1 "Rounded estimate · accreting X-ray binary"; Gaia BH3 "Rounded estimate · dormant, no bright disk (unlike the illustrative disk shown here)"; GW190521 remnant "Original 2020 quasi-circular merger model: source-frame median, 90% range +28/−16 M☉"; Sagittarius A* "Rounded estimate; precise values differ"; M87* "Rounded estimate · accretion and jet". GW190521's stored `status` also now names the original 2020 quasi-circular interpretation, source-frame median and 90% credible interval. HLX-1 (not displayed) has "Uncertain estimate · candidate". Links get a visible underline and a `:focus-visible` outline (summary too). |
| SC7-C2 | Rows read "horizon radius X · shadow radius Y". The caveat now opens "Radii, not diameters, for a nonspinning black hole of each mass: horizon radius 2GM/c²; apparent shadow radius ≈ 2.6× horizon, as seen from far away. These are not measured image sizes, gas extents or on-screen sizes. Example masses are rounded or model-dependent; follow each link for the source." and keeps the disk-size and model-units/softened-Newtonian sentences. |

## Checks at 660cfaf

- passed: `pnpm format`; `pnpm check` — build, **215/215** units (new markup test: 5/5 rows carry `href` = catalog source, `rel="noopener noreferrer"`, `<i>note</i>`, "horizon radius … · shadow radius"; GW190521 quasi-circular/median/+28/−16; Gaia dormant; radii caveat; block starts `hidden`), check:dist 113 files.
- passed: `pnpm test:pages` — 12 pages × 2 viewports (24/24).
- passed (builder-run, rendered): [evidence-harness-7a2.mjs](evidence-harness-7a2.mjs) (7a harness plus SC7 checks), raw [evidence-7a2-660cfaf.jsonl](evidence-7a2-660cfaf.jsonl): **73/73** at 1440×900, 390×844, 844×390, 0 page/console errors. New per-viewport checks read the actual DOM after the row→markup path: 5/5 https source links with noopener; 5/5 visible qualifications; GW190521 qualification; Gaia dormant distinct from illustrative disk; 5/5 "horizon radius/shadow radius"; radii caveat; no row horizontal overflow; keyboard Enter on summary collapses and re-expands; Tab from summary focuses the first source link inside the block; caveat scrolls into view inside the panel. Retained 7a checks: collapsed mobile sheet hides the block, non-black-hole selection hides scale row and block, model-unit labels.
- Screenshots (Chromium/SwiftShader, builder-produced): [1440×900](shots/sc7a2-1440x900.png) (focus ring on the Cygnus X-1 link visible), [390×844](shots/sc7a2-390x844.png), [844×390](shots/sc7a2-844x390.png). Viewed all three.
- Known, unchanged: at 1440×900 the performance badge still sits just under the panel's lower edge near the lock buttons (the previously disclosed low layout limitation); the caveat itself is now above it in this capture but this is not claimed fixed.
- not run: physical Safari/iPhone, real GPU, screen reader, `pnpm test:browser` Save→Clear→Load (pre-existing environment failure).

## Next

7b (scene-wide unit mapping, per-body reference scale, persistence/history/merger treatment, physical-horizon scaling separate from visual/picking/contact size) remains with Claude after this correction is reviewed; legacy Earth-mass labels on other bodies remain a disclosed follow-up. No merge or release.
