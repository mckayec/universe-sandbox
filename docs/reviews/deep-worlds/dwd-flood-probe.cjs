// Tyche flood + stale-exit probe for the Society disposition batch (replaces the stale row of dwd-focus-probe.cjs).
// Usage: node dwd-flood-probe.cjs <port> <head|parent> [VP=1440x900,390x844]
// 2026-11-09 17:20Z: click() first opens the compact bottom sheet (by design a closed sheet swallows the first tap), fixing false 390 FAILs.
// Sea rows use the __floodH=43000 test hook (amplifies sea displacement for detection under swiftshader).
// Stale rows use a separate page WITHOUT the amplifier: with it, swiftshader frames take seconds and the
// 400 ms fade callback is starved for ~30 s (diagnosed 2026-11-09; see fix-return-68d47ce.md).
// head: VI fresh entry must be steady (no forced flood). parent (2f04e41): VI fresh entry must rise (discriminator).
const { chromium } = require('playwright'); const PORT = process.argv[2] || 4199; const MODE = process.argv[3] || 'head';
const VPS = (process.env.VP || '1440x900,390x844').split(',').map(s => s.split('x').map(Number));
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let fails = 0; const ok = (n, c, d) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + d : '')); };
  const open = async (w, h, amp) => { const p = await b.newPage({ viewport: { width: w, height: h } }); p.errs = []; p.on('pageerror', e => p.errs.push(e.message));
    await p.addInitScript(a => { window.__atlasFast = true; if (a) window.__floodH = 43000; }, amp);
    await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`); await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 }); await p.waitForTimeout(1500); return p; };
  const H = p => ({ A: (f, a) => p.evaluate(f, a),
    book: async k => { await p.evaluate(k => window.__atlas.selectBook(k), k); await p.waitForTimeout(400); },
    enter: async () => { await p.evaluate(() => window.__atlas.enterSite('tyche')); await p.waitForFunction(() => window.__atlas.curSite && window.__atlas.curSite.name === 'Tyche' && window.__atlas.mode === 'site' && document.querySelector('[data-tog=storms]'), null, { timeout: 30000 }).catch(() => {}); await p.waitForTimeout(1500); },
    seaY: () => p.evaluate(() => { let best = null; window.__atlas.site3.traverse(o => { if (o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry') { o.geometry.computeBoundingSphere(); const r = o.geometry.boundingSphere.radius; if (!best || r > best.r) best = { r, y: o.position.y }; } }); return best ? best.y : null; }),
    pr: () => p.evaluate(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join()),
    click: async () => { let how = 'rendered'; /* compact widths: first tap on a closed bottom sheet only opens it (society.js sheet capture handler) */ await p.evaluate(() => { const h = document.querySelector('.sheet-handle'); if (h && !document.body.classList.contains('sheet-open')) h.click(); }); await p.waitForTimeout(300); await p.click('[data-tog=storms]', { force: true, timeout: 8000 }).catch(async () => { how = 'dom'; await p.evaluate(() => document.querySelector('[data-tog=storms]').click()); }); await p.waitForTimeout(300); return how; } });
  for (const [w, h] of VPS) {
    const p = await open(w, h, true); const t = H(p);
    if (MODE === 'parent') { await t.book(6); await t.enter(); const y0 = await t.seaY(); await p.waitForTimeout(6000); const y1 = await t.seaY();
      ok(`${w} parent VI fresh entry: forced rise present (discriminator)`, y1 - y0 > 5, `${await t.pr()} ${y0}→${y1}`); await p.close(); continue; }
    for (const bk of [5, 6]) { await t.book(bk); await t.enter(); const y0 = await t.seaY(); await p.waitForTimeout(6000); const y1 = await t.seaY(); const p0 = await t.pr();
      ok(`${w} ${bk} fresh: toggle unpressed, sea steady`, p0 === 'false' && Math.abs(y1 - y0) < 0.5, `${p0} ${y0}→${y1}`);
      const how = await t.click(); const p1 = await t.pr(); await p.waitForTimeout(6000); const y2 = await t.seaY();
      ok(`${w} ${bk} Storm Gods on raises sea`, p1 === 'true' && y2 - y1 > 5, `${how} ${p1} ${y1}→${y2}`);
      const how2 = await t.click(); const p2 = await t.pr(); await p.waitForTimeout(1500); const y3 = await t.seaY();
      ok(`${w} ${bk} Storm Gods off returns sea`, p2 === 'false' && Math.abs(y3 - y0) < 0.5, `${how2} ${p2} ${y3}`);
      await t.A(() => window.__atlas.toSystem()); await p.waitForTimeout(800); }
    ok(`${w} no page errors (amplified page)`, p.errs.length === 0, p.errs.join('|')); await p.close();
    const q = await open(w, h, false); const u = H(q);
    await u.book(5); await u.enter(); const how = await u.click(); const pOn = await u.pr();
    await u.book(4); await q.waitForFunction(() => window.__atlas.mode !== 'site', null, { timeout: 10000 }).catch(() => {}); await q.waitForTimeout(800);
    const s = await u.A(() => ({ m: window.__atlas.mode, c: window.__atlas.curSite && window.__atlas.curSite.name, era: window.__atlas.ERA }));
    ok(`${w} V→IV inside Tyche with storms on leaves scene`, pOn === 'true' && s.m === 'globe' && !s.c && s.era === 4, `${how} ${pOn} ${JSON.stringify(s)}`);
    await u.book(5); await u.enter(); const pr5 = await u.pr();
    ok(`${w} re-entry at V after storms-on downgrade: toggle unpressed`, pr5 === 'false', pr5);
    await u.click(); await u.book(6); await q.waitForTimeout(800); const s6 = await u.A(() => ({ m: window.__atlas.mode, c: window.__atlas.curSite && window.__atlas.curSite.name }));
    ok(`${w} V→VI upgrade with storms on keeps scene and toggle`, s6.m === 'site' && s6.c === 'Tyche' && (await u.pr()) === 'true', JSON.stringify(s6));
    ok(`${w} no page errors (stale page)`, q.errs.length === 0, q.errs.join('|')); await q.close(); }
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0); })();
