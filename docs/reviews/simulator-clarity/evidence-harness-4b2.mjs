// Slice 4b-2 enforced rendered evidence (SC4-E1): survivor identity and pause assertions, protostar disk response,
// orbiting unequal-mass binary with a mass-transfer disk, and disk readability periods.
// Usage (from a checkout of the PR head, after `pnpm install --frozen-lockfile && pnpm build`):
//   [CHROME_PATH=/path/to/chrome] node docs/reviews/simulator-clarity/evidence-harness-4b2.mjs [outDir]
// Serves the production build with `vite preview` and opens it with `?probe=1`, which installs the read-only
// `window.__sandboxProbe()` (src/ui/test-probe.ts). Drives Chromium with SwiftShader software GL (not a real GPU).
// Prints one JSON line per scenario with every assertion; exits 1 if any assertion fails.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc4b2-'));
const port = 4183;
const base = `http://127.0.0.1:${port}/?probe=1`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: 'ignore' },
);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = row => console.log(JSON.stringify(row));
let failures = 0;

/** Survivor rule: exactly one of the pair remains, it is selected, and the swallowed ID is gone. Pure, so it can be negative-tested. */
export function survivorCheck(pairIds, after) {
  const ids = after.bodies.map(b => b.id),
    survivors = pairIds.filter(id => ids.includes(id)),
    swallowed = pairIds.filter(id => !ids.includes(id));
  return {
    ok: ids.length === 1 && survivors.length === 1 && swallowed.length === 1 && after.selectedId === survivors[0],
    survivor: survivors[0] ?? null,
    swallowed: swallowed[0] ?? null,
    selectedId: after.selectedId,
  };
}

/** Three samples: all active, moving one way only, and each step no larger than the previous one. */
export function settles([a, b, c]) {
  const d1 = b - a,
    d2 = c - b;
  return a > 0 && b > 0 && c > 0 && d1 * d2 >= 0 && Math.abs(d2) <= Math.abs(d1) + 1e-6 && Math.abs(d2) < 0.05;
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

async function place(page, x, y) {
  await setTools(page, true);
  await page.locator('[data-choice="blackhole"]').click();
  if (page.viewportSize().width < 700) await setTools(page, false);
  await page.mouse.click(x, y);
}

const text = (page, sel) => page.locator(sel).textContent();
const probe = page => page.evaluate(() => window.__sandboxProbe());

async function openPage(browser, viewport) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
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
  return { page, errors, glMessages };
}

function checker() {
  const checks = [];
  const check = (name, ok, detail) => {
    checks.push({ name, ok: !!ok, detail });
    if (!ok) failures++;
  };
  return { checks, check };
}

async function openExhibit(page, id) {
  await page.locator('#exhibits-button').click();
  await page.locator(`[data-exhibit="${id}"]`).click();
  await sleep(800);
}

async function mergerScenario(browser, viewport, gap) {
  const { page, errors, glMessages } = await openPage(browser, viewport);
  const { checks, check } = checker();
  const tag = `merge-${viewport.width}x${viewport.height}`;
  check('probe installed', (await page.evaluate(() => typeof window.__sandboxProbe)) === 'function', null);
  await setTools(page, true);
  await page.locator('#clear').click();
  await page.locator('#pause').click();
  const paused = await probe(page);
  check('paused before placement (probe)', paused.paused === true && paused.bodies.length === 0, paused);
  const cx = viewport.width * 0.5,
    cy = viewport.height * 0.45;
  await place(page, cx - gap / 2, cy);
  await sleep(1200);
  await place(page, cx + gap / 2, cy);
  await sleep(1500);
  const pair = await probe(page);
  const pairIds = pair.bodies.map(b => b.id);
  check('still paused after both placements', pair.paused === true, pair.paused);
  check('two black holes, newest selected', pairIds.length === 2 && pair.selectedId === pairIds[1], pair);
  const pairDisk = await text(page, '#info-disk');
  check('paired disk responds (heuristic estimate)', /by .+heuristic estimate/.test(pairDisk), pairDisk);
  await page.locator('#pause').click();
  await page.locator('[data-speed="10"]').click();
  await sleep(6000);
  const after = await probe(page);
  const s = survivorCheck(pairIds, after);
  check('survivor ID selected, swallowed ID absent (probe)', s.ok, s);
  check('running at 10x', after.paused === false && after.speed === 10, { paused: after.paused, speed: after.speed });
  const disk = await text(page, '#info-disk');
  check('survivor disk undisturbed after merger', disk === 'Undisturbed', disk);
  await page.screenshot({ path: join(outDir, `sc4b2-${tag}.jpg`), quality: 70 });
  check('no page/console errors', errors.length === 0, errors);
  check('no shader/WebGL program messages', glMessages.length === 0, glMessages);
  log({ tag, gap, checks });
  await page.close();
}

async function protostarScenario(browser, viewport) {
  const { page, errors, glMessages } = await openPage(browser, viewport);
  const { checks, check } = checker();
  const tag = `protostar-${viewport.width}x${viewport.height}`;
  await openExhibit(page, 'build-star');
  // An unformed protostar disk is tiny (it grows over ~9 simulated seconds of age), so a paused, newborn nursery is
  // correctly quiet. Let the disks form at 5x, then pause and assert.
  const newborn = await probe(page);
  const bornSelected = newborn.bodies.find(b => b.id === newborn.selectedId);
  check(
    'newborn protostar disk is quiet before it forms',
    bornSelected?.kind === 'protostar' && !(bornSelected.tide > 0),
    bornSelected,
  );
  await page.locator('[data-speed="5"]').click();
  await sleep(4000);
  const running = await probe(page);
  check('running at 5x', running.paused === false && running.speed === 5, running.speed);
  await page.screenshot({ path: join(outDir, `sc4b2-${tag}-5x.jpg`), quality: 70 });
  await page.locator('#pause').click();
  await sleep(1500);
  const snap = await probe(page);
  const protos = snap.bodies.filter(b => b.kind === 'protostar');
  check('paused (probe)', snap.paused === true, snap.paused);
  check('two protostars in the nursery', protos.length === 2, snap.bodies);
  const selected = snap.bodies.find(b => b.id === snap.selectedId);
  check('a protostar is selected', selected?.kind === 'protostar', selected);
  const other = protos.find(b => b.id !== snap.selectedId);
  const disk = await text(page, '#info-disk');
  check(
    'formed protostar disk names the other protostar, not the nebula (heuristic estimate)',
    !!other && disk.includes(other.name) && /heuristic estimate/.test(disk),
    disk,
  );
  check('protostar encounter strength > 0 (probe)', (selected?.tide ?? 0) > 0, selected?.tide);
  // While paused nothing moves, so the tide settles monotonically on a fixed target instead of drifting or
  // oscillating (it relaxes on frame time; SwiftShader frames are slow, so it may still be closing in).
  const series = [];
  for (let i = 0; i < 3; i++) {
    await sleep(2000);
    series.push((await probe(page)).bodies.find(b => b.id === snap.selectedId)?.tide);
  }
  check('paused protostar tide settles monotonically (bodies frozen)', settles(series), series);
  await page.screenshot({ path: join(outDir, `sc4b2-${tag}-paused.jpg`), quality: 70 });
  check('no page/console errors', errors.length === 0, errors);
  check('no shader/WebGL program messages', glMessages.length === 0, glMessages);
  log({ tag, checks });
  await page.close();
}

async function binaryTransferScenario(browser, viewport) {
  const { page, errors, glMessages } = await openPage(browser, viewport);
  const { checks, check } = checker();
  const tag = `binary-${viewport.width}x${viewport.height}`;
  await openExhibit(page, 'binary-stars');
  const start = await probe(page);
  const stars = start.bodies.filter(b => b.kind === 'star');
  check('two stars in the binary exhibit', stars.length === 2, start.bodies);
  await page.locator('[data-speed="10"]').click();
  let found = null,
    seconds = 0;
  for (; seconds < 60 && !found; seconds += 2) {
    await sleep(2000);
    const s = await probe(page);
    found = s.transferDisks.find(d => d.visible && (d.tide ?? 0) > 0) ?? null;
  }
  check('orbiting unequal binary develops a tidally truncated transfer disk', !!found, { found, seconds });
  if (found) {
    await page.locator('#pause').click();
    const same = d => d.donorId === found.donorId && d.receiverId === found.receiverId;
    const series = [];
    for (let i = 0; i < 3; i++) {
      await sleep(2000);
      series.push((await probe(page)).transferDisks.find(same)?.tide);
    }
    check('paused transfer-disk tide settles monotonically (bodies frozen)', settles(series), series);
    await page.screenshot({ path: join(outDir, `sc4b2-${tag}-transfer-paused.jpg`), quality: 70 });
  }
  check('no page/console errors', errors.length === 0, errors);
  check('no shader/WebGL program messages', glMessages.length === 0, glMessages);
  log({ tag, checks });
  await page.close();
}

try {
  // Negative controls for the survivor rule: a stale swallowed selection, no selection, and both bodies left.
  const neg = [
    survivorCheck([1, 2], { selectedId: 1, bodies: [{ id: 2 }] }),
    survivorCheck([1, 2], { selectedId: null, bodies: [{ id: 2 }] }),
    survivorCheck([1, 2], { selectedId: 2, bodies: [{ id: 1 }, { id: 2 }] }),
  ];
  const pos = survivorCheck([1, 2], { selectedId: 2, bodies: [{ id: 2 }] });
  const settleNeg = [settles([0.5, 0.7, 0.5]), settles([0.5, 0.52, 0.6]), settles([0, 0, 0])];
  const negOk = neg.every(r => !r.ok) && pos.ok && settleNeg.every(x => !x) && settles([0.87, 0.88, 0.884]);
  if (!negOk) failures++;
  log({
    check:
      'negative controls: survivor rule rejects stale/missing/unmerged selection; settle rule rejects oscillation, acceleration and quiet',
    ok: negOk,
  });
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  await mergerScenario(browser, { width: 1440, height: 900 }, 150);
  await mergerScenario(browser, { width: 390, height: 844 }, 90);
  await protostarScenario(browser, { width: 1440, height: 900 });
  await protostarScenario(browser, { width: 390, height: 844 });
  await binaryTransferScenario(browser, { width: 1440, height: 900 });
  await browser.close();
  log({ outDir, failures });
} finally {
  server.kill();
}
process.exit(failures ? 1 : 0);
