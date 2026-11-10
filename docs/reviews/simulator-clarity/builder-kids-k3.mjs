import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {stripTypeScriptTypes} from 'node:module';
const root=process.env.SIM_REVIEW_ROOT||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const kids=read('src/ui/kids.ts'),pointer=read('src/ui/pointer.ts'),controls=read('src/ui/controls.ts');
const pure=await import(pathToFileURL(path.resolve(root,'src/kids-mode.ts')));
function body(source,marker){
 const start=source.indexOf(marker);if(start<0)throw Error('missing '+marker);
 const open=source.indexOf('{',start+marker.length);let depth=1,end=open+1;
 while(depth&&end<source.length){if(source[end]==='{')depth++;if(source[end]==='}')depth--;end++;}
 if(depth)throw Error('unclosed '+marker);return source.slice(open+1,end-1);
}
const results=[];
const element=()=>({classList:{toggle(){},add(){},remove(){}},hidden:true,setAttribute(){},querySelector:()=>({}),textContent:''});
for(const mode of ['normal','escape','disarm','cancel','escape-rearm']){
 let placed=0;
 const app={kidsMode:true,kidsArmed:true,placementMode:true,placementEpoch:0,pendingTouchPlacement:{pointerId:7,epoch:0},selectedBuilder:'body',touchGesture:null,longPressTimer:0};
 const c=vm.createContext({app,activePointers:new Map([[7,{}]]),dialog:{hidden:true},renderer:{domElement:{hasPointerCapture:()=>false}},world:{clone:()=>({})},document:{querySelector:element},container:element(),
 setPointer(){},placeSelected(){placed++;},clearGuides(){},liveDragBody:()=>null,syncKidsBar(){},clearTimeout,...pure});
 let code='';
 for(const [src,marker,name,args] of [
 [controls,'export function setInteractionMode(add: boolean)','setInteractionMode','add'],
 [kids,'function setArmed(armed: boolean)','setArmed','armed'],
 [kids,'export function kidsPlacementDone()','kidsPlacementDone',''],
 [kids,"document.addEventListener('keydown', e =>",'onEscape','e'],
 [pointer,"addEventListener('pointerup', e =>",'onUp','e'],
 [pointer,"addEventListener('pointercancel', e =>",'onCancel','e']]){
 code+='function '+name+'('+args+'){'+body(src,marker)+'}\n';}
 for(const [src,marker,name] of [[controls,'export function cancelPendingPlacement()','cancelPendingPlacement'],[pointer,'function placementGate()','placementGate']]){
 if(src.includes(marker))code+='function '+name+'(){'+body(src,marker)+'}\n';}
 vm.runInContext(stripTypeScriptTypes(code),c);
 if(mode.startsWith('escape'))vm.runInContext('onEscape({key:"Escape"})',c);
 if(mode==='disarm')vm.runInContext('setArmed(false)',c);
 if(mode==='cancel')vm.runInContext('onCancel({pointerId:7})',c);
 if(mode==='escape-rearm')vm.runInContext('setArmed(true)',c);
 vm.runInContext('onUp({pointerType:"touch",pointerId:7})',c);
 const expected=mode==='normal'?1:0;
 results.push({id:'held-touch-'+mode,expected,actual:placed,armedAfter:app.kidsArmed,pass:placed===expected&&(mode!=='escape-rearm'||app.kidsArmed)});
}
// The actual capture handlers must bind authorization to the click's own pointer, not a different latest press.
class ElementAdapter{
 constructor(region){this.region=region;}
 closest(selector){if(selector==='canvas')return this.region==='canvas'?this:null;if(selector.includes('#kids-dialog'))return this.region==='kids-dialog'?{id:'kids-dialog'}:null;return this.region==='kids-dialog'?this:null;}
}
const cases=[
 ['canvas press released over dialog',[['down','canvas',7],['up',7]],7,1,true],
 ['dialog press and click',[['down','kids-dialog',8],['up',8]],8,1,false],
 ['keyboard activation',[],-1,0,false],
 ['canvas pointer 7 after dialog pointer 8 press (reviewer, no up)',[['down','canvas',7],['down','kids-dialog',8]],7,1,true],
 ['dialog pointer 7 after canvas pointer 8 press (reviewer, no up)',[['down','kids-dialog',7],['down','canvas',8]],7,1,false],
 ['canvas 7 held, dialog 8 down, 7 up then click',[['down','canvas',7],['down','kids-dialog',8],['up',7]],7,1,true],
 ['dialog 7, canvas 8 down, 7 up then click',[['down','kids-dialog',7],['down','canvas',8],['up',7]],7,1,false],
 ['dialog 7 canceled',[['down','kids-dialog',7],['cancel',7]],7,1,true],
 ['dialog 7 down before dialog reopened',[['down','kids-dialog',7],['reset'],['up',7]],7,1,true],
 ['reused id: dialog press then canvas press',[['down','kids-dialog',1],['up',1],['down','canvas',1],['up',1]],1,1,true],
 ['click with no pointer id after dialog release',[['down','kids-dialog',3],['up',3]],undefined,1,false],
 ['click with no pointer id after canvas release',[['down','kids-dialog',3],['down','canvas',4],['up',4]],undefined,1,true],
 ['second click from consumed authorization',[['down','kids-dialog',5],['up',5],['click',5]],5,1,true],
];
for(const [id,steps,clickId,detail,expectedBlocked] of cases){
 const c=vm.createContext({app:{kidsMode:true,kidsDialogPresses:pure.newDialogPresses()},Element:ElementAdapter,...pure});
 const fn=(m,n,a)=>kids.includes(m)?'function '+n+'('+a+'){'+body(kids,m)+'}\n':'';
 let code='function regionOf(target){'+body(kids,'function regionOf(target: EventTarget | null)')+'}\nfunction gate(e){'+body(kids,'function gate(e: Event)')+'}\n'+fn('function notePress(e: PointerEvent)','notePress','e')+fn('function noteRelease(e: PointerEvent)','noteRelease','e')+fn('function noteCancel(e: PointerEvent)','noteCancel','e');
 vm.runInContext(stripTypeScriptTypes(code),c);
 const trace=[];
 for(const st of steps){
  if(st[0]==='down'){c.e={target:new ElementAdapter(st[1]),pointerId:st[2]};vm.runInContext('notePress(e)',c);}
  if(st[0]==='up'){c.e={pointerId:st[1]};vm.runInContext('noteRelease(e)',c);}
  if(st[0]==='cancel'){c.e={pointerId:st[1]};vm.runInContext('noteCancel(e)',c);}
  if(st[0]==='reset')pure.resetDialogPresses(c.app.kidsDialogPresses);
  if(st[0]==='click'){c.e={type:'click',target:new ElementAdapter('kids-dialog'),pointerId:st[1],detail:1,preventDefault(){},stopImmediatePropagation(){}};vm.runInContext('gate(e)',c);}
  trace.push(st.join(':'));
 }
 let prevented=false,stopped=false;
 c.e={type:'click',target:new ElementAdapter('kids-dialog'),pointerId:clickId,detail,preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}};
 vm.runInContext('gate(e)',c);
 const actualBlocked=prevented&&stopped;
 results.push({id:'dialog-'+id,trace:trace.join(' '),click:{pointerId:clickId??null,detail},expectedBlocked,actualBlocked,pass:actualBlocked===expectedBlocked});
}
const inputs=['src/ui/kids.ts','src/ui/pointer.ts','src/ui/controls.ts','src/kids-mode.ts'].map(p=>{const b=fs.readFileSync(path.join(root,p));return {path:p,sha:crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')};});
console.log(JSON.stringify({head:process.env.SIM_REVIEW_HEAD||'unspecified',scope:'Builder adaptation of reviewer-kids-a50f1aa.mjs for the per-pointer state shape: actual handlers (notePress/noteRelease/noteCancel/gate) and helper; DOM adapters, not browser',inputs,passed:results.filter(x=>x.pass).length,total:results.length,results},null,2));
process.exitCode=results.some(x=>!x.pass)?1:0;
