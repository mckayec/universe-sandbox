stage: ready
owner: claude
updated: 2026-10-27
note: Post-merge review of PR29 fdc0147 completed with changes required: DAG01 capture persistence and DAG02–DAG04 model wording/accounting. PR29 already merged as dfb7400; rendered/mobile/interactive acceptance remains unverified. See implementation-review.md and validation.md.

# Disks that orbit, slow accretion, and colliding galaxies

Mckay's requests (2026-10-26), in his words, summarized:
1. Accretion disks still wobble unrealistically and don't move the way real disks do.
2. Accretion of a star or nebula happens too suddenly; he'd like an exhibit showing slow accretion into a more massive body.
3. Galaxies aren't dense or massive enough; when two collide the stars should scatter in chaos, but the picture stays static until it blinks out when one core eats the other. More individual stars and bodies per galaxy.

Claude read request 2 as "a star or cloud being eaten slowly by a more massive body" and built the exhibit around a black hole. If Mckay meant star formation (a cloud slowly growing into a star), that is a follow-up.

## What changed (PR #29)

| Area | Change | Files |
|---|---|---|
| Disk motion | Keplerian differential rotation in the shader (two-phase flow), meshes no longer spin; all layers one plane and one sense; no vertex flapping; Doppler beaming in view space | `src/visuals/disk-flow.ts`, `src/visuals/materials.ts`, `src/visuals/create-visual.ts`, `src/visuals/update-visuals.ts` |
| Disk geometry | Jets on the disk axis; inflow clumps in the disk plane on Keplerian orbits; photon ring and lensed arcs face the viewer | same, `src/visuals/jets.ts` |
| Streams | Join the rim tangentially, orbit sense from the donor's angular momentum; black holes feed their own disk (no second, misaligned disk); transfer disks scale smoothly | `src/physics/matter-streams.ts` |
| Slow accretion | Star / brown dwarf / gas giant reaching a black hole or pulsar is captured and stripped over 8–42 s, then swallowed; momentum handed over at capture | `src/physics/infall.ts`, `collisions.ts`, `simulate.ts`, `tidal.ts`, `tidal-disruption.ts`, `nebula.ts` |
| Clouds | Black hole / pulsar cloud accretion slowed (≈1–2 min); no protostars form in clouds sheared by a compact object | `src/physics/nebula.ts`, `simulate.ts` |
| Exhibit | A Slow Feast | `src/exhibits.ts`, `src/ui/exhibit-flow.ts` |
| Galaxy density | 90k-star desktop budget (22k compact), 18 members (10 compact), 3 star-forming regions, bigger halos and extents; arms trail the rotation | `src/builders/galaxy.ts`, `src/galaxy-visuals.ts` |
| Galaxy dynamics | Halos pull on every galaxy; dynamical friction; softened cores; members of colliding galaxies feel each other's tides; stars of different galaxies pass through each other; cores only coalesce once slowed | `src/physics/galaxy-dynamics.ts`, `simulate.ts`, `src/bodies/galaxy-merger.ts` |
| Galaxy pictures | Disturbed galaxies "go live": every rendered star becomes a tracer orbiting all cores and halos; painted disk hands its light to a gas-haze layer; adaptive update stride (~5 ms/frame budget) | `src/galaxy-field.ts`, `src/visuals/galaxy-motion.ts` |
| Mergers | A swallowed core hands stars, halo and picture to the survivor (merger remnant) or to the black hole that ate it | `src/bodies/galaxy-merger.ts`, `collisions.ts`, `groups.ts`, `lifecycle.ts` |
| Exhibit | Collide Two Galaxies; a galaxy built near another is set on a bound, off-centre, prograde encounter | `src/exhibits.ts`, `src/ui/exhibit-flow.ts`, `src/builders/galaxy.ts` |

## Evidence (Claude)
- `pnpm check`: format, build, 75 unit tests (7 new: `tests/galaxy-field.test.ts`), check:dist — pass.
- `tests/exhibit-stability.mjs`: 20 scenes pass, including new `slow-feast` (star captured after 45 s, star and cloud fully accreted, hole mass > 1250) and `galaxy-collision` (merger happens, both pictures stay live, > 5% of stars in tails and shells). Galaxy member count assertion updated 11 → 18.
- `pnpm test:pages`: 12 pages × 2 viewports pass.
- `tests/browser-smoke.mjs` times out at line 88 (Save → Load count) in Claude's SwiftShader sandbox on unmodified `main` as well, so that failure is environmental.
- Deterministic runs: Slow Feast — cloud drains ~15–75 s, star captured ~64 s, swallowed ~88 s. Collide Two Galaxies — first pass ~55 s, cores merge ~108 s at 1×.
- Screenshots in `shots/` (SwiftShader software renderer, so bloom and colours are harsher than on a real GPU).

## Known limits
- Live tracer state isn't saved: undo/load rebuild galaxies as fresh pictures.
- Tracers are massless (classic restricted three-body model); dust lanes disappear once a galaxy goes live (the painted disk fades).
- Deleting a galaxy's black hole promotes its heaviest member star to core, and the halo follows that star.

## Your review (ChatGPT)
Review PR #29 at the exact head SHA above, per HANDOFF_PLAN.md. In particular:
1. Physics plausibility of the disk flow (Keplerian shear, trailing spirals, beaming fixed to the viewer) and of the encounter model (massless tracers, halo pulls on every galaxy, dynamical friction, merger only after slowing).
2. Educational wording: the two new exhibit objectives, event texts ("Slow accretion begins", "Galaxies merge", "A new galactic core"), and the claim that stars of colliding galaxies pass through each other.
3. Regressions: guided exhibits, the galaxy tour's Solar System, save/load, mobile budgets.
4. Anything you'd change before Mckay approves.

Write `implementation-review.md` in this folder ending with **"Approved as proposed"**, **"Approved with changes: …"** or **"Not approved: …"**, commit it (only this folder, to `main`), then set this header to `stage: ready`, `owner: claude`, today's date and a one-line note. Append a History line.

## History
- 2026-10-26: Claude implemented on PR #29 (head fdc0147) and handed the implementation review to ChatGPT.

- 2026-10-27: ChatGPT verified PR29 was already merged at dfb7400c03416ebafe988fbb0a3a828a29e434c8 (03:02:18 UTC). Completed bounded post-merge review of exact head fdc0147ff861f2f12c2773fdcb12d03cdbda70b6: 1 High and 3 Medium findings, verdict Not approved pending correction/acceptance. Local formatting/build/75 unit tests/110-file dist checks pass; remote exact-head CI40293179215 success. Browser/server/rendered/mobile checks not attempted under the existing restriction. Ready means review delivered to Claude for disposition, not release approval; no application edit, merge or deployment performed.
