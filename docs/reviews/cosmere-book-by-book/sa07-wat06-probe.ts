// Research candidate only; Node24+: node sa07-wat06-probe.ts INPUT_DIR. No application files are written.
import fs from 'node:fs'; import vm from 'node:vm'; import assert from 'node:assert/strict'; import crypto from 'node:crypto'; import path from 'node:path';
const dir=process.argv[2]||'.';
const manifest={"head.js":"92680a69eafaea2877851db4872b58006c9a46ea","engine.js":"0bc5357a2043f3939512bc5b091eb4ffbbf1c5d0","reading.js":"4d9bc177294e5e33accf6f19825ef467f0bb90d4"};
for(const [n,sha] of Object.entries(manifest)){const b=fs.readFileSync(path.join(dir,n));assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,n);}
const engine=fs.readFileSync(path.join(dir,'engine.js'),'utf8'); const readingSrc=fs.readFileSync(path.join(dir,'reading.js'),'utf8');const packSrc=fs.readFileSync(path.join(dir,'head.js'),'utf8');
const cut=(a:string,b:string)=>{const i=engine.indexOf(a),j=engine.indexOf(b,i);assert.ok(i>=0&&j>i,a);return engine.slice(i,j);};
const J=(x:unknown)=>JSON.parse(JSON.stringify(x));
const WOK = 'the-way-of-kings';
const WOR = 'words-of-radiance';
const ROW = 'rhythm-of-war';
const WAT = 'wind-and-truth';
type St = { mode: 'set' | 'legacy' | 'all'; ids?: string[]; book?: number };

function setup(st: St, src = packSrc) {
  const c: any = { window: {}, Set, Map, WeakMap, URLSearchParams };
  vm.createContext(c);
  vm.runInContext(readingSrc, c);
  vm.runInContext(src, c);
  const p = c.window.ATLAS_PACKS.cosmere;
  const R = c.window.AtlasReading;
  const reg = R.normRegistry(p);
  assert.ok(reg.ok, 'registry valid');
  const pw = st.mode === 'set';
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
  ];
  for (const [a, b] of marks) vm.runInContext(cut(a, b), c);
  return { c, p };
}

const {p:base}=setup({mode:'all'});
const moonOld='Salas, Nomon, Mishim (a fourth broke up long ago)'; const moonNew='Salas, Nomon, Mishim';
const poolOld='A crater lake in the Horneater Peaks: Roshar’s stable doorway into Shadesmar and the usual way worldhoppers arrive. It vanished when Cultivation left in Wind and Truth.';
const poolNew='A crater lake in the Horneater Peaks: Roshar’s stable doorway into Shadesmar and the usual way worldhoppers arrive.';
let candidate=packSrc;for(const [old,now] of [[moonOld,moonNew],[poolOld,poolNew]]){assert.equal(candidate.split(old).length,2);candidate=candidate.replace(old,now);}
const {p:changed}=setup({mode:'all'},candidate);
const get=(p:any)=>{const w=p.worlds.find((w:any)=>w.id==='roshar');return {w,pool:w.sites.find((s:any)=>s.id==='pool'),moon:w.facts.find((f:any)=>f[0]==='Moons')};};
const a=get(changed),b=get(base);assert.equal(a.moon[1],moonNew);assert.equal(a.pool.desc,poolNew);
a.moon[1]=b.moon[1];a.pool.desc=b.pool.desc;assert.deepEqual(J(changed),J(base));
const all=base.spoilers.works.map((w:any)=>w.id);const bucket=(k:number)=>base.spoilers.works.filter((w:any)=>w.bucket===k).map((w:any)=>w.id);
const states:[string,St][]=[['All',{mode:'all'}],...([4,9,11,12].map(book=>['legacy'+book,{mode:'legacy',book}] as [string,St])),['empty',{mode:'set',ids:[]}],['WoK only',{mode:'set',ids:[WOK]}],['WaT only',{mode:'set',ids:[WAT]}],['RoW only',{mode:'set',ids:[ROW]}],['bucket4',{mode:'set',ids:bucket(4)}],['bucket9',{mode:'set',ids:bucket(9)}],['buckets4+9',{mode:'set',ids:[...bucket(4),...bucket(9)]}],['all minus WaT',{mode:'set',ids:all.filter((id:string)=>id!==WAT)}],['all works',{mode:'set',ids:all}]];
function observe(st:St,src:string){const {c}=setup(st,src);return J(vm.runInContext(`(()=>{const w=WORLD_BY.roshar,s=w.sites.find(x=>x.id==='pool'),hidden=rdWorldHidden(w);return {worldHidden:!!hidden,poolSeen:!hidden&&!!siteSeen(s),facts:hidden?null:eraVal(w,'facts'),poolText:!hidden&&siteSeen(s)?sDesc(s):null,events:EVENTS.map(e=>[e.id,!!evOk(e)]),sites:w.sites.map(s=>[s.id,!!siteSeen(s)])};})()`,c));}
const rows=states.map(([label,st])=>{const old=observe(st,packSrc),now=observe(st,candidate);assert.deepEqual(old.events,now.events,label);assert.deepEqual(old.sites,now.sites,label);assert.equal(old.worldHidden,now.worldHidden,label);assert.equal(old.poolSeen,now.poolSeen,label);if(now.facts){assert.equal(now.facts.find((f:any)=>f[0]==='Moons')[1],moonNew);assert.deepEqual(now.facts,old.facts.map((f:any)=>f[0]==='Moons'?['Moons',moonNew]:f));}if(now.poolText!==null)assert.equal(now.poolText,poolNew);assert.ok(!JSON.stringify(now).includes('fourth broke up'));assert.ok(!JSON.stringify(now).includes('Cultivation left'));
return {label,state:st,worldHidden:old.worldHidden,poolSeen:old.poolSeen,oldMoonExposed:!!old.facts?.some((f:any)=>f[1]===moonOld),oldDepartureExposed:old.poolText===poolOld,newMoonExposed:false,newDepartureExposed:false,eventCount:old.events.length,siteCount:old.sites.length};});
for(const label of ['legacy4','legacy9','all minus WaT']){const row=rows.find(r=>r.label===label)!;assert.ok(row.oldMoonExposed,label+' old negative');if(label!=='legacy4')assert.ok(row.oldDepartureExposed,label+' old negative');}
console.log(JSON.stringify({head:'36bbde8d6d0d188c04db1ea6c70c37623e7f2867',inputBlobs:manifest,scope:'Two in-memory omissions; actual source selectors, not rendered browser evidence',assignments:2,parsedPackReversal:true,states:rows.length,eventComparisons:rows.reduce((n,r)=>n+r.eventCount,0),siteComparisons:rows.reduce((n,r)=>n+r.siteCount,0),renderedCases:0,rows},null,2));
