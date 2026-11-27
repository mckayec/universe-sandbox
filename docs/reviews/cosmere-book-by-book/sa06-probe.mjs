// SA06 selected inventory/candidate characterization; Node 24+, no code mutation.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import crypto from 'node:crypto'; import assert from 'node:assert/strict';
const dir=process.argv[2]||'.';
const manifest={"pr24.js":"3ff0aab059fa54e00f6e2ccc7b849d4bd206d958","pr37.js":"5a74e300eaf88b2d3c81fa9bc957584cd4708e33","pr48.js":"715b658363a852af635c7988ac5b5958874788bf","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4"};
const src={};for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);src[n]=b.toString();}
const J=x=>JSON.parse(JSON.stringify(x));const parse=s=>{const c={window:{}};vm.runInNewContext(s,c);return c.window.ATLAS_PACKS.cosmere;};
const refs=[{"pr":24,"head":"cf25cda66e91c573c421a0f3712623db72737a3b","file":"pr24.js"},{"pr":37,"head":"03394c32816fcb5c95261bf6a9ea4520381a5838","file":"pr37.js"},{"pr":48,"head":"03d7a67b0a3728024a05d143abc299409911f7e3","file":"pr48.js"}];
const inventories=refs.map(r=>{const p=parse(src[r.file]),w=p.worlds.find(x=>x.id==='roshar');const rows=[
...['e43','e44','e45','e46','e109','e110','e111'].map(id=>({type:'event',id,value:p.events.find(x=>x.id===id)||null})),
...['hearthstone','urithiru','lastingintegrity'].map(id=>({type:'site',id,value:w.sites.find(x=>x.id===id)||null})),
{type:'parent',id:'roshar',value:Object.fromEntries(['id','name','books','first','status','blurb','short','facts','gate','gates'].filter(k=>k in w).map(k=>[k,w[k]]))},
{type:'era',id:'roshar/9',value:w.eras?.[9]||null},{type:'book',id:'9',value:p.books[9]},
{type:'registry',id:'rhythm-of-war',value:p.spoilers.works?.find(x=>x.id==='rhythm-of-war')||null}];
return {...r,rows};});
const p=parse(src['pr48.js']),engine=src['engine.js'];
const cut=(a,b)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert(i>=0&&j>i);return engine.slice(i,j);};
function seen(st,p){const c={window:{},Set,Map,WeakMap,URLSearchParams};vm.createContext(c);vm.runInContext(src['reading.js'],c);const R=c.window.AtlasReading,reg=R.normRegistry(p);assert(reg.ok);Object.assign(c,{RDG:R,RREG:reg,RSET:new Set(st.ids||[]),WORLDS:p.worlds,WORLD_BY:Object.fromEntries(p.worlds.map(w=>[w.id,w])),EVENTS:p.events,PW:()=>st.mode==='set',CUM:true,S:{book:st.mode==='legacy'?st.book:0,realm:'physical'},LY:null});
for(const [a,b] of [['const ARR=','\n'],['const filterOk=','\n'],['const GCACHE=new WeakMap();','/* intro copy'],['const firstOf=w=>','\n'],['const evOk=','\n'],['const realmOk=','\n'],['const siteEraOk=','\n'],['const siteSeen=','\n'],['function rdWorldHidden(','\n']])vm.runInContext(cut(a,b),c);
return J(vm.runInContext("(()=>{const w=WORLD_BY.roshar;return {events:EVENTS.map(e=>[e.id,!!evOk(e)]),site:!!siteSeen(w.sites.find(s=>s.id==='urithiru')),worldHidden:!!rdWorldHidden(w)}})()",c));}
const W='the-way-of-kings',R='rhythm-of-war',O='oathbringer',D='dawnshard';
const states=[['All',{mode:'all'}],['legacy8',{mode:'legacy',book:8}],['legacy9',{mode:'legacy',book:9}],['legacy12',{mode:'legacy',book:12}],['empty',{mode:'set',ids:[]}],['RoW only',{mode:'set',ids:[R]}],['WoK only',{mode:'set',ids:[W]}],['WoK+RoW',{mode:'set',ids:[W,R]}],['OB+RoW',{mode:'set',ids:[O,R]}],['WoK+OB+DS',{mode:'set',ids:[W,O,D]}],['WoK+OB+DS+RoW',{mode:'set',ids:[W,O,D,R]}],['WoK+WoR+RoW',{mode:'set',ids:[W,'words-of-radiance',R]}],['all works',{mode:'set',ids:p.spoilers.works.map(w=>w.id)}]];
const old=p.events.find(e=>e.id==='e44').text, replacement='Kaladin accepts that there are people he cannot protect and swears the Fourth Ideal.';
const candidate=J(p);candidate.events.find(e=>e.id==='e44').text=replacement;
const reversed=J(candidate);reversed.events.find(e=>e.id==='e44').text=old;assert.deepEqual(reversed,J(p));
const checks=states.map(([label,state])=>{const before=seen(state,p),after=seen(state,candidate);assert.deepEqual(after,before);const compact=x=>({e44:x.events.find(e=>e[0]==='e44')[1],site:x.site,worldHidden:x.worldHidden});return {label,state,eventsCompared:before.events.length,before:compact(before),after:compact(after)};});
const counts={hashes:5,types:14,slots:inventories.reduce((n,x)=>n+x.rows.length,0),present:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value!==null).length,0),absent:inventories.reduce((n,x)=>n+x.rows.filter(r=>r.value===null).length,0),nestedLandmarks:inventories.flatMap(x=>x.rows.filter(r=>r.type==='site'&&r.value).flatMap(r=>r.value.scene?.landmarks||[])).length};
console.log(JSON.stringify({manifest,counts,inventories,candidate:{field:'e44.text',old,replacement,otherwiseEqual:true},checks},null,2));
