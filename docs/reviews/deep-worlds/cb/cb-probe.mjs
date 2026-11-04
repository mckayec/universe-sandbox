// CB01–CB04 probe (Cosmere corrections on PR #37): each changed event appears at/above its gate in the site's place
// view (title and copy in the DOM), is absent from the DOM below the gate, carries no landmark in the loaded pack (so
// no landmark panel or landmark focus callback can pick it up), and no page errors occur. The galactic atlases have
// no search box; the place view's event list is the surface checked.
// Usage: CHROME_PATH=... node cb-probe.mjs http://localhost:4173/   (vite preview; base './')
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4173/';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
let pass = 0;
let fail = 0;
const ok = (cond, msg) => {
  console.log((cond ? 'PASS ' : 'FAIL ') + msg);
  cond ? pass++ : fail++;
};
const NEW = {
  e6: [
    'scadrial',
    'luthadel',
    2,
    'Kelsier meets Vin',
    'In Luthadel, Kelsier meets Vin and recognizes her as Mistborn.',
    'clubs',
  ],
  e77: [
    'nalthis',
    'courtofgods',
    3,
    'The Lifeless march',
    'After killing Blushweaver and threatening Llarimar',
    'enclave',
  ],
  e15: [
    'nalthis',
    'courtofgods',
    3,
    'Lightsong’s last day',
    'In captivity, Lightsong gives his Breath to heal Susebron',
    'palaces',
  ],
  e78: ['nalthis', 'courtofgods', 3, 'Susebron speaks', 'Vasher entrusts him with the D’Denir army', 'palace'],
};
const OLD = [
  'Kelsier gathers thieves',
  'torture Lightsong and Blushweaver',
  'uncovers the plot to start a war',
  'the war is stopped',
];
for (const vp of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  for (const [id, [world, site, book, title, text, lm]] of Object.entries(NEW)) {
    for (const b of [book, book - 1]) {
      const page = await browser.newPage({ viewport: vp });
      const errs = [];
      page.on('pageerror', e => errs.push(String(e)));
      const url = `${base}atlas/?pack=cosmere#book=${b}&world=${world}&site=${site}&view=place`;
      await page.goto(url);
      await page.waitForTimeout(3500);
      const body = await page.evaluate(() => (document.querySelector('#app') || document.body).textContent);
      const tag = `${vp.width} ${id} book=${b}`;
      if (b === book) {
        ok(body.includes(title) && body.includes(text), `${tag}: title and new copy in place view`);
        const ev = await page.evaluate(i => (window.ATLAS_PACKS.cosmere.events || []).find(e => e.id === i), id);
        ok(
          ev && ev.lm === undefined && ev.book === book && ev.site === site,
          `${tag}: no landmark (was ${lm}); book and site kept`,
        );
      } else {
        ok(!body.includes(text), `${tag}: new copy absent below gate`);
      }
      ok(!OLD.some(o => body.includes(o)), `${tag}: no superseded copy`);
      ok(errs.length === 0, `${tag}: no page errors ${errs.join(' | ')}`);
      await page.close();
    }
  }
}
await browser.close();
console.log(`${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
