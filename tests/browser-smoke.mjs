import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
});

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
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  browser = await chromium.launch({ headless: true, executablePath: existsSync(chromePath) ? chromePath : undefined });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') failures.push(`console: ${message.text()}`); });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');
  assert.equal(await page.locator('#count').textContent(), '4');

  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '0');
  assert.equal(await page.locator('#info-panel').evaluate(element => element.classList.contains('empty')), true);
  await page.getByRole('button', { name: 'Load' }).click();
  await page.waitForFunction(() => document.querySelector('#count')?.textContent === '4');

  await page.getByRole('button', { name: /Binary stars/ }).click();
  const canvas = page.locator('#viewport canvas');
  const box = await canvas.boundingBox();
  assert.ok(box);
  await page.mouse.click(box.x + box.width * .64, box.y + box.height * .55);
  await page.waitForFunction(() => Number(document.querySelector('#count')?.textContent) >= 7);
  await page.getByRole('button', { name: /Overlays/ }).click();
  assert.match(await page.locator('#science-mode').textContent(), /orbits/);
  await page.getByRole('button', { name: /Model:/ }).click();
  assert.match(await page.locator('#realism-mode').textContent(), /educational/);
  await page.getByRole('button', { name: /Effects:/ }).click();
  assert.equal(await page.locator('html').evaluate(element => element.classList.contains('gentle-effects')), true);

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
