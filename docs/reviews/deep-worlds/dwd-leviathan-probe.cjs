// Rendered leviathan checks for the Society disposition (Europa VI boundary), final-head suite.
// Usage: [VP=1440x900,390x844] node dwd-leviathan-probe.cjs <port>
// Per viewport and book II / V / VI:
//  G: on the Europa globe, wait until the "Leviathans" label is shown (opacity > 0, beast visible part of its cycle),
//     click it (rendered click; DOM click fallback is recorded as "dom"), and read the banner the user sees.
//  L: inside Lorn's Castle, press the rendered "Leviathans" landmark button in the dossier and read its visible text.
// LEVWAIT (ms, default 45000) bounds the wait for the globe label (shown only while a beast breaches, front-facing).
// Pre-VI text must say "Europa’s ocean" and name none of Harmonia / Discordia / Light Bringer / Ascomanni;
// VI must say "Discordia Sea" and carry the Light Bringer line. Strict: exits 1 on any FAIL.
const { chromium } = require('playwright');
const PORT = process.argv[2] || 4199;
const VPS = (process.env.VP || '1440x900,390x844').split(',').map(s => s.split('x').map(Number));
const EARLY = /Harmonia|Discordia|Light Bringer|Ascomanni/;
(async () => {
  let fails = 0;
  const ok = (n, c, d) => {
    if (!c) fails++;
    console.log((c ? 'PASS ' : 'FAIL ') + n + (d ? ' | ' + String(d).slice(0, 240) : ''));
  };
  for (const [w, h] of VPS) {
    const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    await p.addInitScript(() => {
      window.__atlasFast = true;
    });
    await p.goto(`http://127.0.0.1:${PORT}/atlas/society.html`);
    await p.waitForFunction(() => window.__atlas, null, { timeout: 60000 });
    await p.waitForTimeout(1500);
    const A = (f, a) => p.evaluate(f, a);
    const openSheet = () =>
      A(() => {
        const s = document.querySelector('.sheet-handle');
        if (s && !document.body.classList.contains('sheet-open')) s.click();
      });
    const click = async (sel, test) => {
      let how = 'rendered';
      await p.click(sel, { timeout: 6000, trial: !!test }).catch(async () => {
        how = 'dom';
        await A((s) => document.querySelector(s).click(), sel);
      });
      return how;
    };
    for (const bk of [2, 5, 6]) {
      const want = (t) =>
        bk < 6 ? /Europa’s ocean/.test(t) && !EARLY.test(t) : /Discordia Sea/.test(t) && /In Light Bringer, the Ascomanni/.test(t);
      // G: globe label + banner
      await A(() => window.__atlas.toSystem());
      await p.waitForTimeout(500);
      await A((k) => window.__atlas.selectBook(k), bk);
      await p.waitForTimeout(400);
      await A(() => window.__atlas.descendThen('europa', () => {}));
      await p.waitForFunction(() => window.__atlas.mode === 'globe', null, { timeout: 30000 }).catch(() => {});
      const shown = await p
        .waitForFunction(
          () => [...document.querySelectorAll('.lbl.region')].some((x) => x.textContent === 'Leviathans' && +getComputedStyle(x).opacity > 0.5),
          null,
          { timeout: +(process.env.LEVWAIT || 45000), polling: 100 },
        )
        .then(() => true)
        .catch(() => false);
      await A(() => {
        const x = [...document.querySelectorAll('.lbl.region')].find((y) => y.textContent === 'Leviathans');
        if (x) x.id = '__levlbl';
      });
      let how = 'none';
      if (await p.$('#__levlbl')) how = await click('#__levlbl');
      await p.waitForTimeout(400);
      const ban = await A(() => ({
        hidden: document.querySelector('#banner').hidden,
        t: document.querySelector('#bannerT').textContent,
        s: document.querySelector('#bannerS').textContent,
      }));
      ok(
        `${w} book ${bk} globe Leviathans label shown and banner text gated`,
        shown && !ban.hidden && ban.t === 'Leviathans' && want(ban.s),
        `shown=${shown} click=${how} ${ban.s}`,
      );
      // L: scene landmark button
      await A(() => window.__atlas.toSystem());
      await p.waitForTimeout(500);
      await A(() => window.__atlas.enterSite('europa'));
      await p
        .waitForFunction(() => window.__atlas.mode === 'site' && window.__atlas.curSite && window.__atlas.curSite.name === 'Lorn’s Castle', null, { timeout: 30000 })
        .catch(() => {});
      await p.waitForTimeout(1200);
      await openSheet();
      await p.waitForTimeout(300);
      const has = await p.$('.place[data-lm=leviathan]');
      let lhow = 'none';
      if (has) {
        await p.$eval('.place[data-lm=leviathan]', (e) => e.scrollIntoView({ block: 'center' })).catch(() => {});
        lhow = await click('.place[data-lm=leviathan]');
      }
      await p.waitForTimeout(600);
      const lt = await A(() => {
        const e = document.querySelector('.place[data-lm=leviathan]');
        return e ? { sel: e.classList.contains('sel'), txt: e.innerText } : null;
      });
      const pageTxt = await A(() => document.body.innerText);
      ok(
        `${w} book ${bk} scene Leviathans landmark selected, visible text gated`,
        lt && lt.sel && want(lt.txt) && (bk === 6 || !/Harmonia|Discordia/.test(pageTxt)),
        `click=${lhow} ${lt ? lt.txt.replace(/\s+/g, ' ') : 'missing'}`,
      );
    }
    ok(`${w} zero page errors`, errs.length === 0, errs.join(' / '));
    await b.close();
  }
  console.log(fails ? `RESULT ${fails} FAIL` : 'RESULT ALL PASS');
  process.exit(fails ? 1 : 0);
})();
