// Checkpoint 27 probe: S26 PGM-qg06-zion source-discussion link, S25-V1 label alignment measured against the camera
// (while turning and at an observed completed state), and the event-focus race (reopen codex / change a layer filter
// immediately after an event link).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s27-probe.mjs
// Writes PNGs to $SHOTS (optional). Exits non-zero on the first failed check. Console errors are collected unfiltered
// (resource failures included); only SwiftShader driver notices are ignored.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4179;
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
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL/i.test(m.text())) errors.push(`console: ${m.text()}`);
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

// Largest distance (px) between each visible site label and the projection of its pin with the camera as it is now.
// Run between frames: the engine has laid out labels and rendered, so both use the same camera state if labels are
// current. Returns { n, max, turning, flying, bake }.
const alignment = tab =>
  tab.evaluate(() => {
    const A = window.__atlas;
    const cam = A.orbW.cam;
    cam.updateMatrixWorld();
    const W = innerWidth;
    const H = innerHeight;
    let max = 0;
    let n = 0;
    for (const o of A.SITE_EL) {
      if (+o.el.style.opacity < 0.5) continue;
      const m = /translate\(([-\d.e]+)px,\s*([-\d.e]+)px\)/.exec(o.el.style.transform);
      if (!m) continue;
      const v = o.dir.clone().applyQuaternion(A.PL.root.quaternion).multiplyScalar(1.004).project(cam);
      const x = (v.x * 0.5 + 0.5) * W - 7;
      const y = (-v.y * 0.5 + 0.5) * H - 13;
      max = Math.max(max, Math.hypot(x - +m[1], y - +m[2]));
      n++;
    }
    return { n, max, turning: !!A.PL?.turn, flying: !!A.orbW.fly, bake: !document.querySelector('#bake').hidden };
  });
const completed = tab =>
  tab.waitForFunction(
    () => {
      const A = window.__atlas;
      return document.querySelector('#bake').hidden && A.PL && !A.PL.turn && !A.orbW.fly && A.S.site === 'kirtland-temple';
    },
    null,
    { timeout: 600000, polling: 500 },
  );

try {
  // 1. PGP discussion card → P17 (PGP view), keyboard; the P17 view lists both its links and links back
  let { ctx, tab } = await open('', { width: 1440, height: 900 });
  log('desktop loaded');
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'pgp-more');
  const z = item(tab, 'PGM-qg06-zion');
  await z.scrollIntoViewIfNeeded();
  const zr = z.locator('.cx-ref');
  assert.equal(await zr.count(), 1);
  assert.equal((await zr.locator('.cx-rel').textContent()).trim(), 'describes Enoch’s community and city:');
  await zr.locator('.cx-see').focus();
  await tab.keyboard.press('Enter', { noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'P17-pgp-enoch-city');
  const pr = item(tab, 'P17-pgp-enoch-city').locator('.cx-ref');
  assert.deepEqual(
    (await pr.allTextContents()).map(s => s.replace(/\s+/g, ' ').trim()),
    ['Enoch’s city in another account: Enoch’s city (Zion)', 'Moses 7 teaching and promise: Zion in Moses 7'],
  );
  if (shots) await tab.screenshot({ path: `${shots}/s27-zion-link-1440x900.png` });
  await pr.nth(1).locator('.cx-see').click({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'PGM-qg06-zion');
  log('check 1 passed (PGM-qg06-zion ↔ P17-pgp-enoch-city, keyboard and click)');

  // 2. S25-V1: event jump from a dossier link; label alignment sampled while moving and at a completed state
  await section(tab, 'dc-more');
  const dd = item(tab, 'DCM-dd109-dedication-prayer');
  await dd.scrollIntoViewIfNeeded();
  await dd.locator('[data-see-ev="kirtland-dedication"]').click({ noWaitAfter: true });
  await tab.waitForFunction(() => !!document.querySelector('#dossier [data-ev="kirtland-dedication"].open'), null, {
    timeout: 300000,
  });
  const samples = [];
  let movingShot = false;
  for (let i = 0; i < 400; i++) {
    const s = await alignment(tab);
    if (s.n) samples.push(s);
    if (s.n && (s.turning || s.flying) && !movingShot && shots) {
      await tab.screenshot({ path: `${shots}/s27-event-moving-1440x900.png` });
      movingShot = true;
    }
    if (!s.turning && !s.flying && !s.bake && samples.length > 3) break;
    await tab.waitForTimeout(250);
  }
  await completed(tab);
  const done = await alignment(tab);
  samples.push(done);
  if (shots) await tab.screenshot({ path: `${shots}/s27-event-completed-1440x900.png` });
  const moving = samples.filter(s => s.turning || s.flying);
  const worst = Math.max(...samples.map(s => s.max));
  log(
    `alignment: ${samples.length} samples (${moving.length} while turning/flying), worst ${worst.toFixed(2)} px; ` +
      `completed: ${done.n} labels, max ${done.max.toFixed(2)} px, bake hidden ${!done.bake}`,
  );
  assert.ok(done.n > 0 && !done.bake, 'completed state has labels and no surface progress bar');
  assert.ok(worst < 1.5, `labels within 1.5 px of their pins in every sampled frame (worst ${worst})`);
  log('check 2 passed (labels aligned while moving and when completed)');

  // 3a. race: event link, then the codex is reopened before the 60 ms focus callback; focus must stay in the codex
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await section(tab, 'dc-more');
  await item(tab, 'DCM-dd137-alvin-vision').scrollIntoViewIfNeeded();
  await tab.evaluate(() => {
    document.querySelector('#cxBody [data-key="DCM-dd137-alvin-vision"] [data-see-ev]').click();
    document.querySelector('#cxBtn').click();
  });
  await tab.waitForTimeout(1500);
  const r1 = await tab.evaluate(() => ({
    codexOpen: !document.querySelector('#codex').hidden,
    focusInDossierEvent: !!document.activeElement?.closest('#dossier [data-ev]'),
  }));
  assert.deepEqual(r1, { codexOpen: true, focusInDossierEvent: false });
  log('check 3a passed (no focus steal after an immediate codex reopen)');

  // 3b. race: event link, then the event's layer is switched off at once; the hidden event must not take focus
  await item(tab, 'DCM-dd109-dedication-prayer').scrollIntoViewIfNeeded();
  await tab.evaluate(() => {
    document.querySelector('#cxBody [data-key="DCM-dd109-dedication-prayer"] [data-see-ev]').click();
    document.querySelector('#filters [data-layer="dc"]').click();
  });
  await tab.waitForTimeout(1500);
  const r2 = await tab.evaluate(() => ({
    dcOff: !!window.__atlas.S.layers && !window.__atlas.S.layers.has('dc'),
    focusOnEvent: document.activeElement?.closest('[data-ev]')?.dataset.ev || null,
  }));
  assert.deepEqual(r2, { dcOff: true, focusOnEvent: null });
  log('check 3b passed (no focus on an event hidden by a filter change)');
  await ctx.close();

  // 4. D&C only: the PGP discussion card is never shown; the PGP P17 view is named as filtered from the D&C view
  ({ ctx, tab } = await open('#layers=dc', { width: 1440, height: 900 }));
  await tab.locator('#cxBtn').click({ noWaitAfter: true });
  const tabs = await tab.locator('#cxTabs [data-tab]').evaluateAll(b => b.map(x => x.dataset.tab));
  for (const id of tabs) {
    await section(tab, id);
    assert.equal(await tab.locator('#cxBody [data-key="PGM-qg06-zion"], #cxBody [data-see="PGM-qg06-zion"]').count(), 0);
  }
  await section(tab, 'unmapped-places');
  const d4 = item(tab, 'P17-dc-enoch-city');
  assert.equal(await d4.locator('.cx-see').count(), 0);
  assert.match(
    await d4.locator('.cx-also').textContent(),
    /Enoch’s city in another account: Enoch’s city \(Zion\) \(hidden by the layer or year filter\)/,
  );
  log(`check 4 passed (D&C-only: Moses 7 card absent from all ${tabs.length} sections)`);
  await ctx.close();

  // 5. phone, PGP only, touch: tap the link on the Moses 7 card
  ({ ctx, tab } = await open('#layers=pgp', { width: 390, height: 844 }));
  await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  await section(tab, 'pgp-more');
  const b5 = item(tab, 'PGM-qg06-zion').locator('.cx-see');
  await b5.scrollIntoViewIfNeeded();
  const box = await b5.boundingBox();
  assert.ok(box && box.height >= 24 && box.x + box.width <= 390, 'target size and fit');
  await b5.tap({ noWaitAfter: true });
  await tab.waitForFunction(() => document.activeElement?.closest('.cx-item')?.dataset.key === 'P17-pgp-enoch-city');
  if (shots) await tab.screenshot({ path: `${shots}/s27-zion-390x844.png` });
  log('check 5 passed (PGP-only touch on phone)');
  await ctx.close();

  console.log(`resource failures: ${resources.length ? resources.join('; ') : 'none'}`);
  assert.deepEqual(errors, []);
  assert.deepEqual(resources, []);
  console.log('Checkpoint 27 probe passed: 6 checks, alignment measured, no console errors or failed resources.');
} finally {
  await browser.close();
  server.kill();
}
