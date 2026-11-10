import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root=process.env.COS_REVIEW_ROOT||'.';
const engine=fs.readFileSync(root+'/public/atlas/engine.js','utf8');
const reading=fs.readFileSync(root+'/public/atlas/reading.js','utf8');
const cut=(a,b)=>engine.slice(engine.indexOf(a),engine.indexOf(b,engine.indexOf(a)));
const c={window:{},URLSearchParams,Set,Map,WeakMap}; vm.createContext(c);vm.runInContext(reading,c);
const R=c.window.AtlasReading;
const reg=R.normRegistry({spoilers:{works:[{id:'a',title:'A',bucket:1},{id:'b',title:'B',bucket:2}]}});
const results=[];
const record=(id,observed,expected)=>results.push({id,observed,expected,pass:JSON.stringify(observed)===JSON.stringify(expected)});
// Actual helper + actual engine rdParams/storeRd. A deliberate empty choice must not retain a prior positive link.
c.RDG=R;c.RREG=reg;c.RD_KEY='test';c.lastRd=null;c.S={rd:{mode:'set',ids:['a']}};c.location={hash:'#read=a'};
let stored=R.storeValue(c.S.rd);c.localStorage={setItem:(_,v)=>stored=v};
vm.runInContext(cut('function rdParams(q)','const RD_KEY='),c);
vm.runInContext(cut('function storeRd()','function readStored('),c);
c.S.rd=R.toggleWork(c.S.rd,'a',reg);c.q=new URLSearchParams();vm.runInContext('rdParams(q);storeRd();',c);
const reloaded=R.initialState('#'+c.q,stored,null,reg,2).state;
record('EMPTY-selection-reload',{before:c.S.rd.mode,url:String(c.q),reload:reloaded.mode,ids:reloaded.ids},{before:'safe',url:'read=a',reload:'set',ids:['a']});
// Actual era selectors. Parent field gate and child field gate both require B; only A is read.
c.RSET=new Set(['a']);c.PW=()=>true;c.CUM=true;c.EFF=()=>99;c.S.book=0;
c.w={id:'world',gate:{req:'a'},blurb:'base',gates:{blurb:{req:'b'},facts:{req:'b'}},eras:{1:{gate:{req:'a'},blurb:'SECRET-ERA',facts:['SECRET-FACT'],gates:{blurb:{req:'b'},facts:{req:'b'}}},2:{gate:{req:'b'},gfx:{map:'SECRET-MAP'}}}};
c.WORLD_BY={world:c.w};c.worldChain=w=>[R.compileGate(w.gate,reg)];
c.pvis=ch=>R.visible(ch,c.RSET);c.gateOf=o=>R.compileGate(o.gate,reg);
c.fOk=(o,f,ch)=>R.visible(ch.concat([R.fieldGate(o,f,reg)]),c.RSET);
c.reach=k=>R.visible([R.recordGate({book:k},reg)],c.RSET);
c.eraKeys=w=>Object.keys(w.eras).map(Number);
vm.runInContext(cut('function eraOn(w,k)','/* intro copy'),c);
vm.runInContext(cut('const eraAt=','function gatePW('),c);
vm.runInContext(cut('const eraVal=','const realmOk='),c);
vm.runInContext(cut('function eraBlurb(w)','/* Track A details'),c);
record('ERA-field-gates',vm.runInContext('({blurb:eraBlurb(w),facts:eraVal(w,"facts")})',c),{blurb:'SECRET-ERA',facts:['SECRET-FACT']});
// Actual descend + transition callbacks; stop at buildPlanet to avoid pretending to render.
for(const narrowed of [false,true]){
 let pending=[],hidden=false,built=[];
 const d={WORLD_BY:{w:{id:'w',pos:{}}},RGEN:0,S:{view:'galaxy',book:0},MOB:false,urlReady:false,
 rdWorldHidden:()=>hidden,rdNotRevealed:()=>{},syncURL:()=>{},noSurface:()=>false,needRealm:()=>null,
 transition:fn=>pending.push(fn),hideTip:()=>{},$:()=>({hidden:true,querySelector:()=>({style:{}})}),
 gfxFor:()=>({}),orbW:{t:{set(){}},gt:{set(){}}},fitDist:()=>1,
 buildPlanet:w=>{built.push(w.id);throw new Error('STOP_AT_BUILD');},EARTH_TEX:null};
 vm.createContext(d);vm.runInContext(cut('function descend(id,fromHistory)','/* Back from the surface.'),d);
 vm.runInContext('descend("w")',d);if(narrowed){hidden=true;d.RGEN++;d.S.sel=null;}
 try{pending[0]();}catch(e){if(e.message!=='STOP_AT_BUILD')throw e;}
 record('PENDING-descend-'+(narrowed?'narrowed':'control'),{built,view:d.S.view},{built:['w'],view:'world'});
}
assert.equal(results.filter(r=>r.pass).length,4);
console.log(JSON.stringify({head:'1e588f0c5bdab5f8775f20481e07b57cb3b5c318',scope:'actual extracted functions with state/DOM/render adapters; not browser',reproductions:results},null,2));
