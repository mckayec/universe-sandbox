import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// CS-2 (audit-final.md at 9d53e7c): a reader-visible selected-coverage notice, readable on desktop and phone.
const ctx: { window: Record<string, any> } = { window: {} };
vm.runInNewContext(readFileSync(new URL('../public/atlas/layers.js', import.meta.url), 'utf8'), ctx);
vm.runInNewContext(readFileSync(new URL('../public/atlas/packs/lds-standard-works.js', import.meta.url), 'utf8'), ctx);
const meta = ctx.window.ATLAS_PACKS['lds-standard-works'].meta;
const engine = readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../public/atlas/engine.css', import.meta.url), 'utf8');

test('CS-2: meta.notice is the exact selected-coverage text', () => {
  assert.equal(
    meta.notice,
    'Independent educational atlas with selected coverage, not a verse-complete concordance. ' +
      'Not an official publication of The Church of Jesus Christ of Latter-day Saints. ' +
      'Scripture narratives, religious beliefs, historical evidence and geographic proposals are labelled separately.',
  );
});

test('CS-2: the notice is repeated in the world dossier where the Chronicle credits are hidden', () => {
  assert.match(engine, /<p class="srcnote fan narrow-notice">'\+esc\(fanNotice\(M\)\)/);
  assert.match(css, /\.srcnote\.narrow-notice\{display:none\}/);
  assert.match(
    css,
    /@media \(max-width:1180px\)\{\.credits\{display:none\}\.srcnote\.narrow-notice\{display:block\}\}/,
  );
});

test('T70-1: the notice uses muted (not faint) ink and the credits strip has a dark backing', () => {
  assert.match(
    css,
    /\.chron-head \.credits\{color:var\(--muted\);background:rgba\(7,9,13,\.78\);padding:4px 8px;border-radius:4px\}/,
  );
  assert.match(css, /\.srcnote\.fan\{color:var\(--muted\)\}/);
});
