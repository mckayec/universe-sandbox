// Focused Tyche flood/toggle/stale probe. __floodH=43000 (test hook) amplifies sea displacement 100x for detection.
const { chromium } = require('playwright'); const PORT = process.argv[2] || 4199;
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let fails = 0; const ok = (n, c, d) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + d : '')); };
  for (const [w, h] of [[1440, 900], [390, 844]]) { const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { window.__atlasFast = true; window.__floodH = 43000; });
    await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`); await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    const A = (f, a) => p.evaluate(f, a); const book = async k => { await A(k => window.__atlas.selectBook(k), k); await p.waitForTimeout(400); };
    const enter = async () => { await A(() => window.__atlas.enterSite('tyche')); await p.waitForFunction(() => window.__atlas.curSite && window.__atlas.curSite.name === 'Tyche' && window.__atlas.mode === 'site' && document.querySelector('[data-tog=storms]'), null, { timeout: 20000 }).catch(() => {}); await p.waitForTimeout(1500); };
    const seaY = () => A(() => { let best = null; window.__atlas.site3.traverse(o => { if (o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry') { o.geometry.computeBoundingSphere(); const r = o.geometry.boundingSphere.radius; if (!best || r > best.r) best = { r, y: o.position.y }; } }); return best ? best.y : null; });
    const pr = () => A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    const click = async () => { await p.click('[data-tog=storms]', { force: true }).catch(async () => { await A(() => document.querySelector('[data-tog=storms]').click()); }); await p.waitForTimeout(300); };
    for (const bk of [5, 6]) { await book(bk); await enter(); const y0 = await seaY(); await p.waitForTimeout(6000); const y1 = await seaY(); const p0 = await pr();
      ok(`${w} ${bk} fresh: toggle unpressed, sea steady`, p0 === 'false' && Math.abs(y1 - y0) < 0.5, `${p0} ${y0}→${y1}`);
      await click(); const p1 = await pr(); await p.waitForTimeout(6000); const y2 = await seaY();
      ok(`${w} ${bk} Storm Gods on (rendered click) raises sea`, p1 === 'true' && y2 - y1 > 5, `${p1} ${y1}→${y2}`);
      await click(); const p2 = await pr(); await p.waitForTimeout(1500); const y3 = await seaY();
      ok(`${w} ${bk} Storm Gods off returns sea (fast mode)`, p2 === 'false' && Math.abs(y3 - y0) < 0.5, `${p2} ${y3}`);
      if (bk === 5) { await click(); await book(4); await p.waitForFunction(() => window.__atlas.mode !== 'site', null, { timeout: 10000 }).catch(() => {}); await p.waitForTimeout(800);
        const s = await A(() => ({ m: window.__atlas.mode, c: window.__atlas.curSite && window.__atlas.curSite.name }));
        ok(`${w} stale V→IV inside Tyche (storms on) leaves scene`, s.m !== 'site', JSON.stringify(s)); }
      await A(() => window.__atlas.toSystem()); await p.waitForTimeout(600); }
    await book(6); await enter(); const yA = await seaY(); await p.waitForTimeout(5000); const yB = await seaY();
    ok(`${w} VI re-entry after V storms-on/stale exit: unpressed, sea steady`, (await pr()) === 'false' && Math.abs(yB - yA) < 0.5, `${yA}→${yB}`);
    ok(`${w} no page errors`, errs.length === 0, errs.join('|')); await p.close(); }
  await b.close(); console.log(fails ? 'FAILED ' + fails : 'ALL PASS'); process.exit(fails ? 1 : 0); })();
