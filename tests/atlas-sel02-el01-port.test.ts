/* SEL02-EL01-PORT (ChatGPT sel02-reconciliation-2026-11-21.md): on PR48 only, the Sel Elantris site
   description drops the sentence "Its streets trace Aon Ela. " (no substitute). The parent pack is rebuilt
   by reversing exactly this deletion; the parsed packs must differ only in that one field. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const packSrc = fs.readFileSync(new URL('../public/atlas/packs/cosmere.js', import.meta.url), 'utf8');

const NEW_DESC =
  'The shining city of the Elantrians in north-east Arelon, near the coast and the northern end of the Atad Mountains. After the Reod its walls hold the Shaod’s victims; Raoden is thrown in here at the start of the book.';
const OLD_DESC =
  'The shining city of the Elantrians in north-east Arelon, near the coast and the northern end of the Atad Mountains. Its streets trace Aon Ela. After the Reod its walls hold the Shaod’s victims; Raoden is thrown in here at the start of the book.';

const parse = (src: string) => {
  const w: any = {};
  vm.runInNewContext(src, { window: w });
  return JSON.parse(JSON.stringify(w.ATLAS_PACKS.cosmere));
};

const site = (pack: any) => pack.worlds.find((w: any) => w.id === 'sel').sites.filter((s: any) => s.id === 'elantris');

test('Sel Elantris site description is the handoff string; the Aon Ela sentence is gone', () => {
  const s = site(parse(packSrc));
  assert.equal(s.length, 1);
  assert.equal(s[0].desc, NEW_DESC);
  assert.ok(!packSrc.includes('Its streets trace Aon Ela'), 'old sentence gone');
  assert.ok(!/streets trace Aon Rao/.test(packSrc), 'no Rao substitute');
});

test('reversing the one deletion restores the parent exactly; only that desc differs', () => {
  const marker = `desc: "${NEW_DESC}"`;
  assert.equal(packSrc.split(marker).length, 2, 'new desc occurs once');
  const parentSrc = packSrc.replace(marker, `desc: "${OLD_DESC}"`);
  assert.equal(parentSrc.replace(`desc: "${OLD_DESC}"`, marker), packSrc, 'whole-source reversal');
  const head = parse(packSrc);
  const parent = parse(parentSrc);
  const p = site(parent)[0];
  const h = site(head)[0];
  assert.equal(p.desc, OLD_DESC);
  assert.deepEqual({ ...h, desc: OLD_DESC }, p, 'all other site fields unchanged');
  p.desc = NEW_DESC;
  assert.deepEqual(head, parent, 'whole parsed pack equal once desc is restored');
});
