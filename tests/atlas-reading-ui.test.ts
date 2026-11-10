import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// View model of the per-work reading panel (public/atlas/reading-ui.js) against the SYNTHETIC fixture
// (tests/fixtures/reading-demo.js; not researched data).
const ctx: { window: Record<string, any>; URLSearchParams: typeof URLSearchParams } = {
  window: {},
  URLSearchParams,
};
for (const f of ['../public/atlas/reading.js', '../public/atlas/reading-ui.js', './fixtures/reading-demo.js'])
  vm.runInNewContext(readFileSync(new URL(f, import.meta.url), 'utf8'), ctx);
const R = ctx.window.AtlasReading;
const UI = ctx.window.AtlasReadingUI;
const reg = R.normRegistry(ctx.window.ATLAS_PACKS['reading-demo']);
const plain = (v: unknown) => JSON.parse(JSON.stringify(v));
const checked = (m: any) =>
  plain(m.groups.flatMap((g: any) => g.works.filter((w: any) => w.checked).map((w: any) => w.id)));

test('preset state: checklist mirrors the preset prefix, select shows the chosen work', () => {
  const st = R.choosePreset(reg, 'pub', 'fx-c1');
  const m = UI.model(R, st, reg, {});
  assert.equal(m.kind, 'preset');
  assert.deepEqual(checked(m), ['fx-a1', 'fx-a2', 'fx-c1']);
  assert.equal(m.presets[0].selected, 'fx-c1');
  assert.deepEqual(plain(m.presets[0].options.map((o: any) => o.id)), ['fx-a1', 'fx-a2', 'fx-c1', 'fx-a3', 'fx-b1']);
  assert.equal(m.allPressed, false);
});

test('ticking a later work from a preset becomes a custom set and ticks nothing else', () => {
  const st = R.toggleWork(R.choosePreset(reg, 'pub', 'fx-a1'), 'fx-b1', reg);
  const m = UI.model(R, st, reg, {});
  assert.equal(m.kind, 'set');
  assert.deepEqual(checked(m), ['fx-a1', 'fx-b1']);
  assert.equal(m.presets[0].selected, '');
  assert.match(m.label, /^Custom selection: 2 read/);
  assert.deepEqual(plain(m.works), ['Fixture A1', 'Fixture B1']);
});

test('unticking the last work is the safe state, never All', () => {
  const st = R.toggleWork({ mode: 'set', ids: ['fx-a2'] }, 'fx-a2', reg);
  const m = UI.model(R, st, reg, {});
  assert.equal(m.kind, 'safe');
  assert.deepEqual(checked(m), []);
  assert.equal(m.allPressed, false);
});

test('All, legacy and safe states tick no work; All is pressed only for All', () => {
  assert.equal(UI.model(R, { mode: 'all' }, reg, {}).allPressed, true);
  for (const st of [{ mode: 'all' }, { mode: 'legacy', book: 2 }, { mode: 'safe', reason: 'x' }])
    assert.deepEqual(checked(UI.model(R, st, reg, {})), []);
});

test('works are grouped by bucket in registry order; unbucketed works form their own group', () => {
  const m = UI.model(R, { mode: 'all' }, reg, { groupTitle: (b: number | null) => (b == null ? 'Other' : 'B' + b) });
  assert.deepEqual(plain(m.groups.map((g: any) => [g.title, g.works.map((w: any) => w.id)])), [
    ['B2', ['fx-a1', 'fx-a2', 'fx-a3']],
    ['B3', ['fx-b1']],
    ['Other', ['fx-c1']],
  ]);
});

test('unreviewed note only in per-work modes', () => {
  assert.equal(UI.model(R, { mode: 'set', ids: ['fx-a1'] }, reg, { unreviewed: true }).unreviewed, true);
  assert.equal(UI.model(R, { mode: 'all' }, reg, { unreviewed: true }).unreviewed, false);
  assert.equal(UI.model(R, { mode: 'set', ids: ['fx-a1'] }, reg, { unreviewed: false }).unreviewed, false);
});
