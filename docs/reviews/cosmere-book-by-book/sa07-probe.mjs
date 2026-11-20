// SA07 selected inventory/candidate characterization; Node 24+, no code mutation.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import crypto from 'node:crypto'; import assert from 'node:assert/strict';
const dir=process.argv[2]||'.';
const manifest={"pr24.js":"3ff0aab059fa54e00f6e2ccc7b849d4bd206d958","pr37.js":"5a74e300eaf88b2d3c81fa9bc957584cd4708e33","pr48.js":"b10a2f5d0bda2710c38afa5f70f36072207d0bbc","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4"};
const src={};for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);src[n]=b.toString();}
const J=x=>JSON.parse(JSON.stringify(x));const parse=s=>{const c={window:{}};vm.runInNewContext(s,c);return c.window.ATLAS_PACKS.cosmere;};
const refs=[{"pr":24,"head":"cf25cda66e91c573c421a0f3712623db72737a3b","file":"pr24.js"},{"pr":37,"head":"03394c32816fcb5c95261bf6a9ea4520381a5838","file":"pr37.js"},{"pr":48,"head":"5c59d326e1e2fb188b75203cdfd594c08c77ef2a","file":"pr48.js"}];
const eventIds=['e55','e56','e57','e58','e59','e60','e118','e119','e120','e121','e122','e123','e124','e125'];
const inventories=refs.map(r=>{const p=parse(src[r.file]),w=p.worlds.find(x=>x.id==='roshar');const rows=[
...eventIds.map(id=>({type:'event',id,value:p.events.find(x=>x.id===id)||null})),
...['narak','shatteredplains','pool','kharbranth'].map(id=>({type:'site',id,value:w.sites.find(x=>x.id===id)||null})),
{type:'era',id:'roshar/12',value:w.eras?.[12]||null},{type:'facts',id:'roshar',value:w.facts},
{type:'codex',id:'selected',value:p.codex.flatMap(g=>g.list.filter(e=>['Hoid (Wit)','Dalinar Kholin','Kelsier','Kaladin Stormblessed','Shallan Davar','Honor','Retribution','Valor'].includes(e.name)).map(e=>({group:g.id,...e})))},
{type:'registry',id:'wind-and-truth',value:p.spoilers.works?.find(x=>x.id==='wind-and-truth')||null}];return {...r,rows};});
const p=parse(src['pr48.js']),engine=src['engine.js'];
const cut=(a,b)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert(i>=0&&j>i);return engine.slice(i,j);};
function seen(st,p){const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);vm.runInContext(src['reading.js'],c);const R=c.window.AtlasReading,reg=R.normRegistry(p);assert(reg.ok);Object.assign(c,{RDG:R,RREG:reg,RSET:new Set(st.ids||[]),WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),EVENTS:p.events,PW:()=>st.mode==='set',CUM:true,S:{book:st.mode==='legacy'?st.book:0,realm:'physical'},LY:null});
for(const [a,b] of [['const ARR=','\n'],['const filterOk=','\n'],['const GCACHE=new WeakMap();','/* intro copy'],['const firstOf=w=>','\n'],['const evOk=','\n'],['const realmOk=','\n'],['const siteEraOk=','\n'],['const siteSeen=','\n'],['function rdWorldHidden(','\n']])vm.runInContext(cut(a,b),c);
return J(vm.runInContext("(()=>{const w=WORLD_BY.roshar;return {events:EVENTS.map(e=>[e.id,!!evOk(e)]),site:!!siteSeen(w.sites.find(s=>s.id==='urithiru')),worldHidden:!!rdWorldHidden(w),scadrialHidden:!!rdWorldHidden(WORLD_BY.scadrial)}})()",c));}
const W='the-way-of-kings',WR='words-of-radiance',ROW='rhythm-of-war',WAT='wind-and-truth';
const b12=p.spoilers.works.filter(w=>w.bucket===12).map(w=>w.id);
const states=[['All',{mode:'all'}],['legacy9',{mode:'legacy',book:9}],['legacy11',{mode:'legacy',book:11}],['legacy12',{mode:'legacy',book:12}],['empty',{mode:'set',ids:[]}],['WaT only',{mode:'set',ids:[WAT]}],['WoK+WaT',{mode:'set',ids:[W,WAT]}],['WoK+WoR+WaT',{mode:'set',ids:[W,WR,WAT]}],['WoK+WoR+RoW+WaT',{mode:'set',ids:[W,WR,ROW,WAT]}],['bucket12 only',{mode:'set',ids:b12}],['all minus WaT',{mode:'set',ids:p.spoilers.works.map(w=>w.id).filter(id=>id!==WAT)}],['all works',{mode:'set',ids:p.spoilers.works.map(w=>w.id)}]];
const replacements={
e55:'The agreed contest of champions approaches; its ten-day countdown is already underway.',
e60:'Hoid recovers on Scadrial in Ulaam’s care. Later, he is hired by the Ladrian household and plans to seek Valor.'
};
const candidate=J(p),changes=Object.entries(replacements).map(([id,replacement])=>{const e=candidate.events.find(e=>e.id===id),old=e.text;e.text=replacement;return {id,field:'text',old,replacement};});
const reversed=J(candidate);for(const x of changes)reversed.events.find(e=>e.id===x.id).text=x.old;assert.deepEqual(reversed,J(p));
const checks=states.map(([label,state])=>{const before=seen(state,p),after=seen(state,candidate);assert.deepEqual(after,before);const compact=x=>({events:Object.fromEntries(x.events.filter(e=>eventIds.includes(e[0]))),site:x.site,worldHidden:x.worldHidden,scadrialHidden:x.scadrialHidden});return {label,state,eventsCompared:before.events.length,before:compact(before),after:compact(after)};});
const counts={hashes:5,selectedTypes:22,slots:inventories.reduce((n,x)=>n+x.rows.length,0),present:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value!==null).length,0),absent:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value===null).length,0),eventSlots:42,presentEvents:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.type==='event'&&r.value!==null).length,0)};
console.log(JSON.stringify({manifest,counts,inventories,candidate:{changes,otherwiseEqual:true},checks},null,2));
