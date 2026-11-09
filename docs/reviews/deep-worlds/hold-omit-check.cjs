// Hold/dependency omission check (canon-disposition-5bfde31.md): base 5bfde31 vs head.
// Asserts exactly the 14 named top-level targets are removed, every other record/leaf identical,
// no dangling site/landmark/event references, other packs unchanged.
const fs=require('fs'),vm=require('vm');const [A,B]=process.argv.slice(2);
const load=f=>{const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);return JSON.parse(JSON.stringify(Object.values(c.window.ATLAS_PACKS)[0]));};
let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++;};
const W=(p,w)=>p.worlds.find(x=>x.id===w),S=(p,w,s)=>W(p,w).sites.find(x=>x.id===s);
const spec={
 expanse:{events:['b3f','b3o','b3i','b7d'],lms:[['medina','drum',['drumring','engineering']]],sites:[]},
 hyperion:{events:['b1i2','b1n','b2b','b2k','b3b'],lms:[['hyperion','tombs',['sphinx','jade']]],sites:[['hyperion','sphinx']]},
};
let top=0;
for(const pk of ['dune','foundation','sun-eater','cosmere','expanse','hyperion']){
 const a=load(A+'/public/atlas/packs/'+pk+'.js'),b=load(B+'/public/atlas/packs/'+pk+'.js');
 if(!spec[pk]){ok(JSON.stringify(a)===JSON.stringify(b),pk+' unchanged');continue;}
 const sp=spec[pk];
 const ea=a.events.map(e=>e.id),eb=b.events.map(e=>e.id),gone=ea.filter(x=>!eb.includes(x));
 ok(JSON.stringify(gone.slice().sort())===JSON.stringify(sp.events.slice().sort())&&eb.every(x=>ea.includes(x)),pk+' events removed exactly '+sp.events.join(','));
 ok(JSON.stringify(a.events.filter(e=>!sp.events.includes(e.id)))===JSON.stringify(b.events),pk+' remaining events identical in order and content ('+ea.length+' -> '+eb.length+')');
 top+=gone.length;
 const A2=JSON.parse(JSON.stringify(a));A2.events=A2.events.filter(e=>!sp.events.includes(e.id));
 for(const [w,s,ids] of sp.lms){const la=S(a,w,s).scene.landmarks,lb=S(b,w,s).scene.landmarks;
  ok(JSON.stringify(la.filter(l=>!ids.includes(l.id)))===JSON.stringify(lb),pk+' '+w+'/'+s+' landmarks = base minus '+ids.join(',')+' ('+la.length+' -> '+lb.length+')');
  top+=la.length-lb.length;S(A2,w,s).scene.landmarks=S(A2,w,s).scene.landmarks.filter(l=>!ids.includes(l.id));}
 for(const [w,s] of sp.sites){const sa=W(a,w).sites.length,sb=W(b,w).sites.length;ok(!!S(a,w,s)&&!S(b,w,s)&&sb===sa-1,pk+' site '+w+'/'+s+' removed ('+sa+' -> '+sb+' sites; nested '+S(a,w,s).scene.landmarks.map(l=>l.id).join(',')+' go with it)');
  top+=1;W(A2,w).sites=W(A2,w).sites.filter(x=>x.id!==s);}
 ok(JSON.stringify(A2)===JSON.stringify(b),pk+' whole pack = base minus the named records (no other leaf changed)');
 let bad=[];for(const e of b.events){const w=W(b,e.world);if(e.world&&!w&&!(b.worlds.length===0)){bad.push(e.id+':world');continue;}
  if(e.site){const s=w&&w.sites.find(x=>x.id===e.site);if(!s){bad.push(e.id+':site '+e.site);continue;}
   if(e.lm&&!(s.scene&&s.scene.landmarks.some(l=>l.id===e.lm)))bad.push(e.id+':lm '+e.lm);}}
 ok(bad.length===0,pk+' dangling world/site/lm refs: '+(bad.join(' ')||0));
 const txt=JSON.stringify(b);const ev=sp.events.filter(id=>txt.includes('"'+id+'"'));ok(ev.length===0,pk+' no remaining quoted id refs to removed events'+(ev.length?': '+ev:''));
 const allTxt=JSON.stringify(b.tours||[])+JSON.stringify(b.chronicle||[]);ok(!sp.events.some(id=>allTxt.includes('"'+id+'"')),pk+' tours/chronicle contain no removed events');
}
ok(top===14,'unique top-level removal targets '+top+' (expect 14)');
console.log(fail?'FAILED '+fail:'ALL PASS');process.exit(fail?1:0);
