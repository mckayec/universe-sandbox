// Checkpoint 47 probe (S46-O1): on compact layouts no visible globe site label may sit in a chrome band or run off a screen edge
// (top chrome rows, open worlds list, bottom sheet / chronicle). Open/server/error plumbing copied from s46-finished-probe.mjs.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s47-chrome-probe.mjs
// Env: SHOTS=<dir> for PNGs; VPS=390,768,1440 (subset/order); CHROME_PATH optional. Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4182);
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const sizes = {
  390: { width: 390, height: 844 },
  768: { width: 768, height: 1024 },
  1440: { width: 1440, height: 900 },
};
const order = (process.env.VPS || '390,768,1440').split(',').map(Number);
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

async function open(vp) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600 });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('requestfailed', r => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL|Failed to load resource/i.test(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  await tab.goto(page0, { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
    timeout: 300000,
  });
  log(`${vp.width}x${vp.height} ready`);
  return { ctx, tab };
}

// probe-side measurement, independent of engine.js: chrome rects from the DOM, visible labels from computed opacity
const measure = tab =>
  tab.evaluate(() => {
    const vis = sel => {
      const e = document.querySelector(sel);
      if (!e || e.hidden || !e.getClientRects().length) return null;
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth
        ? { top: r.top, bottom: r.bottom }
        : null;
    };
    const top = Math.max(
      0,
      ...['header.top', '#crumbs', '#realms', '#filters']
        .map(vis)
        .filter(Boolean)
        .map(r => r.bottom),
    );
    const bot = Math.min(
      innerHeight,
      ...['#dossier', '#chron']
        .map(vis)
        .filter(Boolean)
        .map(r => r.top),
    );
    const idx = vis('#index');
    const labels = [...document.querySelectorAll('#labels .plbl')]
      .filter(e => parseFloat(getComputedStyle(e).opacity) > 0.05)
      .map(e => {
        const t = (
          e.querySelector('.tx') && getComputedStyle(e.querySelector('.tx')).display !== 'none'
            ? e.querySelector('.tx')
            : e.querySelector('.pip') || e
        ).getBoundingClientRect();
        return {
          name: e.getAttribute('aria-label'),
          top: t.top,
          bottom: t.bottom,
          left: t.left,
          right: t.right,
        };
      });
    const bands = [
      [0, top],
      [bot, innerHeight],
    ].concat(idx ? [[idx.top, idx.bottom]] : []);
    const bad = labels.filter(
      l => bands.some(([a, b]) => l.top < b - 1 && l.bottom > a + 1) || l.left < -1 || l.right > innerWidth + 1,
    );
    return {
      top: Math.round(top),
      bot: Math.round(bot),
      idx: !!idx,
      visible: labels.length,
      bad,
      mob: innerWidth <= 820,
    };
  });

async function check(tab, vp, tag) {
  // the compact view offset eases after a sheet toggle; SwiftShader draws few frames, so allow it to settle
  await tab.waitForTimeout(6000);
  const m = await measure(tab);
  console.log(
    `  ${vp.width} ${tag}: top band 0-${m.top}, bottom band ${m.bot}-${vp.height}, index open ${m.idx}, visible site labels ${m.visible}, in bands ${m.bad.length}${m.bad.length ? ' ' + JSON.stringify(m.bad) : ''}`,
  );
  if (m.mob)
    assert.equal(
      m.bad.length,
      0,
      `${vp.width} ${tag}: no visible site label inside a chrome band or cut by a screen edge`,
    );
  if (shots) await tab.screenshot({ path: `${shots}/s47-${tag}-${vp.width}x${vp.height}.png` });
  return m;
}

try {
  for (const w of order) {
    const vp = sizes[w];
    const { ctx, tab } = await open(vp);
    if (w === 390) {
      await tab.waitForFunction(() => document.querySelector('#bake')?.hidden === true, null, { timeout: 3600000 });
      log(`${vp.width}x${vp.height} bake finished`);
    } else await tab.waitForTimeout(20000);
    const a = await check(tab, vp, 'start');
    // collapse the bottom sheet (its grab bar) and re-check: more globe opens up, labels return there
    const grab = tab.locator('#dossier .grab');
    if (a.mob && (await grab.count()) && (await grab.isVisible())) {
      await grab.evaluate(e => e.click());
      const b = await check(tab, vp, 'sheet-toggled');
      log(`${vp.width}: visible labels ${a.visible} -> ${b.visible} after toggling the sheet`);
      // whichever sheet state leaves a real open globe area must still show labels there (the fix hides, it does not blank)
      for (const m of [a, b])
        if (m.bot - m.top >= 120)
          assert.ok(m.visible > 0, `${vp.width}: labels remain in a ${m.bot - m.top}px open globe area`);
      assert.ok(
        [a, b].some(m => m.bot - m.top >= 120),
        `${vp.width}: one sheet state leaves an open globe area`,
      );
    }
    // open the worlds list on compact layouts
    if (a.mob) {
      await tab.locator('#idxBtn').evaluate(e => e.click());
      await check(tab, vp, 'index-open');
      await tab.locator('#idxBtn').evaluate(e => e.click());
    }
    await ctx.close();
  }
  assert.deepEqual(errors, [], 'no console errors, failed requests or HTTP >= 400');
  log('PASS');
} catch (e) {
  console.error(e);
  if (errors.length) console.error(errors.join('\n'));
  process.exitCode = 1;
} finally {
  await browser.close();
  server.kill();
}
