import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// TA-01: the Earth land mask drives every Earth-based atlas surface. At 1024x512 the coastlines were
// visibly stair-stepped at 4K, so it must stay at least 4096x2048 (regenerate with scripts/make-earth-mask.py).
test('atlas Earth land mask is a 4096x2048 grayscale PNG', () => {
  const png = readFileSync(new URL('../public/atlas/earth-base.png', import.meta.url));
  assert.equal(png.toString('ascii', 12, 16), 'IHDR');
  assert.equal(png.readUInt32BE(16), 4096);
  assert.equal(png.readUInt32BE(20), 2048);
  assert.equal(png[25], 0, 'colour type 0 (grayscale)');
});

test('solar bake downsamples the Earth mask to at most 2048 wide', () => {
  const src = readFileSync(new URL('../public/atlas/solar-tex.js', import.meta.url), 'utf8');
  assert.match(src, /Math\.min\(1, 2048 \/ im\.width\)/);
});

test('phones get a 2048x1024 copy of the Earth mask', () => {
  const png = readFileSync(new URL('../public/atlas/earth-base-2048.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 2048);
  assert.equal(png.readUInt32BE(20), 1024);
  const engine = readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
  assert.match(engine, /SMALL\|\|LOWMEM\|\|MAXTEX<4096\?"earth-base-2048\.png":"earth-base\.png"/);
});
