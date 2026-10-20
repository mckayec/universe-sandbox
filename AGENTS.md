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

1. Run `pnpm build`.
2. Load the app in a browser and check the console for runtime errors.
3. Exercise the changed interaction directly, including pause and accelerated time.
4. Check at both desktop and compact/mobile viewport sizes when UI or rendering changes.

