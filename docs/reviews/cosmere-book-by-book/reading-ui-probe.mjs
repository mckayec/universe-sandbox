// COS-BB-001 checkpoint 3 probe (rendered, Playwright + software GL): the Reading panel (reading-ui.js).
// Uses the real Cosmere pack plus an IN-MEMORY SYNTHETIC registry (fixture IDs fx-*, not research, never written
// to the pack). Checks: no panel without a registry; checklist/preset/All/legacy transitions; repeated taps;
// keyboard; Escape/close/reopen; narrowing while a world is selected; safe state opens the panel; 1440 and 390.
// Usage: node reading-ui-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:5173', shotDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const SYN = `;(function(){var P=window.ATLAS_PACKS.cosmere;var w=[];for(var k=1;k<=12;k++){if(k===2){w.push({id:'fx-2a',title:'Fixture 2a',bucket:2},{id:'fx-2b',title:'Fixture 2b',bucket:2},{id:'fx-2c',title:'Fixture 2c',bucket:2});}else w.push({id:'fx-'+k,title:'Fixture '+k,bucket:k});}
P.spoilers=Object.assign({},P.spoilers,{works:w,presets:[{id:'pub',label:'Fixture order',versions:[{v:1,seq:w.map(function(x){return x.id;})}]}]});})();`;
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
};
async function open(hash, { synthetic = true, vp = { width: 1440, height: 900 }, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  if (synthetic)
    await ctx.route('**/atlas/packs/cosmere.js', async r => {
      const res = await r.fetch();
      r.fulfill({ response: res, body: (await res.text()) + SYN });
    });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(400);
  return { ctx, p, errors };
}
const st = p => p.evaluate(() => JSON.stringify(window.__atlas.S.rd));
const hash = p => p.evaluate(() => decodeURIComponent(location.hash));
const ticks = p => p.$$eval('#rdPanel input[type=checkbox]:checked', a => a.map(x => x.dataset.work));
const worlds = p => p.evaluate(() => document.querySelectorAll('#index .world, #index [data-w]').length);

// 1. legacy-only pack: no Reading button
{
  const { ctx, p, errors } = await open('#book=3', { synthetic: false });
  ok((await p.$('#rdBtn')) === null, 'no Reading button without a registry');
  ok(errors.length === 0, 'no errors (legacy) ' + errors.join('|'));
  await ctx.close();
}
// 2. desktop flow
{
  const { ctx, p, errors } = await open('#read=fx-1');
  ok(!!(await p.$('#rdBtn.on')), 'button marked on in per-work mode');
  ok(await p.$eval('#rdPanel', e => e.hidden), 'panel closed at start for a valid link');
  await p.click('#rdBtn');
  ok(!(await p.$eval('#rdPanel', e => e.hidden)), 'panel opens');
  ok(JSON.stringify(await ticks(p)) === '["fx-1"]', 'only fx-1 ticked');
  const w1 = await worlds(p);
  await p.click('#rdPanel input[data-work="fx-3"]');
  ok(JSON.stringify(await ticks(p)) === '["fx-1","fx-3"]', 'ticking fx-3 ticks nothing else');
  ok((await hash(p)).includes('read=fx-1,fx-3'), 'URL read=fx-1,fx-3');
  ok((await p.$eval('#rdPanel .rd-status', e => e.textContent)).startsWith('Custom selection: 2 read'), 'custom label');
  ok((await p.$eval('#rdPanel .rd-sel', e => e.textContent)) === 'Selected: Fixture 1, Fixture 3', 'selected list');
  ok(!!(await p.$('#rdPanel .rd-note')), 'unreviewed note shown (fallback records visible)');
  // repeated taps: fx-2a on/off/on
  for (let i = 0; i < 3; i++) await p.click('#rdPanel input[data-work="fx-2a"]');
  ok(JSON.stringify(await ticks(p)) === '["fx-1","fx-2a","fx-3"]', 'triple tap ends ticked');
  // preset
  await p.selectOption('#rdPanel select[data-preset="pub"]', 'fx-3');
  ok((await st(p)) === '{"mode":"preset","preset":"pub","v":1,"work":"fx-3"}', 'preset state');
  ok((await hash(p)).includes('upto=pub:1:fx-3'), 'URL upto');
  ok(JSON.stringify(await ticks(p)) === '["fx-1","fx-2a","fx-2b","fx-2c","fx-3"]', 'preset prefix ticked');
  const w3 = await worlds(p);
  ok(w3 >= w1, 'preset through fx-3 shows at least as many worlds as fx-1');
  // narrowing while a world is selected: select a visible world, untick fx-1 → bucket-1 worlds hidden
  const sel = await p.evaluate(() => {
    const A = window.__atlas;
    const w = A.pack.worlds.find(x => (x.first || 1) === 1 && document.querySelector('[data-w="' + x.id + '"]'));
    if (w) A.selectWorld(w.id, true);
    return w ? w.id : null;
  });
  await p.waitForTimeout(300);
  await p.click('#rdPanel input[data-work="fx-1"]');
  await p.waitForTimeout(300);
  ok((await st(p)).includes('"mode":"set"'), 'unticking from preset → custom set');
  const after = await p.evaluate(() => window.__atlas.S.sel);
  ok(!sel || after === null, 'selected bucket-1 world deselected after narrowing (' + sel + ' → ' + after + ')');
  ok((await worlds(p)) < w3, 'world list narrowed after unticking fx-1');
  // keyboard: focus fx-1 checkbox, Space toggles back on; Escape closes and returns focus
  await p.focus('#rdPanel input[data-work="fx-1"]');
  await p.keyboard.press('Space');
  ok((await ticks(p)).includes('fx-1'), 'Space ticks fx-1');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.dataset.work === 'fx-1'), 'focus kept after re-render');
  await p.keyboard.press('Escape');
  ok(await p.$eval('#rdPanel', e => e.hidden), 'Escape closes');
  ok(await p.evaluate(() => document.activeElement && document.activeElement.id === 'rdBtn' || document.activeElement === document.body), 'focus returns');
  // reopen, Show all books
  await p.click('#rdBtn');
  await p.click('#rdPanel [data-all]');
  ok((await st(p)) === '{"mode":"all"}', 'All chosen');
  ok(!/read=|upto=/.test(await hash(p)), 'URL cleared');
  ok((await ticks(p)).length === 0, 'All ticks nothing');
  ok((await p.$eval('#books [data-b="0"]', e => e.getAttribute('aria-pressed'))) === 'true', 'bar All pressed');
  // legacy via the book bar
  await p.click('#rdPanel [data-close]');
  await p.click('#books [data-b="3"]');
  await p.waitForTimeout(300);
  ok((await st(p)) === '{"mode":"legacy","book":3}', 'legacy via bar');
  await p.click('#rdBtn');
  ok((await ticks(p)).length === 0 && (await p.$eval('#rdPanel .rd-status', e => e.textContent)).includes('series grouping'), 'legacy shown in panel');
  // per-work → bar shows nothing pressed
  await p.click('#rdPanel input[data-work="fx-2b"]');
  ok((await p.$$eval('#books [aria-pressed="true"]', a => a.length)) === 0, 'bar has no pressed book in per-work mode');
  if (shotDir) await p.screenshot({ path: shotDir + '/reading-panel-1440.png' });
  ok(errors.length === 0, 'no errors (desktop) ' + errors.join('|'));
  await ctx.close();
}
// 3. safe state opens the panel; storage not written
{
  const { ctx, p, errors } = await open('#read=nope');
  ok(!(await p.$eval('#rdPanel', e => e.hidden)), 'safe state opens the panel');
  ok(!!(await p.$('#rdPanel .rd-status.rd-safe')), 'safe status line');
  ok(!!(await p.$('#rdBtn.warn')), 'button warns');
  ok((await p.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('atlas-read:v2')).length)) === 0, 'no storage in safe');
  await p.click('#rdPanel input[data-work="fx-1"]');
  ok((await st(p)) === '{"mode":"set","ids":["fx-1"]}', 'deliberate choice leaves safe');
  ok((await hash(p)).includes('read=fx-1') && !(await hash(p)).includes('nope'), 'rejected parameter replaced after choice');
  ok(errors.length === 0, 'no errors (safe) ' + errors.join('|'));
  await ctx.close();
}
// 4. phone
{
  const { ctx, p, errors } = await open('#upto=pub:1:fx-2c', { vp: { width: 390, height: 844 }, mobile: true });
  await p.tap('#rdBtn');
  const box = await p.$eval('#rdPanel', e => {
    const r = e.getBoundingClientRect();
    return { l: r.left, r: r.right, b: r.bottom, w: innerWidth, h: innerHeight };
  });
  ok(box.l >= 0 && box.r <= box.w && box.b <= box.h, 'panel inside the 390 viewport ' + JSON.stringify(box));
  const small = await p.$$eval('#rdPanel label:has(input), #rdPanel select, #rdPanel .btn', a =>
    a.filter(e => e.getBoundingClientRect().height < 40).length,
  );
  ok(small === 0, 'touch targets >= 40px');
  await p.tap('#rdPanel input[data-work="fx-2a"]');
  ok((await st(p)).includes('"mode":"set"'), 'tap unticks into a custom set');
  if (shotDir) await p.screenshot({ path: shotDir + '/reading-panel-390.png' });
  ok(errors.length === 0, 'no errors (phone) ' + errors.join('|'));
  await ctx.close();
}
// 5. families 7/8: delayed place selection cancelled on a state change; hidden deep links; Back/Forward
{
  const ALL = 'fx-1,fx-2a,fx-2b,fx-2c,' + [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => 'fx-' + k).join(',');
  const probe = await open('#read=fx-1', { synthetic: true });
  const pick = await probe.p.evaluate(() => {
    const P = window.__atlas.pack;
    const first = w => w.first || (w.books && w.books.length ? Math.min(...w.books) : 1);
    const minb = s => (s.books && s.books.length ? Math.min(...s.books) : s.book || null);
    const w1 = P.worlds.find(w => first(w) === 1 && (w.sites || []).some(s => !minb(s) || minb(s) <= 1));
    const s1 = w1 && w1.sites.find(s => !minb(s) || minb(s) <= 1);
    const sLate = w1 && w1.sites.find(s => minb(s) > 1);
    const wLate = P.worlds.find(w => first(w) > 1 && !w.realm && !w.noSurface);
    return { w1: w1 && w1.id, s1: s1 && s1.id, sLate: sLate && sLate.id, wLate: wLate && wLate.id };
  });
  await probe.ctx.close();
  ok(pick.w1 && pick.s1 && pick.wLate, 'fixture places found ' + JSON.stringify(pick));
  // 5a. delayed site selection (openEvent → descend + 900 ms site timer). Software GL bakes planets slowly, so
  // everything that must happen before the timer runs inside one evaluate; settle() waits for the bake.
  const settle = async p => {
    await p.waitForTimeout(1500);
    await p.waitForFunction(() => document.querySelector('#bake').hidden, null, { timeout: 180000, polling: 500 });
    await p.waitForTimeout(1500);
    await p.evaluate(() => 0);
  };
  for (const change of [true, false]) {
    const { ctx, p, errors } = await open('#read=' + ALL + '&world=' + pick.w1 + '&view=surface');
    await settle(p);
    const target = await p.evaluate(
      ([w1, change]) => {
        const A = window.__atlas;
        const e = A.pack.events.find(x => x.world !== w1 && x.site && A.pack.worlds.some(w => w.id === x.world && (w.sites || []).some(s => s.id === x.site)));
        document.querySelector('#rdBtn').click();
        A.openEvent(e.id, true);
        if (change) {
          document.querySelector('#rdPanel input[data-work="fx-12"]').click();
          document.querySelector('#rdPanel input[data-work="fx-12"]').click();
        }
        return { ev: e.id, world: e.world, site: e.site, rd: JSON.stringify(A.S.rd) };
      },
      [pick.w1, change],
    );
    await settle(p);
    const r = await p.evaluate(() => ({ sel: window.__atlas.S.sel, site: window.__atlas.S.site, rd: JSON.stringify(window.__atlas.S.rd) }));
    if (change) {
      ok(r.sel === target.world && r.site === null, 'pending site selection dropped after a state change ' + JSON.stringify([target, r]));
      ok(r.rd === JSON.stringify({ mode: 'set', ids: ALL.split(',') }), 'state ended identical after the double toggle ' + r.rd);
    } else ok(r.sel === target.world && r.site === target.site, 'control: site selected when nothing changed ' + JSON.stringify([target, r]));
    ok(errors.length === 0, 'no errors (5a ' + change + ') ' + errors.join('|'));
    await ctx.close();
  }
  // 5b. deep link to a hidden world stays on the galaxy with a note
  {
    const { ctx, p, errors } = await open('#read=fx-1&world=' + pick.wLate + '&view=surface');
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({ sel: window.__atlas.S.sel, view: window.__atlas.S.view, hint: document.querySelector('#navhint').textContent }));
    ok(r.sel !== pick.wLate && r.view === 'galaxy', 'hidden world not opened ' + JSON.stringify(r));
    ok(/not revealed/.test(r.hint), 'not-revealed note shown');
    ok(errors.length === 0, 'no errors (5b) ' + errors.join('|'));
    await ctx.close();
  }
  // 5c. deep link to a hidden site on a visible world: world opens, site does not
  if (pick.sLate) {
    const { ctx, p } = await open('#read=fx-1&world=' + pick.w1 + '&view=surface&site=' + pick.sLate);
    await settle(p);
    const r = await p.evaluate(() => ({ sel: window.__atlas.S.sel, site: window.__atlas.S.site, view: window.__atlas.S.view }));
    ok(r.sel === pick.w1 && r.view === 'world' && r.site === null, 'hidden site not selected ' + JSON.stringify(r));
    await ctx.close();
  }
  // 5d. Back/Forward: on a late world's surface, narrow to fx-1 (leaves the surface), then Forward does not reopen it
  {
    const { ctx, p, errors } = await open('#read=' + ALL);
    await p.evaluate(w => window.__atlas.descend(w), pick.wLate);
    await settle(p);
    ok((await p.evaluate(() => window.__atlas.S.view)) === 'world', 'on the late world surface');
    await p.evaluate(() => {
      document.querySelector('#rdBtn').click();
      const sel = document.querySelector('#rdPanel select[data-preset="pub"]');
      sel.value = 'fx-1';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await p.waitForTimeout(3000);
    await p.evaluate(() => 0);
    let r = await p.evaluate(() => ({ sel: window.__atlas.S.sel, view: window.__atlas.S.view }));
    ok(r.view === 'galaxy' && r.sel === null, 'narrowing left the hidden surface ' + JSON.stringify(r));
    await p.evaluate(() => history.forward());
    await p.waitForTimeout(1500);
    r = await p.evaluate(() => ({ sel: window.__atlas.S.sel, view: window.__atlas.S.view, h: location.hash }));
    ok(r.view === 'galaxy' && r.sel !== pick.wLate, 'Forward does not reopen the hidden surface ' + JSON.stringify(r));
    ok(errors.length === 0, 'no errors (5d) ' + errors.join('|'));
    await ctx.close();
  }
}
await browser.close();
console.log('reading-ui probe: ' + pass + '/' + (pass + fail) + ' passed');
process.exit(fail ? 1 : 0);
