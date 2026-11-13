// Actual pack/layer functions in an isolated VM; no DOM, browser or server.
const vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const head='e09d6e83bb8774e798cdf583150f380eff2b0282',base='82a0053bf64e680554afe5a178576f9c017b1fc0';
const read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'});
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const b=load(base),h=load(head),p=h.ATLAS_PACKS['lds-standard-works'],old=b.ATLAS_PACKS['lds-standard-works'],L=h.AtlasLayers;
const plain=x=>JSON.parse(JSON.stringify(x));
const oc=old.codex.flatMap(t=>t.list),nc=p.codex.flatMap(t=>t.list),oldKeys=new Map(oc.filter(c=>c.key).map(c=>[c.key,c]));
const added=nc.filter(c=>c.key&&!oldKeys.has(c.key));assert.equal(added.length,3);
const changed=nc.filter(c=>c.key&&oldKeys.has(c.key)&&JSON.stringify(c)!==JSON.stringify(oldKeys.get(c.key)));
const expected=['BE02','BE03','BJ01','BJ11','BXP02','FM08','FM09'];
assert.deepEqual(plain(changed.map(c=>c.key)).sort(),expected.sort());
const stripped=plain(p);for(const t of stripped.codex)t.list=t.list.filter(c=>!added.some(a=>a.key===c.key)).map(c=>expected.includes(c.key)?plain(oldKeys.get(c.key)):c);const title='The Church of Jesus Christ of Latter-day Saints · Standard Works';
assert.equal(p.meta.title,title);assert.equal(p.meta.series,title);
for(const k of ['title','series','splash','canvasLabel']){assert(p.meta[k].includes('The Church of Jesus Christ of Latter-day Saints'));stripped.meta[k]=old.meta[k];}
assert(p.intro.text.includes('The Church of Jesus Christ of Latter-day Saints'));stripped.intro.text=old.intro.text;
assert.deepEqual(stripped,plain(old));
for(const f of ['public/atlas/packs/registry.js','src/universe-packs.ts'])assert.equal(read(head,f),read(base,f).replace('Latter-day Saint Standard Works',title));
assert.equal(p.codex.find(t=>t.id==='dc-more').list.length,423);
for(const f of ['engine.js','engine.css','layers.js'])assert.equal(read(base,'public/atlas/'+f),read(head,'public/atlas/'+f));
let gates=0,earlyExclusions=0;
for(const c of [...added,...changed]){
 const n=c.key==='FM08'?4:c.key==='FM09'?5:3,layer={3:'bom',4:'dc',5:'pgp'}[n];
 assert.deepEqual(plain(c.layers),[layer]);assert.deepEqual(plain(c.books),[n]);
 for(const f of ['lat','lon','lng','when','date','id'])assert.equal(c[f],undefined,c.key+':'+f);
 assert(c.src.length);assert.equal(new Set(c.src.map(s=>s.u)).size,c.src.length);
 assert(c.src.every(s=>s.t&&s.u.startsWith('https://')));
 for(const l of ['ot','nt','bom','dc','pgp'])for(const g of [1,2,3,4,5]){assert.equal(L.codexSplit([c],new Set([l]),null,true,g,x=>Math.min(...x.books)).shown.length,Number(l===layer&&g>=n));gates++;}
 for(let g=1;g<n;g++){assert.equal(L.codexSplit([c],null,null,true,g,x=>Math.min(...x.books)).shown.length,0);earlyExclusions++;}
}
const card=k=>nc.find(c=>c.key===k);
assert.equal(p.codex.find(t=>t.id==='pgp-more').list.length,34);
for(const term of ['Japheth','450','Shem','492 by addition','Ham','500'])assert(card('PGM-qg07-lamech-noah').desc.includes(term));
for(const term of ['Egyptologists','funerary','vignette'])assert(card('PC05').desc.includes(term));
assert(card('PC06').desc.includes('article-by-article'));
assert.equal(card('PGM-qg07-lamech-noah').src.length,1);
assert(card('PGM-id04-abraham-family').desc.includes('Sarai is Abraham’s wife'));
for(const term of ['Adam 130','Seth 105','Enos 90','Cainan 70','Mahalaleel 65','Jared 162','Enoch 65','Methuselah 187','Lamech 182'])assert(card('PGM-id03-seth-line').desc.includes(term));
const childKeys=['family','harmony-marriage','harris-anthon','moroni-material','baptism','text-referents'].map(k=>'PGM-jsh-'+k);
assert.deepEqual(plain(nc.slice(nc.indexOf(card('PGM-qg14-cowdery-1834'))+1,nc.indexOf(card('PGM-qg14-cowdery-1834'))+7).map(c=>c.key)),childKeys);
assert(card('FM08').src.some(s=>s.t==='D&C 7, historical heading'&&s.u.includes('/dc/7?')));
assert(card('FM09').src.some(s=>s.t==='D&C introduction, 1981 edition'&&s.u.includes('/dc-testament/introduction?')));
for(const k of ['FM08','FM09']){const a=plain(card(k)),z=plain(oldKeys.get(k));a.src=z.src;assert.deepEqual(a,z);}
for(const k of ['BE02','BE03','BJ01','BJ11']){const a=plain(card(k)),z=plain(oldKeys.get(k));a.desc=z.desc;assert.deepEqual(a,z);}
const keys=nc.filter(c=>c.key).map(c=>c.key);assert.equal(new Set(keys).size,keys.length);
if(process.argv.includes('--pack'))console.log(JSON.stringify(plain(p)));
else if(process.argv.includes('--delta'))console.log(JSON.stringify({added:plain(added),changed:changed.map(c=>({before:plain(oldKeys.get(c.key)),after:plain(c)}))}));
else console.log(JSON.stringify({head,base,addedCards:added.length,changedPriorCards:changed.length,unchangedPriorCards:oc.length-changed.length,totalCards:nc.length,uniqueKeyedCards:keys.length,gateCombinations:gates,earlyWorkExclusions:earlyExclusions,allOtherPackDataUnchanged:true,engineAndLayersUnchanged:true,result:'pass',browserExecuted:false,knownContentFindings:["S23-C1 Church geography position notice missing beside model summaries; see report"]},null,2));
