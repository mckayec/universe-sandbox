// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='c95e948d05887862ff39e32810d5795a9ba0710c',base='e1d56505d17425128364dd75a1faa09ccc2f57ca';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,70);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['DCM-dd036-edward-partridge','DCM-dd052-missouri-companions','DCM-dd054-colesville-onward','DCM-dd060-return-east','DCM-dd070-publication-stewards'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);assert.deepEqual(stripped,plain(old));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,423);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,preNT=0;
for(const c of [...added,...changed]){
 const nt=c.layers[0]==='nt',n=Math.min(...c.books);assert.equal(c.layers.length,1);assert.equal(c.layers[0],'dc');assert.deepEqual(plain(c.books),[4]);assert.equal(n,{ot:1,nt:2,bom:3,dc:4,pgp:5}[c.layers[0]]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);assert(c.src.every(s=>s.t&&(s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')||(c.key==='OTW-a28-lexical-notes'&&s.u==='https://github.com/mckayec/universe-sandbox/blob/9cc874c09a3686119ca6b4c17c7e16f214fd7ab6/docs/universes/packs/lds-standard-works/coverage-ot-wisdom-prophets.md#bounded-inline-apparatus-audit'))));
 for(const layer of ['ot','nt','bom','dc','pgp'])for(const group of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([layer]),null,true,group,x=>Math.min(...x.books)).shown.length,Number(layer===c.layers[0]&&group>=n));gates++;}
 for(const group of [1,2,3]){assert.equal(L.codexSplit([c],null,null,true,group,x=>Math.min(...x.books)).shown.length,0);preNT++;}
}
const card=k=>nc.find(c=>c.key===k);
for(const [k,t] of Object.entries({
 'DCM-dd036-edward-partridge':'verse 2 promises',
 'DCM-dd052-missouri-companions':'as one party',
 'DCM-dd054-colesville-onward':'does not itself record their completed departure or arrival',
 'DCM-dd060-return-east':'directed to supply travel money',
 'DCM-dd070-publication-stewards':'John Whitmer, Sidney Rigdon and William W. Phelps'}))assert(card(k).desc.includes(t),k);
for(let i=71;i<=138;i++){const c=added.find(c=>c.key.startsWith('DCM-dd'+String(i).padStart(3,'0')+'-'));assert(c);assert.equal(c.src.length,1);assert.equal(c.src[0].u,'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/dc/'+i+'?lang=eng');assert(c.name.startsWith('Section '+i+':'));}
for(const i of [1,2]){const c=added.find(c=>c.key.startsWith('DCM-ddo'+i+'-'));assert(c);assert.equal(c.src.length,1);assert.equal(c.src[0].u,'https://www.churchofjesuschrist.org/study/scriptures/dc-testament/od/'+i+'?lang=eng');}
// Preserve existing resolved identity child; diagnose rather than hide the new regression.
assert.equal(card('DCM-jsh-alvin-family').books[0],5);
assert.equal(card('DCM-jsh-alvin-family').layers[0],'pgp');
assert(card('DCM-dd137-alvin-vision').desc.includes('Alvin Smith'));
assert.equal(L.codexSplit([card('DCM-dd137-alvin-vision')],new Set(['dc']),null,true,4,x=>Math.min(...x.books)).shown.length,1);
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,preDCAllLayerExclusions:preNT,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S19-C1/C2/C3 remain content findings; see report"]},null,2));
