# Museum exhibit upgrade plan

## Phase 1 — Nebula physics and accretion feedback

- [x] Model a nebula as a broad density field with drag and gradual mass transfer.
- [x] Prevent a body from swallowing an entire cloud in one collision.
- [x] Make clouds move under gravity, merge, deform, shrink, and visibly feed nearby bodies.
- [x] Add visible gas streams, wakes, and accretion flashes.
- [x] Make mass-driven transformations cascade correctly when a large amount of material is gained.

Acceptance: a planet, star, or black hole can pass through a cloud; the cloud and object visibly influence one another over time; neither disappears without clear feedback.

## Phase 2 — Volumetric-looking space materials

- [x] Replace sprite-like nebula layers with depth-aware procedural cloud volumes.
- [x] Add richer star photospheres, temperature-driven coronae, and prominences.
- [x] Improve rocky terrain, oceans, ice, lava, clouds, and gas-giant band variety.
- [x] Upgrade black-hole lensing, photon ring, accretion disk, and inflow effects.

Acceptance: major object categories remain recognizable when labels are hidden and still render smoothly on modern mobile hardware.

## Phase 3 — Transformation and lifecycle clarity

- [x] Tie stellar appearance and lifecycle pacing to both mass and temperature.
- [x] Branch stellar outcomes into stable red-dwarf, white-dwarf, and supernova tracks.
- [x] Clarify protostar, brown-dwarf, gas-giant ignition, pulsar-collapse, and supernova thresholds.
- [x] Add a short transformation timeline and explain why each change occurred.
- [x] Balance spectacular flashes with accessibility and exposure controls.

Acceptance: every transformation has an understandable cause, a readable state change, and a distinctive visual event.

## Phase 4 — Exhibit presentation and reliability

- [x] Add curated one-tap scenarios and a resettable guided mode.
- [x] Add visual quality presets, reduced-motion support, and adaptive particle budgets.
- [x] Add deterministic tests for stellar tracks, habitability, and collision regimes.
- [x] Add automated browser interaction smoke tests.
- [x] Add kiosk/fullscreen affordances, idle demonstration behavior, and concise educational captions.
- [x] Add pinch zoom and two-finger pan for current mobile/tabletop browsers.

Acceptance: the exhibit can run unattended, recover cleanly, and remain understandable to a first-time visitor.

## Phase 5 — Current hardening pass

- [x] Split catalog, climate, runtime, and continuity logic out of the main renderer.
- [x] Add fixed-step catch-up limits and high-speed velocity safeguards.
- [x] Add automatic session recovery, installable PWA metadata, and offline shell caching.
- [x] Add exhibit, educational, and realistic pacing controls.
- [x] Add richer rocky-planet climate readouts and rotating attract-mode interpretation.
- [x] Add deterministic continuity/runtime tests and a desktop/mobile Playwright smoke test.

Future production work: source-map-guided bundle splitting, real-device thermal profiling, calibrated multi-channel audio, and a dedicated kiosk deployment profile.
