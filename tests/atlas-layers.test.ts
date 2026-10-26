import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// layers.js is a plain browser script: run it in a sandbox and read window.AtlasLayers.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
const L = ctx.window.AtlasLayers;
// values made in the sandbox have its own Array/Object prototypes; compare them as plain data
const plain = (v: unknown) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const fx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('./fixtures/track-a-demo.js', import.meta.url), 'utf8'), fx);
const pack = fx.window.ATLAS_PACKS['track-a-demo'];

test('layers normalise with defaults and the starting set honours on:false', () => {
  const N = L.normLayers(pack);
  assert.deepEqual(plain(N.list.map((l: any) => l.id)), ['east', 'west', 'notes']);
  const act = L.defaultActive(N);
  assert.deepEqual([...act].sort(), ['east', 'west']);
  assert.equal(L.normLayers({}), null);
  assert.equal(L.defaultActive(L.normLayers({ layers: [{ id: 'a' }, { id: 'b' }] })), null);
});

test('layerOk shows unlayered items and any item with one active layer', () => {
  const act = new Set(['east']);
  assert.equal(L.layerOk({}, act), true);
  assert.equal(L.layerOk({ layers: ['east'] }, act), true);
  assert.equal(L.layerOk({ layer: 'west' }, act), false);
  assert.equal(L.layerOk({ layers: ['west', 'east'] }, act), true);
  assert.equal(L.layerOk({ layer: 'west' }, null), true);
});

test('toggleLayer never switches off the last layer and collapses to null when all are on', () => {
  const N = L.normLayers(pack);
  let a = L.toggleLayer(N, null, 'east');
  assert.deepEqual([...a].sort(), ['notes', 'west']);
  a = L.toggleLayer(N, a, 'east');
  assert.equal(a, null);
  const one = new Set(['west']);
  assert.equal(L.toggleLayer(N, one, 'west'), one);
  assert.equal(L.toggleLayer(N, one, 'nope'), one);
});

test('timeline range overlap, undated items and the missing year zero', () => {
  const T = L.normTimeline(pack, []);
  assert.equal(T.min, -2000);
  assert.equal(T.step, 10);
  assert.equal(L.timeOk({ when: [-1000, -586] }, [-600, -500]), true);
  assert.equal(L.timeOk({ when: -1500 }, [-600, -500]), false);
  assert.equal(L.timeOk({}, [-600, -500]), true);
  assert.equal(L.timeOk({ when: 1830 }, null), true);
  assert.equal(L.fromAxis(L.toAxis(-1)), -1);
  assert.equal(L.fromAxis(0), -1);
  assert.equal(L.fromAxis(1), 1);
  assert.equal(L.clampRange(T, -5000, 5000), null);
  assert.deepEqual(plain(L.clampRange(T, 100, -100)), [-100, 100]);
  assert.deepEqual(plain(L.clampRange(T, 0, 50)), [-1, 50]);
});

test('timeline bounds fall back to the data when the pack gives none', () => {
  const T = L.normTimeline({ timeline: {} }, [{ when: [-300, 30] }, { when: 1844 }, {}]);
  assert.equal(T.min, -300);
  assert.equal(T.max, 1844);
  assert.equal(L.normTimeline({}, []), null);
});

test('years format without a year zero in both styles', () => {
  assert.equal(L.fmtYear(-1446, 'BC/AD'), '1446 BC');
  assert.equal(L.fmtYear(30, 'BC/AD'), 'AD 30');
  assert.equal(L.fmtYear(1830, 'BC/AD'), '1830');
  assert.equal(L.fmtYear(-4, 'BCE/CE'), '4 BCE');
  assert.equal(L.fmtYear(30, 'BCE/CE'), '30 CE');
  assert.equal(L.fmtWhen({ when: [-1446, -1406] }), '1446–1406 BC');
  assert.equal(L.fmtWhen({ when: [-4, 30] }), '4 BC – AD 30');
  assert.equal(L.fmtWhen({ when: [30, 33] }), 'AD 30–33');
  assert.equal(L.fmtWhen({ when: [30, 33] }, 'BCE/CE'), '30–33 CE');
  assert.equal(L.fmtWhen({ when: [1830, 1844] }), '1830–1844');
  assert.equal(L.fmtWhen({ when: [-1000, -586], approx: true }), 'c. 1000–586 BC');
  assert.equal(L.fmtWhen({ when: 1830, approx: true }), 'c. 1830');
  assert.equal(L.fmtRange(null, L.normTimeline(pack, [])), 'All years');
});

test('address-bar state round-trips and rejects junk', () => {
  const N = L.normLayers(pack);
  const T = L.normTimeline(pack, []);
  const enc = L.encodeState(N, T, new Set(['west']), [-600, 30]);
  assert.deepEqual(plain(enc), { layers: 'west', yr: '-600_30' });
  const dec = L.decodeState(N, T, new URLSearchParams(enc));
  assert.deepEqual([...dec.active], ['west']);
  assert.deepEqual(plain(dec.range), [-600, 30]);
  const all = L.decodeState(N, T, new URLSearchParams('layers=east,west,notes,bogus&yr=x'));
  assert.equal(all.active, null);
  assert.equal(all.range, null);
  const none = L.decodeState(N, T, new URLSearchParams(''));
  assert.equal(none.active, undefined);
  assert.equal(none.range, undefined);
});

test('the filter bar escapes pack text and marks pressed layers', () => {
  const N = L.normLayers({ layers: [{ id: 'a', name: '<b>x</b>' }, { id: 'b' }] });
  const T = L.normTimeline({ timeline: { min: -100, max: 100 } }, []);
  const h = L.renderBar(N, T, new Set(['a']), [-50, 50]);
  assert.ok(!h.includes('<b>x</b>'));
  assert.match(h, /data-layer="a" aria-pressed="true"/);
  assert.match(h, /data-layer="b" aria-pressed="false"/);
  assert.match(h, /50 BC – AD 50/);
  assert.match(h, /data-tl="all"/);
  assert.ok(!L.renderBar(N, T, null, null).includes('data-tl="all"'));
});

test('the pack validator accepts the Track A fixture and catches bad layer and year data', async () => {
  // @ts-expect-error plain JS helper without type declarations
  const { validatePacks } = await import('./atlas-pack-validator.mjs');
  const { mkdtempSync, writeFileSync, copyFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const dir = mkdtempSync(join(tmpdir(), 'atlas-'));
  try {
    writeFileSync(join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"track-a-demo"},{id:"bad"}];');
    copyFileSync(new URL('./fixtures/track-a-demo.js', import.meta.url), join(dir, 'track-a-demo.js'));
    writeFileSync(
      join(dir, 'bad.js'),
      `(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).bad={id:"bad",meta:{title:"Bad"},books:{1:{}},
        layers:[{id:"a"}],timeline:{},start:{world:"nowhere"},
        worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},
          sites:[{id:"s",name:"S",lat:0,lon:0,desc:"d",layers:["zz"],when:[0,5]}]}]};`,
    );
    const r = validatePacks(dir);
    assert.deepEqual(plain(r['track-a-demo.js'].issues), []);
    const bad = r['bad.js'].issues.join('\n');
    assert.match(bad, /unknown layer "zz"/);
    assert.match(bad, /year 0/);
    assert.match(bad, /start.world/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
