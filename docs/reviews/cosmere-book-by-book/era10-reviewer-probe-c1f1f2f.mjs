// Prospective MB10 status proposal; no repository application file is changed.
// Usage: node era10-reviewer-probe-c1f1f2f.mjs INPUTS.json > OUTPUT.json
// INPUTS: {head,files:{path:{content,sha}},other:{"24":{head,content,sha},"37":{...}}}
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {stripTypeScriptTypes} from 'node:module';
const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const head='c1f1f2f6c3dbc8f8812797468effc4ac61788e12';
assert.equal(input.head,head);
const pins={
 'public/atlas/packs/cosmere.js':'9a60b3f2aa16fd46a48fbbb1594fa7532abe8fae',
 'public/atlas/engine.js':'0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0',
 'public/atlas/reading.js':'4d9bc177294e5e33accf6f19825ef467f0bb90d4',
 'tests/atlas-scadrial-reduced.test.ts':'cd3134040baeda43f877930392db5ccbf349a5d7'
};
const hash=s=>{const b=Buffer.from(s);return createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');};
const manifest=[];
for(const [path,sha] of Object.entries(pins)){assert.equal(input.files[path].sha,sha);assert.equal(hash(input.files[path].content),sha);manifest.push({path,sha});}
for(const [pr,rev,sha] of [['24','cf25cda66e91c573c421a0f3712623db72737a3b','3ff0aab059fa54e00f6e2ccc7b849d4bd206d958'],['37','03394c32816fcb5c95261bf6a9ea4520381a5838','5a74e300eaf88b2d3c81fa9bc957584cd4708e33']]){
 const x=input.other[pr];assert.equal(x.head,rev);assert.equal(x.sha,sha);assert.equal(hash(x.content),sha);manifest.push({pr,head:rev,sha});
}
let harness=input.files['tests/atlas-scadrial-reduced.test.ts'].content;
harness=harness.slice(0,harness.indexOf("\ntest('payload:"));
harness=harness.replace(/^import .*;\n/gm,'').replace(/^const read = .*;$/m,'const read = p => INPUT.files[p].content;');
harness=stripTypeScriptTypes(harness);
const ctx={INPUT:input,vm,assert,Set,Map,WeakMap,URLSearchParams};vm.createContext(ctx);
vm.runInContext(harness+'\nglobalThis.API={setup,surfaces};',ctx);
const {setup,surfaces}=ctx.API;
const J=x=>JSON.parse(JSON.stringify(x));
const candidate='The Lost Metal · Elendel and the Outer Cities in tension';
const gate={in:['the-lost-metal'],req:'the-lost-metal'};
const ot=['mistborn-the-final-empire','mistborn-the-well-of-ascension','mistborn-the-hero-of-ages'];
const b6=['the-alloy-of-law','shadows-of-self','the-bands-of-mourning'];
const old='Harmony’s world · under threat from outside';
const cases=[],controls=[];
function run(st,realm,expect){
 const {c,w}=setup(st);c.S.realm=realm;
 const before=J(surfaces(c));before.distance=vm.runInContext('distText(world)',c);
 const original=J(w.eras[10]);
 w.eras[10]={status:candidate,gates:{status:J(gate)}};
 const after=J(surfaces(c));after.distance=vm.runInContext('distText(world)',c);
 assert.equal(after.status,expect);
 const rest=x=>{const y={...x};delete y.status;return y;};
 assert.deepEqual(rest(after),rest(before));
 assert.equal(w.gate,undefined);assert.equal(w.eras[10].gate,undefined);
 if(expect.includes(candidate)){assert.ok(before.status.includes(old));controls.push({st,realm,unmodified:before.status,proposed:after.status});}
 w.eras[10]=original;assert.deepEqual(J(surfaces(c)),J(Object.fromEntries(Object.entries(before).filter(([k])=>k!=='distance'))));
 cases.push({st,realm,status:after.status,otherSurfacesUnchanged:true});
}
for(let a=0;a<8;a++)for(let b=0;b<8;b++)for(const tlm of [false,true])for(const realm of ['physical','cognitive']){
 const ids=[...ot.filter((_,i)=>a&(1<<i)),...b6.filter((_,i)=>b&(1<<i)),...(tlm?['the-lost-metal']:[])];
 const expected=a!==7?'':tlm?candidate:b===7?'The Alloy of Law · industrial Elendel':'The Final Empire';
 run({mode:'set',ids},realm,expected);
}
for(const realm of ['physical','cognitive'])for(const book of [2,6,10]){
 run({mode:'legacy',book},realm,book===2?'The Final Empire':book===6?'The Alloy of Law · industrial Elendel':candidate);
}
for(const realm of ['physical','cognitive'])run({mode:'all'},realm,'The Final Empire → '+candidate);
const gateControls=[];
for(const realm of ['physical','cognitive'])for(const g of [{},{req:'mistborn-secret-history'}]){
 const {c,w}=setup({mode:'set',ids:[...ot,...b6,'the-lost-metal']});c.S.realm=realm;
 w.eras[10]={status:candidate,gates:{status:g}};
 assert.equal(surfaces(c).status,'The Alloy of Law · industrial Elendel');
 gateControls.push({realm,gate:g,status:surfaces(c).status});
}
const reconciliation=[];
for(const pr of ['24','37']){const c={window:{}};vm.createContext(c);vm.runInContext(input.other[pr].content,c);const w=c.window.ATLAS_PACKS.cosmere.worlds.find(x=>x.id==='scadrial');reconciliation.push({pr,head:input.other[pr].head,era10:J(w.eras[10])});}
console.log(JSON.stringify({head,node:process.version,scope:'in-memory prospective selector validation; not implemented or rendered',candidate,gate,manifest,counts:{inputHashes:manifest.length,perWorkCases:256,legacyAllCases:8,passedCases:cases.length,counterfactualControls:controls.length,gateControls:gateControls.length},reconciliation,cases,controls,gateControls},null,2));
