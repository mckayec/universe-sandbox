import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Synchronoptic timeline model (public/atlas/timeline.js), checked record by record against the
// Religious Traditions pack (docs/reviews/synchronoptic-timelines/proposal.md, parallel-handoff-review.md).
const ctx: { window: Record<string, any>; URLSearchParams: typeof URLSearchParams } = { window: {}, URLSearchParams };
ctx.window.window = ctx.window;
vm.createContext(ctx);
const run = (p: string) => vm.runInContext(readFileSync(new URL(p, import.meta.url), 'utf8'), ctx);
for (const part of ['judaism', 'christianity', 'islam', 'encounters'])
  run(`../public/atlas/packs/abrahamic-world-religions/${part}.js`);
run('../public/atlas/packs/abrahamic-world-religions.js');
run('../public/atlas/timeline.js');
const TL = ctx.window.AtlasTimeline;
const pack = ctx.window.ATLAS_PACKS['abrahamic-world-religions'];
const model = TL.adaptTree(pack);
const all = () => true;
const byId = (id: string) => model.records.find((r: any) => r.id === id);

test('calendar: no year 0, BCE/CE labels', () => {
  assert.equal(TL.yearsBetween(-1, 1), 1);
  assert.equal(TL.yearsBetween(-515, 70), 584);
  assert.equal(TL.fromAstro(TL.astro(-1)), -1);
  assert.equal(TL.fromAstro(0), -1);
  assert.equal(TL.yearLabel(-597), '597 BCE');
  assert.equal(TL.yearLabel(1), '1 CE');
});

test('every tree node and every event becomes exactly one record; nothing gains a date', () => {
  const nodes = pack.tree.nodes;
  const events = pack.events;
  assert.equal(model.records.length, nodes.length + events.length);
  for (const n of nodes) {
    const r = byId('n:' + n.id);
    assert.ok(r, n.id);
    assert.equal(r.whenText, n.whenText || null, n.id + ' whenText kept');
    if (n.undated || (n.when == null && !n.emerge)) assert.equal(r.when, null, n.id + ' stays undated');
    if (n.emerge) {
      // a window is a window: kept apart from the continued presence, never a lifespan with invented ends
      assert.deepEqual([...r.when.window], [...n.emerge], n.id);
      assert.equal(r.when.to, n.until == null ? null : n.until, n.id + ' no invented end');
      assert.equal(r.when.toOpen, !!n.ongoing && n.until == null, n.id);
    }
    if (typeof n.when === 'number') assert.equal(r.when.from, n.when);
    if (n.approx) assert.equal(r.when.approx, true, n.id + ' approx kept');
  }
  for (const e of events) {
    const r = byId('e:' + e.id);
    assert.equal(r.whenText, e.whenText || null);
    if (e.when == null) assert.equal(r.when, null, e.id + ' stays undated');
    else if (Array.isArray(e.when)) assert.deepEqual([r.when.from, r.when.to, r.when.range], [...e.when, true]);
    else assert.equal(r.when.from, e.when);
  }
  // narrative chronology stays off the numeric axis
  assert.equal(byId('e:jud-e00').when, null);
  assert.equal(byId('e:jud-e00').chron, 'narrative');
  assert.equal(byId('e:jud-e01').when.from, -597);
});

test('relations keep their type and research label; no unknown types', () => {
  for (const e of model.edges) assert.ok(TL.EDGE_TYPES.includes(e.type), e.id + ' ' + e.type);
  const ana = model.edges.find((e: any) => e.from === 'n:jud-ananites' && e.to === 'n:jud-karaite');
  assert.equal(ana.type, 'contact');
  assert.match(ana.label, /not an exact schism/);
  // institutional branching is never coerced into kinship
  assert.equal(model.edges.filter((e: any) => e.type === 'parent' || e.type === 'succession').length, 0);
  const merges = pack.tree.nodes.filter((n: any) => n.merge).reduce((s: number, n: any) => s + n.merge.length, 0);
  assert.equal(model.edges.filter((e: any) => e.type === 'merge').length, merges);
});

test('gating filters endpoints and edges before counts, search, selection and URL state', () => {
  const full = TL.visible(model, all);
  const noJud = TL.visible(model, (g: any) => !g.layers.includes('jud'));
  assert.ok(noJud.records.length < full.records.length);
  assert.ok(noJud.records.every((r: any) => !r.gate.layers.includes('jud')));
  const ids = new Set(noJud.records.map((r: any) => r.id));
  assert.ok(noJud.edges.every((e: any) => ids.has(e.from) && ids.has(e.to)));
  assert.equal(TL.search(noJud, 'Karaite').length, 0);
  assert.ok(TL.search(full, 'Karaite').length > 0);
  assert.equal(TL.revalidate(noJud, 'n:jud-karaite'), null);
  assert.equal(TL.revalidate(full, 'n:jud-karaite'), 'n:jud-karaite');
  // a restored link cannot select a gated or unknown record
  assert.equal(TL.parseState('#tl=1&sel=n%3Ajud-karaite', noJud, pack.timeline).sel, null);
  assert.equal(TL.parseState('#tl=1&sel=n:nope', full, pack.timeline).sel, null);
  const st = TL.parseState('#tl=1&t=-600,0', full, pack.timeline);
  assert.equal(st.range, null, 'year 0 rejected');
  const st2 = TL.parseState('#tl=lane-jud,bogus&t=-900,100&sel=n:jud-karaite', full, pack.timeline);
  assert.deepEqual([...st2.lanes], ['lane-jud']);
  assert.deepEqual([...st2.range], [-800, 100]);
  assert.equal(TL.stateHash(st2), '#tl=lane-jud&t=-800,100&sel=n%3Ajud-karaite');
});

test('coverage reports what the data cannot support instead of inventing it', () => {
  const v = TL.visible(model, all);
  const c = TL.coverage(v, model);
  const gaps = c.gaps.map((g: any) => g.id);
  for (const g of ['family', 'succession', 'migration']) assert.ok(gaps.includes(g), g);
  assert.equal(c.dated + c.undated, c.records);
  assert.equal(c.drawn + v.unsourcedEdges.length, c.edges);
  // the extent never reaches past the data except to show an ongoing presence up to the axis end
  const [lo, hi] = TL.extent(v, pack.timeline);
  assert.ok(lo >= -800 && hi <= 2030, `${lo}..${hi}`);
});
