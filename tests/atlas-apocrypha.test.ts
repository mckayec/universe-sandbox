import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// The apocrypha pack must follow its research contract (docs/universes/packs/christian-apocrypha/):
// 39 work slots from work-gates.csv, and none of the excluded Meqabyan rows XO-U01–XO-U11.
const ctx: { window: Record<string, any> } = { window: {} };
const src = readFileSync(new URL('../public/atlas/packs/christian-apocrypha.js', import.meta.url), 'utf8');
vm.runInNewContext(src, ctx);
const pack = ctx.window.ATLAS_PACKS['christian-apocrypha'];
const data = JSON.stringify(pack);
const research = new URL('../docs/universes/packs/christian-apocrypha/', import.meta.url);

/* minimal CSV reader: quoted fields with doubled quotes and embedded commas/newlines */
function readCsv(name: string): Record<string, string>[] {
  const text = readFileSync(new URL(name, research), 'utf8');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') ((cell += '"'), i++);
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') (row.push(cell), (cell = ''));
    else if (ch === '\n') (row.push(cell), rows.push(row), (row = []), (cell = ''));
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) (row.push(cell), rows.push(row));
  const [head, ...body] = rows;
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

test('books are exactly the 39 work slots of work-gates.csv', () => {
  const gates = readCsv('work-gates.csv');
  assert.equal(gates.length, 39);
  assert.deepEqual(
    Object.keys(pack.books).map(Number),
    gates.map(g => Number(g.first)),
  );
});

test('no excluded Meqabyan record (XO-U01–XO-U11) reaches the pack', () => {
  const rows = readCsv('expanded-ot-integration.csv').filter(r => /^XO-U\d+$/.test(r.record_id));
  assert.equal(rows.length, 11);
  for (const r of rows) {
    assert.ok(!data.includes(r.record_id), `${r.record_id} appears in the pack`);
    // the claim text after the "label;locator |" prefix must not appear either
    const claim = r.passage_and_claim.split('|').slice(1).join('|').replace(/\[.*$/, '').trim();
    if (claim.length > 12) assert.ok(!data.includes(claim.slice(0, 40)), `${r.record_id} copy appears in the pack`);
  }
  // Meqabyan slots carry no events
  for (const e of pack.events || []) assert.ok(![18, 19, 20].includes(e.book), `event ${e.id} is in a Meqabyan slot`);
});

test('only the five reused anchors are pinned, all on Earth', () => {
  const sites = pack.worlds.flatMap((w: any) => w.sites || []).map((s: any) => s.id);
  assert.deepEqual([...sites].sort(), ['babylon', 'bethlehem', 'jerusalem', 'nazareth', 'rome']);
});

test('codex text naming a work is gated at that work', () => {
  // "Work: …" prefixes in a codex description must belong to the entry's own `first` slot; later works'
  // mentions go in `more` so they are not shown to a visitor who has chosen an earlier work.
  const slotOf: Record<string, number> = {
    Tobit: 1,
    Judith: 2,
    Wisdom: 3,
    Sirach: 4,
    'Sirach, prologue': 4,
    Baruch: 5,
    'First Maccabees': 6,
    'Second Maccabees': 7,
    'Esther additions': 8,
    Susanna: 9,
    'Bel and the Dragon': 9,
  };
  const label = /(?:^|\. )([A-Z][A-Za-z ,]*?): /g;
  for (const section of pack.codex) {
    for (const e of section.list) {
      for (const m of e.desc.matchAll(label)) {
        const slot = slotOf[m[1]];
        if (slot !== undefined) assert.equal(slot, e.first, `${e.name}: "${m[1]}:" text shown from slot ${e.first}`);
      }
      for (const [book, text] of e.more || []) {
        assert.ok(book > e.first && e.books.includes(book), `${e.name}: bad more entry for ${book}`);
        const m = /^([A-Z][A-Za-z ,]*?): /.exec(text);
        if (m && slotOf[m[1]] !== undefined) assert.equal(slotOf[m[1]], book, `${e.name}: more text for ${book}`);
      }
    }
  }
});

test('every 1 Maccabees place-reference row has its own codex entry', () => {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/^the /, '')
      .replace(/[^a-z]/g, '');
  const rows = readCsv('deuterocanonical-integration.csv').filter(r => r.kind === 'place-reference' && r.first === '6');
  const entries = pack.codex.find((s: any) => s.id === 'places').list.filter((e: any) => e.first === 6);
  const anchors = pack.worlds.flatMap((w: any) => (w.sites || []).map((s: any) => norm(s.name)));
  for (const r of rows) {
    const label = norm(r.label);
    const found = anchors.includes(label) || entries.some((e: any) => norm(e.name).includes(label));
    assert.ok(found, `${r.id} (${r.label}) has no slot-6 codex entry`);
  }
  assert.equal(entries.length, rows.length - 1, 'one entry per row; Rome is a pinned anchor');
});

test('every Tobit and Judith place-reference row has a codex entry scoped to its first work', () => {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/^the /, '')
      .replace(/[^a-z]/g, '');
  const rows = readCsv('deuterocanonical-integration.csv').filter(
    r => r.kind === 'place-reference' && (r.first === '1' || r.first === '2'),
  );
  const list = pack.codex.find((s: any) => s.id === 'places').list;
  const anchors = pack.worlds.flatMap((w: any) => (w.sites || []).map((s: any) => norm(s.name)));
  assert.ok(rows.length > 70);
  for (const r of rows) {
    const label = norm(r.label.split(';')[0]);
    const found =
      anchors.includes(label) || list.some((e: any) => e.first === Number(r.first) && norm(e.name).includes(label));
    assert.ok(found, `${r.id} (${r.label}) has no codex entry scoped to slot ${r.first}`);
  }
});

test('2 Maccabees place-reference rows each have one codex entry', () => {
  const rows = readCsv('deuterocanonical-integration.csv').filter(r => r.kind === 'place-reference' && r.first === '7');
  const entries = pack.codex.find((s: any) => s.id === 'places').list.filter((e: any) => e.first === 7);
  assert.equal(entries.length, rows.length);
});

test('expanded OT narrative rows for slots 10–15 each have a Chronicle entry at their own work', () => {
  const idx = readCsv('record-work-index.csv').filter(r => +r.first >= 10 && +r.first <= 15);
  const narrative = idx.filter(r => /^XO-E\d+$|^XE2-E\d+$|^XE2-C0[134]$|^XO-P0[1367]$/.test(r.id));
  assert.ok(narrative.length >= 20);
  for (const r of narrative) {
    const e = pack.events.find((x: any) => x.id === r.id.toLowerCase());
    assert.ok(e, `no Chronicle entry for ${r.id}`);
    assert.equal(e.book, +r.first, `${r.id} is gated at the wrong work`);
    assert.ok(!e.site || ['jerusalem', 'babylon'].includes(e.site), `${r.id} pinned off-anchor`);
  }
});

test('visionary settings carry no site and appear only in their own section', () => {
  const vis = pack.codex.find((c: any) => c.id === 'visions');
  assert.ok(vis && vis.list.length >= 2);
  for (const e of vis.list) assert.ok(!('site' in e) && !('lat' in e), `${e.name} has a location`);
  const places = pack.codex.find((c: any) => c.id === 'places').list.map((e: any) => e.name);
  for (const e of vis.list) assert.ok(!places.includes(e.name), `${e.name} also listed as a place`);
});

test('1 Enoch and Jubilees: every event row has an unpinned Chronicle entry at its own work', () => {
  const idx = readCsv('record-work-index.csv').filter(r => r.first === '16' || r.first === '17');
  const events = idx.filter(r => /^XO-E\d+$/.test(r.id));
  assert.equal(events.length, 17);
  for (const r of events) {
    const e = pack.events.find((x: any) => x.id === r.id.toLowerCase());
    assert.ok(e, `no Chronicle entry for ${r.id}`);
    assert.equal(e.book, +r.first, `${r.id} is gated at the wrong work`);
    assert.ok(!e.site, `${r.id} is pinned; its coordinates are null`);
  }
  const at = (id: string, slot: number) =>
    pack.codex.find((c: any) => c.id === id).list.filter((e: any) => e.first === slot);
  const journeys = idx.filter(r => /^XO-J\d+$/.test(r.id));
  assert.equal(
    at('journeys', 16).length + at('journeys', 17).length,
    journeys.length,
    'one journey entry per XO-J row',
  );
  assert.equal(at('visions', 16).length, 12, 'twelve schematic 1 Enoch settings');
  assert.equal(at('visions', 17).length, 0, 'Jubilees settings are reference places, not visions');
});

test('Ascension of Isaiah and 4 Baruch: every related-tradition row is used at its own work', () => {
  const rows = readCsv('related-traditions-integration.csv').filter(
    r => r.work_key === 'ascension-of-isaiah' || r.work_key === '4-baruch',
  );
  assert.equal(rows.length, 58);
  const slot = (r: any) => (r.work_key === 'ascension-of-isaiah' ? 21 : 22);
  for (const r of rows.filter(r => r.type === 'event-topic')) {
    const e = pack.events.find((x: any) => x.id === r.id.toLowerCase());
    assert.ok(e, `no Chronicle entry for ${r.id}`);
    assert.equal(e.book, slot(r), `${r.id} is gated at the wrong work`);
  }
  const at = (id: string, s: number) => pack.codex.find((c: any) => c.id === id).list.filter((e: any) => e.first === s);
  assert.equal(at('journeys', 21).length + at('journeys', 22).length, rows.filter(r => r.type === 'journey').length);
  assert.equal(at('visions', 21).length, 4, 'firmament, seven heavens, Sheol, Gehenna');
  const sites = pack.worlds.flatMap((w: any) => w.sites || []);
  const badge = (id: string) => sites.find((x: any) => x.id === id).books;
  for (const [id, s] of [
    ['jerusalem', 21],
    ['jerusalem', 22],
    ['babylon', 22],
    ['bethlehem', 21],
    ['nazareth', 21],
  ] as const)
    assert.ok(badge(id).includes(s), `${id} badge lacks slot ${s}`);
  const places = pack.codex.find((c: any) => c.id === 'places').list;
  for (const n of ['The Jordan', 'Samaria'])
    assert.ok(
      places.find((e: any) => e.name === n).more.some(([b]: [number]) => b === 22),
      `${n} lacks its 4 Baruch mention`,
    );
});
