import test from 'node:test';
import assert from 'node:assert/strict';
import { UNIVERSE_PACKS, universePackById, validateUniversePack } from '../src/universe-packs.ts';

test('universe packs form valid, source-aware content manifests', () => {
  assert.equal(new Set(UNIVERSE_PACKS.map(pack => pack.id)).size, UNIVERSE_PACKS.length);
  for (const pack of UNIVERSE_PACKS) assert.deepEqual(validateUniversePack(pack), []);
});

test('the museum engine is ready while literary universes require source packs', () => {
  assert.equal(universePackById('museum-sandbox').status, 'ready');
  assert.ok(universePackById('museum-sandbox').scenarioIds.length > 0);
  for (const pack of UNIVERSE_PACKS.filter(pack => pack.id !== 'museum-sandbox')) {
    assert.equal(pack.status, 'source-required');
    assert.match(pack.sourceHint, /authorized source files/i);
  }
});
