import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// INT850-1 (integration-review-850bee7.md): after the PR33 integration the shared codex renderer `cxItem` dropped the
// reference card's `cx-<id>` element id and its `hl` highlight, so `openCodex(tab, entry)` found no target and left the
// codex body at the top. Run the exact renderer from engine.js with small stubs for its helpers.
const engine = readFileSync(new URL('../public/atlas/engine.js', import.meta.url), 'utf8');
const src = engine.match(/function cxItem\(x\)\{[^\n]*\n(?:[^\n]*\n)*?[^\n]*'<\/div>';\}\n/)![0];

function renderer(cxHl: string | null) {
  const make = new Function(
    'cxHl',
    `const ARR=v=>Array.isArray(v)?v:v==null?[]:[v];const EFF=()=>99;const LY=null,LAY=null,TL=null;
     const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
     const bks=()=>"";const cxSrc=()=>"";const cxSee=()=>"";
     ${src}return cxItem;`,
  );
  return make(cxHl) as (x: Record<string, unknown>) => string;
}
const card = { id: 'chp-constantinople', name: 'Constantinople', desc: 'Council of 381.' };

test('INT850-1: the requested reference card keeps its cx-<id> element id and gets the hl class', () => {
  const html = renderer('chp-constantinople')(card);
  assert.match(html, /^<div class="cx-item hl" id="cx-chp-constantinople">/);
});

test('INT850-1: other reference cards keep their id but are not highlighted', () => {
  const html = renderer('chp-rome')(card);
  assert.match(html, /^<div class="cx-item" id="cx-chp-constantinople">/);
  assert.match(renderer(null)(card), /^<div class="cx-item" id="cx-chp-constantinople">/);
});

test('INT850-1: LDS see-also cards keep data-key and heading focus; no id without a reference-card id', () => {
  const html = renderer(null)({ key: 'lehi', name: 'Lehi' });
  assert.match(html, /^<div class="cx-item" data-key="lehi"><h3 tabindex="-1">Lehi<\/h3>/);
  assert.doesNotMatch(html, / id=/);
  const both = renderer('x1')({ id: 'x1', key: 'k1', name: 'Both' });
  assert.match(both, /^<div class="cx-item hl" id="cx-x1" data-key="k1"><h3 tabindex="-1">/);
});

test('INT850-1: openCodex scrolls only the codex body to the cx-<id> target; see-also jumps clear the old highlight', () => {
  assert.match(engine, /const it=cxHl&&document\.getElementById\("cx-"\+cxHl\);const body=\$\("#cxBody"\);/);
  assert.match(engine, /if\(body\)body\.scrollTop=it\?Math\.max\(0,it\.offsetTop-body\.offsetTop-12\):0;/);
  assert.match(engine, /function cxGo\(key\)\{[^\n]*\n {2}cxTab=t\.tab;cxHl=null;renderCodex\(\);/);
  const css = readFileSync(new URL('../public/atlas/engine.css', import.meta.url), 'utf8');
  assert.match(css, /\.cx-item\.hl\{border-top-color:var\(--lapis-hi\)/);
});
