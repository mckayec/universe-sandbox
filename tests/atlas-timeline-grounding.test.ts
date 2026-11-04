import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Per-relationship grounding (public/atlas/timeline-grounding.js; timeline checkpoint 15). A card's citation is never
// promoted into a relationship source on its own: only a reviewed locator cited by both endpoint cards is.
const ctx: { window: Record<string, any> } = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../public/atlas/timeline-grounding.js', import.meta.url), 'utf8'), ctx);
const G = ctx.window.AtlasTimelineGrounding;
const U = 'https://www.churchofjesuschrist.org/study/scriptures/';
const c = (t: string, path: string) => ({ t, u: U + path + '?lang=eng' });

test('parseLocator reads book and chapter from the URL and verses from the label', () => {
  const p = G.parseLocator(c('2 Nephi 20:5–19, 28–32', 'bofm/2-ne/20'));
  assert.equal(p.book, 'bofm/2-ne');
  assert.deepEqual([...p.chapters], [20]);
  assert.deepEqual([...p.verses], [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 28, 29, 30, 31, 32]);
  assert.deepEqual([...G.parseLocator(c('Genesis 16–17', 'ot/gen/16')).chapters], [16, 17]);
  const h = G.parseLocator(c('D&C 52 heading', 'dc-testament/dc/52'));
  assert.equal(h.heading, true);
  assert.equal(h.verses, null);
  assert.deepEqual([...G.parseLocator(c('D&C 117 heading, 1, 10', 'dc-testament/dc/117')).verses], [1, 10]);
  assert.equal(G.parseLocator({ t: 'no url' }), null);
  // a label whose chapter disagrees with the URL is marked loose and carries no verses
  const loose = G.parseLocator(c('Mosiah 3:4', 'bofm/mosiah/5'));
  assert.equal(loose.loose, true);
  assert.equal(loose.verses, null);
});

test('groundLink classes relationships by what both cards cite', () => {
  const ryder = [c('D&C 52:37', 'dc-testament/dc/52')];
  const basset = [c('D&C 52:37', 'dc-testament/dc/52')];
  const sv = G.groundLink(ryder, basset);
  assert.equal(sv.cls, 'shared-verse');
  assert.deepEqual([...sv.shared[0].verses], [37]);
  assert.equal(
    G.groundLink([c('D&C 124:127', 'dc-testament/dc/124')], [c('D&C 124:132', 'dc-testament/dc/124')]).cls,
    'same-chapter',
  );
  assert.equal(G.groundLink([c('Mosiah 12:1–37', 'bofm/mosiah/12')], [c('Exodus 2–40', 'ot/ex/2')]).cls, 'cross-text');
  assert.equal(G.groundLink([], basset).cls, 'no-locator');
  assert.equal(
    G.groundLink([c('D&C 8', 'dc-testament/dc/8')], [c('D&C 8:1–4', 'dc-testament/dc/8')]).cls,
    'shared-chapter',
  );
  // a heading is its own passage: it does not ground against verses or the chapter text
  assert.equal(
    G.groundLink([c('D&C 4 heading', 'dc-testament/dc/4')], [c('D&C 4:1', 'dc-testament/dc/4')]).cls,
    'same-chapter',
  );
  assert.equal(
    G.groundLink([c('D&C 4 heading', 'dc-testament/dc/4')], [c('D&C 4 heading', 'dc-testament/dc/4')]).cls,
    'shared-chapter',
  );
});

function model() {
  return {
    records: [
      { id: 'a', label: 'Ryder', src: [c('D&C 52:37', 'dc-testament/dc/52')] },
      {
        id: 'b',
        label: 'Basset',
        src: [c('D&C 52:37', 'dc-testament/dc/52'), c('D&C 52 heading', 'dc-testament/dc/52')],
      },
      { id: 'm', label: 'Moses', src: [c('Exodus 2–40', 'ot/ex/2')] },
      { id: 'k', label: 'Abinadi', src: [c('Mosiah 12:1–37', 'bofm/mosiah/12')] },
    ],
    edges: [
      { id: 'x:a>b', from: 'a', to: 'b', type: 'context', src: [], cardSrc: [] },
      { id: 'x:k>m', from: 'k', to: 'm', type: 'context', src: [], cardSrc: [] },
    ],
  };
}

test('applyEdgeSources promotes only reviewed locators inside the shared passage', () => {
  const m = model();
  const out = G.applyEdgeSources(m, {
    'x:a>b': { src: [c('D&C 52:37', 'dc-testament/dc/52')], basis: 'charge reassigned in this verse' },
    // the citing card's own citation does not ground a link to a different text
    'x:k>m': { src: [c('Mosiah 12:1–37', 'bofm/mosiah/12')] },
    'x:none': { src: [c('D&C 52:37', 'dc-testament/dc/52')] },
  });
  assert.deepEqual([...out.promoted], ['x:a>b']);
  assert.equal(m.edges[0].src.length, 1);
  assert.equal(m.edges[0].locator, 'D&C 52:37');
  assert.equal(m.edges[0].basis, 'charge reassigned in this verse');
  assert.equal(m.edges[1].src.length, 0);
  assert.deepEqual([...out.rejected.map((r: { id: string }) => r.id)], ['x:k>m', 'x:none']);
  assert.match(out.rejected[0].why, /cross-text/);
});

test('applyEdgeSources rejects a widened locator, a heading for verses and an empty entry', () => {
  const m = model();
  const out = G.applyEdgeSources(m, {
    'x:a>b': { src: [c('D&C 52:36–37', 'dc-testament/dc/52')] },
  });
  assert.equal(out.promoted.length, 0);
  assert.equal(
    G.applyEdgeSources(m, { 'x:a>b': { src: [c('D&C 52 heading', 'dc-testament/dc/52')] } }).promoted.length,
    0,
  );
  assert.equal(G.applyEdgeSources(m, { 'x:a>b': { src: [] } }).promoted.length, 0);
  assert.equal(m.edges[0].src.length, 0);
  assert.equal(G.applyEdgeSources(model(), {}).promoted.length, 0);
});

test('ledger lists every edge once with its class; travel legs keep their own class', () => {
  const m = model();
  m.edges.push({ id: 't:1', from: 'a', to: 'b', type: 'travel', src: [], cardSrc: [] });
  const rows = G.ledger(m);
  assert.equal(rows.length, 3);
  assert.deepEqual([...rows.map((r: { cls: string }) => r.cls)], ['shared-verse', 'cross-text', 'travel']);
  assert.ok(
    m.edges.every((e: { src: unknown[] }) => e.src.length === 0),
    'ledger never promotes',
  );
});
