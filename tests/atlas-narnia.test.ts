import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// The Narnia pack must follow its build authority (docs/universes/packs/narnia/research-review.md):
// exactly the 51 seed records with publication-order gates, overlay NR-01, no coordinates and no wolf record.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/gate.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/narnia.js', import.meta.url), 'utf8'), ctx);
const pack = JSON.parse(JSON.stringify(ctx.window.ATLAS_PACKS.narnia));
const G = ctx.window.AtlasGate;

type Place = { key: string; id: string; name: string; first: number; editorial?: boolean; item: any };
const places: Place[] = [];
for (const w of pack.worlds) {
  places.push({ key: w.id, id: w.id, name: w.name, first: w.first, editorial: w.editorial, item: w });
  const sites = new Map((w.sites || []).map((s: any) => [s.id, s]));
  for (const s of w.sites || []) {
    let gate = Math.max(w.first, s.first);
    for (let p: any = s; p.parent;) ((p = sites.get(p.parent)), (gate = Math.max(gate, p.first)));
    places.push({ key: `${w.id}/${s.id}`, id: s.id, name: s.name, first: gate, editorial: s.editorial, item: s });
  }
}
const byId = new Map(places.map(p => [p.id, p]));
const byKey = new Map(places.map(p => [p.key, p]));
const codex = pack.codex.flatMap((t: any) => t.list);

test('narnia: exactly the 51 seed records (23 places, 14 events, 7 journeys, 7 codex)', () => {
  assert.equal(places.length, 23);
  assert.equal(pack.events.length, 14);
  assert.equal(pack.journeys.length, 7);
  assert.equal(codex.length, 7);
});

test('narnia: publication-order gates match the coverage ledger', () => {
  const ledger: Record<number, string[]> = {
    1: ['n00', 'e00', 'p01', 'p02', 'p03', 'p06', 'p07', 'p16'],
    2: ['p04', 'p05', 'p13'],
    3: ['p08', 'p09'],
    4: ['p10', 'p11', 'p12'],
    5: ['p14', 'p15'],
    6: ['p17', 'p18'],
    7: ['p19', 'p20', 'p21'],
  };
  for (const [book, ids] of Object.entries(ledger))
    for (const id of ids) assert.equal(byId.get(id)?.first, Number(book), id);
  const evBooks = pack.events.map((e: any) => e.book);
  assert.deepEqual(evBooks, [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]);
  assert.deepEqual(
    pack.journeys.map((j: any) => j.book),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.deepEqual(
    ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07'].map(id => codex.find((c: any) => c.id === id).first),
    [1, 1, 3, 4, 5, 6, 7],
  );
});

test('narnia: chronology only reorders; gates stay publication order', () => {
  const chron = Object.keys(pack.books).map(k => pack.books[k].chron);
  assert.deepEqual(chron, [2, 4, 5, 6, 3, 1, 7]);
  assert.deepEqual(
    Object.keys(pack.books).map(k => pack.books[k].y),
    [1950, 1951, 1952, 1953, 1954, 1955, 1956],
  );
});

test('narnia: spoiler-neutral start with no "All" and guarded links (EC-1)', () => {
  assert.equal(pack.layout, 'cards');
  const N = G.normSpoilers(pack.spoilers, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(N.start, 'choose');
  assert.equal(N.all, false);
  assert.equal(N.guard, true);
  const r = G.resolveBook({ N, bookIds: [1, 2, 3, 4, 5, 6, 7], url: 7, stored: null });
  assert.notEqual(r.book, 7);
  assert.equal(G.resolveBook({ N, bookIds: [1, 2, 3, 4, 5, 6, 7], url: 0, stored: 2 }).book, 2);
});

test('narnia: nothing has a coordinate or a map placement', () => {
  const banned = ['map', 'gal', 'pos3', 'lat', 'lon', 'rel', 'at', 'star', 'dir', 'ly', 'gfx'];
  for (const p of places) for (const f of banned) assert.equal(p.item[f], undefined, `${p.key}.${f}`);
});

test('narnia: overlay NR-01 and editorial labels', () => {
  const hill = byId.get('p20')!;
  assert.equal(hill.name, 'Stable Hill');
  assert.equal(hill.first, 7);
  assert.ok(!hill.editorial);
  assert.equal(hill.item.type, 'Landmark');
  assert.deepEqual(
    places.filter(p => p.editorial).map(p => p.id),
    ['n00', 'e00', 'p21'],
  );
});

test('narnia: later eras sit behind their own gates and never lower an event or journey', () => {
  const eras: [string, number][] = [
    ['p03', 2],
    ['p06', 2],
    ['p07', 3],
    ['p13', 5],
    ['p16', 6],
    ['n00', 6],
    ['n00', 7],
  ];
  const got = places.flatMap(p => (p.item.more || []).map((m: [number, string]) => [p.id, m[0]]));
  assert.deepEqual(got.sort(), eras.sort());
  for (const e of pack.events) {
    const key = e.site ? `${e.world}/${e.site}` : e.world;
    assert.ok(byKey.has(key), `${e.id} place ${key}`);
    assert.ok(byKey.get(key)!.first <= e.book, `${e.id} gated after its place`);
  }
  for (const j of pack.journeys)
    for (const k of j.path) {
      assert.ok(byKey.has(k), `${j.id} stop ${k}`);
      assert.ok(byKey.get(k)!.first <= j.book, `${j.id} stop ${k}`);
    }
});

test('narnia: NQ07 container notes, inter-world grouping and no wolf record', () => {
  for (const id of ['n00', 'p12', 'p13', 'p15']) assert.match(byId.get(id)!.item.note, /not a claim/);
  const other = pack.worlds.filter((w: any) => w.group === 'other').map((w: any) => w.id);
  assert.deepEqual(other.sort(), ['e00', 'p17', 'p18', 'p21']);
  const text = JSON.stringify(pack);
  assert.doesNotMatch(text, /Fenris|Maugrim|wolf/i);
  assert.match(pack.meta.notice, /Unofficial fan project/);
  assert.match(pack.intro.coverage, /Limited coverage/);
});
