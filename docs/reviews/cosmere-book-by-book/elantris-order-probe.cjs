// Characterizes current EL10 ordering from actual PR37 engine functions.
// Usage: node elantris-order-probe.cjs <checkout-root>
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=process.argv[2],read=p=>fs.readFileSync(path.join(root,p),"utf8");
const z={window:{}};vm.runInNewContext(read("public/atlas/packs/cosmere.js"),z);const P=z.window.ATLAS_PACKS.cosmere;
const eng=read("public/atlas/engine.js"),x=vm.createContext({EVENTS:P.events,BOOK_IDS:Object.keys(P.books).map(Number),BOOKS:P.books,WORLD_BY:Object.fromEntries(P.worlds.map(w=>[w.id,w])),S:{book:1,sel:"sel"},CUM:true,MOB:true,filterOk:()=>true,seen:()=>true,esc:s=>String(s),track:{innerHTML:"",querySelectorAll:()=>[]}});
vm.runInContext(eng.slice(eng.indexOf("const evFor="),eng.indexOf("const eraKeys="))+
eng.slice(eng.indexOf("function renderChron("),eng.indexOf('track.addEventListener("click"'))+
eng.slice(eng.indexOf("function tourList("),eng.indexOf("/* travel to an event:")),x);
vm.runInContext("renderChron();",x);
const lists={
 chronicle:[...x.track.innerHTML.matchAll(/data-ev="([^"]+)"/g)].map(m=>m[1]),
 tour:Array.from(x.tourList(),e=>e.id),
 dossier:Array.from(vm.runInContext('evFor("sel")',x),e=>e.id)
};
for(const [k,ids] of Object.entries(lists)){
 assert(ids.includes("e67")&&ids.includes("e5"),k+" contains both events");
 console.log(JSON.stringify({path:k,ids,restorationBeforeConfrontation:ids.indexOf("e5")<ids.indexOf("e67")}));
}
console.log("Three real-source ordering paths inspected. false is the current defect, not an acceptance pass.");
