// SO4/SO5 finite-cut probe. Strict: exact site names, exits 1 on any FAIL. Drives window.__atlas (test hook), not clicks.
const { chromium } = require('playwright');
const HELD = [/white limestone/i, /far-northern/i, /private forest/i, /\bAja\b/, /Darrow’s headquarters/, /under repair/i, /Orion is taken/, /Central Command/];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const res = [];
  const ok = (n, c, d) => { const l = (c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + d : ''); res.push(l); console.log(l); };
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    await p.addInitScript(() => { window.__atlasFast = true; });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:4199/atlas/society.html');
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 });
    await p.waitForTimeout(2000);
    const s = await p.evaluate(() => {
      const A = window.__atlas, ids = k => A.SITES[k].landmarks.map(l => l.id);
      const lm = (k, i) => A.SITES[k].landmarks.find(l => l.id === i);
      return {
        eu: ids('europa'), ty: ids('tyche'),
        villa: lm('europa', 'villa') && lm('europa', 'villa').desc,
        harbor: lm('tyche', 'harbor') && lm('tyche', 'harbor').desc,
        ms: lm('tyche', 'morningstar') && lm('tyche', 'morningstar').desc,
        eras: Object.fromEntries(Object.entries(A.SITES.tyche.eras || {}).map(([k, v]) => [k, v.blurb || null])),
        e9: A.EV.e9 && { text: A.EV.e9.text, lm: A.EV.e9.lm, poi: A.EV.e9.poi },
        d8: A.EV.d8 && { lm: A.EV.d8.lm, fx: A.EV.d8.fx, poi: A.EV.d8.poi },
        tog: (A.SITES.tyche.toggles || []).map(t => t.id),
        lorn: (A.POIS.europa.find(x => x.id === 'lornhome') || {}).desc,
      };
    });
    ok(w + ' europa garden removed; villa/keep/hall/seagate/deep kept', !s.eu.includes('garden') && ['villa', 'keep', 'hall', 'seagate', 'deep'].every(i => s.eu.includes(i)), s.eu.join(','));
    ok(w + ' tyche centralcmd removed; harbor/morningstar kept', !s.ty.includes('centralcmd') && s.ty.includes('harbor') && s.ty.includes('morningstar'), s.ty.join(','));
    ok(w + ' tyche eras: no 4, 5 = control line, 6 unchanged', !('4' in s.eras) && s.eras[5] === 'Dark Age. Toggle the Storm Gods to see the flood.' && s.eras[6] === 'Light Bringer. A drowned and broken capital under the Society.', JSON.stringify(s.eras));
    ok(w + ' e9 text exact, refs intact', s.e9 && s.e9.text.startsWith('Darrow comes to recruit his old sword teacher. After Tactus betrays them') && s.e9.lm === 'villa' && s.e9.poi === 'lornhome', JSON.stringify(s.e9));
    ok(w + ' d8 flood event intact (harbor, fx flood)', s.d8 && s.d8.lm === 'harbor' && s.d8.fx === 'flood' && s.d8.poi === 'tyche', JSON.stringify(s.d8));
    ok(w + ' Storm Gods toggle kept', s.tog.includes('storms'), s.tog.join(','));
    ok(w + ' lornhome/villa/harbor/morningstar static text has no held clause', !HELD.some(r => r.test(JSON.stringify([s.lorn, s.villa, s.harbor, s.ms]))), JSON.stringify([s.lorn, s.villa, s.harbor, s.ms]).slice(0, 300));
    const runs = [['europa', 'Lorn’s Castle', [2, 6, 0]], ['tyche', 'Tyche', w > 500 ? [4, 5, 6, 0] : [4, 0]]];
    for (const [site, name, books] of runs) for (const bk of books) {
      await p.evaluate(k => window.__atlas.selectBook(k), bk);
      await p.waitForTimeout(300);
      await p.evaluate(k => window.__atlas.enterSite(k), site);
      await p.waitForFunction(n => window.__atlas.curSite && window.__atlas.curSite.name === n && window.__atlas.mode === 'site', name, { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(800);
      const r = await p.evaluate(() => ({ cur: window.__atlas.curSite && window.__atlas.curSite.name, mode: window.__atlas.mode, txt: document.body.innerText }));
      const hit = HELD.filter(x => x.test(r.txt)).map(String);
      ok(`${w} book ${bk} ${site}: entered (${name}) and no held clause in rendered text`, r.cur === name && r.mode === 'site' && hit.length === 0, JSON.stringify({ cur: r.cur, mode: r.mode, hit }));
      await p.evaluate(() => window.__atlas.toSystem());
      await p.waitForTimeout(600);
    }
    for (const [ev, name, bk] of [['e9', 'Lorn’s Castle', 2], ['d8', 'Tyche', 5]]) {
      await p.evaluate(k => window.__atlas.selectBook(k), bk);
      await p.waitForTimeout(300);
      await p.evaluate(e => window.__atlas.gotoEvent(window.__atlas.EV[e]), ev);
      await p.waitForFunction(n => window.__atlas.curSite && window.__atlas.curSite.name === n, name, { timeout: 20000 }).catch(() => {});
      await p.waitForTimeout(1500);
      const r = await p.evaluate(() => ({ cur: window.__atlas.curSite && window.__atlas.curSite.name, mode: window.__atlas.mode }));
      ok(`${w} book ${bk} gotoEvent ${ev} resolves to ${name}`, r.cur === name && r.mode === 'site', JSON.stringify(r));
      await p.evaluate(() => window.__atlas.toSystem());
      await p.waitForTimeout(600);
    }
    ok(w + ' zero page errors', errs.length === 0, errs.slice(0, 3).join(' / '));
    await p.close();
  }
  await b.close();
  const f = res.filter(r => r.startsWith('FAIL')).length;
  console.log(`TOTAL ${res.length - f}/${res.length} PASS, ${f} FAIL`);
  process.exit(f ? 1 : 0);
})();
