import assert from 'node:assert/strict';
import test from 'node:test';
import { UNIVERSE_PACKS } from '../src/universe-packs.ts';
// @ts-expect-error plain JS helper without type declarations
import { loadRegistry } from './atlas-pack-validator.mjs';

type RegistryEntry = { id: string; title: string; blurb: string; accent: string };
const registry: RegistryEntry[] = loadRegistry();
const engineAtlases = UNIVERSE_PACKS.filter(pack => pack.atlasPath?.startsWith('atlas/?pack='));

// The pack list lives twice: public/atlas/packs/registry.js (the atlas chooser) and src/universe-packs.ts (the
// sandbox's Universe library). They must name the same packs, link to them correctly and share an accent.
test('atlas registry.js and universe-packs.ts list the same engine atlases', () => {
  const fromRegistry = [...registry.map(r => String(r.id))].sort();
  const fromApp = engineAtlases.map(pack => pack.atlasPath!.slice('atlas/?pack='.length)).sort();
  assert.deepEqual(fromApp, fromRegistry);
});

test('each engine atlas links to its own pack and uses the registry accent', () => {
  for (const pack of engineAtlases) {
    const id = pack.atlasPath!.slice('atlas/?pack='.length);
    assert.equal(pack.id, id, `${pack.id} links to ?pack=${id}`);
    const entry = registry.find(r => r.id === id)!;
    assert.equal(pack.accent.toLowerCase(), entry.accent.toLowerCase(), `${id}: accent differs`);
  }
});

test('no planned pack claims a licence', () => {
  for (const pack of UNIVERSE_PACKS) assert.doesNotMatch(pack.eyebrow, /licen[cs]ed/i, pack.id);
});
