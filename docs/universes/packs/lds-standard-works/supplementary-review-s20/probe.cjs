// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='be4c60eab72a4db26d81d18e4f977688016721ca',base='e7a532a9009b7a4bcc485a52b6f32c0a09ab9def';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,18);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['DCM-dd104-stewardships','DCM-dd124-nauvoo','DCM-dd137-alvin-vision','DCM-ddo1-manifesto'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);stripped.codex=stripped.codex.filter(t=>t.id!=='pgp-more');assert.deepEqual(stripped,plain(old));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,423);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,earlyExclusions=0;
for(const c of [...added,...changed]){
 const isNew=added.includes(c), layer=isNew?'pgp':'dc',n=isNew?5:4;
 assert.deepEqual(plain(c.layers),[layer]);assert.deepEqual(plain(c.books),[n]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);
 assert(c.src.every(s=>s.t&&s.u.startsWith('https://www.churchofjesuschrist.org/')));
 for(const l of ['ot','nt','bom','dc','pgp'])for(const g of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([l]),null,true,g,x=>Math.min(...x.books)).shown.length,Number(l===layer&&g>=n));gates++;}
 for(let g=1;g<n;g++){assert.equal(L.codexSplit([c],null,null,true,g,x=>Math.min(...x.books)).shown.length,0);earlyExclusions++;}
}
const card=k=>nc.find(c=>c.key===k);
assert(!card('DCM-dd137-alvin-vision').desc.includes('Alvin Smith'));
assert(card('DCM-dd137-alvin-vision').desc.includes('Joseph Smith’s brother Alvin'));
assert.equal(card('DCM-jsh-alvin-family').books[0],5);
assert(card('DCM-dd124-nauvoo').desc.includes('stake president, with their counselors, are not named in verse 142'));
assert(card('DCM-dd124-nauvoo').desc.includes('minimum of $50 per share and a maximum total subscription of $15,000 from any one person'));
assert(card('DCM-dd104-stewardships').desc.includes('the lot John Johnson had obtained in exchange for his former inheritance'));
assert(card('DCM-ddo1-manifesto').src.some(s=>s.u.includes('/the-manifesto-and-the-end-of-plural-marriage?')));
assert.equal(nc.indexOf(card('PGM-qg14-cowdery-1834')),nc.indexOf(card('PGM-qg14-js-history-moves'))+1);
assert.equal(card('PGM-aof-1-13').src.length,1);
assert(card('PGM-aof-1-13').src[0].u.includes('/pgp/a-of-f/1?'));
assert(card('PGM-qg15-race-church-today').src.some(s=>s.u.includes('/race-and-the-priesthood?')));
assert(card('PGM-qg16-collection-history').src.some(s=>s.u.includes('/pgp/introduction?')));
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,earlyWorkExclusions:earlyExclusions,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S20-C1 QG07 retained age/name payload missing; see report"]},null,2));
