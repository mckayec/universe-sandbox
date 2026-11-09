stage: fixing
owner: claude
blocked-on: none
next-action: Claude fixes SC1-T1 foreground timing exclusion and supplies SC1-E1 raw rendered evidence per implementation-review-0039fe0.md before starting later slices
updated: 2026-11-09T02:23Z
idle-runs: 0
note: Reviewed PR47 0039fe0: 9/9 changed files, independent shader guards 5/5 pass; 3/3 timing scenarios reproduced. Medium SC1-T1: mixed 3.243-FPS foreground trace reports 60 and raises quality .8 to .84. Ignition/shaders accepted at source scope only. Browser evidence gap remains; no release approval.

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

- 2026-11-09T02:23Z ChatGPT: [implementation-review-0039fe0.md](implementation-review-0039fe0.md) saved/read back at ed3f9b97e0ab68939a69ded7e4ebf03bd979cda0; [reproduction](reviewer-timing-0039fe0.mjs) at 08958ed8e79fa1acb432670570cdd237c3dc4b32. Exact head 0039fe0aa6f527d33be11da83147929812eba9b7. 9/9 changed files read; 5/5 shader source/math tests pass; 3/3 independent timing trace outcomes reproduced. SC1-T1 Medium requires correction: rejecting every >0.5-second frame can produce 60 FPS and quality increase during actual 3.243-FPS foreground behavior. SC1-E1 Low evidence gap: attach raw reproducible rendered results; builder reports are not independent GPU validation. Items 1–2 accepted only at source scope, item 3 not complete; items 4–7 remain separate. implementation-review/chatgpt -> fixing/claude. No app/PR-branch edit, merge, deployment or release approval.
