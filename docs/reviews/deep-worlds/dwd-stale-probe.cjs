// Stale/upgrade rows for the Society disposition batch, in a FRESH browser per viewport (no amplified page before it).
// Usage: [VP=1440x900,390x844] node dwd-stale-probe.cjs <port>
// Why separate: in dwd-flood-probe.cjs the stale page follows the amplified (__floodH) page in the same browser; there
// click() first opens the compact bottom sheet (a closed sheet swallows the first tap by design).
// the rendered click times out and the 400 ms fade callback is starved past the 10 s wait (2026-11-09 run).
// This probe polls up to 30 s and records the time the app took to leave the scene.
const { chromium } = require('playwright'); const PORT = process.argv[2] || 4199;
const VPS = (process.env.VP || '1440x900,390x844').split(',').map(s => s.split('x').map(Number));
(async () => {
  let fails = 0;
  const ok = (n, c, d) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + d : '')); };
  for (const [w, h] of VPS) {
    const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { window.__atlasFast = true; });
    await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`);
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    const A = (f, a) => p.evaluate(f, a);
    const book = async k => { await A(k => window.__atlas.selectBook(k), k); await p.waitForTimeout(400); };
    const enter = async () => { await A(() => window.__atlas.enterSite('tyche'));
      await p.waitForFunction(() => window.__atlas.mode === 'site' && window.__atlas.curSite && window.__atlas.curSite.name === 'Tyche' && document.querySelector('[data-tog=storms]'), null, { timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(1500); };
    const pr = () => A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    const click = async () => { let how = 'rendered';
      await A(() => { const h = document.querySelector('.sheet-handle'); if (h && !document.body.classList.contains('sheet-open')) h.click(); }); await p.waitForTimeout(300);
      await p.click('[data-tog=storms]', { force: true, timeout: 8000 }).catch(async () => { how = 'dom'; await A(() => document.querySelector('[data-tog=storms]').click()); });
      await p.waitForTimeout(500); return how; };
    const st = () => A(() => ({ m: window.__atlas.mode, c: window.__atlas.curSite && window.__atlas.curSite.name, era: window.__atlas.ERA }));
    await book(5); await enter(); const how = await click(); const pOn = await pr();
    const t0 = Date.now(); await A(() => window.__atlas.selectBook(4));
    await p.waitForFunction(() => window.__atlas.mode !== 'site', null, { timeout: 30000 }).catch(() => {});
    const ms = Date.now() - t0; await p.waitForTimeout(800); const s = await st();
    ok(`${w} V→IV inside Tyche with storms on leaves scene`, pOn === 'true' && s.m === 'globe' && !s.c && s.era === 4, `${how} ${pOn} left after ${ms} ms ${JSON.stringify(s)}`);
    await book(5); await enter(); const pr5 = await pr();
    ok(`${w} re-entry at V after storms-on downgrade: toggle unpressed`, pr5 === 'false', pr5);
    const how2 = await click(); const pOn2 = await pr(); await A(() => window.__atlas.selectBook(6)); await p.waitForTimeout(1500);
    const s6 = await st(); const pr6 = await pr();
    ok(`${w} V→VI upgrade with storms on keeps scene and toggle`, pOn2 === 'true' && s6.m === 'site' && s6.c === 'Tyche' && s6.era === 6 && pr6 === 'true', `${how2} ${JSON.stringify(s6)} ${pr6}`);
    ok(`${w} no page errors`, errs.length === 0, errs.join('|'));
    await b.close();
  }
  console.log(fails ? `FAILED ${fails}` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
