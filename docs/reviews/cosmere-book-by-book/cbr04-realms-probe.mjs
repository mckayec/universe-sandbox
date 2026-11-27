// CBR-04 rendered probe (Playwright + software GL): the world-specific realm card (#dossier .realmcard) and the
// realm appearance uniforms of the open planet (PL.mat.uniforms.uRC1..3) honour Scadrial's per-work "realms"
// field gate. Real engine + real Cosmere pack; the field gate itself is a TEST FIXTURE injected in the browser
// before the pack registers (no canon mapping; the shipped pack has no realms gate). Per viewport (1440x900,
// 390x844): six fixture states + an allowed→denied→allowed transition while Scadrial's world view is open.
// Usage: node cbr04-realms-probe.mjs <baseUrl> [shotDir]
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', shotDir] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0,
  fail = 0;
const ok = (c, msg) => {
  if (c) pass++;
  else fail++;
  console.log(c ? 'PASS' : 'FAIL', msg);
};
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const READ = '#read=' + [...OT, 'warbreaker', 'the-way-of-kings'].join(',');
const OWN = { name: 'Expanse of the Vapors', c1: '7a808c', c2: 'eef2f6', c3: '2e2b28' };
const GEN = { c1: '1e1a2c', c2: '5a5088', c3: '0e0c14' };
const NONE = Symbol('none');
async function open(ctx, hash, gate) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.addInitScript(() => (window.__HD = 256)); // lighter surface bake under software GL
  if (gate !== NONE)
    await p.addInitScript(g => {
      let v;
      const o = {};
      Object.defineProperty(o, 'cosmere', {
        enumerable: true,
        configurable: true,
        get: () => v,
        set: x => {
          const w = x.worlds.find(y => y.id === 'scadrial');
          w.gates = { ...(w.gates || {}), realms: g }; // FIXTURE
          v = x;
        },
      });
      window.ATLAS_PACKS = o;
    }, gate);
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(500);
  // Cognitive first, then descend (switching realm from an open surface returns to the galaxy, pre-existing)
  await p.evaluate(() => window.__atlas.setRealm('cognitive'));
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.__atlas.descend('scadrial'));
  await p.waitForFunction(() => window.__atlas.PL && window.__atlas.PL.w.id === 'scadrial', null, {
    timeout: 300000,
    polling: 500,
  });
  await p.waitForTimeout(1500);
  return { p, errors };
}
// uniforms hold linear colours (engine CL = sRGB→linear); expected hex values are converted the same way in-page
const read = p =>
  p.evaluate(([OWN, GEN]) => {
    const A = window.__atlas,
      u = A.PL.mat.uniforms;
    const lin = h => new THREE.Color('#' + h).convertSRGBToLinear().getHexString();
    const want = T => [lin(T.c1), lin(T.c2), lin(T.c3)];
    return {
      view: A.S.view,
      sel: A.S.sel,
      realm: A.S.realm,
      card: document.querySelector('#dossier .realmcard')?.textContent || '',
      dossier: document.querySelector('#dossier')?.textContent || '',
      c1: u.uRC1.value.getHexString(),
      c2: u.uRC2.value.getHexString(),
      c3: u.uRC3.value.getHexString(),
      style: u.uRStyle.value,
      own: want(OWN),
      gen: want(GEN),
    };
  }, [OWN, GEN]);
function expect(tag, r, own) {
  ok(r.view === 'world' && r.sel === 'scadrial' && r.realm === 'cognitive', `${tag}: Scadrial world view, Cognitive realm`);
  ok(r.dossier.includes(OWN.name) === own, `${tag}: realm card ${own ? 'shows' : 'omits'} world-specific name`);
  const T = own ? r.own : r.gen;
  ok(r.c1 === T[0] && r.c2 === T[1] && r.c3 === T[2], `${tag}: material colours ${own ? 'world-specific' : 'generic'} (${r.c1},${r.c2},${r.c3})`);
  ok(r.style === (own ? 1 : 4), `${tag}: style ${own ? 'mist' : 'generic unsea'} (${r.style})`);
}
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  for (const [label, hash, gate, own] of [
    ['unread valid gate (fixture req secret-history)', READ, { req: 'mistborn-secret-history' }, false],
    ['present-invalid gate (fixture {})', READ, {}, false],
    ['satisfied gate (fixture req warbreaker)', READ, { req: 'warbreaker' }, true],
    ['absent gate (shipped pack)', READ, NONE, true],
    ['legacy book 4 (fixture req secret-history)', '#book=4', { req: 'mistborn-secret-history' }, true],
    ['All (fixture req secret-history)', '#book=0', { req: 'mistborn-secret-history' }, true],
  ]) {
    const { p, errors } = await open(ctx, hash, gate);
    expect(`${name} ${label}`, await read(p), own);
    ok(errors.length === 0, `${name} ${label}: no page errors ${errors.join('|')}`);
    await p.close();
  }
  // transition while open: allowed → untick Warbreaker in the Reading panel → denied → tick again → allowed
  const { p, errors } = await open(ctx, READ, { req: 'warbreaker' });
  expect(`${name} transition start (allowed)`, await read(p), true);
  if (shotDir) await p.screenshot({ path: `${shotDir}/cbr04-${name}-allowed.png` });
  await p.click('#rdBtn'); // open the Reading panel and press the Warbreaker checkbox like a reader
  await p.locator('#rdPanel input[type=checkbox][data-work="warbreaker"]').click();
  await p.evaluate(() => document.querySelector('#rdBtn').click()); // close the panel again
  await p.waitForTimeout(800);
  expect(`${name} transition after untick (denied)`, await read(p), false);
  if (shotDir) await p.screenshot({ path: `${shotDir}/cbr04-${name}-denied.png` });
  await p.click('#rdBtn'); // open the Reading panel and press the Warbreaker checkbox like a reader
  await p.locator('#rdPanel input[type=checkbox][data-work="warbreaker"]').click();
  await p.evaluate(() => document.querySelector('#rdBtn').click()); // close the panel again
  await p.waitForTimeout(800);
  expect(`${name} transition after re-tick (allowed)`, await read(p), true);
  ok(errors.length === 0, `${name} transition: no page errors ${errors.join('|')}`);
  await p.close();
  await ctx.close();
}
await browser.close();
console.log(`RESULT ${pass}/${pass + fail} pass`);
process.exitCode = fail ? 1 : 0;
