import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// CS-1 (final-package-review-e2c02e4.md): all 33 previously unlinked codex cards carry official source links.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8'), ctx);
// JSON round-trip: arrays from the vm realm are not deepEqual to this realm's arrays
const P = JSON.parse(JSON.stringify(ctx.window.ATLAS_PACKS['lds-standard-works']));
const tab = (id: string) => P.codex.find((t: any) => t.id === id).list;

const EXPECTED: [string, number, string[]][] = [
  ['works', 0, ['Guide to the Scriptures: Standard Works']],
  ['works', 1, ['Matthew 28:1–20']],
  ['works', 2, ['Mosiah 18:8–10']],
  ['works', 3, ['D&C introduction', 'D&C 7 (section heading)']],
  ['works', 4, ['Abraham 3:2–4, 9']],
  ['works', 5, ['Articles of Faith 1:4']],
  ['works', 6, ['Articles of Faith 1:8–9']],
  ['unmapped-places', 0, ['Genesis 12:4–5']],
  ['unmapped-places', 1, ['Abraham 2:14–15']],
  ['unmapped-places', 2, ['Genesis 12:6']],
  ['unmapped-places', 3, ['Genesis 12:8']],
  ['unmapped-places', 4, ['Genesis 12:10']],
  ['unmapped-places', 5, ['Exodus 3:1–2']],
  ['unmapped-places', 6, ['Genesis 11:31']],
  ['unmapped-places', 7, ['Abraham 2:1–4']],
  ['unmapped-places', 8, ['Zechariah 14:4']],
  ['unmapped-places', 9, ['Matthew 26:30']],
  ['unmapped-places', 10, ['Joseph Smith—Matthew 1:4']],
  ['unmapped-places', 11, ['Matthew 26:36–39']],
  ['unmapped-places', 12, ['Matthew 27:33']],
  ['unmapped-places', 13, ['Mosiah 18:4–17']],
  ['unmapped-places', 14, ['3 Nephi 11:1–10']],
  ['unmapped-places', 15, ['Joseph Smith—History 1:3, 14–17']],
  ['unmapped-places', 16, ['D&C 38:4']],
  ['unmapped-places', 17, ['Moses 7:18–21, 69']],
  ['unmapped-places', 18, ['Abraham 2:16–17']],
  ['unmapped-narratives', 0, ['Genesis 12:4–10']],
  ['unmapped-narratives', 1, ['Exodus 3:1–12']],
  ['unmapped-narratives', 2, ['Mosiah 18:7–17']],
  ['unmapped-narratives', 3, ['3 Nephi 11:1–17']],
  ['unmapped-narratives', 4, ['D&C introduction']],
  ['unmapped-narratives', 5, ['Joseph Smith—History 1:14–20']],
  ['unmapped-narratives', 6, ['Abraham 2:4–21', 'Genesis 12:4']],
];

test('CS-1: each of the 33 cards has its intended official source labels', () => {
  assert.equal(EXPECTED.length, 33);
  for (const [id, i, labels] of EXPECTED) {
    const card = tab(id)[i];
    assert.deepEqual(
      card.src.map((s: any) => s.t),
      labels,
      `${id}[${i}] ${card.name}`,
    );
    for (const s of card.src)
      assert.match(s.u, /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\/[a-z0-9/-]+\?lang=eng$/);
  }
});

test('CS-1: every codex card in the pack now has at least one source link', () => {
  let n = 0;
  for (const t of P.codex)
    for (const x of t.list) {
      n++;
      assert.ok(Array.isArray(x.src) && x.src.length > 0, `${t.id} ${x.key || x.name}`);
    }
  assert.equal(n, 1647);
});

test('CS-1: paired accounts keep separate sources and gates', () => {
  const pl = tab('unmapped-places');
  const enoch = pl.filter((x: any) => /^P17-/.test(x.key || ''));
  assert.deepEqual(
    enoch.map((x: any) => [x.layers[0], x.src[0].t]),
    [
      ['dc', 'D&C 38:4'],
      ['pgp', 'Moses 7:18–21, 69'],
    ],
  );
  const abr = tab('unmapped-narratives').find((x: any) => x.name === 'Abraham’s journey account');
  assert.ok(
    abr.src.some((s: any) => /\/pgp\/abr\/2\?/.test(s.u)) && abr.src.some((s: any) => /\/ot\/gen\/12\?/.test(s.u)),
  );
  const fv = tab('unmapped-narratives').filter((x: any) => x.name === 'First Vision account');
  assert.deepEqual(
    fv.map((x: any) => [x.layers[0], x.src.map((s: any) => s.t).join('|')]),
    [
      ['dc', 'D&C introduction'],
      ['pgp', 'Joseph Smith—History 1:14–20'],
    ],
  );
});
