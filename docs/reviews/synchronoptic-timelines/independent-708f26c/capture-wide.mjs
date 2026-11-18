// Small JPEG evidence captures; the full interaction observations are wide-results.json.
import { chromium } from 'playwright';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const p = await b.newPage({ viewport: { width: 3840, height: 2160 }, reducedMotion: 'reduce' });
  p.setDefaultTimeout(30000);
  await p.goto(
    (process.env.BASE || 'http://127.0.0.1:4191/atlas/?pack=abrahamic-world-religions') + '#world=earth&tl=1',
  );
  await p.locator('.tl-svg').waitFor();
  await p.waitForFunction(() => document.querySelector('#splash.out'));
  await p.screenshot({ path: new URL('3840-chart.jpg', import.meta.url).pathname, type: 'jpeg', quality: 60 });
  await p.locator('.tl-lt').first().click();
  await p.locator('[data-mode="list"]').click();
  await p.screenshot({ path: new URL('3840-list-collapsed.jpg', import.meta.url).pathname, type: 'jpeg', quality: 60 });
} finally {
  await b.close();
}
