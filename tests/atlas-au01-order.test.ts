/* AU01-ORDER-01 (ChatGPT au01-checkpoint-1-2026-11-21.md): on PR48 only, the Rosharan gas-giant generator numbers
   Jes..Ishi 4th..13th from the sun (was 5th..14th). Two expressions change ((i + 5) -> (i + 4)) in status and
   facts[0][1]; the 1-of-10 index (i + 1) is kept. The parent pack is rebuilt by reversing exactly these two edits;
   everything else must be identical. Visibility is checked with the ACTUAL engine selectors cut out of
   public/atlas/engine.js in the requested reading states. */
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

const NEW_STATUS = 'status: "Gas giant · " + (i + 4) + "th from the sun",';
const OLD_STATUS = 'status: "Gas giant · " + (i + 5) + "th from the sun",';
const NEW_FACT = 'facts: [["Order", (i + 4) + "th from the sun (" + (i + 1) + " of the ten gas giants)"]';
const OLD_FACT = 'facts: [["Order", (i + 5) + "th from the sun (" + (i + 1) + " of the ten gas giants)"]';
assert.equal(packSrc.split(NEW_STATUS).length, 2, 'status expression occurs once');
assert.equal(packSrc.split(NEW_FACT).length, 2, 'facts expression occurs once');
assert.ok(!packSrc.includes('(i + 5)'), 'no (i + 5) expression left');
const parentSrc = packSrc.replace(NEW_STATUS, OLD_STATUS).replace(NEW_FACT, OLD_FACT);
assert.equal(parentSrc.replace(OLD_STATUS, NEW_STATUS).replace(OLD_FACT, NEW_FACT), packSrc, 'whole-source reversal');

const GIANTS = ['jes', 'nan', 'chach', 'vev', 'palah', 'shash', 'betab', 'kak', 'tanat', 'ishi'];
const AU01 = 'arcanum-unbounded-system-essays-and-maps';
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
  c.GIANTS = GIANTS;
  return J(
    vm.runInContext(
      `GIANTS.map(id=>{const w=WORLD_BY[id],hidden=!!rdWorldHidden(w);` +
        `return {id,hidden,status:hidden?null:eraVal(w,'status'),facts:hidden?null:eraVal(w,'facts'),` +
        `blurb:hidden?null:eraBlurb(w)};})`,
      c,
    ),
  );
};

test('AU01-ORDER-01 payload: 20 values across 10 records; whole parsed pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const by = (pk: any, id: string) => pk.worlds.find((x: any) => x.id === id);
  let changed = 0;
  GIANTS.forEach((id, i) => {
    const w = by(p, id);
    const o = by(pp, id);
    assert.equal(w.status, 'Gas giant · ' + (i + 4) + 'th from the sun', id + ' status');
    assert.equal(o.status, 'Gas giant · ' + (i + 5) + 'th from the sun', id + ' parent status');
    assert.equal(w.facts[0][1], i + 4 + 'th from the sun (' + (i + 1) + ' of the ten gas giants)', id + ' order fact');
    assert.equal(o.facts[0][1], i + 5 + 'th from the sun (' + (i + 1) + ' of the ten gas giants)', id + ' parent fact');
    assert.equal(w.short, 'Gas giant ' + (i + 1) + ' of 10 beyond the asteroid belt.', id + ' 1-of-10 index kept');
    changed += 2;
  });
  assert.equal(changed, 20, '20 status/order values');
  assert.equal(by(p, 'jes').status, 'Gas giant · 4th from the sun');
  assert.equal(by(p, 'ishi').status, 'Gas giant · 13th from the sun');
  const head = J(p);
  GIANTS.forEach((id, i) => {
    const w = head.worlds.find((x: any) => x.id === id);
    w.status = 'Gas giant · ' + (i + 5) + 'th from the sun';
    w.facts[0][1] = i + 5 + 'th from the sun (' + (i + 1) + ' of the ten gas giants)';
  });
  assert.deepEqual(head, J(pp), 'whole parsed pack with the 20 values reversed equals the parent');
});

test('AU01-ORDER-01 visibility: reading states identical to parent except the ordinal', () => {
  const { p } = setup({ mode: 'all' });
  const all = p.spoilers.works.map((w: any) => w.id) as string[];
  const b7 = p.spoilers.works.filter((w: any) => w.bucket === 7).map((w: any) => w.id) as string[];
  assert.ok(b7.includes(AU01), 'AU01 in bucket 7');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ['legacy7', { mode: 'legacy', book: 7 }],
    ['legacy6', { mode: 'legacy', book: 6 }],
    ['bucket7', { mode: 'set', ids: b7 }],
    ['AU01 only', { mode: 'set', ids: [AU01] }],
    ['bucket7 minus AU01', { mode: 'set', ids: b7.filter(id => id !== AU01) }],
    ['all works', { mode: 'set', ids: all }],
    ['none', { mode: 'none' }],
  ];
  const shown: string[] = [];
  for (const [label, st] of states) {
    const now = observe(st);
    const old = observe(st, parentSrc);
    now.forEach((n: any, i: number) => {
      const o = old[i];
      assert.equal(n.hidden, o.hidden, label + ' ' + n.id + ': hidden');
      assert.equal(n.blurb, o.blurb, label + ' ' + n.id + ': blurb');
      if (n.hidden) return;
      assert.equal(n.status, o.status.replace(i + 5 + 'th', i + 4 + 'th'), label + ' ' + n.id + ': status');
      assert.deepEqual(
        n.facts,
        o.facts.map((f: string[], k: number) => (k === 0 ? [f[0], f[1].replace(i + 5 + 'th', i + 4 + 'th')] : f)),
        label + ' ' + n.id + ': facts',
      );
      assert.ok(n.status.includes(i + 4 + 'th from the sun'), label + ' ' + n.id + ': new ordinal shown');
    });
    const vis = now.filter((n: any) => !n.hidden).length;
    if (vis) shown.push(label + ' ' + vis + '/10');
  }
  console.log('AU01-ORDER visible states', shown.join(', '));
});
