// Independent structural review of the proposed R1, not a shipped-build or canon test.
// Input: {packs:{<pack>:{head:{content,sha},pr24:{content,sha}}},rows:<parsed 68-row CSV>}.
// Pin head 03394c32816fcb5c95261bf6a9ea4520381a5838 and baseline cf25cda66e91c573c421a0f3712623db72737a3b.
const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert');
const input=JSON.parse(fs.readFileSync(process.argv[2]||__dirname+'/scope-v2-input.json','utf8'));
const loaded={};let hashes=0;
for(const [pk,versions] of Object.entries(input.packs)){
  loaded[pk]={};
  for(const [rev,f] of Object.entries(versions)){
    const b=Buffer.from(f.content),h=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
    assert.equal(h,f.sha);hashes++;
    const ctx={window:{},console};vm.runInNewContext(f.content,ctx,{timeout:2000});
    loaded[pk][rev]=JSON.parse(JSON.stringify(ctx.window.ATLAS_PACKS[pk]));
  }
}
function get(p,id){const [,a,b,c]=id.split('/');if(a==='event')return p.events.find(e=>e.id===b);if(a==='world')return p.worlds.find(w=>w.id===b);if(a==='codex')return p.codex.find(e=>e.id===b);const s=p.worlds.find(w=>w.id===a)?.sites?.find(s=>s.id===b);return c?s?.scene?.landmarks?.find(l=>l.id===c):s;}
const included=input.rows.filter(r=>r.r1_decision.startsWith('include'));
const counts={},checks=[];
for(const r of input.rows){counts[r.r1_decision]=(counts[r.r1_decision]||0)+1;if(!r.r1_decision.startsWith('include'))continue;
 const p=loaded[r.identity.split('/')[0]].head,o=get(p,r.identity),v=o?.[r.field];let ok;
 if(r.op==='set'||r.op==='add-landmark')ok=v===r.accepted_value;
 else if(r.op==='remove')ok=o&&!Object.hasOwn(o,r.field);
 else if(r.op.startsWith('remove-entry:')){const key=r.op.slice(13);ok=Array.isArray(v)&&!v.some(x=>(Array.isArray(x)?x[0]:x.name)===key);}
 else if(r.op==='omit-record')ok=o===undefined;
 else throw Error(r.op);
 assert(ok,r.identity+' '+r.op+' '+r.field);checks.push(r.identity+' '+r.op+' '+r.field);
}
const result=Object.fromEntries(Object.entries(loaded).map(([pk,v])=>[pk,structuredClone(v.pr24)]));let copied=0;
for(const [pk,p] of Object.entries(result))for(const w of p.worlds)for(const s of w.sites||[]){const h=get(loaded[pk].head,`${pk}/${w.id}/${s.id}`);if(h?.scene){s.scene=structuredClone(h.scene);s.scene.landmarks=[];copied++;}}
for(const r of included){const pk=r.identity.split('/')[0],p=result[pk],o=get(p,r.identity);
 if(r.op==='add-landmark'){const parent=r.identity.split('/').slice(0,3).join('/');get(p,parent).scene.landmarks.push(structuredClone(get(loaded[pk].head,r.identity)));}
 else if(r.op==='set')o[r.field]=r.accepted_value;
 else if(r.op==='remove')delete o[r.field];
 else if(r.op.startsWith('remove-entry:')){const k=r.op.slice(13);o[r.field]=o[r.field].filter(x=>(Array.isArray(x)?x[0]:x.name)!==k);}
 else if(r.op==='omit-record'){const [,a,b]=r.identity.split('/');if(a==='event')p.events=p.events.filter(e=>e.id!==b);else{const w=p.worlds.find(w=>w.id===a);w.sites=w.sites.filter(s=>s.id!==b);}}
}
let refs=0,scenes=0,empty=0,lms=0;const unresolved=[],omitted=[];
for(const [pk,p] of Object.entries(result)){
 for(const w of p.worlds)for(const s of w.sites||[])if(s.scene){scenes++;if(!s.scene.landmarks?.length)empty++;lms+=(s.scene.landmarks||[]).length;}
 for(const e of p.events){const w=p.worlds.find(w=>w.id===e.world);assert(w,pk+'/'+e.id+' world');if(e.site){refs++;const s=w.sites?.find(s=>s.id===e.site);assert(s,pk+'/'+e.id+' site');if(e.lm){refs++;assert(s.scene?.landmarks?.some(l=>l.id===e.lm),pk+'/'+e.id+' lm');}}else assert(!e.lm,pk+'/'+e.id+' lm without site');}
}
for(const r of included){const pk=r.identity.split('/')[0];if(r.op==='add-landmark'){const o=get(result[pk],r.identity);unresolved.push({id:r.identity,name:o.name,books:o.books??null,first:o.first??null,copied_keys:Object.keys(o).filter(k=>k!=='desc')});}if(r.op==='omit-record'){assert(!get(result[pk],r.identity));const key=r.identity.split('/').at(-1);let n=0;function scan(v){if(v===key)n++;else if(Array.isArray(v))v.forEach(scan);else if(v&&typeof v==='object')Object.values(v).forEach(scan);}scan(result[pk]);assert.equal(n,0,r.identity);omitted.push(r.identity);}}
const output={target_head:'03394c32816fcb5c95261bf6a9ea4520381a5838',baseline:'cf25cda66e91c573c421a0f3712623db72737a3b',git_blob_hashes:`${hashes}/12`,rows:`${input.rows.length}/68`,unique_operations:new Set(input.rows.map(r=>[r.identity,r.field,r.op].join('|'))).size,decisions:counts,included_head_value_or_absence_checks:`${checks.length}/${included.length}`,included_operations:included.reduce((o,r)=>(o[r.op]=(o[r.op]||0)+1,o),{}),virtual_construction:{copied_scene_objects:copied,final_scenes:scenes,empty_scenes:empty,landmarks:lms,event_references:refs,dangling:0,omissions_absent_and_no_matching_string_values:`${omitted.length}/10`},whole_record_copies_with_unresolved_fields:unresolved,limits:'Independent data/virtual construction only. Whole landmark metadata was copied, not canon-approved. No actual R1 branch, browser, CI, new primary sources or release acceptance.'};
console.log(JSON.stringify(output,null,2));
