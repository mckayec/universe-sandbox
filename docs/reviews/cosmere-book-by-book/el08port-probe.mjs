// EL08-PORT rendered probe (Playwright + software GL). Real engine + real Cosmere pack (no fixtures).
// Per viewport (1440x900, 390x844) and reading state, deep-links to Sel and reads: whether Sel/Pool are reachable,
// the dossier status/facts text, the cognitive realm button state, the Pool label/description, and the codex Shards
// entries. At All it also switches to the Cognitive realm, descends to Sel and reads the realm card + uniforms.
// Usage: node el08-port-probe.mjs <baseUrl> <label> [shotDir]   (CHROME_PATH optional). One JSON line per state.
import { chromium } from 'playwright';
const [base = 'http://127.0.0.1:4173', label = 'head', shots] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const STATES = [
  ['all', ''],
  ['legacy1', 'book=1'],
  ['elantris', 'read=elantris'],
  ['elantris+hope', 'read=elantris,the-hope-of-elantris'],
  ['hope-only', 'read=the-hope-of-elantris'],
  ['none', 'read=_none'],
];
async function open(ctx, h) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.addInitScript(() => (window.__HD = 256));
  await p.goto(base + '/atlas/index.html?pack=cosmere#' + (h ? h + '&' : '') + 'world=sel&view=surface&site=pool');
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p
    .waitForFunction(() => window.__atlas.S.view === 'world' && !!window.__atlas.PL, null, {
      timeout: 120000,
      polling: 250,
    })
    .catch(() => {});
  await p.evaluate(() => document.querySelector('#splash')?.classList.add('out'));
  await p.waitForTimeout(1500);
  return { p, errors };
}
const readPage = p =>
  p.evaluate(() => {
    const A = window.__atlas;
    const d = document.querySelector('#dossier');
    const cog = document.querySelector('#realms button[data-r="cognitive"]');
    return {
      view: A.S.view,
      sel: A.S.sel,
      site: A.S.site,
      dossier: (d?.innerText || '').replace(/\s+/g, ' ').slice(0, 160),
      cognitiveBtn: cog ? (cog.disabled ? 'disabled' : 'enabled') : 'absent',
      poolOldName: document.body.innerText.includes('Devotion’s perpendicularity'),
      poolTail: document.body.innerText.includes('It opens into Sel’s Cognitive Realm'),
      hasPoolLabel: document.body.innerText.includes('The Pool'),
      orderFact: /Order\s*2nd from Mashe/i.test(d?.innerText || ''),
      moonFact: /Moon\s*Oem/i.test(d?.innerText || ''),
      poolDescShown: (d?.innerText || '').includes('A small, deep pool of thick, crystalline blue liquid'),
      statusLine: ((d?.innerText || '').match(/WORLD OF ELANTRIS|2ND FROM MASHE[^\n]*/i) || [''])[0],
    };
  });
async function codex(p) {
  const b = await p.$('#cxBtn');
  if (!b || (await b.isHidden())) return null;
  await b.click();
  await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('#cxTabs [data-tab="shards"]')?.click());
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({
    names: [...document.querySelectorAll('#cxBody .cx-item h3')].map(x => x.textContent),
    hidden: document.querySelector('#cxBody .cx-hid')?.textContent || '',
  }));
  await p.keyboard.press('Escape');
  return r;
}
for (const [vpName, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  for (const [name, h] of mobile ? STATES.filter(x => ['all', 'legacy1', 'elantris', 'none'].includes(x[0])) : STATES) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
    const o = await open(ctx, h);
    const r = await readPage(o.p);
    if (shots && (name === 'all' || name === 'legacy1'))
      await o.p.screenshot({ path: `${shots}/el08-${label}-${name}-pool-${vpName}.jpg`, type: 'jpeg', quality: 70 });
    const cx = await codex(o.p);
    if (shots && name === 'all' && cx) {
      await o.p.click('#cxBtn');
      await o.p.evaluate(() => document.querySelector('#cxTabs [data-tab="shards"]')?.click());
      await o.p.waitForTimeout(300);
      await o.p.screenshot({ path: `${shots}/el08-${label}-codex-shards-${vpName}.jpg`, type: 'jpeg', quality: 70 });
      await o.p.keyboard.press('Escape');
    }
    console.log(
      JSON.stringify({
        label,
        vp: vpName,
        state: name,
        ...r,
        codexShards: cx?.names,
        codexHidden: cx?.hidden,
        devotionEntry: !!cx?.names.includes('Devotion and Dominion'),
        adonalsiumEntry: !!cx?.names.includes('Adonalsium'),
        errors: o.errors.slice(0, 3),
      }),
    );
    await ctx.close();
  }
  // Cognitive realm at All: card + uniforms on Sel
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.addInitScript(() => (window.__HD = 256));
  await p.goto(base + '/atlas/index.html?pack=cosmere');
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.evaluate(() => document.querySelector('#splash')?.classList.add('out'));
  await p.waitForTimeout(500);
  await p.evaluate(() => window.__atlas.setRealm('cognitive'));
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.__atlas.descend('sel'));
  await p.waitForFunction(() => window.__atlas.PL && window.__atlas.PL.w.id === 'sel', null, {
    timeout: 300000,
    polling: 500,
  });
  await p.waitForTimeout(1500);
  const c = await p.evaluate(() => {
    const A = window.__atlas,
      u = A.PL.mat.uniforms;
    const lin = h => new THREE.Color(h).convertSRGBToLinear().getHexString();
    return {
      realm: A.S.realm,
      card: document.querySelector('#dossier .realmcard')?.textContent || '',
      c1: u.uRC1.value.getHexString(),
      style: u.uRStyle.value,
      selC1: lin('#ff6a2a'),
      genC1: lin('#1e1a2c'),
    };
  });
  if (shots)
    await p.screenshot({ path: `${shots}/el08-${label}-cognitive-sel-${vpName}.jpg`, type: 'jpeg', quality: 70 });
  console.log(JSON.stringify({ label, vp: vpName, state: 'all-cognitive', ...c, errors: errors.slice(0, 3) }));
  await ctx.close();
}
await browser.close();
