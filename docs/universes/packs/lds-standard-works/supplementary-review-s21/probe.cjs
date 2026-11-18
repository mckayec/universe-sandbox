// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='91a69fbaa9f42e9409955f0c2d35fe59eb02fdd0',base='b27b845eec64bb987feb82fe1674051c9dde0e40';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,10);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['PGM-qg07-lamech-noah','PC05','PC06'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);assert.deepEqual(stripped,plain(old));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,423);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,earlyExclusions=0;
for(const c of [...added,...changed]){
 const layer='pgp',n=5;
 assert.deepEqual(plain(c.layers),[layer]);assert.deepEqual(plain(c.books),[n]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);
 assert(c.src.every(s=>s.t&&s.u.startsWith('https://www.churchofjesuschrist.org/')));
 for(const l of ['ot','nt','bom','dc','pgp'])for(const g of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([l]),null,true,g,x=>Math.min(...x.books)).shown.length,Number(l===layer&&g>=n));gates++;}
 for(let g=1;g<n;g++){assert.equal(L.codexSplit([c],null,null,true,g,x=>Math.min(...x.books)).shown.length,0);earlyExclusions++;}
}
const card=k=>nc.find(c=>c.key===k);
assert.equal(p.codex.find(t=>t.id==='pgp-more').list.length,28);
for(const term of ['Japheth','450','Shem','492 by addition','Ham','500'])assert(card('PGM-qg07-lamech-noah').desc.includes(term));
for(const term of ['Egyptologists','funerary','vignette'])assert(card('PC05').desc.includes(term));
assert(card('PC06').desc.includes('article-by-article'));
assert.equal(card('PGM-qg07-lamech-noah').src.length,1);
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,earlyWorkExclusions:earlyExclusions,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S21-C1 source-specific ages absent; S21-C2 ambiguous Sarai pronoun; see report"]},null,2));
