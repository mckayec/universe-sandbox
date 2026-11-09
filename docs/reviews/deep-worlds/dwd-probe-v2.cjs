// v2: identical assertions to dwd-probe.cjs; adds VP env (e.g. VP=390x844) to run one viewport.
// Society disposition (flood A-amended / Tyche V / Europa VI) probe. Drives window.__atlas test hook; renders DOM text.
// Strict: exits 1 on any FAIL. Usage: node probe.cjs [port]
const { chromium } = require('playwright');
const PORT = process.argv[2] || 4199;
const Q = /not independently checked against the novel|not checked against the novel|not verified against the novel/;
const EARLY = /Harmonia|Discordia/;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  let fails = 0; const ok = (n, c, d) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + String(d).slice(0, 260) : '')); };
  for (const [w, h] of (process.env.VP ? process.env.VP.split(',').map(s => s.split('x').map(Number)) : [[1440, 900], [390, 844]])) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { window.__atlasFast = true; });
    await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`);
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 }); await p.waitForTimeout(1500);
    const A = (f, a) => p.evaluate(f, a);
    const book = async k => { await A(k => window.__atlas.selectBook(k), k); await p.waitForTimeout(300); };
    const enter = async (k, name) => { await A(k => window.__atlas.enterSite(k), k); await p.waitForFunction(n => window.__atlas.curSite && window.__atlas.curSite.name === n && window.__atlas.mode === 'site', name, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(900); };
    const out = async () => { await A(() => window.__atlas.toSystem()); await p.waitForTimeout(500); };
    const st = () => A(() => ({ cur: window.__atlas.curSite && window.__atlas.curSite.name, mode: window.__atlas.mode, txt: document.body.innerText }));
    // data assertions
    const d = await A(() => { const S = window.__atlas.SITES, E = window.__atlas.EV;
      return { d8: E.d8 && { text: E.d8.text, lm: E.d8.lm, fx: E.d8.fx }, tyFrom: S.tyche.from, tog: S.tyche.toggles.map(t => t.id + ':' + t.era),
        harbor: S.tyche.landmarks.some(l => l.id === 'harbor'), tour5: null, euFacts: S.europa.facts, euF6: S.europa.eras[6] && S.europa.eras[6].facts, euF2: S.europa.eras[2] && S.europa.eras[2].facts,
        disc: (window.__atlas.POIS.europa.find(x => x.id === 'discordia') || {}).from, harm: (window.__atlas.POIS.europa.find(x => x.id === 'harmonia') || {}).from }; });
    ok(w + ' D d8 text keeps a+b with qualifier; c-e gone; harbor/flood refs intact', d.d8 && Q.test(d.d8.text) && !/horizon four|master override|Tens of millions/.test(d.d8.text) && d.d8.lm === 'harbor' && d.d8.fx === 'flood', JSON.stringify(d.d8));
    ok(w + ' D Tyche site from V; storms toggle era 5; harbor kept', d.tyFrom === 5 && d.tog.join() === 'storms:5' && d.harbor, d.tyFrom + ' ' + d.tog);
    ok(w + ' D Europa pins discordia/harmonia from VI', d.disc === 6 && d.harm === 6, d.disc + ',' + d.harm);
    ok(w + ' D Europa base facts neutral, era2 neutral+Golden Son, VI full rows', !EARLY.test(JSON.stringify(d.euFacts)) && !EARLY.test(JSON.stringify(d.euF2)) && /Golden Son"\]/.test(JSON.stringify(d.euF2)) && /Harmonia, Discordia Sea/.test(JSON.stringify(d.euF6)) && /Golden Son, Light Bringer/.test(JSON.stringify(d.euF6)), JSON.stringify([d.euF2, d.euF6]));
    // 1. Tyche IV denial, V entry, stale
    await book(4); await enter('tyche', 'Tyche'); let r = await st();
    ok(w + ' IV Tyche enterSite denied', r.cur !== 'Tyche' || r.mode !== 'site', JSON.stringify({ cur: r.cur, mode: r.mode }));
    const pin4 = await A(() => { window.__atlas.descendThen && 0; return (window.__atlas.POIS.mercury.find(x => x.id === 'tyche') || {}).from; });
    ok(w + ' IV Tyche globe pin gated from V', pin4 === 5, pin4);
    await out(); await book(5); await enter('tyche', 'Tyche'); r = await st();
    ok(w + ' V Tyche entered; note qualifier visible on direct entry; V blurb qualified', r.cur === 'Tyche' && r.mode === 'site' && /Storm Gods flood is illustrative/.test(r.txt) && /illustrative flood reconstruction; this account has not been independently checked/.test(r.txt), r.cur);
    ok(w + ' V Tyche rendered text has no unqualified drowned capital', !/drowned and broken capital|drowns when the flood comes/.test(r.txt));
    await book(4); await p.waitForFunction(() => window.__atlas.mode !== 'site', null, { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(500); r = await st();
    ok(w + ' stale: V→IV inside Tyche leaves the scene', !(r.cur === 'Tyche' && r.mode === 'site'), JSON.stringify({ cur: r.cur, mode: r.mode }));
    await out();
    // 2. d8 replay + banner + manual toggle
    await book(5); await A(() => window.__atlas.gotoEvent(window.__atlas.EV.d8));
    await p.waitForFunction(() => window.__atlas.curSite && window.__atlas.curSite.name === 'Tyche', null, { timeout: 15000 }).catch(() => {}); await p.waitForTimeout(1500);
    r = await st(); const ban = await A(() => { const b = document.querySelector('#banner'); return b && !b.hidden ? b.innerText : ''; });
    const pressed = await A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    ok(w + ' V d8 replay enters Tyche, presses Storm Gods, banner qualified', r.cur === 'Tyche' && /true/.test(pressed) && /not checked against the novel/.test(ban), JSON.stringify({ pressed, ban }));
    const evOpen = await A(() => { const it = document.querySelector('.evitem[data-id="d8"]'); return it ? it.innerText : ''; });
    ok(w + ' V Chronicle/replay entry for d8 present in dossier', /Tyche drowns/.test(evOpen), evOpen);
    ok(w + ' V Chronicle d8 text carries qualifier somewhere visible', Q.test(r.txt), '');
    await A(() => { const b = document.querySelector('[data-tog=storms]'); if (b) b.click(); }); await p.waitForTimeout(400);
    const off = await A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    await A(() => { const b = document.querySelector('[data-tog=storms]'); if (b) b.click(); }); await p.waitForTimeout(400);
    const on2 = await A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    ok(w + ' V manual Storm Gods off/on toggles', /false/.test(off) && /true/.test(on2), off + ' / ' + on2);
    await out();
    // 3. VI fresh entry: no forced flood
    const seaY = () => A(() => { let best = null; window.__atlas.site3.traverse(o => { if (o.isMesh && o.geometry && o.geometry.type === 'PlaneGeometry') { o.geometry.computeBoundingSphere(); const r = o.geometry.boundingSphere.radius; if (!best || r > best.r) best = { r, y: o.position.y }; } }); return best; });
    await book(6); await enter('tyche', 'Tyche'); const y0 = await seaY(); await p.waitForTimeout(8000); const y1 = await seaY(); r = await st();
    ok(w + ' VI fresh Tyche: sea not raised (no default flood)', y0 && y1 && Math.abs(y1.y - y0.y) < 0.5, JSON.stringify([y0, y1]));
    ok(w + ' VI blurb neutral water-level note; no drowned capital', /does not establish Tyche’s water level/.test(r.txt) && !/drowned and broken capital/.test(r.txt));
    await A(() => { const b = document.querySelector('[data-tog=storms]'); if (b) b.click(); }); await p.waitForTimeout(8000); const y2 = await seaY();
    ok(w + ' VI explicit Storm Gods replay raises sea', y2 && y2.y - y1.y > 0.5, JSON.stringify(y2));
    await book(5); await book(6); r = await st();
    ok(w + ' VI→V→VI in scene: no stale unqualified drowned text', r.cur === 'Tyche' && !/drowned and broken capital/.test(r.txt));
    await out(); await book(6); await enter('tyche', 'Tyche'); const y3 = await seaY(); await p.waitForTimeout(3000); const y4 = await seaY();
    const pr = await A(() => [...document.querySelectorAll('[data-tog=storms]')].map(b => b.getAttribute('aria-pressed')).join());
    ok(w + ' VI re-entry after replay: toggle unpressed (control reset)', /false/.test(pr), pr + ' ' + JSON.stringify([y3, y4]));
    await out();
    // 4. Europa II, V, VI
    for (const bk of [2, 5, 6]) {
      await book(bk); await enter('europa', 'Lorn’s Castle'); r = await st();
      const lms = await A(() => { const S = window.__atlas.curSite; return S.landmarks.filter(l => (l.from == null || window.__atlas.ERA >= l.from)).map(l => ({ id: l.id, name: l.name, d: typeof l.desc === 'string' ? l.desc : JSON.stringify(Object.entries(l.desc).filter(([k]) => +k <= window.__atlas.ERA).sort((a, b) => b[0] - a[0])[0]) })); });
      const lev = await A(() => { const S = window.__atlas.curSite; const l = S.landmarks.find(x => x.id === 'leviathan'); return l && Object.entries(l.desc).filter(([k]) => +k <= window.__atlas.ERA).sort((a, b) => b[0] - a[0])[0][1]; });
      const seaShown = lms.some(l => l.id === 'sea');
      if (bk < 6) {
        ok(`${w} ${['', '', 'II', '', '', 'V'][bk]} Europa scene rendered text has no Harmonia/Discordia`, r.cur === 'Lorn’s Castle' && !EARLY.test(r.txt), (r.txt.match(/.{40}(Harmonia|Discordia).{40}/) || [''])[0]);
        ok(`${w} book ${bk} Europa visible landmark data (villa/seagate/leviathan) neutral; sea hidden`, !EARLY.test(JSON.stringify(lms)) && !seaShown && /Europa’s ocean/.test(lev || ''), JSON.stringify(lms.map(l => l.id)));
      } else {
        ok(`${w} VI Europa names restored (epithet blurb/facts/sea/seagate/leviathan)`, r.cur === 'Lorn’s Castle' && /Harmonia/.test(r.txt) && /Harmonia, Discordia Sea/.test(r.txt) && seaShown && /Discordia Sea/.test(lev || '') && /Discordia Sea/.test(JSON.stringify(lms.find(l => l.id === 'seagate'))), JSON.stringify(lms.map(l => l.id)));
      }
      await out();
    }
    // leviathan globe popup text per era
    for (const bk of [2, 5, 6]) { await book(bk); const t = await A(() => { const S = window.__atlas.SITES.europa.landmarks.find(x => x.id === 'leviathan'); return S && S.desc; }); }
    // 5. tour + dangling
    const tour = await A(() => { const T = window.__tour || null; return null; });
    const levG = await A(() => { const L = window.__atlas.SITES.europa.landmarks.find(x => x.id === 'leviathan'); return L && L.desc; });
    ok(w + ' leviathan shared LEV_TEXT (globe popup + landmark): 1 neutral, 6 full', levG && /Europa’s ocean/.test(levG[1]) && !EARLY.test(levG[1]) && /Discordia Sea/.test(levG[6]), JSON.stringify(levG).slice(0, 200));
    ok(w + ' no page errors', errs.length === 0, errs.join(' | '));
    await p.close();
  }
  await b.close(); console.log(fails ? `FAILED ${fails}` : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
