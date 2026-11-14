// Checkpoint 49 probe (S47-C1 clipped focus targets, S47-C2 both-edge / long-name / tooltip bounds, S47-A1 real Tab traversal)
// on compact layouts. Server/browser/error plumbing copied from s48-focus-edge-probe.mjs. Every measurement is taken
// from the DOM with the probe's own visibility test (viewport ∩ clipping ancestors, ancestor opacity, hit test),
// not from engine state.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s49-clip-edge-probe.mjs
// Env: SHOTS=<dir>; CHROME_PATH optional; RM=reduce adds a reduced-motion pass (RM=only: that pass alone). Exits non-zero on the first failed check.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4184);
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
const t0 = Date.now();
const log = m => console.log(`[${((Date.now() - t0) / 1000).toFixed(0)}s] ${m}`);
let passed = 0;
const ok = (c, m) => {
  assert.ok(c, m);
  passed++;
  console.log(`  ok ${passed} ${m}`);
};

async function open(vp, reducedMotion = 'no-preference') {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600, reducedMotion });
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
  await tab.waitForFunction(() => window.__atlas && window.__atlas.SITE_EL.length > 0, null, { timeout: 300000 });
  await tab.addInitScript(() => {});
  await installHelpers(tab);
  log(`${vp.width}x${vp.height} ready (${reducedMotion})`);
  return { ctx, tab };
}

// The probe's own visibility measure, plus the checkpoint-48 visibleControl for comparison (copied verbatim).
const installHelpers = tab =>
  tab.evaluate(() => {
    window.__probe = {
      seen(el) {
        if (!el || el === document.body) return { ok: false, why: 'body' };
        if (el.closest("[hidden],[aria-hidden='true'],[inert]")) return { ok: false, why: 'hidden-ancestry' };
        const r = el.getBoundingClientRect();
        let L = Math.max(r.left, 0),
          T = Math.max(r.top, 0),
          R = Math.min(r.right, innerWidth),
          B = Math.min(r.bottom, innerHeight),
          op = 1;
        for (let a = el; a && a.nodeType === 1; a = a.parentElement) {
          const cs = getComputedStyle(a);
          op *= parseFloat(cs.opacity);
          if (cs.visibility === 'hidden' || cs.display === 'none') return { ok: false, why: 'style' };
          if (a === el || a === document.body || a === document.documentElement) continue;
          if (/hidden|scroll|auto|clip/.test(cs.overflowX)) (L = Math.max(L, a.getBoundingClientRect().left)), (R = Math.min(R, a.getBoundingClientRect().right));
          if (/hidden|scroll|auto|clip/.test(cs.overflowY)) (T = Math.max(T, a.getBoundingClientRect().top)), (B = Math.min(B, a.getBoundingClientRect().bottom));
        }
        const vw = Math.max(0, R - L),
          vh = Math.max(0, B - T);
        const frac = (vw * vh) / Math.max(1, r.width * r.height);
        const hit = vw > 0 && vh > 0 ? document.elementFromPoint((L + R) / 2, (T + B) / 2) : null;
        const onTop = !!hit && (el.contains(hit) || hit.contains(el));
        return {
          ok: op > 0.05 && frac >= 0.6 && onTop,
          frac: +frac.toFixed(2),
          op: +op.toFixed(2),
          onTop,
          fv: el.matches(':focus-visible'),
          tag: el.tagName,
          id: el.id,
          cls: String(el.className),
          site: el.dataset && el.dataset.site,
          label: el.classList.contains('plbl') ? el.getAttribute('aria-label') : null,
          rect: [r.left, r.top, r.right, r.bottom].map(v => Math.round(v)),
        };
      },
      oldVisibleControl(el) {
        if (!el || el.disabled || el.closest("[hidden],[aria-hidden='true'],[inert]")) return false;
        if (!el.getClientRects().length) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth)
          return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
      },
    };
  });
const focusSeen = tab => tab.evaluate(() => window.__probe.seen(document.activeElement));
const visibleLabels = tab =>
  tab.evaluate(() =>
    [...document.querySelectorAll('#labels .plbl')]
      .filter(e => parseFloat(getComputedStyle(e).opacity) > 0.5 && e.getAttribute('aria-hidden') !== 'true')
      .map(e => e.getAttribute('aria-label')),
  );
const sheetCollapsed = tab => tab.evaluate(() => document.querySelector('#dossier').classList.contains('collapsed'));
const toggleSheet = async tab => {
  // a click that does not move focus: what moves focus here must be the engine's recovery, not the probe
  await tab.evaluate(() => document.querySelector('#dossier .grab')?.click());
  await tab.waitForTimeout(4000);
};
const setSheet = async (tab, collapsed) => {
  if ((await sheetCollapsed(tab)) !== collapsed) await toggleSheet(tab);
};
const turn = (tab, d) =>
  tab.evaluate(d => {
    const o = window.__atlas.orbW;
    o.fly = null;
    o.gyaw += d;
    o.yaw += d;
  }, d);
// real keyboard: Tab forward from the page start until a globe label (optionally a named one) owns focus
async function tabToLabel(tab, name) {
  await tab.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 1; i <= 160; i++) {
    await tab.keyboard.press('Tab');
    const a = await tab.evaluate(() => {
      const e = document.activeElement;
      return e && e.classList.contains('plbl') ? e.getAttribute('aria-label') : null;
    });
    if (a && (!name || a === name)) return { label: a, presses: i };
  }
  return null;
}

// S47-A1 + S47-C1: keyboard-reached label, then it is hidden; recovery must land on a really visible control
async function keyboardCases(tab, W) {
  await setSheet(tab, true);
  const vis = await visibleLabels(tab);
  ok(vis.length > 0, `${W}: labels visible with the sheet collapsed (${vis.length})`);
  const k = await tabToLabel(tab);
  ok(!!k, `${W}: Tab key traversal reaches a globe label (${k && k.label}, ${k && k.presses} presses)`);
  let f = await focusSeen(tab);
  ok(f.fv, `${W}: that label matches :focus-visible after Tab`);
  const site0 = await tab.evaluate(() => window.__atlas.S.site);
  await turn(tab, Math.PI);
  await tab.waitForTimeout(5000);
  f = await focusSeen(tab);
  console.log(`    turned away: focus -> ${JSON.stringify(f)}`);
  ok(!f.label, `${W}: focus left the hidden label`);
  ok(f.ok, `${W}: recovery target is visible (viewport ∩ clipping ancestors, opacity, hit test)`);
  ok(f.fv, `${W}: recovery target shows a focus ring (:focus-visible)`);
  ok((await tab.evaluate(() => window.__atlas.S.site)) === site0, `${W}: selection unchanged by recovery`);
  await turn(tab, -Math.PI);
  await tab.waitForTimeout(4000);
  // one more Tab moves on from the recovered control (traversal not trapped)
  const before = await focusSeen(tab);
  await tab.keyboard.press('Tab');
  const after = await focusSeen(tab);
  ok(JSON.stringify(after.rect) !== JSON.stringify(before.rect) || after.cls !== before.cls, `${W}: Tab continues from the recovered control`);
}

// S47-C1: the matching place row is on the viewport but scrolled outside the sheet's own scroll window
async function clippedRowCase(tab, W) {
  await setSheet(tab, true);
  const vis = await visibleLabels(tab);
  // a label whose site has a row in the place list
  const pick = await tab.evaluate(names => {
    for (const n of names) {
      const o = window.__atlas.SITE_EL.find(x => x.s.name === n);
      if (o && document.querySelector(`#dossier .place[data-site="${CSS.escape(o.s.id)}"], #dossier .stop[data-site="${CSS.escape(o.s.id)}"]`))
        return { name: n, id: o.s.id };
    }
    return null;
  }, vis);
  console.log(`    clipped-row candidate: ${JSON.stringify(pick)}`);
  if (!pick) {
    ok(true, `${W}: (no visible label with a list row in this state; clipped-row case not reachable here)`);
    return;
  }
  const k = await tabToLabel(tab, pick.name);
  ok(!!k, `${W}: Tab reaches label "${pick.name}" (${k && k.presses} presses)`);
  // the sheet stays collapsed (overflow hidden); its rows sit below the grab bar, on the viewport but clipped
  const geo = await tab.evaluate(id => {
    const row = document.querySelector(`#dossier .place[data-site="${CSS.escape(id)}"], #dossier .stop[data-site="${CSS.escape(id)}"]`);
    const d = document.querySelector('#dossier');
    const rr = row.getBoundingClientRect(),
      dr = d.getBoundingClientRect();
    return {
      row: [rr.top, rr.bottom].map(Math.round),
      sheet: [dr.top, dr.bottom].map(Math.round),
      onViewport: rr.bottom > 0 && rr.top < innerHeight,
      old: window.__probe.oldVisibleControl(row),
      seen: window.__probe.seen(row),
    };
  }, pick.id);
  console.log(`    row geometry (collapsed sheet): ${JSON.stringify(geo)}`);
  // if the collapsed sheet does not clip it, scroll an open sheet so the row is above the sheet's scroll window
  let clipped = geo.onViewport && !geo.seen.ok;
  if (!clipped) {
    await tab.evaluate(id => {
      const d = document.querySelector('#dossier');
      d.classList.remove('collapsed');
      const row = document.querySelector(`#dossier .place[data-site="${CSS.escape(id)}"], #dossier .stop[data-site="${CSS.escape(id)}"]`);
      d.scrollTop = row.offsetTop + row.offsetHeight + 40;
    }, pick.id);
    await tab.waitForTimeout(1500);
  }
  const geo2 = await tab.evaluate(id => {
    const row = document.querySelector(`#dossier .place[data-site="${CSS.escape(id)}"], #dossier .stop[data-site="${CSS.escape(id)}"]`);
    const rr = row.getBoundingClientRect();
    return { onViewport: rr.bottom > 0 && rr.top < innerHeight, old: window.__probe.oldVisibleControl(row), seen: window.__probe.seen(row) };
  }, pick.id);
  console.log(`    row before recovery: ${JSON.stringify(geo2)}`);
  ok(geo2.onViewport && !geo2.seen.ok, `${W}: matching row intersects the viewport but is clipped by its scrolling sheet`);
  ok(geo2.old === true, `${W}: checkpoint-48 visibleControl would have accepted that clipped row (the S47-C1 gap)`);
  const focused = await tab.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label'));
  if (focused !== pick.name) await tabToLabel(tab, pick.name);
  const site0 = await tab.evaluate(() => window.__atlas.S.site);
  await turn(tab, Math.PI);
  await tab.waitForTimeout(5000);
  const f = await focusSeen(tab);
  console.log(`    after hide: focus -> ${JSON.stringify(f)}`);
  ok(f.site !== pick.id, `${W}: focus did not go to the clipped row`);
  ok(f.ok && f.fv, `${W}: focus went to a visible control with a focus ring`);
  ok((await tab.evaluate(() => window.__atlas.S.site)) === site0, `${W}: selection unchanged`);
  await turn(tab, -Math.PI);
  await tab.evaluate(() => (document.querySelector('#dossier').scrollTop = 0));
  await tab.waitForTimeout(3000);
}

// S47-C2: selected label across both edges, with a real long name and a synthetic over-wide name
async function edgeSweep(tab, W, sid, tag) {
  await setSheet(tab, true);
  const seen = { flip: 0, dot: 0, text: 0, hidden: 0, tipL: 0, tipR: 0 };
  let worst = -1e9;
  const y0 = await tab.evaluate(() => window.__atlas.orbW.yaw);
  for (let k = -30; k <= 30; k++) {
    await tab.evaluate(
      ([y, d]) => {
        const o = window.__atlas.orbW;
        o.fly = null;
        o.gyaw = o.yaw = y + d;
      },
      [y0, k * 0.04],
    );
    await tab.waitForTimeout(500);
    const m = await tab.evaluate(id => {
      const o = window.__atlas.SITE_EL.find(x => x.s.id === id);
      const e = o.el;
      const vis = parseFloat(getComputedStyle(e).opacity) > 0.05 && e.getAttribute('aria-hidden') !== 'true';
      if (!vis) return { vis };
      const dot = e.classList.contains('dot');
      if (dot) e.focus(); // keyboard modality is already set by earlier Tab presses, so this shows :focus-visible
      const b = e.getBoundingClientRect();
      const tx = e.querySelector('.tx');
      const txs = getComputedStyle(tx);
      const t = txs.display !== 'none' ? tx.getBoundingClientRect() : null;
      const ring = 4; // 2px outline + 2px offset (engine.css button:focus-visible)
      const L = Math.min(b.left - ring, t ? t.left : 1e9),
        R = Math.max(b.right + ring, t ? t.right : -1e9);
      const out = { vis, dot, flip: e.classList.contains('flip'), tipl: e.classList.contains('tipl'), fv: e.matches(':focus-visible'), L, R, tipW: t && Math.round(t.width), tipLines: t ? Math.round(t.height / parseFloat(txs.lineHeight || 18)) : 0, sel: e.classList.contains('sel'), site: window.__atlas.S.site };
      if (dot) e.blur();
      return out;
    }, sid);
    assert.equal(m.site === undefined ? sid : m.site, sid, 'selection unchanged during the sweep');
    if (!m.vis) {
      seen.hidden++;
      continue;
    }
    seen[m.flip ? 'flip' : m.dot ? 'dot' : 'text']++;
    if (m.dot) seen[m.tipl ? 'tipL' : 'tipR']++;
    worst = Math.max(worst, m.R - W, -m.L);
    assert.ok(m.L >= -0.5 && m.R <= W + 0.5, `${W} ${tag}: label box/ring/tooltip inside the window at step ${k}: ${JSON.stringify(m)}`);
    assert.ok(m.sel, 'selected styling kept');
    if (m.dot) assert.ok(m.fv, 'focused selected pin shows its focus ring and tooltip');
  }
  await tab.evaluate(y => {
    const o = window.__atlas.orbW;
    o.gyaw = o.yaw = y;
  }, y0);
  await tab.waitForTimeout(2500);
  console.log(`    ${tag} sweep: ${JSON.stringify(seen)}, worst edge overflow ${worst.toFixed(1)}px (negative = inside)`);
  ok(worst <= 0.5, `${W} ${tag}: box, focus ring and tooltip never cross a window edge across 61 camera steps`);
  return seen;
}

try {
  // RM=reduce adds a reduced-motion pass; RM=only runs the reduced-motion pass alone (checkpoint 50)
  const passes = process.env.RM === 'only' ? [] : [[{ width: 390, height: 844 }, 'no-preference']];
  if (process.env.RM === 'reduce' || process.env.RM === 'only') passes.push([{ width: 390, height: 844 }, 'reduce']);
  for (const [vp, rm] of passes) {
    const { ctx, tab } = await open(vp, rm);
    await tab.waitForTimeout(15000);
    const W = vp.width;
    await keyboardCases(tab, W);
    await clippedRowCase(tab, W);
    if (rm === 'no-preference') {
      // longest real site name in the pack, selected
      const longest = await tab.evaluate(() => {
        const o = [...window.__atlas.SITE_EL].sort((a, b) => b.s.name.length - a.s.name.length)[0];
        return { id: o.s.id, name: o.s.name };
      });
      await tab.evaluate(id => window.__atlas.selectSite(id), longest.id);
      await tab.waitForTimeout(5000);
      const s1 = await edgeSweep(tab, W, longest.id, `longest real name "${longest.name}"`);
      ok(s1.text + s1.flip > 0, `${W}: longest real name shown as text somewhere in the sweep`);
      // synthetic over-wide name (test fixture only: the label's visible text is lengthened in the DOM so that
      // neither side of the pin can hold it; aria-label and data are untouched)
      await tab.evaluate(id => {
        const o = window.__atlas.SITE_EL.find(x => x.s.id === id);
        o.el.querySelector('.tx').textContent = o.s.name + ' — a deliberately over-long test name for the S47 pin tooltip';
        dispatchEvent(new Event('resize'));
      }, longest.id);
      await tab.waitForTimeout(1500);
      const s2 = await edgeSweep(tab, W, longest.id, 'synthetic over-wide name');
      ok(s2.dot > 0 && s2.flip === 0 && s2.text === 0, `${W}: over-wide selected name always collapses to a selected pin (${s2.dot} steps)`);
      ok(s2.tipL > 0 && s2.tipR > 0, `${W}: the pin tooltip opened on both sides (left ${s2.tipL}, right ${s2.tipR})`);
      // orientation change with the selected pin focused
      await tab.evaluate(id => window.__atlas.SITE_EL.find(x => x.s.id === id).el.focus(), longest.id);
      if (shots) await tab.screenshot({ path: `${shots}/s49-pin-tooltip-390x844.png` });
      await tab.setViewportSize({ width: 844, height: 390 });
      await tab.waitForTimeout(6000);
      const f = await focusSeen(tab);
      console.log(`    rotated 844x390: focus -> ${JSON.stringify(f)}`);
      ok(f.ok, '844x390: focus is on a visible control after rotation (label kept or recovered)');
      if (f.label) {
        const b = await tab.evaluate(() => {
          const e = document.activeElement;
          const t = e.querySelector('.tx');
          const r = [e.getBoundingClientRect(), getComputedStyle(t).display !== 'none' ? t.getBoundingClientRect() : e.getBoundingClientRect()];
          return { L: Math.min(r[0].left - 4, r[1].left), R: Math.max(r[0].right + 4, r[1].right) };
        });
        ok(b.L >= -0.5 && b.R <= 844.5, `844x390: focused label, ring and tooltip inside the window (${b.L.toFixed(0)}..${b.R.toFixed(0)})`);
      }
      if (shots) await tab.screenshot({ path: `${shots}/s49-rotated-844x390.png` });
    }
    await ctx.close();
  }
  ok(errors.length === 0, `zero console/request/page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
  log(`PASS ${passed} checks`);
} finally {
  await browser.close();
  server.kill();
}
