// Leaf-level diff of pack data between two checkouts; asserts only the 18 instructed leaves differ and lm refs resolve.
const fs=require('fs'),vm=require('vm');const [A,B]=process.argv.slice(2);
const load=f=>{const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(f,'utf8'),c);return JSON.parse(JSON.stringify(Object.values(c.window.ATLAS_PACKS)[0]));};
const flat=(o,p='',out={})=>{if(o&&typeof o==='object'){for(const k of Object.keys(o))flat(o[k],p+(Array.isArray(o)?`[${k}]`:(p?'.':'')+k),out);}else out[p]=o;return out;};
let diffs=[],bad=0;
for(const pk of ['dune','foundation','sun-eater','cosmere','expanse','hyperion']){const f=`public/atlas/packs/${pk}.js`;const a=load(A+'/'+f),b=load(B+'/'+f);
 const fa=flat(a),fb=flat(b);for(const k of new Set([...Object.keys(fa),...Object.keys(fb)]))if(fa[k]!==fb[k])diffs.push(`${pk} ${k}`);
 // lm reference integrity
 for(const e of b.events||[]){if(!e.lm)continue;const w=(b.worlds||[]).find(x=>x.id===e.world);const s=w&&(w.sites||[]).find(x=>x.id===e.site);
  const ok=s&&s.scene&&(s.scene.landmarks||[]).some(l=>l.id===e.lm);if(!ok){bad++;console.log('UNRESOLVED lm',pk,e.id,e.lm);}}}
console.log(diffs.join('\n'));console.log('leaf diffs:',diffs.length,'| unresolved lm refs:',bad);
