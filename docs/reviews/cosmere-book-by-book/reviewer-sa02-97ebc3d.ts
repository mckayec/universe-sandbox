/* SA02-L23-PORT (ChatGPT sa02-final-handoff-2026-11-20.md): on PR48 only, remove events.e24.site ("narak") and
   replace events.e24.text with the exact qualified palace description. id, book, world, title, order and every other
   value are unchanged; no landmark, coordinate, parent metadata, gate or mapping added. Event visibility is checked
   with the ACTUAL engine selectors cut out of public/atlas/engine.js against the parent pack in every reading state. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = (p: string) => fs.readFileSync(new URL(({'public/atlas/engine.js':'engine.js','public/atlas/reading.js':'reading.js','public/atlas/packs/cosmere.js':process.env.NEGATIVE?'parent.js':'head.js'} as Record<string,string>)[p], import.meta.url), 'utf8');
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

const E24_NEW =
  'At the king’s palace in the warcamps, Kaladin speaks his Third Ideal while protecting Elhokar. Location is provisional, based on Tor.com’s chapter rereads rather than a checked edition of the novel.';
const E24_OLD_LINE =
  '{id: "e24", book: 5, world: "roshar", site: "narak", title: "Kaladin’s Third Ideal", text: "Kaladin swears to protect even those he hates, and flies."}';
const E24_NEW_LINE = '{id: "e24", book: 5, world: "roshar", title: "Kaladin’s Third Ideal", text: "' + E24_NEW + '"}';
const WOR = 'words-of-radiance';
const WOK = 'the-way-of-kings';

/* the actual parent pack (af49e0a): only the e24 record line differs */
const parentSrc = fs.readFileSync(new URL('parent.js', import.meta.url), 'utf8');

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
const evSeen = (st: St, src = packSrc) => {
  const { c } = setup(st, src);
  return J(vm.runInContext(`EVENTS.filter(e=>e.world==='roshar').map(e=>[e.id,!!evOk(e)])`, c));
};

test('SA02-L23-PORT payload: e24 has no site and the exact qualified text; whole pack otherwise equal to the parent', () => {
  const { p } = setup({ mode: 'all' });
  const { p: pp } = setup({ mode: 'all' }, parentSrc);
  const e = p.events.find((x: any) => x.id === 'e24');
  const ep = pp.events.find((x: any) => x.id === 'e24');
  assert.deepEqual(J(e), {
    id: 'e24',
    book: 5,
    world: 'roshar',
    title: 'Kaladin’s Third Ideal',
    text: E24_NEW,
  });
  assert.ok(!('site' in e), 'e24 has no site');
  assert.equal(ep.site, 'narak', 'parent control pins narak');
  assert.equal(ep.text, 'Kaladin swears to protect even those he hates, and flies.', 'parent control old text');
  assert.deepEqual(
    J(p.events.map((x: any) => x.id)),
    J(pp.events.map((x: any) => x.id)),
    'event ids and order unchanged',
  );
  const strip = (pk: any) => {
    const x = J(pk);
    const r = x.events.find((y: any) => y.id === 'e24');
    delete r.site;
    delete r.text;
    return x;
  };
  assert.deepEqual(strip(p), strip(pp), 'whole pack minus e24.site/e24.text equals the parent');
  for (const x of ['protect even those he hates', 'and flies.'])
    assert.ok(!packSrc.includes(x), 'old copy absent: ' + x);
  assert.equal(packSrc.split(E24_NEW).length, 2, 'new text once');
  const r = p.worlds.find((w: any) => w.id === 'roshar');
  assert.ok(!r.sites.some((s: any) => /palace/i.test(s.id)), 'no invented palace site');
});

test('SA02-L23-PORT visibility: Roshar events identical to the parent across All, legacy, eligible and insufficient sets', () => {
  assert.ok(bucket(5).includes(WOR), 'Words of Radiance is a bucket-5 work');
  const states: [string, St][] = [
    ['All', { mode: 'all' }],
    ['legacy #book=5', { mode: 'legacy', book: 5 }],
    ['legacy #book=10', { mode: 'legacy', book: 10 }],
    ['legacy #book=4', { mode: 'legacy', book: 4 }],
    ['legacy #book=1', { mode: 'legacy', book: 1 }],
    ['Words of Radiance only', { mode: 'set', ids: [WOR] }],
    ['Way of Kings + Words of Radiance', { mode: 'set', ids: [WOK, WOR] }],
    ['bucket 5', { mode: 'set', ids: bucket(5) }],
    [
      'buckets 1-4 (no Words of Radiance)',
      { mode: 'set', ids: [...bucket(1), ...bucket(2), ...bucket(3), ...bucket(4)] },
    ],
    ['Way of Kings only', { mode: 'set', ids: [WOK] }],
    ['other work only (mistborn-the-final-empire)', { mode: 'set', ids: ['mistborn-the-final-empire'] }],
    ['nothing read', { mode: 'set', ids: [] }],
  ];
  const out: Record<string, boolean> = {};
  for (const [label, st] of states) {
    const a = evSeen(st);
    assert.deepEqual(a, evSeen(st, parentSrc), label + ': same as parent');
    out[label] = a.find((x: [string, boolean]) => x[0] === 'e24')[1];
  }
  /* Roshar itself needs The Way of Kings in per-work modes (unchanged parent behaviour), so Words of Radiance
     alone / bucket 5 alone withhold e24 exactly as at the parent. */
  const shown = ['All', 'legacy #book=5', 'legacy #book=10', 'Way of Kings + Words of Radiance'];
  for (const [l] of states)
    assert.equal(out[l], shown.includes(l), l + (shown.includes(l) ? ' shows' : ' withholds') + ' e24');
});

test('SA02-L23-PORT actual openEvent travel branches: head requests no site; parent targets Narak', () => {
 const fn=engine.slice(engine.indexOf('function openEvent('),engine.indexOf('/* book filter */',engine.indexOf('function openEvent(')));
 for(const [label,view,sel,rreg] of [['same-world','world','roshar',true],['different-world registry','world','sel',true],['different-world legacy','world','sel',false]] as const){
  for(const [tag,src,expected] of [['head',packSrc,[]],['parent',parentSrc,['narak']]] as const){
   const {p}=setup({mode:'all'},src);const calls:string[]=[];
   const c:any={S:{view,sel,site:null,ev:null},EV_BY:Object.fromEntries(p.events.map((e:any)=>[e.id,e])),WORLD_BY:Object.fromEntries(p.worlds.map((w:any)=>[w.id,w])),RL:false,RREG:rreg,MOB:false,noSurface:()=>false,selectSite:(id:string)=>calls.push(id),laterSite:(id:string)=>calls.push(id),setTimeout:(fn:()=>void)=>fn(),descend:()=>{},refreshAll:()=>{},renderDossier:()=>{},renderChron:()=>{},dos:{querySelector:()=>null}};
   vm.runInNewContext(fn,c);c.openEvent('e24',true);
   assert.deepEqual(calls,[...expected],label+' '+tag);assert.equal(c.S.ev,'e24');
  }
 }
});
