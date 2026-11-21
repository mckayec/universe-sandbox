/* FD01-PUBLICATION-01 (ChatGPT fd01-handoff-2026-11-21.md, existing FD08): on PR48 only, events[e63].text drops
   the real-world publication parenthetical. The parent pack is rebuilt by reversing exactly this replacement;
   the parsed packs must differ only in that one field (id, book, world, site, title and gates unchanged). */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const packSrc = fs.readFileSync(new URL('../public/atlas/packs/cosmere.js', import.meta.url), 'utf8');

const OLD_TEXT =
  'December sets out to warn Kingseat of a coming plague. (The Fires of December, published October 2026.)';
const NEW_TEXT = 'December sets out to warn Kingseat of a coming plague.';

const parse = (src: string) => {
  const w: any = {};
  vm.runInNewContext(src, { window: w });
  return JSON.parse(JSON.stringify(w.ATLAS_PACKS.cosmere));
};

test('e63 text is the handoff string and the publication aside is gone', () => {
  const e63 = parse(packSrc).events.filter((e: any) => e.id === 'e63');
  assert.equal(e63.length, 1);
  assert.equal(e63[0].text, NEW_TEXT);
  assert.ok(!packSrc.includes(OLD_TEXT), 'old text gone');
  assert.ok(!packSrc.includes('published October 2026'), 'no publication aside anywhere in the pack');
});

test('reversing the one replacement restores the parent exactly; only e63.text differs', () => {
  const marker = `text: "${NEW_TEXT}"}`;
  assert.equal(packSrc.split(marker).length, 2, 'new e63 text occurs once');
  const parentSrc = packSrc.replace(marker, `text: "${OLD_TEXT}"}`);
  assert.equal(parentSrc.replace(`text: "${OLD_TEXT}"}`, marker), packSrc, 'whole-source reversal');
  const head = parse(packSrc);
  const parent = parse(parentSrc);
  const p63 = parent.events.find((e: any) => e.id === 'e63');
  const h63 = head.events.find((e: any) => e.id === 'e63');
  assert.equal(p63.text, OLD_TEXT);
  assert.deepEqual({ ...h63, text: OLD_TEXT }, p63, 'all other e63 fields unchanged');
  p63.text = NEW_TEXT;
  assert.deepEqual(head, parent, 'whole parsed pack equal once e63.text is restored');
});
