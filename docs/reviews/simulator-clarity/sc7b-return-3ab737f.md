# Item 7b return — per-body black-hole reference scale and unit mapping

Claude, 2026-11-10 UTC. PR #47, `sim/clarity-physics`, head **3ab737fe90991767b3cebf5410dc5a1c3b7a6f84**, parent **660cfaf36d838d35dc2aae0f0ed99bb16907b324**. Bounded unit 7b of item 7, as returned by [implementation-review-660cfaf.md](implementation-review-660cfaf.md) ("scene-wide unit mapping, per-body reference scale, persistence/history/merger treatment, and physical-horizon scale distinct from visual/picking/contact size"). Not merged.

## Design

- **Scene-wide unit mapping (documented, not applied).** New pure `src/black-hole-reference.ts` exports `SCENE_UNIT_MAPPING`: mass = model units; length = scene units (a horizon in km is reported, never drawn); time = simulation seconds; gravity: *if* L0 (m) and T0 (s) were fixed, mu_sim = mu_SI · T0² / L0³. The scene fixes neither, so no physical mu enters the softened Newtonian solver. `gravitationalParameterSim` / `solarMuSim` implement the formula for reference and are test-checked (L0 = 1 AU, T0 = 1 yr/2π gives GM☉ ≈ 1).
- **Per-body reference scale.** A black hole may carry `bhReference = { origin, solarMassPerModelUnit }`. The inspector's new **Read as** picker (label + native `<select>`: "Model units only" + the five presets; a hidden, disabled "Merged remnant" option for display only) sets the factor to preset M☉ ÷ current model mass. The row then reads e.g. "≈ 30 M☉ · Stellar-mass · horizon radius 89 km (not drawn to scale)". The Mass row stays "N model units"; the canvas label is unchanged.
- **Linear horizon scaling.** The factor is fixed at selection, so accretion, slow infall and merger growth scale the referenced mass, and therefore the 2GM/c² horizon, linearly with model mass. The cube-root body-growth law is not used for it.
- **Merger rule.** `consume` sets the survivor's record with `mergeReferences`: both referenced → referenced solar masses add (origin `merged`); only survivor referenced → its factor applies to the added mass; only the swallowed hole referenced → its factor is adopted (origin `merged`); neither → none. Non-hole food (stars, gas) has no reference and is read at the survivor's factor. Slow infall only feeds stars/brown dwarfs/gas giants into holes, so it never combines two references.
- **Persistence and history.** Snapshot copies the record; restore passes it through `sanitizeReference` (black holes only, finite positive factor, known preset id or `merged`; anything else, including older saves, becomes none). Picker changes record one undo step. `transform` to another kind clears it.
- **Physical horizon ≠ visual/picking/contact size.** The record is never read by `gravity-engine`, `simulate`, `update-visuals`, `pointer` or the contact test, and the module writes no mass, radius, velocity or mesh field (source-asserted). Rendered check: mass, radius and position identical before and after choosing a preset.
- Read-only test probe (`?probe=1`) now also reports each body's `mass`, `radius` and a copy of `bhReference`.

Changed (14 files, +362/−4): `src/black-hole-reference.ts` (new), `tests/black-hole-reference.test.ts` (new, 9 tests), `src/state/types.ts`, `src/sandbox-state.ts`, `src/state/history.ts`, `src/bodies/registry.ts`, `src/bodies/lifecycle.ts`, `src/physics/collisions.ts` (reference record only), `src/ui/black-hole-scales.ts`, `src/ui/template.ts`, `src/ui/inspector.ts`, `src/ui/toolbar.ts`, `src/ui/test-probe.ts`, `src/style.css`.

## Checks at 3ab737f

Passed:
- `pnpm format`; `pnpm check`: format, build, **224/224** units (9 new), check:dist **113** files.
- `pnpm test:pages`: **12 pages × 2 viewports**.
- Rendered, builder-run: [evidence-harness-7b.mjs](evidence-harness-7b.mjs), raw [evidence-7b-3ab737f.jsonl](evidence-7b-3ab737f.jsonl): **73/73** checks across 1440×900, 390×844 and 844×390 (production build, `vite preview`, headless Chromium + SwiftShader). Per viewport: hole placed via UI; collapsed compact sheet hides the row; default "Model units only"; visible label; picking Large stellar reads ≈ 30 M☉ / Stellar-mass / horizon radius 89 km; row fits inside the panel; Mass still model units; factor × mass = 30; mass/radius/position unchanged; one undo step; Undo → none, Redo → 30 M☉; selection in Inspect mode; Save → set none → Load restores 30 M☉; two referenced holes (30 + 5) merge while running into one survivor with origin `merged` and exactly 35 M☉, inspector "≈ 35 M☉ … horizon radius 103 km" and picker "Merged remnant"; rocky selection hides the row; 0 page/console errors.
- Screenshots viewed (3/3): [1440×900](shots/sc7b-1440x900.png), [390×844](shots/sc7b-390x844.png), [844×390](shots/sc7b-844x390.png). The first harness pass showed the row's text clipped at the panel edge; fixed (stacked label/picker/readout) before this head and a fit check added.

Not run / unavailable: parent negative control (the picker does not exist at 660cfaf); `pnpm test:browser` (pre-existing Save→Clear→Load wait; this harness's Save→Load without Clear passed); physical iPhone/Safari, real GPU, screen reader; external-link activation.

## Known gaps

| Gap | Impact | Blocks 7b review? |
|---|---|---|
| Other bodies still print legacy masses as M⊕ (event-feed strings in stellar-evolution.ts and collisions.ts too). Carried from 7a; out of black-hole scope. | Low, explainability | No; ChatGPT to dispose |
| Mixed merger semantics are a documented choice (unreferenced mass read at the remaining factor). A reviewer may prefer dropping the reference instead. | Low | No |
| The 844×390 capture shows the panel's lower rows below the fold (panel scrolls); pre-existing perf-badge proximity not changed. | Low, visual | No |
| No disk/encounter code reads the reference (disk extent stays not-set-by-mass, per 7a). | None intended | No |
| Builder-produced SwiftShader evidence only; no device, GPU or assistive-tech pass. SC1-E1/SC4-E1 and release limits unchanged. | Release gate | No |

## Next action

ChatGPT: implementation-review of 7b at 3ab737f (unit-mapping wording, reference/merger semantics, persistence, physics isolation). With item 7 then complete, the handoff's items 1–7 are all returned; release remains Mckay's gate.
