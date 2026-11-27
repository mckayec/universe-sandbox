// Checkpoint 44 probe (S42 observation 2): identify the spaced-capitals "JERUSALEM" text seen near the top of the
// finished 1440x900 capture. Selects Jerusalem through its side-list control, then reports the element at that
// point, its #crumbs ancestry, text, rect and computed colours. Read-only; no data or layout change.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s44-crumbs-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4184);
const origin = `http://127.0.0.1:${port}`;
const page0 = `${origin}/atlas/?pack=lds-standard-works`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(page0)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});
let code = 0;
try {
  for (const vp of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    const tab = await browser.newPage({ viewport: vp });
    await tab.goto(page0, { waitUntil: 'domcontentloaded' });
    await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
    await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
      timeout: 300000,
    });
    // the pack opens on Earth; choose Jerusalem from the dossier places list (a DOM click: a Playwright pointer click
    // waits on SwiftShader frames for minutes under this scene)
    await tab.waitForSelector('#dossier button.place[data-site]', { timeout: 300000 });
    const clicked = await tab.evaluate(() => {
      const b = [...document.querySelectorAll('#dossier button.place[data-site]')].find(e =>
        /^Jerusalem/.test(e.querySelector('.pn')?.firstChild?.nextSibling?.textContent || e.textContent || ''),
      );
      // clicking an already-selected place deselects it (engine.js), so click only when it is not selected
      if (b && !b.classList.contains('sel')) b.click();
      return b ? b.dataset.site : null;
    });
    assert.ok(clicked, 'Jerusalem place control found');
    await tab.waitForTimeout(3500);
    const r = await tab.evaluate(() => {
      const c = document.querySelector('#crumbs');
      const here = c && c.querySelector('.here');
      const rect = e => {
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)];
      };
      const hb = here && here.getBoundingClientRect();
      const hit = hb ? document.elementFromPoint(hb.x + hb.width / 2, hb.y + hb.height / 2) : null;
      return {
        crumbs: c
          ? [...c.children].map(
              e => e.tagName.toLowerCase() + (e.className ? '.' + e.className : '') + ':' + e.textContent,
            )
          : null,
        hereText: here && here.textContent,
        hereRect: rect(here),
        hereColor: here && getComputedStyle(here).color,
        hereTransform: here && getComputedStyle(here).textTransform,
        crumbsRect: rect(c),
        crumbsAria: c && c.getAttribute('aria-label'),
        hitIsCrumbs: !!(hit && hit.closest('#crumbs')),
        siteLabels: [...document.querySelectorAll('#labels *')]
          .filter(e => /^Jerusalem$/.test(e.textContent || ''))
          .map(rect),
      };
    });
    console.log(vp.width + 'x' + vp.height, JSON.stringify(r));
    assert.equal(r.hereText, 'Jerusalem');
    assert.equal(r.hereTransform, 'uppercase');
    assert.ok(r.hitIsCrumbs, 'element at the crumb point is inside #crumbs');
    await tab.screenshot({ path: `${process.env.SHOTS || '.'}/s44-crumbs-${vp.width}.png` });
    await tab.close();
  }
  console.log('PASS');
} catch (e) {
  console.error('FAIL', e);
  code = 1;
} finally {
  await browser.close();
  server.kill();
}
process.exit(code);
