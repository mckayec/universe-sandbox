// Dune omission check: base (80b8514) vs head. Asserts exactly conservatory/d15/d16 removed,
// all other records identical, no dangling id references, Arrakeen counts 10->9 markers, 14->12 events.
const fs=require('fs'),vm=require('vm');const [A,B]=process.argv.slice(2);
const load=f=>{const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);return JSON.parse(JSON.stringify(Object.values(c.window.ATLAS_PACKS)[0]));};
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const packs=['dune','foundation','sun-eater','cosmere','expanse','hyperion'];
for(const pk of packs){const a=load(A+'/public/atlas/packs/'+pk+'.js'),b=load(B+'/public/atlas/packs/'+pk+'.js');
 if(pk!=='dune'){ok(JSON.stringify(a)===JSON.stringify(b),pk+' unchanged');continue;}
 const ea=a.events.map(e=>e.id),eb=b.events.map(e=>e.id);
 ok(JSON.stringify(ea.filter(x=>!eb.includes(x)))==='["d15","d16"]'&&eb.every(x=>ea.includes(x)),'dune events removed exactly d15,d16');
 const others=a.events.filter(e=>e.id!=='d15'&&e.id!=='d16');ok(JSON.stringify(others)===JSON.stringify(b.events),'remaining dune events identical in order and content');
 const site=p=>p.worlds.find(w=>w.id==='arrakis').sites.find(s=>s.id==='arrakeen');
 const la=site(a).scene.landmarks,lb=site(b).scene.landmarks;
 ok(JSON.stringify(la.filter(l=>l.id!=='conservatory'))===JSON.stringify(lb),'arrakeen landmarks = base minus conservatory, others identical');
 ok(la.length===10&&lb.length===9,'arrakeen markers '+la.length+' -> '+lb.length);
 const ca=a.events.filter(e=>e.site==='arrakeen').length,cb=b.events.filter(e=>e.site==='arrakeen').length;ok(ca===14&&cb===12,'arrakeen events '+ca+' -> '+cb);
 ok(lb.some(l=>l.id==='residency'),'residency retained');
 const A2=JSON.parse(JSON.stringify(a));site(A2).scene.landmarks=lb;A2.events=others;ok(JSON.stringify(A2)===JSON.stringify(b),'whole dune pack = base minus the three records (no other leaf changed)');
 const txt=JSON.stringify(b);ok(!/"(d15|d16|conservatory)"/.test(txt),'no remaining id references to d15/d16/conservatory in dune pack');
 let bad=0;for(const e of b.events){if(!e.lm)continue;const w=b.worlds.find(x=>x.id===e.world);const s=w&&w.sites.find(x=>x.id===e.site);if(!(s&&s.scene&&s.scene.landmarks.some(l=>l.id===e.lm)))bad++;}
 ok(bad===0,'unresolved lm refs in dune: '+bad);
 for(const t of b.tours||[])for(const st of t.steps||t.stops||[]){const id=typeof st==='string'?st:st.event||st.id;if(id==='d15'||id==='d16'){ok(false,'tour '+t.id+' references removed event');}}
}
console.log(fail?'FAILED '+fail:'ALL PASS');process.exit(fail?1:0);
