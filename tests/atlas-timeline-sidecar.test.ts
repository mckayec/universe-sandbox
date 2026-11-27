import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Host loading of a relationship review sidecar (timeline checkpoint 21): timeline-grounding.js loadSidecar, as the
// view calls it when a host opts in. Absent, invalid, stale and changed sidecars promote nothing and revoke any earlier
// promotion; a proposed row is never treated as accepted; promoted sources still pass the atlas's read-state gate.
// Accepted rows below are synthetic fixtures, never real pilot rows.
const ctx: { window: Record<string, any> } = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
for (const f of ['timeline.js', 'timeline-grounding.js'])
  vm.runInContext(readFileSync(new URL('../public/atlas/' + f, import.meta.url), 'utf8'), ctx);
const G = ctx.window.AtlasTimelineGrounding;
const TLM = ctx.window.AtlasTimeline;
const U = 'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/52?lang=eng';
const SV = 'fixture/synthetic@r1';
const loc = (t: string) => ({ t, u: U });

function model() {
  return {
    records: [
      { id: 'a', label: 'A', lane: 'l', gate: { book: 1 }, src: [loc('D&C 52:3')] },
      { id: 'b', label: 'B', lane: 'l', gate: { book: 2 }, src: [loc('D&C 52:3')] },
    ],
    edges: [
      {
        id: 'a>b',
        from: 'a',
        to: 'b',
        type: 'context',
        label: null as string | null,
        src: [] as unknown[],
        cardSrc: [],
        gate: {},
      },
    ],
    lanes: [{ id: 'l' }],
    sourceVersion: SV as string | null,
  };
}
type M = ReturnType<typeof model>;
function row(m: M, extra: Record<string, unknown> = {}) {
  const r: Record<string, any> = {
    v: 1,
    state: 'accepted',
    mode: 'shared',
    from: 'a',
    to: 'b',
    type: 'context',
    claim: 'synthetic claim',
    basis: 'synthetic rationale',
    sourceVersion: SV,
    supportRequired: false,
    src: [loc('D&C 52:3')],
    ...extra,
  };
  m.sourceVersion = SV;
  r.binding = G.bindingFor(m, 'a>b', r);
  return r;
}
const sidecar = (rows: Record<string, unknown>, extra: Record<string, unknown> = {}) => ({
  kind: 'atlas-timeline-review-sidecar',
  reviewVersion: 1,
  pack: 'fixture',
  manifest: { sourceVersion: SV },
  rows,
  ...extra,
});
const HOST = { packId: 'fixture', sourceVersion: SV };

test('synthetic accepted row promotes through the host loader (positive control)', () => {
  const m = model();
  const out = G.loadSidecar(m, sidecar({ 'a>b': row(m) }), HOST);
  assert.equal(out.status, 'ok');
  assert.deepEqual([...out.promoted], ['a>b']);
  assert.equal(m.edges[0].src.length, 1);
});

test('absent, invalid and stale sidecars promote nothing and revoke an earlier promotion', () => {
  const cases: [string, (m: M) => unknown, Record<string, unknown>, string][] = [
    ['absent', () => null, HOST, 'absent'],
    ['wrong kind', m => sidecar({ 'a>b': row(m) }, { kind: 'x' }), HOST, 'invalid'],
    ['wrong review version', m => sidecar({ 'a>b': row(m) }, { reviewVersion: 2 }), HOST, 'invalid'],
    ['other pack', m => sidecar({ 'a>b': row(m) }, { pack: 'other' }), HOST, 'invalid'],
    ['rows as a list', m => sidecar({}, { rows: [row(m)] }), HOST, 'invalid'],
    ['no manifest version', m => sidecar({ 'a>b': row(m) }, { manifest: {} }), HOST, 'invalid'],
    [
      'manifest version is stale',
      m => sidecar({ 'a>b': row(m) }, { manifest: { sourceVersion: 'old' } }),
      HOST,
      'stale',
    ],
    ['host declares no version', m => sidecar({ 'a>b': row(m) }), { packId: 'fixture' }, 'stale'],
  ];
  for (const [name, make, host, status] of cases) {
    const m = model();
    assert.equal(G.loadSidecar(m, sidecar({ 'a>b': row(m) }), HOST).promoted.length, 1, name + ' setup');
    const out = G.loadSidecar(m, make(m), host);
    assert.equal(out.status, status, name);
    assert.equal(out.promoted.length, 0, name);
    assert.deepEqual([...out.revoked], ['a>b'], name);
    assert.equal(m.edges[0].src.length, 0, name);
    assert.equal(m.edges[0].grounding, undefined, name);
  }
});

test('a changed edge or endpoint makes the row stale: listed as changed, not promoted', () => {
  const changes: [string, (m: M) => void][] = [
    ['endpoint text', m => Object.assign(m.records[1], { label: 'B renamed' })],
    ['endpoint citation', m => (m.records[0].src = [loc('D&C 52:3–4')])],
    ['edge label', m => (m.edges[0].label = 'new label')],
  ];
  for (const [name, mutate] of changes) {
    const m = model();
    const r = row(m);
    mutate(m);
    const out = G.loadSidecar(m, sidecar({ 'a>b': r }), HOST);
    assert.equal(out.status, 'ok', name);
    assert.deepEqual([...out.changed], ['a>b'], name);
    assert.equal(out.promoted.length, 0, name);
    assert.match(out.rejected[0].why, /binding is stale/, name);
  }
});

test('a proposed row with recommendation accept stays rejected', () => {
  const m = model();
  const r = row(m, { state: 'proposed', recommendation: 'accept' });
  r.binding = G.bindingFor(m, 'a>b', r);
  const out = G.loadSidecar(m, sidecar({ 'a>b': r }), HOST);
  assert.equal(out.promoted.length, 0);
  assert.equal(out.rejected[0].eligible, true);
  assert.match(out.rejected[0].why, /proposed, not accepted/);
});

test('a native (non-sidecar) edge source is untouched by an absent sidecar', () => {
  const m = model();
  m.edges[0].src = [{ t: 'ledger row 4' }];
  const out = G.loadSidecar(m, null, HOST);
  assert.equal(out.status, 'absent');
  assert.equal(out.revoked.length, 0);
  assert.equal(m.edges[0].src.length, 1);
});

test('narrowed read state hides a promoted relationship and its source', () => {
  const m = model();
  G.loadSidecar(m, sidecar({ 'a>b': row(m) }), HOST);
  const upTo = (k: number) => (g: { book?: number }) => !g || g.book == null || g.book <= k;
  const wide = TLM.visible(m, upTo(2));
  assert.deepEqual([...wide.drawnEdges.map((e: { id: string }) => e.id)], ['a>b']);
  const narrow = TLM.visible(m, upTo(1));
  assert.equal(narrow.edges.length, 0);
  assert.equal(narrow.drawnEdges.length, 0);
  assert.equal(TLM.revalidate(narrow, 'a>b'), null);
  assert.equal(TLM.search(narrow, 'synthetic').length, 0);
  assert.equal(TLM.search(narrow, 'B').length, 0);
});
