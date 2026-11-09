const fs=require('fs'),vm=require('vm');
const load=f=>{const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);return Object.values(c.window.ATLAS_PACKS)[0];};
const holds={dune:{lm:[['arrakis','arrakeen','conservatory']],ev:['d15','d16']},expanse:{lm:[['medina','drum','drumring'],['medina','drum','engineering']],ev:['b3f','b3o']},hyperion:{lm:[['hyperion','tombs','sphinx'],['hyperion','tombs','jade']],ev:['b1n','b2b']}};
for(const [p,h] of Object.entries(holds)){const f=`public/atlas/packs/${p}.js`,P=load(f),src=fs.readFileSync(f,'utf8');
 const evs=P.events||[];
 for(const [w,s,l] of h.lm){const W=P.worlds.find(x=>x.id===w),S=W.sites.find(x=>x.id===s),LM=S.scene.landmarks.find(x=>x.id===l);
  const inc=evs.filter(e=>e.world===w&&e.site===s&&e.lm===l).map(e=>`${e.id}(b${e.book}${e.fx?',fx:'+e.fx:''})`);
  const others=S.scene.landmarks.length;
  console.log(`${p} LM ${w}/${s}/${l} books=${JSON.stringify(LM.books||null)} name="${LM.name}" | incoming events: ${inc.join(' ')||'none'} | site landmarks=${others} | other src mentions=${(src.match(new RegExp('"'+l+'"','g'))||[]).length}`);
  console.log('   desc:',LM.desc);}
 for(const id of h.ev){const E=evs.find(e=>e.id===id);const n=(src.match(new RegExp('"'+id+'"','g'))||[]).length;
  const siteEvs=evs.filter(e=>e.world===E.world&&e.site===E.site).length;
  console.log(`${p} EV ${id} b${E.book} ${E.world}/${E.site}/${E.lm||'-'} fx=${E.fx||'-'} title="${E.title}" | src id mentions=${n} | events at site=${siteEvs}`);
  console.log('   text:',E.text);}
 const keys=Object.keys(P).filter(k=>!['worlds','events'].includes(k)); console.log('  pack keys:',keys.join(','));
}
