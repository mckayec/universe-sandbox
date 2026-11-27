const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const res = [];
  const ok = (n, c, d) => {
    res.push((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + d : ''));
  };
  for (const vp of [
    [1440, 900],
    [390, 844],
  ]) {
    const p = await b.newPage({ viewport: { width: vp[0], height: vp[1] } });
    const errs = [];
    await p.addInitScript(() => {
      window.__atlasFast = true;
    });
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:4199/atlas/society.html#prologue');
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 });
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const A = window.__atlas;
      return {
        mode: A.mode,
        cur: A.curSite && A.curSite.name,
        site: !!A.SITES.prologue,
        ev: Object.prototype.hasOwnProperty.call(A.EV, 'g1'),
        fxp: A.fx.length,
        tyTog: (A.SITES.tyche.toggles || []).map(t => t.id),
        prolT: A.SITES._prolT,
      };
    });
    ok(
      vp[0] + ' #prologue deep link does not enter a scene',
      r.cur == null,
      JSON.stringify({ mode: r.mode, cur: r.cur }),
    );
    ok(vp[0] + ' SITES.prologue unregistered', !r.site);
    ok(vp[0] + ' event g1 absent', !r.ev);
    ok(vp[0] + ' _prolT absent', r.prolT === undefined);
    ok(vp[0] + ' Tyche toggles lack prologue', !r.tyTog.includes('prologue'), r.tyTog.join(','));
    for (const bk of vp[0] > 500 ? [4, 5, 6, 0] : [4, 0]) {
      await p.evaluate(k => window.__atlas.selectBook(k), bk);
      await p.waitForTimeout(300);
      await p.evaluate(() => window.__atlas.enterSite('tyche'));
      await p.waitForTimeout(3500);
      const s = await p.evaluate(() => ({
        cur: window.__atlas.curSite && window.__atlas.curSite.name,
        btn: !!document.querySelector('[data-tog="prologue"]'),
        tog: [...document.querySelectorAll('[data-tog]')].map(b => b.dataset.tog),
        txt: /Iron Gold · Prologue|Play the Prologue/.test(document.body.innerText),
      }));
      ok(
        vp[0] + ' book ' + bk + ' Tyche entered normally, no prologue control',
        !!s.cur && !s.btn && !s.txt,
        JSON.stringify(s),
      );
      await p.evaluate(() => window.__atlas.playFx('irongoldprologue'));
      await p.evaluate(() => window.__atlas.playFx('irongoldreaper'));
      await p.waitForTimeout(400);
      const f = await p.evaluate(() => ({
        n: window.__atlas.fx.map(x => x.name),
        ov: !!document.getElementById('prolOv'),
        prol: document.body.classList.contains('prol'),
      }));
      ok(
        vp[0] + ' book ' + bk + ' omitted FX names inert',
        !f.n.some(x => /irongold/.test(x)) && !f.ov && !f.prol,
        JSON.stringify(f),
      );
      await p.evaluate(() => window.__atlas.toSystem());
      await p.waitForTimeout(1500);
    }
    const t = await p.evaluate(() =>
      /The Rain on Mercury|Iron Gold · The Prologue/.test(document.body.innerText + document.body.innerHTML),
    );
    ok(vp[0] + ' all-books page text has no g1/prologue strings', !t);
    ok(vp[0] + ' no page errors', errs.length === 0, errs.join(' / '));
    await p.close();
  }
  console.log(res.join('\n'));
  console.log(res.filter(x => x.startsWith('PASS')).length + '/' + res.length);
  await b.close();
})();
