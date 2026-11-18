// Pure source/pack functions only: no DOM, browser or server execution.
const vm=require('node:vm'),cp=require('node:child_process'),fs=require('node:fs'),assert=require('node:assert/strict');
const head='8ec67f4732b1e253a31f3a5e802a7bd4d183e44a',base='e09d6e83bb8774e798cdf583150f380eff2b0282';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'}),plain=x=>JSON.parse(JSON.stringify(x));
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const old=load(base).ATLAS_PACKS['lds-standard-works'],w=load(head),p=w.ATLAS_PACKS['lds-standard-works'],cards=p.codex.flatMap(t=>t.list),bc=old.codex.flatMap(t=>t.list),by=new Map(cards.filter(c=>c.key).map(c=>[c.key,c]));
const changed=cards.filter((c,i)=>JSON.stringify(c)!==JSON.stringify(bc[i])),linked=cards.filter(c=>c.see),copyChanged=changed.filter(c=>JSON.stringify({...plain(c),see:undefined})!==JSON.stringify({...plain(bc[cards.indexOf(c)]),see:undefined}));
assert.equal(cards.length,bc.length);assert.equal(linked.length,44);assert.equal(copyChanged.length,5);
const expected=['BE02','BXP02','bom-model-mesoamerican-sorenson','bom-model-heartland','bom-model-hemispheric-historical'];assert.deepEqual(plain(copyChanged.map(c=>c.key)).sort(),expected.sort());
for(const c of changed){const z=plain(c),b=plain(bc[cards.indexOf(c)]);delete z.see;if(expected.includes(c.key)){z.desc=b.desc;z.src=b.src;}assert.deepEqual(z,b,c.key);}
const stripped=plain(p);let index=0;for(const t of stripped.codex)t.list=t.list.map(c=>plain(bc[index++]));assert.deepEqual(stripped,plain(old));
let edges=0;for(const c of linked){assert.equal(new Set(c.see).size,c.see.length);for(const key of c.see){const target=by.get(key);assert(target,key);assert.notEqual(c.key,key);assert(target.see.includes(c.key));edges++;}}
const notice='For Book of Mormon events in the ancient Americas, the Church takes no position on specific geographic locations. These models are individual interpretations, not Church-endorsed maps.';
for(const c of copyChanged.filter(c=>c.key.startsWith('bom-model-'))){assert(c.desc.endsWith(notice));const prior=bc.find(x=>x.key===c.key);assert.deepEqual(plain(c.src.slice(0,-1)),plain(prior.src));assert.equal(c.src.at(-1).u,'https://www.churchofjesuschrist.org/study/manual/gospel-topics/book-of-mormon-geography?lang=eng');}
assert(!by.get('BXP02').desc.includes('SD1266'));assert(by.get('BE02').desc.includes('reports Ishmael’s death and says he was buried at Nahom'));
for(const f of ['layers.js','packs/registry.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));assert.equal(read(base,'src/universe-packs.ts'),read(head,'src/universe-packs.ts'));
// Execute the exact pure See-also reachability/HTML builder, not cxGo or event registration.
const engine=read(head,'public/atlas/engine.js'),ctx={K:p,LY:w.AtlasLayers,S:{},CUM:false,ARR:x=>Array.isArray(x)?x:[],esc:x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),cxFirst:x=>x.first||(x.books?.length?Math.min(...x.books):0)};
vm.createContext(ctx);vm.runInContext(engine.slice(engine.indexOf('const CXK=new Map();'),engine.indexOf('function cxGo(key)')),ctx);
let reachChecks=0;for(const cum of [false,true])for(const book of [1,2,3,4,5])for(const layer of [null,'ot','nt','bom','dc','pgp'])for(const c of linked){ctx.CUM=cum;ctx.S={book,layers:layer?new Set([layer]):null,range:null};ctx.target=c;const state=vm.runInContext('cxReach(target)',ctx);assert.equal(state,cum&&Math.min(...c.books)>book?'locked':layer&&!c.layers.includes(layer)?'filtered':'ok');reachChecks++;}
ctx.CUM=false;ctx.S={book:3,layers:new Set(['bom']),range:null};ctx.target=by.get('FM04');const filtered=vm.runInContext('cxSee(target)',ctx);assert(!filtered.includes('<button'));for(const name of ['Oliver Cowdery','David Whitmer','Martin Harris'])assert(filtered.includes(name));
ctx.CUM=true;const locked=vm.runInContext('cxSee(target)',ctx);assert(!locked.includes('Oliver Cowdery'));assert(locked.includes('3 more unlock'));
ctx.CUM=false;ctx.S={book:5,layers:new Set(['pgp']),range:null};ctx.target=by.get('PGM-jsh-family');assert(!vm.runInContext('cxSee(target)',ctx).includes('<button'));
ctx.S.layers=null;for(const c of linked){ctx.target=c;const html=vm.runInContext('cxSee(target)',ctx);assert.equal((html.match(/<button /g)||[]).length,c.see.length);}
const result={head,base,totalCards:cards.length,addedCards:0,changedCards:changed.length,unchangedCards:cards.length-changed.length,linkOnlyChangedCards:changed.length-copyChanged.length,copyChanged:copyChanged.map(c=>c.key),linkedCards:linked.length,directedEdges:edges,reachabilityChecks:reachChecks,allOtherPackDataUnchanged:true,namingPreserved:true,S23C1:'closed',browserExecuted:false,result:'pass'};
if(process.argv.includes('--links'))console.log(JSON.stringify(linked.map(c=>({key:c.key,name:c.name,desc:c.desc,src:c.src,books:c.books,layers:c.layers,see:c.see})),null,2));else console.log(JSON.stringify(result,null,2));
