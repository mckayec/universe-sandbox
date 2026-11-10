// Independent DWO-S1 source/VM review. No renderer or browser execution.
// node review-probe.cjs <engine.js> <hyperion.js>
const fs = require('node:fs'), vm = require('node:vm'), crypto = require('node:crypto');
const source = fs.readFileSync(process.argv[2], 'utf8');
const packSource = fs.readFileSync(process.argv[3], 'utf8');
const hash = s => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex');
console.log('engine blob', hash(source)); console.log('hyperion blob', hash(packSource));
const pc = {window:{}}; vm.runInNewContext(packSource, pc);
const pack = pc.window.ATLAS_PACKS.hyperion;
function slice(a,b){const i=source.indexOf(a),j=source.indexOf(b,i+a.length);if(i<0||j<0)throw Error('Missing slice '+a);return source.slice(i,j);}
const selected = [
 slice('const firstOf=', '/* optional book gating'),
 slice('const worldBookOk=', 'const evFor='),
 slice('const SURF={};', 'function canEnter('),
 slice('function selectSiteLater(', '/* ===================== PLACES:'),
 slice('function urlFor(', 'function parseHash('),
 slice('function syncURL(', '/* nothing is written')
].join('\n');
let total=0, passed=0;
function test(name, fn){total++;try{if(!fn())throw Error('assertion false');passed++;console.log('PASS '+name);}catch(e){console.log('FAIL '+name+' | '+e.message);}}
function setup(){
 const world=JSON.parse(JSON.stringify(pack.worlds.find(w=>w.id==='hyperion')));
 const ctx={URLSearchParams, console, S:{book:1,sel:'hyperion',site:'tombs',lm:null,view:'world',realm:'physical'}, WORLD_BY:{hyperion:world}, CUM:true,
  placeGen:0,MOB:true,dosCollapsed:true,PL:null,SITE_EL:[],LY:null,TRV:null,urlReady:true,
  location:{pathname:'/atlas/',search:'?pack=hyperion',hash:''},history:{state:{atlasSurface:true}},timers:[],rendered:[]};
 ctx.setTimeout=f=>ctx.timers.push(f);
 ctx.history.replaceState=(state,title,url)=>{ctx.history.state=state;ctx.url=url;};
 ctx.renderDossier=()=>vm.runInContext('asVisible(()=>rendered.push(JSON.stringify(S)))',ctx);
 ctx.renderCrumbs=()=>{};
 vm.createContext(ctx);vm.runInContext(selected,ctx);
 ctx.run=code=>vm.runInContext(code,ctx);return ctx;
}
const c=setup();
test('actual pack removed Sphinx; Tombs survives',()=>!c.WORLD_BY.hyperion.sites.some(s=>s.id==='sphinx')&&!!c.WORLD_BY.hyperion.sites.find(s=>s.id==='tombs'));
for(const view of ['world','place']){
 test('missing site sanitized in '+view,()=>{const x=c.hideUnseen({sel:'hyperion',site:'sphinx',lm:'old',view});return x.sel==='hyperion'&&x.site===null&&x.lm===null&&x.view==='world';});
 test('missing site and landmark absent from URL '+view,()=>{const u=c.urlFor({site:'sphinx',lm:'old',view});return !/[&#](site|lm)=/.test(u)&&u.includes('view=surface')&&!u.includes('view=place');});
}
test('valid Tombs state and place URL preserved',()=>{const x=c.hideUnseen({sel:'hyperion',site:'tombs',lm:'obelisk',view:'place'});const u=c.urlFor(x);return x.site==='tombs'&&x.lm==='obelisk'&&x.view==='place'&&u.includes('site=tombs')&&u.includes('lm=obelisk');});
test('synthetic __surface remains supported',()=>{const x=c.hideUnseen({sel:'hyperion',site:'__surface',lm:null,view:'place'});return x.site==='__surface'&&x.view==='place';});
test('existing future site still hidden below its book',()=>{c.WORLD_BY.hyperion.sites.push({id:'future-test',books:[2]});const x=c.hideUnseen({sel:'hyperion',site:'future-test',lm:'x',view:'place'});return x.site===null&&x.lm===null&&x.view==='world';});
test('existing future site visible at its book',()=>{c.S.book=2;const x=c.hideUnseen({sel:'hyperion',site:'future-test',lm:'x',view:'place'});c.S.book=1;return x.site==='future-test'&&x.view==='place';});
test('world below first book still clears all selection',()=>{c.WORLD_BY.later={id:'later',first:3,sites:[]};const x=c.hideUnseen({sel:'later',site:'bad',lm:'x',view:'place'});return x.sel===null&&x.site===null&&x.lm===null&&x.view==='galaxy';});
test('missing site sanitized in All mode',()=>{c.S.book=0;const x=c.hideUnseen({sel:'hyperion',site:'sphinx',lm:'x',view:'place'});c.S.book=1;return x.site===null&&x.view==='world';});
test('missing site sanitized outside cumulative mode',()=>{c.CUM=false;const x=c.hideUnseen({sel:'hyperion',site:'sphinx',lm:'x',view:'place'});c.CUM=true;return x.site===null&&x.view==='world';});
test('selHidden detects removed site',()=>{c.S.site='sphinx';return c.selHidden();});
test('asVisible hides removed site during presentation then restores live state',()=>{c.S.site='sphinx';c.S.lm='old';c.S.view='place';const x=c.asVisible(()=>({...c.S}));return x.site===null&&x.lm===null&&x.view==='world'&&c.S.site==='sphinx'&&c.S.view==='place';});
test('asVisible restores state after throwing renderer',()=>{try{c.asVisible(()=>{throw Error('renderer');});}catch(e){return c.S.site==='sphinx'&&c.S.lm==='old'&&c.S.view==='place';}return false;});
test('direct selectSite invalid clears state and URL and advances generation',()=>{c.S.view='world';c.S.lm=null;const n=c.placeGen;c.selectSite('no-such-site');return c.S.site===null&&c.placeGen===n+1&&!c.url.includes('site=')&&JSON.parse(c.rendered.at(-1)).site===null&&c.dosCollapsed===true;});
test('direct selectSite valid preserves state and URL and opens sheet',()=>{c.selectSite('tombs');return c.S.site==='tombs'&&c.url.includes('site=tombs')&&c.dosCollapsed===false;});
test('selectSite null remains clear',()=>{c.selectSite(null);return c.S.site===null&&!c.url.includes('site=');});
test('selectSite __surface stays valid',()=>{c.selectSite('__surface');return c.S.site==='__surface'&&c.url.includes('site=__surface');});
test('delayed removed-site selection clears state and URL',()=>{c.selectSiteLater('hyperion','sphinx',100);c.timers.pop()();return c.S.site===null&&!c.url.includes('site=');});
test('new selection cancels stale delayed selection',()=>{c.selectSiteLater('hyperion','sphinx',100);c.selectSite('tombs');c.timers.pop()();return c.S.site==='tombs'&&c.url.includes('site=tombs');});
test('world switch cancels stale delayed selection',()=>{c.selectSiteLater('hyperion','sphinx',100);c.S.sel='later';c.S.site=null;c.timers.pop()();return c.S.sel==='later'&&c.S.site===null;});
test('no selected world retains prior selectSite semantics',()=>{c.S.sel=null;c.selectSite('no-such-site');return c.S.site==='no-such-site';});
console.log(`RESULT ${passed}/${total} PASS, ${total-passed}/${total} FAIL`);
process.exitCode=passed===total?0:1;
