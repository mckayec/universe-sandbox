# Gravity Lab: simulation logic and state audit

Scope: `src/physics/*`, `src/bodies/*`, `src/builders/*`, `src/state/*`, `src/app/loop.ts` and the pure modules, at `audit` = main `667673f`. I also read the exhibit setup code in `src/ui/exhibit-flow.ts`, because that is where the guided exhibits are built.

How I checked things:
- `pnpm test` passes 29 of 29.
- For runtime checks I built a copy at `/home/claude/audit/physics/repo` with a `window.__dbg` export, plus timing instrumentation in `simulate.ts`. I previewed it on port 4185 and drove it headless with Python Playwright and swiftshader.
- Most runs were deterministic: load an exhibit or builder, pause the loop, then call `simulate(1/60)` N times. The scripts are `/home/claude/audit/physics/t1.js` through `t10.js`, with outputs in `t1.out`, `t3.out`, `t4.out` and `t5.out`.
- The original repo was not modified.

---

## Confirmed

### P1: High. "Create a Living World" destroys itself within 20 s with no user input
`src/ui/exhibit-flow.ts:58-80`
- **What happens:**
  - The ocean planet sits at r=12 around a 210 star. It has a moon at 2.4 units and a 34-mass gas giant at r=28.
  - The moon is 0.8 of the planet's Hill radius (R_H ≈ 3.0). The giant's Hill radius is about 10.6, so the planet is only about 1.5 Hill radii from it. The system is chaotic.
  - The planet drifts outward (r 12 → 16 by t=13 s), grazes the giant at t≈17 s (separation 2.2) and is flung out (r≈83 by t=40 s).
  - Life goes from microbial to "Biosphere collapse: recovering from a major impact".
  - The star also has no `holdStage`. It becomes a giant at about 75 s and a white dwarf by about 125 s (seen at t=240), which moves the habitable zone.
- **How I confirmed it:** `t2.js` logs the planet radius every 0.5 s. `t5.js` removes bodies one at a time:

  | Bodies present | Planet radius range | Life reached |
  |---|---|---|
  | all four | 12–57 | none |
  | without the moon | 11.8–31.8 | microbial |
  | without the giant | 12–14.4 | simple |
  | star and planet only | 12.0–12.0 | complex |
- **Fix:**
  - Make the moon a kinematic satellite, as the Solar System does (`satelliteHostId = planet.id`, `satelliteOrbit = 2.4`, `satelliteRate ≈ 1.1`).
  - Move the giant to r ≥ 45 or cut its mass to about 10.
  - Set `holdStage = true` on the star, or give the whole set an `exhibitSystemId` so star and planets are anchored as in `createSolarSystem`.

### P2: High. "Build a Galaxy" tour: the Solar System falls straight into the central black hole and is eaten about 100 s in
`src/ui/exhibit-flow.ts:144-147`, `src/builders/systems.ts:15-113`
- **What happens:**
  - `createSolarSystem(125,0,45)` is placed with zero bulk velocity. `findOpenPlacement` puts it 420 units from a 9600-mass black hole.
  - The Solar System is not a galaxy member, so it gets no halo support. It also gets no tangential velocity, so it free-falls radially. The expected time is about (π/2)·√(r³/2GM) ≈ 95 s, which matches.
- **How I confirmed it:** `t4.js` "tour". Distance from Sun to black hole: 420 → 329 (45 s) → 164 (75 s) → 0.3 (90 s). The Sun is gone at 105 s and 2 of 11 members survive.
- **Fix:**
  - Give every Solar System body a common bulk velocity equal to the circular speed around the anchor at that radius: `sqrt(G·g·(M_bh + enclosedHalo(r)) / r)`, tangential.
  - Add the bodies to halo gravity, or simply lock the Sun. Locking works because the Sun is anchored and its planets do not pull on it.

### P3: High. "Feed a Black Hole" spams the event feed, toasts and audio about 6.5 times a second
`src/physics/tidal.ts:107-125`
- **What happens:**
  - Terra 04 is the tidal donor in two pairs at once: Void 01 and Helios 03.
  - `donor.tidalPartnerId` flips between the two receivers on every step, and every flip fires `museumEvent`. That means a feed entry, a toast, `audio.play('accretion')` and an inspector refresh each time.
- **How I confirmed it:** `t9.js` wraps `exhibitEvents.unshift`. In 60 s of Feed a Black Hole there were 394 events: 197 "Tidal stream" and 196 "Mass transfer begins". Habitable World produced 9 and Tidal Lab 8.
- **Fix:**
  - Key the "new partner" check per pair. Keep a module `Map<string, number>` of `${donor.id}>${receiver.id}` → last-announced `app.elapsed`, announce only when an entry is absent or more than about 5 s stale, and prune it like `activeDonors`.
  - Alternatively keep `tidalPartnerIds: Set<number>` on the body.

### P4: High. Above 64 bodies the Barnes–Hut path drops every preset gravity rule, so the Solar System falls apart
`src/physics/simulate.ts:55-63` (compare the pairwise path at :69-70 and :78-79)
- **What happens:**
  - The pairwise path skips mutual gravity between members of the same exhibit system. It also gives the anchor star zero response (`aResponse = 0`).
  - `barnesHutAccelerations` knows nothing about `exhibitSystemId`. Once there are 65 bodies, the Sun is tugged around and the planets perturb each other.
  - Softening also changes discontinuously at the threshold. The pairwise path uses `max(d²+nebulaExt, (ra+rb)²·0.35)`. The Barnes–Hut path uses `max(d²+(sa+sb)², ra²·0.35)` with s = 0.42r. So the dynamics of every scene jump when the 65th body appears.
  - Tidal Lab alone creates about 40 bodies, and a galaxy plus a Solar System is 25, so crossing 64 is easy.
- **How I confirmed it:** `t3.js`. A Solar System alone for 30 s: the Sun stays at (0,0,0) and all orbits are exact. The same system plus 60 distant locked asteroids: the Sun drifts to (4.0,-3.4) at v=0.36, and Earth, Mars and the Moon are gone (Saturn's distance to the Sun is 13.8 instead of 32.5).
- **Fix:**
  - Compute exhibit-system members separately: exclude same-system non-star pairs from the tree, and set the anchor star's `responseFactor` to 0 for in-system sources. The simplest version is a pairwise correction pass over each exhibit system, subtracting the in-system contributions Barnes–Hut added.
  - Use one softening formula in both paths.

### P5: High. Planetary fragmentation does not conserve momentum; the surviving planet keeps its full pre-impact velocity
`src/physics/collisions.ts:44-87`
- **What happens:**
  - `fragmentCollision` computes `debrisVelocity`, the centre-of-mass velocity, but never assigns it to `remnant`.
  - The fragment (one piece when `ejected < 10`) gets that velocity plus a random-direction kick of 2.4 + 0.18·v with nothing to balance it.
  - In the Collision Lab head-on impact, one planet carries on at 7 u/s as if nothing had happened.
- **How I confirmed it:** `t3.js`, Collision Lab. Total momentum is (0,0) before. Three seconds later it is (−93.1, 39.2). The remnant (Terra 02, 15.4 mass) moves at 7.06; the fragment (8.6 mass) moves at 4.37.
- **Fix:**
  - Set `remnant.velocity.copy(debrisVelocity)`.
  - Give the pieces symmetric kicks, or apply recoil: `remnant.velocity.addScaledVector(kickSum, -1/remnant.mass)`, where `kickSum = Σ pieceMass·kick`.
  - Add a node test of momentum conservation using a pure helper.

### P6: High. Tidal-debris IDs are never cleared, and IDs restart at 1 on reset, so later bodies inherit "debris" status and lose their labels
`src/physics/tidal-disruption.ts:18-22`, `src/state/history.ts:28-57`, `src/bodies/lifecycle.ts:79`, `src/app/loop.ts:94`
- **What happens:**
  - `debrisIds`, `tidalStrain` and `tidalWarned` are module-level. `resetSimulation` and `removeBody` never clear them, and `app.nextId` resets to 1.
  - After any tidal disruption, the next exhibit's bodies that reuse those IDs are treated as debris:
    - Their labels are never shown (only the selected body's label appears).
    - Pairs of them get 30 s of collision immunity.
    - Their tidal events are suppressed (`tidal.ts:123`).
  - Stale strain and the "warned" flag carry over too.
  - Within one session `debrisIds` grows without bound.
- **How I confirmed it:** `t4.js`. Run Tidal Lab for 10 s, then load the galaxy tour. IDs 9–24, which include the Sun, Mercury through Neptune and the Moon, all have `label.visible === false`. IDs 1–8 are visible. In `t3.js`, `tidalStrain` still held `[3, 0.708]` after body 3 had been removed; in the next exhibit, ID 3 is Luna 03.
- **Fix:**
  - Clear all three in `resetSimulation`, and delete the entries in `removeBody`.
  - Better: make debris a body flag (`b.debris = true`) so it travels with the body and round-trips through snapshots.

### P7: High. Galaxy presets fall apart: nebulae are clamped to 1.35 u/s and fall into the core, and most stars are lost within 3 minutes
`src/physics/simulate.ts:94`, `src/builders/galaxy.ts:71-92`
- **What happens:**
  - Star-forming clouds are launched at 0.52× circular speed (7.6 and 6.1 u/s). After one step `capPlanarVelocity(…, 1.35)` cuts them to 1.35, so they fall inward: cloud radius 58 → 13 by 30 s, gone by 40 s, drained into the black hole and passing stars.
  - On the way the clouds feed the stars. Members cross track thresholds (sun-like at 240, massive at 320), then go giant, hypergiant and supernova.
  - Members also pull on and tidally strip each other, since there are no exhibit exemptions.
- **How I confirmed it:** `t4.js` and `t8.js`. A spiral galaxy alone had 11 stars and 2 clouds at t=0; 6 stars and 0 clouds at 60 s; 2 stars at 180 s. Events along the way: Common envelope, Supernova, Tidal stream. Removing the clouds at t=0 still leaves only 4 of 11 stars at 180 s (`t9.js`).
- **Fix:**
  - Cap nebula speed relative to the host galaxy anchor's velocity, or raise the cap for galaxy members to about 20.
  - Treat galaxy members as tracers. Skip member–member pairwise gravity and `tidalPair` within the same galaxy group (a `groupKind === 'galaxy'` check), keeping the black hole and halo pull.
  - Optionally set `holdStage` on members.

### P8: Medium. Galaxy star stages don't match their masses, so "blue"/"white"/"yellow" members quietly change type and keep misleading names
`src/builders/galaxy.ts:49-54, 61`
- **What happens:**
  - Stages cycle red/yellow/white/blue while masses cycle 105/145/185/225.
  - The only match is red at 105. Yellow at 145 is on the low-mass track, white at 185 and blue at 225 are on the sun-like track.
  - `nextStellarStep` (`simulation-model.ts:59`) moves each off-track star to its track's birth stage after one stage duration. So "blue member 8" becomes a yellow star and "yellow member 2" a red dwarf, and their names stay as they were.
  - Elliptical and globular: "yellow" members are 105, which is low-mass. The globular core is a red dwarf at 190, which is sun-like.
- **How I confirmed it:** `t4.js` and `t8.js` logs show `b225 → yellow`, `yellow member 2 … red dwarf`, and the event "Spectral shift begins".
- **Fix:** Use masses that match the labels (red 120, yellow 210, white 270, blue 360), or derive `stage = stellarBirthStage(mass)`. Add a unit test asserting that every builder's stage equals `stellarBirthStage(mass)`.

### P9: Medium. Binary and Triple presets don't behave as described
`src/builders/systems.ts:114-154, 155-219`
- **Binary ("Dance of Two Suns"):**
  - The objective says to "accelerate time until mass transfer begins". In fact the 12-unit separation is inside the star–star tidal reach: (2.57+2.06)·2.5·∛1.46 ≈ 13.1. A matter stream exists from the first step (`t6.js`: `binaryTransferStart = 0.00`).
  - The primary then goes white dwarf (about 120 s) and Type Ia at about 150–180 s, which removes it. That is roughly 15–18 s at 10×.
- **Triple:**
  - Described as "a stable hierarchical layout". The inner pair (separation 10) also transfers mass from t=0.
  - At t=120, A is a hypergiant (361) and B a red dwarf (99). At t=180, A is gone and B is a 460 giant (`t4.js`).
- **Fix:**
  - Binary: separation of about 15, so transfer starts after evolution or a time-lapse.
  - Triple: inner separation of about 14 and outer of about 50, or a pair-level "no tidal transfer" flag for the triple (do not reuse `exhibitSystemId`, because it zeroes the stars' response).
  - Or rewrite the copy to match what happens.

### P10: Medium. Equal-priority collision: whichever body is later in the array eats the other, regardless of mass, and takes over its identity
`src/physics/collisions.ts:221-225`
- **What happens:**
  - `eater = priority(a) >= priority(b) ? a : b`, and pairs are emitted as `[later, earlier]`. A freshly placed red dwarf therefore eats a 400-mass blue star. A 0.5-mass rocky planet eats a 30-mass one.
  - The survivor keeps its own position, name, variant and flags. So the big body's `locked`, `holdStage` (the Sun), `exhibitSystemId`, satellites, galaxy anchor role and name are all lost.
  - Example: drop a star onto the locked Habitable World star and the lock disappears.
- **How I confirmed it:** `t6.js`. Blue 400 (id 1) plus red 120 (id 2) leaves "2: Helios 02, red dwarf, 520". Rocky 30 plus rocky 0.5 leaves "2: Terra 02, 30.5".
- **Fix:** On equal priority, the higher mass wins; on equal mass, the lower id wins. Consider also carrying over `locked`/`holdStage` from the food when the food was larger.

### P11: Medium. Exhibit anchor stars evolve and die mid-exhibit (the same class as the Solar System supernova bug)
`src/builders/tidal-scenarios.ts:52-59, 117-125`, `src/ui/exhibit-flow.ts:59-64`
- **What happens:**
  - Halcyon (Tidal Lab), Gododdin's Sun and the Habitable World star are all 210–230 with no `holdStage`. Each becomes a giant at about 75 s and a white dwarf by about 125 s.
  - In Gododdin this gives "Biosphere collapse: Gododdin… outside a temperate orbit" (`t1.js`, `gododdin`, `habitable-world`, `tidal-lab` at t=240).
- **Fix:** Set `holdStage: true` in the `addBody` options for these three locked anchor stars (`holdStage` is already an accepted option).

### P12: Medium. A save or recovery snapshot with an unknown kind or stage crashes the restore partway and leaves history permanently disabled
`src/state/history.ts:109-178`, `src/sandbox-state.ts:316-330`
- **What happens:**
  - `loadUniverse` only validates `version` and that `bodies` is an array.
  - `restoreUniverse` sets `historySuspended = true`, resets the scene, and then calls `addBody` with `saved.kind`. `TYPES[kind]` is undefined, so it throws.
  - A stage not in `STAGES` would throw in `bodyBaseScale` (`STAGES.find(...)!`).
  - The universe is left half-restored and `historySuspended` stays true, so undo and redo recording is dead until reload.
- **How I confirmed it:** `t5.js` stored a snapshot containing one body of kind `quasar` and called `loadSavedUniverse()`. It threw "Cannot read properties of undefined (reading 'color')", leaving 1 body and `historySuspended: true`.
- **Fix:**
  - Validate each saved body (`kind in TYPES`; stage in `STAGES` when kind is `star`; finite position, velocity and mass; birthMass > 0) and drop bad entries with a toast.
  - Wrap the restore in `try/finally { app.historySuspended = false }`.
  - On failure, fall back to the pre-load snapshot that `recordHistory()` already pushed.

### P13: Medium. Undo, redo, save and load don't round-trip some state the simulation depends on
`src/state/history.ts:58-108`
- **What happens:**
  - `stageTransition` is not saved. Undoing or loading during a 5.5–8.5 s stage transition drops it, and because `stageAge` was reset to 0 when the transition began, the star waits a full stage duration again.
  - Debris membership (P6), `nebulaContactId`, `tidalStrain` and `mesh.userData` (merge, common-envelope and fragment timers) are lost too. Restored debris then collides and merges at once.
  - `app.currentExhibit` is forced to null, so after an undo inside Tidal Lab or Gododdin the cinematic slow motion no longer triggers.
- **How I confirmed it:** `t4.js`: a star mid-transition (`{from:'yellow star',to:'giant',age:0.9}`), then record history, add a body, undo. The result is `yellow star transition=undefined stageAge=0`.
- **Fix:** Add `stageTransition`, `debris` (P6) and optionally `tidalStrain` to `SavedBody` and the snapshot. These are optional fields, so the save version can stay at 1. Keep `currentExhibit` in the snapshot.

### P14: Medium (performance). `updateTidalInteractions` is the hottest code in a physics step: O(n²) with throw-away objects created for every pair
`src/physics/tidal.ts:62-243`, `src/physics/collisions.ts:109-140`
- **What happens:**
  - For every pair, `tidalPair` calls `priority()` up to 4 times. Each call builds a new 12-key object literal.
  - It also calls `canEat()`, which builds `[...].includes` array literals.
  - Pairs that pass the reach test allocate `delta.clone()` and two 12-key `Record`s (`baseRate`, `minimum`).
- **How I confirmed it:** I timed one `simulate()` step with instrumentation (`t7.js`) on a scene of 160 bodies:

  | Phase | Time per step |
  |---|---|
  | tidal | 2.44 ms |
  | gravity (Barnes–Hut) | 1.06 ms |
  | collisions | 0.14 ms |
  | whole step | 3.99 ms |

  At 10× that is about 10 steps per frame, roughly 40 ms per frame on desktop Chromium before any rendering. iPhone will be worse.
- **Fix:**
  - Hoist `PRIORITY`, `BASE_RATE`, `MINIMUM` and the `canEat` tables to module-level constants (`Set`s or bitmasks).
  - Reject a pair on squared distance before calling `tidalPair` (the largest reach is (ra+rb)·4.15·1.55).
  - Reuse a scratch `Vector3`.
  - Reuse `spatialCandidatePairs` with a cell size of about 40 when n > 50.

### P15: Low (performance). Collision broad phase: O(n³) for 50 bodies or fewer, plus wasted allocations
`src/physics/collisions.ts:160-169`, `src/physics/simulate.ts:122-123`
- **What happens:**
  - With 50 bodies or fewer, `bodies.flatMap(... slice ...)` builds about n²/2 small arrays every step.
  - The pair loop calls `bodies.includes(a)` and `bodies.includes(b)` on every pair, which is O(n) each.
  - `gravityParticles()` is rebuilt for collisions every step even when it is unused (n ≤ 50). `applyGalaxyHaloGravity` does `bodies.find` per member and a `clone()` per member.
- **How I confirmed it:** By reading the code. The galaxy plus Solar System scene (25 bodies) spends 0.94 ms per step in collisions (`t7.js`).
- **Fix:**
  - Use nested index loops instead of building pair arrays.
  - Replace `includes` with a `removed` Set or a `byId.has` check that `removeBody` updates.
  - Build the collision particles only when n > 50, and use the `byId` map in the halo code.

### P16: Low (performance). `updateMatterStreams` allocates hundreds of vectors per stream every frame
`src/physics/matter-streams.ts:154-229`
- **What happens:** `curvePoint` makes about 4 `Vector3` clones per call. It is called about 3×39 times for the ribbon, 58 for the line and 88 for the points, so roughly 1k allocations per stream per frame. There is also a `bodies.find` per stream. Feed a Black Hole runs 2–3 streams continuously.
- **Fix:** Evaluate the Bézier curve with scalar math into reused scratch vectors, and resolve donor and receiver through the `byId` map.

### P17: Low. Off-track giants and hypergiants freeze forever
`src/simulation-model.ts:53-69`
- **What happens:** A giant or hypergiant whose mass is not on a track containing its stage gets `stable`. This happens after tidal stripping or with a custom mass. A giant at 150 never becomes a white dwarf, and a hypergiant at 300 never explodes.
- **How I confirmed it:** `t4.js`: `stuckGiant: giant stageAge=0.0` and `stuckHyper: star hypergiant stageAge=0.0` after 200 s.
- **Fix:** In `nextStellarStep`, an off-track `giant` or `hypergiant` should evolve to its track's terminal stage: white dwarf for low-mass, sun-like and hot-intermediate; supernova for massive.

### P18: Low. Most builders ignore the gravity slider
`src/builders/systems.ts:52,74,91,123,142,166,172`, `src/builders/galaxy.ts:48,82`, `src/ui/exhibit-flow.ts:69,75`
- **What happens:** These compute orbital speeds with `G` only. `tidal-scenarios.ts:47` uses `G * app.gravity`. A Solar System placed while gravity is 0.5 starts unbound.
- **How I confirmed it:** `t10.js`: with gravity at 0.5, Earth's distance runs 13.5 → 50.1 within 20 s. At gravity 2 it falls to 4.5.
- **Fix:** Use `orbitalSpeed(G, app.gravity, M, r)` from `physics-continuity.ts` everywhere. It already exists and returns 0 when gravity is 0.

### P19: Low. A star stripped below fusion mass stays a star
`src/physics/stellar-evolution.ts:226-231`, `src/physics/tidal.ts:202`
- **What happens:** Feed a Black Hole strips Helios 03 from 185 to the 28 minimum, and it remains a "red dwarf" star of mass 28 (`t1.js`). There is no path back to brown dwarf.
- **Fix:** In `applyGrowthProgression`, transform a star whose mass is below about 120 (and that is not a white dwarf) into `brown`.

### P20: Low. Transformations rename bodies and rebuild visuals twice
`src/bodies/lifecycle.ts:28-69`, `src/physics/stellar-evolution.ts:38-47`
- **What happens:**
  - `transform()` always sets `b.name = nameFor(kind, id)` and `age = 0`, so "Eris Hypergiant" becomes "Beacon 01" at supernova (`t1.js`) and Sun or Earth names are lost on growth. AGENTS.md asks for object identity to be preserved.
  - `igniteBody` calls `transform()`, which already runs `replaceVisual` and `updateScale`, and then calls both again. That disposes and recreates the whole mesh twice.
- **Fix:** Keep custom names (store `customName`, or only rename when `name === nameFor(oldKind, id)`). Drop the duplicate calls in `igniteBody`.

### P21: Low. Dead or inconsistent code
- `src/builders/systems.ts:46,64,84,102`: the `momentum` accumulator is computed and never used (left over from the removed Sun recoil). Delete it.
- `src/physics/tidal.ts:19-20`: the doc comment for `sameExhibitSystem` sits above `updateSatellite`.
- `src/physics/tidal.ts:223` (`donor.kind === 'nebula' ? 'gas'`) and the nebula, pulsar and black-hole entries in `baseRate`/`minimum`: unreachable, because `tidalPair` excludes nebulae and black-hole/pulsar donors are never transferable.
- `src/exhibit-runtime.ts`: `PerformanceMonitor.droppedFrames` is written and never read. `effectiveRocheLimit` is only used by tests (fine, but it could drive the Roche overlay).
- `src/physics/collisions.ts:60-77`: fragments from collisions are not added to the parent's cosmic group, unlike tidal fragments (`tidal.ts:172-176`). Navigator groups lose track of them.

---

## Suspected (not reproduced)

- **S1, galaxy anchor removal:** `src/bodies/lifecycle.ts:109`. If the user removes a galaxy's black hole, `anchorId` falls back to `bodyIds[0]`, which may be a star or a nebula. Halo gravity (`simulate.ts:34-52`) would then pull the whole galaxy toward that star. Fix: when the anchor is removed, clear `haloMass`, or pick the most massive remaining member.
- **S2, iteration over removed bodies:** `simulate.ts:89-116` iterates a copy of `bodies`. A nebula drained to removal by an earlier protostar in the same step is still visited, so it is integrated and `spawnProtostar` may run on a removed body. With current numbers `spawnProtostar` returns early because the mass is too low. Fix: skip bodies where `!bodies.includes(b)`, or use a removed flag.
- **S3, accumulator drift:** With MAX_SIM_STEPS = 18 on compact devices and frames longer than 30 ms, 10× silently runs slower than 10×. `runFixedSteps` caps the accumulator correctly; this is only a labelling and UX issue, and I did not measure it on a real device.

Exhibits that behaved as intended in testing:
- **Supernova Observatory:** pulsar appears in under 10 s.
- **Tidal Lab:** Tethys is disrupted into 16 pieces about 6–7 s in, apart from P11.
- **Gododdin:** the moon is shredded and Gododdin survives, apart from P11.
- **Build a Star:** ignition at about 25 s. Note that all seeds then merge into one 600-mass star that goes blue, giant, hypergiant and black hole by about 138 s. That fits the objective, but it ends the same way every time.

Pause and 10× are safe: physics always steps at a fixed dt of 1/60, and the only real-time logic is slow motion and stream fade.

---

## Top 5 improvements by value

1. **Make every guided exhibit and builder stable by default (P1, P2, P7, P9, P11).** Set `holdStage` on anchor stars, use kinematic moons, give the galaxy-tour Solar System an orbit, and fix the nebula speed cap and the member interactions inside galaxies. Add a smoke test per exhibit that steps 120 s and asserts that the key bodies still exist.
2. **Fix the Barnes–Hut exemption gap and unify softening (P4).** At present any scene with more than 64 bodies silently switches to different physics.
3. **Clear per-body module state and move it onto the body (P6, P13).** Clear on reset and remove, and serialize it. This removes the hidden-label bug and makes undo, save and load faithful.
4. **Rate-limit tidal and transfer events per pair (P3), and fix momentum in fragmentation and the choice of eater in collisions (P5, P10).** These are the most visible "this looks broken" moments in normal play.
5. **Remove the per-pair allocations and lookups in the tidal, collision and stream code (P14–P16).** About 2.4 ms of a 4 ms step at 160 bodies goes to object-literal churn in `updateTidalInteractions`. Fixing it roughly halves step cost and matters most at 10× on iPhone.
