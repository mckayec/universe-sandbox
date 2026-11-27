// SC4-E1 enforced motion/flyby evidence harness (simulator-clarity), PR #47 exact head 3ab737f.
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=/path/to/chrome] node evidence-harness-sc4e1.mjs [outDir]
// Serves the production build with `vite preview`, opens it with `?probe=1` (read-only `window.__sandboxProbe()`),
// and drives Chromium with SwiftShader software GL (NOT a real GPU). No application code is changed.
//
// Deterministic scenes: each scenario writes one fixed snapshot (bodies, masses, positions, velocities, fixed camera)
// to the app's own save slot and restores it through the real Load button, paused. Then it records three matched
// segments with the same camera: paused, 1x and 10x. Every segment logs the raw probe (positions, masses, tide), the
// requested speed and pause state, and the simulated elapsed time read from a Save snapshot (app.elapsed). Disk phase
// is not exposed by the read-only probe (no code change was requested), so material motion is measured from pixels:
// mean absolute luminance change inside a disk crop between consecutive frames, plus a left/right brightness
// asymmetry that tracks the broad view-dependent highlight. Each scenario context records a video (Playwright).
// Prints one JSON line per scenario with every assertion; exits 1 if any assertion fails.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc4e1-'));
mkdirSync(outDir, { recursive: true });
const port = 4187;
const base = `http://127.0.0.1:${port}/?probe=1`;
const STORAGE_KEY = 'gravity-lab-universe-v1';
const G = 1.05; // src/celestial-catalog.ts
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: 'ignore' },
);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = row => console.log(JSON.stringify(row));
let failures = 0;
const tides = {};

// ---------- pure rules (negative-tested below) ----------

/** Unbound two-body check from the initial state: specific orbital energy of the relative motion is positive. */
export function relativeEnergy(a, b) {
  const r = Math.hypot(...a.position.map((x, i) => x - b.position[i]));
  const v = Math.hypot(...a.velocity.map((x, i) => x - b.velocity[i]));
  return (v * v) / 2 - (G * (a.mass + b.mass)) / r;
}

/** A flyby: separation falls to a minimum strictly inside the series, then rises again past `recede` x the minimum, with both bodies surviving throughout. */
export function flybyShape(series, recede = 2) {
  if (series.length < 5 || series.some(s => s.count !== 2)) return { ok: false, reason: 'body count changed' };
  const seps = series.map(s => s.sep);
  let k = 0;
  for (let i = 1; i < seps.length; i++) if (seps[i] < seps[k]) k = i;
  const approach = k > 0 && seps[0] > seps[k] * recede,
    recedes = k < seps.length - 1 && seps[seps.length - 1] > seps[k] * recede;
  return { ok: approach && recedes, minSep: seps[k], minIndex: k, first: seps[0], last: seps[seps.length - 1] };
}

/** Pause freezes phase: consecutive paused crops barely change; running crops change by more than `moving`. */
// Thresholds: paused change below 1.5 grey levels AND below 10% of the smallest running change. Small paused residue
// comes from the companion tide relaxing on frame time while bodies are frozen (documented in harness 4b-2).
export function freezeRule(pausedDiffs, runningDiffs, still = 1.5, moving = 1.0) {
  const pausedMax = Math.max(...pausedDiffs),
    runningMin = Math.min(...runningDiffs);
  return { ok: pausedMax < still && pausedMax < runningMin * 0.1 && runningMin > moving, pausedMax, runningMin };
}

/** Camera-consistent highlight: the left/right asymmetry keeps its sign and stays within `tol` across frames. */
export function highlightStable(asyms, tol = 0.08) {
  const sign = Math.sign(asyms[0]);
  const spread = Math.max(...asyms) - Math.min(...asyms);
  return { ok: Math.abs(asyms[0]) > 0.02 && asyms.every(a => Math.sign(a) === sign) && spread < tol, spread };
}

// ---------- scene construction ----------

function circularPair(m1, m2, sep, tilt = 0) {
  const v = Math.sqrt((G * (m1 + m2)) / sep),
    x1 = (-sep * m2) / (m1 + m2),
    x2 = (sep * m1) / (m1 + m2);
  return [
    { mass: m1, position: [x1, 0, tilt], velocity: [0, 0, (-v * m2) / (m1 + m2)] },
    { mass: m2, position: [x2, 0, -tilt], velocity: [0, 0, (v * m1) / (m1 + m2)] },
  ];
}

const SCENARIOS = [
  {
    id: 'isolated',
    cells: ['isolated'],
    bodies: [{ mass: 600, position: [0, 0, 0], velocity: [0, 0, 0] }],
    camera: [0, 14, 30],
  },
  { id: 'wide-equal', cells: ['wide', 'equal'], bodies: circularPair(600, 600, 34), camera: [0, 58, 72] },
  { id: 'close-equal', cells: ['close', 'equal'], bodies: circularPair(600, 600, 20), camera: [0, 40, 50] },
  { id: 'unequal', cells: ['unequal', 'close'], bodies: circularPair(600, 120, 24), camera: [0, 42, 52] },
  {
    id: 'flyby',
    cells: ['flyby', 'equal'],
    bodies: [
      { mass: 600, position: [-60, 0, -12.5], velocity: [4.5, 0, 0] },
      { mass: 600, position: [60, 0, 12.5], velocity: [-4.5, 0, 0] },
    ],
    camera: [0, 95, 95],
  },
  {
    id: 'merger',
    cells: ['merger', 'equal'],
    bodies: [
      { mass: 600, position: [-8, 0, 0], velocity: [0, 0, -0.6] },
      { mass: 600, position: [8, 0, 0], velocity: [0, 0, 0.6] },
    ],
    camera: [0, 38, 48],
  },
];

function buildSnapshot(template, scenario) {
  const bodies = scenario.bodies.map((b, i) => ({
    ...template,
    id: i + 1,
    name: `Void ${String(i + 1).padStart(2, '0')}`,
    mass: b.mass,
    birthMass: b.mass,
    position: b.position,
    velocity: b.velocity,
    lastEvent: 'Placed in the simulation',
  }));
  return { version: 1, elapsed: 0, gravity: 1, nextId: bodies.length + 1, nextGroupId: 1, bodies, groups: [], camera: scenario.camera, target: scenario.target ?? [0, 0, 0] };
}

// ---------- page helpers ----------

async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}

const probe = page => page.evaluate(() => window.__sandboxProbe());

async function savedElapsed(page) {
  await page.locator('#save-universe').click();
  return page.evaluate(k => JSON.parse(localStorage.getItem(k)).elapsed, STORAGE_KEY);
}

async function setTools(page, open) {
  const toggle = page.locator('#panel-toggle');
  if (!(await toggle.isVisible())) return;
  const expanded = (await toggle.getAttribute('aria-expanded')) === 'true';
  if (expanded !== open) await toggle.click();
}

async function templateBody(page) {
  await setTools(page, true);
  await page.locator('#clear').click();
  await page.locator('[data-choice="blackhole"]').click();
  if (page.viewportSize().width < 700) await setTools(page, false);
  await page.mouse.click(page.viewportSize().width / 2, page.viewportSize().height / 2);
  await sleep(500);
  await page.locator('#save-universe').click();
  const saved = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), STORAGE_KEY);
  return saved.bodies[0];
}

/** Luminance metrics for a square crop centred on a client point, decoded on a helper page. */
async function crops(page, decoder, center, half, count, gapMs) {
  const shots = [];
  for (let i = 0; i < count; i++) {
    if (i) await sleep(gapMs);
    const vp = page.viewportSize();
    const x = Math.max(0, Math.min(vp.width - 2 * half, center[0] - half)),
      y = Math.max(0, Math.min(vp.height - 2 * half, center[1] - half));
    shots.push((await page.screenshot({ clip: { x, y, width: 2 * half, height: 2 * half } })).toString('base64'));
  }
  return decoder.evaluate(async list => {
    const lum = [];
    for (const b64 of list) {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = new OffscreenCanvas(img.width, img.height),
        ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, img.width, img.height).data,
        l = new Float32Array(img.width * img.height);
      for (let i = 0; i < l.length; i++) l[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
      lum.push({ l, w: img.width });
    }
    const asym = lum.map(({ l, w }) => {
      let left = 0,
        right = 0;
      for (let i = 0; i < l.length; i++) (i % w < w / 2 ? (left += l[i]) : (right += l[i]));
      return (left - right) / Math.max(1, left + right);
    });
    const mean = lum.map(({ l }) => l.reduce((s, x) => s + x, 0) / l.length);
    const diffs = [];
    for (let k = 1; k < lum.length; k++) {
      let s = 0;
      for (let i = 0; i < lum[k].l.length; i++) s += Math.abs(lum[k].l[i] - lum[k - 1].l[i]);
      diffs.push(s / lum[k].l.length);
    }
    return { diffs, asym, mean };
  }, shots);
}

async function openScenario(browser, scenario, viewport, videoDir) {
  const context = await browser.newContext({ viewport, recordVideo: { dir: videoDir, size: viewport.width >= 960 ? { width: 960, height: Math.round((960 * viewport.height) / viewport.width) } : viewport } });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [],
    glMessages = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
    if (/GL Driver Message \(OpenGL, Performance/.test(m.text())) return;
    if (/WebGL|shader|GL_|program/i.test(m.text())) glMessages.push(m.text());
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  return { context, page, errors, glMessages };
}

const sepOf = snap =>
  snap.bodies.length === 2 ? Math.hypot(...snap.bodies[0].position.map((x, i) => x - snap.bodies[1].position[i])) : null;

async function runScenario(browser, decoder, scenario, viewport, videoDir) {
  const { context, page, errors, glMessages } = await openScenario(browser, scenario, viewport, videoDir);
  const checks = [];
  const check = (name, ok, detail) => {
    checks.push({ name, ok: !!ok, detail });
    if (!ok) failures++;
  };
  const segments = [];
  const t0 = Date.now();
  const mark = label => segments.push({ label, videoSeconds: (Date.now() - t0) / 1000 });
  if (!(await probe(page)).paused) await page.locator('#pause').click();
  const template = await templateBody(page);
  const snapshot = buildSnapshot(template, scenario);
  if (scenario.bodies.length === 2) check('initial relative energy recorded', true, relativeEnergy(...snapshot.bodies));
  await page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [STORAGE_KEY, snapshot]);
  await page.locator('#load-universe').click();
  await sleep(1200);
  if (!(await probe(page)).paused) await page.locator('#pause').click();
  let snap = await probe(page);
  check('deterministic scene restored through Load, paused', snap.paused === true && snap.bodies.length === scenario.bodies.length && snap.bodies.every((b, i) => b.kind === 'blackhole' && b.mass === scenario.bodies[i].mass), { paused: snap.paused, bodies: snap.bodies.map(b => ({ id: b.id, mass: b.mass, position: b.position })) });
  // Select the first (heaviest-listed) body through Inspect mode so the inspector shows its disk state.
  await page.locator('#inspect-mode').click();
  await page.mouse.click(...snap.bodies[0].screen);
  await sleep(400);
  snap = await probe(page);
  check('host body selected via Inspect click', snap.selectedId === snap.bodies[0].id, snap.selectedId);
  const hostId = snap.bodies[0].id;
  const half = Math.round(Math.min(viewport.width, viewport.height) * (scenario.id === 'isolated' ? 0.22 : 0.12));
  const hostScreen = s => s.bodies.find(b => b.id === hostId)?.screen;
  const segment = async (label, speed) => {
    if (speed) {
      await page.locator(`[data-speed="${speed}"]`).click();
      if ((await probe(page)).paused) await page.locator('#pause').click();
    } else if (!(await probe(page)).paused) await page.locator('#pause').click();
    mark(label);
    await sleep(600);
    const before = await probe(page);
    const elapsedBefore = await savedElapsed(page);
    const m = await crops(page, decoder, hostScreen(before) ?? [viewport.width / 2, viewport.height / 2], half, 4, 700);
    const after = await probe(page);
    const elapsedAfter = await savedElapsed(page);
    const host = after.bodies.find(b => b.id === hostId);
    const row = {
      label,
      requestedSpeed: speed || null,
      paused: after.paused,
      speed: after.speed,
      elapsed: [elapsedBefore, elapsedAfter],
      sep: [sepOf(before), sepOf(after)],
      hostTide: host?.tide ?? null,
      disk: await page.locator('#info-disk').textContent(),
      bodies: after.bodies.map(b => ({ id: b.id, mass: b.mass, tide: b.tide, position: b.position.map(x => +x.toFixed(3)) })),
      pixels: m,
    };
    segments[segments.length - 1].probe = row;
    return row;
  };
  const paused = await segment('paused', 0);
  check('paused: probe paused and simulated time frozen', paused.paused && paused.elapsed[1] === paused.elapsed[0], paused.elapsed);
  // Flyby: sample separation and host tide continuously from the first running frame, so the encounter is caught
  // whichever matched segment it falls in.
  const series = [];
  let sampling = scenario.id === 'flyby';
  const sampler = (async () => {
    while (sampling) {
      const s = await probe(page);
      const host = s.bodies.find(b => b.id === hostId);
      series.push({ t: +((Date.now() - t0) / 1000).toFixed(2), count: s.bodies.length, sep: sepOf(s), tide: host?.tide ?? null, paused: s.paused, speed: s.speed });
      if (s.bodies.length !== 2) break;
      await sleep(250);
    }
  })();
  const one = await segment('1x', 1);
  check('1x: running at speed 1, simulated time advances', !one.paused && one.speed === 1 && one.elapsed[1] > one.elapsed[0], one.elapsed);
  const ten = await segment('10x', 10);
  check('10x: running at speed 10, simulated time advances', !ten.paused && ten.speed === 10 && ten.elapsed[1] > ten.elapsed[0], ten.elapsed);
  const rate1 = (one.elapsed[1] - one.elapsed[0]),
    rate10 = (ten.elapsed[1] - ten.elapsed[0]);
  check('10x advances more simulated time than 1x over a matched window', rate10 > rate1 * 2, { rate1, rate10 });
  const freeze = freezeRule(paused.pixels.diffs, one.pixels.diffs);
  check('pause freezes disk pixels; 1x disk pixels change (material motion)', freeze.ok, freeze);
  if (scenario.id === 'isolated') {
    const hl = highlightStable([...one.pixels.asym, ...ten.pixels.asym]);
    check('isolated: broad highlight side/strength camera-consistent while material moves (1x+10x)', hl.ok, { ...hl, asym1: one.pixels.asym, asym10: ten.pixels.asym });
    check('isolated: undisturbed disk (no companion tide)', !(one.hostTide > 0) && /Undisturbed/.test(one.disk), { tide: one.hostTide, disk: one.disk });
  }
  if (['wide-equal', 'close-equal', 'unequal'].includes(scenario.id)) {
    check('bound pair: both bodies survive the matched windows', ten.bodies.length === 2, ten.bodies.length);
    check('bound pair: companion tide active (heuristic estimate)', one.hostTide > 0 && /heuristic estimate/.test(one.disk), { tide: one.hostTide, disk: one.disk });
    tides[scenario.id] = one.hostTide;
  }
  if (scenario.id === 'flyby') {
    check('flyby: initial relative energy positive (unbound)', relativeEnergy(...snapshot.bodies) > 0, relativeEnergy(...snapshot.bodies));
    mark('10x-encounter');
    for (let i = 0; i < 120; i++) {
      const last = series[series.length - 1];
      const minSoFar = Math.min(...series.map(x => x.sep ?? Infinity));
      if (!last || last.count !== 2 || (last.sep > 90 && last.sep > minSoFar * 4)) break;
      await sleep(500);
    }
    sampling = false;
    await sampler;
    const shape = flybyShape(series.filter(x => !x.paused));
    check('flyby: approaches to a minimum then recedes (>=2x) with both bodies surviving, no merger', shape.ok, shape);
    const peakTide = Math.max(...series.map(x => x.tide ?? 0)),
      lastTide = series[series.length - 1].tide ?? 0;
    check('flyby: host disk tide rises during the encounter', peakTide > 0.3, { peakTide });
    await sleep(4000);
    const late = (await probe(page)).bodies.find(b => b.id === hostId);
    check('flyby: host disk tide relaxes after the companion recedes', (late?.tide ?? 0) < peakTide * 0.5, { peakTide, lastTide, lateTide: late?.tide ?? null, lateSep: sepOf(await probe(page)) });
    scenario.series = series.map(x => ({ ...x, sep: x.sep === null ? null : +x.sep.toFixed(3), tide: x.tide === null ? null : +x.tide.toFixed(4) }));
    await page.screenshot({ path: join(outDir, `sc4e1-flyby-${viewport.width}x${viewport.height}-after.jpg`), quality: 72 });
  }
  if (scenario.id === 'merger') {
    mark('10x-merger');
    let after = null;
    for (let i = 0; i < 60; i++) {
      after = await probe(page);
      if (after.bodies.length === 1) break;
      await sleep(500);
    }
    const ids = after.bodies.map(b => b.id);
    check('merger: exactly one survivor, survivor selected, swallowed ID absent', ids.length === 1 && after.selectedId === ids[0], { ids, selectedId: after.selectedId });
    check('merger: survivor mass is the summed mass', after.bodies[0]?.mass === 1200, after.bodies[0]?.mass);
    await sleep(3000);
    const clean = await probe(page);
    const disk = await page.locator('#info-disk').textContent();
    check('merger cleanup: survivor disk quiet (no stale companion tide)', !(clean.bodies[0]?.tide > 0) && disk === 'Undisturbed', { tide: clean.bodies[0]?.tide, disk });
    await page.locator('#pause').click();
    mark('paused-after-merger');
    await sleep(500);
    const post = await crops(page, decoder, clean.bodies[0].screen, half, 3, 700);
    check('merger cleanup: paused survivor disk frozen', Math.max(...post.diffs) < 0.6, post.diffs);
    await page.screenshot({ path: join(outDir, `sc4e1-merger-${viewport.width}x${viewport.height}-after.jpg`), quality: 72 });
  }
  await page.screenshot({ path: join(outDir, `sc4e1-${scenario.id}-${viewport.width}x${viewport.height}-end.jpg`), quality: 72 });
  check('no page/console errors', errors.length === 0, errors);
  check('no shader/WebGL program messages', glMessages.length === 0, glMessages);
  const video = page.video();
  await context.close();
  const clip = join(outDir, `sc4e1-${scenario.id}-${viewport.width}x${viewport.height}.webm`);
  renameSync(await video.path(), clip);
  log({ tag: `${scenario.id}-${viewport.width}x${viewport.height}`, renderer: 'Chromium + SwiftShader (software GL)', cells: scenario.cells, scene: snapshot.bodies.map(b => ({ mass: b.mass, position: b.position, velocity: b.velocity })), camera: scenario.camera, clip, segments, series: scenario.series, checks });
}

try {
  // Negative controls for the pure rules.
  const fb = s => s.map(([sep, count = 2]) => ({ sep, count }));
  const neg = [
    flybyShape(fb([[100], [60], [30], [20], [15]])).ok, // only approaches
    flybyShape(fb([[100], [60], [20], [10, 1], [10, 1]])).ok, // merges
    flybyShape(fb([[100], [80], [70], [75], [80]])).ok, // never recedes 2x
    freezeRule([0.1, 2.0], [30, 30]).ok, // paused frames changed
    freezeRule([0.1, 0.5], [3, 3]).ok, // paused change not small relative to running
    freezeRule([0.1, 0.1], [0.2, 3]).ok, // a running frame did not change
    highlightStable([0.1, -0.1, 0.1]).ok, // sign flips
    highlightStable([0.001, 0.001]).ok, // no highlight
    relativeEnergy({ mass: 600, position: [-10, 0, 0], velocity: [0, 0, 0] }, { mass: 600, position: [10, 0, 0], velocity: [0, 0, 0] }) > 0, // bound
  ];
  const pos = [flybyShape(fb([[100], [40], [15], [40], [100]])).ok, freezeRule([0.1, 0.1], [3, 3]).ok, highlightStable([0.1, 0.11, 0.09]).ok];
  const negOk = neg.every(x => !x) && pos.every(Boolean);
  if (!negOk) failures++;
  log({ check: 'negative controls: flyby rule rejects approach-only/merge/no-recede; freeze rule rejects moving pause/static run; highlight rule rejects sign flip/no highlight; energy rule rejects bound pair', ok: negOk, neg, pos });
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const decoder = await browser.newPage();
  const videoDir = join(outDir, 'raw-video');
  const only = process.env.SCENARIOS?.split(',');
  for (const scenario of SCENARIOS.filter(s => !only || only.includes(s.id)))
    await runScenario(browser, decoder, scenario, { width: 1280, height: 800 }, videoDir);
  if (!only || only.includes('flyby-compact'))
    await runScenario(
      browser,
      decoder,
      {
        // Same unbound flyby rotated 90 degrees so the encounter runs along the tall axis of a portrait phone.
        id: 'flyby',
        cells: ['flyby', 'equal'],
        bodies: [
          { mass: 600, position: [-12.5, 0, -60], velocity: [0, 0, 4.5] },
          { mass: 600, position: [12.5, 0, 60], velocity: [0, 0, -4.5] },
        ],
        // The phone dock covers the lower screen, so the view target sits below the encounter to lift it into view.
        camera: [0, 300, 70],
        target: [0, 0, 40],
      },
      { width: 390, height: 844 },
      videoDir,
    );
  if (!only) {
    const graded = tides['wide-equal'] > 0 && tides['wide-equal'] < tides['close-equal'];
    if (!graded) failures++;
    log({ check: 'graded response: wide equal pair tide is weaker than close equal pair tide (same masses)', ok: graded, tides });
  }
  await browser.close();
  log({ outDir, failures });
} finally {
  server.kill();
}
process.exit(failures ? 1 : 0);
