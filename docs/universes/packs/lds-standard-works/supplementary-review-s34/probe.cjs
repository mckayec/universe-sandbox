// Exact pure pack/layer/See-also functions; no DOM/browser/server execution.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const head='29e888069f32f7e2e5cd0ea8a0b5912af5a52339',base='bf86c5316f499d7f85a7e6d5aff5ede83e957895',read=(r,p)=>cp.execFileSync('git',['show',r+':'+p],{encoding:'utf8'}),plain=x=>JSON.parse(JSON.stringify(x));
function load(r){const c={window:{}};vm.createContext(c);for(const f of ['layers.js','packs/lds-standard-works.js'])vm.runInContext(read(r,'public/atlas/'+f),c);return c.window;}
const w=load(head),p=w.ATLAS_PACKS['lds-standard-works'],old=load(base).ATLAS_PACKS['lds-standard-works'],cs=p.codex.flatMap(t=>t.list),bs=old.codex.flatMap(t=>t.list),by=new Map(cs.filter(c=>c.key).map(c=>[c.key,c])),events=Object.fromEntries(p.events.map(e=>[e.id,e]));

assert.deepEqual(plain(p),plain(old));for(const f of ['public/atlas/engine.js','public/atlas/engine.css','public/atlas/layers.js'])assert.equal(read(head,f),read(base,f));console.log(JSON.stringify(process.argv.includes('--pack')?plain(p):{head,base,packAndEngineUnchanged:true,browserExecuted:false,result:'pass'},null,2));
