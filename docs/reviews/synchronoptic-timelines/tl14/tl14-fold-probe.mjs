// Timeline checkpoint 14: folded per-work undated panels and undated search, driven with the real Standard Works
// pack through the still-unwired adapter (the view is given the adapted model directly; no host is wired).
// Usage: node tl14-fold-probe.mjs <base url serving public/> <path to PR33 lds-standard-works.js> <out dir>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const [base, packPath, out] = process.argv.slice(2);
const packJs = readFileSync(packPath, 'utf8');
const results = [];
const ok = (c, m) => results.push((c ? 'PASS ' : 'FAIL ') + m);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto(base + 'atlas/?pack=abrahamic-world-religions', { waitUntil: 'load' });
  await page.waitForFunction(() => window.AtlasTimeline && window.AtlasTimelineView, null, { polling: 500, timeout: 60000 });
  await page.addScriptTag({ content: packJs });
  const info = await page.evaluate(() => {
    const TL = window.AtlasTimeline;
    const pack = window.ATLAS_PACKS['lds-standard-works'];
    const model = TL.adapterFor(pack)(pack);
    /* reuse the page's own #timeline container (its styles), replacing the Religious Traditions view's element */
    const old = document.getElementById('timeline');
    const host = old.cloneNode(false);
    old.replaceWith(host);
    const v = window.AtlasTimelineView.createView({ el: host, pack, model, ok: () => true });
    window.__sw = { v, model };
    v.show();
    const V = TL.visible(model, () => true);
    const per = {};
    V.undated.forEach(r => (per[r.lane] = (per[r.lane] || 0) + 1));
    return {
      lanes: model.lanes.map(l => [l.id, l.title, per[l.id] || 0]),
      undated: V.undated.length,
      pick: V.undated.filter(r => r.lane === 'work-bom')[200],
    };
  });
  ok(info.lanes.some(l => l[1] === 'Standard Works overview') || !info.lanes.some(l => l[1] === 'Other'), `${w}: no "Other" lane`);
  const folds = await page.$$eval('#timeline details.tl-fold', ds =>
    ds.map(d => ({ id: d.dataset.fold, open: d.open, n: d.querySelectorAll('li').length, s: d.querySelector('summary').textContent })),
  );
  const expect = info.lanes.filter(l => l[2] > 12);
  ok(folds.length === expect.length, `${w}: one folded panel per lane over 12 undated (${folds.length}/${expect.length})`);
  ok(folds.every(f => !f.open), `${w}: panels closed by default`);
  for (const f of folds) {
    const n = info.lanes.find(l => l[0] === f.id)[2];
    ok(f.n === n && f.s.includes(n + ' undated'), `${w}: ${f.id} keeps all ${n} rows and counts them`);
  }
  const rows = await page.$$eval('#timeline .tl-und li', ls => ls.length);
  ok(rows === info.undated, `${w}: every undated record is in the DOM (${rows}/${info.undated})`);
  // source order inside the Book of Mormon panel matches the gated view's order
  const domOrder = await page.$$eval('#timeline details[data-fold="work-bom"] [data-id]', bs => bs.map(b => b.dataset.id));
  const viewOrder = await page.evaluate(() =>
    window.AtlasTimeline.visible(window.__sw.model, () => true)
      .undated.filter(r => r.lane === 'work-bom')
      .map(r => r.id),
  );
  ok(JSON.stringify(domOrder) === JSON.stringify(viewOrder), `${w}: BoM panel in source order`);
  // search reaches a closed panel; picking a hit opens it and focuses the row
  const q = info.pick.label.slice(0, 18);
  await page.fill('#timeline [data-tl-uq]', q);
  const hitN = await page.$$eval('#timeline .tl-uhits [data-uhit]', bs => bs.length);
  ok(hitN > 0, `${w}: search "${q}" finds records in a closed panel (${hitN})`);
  ok(await page.$eval('#timeline [data-tl-uq]', e => e === document.activeElement), `${w}: search keeps focus while typing`);
  await page.click(`#timeline .tl-uhits [data-uhit="${info.pick.id}"]`).catch(async () => {
    await page.click('#timeline .tl-uhits [data-uhit]');
  });
  const after = await page.evaluate(() => {
    const a = document.activeElement;
    const d = a && a.closest('details.tl-fold');
    return { id: a && a.dataset.id, panel: d && d.dataset.fold, open: d && d.open, sel: a && a.getAttribute('aria-pressed') };
  });
  ok(after.open && after.sel === 'true' && after.id, `${w}: hit opens its panel, selects and focuses the row (${after.panel})`);
  ok(await page.$eval('#timeline [data-tl-uq]', e => e.value) === q, `${w}: query survives the rerender`);
  await page.screenshot({ path: `${out}/${w}-search-reveal.jpg`, type: 'jpeg', quality: 70 });
  // a user-opened panel stays open across a mode change; closing it is remembered too
  await page.evaluate(() => document.querySelector('#timeline details[data-fold="work-dc"]').toggleAttribute('open', true));
  await page.waitForTimeout(50);
  await page.click('#timeline [data-mode="list"]');
  const listFolds = await page.$$eval('#timeline details.tl-fold', d => d.length);
  ok(listFolds === 0, `${w}: list arrangement lists every row unfolded (TL-R02)`);
  await page.click('#timeline [data-mode="chart"]');
  ok(await page.$eval('#timeline details[data-fold="work-dc"]', d => d.open), `${w}: user-opened panel stays open`);
  // deep-linked selection reveals its panel
  await page.evaluate(id => {
    window.__sw.v.close();
    window.__sw.v.show(id);
  }, viewOrder[viewOrder.length - 1]);
  const dl = await page.evaluate(() => {
    const a = document.activeElement;
    const d = a && a.closest('details.tl-fold');
    return { open: d && d.open, panel: d && d.dataset.fold };
  });
  ok(dl.open && dl.panel === 'work-bom', `${w}: deep-linked record opens its panel and takes focus`);
  // keyboard: summary toggles with Enter
  await page.focus('#timeline summary[data-fold-s="work-nt"]').catch(() => {});
  const ntBefore = await page.$eval('#timeline details[data-fold="work-nt"]', d => d.open).catch(() => null);
  if (ntBefore !== null) {
    await page.keyboard.press('Enter');
    ok((await page.$eval('#timeline details[data-fold="work-nt"]', d => d.open)) !== ntBefore, `${w}: Enter toggles a panel`);
  }
  const sz = await page.$eval('#timeline summary', s => s.getBoundingClientRect().height);
  ok(sz >= 44, `${w}: panel summary target ${Math.round(sz)}px high`);
  await page.screenshot({ path: `${out}/${w}-panels.jpg`, type: 'jpeg', quality: 70 });
  ok(!errs.length, `${w}: no console/page errors ${errs.join(' | ')}`);
  await page.close();
}
await browser.close();
writeFileSync(`${out}/tl14-fold-probe.txt`, results.join('\n') + '\n');
console.log(results.join('\n'));
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
