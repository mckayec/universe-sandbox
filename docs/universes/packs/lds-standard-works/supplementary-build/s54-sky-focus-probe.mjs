// Checkpoint 54 probe: S52-C1 / S51-C2. When leaving the compact galaxy view hides the focused Sky button, focus must
// move only to a control that is effectively visible (inside the window, not clipped by a scrolling ancestor, not
// faded, not covered at its centre), never to an off-screen candidate; unrelated focus and the selection are left
// unchanged. Plumbing (server, browser, error capture, open()) is copied from s53-sky-probe.mjs.
//   For Sun Eater and LDS (LDS reaches the galaxy by tapping its own Space button), at 390x844:
//   R. two rounds each of: Sky focused by real Tab/Enter (Sky on) and Sky focused with Sky off, then resize to
//      1280x800 -> focus on an independently verified visible control, selection unchanged; back to 390x844.
//   V. two rounds of a view change (descend to a world) with Sky focused -> visible control; back to the galaxy.
//   A. adversarial layouts injected by a test-only style: (1) every crumb and Worlds pushed off screen -> focus lands
//      on a visible header control, never a crumb; (2) the header controls row scrolled to its far end and the crumbs
//      off screen -> the chosen control is visible (scrolled wholly into its row if needed); (3) every candidate off
//      screen -> focus is NOT moved to any of them (the old fallback focused an off-screen one).
//   U. unrelated focus (Codex button) left alone by the same resize and view change.
//   K. after each recovery a real Tab moves on from the recovered control (keyboard path continues).
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s54-sky-focus-probe.mjs
// Env: CHROME_PATH optional; PORT (default 4189); PACKS (comma list), PARTS (subset of RVAU) to run a subset.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4189);
const origin = `http://127.0.0.1:${port}`;
const url = pack => `${origin}/atlas/?pack=${pack}`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(url('lds-standard-works'))).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
console.log(`browser ${browser.version()}`);
const errors = [];
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
let passed = 0;
const failed = [];
const ok = (c, m) => {
  if (c) {
    passed++;
    console.log(`  ok ${passed} ${m}`);
  } else {
    failed.push(m);
    console.log(`  FAIL ${m}`);
  }
};

async function open(pack, vp) {
  const mob = vp.width < 600 || vp.height < 520;
  const ctx = await browser.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
  const tab = await ctx.newPage();
  tab.setDefaultTimeout(240000);
  tab.on('requestfailed', r => errors.push(`requestfailed(${pack}): ${r.url()} ${r.failure()?.errorText}`));
  tab.on('response', r => {
    if (r.status() >= 400) errors.push(`http ${r.status()}(${pack}): ${r.url()}`);
  });
  tab.on('pageerror', e => errors.push(`pageerror(${pack}): ${e.message}`));
  tab.on('console', m => {
    if (m.type() === 'error' && !/GL Driver|GPU stall|software WebGL|Failed to load resource/i.test(m.text()))
      errors.push(`console(${pack}): ${m.text()}`);
  });
  const t = Date.now();
  await tab.goto(url(pack), { waitUntil: 'domcontentloaded' });
  await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
  await tab.waitForFunction(() => document.querySelector('#splash.out'), null, { timeout: 300000 });
  await tab.waitForFunction(() => window.__atlas && window.__atlas.WORLD_BY, null, { timeout: 300000 });
  log(`${pack} ${vp.width}x${vp.height} ready in ${((Date.now() - t) / 1000).toFixed(1)} s`);
  return { ctx, tab };
}

// Independent effective-visibility check of the focused element (not the engine's own helper): box inside the
// window and inside every clipping ancestor, no faded/hidden ancestor, and the element itself hit at its centre.
const focused = tab =>
  tab.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { id: 'BODY', vis: false };
    const r = e.getBoundingClientRect();
    let L = Math.max(r.left, 0),
      T = Math.max(r.top, 0),
      R = Math.min(r.right, innerWidth),
      B = Math.min(r.bottom, innerHeight),
      op = 1,
      hid = false;
    for (let a = e; a && a.nodeType === 1; a = a.parentElement) {
      const cs = getComputedStyle(a);
      op *= parseFloat(cs.opacity);
      if (cs.visibility === 'hidden' || cs.display === 'none' || a.hidden || a.inert) hid = true;
      if (a === e || a === document.body || a === document.documentElement) continue;
      const c = a.getBoundingClientRect();
      if (/hidden|scroll|auto|clip/.test(cs.overflowX)) (L = Math.max(L, c.left)), (R = Math.min(R, c.right));
      if (/hidden|scroll|auto|clip/.test(cs.overflowY)) (T = Math.max(T, c.top)), (B = Math.min(B, c.bottom));
    }
    const wholeX = R - L >= r.width - 1.5;
    const area = R - L > 0 && B - T > 0;
    const hit = area ? document.elementFromPoint((L + R) / 2, (T + B) / 2) : null;
    const tag = `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}`;
    return {
      id: tag,
      label: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 32),
      crumb: !!e.closest('#crumbs'),
      vis: !hid && op > 0.05 && area && !!hit && (e.contains(hit) || hit.contains(e)),
      wholeX,
      box: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
    };
  });
const sel = tab => tab.evaluate(() => JSON.stringify([window.__atlas.S.sel, window.__atlas.S.site, window.__atlas.S.ev]));
const skyState = tab =>
  tab.evaluate(() => ({ shown: !document.querySelector('#skyBtn').hidden, on: document.getElementById('app').classList.contains('sky') }));

let tab_;
const wait = ms => tab_.waitForTimeout(ms);
const recovered = (f, tag, what) => {
  console.log(`    ${tag} ${what}: focus ${JSON.stringify(f)}`);
  ok(f.id !== 'BODY' && f.id !== 'button#skyBtn' && f.vis && f.wholeX, `${tag}: ${what} -> focus on visible ${f.id} "${f.label}"`);
};
async function tabOn(tag) {
  const before = await focused(tab_);
  await tab_.keyboard.press('Tab');
  await wait(400);
  const after = await focused(tab_);
  ok(after.id !== 'BODY' && (after.id !== before.id || after.label !== before.label), `${tag}: real Tab moves on from the recovered control (to ${after.id})`);
}
// focus Sky by real keyboard: Tab until it is focused (bounded), falling back to .focus() if the order is long
async function tabToSky() {
  await tab_.locator('header.top a[href]').first().focus();
  for (let i = 0; i < 40; i++) {
    if (await tab_.evaluate(() => document.activeElement && document.activeElement.id === 'skyBtn')) return true;
    await tab_.keyboard.press('Tab');
  }
  await tab_.locator('#skyBtn').focus();
  return false;
}
async function backToGalaxy(phone) {
  await tab_.setViewportSize(phone);
  await wait(1500);
  if ((await tab_.evaluate(() => window.__atlas.S.view)) !== 'galaxy') {
    const sp = tab_.getByRole('button', { name: 'Space', exact: true });
    if (await sp.isVisible()) await sp.tap();
    else await tab_.evaluate(() => window.__atlas.ascend());
    await tab_.waitForFunction(() => window.__atlas.S.view === 'galaxy', null, { timeout: 120000 });
  }
  await wait(3000);
  ok((await skyState(tab_)).shown, `Sky button shown again in the compact galaxy view`);
}
const STYLE_ID = 's54-adv';
const inject = css =>
  tab_.evaluate(([id, c]) => {
    let s = document.getElementById(id);
    if (!s) (s = document.createElement('style')), (s.id = id), document.head.appendChild(s);
    s.textContent = c;
  }, [STYLE_ID, css]);
const uninject = () => tab_.evaluate(id => document.getElementById(id)?.remove(), STYLE_ID);
const descendFirst = () =>
  tab_.evaluate(() => {
    const A = window.__atlas;
    const w = Object.values(A.WORLD_BY).filter(x => x.gfx && !x.noSurface)[0];
    A.descend(w.id);
    return w.id;
  });

async function partR(tag, phone) {
  for (let i = 1; i <= 2; i++) {
    for (const on of [true, false]) {
      const viaTab = await tabToSky();
      if (on) {
        await tab_.keyboard.press('Enter');
        await wait(800);
      }
      ok((await skyState(tab_)).on === on, `${tag} R${i}: Sky ${on ? 'on' : 'off'} with Sky focused${viaTab ? ' by real Tab' : ''}`);
      const s0 = await sel(tab_);
      await tab_.setViewportSize({ width: 1280, height: 800 });
      await wait(2200);
      recovered(await focused(tab_), `${tag} R${i}`, `resize 390->1280 (Sky ${on ? 'on' : 'off'})`);
      ok((await sel(tab_)) === s0, `${tag} R${i}: selection unchanged ${s0}`);
      await tabOn(`${tag} R${i}`);
      await backToGalaxy(phone);
    }
  }
}
async function partV(tag, phone) {
  for (let i = 1; i <= 2; i++) {
    await tabToSky();
    const w = await descendFirst();
    await tab_.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 120000 });
    await wait(2500);
    recovered(await focused(tab_), `${tag} V${i}`, `view change to ${w}`);
    await tabOn(`${tag} V${i}`);
    await backToGalaxy(phone);
  }
}
async function partA(tag, phone) {
  const off = 'transform:translateX(-4000px)!important;';
  // (1) crumbs and Worlds off screen
  await inject(`#crumbs a,#crumbs button,#idxBtn{${off}}`);
  await wait(300);
  await tabToSky();
  await tab_.setViewportSize({ width: 1280, height: 800 });
  await wait(2200);
  let f = await focused(tab_);
  recovered(f, `${tag} A1`, 'crumbs+Worlds off screen, resize');
  ok(!f.crumb, `${tag} A1: an off-screen crumb was not chosen`);
  await uninject();
  await backToGalaxy(phone);
  // (2) landscape header row scrolled to its far end, crumbs off screen, view change
  const land = { width: 844, height: 390 };
  await tab_.setViewportSize(land);
  await wait(2500);
  if ((await skyState(tab_)).shown) {
    await inject(`#crumbs a,#crumbs button{${off}}`);
    await tab_.evaluate(() => {
      const c = document.querySelector('.top .controls');
      c.scrollLeft = c.scrollWidth;
    });
    await wait(300);
    await tab_.locator('#skyBtn').focus();
    const w = await descendFirst();
    await tab_.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 120000 });
    await wait(2500);
    f = await focused(tab_);
    recovered(f, `${tag} A2`, `844x390, header row scrolled to end, crumbs off screen, view change to ${w}`);
    ok(!f.crumb, `${tag} A2: an off-screen crumb was not chosen`);
    await uninject();
  } else ok(false, `${tag} A2: Sky shown at 844x390`);
  await backToGalaxy(phone);
  // (3) every candidate off screen: nothing off screen may be focused
  await inject(`#crumbs,header.top{${off}}`);
  await wait(300);
  await tab_.locator('#skyBtn').focus();
  const s0 = await sel(tab_);
  await tab_.setViewportSize({ width: 1280, height: 800 });
  await wait(2200);
  f = await focused(tab_);
  console.log(`    ${tag} A3 every candidate off screen, resize: focus ${JSON.stringify(f)}`);
  ok(f.id === 'BODY' || f.vis, `${tag} A3: no off-screen control focused (focus ${f.id}, visible=${f.vis})`);
  ok((await sel(tab_)) === s0, `${tag} A3: selection unchanged`);
  await uninject();
  await backToGalaxy(phone);
}
async function partU(tag, phone) {
  await tab_.locator('#cxBtn').focus();
  await tab_.setViewportSize({ width: 1280, height: 800 });
  await wait(2000);
  ok((await focused(tab_)).id === 'button#cxBtn', `${tag} U: unrelated focus (Codex) left alone by the resize`);
  await backToGalaxy(phone);
  await tab_.locator('#cxBtn').focus();
  await descendFirst();
  await tab_.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 120000 });
  await wait(2000);
  ok((await focused(tab_)).id === 'button#cxBtn', `${tag} U: unrelated focus (Codex) left alone by the view change`);
  await backToGalaxy(phone);
}

async function main() {
  const phone = { width: 390, height: 844 };
  const packs = (process.env.PACKS || 'sun-eater,lds-standard-works').split(',');
  const parts = process.env.PARTS || 'RVAU';
  for (const pack of packs) {
    const { ctx, tab } = await open(pack, phone);
    tab_ = tab;
    if (pack === 'lds-standard-works') {
      await tab.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 300000 });
      await wait(4000);
    }
    await backToGalaxy(phone);
    const tag = `${pack} 390x844`;
    if (parts.includes('R')) await partR(tag, phone);
    if (parts.includes('V')) await partV(tag, phone);
    if (parts.includes('A')) await partA(tag, phone);
    if (parts.includes('U')) await partU(tag, phone);
    await ctx.close();
  }
}

try {
  await main();
} catch (e) {
  failed.push(`exception: ${e.message}`);
  console.error(e);
} finally {
  ok(errors.length === 0, `zero console/request/page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  console.log(failed.length ? `FAILED ${failed.length}: ${failed.join(' || ')}` : `PASS ${passed} checks`);
  log('done');
  process.exitCode = failed.length ? 1 : 0;
  await browser.close();
  server.kill();
}
