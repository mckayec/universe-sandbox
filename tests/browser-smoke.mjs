import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)],
  {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 450; attempt++) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('Preview server did not become ready');
}

let browser;
try {
  await waitForServer();
  // Prefer an explicit browser (CHROME_PATH), then local Chrome on macOS, then Playwright's bundled Chromium.
  const chromePath = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(
    candidate => candidate && existsSync(candidate),
  );
  browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });
  // the sandbox must not contact any other host (fonts, CDNs, analytics)
  page.on('request', request => {
    const url = request.url();
    if (!url.startsWith(baseURL) && !/^(data|blob):/.test(url)) failures.push(`third-party request: ${url}`);
  });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  assert.equal(await page.locator('#count').textContent(), '4');
  assert.equal(await page.locator('#habitability-mode').textContent(), 'Life zones: off');
  assert.equal(await page.locator('#trail-mode').textContent(), 'Trails: off');
  await page.getByRole('button', { name: 'Universes' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Choose a universe' }).isVisible(), true);
  // Atlas packs (e.g. Cosmere) open their own page, so only check that the card is offered as an atlas.
  assert.match(await page.locator('[data-universe="cosmere"]').textContent(), /OPEN ATLAS/);
  // planned packs must not claim a licence we do not have
  assert.doesNotMatch(await page.locator('[data-universe="star-wars"]').textContent(), /licensed/i);
  // Packs still awaiting source material show the details panel instead.
  await page.locator('[data-universe="star-wars"]').click();
  assert.equal(await page.locator('#pack-details').isVisible(), true);
  assert.match(await page.locator('#pack-source').textContent(), /authorized source files/i);
  await page.getByRole('button', { name: 'Close universe library' }).click();
  await page.getByRole('button', { name: 'Exhibits' }).click();
  assert.equal(await page.getByRole('button', { name: /Witness a Supernova/ }).isVisible(), true);
  assert.equal(await page.getByRole('button', { name: /Tidal Disruption Lab/ }).isVisible(), true);
  await page.getByRole('button', { name: /The Fall of Gododdin/ }).click();
  // The sun, Gododdin, its fleet and the Demiurge.
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) >= 18);
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Exhibits' }).click();
  await page.getByRole('button', { name: 'Close guided exhibits' }).click();
  await page.getByRole('button', { name: /Life zones:/ }).click();
  assert.equal(await page.locator('#habitability-mode').textContent(), 'Life zones: placement');
  await page.getByRole('button', { name: /Trails:/ }).click();
  assert.equal(await page.locator('#trail-mode').textContent(), 'Trails: fading');
  await page.getByRole('button', { name: /Navigate/ }).click();
  assert.equal(await page.locator('#viewport').evaluate(element => element.classList.contains('navigating')), true);
  assert.equal(await page.locator('#navigation-help').isVisible(), true);
  await page.getByRole('button', { name: /Inspect/ }).click();
  assert.equal(await page.locator('#navigation-help').isHidden(), true);

  await page.getByRole('button', { name: 'Save' }).click();
  const savedCount = await page.locator('#count').textContent();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '0');
  assert.equal(await page.locator('#info-panel').evaluate(element => element.classList.contains('empty')), true);
  await page.getByRole('button', { name: 'Load' }).click();
  await page.waitForFunction(count => document.querySelector('#count')?.textContent === count, savedCount);

  await page.getByRole('button', { name: /Binary stars/ }).click();
  const canvas = page.locator('#viewport canvas');
  const box = await canvas.boundingBox();
  assert.ok(box);
  await page.mouse.click(box.x + box.width * 0.64, box.y + box.height * 0.55);
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) >= 7);
  await page.getByRole('button', { name: /Overlays/ }).click();
  assert.match(await page.locator('#science-mode').textContent(), /orbits/);
  await page.getByRole('button', { name: /Model:/ }).click();
  assert.match(await page.locator('#realism-mode').textContent(), /educational/);
  await page.getByRole('button', { name: /Effects:/ }).click();
  assert.equal(await page.locator('html').evaluate(element => element.classList.contains('gentle-effects')), true);

  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: /Our Solar System/ }).click();
  await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.56);
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '11');
  assert.match(await page.locator('#group-select').textContent(), /Solar System/);

  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: /Triple stars/ }).click();
  await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.56);
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '3');
  assert.match(await page.locator('#group-select').textContent(), /Triple System/);

  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: /Spiral galaxy/ }).click();
  await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.56);
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) >= 12);
  assert.match(await page.locator('#group-select').textContent(), /Spiral Galaxy/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  assert.equal(await page.locator('.tool-panel').isVisible(), true);
  assert.equal(await page.locator('#zoom-in').isVisible(), true);
  assert.deepEqual(failures, []);
  console.log('Browser smoke test passed: desktop construction, persistence, controls, and mobile layout.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
