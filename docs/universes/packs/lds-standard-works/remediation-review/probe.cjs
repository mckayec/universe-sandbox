// Pure actual-function probes only. No browser/server or rendered acceptance.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.argv[2], c={window:{}};vm.createContext(c);
for(const file of ['layers.js','packs/lds-standard-works.js']) vm.runInContext(fs.readFileSync(path.join(root,'public/atlas',file),'utf8'),c);
const p=c.window.ATLAS_PACKS['lds-standard-works'],L=c.window.AtlasLayers;
const cards=p.codex.flatMap(t=>t.list),sites=p.worlds[0].sites;
const present=id=>sites.some(s=>s.id===id), routes=p.worlds[0].routes;
for(const id of ['lystra','south-pass'])assert(!present(id));
for(const r of routes){for(const [a,b] of L.routeLegs(r,present)) {assert(a!==b);assert(present(a)&&present(b));assert(!(a==='chimney-rock'&&b==='fort-bridger'));}}
const triples=[['Haran',['ot','pgp']],['Ur of the Chaldees',['ot','pgp']],['Mount of Olives',['ot','nt','pgp']],['Enoch’s city (Zion)',['dc','pgp']],['First Vision account',['dc','pgp']]];
for(const [name,layers] of triples){const a=cards.filter(x=>x.name===name);assert.equal(a.length,layers.length);for(const layer of layers){const shown=L.codexSplit(a,new Set([layer]),null,false,0).shown;assert.equal(shown.length,1);assert.equal(shown[0].layers.length,1);assert.equal(shown[0].layers[0],layer);}}
for(const x of cards.filter(x=>x.key)){const b=x.books[0];for(const layer of ['ot','nt','bom','dc','pgp']){assert.equal(L.codexSplit([x],new Set([layer]),null,true,b,y=>Math.min(...y.books)).shown.length,Number(x.layers.includes(layer)));}if(b>1)assert.equal(L.codexSplit([x],null,null,true,b-1,y=>Math.min(...y.books)).shown.length,0);}
for(const x of [sites.find(s=>s.id==='fayette'),p.events.find(e=>e.id==='translation-fayette'),routes.find(r=>r.id==='dictation-move')])assert(L.timeOk(x,[1829,1829]));
const palmyra=sites.find(s=>s.id==='palmyra');assert(!L.layerOk(palmyra,new Set(['bom'])));assert.equal(palmyra.books[0],4);
const engine=fs.readFileSync(path.join(root,'public/atlas/engine.js'),'utf8');
// Extract unchanged helpers and new source formatter directly from this exact engine.
for(const pattern of [/const esc=[^\n]+/,/const ARR=[^\n]+/,/function cxSrc\(x\)\{[\s\S]*?(?=\nfunction renderCodex)/]){const m=engine.match(pattern);assert(m);vm.runInContext(m[0],c);}
const html=vm.runInContext('cxSrc({src:[{t:"<bad>",u:"javascript:alert(1)"},{t:"A&B",u:"https://example.com/?a=1&b=2"},{t:"quote",u:"https://example.com/\\\"onclick=bad"}]})',c);
assert(!html.includes('javascript:'));assert(html.includes('&lt;bad&gt;'));assert(html.includes('rel="noopener noreferrer"'));assert(html.includes('a=1&amp;b=2'));assert.equal((html.match(/<a /g)||[]).length,1);
console.log(JSON.stringify({routeSafety:'all actual route legs checked',splitIdentities:5,sourceViewsGateChecked:62,fayette1829:'site/event/route pass',palmyra:'BoM pin gate still absent',sourceFormatter:'unsafe schemes/quotes escaped or unlinked; https link retained',limit:'pure functions only; no DOM, rendered, mobile or keyboard claim'},null,2));
