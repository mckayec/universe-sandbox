// Pure pack/layer evaluation; no DOM, browser or server.
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='7b7a3da6154aceb1e279775a5805e5e287df4194',base='47debcfdb86a3e41a023a30e04c6fcd5bd7209b0';
function read(ref,file){return cp.execFileSync('git',['show',ref+':'+file],{encoding:'utf8'});}
function load(ref){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(ref,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const list=p.codex.find(t=>t.id==='nt-more').list;
assert.equal(list.length,187);assert.equal(new Set(list.map(x=>x.key)).size,187);
for(const x of list){assert.deepEqual(plain(x.books),[2]);assert.deepEqual(plain(x.layers),['nt']);for(const f of ['when','lat','lon','lng','date','id'])assert.equal(x[f],undefined,x.key+':'+f);assert(x.src.length);assert(x.src.every(s=>s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')&&s.t));for(const l of ['ot','nt','bom','dc','pgp'])for(const n of [1,2,3,4,5]){const actual=L.codexSplit([x],new Set([l]),null,true,n,y=>Math.min(...y.books)).shown.length;assert.equal(actual,Number(l==='nt'&&n>=2),x.key+':'+l+':'+n);}assert.equal(L.codexSplit([x],null,null,true,1,y=>Math.min(...y.books)).shown.length,0);assert(L.timeOk(x,[100,101]));}
const stripped=plain(p);stripped.codex=stripped.codex.filter(t=>t.id!=='nt-more');assert.deepEqual(stripped,plain(old));
assert.equal(read(base,'public/atlas/engine.js'),read(head,'public/atlas/engine.js'));
assert.equal(read(base,'public/atlas/layers.js'),read(head,'public/atlas/layers.js'));
assert.equal(read(base,'public/atlas/engine.css'),read(head,'public/atlas/engine.css'));
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));else console.log(JSON.stringify({head,base,addedCards:187,priorCards:old.codex.flatMap(t=>t.list).length,totalCards:p.codex.flatMap(t=>t.list).length,gateCombinations:187*25,preNTAllLayerChecks:187,nonspatialUndatedChecks:187,allPreexistingPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false},null,2));
