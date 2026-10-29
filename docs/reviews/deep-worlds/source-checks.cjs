// Source-only characterization; no DOM, browser, renderer or server.
// node source-checks.cjs /path/to/f778b6b-checkout
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = process.argv[2], read = p => fs.readFileSync(path.join(root, p), 'utf8');
const s = read('public/atlas/society.js');
const era = s.slice(s.indexOf('function eraVal('), s.indexOf('function bodyF('));
const lev = s.slice(s.indexOf('const LEV_BASE='), s.indexOf('let levLbl=null'));
const c = vm.createContext({ERA:1}); vm.runInContext(era + lev + ';globalThis.value=()=>eraVal(LEV_TEXT);', c);
for(let k=1;k<=6;k++){c.ERA=k;assert.equal(c.value().includes('In Light Bringer'),k===6);}
assert.ok(s.includes('showBanner("Leviathans",eraVal(LEV_TEXT)'));
assert.ok(s.includes('id:"leviathan",name:"Leviathans",pos:[300,160,-3300],desc:LEV_TEXT'));
const stop=new Error('stop-before-scene');
const e=vm.createContext({SITES:{asteroid:{name:'Asteroid',body:'asteroid',from:6,landmarks:[]}},ERA:6,mode:'globe',cur:{id:'asteroid'},hoverSel:null,hideTip(){},stopFx(){},clearPoiLabels(){},siteVisible(key){return e.ERA>=e.SITES[key].from;},fadeTo(a,b,fn){e.pending=fn;},loadSite(key){e.loaded=key;throw stop;}});
vm.runInContext(s.slice(s.indexOf('function enterSite('),s.indexOf('function leaveSite(')),e);
e.enterSite('asteroid');e.ERA=1;try{e.pending();}catch(err){if(err!==stop)throw err;}assert.equal(e.loaded,'asteroid');
let stopped=0;const f=vm.createContext({ERA:2,bookFilter:1,BOOKS:{1:{n:'I',title:'Red Rising'}},mode:'site',curSiteKey:'agea',curSite:{landmarks:[]},selLm:null,fxList:[{name:'ironrain'}],$(){return {};},applyEraTextures(){},renderIndex(){},siteVisible(){return true;},buildSiteLabels(){},setModeLabels(){},stopFx(){stopped++;},leaveSite(){throw Error('unexpected leave');}});
vm.runInContext(s.slice(s.indexOf('function setEra('),s.indexOf('function evListMeta(')),f);f.setEra(1);assert.equal(f.fxList.length,1);assert.equal(stopped,0);
const h={window:{}};vm.runInNewContext(read('public/atlas/packs/hyperion.js'),h);assert.ok(h.window.ATLAS_PACKS.hyperion.worlds.find(w=>w.id==='bressia').blurb.includes('killed his wife and son'));
console.log('Europa: 6 era checks and 2 consumer-source checks pass. Known defects: delayed entry, retained effect, orphan pronoun reproduced. No rendered acceptance.');
