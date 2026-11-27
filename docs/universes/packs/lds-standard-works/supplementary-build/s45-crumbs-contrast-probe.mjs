// Checkpoint 45 probe (S43-V1): breadcrumb (#crumbs) readability over bright terrain.
// For every engine pack at 1440x900 and 390x844 it reads the computed colours of the crumb surface and of each
// crumb item, composites the translucent surface over worst-case backdrops (pure white and pure black), and
// reports WCAG contrast ratios. Asserts >= 4.5:1 for every crumb label (links and current item) and >= 3:1 for
// the separators and the keyboard focus outline. In the LDS pack it also selects Jerusalem, Tabs to the first
// crumb, checks the focus ring, and saves a crop of the crumb strip.
// Usage (repo root, after `pnpm build`): node docs/universes/packs/lds-standard-works/supplementary-build/s45-crumbs-contrast-probe.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = Number(process.env.PORT || 4185);
const origin = `http://127.0.0.1:${port}`;
const outDir = new URL('../shots/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
const packs = ['sun-eater', 'hyperion', 'expanse', 'foundation', 'dune', 'cosmere', 'lds-standard-works'];
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { stdio: 'ignore' },
);
for (let i = 0; i < 300; i++) {
  try {
    if ((await fetch(`${origin}/atlas/`)).ok) break;
  } catch {}
  await new Promise(r => setTimeout(r, 200));
}
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : undefined,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'],
});

const parse = c => {
  const m = c.match(/rgba?\(([^)]+)\)/);
  const [r, g, b, a = '1'] = m[1].split(',').map(s => s.trim());
  return [+r, +g, +b, +a];
};
const over = (fg, bg) => [0, 1, 2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3]));
const lum = c =>
  c
    .map(v => v / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

let fails = 0;
const minOf = {};
try {
  for (const vp of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    for (const pack of packs) {
      const tab = await browser.newPage({ viewport: vp });
      const errors = [];
      tab.on('pageerror', e => errors.push(String(e)));
      await tab.goto(`${origin}/atlas/?pack=${pack}`, { waitUntil: 'domcontentloaded' });
      await tab.locator('#app .top').waitFor({ state: 'visible', timeout: 300000 });
      await tab.waitForFunction(() => !document.querySelector('#splash') || document.querySelector('#splash.out'), null, {
        timeout: 300000,
      });
      if (pack === 'lds-standard-works') {
        await tab.waitForSelector('#dossier button.place[data-site]', { timeout: 300000 });
        await tab.evaluate(() => {
          const b = [...document.querySelectorAll('#dossier button.place[data-site]')].find(e =>
            /Jerusalem/.test(e.textContent || ''),
          );
          if (b && !b.classList.contains('sel')) b.click();
        });
        await tab.waitForTimeout(3000);
      } else await tab.waitForTimeout(1200);
      const d = await tab.evaluate(() => {
        const c = document.querySelector('#crumbs');
        const cs = getComputedStyle(c);
        return {
          visible: cs.display !== 'none' && c.getBoundingClientRect().width > 0,
          surface: cs.backgroundColor,
          items: [...c.children].map(e => ({
            kind: e.tagName === 'I' ? 'sep' : e.classList.contains('here') ? 'here' : 'link',
            text: e.textContent,
            color: getComputedStyle(e).color,
            opacity: +getComputedStyle(e).opacity,
          })),
        };
      });
      const surf = parse(d.surface);
      const rows = [];
      for (const backdrop of [
        [255, 255, 255],
        [0, 0, 0],
      ]) {
        const bg = over(surf, backdrop);
        for (const it of d.items) {
          const fgc = parse(it.color);
          const fg = over([fgc[0], fgc[1], fgc[2], fgc[3] * it.opacity], bg);
          const r = ratio(fg, bg);
          const need = it.kind === 'sep' ? 3 : 4.5;
          const key = `${it.kind}`;
          minOf[key] = Math.min(minOf[key] ?? 99, r);
          if (r < need) {
            fails++;
            rows.push(`FAIL ${it.kind} "${it.text}" ${r.toFixed(2)} over ${backdrop[0] ? 'white' : 'black'}`);
          }
        }
      }
      const worst = Math.min(
        ...d.items
          .filter(i => i.kind !== 'sep')
          .map(it => {
            const fgc = parse(it.color);
            const bg = over(surf, [255, 255, 255]);
            return ratio(over([fgc[0], fgc[1], fgc[2], fgc[3] * it.opacity], bg), bg);
          }),
      );
      let focus = '';
      if (pack === 'lds-standard-works') {
        const f = await tab.evaluate(() => {
          const b = document.querySelector('#crumbs button');
          b.focus({ focusVisible: true });
          const s = getComputedStyle(b);
          return { active: document.activeElement === b, outline: s.outlineColor, style: s.outlineStyle, w: s.outlineWidth };
        });
        const bg = over(surf, [255, 255, 255]);
        const fr = ratio(over(parse(f.outline), bg), bg);
        if (!(f.active && f.style !== 'none' && fr >= 3)) fails++;
        focus = ` focus=${f.active} ${f.style} ${f.w} ring ${fr.toFixed(2)}:1`;
        await tab.evaluate(() => document.activeElement && document.activeElement.blur());
        const box = await tab.locator('#crumbs').boundingBox();
        await tab.screenshot({
          path: `${outDir}s45-crumbs-${vp.width}.png`,
          clip: {
            x: Math.max(0, box.x - 40),
            y: Math.max(0, box.y - 40),
            width: Math.min(vp.width - Math.max(0, box.x - 40), box.width + 80),
            height: box.height + 80,
          },
        });
      }
      if (errors.length) fails++;
      console.log(
        `${vp.width}x${vp.height} ${pack} visible=${d.visible} surface=${d.surface} items=${d.items.length} worst-label-over-white=${worst.toFixed(2)}:1${focus} errors=${errors.length}`,
      );
      rows.forEach(r => console.log('  ' + r));
      await tab.close();
    }
  }
  console.log('min ratios by kind (both backdrops, all packs, both viewports):', JSON.stringify(Object.fromEntries(Object.entries(minOf).map(([k, v]) => [k, +v.toFixed(2)]))));
  assert.equal(fails, 0, `${fails} contrast/focus/error failures`);
  console.log('PASS');
} finally {
  await browser.close();
  server.kill();
}
