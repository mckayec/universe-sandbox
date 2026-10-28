import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// layers.js, tree-rel.js and tree.js are plain browser scripts: run them in one sandbox, in page order.
const ctx: { window: Record<string, any> } = { window: {} };
for (const f of ['layers.js', 'tree-rel.js', 'tree.js', 'tree-view.js'])
  vm.runInNewContext(readFileSync(new URL('../public/atlas/' + f, import.meta.url), 'utf8'), ctx);
const L = ctx.window.AtlasLayers;
const TR = ctx.window.AtlasTree;
const REL = ctx.window.AtlasTreeRel;
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const fx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('./fixtures/tree-typed-demo.js', import.meta.url), 'utf8'), fx);
const pack = fx.window.ATLAS_PACKS['tree-typed-demo'];
const LAY = L.normLayers(pack);
const TL = L.normTimeline(pack, []);
const T = TR.normTree(pack, TL, LAY);
const fmt = (y: number, ap?: boolean) => L.fmtYear(y, 'BC/AD', ap);

test('tree-view.js adds the DOM controller to AtlasTree', () => {
  assert.equal(typeof TR.createView, 'function');
});

test('uncertain windows, undated nodes and plain years normalise separately', () => {
  assert.equal(T.nodes.length, 9);
  // an emergence window starts at its earliest year and is solid from its latest
  assert.equal(T.by.window.from, 1501);
  assert.equal(T.by.window.sol, 1600);
  assert.equal(T.by.window.to, T.max);
  // an undated hub is drawn where its earliest dated branch begins, but carries no year for the filters
  assert.equal(T.by.hub.undated, true);
  assert.equal(T.by.hub.from, -500);
  assert.equal(T.by.hub.when, null);
  assert.ok(L.timeOk(T.by.hub, [1900, 2000]), 'the year filter never fades an undated node');
  // an undated leaf with no dated branches sits where its parent begins
  assert.equal(T.by.school.from, 40);
  const lone = TR.normTree(
    {
      tree: {
        nodes: [
          { id: 'a', name: 'A', when: 5 },
          { id: 'b', name: 'B', undated: true },
        ],
      },
    },
    null,
    null,
  );
  assert.equal(lone.by.b.from, lone.min);
  // until ends a lifespan
  assert.deepEqual(plain(T.by['org-a'].when), [1840, 2025]);
});

test('date text keeps the source wording and never invents a year', () => {
  assert.equal(REL.dateText(T.by.hub, fmt, true), 'No single founding date');
  assert.equal(REL.dateText(T.by.window, fmt, true), 'Emerged: sixteenth century – today');
  assert.equal(REL.dateText(T.by.window, fmt, false), 'Emerged sixteenth century –');
  assert.equal(REL.dateText(T.by.split, fmt, true), 'c. AD 40 – today');
  assert.equal(REL.dateText(T.by['org-a'], fmt, true), '1840 – 2025');
  const w = { ...T.by.window, whenText: '' };
  assert.equal(REL.dateText(w, fmt, false), 'Emerged 1501 – 1600 –');
});

test('typed relations: parent types, link types and unknown types fall back', () => {
  assert.equal(T.by.split.ptype, 'division');
  assert.equal(T.by.window.ptype, 'within');
  assert.equal(T.by.window.prel, 'classified-within');
  assert.equal(T.by.early.ptype, 'branch');
  assert.deepEqual(plain(T.links.map((l: any) => l.type)), ['contact', 'history', 'overlap']);
  assert.equal(T.links[0].label, 'authored-comparison');
  const t = TR.normTree(
    {
      tree: {
        nodes: [
          { id: 'a', name: 'A', when: 1, parentType: 'nonsense' },
          { id: 'b', name: 'B', when: 2, parent: 'a', parentType: 'nonsense' },
        ],
        links: [{ from: 'a', to: 'b', type: 'whatever' }],
      },
    },
    null,
    null,
  );
  assert.equal(t.by.b.ptype, 'branch');
  assert.equal(t.links[0].type, 'overlap');
  assert.deepEqual(plain(REL.used(T)), ['branch', 'within', 'division', 'merger', 'overlap', 'contact', 'history']);
});

test('a merger is drawn from every predecessor and no predecessor becomes its sole parent', () => {
  assert.equal(T.by.merged.parent, null);
  assert.deepEqual(plain(T.by.merged.merge), ['org-a', 'org-b']);
  const V = TR.visibleTree(T, null);
  assert.deepEqual(plain(V.mergeOf.merged), ['org-a', 'org-b']);
  // placed under its first predecessor for the row order
  assert.equal(V.parentOf.merged, 'org-a');
  // the lineage runs through both predecessors
  const kin = TR.lineage(V, 'merged');
  assert.ok(kin.has('org-a') && kin.has('org-b') && kin.has('split') && kin.has('hub'));
  assert.ok(TR.lineage(V, 'org-b').has('merged'));
  const P = TR.layout(T, V, TR.fitScale(T, 1200, 0));
  const svg = TR.render(T, V, P, { fmt });
  assert.equal((svg.match(/class="tr-br f-merger/g) || []).length, 2);
  // the details list both, as one "Formed by merging" group
  const ties = REL.ties(T, V, 'merged');
  assert.deepEqual(plain(ties.map((x: any) => x.fam + ':' + x.n.id)), ['merger:org-a', 'merger:org-b']);
  // and each predecessor lists the merged body, not as an ordinary branch
  assert.deepEqual(plain(REL.ties(T, V, 'org-b').map((x: any) => x.fam + ':' + x.dir + ':' + x.n.id)), [
    'branch:up:split',
    'merger:down:merged',
  ]);
  // hiding a predecessor reattaches the merge to its nearest visible ancestor
  const V2 = TR.visibleTree(T, (n: any) => n.id !== 'org-b');
  assert.deepEqual(plain(V2.mergeOf.merged), ['org-a', 'split']);
});

test('merge loops are dropped instead of hanging', () => {
  const t = TR.normTree(
    {
      tree: {
        nodes: [
          { id: 'a', name: 'A', when: 1, merge: ['b', 'c'] },
          { id: 'b', name: 'B', when: 2, merge: ['a', 'c'] },
          { id: 'c', name: 'C', when: 3 },
        ],
      },
    },
    null,
    null,
  );
  const V = TR.visibleTree(t, null);
  assert.equal(V.nodes.length, 3);
  assert.ok(!(t.by.a.merge.includes('b') && t.by.b.merge.includes('a')));
});

test('the chart draws ramps, undated marks, division cuts and typed link strokes', () => {
  const V = TR.visibleTree(T, null);
  const P = TR.layout(T, V, TR.fitScale(T, 1200, 0));
  const svg = TR.render(T, V, P, { fmt, sel: 'window' });
  assert.match(svg, /<linearGradient id="trRamp">/);
  assert.match(svg, /data-node="window"[^>]*aria-label="Windowed stream, Emerged sixteenth century –"/);
  assert.match(svg, /<rect class="tr-ramp"/);
  assert.match(
    svg,
    /class="tr-n kin go und"[^>]*data-node="hub"[^>]*aria-label="Hub tradition, No single founding date"/,
  );
  assert.match(svg, /<circle class="tr-dot und"/);
  assert.match(svg, /class="tr-cut"/);
  assert.match(svg, /class="tr-br f-within/);
  assert.match(svg, /class="tr-link f-contact on"/);
  assert.match(svg, /class="tr-link f-history fade"/);
  assert.match(svg, /<title>Hub tradition → Windowed stream: classified-within<\/title>/);
  // no year is printed for an undated node
  assert.ok(!/aria-label="Hub tradition, [^"]*\d/.test(svg));
});

test('the relationship outline lists every node with its typed ties and escapes text', () => {
  const V = TR.visibleTree(T, null);
  const html = REL.outline(T, V, { fmt, sel: 'split', dim: (n: any) => n.id === 'other' });
  for (const n of T.nodes) assert.ok(html.includes('data-go="' + n.id + '"'), n.id + ' is in the outline');
  assert.match(html, /class="tr-oi sel" data-go="split" aria-pressed="true"/);
  assert.match(html, /class="tr-oi dim" data-go="other"/);
  // the branch holding the picked node is open; others below the top level stay closed
  assert.match(html, /<details open><summary><button class="tr-oi" data-go="early"/);
  assert.match(REL.outline(T, V, { fmt }), /<details><summary><button class="tr-oi" data-go="early"/);
  assert.match(html, /<em>school<\/em>/);
  assert.match(html, /Contact: Neighbouring tradition <i>\(authored-comparison\)<\/i>/);
  assert.match(html, /Formed by merging: Organisation A/);
  // children are nested under their placement parent, and the parent tie is not repeated
  assert.match(html, /data-go="split"[\s\S]*<ul><li>[\s\S]*data-go="org-a"/);
  // a typed parent tie is spelled out under the nested item; a plain branch is shown by the nesting alone
  const win = html.split('data-go="window"')[1].split('</li>')[0];
  assert.match(win, /Within: Hub tradition <i>\(classified-within\)<\/i>/);
  assert.ok(!/Developed from/.test(html.split('data-go="early"')[1].split('</summary>')[0]));
  const bad = TR.normTree(
    { tree: { nodes: [{ id: 'x', name: '<img src=x>', undated: true, kind: '<b>' }] } },
    null,
    null,
  );
  const out = REL.outline(bad, TR.visibleTree(bad, null), { fmt });
  assert.ok(!out.includes('<img') && out.includes('&lt;img src=x&gt;') && out.includes('<em>&lt;b&gt;</em>'));
});

test('the legend lists only the families and date marks the pack uses', () => {
  const lg = REL.legend(T);
  assert.match(lg, /Succession or division/);
  assert.match(lg, /Merger/);
  assert.match(lg, /Emerged over a period/);
  assert.match(lg, /No single founding date/);
  assert.ok(!/Historical context/.test(lg));
  const t = TR.normTree({ tree: { nodes: [{ id: 'a', name: 'A', when: 1 }] } }, null, null);
  assert.equal(REL.legend(t), '');
});

test('the validator checks emergence windows, undated nodes, merges, types and notSame', async () => {
  // @ts-expect-error plain JS helper without type declarations
  const { validatePacks } = await import('./atlas-pack-validator.mjs');
  const { mkdtempSync, writeFileSync, copyFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = mkdtempSync(join(tmpdir(), 'atlas-tree-rel-'));
  try {
    writeFileSync(join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"tree-typed-demo"},{id:"bad"}];');
    copyFileSync(new URL('./fixtures/tree-typed-demo.js', import.meta.url), join(dir, 'tree-typed-demo.js'));
    writeFileSync(
      join(dir, 'bad.js'),
      `(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).bad={id:"bad",meta:{title:"Bad"},books:{1:{}},
        worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},sites:[{id:"s",name:"S",lat:1,lon:1,desc:"d"}]}],
        tree:{view:"sideways",nodes:[{id:"a",name:"A",when:5,emerge:[1,2]},{id:"b",name:"B",emerge:[1600,1500]},
          {id:"c",name:"C",undated:true,until:3},{id:"d",name:"D",when:9,parent:"a",parentType:"cousin"},
          {id:"e",name:"E",when:9,merge:["a","ghost"],notSame:[{id:"nope",t:"x"},{}]},
          {id:"f",name:"F",when:9,merge:["g","a"]},{id:"g",name:"G",when:9,merge:["f","a"]}],
          links:[{from:"a",to:"d",type:"rumour"}]}};`,
    );
    const r = validatePacks(dir);
    assert.deepEqual(plain(r['tree-typed-demo.js'].issues), []);
    const bad = r['bad.js'].issues.join('\n');
    assert.match(bad, /tree node a: use one of when, emerge or undated/);
    assert.match(bad, /tree node b: emerge must be \[earliest, latest\]/);
    assert.match(bad, /tree node c: an undated node cannot have until/);
    assert.match(bad, /tree node d: parentType "cousin"/);
    assert.match(bad, /tree node e: merge -> missing node "ghost"/);
    assert.match(bad, /tree node e: notSame\[0\] -> missing node "nope"/);
    assert.match(bad, /tree node e: notSame\[1\] needs t/);
    assert.match(bad, /tree node f: merge chain loops/);
    assert.match(bad, /tree.links\[0\]: type "rumour"/);
    assert.match(bad, /tree.view must be/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
