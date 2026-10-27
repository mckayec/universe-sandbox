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
