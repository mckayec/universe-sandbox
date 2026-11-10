// SC7-E1 rendered evidence: the black-hole "Read as" picker is reachable by keyboard (Tab), scrolled
// into the visible part of the inspector at short landscape, operable with arrow keys, and its
// readout is visible after the change. Enforced: exits 1 on any failed check.
// Usage (from a checkout of the PR head after `pnpm build`):
//   [CHROME_PATH=...] node docs/reviews/simulator-clarity/evidence-harness-7c.mjs [outDir]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc7c-'));
const port = 4194;
const base = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: ['pipe', 'pipe', 'pipe'] },
);
server.stdout.resume(); // drain vite output (an ignored stdio made preview exit in this sandbox)
server.stderr.resume();
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failed = 0;
const check = (tag, name, pass, detail) => {
  if (!pass) failed++;
  console.log(JSON.stringify({ tag, check: name, pass, detail }));
};
async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}
async function toggleTools(page, open) {
  const t = page.locator('#panel-toggle');
  if (!(await t.isVisible())) return;
  const expanded = (await t.getAttribute('aria-expanded')) === 'true';
  if (expanded !== open) await t.click();
}
const probe = page => page.evaluate(() => window.__sandboxProbe());

/** Geometry of picker + readout against the viewport and every clipping (scrolling) ancestor. */
function visibility(page) {
  return page.evaluate(() => {
    const ids = ['bh-reference', 'info-reference'];
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      const r = el.getBoundingClientRect();
      let clip = { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
      for (let p = el.parentElement; p; p = p.parentElement) {
        const cs = getComputedStyle(p);
        if (/(auto|scroll|hidden)/.test(cs.overflowY + cs.overflowX)) {
          const pr = p.getBoundingClientRect();
          clip = {
            top: Math.max(clip.top, pr.top),
            bottom: Math.min(clip.bottom, pr.bottom),
            left: Math.max(clip.left, pr.left),
            right: Math.min(clip.right, pr.right),
          };
        }
      }
      // Topmost element at the centre must be the control itself (not covered by another layer).
      const cx = (r.left + r.right) / 2;
      const cy = (r.top + r.bottom) / 2;
      const hit = document.elementFromPoint(cx, cy);
      out[id] = {
        rect: [r.left, r.top, r.right, r.bottom].map(v => Math.round(v)),
        clip: [clip.left, clip.top, clip.right, clip.bottom].map(v => Math.round(v)),
        fullyVisible:
          r.height > 0 &&
          r.top >= clip.top - 0.5 &&
          r.bottom <= clip.bottom + 0.5 &&
          r.left >= clip.left - 0.5 &&
          r.right <= clip.right + 0.5,
        unobstructed: !!hit && (hit === el || el.contains(hit)),
      };
    }
    return out;
  });
}

async function run(browser, viewport) {
  const tag = `${viewport.width}x${viewport.height}`;
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(`${base}/?probe=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) > 0);
  await toggleTools(page, true);
  await page.locator('#clear').click();
  await page.locator('#pause').click();
  await page.locator('[data-choice="blackhole"]').click();
  await toggleTools(page, false);
  await page.mouse.click(viewport.width * 0.42, viewport.height * 0.4);
  await sleep(700);
  let snap = await probe(page);
  check(
    tag,
    'black hole placed and selected',
    snap.bodies.length === 1 && snap.selectedId === snap.bodies[0].id,
    snap.bodies.length,
  );
  const a0 = snap.bodies[0];
  const expandBtn = page.locator('#info-expand');
  if (await expandBtn.isVisible()) {
    // Expand the compact sheet with the keyboard, not a click.
    await expandBtn.focus();
    await page.keyboard.press('Enter');
    await sleep(300);
    check(tag, 'compact sheet expanded via keyboard', (await expandBtn.getAttribute('aria-expanded')) === 'true', '');
  }
  // Reach the picker with Tab only (bounded), starting from the panel's first focusable element.
  await page.evaluate(() => {
    const first = document.querySelector('#info-panel button, #info-panel select, #info-panel [tabindex="0"]');
    (first || document.body).focus();
  });
  let tabs = 0;
  let reached = false;
  const path = [];
  for (; tabs < 60; tabs++) {
    const id = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
    path.push(id);
    if (id === 'bh-reference') {
      reached = true;
      break;
    }
    await page.keyboard.press('Tab');
    await sleep(40);
  }
  check(tag, 'picker reachable by Tab from the inspector', reached, { tabs, path: path.slice(-6) });
  const focus = await page.evaluate(() => {
    const el = document.getElementById('bh-reference');
    const cs = getComputedStyle(el);
    const label = document.querySelector('label[for="bh-reference"]');
    return {
      active: document.activeElement === el,
      focusVisible: el.matches(':focus-visible'),
      outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`,
      tabIndex: el.tabIndex,
      disabled: el.disabled,
      labelText: label?.textContent,
      accessibleLabels: [...el.labels].map(l => l.textContent),
      options: [...el.options].map(o => ({ v: o.value, hidden: o.hidden, disabled: o.disabled })),
    };
  });
  check(
    tag,
    'focus semantics: focused, :focus-visible with a visible outline, native tab order, labelled "Read as"',
    focus.active &&
      focus.focusVisible &&
      /^solid 2px/.test(focus.outline) &&
      focus.tabIndex === 0 &&
      !focus.disabled &&
      focus.accessibleLabels.join() === 'Read as',
    focus,
  );
  // Focus alone must have brought the control into the visible part of the (scrolling) panel.
  let vis = await visibility(page);
  check(
    tag,
    'focused picker fully visible and unobstructed (vertical and horizontal)',
    vis['bh-reference'].fullyVisible && vis['bh-reference'].unobstructed,
    vis['bh-reference'],
  );
  const undo0 = snap.undoDepth;
  // Operate with the keyboard: ArrowDown through options until Large stellar (closed-select arrow keys change value on Linux/Windows Chromium).
  let value = await page.locator('#bh-reference').inputValue();
  const seen = [value];
  for (let i = 0; i < 8 && value !== 'large-stellar'; i++) {
    await page.keyboard.press('ArrowDown');
    await sleep(120);
    value = await page.locator('#bh-reference').inputValue();
    seen.push(value);
  }
  check(tag, 'keyboard ArrowDown selects Large stellar', value === 'large-stellar', seen);
  await sleep(250);
  snap = await probe(page);
  const a1 = snap.bodies[0];
  const info = await page.locator('#info-reference').textContent();
  check(
    tag,
    'readout after keyboard change ≈ 30 M☉ · horizon radius 89 km',
    /≈ 30 M☉ · Stellar-mass · horizon radius 89 km \(not drawn to scale\)/.test(info),
    info,
  );
  check(
    tag,
    'body reference record set (factor × mass = 30)',
    a1.bhReference?.origin === 'large-stellar' && Math.abs(a1.bhReference.solarMassPerModelUnit * a1.mass - 30) < 1e-9,
    a1.bhReference,
  );
  check(
    tag,
    'physics untouched by keyboard change',
    a1.mass === a0.mass && a1.radius === a0.radius && a1.position.every((v, i) => v === a0.position[i]),
    '',
  );
  check(tag, 'keyboard walk recorded one undo step per value change', snap.undoDepth - undo0 === seen.length - 1, {
    undo0,
    undo: snap.undoDepth,
    steps: seen.length - 1,
  });
  check(
    tag,
    'focus stays on picker after change',
    await page.evaluate(() => document.activeElement?.id === 'bh-reference'),
    '',
  );
  vis = await visibility(page);
  check(tag, 'picker still fully visible after change', vis['bh-reference'].fullyVisible, vis['bh-reference']);
  // Observation (not enforced): is the readout already in view without any scrolling after the keyboard change?
  const autoVisible = vis['info-reference'].fullyVisible && vis['info-reference'].unobstructed;
  console.log(
    JSON.stringify({
      tag,
      observe: 'readout visible without scrolling after keyboard change',
      value: autoVisible,
      detail: vis['info-reference'],
    }),
  );
  if (!autoVisible) {
    // A user scrolls the panel by the remaining distance (nearest edge), as a wheel/swipe would.
    await page.evaluate(() => document.getElementById('info-reference').scrollIntoView({ block: 'nearest' }));
    await sleep(150);
    vis = await visibility(page);
  }
  check(
    tag,
    'readout fully visible and unobstructed (after at most a nearest-edge panel scroll)',
    vis['info-reference'].fullyVisible && vis['info-reference'].unobstructed,
    vis['info-reference'],
  );
  check(tag, 'picker visible together with the readout', vis['bh-reference'].fullyVisible, vis['bh-reference']);
  await page.screenshot({ path: join(outDir, `sc7c-${tag}.png`) });
  check(tag, 'no page/console errors', errors.length === 0, errors);
  await page.close();
}
try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const viewport of [
    { width: 844, height: 390 },
    { width: 667, height: 375 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ])
    await run(browser, viewport);
  await browser.close();
} finally {
  server.kill();
}
console.log(JSON.stringify({ summary: true, failed }));
process.exit(failed ? 1 : 0);
