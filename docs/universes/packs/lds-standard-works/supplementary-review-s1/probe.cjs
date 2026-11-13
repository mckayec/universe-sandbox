// Pure pack/layer evaluation; no DOM, browser or server.
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='fe24d334731c1b25c806c2300aa7a23f930babbb',base='b62bd3cf2d4c4218504b9c5b91720eacce98551f';
function read(ref,file){return cp.execFileSync('git',['show',ref+':'+file],{encoding:'utf8'});}
function load(ref){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(ref,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const list=p.codex.find(t=>t.id==='bom-more').list;
assert.equal(list.length,118);assert.equal(new Set(list.map(x=>x.key)).size,118);
for(const x of list){assert.deepEqual(plain(x.books),[3]);assert.deepEqual(plain(x.layers),['bom']);for(const f of ['when','lat','lon','lng','date','id'])assert.equal(x[f],undefined,x.key+':'+f);assert(x.src.length);assert(x.src.every(s=>s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/bofm/')&&s.t));for(const l of ['ot','nt','bom','dc','pgp'])for(const n of [1,2,3,4,5]){const actual=L.codexSplit([x],new Set([l]),null,true,n,y=>Math.min(...y.books)).shown.length;assert.equal(actual,Number(l==='bom'&&n>=3),x.key+':'+l+':'+n);}assert.equal(L.codexSplit([x],null,null,true,2,y=>Math.min(...y.books)).shown.length,0);assert(L.timeOk(x,[100,101]));}
const stripped=plain(p);stripped.codex=stripped.codex.filter(t=>t.id!=='bom-more');assert.deepEqual(stripped,plain(old));
assert.equal(read(base,'public/atlas/engine.js'),read(head,'public/atlas/engine.js'));
assert.equal(read(base,'public/atlas/layers.js'),read(head,'public/atlas/layers.js'));
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));else console.log(JSON.stringify({head,base,addedCards:118,priorCards:old.codex.flatMap(t=>t.list).length,totalCards:p.codex.flatMap(t=>t.list).length,gateCombinations:118*25,preBoMAllLayerChecks:118,nonspatialUndatedChecks:118,allPreexistingPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false},null,2));
