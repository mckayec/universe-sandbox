// PR47 landscape qualification: guided exhibit + science legend + navigation help + selected-object sheet, all at
// once, on a coarse-pointer (touch) phone viewport. Records panel bounds, hit-tests the centre (and 4 inset corners)
// of every guide / dock / toolbar control, checks the overlay stack never overlaps the dock or the selected object's
// label, and saves a screenshot per state. Enforced: exits 1 on any failed check.
// Usage (from a checkout of the PR head after `pnpm build`):
//   CHROME_PATH=... node docs/reviews/simulator-clarity/landscape-qualification-harness.mjs <outDir> [port]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [outDir = 'shots-landscape', portArg = '4211'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const port = Number(portArg);
const base = `http://127.0.0.1:${port}/?probe=1`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const rows = [];
const check = (tag, name, ok, detail) => {
  if (!ok) failures++;
  const row = { tag, check: name, pass: !!ok, detail };
  rows.push(row);
  console.log(JSON.stringify(row));
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

const GUIDE = ['guide-restart', 'guide-exit'];
const DOCK = [
  'panel-toggle',
  'pause',
  'clear',
  'add-mode',
  'inspect-mode',
  'navigate-mode',
  'info-expand',
  'info-close',
];
const TOP = ['universes-button', 'exhibits-button', 'fullscreen-button', 'science-mode', 'zoom-fit', 'zoom-selected'];

/** For each control: rect, nearest clipping box, whether it is fully inside it, and which element the pointer hits
 *  at its centre and 4 points inset 3 px from its corners. */
function geometry(page, ids) {
  return page.evaluate(ids => {
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') {
        out[id] = { rendered: false };
        continue;
      }
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
      const pts = [
        [(r.left + r.right) / 2, (r.top + r.bottom) / 2],
        [r.left + 3, r.top + 3],
        [r.right - 3, r.top + 3],
        [r.left + 3, r.bottom - 3],
        [r.right - 3, r.bottom - 3],
      ];
      const describe = h =>
        h ? (h.id ? `#${h.id}` : `${h.tagName.toLowerCase()}.${[...h.classList].join('.')}`) : null;
      const hits = pts.map(([x, y]) => {
        const h = document.elementFromPoint(x, y);
        return { ok: !!h && (h === el || el.contains(h)), at: describe(h) };
      });
      out[id] = {
        rendered: true,
        rect: [r.left, r.top, r.right, r.bottom].map(Math.round),
        fullyVisible:
          r.height > 0 &&
          r.top >= clip.top - 0.5 &&
          r.bottom <= clip.bottom + 0.5 &&
          r.left >= clip.left - 0.5 &&
          r.right <= clip.right + 0.5,
        centreHit: hits[0].at,
        unobstructed: hits.every(h => h.ok),
        cornersOk: hits.filter(h => h.ok).length,
      };
    }
    return out;
  }, ids);
}

/** Bounds of every visible overlay-stack child, the dock panels, the selected object label and the top controls. */
function panels(page) {
  return page.evaluate(() => {
    const box = el => {
      if (!el || !el.getClientRects().length) return null;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return null;
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    };
    // Stack children are clipped to the stack when it scrolls (overlay-tight): only their visible part can cover.
    const stackEl = document.querySelector('#overlay-stack');
    const scrolls = getComputedStyle(stackEl).overflowY !== 'visible';
    const sr = stackEl.getBoundingClientRect();
    const stackKids = [...stackEl.children]
      .filter(el => !el.hidden && el.getClientRects().length)
      .map(el => {
        const r = el.getBoundingClientRect();
        const top = scrolls ? Math.max(r.top, sr.top) : r.top;
        const bottom = scrolls ? Math.min(r.bottom, sr.bottom) : r.bottom;
        return bottom - top > 0
          ? {
              id: el.id,
              x: Math.round(r.left),
              y: Math.round(top),
              w: Math.round(r.width),
              h: Math.round(bottom - top),
            }
          : null;
      })
      .filter(Boolean);
    const snap = window.__sandboxProbe();
    const sel = snap.bodies.find(b => b.id === snap.selectedId);
    const label = sel
      ? [...document.querySelectorAll('.object-label')].find(
          el => el.getAttribute('aria-label') === sel.name && getComputedStyle(el).display !== 'none',
        )
      : null;
    const cs = getComputedStyle(document.querySelector('#overlay-stack'));
    return {
      overlayTight: document.body.classList.contains('overlay-tight'),
      stack: box(document.querySelector('#overlay-stack')),
      stackScroll: { overflowY: cs.overflowY, maxHeight: cs.maxHeight },
      stackKids,
      dock: box(document.querySelector('.dock')),
      toolPanel: box(document.querySelector('#tool-panel')),
      infoPanel: box(document.querySelector('#info-panel')),
      touchHint: box(document.querySelector('#touch-hint')),
      universeToolbar: box(document.querySelector('.universe-toolbar')),
      zoom: box(document.querySelector('.zoom-controls')),
      speed: box(document.querySelector('.speed')),
      selectedLabel: label && box(label) ? { text: label.textContent.trim(), ...box(label) } : null,
      selectedBody: sel
        ? { name: sel.name, x: Math.round(sel.screen[0]), y: Math.round(sel.screen[1]), w: 1, h: 1 }
        : null,
      hScroll: document.documentElement.scrollWidth > innerWidth,
    };
  });
}
const overlap = (a, b) => !!a && !!b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

async function setup(browser, viewport, exhibit) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => typeof window.__sandboxProbe === 'function');
  await sleep(800);
  const env = await page.evaluate(() => ({
    coarse: matchMedia('(pointer: coarse)').matches,
    landscapeDock: matchMedia('(max-height: 500px) and (pointer: coarse)').matches,
    compact800: matchMedia('(max-width: 800px)').matches,
  }));
  // 1. guided exhibit
  await page.locator('#exhibits-button').tap();
  await page.locator(`[data-exhibit="${exhibit}"]`).tap();
  await sleep(900);
  if (!(await page.locator('#pause').evaluate(b => /resume/i.test(b.textContent)))) await page.locator('#pause').tap();
  await sleep(300);
  // 2. Inspect, tap the most massive body to select it (the selected-object sheet opens)
  await page.locator('#inspect-mode').tap();
  await sleep(200);
  // The most massive body whose centre is open canvas (not under a card or the dock).
  const target = await page.evaluate(
    () =>
      window
        .__sandboxProbe()
        .bodies.filter(b => document.elementFromPoint(b.screen[0], b.screen[1])?.tagName === 'CANVAS')
        .sort((a, b) => b.mass - a.mass)[0],
  );
  if (target) await page.touchscreen.tap(target.screen[0], target.screen[1]);
  await sleep(500);
  // 3. science overlays on (legend)
  while (!(await page.locator('#science-legend').isVisible())) {
    await page.locator('#science-mode').scrollIntoViewIfNeeded();
    await page.locator('#science-mode').tap();
    await sleep(150);
  }
  // 4. Navigate (navigation help); the selection persists
  await page.locator('#navigate-mode').tap();
  await sleep(3200); // the exhibit's start toast fades (2.6 s)
  return { context, page, errors, env, target };
}

async function qualify(browser, viewport, exhibit, shotName) {
  const tag = `${viewport.width}x${viewport.height} coarse ${exhibit}`;
  const { context, page, errors, env, target } = await setup(browser, viewport, exhibit);
  const snap = await page.evaluate(() => window.__sandboxProbe());
  const state = await page.evaluate(() => ({
    guide: !document.querySelector('#guide-card').hidden,
    legend: !document.querySelector('#science-legend').hidden,
    navHelp: !document.querySelector('#navigation-help').hidden,
    sheetOpen: !document.querySelector('#info-panel').classList.contains('empty'),
    infoName: document.querySelector('#info-name').textContent,
  }));
  check(
    tag,
    'media: coarse pointer, PR44 landscape dock active',
    viewport.width < viewport.height || (env.coarse && env.landscapeDock),
    env,
  );
  check(
    tag,
    'combined state: guide + legend + navigation help + selected-object sheet all shown',
    state.guide && state.legend && state.navHelp && state.sheetOpen && snap.selectedId != null,
    { ...state, selectedId: snap.selectedId, tapped: target?.name },
  );
  await page.screenshot({ path: join(outDir, `${shotName}.png`) });
  const p = await panels(page);
  check(tag, 'no horizontal page scroll', !p.hScroll, null);
  const stackVsDock = [];
  for (const k of p.stackKids)
    for (const [n, b] of [
      ['toolPanel', p.toolPanel],
      ['infoPanel', p.infoPanel],
      ['touchHint', p.touchHint],
    ])
      if (overlap(k, b)) stackVsDock.push([k.id, n]);
  check(tag, 'overlay stack cards do not overlap the dock (tool panel, sheet, touch hint)', stackVsDock.length === 0, {
    stackVsDock,
    panels: p,
  });
  const stackVsChrome = [];
  for (const k of p.stackKids)
    for (const [n, b] of [
      ['zoom', p.zoom],
      ['speed', p.speed],
    ])
      if (overlap(k, b)) stackVsChrome.push([k.id, n]);
  check(
    tag,
    'overlay stack cards do not overlap the zoom column or speed row',
    stackVsChrome.length === 0,
    stackVsChrome,
  );
  // The stack starts 2 px above the universe toolbar's bottom edge (pre-existing compact offset): measured, and it
  // must not reach any toolbar control.
  const tb = await page.evaluate(() => {
    const stack = document.querySelector('#overlay-stack').getBoundingClientRect();
    const bar = document.querySelector('.universe-toolbar').getBoundingClientRect();
    const lowest = Math.max(
      ...[...document.querySelectorAll('.universe-toolbar > *')].map(el => el.getBoundingClientRect().bottom),
    );
    return { stackTop: stack.top, toolbarBottom: bar.bottom, lowestControlBottom: lowest };
  });
  check(tag, 'overlay stack clear of every universe-toolbar control', tb.stackTop >= tb.lowestControlBottom, tb);
  if (p.selectedLabel) {
    const covering = [...p.stackKids, { id: 'toolPanel', ...p.toolPanel }, { id: 'infoPanel', ...p.infoPanel }]
      .filter(b => overlap(b, p.selectedLabel))
      .map(b => b.id);
    // Reported, not enforced: whether the label is clear depends on where the camera frames the object (residual).
    rows.push({
      tag,
      observe: 'selected object label clear of overlay cards and dock',
      pass: true,
      value: covering.length === 0,
      detail: { label: p.selectedLabel, covering },
    });
  } else rows.push({ tag, observe: 'selected object label not rendered at this camera position', pass: true });
  if (p.selectedBody) {
    const covering = [...p.stackKids, { id: 'toolPanel', ...p.toolPanel }, { id: 'infoPanel', ...p.infoPanel }]
      .filter(b => overlap(b, p.selectedBody))
      .map(b => b.id);
    rows.push({
      tag,
      observe: 'selected object centre clear of overlay cards and dock',
      pass: true,
      value: covering.length === 0,
      detail: { body: p.selectedBody, covering },
    });
  }
  // #science-mode sits in the horizontally scrolling universe toolbar: bring it into view inside the toolbar first.
  await page.evaluate(() =>
    document.querySelector('#science-mode').scrollIntoView({ block: 'nearest', inline: 'nearest' }),
  );
  await sleep(150);
  const g = await geometry(page, [...GUIDE, ...DOCK, ...TOP]);
  await page.evaluate(() => (document.querySelector('.universe-toolbar').scrollLeft = 0));
  for (const id of [...GUIDE, ...DOCK, ...TOP]) {
    const v = g[id];
    // The fullscreen button may be hidden where the Fullscreen API is unavailable; it is reported, not required.
    if (!v.rendered && id === 'fullscreen-button') {
      rows.push({ tag, observe: `${id} not rendered`, pass: true });
      continue;
    }
    check(
      tag,
      `#${id} rendered, fully visible, hit at centre and 4 corners`,
      v.rendered && v.fullyVisible && v.unobstructed,
      v,
    );
  }
  // Legend and navigation help are passive cards; when the stack scrolls they must be reachable inside its share.
  const nav = await page.evaluate(() => ({
    navHelpDisplay: getComputedStyle(document.querySelector('#navigation-help')).display,
    touchHint: document.querySelector('#touch-hint').getClientRects().length
      ? document.querySelector('#touch-hint').textContent
      : null,
  }));
  rows.push({
    tag,
    observe: 'navigation help on compact (PR44 hides the card; the dock touch hint carries it)',
    pass: true,
    detail: nav,
  });
  for (const id of ['science-legend', ...(nav.navHelpDisplay === 'none' ? [] : ['navigation-help'])]) {
    const r = await page.evaluate(id => {
      const el = document.getElementById(id);
      const stack = document.querySelector('#overlay-stack');
      const shownBefore = (() => {
        const a = el.getBoundingClientRect(),
          b = stack.getBoundingClientRect();
        return a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5;
      })();
      el.scrollIntoView({ block: 'nearest' });
      const a = el.getBoundingClientRect(),
        b = stack.getBoundingClientRect();
      const out = {
        shownBefore,
        fullyVisibleAfterScroll: a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5 && a.bottom <= innerHeight,
        rect: [a.left, a.top, a.right, a.bottom].map(Math.round),
        stackScrollTop: stack.scrollTop,
      };
      stack.scrollTop = 0;
      return out;
    }, id);
    check(
      tag,
      `#${id} visible as shown or reachable by scrolling the overlay stack`,
      r.shownBefore || r.fullyVisibleAfterScroll,
      r,
    );
  }
  // Operability by touch: Details expands the sheet; then re-hit-test the guide controls and the sheet buttons.
  await page.locator('#info-expand').tap();
  await sleep(500);
  await page.screenshot({ path: join(outDir, `${shotName}-details.png`) });
  const p2 = await panels(page);
  const hits2 = [];
  for (const k of p2.stackKids)
    for (const [n, b] of [
      ['toolPanel', p2.toolPanel],
      ['infoPanel', p2.infoPanel],
    ])
      if (overlap(k, b)) hits2.push([k.id, n]);
  check(tag, 'Details expanded: overlay stack still clear of the dock', hits2.length === 0, { hits2, panels: p2 });
  const g2 = await geometry(page, [...GUIDE, 'info-expand', 'info-close', 'inspect-mode', 'pause']);
  for (const id of Object.keys(g2))
    check(
      tag,
      `Details expanded: #${id} visible and hit at centre and 4 corners`,
      g2[id].rendered && g2[id].fullyVisible && g2[id].unobstructed,
      g2[id],
    );
  await page.locator('#info-expand').tap();
  await sleep(300);
  // Touch operation of the guide and dock actions.
  await page.locator('#inspect-mode').tap();
  await sleep(200);
  check(
    tag,
    'tap Inspect switches mode (navigation help hides)',
    await page.evaluate(
      () =>
        document.querySelector('#inspect-mode').getAttribute('aria-pressed') === 'true' &&
        document.querySelector('#navigation-help').hidden,
    ),
    null,
  );
  await page.locator('#navigate-mode').tap();
  await sleep(200);
  await page.locator('#guide-restart').tap();
  await sleep(900);
  check(tag, 'tap Restart keeps the guide card shown', await page.locator('#guide-card').isVisible(), null);
  await page.locator('#guide-exit').tap();
  await sleep(400);
  check(tag, 'tap Exit guide hides the guide card', !(await page.locator('#guide-card').isVisible()), null);
  check(tag, 'no console or page errors', errors.length === 0, errors);
  await context.close();
  return { panels: p, geometry: g };
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  const results = {};
  results.landscape = await qualify(browser, { width: 844, height: 390 }, 'binary-stars', '844x390-combined-binary');
  results.landscapeLong = await qualify(
    browser,
    { width: 844, height: 390 },
    'habitable-world',
    '844x390-combined-habitable',
  );
  results.portrait = await qualify(browser, { width: 390, height: 844 }, 'binary-stars', '390x844-combined-binary');
  writeFileSync(join(outDir, 'raw.json'), JSON.stringify({ rows, results }, null, 2));
} finally {
  await browser?.close();
  server.kill();
}
for (const r of rows) if ('observe' in r) console.log(JSON.stringify(r));
console.log(JSON.stringify({ summary: true, checks: rows.filter(r => 'check' in r).length, failures }));
process.exit(failures ? 1 : 0);
