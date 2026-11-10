// Run from PR48 head 7155f0a: node reviewer-parent-return-7155f0a.mjs <parent-773c35b-pack.js>
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
const oldctx={window:{}};
const prior=fs.readFileSync(process.argv[2],'utf8');vm.runInNewContext(prior,oldctx);
const old=oldctx.window.ATLAS_PACKS.cosmere;
const ow=old.worlds.find(x=>x.id==='scadrial'),os=ow.sites.find(x=>x.id==='luthadel');
const mb01='mistborn-the-final-empire',gate={in:[mb01],req:mb01};
const copy={blurb:'In the Final Empire, ash falls beneath a red sun. Skaa labor in the fields under the Lord Ruler’s rule, brown-leaved crops struggle to grow, and mists gather as evening falls.',short:'The Final Empire beneath a red sun.',desc:'Luthadel is the walled capital of the Final Empire. The River Channerel runs through the city.'};
check('authorized blurb',w.blurb,copy.blurb);
check('authorized short',w.short,copy.short);
check('authorized Luthadel description',s.desc,copy.desc);
for(const [obj,keys] of [[w,['blurb','short']],[s,['name','desc']]])for(const key of keys)check(obj.id+' field gate '+key,obj.gates[key],gate);
check('world record gate remains absent',Object.hasOwn(w,'gate'),false);
check('site record gate remains absent',Object.hasOwn(s,'gate'),false);
ow.blurb=copy.blurb;ow.short=copy.short;os.desc=copy.desc;
ow.gates={...(ow.gates||{}),blurb:gate,short:gate};os.gates={...(os.gates||{}),name:gate,desc:gate};
check('entire pack differs only by the 3 authorized texts and 4 field gates',p,old);
const compared=[{file:process.argv[2],blob:hash(prior),scope:'whole pack with only authorized substitutions applied to parent for equality'}];
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
console.log(JSON.stringify({head:'7155f0acbcfa351c73fb990366b4e0bd163ea3cf',manifest:Object.fromEntries(paths.map(p=>[p,hash(src[p])])),compared,passed:checks.length,total:checks.length,checks,actualTruthTable:rows,scope:'Actual PR48 pack and extracted actual engine selectors. No gates injected into audited pack. Independent source check, not browser rendering or whole-record/full-work canon certification.'},null,2));
