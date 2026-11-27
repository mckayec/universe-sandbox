import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
// @ts-expect-error plain JS helper without type declarations
import { validatePacks } from './atlas-pack-validator.mjs';

// gate.js and cards.js are plain browser scripts: run them in a sandbox and read their window globals.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/gate.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/cards.js', import.meta.url), 'utf8'), ctx);
const G = ctx.window.AtlasGate;
const C = ctx.window.AtlasCards;
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const fx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('./fixtures/cards-pack/cards-demo.js', import.meta.url), 'utf8'), fx);
const pack = fx.window.ATLAS_PACKS['cards-demo'];
const IDS = [1, 2, 3];

test('EC-1: without spoilers options the old behaviour holds (All, links win)', () => {
  const N = G.normSpoilers(undefined, IDS);
  assert.deepEqual(plain(N), { start: 0, all: true, guard: false });
  assert.deepEqual(plain(G.resolveBook({ N, bookIds: IDS, url: null, stored: null })), {
    book: 0,
    choose: false,
    capped: false,
  });
  assert.equal(G.resolveBook({ N, bookIds: IDS, url: 3, stored: 1 }).book, 3);
  assert.equal(G.resolveBook({ N, bookIds: IDS, url: null, stored: 2 }).book, 2);
});

test('EC-1: a numeric start and all:false never open on everything', () => {
  const N = G.normSpoilers({ start: 2 }, IDS);
  assert.equal(G.resolveBook({ N, bookIds: IDS, url: null, stored: null }).book, 2);
  const N2 = G.normSpoilers({ all: false }, IDS);
  assert.equal(N2.start, 1);
  assert.equal(G.resolveBook({ N: N2, bookIds: IDS, url: 0, stored: 0 }).book, 1);
  assert.equal(G.validBook(0, N2, IDS), false);
});

test('EC-1: start:"choose" waits for a choice and guards deep links', () => {
  const N = G.normSpoilers({ start: 'choose', all: false }, IDS);
  assert.equal(N.guard, true);
  const fresh = G.resolveBook({ N, bookIds: IDS, url: null, stored: null });
  assert.equal(fresh.book, null);
  assert.equal(fresh.choose, true);
  // a shared #book=3 link does not choose for a visitor who has not chosen
  const linked = G.resolveBook({ N, bookIds: IDS, url: 3, stored: null });
  assert.equal(linked.book, null);
  assert.equal(linked.choose, true);
  // nor raise the gate of one who chose book 1, but it may lower it
  assert.deepEqual(plain(G.resolveBook({ N, bookIds: IDS, url: 3, stored: 1 })), {
    book: 1,
    choose: false,
    capped: true,
  });
  assert.equal(G.resolveBook({ N, bookIds: IDS, url: 1, stored: 2 }).book, 1);
  assert.equal(G.resolveBook({ N, bookIds: IDS, url: 0, stored: 2 }).book, 2);
});

test('EC-2: places nest without coordinates and inherit the gate of their parent', () => {
  const idx = G.placeIndex(pack.worlds);
  assert.equal(idx.by['setting/vault'].gate, 3);
  assert.equal(idx.by['other/gate'].gate, 2);
  assert.equal(idx.by['setting/tower'].parentKey, 'setting/city');
  assert.deepEqual(plain(G.chain(idx, 'setting/vault').map((e: any) => e.key)), [
    'setting',
    'setting/city',
    'setting/tower',
    'setting/vault',
  ]);
  assert.deepEqual(plain(G.children(idx, null).map((e: any) => e.key)), ['setting', 'other']);
  assert.equal(G.open(2, 1), false);
  assert.equal(G.open(2, 0), true);
  assert.deepEqual(plain(G.eventPlaces(pack.events[1])), ['other/gate', 'setting/city']);
});

test('EC-3: journeys show only when their book and every stop are open', () => {
  const idx = G.placeIndex(pack.worlds);
  assert.equal(G.journeyOpen(idx, pack.journeys[0], 1), true);
  assert.equal(G.journeyOpen(idx, pack.journeys[1], 2), false);
  assert.equal(G.journeyOpen(idx, pack.journeys[1], 3), true);
  assert.equal(G.journeyOpen(idx, { book: 1, path: ['setting/nowhere'] }, 3), false);
});

test('EC-4: chronological order sorts by books[k].chron and leaves gates alone', () => {
  assert.deepEqual(plain(G.bookOrder(pack.books, IDS, 'publication')), [1, 2, 3]);
  assert.deepEqual(plain(G.bookOrder(pack.books, IDS, 'chronological')), [2, 1, 3]);
  assert.equal(G.hasChron(pack.books, IDS), true);
  assert.equal(G.hasChron({ 1: {} }, [1]), false);
});

test('cards model fills defaults without changing the pack', () => {
  const before = JSON.stringify(pack);
  const K = C.model(pack, G);
  assert.equal(K.N.start, 'choose');
  assert.equal(K.ui.bookLabel, 'Completed through');
  assert.equal(K.events.length, 2);
  assert.equal(JSON.stringify(pack), before);
});

test('the validator accepts the cards demo', () => {
  const dir = new URL('./fixtures/cards-pack/', import.meta.url).pathname;
  const r = validatePacks(dir)['cards-demo.js'];
  assert.equal(r.error, undefined);
  assert.deepEqual(r.issues, []);
});

test('the validator rejects coordinates, broken parents and journeys past their stops in a cards layout', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cards-bad-'));
  const src = readFileSync(new URL('./fixtures/cards-pack/cards-demo.js', import.meta.url), 'utf8')
    .replace("{ id: 'city', name: 'City',", "{ id: 'city', lat: 1, lon: 2, name: 'City',")
    .replace("parent: 'tower', first: 3", "parent: 'nope', first: 3")
    .replace("{ id: 'j1', book: 1,", "{ id: 'j1', book: 1, path0: 1,")
    .replace("path: ['setting/city', 'setting/tower']", "path: ['setting/city', 'other/gate']");
  writeFileSync(join(dir, 'cards-demo.js'), src);
  writeFileSync(join(dir, 'registry.js'), readFileSync(new URL('./fixtures/cards-pack/registry.js', import.meta.url)));
  const issues: string[] = validatePacks(dir)['cards-demo.js'].issues;
  assert.ok(
    issues.some(i => /coordinates in a cards layout/.test(i)),
    issues.join('\n'),
  );
  assert.ok(
    issues.some(i => /parent -> missing site "nope"/.test(i)),
    issues.join('\n'),
  );
  assert.ok(
    issues.some(i => /journey j1: stop other\/gate gate 2 > journey book 1/.test(i)),
    issues.join('\n'),
  );
});
