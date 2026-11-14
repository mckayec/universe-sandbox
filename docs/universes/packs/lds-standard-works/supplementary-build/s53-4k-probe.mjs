// Checkpoint 53 isolated finished-4K run: s51-acceptance-probe.mjs part A run alone (no other browser work in the
// sandbox), with the bake bar's own progress width logged every 60 s and a 50-minute ceiling on the bake wait.
// Default PARTS=A. Everything else is the unchanged s51 probe.
// Original header (checkpoint 51 probe): one grouped same-head rendered/keyboard acceptance run (HANDOFF_PLAN 2026-11-03 "After active
// checkpoint 50"). Server/browser/error plumbing copied from s46-finished-probe.mjs / s49-clip-edge-probe.mjs.
//   A. 3840x2160 finished bake: readiness and bake-end observed in the DOM (not timed), canvas size, overflow, real
//      Tab/Shift-Tab traversal and Codex focus trap at that size, screenshot.
//   B. compact non-Earth Space/galaxy views (390x844 and 844x390 rotation): LDS ascended to space, Expanse, Sun Eater,
//      Hyperion. Every visible galaxy-view world label is measured against the compact chrome (same selectors the engine
//      uses) and the viewport; hidden labels must be out of the Tab order.
//   C. native-select keyboard path (Codex section picker, compact): Tab reaches it with a visible focus indicator,
//      ArrowDown/End/Home change the section through the change event, Escape closes the Codex and returns focus.
//   D. grab-bar focus outline: the outline box (rect + outline offset + width) lies inside the dossier's visible box.
// Every check is recorded; the run continues after a failure and exits non-zero if any check failed.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s51-acceptance-probe.mjs
// Env: SHOTS=<dir>; PARTS=A,B,C,D (subset); CHROME_PATH optional.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4186);
const origin = `http://127.0.0.1:${port}`;
const url = pack => `${origin}/atlas/?pack=${pack}`;
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const parts = (process.env.PARTS || 'A').split(',');
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

const focused = tab =>
  tab.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { id: 'BODY' };
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    const ring =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
    const ids = (window.__s51ids ||= new WeakMap());
    if (!ids.has(e)) ids.set(e, (ids.n = (ids.n || 0) + 1));
    const tag = `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}`;
    return {
      id: e.id ? tag : `${tag}(${ids.get(e)})`,
      label: (e.getAttribute('aria-label') || e.textContent || e.value || '').trim().slice(0, 40),
      visible: e.getClientRects().length > 0 && r.width > 0 && r.height > 0,
      onscreen: r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth,
      ring,
      hidden: !!e.closest("[hidden],[aria-hidden='true'],[inert]"),
      inCodex: !!e.closest('#codex'),
      name: !!(e.getAttribute('aria-label') || e.textContent.trim() || e.title || e.labels?.length),
    };
  });

// ---------- A. finished 3840x2160 bake + keyboard at that size ----------
async function partA() {
  const vp = { width: 3840, height: 2160 };
  const { ctx, tab } = await open('lds-standard-works', vp);
  const tb = Date.now();
  const poll = setInterval(async () => {
    try {
      const p = await tab.evaluate(() => {
        const b = document.querySelector('#bake');
        return { hidden: b?.hidden, width: b?.querySelector('i')?.style.width, view: window.__atlas?.S?.view };
      });
      log(`3840 bake progress ${JSON.stringify(p)}`);
    } catch {}
  }, 60000);
  await tab
    .waitForFunction(() => document.querySelector('#bake')?.hidden === true, null, { timeout: 3000000 })
    .finally(() => clearInterval(poll));
  log(`3840 bake bar hidden after a further ${((Date.now() - tb) / 1000).toFixed(1)} s (observed)`);
  await tab.waitForTimeout(2000);
  const m = await tab.evaluate(() => {
    const c = document.querySelector('canvas');
    const lbl = [...document.querySelectorAll('#labels .plbl, #labels .lbl')];
    return {
      bakeHidden: document.querySelector('#bake').hidden,
      overflow: document.documentElement.scrollWidth > innerWidth,
      canvas: c ? [c.width, c.height] : null,
      dpr: devicePixelRatio,
      labelsVisible: lbl.filter(e => parseFloat(getComputedStyle(e).opacity) > 0.05).length,
      labelsTotal: lbl.length,
      view: window.__atlas.S.view,
      sel: window.__atlas.S.sel,
    };
  });
  console.log(`  3840 terminal state: ${JSON.stringify(m)}`);
  ok(m.bakeHidden, '3840: bake bar hidden (finished surface)');
  ok(!m.overflow, '3840: no horizontal page overflow');
  ok(m.canvas && m.canvas[0] >= 3840 && m.canvas[1] >= 2160, `3840: canvas backing store ${m.canvas} covers the viewport`);
  ok(m.labelsVisible > 0, `3840: ${m.labelsVisible} place labels visible`);
  if (shots) await tab.screenshot({ path: `${shots}/s53-finished-3840x2160.png` });
  // keyboard at 4K: forward Tab, Shift-Tab reversal, Codex trap and return
  await tab.evaluate(() => document.activeElement?.blur());
  const fwd = [];
  for (let i = 0; i < 120; i++) {
    await tab.keyboard.press('Tab');
    const f = await focused(tab);
    if (f.id === 'BODY' || (fwd.length && f.id === fwd[0].id)) break;
    fwd.push(f);
  }
  log(`3840 forward Tab stops: ${fwd.length}`);
  const bad = fwd.filter(f => !f.visible || !f.onscreen || !f.ring || !f.name || f.hidden || f.inCodex);
  for (const f of bad) console.log(`    bad stop ${JSON.stringify(f)}`);
  ok(fwd.length >= 3 && bad.length === 0, `3840: ${fwd.length} Tab stops, all visible, on screen, named, with focus ring`);
  ok(
    fwd.some(f => f.id === 'button#cxBtn'),
    '3840: Codex button reachable by Tab',
  );
  const back = [fwd[fwd.length - 1].id];
  for (let i = 1; i < fwd.length; i++) {
    await tab.keyboard.press('Shift+Tab');
    back.push((await focused(tab)).id);
  }
  ok(JSON.stringify(back) === JSON.stringify(fwd.map(f => f.id).reverse()), '3840: Shift-Tab reverses the Tab order');
  await tab.locator('#cxBtn').focus();
  await tab.keyboard.press('Enter');
  await tab.locator('#codex').waitFor({ state: 'visible' });
  ok((await focused(tab)).id === 'button#cxClose', '3840: Enter opens the Codex with focus on Close');
  let trapped = true;
  for (let i = 0; i < 20; i++) {
    await tab.keyboard.press('Tab');
    const f = await focused(tab);
    if (!f.inCodex || !f.ring || !f.visible) trapped = false;
  }
  ok(trapped, '3840: 20 Tab presses stay inside the open Codex with a focus ring');
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  ok((await focused(tab)).id === 'button#cxBtn', '3840: Escape closes the Codex and returns focus to its button');
  await ctx.close();
}

// ---------- B. compact non-Earth galaxy views ----------
const galaxyLabels = tab =>
  tab.evaluate(() => {
    const sel = {
      top: ['header.top', '#crumbs', '#realms', '#filters'],
      mid: ['#index'],
      bottom: ['#dossier', '#chron'],
    };
    const W = innerWidth,
      H = innerHeight;
    const rect = s => {
      const el = document.querySelector(s);
      if (!el || el.hidden || !el.getClientRects().length) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.right <= 0 || r.left >= W || r.bottom <= 0 || r.top >= H) return null;
      return r;
    };
    let top = 0,
      bottom = H;
    sel.top.forEach(s => {
      const r = rect(s);
      if (r) top = Math.max(top, r.bottom);
    });
    sel.bottom.forEach(s => {
      const r = rect(s);
      if (r) bottom = Math.min(bottom, r.top);
    });
    const mids = sel.mid.map(rect).filter(Boolean);
    const out = [];
    document.querySelectorAll('#labels .lbl').forEach(e => {
      const op = parseFloat(getComputedStyle(e).opacity);
      const r = e.getBoundingClientRect();
      const shown = op > 0.05;
      const underChrome =
        r.top < top || r.bottom > bottom || mids.some(m => r.left < m.right && r.right > m.left && r.top < m.bottom && r.bottom > m.top);
      const offscreen = r.left < 0 || r.right > W;
      out.push({
        region: e.classList.contains('region'),
        name: e.textContent,
        shown,
        tab: e.tabIndex,
        ariaHidden: e.getAttribute('aria-hidden'),
        underChrome,
        offscreen,
        r: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
      });
    });
    return {
      open: [Math.round(top), Math.round(bottom)],
      view: window.__atlas.S.view,
      overflow: document.documentElement.scrollWidth > innerWidth,
      labels: out,
    };
  });

async function checkGalaxy(tab, tag) {
  const g = await galaxyLabels(tab);
  // world labels are focusable buttons; region labels (arms, core, Magellanic Clouds) are decorative divs clipped by
  // the label layer, so for them only the chrome overlap is checked
  const worlds = g.labels.filter(l => !l.region);
  const shown = worlds.filter(l => l.shown);
  const under = shown.filter(l => l.underChrome);
  const off = shown.filter(l => l.offscreen);
  const tabHidden = worlds.filter(l => !l.shown && l.tab >= 0);
  const ariaWrong = worlds.filter(l => l.shown === (l.ariaHidden === 'true'));
  const regUnder = g.labels.filter(l => l.region && l.shown && l.underChrome && l.r[2] > 0 && l.r[0] < 4000 && l.r[3] > 0);
  console.log(
    `  ${tag}: view=${g.view} open area ${g.open[0]}–${g.open[1]} px; ${shown.length}/${worlds.length} world labels shown; ` +
      `under chrome: ${under.map(l => `${l.name}@${l.r}`).join(', ') || 'none'}; off-screen: ${off.map(l => `${l.name}@${l.r}`).join(', ') || 'none'}`,
  );
  ok(g.view === 'galaxy', `${tag}: in the galaxy/space view`);
  ok(!g.overflow, `${tag}: no horizontal page overflow`);
  // when the chrome leaves no open area (sheet expanded, or a landscape phone) every name is hidden by design
  const room = g.open[1] - g.open[0];
  ok(shown.length > 0 || room < 40, `${tag}: ${room < 40 ? `no open area (${room} px): names hidden, world still listed in the sheet` : 'at least one world label shown'}`);
  ok(under.length === 0, `${tag}: no shown world label overlaps the compact chrome`);
  ok(off.length === 0, `${tag}: no shown world label extends past the viewport edge`);
  ok(tabHidden.length === 0 && ariaWrong.length === 0, `${tag}: hidden labels are out of the Tab order and aria-hidden`);
  ok(regUnder.length === 0, `${tag}: no shown region label overlaps the compact chrome${regUnder.length ? ' (' + regUnder.map(l => `${l.name}@${l.r}`).join(', ') + ')' : ''}`);
  return g;
}

async function partB() {
  const phone = { width: 390, height: 844 };
  for (const pack of ['lds-standard-works', 'expanse', 'sun-eater', 'hyperion']) {
    const { ctx, tab } = await open(pack, phone);
    if (pack === 'lds-standard-works') {
      await tab.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 300000 });
      await tab.waitForTimeout(4000);
      // the pack's own 'Space' header button (UI.galaxyButton), pressed by a real tap
      await tab.getByRole('button', { name: 'Space', exact: true }).tap();
      await tab.waitForFunction(() => window.__atlas.S.view === 'galaxy', null, { timeout: 120000 }).catch(() => {});
    }
    await tab.waitForTimeout(9000);
    await checkGalaxy(tab, `${pack} 390x844`);
    // selected world in the galaxy view: its label is kept (engine rule) and must still sit in the open area
    const id = await tab.evaluate(() => {
      const a = window.__atlas;
      const w = Object.values(a.WORLD_BY).find(w => w.major) || Object.values(a.WORLD_BY)[0];
      a.selectWorld(w.id, true);
      return w.id;
    });
    await tab.waitForTimeout(5000);
    await checkGalaxy(tab, `${pack} 390x844 selected ${id}`);
    if (shots) await tab.screenshot({ path: `${shots}/s51-galaxy-${pack}-390x844.png` });
    if (pack === 'lds-standard-works' || pack === 'sun-eater') {
      await tab.setViewportSize({ width: 844, height: 390 });
      await tab.waitForTimeout(6000);
      await checkGalaxy(tab, `${pack} rotated 844x390`);
      if (shots) await tab.screenshot({ path: `${shots}/s51-galaxy-${pack}-844x390.png` });
    }
    // real Tab into the label layer: every focused label is a shown one
    await tab.setViewportSize(phone);
    await tab.waitForTimeout(4000);
    await tab.evaluate(() => document.activeElement?.blur());
    let labelStops = 0,
      badLabel = 0;
    for (let i = 0; i < 60; i++) {
      await tab.keyboard.press('Tab');
      const f = await tab.evaluate(() => {
        const e = document.activeElement;
        if (!e || !e.classList.contains('lbl')) return null;
        return { op: parseFloat(getComputedStyle(e).opacity), hidden: e.getAttribute('aria-hidden') };
      });
      if (f) {
        labelStops++;
        if (f.op <= 0.05 || f.hidden === 'true') badLabel++;
      }
    }
    ok(badLabel === 0, `${pack} 390x844: ${labelStops} Tab stops on world labels, none on a hidden label`);
    await ctx.close();
  }
}

// ---------- C. native select (Codex section picker) on a phone, keyboard only ----------
async function partC() {
  const { ctx, tab } = await open('lds-standard-works', { width: 390, height: 844 });
  await tab.waitForTimeout(6000);
  await tab.evaluate(() => document.activeElement?.blur());
  let reached = false;
  for (let i = 0; i < 80 && !reached; i++) {
    await tab.keyboard.press('Tab');
    reached = (await focused(tab)).id === 'button#cxBtn';
  }
  ok(reached, '390: Codex button reached by Tab');
  await tab.keyboard.press('Enter');
  await tab.locator('#codex').waitFor({ state: 'visible' });
  let pick = null;
  for (let i = 0; i < 6; i++) {
    const f = await focused(tab);
    if (f.id === 'select#cxPick') {
      pick = f;
      break;
    }
    await tab.keyboard.press('Tab');
  }
  ok(!!pick, '390: Tab inside the Codex reaches the section picker (native select)');
  if (pick) {
    ok(pick.visible && pick.onscreen && pick.ring && pick.name, `390: picker visible, on screen, named, focus indicator (${JSON.stringify(pick)})`);
    const state = () =>
      tab.evaluate(() => ({
        v: document.querySelector('#cxPick').value,
        i: document.querySelector('#cxPick').selectedIndex,
        n: document.querySelector('#cxPick').options.length,
        head: (document.querySelector('#cxBody h2, #cxBody h3, #cxBody .eyebrow')?.textContent || '').trim().slice(0, 50),
        tab: document.querySelector('#cxTabs [aria-selected="true"], #cxTabs .on')?.textContent?.trim() || null,
      }));
    const s0 = await state();
    await tab.keyboard.press('ArrowDown');
    await tab.waitForTimeout(400);
    const s1 = await state();
    console.log(`    picker: ${JSON.stringify(s0)} -> ArrowDown -> ${JSON.stringify(s1)}`);
    ok(s1.i === s0.i + 1 && s1.v !== s0.v, '390: ArrowDown moves the picker to the next section');
    ok(s1.head !== s0.head || s1.tab !== s0.tab, '390: the Codex body follows the picker (change event fired)');
    ok((await focused(tab)).id === 'select#cxPick', '390: focus stays on the picker after a keyboard change');
    await tab.keyboard.press('End');
    await tab.waitForTimeout(400);
    const s2 = await state();
    ok(s2.i === s2.n - 1, `390: End selects the last section (${s2.v})`);
    await tab.keyboard.press('Home');
    await tab.waitForTimeout(400);
    const s3 = await state();
    ok(s3.i === 0, `390: Home selects the first section (${s3.v})`);
    if (shots) {
      await tab.keyboard.press('ArrowDown');
      await tab.waitForTimeout(400);
      await tab.screenshot({ path: `${shots}/s51-codex-picker-390x844.png` });
    }
  }
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  ok((await focused(tab)).id === 'button#cxBtn', '390: Escape closes the Codex and returns focus to its button');
  await ctx.close();
}

// ---------- D. grab-bar focus outline containment ----------
async function partD() {
  const { ctx, tab } = await open('lds-standard-works', { width: 390, height: 844 });
  await tab.waitForTimeout(6000);
  await tab.evaluate(() => document.activeElement?.blur());
  let on = false;
  for (let i = 0; i < 80 && !on; i++) {
    await tab.keyboard.press('Tab');
    on = (await focused(tab)).id === 'div#grab';
  }
  ok(on, '390: grab bar reached by real Tab');
  if (on) {
    const g = await tab.evaluate(() => {
      const e = document.querySelector('#grab');
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const w = cs.outlineStyle === 'none' ? 0 : parseFloat(cs.outlineWidth);
      const off = parseFloat(cs.outlineOffset) || 0;
      const o = { l: r.left - off - w, t: r.top - off - w, r: r.right + off + w, b: r.bottom + off + w };
      // visible box: intersection of every clipping ancestor and the viewport
      let c = { l: 0, t: 0, r: innerWidth, b: innerHeight };
      for (let p = e.parentElement; p; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (/(auto|scroll|hidden|clip)/.test(ps.overflow + ps.overflowX + ps.overflowY)) {
          const pr = p.getBoundingClientRect();
          c = { l: Math.max(c.l, pr.left + p.clientLeft), t: Math.max(c.t, pr.top + p.clientTop), r: Math.min(c.r, pr.left + p.clientLeft + p.clientWidth), b: Math.min(c.b, pr.top + p.clientTop + p.clientHeight) };
        }
      }
      const fv = e.matches(':focus-visible');
      return { fv, style: `${cs.outlineStyle} ${cs.outlineWidth} offset ${cs.outlineOffset}`, outline: o, clip: c };
    });
    console.log(`    grab outline ${JSON.stringify(g)}`);
    const inside = g.outline.l >= g.clip.l - 0.5 && g.outline.r <= g.clip.r + 0.5 && g.outline.t >= g.clip.t - 0.5 && g.outline.b <= g.clip.b + 0.5;
    ok(g.fv && g.style.split(' ')[0] !== 'none', '390: grab bar shows a :focus-visible outline');
    ok(inside, '390: the grab-bar outline lies fully inside its clipping box (not cut off)');
    if (shots) await tab.screenshot({ path: `${shots}/s51-grab-focus-390x844.png` });
  }
  await ctx.close();
}

try {
  if (parts.includes('C')) await partC();
  if (parts.includes('D')) await partD();
  if (parts.includes('B')) await partB();
  if (parts.includes('A')) await partA();
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
