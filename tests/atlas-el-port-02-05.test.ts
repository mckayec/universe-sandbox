/* EL-PORT-02..05 (ChatGPT implementation-review-5bdcf0a.md): on PR48 only, port four previously accepted
   Elantris corrections — widor.desc, e4.text (+ delete e4.site), e5.text, e2.text. The parent pack is rebuilt by
   reversing exactly these five leaf operations; the parsed packs must differ only there. The e4 placement change
   is checked with the ACTUAL engine selector span (var RREG … function eTitle) and the actual event-travel code:
   e4 now resolves to its world chain only and never selects a Chasm site. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const packSrc = fs.readFileSync(new URL('../public/atlas/packs/cosmere.js', import.meta.url), 'utf8');
const engine = fs.readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
const readingSrc = fs.readFileSync(new URL('../public/atlas/reading.js', import.meta.url), 'utf8');

const OLD = {
  widor:
    'Capital of Fjorden and of the Fjordell Empire, a northern port and the seat of the Wyrn, whose Derethi church sends gyorns like Hrathen east.',
  e4: 'Raoden works out that the Aons echo the shape of the land. The Chasm broke them, and one more line fixes them.',
  e5: 'The magic returns, the city is restored and an invasion is turned back.',
  e2: 'Sarene of Teod arrives to marry Raoden and finds him already ‘dead’. She stays and goes to war in the court.',
};
const NEW = {
  widor:
    'Capital of Fjorden and of the Fjordell Empire, a northern port and the seat of the Wyrn, whose Derethi church sends Hrathen west to Arelon.',
  e4: 'Raoden discovers that adding a line for the Chasm lets his Aons function again.',
  e5: 'Raoden adds the missing Chasm line to the city-scale Aon, restoring Elantris.',
  e2: 'Sarene reaches Kae and learns that Raoden is reported dead; their contract makes her his widow.',
};
const E4_HEAD = '{id: "e4", book: 1, world: "sel", title: "The land is part of the writing", text: ';
const E4_PARENT = '{id: "e4", book: 1, world: "sel", site: "chasm", title: "The land is part of the writing", text: ';

const parse = (src: string) => {
  const w: any = {};
  vm.runInNewContext(src, { window: w });
  return JSON.parse(JSON.stringify(w.ATLAS_PACKS.cosmere));
};
const ev = (p: any, id: string) => p.events.filter((e: any) => e.id === id);
const widor = (p: any) => p.worlds.find((w: any) => w.id === 'sel').sites.filter((s: any) => s.id === 'widor');

const once = (src: string, s: string) => assert.equal(src.split(s).length, 2, 'occurs once: ' + s.slice(0, 50));
const rebuildParent = () => {
  let s = packSrc;
  for (const k of Object.keys(NEW) as (keyof typeof NEW)[]) {
    once(s, `"${NEW[k]}"`);
    s = s.replace(`"${NEW[k]}"`, `"${OLD[k]}"`);
  }
  once(s, E4_HEAD);
  return s.replace(E4_HEAD, E4_PARENT);
};

test('EL-PORT-02..05: the four target fields equal the handoff strings; e4 has no site and no lm', () => {
  const p = parse(packSrc);
  assert.equal(widor(p).length, 1);
  assert.equal(widor(p)[0].desc, NEW.widor);
  for (const id of ['e2', 'e4', 'e5'] as const) {
    assert.equal(ev(p, id).length, 1);
    assert.equal(ev(p, id)[0].text, NEW[id]);
  }
  const e4 = ev(p, 'e4')[0];
  assert.ok(!('site' in e4), 'e4.site deleted');
  assert.ok(!('lm' in e4), 'e4 has no lm');
  assert.deepEqual([e4.world, e4.book, e4.title], ['sel', 1, 'The land is part of the writing']);
  assert.equal(ev(p, 'e5')[0].site, 'elantris');
  assert.equal(ev(p, 'e2')[0].site, 'kae');
  assert.ok(!('lm' in ev(p, 'e5')[0]) && !('lm' in ev(p, 'e2')[0]), 'e2/e5 keep absent lm');
  assert.equal(ev(p, 'e67').length, 0, 'EL10 target stays absent');
  for (const old of Object.values(OLD)) assert.ok(!packSrc.includes(old), 'old wording gone');
});

test('EL-PORT-02..05: reversing the five leaf operations restores the parent; nothing else differs', () => {
  const parentSrc = rebuildParent();
  const head = parse(packSrc);
  const parent = parse(parentSrc);
  assert.equal(ev(parent, 'e4')[0].site, 'chasm');
  widor(parent)[0].desc = NEW.widor;
  for (const id of ['e2', 'e5'] as const) ev(parent, id)[0].text = NEW[id];
  const pe4 = ev(parent, 'e4')[0];
  pe4.text = NEW.e4;
  delete pe4.site;
  assert.deepEqual(head, parent, 'whole parsed pack equal once the five operations are applied');
});

/* ---- actual selector span + actual openEvent travel ---- */
const cut = (a: string, b: string) => {
  const i = engine.indexOf(a);
  assert.ok(i >= 0, 'marker not found: ' + a);
  const j = engine.indexOf(b, i);
  assert.ok(j > i, 'end marker not found: ' + b);
  return engine.slice(i, j);
};
const rc: any = { window: {}, URLSearchParams, Set, Map, WeakMap };
vm.createContext(rc);
vm.runInContext(readingSrc, rc);
const RDG = rc.window.AtlasReading;

const ctxFor = (packText: string) => {
  const pack = parse(packText);
  const c: any = {
    RDG,
    CUM: true,
    K: { raw: pack },
    WORLDS: pack.worlds,
    S: { rd: { mode: 'all' }, book: 0 },
    console,
  };
  c.WORLD_BY = Object.fromEntries(pack.worlds.map((w: any) => [w.id, w]));
  vm.createContext(c);
  vm.runInContext('const firstOf=w=>w.first||(w.books&&w.books.length?Math.min(...w.books):1);', c);
  vm.runInContext(cut('var RREG=null;', 'function eTitle(e)'), c);
  vm.runInContext(cut('function eTitle(e)', 'function eText(e)'), c);
  vm.runInContext(cut('function eText(e)', '\n'), c);
  vm.runInContext('const evOk=' + cut('const evOk=', '\n').slice('const evOk='.length), c);
  c.pack = pack;
  c.evOk = vm.runInContext('evOk', c);
  c.worldChain = vm.runInContext('worldChain', c);
  c.RREG = vm.runInContext('RREG', c);
  return c;
};
const bucket7 = (pack: any) =>
  pack.spoilers.works.filter((w: any) => w.bucket === 7 && w.id !== 'elantris').map((w: any) => w.id);
const STATES = (pack: any): [string, any][] => [
  ['all', { mode: 'all' }],
  ['legacy1', { mode: 'legacy', book: 1 }],
  ['legacy7', { mode: 'legacy', book: 7 }],
  ['none', { mode: 'none' }],
  ['safe', { mode: 'safe' }],
  ['hope', { mode: 'set', ids: ['the-hope-of-elantris'] }],
  ['elantris', { mode: 'set', ids: ['elantris'] }],
  ['elantris+hope', { mode: 'set', ids: ['elantris', 'the-hope-of-elantris'] }],
  ['bucket7-no-elantris', { mode: 'set', ids: bucket7(pack) }],
  ['all-works', { mode: 'set', ids: pack.spoilers.works.map((w: any) => w.id) }],
];
const view = (c: any, id: string) => {
  const e = c.pack.events.find((x: any) => x.id === id);
  return { ok: c.evOk(e), title: c.eTitle(e), text: c.eText(e) };
};

test('EL-PORT actual selector: e2/e4/e5 visibility is unchanged vs parent; only the ported text differs', () => {
  const head = ctxFor(packSrc);
  const par = ctxFor(rebuildParent());
  assert.ok(head.RREG, 'registry valid');
  let shown = 0;
  let denied = 0;
  for (const [name, st] of STATES(head.pack)) {
    head.setRd(st);
    par.setRd(st);
    for (const id of ['e2', 'e4', 'e5'] as const) {
      const h = view(head, id);
      const p = view(par, id);
      assert.equal(h.ok, p.ok, `${name}/${id} visibility`);
      assert.equal(h.title, p.title, `${name}/${id} title`);
      if (p.text === '') assert.equal(h.text, '', `${name}/${id} hidden text stays hidden`);
      else assert.deepEqual([p.text, h.text], [OLD[id], NEW[id]], `${name}/${id} only ported text`);
    }
    const e4 = view(head, 'e4');
    if (e4.ok && e4.text) shown++;
    else denied++;
  }
  assert.deepEqual([shown, denied], [6, 4], '6 visible, 4 denied states');
});

test('EL-PORT-03 e4: world-only chain and no Chasm destination on travel', () => {
  const c = ctxFor(packSrc);
  const e4 = c.pack.events.find((x: any) => x.id === 'e4');
  const sel = c.WORLD_BY.sel;
  assert.deepEqual(c.evChain(e4).length, c.worldChain(sel).length + 1, 'world chain + event gate only');
  /* actual openEvent with travel: first already on Sel's surface */
  const calls: string[] = [];
  const t: any = {
    S: { view: 'world', sel: 'sel', site: null, ev: null },
    EV_BY: { e4 },
    WORLD_BY: c.WORLD_BY,
    RL: null,
    RREG: c.RREG,
    MOB: false,
    noSurface: () => false,
    selectSite: (id: string) => calls.push('site:' + id),
    laterSite: (id: string) => calls.push('later:' + id),
    setTimeout: (f: () => void) => f(),
    descend: () => calls.push('descend'),
    ascend: () => calls.push('ascend'),
    selectWorld: () => calls.push('world'),
    refreshAll: () => {},
    renderDossier: () => {},
    renderChron: () => {},
    dos: { querySelector: () => null },
  };
  vm.createContext(t);
  vm.runInContext(cut('function openEvent(id,travel)', '\n  const it=dos') + '\n}', t);
  vm.runInContext('openEvent("e4",true)', t);
  /* second path: on another world's surface, travel descends to Sel and must not schedule a site */
  t.S.sel = 'roshar';
  vm.runInContext('openEvent("e4",true)', t);
  assert.ok(!calls.some(x => x.startsWith('site:') || x.startsWith('later:')), 'no site selected: ' + calls);
  assert.equal(t.S.site, null);
  assert.ok(
    sel.sites.some((s: any) => s.id === 'chasm'),
    'Chasm site itself is unchanged and still exists',
  );
  assert.equal(
    c.pack.events.filter((e: any) => e.site === 'chasm').length,
    0,
    'no event points at the Chasm site any more',
  );
});
