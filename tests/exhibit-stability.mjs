// Deterministic stability check for every guided exhibit and builder preset.
// Starts a Vite dev server, loads the app headless, then imports the same simulation modules the page uses and
// steps each scene at a fixed 1/60 s with no input, asserting that its key bodies survive and its story happens.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.EXHIBIT_PORT ?? 4191);
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 450; attempt++) {
    try {
      if ((await fetch(baseURL)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('Dev server did not become ready');
}

// Runs inside the page. Returns a plain report per scene; assertions happen in Node.
async function runScenes() {
  const load = path => import(path);
  const [state, history, exhibits, systems, galaxy, simulate, motion] = await Promise.all([
    load('/src/state/app-state.ts'),
    load('/src/state/history.ts'),
    load('/src/ui/exhibit-flow.ts'),
    load('/src/builders/systems.ts'),
    load('/src/builders/galaxy.ts'),
    load('/src/physics/simulate.ts'),
    load('/src/visuals/galaxy-motion.ts'),
  ]);
  const { app, bodies, exhibitEvents, matterStreams } = state;
  // Use the page's own three.js Vector3 (from the startup scene) rather than importing a second copy.
  const Vector3 = bodies[0].velocity.constructor;
  // Deterministic randomness for protostar seeds and visuals.
  let seed = 7;
  Math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const named = name => bodies.find(body => body.name === name);
  const stepHooks = [];
  const step = (seconds, onStep) => {
    for (let i = 0, n = Math.round(seconds * 60); i < n; i++) {
      simulate.simulate(1 / 60);
      app.elapsed += 1 / 60;
      for (const hook of stepHooks) hook();
      onStep?.(app.elapsed);
    }
  };
  const run = (id, setup, seconds, probe) => {
    setup();
    app.paused = true;
    const tracked = probe.track?.() ?? {};
    const extremes = {};
    let firstStream = null,
      events = 0;
    const titles = new Set();
    const unshift = exhibitEvents.unshift;
    exhibitEvents.unshift = function (...items) {
      events += items.length;
      for (const item of items) titles.add(item.title);
      return unshift.apply(this, items);
    };
    try {
      step(seconds, t => {
        if (firstStream === null && matterStreams.size) firstStream = t;
        for (const [key, [a, b]] of Object.entries(tracked)) {
          if (a.removed || b.removed) continue;
          const d = a.mesh.position.distanceTo(b.mesh.position),
            e = (extremes[key] ??= { min: Infinity, max: 0 });
          e.min = Math.min(e.min, d);
          e.max = Math.max(e.max, d);
        }
      });
    } finally {
      exhibitEvents.unshift = unshift;
    }
    return {
      id,
      firstStream,
      events,
      extremes,
      titles: [...titles],
      bodies: bodies.map(b => ({ name: b.name, kind: b.kind, stage: b.stage ?? null, mass: b.mass })),
      ...(probe.extra?.() ?? {}),
    };
  };
  const exhibit = id => () => exhibits.loadExhibit(id);
  const fresh = build => () => {
    history.resetSimulation();
    build();
  };
  const origin = () => new Vector3();
  const reports = [];
  const pair = (a, b) => [named(a), named(b)];
  reports.push(run('build-star', exhibit('build-star'), 120, {}));
  reports.push(
    run('habitable-world', exhibit('habitable-world'), 180, {
      track: () => {
        const [star, planet] = bodies;
        return { planet: [star, planet] };
      },
      extra: () => ({ life: bodies.find(b => b.kind === 'rocky')?.lifeLevel }),
    }),
  );
  reports.push(run('binary-stars', exhibit('binary-stars'), 180, {}));
  reports.push(run('feed-black-hole', exhibit('feed-black-hole'), 60, {}));
  // A Slow Feast: the cloud and then the star are fed in gradually, not swallowed on contact.
  let capturedAt = null;
  const originalUnshift = exhibitEvents.unshift;
  reports.push(
    run('slow-feast', exhibit('slow-feast'), 120, {
      track: () => {
        exhibitEvents.unshift = function (...items) {
          if (capturedAt === null && items.some(item => item.title === 'Slow accretion begins'))
            capturedAt = app.elapsed;
          return originalUnshift.apply(this, items);
        };
        return {};
      },
      extra: () => {
        exhibitEvents.unshift = originalUnshift;
        return { capturedAt, hole: named('Quiet Black Hole')?.mass ?? null };
      },
    }),
  );
  // Collide Two Galaxies: tracer stars are advanced as the frame loop would, every other physics step.
  let tailFraction = null;
  reports.push(
    run(
      'galaxy-collision',
      () => {
        exhibits.loadExhibit('galaxy-collision');
        let steps = 0;
        stepHooks.push(() => {
          if (++steps % 2 === 0) motion.updateGalaxyMotion(1 / 30);
        });
      },
      180,
      {
        extra: () => {
          stepHooks.length = 0;
          const visuals = [...state.galaxyVisuals.values()],
            core = bodies.find(body => body.kind === 'blackhole');
          let far = 0,
            total = 0;
          for (const visual of visuals) {
            if (!visual.live || !core) continue;
            for (let i = 0; i < visual.live.n; i++) {
              total++;
              if (Math.hypot(visual.live.x[i] - core.mesh.position.x, visual.live.z[i] - core.mesh.position.z) > 270)
                far++;
            }
          }
          tailFraction = total ? far / total : 0;
          return {
            tailFraction,
            liveVisuals: visuals.filter(visual => visual.live).length,
            galaxies: state.cosmicGroups.filter(group => group.kind === 'galaxy').length,
          };
        },
      },
    ),
  );
  reports.push(run('supernova-observatory', exhibit('supernova-observatory'), 120, {}));
  reports.push(run('collision-lab', exhibit('collision-lab'), 30, {}));
  reports.push(run('tidal-lab', exhibit('tidal-lab'), 120, {}));
  reports.push(run('gododdin', exhibit('gododdin'), 120, {}));
  reports.push(
    run('galaxy-tour', exhibit('galaxy-tour'), 180, {
      track: () => ({
        sunToHole: pair('Sun', 'Central Black Hole'),
        earth: pair('Sun', 'Earth'),
        jupiter: pair('Sun', 'Jupiter'),
        neptune: pair('Sun', 'Neptune'),
      }),
    }),
  );
  reports.push(
    run(
      'preset-solar',
      fresh(() => systems.createSolarSystem(origin())),
      180,
      {
        track: () => ({ earth: pair('Sun', 'Earth'), saturn: pair('Sun', 'Saturn'), pluto: pair('Sun', 'Pluto') }),
      },
    ),
  );
  // The same Solar System inside a scene of more than 64 bodies runs on the Barnes–Hut path.
  const registry = await load('/src/bodies/registry.ts');
  reports.push(
    run(
      'preset-solar-barnes-hut',
      fresh(() => {
        systems.createSolarSystem(origin());
        for (let i = 0; i < 60; i++)
          registry.addBody('asteroid', new Vector3(600 + (i % 10) * 3, 0, 600 + Math.floor(i / 10) * 3), undefined, {
            locked: true,
          });
      }),
      60,
      {
        track: () => ({ earth: pair('Sun', 'Earth'), saturn: pair('Sun', 'Saturn') }),
        extra: () => ({ sunSpeed: named('Sun')?.velocity.length() ?? null }),
      },
    ),
  );
  reports.push(
    run(
      'preset-binary',
      fresh(() => systems.createBinarySystem(origin())),
      180,
      {},
    ),
  );
  reports.push(
    run(
      'preset-triple',
      fresh(() => systems.createTripleSystem(origin())),
      180,
      {},
    ),
  );
  for (const style of ['spiral', 'lenticular', 'elliptical', 'irregular', 'globular'])
    reports.push(
      run(
        `galaxy-${style}`,
        fresh(() => galaxy.createGalaxy(origin(), style)),
        180,
        {},
      ),
    );
  return reports;
}

const byId = reports => Object.fromEntries(reports.map(report => [report.id, report]));
const has = (report, name) => report.bodies.some(body => body.name === name);
const body = (report, name) => report.bodies.find(b => b.name === name);
const within = (extreme, low, high, label) =>
  assert.ok(extreme && extreme.min >= low && extreme.max <= high, `${label}: ${JSON.stringify(extreme)}`);

function check(reports) {
  const r = byId(reports);
  // Build a Star: fusion begins.
  assert.ok(r['build-star'].titles.includes('Protostar ignition'), 'build-star ignites');
  // Living World: calm orbit, kinematic moon and distant giant all survive, star holds stage, life appears.
  const living = r['habitable-world'];
  assert.equal(living.bodies.length, 4, 'living world keeps its four bodies');
  within(living.extremes.planet, 11, 13, 'living world planet orbit');
  assert.equal(living.bodies[0].stage, 'yellow star');
  assert.notEqual(living.life, 'none', 'living world develops life');
  // Dance of Two Suns: transfer begins only after evolution, both stars survive 3 minutes.
  for (const id of ['binary-stars', 'preset-binary']) {
    const binary = r[id];
    assert.ok(binary.firstStream > 20, `${id} transfer starts later (${binary.firstStream})`);
    assert.equal(binary.bodies.filter(b => b.kind === 'star').length, 2, `${id} keeps both stars`);
    assert.ok(
      binary.bodies.some(b => b.kind === 'rocky'),
      `${id} keeps its planet`,
    );
  }
  // Triple: hierarchical layout stays intact.
  const triple = r['preset-triple'];
  for (const name of ['Primary A', 'Companion B', 'Outer Star C']) assert.ok(has(triple, name), `triple keeps ${name}`);
  assert.ok(
    triple.firstStream === null || triple.firstStream > 30,
    `triple transfer starts late (${triple.firstStream})`,
  );
  // Feed a Black Hole: events stay readable (no per-step spam), donors stream into the hole.
  const feed = r['feed-black-hole'];
  assert.ok(feed.events < 30, `feed-black-hole event count ${feed.events}`);
  assert.ok(feed.titles.includes('Tidal stream'));
  // Supernova: the hypergiant explodes and leaves a remnant; the observer planet survives.
  const nova = r['supernova-observatory'];
  assert.ok(nova.titles.includes('Supernova'));
  assert.equal(body(nova, 'Eris Hypergiant')?.kind, 'pulsar', 'remnant keeps the exhibit name');
  assert.ok(has(nova, 'Aurelia'));
  // Collision Lab: fragmentation happens.
  assert.ok(r['collision-lab'].titles.includes('Planetary fragmentation'));
  // Tidal Lab: Tethys is disrupted, Halcyon holds stage.
  const tidal = r['tidal-lab'];
  assert.ok(tidal.titles.includes('Tidal disruption'));
  assert.equal(body(tidal, 'Halcyon')?.stage, 'yellow star');
  // Gododdin: worldships come out of warp, the planet itself breaks apart, most of the fleet dies, the Demiurge survives.
  const god = r.gododdin;
  assert.ok(!has(god, 'Gododdin'), 'Gododdin should break apart');
  assert.ok(god.bodies.filter(b => b.name.startsWith('Gododdin debris')).length >= 6);
  assert.ok(god.bodies.filter(b => b.name === 'Cielcin Worldship').length >= 4);
  assert.ok(god.bodies.filter(b => b.name.startsWith('Imperial ship')).length <= 6, 'most of the fleet is destroyed');
  assert.ok(has(god, 'Demiurge'));
  assert.ok(
    ['Passage at warp', 'Out of warp', 'Into the world', 'Tidal disruption'].every(t => god.titles.includes(t)),
  );
  assert.equal(body(god, "Gododdin's Sun")?.stage, 'yellow star');
  // A Slow Feast: the star is captured after the cloud has been feeding for a while, and both end up inside.
  const feast = r['slow-feast'];
  assert.ok(feast.capturedAt !== null && feast.capturedAt > 45, `star captured at ${feast.capturedAt}`);
  assert.ok(!has(feast, 'Sun-like Star') && !has(feast, 'Drifting Cloud'), 'star and cloud are fully accreted');
  assert.ok(feast.hole > 1250, `black hole grew to ${feast.hole}`);
  // Collide Two Galaxies: the cores merge, every star is still drawn, and many are flung into tails and shells.
  const collision = r['galaxy-collision'];
  assert.ok(collision.titles.includes('Galaxies merge'), 'the galaxies merge');
  assert.equal(collision.galaxies, 1, 'one merger remnant remains');
  assert.equal(collision.liveVisuals, 2, 'both galaxies keep their stars');
  assert.ok(collision.tailFraction > 0.05, `tidal debris fraction ${collision.tailFraction}`);
  // Galaxy tour: the Solar System orbits the core instead of falling in, and keeps every orbit.
  const tour = r['galaxy-tour'];
  within(tour.extremes.sunToHole, 250, 600, 'solar system distance to galaxy core');
  within(tour.extremes.earth, 12.5, 15, 'tour Earth orbit');
  within(tour.extremes.jupiter, 24, 26.5, 'tour Jupiter orbit');
  within(tour.extremes.neptune, 46, 52, 'tour Neptune orbit');
  for (const name of [
    'Sun',
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Moon',
    'Pluto',
  ])
    assert.ok(has(tour, name), `tour keeps ${name}`);
  // Solar System preset on both gravity paths.
  for (const id of ['preset-solar', 'preset-solar-barnes-hut']) {
    within(r[id].extremes.earth, 12.5, 15, `${id} Earth`);
    assert.equal(body(r[id], 'Sun')?.stage, 'yellow star');
  }
  within(r['preset-solar'].extremes.pluto, 54, 58, 'Pluto');
  within(r['preset-solar-barnes-hut'].extremes.saturn, 31, 34, 'Barnes-Hut Saturn');
  // Members no longer drag the Sun around; only the 60 distant outside asteroids pull it, very slightly.
  assert.ok(r['preset-solar-barnes-hut'].sunSpeed < 0.01, 'Barnes-Hut Sun stays anchored');
  // Galaxies: interactive stars survive and keep stages that match their names.
  for (const style of ['spiral', 'lenticular', 'elliptical', 'irregular', 'globular']) {
    const report = r[`galaxy-${style}`],
      members = report.bodies.filter(b => / member \d+$/.test(b.name));
    assert.equal(members.length, 18, `${style} keeps all 18 member stars`);
    for (const member of members)
      assert.ok(member.stage?.startsWith(member.name.split(' ')[0]), `${style} ${member.name} is ${member.stage}`);
    assert.ok(!report.titles.includes('Supernova'), `${style} has no supernova`);
  }
}

let browser;
try {
  await waitForServer();
  const chromePath = [process.env.CHROME_PATH].find(candidate => candidate && existsSync(candidate));
  browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  await page.goto(baseURL, { timeout: 120000 });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4', null, { timeout: 120000 });
  const reports = await page.evaluate(runScenes);
  if (process.env.EXHIBIT_REPORT) console.log(JSON.stringify(reports, null, 1));
  check(reports);
  assert.deepEqual(failures, []);
  console.log(`Exhibit stability passed for ${reports.length} scenes`);
} finally {
  await browser?.close();
  server.kill();
}
