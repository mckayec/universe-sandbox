// Checkpoint 5 regression probe for TL-R01–R06 (run against `vite preview` of engine/timelines).
// BASE overrides the URL. Assertion-based: exits non-zero on the first failed check.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:4191/atlas/?pack=abrahamic-world-religions';
const out = new URL('.', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const log = [];
const errs = [];
const ok = (c, m) => { log.push((c ? 'PASS ' : 'FAIL ') + m); if (!c) throw new Error(m); };
async function page(w, h, touch) {
  const c = await b.newContext({ viewport: { width: w, height: h }, isMobile: !!touch, hasTouch: !!touch, reducedMotion: 'reduce' });
  const p = await c.newPage();
  p.setDefaultTimeout(15000);
  p.on('console', m => m.type() === 'error' && errs.push(w + ': ' + m.text()));
  p.on('pageerror', e => errs.push(w + ': ' + e.message));
  p.on('requestfailed', r => errs.push(w + ': requestfailed ' + r.url()));
  p.on('response', r => r.status() >= 400 && errs.push(w + ': HTTP ' + r.status() + ' ' + r.url()));
  await p.goto(BASE + '#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  return p;
}
const active = p => p.evaluate(() => { const a = document.activeElement; return { inDlg: !!a.closest('#timeline'), tag: a.tagName, id: a.getAttribute('data-id'), cls: a.getAttribute('class') }; });
try {
  // ---- TL-R06: phone filters ----
  let p = await page(390, 844, true);
  const f = await p.evaluate(() => { const fl = document.querySelector('#filters'); const e = document.querySelector('[data-layer="jud"]'); const r = e.getBoundingClientRect(); return { w: fl.getBoundingClientRect().width, hit: !!document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('[data-layer="jud"]') }; });
  ok(f.w > 300, 'R06 390: #filters width ' + Math.round(f.w) + 'px (was 0)');
  ok(f.hit, 'R06 390: Judaism filter button is the hit target');
  await p.locator('[data-layer="jud"]').tap();
  ok((await p.getAttribute('[data-layer="jud"]', 'aria-pressed')) === 'false', 'R06 390: tap toggles Judaism off');
  await p.locator('[data-layer="jud"]').tap();
  ok((await p.getAttribute('[data-layer="jud"]', 'aria-pressed')) === 'true', 'R06 390: tap toggles Judaism back on');
  await p.screenshot({ path: out + 'tl5-390-filters.png' });
  // timeline filtering on the phone
  await p.locator('#tlBtn').tap();
  await p.waitForSelector('#timeline:not([hidden])');
  ok((await p.locator('#timeline .tl-m').count()) === 91, 'R06 390: 91 dated marks with all layers');
  await p.locator('[data-tl="close"]').tap();
  await p.locator('[data-layer="jud"]').tap();
  await p.locator('#tlBtn').tap();
  const nm = await p.locator('#timeline .tl-m').count();
  ok(nm < 91 && nm > 0, 'R06 390: timeline re-gated after phone filter tap (' + nm + ' marks)');
  await p.locator('[data-tl="close"]').tap();
  await p.locator('[data-layer="jud"]').tap();
  await p.locator('#tlBtn').tap();
  await p.screenshot({ path: out + 'tl5-390-chart.png' });
  await p.context().close();

  // ---- desktop: R01, R02, R03, R05 ----
  p = await page(1440, 900);
  await p.click('#tlBtn');
  await p.waitForSelector('#timeline:not([hidden])');
  const undAll = await p.locator('#timeline .tl-und .tl-it').count();
  ok(undAll === 78, 'R02: 78 undated entries before collapse');
  await p.click('.tl-lt[data-lane-t="lane-jud"]');
  const undCh = await p.locator('#timeline .tl-und .tl-it').count();
  ok(undCh < 78 && (await p.locator('.tl-ux[data-lane-t="lane-jud"]').count()) === 1, 'R02 chart: collapsed lane shows an expand button for its ' + (78 - undCh) + ' undated');
  await p.click('[data-mode="list"]');
  const listIds = await p.$$eval('#timeline .tl-it', bs => bs.map(b => b.dataset.id));
  ok(listIds.length === 169 && new Set(listIds).size === 169, 'R02 list: all 169 gated records listed (91 dated + 78 undated) with Judaism collapsed in the chart');
  await p.screenshot({ path: out + 'tl5-1440-list-collapsed.png' });
  await p.click('[data-mode="chart"]');
  await p.click('.tl-ux[data-lane-t="lane-jud"]');
  ok((await p.locator('#timeline .tl-und .tl-it').count()) === 78, 'R02: expand button restores 78 undated');
  // R03 focus
  const mk = p.locator('.tl-m[data-id="n:jud-second-temple"]');
  await mk.focus(); await p.keyboard.press('Enter');
  let a = await active(p);
  ok(a.inDlg && a.id === 'n:jud-second-temple', 'R03: select keeps focus on the mark');
  await p.keyboard.press('Enter');
  a = await active(p);
  ok(a.inDlg && a.id === 'n:jud-second-temple', 'R03: deselecting the same mark keeps focus on it (was BODY)');
  await p.keyboard.press('Enter');
  await p.click('[data-tl="clear"]');
  a = await active(p);
  ok(a.inDlg && a.id === 'n:jud-second-temple', 'R03: Back to the overview returns focus to the record');
  await p.keyboard.press('Tab');
  ok((await active(p)).inDlg, 'R03: Tab after clear stays in the dialog');
  await p.keyboard.press('Shift+Tab');
  ok((await active(p)).inDlg, 'R03: Shift+Tab after clear stays in the dialog');
  // R01 evidence
  await p.click('[data-mode="list"]');
  await p.click('.tl-it[data-id="n:jud-covenant-tradition"]');
  const cov = await p.textContent('.tl-info');
  ok(/Narrative chronology/.test(cov) && /Genesis 12:1–10/.test(cov) && /Locator: Gen\. 12; Exod\. 19/.test(cov) && /Torah presents/.test(cov), 'R01: covenant tradition shows narrative chronology, blurb, note text and its locator');
  await p.click('.tl-it[data-id="n:jud-karaite"]');
  const kar = await p.textContent('.tl-info');
  ok(/Not the same as/.test(kar) && /Sadducees/.test(kar), 'R01: Karaite identity guards shown');
  await p.click('.tl-it[data-id="e:jud-e08"]');
  const see = await p.textContent('.tl-info');
  ok(!/Source: jud-seesen/.test(see) && /not a citation/.test(see) && /No citation locator in this record/.test(see) && /Israel Jacobson/.test(see), 'R01: Seesen shows event text, missing locator stated, ref only as atlas cross-reference');
  await p.screenshot({ path: out + 'tl5-1440-details.png' });
  await p.click('[data-tl-ref="jud-seesen"]');
  ok(await p.isHidden('#timeline') && await p.isVisible('#codex') && (await p.locator('#cx-jud-seesen').count()) === 1, 'R01: cross-reference opens the codex entry');
  await p.click('#cxClose').catch(() => {});
  // R03 gate refresh: focus survives a layer downgrade from the URL-free API path
  await p.click('#tlBtn');
  await p.click('[data-mode="chart"]');
  // R05: restore between two open states resets order
  await p.evaluate(() => { location.hash = 'world=earth&tl=lane-chr&tlsel=n%3Ajud-second-temple'; });
  await p.waitForTimeout(400);
  const first1 = await p.$eval('.tl-lt', b => b.dataset.laneT);
  ok(first1 === 'lane-chr', 'R05: #tl=lane-chr puts Christianity first');
  await p.evaluate(() => { location.hash = 'world=earth&tl=1'; });
  await p.waitForTimeout(400);
  const first2 = await p.$eval('.tl-lt', b => b.dataset.laneT);
  ok(first2 === 'lane-jud', 'R05: then #tl=1 restores the default order (was: Christianity stayed first)');
  const w0 = await p.$eval('.tl-svg', s => s.getAttribute('width'));
  await p.evaluate(() => { location.hash = 'world=earth&tl=1&tlt=1800,1900'; });
  await p.waitForTimeout(400);
  ok((await p.$eval('.tl-svg', s => s.getAttribute('width'))) === w0, 'R05: a stale tlt key is ignored (chart unchanged; not part of the URL contract)');
  await p.screenshot({ path: out + 'tl5-1440-chart.png' });
  await p.context().close();

  // ---- 4K and 1280 ----
  for (const [w, h] of [[3840, 2160], [1280, 800]]) {
    p = await page(w, h);
    await p.click('#tlBtn');
    await p.waitForSelector('#timeline:not([hidden])');
    await p.focus('.tl-m[data-id="n:jud-karaite"]');
    await p.keyboard.press('Enter');
    ok((await active(p)).id === 'n:jud-karaite', w + ': keyboard select keeps focus');
    ok((await p.locator('#timeline .tl-m').count()) === 91, w + ': 91 marks');
    const ov = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    ok(ov, w + ': no page sideways scroll');
    await p.screenshot({ path: out + 'tl5-' + w + '-chart.' + (w > 2000 ? 'jpg' : 'png'), ...(w > 2000 ? { type: 'jpeg', quality: 60 } : {}) });
    await p.context().close();
  }
  ok(errs.length === 0, 'no console errors, page errors, failed requests or HTTP>=400' + (errs.length ? ': ' + errs.join(' | ') : ''));
} catch (e) {
  log.push('ERROR ' + e.message);
  process.exitCode = 1;
} finally {
  writeFileSync(out + 'tl5-probe-output.txt', log.join('\n') + '\n');
  console.log(log.join('\n'));
  await b.close();
}
