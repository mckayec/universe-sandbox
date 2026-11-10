// Reviewer-only checks, no browser/GPU. Run from repository root:
// node docs/reviews/cosmere-book-by-book/reviewer-registry-773c35b.mjs [optional parent pack file]
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const paths=['public/atlas/reading.js','public/atlas/reading-ui.js','public/atlas/packs/cosmere.js','public/atlas/engine.js'];
const sources=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')]));
const manifest=Object.fromEntries(paths.map(p=>[p,crypto.createHash('sha1').update('blob '+Buffer.byteLength(sources[p])+'\0'+sources[p]).digest('hex')]));
const c={window:{},URLSearchParams,Set,Map,WeakMap};vm.createContext(c);
paths.slice(0,3).forEach(p=>vm.runInContext(sources[p],c));
const R=c.window.AtlasReading,p=c.window.ATLAS_PACKS.cosmere,reg=R.normRegistry(p);
assert.equal(reg.ok,true);
const engine=sources[paths[3]];
const cut=(a,b)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert.ok(i>=0&&j>i);return engine.slice(i,j);};
Object.assign(c,{RDG:R,RREG:reg,WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w]))});
vm.runInContext(cut('const GCACHE=new WeakMap();','const pvis=chain=>'),c);
vm.runInContext(cut('const firstOf=w=>','\n'),c);
let checks=[];
const check=(label,actual,expected)=>{assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected,label);checks.push(label);};
for(const [bucket,ids] of reg.buckets){
 const g=R.recordGate({book:bucket},reg);
 check('bucket '+bucket+' complete',R.visible([g],new Set(ids)),true);
 for(const id of ids)check('bucket '+bucket+' missing '+id,R.visible([g],new Set(ids.filter(x=>x!==id))),false);
}
const trilogy=reg.buckets.get(2),table=[];
for(let mask=0;mask<8;mask++){
 const ids=trilogy.filter((_,i)=>mask&(1<<i));
 const row={mask,read:ids};
 for(const id of ['e6','e12']){
  c.event=p.events.find(e=>e.id===id);
  const chain=vm.runInContext('evChain(event)',c);
  row[id]=R.visible(chain,new Set(ids));
  check(id+' actual engine ancestor chain mask '+mask,row[id],mask===7);
 }
 table.push(row);
}
for(const y of [null,0,-1,2006.5,'2006',NaN]){
 check('invalid year '+String(y),R.normRegistry({spoilers:{works:[{id:'x',y}]}}).ok,false);
}
for(const w of [{id:'x',yNote:'catalogue listing'},{id:'x',y:2006,yNote:3},{id:'x',y:2006,yNote:''}])
 check('invalid qualifier '+JSON.stringify(w),R.normRegistry({spoilers:{works:[w]}}).ok,false);
const noYears=JSON.parse(JSON.stringify(p));noYears.spoilers.works.forEach(w=>{delete w.y;delete w.yNote;});
const nr=R.normRegistry(noYears);
for(const k of reg.buckets.keys())check('years do not change bucket '+k,R.recordGate({book:k},nr),JSON.parse(JSON.stringify(R.recordGate({book:k},reg))));
let parentDelta=null;
if(process.argv[2]){
 const pc={window:{}};vm.runInNewContext(fs.readFileSync(process.argv[2],'utf8'),pc);
 const old=pc.window.ATLAS_PACKS.cosmere;
 const copy=JSON.parse(JSON.stringify(p));copy.spoilers=old.spoilers;
 copy.events=copy.events.map(e=>['e6','e12'].includes(e.id)?old.events.find(x=>x.id===e.id):e);
 check('all pack data outside spoilers and e6/e12 unchanged',copy,JSON.parse(JSON.stringify(old)));
 check('parent lacks registry negative control',R.normRegistry(old),null);
 parentDelta={allowed:['spoilers','e6','e12'],otherwiseIdentical:true,parentRegistryAbsent:true};
}
console.log(JSON.stringify({head:'773c35bcaeb727927c9ab6a462a52ab1e9d0e538',manifest,passed:checks.length,total:checks.length,checks,ancestorTruthTable:table,parentDelta,scope:'actual-source/helper checks only; not rendered behavior or full canon approval'},null,2));
