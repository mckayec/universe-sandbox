// Item 7a SC7-C1/C2 rendered evidence (extends evidence-harness-7a.mjs): black-hole model-unit label, Scale row and real-size reference block.
// Usage (from a checkout of the PR head after `pnpm build`):
//   [CHROME_PATH=...] node docs/reviews/simulator-clarity/evidence-harness-7a2.mjs [outDir]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const outDir = process.argv[2] || mkdtempSync(join(tmpdir(), 'sc7a2-'));
const port = 4188;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failed = 0;
const check = (tag, name, pass, detail) => {
  if (!pass) failed++;
  console.log(JSON.stringify({ tag, check: name, pass, detail }));
};
async function waitForServer() {
  for (let i = 0; i < 300; i++) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await sleep(200);
  }
  throw new Error('preview server not ready');
}
async function openTools(page) {
  const t = page.locator('#panel-toggle');
  if ((await t.isVisible()) && (await t.getAttribute('aria-expanded')) === 'false') await t.click();
}
async function closeTools(page) {
  const t = page.locator('#panel-toggle');
  if ((await t.isVisible()) && (await t.getAttribute('aria-expanded')) === 'true') await t.click();
}
async function run(browser, viewport) {
  const tag = `${viewport.width}x${viewport.height}`;
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) > 0);
  await openTools(page);
  await page.locator('#clear').click();
  await page.locator('#pause').click();
  await page.locator('[data-choice="blackhole"]').click();
  await closeTools(page);
  await page.mouse.click(viewport.width * 0.5, viewport.height * 0.4);
  await sleep(1200);
  const count = await page.locator('#count').textContent();
  check(tag, 'black hole placed by UI', count === '1', count);
  const mass = await page.locator('#info-mass').textContent();
  check(tag, 'mass reads model units, not M⊕/M☉', /model units$/.test(mass) && !/M⊕|M☉/.test(mass), mass);
  const labels = await page.evaluate(() =>
    [...document.querySelectorAll('span')].map(e => e.textContent).filter(t => /· Ø/.test(t ?? '')),
  );
  check(tag, 'canvas label metrics use model units', labels.length > 0 && labels.every(t => /model units · Ø/.test(t)), labels);
  const compact = await page.locator('#info-expand').isVisible();
  if (compact) {
    check(tag, 'collapsed sheet hides reference block', !(await page.locator('#bh-scales').isVisible()), '');
    await page.locator('#info-expand').click();
    await sleep(300);
  }
  check(tag, 'scale row visible', await page.locator('#scale-row').isVisible(), await page.locator('#info-scale').textContent());
  const details = page.locator('#bh-scales');
  check(tag, 'reference block visible', await details.isVisible(), '');
  await details.locator('summary').click();
  await sleep(300);
  check(tag, 'reference block opens', await details.evaluate(d => d.open), '');
  const items = await details.locator('li').allTextContents();
  check(tag, 'five preset rows', items.length === 5, items);
  check(tag, 'Sgr A* and M87* examples', items.some(t => /Sagittarius A\*/.test(t)) && items.some(t => /M87\*/.test(t)), '');
  // SC7-C1: each displayed example carries its source link and qualification through the actual markup path.
  const rowInfo = await details.locator('li').evaluateAll(lis =>
    lis.map(li => {
      const a = li.querySelector('a');
      return {
        text: li.textContent,
        href: a?.getAttribute('href') ?? '',
        name: a?.textContent ?? '',
        note: li.querySelector('small i')?.textContent ?? '',
        rel: a?.getAttribute('rel') ?? '',
        overflow: li.scrollWidth > li.clientWidth + 1,
      };
    }),
  );
  check(tag, 'C1: 5/5 rows have https source link', rowInfo.every(r => /^https:\/\//.test(r.href) && r.rel.includes('noopener')), rowInfo.map(r => [r.name, r.href]));
  check(tag, 'C1: 5/5 rows have visible qualification', rowInfo.every(r => r.note.length > 10), rowInfo.map(r => r.note));
  const gw = rowInfo.find(r => r.name === 'GW190521 remnant');
  check(tag, 'C1: GW190521 keeps 2020 quasi-circular median/90% +28/−16', !!gw && /2020 quasi-circular/.test(gw.note) && /source-frame median/.test(gw.note) && /\+28\/−16 M☉/.test(gw.note), gw?.note);
  const gaia = rowInfo.find(r => r.name === 'Gaia BH3');
  check(tag, 'C1: Gaia BH3 dormant context distinct from illustrative disk', !!gaia && /dormant, no bright disk/.test(gaia.note) && /illustrative disk/.test(gaia.note), gaia?.note);
  check(tag, 'C2: 5/5 rows say horizon radius and shadow radius', rowInfo.every(r => /horizon radius .+ · shadow radius /.test(r.text)), rowInfo.map(r => r.text));
  const note = await details.locator('p').textContent();
  check(tag, 'C2: caveat says radii, not diameters/image/gas/on-screen sizes', /Radii, not diameters/.test(note) && /not measured image sizes, gas extents or on-screen sizes/.test(note), note);
  check(tag, 'no row overflows horizontally', rowInfo.every(r => !r.overflow), rowInfo.map(r => r.overflow));
  // Keyboard: summary toggles with Enter, Tab reaches the first source link.
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await sleep(150);
  check(tag, 'keyboard: Enter on summary collapses', !(await details.evaluate(d => d.open)), '');
  await page.keyboard.press('Enter');
  await sleep(150);
  check(tag, 'keyboard: Enter on summary expands', await details.evaluate(d => d.open), '');
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent, inBlock: !!document.activeElement?.closest('#bh-scales') }));
  check(tag, 'keyboard: Tab reaches first source link', focused.tag === 'A' && focused.inBlock, focused);
  // Caveat reachable inside the (possibly scrolling) panel.
  await details.locator('p').scrollIntoViewIfNeeded();
  const reach = await page.evaluate(() => {
    const p = document.querySelector('#bh-scales p').getBoundingClientRect();
    const panel = document.querySelector('#info-panel').getBoundingClientRect();
    return { pTop: p.top, pBottom: p.bottom, panelTop: panel.top, panelBottom: panel.bottom, vh: innerHeight };
  });
  check(tag, 'caveat scrolls into view within panel', reach.pTop >= reach.panelTop - 1 && reach.pTop < Math.min(reach.panelBottom, reach.vh), reach);
  const box = await page.locator('#info-panel').boundingBox();
  check(tag, 'panel within viewport width', box && box.x >= 0 && box.x + box.width <= viewport.width + 0.5, box);
  await page.screenshot({ path: join(outDir, `sc7a2-${tag}.png`) });
  // Switching the selection to a non-black-hole hides both again.
  if (await page.locator('#info-close').isVisible()) await page.locator('#info-close').click();
  await openTools(page);
  await page.locator('[data-choice="rocky"]').click();
  await closeTools(page);
  await page.mouse.click(viewport.width * 0.3, viewport.height * 0.2);
  await sleep(800);
  check(tag, 'second object placed', (await page.locator('#count').textContent()) === '2', await page.locator('#count').textContent());
  const kind = await page.locator('#info-type').textContent();
  const hidden = !(await page.locator('#scale-row').isVisible()) && !(await details.isVisible());
  check(tag, 'non-black-hole selection hides scale row and block', hidden, kind);
  check(tag, 'non-black-hole keeps M⊕', /M⊕$/.test(await page.locator('#info-mass').textContent()), '');
  check(tag, 'no page/console errors', errors.length === 0, errors);
  await page.close();
}
try {
  await waitForServer();
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
  });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) await run(browser, viewport);
  await browser.close();
} finally {
  server.kill();
}
console.log(JSON.stringify({ summary: true, failed }));
process.exit(failed ? 1 : 0);
