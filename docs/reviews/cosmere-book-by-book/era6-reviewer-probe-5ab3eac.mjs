import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

// Reviewer-only prospective data check; never writes application files.
// Usage: node era6-reviewer-probe-5ab3eac.mjs --fetch > result.json
// --fetch needs authenticated gh; alternatively pass a saved input JSON.
const HEAD = '5ab3eacc79476bc69a88879b1abb696d13be263f';
const PINS = {
  'public/atlas/packs/cosmere.js':'0f333af7203077291dbc211799c8c47ecff7cb2a',
  'public/atlas/engine.js':'0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0',
  'public/atlas/reading.js':'4d9bc177294e5e33accf6f19825ef467f0bb90d4',
  'tests/atlas-scadrial-reduced.test.ts':'11d13c4447eeeb7e5739a69aa9cba02c9960e18b',
};
const OTHER = {
  24:['cf25cda66e91c573c421a0f3712623db72737a3b','3ff0aab059fa54e00f6e2ccc7b849d4bd206d958'],
  37:['03394c32816fcb5c95261bf6a9ea4520381a5838','5a74e300eaf88b2d3c81fa9bc957584cd4708e33'],
};
function fetchPinned(path,head){
  const x=JSON.parse(execFileSync('gh',['api',`repos/mckayec/universe-sandbox/contents/${path}?ref=${head}`],{encoding:'utf8',maxBuffer:8*1024*1024}));
  return {content:Buffer.from(x.content,'base64').toString('utf8'),sha:x.sha,head};
}
const input = process.argv[2]==='--fetch'
  ? {head:HEAD,files:Object.fromEntries(Object.keys(PINS).map(p=>[p,fetchPinned(p,HEAD)])),other:Object.fromEntries(Object.entries(OTHER).map(([pr,[head]])=>[pr,fetchPinned('public/atlas/packs/cosmere.js',head)]))}
  : JSON.parse(fs.readFileSync(process.argv[2] || 'era6-inputs.json', 'utf8'));
assert.equal(input.head,HEAD);
assert.deepEqual(Object.keys(input.files).sort(),Object.keys(PINS).sort());
for(const [p,sha] of Object.entries(PINS))assert.equal(input.files[p].sha,sha,p);
assert.deepEqual(Object.keys(input.other).sort(),Object.keys(OTHER).sort());
for(const [pr,[head,sha]] of Object.entries(OTHER)){assert.equal(input.other[pr].head,head);assert.equal(input.other[pr].sha,sha);}
const manifest = [];
for (const [path, value] of Object.entries(input.files)) {
  const b = Buffer.from(value.content);
  const actual = createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`), b])).digest('hex');
  assert.equal(actual, value.sha, path);
  manifest.push({path, sha: actual});
}
const prefix = input.files['tests/atlas-scadrial-reduced.test.ts'].content.split("test('payload:")[0];
const compiled = stripTypeScriptTypes(prefix.replace(/^import .*;\n/gm, '').replace(/const read = .*;\n/, 'const read = p => FILES[p].content;\n'));
const context = { FILES: input.files, vm, assert, Set, Map, WeakMap, URLSearchParams };
vm.createContext(context);
vm.runInContext(compiled + '\nglobalThis.setupForReview=setup; globalThis.surfacesForReview=surfaces;', context);
const setup = context.setupForReview;
const inspect = context.surfacesForReview;
const J = x => JSON.parse(JSON.stringify(x));
const OT = ['mistborn-the-final-empire','mistborn-the-well-of-ascension','mistborn-the-hero-of-ages'];
const base = setup({mode:'all'});
const B6 = base.p.spoilers.works.filter(x=>x.bucket===6).map(x=>x.id);
assert.equal(B6.length,3);
const MB05 = 'the-alloy-of-law';
assert.ok(B6.includes(MB05));
const candidate = {
  status: 'The Alloy of Law · industrial Elendel',
  blurb: 'In The Alloy of Law, Elendel has railways, canals, electric street lighting and steel-framed towers under construction. Horseless carriages share its streets with horse-drawn vehicles.',
  facts: [['Era','About 300 years after the original Mistborn trilogy']],
};
const gate = {in:[MB05],req:MB05};
const branches=[];
for(const [pr, entry] of Object.entries(input.other)){
  const c={window:{}}; vm.createContext(c);vm.runInContext(entry.content,c);
  const w=c.window.ATLAS_PACKS.cosmere.worlds.find(x=>x.id==='scadrial');
  const b=Buffer.from(entry.content);assert.equal(createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex'),entry.sha);
  branches.push({pr,head:entry.head,pack:entry.sha,era6:{status:w.eras[6].status,blurb:w.eras[6].blurb,facts:J(w.eras[6].facts)},sameBlurb:w.eras[6].blurb===base.w.eras[6].blurb});
}
const results=[];
let negativeControls=0;
const subsets=a=>Array.from({length:1<<a.length},(_,m)=>a.filter((_,i)=>m&(1<<i)));
const states=[];
for(const a of subsets(OT))for(const b of subsets(B6))states.push({mode:'set',ids:[...a,...b],full:a.length===3&&b.length===3});
for(const book of [2,6,10])states.push({mode:'legacy',book});
states.push({mode:'all'});
for(const state of states)for(const realm of ['physical','cognitive']){
  const old=setup(state);old.c.S.realm=realm;const before=inspect(old.c);
  const s=setup(state);s.c.S.realm=realm;
  Object.assign(s.w.eras[6],J(candidate));s.w.eras[6].gates={...(s.w.eras[6].gates||{}),status:J(gate),blurb:J(gate),facts:J(gate)};
  const after=inspect(s.c);
  const should=state.mode==='set'?state.full:(state.mode==='all'||state.book>=6);
  for(const key of ['status','blurb','facts'])assert.equal(vm.runInContext(`eraFieldOk(world,6,${JSON.stringify(key)},EFF())`,s.c),should,key);
  assert.equal(after.visible,before.visible,'world visibility unchanged');
  assert.equal(after.name,before.name,'name unchanged');
  assert.equal(after.card,before.card,'Cognitive card unchanged');
  assert.equal(after.star,before.star,'star unchanged');
  assert.equal(after.model,before.model,'model unchanged');
  if(should){
    assert.notEqual(before.blurb,candidate.blurb,'unmodified head must fail the candidate-copy expectation');negativeControls++;
    assert.equal(after.blurb,candidate.blurb);
    assert.deepEqual(J(after.facts),candidate.facts.map(f=>f.join(': ')));
    if(state.mode==='all'||state.book===10)assert.equal(after.status,before.status,'era10 status retained');
    else assert.equal(after.status,candidate.status);
  }else{
    assert.equal(after.blurb,before.blurb);assert.equal(after.status,before.status);assert.deepEqual(J(after.facts),J(before.facts));
  }
  const restored=J(s.w);restored.eras[6]=J(old.w.eras[6]);assert.deepEqual(restored,J(old.w),'no other world fields changed');
  results.push({state,realm,era6Visible:should,pass:true});
}
assert.equal(negativeControls,8);
console.log(JSON.stringify({head:input.head,manifest,branches,candidate,gate,statesPassed:results.length,statesTotal:136,negativeControlsDetected:negativeControls,negativeControlsTotal:8,results,limitations:'Prospective in-memory data only; actual extracted selectors. Negative controls compare unchanged-head copy in the eight visible candidate states. No application write, browser execution, source truth test or parent promotion.'},null,2));
