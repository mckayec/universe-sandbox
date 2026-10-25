# Project guidance

## Product goal

Build a polished, approachable science-museum exhibit for experimenting with celestial objects. Favor legibility, satisfying feedback, and stable interaction over strict numerical realism. Clearly describe the simulation as a simplified educational model.

## Stack

- Vite + TypeScript
- Three.js and Three.js example modules
- CSS and semantic HTML for the exhibit interface
- No backend is required for the core simulation

## Commands

- `pnpm dev -- --host 0.0.0.0` — development server
- `pnpm build` — type-check and production build
- `pnpm preview -- --host 0.0.0.0` — production preview
- `pnpm test` — unit tests (`node --test`)
- `pnpm format` — format all code with Prettier (run before committing)
- `pnpm check` — formatting check + build + tests

## Code organization

`src/main.ts` is only the entry point (startup and initial scene). Put new code in the module that owns it, not in `main.ts`:

- `src/state/` — `app-state.ts` (shared state: collections like `bodies`, plus the `app` object holding values that change, e.g. `app.speed`, `app.selectedBody`), `types.ts` (shared types), `history.ts` (save/load, undo/redo, snapshots).
- `src/scene/` — renderer, composer, camera, grid and overlays (`setup.ts`), camera moves, quality/lensing, cleanup.
- `src/visuals/` — how bodies look: `create-visual.ts` (one visual per body kind), materials, textures, jets, transient effects, per-frame `update-visuals.ts`.
- `src/physics/` — `simulate.ts` (one physics step), collisions, tidal interactions and disruption, matter streams, nebulae, stellar evolution, life.
- `src/bodies/` — creating, transforming and removing bodies; named groups.
- `src/builders/` — Solar System, binary/triple stars, galaxies, tidal scenarios, placement.
- `src/ui/` — page HTML (`template.ts`), toolbar and keyboard handlers, pointer/touch input, inspector panel, exhibits and universe packs, event feed and toasts.
- `src/app/loop.ts` — the animation loop.
- Pure, testable logic lives in top-level modules such as `simulation-model.ts`, `physics-continuity.ts`, `gravity-engine.ts`, `celestial-catalog.ts`; add tests for it in `tests/`.

Rules:

- Shared values that get reassigned must live on the `app` object in `src/state/app-state.ts` (write `app.speed = 2`, not a module-level `let`), so every module sees the same value.
- Only `ui/template.ts`, `scene/setup.ts` and `state/` may run code when imported; everything else should export functions. Event listeners are registered from `main.ts` via `bindPointerEvents()` / `bindToolbar()`.
- Keep code formatted: run `pnpm format`. Never write long single-line or minified code; split big functions instead.
- Keep files focused and roughly under 800 lines; create a new module rather than growing a large one.

## Implementation principles

- Keep the main playfield responsive on desktop and current iPhone/iPad browsers.
- Prefer procedural, GPU-friendly visuals and bounded particle counts.
- Preserve object identity, mass, locks, and velocity across transformations unless the transformation intentionally changes them.
- Keep physics timestep-aware and cap unstable impulses at high time speeds.
- Treat nebulae as extended, low-density media rather than solid spheres.
- Make every transformation explainable through the selected-object panel and visible effects.
- Keep UI labels compact enough that they never obscure the object being described.

## Validation

For each meaningful change:

1. Run `pnpm format`, then `pnpm check` (formatting, build and tests).
2. Load the app in a browser and check the console for runtime errors.
3. Exercise the changed interaction directly, including pause and accelerated time.
4. Check at both desktop and compact/mobile viewport sizes when UI or rendering changes.


## New universes (two-AI pipeline)

New atlases are researched by ChatGPT and built by Claude through `docs/universes/` (start with `PLAN.md`, `WORKFLOW.md` and `PROMPTS.md`). Each universe has `docs/universes/packs/<id>/status.md`; only act on a stage you own. Research/audit commits touch only `docs/universes/`.
