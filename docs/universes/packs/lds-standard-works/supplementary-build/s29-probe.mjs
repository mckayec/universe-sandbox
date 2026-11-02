// Checkpoint 29 probe (S28-V1): the frame that completes a programmatic jump must lay out labels with fades off.
// Surface path: start settled on one site, then select the site farthest from it (largest angular separation) and
// block the main thread past the turn/fly duration, so the next frame finishes the whole jump at once (the delayed
// completing frame). Galaxy path: settle on the overview, then fly to the world the same way.
// A recorder rAF callback, registered after the atlas frame, logs each frame's motion flags and #labels.jump.
// Checks: every frame that ends motion (moving at entry, not after) has jump on; jump stays on for the next frame;
// fades come back (jump off) once quiescent. Also checks site labels at the completed state against their pins.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s29-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4181;
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(page0)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const errors = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);

const settle = tab =>
  tab.waitForFunction(
    () => {
      const A = window.__atlas;
      return !A.orbG.fly && !A.orbW.fly && !A.PL?.turn && !document.querySelector('#labels').classList.contains('jump');
    },
    null,
    { timeout: 300000, polling: 250 },
  );
const startRecorder = tab =>
  tab.evaluate(() => {
    const A = window.__atlas;
    window.__rec = [];
    window.__recOn = true;
    const step = () => {
      if (!window.__recOn) return;
      window.__rec.push({
        moving: A.S.view === 'galaxy' ? !!A.orbG.fly : !!A.PL?.turn || !!A.orbW.fly,
        jump: document.querySelector('#labels').classList.contains('jump'),
        view: A.S.view,
      });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
// rec[0] is the state right after the jump was started (before any frame); moving -> not moving transitions; the recorder runs after the atlas frame, so rec[i] is the state frame i left
function checkRecord(rec, name) {
  let ends = 0;
  for (let i = 1; i < rec.length; i++) {
    if (rec[i - 1].moving && !rec[i].moving) {
      ends++;
      assert.ok(rec[i].jump, `${name}: completing frame ${i} laid out with fades on`);
      if (i + 1 < rec.length) assert.ok(rec[i + 1].jump, `${name}: frame after completion restored fades too early`);
    }
  }
  assert.ok(ends >= 1, `${name}: no completing frame recorded (${rec.length} frames)`);
  assert.equal(rec.at(-1).jump, false, `${name}: fades never restored`);
  return ends;
}
const stalePins = tab =>
  tab.evaluate(() => {
    const A = window.__atlas;
    const cam = A.orbW.cam;
    cam.updateMatrixWorld();
    let vis = 0;
    let stale = 0;
    for (const o of A.SITE_EL) {
      if (+getComputedStyle(o.el).opacity <= 0.05) continue;
      const m = /translate\(([-\d.e]+)px,\s*([-\d.e]+)px\)/.exec(o.el.style.transform);
      if (!m) continue;
      vis++;
      const v = o.dir.clone().applyQuaternion(A.PL.root.quaternion).multiplyScalar(1.004).project(cam);
      const d = Math.hypot((v.x * 0.5 + 0.5) * innerWidth - 7 - +m[1], (-v.y * 0.5 + 0.5) * innerHeight - 13 - +m[2]);
      if (d > 4) stale++;
    }
    return { vis, stale };
  });

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(300000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text())) errors.push(m.text());
  });
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await tab.goto(page0, { waitUntil: 'domcontentloaded' });
  await tab.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'), null, { timeout: 300000 });
  log('loaded');

  // galaxy path: overview first, then a delayed completing frame for the fly to the world
  await tab.evaluate(() => window.__atlas.flyGalaxy());
  await settle(tab);
  await startRecorder(tab);
  const world = await tab.evaluate(() => {
    const A = window.__atlas;
    const id = Object.keys(A.WORLD_BY)[0];
    A.selectWorld(id, true);
    window.__rec.push({ moving: !!A.orbG.fly, jump: null, view: 'start of jump (before any frame)' });
    const until = performance.now() + 2300; // fly lasts 1900 ms: the next frame completes it
    while (performance.now() < until);
    return id;
  });
  await settle(tab);
  await tab.waitForTimeout(800);
  let rec = await tab.evaluate(() => ((window.__recOn = false), window.__rec));
  const gEnds = checkRecord(rec, 'galaxy');
  log(`galaxy path passed: ${rec.length} frames, ${gEnds} completing frame(s), world ${world}`);

  // surface path: settle on a site, then jump to the farthest site with a delayed completing frame
  await tab.evaluate(id => window.__atlas.descend(id), world);
  await tab.waitForFunction(() => window.__atlas.S.view === 'world' && window.__atlas.PL, null, { timeout: 300000 });
  const pair = await tab.evaluate(() => {
    const els = window.__atlas.SITE_EL;
    let best = [els[0], els[1], -2];
    for (const a of els) for (const b of els) if (-a.dir.dot(b.dir) > best[2]) best = [a, b, -a.dir.dot(b.dir)];
    window.__atlas.selectSite(best[0].s.id);
    return { from: best[0].s.id, to: best[1].s.id, deg: Math.round((Math.acos(-best[2]) * 180) / Math.PI) };
  });
  await settle(tab);
  log(`settled on ${pair.from}; jumping ${pair.deg} degrees to ${pair.to}`);
  await startRecorder(tab);
  await tab.evaluate(to => {
    const A = window.__atlas;
    A.selectSite(to);
    window.__rec.push({ moving: !!A.PL?.turn || !!A.orbW.fly, jump: null, view: 'start of jump (before any frame)' });
    const until = performance.now() + 2000; // turn 1500 ms, fly 1500 ms
    while (performance.now() < until);
  }, pair.to);
  await settle(tab);
  await tab.waitForTimeout(800);
  rec = await tab.evaluate(() => ((window.__recOn = false), window.__rec));
  const sEnds = checkRecord(rec, 'surface');
  const pins = await stalePins(tab);
  assert.equal(pins.stale, 0, 'visible site labels off their pins at the completed state');
  log(`surface path passed: ${rec.length} frames, ${sEnds} completing frame(s); completed state ${JSON.stringify(pins)}`);
  assert.deepEqual(errors, [], 'console errors or failed resources');
  log('PASS (no console errors, no >=400 resources)');
} finally {
  await browser.close();
  server.kill();
}
