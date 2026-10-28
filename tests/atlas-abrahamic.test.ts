import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
// @ts-expect-error plain JS helper without type declarations
import { validatePacks } from './atlas-pack-validator.mjs';

// Build rules for the religious-traditions atlas (docs/universes/packs/abrahamic-world-religions/build-contract.md).
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(
  readFileSync(new URL('../public/atlas/packs/abrahamic-world-religions.js', import.meta.url), 'utf8'),
  ctx,
);
const pack = ctx.window.ATLAS_PACKS['abrahamic-world-religions'];
const earth = pack.worlds.find((w: { id: string }) => w.id === 'earth');
const research = new URL('../docs/universes/packs/abrahamic-world-religions/', import.meta.url);

function csv(file: string): Record<string, string>[] {
  const text = readFileSync(new URL(file, research), 'utf8').trim();
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') cell += c;
  }
  row.push(cell);
  rows.push(row);
  const head = rows.shift() as string[];
  return rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

test('only the ten approved anchors are map pins, at their source coordinates', () => {
  const gaz = csv('gazetteer-evidence.csv');
  const expected: Record<string, [number, number]> = {
    jerusalem: [31.777778, 35.231667],
    'jud-babylon': [32.541969, 44.420833],
  };
  for (const g of gaz) expected[g.id] = [Number(g.latitude), Number(g.longitude)];
  assert.equal(Object.keys(expected).length, 10);
  assert.deepEqual([...earth.sites.map((s: { id: string }) => s.id)].sort(), Object.keys(expected).sort());
  for (const s of earth.sites) {
    assert.ok(Math.abs(s.lat - expected[s.id][0]) < 1e-6, `${s.id} lat`);
    assert.ok(Math.abs(s.lon - expected[s.id][1]) < 1e-6, `${s.id} lon`);
  }
});

test('heritage markers say they are heritage references, not event sites', () => {
  for (const s of earth.sites.filter((x: { id: string }) => x.id.startsWith('gaz-')))
    assert.ok(
      s.notes.some((n: { t: string }) => /Heritage reference/.test(n.t)),
      `${s.id} lacks the heritage note`,
    );
});

test('every researched place is either a pin or a reference card without coordinates', () => {
  const cards = pack.codex.find((t: { id: string }) => t.id === 'places').list;
  const ids = new Set<string>([
    ...earth.sites.map((s: { id: string }) => s.id),
    ...cards.map((c: { id: string }) => c.id),
  ]);
  assert.equal(ids.size, earth.sites.length + cards.length, 'duplicate place ids');
  for (const c of cards) assert.ok(c.lat == null && c.lon == null, `${c.id} has coordinates`);
  const places = csv('identity-and-edges.csv').filter(r => r.record_kind === 'identity' && r.entity_type === 'place');
  for (const p of places) assert.ok(ids.has(p.canonical_id), `missing place ${p.canonical_id} (${p.source_id})`);
});

test('reference cards and world links are checked by the pack validator', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'atlas-ref-'));
  writeFileSync(path.join(dir, 'registry.js'), 'window.ATLAS_REGISTRY=[{id:"refs",title:"Refs"}];');
  writeFileSync(
    path.join(dir, 'refs.js'),
    `(window.ATLAS_PACKS=window.ATLAS_PACKS||{}).refs={id:"refs",meta:{title:"Refs"},books:{1:{n:"I",title:"One"}},
      worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},refPlaces:"nope"}],
      events:[{id:"e1",book:1,world:"w",title:"E",text:"t",ref:"missing"},{id:"e2",book:1,world:"w",title:"E",text:"t",ref:"a"}],
      codex:[{id:"places",title:"Places",list:[{id:"a",name:"A",desc:"d"},{id:"a",name:"B",desc:"d"}]}]};`,
  );
  const r = validatePacks(dir)['refs.js'];
  assert.ok(r.issues.some((i: string) => /ref -> missing codex entry "missing"/.test(i)));
  assert.ok(r.issues.some((i: string) => /refPlaces -> missing codex tab "nope"/.test(i)));
  assert.ok(r.issues.some((i: string) => /duplicate entry id a/.test(i)));
  assert.ok(!r.issues.some((i: string) => /e2/.test(i)));
});
