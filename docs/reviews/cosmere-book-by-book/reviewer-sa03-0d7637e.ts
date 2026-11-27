/* Independent SA03-DW06-PORT review: Node 24+, node --test this-file.ts.
   Set SA03_INPUT_DIR to a directory containing the exact GitHub UTF-8 inputs listed below:
   head.js (cosmere.js @ 0d7637e8973187afa3e8c58552a197d48c315b03),
   parent.js (cosmere.js @ 97ebc3d1c4d0f7e21d486dc2afdac842e4dc19fb),
   engine.js, reading.js, test.ts (original tests/atlas-sa03-dw06.test.ts) @ head.
   SA03_NEGATIVE=1 substitutes the actual parent as candidate: expect payload FAIL, visibility PASS.
   Adapted from the submitted test; actual parent and blob checks replace reconstructed evidence.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import path from 'node:path';

const dir = process.env.SA03_INPUT_DIR || '.';
const manifest: Record<string,string> = {
  "head.js": "ae2a877eb9a667c332e0f5b96ea22c89b5c91f35",
  "parent.js": "ebe9c3948fe288723aac8093e9fc5eabbee65f91",
  "engine.js": "0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0",
  "reading.js": "4d9bc177294e5e33accf6f19825ef467f0bb90d4",
  "test.ts": "c29369ee3cd1981379c17e8a4b87cb700a80a482"
};
for (const [n, expected] of Object.entries(manifest)) {
  const b = fs.readFileSync(path.join(dir,n));
  const actual = crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
  assert.equal(actual,expected,n+' Git blob');
}
console.log('Verified 5/5 exact Git blobs');
const names: Record<string,string> = {'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.SA03_NEGATIVE ? 'parent.js':'head.js'};
const read = (p: string) => fs.readFileSync(path.join(dir,names[p]),'utf8');
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

/* Read actual fetched parent, not a text reversal of the candidate. */
const parentSrc = fs.readFileSync(path.join(dir,'parent.js'),'utf8');

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
