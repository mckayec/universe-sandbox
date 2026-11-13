// Actual extracted codex functions with mock element state. No browser/server/rendering.
const cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
const base='fe24d334731c1b25c806c2300aa7a23f930babbb',head='47debcfdb86a3e41a023a30e04c6fcd5bd7209b0';
const read=(r,f)=>cp.execFileSync('git',['show',r+':public/atlas/'+f],{encoding:'utf8'});
const plain=x=>JSON.parse(JSON.stringify(x));
function pack(r){const c={window:{}};vm.createContext(c);vm.runInContext(read(r,'packs/lds-standard-works.js'),c);return plain(c.window.ATLAS_PACKS['lds-standard-works']);}
const before=pack(base),after=pack(head),cards=p=>p.codex.flatMap(t=>t.list),old=new Map(cards(before).map(x=>[x.key||x.name,x]));
const changed=cards(after).filter((x,i)=>JSON.stringify(x)!==JSON.stringify(cards(before)[i])).map(x=>x.key);
assert.deepEqual(changed,['BXJ12','SC04.4']);
const replacement='Third Nephi describes families converging from north and south on a region of the land southward that includes the land of Zarahemla and the land between Zarahemla and Bountiful, extending to the line between Bountiful and Desolation, and later returning to their separate lands. The gathering is a region, not a single point.';
const bx=cards(after).find(x=>x.key==='BXJ12');assert.equal(bx.desc,replacement);
const sc=cards(after).find(x=>x.key==='SC04.4');assert.equal(sc.desc,old.get('SC04.4').desc);assert(sc.src.some(s=>s.t==='Mosiah 17:1–3'&&s.u==='https://www.churchofjesuschrist.org/study/scriptures/bofm/mosiah/17?lang=eng'));
const restored=plain(after);for(const t of restored.codex)for(let i=0;i<t.list.length;i++)if(changed.includes(t.list[i].key))t.list[i]=old.get(t.list[i].key);assert.deepEqual(restored,before);
const doc={activeElement:null},els={},globals={};let visible=[];
function el(id){return els[id]||(els[id]={id,innerHTML:'',hidden:false,scrollTop:77,disabled:false,offsetParent:{},events:{},addEventListener(k,fn){this.events[k]=fn;},focus(){doc.activeElement=this;},querySelectorAll(sel){assert(sel.includes('select'));return visible;}});}
const c={window:{},K:after,S:{layers:new Set(['bom']),range:null,book:3,view:'galaxy'},CUM:true,BOOKS:{1:{title:'OT'},2:{title:'NT'},3:{title:'BoM'}},BOOK_IDS:[1,2,3,4,5],nBooksWord:'five',LAY:null,TL:null,TRV:null,document:doc,$:el,ARR:x=>Array.isArray(x)?x:[],EFF:()=>3,bks:()=>'',addEventListener:(k,fn)=>globals[k]=fn,ascend:()=>{throw Error('unexpected ascend');}};
vm.createContext(c);vm.runInContext(read(head,'layers.js'),c);c.LY=c.window.AtlasLayers;
const engine=read(head,'engine.js');vm.runInContext(engine.match(/const esc=[^\n]+/)[0],c);
vm.runInContext(engine.slice(engine.indexOf('let cxTab=K.codex.length'),engine.indexOf('/* ===================== CRUMBS')),c);
for(const tab of after.codex){el('#cxPick').events.change({target:{value:tab.id}});assert.equal(el('#cxBody').scrollTop,0);assert(el('#cxPick').innerHTML.includes('value="'+tab.id+'" selected'));assert(el('#cxTabs').innerHTML.includes('data-tab="'+tab.id+'" aria-pressed="true"'));}
assert.equal((el('#cxPick').innerHTML.match(/<option /g)||[]).length,8);
el('#cxPick').events.change({target:{value:'bom-more'}});assert(el('#cxBody').innerHTML.includes('River Laman'));
c.S.book=2;vm.runInContext('renderCodex()',c);assert(!el('#cxBody').innerHTML.includes('River Laman'));c.S.book=3;c.S.layers=new Set(['nt']);vm.runInContext('renderCodex()',c);assert(!el('#cxBody').innerHTML.includes('River Laman'));c.S.layers=new Set(['bom']);
el('#cxTabs').events.click({target:{closest:()=>({dataset:{tab:'bom-more'}})}});assert(el('#cxPick').innerHTML.includes('value="bom-more" selected'));
const hidden=el('hidden-tab');hidden.offsetParent=null;const disabled=el('disabled');disabled.disabled=true;const select=el('#cxPick'),close=el('#cxClose'),last=el('last-link');visible=[hidden,disabled,select,close,last];
let prevented=0;doc.activeElement=last;el('#codex').events.keydown({key:'Tab',shiftKey:false,preventDefault(){prevented++;}});assert.equal(doc.activeElement,select);
doc.activeElement=select;el('#codex').events.keydown({key:'Tab',shiftKey:true,preventDefault(){prevented++;}});assert.equal(doc.activeElement,last);assert.equal(prevented,2);
el('#cxBtn').events.click();assert.equal(doc.activeElement,close);assert.equal(el('#codex').hidden,false);globals.keydown({key:'Escape'});assert.equal(el('#codex').hidden,true);assert.equal(doc.activeElement,el('#cxBtn'));
const css=read(head,'engine.css');assert(css.includes('@media (max-width:600px)'));assert(css.includes('.cx-tabs{display:none}'));assert(css.includes('.cx-pick{display:none}'));assert(css.includes('min-height:44px'));
console.log(JSON.stringify({head,base,changedCards:changed,totalCards:321,unchangedCards:319,newCards:0,S1C1:'closed exact replacement',SC04_4:'citation added; copy unchanged',sectionsExercised:8,chooserAndButtonsSynchronized:true,sourceLayerBookFilteringPreserved:true,mockForwardAndReverseWrap:'pass',mockEscapeFocusReturn:'pass',cssBreakpoint:600,limit:'Mock state/source checks only; native select, CSS layout and real keyboard behavior unverified'},null,2));
