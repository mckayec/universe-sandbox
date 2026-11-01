// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='e1d56505d17425128364dd75a1faa09ccc2f57ca',base='1b55cc853c11a86340a3baf21913bc311ddfbadc';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,70);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['DCM-dca-john-peter-james','DCM-de20-word-of-wisdom','DCM-dca-sarai-abraham','DCM-dca-abel-to-noah','DCM-de19-school-of-the-prophets'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);assert.deepEqual(stripped,plain(old));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,353);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,preNT=0;
for(const c of [...added,...changed]){
 const nt=c.layers[0]==='nt',n=Math.min(...c.books);assert.equal(c.layers.length,1);assert.equal(c.layers[0],c.key==='DCM-dca-sarai-abraham'?'pgp':'dc');assert.deepEqual(plain(c.books),[c.key==='DCM-dca-sarai-abraham'?5:4]);assert.equal(n,{ot:1,nt:2,bom:3,dc:4,pgp:5}[c.layers[0]]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);assert(c.src.every(s=>s.t&&(s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')||(c.key==='OTW-a28-lexical-notes'&&s.u==='https://github.com/mckayec/universe-sandbox/blob/9cc874c09a3686119ca6b4c17c7e16f214fd7ab6/docs/universes/packs/lds-standard-works/coverage-ot-wisdom-prophets.md#bounded-inline-apparatus-audit'))));
 for(const layer of ['ot','nt','bom','dc','pgp'])for(const group of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([layer]),null,true,group,x=>Math.min(...x.books)).shown.length,Number(layer===c.layers[0]&&group>=n));gates++;}
 for(const group of [1,2,3]){assert.equal(L.codexSplit([c],null,null,true,group,x=>Math.min(...x.books)).shown.length,0);preNT++;}
}
const card=k=>nc.find(c=>c.key===k);
assert.equal(nc.indexOf(card('DCM-dca-sarai-abraham')),nc.indexOf(card('DCM-dca-marriage-examples'))+1);
assert(card('DCM-dca-sarai-abraham').src[0].u.includes('/pgp/abr/2'));
assert.equal(card('DCM-dca-sarai-abraham').layers[0],'pgp');
assert.equal(card('DCM-dca-sarai-abraham').books[0],5);
assert(card('DCM-dca-aaron').src.some(s=>s.u.includes('/ot/ex/4')));
assert(card('DCM-dca-marriage-examples').src.some(s=>s.u.includes('/ot/gen/17')));
assert(card('DCM-dca-abel-to-noah').src.some(s=>s.u.includes('/ot/gen/5')));
const report=read('58328be138db4fa3ccf941048a7cd057ef5291c3','docs/universes/packs/lds-standard-works/supplementary-review-s17.md');
const quotes=[...report.matchAll(/^> (.+)$/gm)].map(m=>m[1]);
const norm=s=>s.replaceAll('’',"'");
assert.equal(norm(card('DCM-dca-john-peter-james').desc),norm(quotes[0]));
assert(norm(card('DCM-de20-word-of-wisdom').desc).includes(norm(quotes[1])));
assert(card('DCM-dca-sarai-abraham').src.some(s=>s.u.includes('/ot/gen/17')));
assert(card('DCM-dca-abel-to-noah').desc.includes('offering-comparison'));
for(let i=1;i<=70;i++){const c=added.find(c=>c.key.startsWith('DCM-dd'+String(i).padStart(3,'0')+'-'));assert(c);assert.equal(c.src.length,1);assert.equal(c.src[0].u,'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/'+i+'?lang=eng');assert(c.name.startsWith('Section '+i+':'));}
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,preDCAllLayerExclusions:preNT,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S18-C1/C2/C3 remain content or consolidation findings; see report"]},null,2));
