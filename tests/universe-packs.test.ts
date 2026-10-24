import test from 'node:test';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { UNIVERSE_PACKS, universePackById, validateUniversePack } from '../src/universe-packs.ts';

test('universe packs form valid, source-aware content manifests', () => {
  assert.equal(new Set(UNIVERSE_PACKS.map(pack => pack.id)).size, UNIVERSE_PACKS.length);
  for (const pack of UNIVERSE_PACKS) assert.deepEqual(validateUniversePack(pack), []);
});

test('the museum engine is ready, atlases link to pages, and the rest still need source packs', () => {
  assert.equal(universePackById('museum-sandbox').status, 'ready');
  assert.ok(universePackById('museum-sandbox').scenarioIds.length > 0);
  for (const pack of UNIVERSE_PACKS.filter(pack => pack.status === 'atlas'))
    assert.match(pack.atlasPath ?? '', /^[a-z-]+\/[^/]*$/);
  for (const pack of UNIVERSE_PACKS.filter(pack => pack.status === 'source-required'))
    assert.match(pack.sourceHint, /authorized source files/i);
  assert.equal(universePackById('red-rising').status, 'atlas');
});

test('atlas pages referenced by packs exist in public/', () => {
  for (const pack of UNIVERSE_PACKS.filter(pack => pack.atlasPath)) {
    const path = pack.atlasPath!.split('?')[0];
    const file = new URL(`../public/${path.endsWith('/') ? `${path}index.html` : path}`, import.meta.url);
    assert.ok(existsSync(file), `${pack.id}: missing public/${path}`);
  }
});
