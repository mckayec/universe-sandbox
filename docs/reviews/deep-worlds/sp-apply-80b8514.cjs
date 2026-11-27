// Apply seven-place narrowings with exact expected-before preconditions. Usage: node apply.cjs <root> [--dry]
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=process.argv[2],dry=process.argv.includes('--dry');
const L=JSON.parse(fs.readFileSync(process.env.LEDGER,'utf8'));
const load=src=>{const c={window:{}};vm.createContext(c);vm.runInContext(src,c);return Object.values(c.window.ATLAS_PACKS)[0];};
const get=(o,sel)=>sel.split('.').reduce((a,p)=>{const m=p.match(/^(\w+)(?:\[(\d+)\])?$/);a=a[m[1]];return m[2]!==undefined?a[+m[2]]:a;},o);
const srcs={};let n=0;
for(const r of L.records){ if(!r.proposed_leaf_changes||!r.proposed_leaf_changes.length) continue;
  const f=`public/atlas/packs/${r.pack}.js`; srcs[f]=srcs[f]??fs.readFileSync(path.join(root,f),'utf8');
  const obj=get(load(srcs[f]),r.selector); const idOk=r.identity.endsWith('/'+obj.id); if(!idOk) throw Error(r.review_id+' id mismatch '+obj.id);
  for(const c of r.proposed_leaf_changes){
    if(obj[c.field]!==c.expected_before) throw Error(`${r.review_id} ${c.field} precondition failed: ${JSON.stringify(obj[c.field])}`);
    let s=srcs[f];
    if(c.after==null){ // remove optional key from this object's literal
      const lit=`${c.field}: ${JSON.stringify(c.expected_before)}, `; const idm=`id: "${obj.id}"`;
      const i=s.indexOf(idm); const j=s.indexOf(lit,i); const end=s.indexOf('}',i);
      if(i<0||j<0||j>end) throw Error(r.review_id+' cannot locate '+lit); s=s.slice(0,j)+s.slice(j+lit.length);
    } else {
      const lit=JSON.stringify(c.expected_before); const cnt=s.split(lit).length-1;
      if(cnt!==1) throw Error(`${r.review_id} ${c.field} literal occurrences=${cnt}`);
      s=s.replace(lit,()=>JSON.stringify(c.after));
    }
    srcs[f]=s; const after=get(load(s),r.selector)[c.field];
    if(after!==(c.after==null?undefined:c.after)) throw Error(r.review_id+' post-check failed');
    n++; console.log('OK',r.review_id,r.pack,obj.id,c.field);
  }}
if(!dry) for(const [f,s] of Object.entries(srcs)) fs.writeFileSync(path.join(root,f),s);
console.log('leaves',n,dry?'(dry)':'(written)');
