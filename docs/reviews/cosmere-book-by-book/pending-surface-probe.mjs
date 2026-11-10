// COS-BB-001 pending-surface probe (families 7/8 cases 5a-5d from reading-ui-probe.mjs), re-run after the CBR-01..03
// fixes on a LIGHTER TEST-ONLY SURFACE: window.__HD=256 is set before load (existing hook, engine.js:499), so the
// queued HD planet bake is 256x128 instead of 4096x2048 under software GL; the 512 preview bake is unchanged.
// Pending SITE selection (5a: openEvent -> descend + 900 ms site timer) is tested here; pending WORLD construction
// (the descend ticket) is tested separately in cbr-fix-probe.mjs CBR-03. Real Cosmere pack + in-memory synthetic
// registry (fx-* fixture IDs, never written to the pack). Prints one JSON line per case.
// Usage: node pending-surface-probe.mjs <baseUrl> [1440x900|390x844|all]   (CHROME_PATH optional)
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', onlyVp = 'all'] = process.argv.slice(2);
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
  }
  console.log(JSON.stringify({ pass: !!c, case: VPN + ' ' + msg }));
};
let VPN = '';
async function open(hash, { synthetic = true, vp = { width: 1440, height: 900 }, mobile = false } = {}) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  await ctx.addInitScript(() => {
    window.__HD = 256; // lighter test-only surface (existing engine hook engine.js:499); production unchanged
  });
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

for (const [vpName, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  if (onlyVp !== 'all' && onlyVp !== vpName) continue;
  VPN = vpName;
  // 5. families 7/8: delayed place selection cancelled on a state change; hidden deep links; Back/Forward
  {
    const ALL = 'fx-1,fx-2a,fx-2b,fx-2c,' + [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => 'fx-' + k).join(',');
    const probe = await open('#read=fx-1', { synthetic: true, vp, mobile });
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
      const { ctx, p, errors } = await open('#read=' + ALL + '&world=' + pick.w1 + '&view=surface', { vp, mobile });
      await settle(p);
      const target = await p.evaluate(
        ([w1, change]) => {
          const A = window.__atlas;
          const e = A.pack.events.find(
            x =>
              x.world !== w1 &&
              x.site &&
              // the site must still exist with every fixture read: a site with an era end (`until`, e.g. Luthadel)
              // is correctly hidden then, which made the checkpoint-3 control pick an unselectable target
              A.pack.worlds.some(
                w => w.id === x.world && (w.sites || []).some(s => s.id === x.site && !s.until && !s.since),
              ),
          );
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
      const r = await p.evaluate(() => ({
        sel: window.__atlas.S.sel,
        site: window.__atlas.S.site,
        rd: JSON.stringify(window.__atlas.S.rd),
      }));
      if (change) {
        ok(
          r.sel === target.world && r.site === null,
          'pending site selection dropped after a state change ' + JSON.stringify([target, r]),
        );
        ok(
          r.rd === JSON.stringify({ mode: 'set', ids: ALL.split(',') }),
          'state ended identical after the double toggle ' + r.rd,
        );
      } else
        ok(
          r.sel === target.world && r.site === target.site,
          'control: site selected when nothing changed ' + JSON.stringify([target, r]),
        );
      ok(errors.length === 0, 'no errors (5a ' + change + ') ' + errors.join('|'));
      await ctx.close();
    }
    // 5b. deep link to a hidden world stays on the galaxy with a note
    {
      const { ctx, p, errors } = await open('#read=fx-1&world=' + pick.wLate + '&view=surface', { vp, mobile });
      await p.waitForTimeout(800);
      const r = await p.evaluate(() => ({
        sel: window.__atlas.S.sel,
        view: window.__atlas.S.view,
        hint: document.querySelector('#navhint').textContent,
      }));
      ok(r.sel !== pick.wLate && r.view === 'galaxy', 'hidden world not opened ' + JSON.stringify(r));
      ok(/not revealed/.test(r.hint), 'not-revealed note shown');
      ok(errors.length === 0, 'no errors (5b) ' + errors.join('|'));
      await ctx.close();
    }
    // 5c. deep link to a hidden site on a visible world: world opens, site does not
    if (pick.sLate) {
      const { ctx, p } = await open('#read=fx-1&world=' + pick.w1 + '&view=surface&site=' + pick.sLate, { vp, mobile });
      await settle(p);
      const r = await p.evaluate(() => ({
        sel: window.__atlas.S.sel,
        site: window.__atlas.S.site,
        view: window.__atlas.S.view,
      }));
      ok(r.sel === pick.w1 && r.view === 'world' && r.site === null, 'hidden site not selected ' + JSON.stringify(r));
      await ctx.close();
    }
    // 5d. Back/Forward: on a late world's surface, narrow to fx-1 (leaves the surface), then Forward does not reopen it
    {
      const { ctx, p, errors } = await open('#read=' + ALL, { vp, mobile });
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
      ok(
        r.view === 'galaxy' && r.sel !== pick.wLate,
        'Forward does not reopen the hidden surface ' + JSON.stringify(r),
      );
      ok(errors.length === 0, 'no errors (5d) ' + errors.join('|'));
      await ctx.close();
    }
  }
}
await browser.close();
console.log(JSON.stringify({ pass, total: pass + fail }));
process.exit(fail ? 1 : 0);
