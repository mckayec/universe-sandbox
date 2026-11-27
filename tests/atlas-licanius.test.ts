import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// The Licanius pack must follow its build authority, docs/universes/packs/licanius/research-review.md:
// exactly the 29 seed records, world-only cards (no coordinates), a spoiler gate with no "All", the LR-01/LR-02
// copy, and book 3 limited to three publisher-premise cards.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/licanius.js', import.meta.url), 'utf8'), ctx);
// JSON round trip: arrays from the vm realm are not deepStrictEqual to this realm's arrays.
const pack = JSON.parse(JSON.stringify(ctx.window.ATLAS_PACKS.licanius));
const world = pack.worlds[0];
const sites: any[] = world.sites;
const site = (id: string) => sites.find(s => s.id === id);
const codex: any[] = pack.codex.flatMap((t: any) => t.list);
const entry = (id: string) => codex.find(x => x.id === id);
const gateOfPlace = (key: string): number => {
  const id = key.split('/')[1];
  let s = site(id);
  let g = s.first;
  while (s.parent) {
    s = site(s.parent);
    g = Math.max(g, s.first);
  }
  return g;
};

test('licanius is a world-only card pack that starts on the reading gate with no All option', () => {
  assert.equal(pack.layout, 'cards');
  assert.deepEqual(JSON.parse(JSON.stringify(pack.spoilers)), { mode: 'cumulative', start: 'choose', all: false });
  assert.deepEqual(Object.keys(pack.books), ['1', '2', '3']);
  assert.equal(pack.books[1].y, undefined, 'book 1 first-publication date is an open Known gap');
  assert.equal(pack.ui.bookLabel, 'Completed through');
});

test('exactly the 29 seed records are built (13 places, 7 events, 3 journeys, 6 codex)', () => {
  assert.equal(pack.worlds.length, 1);
  assert.equal(world.editorial, true, '"The setting" is an editorial container');
  assert.deepEqual(sites.map(s => s.id).sort(), [
    'alkathronen',
    'andarra',
    'boundary',
    'caladel',
    'daren-tel',
    'deilannis',
    'desriel',
    'ilin-illan',
    'ilshan-gathdel-teth',
    'prythe',
    'res-kartha',
    'talan-gol',
    'tol-shen',
  ]);
  assert.deepEqual(pack.events.map((e: any) => e.id).sort(), ['le01', 'le02', 'le03', 'le04', 'le05', 'le06', 'le07']);
  assert.deepEqual(
    pack.journeys.map((j: any) => j.id),
    ['lj01', 'lj02', 'lj03'],
  );
  assert.deepEqual(codex.map(x => x.id).sort(), ['lc01', 'lc02', 'lc03', 'lc04', 'lc05', 'lc06']);
});

test('nothing carries a coordinate, map position or distance', () => {
  const COORD = ['map', 'gal', 'star', 'dir', 'pos3', 'at', 'lat', 'lon', 'rel', 'ly'];
  for (const x of [world, ...sites]) for (const k of COORD) assert.equal(x[k], undefined, `${x.id}.${k}`);
});

test('gates match research.md (minimum read-through thresholds)', () => {
  const G2 = ['prythe', 'daren-tel', 'alkathronen', 'ilshan-gathdel-teth'];
  for (const s of sites) assert.equal(s.first, G2.includes(s.id) ? 2 : 1, s.id);
  const evGate: Record<string, number> = { le01: 1, le02: 1, le05: 2, le06: 2, le07: 2, le03: 3, le04: 3 };
  for (const e of pack.events) assert.equal(e.book, evGate[e.id], e.id);
  assert.deepEqual(
    pack.journeys.map((j: any) => j.book),
    [1, 2, 2],
  );
  for (const x of codex) assert.equal(x.first, x.id === 'lc06' ? 3 : 2, x.id);
});

test('no event or journey names a place gated after it', () => {
  for (const e of pack.events) {
    const keys = ['setting/' + e.site, ...(e.places || [])];
    for (const k of keys) assert.ok(gateOfPlace(k) <= e.book, `${e.id} -> ${k}`);
  }
  for (const j of pack.journeys) for (const k of j.path) assert.ok(gateOfPlace(k) <= j.book, `${j.id} -> ${k}`);
});

test('correction overlay LR-01 and LR-02 copy is used verbatim', () => {
  const le05 = pack.events.find((e: any) => e.id === 'le05');
  assert.equal(le05.text, 'Investigates missing Shadows.');
  assert.equal(le05.site, 'ilin-illan');
  assert.equal(entry('lc01').desc, 'An original group of eleven immortals.');
  assert.equal(entry('lc04').desc, 'Darecians transformed into the Lyth survived in Res Kartha.');
  const bg = pack.codex.find((t: any) => t.list.some((x: any) => x.id === 'lc01'));
  assert.equal(bg.title, 'Background (history)');
  assert.ok(bg.list.some((x: any) => x.id === 'lc04'));
});

test('book 3 is only the three publisher-premise cards (L2-03)', () => {
  const b3 = [...pack.events.filter((e: any) => e.book >= 3), ...codex.filter(x => x.first >= 3)];
  assert.deepEqual(b3.map((x: any) => x.id).sort(), ['lc06', 'le03', 'le04']);
  for (const x of b3) assert.match(x.note, /Publisher premise/);
  assert.ok(
    pack.journeys.every((j: any) => j.book < 3),
    'no book-3 route',
  );
});

test('le03 is listed on both its places; le02 is in no journey; Res Kartha stays at its gate-1 text', () => {
  const le03 = pack.events.find((e: any) => e.id === 'le03');
  assert.equal(le03.site, 'boundary');
  assert.deepEqual([...le03.places], ['setting/andarra']);
  for (const j of pack.journeys) assert.ok(!j.path.includes('setting/deilannis') || j.id === 'lj01');
  assert.equal(site('res-kartha').desc, 'A dwelling place of the Lyth.');
  assert.equal(site('res-kartha').more, undefined, 'no gated link from res-kartha to lc04');
  assert.equal(site('caladel').editorial, true, 'L2-01 editorial label');
});

test('lc05 is two attributed views', () => {
  const x = entry('lc05');
  assert.match(x.desc, /Gassandrid’s view/);
  assert.match(x.desc, /Andrael’s view/);
});

test('the fan-work notice and source basis are visible', () => {
  assert.match(pack.meta.notice, /Unofficial fan project/);
  assert.match(pack.meta.notice, /author recaps and publisher descriptions/);
  assert.match(pack.intro.coverage, /not on the novels/);
});

test('build audit LB-01/LB-02: premise without asserted success; the limitation is the atlas’s', () => {
  const le04 = pack.events.find((e: any) => e.id === 'le04');
  assert.equal(le04.book, 3);
  assert.match(le04.note, /Publisher premise/);
  assert.match(le04.text, /tries to/);
  assert.doesNotMatch(le04.text, /maintains/);
  const said = [pack.ui.journeysNote, pack.intro.coverage].join(' ');
  assert.doesNotMatch(said, /sources give no/);
  assert.match(pack.ui.journeysNote, /This atlas has no verified coordinates/);
  assert.match(pack.intro.coverage, /This atlas has no verified/);
});
