import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// layers.js and tree.js are plain browser scripts: run them in one sandbox and read window.Atlas*.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/tree.js', import.meta.url), 'utf8'), ctx);
const L = ctx.window.AtlasLayers;
const TR = ctx.window.AtlasTree;
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const fx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('./fixtures/track-a-demo.js', import.meta.url), 'utf8'), fx);
const pack = fx.window.ATLAS_PACKS['track-a-demo'];
const LAY = L.normLayers(pack);
const TL = L.normTimeline(pack, []);
const T = TR.normTree(pack, TL, LAY);

test('the tree normalises nodes, spans and colours', () => {
  assert.equal(TR.normTree({}, null, null), null);
  assert.equal(TR.normTree({ tree: { nodes: [{ id: 'x' }] } }, null, null), null, 'a node needs a year');
  assert.equal(T.nodes.length, 7);
  assert.equal(T.min, -2000);
  assert.equal(T.max, 2000);
  // ongoing traditions run to the end of the axis; a single year is a point
  assert.deepEqual(plain(T.by.root.when), [-1800, 2000]);
  assert.deepEqual(plain(T.by.early.when), [-900, -300]);
  // colour comes from the node, else its parent
  assert.equal(T.by['middle-a'].col, '#b892e0');
  assert.equal(T.by['middle-b'].col, '#7fa8e8');
  // `also` becomes a cross-link, alongside tree.links
  assert.deepEqual(plain(T.links.map((l: any) => l.from + '>' + l.to)), ['other>middle', 'root>other']);
});

test('unknown parents and parent loops are dropped instead of hanging', () => {
  const t = TR.normTree(
    {
      tree: {
        nodes: [
          { id: 'a', name: 'A', when: 1, parent: 'b' },
          { id: 'b', name: 'B', when: 2, parent: 'a' },
          { id: 'c', name: 'C', when: 3, parent: 'nope' },
        ],
      },
    },
    null,
    null,
  );
  const V = TR.visibleTree(t, null);
  assert.equal(V.nodes.length, 3);
  assert.equal(t.by.c.parent, null);
  assert.ok(t.by.a.parent === null || t.by.b.parent === null);
});

test('branches sit directly under the tradition they came from (depth-first, oldest first)', () => {
  const V = TR.visibleTree(T, null);
  assert.deepEqual(plain(V.nodes.map((n: any) => n.id)), [
    'root',
    'early',
    'middle',
    'middle-a',
    'middle-b',
    'late',
    'other',
  ]);
  assert.deepEqual([...TR.lineage(V, 'middle-b')].sort(), ['late', 'middle', 'root']);
});

test('spoiler-hidden nodes vanish and their branches attach to the nearest visible ancestor', () => {
  const V = TR.visibleTree(T, (n: any) => n.id !== 'middle-b');
  assert.ok(!V.ids.has('middle-b'));
  assert.equal(V.parentOf.late, 'middle');
});

test('layout keeps one row per tradition and puts years on a no-year-zero axis', () => {
  const V = TR.visibleTree(T, null);
  const ppy = TR.fitScale(T, 1000, 0);
  const P = TR.layout(T, V, ppy);
  assert.equal(P.row.root, 0);
  assert.equal(P.row.other, 6);
  // 1 BC and AD 1 are one year apart
  assert.ok(Math.abs(P.x(1) - P.x(-1) - ppy) < 1e-9);
  assert.ok(Math.abs(P.w - 1000) <= 2, 'fits the requested width at zoom 0');
  assert.ok(TR.fitScale(T, 1000, 2) > ppy, 'zooming in widens the years');
  // ticks are round years and never year 0
  const ticks = TR.ticks(T, ppy);
  assert.ok(ticks.length >= 4);
  assert.ok(!ticks.includes(0));
});

test('the SVG escapes pack text, marks the selection and fades filtered nodes', () => {
  const t = TR.normTree(
    {
      tree: {
        nodes: [
          { id: 'a', name: '<b>A</b>', when: -10, ongoing: true },
          { id: 'b', name: 'B', parent: 'a', when: 5 },
        ],
      },
    },
    null,
    null,
  );
  const V = TR.visibleTree(t, null);
  const P = TR.layout(t, V, TR.fitScale(t, 800, 0));
  const svg = TR.render(t, V, P, {
    sel: 'b',
    dim: (n: any) => n.id === 'a',
    fmt: (y: number) => L.fmtYear(y, 'BC/AD'),
  });
  assert.ok(!svg.includes('<b>A</b>'));
  assert.match(svg, /data-node="b" tabindex="0" role="button" aria-pressed="true"/);
  assert.match(svg, /class="tr-n kin dim go"/);
  assert.match(svg, /class="tr-br on"/);
  assert.match(svg, /aria-label="B, AD 5"/);
});

test('the pack validator checks tree nodes, parents, places and links', async () => {
  // @ts-expect-error plain JS helper without type declarations
  const { validatePacks } = await import('./atlas-pack-validator.mjs');
  const { mkdtempSync, writeFileSync, copyFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = mkdtempSync(join(tmpdir(), 'atlas-tree-'));
  try {
    writeFileSync(join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"track-a-demo"},{id:"bad"}];');
    copyFileSync(new URL('./fixtures/track-a-demo.js', import.meta.url), join(dir, 'track-a-demo.js'));
    writeFileSync(
      join(dir, 'bad.js'),
      `(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).bad={id:"bad",meta:{title:"Bad"},books:{1:{}},layers:[{id:"a"}],
        worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},sites:[{id:"s",name:"S",lat:0,lon:0,desc:"d"}]}],
        tree:{nodes:[{id:"x",name:"X",when:0},{id:"y",name:"Y",when:5,parent:"zz",layers:["q"],world:"w",site:"nowhere"},
          {id:"p",name:"P",when:1,parent:"q2"},{id:"q2",name:"Q",when:2,parent:"p"}],links:[{from:"x",to:"gone"}]}};`,
    );
    const r = validatePacks(dir);
    assert.deepEqual(plain(r['track-a-demo.js'].issues), []);
    const bad = r['bad.js'].issues.join('\n');
    assert.match(bad, /tree node x: when uses year 0/);
    assert.match(bad, /parent -> missing node "zz"/);
    assert.match(bad, /unknown layer "q"/);
    assert.match(bad, /missing site "nowhere"/);
    assert.match(bad, /parent chain loops/);
    assert.match(bad, /tree.links\[0\]/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
