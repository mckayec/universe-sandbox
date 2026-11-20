/* SA03-DW06-PORT (ChatGPT sa03-handoff-2026-11-20.md): on PR48 only, replace events.e35.text with the exact
   journey sentence already used on PR37. id, book, world, site, title, order and every other value are unchanged;
   no landmark, coordinate, parent metadata, gate or mapping added. Event and Yeddaw site visibility are checked
   with the ACTUAL engine selectors cut out of public/atlas/engine.js against the parent pack in the 11 enumerated
   reading states of the handoff. */
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

const E35_NEW = 'Lift travels to Yeddaw in Tashikk, where Darkness has been reported.';
const E35_OLD = 'Lift crosses to Tashikk to protect a man the Herald Nale wants dead.';
const LINE = (t: string) =>
  '{id: "e35", book: 7, world: "roshar", site: "yeddaw", title: "Edgedancer", text: "' + t + '"}';
const WOK = 'the-way-of-kings';
const WOR = 'words-of-radiance';
const ED = 'edgedancer';

/* the actual parent pack (97ebc3d): only the e35 text differs */
assert.equal(packSrc.split(LINE(E35_NEW)).length, 2, 'new e35 line occurs once');
const parentSrc = packSrc.replace(LINE(E35_NEW), LINE(E35_OLD));

type St = { mode: 'set' | 'legacy' | 'all'; ids?: string[]; book?: number };

function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set';
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
  vm.runInContext(cut('const ARR=', '\n'), c);
  vm.runInContext(cut('const filterOk=', '\n'), c);
  vm.runInContext(cut('const GCACHE=new WeakMap();', '/* intro copy'), c);
  vm.runInContext(cut('const firstOf=w=>', '\n'), c);
  vm.runInContext(cut('const evOk=', '\n'), c);
  for (const m of ['const realmOk=', 'const siteEraOk=', 'const siteSeen=', 'function rdWorldHidden(']) {
    vm.runInContext(cut(m, '\n'), c);
  }
  return { c, p };
}
const bucket = (k: number) => {
  const { p } = setup({ mode: 'all' });
  return p.spoilers.works.filter((w: any) => w.bucket === k).map((w: any) => w.id) as string[];
};
const seen = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(
    vm.runInContext(
      `({ev: EVENTS.filter(e=>e.world==='roshar').map(e=>[e.id,!!evOk(e)]),
         site: !!siteSeen(WORLD_BY.roshar.sites.find(s=>s.id==='yeddaw')) && !rdWorldHidden(WORLD_BY.roshar)})`,
      c,
    ),
  );
};

test('SA03-DW06-PORT payload: e35 has the exact journey text; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const e = p.events.find((x: any) => x.id === 'e35');
  const ep = pp.events.find((x: any) => x.id === 'e35');
  assert.deepEqual(J(e), { id: 'e35', book: 7, world: 'roshar', site: 'yeddaw', title: 'Edgedancer', text: E35_NEW });
  assert.ok(!('lm' in e) && !('effect' in e), 'no lm/effect');
  assert.equal(ep.text, E35_OLD, 'parent control old text');
  assert.deepEqual(
    J(p.events.map((x: any) => x.id)),
    J(pp.events.map((x: any) => x.id)),
    'event ids and order unchanged',
  );
  const strip = (pk: any) => {
    const x = J(pk);
    delete x.events.find((y: any) => y.id === 'e35').text;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus e35.text equals the parent');
  for (const x of ['protect a man the Herald Nale wants dead', 'Lift crosses to Tashikk'])
    assert.ok(!packSrc.includes(x), 'old copy absent: ' + x);
  assert.equal(packSrc.split(E35_NEW).length, 2, 'new text once');
});

test('SA03-DW06-PORT visibility: e35 and Yeddaw identical to the parent in the 11 enumerated states', () => {
  const b7 = bucket(7);
  assert.equal(b7.length, 13, 'bucket 7 has 13 works');
  assert.ok(b7.includes(ED), 'Edgedancer is a bucket-7 work');
  const states: [string, St, boolean][] = [
    ['All', { mode: 'all' }, true],
    ['legacy #book=7', { mode: 'legacy', book: 7 }, true],
    ['legacy #book=12', { mode: 'legacy', book: 12 }, true],
    ['legacy #book=6', { mode: 'legacy', book: 6 }, false],
    ['nothing read', { mode: 'set', ids: [] }, false],
    ['Edgedancer only', { mode: 'set', ids: [ED] }, false],
    ['WoK + Edgedancer', { mode: 'set', ids: [WOK, ED] }, false],
    ['WoK + WoR + Edgedancer', { mode: 'set', ids: [WOK, WOR, ED] }, false],
    ['bucket 7 only', { mode: 'set', ids: b7 }, false],
    ['WoK + all 13 bucket-7 works', { mode: 'set', ids: [WOK, ...b7] }, true],
    ['WoK + bucket 7 minus Edgedancer', { mode: 'set', ids: [WOK, ...b7.filter(x => x !== ED)] }, false],
  ];
  for (const [label, st, want] of states) {
    const a = seen(st);
    assert.deepEqual(a, seen(st, parentSrc), label + ': same as parent');
    const ev = a.ev.find((x: [string, boolean]) => x[0] === 'e35')[1];
    assert.equal(ev, want, label + ': e35 ' + (want ? 'shown' : 'withheld'));
    assert.equal(a.site, want, label + ': yeddaw ' + (want ? 'shown' : 'withheld'));
  }
});
