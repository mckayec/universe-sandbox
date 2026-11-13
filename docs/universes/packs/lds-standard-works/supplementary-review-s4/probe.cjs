// Pure pack/layer evaluation; no DOM, browser or server.
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='665f82590881ee8664b70bb88543e71a0965b7d1',base='7b7a3da6154aceb1e279775a5805e5e287df4194';
function read(ref,file){return cp.execFileSync('git',['show',ref+':'+file],{encoding:'utf8'});}
function load(ref){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(ref,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const list=p.codex.find(t=>t.id==='ot-more').list;
assert.equal(list.length,177);assert.equal(new Set(list.map(x=>x.key)).size,177);
for(const x of list){assert.deepEqual(plain(x.books),[1]);assert.deepEqual(plain(x.layers),['ot']);for(const f of ['when','lat','lon','lng','date','id'])assert.equal(x[f],undefined,x.key+':'+f);assert(x.src.length);assert(x.src.every(s=>s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')&&s.t));for(const l of ['ot','nt','bom','dc','pgp'])for(const n of [1,2,3,4,5]){const actual=L.codexSplit([x],new Set([l]),null,true,n,y=>Math.min(...y.books)).shown.length;assert.equal(actual,Number(l==='ot'&&n>=1),x.key+':'+l+':'+n);}assert(L.timeOk(x,[100,101]));}
const stripped=plain(p);stripped.codex=stripped.codex.filter(t=>t.id!=='ot-more');assert.deepEqual(stripped,plain(old));
assert.equal(read(base,'public/atlas/engine.js'),read(head,'public/atlas/engine.js'));
assert.equal(read(base,'public/atlas/layers.js'),read(head,'public/atlas/layers.js'));
assert.equal(read(base,'public/atlas/engine.css'),read(head,'public/atlas/engine.css'));
const keyed=p.codex.flatMap(t=>t.list).filter(c=>c.key);assert.equal(new Set(keyed.map(c=>c.key)).size,keyed.length);
assert.equal(read(head,'public/atlas/packs/lds-standard-works.js'),read('de94dffc3c4b7b6a7df2b40da11e069700e017e6','public/atlas/packs/lds-standard-works.js'));
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));else console.log(JSON.stringify({head,base,addedCards:177,priorCards:old.codex.flatMap(t=>t.list).length,totalCards:p.codex.flatMap(t=>t.list).length,gateCombinations:177*25,noSyntheticPreOTGroup:true,nonspatialUndatedChecks:177,allPreexistingPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false},null,2));
