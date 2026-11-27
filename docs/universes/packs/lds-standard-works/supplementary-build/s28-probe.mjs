// Checkpoint 28 probe: S27-C1 in the browser (event link, then codex reopen+close before the queued focus) and the
// label fade during a programmatic turn: no label may be visibly fading at a stale position while #labels.jump is on.
// Records moving and completed shots.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s28-probe.mjs
// Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check. Console errors are collected unfiltered
// (resource failures included); only SwiftShader driver notices are ignored.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4180;
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
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
const resources = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);

async function open(hash, vp) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600 });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  tab.on('requestfailed', r => resources.push(`${r.failure()?.errorText} ${r.url()}`));
  tab.on('response', r => {
    if (r.status() >= 400) resources.push(`${r.status()} ${r.url()}`);
  });
  await tab.goto(page0 + hash, { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
    timeout: 300000,
  });
  return { ctx, tab };
}
async function section(tab, id) {
  if (await tab.locator('#cxPick').isVisible()) await tab.locator('#cxPick').selectOption(id);
  else await tab.locator(`#cxTabs [data-tab="${id}"]`).click({ noWaitAfter: true });
}
const item = (tab, key) => tab.locator(`#cxBody .cx-item[data-key="${key}"]`);
// Every site label the user can see (computed opacity > 0.05, i.e. including labels still fading) compared with the
// projection of its pin. Returns { vis, stale, max, jump, turning, flying, bake }.
const visible = tab =>
  tab.evaluate(() => {
    const A = window.__atlas;
    const cam = A.orbW.cam;
    cam.updateMatrixWorld();
    const W = innerWidth;
    const H = innerHeight;
    let max = 0;
    let vis = 0;
    let stale = 0;
    for (const o of A.SITE_EL) {
      if (+getComputedStyle(o.el).opacity <= 0.05) continue;
      const m = /translate\(([-\d.e]+)px,\s*([-\d.e]+)px\)/.exec(o.el.style.transform);
      if (!m) continue;
      vis++;
      const v = o.dir.clone().applyQuaternion(A.PL.root.quaternion).multiplyScalar(1.004).project(cam);
      const d = Math.hypot((v.x * 0.5 + 0.5) * W - 7 - +m[1], (-v.y * 0.5 + 0.5) * H - 13 - +m[2]);
      if (d > 4) stale++;
      max = Math.max(max, d);
    }
    return {
      vis,
      stale,
      max: Math.round(max),
      jump: document.querySelector('#labels').classList.contains('jump'),
      turning: !!A.PL?.turn,
      flying: !!A.orbW.fly,
      bake: !document.querySelector('#bake').hidden,
    };
  });

try {
  const { tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  // 1. S27-C1 in the browser: event link, then reopen and close the codex in the same task, before the 60 ms callback
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'dc-more');
  const dd = item(tab, 'DCM-dd109-dedication-prayer');
  await dd.scrollIntoViewIfNeeded();
  await tab.evaluate(() => {
    document.querySelector('#cxBody [data-see-ev="kirtland-dedication"]').click();
    document.querySelector('#cxBtn').click();
    document.querySelector('#cxClose').click();
  });
  await tab.waitForTimeout(1500);
  assert.equal(await tab.evaluate(() => document.activeElement?.id), 'cxBtn', 'restored Codex button keeps focus');
  assert.ok(await tab.locator('#codex').isHidden());
  log('check 1 passed (reopen+close before queued focus: #cxBtn keeps focus)');

  // 2. normal activation still focuses the event; then sample visible labels through the turn to Kirtland
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'dc-more');
  await item(tab, 'DCM-dd109-dedication-prayer').scrollIntoViewIfNeeded();
  await tab.locator('#cxBody [data-see-ev="kirtland-dedication"]').click({ noWaitAfter: true });
  const samples = [];
  let movingShot = false;
  for (let i = 0; i < 2400; i++) {
    const s = await visible(tab);
    samples.push(s);
    if ((s.turning || s.flying) && !movingShot && shots) {
      await tab.screenshot({ path: `${shots}/s28-event-moving-1440x900.png` });
      movingShot = true;
    }
    if (!s.turning && !s.flying && !s.bake && i > 3) {
      const sel = await tab.evaluate(() => window.__atlas.S.site);
      if (sel === 'kirtland-temple') break;
    }
    await tab.waitForTimeout(250);
  }
  const moving = samples.filter(s => s.turning || s.flying);
  log(`samples ${samples.length}, moving ${moving.length}: ${JSON.stringify(moving.slice(0, 6))}`);
  assert.ok(moving.length > 0, 'at least one sample taken while the view was moving');
  assert.ok(
    moving.every(s => s.jump),
    'fade switched off for every moving sample',
  );
  assert.ok(
    moving.every(s => s.stale === 0),
    'no visibly fading label at a stale position while moving',
  );
  await tab.waitForTimeout(800);
  const done = await visible(tab);
  log(`completed: ${JSON.stringify(done)}`);
  assert.equal(done.jump, false, 'fade restored after the turn');
  assert.equal(done.stale, 0);
  assert.ok(done.vis > 3);
  assert.equal(
    await tab.evaluate(() => document.activeElement?.closest('[data-ev]')?.dataset.ev),
    'kirtland-dedication',
    'normal activation focuses the event',
  );
  if (shots) await tab.screenshot({ path: `${shots}/s28-event-completed-1440x900.png` });
  log('check 2 passed');
  assert.deepEqual(errors, [], errors.join('\n'));
  assert.deepEqual(resources, [], resources.join('\n'));
  log('PASS (no console errors, no failed or >=400 resources)');
} finally {
  await browser.close();
  server.kill();
}
