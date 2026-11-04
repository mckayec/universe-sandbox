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

// TL-R11: the chapter gate resolves the first book from `first`/`book`/`books` (PACK_FORMAT §6 defaults).
test('chapterOk: books-derived and explicit first books honour the chapter threshold (TL-R11)', () => {
  const cum = (book: number, chapter: number | null) => ({ book, chapter, cumulative: true });
  const gates: [string, any][] = [
    ['books only', { books: [4], chapter: 9 }],
    ['books, several', { books: [6, 4, 5], chapter: 9 }],
    ['explicit first', { first: 4, books: [5], chapter: 9 }],
    ['event book', { book: 4, chapter: 9 }],
  ];
  for (const [name, g] of gates) {
    assert.equal(TL.firstBook(g), 4, name);
    // earlier selected book: later-book record stays hidden
    assert.equal(TL.chapterOk(g, cum(3, null)), false, name);
    assert.equal(TL.chapterOk(g, cum(3, 20)), false, name);
    // same book: unknown, earlier and equal/later chapters
    assert.equal(TL.chapterOk(g, cum(4, null)), false, name);
    assert.equal(TL.chapterOk(g, cum(4, 1)), false, name);
    assert.equal(TL.chapterOk(g, cum(4, 8)), false, name);
    assert.equal(TL.chapterOk(g, cum(4, 9)), true, name);
    assert.equal(TL.chapterOk(g, cum(4, 12)), true, name);
    // later selected book: earlier-book record passes
    assert.equal(TL.chapterOk(g, cum(5, null)), true, name);
    // the All / single-book contract is unchanged
    assert.equal(TL.chapterOk(g, cum(0, null)), true, name);
    assert.equal(TL.chapterOk(g, { book: 4, chapter: null, cumulative: false }), true, name);
  }
  // the explicit first wins over `books`
  assert.equal(TL.chapterOk({ first: 3, books: [4], chapter: 9 }, cum(4, null)), true);
  // a chapter with no book at all is ambiguous: withheld in cumulative mode, untouched otherwise
  assert.equal(TL.chapterOk({ chapter: 9 }, cum(4, 20)), false);
  assert.equal(TL.chapterOk({ books: [], chapter: 9 }, cum(4, 20)), false);
  assert.equal(TL.chapterOk({ chapter: 9 }, cum(0, null)), true);
  assert.equal(TL.firstBook({ books: [] }), null);
});

test('chapter gate through the adapter: books-only cards/sites carry first and are filtered before counts and search', () => {
  const p = JSON.parse(JSON.stringify(pack));
  p.codex[0].list.push({ key: 'KC', name: 'Chaptered card', books: [4], layers: ['dc'], chapter: 9, desc: 'dc' });
  p.codex[0].list[1].see.push({ k: 'KC', r: 'same city' });
  p.worlds[0].sites.push({ id: 'sc', name: 'Chaptered site', books: [4], layers: ['dc'], chapter: 9, desc: 'ds' });
  const m = TL.adaptStandardWorks(p);
  const card = m.records.find((r: any) => r.label === 'Chaptered card');
  const site = m.records.find((r: any) => r.label === 'Chaptered site');
  assert.equal(card.gate.first, 4);
  assert.equal(site.gate.first, 4);
  const host = (book: number, chapter: number | null) => (g: any) =>
    (!g.books || !book || Math.min(...g.books) <= book) && TL.chapterOk(g, { book, chapter, cumulative: true });
  for (const [chapter, shown] of [
    [null, false],
    [1, false],
    [9, true],
  ] as [number | null, boolean][]) {
    const v = TL.visible(m, host(4, chapter));
    const ids = new Set(v.records.map((r: any) => r.id));
    assert.equal(ids.has(card.id), shown, `card at chapter ${chapter}`);
    assert.equal(ids.has(site.id), shown, `site at chapter ${chapter}`);
    // no edge survives with a withheld endpoint, and search never finds a withheld record
    assert.ok(v.edges.every((e: any) => ids.has(e.from) && ids.has(e.to)));
    assert.equal(TL.search(v, 'Chaptered').length > 0, shown, `search at chapter ${chapter}`);
  }
  // a later selected book shows both; an earlier one hides both
  assert.ok(TL.visible(m, host(5, null)).records.some((r: any) => r.id === card.id));
  assert.ok(!TL.visible(m, host(3, 50)).records.some((r: any) => r.id === card.id));
});
