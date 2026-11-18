// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='0171db7e863b196a25993dec20999907bac43012',base='851715884a6969308ac1eadd7ff6cd4d37b7e2fb';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,79);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['OTM-j22-temple-tour','OTM-r15-zedekiah-house','OTM-c15-divergent-chronology','OTM-j24-exile-letter'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
assert(!p.codex.find(t=>t.id==='ot-more').list.some(c=>c.desc.includes('Mulek')));
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>changed.some(a=>a.key===c.key)?plain(oldKeys.get(c.key)):c);
assert.deepEqual(stripped,plain(old));
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,preNT=0;
for(const c of [...added,...changed]){
 const nt=c.layers[0]==='nt',n=nt?2:1;assert.deepEqual(plain(c.layers),[nt?'nt':'ot']);assert.deepEqual(plain(c.books),[n]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert(c.src.every(s=>s.t&&s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')));
 for(const layer of ['ot','nt','bom','dc','pgp'])for(const group of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([layer]),null,true,group,x=>Math.min(...x.books)).shown.length,Number(layer===c.layers[0]&&group>=n));gates++;}
 if(nt){assert.equal(L.codexSplit([c],null,null,true,1,x=>Math.min(...x.books)).shown.length,0);preNT++;}
}
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,preNTAllLayerExclusions:preNT,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S8-C1 Samaria city/region wording","S8-C2 Ezekiel 46 source locator"]},null,2));
