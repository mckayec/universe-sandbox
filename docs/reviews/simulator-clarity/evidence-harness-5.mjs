// Item 5 (graphics lighting) rendered evidence: matched before/after scenes, star-relative key light assertions,
// spin/camera/source independence, and FPS badge readings.
// Usage (from a checkout after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=...] node <this file> <outDir> <label> [port]
// Serves ./dist with `vite preview` and opens `?probe=1`. On a build without the item-5 probe fields (the parent
// head) the light assertions are reported as "not available" and only screenshots and FPS are recorded.
// Chromium with SwiftShader software GL (not a real GPU). One JSON line per scenario; exits 1 on any failed check.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots', label = 'head', portArg = '4191'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const port = Number(portArg),
  base = `http://127.0.0.1:${port}/?probe=1`,
  server = spawn(
    process.execPath,
    ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { stdio: 'ignore' },
  ),
  sleep = ms => new Promise(r => setTimeout(r, ms)),
  log = row => console.log(JSON.stringify(row)),
  FALLBACK = (() => {
    const l = Math.hypot(0.62, 0.25, 0.74);
    return [0.62 / l, 0.25 / l, 0.74 / l];
  })(),
  WORLDS = new Set(['rocky', 'dwarf', 'moon', 'gas']),
  EMITTERS = new Set(['star', 'brown', 'protostar']);
let failures = 0;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const toward = (from, to) => {
  const d = [to[0] - from[0], to[1] - from[1], to[2] - from[2]],
    l = Math.hypot(...d);
  return d.map(v => v / l);
};

/** Every world's key light points at a star and that star is the single emitter, or fallback when none. Pure. */
export function keyLightsAimed(snapshot) {
  const emitters = snapshot.bodies.filter(b => EMITTERS.has(b.kind)),
    worlds = snapshot.bodies.filter(b => WORLDS.has(b.kind));
  if (!worlds.length || worlds.some(w => !w.keyDir))
    return { ok: false, reason: 'no worlds or no keyDir', worlds: worlds.length };
  let worst = 1;
  for (const w of worlds) {
    if (!emitters.length) {
      if (w.keyLightId !== null) return { ok: false, reason: `world ${w.id} lit with no emitter` };
      worst = Math.min(worst, dot(w.keyDir, FALLBACK));
      continue;
    }
    const star = emitters.find(e => e.id === w.keyLightId);
    if (!star) return { ok: false, reason: `world ${w.id} key ${w.keyLightId} is not an emitter` };
    worst = Math.min(worst, dot(w.keyDir, toward(w.position, star.position)));
  }
  return { ok: worst > 0.999, worst, worlds: worlds.length, emitters: emitters.length };
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
async function setTools(page, open) {
  const toggle = page.locator('#panel-toggle');
  if (!(await toggle.isVisible())) return;
  const expanded = (await toggle.getAttribute('aria-expanded')) === 'true';
  if (expanded !== open) await toggle.click();
}
async function tool(page, selector, then) {
  await setTools(page, true);
  await page.locator(selector).click();
  if (page.viewportSize().width < 700) await setTools(page, false);
  if (then) await then();
}
const probe = page => page.evaluate(() => window.__sandboxProbe());
const fps = page => page.locator('#perf-badge').textContent();
async function setPaused(page, paused) {
  if ((await probe(page)).paused !== paused) await page.locator('#pause').click();
}
async function fpsTrace(page, seconds) {
  const trace = [];
  for (let i = 0; i < seconds; i++) {
    await sleep(1000);
    trace.push(Number.parseInt(await fps(page), 10));
  }
  return trace;
}

async function scenario(browser, viewport, name, run) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(20000);
  const errors = [],
    gl = [],
    checks = [],
    data = {};
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
    if (/GL Driver Message \(OpenGL, Performance/.test(m.text())) return;
    if (/WebGL|shader|GL_|program/i.test(m.text())) gl.push(m.text());
  });
  const check = (id, ok, detail) => {
    checks.push({ id, ok: !!ok, detail });
    if (!ok) failures++;
  };
  try {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) > 0);
    const hasLightProbe = (await probe(page)).bodies.some(b => 'keyDir' in b);
    await run({ page, check, data, hasLightProbe, viewport });
  } catch (e) {
    check('scenario-completed', false, String(e).slice(0, 300));
  }
  check('no-page-errors', errors.length === 0, errors.slice(0, 3));
  check('no-shader-messages', gl.length === 0, gl.slice(0, 3));
  log({ label, scenario: name, viewport: `${viewport.width}x${viewport.height}`, data, checks });
  await page.close();
}
const shot = (page, viewport, name) =>
  page.screenshot({
    path: join(outDir, `item5-${name}-${viewport.width}x${viewport.height}-${label}.jpg`),
    quality: 80,
  });

await waitForServer();
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  // 1. Solar System, paused and running: every world lit from the Sun; FPS at 1×.
  await scenario(browser, viewport, 'solar-system', async ({ page, check, data, hasLightProbe }) => {
    await page.locator('#clear').click();
    await tool(page, '[data-builder="system"]');
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await sleep(1500);
    await page.locator('#zoom-fit').click();
    await sleep(1500);
    data.fpsRunning1x = await fpsTrace(page, 6);
    await setPaused(page, true);
    await sleep(800);
    await shot(page, viewport, 'solar');
    if (!hasLightProbe) return void (data.light = 'not available on this build');
    const aim = keyLightsAimed(await probe(page));
    data.aim = aim;
    check('worlds-lit-from-sun', aim.ok && aim.emitters === 1 && aim.worlds >= 9, aim);
  });
  // 2. Lone planet: documented fallback; spin turns under a fixed light; camera zoom does not move it.
  await scenario(browser, viewport, 'lone-planet', async ({ page, check, data, hasLightProbe }) => {
    await page.locator('#clear').click();
    await setPaused(page, true);
    await tool(page, '[data-choice="gas"]');
    await page.mouse.click(viewport.width / 2, viewport.height / 2);
    await sleep(500);
    for (let i = 0; i < 4; i++) await page.locator('#zoom-in').click();
    await sleep(900);
    await shot(page, viewport, 'lone-gas');
    if (!hasLightProbe) return void (data.light = 'not available on this build');
    const before = await probe(page),
      world = before.bodies.find(b => b.kind === 'gas');
    check('one-world', before.bodies.length === 1 && world, before.bodies.length);
    check('fallback-key', world.keyLightId === null && dot(world.keyDir, FALLBACK) > 0.9999, world.keyDir);
    await page.locator('[data-speed="10"]').click();
    await setPaused(page, false);
    await sleep(2500);
    await page.locator('#zoom-out').click();
    await sleep(600);
    const after = (await probe(page)).bodies.find(b => b.kind === 'gas');
    data.spin = [world.spin, after.spin];
    check('spin-advanced', Math.abs(after.spin - world.spin) > 0.05, data.spin);
    check('light-unchanged-by-spin-and-camera', dot(after.keyDir, world.keyDir) > 0.9999, after.keyDir);
  });
  // 3. Star + world off to one side, then running at 10×: the key follows the moving source each sample.
  await scenario(browser, viewport, 'star-and-world', async ({ page, check, data, hasLightProbe }) => {
    await page.locator('#clear').click();
    await setPaused(page, true);
    const cx = viewport.width / 2,
      cy = viewport.height * (viewport.width < 700 ? 0.42 : 0.5),
      dx = viewport.width * (viewport.width < 700 ? 0.36 : 0.2);
    await tool(page, '[data-choice="yellow-star"]');
    await page.mouse.click(cx - dx, cy);
    await tool(page, '[data-choice="rocky"]');
    await page.mouse.click(cx + dx, cy - 40);
    await tool(page, '[data-choice="gas"]');
    await page.mouse.click(cx + dx * 0.2, cy - viewport.height * 0.2);
    await sleep(900);
    await shot(page, viewport, 'star-worlds');
    if (!hasLightProbe) return void (data.light = 'not available on this build');
    const first = keyLightsAimed(await probe(page));
    check('paused-aim', first.ok && first.worlds === 2 && first.emitters === 1, first);
    await page.locator('[data-speed="10"]').click();
    await setPaused(page, false);
    const samples = [];
    for (let i = 0; i < 4; i++) {
      await sleep(700);
      const s = await probe(page);
      samples.push({ aim: keyLightsAimed(s), positions: s.bodies.map(b => b.position.map(v => +v.toFixed(2))) });
    }
    data.samples = samples;
    const moved = JSON.stringify(samples[0].positions) !== JSON.stringify(samples.at(-1).positions);
    check('bodies-moved', moved);
    check(
      'aim-tracks-moving-source',
      // A world that merges into the star or leaves the scene ends its own samples (worlds: 0); count the rest.
      samples.filter(s => s.aim.worlds > 0).length >= 2 &&
        samples.filter(s => s.aim.worlds > 0).every(s => s.aim.ok && s.aim.emitters === 1),
      samples.map(s => s.aim),
    );
  });
}
await browser.close();
server.kill();
log({ label, failures });
process.exit(failures ? 1 : 0);
