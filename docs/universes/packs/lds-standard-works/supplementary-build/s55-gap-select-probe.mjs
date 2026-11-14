// Checkpoint 55 probe: grouped browser acceptance (HANDOFF_PLAN 2026-11-03, "Checkpoint 54 closure").
//   G. Rendered compact chrome-gap boundary. In LDS at 390 px wide with the sheet collapsed, the viewport height is
//      chosen so the DOM open area (lowest top chrome row .. sheet/chronicle top, measured here independently of the
//      engine) is 119, 120 and 121 px. At each gap the camera's applied view offset (orbW.cam.view.offsetY, read from
//      the live camera) must equal the independently computed expectation (119: fixed H*0.07; 120/121: centre of the
//      open area, clamped to +-30% H). Shown place labels must sit wholly inside the window and off every chrome band;
//      hidden labels must be out of the Tab order and aria-hidden. Focus (a place label or the grab bar, reached by
//      real Tab) must stay on, or be recovered to, an effectively visible control; selection and reading position
//      (S.sel/S.site/S.book) must not change. Sequence, twice: 121 -> 120 -> 119 -> 120 -> 121 -> rotate (swap
//      width/height) -> 119; plus sheet expand/collapse by real Enter on the grab bar at 120.
//      Run once with normal motion and once in a reducedMotion:'reduce' context (there the offset must be applied
//      without easing: checked one frame after the resize settles, not after a wait).
//   S. Native select (#cxPick) popup path: Alt+ArrowDown / Space / F4 on the focused picker, then ArrowDown + Enter.
//      Records whether the popup opened (select:open where supported) and whether the keyboard choice was committed,
//      separate from the closed-control keyboard path already covered in checkpoint 51.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s55-gap-select-probe.mjs
// Env: CHROME_PATH optional; PORT (default 4195); SHOTS dir for screenshots; PARTS (subset of "GRS"; R = reduced G).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4195);
const origin = `http://127.0.0.1:${port}`;
const PACK = 'lds-standard-works';
const parts = process.env.PARTS || 'GRS';
const shots = process.env.SHOTS;
if (shots) mkdirSync(shots, { recursive: true });
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(`${origin}/atlas/?pack=${PACK}`)).ok) break;
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

async function open(vp, reduced) {
  const ctx = await browser.newContext({
    viewport: vp,
    isMobile: true,
    hasTouch: true,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
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
  const t = Date.now();
  await tab.goto(`${origin}/atlas/?pack=${PACK}`, { waitUntil: 'domcontentloaded' });
  await tab.waitForFunction(() => document.querySelector('#splash.out') && window.__atlas && window.__atlas.S, null, {
    timeout: 300000,
  });
  await tab.waitForTimeout(5000);
  log(`${vp.width}x${vp.height}${reduced ? ' reduced-motion' : ''} ready in ${((Date.now() - t) / 1000).toFixed(1)} s`);
  return { ctx, tab };
}

// Independent measurement: open area from the DOM, live camera offset, expected offset, label audit.
const measure = tab =>
  tab.evaluate(() => {
    const W = innerWidth,
      H = innerHeight;
    const R = s => {
      const e = document.querySelector(s);
      if (!e || e.hidden || !e.getClientRects().length) return null;
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1 || r.right <= 0 || r.left >= W || r.bottom <= 0 || r.top >= H) return null;
      return r;
    };
    let a = 0;
    ['header.top', '#crumbs', '#realms', '#filters'].forEach(s => {
      const r = R(s);
      if (r) a = Math.max(a, r.bottom);
    });
    let b = H;
    ['#dossier', '#chron'].forEach(s => {
      const r = R(s);
      if (r) b = Math.min(b, r.top);
    });
    const bands = [];
    if (a > 0) bands.push([0, a]);
    ['#index', '#skyBtn'].forEach(s => {
      const r = R(s);
      if (r) bands.push([r.top, r.bottom]);
    });
    if (b < H) bands.push([b, H]);
    const gap = b - a;
    const exp = gap >= 120 ? Math.max(-H * 0.3, Math.min(H * 0.3, H / 2 - (a + b) / 2)) : H * 0.07;
    const other = gap >= 120 ? H * 0.07 : Math.max(-H * 0.3, Math.min(H * 0.3, H / 2 - (a + b) / 2));
    const cam = window.__atlas.orbW.cam;
    const oy = cam.view && cam.view.enabled ? cam.view.offsetY : 0;
    let shown = 0,
      badShown = [],
      badHidden = [];
    (window.__atlas.SITE_EL || []).forEach(o => {
      const el = o.el;
      const vis = el.tabIndex === 0;
      if (vis) {
        shown++;
        const r = el.classList.contains('dot') ? null : el.getBoundingClientRect();
        if (r && (r.left < -0.5 || r.right > W + 0.5 || bands.some(([p, q]) => r.top < q && r.bottom > p)))
          badShown.push(`${o.s.name}@${Math.round(r.left)},${Math.round(r.top)}`);
        if (el.getAttribute('aria-hidden') === 'true') badShown.push(`${o.s.name}:aria-hidden`);
      } else if (el.getAttribute('aria-hidden') !== 'true') badHidden.push(o.s.name);
    });
    const S = window.__atlas.S;
    const dos = document.querySelector('#dossier');
    return {
      W,
      H,
      a: +a.toFixed(2),
      b: +b.toFixed(2),
      gap: +gap.toFixed(2),
      oy: +oy.toFixed(2),
      exp: +exp.toFixed(2),
      other: +other.toFixed(2),
      collapsed: !!dos && dos.classList.contains('collapsed'),
      shown,
      badShown,
      badHidden,
      state: JSON.stringify([S.view, S.sel, S.site, S.book]),
    };
  });

// Effective visibility of the focused element (same independent check as s54).
const focused = tab =>
  tab.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { id: 'BODY', vis: false };
    const r = e.getBoundingClientRect();
    let L = Math.max(r.left, 0),
      T = Math.max(r.top, 0),
      Rr = Math.min(r.right, innerWidth),
      B = Math.min(r.bottom, innerHeight),
      op = 1,
      hid = false;
    for (let a = e; a && a.nodeType === 1; a = a.parentElement) {
      const cs = getComputedStyle(a);
      op *= parseFloat(cs.opacity);
      if (cs.visibility === 'hidden' || cs.display === 'none' || a.hidden || a.inert) hid = true;
      if (a === e || a === document.body || a === document.documentElement) continue;
      const c = a.getBoundingClientRect();
      if (/hidden|scroll|auto|clip/.test(cs.overflowX)) ((L = Math.max(L, c.left)), (Rr = Math.min(Rr, c.right)));
      if (/hidden|scroll|auto|clip/.test(cs.overflowY)) ((T = Math.max(T, c.top)), (B = Math.min(B, c.bottom)));
    }
    const area = Rr - L > 0 && B - T > 0;
    const hit = area ? document.elementFromPoint((L + Rr) / 2, (T + B) / 2) : null;
    let ring = false;
    try {
      ring = e.matches(':focus-visible');
    } catch {}
    return {
      id: `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.classList.contains('slbl') ? '.slbl' : ''}`,
      label: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 28),
      vis: !hid && op > 0.05 && area && !!hit && (e.contains(hit) || hit.contains(e)),
      ring,
    };
  });

// Settle: wait until the applied offset stops moving (normal motion eases over a few frames).
async function settle(tab) {
  let prev = null;
  for (let i = 0; i < 40; i++) {
    await tab.waitForTimeout(150);
    const m = await measure(tab);
    if (prev && Math.abs(m.oy - prev.oy) < 0.01 && m.gap === prev.gap) return m;
    prev = m;
  }
  return prev;
}

// Find an integer viewport height whose rendered gap is exactly g (or the closest bracket), width fixed.
async function heightFor(tab, W, g) {
  let m = await settle(tab);
  let H = m.H;
  const tried = new Map();
  for (let i = 0; i < 12; i++) {
    const d = m.gap - g;
    if (Math.abs(d) < 0.01) return { H, m };
    H = Math.round(H - d);
    if (tried.has(H)) break;
    tried.set(H, true);
    await tab.setViewportSize({ width: W, height: H });
    m = await settle(tab);
  }
  return { H, m };
}

async function ensureCollapsed(tab, want) {
  const c = await tab.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'));
  if (c !== want) {
    await tab.locator('#grab').focus();
    await tab.keyboard.press('Enter');
    await tab.waitForTimeout(800);
  }
}

// Focus a shown place label by real Tab (bounded); fall back to the grab bar by real Tab.
async function tabToLabel(tab) {
  await tab.evaluate(() => document.activeElement?.blur());
  for (let i = 0; i < 70; i++) {
    await tab.keyboard.press('Tab');
    const f = await focused(tab);
    if (f.id.endsWith('.slbl') || f.id.startsWith('button.slbl') || /slbl/.test(f.id)) return f;
    const isLbl = await tab.evaluate(() => {
      const e = document.activeElement;
      return !!(e && (window.__atlas.SITE_EL || []).some(o => o.el === e));
    });
    if (isLbl) return f;
  }
  return null;
}

function checkGap(tag, m, g, reduced) {
  console.log(`    ${tag}: ${JSON.stringify(m)}`);
  ok(Math.abs(m.gap - g) < 0.01, `${tag}: rendered DOM gap is ${g} px (a=${m.a}, b=${m.b}, H=${m.H})`);
  ok(
    Math.abs(m.oy - m.exp) < 0.6,
    `${tag}: applied camera offset ${m.oy} = expected ${m.exp} (${g >= 120 ? 'centred in open area' : 'fixed H*0.07'}; other rule would give ${m.other})`,
  );
  ok(
    m.badShown.length === 0,
    `${tag}: ${m.shown} shown labels all inside the window and off the chrome${m.badShown.length ? ' ' + m.badShown.join(' ') : ''}`,
  );
  ok(
    m.badHidden.length === 0,
    `${tag}: hidden labels aria-hidden / out of Tab order${m.badHidden.length ? ' ' + m.badHidden.join(' ') : ''}`,
  );
}

async function partG(reduced) {
  const mode = reduced ? 'RM' : 'NM';
  const W = 390;
  const { ctx, tab } = await open({ width: W, height: 640 }, reduced);
  await ensureCollapsed(tab, true);
  let m0 = await settle(tab);
  ok(m0.collapsed, `${mode}: sheet collapsed by real Enter on the grab bar`);
  const lbl = await tabToLabel(tab);
  const focusKind = lbl ? 'place label' : 'none';
  ok(!!lbl && lbl.vis, `${mode}: a shown place label reached by real Tab (${lbl && lbl.label})`);
  const state0 = (await measure(tab)).state;
  console.log(`    ${mode} state ${state0}, focus ${JSON.stringify(lbl)}`);
  const focusCheck = async tag => {
    const f = await focused(tab);
    ok(
      f.id !== 'BODY' && f.vis,
      `${tag}: focus on an effectively visible control (${f.id} "${f.label}", ring ${f.ring})`,
    );
    const s = (await measure(tab)).state;
    ok(s === state0, `${tag}: view/selection/reading unchanged ${s}`);
  };
  const Hs = {};
  for (let round = 1; round <= 2; round++) {
    if (round === 2) {
      // start round 2 from a focused place label again (round 1 hands focus to the grab bar at 119)
      await tab.setViewportSize({ width: W, height: Hs[121] });
      await settle(tab);
      const l2 = await tabToLabel(tab);
      ok(!!l2 && l2.vis, `${mode} r2: place label re-focused by real Tab (${l2 && l2.label})`);
    }
    for (const g of [121, 120, 119, 120, 121]) {
      const tag = `${mode} r${round} gap ${g}`;
      let r;
      if (Hs[g]) {
        await tab.setViewportSize({ width: W, height: Hs[g] });
        if (reduced) {
          // no easing: the offset is applied at the resize, checked after two frames rather than a settle wait
          await tab.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
          const quick = await measure(tab);
          ok(
            Math.abs(quick.oy - quick.exp) < 0.6,
            `${tag}: reduced motion applies ${quick.exp} within two frames (got ${quick.oy})`,
          );
        }
        r = { H: Hs[g], m: await settle(tab) };
      } else {
        r = await heightFor(tab, W, g);
        Hs[g] = r.H;
      }
      checkGap(tag, r.m, g, reduced);
      await focusCheck(tag);
      if (shots && round === 1 && !reduced && !Hs[`shot${g}`]) {
        Hs[`shot${g}`] = 1;
        await tab.screenshot({ path: `${shots}/s55-gap${g}-390x${r.H}.jpg`, type: 'jpeg', quality: 70 });
      }
    }
    // rotation: swap to landscape and back to the 119 height
    const tagR = `${mode} r${round} rotate`;
    await tab.setViewportSize({ width: Hs[119], height: W });
    const mr = await settle(tab);
    console.log(`    ${tagR} landscape: ${JSON.stringify(mr)}`);
    ok(
      Math.abs(mr.oy - mr.exp) < 0.6,
      `${tagR}: landscape ${mr.W}x${mr.H} offset ${mr.oy} = expected ${mr.exp} (gap ${mr.gap})`,
    );
    ok(mr.badShown.length === 0, `${tagR}: landscape shown labels inside window, off chrome ${mr.badShown.join(' ')}`);
    await focusCheck(`${tagR} landscape`);
    await tab.setViewportSize({ width: W, height: Hs[119] });
    const mb = await settle(tab);
    checkGap(`${tagR} back to 119`, mb, 119, reduced);
    await focusCheck(`${tagR} back`);
  }
  // sheet expand / collapse by real Enter on the grab bar at the 120 height
  await tab.setViewportSize({ width: W, height: Hs[120] });
  await settle(tab);
  await tab.locator('#grab').focus();
  await tab.keyboard.press('Enter');
  const me = await settle(tab);
  console.log(`    ${mode} sheet expanded @120: ${JSON.stringify(me)}`);
  ok(
    !me.collapsed && Math.abs(me.oy - me.exp) < 0.6,
    `${mode}: sheet expanded -> gap ${me.gap}, offset ${me.oy} = ${me.exp}`,
  );
  ok(me.badShown.length === 0, `${mode}: sheet expanded -> no shown label under the sheet ${me.badShown.join(' ')}`);
  await tab.keyboard.press('Enter');
  const mc = await settle(tab);
  checkGap(`${mode} sheet collapsed again`, mc, 120, reduced);
  const fg = await focused(tab);
  ok(
    fg.id === 'div#grab' && fg.vis && fg.ring,
    `${mode}: grab bar keeps visible focus with ring through the toggle (${JSON.stringify(fg)})`,
  );
  ok((await measure(tab)).state === state0, `${mode}: selection/reading unchanged through the sheet toggle`);
  console.log(
    `    ${mode} heights used: ${JSON.stringify(Object.fromEntries(Object.entries(Hs).filter(([k]) => !k.startsWith('shot'))))}; focus kind ${focusKind}`,
  );
  await ctx.close();
}

async function partS() {
  const { ctx, tab } = await open({ width: 390, height: 844 }, false);
  await tab.evaluate(() => document.activeElement?.blur());
  let reached = false;
  for (let i = 0; i < 90 && !reached; i++) {
    await tab.keyboard.press('Tab');
    reached = (await focused(tab)).id === 'button#cxBtn';
  }
  ok(reached, 'S: Codex button reached by real Tab');
  await tab.keyboard.press('Enter');
  await tab.locator('#codex').waitFor({ state: 'visible' });
  for (let i = 0; i < 6 && (await focused(tab)).id !== 'select#cxPick'; i++) await tab.keyboard.press('Tab');
  ok((await focused(tab)).id === 'select#cxPick', 'S: picker focused by real Tab');
  const st = () =>
    tab.evaluate(() => {
      const s = document.querySelector('#cxPick');
      let open = null;
      try {
        open = s.matches(':open');
      } catch {}
      return { i: s.selectedIndex, v: s.value, open };
    });
  for (const key of ['Alt+ArrowDown', 'Space', 'F4']) {
    const s0 = await st();
    await tab.keyboard.press(key);
    await tab.waitForTimeout(500);
    const s1 = await st();
    await tab.keyboard.press('ArrowDown');
    await tab.waitForTimeout(300);
    const s2 = await st();
    await tab.keyboard.press('Enter');
    await tab.waitForTimeout(500);
    const s3 = await st();
    const f = await focused(tab);
    const codexOpen = await tab.evaluate(() => !document.querySelector('#codex').hidden);
    console.log(
      `    S ${key}: before ${JSON.stringify(s0)} opened ${JSON.stringify(s1)} after ArrowDown ${JSON.stringify(s2)} after Enter ${JSON.stringify(s3)} focus ${f.id} codex open ${codexOpen}`,
    );
    const popup = s1.open === true;
    ok(
      s3.i === s0.i + 1 || s3.i === s0.i,
      `S ${key}: ${popup ? 'popup opened (:open true); ' : s1.open === false ? 'no popup (:open false); ' : ':open unsupported; '}choice after ArrowDown+Enter index ${s0.i} -> ${s3.i}`,
    );
    ok(
      f.id === 'select#cxPick' && codexOpen && s3.open !== true,
      `S ${key}: focus back on the picker, Codex still open, popup closed`,
    );
    if (s3.i !== s0.i) {
      await tab.keyboard.press('Home');
      await tab.waitForTimeout(300);
    }
  }
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => document.querySelector('#codex').hidden);
  ok((await focused(tab)).id === 'button#cxBtn', 'S: Escape closes the Codex and returns focus to the Codex button');
  await ctx.close();
}

try {
  if (parts.includes('G')) await partG(false);
  if (parts.includes('R')) await partG(true);
  if (parts.includes('S')) await partS();
} catch (e) {
  failed.push(`exception: ${e.stack || e}`);
  console.log(`  FAIL exception ${e.stack || e}`);
}
ok(errors.length === 0, `no console/request/page errors${errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''}`);
console.log(
  `\n${failed.length ? 'FAIL' : 'PASS'} ${passed} passed, ${failed.length} failed (${((Date.now() - t0) / 1000).toFixed(0)} s)`,
);
failed.forEach(f => console.log(`  - ${f}`));
await browser.close();
server.kill();
process.exit(failed.length ? 1 : 0);
