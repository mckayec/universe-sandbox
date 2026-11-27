// Deep worlds R0-1: the places opt-in contract (PACK_FORMAT 22). Only a plain-object `places` turns the engine on;
// the validator rejects any other value instead of letting it silently disable the feature. Also checks that the
// test-only browser fixture (tests/fixtures/places-optin-fixture.js) yields a valid pack and that no shipped pack opts in.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const PACKS = new URL('../public/atlas/packs/', import.meta.url);

test('no shipped atlas pack opts into places (R0 stays dormant)', () => {
  type Ctx = { window: { ATLAS_REGISTRY?: { id: string; parts?: string[] }[]; ATLAS_PACKS?: Record<string, object> } };
  const reg: Ctx = { window: {} };
  vm.runInNewContext(readFileSync(new URL('registry.js', PACKS), 'utf8'), reg);
  const entries = reg.window.ATLAS_REGISTRY || [];
  assert.ok(entries.length > 0);
  for (const e of entries) {
    const ctx: Ctx = { window: {} };
    for (const part of e.parts || [])
      vm.runInNewContext(readFileSync(new URL(`${e.id}/${part}.js`, PACKS), 'utf8'), ctx);
    vm.runInNewContext(readFileSync(new URL(`${e.id}.js`, PACKS), 'utf8'), ctx);
    const p = (ctx.window.ATLAS_PACKS || {})[e.id];
    assert.ok(p, e.id);
    assert.equal('places' in p, false, e.id);
  }
});

test('the validator accepts the places fixture and rejects non-object opt-ins', async () => {
  // @ts-expect-error plain JS helper without type declarations
  const { validatePacks } = await import('./atlas-pack-validator.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'atlas-places-'));
  try {
    const bad: Record<string, string> = { arr: '[]', nul: 'null', boo: 'true', str: '"on"', num: '1' };
    writeFileSync(
      join(dir, 'registry.js'),
      'window.ATLAS_REGISTRY=' + JSON.stringify(['dune', ...Object.keys(bad)].map(id => ({ id }))) + ';',
    );
    const dune = readFileSync(new URL('dune.js', PACKS), 'utf8');
    const fixture = readFileSync(new URL('./fixtures/places-optin-fixture.js', import.meta.url), 'utf8');
    writeFileSync(join(dir, 'dune.js'), dune + '\n;' + fixture);
    for (const [id, v] of Object.entries(bad)) {
      writeFileSync(
        join(dir, id + '.js'),
        `(window.ATLAS_PACKS=window.ATLAS_PACKS||{})[${JSON.stringify(id)}]={id:${JSON.stringify(id)},meta:{title:"X"},books:{1:{}},places:${v},
          worlds:[{id:"w",name:"W",group:"g",books:[1],map:[0,26],blurb:"x",gfx:{type:"terran"},sites:[{id:"s",name:"S",lat:0,lon:0,desc:"d"}]}]};`,
      );
    }
    const r = validatePacks(dir);
    assert.deepEqual([...r['dune.js'].issues], []);
    assert.ok(!r['dune.js'].warn.some((w: string) => /places/.test(w)));
    for (const id of Object.keys(bad)) assert.match(r[id + '.js'].issues.join('\n'), /places must be an object/, id);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
