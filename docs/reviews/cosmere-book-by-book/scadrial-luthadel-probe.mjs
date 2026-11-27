// Scadrial + Luthadel field-gate rendered probe (Playwright + software GL) for the narrow return in
// scadrial-luthadel-handoff-2026-11-10.md. Real Cosmere pack, real engine. Per viewport (1440x900, 390x844):
// empty / MB01-only / MB03-only / MB01+MB02 keep the parent-dependent surfaces hidden; all three original-trilogy
// works (set and preset) show the narrow copy; later era (#book=6) and All behaviour unchanged; unreviewed note kept.
// Usage: node scadrial-luthadel-probe.mjs <baseUrl> [shotDir]
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
  else {
    fail++;
    console.log('FAIL', msg);
  }
};
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const BLURB =
  'In the Final Empire, ash falls beneath a red sun. Skaa labor in the fields under the Lord Ruler’s rule, brown-leaved crops struggle to grow, and mists gather as evening falls.';
const SHORT = 'The Final Empire beneath a red sun.';
const LDESC = 'Luthadel is the walled capital of the Final Empire. The River Channerel runs through the city.';
const OLD = ['constant fall of ash', 'eight gates named for metals', 'built over the Well of Ascension', 'The ash-covered world'];
const ERA6 = 'Three hundred years after the end of the first trilogy';
async function open(ctx, hash) {
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base + '/atlas/index.html?pack=cosmere' + hash);
  await p.waitForFunction(() => !!window.__atlas, null, { timeout: 120000, polling: 250 });
  await p.waitForTimeout(600);
  return { p, errors };
}
const body = p => p.evaluate(() => document.body.innerText);
const dossier = p => p.evaluate(() => document.querySelector('#dossier')?.textContent || '');
// The `short` field renders only in the desktop hover tooltip (touch has no tooltip).
const tipShort = p =>
  p.evaluate(() => {
    const b = document.querySelector('#labels button[data-id="scadrial"]');
    if (!b) return '';
    b.dispatchEvent(new MouseEvent('mouseenter', { clientX: 200, clientY: 200 }));
    return document.querySelector('#tip')?.textContent || '';
  });
const sel = p => p.evaluate(() => window.__atlas.S.sel);
const unrev = p => p.evaluate(() => !!document.querySelector('.rd-note'));
const all = (s, a) => a.every(x => s.includes(x));
const none = (s, a) => a.every(x => !s.includes(x));
for (const [name, vp, mobile] of [
  ['1440x900', { width: 1440, height: 900 }, false],
  ['390x844', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  // Hidden states: parent record still falls back to the whole bucket (unreviewed), so nothing parent-dependent shows.
  for (const [label, hash] of [
    ['empty', '#read=_none'],
    ['MB01 only', '#read=' + OT[0]],
    ['MB03 only', '#read=' + OT[2]],
    ['MB01+MB02', '#read=' + OT[0] + ',' + OT[1]],
  ]) {
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
    await p.waitForTimeout(300);
    ok((await sel(p)) !== 'scadrial', `${name} ${label}: Scadrial not selectable`);
    await p.evaluate(() => window.__atlas.selectSite('luthadel'));
    await p.waitForTimeout(200);
    const t = (await body(p)) + (await dossier(p)) + (mobile ? '' : await tipShort(p));
    ok(none(t, [BLURB, SHORT, LDESC]), `${name} ${label}: new copy hidden`);
    ok(none(t, OLD), `${name} ${label}: old copy absent`);
    ok(errors.length === 0, `${name} ${label}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // Visible states: all three original-trilogy works, as a set and as the frozen preset prefix.
  for (const [label, hash] of [
    ['OT set', '#read=' + OT.join(',')],
    ['OT preset', '#upto=mistborn-original-trilogy:1:' + OT[2]],
  ]) {
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
    await p.waitForTimeout(400);
    ok((await sel(p)) === 'scadrial', `${name} ${label}: Scadrial selected`);
    const d = await dossier(p);
    ok(d.includes(BLURB), `${name} ${label}: new blurb shown`);
    ok(none(d, OLD), `${name} ${label}: old blurb/desc absent`);
    ok(d.includes('Luthadel'), `${name} ${label}: Luthadel name in places`);
    if (!mobile) ok((await tipShort(p)).includes(SHORT), `${name} ${label}: new short shown in hover tooltip`);
    await p.evaluate(() => window.__atlas.selectSite('luthadel'));
    await p.waitForTimeout(300);
    const d2 = await dossier(p);
    ok(d2.includes(LDESC), `${name} ${label}: Luthadel desc shown`);
    ok(await unrev(p) || !(await p.$eval('#rdPanel', e => !e.hidden).catch(() => false)), `${name} ${label}: unreviewed note kept when panel open`);
    if (shotDir && label === 'OT set') await p.screenshot({ path: `${shotDir}/scadrial-luthadel-OT-${name}.png` });
    ok(errors.length === 0, `${name} ${label}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // Unreviewed indicator still present for the OT set (parents keep their bucket fallback).
  {
    const { p } = await open(ctx, '#read=' + OT.join(','));
    if (await p.$eval('#rdPanel', e => e.hidden)) await p.click('#rdBtn');
    await p.waitForTimeout(200);
    ok(await unrev(p), `${name}: unreviewed note present for OT set`);
    await p.close();
  }
  // Later era unchanged: legacy #book=6 and All show the era-6 blurb; Luthadel (until 6) not listed.
  for (const [label, hash] of [
    ['book=6', '#book=6'],
    ['All', '#book=0'],
  ]) {
    const { p, errors } = await open(ctx, hash);
    await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
    await p.waitForTimeout(400);
    const d = await dossier(p);
    ok(d.includes(ERA6), `${name} ${label}: era-6 blurb shown`);
    ok(!d.includes(BLURB), `${name} ${label}: era-6 overrides base blurb`);
    const places = await p.evaluate(() =>
      [...document.querySelectorAll('#dossier [data-site]')].map(e => e.dataset.site),
    );
    console.log('PLACES', name, label, places.length, places.join(','));
    if (label === 'book=6')
      ok(!places.includes('luthadel') && !d.includes(LDESC), `${name} ${label}: Luthadel (until 6) not listed`);
    // All lists the 17 original-era sites (pre-existing behaviour, same list at 773c35b); Luthadel's name is shown.
    else ok(places.length === 17 && places.includes('luthadel'), `${name} ${label}: 17-site original-era list unchanged`);
    ok(errors.length === 0, `${name} ${label}: no errors ${errors.join('|')}`);
    await p.close();
  }
  // Legacy #book=2 (cumulative mode, no per-work field gates): narrow copy is what it now shows.
  {
    const { p, errors } = await open(ctx, '#book=2');
    await p.evaluate(() => window.__atlas.selectWorld('scadrial'));
    await p.waitForTimeout(400);
    const d = await dossier(p);
    ok(d.includes(BLURB) && none(d, OLD), `${name} book=2: legacy shows narrow blurb`);
    ok(errors.length === 0, `${name} book=2: no errors ${errors.join('|')}`);
    await p.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify({ pass, fail }));
process.exit(fail ? 1 : 0);
