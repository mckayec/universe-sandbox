/* CA01-DESTINATION-01 (ChatGPT ca01-checkpoint2-2026-11-21.md): on PR48 only, two removals in the Cosmere pack.
   D1: worlds[canticle].eras[12].blurb loses the unsupported ", then Skips on to UTol" clause.
   D2: galaxy.links[id=h-nomad] (path canticle -> komashi) is removed; no replacement destination is added.
   The parent pack is rebuilt by reversing exactly these two edits; everything else must be identical. Era visibility
   is checked with the ACTUAL engine selectors cut out of public/atlas/engine.js in 13 reading states. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const engine = read('public/atlas/engine.js');
const readingSrc = read('public/atlas/reading.js');
const packSrc = read('public/atlas/packs/cosmere.js');
const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
const J = (x: unknown) => JSON.parse(JSON.stringify(x));

const ERA_KEEP = 'helps the people of Beacon overthrow the Cinder King';
const OLD_ERA = ERA_KEEP + ', then Skips on to UTol."}},';
const NEW_ERA = ERA_KEEP + '."}},';
const NOMAD_LINE =
  '        {id: "h-nomad", path: ["canticle", "komashi"], book: 11, opacity: {all: .5, cur: .95, past: .35}, curve: .12},\n';
const NEXT_LINE = '        {id: "h-scad-can",';
assert.equal(packSrc.split(NEW_ERA).length, 2, 'D1 new ending occurs once');
assert.ok(!packSrc.includes('Skips on to UTol'), 'D1 removed clause absent');
assert.ok(!packSrc.includes('"h-nomad"'), 'D2 link id absent');
assert.equal(packSrc.split(NEXT_LINE).length, 2, 'D2 anchor occurs once');
const parentSrc = packSrc.replace(NEW_ERA, OLD_ERA).replace(NEXT_LINE, NOMAD_LINE + NEXT_LINE);
assert.equal(parentSrc.replace(OLD_ERA, NEW_ERA).replace(NOMAD_LINE, ''), packSrc, 'whole-source reversal');

const SUNLIT = 'the-sunlit-man';
type St = { mode: 'set' | 'legacy' | 'all' | 'none'; ids?: string[]; book?: number };

function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set' || st.mode === 'none';
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(st.ids || []),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    EVENTS: p.events,
    PW: () => pw,
    CUM: true,
    S: { book: st.mode === 'legacy' ? st.book : 0, realm: 'physical' },
    LY: null,
  });
  const marks: [string, string][] = [
    ['const ARR=', '\n'],
    ['const EFF=', '\n'],
    ['const eraVal=', 'const realmOk='],
    ['const eraKeys=', '\n'],
    ['const filterOk=', '\n'],
    ['const GCACHE=new WeakMap();', '/* intro copy'],
    ['const firstOf=w=>', '\n'],
    ['const evOk=', '\n'],
    ['const realmOk=', '\n'],
    ['const siteEraOk=', '\n'],
    ['const siteSeen=', '\n'],
    ['function rdWorldHidden(', '\n'],
    ['function eraBlurb(', '\n'],
  ];
  for (const [a, b] of marks) vm.runInContext(cut(a, b), c);
  return { c, p };
}

const observe = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `(()=>{const w=WORLD_BY.canticle,hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),` +
        `status:hidden?null:eraVal(w,'status'),` +
        `events:EVENTS.map(e=>[e.id,!!evOk(e),evOk(e)?eText(e):null]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s),siteSeen(s)?sDesc(s):null])};})()`,
      c,
    ),
  );
};

test('CA01-DESTINATION-01 payload: two removals; whole parsed pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const can = (pk: any) => pk.worlds.find((x: any) => x.id === 'canticle');
  const era = can(p).eras[12].blurb as string;
  const oldEra = can(pp).eras[12].blurb as string;
  assert.ok(oldEra.endsWith(ERA_KEEP + ', then Skips on to UTol.'), 'parent control: D1');
  assert.equal(era, oldEra.replace(', then Skips on to UTol.', '.'), 'D1: only the clause removed');
  assert.ok(!/UTol/.test(era), 'D1: no destination in the era blurb');
  const ids = (pk: any) => J(pk.galaxy.links.map((l: any) => l.id)) as string[];
  assert.equal(ids(pp).length, 10, 'parent has 10 galaxy links');
  assert.equal(ids(p).length, 9, 'head has 9 galaxy links');
  const at = ids(pp).indexOf('h-nomad');
  assert.equal(at, 3, 'parent h-nomad index');
  assert.deepEqual(J(pp.galaxy.links[at]), {
    id: 'h-nomad',
    path: ['canticle', 'komashi'],
    book: 11,
    opacity: { all: 0.5, cur: 0.95, past: 0.35 },
    curve: 0.12,
  });
  assert.deepEqual(
    ids(p),
    ids(pp).filter((x: string) => x !== 'h-nomad'),
    'D2: only h-nomad removed, order kept',
  );
  for (const keep of ['h-scad-can', 'h-nomad2'])
    assert.deepEqual(
      J(p.galaxy.links.find((l: any) => l.id === keep)),
      J(pp.galaxy.links.find((l: any) => l.id === keep)),
      keep + ' unchanged',
    );
  const refs = (l: any) => [...(l.path || []), ...(l.pairs || []).flat()];
  assert.ok(
    !p.galaxy.links.some((l: any) => refs(l).includes('canticle') && refs(l).includes('komashi')),
    'no Canticle-Komashi route remains',
  );
  assert.equal(
    p.galaxy.links.filter((l: any) => refs(l).includes('canticle')).length,
    2,
    'Canticle-touching links 3 -> 2 (h-scad-can, h-nomad2)',
  );
  const head = J(p);
  can(head).eras[12].blurb = oldEra;
  head.galaxy.links.splice(at, 0, J(pp.galaxy.links[at]));
  assert.deepEqual(head, J(pp), 'whole parsed pack with D1/D2 reversed equals the parent');
});

test('CA01-DESTINATION-01 visibility: 13 states identical to parent except the removed clause', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b11 = p.spoilers.works.filter((w: any) => w.bucket === 11).map((w: any) => w.id) as string[];
  assert.ok(b11.includes(SUNLIT), 'Sunlit Man in bucket 11');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[10, 11, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['none', { mode: 'none' }],
    ['Sunlit only', { mode: 'set', ids: [SUNLIT] }],
    ['bucket11', { mode: 'set', ids: b11 }],
    ['bucket11 minus Sunlit', { mode: 'set', ids: b11.filter(id => id !== SUNLIT) }],
    ['all works minus Sunlit', { mode: 'set', ids: all.filter(id => id !== SUNLIT) }],
    ['all works', { mode: 'set', ids: all }],
    ['all works minus bucket11', { mode: 'set', ids: all.filter(id => !b11.includes(id)) }],
    ['first work only', { mode: 'set', ids: [all[0]] }],
    ['legacy1', { mode: 'legacy', book: 1 }],
  ];
  const exposed: string[] = [];
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.deepEqual(now.facts, old.facts, label + ': facts');
    assert.equal(now.status, old.status, label + ': status');
    assert.deepEqual(now.sites, old.sites, label + ': sites');
    assert.deepEqual(now.events, old.events, label + ': events (visibility + text)');
    if (old.blurb && old.blurb.includes('Skips on to UTol')) {
      exposed.push(label);
      assert.equal(now.blurb, old.blurb.replace(', then Skips on to UTol.', '.'), label + ': era blurb');
    } else assert.equal(now.blurb, old.blurb, label + ': blurb');
    assert.ok(!JSON.stringify(now).includes('Skips on to UTol'), label + ': removed clause never returned');
  }
  console.log('CA01-DESTINATION exposure', exposed.length + '/13', exposed.join(', '));
  assert.deepEqual(exposed, ['All', 'legacy12', 'all works'], 'parent exposure of the removed clause');
});
