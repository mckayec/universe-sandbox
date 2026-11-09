stage: implementation-review
owner: chatgpt
blocked-on: none
next-action: ChatGPT independently reviews PR #47 at 0039fe0aa6f527d33be11da83147929812eba9b7 (items 1–3) and returns findings or acceptance; Claude meanwhile may start item 4/5 only after this review returns
updated: 2026-11-09T01:58Z
idle-runs: 0
note: Slice 1 (ignition cage, disk seam + reversed smoothstep masks, honest frame timing) on draft PR #47 branch sim/clarity-physics at 0039fe0aa6f527d33be11da83147929812eba9b7. pnpm check 125/125, test:pages 12x2; rendered dev-server check 1440x900 and 390x844 with 0 console/shader errors. test:browser fails at the pre-existing Save/Load wait (same on main). No real-GPU/iPhone run. Items 4–7 not started. No release approval.

# Simulator clarity and physics

Source: the 2026-11-09 "Simulator clarity and physics implementation handoff" section of [HANDOFF_PLAN.md](../../universes/HANDOFF_PLAN.md) (commit a2d2ba5). Units: 1 ignition cage, 2 disk shader correctness, 3 timing/masks (this slice); 4 disk readability/binary response, 5 graphics lighting, 6 mobile/quiet/Kids mode, 7 black-hole catalog and units (later slices).

## Slice 1 receipt (PR #47, 0039fe0aa6f527d33be11da83147929812eba9b7)

Changed files: src/visuals/effects.ts, src/visuals/disk-flow.ts, src/visuals/materials.ts, src/app/loop.ts, src/exhibit-runtime.ts, src/scene/quality.ts, src/main.ts, tests/exhibit-runtime.test.ts, tests/shader-correctness.test.ts (new).

- Item 1: `stellarIgnitionEffect` no longer creates any IcosahedronGeometry (the three shells, wireframe included, and the expanding fireball are removed). Fusion onset is now a contracting core glow that settles, plus a small particle puff and a halved screen flash. It is deliberately inward and small next to `supernovaEffect`. No forces were added.
- Item 2: `DISK_VERTEX` passes `varying vec2 vXY`. All 3 disk fragment interfaces declare it and call `diskFlow(atan(vXY.y,vXY.x), …)`. The Doppler orbit direction uses a local vertex angle as before. Outer masks: black hole `1.-smoothstep(.68,1.,r)`, protostar `(.72,1.)`, transfer `(.8,1.)`. The two-phase flow equations are unchanged.
- Item 3: `frameTiming(raw)` in exhibit-runtime.ts returns `measured` and `step`. `measured` is the uncapped finite time, set to null when the value is non-finite, ≤0 or >0.5 s. `step` is capped at 0.03 s. The loop samples the clock once and feeds `measured` to the FPS badge and adaptive quality, and `step` to physics, animation and transients. `bindFrameTimingReset()` is registered from main.ts and resets the PerformanceMonitor and adaptive-quality windows on visibilitychange. Vortex mask is now `1.-smoothstep(.12,.45,oval)` and jet mask `1.-smoothstep(.12,1.28,vEdge)`.

Checks:
- passed: `pnpm format`, `pnpm check` (build + 125/125 unit tests). New tests cover a real 0.1 s frame reading 10 FPS with a capped step, stall and non-finite handling, monitor reset, 3/3 matching disk varyings, no reversed smoothstep edges in disk-flow/materials, the seam arithmetic, and the absence of ignition geometry. `pnpm test:pages`: 12 pages × 2 viewports.
- passed (builder-run, rendered): dev server, Chromium with swiftshader, 1440×900 and 390×844. Scene: black hole with disk, gas giant, brown dwarf, ignition effect triggered directly. 0 console errors and 0 shader/WebGLProgram messages. The disk renders without a seam. Mobile FPS badge read 10–12 FPS on software GL (honest). A hide/show cycle raised no errors.
- failed (pre-existing): `pnpm test:browser` times out at the Save→Clear→Load wait (line 88). Unmodified main fails identically in this environment.
- not run: physical iPhone/Safari, real GPU, matched before/after clips, pause/>4x disk-motion clips.

## Known gaps

- Frames longer than 0.5 s are treated as interruptions. A device that truly renders below 2 FPS keeps its last FPS reading. Impact: low. Does not block review.
- Shader tests are source-level guards. GPU compilation was verified only on swiftshader.
- The old reversed smoothstep calls were undefined per GLSL but matched the new form on common drivers, so the visual change is expected to be small. The fix is for correctness and portability.

## History

- 2026-11-09T01:58Z Claude: picked up the 2026-11-09 handoff (HANDOFF_PLAN, commit a2d2ba5). Slice 1 (items 1–3) is built on draft PR #47 at 0039fe0aa6f527d33be11da83147929812eba9b7. Stage research-ready → implementation-review, owner claude → chatgpt.
