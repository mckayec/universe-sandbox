import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// The REAL Cosmere reading registry (public/atlas/packs/cosmere.js spoilers.works/presets), from ChatGPT's R-A
// bibliography handoff (docs/reviews/cosmere-book-by-book/bibliography-handoff-2026-11-10.md), against the actual
// helpers in public/atlas/reading.js and reading-ui.js.
const ctx: { window: Record<string, any>; URLSearchParams: typeof URLSearchParams } = {
  window: {},
  URLSearchParams,
};
for (const f of ['../public/atlas/reading.js', '../public/atlas/reading-ui.js', '../public/atlas/packs/cosmere.js'])
  vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const R = ctx.window.AtlasReading;
const UI = ctx.window.AtlasReadingUI;
const pack = ctx.window.ATLAS_PACKS.cosmere;
const reg = R.normRegistry(pack);
const plain = (v: unknown) => JSON.parse(JSON.stringify(v));
// Same keys as engine.js gateOf(): worlds by `first`, sites by min(books) | book | world first, events by `book`.
const own = (o: any) => Object.prototype.hasOwnProperty.call(o, 'gate');
const gOf = (o: any, k: number) => (own(o) ? R.compileGate(o.gate, reg) : R.recordGate({ book: k }, reg));
const wFirst = (w: any) => w.first ?? Math.min(...(w.books || []));
const sKey = (s: any, w: any) => (s.books && s.books.length ? Math.min(...s.books) : s.book || wFirst(w));

const BUCKET_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 1,
  4: 1,
  5: 1,
  6: 3,
  7: 13,
  8: 2,
  9: 1,
  10: 1,
  11: 3,
  12: 3,
};
const OT = ['mistborn-the-final-empire', 'mistborn-the-well-of-ascension', 'mistborn-the-hero-of-ages'];
const WW = ['the-alloy-of-law', 'shadows-of-self', 'the-bands-of-mourning', 'the-lost-metal'];
const SL = [
  'the-way-of-kings',
  'words-of-radiance',
  'edgedancer',
  'oathbringer',
  'dawnshard',
  'rhythm-of-war',
  'wind-and-truth',
];
const WS = ['white-sand-volume-1', 'white-sand-volume-2', 'white-sand-volume-3', 'white-sand-omnibus'];
const AU = 'arcanum-unbounded-system-essays-and-maps';

test('registry is valid: 33/33 works, 12/12 nonempty buckets with the handoff counts', () => {
  assert.equal(reg.ok, true, reg.errors.join('; '));
  assert.equal(reg.works.size, 33);
  assert.equal(reg.badBuckets.size, 0);
  assert.deepEqual(
    plain(Object.fromEntries(Array.from(reg.buckets.entries()).map(([k, v]: any) => [k, v.length]))),
    plain(BUCKET_COUNTS),
  );
  for (const k of Object.keys(pack.books)) assert.ok(reg.buckets.has(Number(k)), 'bucket ' + k);
});

test('registry matches the R-A payload row for row (id, title, year, bucket)', () => {
  const bib = JSON.parse(
    readFileSync(new URL('../docs/reviews/cosmere-book-by-book/bibliography-2026-11-10.json', import.meta.url), 'utf8'),
  );
  assert.equal(bib.works.length, 33);
  for (const w of bib.works) {
    const r = reg.works.get(w.id);
    assert.ok(r, w.id);
    assert.equal(r.title, w.title, w.id);
    assert.equal(r.bucket, w.bucket, w.id);
    assert.equal(r.y, w.y === undefined ? null : w.y, w.id);
  }
  assert.deepEqual(plain(pack.spoilers.presets), plain(bib.presets));
});

test('unknown and qualified years: SEL02/TA04 unverified, FD01 catalogue listing', () => {
  assert.equal(R.yearLabel(reg.works.get('the-hope-of-elantris')), 'publication year unverified');
  assert.equal(R.yearLabel(reg.works.get('white-sand-omnibus')), 'publication year unverified');
  assert.equal(R.yearLabel(reg.works.get('the-fires-of-december')), '2026, catalogue listing');
  assert.equal(R.yearLabel(reg.works.get('elantris')), '2005');
  const m = UI.model(R, { mode: 'none' }, reg, {});
  const hope = m.groups.flatMap((g: any) => g.works).find((w: any) => w.id === 'the-hope-of-elantris');
  assert.equal(hope.year, 'publication year unverified');
  // A year never gates: the bucket-7 fallback still requires the held works.
  assert.ok(reg.buckets.get(7).includes('the-hope-of-elantris'));
  assert.ok(reg.buckets.get(7).includes('white-sand-omnibus'));
});

test('three frozen presets select exactly their strict prefixes and nothing else', () => {
  const seqs: Record<string, string[]> = {
    'mistborn-original-trilogy': OT,
    'mistborn-wax-and-wayne': WW,
    'stormlight-with-novellas': SL,
  };
  for (const [pid, seq] of Object.entries(seqs)) {
    assert.equal(reg.presets.get(pid).latest, 1);
    seq.forEach((w, i) => {
      const st = R.choosePreset(reg, pid, w);
      assert.deepEqual(
        plain(Array.from(R.readSetOf(st, reg)).sort()),
        plain(seq.slice(0, i + 1).sort()),
        pid + ':' + w,
      );
    });
  }
  const all = new Set([...OT, ...WW, ...SL]);
  for (const id of ['mistborn-secret-history', 'the-fires-of-december', 'warbreaker', AU, 'isles-of-the-emberdark'])
    assert.ok(!all.has(id), id + ' in no preset');
  assert.equal(R.choosePreset(reg, 'mistborn-original-trilogy', 'mistborn-secret-history'), null);
});

test('AU01 essays/maps and the four White Sand units are independent checkboxes', () => {
  const au = R.toggleWork({ mode: 'none' }, AU, reg);
  assert.deepEqual(plain(au.ids), [AU]);
  let st: any = { mode: 'none' };
  for (const w of WS) st = R.toggleWork(st, w, reg);
  assert.deepEqual(plain(st.ids), WS);
  const om = R.toggleWork({ mode: 'none' }, 'white-sand-omnibus', reg);
  assert.deepEqual(plain(om.ids), ['white-sand-omnibus']);
});

test('bucket fallback: a whole bucket shows its records; missing one work hides them (24/24)', () => {
  for (const k of Object.keys(BUCKET_COUNTS).map(Number)) {
    const g = R.recordGate({ book: k }, reg);
    assert.equal(g.unreviewed, true);
    const full = new Set(reg.buckets.get(k));
    assert.equal(R.visible([g], full), true, 'bucket ' + k + ' complete');
    const less = new Set(reg.buckets.get(k).slice(1));
    assert.equal(R.visible([g], less), false, 'bucket ' + k + ' missing one');
  }
});

test('all 33 works selected = every pack record visible, as in the All view', () => {
  const everything = new Set(reg.order);
  let n = 0;
  for (const w of pack.worlds) {
    const wc = [gOf(w, wFirst(w))];
    assert.equal(R.visible(wc, everything), true, w.id);
    n++;
    for (const s of w.sites || []) {
      assert.equal(R.visible(wc.concat([gOf(s, sKey(s, w))]), everything), true, w.id + '/' + s.id);
      n++;
    }
  }
  for (const e of pack.events) {
    assert.equal(R.visible([gOf(e, e.book)], everything), true, e.id);
    n++;
  }
  assert.ok(n > 50);
  assert.equal(R.validState(R.parseReadingParams('#read=' + reg.order.join(','), reg, 12).state, reg, 12), true);
});

test('R-B candidates: e6/e12 narrow copy + own gate, ancestors stay restrictive', () => {
  const e6 = pack.events.find((e: any) => e.id === 'e6');
  const e12 = pack.events.find((e: any) => e.id === 'e12');
  assert.equal(e6.text, 'In Luthadel, Kelsier meets Vin and recognizes her as Mistborn.');
  assert.equal(e6.title, 'Kelsier meets Vin');
  assert.equal(e12.text, 'Sazed ascends and remakes the world.');
  const scadrial = pack.worlds.find((w: any) => w.id === 'scadrial');
  const luthadel = (scadrial.sites || []).find((s: any) => s.id === 'luthadel');
  assert.equal(scadrial.gate, undefined);
  assert.equal(luthadel.gate, undefined);
  const gW = gOf(scadrial, wFirst(scadrial));
  const chain6 = [gW, gOf(luthadel, sKey(luthadel, scadrial)), gOf(e6, e6.book)];
  const chain12 = [gW, gOf(e12, e12.book)];
  assert.equal(gW.unreviewed, true);
  assert.equal(gOf(e6, e6.book).unreviewed, false);
  assert.equal(R.anyUnreviewed(chain6), true);
  // own gate passes but the unreviewed parents still need MB01-03
  assert.equal(R.visible([R.recordGate(e6, reg)], new Set([OT[0]])), true);
  assert.equal(R.visible(chain6, new Set([OT[0]])), false);
  assert.equal(R.visible(chain12, new Set([OT[2]])), false);
  assert.equal(R.visible(chain6, new Set(OT)), true);
  assert.equal(R.visible(chain12, new Set(OT)), true);
  // strict prefix: MB01 only via the preset still hides e6
  assert.equal(R.visible(chain6, R.readSetOf(R.choosePreset(reg, 'mistborn-original-trilogy', OT[0]), reg)), false);
  // e7 stays on bucket fallback
  assert.equal(
    gOf(
      pack.events.find((e: any) => e.id === 'e7'),
      2,
    ).unreviewed,
    true,
  );
});
