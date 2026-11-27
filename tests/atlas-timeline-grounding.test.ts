import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Per-relationship grounding (public/atlas/timeline-grounding.js; timeline checkpoints 15 and 17). A card's citation
// is never promoted into a relationship source on its own: only an accepted, per-row review whose locators lie inside
// the passage both endpoint cards cite. Checkpoint 17 (TL-R14/TL-R15): the parser fails closed and the intersection
// is complete.
const ctx: { window: Record<string, any> } = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../public/atlas/timeline-grounding.js', import.meta.url), 'utf8'), ctx);
const G = ctx.window.AtlasTimelineGrounding;
const U = 'https://www.churchofjesuschrist.org/study/scriptures/';
const c = (t: string, path = 'dc-testament/dc/52') => ({ t, u: U + path + '?lang=eng' });
type Loc = { t: string; u: string };

test('parseLocator reads components and validates the label against the URL', () => {
  const p = G.parseLocator(c('2 Nephi 20:5–19, 28–32', 'bofm/2-ne/20'));
  assert.equal(p.ok, true);
  assert.equal(p.parts.length, 1);
  assert.equal(p.parts[0].key, 'bofm/2-ne#20');
  assert.deepEqual([...p.parts[0].verses], [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 28, 29, 30, 31, 32]);
  const range = G.parseLocator(c('Genesis 16–17', 'ot/gen/16'));
  assert.deepEqual(
    [...range.parts.map((x: { key: string; kind: string }) => x.kind + ' ' + x.key)],
    ['chapter ot/gen#16', 'chapter ot/gen#17'],
  );
  const h = G.parseLocator(c('D&C 52 heading'));
  assert.deepEqual([...h.parts.map((x: { kind: string }) => x.kind)], ['heading']);
  const mixed = G.parseLocator(c('D&C 117 heading, 1, 10', 'dc-testament/dc/117'));
  assert.deepEqual([...mixed.parts.map((x: { kind: string }) => x.kind)], ['heading', 'verses']);
  assert.deepEqual([...mixed.parts[1].verses], [1, 10]);
  assert.deepEqual([...G.parseLocator(c('D&C 52:36–37 and 40')).parts[0].verses], [36, 37, 40]);
  assert.deepEqual([...G.parseLocator(c('Joseph Smith—History 1:3–4, 7', 'pgp/js-h/1')).parts[0].verses], [3, 4, 7]);
  const doc = G.parseLocator(c('Testimony of Eight Witnesses', 'bofm/eight'));
  assert.deepEqual([doc.parts[0].kind, doc.parts[0].key], ['doc', 'bofm/eight']);
  assert.equal(G.parseLocator(c('Bible Dictionary: Galilee, Sea of', 'bd/galilee-sea-of')).ok, true);
  assert.equal(G.parseLocator(c('Bible Dictionary: Shushan', 'bd/shushan')).ok, true);
});

test('parseLocator fails closed on mismatched identities, residue and invalid ranges', () => {
  const no = (loc: Loc, why: RegExp) => {
    const p = G.parseLocator(loc);
    assert.equal(p.ok, false, loc.t);
    assert.match(p.why, why, loc.t);
  };
  no({ t: 'no url', u: '' }, /official/);
  no(c('Mosiah 3:4', 'bofm/mosiah/5'), /chapter does not match/);
  no(c('D&C 51:1'), /chapter does not match/);
  no(c('Genesis 52:37'), /book does not match/);
  no({ t: 'D&C 52:37', u: 'https://unrelated.invalid/study/scriptures/dc-testament/dc/52?lang=eng' }, /official/);
  no({ t: 'D&C 52:37', u: 'http://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/52' }, /official/);
  no(c('D&C 52:38–37'), /verse list/);
  no(c('D&C 52:0'), /verse list/);
  no(c('D&C 52:37a'), /verse list/);
  no(c('D&C 52:37 heading'), /verse list/);
  no(c('Isaiah 11 heading/notes', 'ot/isa/11'), /unsupported/);
  no(c('Genesis 12–11', 'ot/gen/12'), /chapter range/);
  no(c('Frobnicate 52:1'), /unknown book/);
  no(c('Testimony of Three Witnesses', 'bofm/eight'), /document title/);
  no(c('Book of Mormon front matter', 'bofm/eight'), /unsupported document/);
  // a document is never an invented chapter 0, and a chapter URL never stands for a document
  no(c('Testimony of Eight Witnesses', 'bofm/eight/1'), /unknown book|no chapter/);
});

test('groundLink classes relationships by the complete shared passage', () => {
  const sv = G.groundLink([c('D&C 52:37')], [c('D&C 52:37')]);
  assert.equal(sv.cls, 'shared-verse');
  assert.deepEqual([...sv.shared[0].verses], [37]);
  const cls = (a: Loc[], b: Loc[]) => G.groundLink(a, b).cls;
  assert.equal(
    cls([c('D&C 124:127', 'dc-testament/dc/124')], [c('D&C 124:132', 'dc-testament/dc/124')]),
    'same-chapter',
  );
  assert.equal(cls([c('Mosiah 12:1–37', 'bofm/mosiah/12')], [c('Exodus 2–40', 'ot/ex/2')]), 'cross-text');
  assert.equal(cls([], [c('D&C 52:37')]), 'no-locator');
  assert.equal(cls([c('D&C 8', 'dc-testament/dc/8')], [c('D&C 8:1–4', 'dc-testament/dc/8')]), 'shared-chapter');
  // a heading is its own passage: it does not ground against verses or the chapter text
  assert.equal(cls([c('D&C 4 heading', 'dc-testament/dc/4')], [c('D&C 4:1', 'dc-testament/dc/4')]), 'same-chapter');
  assert.equal(cls([c('D&C 4 heading', 'dc-testament/dc/4')], [c('D&C 4', 'dc-testament/dc/4')]), 'same-chapter');
  assert.equal(
    cls([c('D&C 4 heading', 'dc-testament/dc/4')], [c('D&C 4 heading', 'dc-testament/dc/4')]),
    'shared-chapter',
  );
  const fm = [c('Testimony of Eight Witnesses', 'bofm/eight')];
  assert.equal(cls(fm, fm), 'shared-chapter');
  // an invalid citation contributes nothing and is reported, never widened
  const g = G.groundLink([c('D&C 51:1')], [c('D&C 52:37')]);
  assert.equal(g.cls, 'no-locator');
  assert.equal(g.invalid.length, 1);
  assert.equal(g.invalid[0].side, 'from');
});

// The checkpoint-15 review fixtures: records a and b, an unsourced context edge a>b, one proposed locator.
function pair(aSrc: Loc[], bSrc: Loc[]) {
  return {
    records: [
      { id: 'a', label: 'A', src: aSrc },
      { id: 'b', label: 'B', src: bSrc },
    ],
    edges: [{ id: 'a>b', from: 'a', to: 'b', type: 'context', label: null as string | null, src: [], cardSrc: [] }],
    sourceVersion: 'fixture',
  };
}
type Model = ReturnType<typeof pair>;
const accept = (src: Loc[], extra: Record<string, unknown> = {}) => ({
  v: 1,
  state: 'accepted',
  mode: 'shared',
  from: 'a',
  to: 'b',
  type: 'context',
  claim: 'fixture claim',
  basis: 'fixture rationale',
  sourceVersion: 'fixture',
  supportRequired: false,
  src,
  ...extra,
});
// a reviewer's row bound to the model as it is now (TL-R16); `binding` in the entry is kept as given
const bind = (m: Model, entry: Record<string, any>) =>
  'binding' in entry ? entry : { ...entry, binding: G.bindingFor(m, 'a>b', entry) };
const apply = (m: Model, entry: Record<string, any>) => G.applyEdgeSources(m, { 'a>b': bind(m, entry) });

const FALSE_ACCEPTANCES: [string, Loc[], Loc[], Loc][] = [
  ['1 endpoint chapter mismatch', [c('D&C 51:1')], [c('D&C 52:37')], c('D&C 52:37')],
  ['2 mismatched proposed chapter', [c('D&C 52')], [c('D&C 52')], c('D&C 51:1')],
  [
    '3 arbitrary origin',
    [c('D&C 52:37')],
    [c('D&C 52:37')],
    { t: 'D&C 52:37', u: 'https://unrelated.invalid/study/scriptures/dc-testament/dc/52?lang=eng' },
  ],
  ['4 label book and URL book disagree', [c('D&C 52:37')], [c('D&C 52:37')], c('Genesis 52:37')],
  ['5 heading evidence for a verse', [c('D&C 52 heading')], [c('D&C 52 heading')], c('D&C 52:999')],
  ['6 proposal adds an uncited heading', [c('D&C 52:37')], [c('D&C 52:37')], c('D&C 52 heading, 37')],
  ['7 "and 40" is not dropped', [c('D&C 52:36–37')], [c('D&C 52:36–37')], c('D&C 52:36–37 and 40')],
  ['8 descending range', [c('D&C 52:38–37')], [c('D&C 52:1')], c('D&C 52:1')],
];

test('TL-R14/TL-R15: the eight false acceptances all reject, mechanically and with a full review', () => {
  for (const [name, a, b, loc] of FALSE_ACCEPTANCES) {
    const m = pair(a, b);
    assert.equal(G.eligibility(m, 'a>b', [loc]).ok, false, name);
    const out = apply(m, accept([loc]));
    assert.equal(out.promoted.length, 0, name);
    assert.equal(out.rejected[0].eligible, false, name);
    assert.equal(m.edges[0].src.length, 0, name);
    // the legacy entry shape ({ src } only) rejects too
    assert.equal(G.applyEdgeSources(pair(a, b), { 'a>b': { src: [loc] } }).promoted.length, 0, name);
  }
});

test('TL-R15: the two false rejections are mechanically eligible but not semantically approved', () => {
  const secondary = pair(
    [c('D&C 52:37'), c('D&C 8', 'dc-testament/dc/8')],
    [c('D&C 52:37'), c('D&C 8:1–4', 'dc-testament/dc/8')],
  );
  const g = G.groundLink(secondary.records[0].src, secondary.records[1].src);
  assert.equal(g.cls, 'shared-verse');
  assert.deepEqual([...g.shared.map((s: { key: string }) => s.key)].sort(), [
    'dc-testament/dc#52',
    'dc-testament/dc#8',
  ]);
  const ch8 = c('D&C 8:1', 'dc-testament/dc/8');
  assert.equal(G.eligibility(secondary, 'a>b', [ch8]).ok, true);
  assert.equal(G.eligibility(secondary, 'a>b', [c('D&C 8:5', 'dc-testament/dc/8')]).ok, false);
  const mixed = pair([c('D&C 52 heading, 37')], [c('D&C 52 heading')]);
  assert.equal(G.eligibility(mixed, 'a>b', [c('D&C 52 heading')]).ok, true);
  assert.equal(G.eligibility(mixed, 'a>b', [c('D&C 52:37')]).ok, false);
  // eligibility alone promotes nothing
  for (const [m, loc] of [
    [secondary, ch8],
    [mixed, c('D&C 52 heading')],
  ] as const) {
    const out = G.applyEdgeSources(m, { 'a>b': { src: [loc] } });
    assert.equal(out.promoted.length, 0);
    assert.equal(out.rejected[0].eligible, true);
    assert.match(out.rejected[0].why, /review entry/);
  }
  const ok = apply(secondary, accept([ch8]));
  assert.deepEqual([...ok.promoted], ['a>b']);
  assert.equal(secondary.edges[0].locator, 'D&C 8:1');
});

test('promotion requires a current, bound, version-1 acceptance', () => {
  const loc = c('D&C 52:37');
  const tryWith = (extra: Record<string, unknown>) => {
    const m = pair([loc], [loc]);
    return apply(m, accept([loc], extra));
  };
  assert.equal(tryWith({}).promoted.length, 1);
  const reasons: [Record<string, unknown>, RegExp][] = [
    [{ v: 2 }, /version-1/],
    [{ state: 'deferred' }, /deferred/],
    [{ state: 'rejected' }, /rejected/],
    [{ from: 'b', to: 'a' }, /direction/],
    [{ type: 'same-entity' }, /type/],
    [{ claim: ' ' }, /claim/],
    [{ basis: '' }, /rationale/],
    [{ sourceVersion: undefined }, /source version/],
    [{ mode: undefined }, /mode is not stated/],
    [{ binding: undefined }, /binding is stale or missing/],
  ];
  for (const [extra, why] of reasons) {
    const out = tryWith(extra);
    assert.equal(out.promoted.length, 0, String(why));
    assert.match(out.rejected[0].why, why);
  }
});

test('every call reconciles: a revoked or rejected review leaves no stale source', () => {
  const loc = c('D&C 52:37');
  const m = pair([loc], [loc]);
  assert.equal(apply(m, accept([loc])).promoted.length, 1);
  assert.equal(m.edges[0].src.length, 1);
  assert.equal(m.edges[0].grounding.claim, 'fixture claim');
  const revoked = apply(m, accept([loc], { state: 'rejected' }));
  assert.deepEqual([...revoked.revoked], ['a>b']);
  assert.equal(m.edges[0].src.length, 0);
  assert.equal(m.edges[0].locator, null);
  assert.equal(m.edges[0].grounding, undefined);
  apply(m, accept([loc]));
  assert.deepEqual([...G.applyEdgeSources(m, {}).revoked], ['a>b']);
  assert.equal(m.edges[0].src.length, 0);
});

test('independent evidence mode for cross-text relationships', () => {
  const mos = [c('Mosiah 14:1–12', 'bofm/mosiah/14')];
  const isa = [c('Isaiah 53:1–12', 'ot/isa/53')];
  const m = pair(mos, isa);
  assert.equal(G.groundLink(mos, isa).cls, 'cross-text');
  const ev = { from: [c('Mosiah 14:5', 'bofm/mosiah/14')], to: [c('Isaiah 53:5', 'ot/isa/53')] };
  const entry = accept([], { mode: 'independent', evidence: ev, scope: 'quotation; wording compared verse by verse' });
  const out = apply(m, entry);
  assert.deepEqual([...out.promoted], ['a>b']);
  assert.equal(m.edges[0].locator, 'Mosiah 14:5; Isaiah 53:5');
  assert.equal(m.edges[0].grounding.mode, 'independent');
  const fail = (e: Record<string, unknown>, why: RegExp) => {
    const r = apply(pair(mos, isa), e);
    assert.equal(r.promoted.length, 0);
    assert.match(r.rejected[0].why, why);
  };
  fail({ ...entry, scope: '' }, /scope/);
  fail({ ...entry, evidence: { from: ev.from } }, /to locator/);
  fail({ ...entry, evidence: { from: [c('Mosiah 15:1', 'bofm/mosiah/15')], to: ev.to } }, /not cited by that card/);
  fail({ ...entry, evidence: { from: ev.from, to: [c('Isaiah 54:1', 'ot/isa/53')] } }, /invalid/);
});

test('ledger lists every edge once with its class; travel legs keep their own class', () => {
  const m = {
    records: [
      { id: 'a', label: 'Ryder', src: [c('D&C 52:37')] },
      { id: 'b', label: 'Basset', src: [c('D&C 52:37'), c('D&C 52 heading')] },
      { id: 'm', label: 'Moses', src: [c('Exodus 2–40', 'ot/ex/2')] },
      { id: 'k', label: 'Abinadi', src: [c('Mosiah 12:1–37', 'bofm/mosiah/12')] },
    ],
    edges: [
      { id: 'x:a>b', from: 'a', to: 'b', type: 'context', src: [], cardSrc: [] },
      { id: 'x:k>m', from: 'k', to: 'm', type: 'context', src: [], cardSrc: [] },
      { id: 't:1', from: 'a', to: 'b', type: 'travel', src: [], cardSrc: [] },
    ],
  };
  const rows = G.ledger(m);
  assert.equal(rows.length, 3);
  assert.deepEqual([...rows.map((r: { cls: string }) => r.cls)], ['shared-verse', 'cross-text', 'travel']);
  assert.ok(
    m.edges.every((e: { src: unknown[] }) => e.src.length === 0),
    'ledger never promotes',
  );
});

// ---------- checkpoint 18: TL-R14 residual and TL-R16 ----------

test('TL-R14: dictionary titles must name the URL entry in full; chapter zero is rejected', () => {
  const no = (loc: Loc, why: RegExp) => {
    const p = G.parseLocator(loc);
    assert.equal(p.ok, false, loc.t);
    assert.match(p.why, why, loc.t);
  };
  // shares only the first word with the entry: rejected (checkpoint 17 accepted these)
  no(c('Bible Dictionary: Galilee', 'bd/galilee-sea-of'), /dictionary entry/);
  no(c('Bible Dictionary: Galilee, Lake of', 'bd/galilee-sea-of'), /dictionary entry/);
  no(c('Bible Dictionary: Shushan Palace', 'bd/shushan'), /dictionary entry/);
  // a title whose slug differs needs a validated full-heading alias: only "Elath or Eloth" → bd/elath is approved
  assert.equal(G.parseLocator(c('Bible Dictionary: Elath or Eloth', 'bd/elath')).ok, true);
  assert.equal(G.parseLocator(c('Bible Dictionary: Elath', 'bd/elath')).ok, true);
  no(c('Bible Dictionary: Elath or', 'bd/elath'), /dictionary entry/);
  no(c('Bible Dictionary: Eloth', 'bd/elath'), /dictionary entry/);
  no(c('Bible Dictionary: Elath or Eloth', 'bd/eloth'), /dictionary entry/);
  no(c('Bible Dictionary: Elath or Eloth', 'bd/galilee-sea-of'), /dictionary entry/);
  // a dictionary title never names a non-dictionary URL
  no(c('Bible Dictionary: Shushan', 'ot/neh/1'), /unknown book|chapter/);
  // chapter zero, in the URL or in the label
  no(c('D&C 0', 'dc-testament/dc/0'), /official/);
  no(c('D&C 0:1', 'dc-testament/dc/0'), /official/);
  no(c('D&C 0', 'dc-testament/dc/1'), /chapter zero/);
  no(c('Genesis 0–2', 'ot/gen/1'), /chapter zero/);
  assert.equal(G.groundLink([c('D&C 0', 'dc-testament/dc/0')], [c('D&C 0', 'dc-testament/dc/0')]).cls, 'no-locator');
});

test('TL-R16: unknown modes are rejected, never treated as shared', () => {
  const loc = c('D&C 52:37');
  for (const mode of ['paired', 'Shared', 'shared ', 'independant']) {
    const m = pair([loc], [loc]);
    const out = apply(m, accept([loc], { mode }));
    assert.equal(out.promoted.length, 0, mode);
    assert.equal(out.rejected[0].eligible, false, mode);
    assert.match(out.rejected[0].why, /unsupported review mode/, mode);
    assert.equal(m.edges[0].grounding, undefined, mode);
  }
});

test('TL-R16: a row binds the edge, endpoints and sources as they are now', () => {
  const loc = c('D&C 52:37');
  const fresh = () => pair([loc], [loc]);
  const reviewed = (() => {
    const m = fresh();
    return bind(m, accept([loc]));
  })();
  assert.equal(G.applyEdgeSources(fresh(), { 'a>b': reviewed }).promoted.length, 1);
  const stale = (change: (m: Model) => void, why: RegExp, name: string) => {
    const m = fresh();
    change(m);
    const out = G.applyEdgeSources(m, { 'a>b': reviewed });
    assert.equal(out.promoted.length, 0, name);
    assert.equal(out.rejected[0].eligible, true, name);
    assert.match(out.rejected[0].why, why, name);
    assert.equal(m.edges[0].src.length, 0, name);
  };
  const BIND = /binding is stale/;
  stale(m => (m.edges[0].label = 'counselor to'), BIND, 'edge label changed');
  stale(m => (m.records[1].label = 'B (renamed)'), BIND, 'endpoint identity label changed');
  stale(m => ((m.records[0] as Record<string, unknown>).sourceId = 'OTHER-KEY'), BIND, 'endpoint source id changed');
  stale(m => m.records[0].src.push(c('D&C 52 heading')), BIND, 'endpoint source metadata changed');
  stale(
    m => (m.records[1].src = [{ t: 'D&C 52:37', u: U + 'dc-testament/dc/52?lang=spa' }]),
    BIND,
    'source URL changed',
  );
  stale(m => (m.sourceVersion = 'fixture-2'), /not the current source version/, 'source version changed');
  stale(m => delete (m as Partial<Model>).sourceVersion, /declares no current source version/, 'no source version');
  // the reviewer's own claim, scope and locators are bound too
  const m = fresh();
  const out = G.applyEdgeSources(m, { 'a>b': { ...reviewed, claim: 'a different claim' } });
  assert.match(out.rejected[0].why, BIND);
  // updating the row's sourceVersion to match a new model version does not refresh a stale binding
  const m2 = fresh();
  m2.sourceVersion = 'fixture-2';
  const out2 = G.applyEdgeSources(m2, { 'a>b': { ...reviewed, sourceVersion: 'fixture-2' } });
  assert.match(out2.rejected[0].why, BIND);
});

test('TL-R16: absent or forged bindings never promote', () => {
  const loc = c('D&C 52:37');
  const m = pair([loc], [loc]);
  const real = bind(m, accept([loc]));
  const other = pair([loc, c('D&C 52 heading')], [loc]);
  const forgeries: [string, unknown][] = [
    ['absent', undefined],
    ['empty', ''],
    ['made up', '0123456789abcdef'],
    ['bound to another model', G.bindingFor(other, 'a>b', accept([loc]))],
    ['bound to another claim', G.bindingFor(m, 'a>b', accept([loc], { claim: 'other' }))],
    ['bound to another locator', G.bindingFor(m, 'a>b', accept([c('D&C 52:36')]))],
  ];
  for (const [name, binding] of forgeries) {
    const out = G.applyEdgeSources(pair([loc], [loc]), { 'a>b': { ...real, binding } });
    assert.equal(out.promoted.length, 0, name);
    assert.match(out.rejected[0].why, /binding is stale or missing/, name);
  }
});

test('explicit withdrawal or rejection revokes; re-acceptance restores; every call clears first', () => {
  const loc = c('D&C 52:37');
  const m = pair([loc], [loc]);
  const ok = bind(m, accept([loc]));
  for (const state of ['withdrawn', 'rejected', 'deferred']) {
    assert.deepEqual([...G.applyEdgeSources(m, { 'a>b': ok }).promoted], ['a>b']);
    const out = G.applyEdgeSources(m, { 'a>b': { ...ok, state } });
    assert.deepEqual([...out.revoked], ['a>b'], state);
    assert.equal(m.edges[0].grounding, undefined, state);
    assert.equal(m.edges[0].locator, null, state);
  }
  // re-applying an accepted row twice is idempotent and never reports a revocation
  G.applyEdgeSources(m, { 'a>b': ok });
  const again = G.applyEdgeSources(m, { 'a>b': ok });
  assert.deepEqual([...again.promoted], ['a>b']);
  assert.equal(again.revoked.length, 0);
  assert.equal(m.edges[0].src.length, 1);
  // a binding that goes stale on a later call clears the earlier promotion
  m.records[1].label = 'changed';
  const later = G.applyEdgeSources(m, { 'a>b': ok });
  assert.deepEqual([...later.revoked], ['a>b']);
  assert.equal(m.edges[0].src.length, 0);
});

test('supplementary support is a separate, bound role that defers acceptance when missing or stale', () => {
  // pilot row 3's shape: the bounded claim needs the D&C 30 heading, which neither endpoint card cites
  const loc = c('D&C 30:5–7', 'dc-testament/dc/30');
  const heading = c('D&C 30 heading', 'dc-testament/dc/30');
  const fresh = () => pair([loc], [loc]);
  const item = (m: Model, entry: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
    const it: Record<string, unknown> = {
      id: 's1',
      role: 'support',
      state: 'accepted',
      purpose: 'full names of the persons addressed',
      claim: 'the heading names Peter Whitmer Jr.',
      src: [heading],
      ...extra,
    };
    if (!('fingerprint' in extra)) it.fingerprint = G.supportFingerprint(m, 'a>b', entry, it);
    return it;
  };
  // the reviewer binds the row with its support manifest, then fingerprints each item against that binding
  const build = (m: Model, extra: Record<string, unknown> = {}, itemExtra?: Record<string, unknown>) => {
    const entry: Record<string, any> = accept([loc], { supportRequired: true, ...extra });
    if (itemExtra !== undefined) {
      const { fingerprint, ...rest } = itemExtra;
      entry.support = [item(m, entry, { ...rest, fingerprint: null })];
      entry.binding = G.bindingFor(m, 'a>b', entry);
      entry.support[0].fingerprint =
        'fingerprint' in itemExtra ? fingerprint : G.supportFingerprint(m, 'a>b', entry, entry.support[0]);
    } else entry.binding = G.bindingFor(m, 'a>b', entry);
    return entry;
  };
  // heading is outside both endpoints' citations: it cannot be a primary locator
  assert.equal(G.eligibility(fresh(), 'a>b', [heading]).ok, false);

  const required = (m: Model, entry: Record<string, unknown>, why: RegExp, name: string) => {
    const out = G.applyEdgeSources(m, { 'a>b': entry });
    assert.equal(out.promoted.length, 0, name);
    assert.equal(out.rejected[0].eligible, true, name);
    assert.match(out.rejected[0].why, why, name);
  };
  let m = fresh();
  required(m, build(m), /required support is missing/, 'missing');

  m = fresh();
  const good = build(m, {}, {});
  const out = G.applyEdgeSources(m, { 'a>b': good });
  assert.deepEqual([...out.promoted], ['a>b']);
  // support is stored apart and never widens the primary source
  assert.equal(m.edges[0].locator, 'D&C 30:5–7');
  assert.equal(m.edges[0].src.length, 1);
  assert.equal(m.edges[0].grounding.support.length, 1);
  assert.equal(m.edges[0].grounding.support[0].src[0].t, 'D&C 30 heading');

  // revoked support defers and clears the earlier promotion
  const revoked = G.applyEdgeSources(m, { 'a>b': { ...good, support: [{ ...good.support[0], state: 'revoked' }] } });
  assert.deepEqual([...revoked.revoked], ['a>b']);
  assert.match(revoked.rejected[0].why, /support s1 state is revoked/);

  m = fresh();
  const g2 = build(m, {}, {});
  required(
    m,
    { ...g2, support: [{ ...g2.support[0], src: [c('D&C 30 heading, 1', 'dc-testament/dc/30')] }] },
    /stale/,
    'changed support citation',
  );
  m = fresh();
  required(m, { ...g2, support: [{ ...g2.support[0], claim: 'edited claim' }] }, /stale/, 'changed support claim');
  m = fresh();
  required(
    m,
    build(m, {}, { src: [c('D&C 30 heading', 'dc-testament/dc/31')] }),
    /citation invalid/,
    'invalid support',
  );
  m = fresh();
  required(m, build(m, {}, { role: 'primary' }), /support role/, 'wrong role');
  m = fresh();
  required(m, build(m, {}, { fingerprint: undefined }), /stale or missing/, 'unbound support');
  // a source-version change invalidates support as well as the row
  m = fresh();
  const g3 = build(m, {}, {});
  m.sourceVersion = 'fixture-2';
  assert.equal(G.applyEdgeSources(m, { 'a>b': { ...g3, sourceVersion: 'fixture-2' } }).promoted.length, 0);
  // present support with no stated requirement defers; stated optional support must still be current
  m = fresh();
  const optional = build(m, { supportRequired: undefined }, {});
  required(m, optional, /supportRequired is not stated/, 'unstated requirement');
  m = fresh();
  const opt2 = build(m, { supportRequired: false }, { state: 'proposed' });
  required(m, opt2, /not accepted/, 'optional but unaccepted');
  m = fresh();
  assert.equal(G.applyEdgeSources(m, { 'a>b': build(m, { supportRequired: false }) }).promoted.length, 1);
});

// ---------- checkpoint 19: TL-R16 residual binding gaps ----------
const HEAD30 = c('D&C 30 heading', 'dc-testament/dc/30');
const LOC30 = c('D&C 30:5–7', 'dc-testament/dc/30');
const supportItem = (id: string, claim: string) => ({
  id,
  role: 'support',
  state: 'accepted',
  purpose: 'full names of the persons addressed',
  claim,
  src: [HEAD30],
});
// a synthetic accepted row with two required support items, bound and fingerprinted as a reviewer would
function boundWithSupport(m: Model) {
  const entry: Record<string, any> = accept([LOC30], {
    supportRequired: true,
    support: [supportItem('s1', 'the heading names Peter Whitmer Jr.'), supportItem('s2', 'and David Whitmer')],
  });
  entry.binding = G.bindingFor(m, 'a>b', entry);
  entry.support = entry.support.map((it: Record<string, unknown>) => ({
    ...it,
    fingerprint: G.supportFingerprint(m, 'a>b', entry, it),
  }));
  return entry;
}
const fresh30 = () => pair([LOC30], [LOC30]);
// promote first, then apply the mutated row: it must defer AND clear the earlier promotion
function mutatedRejects(mutate: (e: Record<string, any>, m: Model) => Record<string, any>, why: RegExp, name: string) {
  const m = fresh30();
  const ok = boundWithSupport(m);
  assert.deepEqual([...G.applyEdgeSources(m, { 'a>b': ok }).promoted], ['a>b'], name + ' (positive control)');
  assert.equal(m.edges[0].src.length, 1, name);
  const bad = mutate(structuredClone(ok), m);
  const out = G.applyEdgeSources(m, { 'a>b': bad });
  assert.equal(out.promoted.length, 0, name);
  assert.deepEqual([...out.revoked], ['a>b'], name);
  assert.match(out.rejected[0].why, why, name);
  assert.equal(m.edges[0].src.length, 0, name);
  assert.equal(m.edges[0].locator, null, name);
  assert.equal(m.edges[0].grounding, undefined, name);
}
const STALE = /binding is stale/;

test('TL-R16 gap 1: the support requirement and the exact required-item manifest are bound', () => {
  // positive control: both items, as approved
  const m = fresh30();
  const ok = boundWithSupport(m);
  assert.deepEqual([...G.applyEdgeSources(m, { 'a>b': ok }).promoted], ['a>b']);
  assert.equal(m.edges[0].grounding.support.length, 2);
  // idempotent
  assert.equal(G.applyEdgeSources(m, { 'a>b': ok }).revoked.length, 0);

  mutatedRejects(
    e => {
      e.supportRequired = false;
      delete e.support;
      return e;
    },
    STALE,
    'requirement weakened to false and support removed',
  );
  mutatedRejects(
    e => {
      delete e.supportRequired;
      delete e.support;
      return e;
    },
    /supportRequired is not stated/,
    'requirement deleted and support removed',
  );
  mutatedRejects(
    e => {
      delete e.supportRequired;
      return e;
    },
    /supportRequired is not stated/,
    'requirement deleted, support kept',
  );
  mutatedRejects(
    e => {
      e.support = e.support.slice(0, 1);
      return e;
    },
    STALE,
    'one of two required items removed',
  );
  mutatedRejects(
    e => {
      e.support = [];
      return e;
    },
    STALE,
    'all required items removed',
  );
  // substitution: a different item, freshly fingerprinted against the mutated row, still cannot pass the row binding
  mutatedRejects(
    (e, m) => {
      const sub = supportItem('s3', 'a different supporting claim');
      e.support[1] = {
        ...sub,
        fingerprint: G.supportFingerprint(m, 'a>b', { ...e, support: [e.support[0], sub] }, sub),
      };
      return e;
    },
    STALE,
    'required item substituted',
  );
  mutatedRejects(
    e => {
      e.support[1].claim = 'and someone';
      return e;
    },
    STALE,
    'required item claim weakened',
  );
  mutatedRejects(
    e => {
      e.support[0].src = [{ ...HEAD30, u: HEAD30.u.replace('lang=eng', 'lang=spa') }];
      return e;
    },
    STALE,
    'support citation language changed',
  );
  // a row approved with optional support binds that choice too: it cannot be silently upgraded or emptied
  const m2 = fresh30();
  const opt: Record<string, any> = accept([LOC30]);
  opt.binding = G.bindingFor(m2, 'a>b', opt);
  assert.equal(G.applyEdgeSources(m2, { 'a>b': opt }).promoted.length, 1);
  assert.match(G.applyEdgeSources(m2, { 'a>b': { ...opt, supportRequired: true } }).rejected[0].why, /stale|missing/);
});

test('TL-R16 gap 2: reviewed source URL, label and language are bound; unknown provenance defers', () => {
  const lang = (l: string) => (x: Loc) => ({ ...x, u: x.u.replace('lang=eng', 'lang=' + l) });
  mutatedRejects(
    e => {
      e.src = e.src.map(lang('spa'));
      return e;
    },
    STALE,
    'primary locator ?lang=eng → ?lang=spa',
  );
  mutatedRejects(
    e => {
      e.src = [{ ...e.src[0], t: 'D&C 30:5-7' }];
      return e;
    },
    STALE,
    'primary label respelled',
  );
  const unknown: [string, (x: Loc) => Loc][] = [
    ['no query', x => ({ ...x, u: x.u.split('?')[0] })],
    ['extra parameter', x => ({ ...x, u: x.u + '&id=p5' })],
    ['two languages', x => ({ ...x, u: x.u + '&lang=spa' })],
    ['not a language code', x => ({ ...x, u: x.u.replace('lang=eng', 'lang=english') })],
  ];
  for (const [name, f] of unknown) {
    mutatedRejects(
      e => {
        e.src = e.src.map(f);
        return e;
      },
      /unknown provenance/,
      'primary ' + name,
    );
    mutatedRejects(
      e => {
        e.support[0].src = e.support[0].src.map(f);
        return e;
      },
      /unknown provenance/,
      'support ' + name,
    );
  }
  // an unknown-provenance row cannot be made acceptable by re-binding it
  const m = fresh30();
  const e: Record<string, any> = accept([{ ...LOC30, u: LOC30.u.split('?')[0] }]);
  e.binding = G.bindingFor(m, 'a>b', e);
  assert.match(G.applyEdgeSources(m, { 'a>b': e }).rejected[0].why, /unknown provenance/);
  // independent evidence carries provenance too
  const mos = [c('Mosiah 14:1–12', 'bofm/mosiah/14')];
  const isa = [c('Isaiah 53:1–12', 'ot/isa/53')];
  const mi = pair(mos, isa);
  const ind: Record<string, any> = accept([], {
    mode: 'independent',
    scope: 'paired passages, not one event',
    evidence: { from: mos, to: isa },
  });
  ind.binding = G.bindingFor(mi, 'a>b', ind);
  assert.equal(G.applyEdgeSources(mi, { 'a>b': ind }).promoted.length, 1);
  const spa = { ...ind, evidence: { from: mos, to: isa.map(lang('spa')) } };
  const out = G.applyEdgeSources(mi, { 'a>b': spa });
  assert.deepEqual([...out.revoked], ['a>b']);
  assert.match(out.rejected[0].why, STALE);
  assert.equal(G.provenanceOf(LOC30).lang, 'eng');
  assert.equal(G.provenanceOf({ t: 'x', u: LOC30.u.split('?')[0] }), null);
});

test('TL-R16 gap 3: endpoint explanatory content is bound under stable ids', () => {
  const withContent = () => {
    const m = fresh30();
    Object.assign(m.records[0], {
      text: 'Revelation to the Whitmer brothers.',
      claim: ['text'],
      notes: [{ k: 'text', t: 'Addressed to Peter Whitmer Jr.', loc: 'D&C 30:5' }],
      notSame: [{ id: 'x', t: 'Not David Whitmer’s later role.' }],
    });
    return m;
  };
  const run = (change: (r: Record<string, any>) => void, name: string) => {
    const m = withContent();
    const ok = boundWithSupport(m);
    assert.deepEqual([...G.applyEdgeSources(m, { 'a>b': ok }).promoted], ['a>b'], name + ' (positive control)');
    change(m.records[0] as Record<string, any>);
    const out = G.applyEdgeSources(m, { 'a>b': ok });
    assert.equal(out.promoted.length, 0, name);
    assert.deepEqual([...out.revoked], ['a>b'], name);
    assert.match(out.rejected[0].why, STALE, name);
    assert.equal(m.edges[0].src.length, 0, name);
    // ids, label and citations were not touched
    assert.equal(m.records[0].id, 'a', name);
    assert.equal(m.records[0].label, 'A', name);
  };
  run(r => (r.text = 'Revelation to the Whitmer family.'), 'text');
  run(r => (r.text = null), 'text removed');
  run(r => (r.notes[0].t = 'Addressed to David Whitmer'), 'scoped note text');
  run(r => (r.notes[0].loc = 'D&C 30:1'), 'scoped note locator');
  run(r => (r.notes[0].k = 'tradition'), 'scoped note kind');
  run(r => r.notes.push({ k: 'text', t: 'extra', loc: null }), 'note added');
  run(r => (r.notSame[0].t = 'Same as David Whitmer’s later role.'), 'identity guard text');
  run(r => (r.notSame = []), 'identity guard removed');
  run(r => (r.claim = ['tradition']), 'claim kind');
  // the other endpoint is bound as well
  const m = withContent();
  const ok = boundWithSupport(m);
  G.applyEdgeSources(m, { 'a>b': ok });
  (m.records[1] as Record<string, any>).text = 'new';
  assert.match(G.applyEdgeSources(m, { 'a>b': ok }).rejected[0].why, STALE);
});
