// Item 7b rendered evidence: per-body black-hole reference scale (picker, linear growth, undo/redo, save/load, merger), physics untouched.
// Usage (from a checkout of the PR head after `pnpm build`):
//   [CHROME_PATH=...] node docs/reviews/simulator-clarity/evidence-harness-7b.mjs [outDir]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc7b-'));
const port = 4189;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failed = 0;
const check = (tag, name, pass, detail) => {
  if (!pass) failed++;
  console.log(JSON.stringify({ tag, check: name, pass, detail }));
};
async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}
async function openTools(page) {
  const t = page.locator('#panel-toggle');
  if ((await t.isVisible()) && (await t.getAttribute('aria-expanded')) === 'false') await t.click();
}
async function closeTools(page) {
  const t = page.locator('#panel-toggle');
  if ((await t.isVisible()) && (await t.getAttribute('aria-expanded')) === 'true') await t.click();
}
const probe = page => page.evaluate(() => window.__sandboxProbe());
async function placeHole(page, viewport, fx, fy) {
  await openTools(page);
  await page.locator('[data-choice="blackhole"]').click();
  await closeTools(page);
  await page.mouse.click(viewport.width * fx, viewport.height * fy);
  await sleep(700);
}
/** Leave Add mode (Escape with nothing open) and click a body to select it; checks the selection landed. */
async function selectAt(page, tag, body, what) {
  await page.evaluate(() => document.activeElement?.blur());
  await page.keyboard.press('Escape');
  await sleep(150);
  const before = await probe(page);
  await page.mouse.click(body.screen[0], body.screen[1]);
  await sleep(300);
  const after = await probe(page);
  check(tag, `select ${what} in inspect mode (no new body)`, !before.placementMode && after.selectedId === body.id && after.bodies.length === before.bodies.length, { placementMode: before.placementMode, selected: after.selectedId, want: body.id, n: after.bodies.length });
}
async function expand(page) {
  if ((await page.locator('#info-expand').isVisible()) && (await page.locator('#info-expand').getAttribute('aria-expanded')) === 'false') {
    await page.locator('#info-expand').click();
    await sleep(250);
  }
}
async function run(browser, viewport) {
  const tag = `${viewport.width}x${viewport.height}`;
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${base}/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) > 0);
  await openTools(page);
  await page.locator('#clear').click();
  await page.locator('#pause').click();
  await closeTools(page);
  await placeHole(page, viewport, 0.42, 0.4);
  let snap = await probe(page);
  check(tag, 'black hole placed and selected', snap.bodies.length === 1 && snap.selectedId === snap.bodies[0].id, snap.bodies.length);
  const a0 = snap.bodies[0];
  const compact = await page.locator('#info-expand').isVisible();
  if (compact) check(tag, 'collapsed sheet hides reference row', !(await page.locator('#reference-row').isVisible()), '');
  await expand(page);
  const picker = page.locator('#bh-reference');
  check(tag, 'reference row visible with picker', (await page.locator('#reference-row').isVisible()) && (await picker.isVisible()), '');
  check(tag, 'default reads model units only', (await picker.inputValue()) === 'none' && /None · model units only/.test(await page.locator('#info-reference').textContent()), await page.locator('#info-reference').textContent());
  const labelFor = await page.locator('label[for="bh-reference"]').textContent();
  check(tag, 'picker has a visible label', labelFor === 'Read as', labelFor);
  const undo0 = snap.undoDepth;
  await picker.selectOption('large-stellar');
  await sleep(250);
  snap = await probe(page);
  const a1 = snap.bodies[0];
  const info30 = await page.locator('#info-reference').textContent();
  check(tag, 'Large stellar reads ≈ 30 M☉, stellar-mass, horizon radius 89 km', /≈ 30 M☉ · Stellar-mass · horizon radius 89 km \(not drawn to scale\)/.test(info30), info30);
  const fit = await page.evaluate(() => {
    const row = document.querySelector('#reference-row'), panel = document.querySelector('#info-panel').getBoundingClientRect();
    const parts = [...row.querySelectorAll('select, small, dt')].map(e => e.getBoundingClientRect());
    return { rowOverflow: row.scrollWidth > row.clientWidth + 1, inside: parts.every(r => r.left >= panel.left - 0.5 && r.right <= panel.right + 0.5), right: Math.max(...parts.map(r => r.right)), panelRight: panel.right };
  });
  check(tag, 'reference row fits inside the panel (no clipping)', !fit.rowOverflow && fit.inside, fit);
  check(tag, 'mass row still model units', /model units$/.test(await page.locator('#info-mass').textContent()), await page.locator('#info-mass').textContent());
  check(tag, 'factor = 30 / model mass', Math.abs(a1.bhReference.solarMassPerModelUnit * a1.mass - 30) < 1e-9 && a1.bhReference.origin === 'large-stellar', a1.bhReference);
  check(tag, 'physics untouched: mass, radius, position equal', a1.mass === a0.mass && a1.radius === a0.radius && a1.position.every((v, i) => v === a0.position[i]), [a0.mass, a1.mass, a0.radius, a1.radius]);
  check(tag, 'change is one undo step', snap.undoDepth === undo0 + 1, [undo0, snap.undoDepth]);
  await page.locator('#undo').click();
  await sleep(400);
  snap = await probe(page);
  check(tag, 'undo restores no reference', snap.bodies[0].bhReference === null, snap.bodies[0].bhReference);
  await page.locator('#redo').click();
  await sleep(400);
  snap = await probe(page);
  check(tag, 'redo restores the 30 M☉ reference', snap.bodies[0].bhReference?.origin === 'large-stellar', snap.bodies[0].bhReference);
  // Reselect after history restore (bodies are rebuilt) and keyboard-change the picker.
  await selectAt(page, tag, snap.bodies[0], 'restored hole');
  await expand(page);
  check(tag, 'picker reflects restored reference', (await picker.inputValue()) === 'large-stellar', await picker.inputValue());
  await page.screenshot({ path: join(outDir, `sc7b-${tag}.png`) });
  // Save, change to none, load: the reference persists through save/load.
  await openTools(page);
  await page.locator('#save-universe').click();
  await sleep(300);
  await closeTools(page);
  snap = await probe(page);
  await selectAt(page, tag, snap.bodies[0], 'saved hole');
  await expand(page);
  await picker.selectOption('none');
  await sleep(200);
  snap = await probe(page);
  check(tag, 'set back to none', snap.bodies[0].bhReference === null, snap.bodies[0].bhReference);
  await openTools(page);
  await page.locator('#load-universe').click();
  await sleep(800);
  await closeTools(page);
  snap = await probe(page);
  check(tag, 'load restores the saved reference', snap.bodies.length === 1 && snap.bodies[0].bhReference?.origin === 'large-stellar', snap.bodies.map(b => b.bhReference));
  // Merger: second hole read as 5 M☉, then run until they merge; referenced masses add.
  await placeHole(page, viewport, 0.5, 0.4);
  await expand(page);
  await picker.selectOption('small-stellar');
  await sleep(200);
  snap = await probe(page);
  const solarBefore = snap.bodies.reduce((s, b) => s + (b.bhReference ? b.bhReference.solarMassPerModelUnit * b.mass : 0), 0);
  check(tag, 'two referenced holes total 35 M☉', snap.bodies.length === 2 && Math.abs(solarBefore - 35) < 1e-9, solarBefore);
  await openTools(page);
  await page.locator('#pause').click();
  await closeTools(page);
  await page.waitForFunction(() => window.__sandboxProbe().bodies.length === 1, null, { timeout: 30000 }).catch(() => {});
  await openTools(page);
  await page.locator('#pause').click();
  await closeTools(page);
  snap = await probe(page);
  const s = snap.bodies[0];
  const solarAfter = s && s.bhReference ? s.bhReference.solarMassPerModelUnit * s.mass : NaN;
  check(tag, 'merged survivor reference = 35 M☉, origin merged', snap.bodies.length === 1 && s.bhReference?.origin === 'merged' && Math.abs(solarAfter - 35) < 1e-6, { n: snap.bodies.length, ref: s?.bhReference, mass: s?.mass, solarAfter });
  if (snap.bodies.length === 1) {
    await selectAt(page, tag, s, 'merged survivor');
    await expand(page);
    const mergedInfo = await page.locator('#info-reference').textContent();
    check(tag, 'inspector shows merged ≈ 35 M☉ and picker shows Merged remnant', /≈ 35 M☉/.test(mergedInfo) && (await picker.inputValue()) === 'merged', [mergedInfo, await picker.inputValue()]);
  }
  const box = await page.locator('#info-panel').boundingBox();
  check(tag, 'panel within viewport width', box && box.x >= 0 && box.x + box.width <= viewport.width + 0.5, box);
  // A non-black-hole hides the row.
  await openTools(page);
  await page.locator('[data-choice="rocky"]').click();
  await closeTools(page);
  await page.mouse.click(viewport.width * 0.25, viewport.height * 0.2);
  await sleep(600);
  check(tag, 'rocky selection hides reference row', !(await page.locator('#reference-row').isVisible()), await page.locator('#info-type').textContent());
  check(tag, 'no page/console errors', errors.length === 0, errors);
  await page.close();
}
try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) await run(browser, viewport);
  await browser.close();
} finally {
  server.kill();
}
console.log(JSON.stringify({ summary: true, failed }));
process.exit(failed ? 1 : 0);
