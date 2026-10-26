# Universe Sandbox

An interactive, museum-style astrophysics sandbox built with Vite, TypeScript, and Three.js. Place and fling celestial bodies, experiment with simplified gravity and accretion, create orbital systems, and watch deliberately accelerated stellar evolution.

## Current exhibit features

- Pan, zoom, drag, fling, lock, build-lock, and orbit interactions
- Simplified N-body gravity, collisions, accretion, orbital trails, and close-approach tidal stripping
- Asteroids, comets, moons, dwarf and rocky planets, gas giants, brown dwarfs, stars, pulsars, black holes, nebulae, and protostars
- One-click solar-system, binary-star, and galaxy builders with named-structure navigation
- Local save/load, automatic crash recovery, plus undo/redo for construction, dragging, locking, orbit assignment, conversion, removal, gravity changes, and clear-all
- Optional orbit, velocity, Hill-sphere, Roche-lobe, and barycenter overlays
- Barnes-Hut gravity and spatially hashed collision candidates for larger scenes
- Simplified stellar evolution and mass-driven object transformations
- Mass-dependent stellar tracks: stable red dwarfs, Sun-like white-dwarf endings, and massive supernova paths
- Grazing encounters, atmospheric stripping, rocky fragmentation, and persistent collision debris
- Roche-limit tidal disruption: moons, planets, and gas giants that pass too close to a massive body stretch, then shear into debris streams (gas giants lose their envelopes and leave a bare core)
- Habitability influenced by planet type, simulated surface temperature, atmosphere retention, water, magnetic shielding, stellar stability, radiation, and recent impacts
- Guided “Build a Star,” “Create a Living World,” “Dance of Two Suns,” “Feed a Black Hole,” collision-laboratory, Tidal Disruption Lab, galaxy, and “The Fall of Gododdin” (a Sun Eater scenario: worldships drop out of warp on the fleet and tear the planet apart) exhibits
- Pinch zoom, two-finger pan, long-press object controls, fullscreen presentation, and an idle demonstration mode
- Continuous nebula/plasma transfer streams tied to actual mass exchange
- Bloom, procedural materials, particle effects, accretion disks, pulsar beams, and asymmetric supernova blast effects
- Doppler-brightened black-hole disks, screen-space lensing, planetary day/night shading, and ocean-world night lights
- Procedural exhibit sound, optional haptics, adaptive quality scaling, gentle-effects mode, and expandable event history
- Object labels, contextual controls, lifecycle information, and time controls
- Exhibit, educational, and slower realistic pacing presets
- Installable PWA shell for a more kiosk-like standalone experience

The simulation is designed for playful exploration. Its distances, masses, timescales, and transformations are intentionally compressed and are not a precision astrophysics model.

## Run locally

Install a current Node.js release, then run:

```bash
pnpm install
pnpm dev -- --host 0.0.0.0
```

Open the local address printed by Vite. Other devices on the same network can use the Network address while the development server is running and the computer firewall permits it.

Create a production build with:

```bash
pnpm build
```

Run the deterministic simulation-model checks with:

```bash
pnpm test
```

After building, run the automated desktop/mobile browser smoke test with:

```bash
pnpm test:browser
```

## Publish with GitHub Pages

The repository includes a GitHub Pages workflow. Pushing the `main` branch builds the Vite app and publishes `dist`. In the GitHub repository settings, choose **GitHub Actions** as the Pages source. Future pushes to `main` redeploy automatically.

## Development roadmap

See [PLANS.md](./PLANS.md) for the staged path from the current prototype to a polished museum exhibit.
