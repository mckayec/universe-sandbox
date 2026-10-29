// Source/data-only checks. No DOM, renderer, browser or server is created.
// Usage: node source-checks-r3.cjs /path/to/exact-PR24-checkout
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(process.argv[2]||'.'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const s=read('public/atlas/society.js'),css=read('public/atlas/society.css');let checks=0;
const ok=(c,m)=>{assert.ok(c,m);checks++;};
const pre=s.slice(s.indexOf('const BOOKS='),s.indexOf('/* ---- 10-noise.js ---- */'));
const ctx=vm.createContext({});vm.runInContext(pre+';globalThis.data={BODIES,POIS,byId,poiVisible,poiDesc,bodyF,eraVal,setEraValue:k=>ERA=k};',ctx);
const d=ctx.data;
const gates={mercury:{heliopolis:5,tyche:5,ladon:5,redreach:5,polar:5},venus:{gorgon:4,rath:4,vdocks:6},io:{raaseat:3,garter:6},mars:{olympia:5},phobos:{nucleus:6}};
for(const [body,ps] of Object.entries(gates))for(const [id,first]of Object.entries(ps)){
 const p=d.POIS[body].find(p=>p.id===id);ok(!!p,body+'/'+id+' exists');
 for(let k=1;k<=6;k++){d.setEraValue(k);ok(d.poiVisible(p)===(k>=first),body+'/'+id+' gate '+k);}
}
d.setEraValue(1);
const base={jupiter:'A gas giant of the outer Solar System.',io:'A moon of Jupiter.',europa:'A moon of Jupiter.',ganymede:'A moon of Jupiter.',kalyke:'A small moon of Jupiter.',neptune:'The outermost giant planet of the Solar System.',triton:'A moon of Neptune.',pluto:'A distant world beyond Neptune.',asteroid:'An asteroid in the belt.',rhea:'A moon of Saturn.'};
for(const [id,text]of Object.entries(base)){ok(d.bodyF(d.byId[id],'blurb')===text,id+' neutral blurb');ok(d.bodyF(d.byId[id],'control')==='Not specified for this reading selection',id+' neutral control');}
ok(d.eraVal({6:'secret'})==='', 'future-only era value withheld');
ok(d.POIS.io.find(p=>p.id==='raaseat').desc==='Io’s capital and the seat of House Raa.','final Nesos override');
ok(d.POIS.io.find(p=>p.id==='garter').desc==='A belt of farmland around Io’s equator.','final Garter override');
ok(/\.book\[hidden\]\s*\{\s*display\s*:\s*none\s*\}/.test(css),'Chronicle CSS fix present (not computed layout)');
function pack(id){const c=vm.createContext({window:{}});vm.runInContext(read('public/atlas/packs/'+id+'.js'),c);return c.window.ATLAS_PACKS[id];}
const h=pack('hyperion'),se=pack('sun-eater'),world=id=>h.worlds.find(x=>x.id===id),entry=(p,name)=>p.codex.flatMap(g=>g.list).find(e=>e.name===name);
ok(!world('bressia').blurb.includes('provoked as the Consul later learns'),'Bressia unsupported attribution cut');
ok(!JSON.stringify(world('deneb3')).includes('Jamnu Republic'),'Deneb both clauses cut');
ok(world('hebron').eras[3].blurb.endsWith('In Endymion, Aenea’s party finds it empty.'),'Hebron conservative ending');
ok(!entry(h,'Glennon-Height rebels').more,'rebel cells cut');
ok(!JSON.stringify(entry(h,'Fatline')).includes('Void'),'Fatline mechanism cut');
ok(!/Void|hides the Core/.test(JSON.stringify(entry(h,'Farcasters'))),'Farcasters mechanisms cut');
ok(entry(se,'William XXIII').more.find(x=>x[0]===7)[1]==='William names Hadrian Auctor of the Imperium.','Auctor timing cut');
ok(!se.worlds.some(w=>w.id==='b7c'),'b7c remains absent');
// An isolated control-flow probe of the actual enterSite function, with side effects stubbed.
// Stops at loadSite; it never creates or evaluates a scene or renderer.
const enter=s.slice(s.indexOf('function enterSite('),s.indexOf('function leaveSite('));
const stop=new Error('probe-stop-at-loadSite');const c=vm.createContext({SITES:{asteroid:{name:'Asteroid',body:'asteroid',from:6,landmarks:[]}},ERA:6,mode:'globe',cur:{id:'asteroid'},curSiteKey:null,selLm:null,selEvent:null,hoverSel:null,hideTip(){},stopFx(){},clearPoiLabels(){},siteVisible(key){return c.ERA>=c.SITES[key].from;},fadeTo(a,b,fn){c.pending=fn;},loadSite(key){c.loaded=key;throw stop;}});
vm.runInContext(enter,c);c.enterSite('asteroid');c.ERA=1;try{c.pending();}catch(e){if(e!==stop)throw e;}
ok(c.loaded==='asteroid','known defect reproduced: delayed entry reaches loadSite after downgrade');
// Active effects remain unchanged when changing books within an otherwise eligible scene.
const setEra=s.slice(s.indexOf('function setEra('),s.indexOf('function evListMeta('));
let stopped=0;const e=vm.createContext({ERA:2,bookFilter:1,BOOKS:d.BOOKS||{1:{n:'I',title:'Red Rising'}},mode:'site',curSiteKey:'agea',curSite:{landmarks:[]},selLm:null,fxList:[{name:'ironrain'}],$(){return {};},applyEraTextures(){},renderIndex(){},siteVisible(){return true;},buildSiteLabels(){},stopFx(){stopped++;},leaveSite(){throw Error('unexpected leave');}});
vm.runInContext(setEra,e);e.setEra(1);ok(e.fxList.length===1&&stopped===0,'known defect reproduced: downgrade does not stop active effect');
const lev=s.match(/const LEV_TEXT=("(?:[^"\\]|\\.)*");/);ok(!!lev&&JSON.parse(lev[1]).includes('In Light Bringer'),'known exposed constant: Leviathans banner contains book VI clause');
const latePush=s.match(/S\.landmarks\.push\(\{id:"leviathan"[^\n]+/)[0];
const sceneGate=s.slice(s.indexOf('/* ---------- scene spoiler gates'),s.indexOf('/* ---- 50-fx.js ---- */'));
const late=vm.createContext({SITES:{europa:{landmarks:[]}},LEV_TEXT:JSON.parse(lev[1])});
vm.runInContext(sceneGate+';const S=SITES.europa;'+latePush,late);
const last=late.SITES.europa.landmarks[0];
ok(last.id==='leviathan'&&last.from==null&&d.eraVal(last.desc).includes('Light Bringer'),'known defect reproduced: late-added landmark bypasses earlier gate block');
console.log(JSON.stringify({checks,positive_checks:checks-4,known_defect_probes:4,scope:'source/data only; no rendered or interaction acceptance'},null,2));
