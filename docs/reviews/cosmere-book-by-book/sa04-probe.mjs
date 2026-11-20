// SA04 bounded inventory/candidate probe. Node 24+.
// Usage: node sa04-probe.mjs <directory-of-five-inputs>
// Fetch exact UTF-8 files listed in manifest/head metadata; this never changes the source files.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=process.argv[2]||'.';
const manifest={
  "sa04-pr24.js": "3ff0aab059fa54e00f6e2ccc7b849d4bd206d958",
  "sa04-pr37.js": "5a74e300eaf88b2d3c81fa9bc957584cd4708e33",
  "sa04-pr48.js": "ae2a877eb9a667c332e0f5b96ea22c89b5c91f35",
  "engine.js": "0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0",
  "reading.js": "4d9bc177294e5e33accf6f19825ef467f0bb90d4"
};
const src={};
for(const [n,sha] of Object.entries(manifest)){
 const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);src[n]=b.toString('utf8');
}
const J=x=>JSON.parse(JSON.stringify(x));
const parse=s=>{const c={window:{}};vm.runInNewContext(s,c);return c.window.ATLAS_PACKS.cosmere;};
const getD=p=>p.codex.find(g=>g.id==='people').list.find(x=>x.name==='Dalinar Kholin');
const siteIds=['urithiru','kholinar','celebrant','thaylen','riino','rathalas','azimir'];
const eventIds=[...new Set([24,37,48].flatMap(n=>parse(src['sa04-pr'+n+'.js']).events.filter(e=>e.book===8).map(e=>e.id)))];
const inventories=[24,37,48].map(n=>{
 const p=parse(src['sa04-pr'+n+'.js']),w=p.worlds.find(x=>x.id==='roshar'),a=p.worlds.find(x=>x.id==='ashyn');
 const rows=[
  ...eventIds.map(id=>({type:'event',id,value:p.events.find(e=>e.id===id)||null})),
  ...siteIds.map(id=>({type:'site',id:'roshar/'+id,value:w.sites.find(s=>s.id===id)||null})),
  ...['centralsea','floating'].map(id=>({type:'site',id:'ashyn/'+id,value:a.sites.find(s=>s.id===id)||null})),
  ...[w,a].map(x=>({type:'parent-prose',id:x.id,value:Object.fromEntries(['id','name','aka','books','first','status','blurb','short','facts','gate','gates'].filter(k=>k in x).map(k=>[k,x[k]]))})),
  {type:'era',id:'roshar/8',value:w.eras[8]},
  {type:'codex',id:'people/Dalinar Kholin',value:getD(p)}
 ];
 return {pr:n,head:{"24":"cf25cda66e91c573c421a0f3712623db72737a3b","37":"03394c32816fcb5c95261bf6a9ea4520381a5838","48":"0d7637e8973187afa3e8c58552a197d48c315b03"}[n],blob:manifest['sa04-pr'+n+'.js'],rows,
  book8Index:{worlds:p.worlds.filter(w=>w.books?.includes(8)).map(w=>w.id),sites:p.worlds.flatMap(w=>(w.sites||[]).filter(s=>s.books?.includes(8)).map(s=>w.id+'/'+s.id)),codex:p.codex.flatMap(g=>(g.list||[]).filter(x=>x.books?.includes(8)||x.first===8||(x.more||[]).some(m=>m[0]===8)).map(x=>g.id+'/'+x.name))}};
});
const original=parse(src['sa04-pr48.js']),candidate=parse(src['sa04-pr48.js']);
const newEvent='At the Battle of Thaylen Field, Dalinar brings the three Realms together.';
const newMore='Brings the three Realms together at Thaylen City.';
const e=candidate.events.find(x=>x.id==='e40'),d=getD(candidate),m=d.more.find(x=>x[0]===8);
const oldEvent=e.text,oldMore=m[1];e.text=newEvent;m[1]=newMore;
const reverse=J(candidate);reverse.events.find(x=>x.id==='e40').text=oldEvent;getD(reverse).more.find(x=>x[0]===8)[1]=oldMore;
assert.deepEqual(reverse,J(original));
const strip=p=>{const q=J(p);delete q.events.find(x=>x.id==='e40').text;getD(q).more.find(x=>x[0]===8)[1]=null;return q;};
assert.deepEqual(strip(candidate),strip(original));
const engine=src['engine.js'],cut=(a,b)=>{let i=engine.indexOf(a),j=engine.indexOf(b,i);assert(i>=0&&j>i,a);return engine.slice(i,j);};
function seen(p,st){
 const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);vm.runInContext(src['reading.js'],c);
 const R=c.window.AtlasReading,reg=R.normRegistry(p);assert(reg.ok);
 Object.assign(c,{RDG:R,RREG:reg,RSET:new Set(st.ids||[]),WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),EVENTS:p.events,PW:()=>st.mode==='set',CUM:true,S:{book:st.mode==='legacy'?st.book:0},__d:getD(p)});
 vm.runInContext(cut('const GCACHE=new WeakMap();','/* intro copy'),c);
 vm.runInContext(cut('const firstOf=w=>','\n'),c);
 vm.runInContext(cut('const evOk=','\n'),c);
 vm.runInContext(cut('function cxMoreGate(','function renderCodex('),c);
 // Exact per-work predicate from renderCodex; legacy threshold evaluated as in its source.
 return J(vm.runInContext(`({event:evOk(EVENTS.find(e=>e.id==='e40')),more:PW()?pvis([gateOf(__d,cxFirst(__d)),cxMoreGate(__d,__d.more[0],0)]):(!S.book||cxFirst(__d)<=S.book)&&(!S.book||__d.more[0][0]<=S.book)})`,c));
}
const W='the-way-of-kings',O='oathbringer',D='dawnshard',b8=original.spoilers.works.filter(w=>w.bucket===8).map(w=>w.id);
assert.deepEqual(J(b8),[O,D]);
const states=[['All',{mode:'all'},true],['legacy7',{mode:'legacy',book:7},false],['legacy8',{mode:'legacy',book:8},true],['legacy12',{mode:'legacy',book:12},true],['empty',{mode:'set',ids:[]},false],['OB only',{mode:'set',ids:[O]},false],['DS only',{mode:'set',ids:[D]},false],['WoK+OB',{mode:'set',ids:[W,O]},false],['bucket8 only',{mode:'set',ids:b8},false],['WoK+bucket8',{mode:'set',ids:[W,...b8]},true],['WoK+DS',{mode:'set',ids:[W,D]},false]];
const checks=states.map(([label,st,want])=>{const before=seen(original,st),after=seen(candidate,st);assert.deepEqual(before,after,label);assert.equal(before.event,want,label+' event');assert.equal(before.more,want,label+' codex');return {label,state:st,before,after};});
const counts={hashes:5,slots:inventories.reduce((n,x)=>n+x.rows.length,0),present:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value!==null).length,0),absent:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value===null).length,0),types:inventories[0].rows.length,nestedLandmarks:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.type==='site'&&r.value).reduce((m,r)=>m+(r.value.scene?.landmarks||[]).length,0),0)};
console.log(JSON.stringify({scope:'Bounded SA04 inventory, not complete research or rendered proof',manifest,counts,inventories,candidate:{fields:2,oldEvent,newEvent,oldMore,newMore,fullPackReversal:true,allOtherDataEqual:true},checks},null,2));
