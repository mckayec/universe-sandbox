/* KO01-TEXT-01 (ChatGPT ko01-handoff-2026-11-20.md): on PR48 only, two prose fields are replaced — the Komashi
   world blurb and event e51's text. Nothing else changes. Visibility is checked with the ACTUAL engine selectors
   cut out of public/atlas/engine.js (evOk/eText, rdWorldHidden, eraBlurb, eraVal) against the parent pack (built
   by reversing only these two strings) in 13 reading states. */
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

const OLD_BLURB =
  'Half of a double planet circling a big red-orange sun, with its twin UTol shining blue in the sky. ' +
  'In one age, Yumi stacks stones to honour the spirits that warm the land. In another, a black shroud hides ' +
  'the sky, nightmares come out of it, and Nikaro paints them away for a living. A spirit binds the two of them ' +
  'together. The habitable land around Kilahito and Torio is only a few hundred miles across; on this globe it ' +
  'is drawn about six times larger so it can be seen.';
const NEW_BLURB =
  'Yumi stacks stones in rituals honoring the spirits. In Kilahito, Nikaro works as a nightmare painter ' +
  'beneath glowing hion lines. Their lives become connected.';
const OLD_E51 = 'A stone-stacker and a nightmare painter are bound together across time and must work out why.';
const NEW_E51 = 'Yumi, a stone-stacker, and Nikaro, a nightmare painter, become linked.';
const PAIRS: [string, string][] = [
  [OLD_BLURB, NEW_BLURB],
  [OLD_E51, NEW_E51],
];
for (const [o, n] of PAIRS) {
  assert.equal(packSrc.split(n).length, 2, 'new text occurs once');
  assert.equal(packSrc.split(o).length, 1, 'old text absent');
}
for (const gone of ['across time', 'few hundred miles', 'six times larger', 'In one age'])
  assert.ok(!packSrc.includes(gone), 'removed wording absent from source: ' + gone);
const parentSrc = PAIRS.reduce((s, [o, n]) => s.replace(n, o), packSrc);
assert.equal(
  PAIRS.reduce((s, [o, n]) => s.replace(o, n), parentSrc),
  packSrc,
  'whole-source reversal',
);

const EVENTS_N = 63;
const YUMI = 'yumi-and-the-nightmare-painter';
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
      `(()=>{const w=WORLD_BY.komashi,hidden=rdWorldHidden(w);` +
        `return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),` +
        `status:hidden?null:eraVal(w,'status'),` +
        `events:EVENTS.map(e=>[e.id,!!evOk(e),evOk(e)?eText(e):null]),` +
        `sites:w.sites.map(s=>[s.id,!!siteSeen(s),siteSeen(s)?sDesc(s):null])};})()`,
      c,
    ),
  );
};

test('KO01-TEXT-01 payload: two fields replaced; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const kom = (pk: any) => pk.worlds.find((x: any) => x.id === 'komashi');
  const e51 = (pk: any) => pk.events.find((x: any) => x.id === 'e51');
  assert.equal(kom(p).blurb, NEW_BLURB);
  assert.equal(e51(p).text, NEW_E51);
  assert.equal(kom(pp).blurb, OLD_BLURB, 'parent control');
  assert.equal(e51(pp).text, OLD_E51, 'parent control');
  const head = J(p);
  kom(head).blurb = OLD_BLURB;
  e51(head).text = OLD_E51;
  assert.deepEqual(head, J(pp), 'whole parsed pack with both fields reversed equals the parent');
});

test('KO01-TEXT-01 visibility: 13 states identical to parent except the two fields; old wording never returned', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b11 = p.spoilers.works.filter((w: any) => w.bucket === 11).map((w: any) => w.id) as string[];
  assert.ok(b11.includes(YUMI), 'Yumi in bucket 11');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ...[10, 11, 12].map(book => ['legacy' + book, { mode: 'legacy', book }] as [string, St]),
    ['none', { mode: 'none' }],
    ['Yumi only', { mode: 'set', ids: [YUMI] }],
    ['bucket11', { mode: 'set', ids: b11 }],
    ['bucket11 minus Yumi', { mode: 'set', ids: b11.filter(id => id !== YUMI) }],
    ['all works minus Yumi', { mode: 'set', ids: all.filter(id => id !== YUMI) }],
    ['all works', { mode: 'set', ids: all }],
    ['all works minus bucket11', { mode: 'set', ids: all.filter(id => !b11.includes(id)) }],
    ['first work only', { mode: 'set', ids: [all[0]] }],
    ['legacy1', { mode: 'legacy', book: 1 }],
  ];
  assert.equal(states.length, 13);
  const exposed: string[] = [];
  let ev = 0;
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    ev += now.events.length;
    assert.equal(now.worldHidden, old.worldHidden, label + ': world');
    assert.deepEqual(now.facts, old.facts, label + ': facts');
    assert.equal(now.status, old.status, label + ': status');
    assert.deepEqual(now.sites, old.sites, label + ': sites');
    assert.equal(now.events.length, old.events.length);
    for (let i = 0; i < now.events.length; i++) {
      const [id, seen, text] = now.events[i];
      const [oid, oseen, otext] = old.events[i];
      assert.equal(id, oid);
      assert.equal(seen, oseen, label + ': ' + id + ' visibility');
      if (id === 'e51' && otext) assert.equal(text, NEW_E51, label + ': e51 text');
      else assert.equal(text, otext, label + ': ' + id + ' text');
    }
    if (old.blurb === OLD_BLURB) assert.equal(now.blurb, NEW_BLURB, label + ': blurb');
    else assert.equal(now.blurb, old.blurb, label + ': blurb');
    const s = JSON.stringify(now);
    assert.ok(!s.includes(OLD_E51) && !s.includes('few hundred miles'), label + ': old wording never returned');
    if (JSON.stringify(old).includes(OLD_E51) || old.blurb === OLD_BLURB) exposed.push(label);
  }
  assert.ok(ev > 0);
  console.log('KO01 exposure', exposed.length + '/13', exposed.join(', '), 'events compared', ev);
  // parent exposure 5/13 (whole-bucket fallback: Yumi alone does not unlock bucket 11)
  assert.deepEqual(exposed, ['All', 'legacy11', 'legacy12', 'bucket11', 'all works'], 'parent exposure');
  assert.equal(ev, 13 * EVENTS_N);
});
