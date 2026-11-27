// Independent, isolated host-transaction probe. No browser/DOM coverage claimed.
// Run: node chapter-history-probe.cjs /path/to/exact-head-checkout
// Source bodies are extracted unchanged; rendering and timeline view are test doubles.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = process.argv[2] || __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const engine = read('public/atlas/engine.js');
const timeline = read('public/atlas/timeline.js');
const blob = s => crypto.createHash('sha1').update('blob ' + Buffer.byteLength(s) + '\0').update(s).digest('hex');
assert.equal(blob(engine), '56d47d017dbf4a13b19a49a0d4a888a39863c819');
assert.equal(blob(timeline), 'a16d2a10d7ccee44fd15674f745c8617cdfdd65c');
function between(a, b) {
  const start = engine.indexOf(a), end = engine.indexOf(b, start);
  assert.ok(start >= 0 && end > start, 'source markers exist: ' + a);
  return engine.slice(start, end);
}
const source = [
  between('let tlWasOpen=false,tlFromHistory=false;', '/* ===================== CHAPTER SELECTOR'),
  between('function chapterPosOf(', 'if(TLV)$("#tlBtn")'),
  between('function refreshAll(){', '/* the realm a world'),
  between('function urlFor(o){', 'function restoreFromURL(){')
].join('\n');
const cases = [
  {name:'control: unchanged chapter restores selection', from:3, to:3, open:true, sel:'record-b', expectedOpen:true, expectedSel:'record-b'},
  {name:'changed chapter restores selection', from:2, to:3, open:true, sel:'record-b', expectedOpen:true, expectedSel:'record-b'},
  {name:'control: unchanged chapter opens timeline', from:3, to:3, open:false, sel:'record-b', expectedOpen:true, expectedSel:'record-b'},
  {name:'changed chapter opens timeline', from:2, to:3, open:false, sel:'record-b', expectedOpen:true, expectedSel:'record-b'},
  {name:'changed chapter closes timeline', from:2, to:3, open:true, close:true, expectedOpen:false, expectedSel:null}
];
let passed=0;
for (const test of cases) {
  const location = {pathname:'/atlas/',search:'',hash:'#book=1&ch='+test.to+(test.close?'':'&tl=1&tlsel='+test.sel)};
  const incoming = location.hash, writes=[], restores=[], listeners={};
  const context = {
    window:{}, URLSearchParams, console, location,
    S:{book:1,chapter:test.from,sel:null,site:null,realm:'physical',view:'galaxy'},
    BOOKS:{1:{title:'Fixture',chapters:6}}, CUM:true, WORLD_BY:{}, LY:null, TRV:null,
    $:()=>null, storeBook:()=>{},
    addEventListener:(name,fn)=>listeners[name]=fn,
    history:{state:null,replaceState:(state,title,url)=>{writes.push(url);location.hash=url.includes('#')?'#'+url.split('#')[1]:'';}},
    TLV:{open:test.open,sel:null,laneParams:{tl:'1'},refresh:()=>{},
      restore(hash){restores.push(hash);const q=new URLSearchParams(hash.replace(/^#/,''));this.open=q.has('tl');this.sel=q.get('tlsel');},
      close(){this.open=false;this.sel=null;}}
  };
  for(const name of ['renderRealmBar','renderFilters','renderIndex','renderDossier','renderChron','renderCrumbs','renderLegend','applyBookToScene'])context[name]=()=>{};
  vm.createContext(context);
  vm.runInContext(timeline, context);
  vm.runInContext(source+'\nurlReady=true;lastBook=S.book;',context);
  listeners.popstate();
  const ok=context.S.chapter===test.to && context.TLV.open===test.expectedOpen && context.TLV.sel===test.expectedSel;
  if(ok)passed++;
  console.log(JSON.stringify({name:test.name,pass:ok,incoming,chapter:context.S.chapter,open:context.TLV.open,selection:context.TLV.sel,hash:location.hash,writes,restores}));
}
console.log(`${passed}/${cases.length} behavioural expectations pass (2 controls; 3 changed-chapter cases).`);
process.exitCode=passed===cases.length?0:1;
