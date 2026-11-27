// Isolated actual-source transaction controls, PR45 daeaf395 vs parent1ceb4b2.
// Engine snippets are pinned below. parseHash, refresh/rendering, timeline and history transport are test doubles.
// Synthetic records are not canon. This is NOT a browser test.
const assert=require('node:assert/strict'),vm=require('node:vm');
const head="const sameLayers=(a,b)=>a===b||!!(a&&b&&a.size===b.size&&[...a].every(x=>b.has(x)));\nconst sameRange=(a,b)=>a===b||!!(a&&b&&a[0]===b[0]&&a[1]===b[1]);\nfunction filtersFromURL(st){if(!LY)return;const f=st.filters||{};\n  const a=f.active!==undefined?f.active:null,r=f.range!==undefined?f.range:null;\n  if(sameLayers(a,S.layers)&&sameRange(r,S.range))return;\n  S.layers=a;S.range=r;\n  if(S.sel&&!seen(WORLD_BY[S.sel])){\n    if(S.view!==\"world\")S.sel=null;\n    else if(!st.surface){const prev=afterAscend;afterAscend=()=>{S.sel=null;if(prev)prev();else refreshAll();};}}\n  if(S.view===\"world\"&&S.sel){const w=WORLD_BY[S.sel];if(S.site){const x=(w.sites||[]).find(y=>y.id===S.site);if(x&&!siteSeen(x))S.site=null;}buildSiteLabels(w);}\n  if(S.ev&&EV_BY[S.ev]&&!filterOk(EV_BY[S.ev]))S.ev=null;\n  refreshAll();}\n\naddEventListener(\"popstate\",()=>{const st=parseHash(),incoming=location.hash;\n  urlHold=true;try{chapterFromURL(st);filtersFromURL(st);tlFromURL(incoming);}finally{urlHold=false;}syncURL();\n  if(S.view===\"world\"&&!st.surface){const a=afterAscend;afterAscend=null;doAscend(a);}\n  else if(S.view===\"galaxy\"&&st.surface&&st.world)descend(st.world,true);});\n";
const parent="addEventListener(\"popstate\",()=>{const st=parseHash(),incoming=location.hash;\n  urlHold=true;try{chapterFromURL(st);tlFromURL(incoming);}finally{urlHold=false;}syncURL();\n  if(S.view===\"world\"&&!st.surface){const a=afterAscend;afterAscend=null;doAscend(a);}\n  else if(S.view===\"galaxy\"&&st.surface&&st.world)descend(st.world,true);});\n";
const chapter="function chapterFromURL(st){if(!S.book||st.book!==S.book)return;const c=chapterPosOf(S.book,st.ch);if(c!==S.chapter){S.chapter=c;refreshAll();}}\n";
const cases=[
 ['layer downgrade removes selection',{layers:null,chapter:5},{active:['chr']},5,'K',s=>s.layers?.has('chr')&&s.selection===null],
 ['omitted layers restores all',{layers:['chr'],chapter:5},{},5,'K',s=>s.layers===null&&s.selection==='K'],
 ['year range restored',{layers:null,chapter:5},{range:[-100,100]},5,null,s=>JSON.stringify(s.range)==='[-100,100]'],
 ['omitted year resets range',{layers:null,range:[1,100],chapter:5},{},5,null,s=>s.range===null],
 ['equal sets and range avoid refresh',{layers:['jud'],range:[1,100],chapter:5},{active:['jud'],range:[1,100]},5,null,s=>s.refreshes===0],
 ['hidden event cleared',{layers:null,chapter:5,ev:'e'},{active:['chr']},5,null,s=>s.ev===null],
 ['hidden galaxy world cleared',{layers:null,chapter:5,sel:'w'},{active:['chr']},5,null,s=>s.sel===null],
 ['chapter and layers apply before timeline',{layers:['chr'],chapter:5},{active:['jud']},2,'K',s=>s.layers?.has('jud')&&s.chapter===2&&s.selection===null],
];
function run(src,c){
 const [name,init,f,ch,requested,verify]=c;
 const S={view:'galaxy',book:1,range:null,sel:null,site:null,ev:null,...init,layers:init.layers?new Set(init.layers):null,refreshes:0};
 const input={book:1,ch:String(ch),surface:false,filters:{...f}};
 if(input.filters.active)input.filters.active=new Set(input.filters.active);
 const ctx={S,LY:{},WORLD_BY:{w:{id:'w'}},EV_BY:{e:{}},location:{hash:'#incoming'},input,requested,Set,URLSearchParams,afterAscend:null};
 vm.createContext(ctx);
 vm.runInContext(`
 let urlHold=false;let writes=0;let callback;
 const parseHash=()=>input;
 const chapterPosOf=(book,v)=>+v;
 const seen=()=>!S.layers||S.layers.has('jud');
 const siteSeen=seen,filterOk=seen;
 const buildSiteLabels=()=>{};
 const syncURL=()=>{if(!urlHold)writes++};
 const refreshAll=()=>{S.refreshes++;syncURL()};
 const tlFromURL=hash=>{if(hash!=='#incoming')throw Error('lost incoming hash');S.selection=requested&&S.chapter>=3&&(!S.layers||S.layers.has('jud'))?requested:null};
 const addEventListener=(type,fn)=>callback=fn;
 const doAscend=fn=>{S.view='galaxy';if(fn)fn()};
 const descend=()=>{};
 `+chapter+src+'\ncallback();S.writes=writes;',ctx);
 return !!verify(S)&&S.writes===1;
}
for(const [label,src] of [['head',head],['parent',parent]]){
 let passed=0;for(const c of cases){const ok=run(src,c);passed+=ok;console.log((ok?'PASS ':'FAIL ')+label+' '+c[0]);}
 console.log(label+' '+passed+'/'+cases.length);
 assert.equal(passed,label==='head'?8:1);
}
