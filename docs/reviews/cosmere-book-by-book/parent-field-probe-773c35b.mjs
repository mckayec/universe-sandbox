// Reviewer-only proposal check. No repository pack is modified. Run from a PR48 773c35b checkout:
// node docs/reviews/cosmere-book-by-book/parent-field-probe-773c35b.mjs [PR24-pack.js PR37-pack.js]
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const paths=['public/atlas/reading.js','public/atlas/packs/cosmere.js','public/atlas/engine.js'];
const src=Object.fromEntries(paths.map(p=>[p,fs.readFileSync(p,'utf8')]));
const hash=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0'+s).digest('hex');
const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);
paths.slice(0,2).forEach(p=>vm.runInContext(src[p],c));
const R=c.window.AtlasReading,p=c.window.ATLAS_PACKS.cosmere,reg=R.normRegistry(p);
assert.equal(reg.ok,true);
const w=p.worlds.find(x=>x.id==='scadrial'),s=w.sites.find(x=>x.id==='luthadel');
const plain=x=>JSON.parse(JSON.stringify(x));
const pick=(o,ks)=>Object.fromEntries(ks.map(k=>[k,o[k]]));
const worldFields=['name','status','star','blurb','short','eras','facts','gfx'];
const checks=[];
function check(label,a,b){assert.deepEqual(plain(a),plain(b),label);checks.push(label);}
const baseline={world:plain(pick(w,worldFields)),site:plain(pick(s,['name','desc']))};
const compared=[];
for(const f of process.argv.slice(2)){
 const t={window:{}};const text=fs.readFileSync(f,'utf8');vm.runInNewContext(text,t);
 const q=t.window.ATLAS_PACKS.cosmere.worlds.find(x=>x.id==='scadrial'),r=q.sites.find(x=>x.id==='luthadel');
 // Eras/gfx differ across branches; compare only the exact text fields touched or discussed by this packet.
 for(const k of ['name','status','star','blurb','short','facts'])check(f+' world '+k,q[k],baseline.world[k]);
 for(const k of ['name','desc'])check(f+' site '+k,r[k],baseline.site[k]);
 compared.push({file:f,blob:hash(text),comparedFields:8});
}
check('world record gate remains absent',Object.hasOwn(w,'gate'),false);
check('site record gate remains absent',Object.hasOwn(s,'gate'),false);
const mb01='mistborn-the-final-empire';
const gate={in:[mb01],req:mb01};
w.gates={...(w.gates||{}),blurb:gate,short:gate};
s.gates={...(s.gates||{}),name:gate,desc:gate};
const engine=src[paths[2]];
function cut(a,b){const i=engine.indexOf(a),j=engine.indexOf(b,i);assert.ok(i>=0&&j>i);return engine.slice(i,j);}
Object.assign(c,{RDG:R,RREG:reg,WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(x=>[x.id,x])),PW:()=>true,RSET:new Set(),world:w,site:s});
vm.runInContext(cut('const GCACHE=new WeakMap();','/* a world era (child record)'),c);
vm.runInContext(cut('const firstOf=w=>','\n'),c);
const trilogy=reg.buckets.get(2),rows=[];
for(let mask=0;mask<8;mask++){
 c.RSET=new Set(trilogy.filter((_,i)=>mask&(1<<i)));
 const row={mask,read:[...c.RSET],fields:{},events:{}};
 for(const [holder,field] of [['world','blurb'],['world','short'],['site','name'],['site','desc']]){
  const expr=holder==='world'?'worldChain(world)':'siteChain(site)';
  row.fields[holder+'.'+field]=vm.runInContext('fOk('+holder+',"'+field+'",'+expr+')',c);
  check('candidate '+holder+'.'+field+' mask '+mask,row.fields[holder+'.'+field],mask===7);
 }
 for(const id of ['e6','e12']){
  c.event=p.events.find(e=>e.id===id);
  row.events[id]=vm.runInContext('pvis(evChain(event))',c);
  check('unchanged event ancestor hold '+id+' mask '+mask,row.events[id],mask===7);
 }
 rows.push(row);
}
check('world fallback is still unreviewed',vm.runInContext('worldChain(world)[0].unreviewed',c),true);
check('site fallback is still unreviewed',vm.runInContext('siteChain(site)[1].unreviewed',c),true);
console.log(JSON.stringify({head:'773c35bcaeb727927c9ab6a462a52ab1e9d0e538',manifest:Object.fromEntries(paths.map(p=>[p,hash(src[p])])),compared,passed:checks.length,total:checks.length,checks,proposalTruthTable:rows,scope:'Proposed field gates applied only in memory to exact source; not implemented pack, rendered behavior, earliest whole-record gate or full-work canon verification.'},null,2));
