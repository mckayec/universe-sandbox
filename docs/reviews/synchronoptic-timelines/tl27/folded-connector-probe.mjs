// Checkpoint 27 probe: folded-row connectors on the real Religious Traditions pack (actual host, real clicks on
// the lane bar and the host layer chips; Chromium via Playwright). For each lane: collapse it and compare every
// rendered connector against the expanded baseline — ends in the collapsed lane must sit on that lane's summary
// row with an open ring and a "collapsed" title; other ends must keep their exact row; edges with both ends in the
// lane must be hidden and counted in the Overview note. Then a layer downgrade with a lane collapsed: no drawn
// connector may have an end or edge outside the active layers. Serve the build: pnpm preview --port 4195.
// usage: CHROME_PATH=... node docs/reviews/synchronoptic-timelines/tl27/folded-connector-probe.mjs
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const out = new URL('.', import.meta.url).pathname;
const BASE = process.env.BASE || 'http://127.0.0.1:4195/atlas/?pack=abrahamic-world-religions';
const results = [];
const errors = [];
const check = (name, pass, actual) => {
  results.push({ name, pass: !!pass, actual });
  console.log((pass ? 'PASS ' : 'FAIL ') + name + (actual === undefined ? '' : ' ' + JSON.stringify(actual)));
};
const b = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});
/* rendered connectors: id, the two nub ys (in path order: from, to), folded class, title, rings by end */
const read = p =>
  p.evaluate(() => {
    const svg = document.querySelector('#timeline .tl-svg');
    if (!svg) return null;
    const paths = [...svg.querySelectorAll('path.tl-edge')].map(e => {
      const d = e.getAttribute('d');
      const m = d.match(/^M\s*([\d.]+)\s+([\d.]+)\s+H\s*([\d.]+)\s+V\s*([\d.]+)/);
      return {
        id: e.dataset.edge,
        ya: +m[2],
        yb: +m[4],
        folded: e.classList.contains('folded'),
        title: e.querySelector('title')?.textContent || '',
      };
    });
    const rings = [...svg.querySelectorAll('circle.tl-edge-fold')].map(c => ({
      id: c.dataset.foldEdge,
      end: c.dataset.foldEnd,
      cy: +c.getAttribute('cy'),
    }));
    const rowY = id => {
      const g = svg.querySelector('.tl-m[data-id="' + CSS.escape(id) + '"]');
      if (!g) return null;
      const r = g.querySelector('rect.tl-win, rect.tl-bar, path.tl-pt').getBBox();
      return r.y + r.height / 2;
    };
    const TL = window.AtlasTimeline;
    const model = TL.adaptTree(window.ATLAS_PACKS['abrahamic-world-religions']);
    const rec = new Map(model.records.map(r => [r.id, r]));
    const edges = Object.fromEntries(
      paths.map(x => {
        const e = model.edges.find(q => q.id === x.id);
        return [
          x.id,
          {
            from: e.from,
            to: e.to,
            fromLane: rec.get(e.from).lane,
            toLane: rec.get(e.to).lane,
            fromRow: rowY(e.from),
            toRow: rowY(e.to),
            layers: [e.gate.layers || [], rec.get(e.from).gate.layers || [], rec.get(e.to).gate.layers || []],
          },
        ];
      }),
    );
    const summaries = [...svg.querySelectorAll('.tl-sum, [data-lane-sum]')].length;
    const note = document.querySelector('#timeline .tl-intro')?.textContent || '';
    return { paths, rings, edges, summaries, note };
  });
for (const [tag, vp] of [
  ['1440', { width: 1440, height: 900 }],
  ['390', { width: 390, height: 844 }],
]) {
  const p = await b.newPage({ viewport: vp });
  p.on('pageerror', e => errors.push(tag + ' ' + e.message));
  p.on('console', m => m.type() === 'error' && errors.push(tag + ' console ' + m.text()));
  await p.goto(BASE + '#world=earth');
  await p.waitForFunction(() => window.__atlas && document.querySelector('#splash.out'));
  await p.locator('#tlBtn').click();
  await p.waitForSelector('#timeline .tl-svg');
  const base = await read(p);
  check(tag + ' expanded: 9 connectors, none folded, no rings', base.paths.length === 9 && !base.paths.some(x => x.folded) && !base.rings.length, base.paths.length);
  check(
    tag + ' expanded: every end on its own row',
    base.paths.every(x => base.edges[x.id].fromRow === x.ya && base.edges[x.id].toRow === x.yb),
  );
  check(tag + ' expanded: no fold note', !/open ring|collapsed lane/.test(base.note));
  const lanes = await p.locator('#timeline .tl-lt').count();
  let foldedTotal = 0;
  let insideTotal = 0;
  for (let i = 0; i < lanes; i++) {
    const ctl = p.locator('#timeline .tl-lt').nth(i);
    const laneName = ((await ctl.textContent()) || '').trim();
    await ctl.click();
    const s = await read(p);
    if (!s) {
      check(tag + ' lane ' + i + ' collapsed: chart present', false);
      continue;
    }
    const laneId = await p.evaluate(() => new URLSearchParams(location.hash.slice(1)).get('tlc'));
    const drawn = new Map(s.paths.map(x => [x.id, x]));
    let ok = true;
    let folded = 0;
    let inside = 0;
    const bad = [];
    for (const x of base.paths) {
      const e = base.edges[x.id];
      const inA = e.fromLane === laneId;
      const inB = e.toLane === laneId;
      const d = drawn.get(x.id);
      if (inA && inB) {
        inside++;
        if (d) (ok = false), bad.push(x.id + ' drawn although inside');
        continue;
      }
      if (!d) {
        ok = false;
        bad.push(x.id + ' dropped');
        continue;
      }
      const ringA = s.rings.find(r => r.id === x.id && r.end === 'from');
      const ringB = s.rings.find(r => r.id === x.id && r.end === 'to');
      if (inA || inB) folded++;
      if (d.folded !== (inA || inB)) (ok = false), bad.push(x.id + ' folded class');
      if (!!ringA !== inA || !!ringB !== inB) (ok = false), bad.push(x.id + ' ring');
      if (ringA && ringA.cy !== d.ya) (ok = false), bad.push(x.id + ' ring y');
      if (ringB && ringB.cy !== d.yb) (ok = false), bad.push(x.id + ' ring y');
      if (!inA && d.ya !== s.edges[x.id].fromRow) (ok = false), bad.push(x.id + ' from row moved');
      if (!inB && d.yb !== s.edges[x.id].toRow) (ok = false), bad.push(x.id + ' to row moved');
      if ((inA || inB) && !/inside the collapsed .* lane; expand it for the exact row/.test(d.title))
        (ok = false), bad.push(x.id + ' title');
    }
    check(tag + ' collapse ' + laneId + ': folded ends on the summary row, other ends unchanged', ok, { laneName, folded, inside, bad });
    const wantNote = (folded ? 1 : 0) + (inside ? 1 : 0);
    const gotNote = (/open ring/.test(s.note) ? 1 : 0) + (/inside one collapsed lane/.test(s.note) ? 1 : 0);
    check(tag + ' collapse ' + laneId + ': Overview note matches', wantNote === gotNote, { folded, inside, note: s.note.slice(-220) });
    foldedTotal += folded;
    insideTotal += inside;
    // expand again through the same control
    await p.locator('#timeline .tl-lt').nth(i).click();
    const r = await read(p);
    check(
      tag + ' expand ' + laneId + ': back to the 9 row-exact connectors',
      r.paths.length === 9 && !r.rings.length && r.paths.every(x => r.edges[x.id].fromRow === x.ya && r.edges[x.id].toRow === x.yb),
    );
  }
  check(tag + ' some connector was folded across all lane collapses', foldedTotal > 0, { foldedTotal, insideTotal });
  // layer downgrade with the first lane in the bar collapsed: switch the Islam chip off with the host's own chip
  await p.locator('#timeline .tl-lt').first().click();
  const before = await read(p);
  await p.evaluate(() => document.querySelector('#filters [data-layer="isl"]').click());
  await p.waitForTimeout(150);
  const after = await read(p);
  const active = await p.evaluate(() =>
    [...document.querySelectorAll('#filters [data-layer]')].filter(x => x.getAttribute('aria-pressed') === 'true').map(x => x.dataset.layer),
  );
  const outside = (after ? after.paths : []).filter(x =>
    after.edges[x.id].layers.some(ls => ls.length && !ls.some(l => active.includes(l))),
  );
  check(tag + ' layer downgrade (isl off, lane collapsed): no drawn connector outside the active layers', after && !active.includes('isl') && outside.length === 0, {
    active,
    before: before.paths.length,
    after: after ? after.paths.length : null,
    outside: outside.map(x => x.id),
  });
  check(tag + ' layer downgrade: rings only on drawn connectors', after.rings.every(r => after.paths.some(x => x.id === r.id)));
  await p.evaluate(() => document.querySelector('#filters [data-layer="isl"]').click());
  await p.waitForTimeout(150);
  const back = await read(p);
  check(tag + ' layer restored: connector set equals pre-downgrade', JSON.stringify(back.paths.map(x => x.id).sort()) === JSON.stringify(before.paths.map(x => x.id).sort()));
  await p.screenshot({ path: out + 'tl27-' + tag + '-folded.jpg', type: 'jpeg', quality: 70 });
  await p.close();
}
await b.close();
check('no page errors', errors.length === 0, errors);
const pass = results.filter(r => r.pass).length;
console.log(pass + '/' + results.length);
writeFileSync(out + 'folded-connector-probe-output.json', JSON.stringify({ pass, total: results.length, results, errors }, null, 2));
process.exit(pass === results.length ? 0 : 1);
