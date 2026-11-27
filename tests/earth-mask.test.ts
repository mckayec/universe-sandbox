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
  // the mask follows the bake size: phones (2048), low-memory and software-GL devices (1024) get the copy
  assert.match(engine, /HD<4096\?"earth-base-2048\.png":"earth-base\.png"/);
  assert.match(engine, /const HD=window\.__HD\|\|Math\.min\(LIGHT\?1024:SMALL\?2048:4096,MAXTEX\)/);
});

test('software GL gets the light surface path and the bake never runs unbounded strips (T5-1)', () => {
  const engine = readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
  assert.match(engine, /swiftshader\|llvmpipe\|softpipe\|software\|basic render/);
  assert.match(engine, /const LIGHT=LOWMEM\|\|SOFTGL;/);
  assert.match(engine, /if\(SMALL\|\|LIGHT\)return 2048;/);
  // a new job starts from a small probe strip, and the next strip scales with the last frame's cost
  assert.match(engine, /if\(!bakeJobs\.length\)BAKE_SCALE=Math\.min\(BAKE_SCALE,BAKE_PROBE\)/);
  assert.match(engine, /BAKE_SCALE\*clamp\(20\/Math\.max\(ft,1\),\.1,1\.15\)/);
});
