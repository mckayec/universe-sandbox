// Isolated production DOM/model modules, no engine/WebGL. Complements the full-app probe.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
const p = await b.newPage();
p.setDefaultTimeout(10000);
const out = [];
const log = async (name, fn) => {
  const actual = await p.evaluate(fn);
  out.push({ name, actual });
  console.log(name, JSON.stringify(actual));
};
try {
  await p.setContent(
    '<button id="opener">Timeline</button><div id="timeline" hidden></div><button id="outside">Outside</button><style>#timeline{position:fixed;inset:0;background:white}.tl-scroll{width:800px;height:400px;overflow:auto}.tl-info{height:200px;overflow:auto}</style>',
  );
  for (const file of [
    'packs/abrahamic-world-religions/judaism.js',
    'packs/abrahamic-world-religions/christianity.js',
    'packs/abrahamic-world-religions/islam.js',
    'packs/abrahamic-world-religions/encounters.js',
    'packs/abrahamic-world-religions.js',
    'timeline.js',
    'timeline-view.js',
  ])
    await p.addScriptTag({ path: 'public/atlas/' + file });
  await p.evaluate(() => {
    window.allowed = true;
    window.view = AtlasTimelineView.createView({
      el: document.querySelector('#timeline'),
      pack: ATLAS_PACKS['abrahamic-world-religions'],
      axis: ATLAS_PACKS['abrahamic-world-religions'].timeline,
      ok: g => allowed || !g.layers.includes('jud'),
    });
    document.querySelector('#opener').focus();
    view.show();
  });
  await p.locator('.tl-m').first().focus();
  await p.keyboard.press('Enter');
  await p.keyboard.press('Enter');
  await log('deselect focus', () => ({
    tag: document.activeElement.tagName,
    inside: !!document.activeElement.closest('#timeline'),
  }));
  await p.locator('.tl-m').first().focus();
  await p.keyboard.press('Enter');
  await p.locator('[data-tl="clear"]').focus();
  await p.keyboard.press('Enter');
  await log('overview focus', () => ({
    tag: document.activeElement.tagName,
    inside: !!document.activeElement.closest('#timeline'),
  }));
  await p.keyboard.press('Tab');
  await log('Tab after overview', () => ({
    id: document.activeElement.id,
    inside: !!document.activeElement.closest('#timeline'),
  }));
  await p.evaluate(() => view.show('n:jud-karaite'));
  await log('before downgrade', () => ({ sel: view.sel, count: document.querySelectorAll('.tl-m').length }));
  await p.evaluate(() => {
    allowed = false;
    view.refresh();
  });
  await log('after downgrade', () => ({
    sel: view.sel,
    count: document.querySelectorAll('.tl-m').length,
    focus: document.activeElement.tagName,
    containsKaraite: document.querySelector('#timeline').textContent.includes('Karaite'),
  }));
  await p.evaluate(() => {
    allowed = true;
    view.restore('#tl=lane-chr');
  });
  await log('reordered restore', () => document.querySelector('.tl-lt').dataset.laneT);
  await p.evaluate(() => view.restore('#tl=1'));
  await log('default restore after reorder', () => document.querySelector('.tl-lt').dataset.laneT);
  await p.evaluate(() => view.show('e:jud-e08'));
  await log('Seesen provenance', () => ({
    text: document.querySelector('.tl-info').textContent,
    links: document.querySelectorAll('.tl-info a').length,
  }));
  await p.evaluate(() => view.show('n:jud-covenant-tradition'));
  await log('covenant chronology', () => document.querySelector('.tl-info').textContent);
  const before = await p.locator('.tl-svg').getAttribute('width');
  await p.evaluate(() => view.restore('#tl=1&tlt=1800,1900'));
  await log('range restore', () => ({
    width: document.querySelector('.tl-svg').getAttribute('width'),
    ticks: [...document.querySelectorAll('.tl-tick-t')].map(e => e.textContent),
  }));
  console.log('beforeRangeWidth', before);
} finally {
  writeFileSync(new URL('dom-results.json', import.meta.url), JSON.stringify(out, null, 2));
  await b.close();
}
