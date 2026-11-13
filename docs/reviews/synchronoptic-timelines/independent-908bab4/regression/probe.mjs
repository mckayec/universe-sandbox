import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const out = new URL('.', import.meta.url).pathname,
  results = [],
  errors = [];
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const check = (name, actual, expected) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  results.push({ name, pass, actual, expected });
  console.log(name, pass, JSON.stringify(actual));
};
try {
  for (const width of [390, 1440, 3840]) {
    const c = await b.newContext({
      viewport: { width, height: width === 3840 ? 2160 : width === 390 ? 844 : 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
      reducedMotion: 'reduce',
    });
    const p = await c.newPage();
    p.setDefaultTimeout(30000);
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => {
      if (m.type() === 'error') errors.push(m.text());
    });
    p.on('requestfailed', r => errors.push(r.url()));
    p.on('response', r => {
      if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
    });
    await p.goto((process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions') + '#world=earth');
    await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
    if (width === 390) {
      check(
        'phone filter width',
        await p.locator('#filters').evaluate(e => Math.round(e.getBoundingClientRect().width)),
        370,
      );
      await p.locator('[data-layer="jud"]').tap();
      await p.locator('#tlBtn').tap();
      check('phone jud hidden', await p.locator('.tl-m[data-id^="n:jud"]').count(), 0);
      await p.keyboard.press('Escape');
      await p.waitForFunction(() => document.querySelector('#timeline').hidden);
      await p.locator('[data-layer="jud"]').tap();
    }
    await p.locator('#tlBtn').click();
    await p.locator('.tl-svg').waitFor();
    check(width + ' initial marks', await p.locator('.tl-m').count(), 91);
    await p.locator('.tl-lt').first().click();
    await p.locator('[data-mode="list"]').click();
    check(
      width + ' collapsed list IDs',
      await p.locator('.tl-it').evaluateAll(es => new Set(es.map(e => e.dataset.id)).size),
      169,
    );
    await p.locator('.tl-it[data-id="e:jud-e08"]').click();
    const text = await p.locator('.tl-info').innerText();
    check(
      width + ' Seesen wording/ref separation',
      text.includes('Israel Jacobson') &&
        text.includes('Atlas cross-reference (not a citation)') &&
        !text.includes('Source: jud-seesen') &&
        text.toLowerCase().includes('no citation locator in this record'),
      true,
    );
    await p.screenshot({ path: out + width + '-seesen.jpg', type: 'jpeg', quality: 60 });
    await p.locator('[data-tl="clear"]').click();
    check(width + ' clear focus', await p.evaluate(() => !!document.activeElement.closest('#timeline')), true);
    await p.keyboard.press('Tab');
    check(width + ' Tab after clear', await p.evaluate(() => !!document.activeElement.closest('#timeline')), true);
    await p.keyboard.press('Shift+Tab');
    check(width + ' ShiftTab after clear', await p.evaluate(() => !!document.activeElement.closest('#timeline')), true);
    await p.locator('.tl-it[data-id="n:jud-covenant-tradition"]').click();
    check(
      width + ' covenant notes',
      await p
        .locator('.tl-info')
        .evaluate(e => e.textContent.includes('Gen. 12; Exod. 19') && e.textContent.includes('Narrative chronology')),
      true,
    );
    await p.locator('.tl-it[data-id="n:jud-karaite"]').click();
    check(
      width + ' identity guards',
      await p
        .locator('.tl-info')
        .evaluate(e => e.textContent.includes('No continuous institutional ancestry from the Sadducees')),
      true,
    );
    // Real host's filter handler while modal is open; tests refresh after a selection becomes gated.
    await p.evaluate(() => document.querySelector('[data-layer="jud"]').click());
    check(
      width + ' gated selection removed',
      await p.evaluate(
        () =>
          !new URLSearchParams(location.hash.slice(1)).has('tlsel') &&
          !document.querySelector('.tl-it[data-id="n:jud-karaite"]'),
      ),
      true,
    );
    check(
      width + ' downgrade focus inside',
      await p.evaluate(() => !!document.activeElement.closest('#timeline')),
      true,
    );
    results.push({
      name: width + ' before downgrade Tab focus',
      actual: await p.evaluate(() => document.activeElement.outerHTML),
    });
    await p.keyboard.press('Tab');
    results.push({
      name: width + ' after downgrade Tab focus',
      actual: await p.evaluate(() => document.activeElement.outerHTML),
    });
    check(width + ' Tab after downgrade', await p.evaluate(() => !!document.activeElement.closest('#timeline')), true);
    await p.evaluate(() => document.querySelector('[data-layer="jud"]').click());
    await p.locator('[data-mode="chart"]').click();
    await p.locator('[data-lanes="reset"]').click();
    await p.locator('.tl-m').first().focus();
    await p.keyboard.press('Enter');
    await p.keyboard.press('Enter');
    check(width + ' deselect focus', await p.evaluate(() => !!document.activeElement.closest('#timeline')), true);
    const set = async hash =>
      p.evaluate(hash => {
        history.pushState({ atlasTimeline: true }, '', hash);
        dispatchEvent(new PopStateEvent('popstate'));
      }, hash);
    await set('#world=earth&tl=lane-chr&tlc=lane-jud&tlsel=n:ch-early-communities');
    check(width + ' reordered URL', await p.locator('.tl-lt').first().getAttribute('data-lane-t'), 'lane-chr');
    await set('#world=earth&tl=1&tlt=1800,1900');
    check(width + ' default URL', await p.locator('.tl-lt').first().getAttribute('data-lane-t'), 'lane-jud');
    check(width + ' unsupported range removed', await p.evaluate(() => !location.hash.includes('tlt=')), true);
    await p.goBack();
    check(width + ' Back open-to-open', await p.locator('.tl-lt').first().getAttribute('data-lane-t'), 'lane-chr');
    await p.goForward();
    check(width + ' Forward open-to-open', await p.locator('.tl-lt').first().getAttribute('data-lane-t'), 'lane-jud');
    await p.screenshot({ path: out + width + '-chart.jpg', type: 'jpeg', quality: 60 });
    check(
      width + ' no page overflow',
      await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
    );
    if (width === 1440) {
      const proof = await p.evaluate(() => {
        const T = AtlasTimeline,
          pack = __atlas.pack,
          m = T.adaptTree(pack);
        return {
          records: m.records.length,
          textEqual: m.records.every(
            r =>
              r.text ===
                (r.source === 'tree'
                  ? pack.tree.nodes.find(n => n.id === r.sourceId).blurb
                  : pack.events.find(n => n.id === r.sourceId).text) || null,
          ),
          notes: m.records.filter(r => r.notes.length).length,
          guards: m.records.filter(r => r.notSame.length).length,
          src: m.records.filter(r => r.src.length).length,
          fixture: T.adaptTree({
            tree: { nodes: [] },
            events: [{ id: 'later', title: 'Later', book: 5, chapter: 9, when: 1900, layers: ['x'] }],
          }).records[0].gate,
        };
      });
      results.push({ name: 'model evidence', actual: proof });
      const gate = await p.evaluate(() => {
        const T = AtlasTimeline,
          m = T.adaptTree({
            tree: { nodes: [] },
            events: [{ id: 'later', title: 'Later', book: 5, chapter: 9, when: 1900, layers: ['x'] }],
          });
        const v = T.visible(m, g => g.first <= 4);
        return {
          records: v.records.length,
          search: T.search(v, 'Later').length,
          sel: T.revalidate(v, 'e:later'),
          chapter: m.records[0].gate.chapter,
        };
      });
      check('event gate preservation', gate, { records: 0, search: 0, sel: null, chapter: 9 });
    }
    if (width === 1440) {
      await p.locator('[data-mode="list"]').click();
      await p.locator('.tl-it[data-id="e:jud-e08"]').click();
      await p.locator('[data-tl-ref="jud-seesen"]').click();
      await p.locator('#codex').waitFor();
      check(
        'Seesen codex navigation',
        await p.locator('#codex').evaluate(e => !e.hidden && e.textContent.includes('Seesen')),
        true,
      );
    }
    await c.close();
  }
  check('browser errors', errors, []);
} finally {
  writeFileSync(out + 'results.json', JSON.stringify(results, null, 2));
  await b.close();
}
