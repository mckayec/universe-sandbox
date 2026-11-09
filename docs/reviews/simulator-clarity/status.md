stage: implementation
owner: claude
blocked-on: none
next-action: Claude continues slice 4b (protostar/transfer response, readability periods, orbiting/unequal/flyby/merger qualification) with SC4-E1 enforced evidence and SC4-O1 heuristic wording per implementation-review-ff480a5.md
updated: 2026-11-09T11:17Z
idle-runs: 0
note: SC4-T1 closed at exact PR47 ff480a5 at source/controller scope; independent repository tests 16/16 and reviewer cases 14/14 vs parent 8/14. Rendered acceptance, stale post-merger inspector, SC1-E1/SC4-E1/SC4-O1 and items 5–7 remain; no full technical or release approval.



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

## SC1-T1 / SC1-E1 fix receipt (PR #47, d9d5026a7d94ac22a1816c65dabb9217f823e071)

Diff vs reviewed head 0039fe0: 5 files — src/exhibit-runtime.ts, src/scene/quality.ts, src/app/loop.ts, src/state/app-state.ts, tests/exhibit-runtime.test.ts. Shader and ignition files are unchanged.

- SC1-T1: `MAX_MEASURED_FRAME` removed. `frameTiming(raw, interrupted)` returns `measured` for every finite positive delta, however long; `measured` is null only for non-finite/≤0 deltas or when `interrupted` is true. The interruption is explicit state: the `visibilitychange` listener resets the clock, both averaging windows, and sets `app.frameTimingInterrupted`, which the loop consumes for exactly one frame. `step` stays capped at 0.03 s.
- Adaptive-quality window logic moved unchanged (same 2.5 s window, 43/57.5 FPS thresholds, −0.08/+0.04 steps, 0.02 dead band) into pure `adaptiveQualitySample()` in exhibit-runtime.ts so it can be tested; `updateAdaptiveQuality` in quality.ts is now a thin wrapper. Note: the reviewer's vm-extraction script at 08958ed no longer applies to this head because the window logic moved; the new tests drive the real `frameTiming` + `PerformanceMonitor` + `adaptiveQualitySample` with the loop's `measured !== null` predicate.
- New regressions (tests/exhibit-runtime.test.ts): long 4 s frame is measured; explicit interruption drops one measurement but keeps the capped step; 20×0.6 s reads ≤2 FPS and lowers quality; 400 alternating 1/60 s and 0.6 s frames (3.24 FPS wall) read ≤4 FPS, never raise quality, scale falls; smooth 60 FPS raises quality; manual modes never change; interruption frame excluded while later slow frames still count; invalid deltas give null/0.

Checks at d9d5026: `pnpm format`; `pnpm check` passed (build, 130/130 unit tests, check:dist 113 files).

SC1-E1 evidence: [evidence-harness.mjs](evidence-harness.mjs) (run from the PR checkout after `pnpm build`; `CHROME_PATH` optional), raw output [evidence-d9d5026.jsonl](evidence-d9d5026.jsonl), screenshots in [shots/](shots/). Environment: production build via `vite preview`, headless Chromium 1243 with `--use-gl=swiftshader` (software GL, not a real GPU), 1440×900 and 390×844.

- 0 page/console errors and 0 shader/WebGL program messages at both sizes; 4 SwiftShader "Performance: GPU stall due to ReadPixels" driver notices at 1440×900, counted separately.
- Black hole placed by user interaction (palette click + playfield click) at 1440×900; disk renders without a seam (shots/blackhole-1440x900.png). At 390×844 the tool palette starts collapsed, so no black hole was placed there (placedByUi false); that screenshot shows the default scene.
- Pause froze mission time for 2 s at both sizes; 10× advanced mission time. At 1440×900 software GL runs at ~4–8 FPS, so with the 0.03 s step cap simulation runs well below real time (resume over 2 s did not tick the whole-second clock). That is the existing cap behaviour, now visible honestly.
- Slow foreground (CDP CPU throttle ×20): badge fell 6→4 FPS (desktop) and 15→3 FPS (mobile size), then recovered; it never reported a fast reading.
- Hide 3 s / show (visibilityState override + event): post-show badge trace 8,8,7,8 / 20,21,21,19 FPS — the hidden interval did not appear as a slow frame.
- Ignition was not triggered in this harness (item 1 remains accepted at source scope only).
- Not run: real GPU, physical iPhone/Safari, matched before/after clips, video of disk motion. `pnpm test:browser` Save→Clear→Load timeout is pre-existing and was not re-run.

## Slice 4a receipt — black-hole disk companion tide (PR #47, c4214ef818d78d78f62efb8c69fa68751b3f272a)

Parent d9d5026. Changed files: src/disk-encounter.ts (new, pure), src/visuals/disk-encounters.ts (new), src/visuals/disk-flow.ts, src/visuals/materials.ts, src/visuals/update-visuals.ts, src/ui/inspector.ts, src/ui/template.ts, tests/disk-encounter.test.ts (new).

- Model (labelled approximation, not hydrodynamics/GRMHD): Eggleton (1983) Roche-lobe fraction × 0.8 tidal-truncation rule of thumb, computed in the disk's local frame from the companion position (3D separation), host mass and companion mass. Strength 0 when the estimated truncation radius is beyond the outer dust edge, so distant disks stay unchanged. Companions lighter than 2% of the host, nebulae and debris are ignored. Strongest companion wins.
- Encounter state eases on the capped disk step (or frame time when paused): stripping rate 2.2/s, recovery 0.55/s, angle follows the companion along the short arc across ±π. When the companion no longer exists (merger/removal) the state resets, so a merged disk starts undisturbed; no explosion is added.
- Shader (black-hole disk, all 3 layers share one local cut): `DISK_TIDE_GLSL.tideShape` cuts gas past a companion-aligned m=2 bulge, adds two companion-locked arms near the cut, and keeps a thin streamer past the cut on the companion side only. The Doppler highlight stays view-space and the gas pattern keeps its phase and plane; meshes are not rotated or scaled.
- Inflow clumps (52/108) beyond the cut are pulled outward on the companion side (escape/transfer illustration) and re-enter inside the cut elsewhere.
- Inspector: black holes show a Disk row — "Undisturbed" or e.g. "Truncated by Void 01: outer gas cut to 66% (tidal estimate)".

Checks at c4214ef:
- passed: `pnpm format`; `pnpm check` (build, 143/143 unit tests incl. 13 new in tests/disk-encounter.test.ts, check:dist 113 files). New tests: Eggleton reference value, distant = quiet, equal-mass close cut matches formula, monotonic with distance, unequal masses, out-of-plane uses 3D separation, bounded cut and invalid inputs, strongest selection, timestep-consistent relaxation without overshoot, slower recovery, seam-crossing angle, inspector wording, shader wiring.
- passed (builder-run, rendered): [evidence-harness-4a.mjs](evidence-harness-4a.mjs), raw [evidence-c4214ef.jsonl](evidence-c4214ef.jsonl). Production build via vite preview, headless Chromium + SwiftShader, scene cleared, two black holes placed by palette + playfield clicks while paused. 1440×900 close (150 px): isolated "Undisturbed" → paired "Truncated … 66%" → 10× "Strongly truncated … 33%", then merged. 1440×900 wide (700 px): "Undisturbed" → "Perturbed … 89%" → 10× infall "Strongly truncated … 53%". 390×844 close (90 px): "Undisturbed" → "Strongly truncated … 49%" → merged. 0 page/console errors, 0 shader/WebGL program messages in all three runs. Screenshots: [close 1440](shots/sc4a-pair-close-1440x900.jpg), [wide 10× 1440](shots/sc4a-pair-wide-1440x900-10x.jpg) (both disks cut, streamer between them), [merged 390](shots/sc4a-pair-close-390x844-10x.jpg) (merged disk full and undisturbed).
- passed: `pnpm test:pages` (12 pages × 2 viewports) at c4214ef.
- not run: real GPU, physical iPhone/Safari, matched before/after video clips, orbiting equal/unequal binaries and flybys with initial velocity (both harness pairs start at rest), `pnpm test:browser` (pre-existing Save→Clear→Load timeout).

Known gaps (4a):
- After a merger the inspector can keep showing the removed body (stale selection; pre-existing behaviour). In the 1440 close run it still read "Void 02 … truncated by Void 01" while the surviving Void 01's disk rendered undisturbed. Impact: low/medium (explainability). Does not block 4a review; candidate for item 6.
- Protostar and transfer disks do not respond yet; only black-hole disks. Planned 4b.
- Readability periods (outer-edge 25–186 visual s, 4× visual cap) unchanged. Planned 4b.
- Truncation uses model masses in legacy units; consistent within a scene, not physical. Coordinate with item 7.

## SC4-T1 fix receipt (PR #47, ff480a5a388feb1e46549b358f633ec55c733d77)

Diff vs reviewed head c4214ef: 3 files — src/disk-encounter.ts, src/visuals/disk-encounters.ts, tests/disk-encounter.test.ts (+115/−16). No shader, inspector or template change.

- `DiskEncounter` gains optional `depth` (unclamped truncation radius / outer radius; smaller = deeper) and optional `companionId`. `diskEncounter()` sets `depth`; strength, cut and angle are unchanged.
- New pure `outranks(candidate, best)` is the single rule for both paths: an active encounter beats a quiet one; otherwise smaller `depth` wins (falls back to `cut` if `depth` is absent); on an exact tie the smaller companion ID wins, and without IDs the earlier encounter is kept.
- `strongestEncounter()` (helper) and `targetEncounter()` (runtime selector) both use `outranks`; the runtime attaches `companionId` before ranking, so ID and angle travel with the chosen encounter. No candidate returns a fresh quiet state with no ID.
- Regressions (tests/disk-encounter.test.ts): reviewer fixture (outer 10, equal masses, companions at (12,0,0) and (0,9,0), both strength 1) picks cut .2728 in both orders for the helper; two companions below the .25 cut floor are still separated by depth in both orders; exact-tie ID rule in both orders and no-ID earlier-wins; actual runtime selector extracted from source with identity-transform stubs returns cut .2728, companion ID 3 and angle π/2 in both orders, and quiet/no ID with no companions.

Checks at ff480a5: `pnpm format`; `pnpm check` passed (build, 146/146 unit tests, check:dist 113 files); `node --test tests/disk-encounter.test.ts` 16/16; `pnpm test:pages` 12 pages × 2 viewports. Negative control: the reviewer's repro at c4214ef (2/4 fail) stands; the new test file against the c4214ef sources fails (it imports `outranks`, which did not exist). Note for re-running the reviewer repro at this head: its `new Function` must also pass `outranks`.
Not run this return: browser/GPU scenes (no visual change), SC4-E1 enforced harness (deferred to 4b as allowed), physical devices.

## Known gaps

- A debugger or OS pause without a visibility change is measured as one long frame and briefly lowers the FPS reading. Impact: low (honest, self-correcting next window). Does not block review.
- Shader tests are source-level guards. GPU compilation was verified only on swiftshader.
- The old reversed smoothstep calls were undefined per GLSL but matched the new form on common drivers, so the visual change is expected to be small. The fix is for correctness and portability.

## History

- 2026-11-09T01:58Z Claude: picked up the 2026-11-09 handoff (HANDOFF_PLAN, commit a2d2ba5). Slice 1 (items 1–3) is built on draft PR #47 at 0039fe0aa6f527d33be11da83147929812eba9b7. Stage research-ready → implementation-review, owner claude → chatgpt.

- 2026-11-09T02:23Z ChatGPT: [implementation-review-0039fe0.md](implementation-review-0039fe0.md) saved/read back at ed3f9b97e0ab68939a69ded7e4ebf03bd979cda0; [reproduction](reviewer-timing-0039fe0.mjs) at 08958ed8e79fa1acb432670570cdd237c3dc4b32. Exact head 0039fe0aa6f527d33be11da83147929812eba9b7. 9/9 changed files read; 5/5 shader source/math tests pass; 3/3 independent timing trace outcomes reproduced. SC1-T1 Medium requires correction: rejecting every >0.5-second frame can produce 60 FPS and quality increase during actual 3.243-FPS foreground behavior. SC1-E1 Low evidence gap: attach raw reproducible rendered results; builder reports are not independent GPU validation. Items 1–2 accepted only at source scope, item 3 not complete; items 4–7 remain separate. implementation-review/chatgpt -> fixing/claude. No app/PR-branch edit, merge, deployment or release approval.

- 2026-11-09T03:58Z Claude: fixed SC1-T1 and supplied SC1-E1 evidence on PR #47 at d9d5026a7d94ac22a1816c65dabb9217f823e071 (see fix receipt). fixing/claude → implementation-review/chatgpt. Items 4–7 not started. No merge.

- 2026-11-09T04:16Z ChatGPT: saved and verified implementation-review-d9d5026.md (cfcde1c354e3b1208dceb76f089803d6eeba6ac8) and reviewer reproduction (4057ae1de5bda763f5302772840d4e9f4e37110e). Exact PR47 head d9d5026a7d94ac22a1816c65dabb9217f823e071: SC1-T1 closed; mixed 3.243-FPS trace reports 3 and lowers scale to .62. 10/10 focused tests, 3/3 trace expectations, 1/1 visibility-listener stub pass; no independent browser execution. SC1-E1 raw delivery satisfied, rendered acceptance partial (compact placement skipped, synthetic hide/show, logging-only behavior checks). implementation-review/chatgpt -> implementation/claude for next bounded item 4 with final technical gaps preserved. No merge/deploy/release approval.

- 2026-11-09T10:20Z Claude: item 4 split into bounded slices; slice 4a (black-hole disk companion tide) built on PR #47 at c4214ef818d78d78f62efb8c69fa68751b3f272a (see 4a receipt). implementation/claude → implementation-review/chatgpt. 4b and items 5–7 not started. No merge.

- 2026-11-09T10:20Z ChatGPT: [implementation-review-c4214ef.md](implementation-review-c4214ef.md) saved/read back at a07238fc0bbb4b0779194f26c0d47ea99cfb1d68; [reproduction](reviewer-encounter-c4214ef.mjs) at f3a3a1136175151a2b18eae95957b7d7d4375348. Exact PR47 c4214ef818d78d78f62efb8c69fa68751b3f272a, 8/8-file delta inspected, 13/13 repository tests pass independently. Additional actual-helper/extracted-controller cases 2/4 pass, 2/4 fail: SC4-T1 Medium, strength saturation makes selection depend on body order instead of deeper cut. SC4-E1 Low retains logging-only browser limitations; SC4-O1 qualifies physical model heuristics using two opened primary research sources. 0 independent rendered cases, 0/3 screenshots inspected; 3/3 builder scenario records read. implementation-review/chatgpt → fixing/claude for bounded selection correction; prior timing closure preserved. No application/PR-branch edit, merge, deployment or release approval.

- 2026-11-09T10:52Z Claude: SC4-T1 fixed on PR #47 at ff480a5a388feb1e46549b358f633ec55c733d77 (see SC4-T1 fix receipt): shared `outranks` depth ranking with deterministic ID tie-break in helper and runtime; both-order regressions; 146/146 unit, pages 24/24. SC4-E1, SC4-O1 carried to 4b. fixing/claude → implementation-review/chatgpt. No merge.

- 2026-11-09T11:17Z ChatGPT: [implementation-review-ff480a5.md](implementation-review-ff480a5.md) saved/read back at 907abad56580accd5002e04d0b6a2fe762c3dbdf; [compatible head/parent runner](reviewer-encounter-ff480a5.mjs) at e194bebcc98157ddf4a4214e7c96c539a48c2b76. Exact PR47 ff480a5a388feb1e46549b358f633ec55c733d77, 3/3 changed files reviewed; independent repository tests 16/16, helper/runtime cases 14/14 head vs 8/14 parent (six behavioral failures, not missing-import failure). SC4-T1 closed within source/controller scope; no new High/Medium finding. 0 independent rendered cases; SC4-E1/SC1-E1, SC4-O1 and stale merger inspector remain visible. implementation-review/chatgpt → implementation/claude for bounded 4b continuation; items 5–7 unfinished. No application/PR-branch edit, merge, deployment or release approval.
