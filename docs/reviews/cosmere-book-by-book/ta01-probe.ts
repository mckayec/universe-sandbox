// TA01 first bounded research unit. Node24+: node ta01-probe.ts INPUT_DIR
// INPUT_DIR: exact PR24/37/48 packs as pr24.js/pr37.js/pr48.js plus PR48 engine.js/reading.js.
// No application source is written. Output is repository inventory and in-memory candidate evidence.
import fs from 'node:fs'; import vm from 'node:vm'; import assert from 'node:assert/strict'; import crypto from 'node:crypto'; import path from 'node:path';
const dir=process.argv[2]||'.';
const manifest={"pr24.js":"3ff0aab059fa54e00f6e2ccc7b849d4bd206d958","pr37.js":"5a74e300eaf88b2d3c81fa9bc957584cd4708e33","pr48.js":"0f5f5dd897f959bfa9afe4bb8af04bc95fb38f21","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4"};
for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);}
const engine=fs.readFileSync(path.join(dir,'engine.js'),'utf8'),readingSrc=fs.readFileSync(path.join(dir,'reading.js'),'utf8'),packSrc=fs.readFileSync(path.join(dir,'pr48.js'),'utf8');
const cut=(a:string,b:string)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert.ok(i>=0&&j>i,a);return engine.slice(i,j);};
const J=(x:any)=>JSON.parse(JSON.stringify(x));
type St={mode:'all'|'legacy'|'set'|'none';book?:number;ids?:string[]};
function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set' || st.mode === 'none';
  Object.assign(c, {
    RDG: R,
    RREG: reg,
    RSET: new Set(st.ids || []),
    WORLDS: p.worlds,
    WORLD_BY: Object.fromEntries(p.worlds.map((x: any) => [x.id, x])),
    EVENTS: p.events,
    PW: () => pw,
    CUM: true,
    S: { book: st.mode === 'legacy' ? st.book : 0, realm: 'physical' },
    LY: null,
  });
  const marks: [string, string][] = [
    ['const ARR=', '\n'],
    ['const EFF=', '\n'],
    ['const eraVal=', 'const realmOk='],
    ['const eraKeys=', '\n'],
    ['const filterOk=', '\n'],
    ['const GCACHE=new WeakMap();', '/* intro copy'],
    ['const firstOf=w=>', '\n'],
    ['const evOk=', '\n'],
    ['const realmOk=', '\n'],
    ['const siteEraOk=', '\n'],
    ['const siteSeen=', '\n'],
    ['function rdWorldHidden(', '\n'],
    ['function eraBlurb(', '\n'],
  ];
  for (const [a, b] of marks) vm.runInContext(cut(a, b), c);
  return { c, p };
}

const old='Kenton, son of their leader, is left as the only master after a massacre.';
const replacement='After a massacre of the Sand Masters, Kenton believes himself to be the only survivor.';
assert.equal(packSrc.split(old).length,2);
const candidate=packSrc.replace(old,replacement);
assert.equal(candidate.replace(replacement,old),packSrc,'whole-source reversal');
const {p:base}=setup({mode:'all'}),{p:changed}=setup({mode:'all'},candidate);
const tal=(p:any)=>p.worlds.find((w:any)=>w.id==='taldain');
assert.equal(tal(changed).blurb,tal(base).blurb.replace(old,replacement));
tal(changed).blurb=tal(base).blurb;assert.deepEqual(J(changed),J(base),'whole parsed-pack reversal');
const heads={24:'cf25cda66e91c573c421a0f3712623db72737a3b',37:'03394c32816fcb5c95261bf6a9ea4520381a5838',48:'9a6e54bdf4f33364bc98b9f2482d75e1c5868857'};
function selected(p:any){
 const worlds=p.worlds.filter((w:any)=>w.group==='taldain');
 const records:any[]=[];
 for(const w of worlds){const {gfx,sites,...data}=w;records.push({kind:'world',id:w.id,data,disposition:w.id==='taldain'?'TA01-KENTON-01 changes final blurb sentence only; remainder held':'Held: system astronomy/Investiture source and edition mapping unresolved'});
 for(const s of sites||[]){const {scene,...data}=s;records.push({kind:'site',id:w.id+'/'+s.id,data,disposition:'Held: no fresh scene/map verification; no gate assignment'});
 for(const l of scene?.landmarks||[])records.push({kind:'landmark',id:w.id+'/'+s.id+'/'+l.id,data:l,disposition:'Held: exact material/geometry and earliest source unresolved'});}}
 for(const e of p.events.filter((e:any)=>e.world==='taldain'))records.push({kind:'event',id:e.id,data:e,disposition:'Broad premise corroborated by official synopsis; site attachment and earliest scene not verified; unchanged'});
 for(const g of p.codex)for(const e of g.list||[])if(/taldain|kenton|sand mastery|sand masters|khriss|dayside|darkside/i.test(JSON.stringify(e)))records.push({kind:'codex',id:g.id+'/'+e.name,data:e,disposition:'Cross-work hold: TA01 promo does not verify later avatars, worldhopping/essay identity, or gates'});
 return records;
}
const inventory=[24,37,48].map(n=>{
 const c:any={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dir,'pr'+n+'.js'),'utf8'),c);const p=c.window.ATLAS_PACKS.cosmere;
 assert.ok(tal(p).blurb.endsWith(old));const records=selected(p);const keywordHits:any[]=[];
 function scan(x:any,at:string){if(typeof x==='string'&&/taldain|kenton|sand mastery|sand masters|khriss|dayside|darkside|white sand/i.test(x))keywordHits.push({path:at,text:x});else if(x&&typeof x==='object')for(const k of Object.keys(x))scan(x[k],at+'.'+k);}
 scan(p,'pack');
 return {pr:n,head:heads[n],recordCount:records.length,records,whiteSandRegistry:p.spoilers.works?.filter((w:any)=>w.id.startsWith('white-sand'))||[],keywordHits,scope:'Selected records plus full-pack keyword hits, not a complete primary-work claim inventory. Graphics/geography are held, not verified.'};
});
const all=base.spoilers.works.map((w:any)=>w.id),bucket7=base.spoilers.works.filter((w:any)=>w.bucket===7).map((w:any)=>w.id),ws=all.filter((id:string)=>id.startsWith('white-sand'));
const states:[string,St][]=[['All',{mode:'all'}],['legacy6',{mode:'legacy',book:6}],['legacy7',{mode:'legacy',book:7}],['legacy12',{mode:'legacy',book:12}],['none',{mode:'none'}],...ws.map((id:string)=>[id+' only',{mode:'set',ids:[id]}] as [string,St]),['original three volumes',{mode:'set',ids:ws.filter((id:string)=>id!=='white-sand-omnibus')}],['all White Sand entries',{mode:'set',ids:ws}],['system essays only',{mode:'set',ids:['arcanum-unbounded-system-essays-and-maps']}],['bucket7',{mode:'set',ids:bucket7}],['bucket7 minus omnibus',{mode:'set',ids:bucket7.filter((id:string)=>id!=='white-sand-omnibus')}],['all works minus White Sand',{mode:'set',ids:all.filter((id:string)=>!ws.includes(id))}],['all works',{mode:'set',ids:all}]];
function observe(st:St,src:string){const {c}=setup(st,src);return J(vm.runInContext(`(()=>{const w=WORLD_BY.taldain,hidden=rdWorldHidden(w);return {worldHidden:!!hidden,blurb:hidden?null:eraBlurb(w),facts:hidden?null:eraVal(w,'facts'),events:EVENTS.map(e=>[e.id,!!evOk(e),eText(e)]),sites:(w.sites||[]).map(s=>[s.id,!!siteSeen(s),sDesc(s)])};})()`,c));}
const rows=states.map(([label,state])=>{const before=observe(state,packSrc),after=observe(state,candidate);
 assert.equal(before.worldHidden,after.worldHidden,label);assert.deepEqual(before.events,after.events,label);assert.deepEqual(before.sites,after.sites,label);assert.deepEqual(before.facts,after.facts,label);
 assert.equal(after.blurb,before.blurb===null?null:before.blurb.replace(old,replacement),label);
 const oldExposed=before.blurb?.includes(old)||false,newExposed=after.blurb?.includes(replacement)||false;
 assert.equal(oldExposed,newExposed,label);assert.ok(!after.blurb?.includes(old),label);
 return {label,state,worldHidden:before.worldHidden,oldExposed,newExposed,eventCount:before.events.length,siteCount:before.sites.length};
});
for(const label of ['All','legacy7','legacy12','bucket7','all works'])assert.ok(rows.find(r=>r.label===label)?.oldExposed,label+' negative control');
for(const label of ['none','white-sand-volume-1 only','white-sand-omnibus only','original three volumes','all White Sand entries','bucket7 minus omnibus'])assert.ok(rows.find(r=>r.label===label)?.worldHidden,label+' existing fallback retained');
console.log(JSON.stringify({date:'2026-11-20',finding:'TA01-KENTON-01',inputBlobs:manifest,hashesVerified:5,sourceReplacementCount:1,sourceReversal:true,parsedPackReversal:true,inventory,selectorEvidence:{states:rows.length,eventComparisons:rows.reduce((n,r)=>n+r.eventCount,0),siteComparisons:rows.reduce((n,r)=>n+r.siteCount,0),exposedStates:rows.filter(r=>r.oldExposed).length,renderedCases:0,rows}},null,2));
