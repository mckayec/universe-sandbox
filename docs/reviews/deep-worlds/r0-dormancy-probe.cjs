// R0 dormancy probe (deep-worlds, engine-only candidate).
// Usage: node r0-dormancy-probe.cjs <r0BaseUrl> <mainBaseUrl> [width height]
//   e.g. node r0-dormancy-probe.cjs http://127.0.0.1:4601 http://127.0.0.1:4602 1440 900
// Both URLs serve a `pnpm build` dist (vite preview). For every existing atlas pack it checks, on R0 and on main:
//   - no places object is created and no Tour button / Enter / Walk-the-surface control appears;
//   - site selection, event travel (openEvent with travel) and a stale/deep `view=place` link all stay on the
//     ordinary surface view (S.view !== "place");
//   - the visible dossier / chronicle / crumbs text at the same state is identical between R0 and main.
// Then, on R0 only, an isolated in-memory fixture (route interception adds `places:{}` to one pack response; nothing
// is written to disk or shipped) shows that the gate is what keeps the ported infrastructure dormant: with the opt-in
// the places object exists, the Tour button and the Enter control appear and enterPlace() reaches view "place".
const { chromium } = require('playwright');
const [R0, MAIN, Wd = '1440', Hd = '900'] = process.argv.slice(2);
const W = +Wd,
  H = +Hd;
const PACKS = ['cosmere', 'christian-apocrypha', 'abrahamic-world-religions', 'dune', 'foundation', 'expanse', 'hyperion', 'sun-eater'];
let pass = 0,
  fail = 0;
const row = (ok, msg) => {
  ok ? pass++ : fail++;
  console.log((ok ? 'PASS ' : 'FAIL ') + msg);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(browser, url, fixture) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  if (fixture)
    await page.route('**/atlas/packs/' + fixture + '.js', async route => {
      const res = await route.fetch();
      const body = (await res.text()) + '\n;window.ATLAS_PACKS[' + JSON.stringify(fixture) + '].places={};\n';
      await route.fulfill({ response: res, body });
    });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__atlas && window.__atlas.S, null, { timeout: 60000 });
  await sleep(2500);
  return { ctx, page, errors };
}

// first landable world with at least one site, its first site, and an event with a site on that world
const PICK = () => {
  const A = window.__atlas;
  const ws = A.pack.worlds || [];
  for (const w of ws) {
    const W2 = A.WORLD_BY[w.id];
    if (!W2 || W2.noSurface || (W2.gfx && W2.gfx.type === "star") || !(W2.sites || []).length) continue;
    const s = W2.sites[0];
    const ev = (A.pack.events || []).find(e => e.world === w.id && e.site);
    return { w: w.id, s: s.id, ev: ev ? ev.id : null };
  }
  return null;
};
const SNAP = () => {
  const t = q => (document.querySelector(q) || {}).innerText || '';
  const A = window.__atlas;
  return {
    view: A.S.view,
    places: A.PLACES === undefined ? 'undefined' : A.PLACES === null ? 'null' : 'object',
    tourBtn: !!document.querySelector('#tourBtn'),
    enter: document.querySelectorAll('[data-act="enter"],[data-act="goev"],[data-act="hop"]').length,
    dossier: t('#dossier'),
    chron: t('#chron'),
    crumbs: t('#crumbs'),
    hash: location.hash,
  };
};

async function states(browser, base, pack) {
  const out = {};
  const url = base + '/atlas/?pack=' + pack;
  const { ctx, page, errors } = await open(browser, url);
  out.start = await page.evaluate(SNAP);
  const pick = await page.evaluate(PICK);
  out.pick = pick;
  if (pick) {
    await page.evaluate(id => window.__atlas.descend(id), pick.w);
    await sleep(4500);
    await page.evaluate(id => window.__atlas.selectSite(id), pick.s);
    await sleep(1800);
    out.site = await page.evaluate(SNAP);
    // clicking the selected site's label again is the PR37 entry gesture
    await page.evaluate(id => {
      const o = (window.__atlas.SITE_EL || []).find(x => x.s.id === id);
      if (o) o.el.click();
    }, pick.s);
    await sleep(1800);
    out.reclick = await page.evaluate(SNAP);
    if (pick.ev) {
      await page.evaluate(id => window.__atlas.openEvent(id, true), pick.ev);
      await sleep(2500);
      out.event = await page.evaluate(SNAP);
    }
  }
  await ctx.close();
  if (pick) {
    const deep = url + '#world=' + encodeURIComponent(pick.w) + '&site=' + encodeURIComponent(pick.s) + '&view=place&lm=x';
    const d = await open(browser, deep);
    await sleep(5000);
    out.deep = await d.page.evaluate(SNAP);
    errors.push(...d.errors);
    await d.ctx.close();
  }
  out.errors = errors.filter(e => !/WebGL|GPU stall|GL_|swiftshader/i.test(e));
  return out;
}

(async () => {
  const exe = process.env.CHROME_PATH || undefined;
  const browser = await chromium.launch({
    executablePath: exe,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  console.log(`viewport ${W}x${H}; R0 ${R0}; main ${MAIN}`);
  for (const pack of PACKS) {
    const r = await states(browser, R0, pack);
    const m = await states(browser, MAIN, pack);
    const tag = pack + ':';
    row(r.start.places === 'null', `${tag} R0 creates no places object (got ${r.start.places})`);
    row(!r.start.tourBtn, `${tag} R0 shows no Tour button`);
    if (!r.pick) {
      row(false, `${tag} no landable world with a site found`);
      continue;
    }
    for (const k of ['site', 'reclick', 'event', 'deep']) {
      if (!r[k]) continue;
      row(r[k].view !== 'place' && r[k].enter === 0, `${tag} R0 ${k}: view=${r[k].view}, enter/go/hop controls=${r[k].enter}`);
      if (m[k]) {
        row(r[k].view === m[k].view, `${tag} ${k}: R0 view ${r[k].view} == main view ${m[k].view}`);
        const same = ['dossier', 'chron', 'crumbs'].filter(f => r[k][f] === m[k][f]);
        row(same.length === 3, `${tag} ${k}: dossier/chron/crumbs text identical to main (${same.length}/3)`);
        if (k === 'deep') row(r[k].hash === m[k].hash, `${tag} deep: URL rewritten like main (${r[k].hash} vs ${m[k].hash})`);
      }
    }
    row(r.errors.length === 0, `${tag} R0 console errors: ${r.errors.length}${r.errors.length ? ' ' + r.errors.slice(0, 2).join(' | ') : ''}`);
    row(m.errors.length === r.errors.length, `${tag} main console errors: ${m.errors.length}`);
  }
  // isolated fixture: opt one pack in, in memory only
  {
    const pack = 'dune';
    const f = await open(browser, R0 + '/atlas/?pack=' + pack, pack);
    const s0 = await f.page.evaluate(SNAP);
    row(s0.places === 'object' && s0.tourBtn, `fixture ${pack}+places:{} (R0): places object=${s0.places}, Tour button=${s0.tourBtn}`);
    const pick = await f.page.evaluate(PICK);
    await f.page.evaluate(id => window.__atlas.descend(id), pick.w);
    await sleep(4500);
    await f.page.evaluate(id => window.__atlas.selectSite(id), pick.s);
    await sleep(1500);
    const s1 = await f.page.evaluate(SNAP);
    row(s1.enter > 0, `fixture: Enter control appears for selected site (${s1.enter})`);
    await f.page.evaluate(id => window.__atlas.enterPlace(id), pick.s);
    await sleep(4000);
    const s2 = await f.page.evaluate(SNAP);
    row(s2.view === 'place' && /view=place/.test(s2.hash), `fixture: enterPlace reaches view=${s2.view} (${s2.hash})`);
    await f.page.evaluate(() => window.__atlas.leavePlace());
    await sleep(3000);
    const s3 = await f.page.evaluate(SNAP);
    row(s3.view === 'world', `fixture: leavePlace returns to view=${s3.view}`);
    const errs = f.errors.filter(e => !/WebGL|GPU stall|GL_|swiftshader/i.test(e));
    row(errs.length === 0, `fixture: console errors ${errs.length}${errs.length ? ' ' + errs.slice(0, 2).join(' | ') : ''}`);
    await f.ctx.close();
  }
  await browser.close();
  console.log(`\n${pass} PASS / ${fail} FAIL`);
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.error(e);
  process.exit(2);
});
