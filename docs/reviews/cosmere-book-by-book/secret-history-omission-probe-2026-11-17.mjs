// Documentation-only proposal probe. Does not write application files.
// Usage: node secret-history-omission-probe-2026-11-17.mjs <input-json> > <output-json>
// Input JSON: { head, pack:{content,sha}, engine:{content,sha}, reading:{content,sha},
// older:[{pr,head,content,sha}] } from authenticated GitHub reads.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const J = x => JSON.parse(JSON.stringify(x));
const checks = [];
function check(id, fn) {
  try { fn(); checks.push({id, pass:true}); }
  catch(e) { checks.push({id, pass:false, detail:e.message}); }
}
const blob = s => crypto.createHash('sha1').update('blob ' + Buffer.byteLength(s) + '\0').update(s).digest('hex');
for (const k of ['pack','engine','reading']) check('hash/'+k,()=>assert.equal(blob(input[k].content),input[k].sha));
for (const p of input.older) check('hash/pr'+p.pr,()=>assert.equal(blob(p.content),p.sha));
const engine=input.engine.content;
function cut(a,b) {
  const i=engine.indexOf(a), j=engine.indexOf(b,i);
  assert.ok(i>=0&&j>i,'missing selector markers: '+a);
  return engine.slice(i,j);
}
function parsePack(src) {
  const c={window:{}};vm.createContext(c);vm.runInContext(src,c);
  return J(c.window.ATLAS_PACKS.cosmere);
}
const base=parsePack(input.pack.content);
const find=p=>p.worlds.find(w=>w.id==='scadrial');
const sub=p=>p.realms.cognitive.subastrals.find(s=>s.world==='scadrial');
const neutral='No world-specific description is provided in this view. The appearance is an illustration, not a verified map.';
const candidate=J(base);
delete find(candidate).realms.cognitive;
delete sub(candidate).name;
candidate.realms.cognitive.unknown=neutral;
for(const older of input.older) {
  const p=parsePack(older.content);
  check('reconcile/pr'+older.pr+'/world-cognitive',()=>assert.deepEqual(find(p).realms.cognitive,find(base).realms.cognitive));
  check('reconcile/pr'+older.pr+'/subastral-row',()=>assert.deepEqual(sub(p),sub(base)));
  check('reconcile/pr'+older.pr+'/unknown',()=>assert.equal(p.realms.cognitive.unknown,base.realms.cognitive.unknown));
}
const restored=J(candidate);
find(restored).realms.cognitive=find(base).realms.cognitive;
sub(restored).name=sub(base).name;
restored.realms.cognitive.unknown=base.realms.cognitive.unknown;
check('preservation/only-three-targets',()=>assert.deepEqual(restored,base));
check('payload/world-bundle-absent',()=>assert.equal(find(candidate).realms.cognitive,undefined));
check('payload/subastral-name-absent',()=>assert.equal(sub(candidate).name,undefined));
check('payload/old-name-zero-occurrences',()=>assert.ok(!JSON.stringify(candidate).includes('Expanse of the Vapors')));
check('payload/global-text-held-unchanged',()=>assert.equal(candidate.realms.cognitive.text,base.realms.cognitive.text));
check('payload/global-look-held-unchanged',()=>assert.deepEqual(candidate.realms.cognitive.look,base.realms.cognitive.look));
check('payload/thresholds-unchanged',()=>assert.deepEqual([find(candidate).first,sub(candidate).first,candidate.realms.cognitive.first],[2,7,4]));
function setup(p,st) {
  const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);
  vm.runInContext(input.reading.content,c);
  const R=c.window.AtlasReading, reg=R.normRegistry(p);
  assert.ok(reg.ok);
  Object.assign(c,{
    RDG:R,RREG:reg,RSET:new Set(st.ids||[]),WORLDS:p.worlds,
    WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),
    PW:()=>st.mode==='set',CUM:true,LY:null,
    S:{realm:'cognitive',book:st.mode==='legacy'?st.book:0},
    RL:p.realms,RCOG:p.realms.cognitive,RSPI:p.realms.spiritual,
    SHARDS:p.realms.spiritual.shards,world:find(p),esc:s=>String(s)
  });
  vm.runInContext('const EFF=()=>S.book||99;',c);
  for(const [a,b] of [
    ['const GCACHE=new WeakMap();','/* intro copy'],
    ['const firstOf=w=>','\n'],
    ['const eraVal=','\nconst realmOk'],
    ['const eraKeys=','\n'],
    ['function statusFor(w)','const bk1='],
    ['const STYLE_IX=','function applyRealmToPlanet'],
    ['const realmFirst=r=>','function renderRealmBar'],
    ['function realmCard(w)','if($("#realms"))']
  ]) vm.runInContext(cut(a,b),c);
  return c;
}
const read=c=>J(vm.runInContext('({visible:!PW()||pvis(worldChain(world)),name:wName(world),status:statusFor(world),blurb:eraVal(world,"blurb"),facts:eraVal(world,"facts"),realmOpen:realmOpen("cognitive"),card:realmCard(world),look:realmLook(world)})',c));
const MB=['mistborn-the-final-empire','mistborn-the-well-of-ascension','mistborn-the-hero-of-ages'];
const SH='mistborn-secret-history', WOK='the-way-of-kings';
const states=Array.from({length:8},(_,m)=>({id:'trilogy-subset-'+m,mode:'set',ids:MB.filter((_,i)=>m&(1<<i))}));
states.push(
  {id:'secret-history-only',mode:'set',ids:[SH]},
  {id:'trilogy-and-secret-history',mode:'set',ids:[...MB,SH]},
  {id:'trilogy-and-way-of-kings',mode:'set',ids:[...MB,WOK]},
  {id:'trilogy-way-of-kings-secret-history',mode:'set',ids:[...MB,WOK,SH]},
  {id:'later-era-only',mode:'set',ids:['the-alloy-of-law','shadows-of-self','the-bands-of-mourning']},
  {id:'all-works-set',mode:'set',ids:base.spoilers.works.map(w=>w.id)},
  {id:'all-mode',mode:'all'},
  ...[2,4,7,10].map(book=>({id:'legacy-'+book,mode:'legacy',book}))
);
const matrix=[],negative=[];
for(const st of states) {
  const b=setup(J(base),st),c=setup(J(candidate),st),before=read(b),after=read(c);
  check(st.id+'/parent-and-accepted-fields',()=>assert.deepEqual(
    [after.visible,after.name,after.status,after.blurb,after.facts],
    [before.visible,before.name,before.status,before.blurb,before.facts]));
  check(st.id+'/realm-opening-unchanged',()=>assert.equal(after.realmOpen,before.realmOpen));
  check(st.id+'/neutral-card',()=>assert.ok(after.card.includes(neutral)));
  check(st.id+'/no-old-name-or-blurb',()=>assert.ok(!after.card.includes('Expanse of the Vapors')&&!after.card.includes(find(base).realms.cognitive.blurb)));
  check(st.id+'/generic-look',()=>assert.deepEqual(after.look,{i:1,st:4,c1:'#1e1a2c',c2:'#5a5088',c3:'#0e0c14'}));
  vm.runInContext('S.realm="physical"',c);
  check(st.id+'/physical-card-empty',()=>assert.equal(vm.runInContext('realmCard(world)',c),''));
  negative.push({state:st.id,neutralExpectationPassesOnUnmodifiedBase:before.card.includes(neutral)});
  matrix.push({state:st.id,selected:st.ids||null,parentVisible:after.visible,cognitiveOpen:after.realmOpen,
    baselineCard:before.card,candidateCard:after.card,candidateLook:after.look});
}
// Execute the actual subastral loop with rendering dependencies stubbed.
// This records label/sprite creation requests, NOT browser rendering or positions.
function subastralCalls(p) {
  const labels=[],sprites=[];
  const c={RCOG:p.realms.cognitive,ARR:x=>Array.isArray(x)?x:[],
    WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,{pos:{clone:()=>({})}}])),
    THREE:{Vector3:class{}},glowTex:x=>x,realmSprite:(...x)=>sprites.push(x[4]),
    regionLabel:(text)=>labels.push(text),saOff:()=>[0,0,0]};
  vm.createContext(c);
  vm.runInContext(cut('    ARR(RCOG.subastrals).forEach(sa=>','    ARR(RCOG.perps).forEach'),c);
  return {labels,sprites};
}
const beforeLabels=subastralCalls(base),afterLabels=subastralCalls(candidate);
check('labels/scadrial-name-removed',()=>assert.ok(!afterLabels.labels.includes('Expanse of the Vapors')));
check('labels/other-six-unchanged',()=>assert.deepEqual(afterLabels.labels,beforeLabels.labels.filter(x=>x!=='Expanse of the Vapors')));
check('labels/all-seven-sprites-preserved',()=>assert.deepEqual(afterLabels.sprites,beforeLabels.sprites));
check('negative/baseline-neutral-fails-every-state',()=>assert.ok(negative.every(x=>!x.neutralExpectationPassesOnUnmodifiedBase)));
const out={kind:'in-memory editorial omission proposal; not implementation or browser evidence',
 head:input.head,inputs:Object.fromEntries(['pack','engine','reading'].map(k=>[k,input[k].sha])),
 scope:{proposedOperations:3,stateCases:states.length,primaryObservationsRetained:3,newCanonGates:0,fullWorksApproved:0},
 result:{passed:checks.filter(x=>x.pass).length,total:checks.length},checks,matrix,negative,
 labelCalls:{before:beforeLabels,after:afterLabels},
 limits:['Direct selector calls include unreachable/hidden states; not proof of rendered UI visibility.',
 'No browser, material application, screenshots, full suite or CI run.',
 'Global Cognitive text/style/threshold and other source holds remain unapproved.']};
process.stdout.write(JSON.stringify(out,null,2)+'\n');
if(checks.some(x=>!x.pass))process.exitCode=1;
