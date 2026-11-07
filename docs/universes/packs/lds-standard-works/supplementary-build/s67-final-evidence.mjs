// Checkpoint 67 (final-audit evidence, exact head e2c02e4): s65 RC64-O1 checks plus focus/Escape return and a
// same-origin request guard. VPS=3840x2160,390x844 limits viewports; DUNE=0 skips the few-section control.
// Derived from checkpoint 65 (RC64-O1): the Reference dialog header stays short on every viewport. When the section buttons would
// wrap past two rows the compact chooser replaces them; a pack with few sections keeps its buttons. A card scrolled to
// the top of the list keeps its title visible (scroll-margin-top). Captures at 3840x2160, 1440x900, 1280x800, 390x844.
// Usage (repo root, after `pnpm build`): SHOTS=dir node docs/universes/packs/lds-standard-works/supplementary-build/s65-reference-fit.mjs
// Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4182);
const origin = `http://127.0.0.1:${port}`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(`${origin}/atlas/?pack=lds-standard-works`)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
const errors = [];
const foreign = [];

async function open(pack, vp) {
  const phone = vp.width < 600;
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: phone ? 2 : 1,
    isMobile: phone,
    hasTouch: phone,
  });
  const tab = await ctx.newPage();
  tab.on('request', r => {
    const u = r.url();
    if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) foreign.push(u);
  });
  tab.setDefaultTimeout(240000);
  tab.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL|Failed to load resource/i.test(m.text()))
      errors.push(`console: ${m.text()}`);
  });
  await tab.goto(`${origin}/atlas/?pack=${pack}`, { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
    timeout: 300000,
  });
  if (phone) await tab.locator('#cxBtn').tap({ noWaitAfter: true });
  else await tab.locator('#cxBtn').click({ noWaitAfter: true });
  await tab.locator('#codex .panel').waitFor({ state: 'visible' });
  return { ctx, tab };
}
const phone = w => w < 600;
const metrics = tab =>
  tab.evaluate(() => {
    const p = document.querySelector('#codex .panel'),
      h = p.querySelector('.cx-head'),
      b = document.querySelector('#cxBody');
    return {
      compact: p.classList.contains('cx-compact'),
      tabsShown: getComputedStyle(document.querySelector('#cxTabs')).display !== 'none',
      pickShown: getComputedStyle(document.querySelector('#cxPick')).display !== 'none',
      head: Math.round(h.getBoundingClientRect().height),
      body: Math.round(b.getBoundingClientRect().height),
      sideways: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

const VPS = (process.env.VPS || '3840x2160,1440x900,1280x800,390x844').split(',').map(v => v.split('x').map(Number));
try {
  for (const [width, height] of VPS) {
    const { ctx, tab } = await open('lds-standard-works', { width, height });
    // focus moves into the dialog on open
    assert.equal(
      await tab.evaluate(() => document.activeElement && document.activeElement.id),
      'cxClose',
      `${width}: focus on open`,
    );
    const m = await metrics(tab);
    console.log(`lds ${width}x${height}: ${JSON.stringify(m)}`);
    assert.ok(m.pickShown && !m.tabsShown, `${width}: chooser should replace 13 wrapping tabs`);
    assert.equal(m.compact, width >= 600, `${width}: compact class`);
    assert.ok(m.head <= 120, `${width}: header ${m.head}px is too tall`);
    assert.ok(m.body >= m.head * 3, `${width}: list ${m.body}px vs header ${m.head}px`);
    assert.ok(m.sideways <= 0, `${width}: sideways scroll ${m.sideways}px`);
    await tab.locator('#cxPick').selectOption('bom-bible');
    assert.equal(await tab.locator('#cxBody .cx-item').count(), 124);
    // a card scrolled to the top of the list (as See-also links do) keeps its title fully visible
    const key = 'BMV-125-choose-whom-serve-scripture';
    const v = tab.locator(`#cxBody .cx-item[data-key="${key}"]`);
    await v.evaluate(el => el.scrollIntoView({ block: 'start' }));
    await tab.waitForTimeout(250);
    const gap = await v.evaluate(el => {
      const h = el.querySelector('h3').getBoundingClientRect(),
        b = document.querySelector('#cxBody').getBoundingClientRect();
      return Math.round(h.top - b.top);
    });
    assert.ok(gap >= 8, `${width}: title ${gap}px from list top`);
    if (shots) await tab.screenshot({ path: `${shots}/s67-reference-${width}x${height}.png` });
    // the chooser is keyboard-reachable and Escape closes the dialog and returns focus to its button
    await tab.locator('#cxPick').focus();
    assert.equal(await tab.evaluate(() => document.activeElement.id), 'cxPick', `${width}: chooser focusable`);
    await tab.keyboard.press('Escape');
    await tab.waitForTimeout(150);
    const after = await tab.evaluate(() => ({
      hidden: document.querySelector('#codex').hidden,
      focus: document.activeElement && document.activeElement.id,
    }));
    console.log(`lds ${width}x${height} escape: ${JSON.stringify(after)}`);
    assert.ok(after.hidden && after.focus === 'cxBtn', `${width}: Escape closes and returns focus`);
    if (phone(width)) await tab.locator('#cxBtn').tap({ noWaitAfter: true });
    else await tab.locator('#cxBtn').click({ noWaitAfter: true });
    await tab.locator('#codex .panel').waitFor({ state: 'visible' });
    // resizing back across the threshold re-measures
    if (width >= 600) {
      await tab.setViewportSize({ width: 3000, height });
      await tab.waitForTimeout(150);
      assert.equal((await metrics(tab)).compact, true, `${width}: still compact after resize`);
    }
    await ctx.close();
  }
  // a pack with few sections keeps its buttons on desktop
  if (process.env.DUNE !== '0') {
    const { ctx, tab } = await open('dune', { width: 1440, height: 900 });
    const m = await metrics(tab);
    console.log(`dune 1440x900: ${JSON.stringify(m)}`);
    assert.ok(m.tabsShown && !m.pickShown && !m.compact, 'dune keeps section buttons');
    await ctx.close();
  }
  console.log(`third-party requests: ${foreign.length}`);
  if (foreign.length) throw new Error(foreign.join('\n'));
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('s67 final evidence: all checks passed');
} finally {
  await browser.close();
  server.kill();
}
