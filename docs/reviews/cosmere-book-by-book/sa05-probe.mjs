// SA05 bounded inventory and unchanged-gate characterization. Node 24+.
// Input directory: pr24.js/pr37.js/head.js/engine.js/reading.js, exact blobs below.
// This script does not modify pack data or confer canon approval.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir=process.argv[2]||'.';
const manifest={
  "pr24.js": "3ff0aab059fa54e00f6e2ccc7b849d4bd206d958",
  "pr37.js": "5a74e300eaf88b2d3c81fa9bc957584cd4708e33",
  "head.js": "583abc7a47935530b160c7c7be43f8257cff0cd2",
  "engine.js": "0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0",
  "reading.js": "4d9bc177294e5e33accf6f19825ef467f0bb90d4"
};
const src={};
for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);src[n]=b.toString('utf8');}
const J=x=>JSON.parse(JSON.stringify(x));
const parse=s=>{const c={window:{}};vm.runInNewContext(s,c);return c.window.ATLAS_PACKS.cosmere;};
const refs=[
{pr:24,head:'cf25cda66e91c573c421a0f3712623db72737a3b',file:'pr24.js'},
{pr:37,head:'03394c32816fcb5c95261bf6a9ea4520381a5838',file:'pr37.js'},
{pr:48,head:'766f7a75d6825b4de88bb3667fde49ab971cbca6',file:'head.js'}];
const inventories=refs.map(r=>{
const p=parse(src[r.file]),w=p.worlds.find(x=>x.id==='roshar'),y=p.worlds.find(x=>x.id==='yolen');
const rows=[
...['e42','e87'].map(id=>({type:'event',id,value:p.events.find(e=>e.id===id)||null})),
...['akinah','aimia','urithiru','reshiisles'].map(id=>({type:'site',id:'roshar/'+id,value:w.sites.find(s=>s.id===id)||null})),
{type:'codex',id:'people/Rysn',value:p.codex.find(g=>g.id==='people').list.find(x=>x.name==='Rysn')||null},
{type:'site',id:'yolen/shattering',value:y.sites.find(s=>s.id==='shattering')||null},
{type:'parent-prose',id:'roshar',value:Object.fromEntries(['id','name','aka','books','first','status','blurb','short','facts','gate','gates'].filter(k=>k in w).map(k=>[k,w[k]]))},
{type:'era',id:'roshar/8',value:w.eras[8]},
{type:'book',id:'8',value:p.books[8]},
{type:'registry',id:'dawnshard',value:p.spoilers.works?.find(x=>x.id==='dawnshard')||null}];
const refsToAkinah=p.events.filter(e=>e.site==='akinah').map(e=>({id:e.id,lm:e.lm||null,book:e.book}));
return {...r,blob:manifest[r.file],rows,refsToAkinah};
});
const p=parse(src['head.js']),engine=src['engine.js'];
const cut=(a,b)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert(i>=0&&j>i,a);return engine.slice(i,j);};
function seen(st,p=parse(src['head.js'])){
const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);vm.runInContext(src['reading.js'],c);
const R=c.window.AtlasReading,reg=R.normRegistry(p);assert(reg.ok);
Object.assign(c,{RDG:R,RREG:reg,RSET:new Set(st.ids||[]),WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),EVENTS:p.events,PW:()=>st.mode==='set',CUM:true,S:{book:st.mode==='legacy'?st.book:0,realm:'physical'},LY:null});
for(const [a,b] of [['const ARR=','\n'],['const filterOk=','\n'],['const GCACHE=new WeakMap();','/* intro copy'],['const firstOf=w=>','\n'],['const evOk=','\n'],['const realmOk=','\n'],['const siteEraOk=','\n'],['const siteSeen=','\n'],['function rdWorldHidden(','\n']])vm.runInContext(cut(a,b),c);
return J(vm.runInContext(`(()=>{const w=WORLD_BY.roshar,s=w.sites.find(s=>s.id==='akinah');return {event:!!evOk(EVENTS.find(e=>e.id==='e42')),site:!!siteSeen(s),worldHidden:!!rdWorldHidden(w)}})()`,c));
}
const W='the-way-of-kings',O='oathbringer',D='dawnshard';
const states=[['All',{mode:'all'}],['legacy7',{mode:'legacy',book:7}],['legacy8',{mode:'legacy',book:8}],['legacy12',{mode:'legacy',book:12}],['empty',{mode:'set',ids:[]}],['DS only',{mode:'set',ids:[D]}],['OB only',{mode:'set',ids:[O]}],['WoK+DS',{mode:'set',ids:[W,D]}],['WoK+OB',{mode:'set',ids:[W,O]}],['bucket8',{mode:'set',ids:[O,D]}],['WoK+bucket8',{mode:'set',ids:[W,O,D]}]];
const candidate=J(p);candidate.books[8].y='2017–2020';
const reversed=J(candidate);reversed.books[8].y=p.books[8].y;assert.deepEqual(reversed,J(p));
assert.equal(p.books[8].y,2017);assert.equal(candidate.books[8].y,parse(src['pr24.js']).books[8].y);
const checks=states.map(([label,state])=>{const before=seen(state),after=seen(state,candidate);assert.deepEqual(after,before,label);const want=['All','legacy8','legacy12','WoK+bucket8'].includes(label);assert.equal(before.event,want,label+' event');assert.equal(before.site,want,label+' site');return {label,state,before,after};});
const counts={hashes:5,types:12,slots:inventories.reduce((n,x)=>n+x.rows.length,0),present:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value!==null).length,0),absent:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value===null).length,0),nestedLandmarks:inventories.flatMap(x=>x.rows.filter(r=>r.type==='site'&&r.value).flatMap(r=>r.value.scene?.landmarks||[])).length};
assert.equal(counts.slots,36);
console.log(JSON.stringify({scope:'SA05 selected inventory and existing eligibility; no changes or full canon certification',manifest,counts,inventories,candidate:{field:'books[8].y',before:p.books[8].y,after:candidate.books[8].y,allOtherDataEqual:true},checks},null,2));
