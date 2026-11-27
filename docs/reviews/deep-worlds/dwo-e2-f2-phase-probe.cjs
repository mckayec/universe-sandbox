// DWO-E2-F2 phase probe: a book downgrade that hides the current world or site must keep the hidden world/site
// copy out of the dossier, breadcrumbs and screen-reader announcement, and keep URL book/world/site consistent with
// state, through the whole leave/ascend (sampled every 100 ms from the downgrade until settled), not only at +1.5 s.
// Scenarios (cosmere pack; 1440x900 and 390x844):
//   A  tour into Luthadel at book 2 (event e70), Stop, setBook(1): Scadrial hidden; leave + ascend to the galaxy
//      (the reviewed path; F1 regressions: e70 never in state, dossier or chronicle)
//   B  Scadrial surface with Luthadel selected at book 2, setBook(1): the direct world-view downgrade branch
//   C  inside Elendel at book 6, setBook(5): world still visible, site hidden; leave to the Scadrial surface
//   D  positive control: inside Luthadel at book 3, setBook(2): still visible, stays in the place, copy and URL kept
//   E  predicate control: a fresh book-1 galaxy has none of the hidden words (so A/B checks are not vacuous-false)
// Usage: CHROME_PATH=... node dwo-e2-f2-phase-probe.cjs http://127.0.0.1:4173/ [1440|390]
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const results = [];
const check = (name, pass, actual) => {
  results.push({ name, pass: !!pass });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + (actual === undefined ? '' : ' ' + JSON.stringify(actual)));
};
/* the same reader runs right after the downgrade click in the same task (t=0, the immediate phase) and then by polling */
const READ = () => {
  const A = window.__atlas;
  const q = new URLSearchParams(location.hash.slice(1));
  const txt = s => (document.querySelector(s) || {}).textContent || '';
  return {
    view: A.S.view,
    sel: A.S.sel,
    site: A.S.site,
    ev: A.S.ev,
    book: A.S.book,
    ubook: +q.get('book') || 0,
    uworld: q.get('world'),
    usite: q.get('site'),
    uview: q.get('view'),
    copy: txt('#dossier') + ' | ' + txt('#crumbs') + ' | ' + txt('#announce'),
    /* world/site-specific copy only: the series intro may name worlds, so the dossier counts by its heading */
    head: txt('#dossier h2'),
    chrome: txt('#crumbs') + ' | ' + txt('#announce'),
    crumbs: txt('#crumbs'),
    chronE70: !!document.querySelector('#track .ev[data-ev="e70"]'),
    rendered: A.PLACES && A.PLACES.place && A.PLACES.place.site ? A.PLACES.place.site.id : null,
  };
};
const sample = p => p.evaluate(`(${READ})()`);
const downgrade = (p, book) => p.evaluate(`(() => { window.__atlas.setBook(${book}); return (${READ})(); })()`);
async function open(b, vp, hash) {
  const p = await b.newPage({ viewport: vp });
  p.on('pageerror', e => (p._errs = (p._errs || []).concat(e.message)));
  await p.goto(base + 'atlas/?pack=cosmere' + hash, { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.__atlas && window.__atlas.S, null, { timeout: 60000 });
  return p;
}
async function enter(p, site) {
  await p.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 60000 });
  await p.evaluate(s => {
    window.__atlas.selectSite(s);
    window.__atlas.enterPlace(s);
  }, site);
  await p.waitForFunction(
    s => window.__atlas.S.view === 'place' && window.__atlas.PLACES.place && window.__atlas.PLACES.place.site.id === s,
    site,
    {
      timeout: 60000,
    },
  );
  await p.waitForTimeout(400);
}
/* sample from the downgrade until done(s) holds for 1 s or 40 s pass; returns the samples */
async function watch(p, done, first) {
  const out = first ? [Object.assign(first, { t: 0 })] : [];
  const t0 = Date.now();
  let since = null;
  while (Date.now() - t0 < 40000) {
    const s = await sample(p);
    s.t = Date.now() - t0;
    out.push(s);
    if (done(s)) {
      if (since == null) since = s.t;
      else if (s.t - since >= 1000) break;
    } else since = null;
    await p.waitForTimeout(100);
  }
  return out;
}
const phases = ss => {
  const r = [];
  ss.forEach(s => {
    const k = s.view + (s.sel ? ':' + s.sel : '') + (s.site ? '/' + s.site : '');
    if (!r.length || r[r.length - 1].k !== k) r.push({ k, t: s.t });
  });
  return r.map(x => x.k + '@' + x.t + 'ms').join(' → ');
};
function judge(tag, ss, hidden, urlBad, settled, extra) {
  const leak = ss.filter(s => hidden.chrome.test(s.chrome) || hidden.head.test(s.head) || hidden.body.test(s.copy));
  const url = ss.filter(s => s.ubook !== s.book || urlBad(s));
  check(tag + ': no hidden world/site copy in dossier, crumbs or announcement at any sample', !leak.length, {
    samples: ss.length,
    leaks: leak.length,
    first: leak[0] && { t: leak[0].t, view: leak[0].view, head: leak[0].head, chrome: leak[0].chrome.slice(0, 160) },
  });
  check(tag + ': URL book equals state book and names no hidden world/site at any sample', !url.length, {
    bad: url.length,
    first: url[0] && {
      t: url[0].t,
      book: url[0].book,
      ubook: url[0].ubook,
      uworld: url[0].uworld,
      usite: url[0].usite,
    },
  });
  const last = ss[ss.length - 1];
  check(tag + ': settles ' + settled.name, settled(last), {
    phases: phases(ss),
    last: { view: last.view, sel: last.sel, site: last.site, uworld: last.uworld, uview: last.uview },
  });
  if (extra) extra(ss);
}
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: [
      '--no-sandbox',
      '--use-gl=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--enable-unsafe-swiftshader',
    ],
  });
  /* chrome = crumbs + announcement; head = dossier heading; body = any dossier/crumb/announcement text */
  const HID = { chrome: /Scadrial|Luthadel/, head: /Scadrial|Luthadel/, body: /Luthadel|Elend is deposed/ };
  const HIDC = { chrome: /Elendel/, head: /Elendel/, body: /Elendel/ };
  const anyHid = (h, s) => h.chrome.test(s.chrome) || h.head.test(s.head) || h.body.test(s.copy);
  const galaxy = s => s.view === 'galaxy' && !s.sel && !s.uworld;
  Object.defineProperty(galaxy, 'name', { value: 'in the galaxy with nothing selected' });
  const all = [
    ['1440', { width: 1440, height: 900 }],
    ['390', { width: 390, height: 844 }],
  ];
  for (const [tag, vp] of all.filter(([t]) => !process.argv[3] || process.argv[3] === t)) {
    // E: predicate control
    {
      const p = await open(b, vp, '#book=1');
      await p.waitForTimeout(1500);
      const s = await sample(p);
      check(tag + ' E control: fresh book-1 galaxy copy has no hidden words', !anyHid(HID, s) && !anyHid(HIDC, s), {
        head: s.head,
        chrome: s.chrome,
      });
      await p.close();
    }
    // A: the reviewed tour path
    {
      const p = await open(b, vp, '#book=2&world=scadrial&view=surface');
      await p.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 60000 });
      await p.evaluate(() => document.querySelector('#tourBtn').click());
      for (
        let i = 0;
        i < 30 && (await p.evaluate(() => document.querySelector('#tourT').textContent)) !== 'Elend is deposed';
        i++
      ) {
        await p.evaluate(() => document.querySelector('[data-tour="next"]').click());
        await p.waitForTimeout(120);
      }
      await p.evaluate(() => document.querySelector('[data-tour="pause"]').click());
      await p.waitForFunction(
        () => {
          const A = window.__atlas;
          const P = A.PLACES.place;
          return A.S.view === 'place' && A.S.ev === 'e70' && P && P.site && P.site.id === 'luthadel';
        },
        null,
        { timeout: 60000 },
      );
      const pre = await sample(p);
      check(tag + ' A precondition: inside Luthadel with e70 and its copy shown', anyHid(HID, pre) && pre.ubook === 2, {
        ubook: pre.ubook,
        usite: pre.usite,
      });
      await p.evaluate(() => document.querySelector('[data-tour="stop"]').click());
      const ss = await watch(p, galaxy, await downgrade(p, 1));
      judge(
        tag + ' A place→galaxy (book 2→1)',
        ss,
        HID,
        s => s.uworld === 'scadrial' || s.usite === 'luthadel',
        galaxy,
        x =>
          check(tag + ' A F1 regression: e70 never in state or chronicle', !x.some(s => s.ev === 'e70' || s.chronE70)),
      );
      check(tag + ' A no page errors', !(p._errs || []).length, p._errs || []);
      await p.close();
    }
    // B: direct world-view downgrade branch
    {
      const p = await open(b, vp, '#book=2&world=scadrial&view=surface');
      await p.waitForFunction(() => window.__atlas.S.view === 'world', null, { timeout: 60000 });
      await p.evaluate(() => window.__atlas.selectSite('luthadel'));
      await p.waitForTimeout(300);
      const pre = await sample(p);
      check(
        tag + ' B precondition: Scadrial surface with Luthadel selected',
        anyHid(HID, pre) && pre.usite === 'luthadel',
        { usite: pre.usite },
      );
      const ss = await watch(p, galaxy, await downgrade(p, 1));
      judge(
        tag + ' B surface→galaxy (book 2→1)',
        ss,
        HID,
        s => s.uworld === 'scadrial' || s.usite === 'luthadel',
        galaxy,
      );
      check(tag + ' B no page errors', !(p._errs || []).length, p._errs || []);
      await p.close();
    }
    // C: hidden site in a visible world
    {
      const p = await open(b, vp, '#book=6&world=scadrial&view=surface');
      await enter(p, 'elendel');
      const pre = await sample(p);
      check(tag + ' C precondition: inside Elendel at book 6', /Elendel/.test(pre.crumbs) && pre.uview === 'place', {
        uview: pre.uview,
      });
      const t0 = await downgrade(p, 5);
      const surf = s => s.view === 'world' && s.sel === 'scadrial' && !s.site && s.uview === 'surface' && !s.usite;
      Object.defineProperty(surf, 'name', { value: 'on the Scadrial surface with no site' });
      const ss = await watch(p, surf, t0);
      judge(
        tag + ' C place→surface (book 6→5)',
        ss,
        HIDC,
        s => s.usite === 'elendel',
        surf,
        x =>
          check(
            tag + ' C visible world kept: Scadrial named in crumbs once settled',
            /Scadrial/.test(x[x.length - 1].crumbs),
          ),
      );
      check(tag + ' C no page errors', !(p._errs || []).length, p._errs || []);
      await p.close();
    }
    // D: positive control, still visible after the downgrade
    {
      const p = await open(b, vp, '#book=3&world=scadrial&view=surface');
      await enter(p, 'luthadel');
      await p.evaluate(() => window.__atlas.setBook(2));
      await p.waitForTimeout(2500);
      const s = await sample(p);
      check(
        tag + ' D positive: Luthadel still visible at book 2 stays entered with its copy and URL',
        s.view === 'place' &&
          s.rendered === 'luthadel' &&
          /Luthadel/.test(s.crumbs) &&
          s.ubook === 2 &&
          s.usite === 'luthadel' &&
          s.uview === 'place',
        { view: s.view, rendered: s.rendered, ubook: s.ubook, usite: s.usite, uview: s.uview },
      );
      check(tag + ' D no page errors', !(p._errs || []).length, p._errs || []);
      await p.close();
    }
  }
  await b.close();
  const pass = results.filter(r => r.pass).length;
  console.log(pass + '/' + results.length);
  process.exitCode = pass === results.length ? 0 : 1;
})().catch(e => {
  console.error('HARNESS ERROR', e);
  process.exit(2);
});
