// Run from PR48 55e28bd: node reviewer-realms-55e28bd.mjs
// Extends the original 12-case runner with separate card-name and blurb assertions (18 total).
// Actual extracted selectors; fixture field gates test the accepted field-gate contract, not canon mappings.
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const files=['public/atlas/reading.js','public/atlas/packs/cosmere.js','public/atlas/engine.js'];
const src=Object.fromEntries(files.map(p=>[p,fs.readFileSync(p,'utf8')]));
const hash=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
const engine=src[files[2]];
function cut(a,b){const i=engine.indexOf(a),j=engine.indexOf(b,i);if(i<0||j<=i)throw Error('selector not found '+a);return engine.slice(i,j);}
function setup(fieldGate,mode='set'){
 const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);
 files.slice(0,2).forEach(p=>vm.runInContext(src[p],c));
 const p=c.window.ATLAS_PACKS.cosmere,R=c.window.AtlasReading,reg=R.normRegistry(p);
 if(!reg.ok)throw Error('registry invalid');
 const w=p.worlds.find(x=>x.id==='scadrial');
 if(fieldGate!==undefined)w.gates={...w.gates,realms:fieldGate};
 const read=[...reg.buckets.get(2),...reg.buckets.get(4)];
 Object.assign(c,{RDG:R,RREG:reg,RSET:new Set(read),WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),PW:()=>mode==='set',CUM:true,S:{realm:'cognitive',book:mode==='legacy'?4:0},RL:p.realms,RCOG:p.realms.cognitive,RSPI:p.realms.spiritual,SHARDS:p.realms.spiritual.shards,world:w,esc:s=>String(s)});
 vm.runInContext(cut('const GCACHE=new WeakMap();','/* a world era (child record)'),c);
 vm.runInContext(cut('const firstOf=w=>','\n'),c);
 vm.runInContext(cut('const STYLE_IX=','function applyRealmToPlanet'),c);
 vm.runInContext(cut('const realmFirst=r=>','function renderRealmBar'),c);
 vm.runInContext(cut('function realmCard(w)','if($("#realms"))'),c);
 return {c,w,read,reg};
}
const actual=setup();
const actualObservation={read:actual.read,worldVisible:vm.runInContext('pvis(worldChain(world))',actual.c),realmOpen:vm.runInContext('realmOpen("cognitive")',actual.c),bucket7Reached:vm.runInContext('reach(7)',actual.c),subastralFirst:actual.c.RCOG.subastrals.find(s=>s.world==='scadrial').first,card:vm.runInContext('realmCard(world)',actual.c),look:vm.runInContext('realmLook(world)',actual.c)};
const cases=[];
for(const [label,gate,mode,expectOwn]of[
 ['unread valid field gate',{req:'mistborn-secret-history'},'set',false],
 ['present invalid field gate',{},'set',false],
 ['satisfied field gate',{req:'the-way-of-kings'},'set',true],
 ['absent field gate inherits visible record',undefined,'set',true],
 ['legacy ignores per-work field gate',{req:'mistborn-secret-history'},'legacy',true],
 ['All ignores per-work field gate',{req:'mistborn-secret-history'},'all',true],
]){
 const {c,w}=setup(gate,mode);
 const fieldAllowed=vm.runInContext('fOk(world,"realms",worldChain(world))',c);
 const card=vm.runInContext('realmCard(world)',c),look=vm.runInContext('realmLook(world)',c);
 const ownName=card.includes(w.realms.cognitive.name),ownBlurb=card.includes(w.realms.cognitive.blurb);const ownCard=ownName&&ownBlurb;
 const ownLook=look.st===1&&look.c1===w.realms.cognitive.c1&&look.c2===w.realms.cognitive.c2&&look.c3===w.realms.cognitive.c3;
 cases.push({label,mode,gate,fieldAllowed,expectedOwn:expectOwn,ownCard,ownLook,checks:[{surface:'realmCard.name',pass:ownName===expectOwn},{surface:'realmCard.blurb',pass:ownBlurb===expectOwn},{surface:'realmLook',pass:ownLook===expectOwn}]});
}
const checks=cases.flatMap(c=>c.checks);
const out={head:'55e28bd7af1a7b1074f59765982ccee1f922804b',manifest:Object.fromEntries(files.map(f=>[f,hash(src[f])])),actualObservation,cases,passed:checks.filter(c=>c.pass).length,total:checks.length,scope:'Actual source selectors, not rendered browser. Injected field gates are test fixtures only; no proposed factual/earliest-work mapping. Actual unmodified observation separately records differing world/realm/subastral thresholds.'};
console.log(JSON.stringify(out,null,2));
process.exitCode=checks.every(c=>c.pass)?0:1;
