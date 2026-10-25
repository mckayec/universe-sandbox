# Handoff: finishing the site-audit fixes (Claude → Codex)

Claude ran a five-part audit of the live site and started four fix streams, but hit its usage limit before they finished. Codex takes over. Everything needed is here.

## Audit reports (the spec)
| File | Area | Finding IDs |
|---|---|---|
| `physics.md` | Sandbox physics, exhibits, presets, save/undo | P1–P21 |
| `visuals.md` | Sandbox rendering, UI, mobile layout, memory, accessibility | V1–V13 (+ suspected S1–S5) |
| `atlas.md` | Atlas engine and the six book packs (code, not lore) | A1–A15 |
| `standalone.md` | Society/Solar/Nearby Worlds/Powers of Ten pages, service worker, CI, exoplanet data | S1–S15 |
| `atlas-validate.js` | Node script that validates pack cross-references | — |

Lore/book accuracy is a separate ChatGPT review in `docs/reviews/lore-corrections/`. Don't fix lore inside these branches.

## Work in progress (unfinished, UNTESTED snapshots)
Each branch is one commit on top of `main` at 667673f, containing Claude's partial edits at the moment it stopped:

| Branch | Scope (files it owns) | What it was fixing |
|---|---|---|
| `wip/audit-phys` | `src/physics/*`, `src/bodies/*`, `src/builders/*`, `src/state/*`, `src/ui/exhibit-flow.ts`, `src/exhibits.ts`, `src/exhibit-runtime.ts`, pure modules, `tests/*.test.ts` | P1–P14 (+P15/16/19/20/21 if cheap): every exhibit/preset stays intact 3 min unattended (anchor stars `holdStage`, Living World moon kinematic via `satelliteHostId` + giant moved out, galaxy tour Solar System given bulk orbital velocity, galaxy members as an exhibit system via `exhibitSystemId`), Barnes–Hut honoring exhibit rules, debris/strain state cleared and saved, collision eater by mass, tidal-event rate limit, fragmentation momentum; plus an exhibit stability test harness |
| `wip/audit-ui` | `src/visuals/*`, `src/scene/*`, `src/ui/{pointer,feed,toolbar,inspector,controls,template}.ts`, `src/style.css`, `src/app/loop.ts`, `src/nebula-hd.ts`, `src/galaxy-visuals.ts`, `src/main.ts`, `index.html` | V1–V13 + S1/S2/S3/S5: dispose CSS2D labels, plain click keeps velocity, attract mode snapshots/restores and no autosave during it, mobile/tablet layout (buttons reachable, compact inspector, collapsible panel, min font size, toolbar scroll cue, safe-area/dvh), horizon depth, real quality scaling, nebula texture cache cap, cached glow textures, per-frame allocations, Escape behavior, dialog accessibility, reduced motion |
| `wip/audit-atlas` | `public/atlas/*`, `public/powers/*`, `public/sw.js`, `public/manifest.webmanifest`, icons, `.github/workflows/*`, `package.json` scripts, new tests, `src/universe-packs.ts` (pack list only) | A1–A14 + S1–S3, S7–S12, S14: back links everywhere, vendored three.js r128 + OrbitControls in `public/vendor/` (no CDNs), self-hosted fonts (no Google Fonts), remove missing `atlas/tex/` requests and give Solar procedural planet looks, header overflow, URL state + spoiler-safe reload, mobile map sizes, context-loss overlay, versioned service-worker cache, CI browser test of every page under the `/universe-sandbox/` subpath and a no-third-party-requests check, `cancel-in-progress: false`, fan-work notices, Star Wars eyebrow → "Planned fan pack", move PACK_FORMAT.md to docs/ |
| `wip/audit-data` | `public/exoplanets/data/*`, `public/exoplanets/js/app.js` (labels only), `tools/`, new tests | S4–S6, S13: radius "measured" only for transiting/imaged planets (≈ otherwise), minimum masses labeled "≥", brown dwarfs >13 MJ, fix 51 Peg b / GJ 1214 / HD 189733 distances and LTT 1445 A c / HIP 12961 b orbits, ship one data copy, reproducible build script from the NASA Exoplanet Archive, data tests. Barely started. |

**Note on `wip/audit-atlas`:** the large deletion count may come from splitting `society.html`/`solar.html` into separate files or moving docs. Check carefully that nothing was lost before building on it.

## How to finish (Codex)
For each branch, in this order: `wip/audit-data` and `wip/audit-phys` (independent), then `wip/audit-ui`, then `wip/audit-atlas`:
1. Check out the WIP branch into a new branch `fix/audit-<area>`; review the diff against the matching audit report; finish what's missing; discard anything half-done that you can't finish safely.
2. Follow AGENTS.md: run `pnpm format`, then `pnpm check`, then the browser smoke test `pnpm test:browser`. Load the app and check for console errors; test the changed interactions on desktop and phone sizes.
3. Open one pull request per area, listing per finding: fixed / partially / not fixed and why. **Do not merge.** Mckay approves; Claude reviews when its usage resets.
4. The branches touch different files, but rebase each onto the latest `main` before opening its PR.

## After these merge
- Claude applies `docs/reviews/lore-corrections/corrections.md` (once ChatGPT finishes it) and the Vite update (once ChatGPT approves `docs/reviews/vite-upgrade/`).
