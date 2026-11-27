// CA01-DESTINATION-01 rendered probe (ca01-checkpoint2-2026-11-21.md); harness adapted from ca01weather-probe.mjs.
// Real Cosmere pack + engine, no fixtures; Playwright + software GL, 1440x900 and 390x844 (touch; phone dossier sheet
// expanded with a real tap on #grab). Canticle is selected programmatically (__atlas.selectWorld).
// Per state: built link objects (__atlas.LINKS) contain no h-nomad; no link object routes Canticle to Komashi;
// "Skips on to UTol" never on the page; in era-12 states (All, legacy12, all works) the dossier blurb equals the
// new eras[12] blurb; visible link ids are written to <out.json> for a head/parent comparison.
// Usage: node ca01dest-probe.mjs <baseUrl> <packPath> [mode=head|parent] [shotDir] [out.json]
import { chromium } from 'playwright';
import fs from 'node:fs';
import vm from 'node:vm';
const [base = 'http://127.0.0.1:4173', packPath = 'public/atlas/packs/cosmere.js', mode = 'head', shotDir, outPath] =
  process.argv.slice(2);
const pk = (() => {
  const c = { window: {} };
  vm.runInNewContext(fs.readFileSync(packPath, 'utf8'), c);
  return c.window.ATLAS_PACKS.cosmere;
})();
const ALL = pk.spoilers.works.map(w => w.id);
const B11 = pk.spoilers.works.filter(w => w.bucket === 11).map(w => w.id);
const SUNLIT = 'the-sunlit-man';
const REMOVED = 'Skips on to UTol';
const NEW_ERA =
  'A tiny planet whose sunlight burns anything it touches, so cities fly around the world ahead of the dawn. The stranger Nomad, who is Sigzil of Bridge Four years after leaving Roshar, helps the people of Beacon overthrow the Cinder King.';
const STATES = [
  ['All', '#book=0', 'era12'],
  ['legacy12', '#book=12', 'era12'],
  ['all works', '#read=' + ALL.join(','), 'era12'],
  ['legacy11', '#book=11', 'base'],
  ['bucket11', '#read=' + B11.join(','), 'base'],
  ['legacy10', '#book=10', 'denied'],
  ['Sunlit only', '#read=' + SUNLIT, 'denied'],
  ['bucket11 minus Sunlit', '#read=' + B11.filter(id => id !== SUNLIT).join(','), 'denied'],
  ['all works minus Sunlit', '#read=' + ALL.filter(id => id !== SUNLIT).join(','), 'denied'],
];
const visible = {};
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else {
    fail++;
    console.log('FAIL', msg);
  }
  if (c && process.env.VERBOSE) console.log('ok  ', msg);
};
const expand = async (p, mobile) => {
  if (mobile && (await p.evaluate(() => document.querySelector('#dossier')?.classList.contains('collapsed'))))
    await p.tap('#grab');
  await p.waitForTimeout(300);
};
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash, kind] of STATES) {
    const tag = `${name} ${label}`;
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    p.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
    await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
    await p.waitForTimeout(600);
    const L = await p.evaluate(() => {
      const ids = Object.keys(window.__atlas.LINKS);
      const route = ids.filter(k => {
        const r = window.__atlas.LINKS[k].userData.route || {};
        const refs = [...(r.path || []), ...(r.pairs || []).flat()];
        return refs.includes('canticle') && refs.includes('komashi');
      });
      return { ids, vis: ids.filter(k => window.__atlas.LINKS[k].visible).sort(), route };
    });
    visible[tag] = L.vis;
    ok(!L.ids.includes('h-nomad'), `${tag}: no h-nomad link object (${L.ids.length} built)`);
    ok(L.route.length === 0, `${tag}: no Canticle-Komashi link object (${L.route.join(',')})`);
    await p.evaluate(() => window.__atlas.selectWorld('canticle'));
    await p.waitForTimeout(500);
    await expand(p, mobile);
    const s = await p.evaluate(() => {
      const b = document.querySelector('#dossier p.blurb');
      return {
        sel: window.__atlas.S.sel,
        blurb: b ? b.textContent : null,
        page: document.body.innerText + '\n' + document.body.textContent,
      };
    });
    ok(!s.page.includes(REMOVED), `${tag}: removed clause absent from page`);
    if (kind === 'era12') {
      ok(s.sel === 'canticle', `${tag}: canticle selected (${s.sel})`);
      ok(s.blurb === NEW_ERA, `${tag}: eras[12] blurb = new text (${s.blurb})`);
      await p.locator('#dossier p.blurb').first().scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => {
        const el = document.querySelector('#dossier p.blurb').getBoundingClientRect();
        return {
          w: el.width,
          h: el.height,
          l: el.left,
          r: el.right,
          t: el.top,
          b: el.bottom,
          vw: innerWidth,
          vh: innerHeight,
        };
      });
      ok(
        r.w > 0 && r.h > 0 && r.l >= 0 && r.r <= r.vw && r.t < r.vh && r.b > 0,
        `${tag}: blurb box visible (${JSON.stringify(r)})`,
      );
      if (shotDir && label === 'All') await p.screenshot({ path: `${shotDir}/ca01dest-${mode}-${label}-${name}.png` });
    }
    ok(errors.length === 0, `${tag}: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
if (outPath) fs.writeFileSync(outPath, JSON.stringify(visible, null, 1));
console.log(`ca01dest-probe (${mode}): ${pass}/${pass + fail} pass`);
process.exit(fail ? 1 : 0);
