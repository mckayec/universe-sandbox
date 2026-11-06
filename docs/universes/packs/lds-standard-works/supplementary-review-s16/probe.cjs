// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='1a6b94eea246a39a795d79c22204226e2d8f001e',base='a136f70aec3a7ff7c47c020b06205cf2d4587506';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,37);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['DCM-dcp-alvin-smith','DCM-dr06-joseph-alvin','DCM-dcp-robert-d-foster'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);assert.deepEqual(stripped,plain(old));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,244);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,preNT=0;
for(const c of [...added,...changed]){
 const nt=c.layers[0]==='nt',n=Math.min(...c.books);assert.equal(c.layers.length,1);assert.equal(c.layers[0],c.key==='DCM-jsh-alvin-family'?'pgp':'dc');assert.deepEqual(plain(c.books),[c.key==='DCM-jsh-alvin-family'?5:4]);assert.equal(n,{ot:1,nt:2,bom:3,dc:4,pgp:5}[c.layers[0]]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);assert(c.src.every(s=>s.t&&(s.u.startsWith('https://www.churchofjesuschrist.org/study/scriptures/')||(c.key==='OTW-a28-lexical-notes'&&s.u==='https://github.com/mckayec/universe-sandbox/blob/9cc874c09a3686119ca6b4c17c7e16f214fd7ab6/docs/universes/packs/lds-standard-works/coverage-ot-wisdom-prophets.md#bounded-inline-apparatus-audit'))));
 for(const layer of ['ot','nt','bom','dc','pgp'])for(const group of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([layer]),null,true,group,x=>Math.min(...x.books)).shown.length,Number(layer===c.layers[0]&&group>=n));gates++;}
 for(const group of [1,2,3]){assert.equal(L.codexSplit([c],null,null,true,group,x=>Math.min(...x.books)).shown.length,0);preNT++;}
}
const card=k=>nc.find(c=>c.key===k);
assert.equal(card('DCM-dcp-alvin-smith').name,'Alvin');
assert.equal(card('DCM-dr06-joseph-alvin').name,'Joseph Smith and his brother Alvin');
assert.equal(nc.indexOf(card('DCM-jsh-alvin-family')),nc.indexOf(card('DCM-dcp-alvin-smith'))+1);
assert(card('DCM-jsh-alvin-family').src[0].u.includes('/pgp/js-h/1'));
const report=read('a59bb3dcb070ce8602019e6c91f6435acc35fa2d','docs/universes/packs/lds-standard-works/supplementary-review-s15.md');
const quotes=[...report.matchAll(/^> (.+)$/gm)].map(m=>m[1]); quotes.push(report.match(/Minimum copy: \*\*“(.+?)”\*\*/)[1]);
for(const key of ['DCM-jsh-alvin-family','DCM-dcp-robert-d-foster'])assert(quotes.some(q=>q.replaceAll('’',"'")===card(key).desc.replaceAll('’',"'")),key);
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,preDCAllLayerExclusions:preNT,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["See review for source-reference versus integration limits"]},null,2));
