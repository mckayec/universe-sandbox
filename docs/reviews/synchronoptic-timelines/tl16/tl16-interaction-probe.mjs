// Timeline checkpoint 16: TL-R12 (idempotent search reveal) and TL-R13 (Tab/focus over native controls, closed
// panels and gate changes), driven with the real Standard Works pack through the still-unwired adapter.
// Usage: node tl16-interaction-probe.mjs <base url serving public/> <path to PR33 lds-standard-works.js> <out dir>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const [base, packPath, out] = process.argv.slice(2);
const packJs = readFileSync(packPath, 'utf8');
const results = [];
const ok = (c, m) => {
  results.push((c ? 'PASS ' : 'FAIL ') + m);
  if (process.env.PROBE_TRACE) console.log(results[results.length - 1]);
};
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const T = '#timeline';
/* a person scrolls a control into view before pressing it (the reveal scrolls the row to the centre) */
const tap = async (page, sel) => {
  await page.$eval(sel, x => x.scrollIntoView({ block: 'center' }));
  await page.click(sel);
};
/* where focus is, and whether it is something a person can see */
const focusState = page =>
  page.evaluate(() => {
    const a = document.activeElement;
    const el = document.getElementById('timeline');
    let hidden = !a || a === document.body || (!(a instanceof SVGElement) && a.offsetParent === null);
    for (
      let d = a && a.closest && a.closest('details');
      d && !hidden;
      d = d.parentElement && d.parentElement.closest('details')
    )
      if (!d.open && !(a.tagName === 'SUMMARY' && a.parentElement === d)) hidden = true;
    const d = a && a.closest && a.closest('details.tl-fold');
    return {
      inside: !!a && el.contains(a) && a !== el,
      body: a === document.body,
      hidden,
      tag: a && a.tagName,
      id: a && a.dataset && a.dataset.id,
      key:
        a &&
        (a.dataset.id || a.dataset.foldS || (a.matches('[data-tl-uq]') ? 'search' : '') || a.textContent.slice(0, 30)),
      panel: d && d.dataset.fold,
      open: d && d.open,
      pressed: a && a.getAttribute && a.getAttribute('aria-pressed'),
      sel: window.__sw.v.sel,
      q: (el.querySelector('[data-tl-uq]') || {}).value,
    };
  });
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  page.setDefaultTimeout(20000);
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await page.goto(base + 'atlas/?pack=abrahamic-world-religions', { waitUntil: 'load', timeout: 90000 });
  await page.waitForFunction(() => window.AtlasTimeline && window.AtlasTimelineView, null, {
    polling: 500,
    timeout: 180000,
  });
  await page.addScriptTag({ content: packJs });
  /* the atlas globe keeps rendering behind the timeline dialog; under software GL it starves the main thread
     (a bare evaluate took ~0.7 s, a key press ~1.9 s), so the probe stops scheduling globe frames. The timeline
     view itself uses no animation frames, so this changes nothing it does. */
  await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
  });
  const info = await page.evaluate(() => {
    const TL = window.AtlasTimeline;
    const pack = window.ATLAS_PACKS['lds-standard-works'];
    const model = TL.adapterFor(pack)(pack);
    const old = document.getElementById('timeline');
    const host = old.cloneNode(false);
    old.replaceWith(host);
    window.__gate = () => true;
    const v = window.AtlasTimelineView.createView({ el: host, pack, model, ok: g => window.__gate(g) });
    window.__sw = { v, model };
    v.show();
    const V = TL.visible(model, () => true);
    const bom = V.undated.filter(r => r.lane === 'work-bom');
    return { undated: V.undated.length, pick: bom[150], other: V.undated.filter(r => r.lane === 'work-dc')[40] };
  });
  const q = info.pick.label;
  const hitSel = `${T} .tl-uhits [data-uhit="${info.pick.id}"]`;
  await page.fill(`${T} [data-tl-uq]`, q);
  // 1. first activation
  await tap(page, hitSel);
  let f = await focusState(page);
  ok(
    f.id === info.pick.id && f.open && f.sel === info.pick.id && f.q === q,
    `${w}: first reveal focuses the row in its open panel (${f.panel})`,
  );
  // 2. repeated activation of the same result keeps it selected and focused
  await tap(page, hitSel);
  f = await focusState(page);
  ok(
    f.id === info.pick.id && f.sel === info.pick.id && f.pressed === 'true' && !f.hidden,
    `${w}: repeated activation keeps selection and focus`,
  );
  // 3. manually closed panel, same (already selected) result
  for (let i = 0; i < 3; i++) {
    await tap(page, `${T} summary[data-fold-s="work-bom"]`);
    ok(
      !(await page.$eval(`${T} details[data-fold="work-bom"]`, d => d.open)),
      `${w}: panel closed by hand (round ${i + 1})`,
    );
    await tap(page, hitSel);
    f = await focusState(page);
    ok(
      f.id === info.pick.id && f.open && !f.hidden && f.sel === info.pick.id && f.q === q,
      `${w}: reveal reopens a hand-closed panel (round ${i + 1})`,
    );
  }
  // 4. collapsed lane
  await tap(page, `${T} .tl-lt[data-lane-t="work-bom"]`);
  ok(!(await page.$(`${T} details[data-fold="work-bom"]`)), `${w}: BoM lane collapsed`);
  await tap(page, hitSel);
  f = await focusState(page);
  ok(
    f.id === info.pick.id && f.open && !f.hidden && f.q === q,
    `${w}: reveal expands a collapsed lane and focuses the row`,
  );
  ok(
    !(await page.evaluate(() => window.__sw.v.laneParams.tlc.split(',').includes('work-bom'))),
    `${w}: lane no longer collapsed in state`,
  );
  // 5. chart/list interruption
  await tap(page, `${T} [data-mode="list"]`);
  ok((await page.$$eval(`${T} [data-id]`, b => b.length)) >= info.undated, `${w}: list keeps every row`);
  await tap(page, `${T} [data-mode="chart"]`);
  await page.fill(`${T} [data-tl-uq]`, q);
  await tap(page, hitSel);
  f = await focusState(page);
  ok(f.id === info.pick.id && f.open && !f.hidden, `${w}: reveal after a chart/list round trip`);
  await page.screenshot({ path: `${out}/${w}-reveal-after-close.jpg`, type: 'jpeg', quality: 70 });
  // 5b. roving tab stop inside an open panel: arrows/Home/End move within the list, Tab leaves it in one press
  await tap(page, hitSel);
  const rowsIn = await page.$$eval(`${T} details[data-fold="work-bom"] .tl-it`, b =>
    b.map(x => [x.dataset.id, x.getAttribute('tabindex')]),
  );
  ok(
    rowsIn.filter(r => r[1] === '0').length === 1 && rowsIn.find(r => r[1] === '0')[0] === info.pick.id,
    `${w}: the open BoM list is one Tab stop, on the selected row (${rowsIn.length} rows)`,
  );
  const ix = rowsIn.findIndex(r => r[0] === info.pick.id);
  await page.keyboard.press('ArrowDown');
  f = await focusState(page);
  ok(f.id === rowsIn[ix + 1][0] && f.panel === 'work-bom', `${w}: ArrowDown moves to the next row in source order`);
  await page.keyboard.press('ArrowUp');
  f = await focusState(page);
  ok(f.id === info.pick.id, `${w}: ArrowUp moves back`);
  await page.keyboard.press('End');
  f = await focusState(page);
  ok(f.id === rowsIn[rowsIn.length - 1][0], `${w}: End reaches the last row`);
  await page.keyboard.press('Home');
  f = await focusState(page);
  ok(f.id === rowsIn[0][0], `${w}: Home reaches the first row`);
  await page.keyboard.press('Tab');
  f = await focusState(page);
  ok(f.inside && !f.hidden && f.panel !== 'work-bom', `${w}: one Tab leaves the list (${f.tag} ${f.key})`);
  await page.keyboard.press('Shift+Tab');
  f = await focusState(page);
  ok(f.id === rowsIn[0][0], `${w}: Shift+Tab returns to the list's current stop`);
  // 6. Tab and Shift+Tab: from the search field round the whole dialog, never hidden, never stuck, never out
  await tap(page, `${T} summary[data-fold-s="work-dc"]`); // open one, so closed and open panels both exist
  await tap(page, `${T} summary[data-fold-s="work-dc"]`);
  await page.focus(`${T} [data-tl-uq]`);
  const seen = [];
  let stuck = 0;
  let bad = 0;
  let summaries = 0;
  let prev = 'search';
  for (let i = 0; i < 250; i++) {
    await page.keyboard.press('Tab');
    f = await focusState(page);
    if (!f.inside || f.hidden) bad++;
    if (f.key === prev) stuck++;
    if (f.tag === 'SUMMARY') summaries++;
    seen.push(f.key);
    prev = f.key;
    if (f.key === 'search') break;
  }
  ok(seen[seen.length - 1] === 'search', `${w}: Tab cycles back to the search field (${seen.length} stops)`);
  ok(!bad && !stuck, `${w}: Tab never leaves, hides or stalls (bad ${bad}, stuck ${stuck})`);
  ok(summaries >= 4, `${w}: Tab reaches closed panel summaries (${summaries})`);
  const back = [];
  bad = stuck = 0;
  prev = 'search';
  for (let i = 0; i < 250; i++) {
    await page.keyboard.press('Shift+Tab');
    f = await focusState(page);
    if (!f.inside || f.hidden) bad++;
    if (f.key === prev) stuck++;
    back.push(f.key);
    prev = f.key;
    if (f.key === 'search') break;
  }
  ok(back.length === seen.length && !bad && !stuck, `${w}: Shift+Tab cycles the same ${back.length} stops in reverse`);
  // 7. Enter/Space on a closed summary
  await page.focus(`${T} summary[data-fold-s="work-nt"]`);
  const nt0 = await page.$eval(`${T} details[data-fold="work-nt"]`, d => d.open);
  await page.keyboard.press('Enter');
  const nt1 = await page.$eval(`${T} details[data-fold="work-nt"]`, d => d.open);
  await page.keyboard.press('Space');
  const nt2 = await page.$eval(`${T} details[data-fold="work-nt"]`, d => d.open);
  f = await focusState(page);
  ok(nt1 !== nt0 && nt2 === nt0 && f.key === 'work-nt', `${w}: Enter and Space toggle a summary, focus stays on it`);
  // 8. gate change removes the focused record: focus recovers inside, counts and search follow the gate
  await tap(page, hitSel);
  await page.evaluate(() => {
    window.__gate = g => !(g && (g.layers || []).includes('bom'));
    window.__sw.v.refresh();
  });
  f = await focusState(page);
  ok(f.inside && !f.body && !f.hidden, `${w}: gate change moves focus to a visible control (${f.tag} ${f.key})`);
  ok(f.sel === null, `${w}: gate-excluded selection cleared`);
  ok(
    !(await page.$(`${T} details[data-fold="work-bom"]`)) && !(await page.$(hitSel)),
    `${w}: gated panel and hit gone`,
  );
  const gated = await page.evaluate(() => {
    const V = window.AtlasTimeline.visible(window.__sw.model, window.__gate);
    const per = {};
    V.undated.forEach(r => (per[r.lane] = (per[r.lane] || 0) + 1));
    return per;
  });
  const sums = await page.$$eval(`${T} details.tl-fold`, ds =>
    ds.map(d => [d.dataset.fold, d.querySelector('summary').textContent, d.querySelectorAll('li').length]),
  );
  ok(
    sums.every(([l, s, n]) => s.includes(gated[l] + ' undated') && n === gated[l]),
    `${w}: panel counts match the gated view`,
  );
  // a stale request for a gate-excluded record never unhides it
  await page.evaluate(id => window.__sw.v.show(id), info.pick.id);
  ok(
    (await page.evaluate(() => window.__sw.v.sel)) === null && !(await page.$(`${T} [data-id="${info.pick.id}"]`)),
    `${w}: excluded record stays hidden`,
  );
  // dc record still revealable after the gate change, source order kept
  await page.fill(`${T} [data-tl-uq]`, info.other.label);
  await tap(page, `${T} .tl-uhits [data-uhit="${info.other.id}"]`);
  f = await focusState(page);
  ok(f.id === info.other.id && f.open && !f.hidden, `${w}: reveal still works after the gate change`);
  const order = await page.$$eval(`${T} details[data-fold="work-dc"] [data-id]`, b => b.map(x => x.dataset.id));
  const vOrder = await page.evaluate(() =>
    window.AtlasTimeline.visible(window.__sw.model, window.__gate)
      .undated.filter(r => r.lane === 'work-dc')
      .map(r => r.id),
  );
  ok(JSON.stringify(order) === JSON.stringify(vOrder), `${w}: D&C panel in source order`);
  ok(!errs.length, `${w}: no console/page errors ${errs.join(' | ')}`);
  await page.close();
}
await browser.close();
writeFileSync(`${out}/interaction-probe-output.txt`, results.join('\n') + '\n');
console.log(results.join('\n'));
process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
