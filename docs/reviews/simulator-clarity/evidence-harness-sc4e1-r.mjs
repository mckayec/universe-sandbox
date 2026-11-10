// SC4-E1 recording/alignment repair harness (simulator-clarity), PR #47 exact head 3ab737f.
// Answers sc4e1-review-3ab737f.md R1/R2. No application code is changed.
//
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] [SCENARIOS=isolated,flyby,...] node evidence-harness-sc4e1-r.mjs [outDir]
//
// What is different from evidence-harness-sc4e1.mjs:
// - R1 (clock alignment): the harness injects a harness-only overlay (pointer-events: none, not app UI) holding a
//   solid colour swatch and a text label. Every phase change (startup/template, restored pause, 1x, 10x, flyby
//   approach/recession, merger survivor, paused after merger) switches the swatch colour at a logged node time. After
//   recording, every decoded video frame is classified by its swatch colour, so each frame is labelled from what the
//   video itself shows. The log->PTS offset is measured separately for every transition of every clip (first frame
//   showing the new colour); no common offset is assumed.
// - R2 (clean capture): nothing is screenshotted while the video records (no clipped screenshots, no Save clicks
//   during segments). Pixel metrics and contact sheets are derived offline from the full-frame recording at the
//   viewport size. Crops follow the host body: the probe screen position (sampled every ~100 ms) is mapped onto each
//   frame through the measured per-transition offset. Material-motion metrics are claimed only for the stationary
//   isolated hole and the paused merger survivor; pair/flyby crops are for viewing only.
// - The disk display clock is capped: src/visuals/update-visuals.ts uses diskDt = paused ? 0 : dt * min(speed, 4),
//   so the 10x window shows the disk at the 4x display cap, not 10x shader phase.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const METRIC = process.env.METRIC === '1'; // separate non-recording pass: lossless full-frame PNGs, no video
const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc4e1r-'));
mkdirSync(join(outDir, 'stills'), { recursive: true });
const port = 4188;
const base = `http://127.0.0.1:${port}/?probe=1`;
const STORAGE_KEY = 'gravity-lab-universe-v1';
const G = 1.05; // src/celestial-catalog.ts
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = row => console.log(JSON.stringify(row));
let failures = 0;

// Saturated marker colours; frames are classified by nearest colour (distance must be < 90).
export const MARKERS = {
  startup: [128, 128, 128],
  'restored-paused': [255, 255, 0],
  '1x': [0, 200, 0],
  '10x': [0, 0, 255],
  approach: [255, 0, 255],
  recession: [0, 255, 255],
  'merged-10x': [255, 128, 0],
  'paused-after-merger': [255, 0, 0],
};

export function classify(rgb) {
  let best = null,
    bestD = Infinity;
  for (const [label, c] of Object.entries(MARKERS)) {
    const d = Math.hypot(rgb[0] - c[0], rgb[1] - c[1], rgb[2] - c[2]);
    if (d < bestD) (bestD = d), (best = label);
  }
  return bestD < 90 ? best : null;
}

export function relativeEnergy(a, b) {
  const r = Math.hypot(...a.position.map((x, i) => x - b.position[i]));
  const v = Math.hypot(...a.velocity.map((x, i) => x - b.velocity[i]));
  return (v * v) / 2 - (G * (a.mass + b.mass)) / r;
}

function circularPair(m1, m2, sep) {
  const v = Math.sqrt((G * (m1 + m2)) / sep),
    x1 = (-sep * m2) / (m1 + m2),
    x2 = (sep * m1) / (m1 + m2);
  return [
    { mass: m1, position: [x1, 0, 0], velocity: [0, 0, (-v * m2) / (m1 + m2)] },
    { mass: m2, position: [x2, 0, 0], velocity: [0, 0, (v * m1) / (m1 + m2)] },
  ];
}

// Same scenes and cameras as evidence-harness-sc4e1.mjs.
const DESKTOP = { width: 1280, height: 800 };
const COMPACT = { width: 390, height: 844 };
const SCENARIOS = [
  { id: 'isolated', vp: DESKTOP, bodies: [{ mass: 600, position: [0, 0, 0], velocity: [0, 0, 0] }], camera: [0, 14, 30] },
  { id: 'wide-equal', vp: DESKTOP, bodies: circularPair(600, 600, 34), camera: [0, 58, 72] },
  { id: 'close-equal', vp: DESKTOP, bodies: circularPair(600, 600, 20), camera: [0, 40, 50] },
  { id: 'unequal', vp: DESKTOP, bodies: circularPair(600, 120, 24), camera: [0, 42, 52] },
  {
    id: 'flyby',
    vp: DESKTOP,
    bodies: [
      { mass: 600, position: [-60, 0, -12.5], velocity: [4.5, 0, 0] },
      { mass: 600, position: [60, 0, 12.5], velocity: [-4.5, 0, 0] },
    ],
    camera: [0, 95, 95],
  },
  {
    id: 'flyby-compact',
    vp: COMPACT,
    bodies: [
      { mass: 600, position: [-12.5, 0, -60], velocity: [0, 0, 4.5] },
      { mass: 600, position: [12.5, 0, 60], velocity: [0, 0, -4.5] },
    ],
    camera: [0, 300, 70],
    target: [0, 0, 40],
  },
  {
    id: 'merger',
    vp: DESKTOP,
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
  return {
    version: 1,
    elapsed: 0,
    gravity: 1,
    nextId: bodies.length + 1,
    nextGroupId: 1,
    bodies,
    groups: [],
    camera: scenario.camera,
    target: scenario.target ?? [0, 0, 0],
  };
}

const probe = page => page.evaluate(() => window.__sandboxProbe());
const sepOf = s =>
  s.bodies.length === 2 ? Math.hypot(...s.bodies[0].position.map((x, i) => x - s.bodies[1].position[i])) : null;

async function setTools(page, open) {
  const toggle = page.locator('#panel-toggle');
  if (!(await toggle.isVisible())) return;
  if (((await toggle.getAttribute('aria-expanded')) === 'true') !== open) await toggle.click();
}

async function installOverlay(page) {
  await page.evaluate(() => {
    const el = document.createElement('div');
    el.id = 'sc4e1r-marker';
    el.style.cssText =
      'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;display:flex;align-items:center;gap:6px;' +
      'font:bold 13px monospace;color:#fff;background:#000;padding:0 8px 0 0;';
    el.innerHTML = '<span style="display:block;width:40px;height:40px"></span><span></span>';
    document.body.appendChild(el);
  });
}

async function runScenario(browser, scenario) {
  const vp = scenario.vp;
  const videoDir = join(outDir, 'raw-video');
  const context = await browser.newContext(METRIC ? { viewport: vp } : { viewport: vp, recordVideo: { dir: videoDir, size: vp } });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const tStart = Date.now(); // video recording starts with page creation; only used for reporting
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const transitions = [];
  const samples = [];
  const checks = [];
  const check = (name, ok, detail) => {
    checks.push({ name, ok: !!ok, detail });
    if (!ok) failures++;
  };
  const marker = async (label, text = '') => {
    const c = MARKERS[label];
    await page.evaluate(
      ([rgb, t]) => {
        const el = document.getElementById('sc4e1r-marker');
        el.children[0].style.background = `rgb(${rgb.join(',')})`;
        el.children[1].textContent = t;
      },
      [c, `${label} ${text}`.trim()],
    );
    transitions.push({ label, logMs: Date.now() - tStart });
  };
  const stills = [];
  // Hold a window. In the metric pass, take full-frame (unclipped) screenshots ~500 ms apart instead of sleeping.
  const hold = async ms => {
    if (!METRIC) return sleep(ms);
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const label = transitions[transitions.length - 1].label;
      const s = await probe(page);
      const host = s.bodies.find(b => b.id === hostId) ?? s.bodies[0];
      const file = `sc4e1r-metric-${scenario.id}-${stills.length}.png`;
      const logMs = Date.now() - tStart;
      await page.screenshot({ path: join(outDir, 'stills', file) });
      stills.push({ file, label, logMs, paused: s.paused, speed: s.speed, count: s.bodies.length, sep: sepOf(s), tide: host?.tide ?? null, hostScreen: host?.screen ?? null });
      await sleep(Math.max(0, 500 - (Date.now() - tStart - logMs)));
    }
  };
  let hostId = null;
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  await installOverlay(page);
  await marker('startup', 'template');
  if (!(await probe(page)).paused) await page.locator('#pause').click();
  await setTools(page, true);
  await page.locator('#clear').click();
  await page.locator('[data-choice="blackhole"]').click();
  if (vp.width < 700) await setTools(page, false);
  await page.mouse.click(vp.width / 2, vp.height / 2);
  await sleep(500);
  await page.locator('#save-universe').click();
  const template = (await page.evaluate(k => JSON.parse(localStorage.getItem(k)), STORAGE_KEY)).bodies[0];
  const snapshot = buildSnapshot(template, scenario);
  await page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [STORAGE_KEY, snapshot]);
  await page.locator('#load-universe').click();
  await sleep(1200);
  if (!(await probe(page)).paused) await page.locator('#pause').click();
  await page.locator('#inspect-mode').click();
  let snap = await probe(page);
  await page.mouse.click(...snap.bodies[0].screen);
  await sleep(1500); // let toasts from Load/Inspect settle before the measured windows
  snap = await probe(page);
  hostId = snap.bodies[0].id;
  check(
    'restored deterministic scene paused, host selected',
    snap.paused && snap.selectedId === hostId && snap.bodies.length === scenario.bodies.length,
    { paused: snap.paused, selectedId: snap.selectedId, count: snap.bodies.length },
  );
  // Probe sampler: positions, screen points and tide every ~100 ms, timestamped on the same node clock.
  let sampling = !METRIC;
  const sampler = (async () => {
    while (sampling) {
      const s = await probe(page);
      const host = s.bodies.find(b => b.id === hostId) ?? s.bodies[0];
      samples.push({
        logMs: Date.now() - tStart,
        paused: s.paused,
        speed: s.speed,
        count: s.bodies.length,
        sep: sepOf(s),
        tide: host?.tide ?? null,
        hostScreen: host?.screen ?? null,
        screens: s.bodies.map(b => b.screen),
      });
      await sleep(100);
    }
  })();
  await marker('restored-paused');
  await hold(3000);
  const flyby = scenario.id.startsWith('flyby');
  if (!flyby) {
    await page.locator('[data-speed="1"]').click();
    await page.locator('#pause').click();
    await marker('1x');
    await hold(3500);
    await page.locator('[data-speed="10"]').click();
    await marker('10x');
    await hold(3500);
  } else {
    // Approach/closest/recession are labelled from the probe separation as it happens.
    await page.locator('[data-speed="10"]').click();
    await page.locator('#pause').click();
    await marker('approach');
    let minSep = Infinity,
      receding = false,
      endAt = null;
    for (let i = 0; i < 400; i++) {
      const s = await probe(page);
      const sep = sepOf(s);
      if (sep === null) break;
      if (!receding && sep > minSep + 0.5) {
        receding = true;
        await marker('recession', `min ${minSep.toFixed(1)}`);
      }
      minSep = Math.min(minSep, sep);
      if (receding && sep > Math.max(90, minSep * 5) && endAt === null) endAt = Date.now() + 1500;
      if (endAt && Date.now() > endAt) break;
      await sleep(60);
    }
  }
  if (scenario.id === 'merger') {
    for (let i = 0; i < 80 && (await probe(page)).bodies.length !== 1; i++) await sleep(250);
    await marker('merged-10x');
    await hold(3500);
    await page.locator('#pause').click();
    await marker('paused-after-merger');
    await hold(3000);
  }
  sampling = false;
  await sampler;
  const final = await probe(page);
  check('no page/console errors', errors.length === 0, errors);
  const video = page.video();
  await context.close();
  const clip = METRIC ? null : join(outDir, `sc4e1r-${scenario.id}-${vp.width}x${vp.height}.webm`);
  if (!METRIC) renameSync(await video.path(), clip);
  return {
    scenario,
    clip,
    transitions,
    samples,
    stills,
    checks,
    snapshot,
    hostId,
    finalCount: final.bodies.length,
    energy: scenario.bodies.length === 2 ? relativeEnergy(...snapshot.bodies) : null,
  };
}

async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: 'ignore' },
);
try {
  const neg = [classify([120, 120, 120]) === 'startup', classify([250, 250, 10]) === 'restored-paused', classify([60, 60, 60]) === null, classify([20, 20, 20]) === null];
  const negOk = neg.every(Boolean);
  if (!negOk) failures++;
  log({ check: 'marker classifier: nearest saturated colour, rejects dark/neutral scene pixels', ok: negOk, neg });
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const only = process.env.SCENARIOS?.split(',');
  const runs = [];
  for (const s of SCENARIOS.filter(s => !only || only.includes(s.id))) {
    const r = await runScenario(browser, s);
    runs.push(r);
    log({ tag: `${s.id}-${s.vp.width}x${s.vp.height}`, clip: r.clip, transitions: r.transitions, energy: r.energy, checks: r.checks, samples: r.samples.length });
  }
  await browser.close();
  writeFileSync(join(outDir, METRIC ? 'metric-runs.json' : 'runs.json'), JSON.stringify(runs));
  log({ outDir, failures });
} finally {
  server.kill();
}
process.exit(failures ? 1 : 0);
