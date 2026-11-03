import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Standard Works timeline adapter and chapter-aware gate (public/atlas/timeline.js; timeline checkpoint 12).
// The fixture is synthetic and only mirrors the pack's field shapes (events, sites, routes, codex `see` links);
// the real pack lives on its own branch and is checked by docs/reviews/synchronoptic-timelines/tl12/sw-probe.mjs.
const ctx: { window: Record<string, any>; URLSearchParams: typeof URLSearchParams } = { window: {}, URLSearchParams };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../public/atlas/timeline.js', import.meta.url), 'utf8'), ctx);
const TL = ctx.window.AtlasTimeline;

const pack = {
  id: 'lds-standard-works',
  layers: [
    { id: 'ot', name: 'Old Testament' },
    { id: 'dc', name: 'Doctrine and Covenants and church history' },
  ],
  events: [
    { id: 'ev-old', book: 1, world: 'earth', site: 'a', layers: ['ot'], title: 'Old episode', text: 'T1' },
    { id: 'ev-new', book: 4, world: 'earth', site: 'b', layers: ['dc'], when: 1830, title: 'Dated', text: 'T2' },
  ],
  worlds: [
    {
      id: 'earth',
      sites: [
        { id: 'a', name: 'A', books: [1], layers: ['ot'], desc: 'undated place' },
        { id: 'b', name: 'B', books: [4], layers: ['dc'], when: [1839, 1846], desc: 'span' },
        { id: 'c', name: 'C', books: [4], layers: ['dc'], when: 1846, desc: 'year' },
      ],
      routes: [
        { id: 'r-undated', name: 'Undated', books: [1], layers: ['ot'], ref: 'Ezra 1:11', stops: ['a', 'b'] },
        {
          id: 'r-dated',
          name: 'Dated',
          books: [4],
          layers: ['dc'],
          when: 1846,
          stops: [{ site: 'b', note: 'leave' }, 'c', { name: 'Unmapped', note: 'not drawn' }],
        },
      ],
    },
  ],
  codex: [
    {
      id: 'sec',
      list: [
        { key: 'K1', name: 'One', books: [4], layers: ['dc'], desc: 'd1', src: [{ t: 'D&C 1', u: 'https://x/1' }] },
        {
          key: 'K2',
          name: 'Two',
          books: [4],
          layers: ['dc'],
          desc: 'd2',
          see: [{ k: 'K1', r: 'same city' }, { k: 'K3', r: 'member of the Twelve' }, 'MISSING'],
        },
        { key: 'K3', name: 'Three', books: [4], layers: ['dc'], desc: 'd3', see: [{ k: 'K2', r: 'same city' }] },
        { name: 'Unkeyed', books: [4], layers: ['dc'], when: 1820, date: 'spring 1820, as narrated', desc: 'd4' },
        { key: 'K5', name: 'Dated text only', books: [4], layers: ['dc'], date: 'October 27, 1838', desc: 'd5' },
      ],
    },
  ],
};
const model = TL.adaptStandardWorks(pack);
const plain = (x: unknown) => JSON.parse(JSON.stringify(x));
const rec = (id: string) => model.records.find((r: any) => r.id === id);

test('adapterFor picks the tree adapter, the Standard Works adapter, or none', () => {
  assert.equal(TL.adapterFor({ tree: { nodes: [] } }), TL.adaptTree);
  assert.equal(TL.adapterFor(pack), TL.adaptStandardWorks);
  assert.equal(TL.adapterFor({ id: 'dune' }), null);
});

test('one record per event, site, route and card; nothing gains a date', () => {
  assert.equal(model.records.length, 2 + 3 + 2 + 5);
  assert.equal(rec('e:ev-old').when, null);
  assert.equal(rec('e:ev-old').chron, 'narrative');
  assert.equal(rec('e:ev-old').lane, 'work-ot');
  assert.deepEqual(
    [rec('e:ev-new').when.from, rec('e:ev-new').chron, rec('e:ev-new').lane],
    [1830, 'institutional', 'sw-history'],
  );
  assert.deepEqual([rec('s:b').kind, rec('s:b').when.from, rec('s:b').when.to], ['span', 1839, 1846]);
  assert.equal(rec('s:a').when, null);
  assert.equal(rec('r:r-undated').when, null);
  assert.equal(rec('r:r-undated').textRef, 'Ezra 1:11');
  // a card's date text is kept verbatim and never parsed into a year
  assert.equal(rec('c:K5').when, null);
  assert.equal(rec('c:K5').whenText, 'October 27, 1838');
  assert.equal(rec('c:sec#3').when.from, 1820);
  assert.equal(rec('c:sec#3').whenText, 'spring 1820, as narrated');
  assert.equal(rec('c:K1').src[0].t, 'D&C 1');
  assert.deepEqual(plain(model.lanes.map((l: any) => l.id)), [
    'sw-history',
    'sw-places',
    'sw-journeys',
    'work-ot',
    'work-dc',
  ]);
});

test('travel edges only from dated routes, between mapped consecutive stops, never drawn without a source', () => {
  const travel = model.edges.filter((e: any) => e.type === 'travel');
  assert.deepEqual(plain(travel.map((e: any) => [e.from, e.to, e.label])), [['s:b', 's:c', 'leave']]);
  assert.equal(model.omitted.travelLegs, 1);
  const v = TL.visible(model, () => true);
  assert.equal(v.drawnEdges.length, 0);
  assert.ok(v.unsourcedEdges.some((e: any) => e.type === 'travel'));
  const gaps = TL.coverage(v, model).gaps.map((g: any) => g.id);
  assert.ok(gaps.includes('migration') && gaps.includes('succession') && gaps.includes('edge-sources'));
});

test('see links: typed with their own wording, reciprocal pairs once, dangling counted, offices are not succession', () => {
  const see = model.edges.filter((e: any) => e.id.startsWith('x:'));
  assert.deepEqual(plain(see.map((e: any) => [e.from, e.to, e.type, e.label])), [
    ['c:K2', 'c:K1', 'same-entity', 'same city'],
    ['c:K2', 'c:K3', 'context', 'member of the Twelve'],
    ['c:K3', 'c:K2', 'same-entity', 'same city'],
  ]);
  assert.equal(model.omitted.danglingLinks, 1);
  assert.ok(see.every((e: any) => e.src.length === 0));
  assert.ok(!model.edges.some((e: any) => e.type === 'succession'));
});

test('chapterOk: fail closed in the current book without a chapter selector', () => {
  const g = { first: 5, chapter: 9 };
  assert.equal(TL.chapterOk(g, { book: 4, chapter: null, cumulative: true }), false);
  assert.equal(TL.chapterOk(g, { book: 5, chapter: null, cumulative: true }), false);
  assert.equal(TL.chapterOk(g, { book: 5, chapter: 8, cumulative: true }), false);
  assert.equal(TL.chapterOk(g, { book: 5, chapter: 9, cumulative: true }), true);
  assert.equal(TL.chapterOk(g, { book: 6, chapter: null, cumulative: true }), true);
  // no book chosen, single-book mode, or no chapter on the record: this gate hides nothing
  assert.equal(TL.chapterOk(g, { book: 0, chapter: null, cumulative: true }), true);
  assert.equal(TL.chapterOk(g, { book: 5, chapter: null, cumulative: false }), true);
  assert.equal(TL.chapterOk({ first: 5, chapter: null }, { book: 5, chapter: null, cumulative: true }), true);
});
